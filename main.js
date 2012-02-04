
var log = function(text, remote) {
	if (window.console && console.log) {
		if (remote)
			console.log('[::] ' + text);
		else
			console.log(text);
	}
	if (remote) {
		$('#lcd_screen').text(text);
	}
};

var scupio = {
	categories: {
		'1': '新聞時事',
		'2': '房事租屋',
		'3': '汽車資訊',
		'4': '財金理財',
		'5': '工作職場',
		'6': '流行時尚',
		'7': '美妝保養',
		'8': '親子教育',
		'9': '旅遊玩樂',
		'10': '美食天地',
		'11': '休閒生活',
		'12': '體育運動',
		'13': '健康醫療',
		'14': '素食樂活',
		'15': '手機通訊',
		'16': '電腦資訊',
		'17': '軟體應用',
		'18': '攝影寫真',
		'19': '影視音樂',
		'20': '星座運勢',
		'21': '交友聯誼',
		'22': '藝文動漫',
		'23': '電玩遊戲',
		'24': '好康購物',
		'25': '綜合討論',
		'26': '兩岸全球',
		'27': '法律常識',
		'28': '居家設計',
		'29': '動漫卡通',
		'30': '藝文創作'
	},
	init: function() {
		if (typeof window.__scupioecCookieChannel != 'undefined') {
			var channels = window.__scupioecCookieChannel;
			if (channels.length == 0) {
				$('#container').text('No Data');
			} else {
				$('#container').text('');
				for (i = 0; i < channels.length; i++) {
					var channel = channels[i];
					var persentage = sprintf('%2.1f', (channel.w * 100));
					if (this.categories[channel.ch]) {
						var item = $('<div style="width: 400px; margin: 10px"/>').append($('<span style="position: absolute"/>').text(this.categories[channel.ch] + ': ' + persentage + '%')).progressbar({ value: channel.w * 100 });
						item.appendTo('#container');
					}
					//document.write("visited channel:"+info.ch.toString()+" , weight:"+info.w.toString()+"<br>");
				}
			}
		}
	}
};

var browserDetection = {
	init: function() {
		
		$('#browser_detection').button().click(function() {
			
			log('browser.msie: ' + $.browser.msie);
			log('browser.webkit: ' + $.browser.webkit);
			log('browser.mozilla: ' + $.browser.mozilla);
			log('browser.opera: ' + $.browser.opera);
			log('browser.safari: ' + $.browser.safari);
			log('browser.version: ' + $.browser.version);
			log('navigator.appCodeName: ' + navigator.appCodeName);
			log('navigator.appName: ' + navigator.appName);
			log('navigator.appVersion: ' + navigator.appVersion);
			log('navigator.cookieEnabled: ' + navigator.cookieEnabled);
			log('navigator.platform: ' + navigator.platform);
			log('navigator.userAgent: ' + navigator.userAgent);
			
			var browser = 'unknown';
			var version = '0';
			
			var chromeRegex = / Chrome\/([0-9]+)(\.[0-9]+)* /;
			var safariRegex = / Version\/([0-9]+)(\.[0-9]+)* /;
			
			if ($.browser.msie) {
				browser = 'msie';
				version = $.browser.version.match(/^([0-9]+)/)[1];
				$('#browser_detection').button({ 'label': '你的瀏覽器是 IE ' + version });
			} else if ($.browser.mozilla) {
				browser = 'firefox';
				version = $.browser.version.match(/^([0-9]+)/)[1];
				$('#browser_detection').button({ 'label': '你的瀏覽器是 Firefox ' + version });
			} else if ($.browser.opera) {
				browser = 'opera';
				version = $.browser.version.match(/^([0-9]+)/)[1];
				$('#browser_detection').button({ 'label': '你的瀏覽器是 Opera ' + version });
			} else if (navigator.userAgent.match(chromeRegex)) {
				browser = 'chrome';
				version = navigator.userAgent.match(chromeRegex)[1];
				$('#browser_detection').button({ 'label': '你的瀏覽器是 Chrome ' + version });
			} else if (navigator.userAgent.match(safariRegex)) {
				browser = 'safari';
				version = navigator.userAgent.match(safariRegex)[1];
				$('#browser_detection').button({ 'label': '你的瀏覽器是 Safari ' + version });
			} else {
				alert('無法辨識你的瀏覽器，其它資訊如下：\nbrowser.msie: ' + $.browser.msie + '\nbrowser.webkit: ' + $.browser.webkit +
							'\nbrowser.mozilla: ' + $.browser.mozilla + '\nbrowser.opera: ' + $.browser.opera + '\nbrowser.safari: ' + $.browser.safari + '\nbrowser.version: ' + $.browser.version +
							'\nnavigator.appCodeName: ' + navigator.appCodeName + '\nnavigator.appName: ' + navigator.appName + '\nnavigator.appVersion: ' + navigator.appVersion +
							'\nnavigator.cookieEnabled: ' + navigator.cookieEnabled + '\nnavigator.platform: ' + navigator.platform + '\nnavigator.userAgent: ' + navigator.userAgent);
			}
			log('result: ' + browser + ' ' + version);
		});
	}
};

