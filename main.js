
var log = function(text, remote) {
	if (window.console && console.log)
		console.log(text);
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

var news$ = {
	yesterdayISOString: '2012-01-19T09:54:01.071Z',
	urlTemplate:        'http://gdata.youtube.com/feeds/api/users/%s/uploads?v=2&alt=json-in-script&published-min-not-support=%s',
	sources:            [ 'ttvnewsview', 'ctitv', 'TBSCTS', 'FTVCP', 'TVBS', 'newsebc', 'pts' ],
	getOne: function() {
		var newsSource = news$.sources.shift();
		if (newsSource) {
			log('pick up news tube: ' + newsSource);
			return sprintf(news$.urlTemplate, newsSource, news$.yesterdayISOString);
		}
		return null;
	},
	init: function() {
		var yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		news$.yesterdayISOString = yesterday.toISOString();
	}
};

var y$ = {
	curator:         'louisje',
	tubes:           [ ],
	queued:          [ ],
	watched:         [ ],
	watchedTubes:    [ ],
	player:          null,
	currentTube:     null,
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
	onPlayerReady: function(playlist) {
		
		log('youtube player is ready');
		log(playlist, true);
		
		y$.player.setVolume(y$.volume);
		y$.player.playVideo();
		
		y$.initializing = false;
		
	},
	onStateChange: function(state) {
		//log('state change to ' + state);
		switch(state) {
			
			case -1: // unstart
			log('unstart');
			y$.buffering = 0;
			var videoId = y$.getCurrentVideoId();
			var url = 'http://gdata.youtube.com/feeds/api/videos/' + videoId + '?v=2&alt=json-in-script&callback=?';
			$.get(url, function(data) {
				log('playing video: ' + data.entry.title.$t);
			}, 'json');
			break;
			
			case 0: // ended
			log('ended');
			$('#black_screen').html('<div><h2>本台播放完畢</h2></div>').show('explode', 'slow');
			y$.setTubeWatched(y$.currentTube);
			break;
			
			case 1: // playing
			var videoId = y$.getCurrentVideoId();
			y$.setVideoWatched(videoId);
			if ($('#black_screen').is(':visible')) {
				$('#black_screen').hide('explode');
			}
			break;
			
			case 2: // pause
			log('paused');
			break;
			
			case 3: // buffering
			if (y$.buffering > 1) {
				log('buffering ... ');
			}
			y$.buffering++;
			break;
			
			case 5: // cued
			log('cued');
			break;
			
			default:
			log('unknown state: ' + state);
		}
	},
	onError: function(error) {
		log('error code = ' + error);
		
		switch(error) {
			case 150:
			log('本片因為含有版權內容，被版權擁有者封鎖');
			$('#black_screen').html('<div><h2>本片因為含有版權內容，被版權擁有者封鎖</h2></div>');
			var videoId = y$.getCurrentVideoId();
			y$.setVideoWatched(videoId);
			//y$.setTubeWatched(y$.currentTube);
			
			default:
		}
	},
	onTubeListFetched: function(feed) {
		if (y$.tubes.length < y$.maxTubes && feed.link.length > 0) {
			var newsTube = news$.getOne();
			if (newsTube) {
				//log('new tube: ' + newsTube);
				y$.tubes.push(newsTube);
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
		
		$('#black_screen')
		  .css('background-image',    'url(' + thumbnail + ')')
		  .css('background-repeat',   'no-repeat')
		  .css('background-position', 'center')
		  .css('background-position', 'middle')
		  .html('');
		
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
		
		y$.cuePlaylist(feed.title.$t);
	},
	cuePlaylist: function(title) {
		if (y$.queued.length == 0) {
			log('本台已全部播完');
			$('#black_screen').html('<div><h2>本台已全部播完</h2></div>');
			y$.setTubeWatched(y$.currentTube);
			
			y$.initializing = false;
			
			return y$.nextTube();
			
		}
		log('play list count = ' + y$.queued.length);
		
		var url = sprintf('http://www.youtube.com/v/%s?autohide=1&enablejsapi=1&color=white&fs=1&rel=1&showinfo=1&theme=light&version=3&playerapiid=%s&playlist=%s', y$.queued.shift(), encodeURIComponent(title), y$.queued.join(','));
		log(url);
		var param = {
			allowFullScreen:   true,
			allowScriptAccess: 'always',
			wmode:             'opaque'
		};
		var attr = { 'id': 'ytplayer' };
		swfobject.embedSWF(url, 'ytplayer', 720, 405, '11', null, null, param, attr);
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
				if ($.inArray(tube, y$.watchedTubes) == -1 && $.inArray(tube, y$.tubes)) {
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
				if ($.inArray(videoId, y$.watched) == -1) {
					y$.queued.push(videoId);
				}
			}
			
			y$.onEntryListFetched(feed);
			
		}, 'json');
	},
	nextTube: function() {
		if (!$('#black_screen').is(':visible')) {
			$('#black_screen').html('').show('explode');
		}
		if (y$.player) {
			y$.player.stopVideo();
			y$.player.destroy();
			y$.player = null;
		}
		if (y$.initializing) {
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
		
		var pos = $('#ytplayer').position();
		$('#black_screen')
		  .css('top', pos.top)
		  .css('left', pos.left)
		  .html('<div><h2>電源開啟中</h2></div>')
		  .show();
		
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
		
		news$.init();
		
		y$.fetchTubeList(y$.curator);
		
	}
};

var onYouTubePlayerReady = function(playlist) {
	
	log('flash player is ready');
	
	y$.player = $('#ytplayer').get(0);
	
	y$.player.addEventListener('onPlaybackQualityChange', 'y$.onPlaybackQualityChange');
	y$.player.addEventListener('onStateChange', 'y$.onStateChange');
	y$.player.addEventListener('onError', 'y$.onError');
	//y$.player.addEventListener('onReady', 'y$.onReady');
	
	y$.onPlayerReady(decodeURIComponent(playlist));
};

$(function() {
	
	scupio.init();
	browserDetection.init();
	
	$('button').button();
	
	$('#btn_next').click(function() {
		if (y$.initializing) {
			log('calmdown man');
		} else if (y$.player) {
			y$.nextTube();
		}
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
				y$.player.pauseVideo();
				y$.player.destroy();
				y$.player = null;
			}
			$('#black_screen').html('<div><h2>電源已關閉</h2></div>');
			$('#black_screen').css('background-image', '');
			if (!$('#black_screen').is(':visible')) {
				$('#black_screen').show('explode');
			}
			y$.tubes = [ ];
			y$.poweroff = true;
		}
	});
});
