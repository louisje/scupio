// Scupio TV

var log = function(text, remote) {

    if (remote)
        nn.log('[::] ' + text);
    else
        nn.log(text);

    if (remote) {
        $('#lcd_screen').text(text);
    }
};

// TODO: analytics
// TODO: nextTube more faster
// TODO: focus
// TODO: lcd
// TODO: merge 'power' and 'next' button

var KEY = {
	'ENTER': 13,
	'-':     189,
	'0':     48,
	'9':     57,
	'=':     187,
	'[':     91,
	']':     93,
	'p':     112,
	'{':     123,
	'}':     125
};

var YT = {
	'UNSTART':   -1,
	'ENDED':     0,
	'PLAYING':   1,
	'PAUSED':    2,
	'BUFFERING': 3,
	'CUED':      5
};

var blank$ = {
	show: function(text) {
		if (text) {
			$('#blank_screen').html('<div><h2>' + text + '</h2></div>');
		} else {
			$('#blank_screen').html('');
		}
		if (!$('#blank_screen').is(':visible')) {
			$('#blank_screen').show('fade');
		}
	},
	setBackground: function(thumbnail) {
		
		this.celebrate();
		
		if (thumbnail) {
			$('#blank_screen')
			  .css('background-image',    'url(' + thumbnail + ')')
			  .css('background-repeat',   'no-repeat')
			  .css('background-position', 'center')
			  .css('background-position', 'middle')
			  .html('');
		} else {
			$('#blank_screen').css('background-image', 'url()');
		}
	},
	hide: function(duration) {
		if ($('#blank_screen').is(':visible')) {
			if (duration) {
				$('#blank_screen').hide('fade', duration);
			} else {
				$('#blank_screen').hide('fade');
			}
		}
	},
	celebrate: function() {
		
		var pos = $('#ytplayer_holder').offset();
		var width = $('#ytplayer_holder').width();
		var height = $('#ytplayer_holder').height();
		
		$('#blank_screen')
		  .css('top', pos.top)
		  .css('left', pos.left)
		  .height(height)
		  .width(width);
	},
	init: function() {
		
		this.setBackground('tv.jpg');
		this.show('電源己關閉');
		
		$('#blank_screen').click(function() {
			if (y$.player) {
				var state = y$.player.getPlayerState();
				if (state == YT['ENDED']) {
					$('#btn_next').click();
				} else {
					var event = $.Event('keypress');
					event.which = KEY['p'];
					$(this).trigger(event);
				}
			}
		});
	}
};