// TODO: analytics
// TODO: preload

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
	'UNSTART':  -1,
	'ENDED':     0,
	'PLAYING':   1,
	'PAUSED':    2,
	'BUFFERING': 3,
	'CUED':     5
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
		if (thumbnail) {
			$('#blank_screen')
			  .css('background-image',    'url(' + thumbnail + ')')
			  .css('background-repeat',   'no-repeat')
			  .css('background-position', 'center')
			  .css('background-position', 'middle')
			  .html('');
		} else {
			$('#blank_screen').css('background-image', '');
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
	init: function() {
		var pos = $('#ytplayer_holder').offset();
		$('#blank_screen').css('top', pos.top).css('left', pos.left);
		this.setBackground('tv.jpg');
		this.show('電源己關閉');
	}
};

var y$ = {
	seekInterval:    47,
	expertMode:      false,
	yesterday:       '2012-01-19T09:54:01.071Z',
	bloggerUrl:      'http://gdata.youtube.com/feeds/api/users/%s/uploads?v=2&alt=json-in-script&published-min-not-support=%s',
	bloggers:        [ 'ttvnewsview', 'ctitv', 'TBSCTS', 'FTVCP', 'TVBS', 'newsebc', 'pts' ],
	curator:         'louisje',
	tubes:           [ ],
	queued:          [ ],
	watched:         [ ],
	watchedTubes:    [ ],
	player:          null,
	currentTube:     null,
	gonextgo:        false,
	volume:          50,
	buffering:       0,
	initializing:    false,
	poweroff:        true,
	maxVideos:       15,
	maxTubes:        35,
	minTubes:        25,
	maxWatchedTubes: 200,
	maxWatched:      200,
	keepTubes:       30,
	keepVideos:      7,
	getOneBlogger: function() {
		var blogger = y$.bloggers.shift();
		if (blogger) {
			log('pick up a blogger: ' + blogger);
			return sprintf(y$.bloggerUrl, blogger, y$.yesterday);
		}
		return null;
	},
	getCurrentVideoId: function() {
		if (y$.player) {
			return y$.player.getVideoUrl().match(/v=([^&]+)/)[1];
		}
		return null;
	},
	setTubeWatched: function(tube) {
		
		if ($.inArray(tube, y$.watchedTubes) == -1 && !tube.match(/^http:\/\//)) {
			y$.watchedTubes.push(tube);
			if (y$.watchedTubes.length > y$.maxWatchedTubes) {
				y$.watchedTubes.shift();
			}
			$.cookie('watched_tubes', y$.watchedTubes.join(','), { expires: y$.keepTubes });
		}
		var newTubes = [ ];
		while (y$.tubes.length > 0) {
			var url = y$.tubes.shift();
			if (url != tube)
				newTubes.push(url);
		}
		y$.tubes = newTubes;
		if (y$.tubes.length < y$.minTubes) {
			log('fetch more tubes');
			y$.fetchTubeList(y$.curator);
		}
		log('set tube to watched: ' + tube);
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
	onCue: function() {
		
		y$.initializing = false;
		
		if (y$.gonextgo) {
			log('[>>] auto forwarding');
			y$.gonextgo = false;
			y$.nextTube();
			return;
		}
		
		y$.player.setVolume(y$.volume);
		
		if (false && y$.expertMode) {
			log('cued by demand mode');
			var timeoutId = setTimeout(function() {
				if (y$.player) {
					var state = y$.player.getPlayerState();
					if (state == YT['CUED'] || state == YT['UNSTART']) {
						blank$.hide();
					}
				}
			}, 2000);
			$('#btn_next').one('mousedown', function() {
				clearTimeout(timeoutId);
			});
			return;
		}
		
		y$.player.playVideo();
	},
	onPlayerReady: function(playlist) {
		
		log('player is ready');
		//log(playlist, true);
		
		y$.onCue();
	},
	onStateChange: function(state) {
		//log('state change to ' + state);
		switch(state) {
			
			case YT['UNSTART']:
			//log('unstart');
			y$.buffering = 0;
			var videoId = y$.getCurrentVideoId();
			var url = 'http://gdata.youtube.com/feeds/api/videos/' + videoId + '?v=2&alt=json-in-script&callback=?';
			$.get(url, function(data) {
				log('video title: ' + data.entry.title.$t);
			}, 'json');
			break;
			
			case YT['ENDED']:
			log('ended');
			blank$.show('本台播放完畢');
			y$.setTubeWatched(y$.currentTube);
			break;
			
			case YT['PLAYING']:
			var videoId = y$.getCurrentVideoId();
			y$.setVideoWatched(videoId);
			blank$.hide();
			break;
			
			case YT['PAUSED']:
			log('... paused');
			break;
			
			case YT['BUFFERING']:
			if (y$.buffering > 1) {
				log('... buffering');
			}
			y$.buffering++;
			break;
			
			case YT['CUED']:
			log('... cued');
			y$.onCue();
			break;
			
			default:
			log('unknown state: ' + state);
		}
	},
	onError: function(error) {
		log('error code = ' + error);
		
		switch(error) {
			case 150:
			blank$.show('本片因為含有版權內容，被版權擁有者封鎖');
			y$.setVideoWatched(y$.getCurrentVideoId());
			break;
			
			default:
		}
	},
	onTubeListFetched: function(feed) {
		if (y$.tubes.length < y$.maxTubes && feed.link.length > 0) {
			var bloggerUrl = y$.getOneBlogger();
			if (bloggerUrl) {
				//log('blogger url: ' + bloggerUrl);
				y$.tubes.push(bloggerUrl);
			}
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
		
		var thumbnail = feed.media$group ? feed.media$group.media$thumbnail[1].url : feed.entry[0].media$group.media$thumbnail[1].url;
		
		blank$.setBackground(thumbnail);
		blank$.show();
		
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
		
		log(feed.title.$t, true);
		y$.cuePlaylist(feed.title.$t);
	},
	switchExpertMode: function() {
		log('Expert Mode Turned ON', true);
		y$.expertMode = true;
	},
	cuePlaylist: function(title) {
		if (y$.queued.length == 0) {
			blank$.show('本台已全部播完');
			y$.setTubeWatched(y$.currentTube);
			
			y$.initializing = false;
			
			return y$.nextTube();
			
		}
		log('play list count = ' + y$.queued.length);
		
		if (y$.player) {
			y$.player.cuePlaylist(y$.queued);
		} else {
			log('initial a new player');
			var url = sprintf('http://www.youtube.com/v/%s?autohide=1&enablejsapi=1&color=white&controls=0&fs=1&rel=0&showinfo=0&version=3&playerapiid=%s&playlist=%s', y$.queued.shift(), encodeURIComponent(title), y$.queued.join(','));
			if (y$.expertMode) {
				url = sprintf('http://www.youtube.com/v/%s?autohide=1&enablejsapi=1&color=white&fs=1&rel=1&showinfo=1&theme=light&version=3&playerapiid=%s&playlist=%s', y$.queued.shift(), encodeURIComponent(title), y$.queued.join(','));
			}
			log(url);
			var param = {
				allowFullScreen:   true,
				allowScriptAccess: 'always',
				wmode:             'opaque'
			};
			var attr = { 'id': 'ytplayer' };
			swfobject.embedSWF(url, 'ytplayer', 720, 405, '11', null, null, param, attr);
		}
	},
	fetchTubeList: function(curator, isUrl) {
		var source = 'http://gdata.youtube.com/feeds/api/users/' + curator + '/playlists?v=2&alt=json-in-script&max-results=5&callback=?';
		if (isUrl) {
			source = curator + '&callback=?';
		}
		$.get(source, function(data) {
			//log(data);
			var feed = data.feed;
			var entries = feed.entry;
			for (var i = 0; i < entries.length && y$.tubes.length < y$.maxTubes; i++) {
				var tube = entries[i].yt$playlistId.$t;
				//var url = entries[i].content.src + '&alt=json-in-script&max-results=50';
				if (($.inArray(tube, y$.watchedTubes) == -1 && $.inArray(tube, y$.tubes)) || y$.expertMode) {
					//log('fetched tube: ' + tube);
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
				var videoId = entries[i].media$group.yt$videoid.$t;
				if ($.inArray(videoId, y$.watched) == -1 || y$.expertMode) {
					y$.queued.push(videoId);
				}
			}
			
			y$.onEntryListFetched(feed);
			
		}, 'json');
	},
	nextTube: function() {
		
		blank$.setBackground();
		blank$.show();
		
		if (y$.initializing) {
			log('ooops!');
			return;
		}
		y$.initializing = true;
		
		if (!y$.tubes.length) {
			log('no tube!');
		}
		var tube = y$.tubes.shift();
		log('tube = ' + tube);
		y$.tubes.push(tube);
		y$.queued = [ ];
		y$.currentTube = tube;
		if (tube.match(/^http:\/\//))
			y$.fetchEntryList(tube, true);
		else
			y$.fetchEntryList(tube);
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
		
		var now = new Date();
		now.setDate(now.getDate() - 1);
		y$.yesterday = now.toISOString();
		
		y$.fetchTubeList(y$.curator);
		
	}
};

var onYouTubePlayerReady = function(playlist) {
	
	//log('flash player is ready');
	
	y$.player = $('#ytplayer').get(0);
	
	y$.player.addEventListener('onPlaybackQualityChange', 'y$.onPlaybackQualityChange');
	y$.player.addEventListener('onStateChange', 'y$.onStateChange');
	y$.player.addEventListener('onError', 'y$.onError');
	
	y$.onPlayerReady(decodeURIComponent(playlist));
};

$(function() {
	
	scupio.init();
	browserDetection.init();
	
	blank$.init();
	
	$('button').button();
	
	$('#btn_next').click(function() {
		if (y$.initializing && y$.gonextgo) {
			log('calmdown man');
		} else if (y$.initializing) {
			y$.gonextgo = true;
		} else if (y$.player) {
			log('[->] user change tube');
			y$.gonextgo = false;
			y$.nextTube();
		}
	});
	
	$('#btn_next').mousedown(function() {
		if (y$.player) {
			var timeoutId = setTimeout(function() {
				if ($('#btn_next').is('.ui-state-active')) {
					y$.switchExpertMode();
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
				y$.switchExpertMode();
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
		y$.setVolume(parseInt(y$.volume) + 10);
	});
	
	$('#btn_lower').click(function() {
		y$.setVolume(parseInt(y$.volume) - 10);
	});
	
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
	
	$('#btn_power').click(function() {
		if (y$.poweroff) {
			y$.poweroff = false;
			y$.init();
		} else if (y$.initializing) {
			log('still initializing');
		} else {
			if (y$.player) {
				y$.player.destroy();
				y$.player = null;
			}
			
			blank$.setBackground();
			blank$.show('電源已關閉');
			
			y$.tubes = [ ];
			y$.poweroff = true;
			y$.expertMode = false;
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
			
			default:
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
			
			case 61: // '='
			break;
			
			case 45: // '-'
			break;
			
			case KEY['0']:
			break;
			
			case KEY['ENTER']:
			break;
			
			case KEY['9']:
			break;
			
			case KEY[']']:
			if (y$.player) {
				y$.player.nextVideo();
			}
			break;
			
			case KEY['[']:
			if (y$.player) {
				y$.player.previousVideo();
			}
			break;
			
			case KEY['}']:
			if (y$.player) {
				var currentTime = y$.player.getCurrentTime();
				y$.player.seekTo(currentTime + y$.seekInterval);
			}
			break;
			
			case KEY['{']:
			if (y$.player) {
				var currentTime = y$.player.getCurrentTime();
				y$.player.seekTo(currentTime - y$.seekInterval);
			}
			break;
			
			default:
			log('key pressed: ' + which);
		}
	});
	
});