var y$ = {
	
	// tube source
	tubes:           [ /* { 'seq': 0, 'id': 'xxXXXyyy', 'duration': 123, 'title': 'AAAABBBB' }, ... */ ],
	//bloggers:        [ 'ttvnewsview', 'ctitv', 'TBSCTS', 'FTVCP', 'TVBS', 'newsebc', 'gorgeousspace' ],
	curator:         'louisje',
	
	// data
	seq:             1,
	queued:          [ /* { 'id': 'xxXXXyyy', 'duration': 123, 'title': 'AAAABBBB' }, ... */ ],
	watched:         [ ],
	watchedTubes:    [ ],
	now:             null, // time of power-on
	player:          null,
	currentVideoId:  null,
	currentTube:     { title: '', thumbnail: '', id: '', count: 0, duration: 0, fresh: true },
	preloaded:       { title: '', thubmnail: '', id: '', count: 0, duration: 0, player: null },
	volume:          50,
	bloggerUrl:      'http://gdata.youtube.com/feeds/api/users/%s/uploads?v=2&alt=json-in-script&max-results=50',
	
	// status
	timerStart:      0,
	buffering:       0,
	initializing:    false,
	poweroff:        true,
	gonextgo:        false,
	
	// config
    debug:           false,
	preload:         true,
	seekFactor:      10,
	minSeek:         10,
	maxSeek:         300,
	maxVideos:       25,
	maxTubes:        15,
	minTubes:        13,
	maxWatchedTubes: 200,
	maxWatched:      200,
	keepTubes:       30,          // days to keep watched tubes to stay watched
	keepVideos:      7,           // days to keep watched video to stay watched
	bufferThreshold: 15  * 1000,  // micro second
	
	getTime: function() {
		return (new Date()).getTime();
	},
	getCurrentVideoId: function() {
		if (y$.player) {
			return y$.player.getVideoUrl().match(/v=([^&]+)/)[1];
		}
		return null;
	},
	setTubeWatched: function(tubeId) {
		
		if ($.inArray(tubeId, y$.watchedTubes) == -1 && !tubeId.match(/^http:\/\//)) {
			y$.watchedTubes.push(tubeId);
			if (y$.watchedTubes.length > y$.maxWatchedTubes) {
				y$.watchedTubes.shift();
			}
			$.cookie('watched_tubes', y$.watchedTubes.join(','), { expires: y$.keepTubes });
			$.cookie(tubeId, ''); // to forget last watch
		}
		var newTubes = [ ];
		while (y$.tubes.length > 0) {
			var shift = y$.tubes.shift();
			if (shift.id != tubeId)
				newTubes.push(shift);
		}
		y$.tubes = newTubes;
		if (y$.tubes.length < y$.minTubes) {
			log('fetch more tubes');
			y$.fetchTubeList(y$.curator);
		}
		log('set tube to watched: ' + tubeId);
	},
	setVideoWatched: function(videoId) {
		
		if ($.inArray(videoId, y$.watched) == -1) {
			y$.watched.push(videoId);
			if (y$.watched.length > y$.maxWatched) {
				y$.watched.shift();
			}
			$.cookie('watched', y$.watched.join(','), { expires: y$.keepVideos });
			log('set to watched: ' + videoId);
		}
	},
	setVolume: function(volume) {
		if (volume > 100) {
			volume = 100;
		} else if (volume < 0) {
			volume = 0;
		}
		y$.volume = volume;
		$.cookie('volume', volume, { expires: 30 });
		if (y$.player) {
			y$.player.setVolume(volume);
		}
		log('聲音大小：' + volume, true);
	},
	saveCurrentTubePosition: function() {
		
		if (!y$.player || !y$.timerStart) {
			return;
		}
		
		var duration = (y$.getTime() - y$.timerStart) / 1000;
		
		log('watched duration: '   + duration);
		log('video count: '        + y$.currentTube.count);
		log('tube duration: '      + y$.currentTube.duration);
		
		log(y$.currentTube);
		var start = y$.player.getPlaylistIndex();
		var offset = parseInt(y$.player.getCurrentTime());
		if (y$.currentTube.id != '') {
			var tubeId = y$.currentTube.id;
			var value = start + '.' + offset;
			log('save current tube position ' + value);
			$.cookie(tubeId, value, { expires: 30 });
		}
	},
	jumpToWatchPoint: function(last, player) {
		log('jump to watch point ' + last);
		var point = last.split('.');
		log('play ' + point[0] + ' at ' + point[1] + ' second');
		if (player) {
			player.playVideoAt(point[0]);
			player.seekTo(point[1]);
		} else {
			y$.player.playVideoAt(point[0]);
			y$.player.seekTo(point[1]);
		}
	},
	onCue: function() {
		
		if (!y$.preload) {
			if (y$.gonextgo) {
				log('[>>] auto forwarding');
				y$.gonextgo = false;
				y$.nextTube();
				return;
			}
		}
		
		nn.log('onCue()');
		y$.player.setVolume(y$.volume);
		y$.player.unMute();
		y$.player.playVideo();
	},
	onPlayerReady: function(player) {
		
		y$.initializing = false;
		
		if (y$.preload) {
			
            /** HTML5 seems not well support jump

                var last = $.cookie(y$.preloaded.id);
                if (last) {
                    y$.jumpToWatchPoint(last, player);
                }
            */
			player.mute();
            player.preloading = true;
			player.addEventListener('onStateChange', function(event) {
                if (event.data == YT['PLAYING'] && event.target.preloading) {
                    event.target.pauseVideo();
                    nn.log('preload video paused');
                }
            });
			
			log('preload player is ready');
			y$.preloaded.player = player;
			
			if (y$.gonextgo || !y$.player) {
				log('[>>] auto forwarding (preload)');
				y$.gonextgo = false;
				y$.nextTube();
			}
			
		} else {
			
			y$.player = player;
			y$.player.addEventListener('onPlaybackQualityChange', y$.onPlaybackQualityChange);
			y$.player.addEventListener('onStateChange', y$.onStateChange);
			y$.player.addEventListener('onError', y$.onError);
			
            /** HTML5 seems not well support jump

			var last = $.cookie(y$.currentTube.id);
			if (last) {
				y$.jumpToWatchPoint(last);
			}
            */
			
			log('player is ready');
			y$.onCue();
		}
	},
	onPlaybackQualityChange: function(event) {
		log('playback quality changed: ' + event.data);
	},
	onStateChange: function(event) {

		switch(event.data) {
			
			case YT['UNSTART']:
			//log('unstart');
			y$.buffering = 0;
			break;
			
			case YT['ENDED']:
			log('ended');
			blank$.show('本台播放完畢');
			y$.setTubeWatched(y$.currentTube.id);
			y$.now = parseInt((new Date()).getTime() / 1000);
			break;
			
			case YT['PLAYING']:
			var videoId = y$.getCurrentVideoId();
			if (videoId != y$.currentVideoId) {
				y$.currentVideoId = videoId;
				var url = 'http://gdata.youtube.com/feeds/api/videos/' + videoId + '?v=2&alt=json-in-script&callback=?';
				$.get(url, function(data) { log('video title: ' + data.entry.title.$t); }, 'json');
				if (y$.currentTube.fresh) {
					y$.currentTube.fresh = false;
					var interval = y$.getTime() - y$.timerStart;
					y$.timerStart = y$.getTime();
					log('interval between switching channels = ' + interval + ' ms');
				}
				y$.setVideoWatched(videoId);
			}
			blank$.hide('slow');
			break;
			
			case YT['PAUSED']:
			y$.saveCurrentTubePosition();
			log('... paused');
			break;
			
			case YT['BUFFERING']:
			if (y$.buffering > 1) {
				log('... buffering');
			}
			break;
			
			case YT['CUED']:
			log('... cued');
			y$.initializing = false;
			if (!y$.preload && !y$.poweroff) {
				y$.onCue();
			}
			break;
			
			default:
			log('unknown state: ' + event.data);
		}
	},
	onError: function(event) {
		log('error code = ' + event.data);
		
		switch(event.data) {

			case 150:
			y$.setVideoWatched(y$.getCurrentVideoId());
			blank$.show('本片因為含有版權內容，被版權擁有者封鎖').delay(1500);
			y$.player.nextVideo();
			break;
			
			default:
            if (!y$.preload) {
                //y$.player.destroy();
                y$.player = null;
                y$.initializing = false;
            }
		}
	},
	onTubeListFetched: function(feed) {
		if (y$.tubes.length < y$.maxTubes && feed.link.length > 0) {
			for (var i = 0; i < feed.link.length; i++) {
				var link = feed.link[i];
				if (link.rel == 'next') {
					//log('next = ' + link.href);
					return y$.fetchTubeList(link.href, true);
				}
			}
		}
		log('fetched tube = ' + y$.tubes.length)
		
		y$.initializing = false;
		
		if (!y$.player) {
			y$.nextTube();
		}
	},
	onEntryListFetched: function(feed) {
		if (y$.queued.length < y$.maxVideos && feed.link.length > 0) {
			for (var i = 0; i < feed.link.length; i++) {
				var link = feed.link[i];
				if (link.rel == 'next') {
					return y$.fetchEntryList(link.href, true);
				}
			}
		}
		
		log(feed);
		log('entry list fetched');
		
		var thumbnail = (feed.media$group && feed.media$group.media$thumbnail) ? feed.media$group.media$thumbnail[1].url : feed.entry[0].media$group.media$thumbnail[1].url;
		
		for (var i = 0; i < feed.link.length; i++) {
			if (feed.link[i].rel == 'alternate') {
				log('tube alternate = ' + feed.link[i].href);
			}
		}
		
		if (feed.media$group) {
			var content = feed.media$group.media$content;
			if (content) {
				for (var i = 0; i < content.length; i++) {
					if (content[i].yt$format == 5) {
						log('tube url = ' + content[i].url);
					}
				}
			}
		}
		
		var duration = 0;
		for (var i = 0; i < y$.queued.length; i++) {
			duration += parseInt(y$.queued[i].duration);
		}
		log('video count = ' + y$.queued.length);
		log('tube duration = ' + duration);
		
		if (y$.preload) {
			
			y$.preloaded.thumbnail = thumbnail;
			y$.preloaded.title     = feed.title.$t;
			y$.preloaded.id        = (feed.yt$playlistId) ? feed.yt$playlistId.$t : '';
			y$.preloaded.count     = y$.queued.length;
			y$.preloaded.duration  = duration;
			
		} else {
			
			y$.currentTube.thumbnail = thumbnail;
			y$.currentTube.title     = feed.title.$t;
			y$.currentTube.id        = (feed.yt$playlistId) ? feed.yt$playlistId.$t : '';
			y$.currentTube.count     = y$.queued.length;
			y$.currentTube.duration  = duration;
			y$.currentTube.fresh     = true;
			
			log(feed.title.$t, true);
			blank$.setBackground(thumbnail);
			//blank$.show();
		}
		
		if (feed.yt$playlistId) {
			y$.cuePlaylist(feed.yt$playlistId.$t);
		} else {
			y$.cuePlaylist();
		}
		
	},
	cuePlaylist: function(tube) {
		
		if (y$.queued.length == 0) {
			
			if (y$.preload) {
				y$.setTubeWatched(y$.preloaded.id);
			} else {
				y$.setTubeWatched(y$.currentTube.id);
			}
			
			y$.initializing = false;
			
			log('this tube has no videos!');
			
			return y$.nextTube();
			
		} else {
			
			log('play list count = ' + y$.queued.length);
		}
		
		if (y$.player && !y$.preload) {
			
            y$.initializing = false;
			if (tube) {
				var last = $.cookie(tube);
				if (last) {
					var cue = last.split('.');
					log('last watch: ' + last);
					y$.player.cuePlaylist({
                        index:            cue[0],
                        startSeconds:     cue[1],
                        list:             tube
                    });
				} else {
					y$.player.cuePlaylist({
                        list:             tube
                    });
				}
			} else {
				y$.player.cuePlaylist(y$.queued);
			}
			
		} else {
			
            log('initial a new player');

            var lead = y$.queued.shift().id;
            var rests = [ ]; //y$.queued.join(',');
            for (var i = 0; i < y$.queued.length; i++) {
                rests.push(y$.queued[i].id);
            }
            
            var holder = 'ytplayer';
            if (y$.preload) {

                holder = 'ytpreload';

            } else {

                $('#ytplayer').remove();
                //$('#ytpreload').attr('id', 'ytplayer');
                $('<div id="ytplayer"></div>').appendTo('#ytplayer_holder');
            }
            
            var player = new YT.Player(holder, {
                height:  450,
                width:   800,
                videoId: lead,
                playerVars: {
                    theme:      'dark',
                    color:      'white',
                    autohide:   1,
                    fullscreen: 1,
                    autoplay:   y$.preload ? 1 : 0,
                    rel:        y$.debug ? 1 : 0,
                    showinfo:   y$.debug ? 1 : 0,
                    controls:   y$.debug ? 1 : 0,
                    playlist:   rests.join(',')
                },
                events: {
                    onReady: onPlayerReady
                }
            });
		}
	},
	fetchTubeList: function(curator, isUrl) {
		var source = 'http://gdata.youtube.com/feeds/api/users/' + curator + '/playlists?v=2&alt=json-in-script&max-results=50&callback=?';
		if (isUrl) {
			source = curator + '&callback=?';
		}
		$.get(source, function(data) {
			//log(data);
			var feed = data.feed;
			var entries = feed.entry;
			for (var i = 0; i < entries.length && y$.tubes.length < y$.maxTubes; i++) {
				var tube = {
					'id':       entries[i].yt$playlistId.$t,
					'duration': entries[i].media$group.yt$duration.seconds,
					'title':    entries[i].title.$t,
					'count':    entries[i].yt$countHint.$t
				};
				if ($.inArray(tube.id, y$.watchedTubes) == -1 && $.inArray(tube.id, y$.tubes) == -1) {
					tube.seq = y$.seq++;
					log(tube.seq + ' ' + tube.title);
					log(tube);
					y$.tubes.push(tube);
				}
			}
			
			y$.onTubeListFetched(feed);
			
		}, 'json');
	},
	fetchEntryList: function(tube, isUrl) {
		var url = 'http://gdata.youtube.com/feeds/api/playlists/' + tube + '?v=2&alt=json-in-script&max-results=50&callback=?';
		if (isUrl) {
			url = tube + '&callback=?';
		}
		
		$.get(url, function(data) {
			
			var feed = data.feed;
			var entries = feed.entry;
			//log(data);
			
			for (var i = 0; i < entries.length && y$.queued.length < y$.maxVideos; i++) {
                var duration = typeof entries[i].media$group.yt$duration == 'undefined' ? 0 : entries[i].media$group.yt$duration.seconds;
				var video = {
					'id':       entries[i].media$group.yt$videoid.$t,
					'duration': duration,
					'title':    entries[i].title.$t
				};
				y$.queued.push(video);
			}
			
			y$.onEntryListFetched(feed);
			
		}, 'json');
	},
	nextTube: function() {
		
		if (y$.initializing) {
			log('Ooops!');
			return;
		}
		
		y$.saveCurrentTubePosition();
		
		y$.timerStart = y$.getTime();
		
		if (y$.preload && y$.preloaded.player) {
            // switch preload to player
            log('swtich to preloaded player');
            log(y$.preloaded.title, true);
            blank$.setBackground(y$.preloaded.thumbnail);
            
            $('#ytplayer').remove();
            $('#ytpreload').attr('id', 'ytplayer');
            $('<div id="ytpreload"></div>').appendTo('#ytplayer_holder');

            y$.player = y$.preloaded.player;
            y$.player.preloading = false;
            y$.preloaded.player = null;
            y$.currentTube.thumbnail = y$.preloaded.thumbnail;
            y$.currentTube.title     = y$.preloaded.title;
            y$.currentTube.id        = y$.preloaded.id;
            y$.currentTube.count     = y$.preloaded.count;
            y$.currentTube.duration  = y$.preloaded.duration;
            y$.currentTube.fresh     = true;
            
            y$.player.addEventListener('onPlaybackQualityChange', y$.onPlaybackQualityChange);
            y$.player.addEventListener('onStateChange', y$.onStateChange);
            y$.player.addEventListener('onError', y$.onError);
            
            y$.onCue();
        }
		
		y$.initializing = true;
		
		if (!y$.tubes.length) {
			log('no tube!');
			y$.initializing = false;
			return;
		}
		var tube = y$.tubes.shift();
		log('tube id = ' + tube.id);
		y$.tubes.push(tube);
		y$.queued = [ ];
		if (tube.id.match(/^http:\/\//)) {
			y$.fetchEntryList(tube.id, true);
		} else {
			y$.fetchEntryList(tube.id);
		}
	},
	init: function() {
		
		y$.initializing = true;
		
		blank$.show('電源開啟中');
		
		// load watched list from cookie
		var watchedList = $.cookie('watched');
		if (watchedList) {
			y$.watched = watchedList.split(',');
		}
		log('watched list count = ' + y$.watched.length);
		
		var watchedTubes = $.cookie('watched_tubes');
		if (watchedTubes) {
			y$.watchedTubes = watchedTubes.split(',');
		}
		log('watched tubes count = ' + y$.watchedTubes.length);
		
		var volume = $.cookie('volume');
		if (volume) {
			y$.setVolume(volume);
		}
		
		y$.now = parseInt((new Date()).getTime() / 1000);
		
		y$.fetchTubeList(y$.curator);
	}
};

var onYouTubePlayerReady = function(payload) {
	
	log('flash is ready: ' + payload);
	
	var player = $('#' + (y$.preload ? 'ytpreload' : 'ytplayer')).get(0);
	
	y$.onPlayerReady(player);
};
var youtubeDeferred = null;
var onYouTubeIframeAPIReady = function() {
    nn.log('YouTube Iframe API is ready');
    if (ytDeferred != null && typeof YT == 'object') {

        ytDeferred.resolve();
    }
}
var onPlayerReady = function(event) {
    nn.log('onPlayerReady');
    y$.onPlayerReady(event.target);
};

var cast = null;

nn.init(function($) {

    ytDeferred = $.Deferred();

    nn.when([

        ytDeferred
        , nn.load([ 'http://www.youtube.com/iframe_api' ])
        , nn.load([ 'https://www.gstatic.com/cast/js/receiver/1.0/cast_receiver.js' ])
        , nn.load([
            'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/themes/ui-darkness/jquery-ui.css',
            'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.js',
            null
        ])
        , nn.load([
            '/louis/scupio/style.css',
            '/louis/scupio/webtoolkit.sprintf.js',
            '/louis/scupio/jquery.cookie.js',
            '/louis/scupio/swfobject.js',
            null
        ])

    ]).then(function() {

        cast = window.cast || { };
        nn.log('cast');

    }).then(function() { // UI

        $('button').button();
        $('#btn_power').button({
            'icons': {
                'primary': 'ui-icon-power'
            },
            'text': false
        });
        $('#btn_mute').button({
            'icons': {
                'primary': 'ui-icon-volume-off'
            },
            'text': false
        });

        $('#btn_next').click(function() {
            
            if (y$.initializing && y$.gonextgo) {
                log('calmdown man');
            } else if (y$.initializing) {
                y$.gonextgo = true;
            } else {
                log('[->] user change tube');
                y$.gonextgo = false;
                y$.nextTube();
            }
        });
        
        $('#btn_next').mousedown(function() {
            if (y$.player) {
                var timeoutId = setTimeout(function() {
                    if ($('#btn_next').is('.ui-state-active')) {
                        // long hold
                    }
                }, 1000);
                $('#btn_next').one('mouseup', function() {
                    clearTimeout(timeoutId);
                });
            }
        });
        
        $('#btn_power').mousedown(function() {
            var timeoutId = setTimeout(function() {
                if ($('#btn_power').is('.ui-state-active')) {
                        // long hold
                }
            }, 1000);
            $('#btn_power').one('mouseup', function() {
                clearTimeout(timeoutId);
            });
        });
        
        $('#btn_mute').click(function() {
            if (y$.player) {
                if (y$.player.isMuted()) {
                    y$.player.unMute();
                    log('靜音己取消', true);
                } else {
                    y$.player.mute();
                    log('靜音', true);
                }
            }
        });
        
        $('#btn_louder').click(function() {
            y$.setVolume(parseInt(y$.volume) + 5);
        });
        
        $('#btn_lower').click(function() {
            y$.setVolume(parseInt(y$.volume) - 5);
        });
        
        $('#btn_power').click(function() {
            if (y$.poweroff) {
                y$.poweroff = false;
                y$.init();
            } else if (y$.initializing) {
                log('still initializing');
            } else {
                
                y$.tubes = [ ];
                y$.poweroff = true;
                
                y$.saveCurrentTubePosition();
                
                if (y$.player) {
                    y$.player.destroy();
                    y$.player = null;
                }
                if (y$.preloaded.player) {
                    y$.preloaded.player.destroy();
                    y$.preloaded.player = null;
                }
                
                blank$.setBackground('tv.jpg');
                blank$.show('電源已關閉');
                
                $('#blank_screen').unbind();
            }
        });

        $(document).keyup(function(event) {
            var which = event.which;
            switch(which) {
                case KEY['9']:
                if ($('#btn_power').is('.ui-state-active')) {
                    $('#btn_power').click();
                }
                $('#btn_power').mouseup();
                break;
                
                case KEY['ENTER']:
                if ($('#btn_next').is('.ui-state-active')) {
                    $('#btn_next').click();
                }
                $('#btn_next').mouseup();
                break;
                
                case KEY['0']:
                if ($('#btn_mute').is('.ui-state-active')) {
                    $('#btn_mute').click();
                }
                $('#btn_mute').mouseup();
                break;
                
                case KEY['-']:
                case 109: // firefox
                if ($('#btn_lower').is('.ui-state-active')) {
                    $('#btn_lower').click();
                }
                $('#btn_lower').mouseup();
                break;
                
                case KEY['=']:
                case 61:
                if ($('#btn_louder').is('.ui-state-active')) {
                    $('#btn_louder').click();
                }
                $('#btn_louder').mouseup();
                break;
                
                default:
            }
        });
        
        var keyLB = false;
        var keyRB = false;
        
        $(document).keydown(function(event) {
            var which = event.which;
            switch(which) {
                case KEY['9']:
                if (!$('#btn_power').is('.ui-state-active')) {
                    $('#btn_power').mousedown();
                }
                break;
                
                case KEY['ENTER']:
                if (!$('#btn_next').is('.ui-state-active')) {
                    $('#btn_next').mousedown();
                }
                break;
                
                case KEY['0']:
                if (!$('#btn_mute').is('.ui-state-active')) {
                    $('#btn_mute').mousedown();
                }
                break;
                
                case KEY['-']:
                case 109: // firefox
                if (!$('#btn_lower').is('.ui-state-active')) {
                    $('#btn_lower').mousedown();
                }
                break;
                
                case KEY['=']:
                case 61:
                if (!$('#btn_louder').is('.ui-state-active')) {
                    $('#btn_louder').mousedown();
                }
                break;
                
                case 219: // '[' chrome
                if (!keyLB && y$.player) {
                    keyLB = true;
                    var timeoutId = setTimeout(function() {
                        y$.player.previousVideo();
                        timeoutId = null;
                    }, 1000);
                    $(document).one('keyup', function(event) {
                        if (event.which == 219) {
                            if (timeoutId) {
                                clearTimeout(timeoutId);
                                var seek = parseInt(y$.player.getDuration() / y$.seekFactor);
                                if (seek < y$.minSeek) {
                                    seek = y$.minSeek;
                                } else if (seek > y$.maxSeek) {
                                    seek = y$.maxSeek;
                                }
                                var currentTime = y$.player.getCurrentTime();
                                log('seek backward ' + seek + ' seconds');
                                y$.player.seekTo(currentTime - seek);
                            }
                            keyLB = false;
                        }
                    });
                }
                break;
                
                case 221: // ']' chrome
                if (!keyRB && y$.player) {
                    keyRB = true;
                    var timeoutId = setTimeout(function() {
                        y$.player.nextVideo();
                        timeoutId = null;
                    }, 1000);
                    $(document).one('keyup', function(event) {
                        if (event.which == 221) {
                            if (timeoutId) {
                                clearTimeout(timeoutId);
                                var seek = parseInt(y$.player.getDuration() / y$.seekFactor);
                                if (seek < y$.minSeek) {
                                    seek = y$.minSeek;
                                } else if (seek > y$.maxSeek) {
                                    seek = y$.maxSeek;
                                }
                                var currentTime = y$.player.getCurrentTime();
                                log('seek forward ' + seek + ' seconds');
                                y$.player.seekTo(currentTime + seek);
                            }
                            keyRB = false;
                        }
                    });
                }
                break;
                
                case 80: // 'p' chrome
                break;
                
                default:
                log('keydown: ' + which);
            }
        });
        
        $(document).keypress(function(event) {
            var which = event.which;
            switch(which) {
                case KEY['p']:
                if (y$.player) {
                    var player = y$.player;
                    var state = player.getPlayerState();
                    switch(state) {
                        case YT['PLAYING']:
                        player.pauseVideo();
                        break;
                        
                        case YT['UNSTART']:
                        case YT['PAUSED']:
                        case YT['CUED']:
                        player.playVideo();
                        break;
                        
                        default:
                    }
                }
                break;
                
                case 61: // '=' chrome keypress
                break;
                
                case 45: // '-' chrome keypress
                break;
                
                case KEY['0']:
                break;
                
                case KEY['ENTER']:
                break;
                
                case KEY['9']:
                break;
                
                case KEY[']']:
                break;
                
                case KEY['[']:
                break;
                
                default:
                log('key pressed: ' + which);
            }
        });

    }).then(main);

});

var main = function() {

    nn.log('main()');

	blank$.init();

    var castChannelHandler = new cast.receiverChannelHandler('Scupio');

    castChannelHandler.addEventListener(
        cast.receiver.Channel.EventType.MESSAGE,
        function(event) {
            nn.log('MESSAGE');
            nn.log(event);
        });
	
    castChannelHandler.addEventListener(
        cast.receiver.Channel.EventType.OPEN,
        function(event) {
            nn.log('OPEN');
            nn.log(event);
        });

    castChannelHandler.addEventListener(
        cast.receiver.Channel.EventType.CLOSE,
        function(event) {
            nn.log('CLOSE');
            nn.log(event);
        });

    setTimeout(function() {
        $('#btn_power').click();
    }, 3000);
    
};
