
var log = function(text, remote) {
	if (window.console && console.log)
		console.log(text);
	if (remote) {
		$('#remote_display').text(text);
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

var youtube = {
	queued:  [],
	watched: [],
	player:  null,
	buffering: 0,
	getCurrentVideoId: function() {
		if (y$.player) {
			return y$.player.getVideoUrl().match(/v=([^&]+)/)[1];
		}
		return null;
	},
	setVideoWatched: function(videoId) {
		
		if ($.inArray(videoId, y$.watched) == -1) {
			y$.watched.push(videoId);
			if (y$.watched.length > 300) {
				y$.watched.shift();
			}
			$.cookie('watched', y$.watched.join(','), { expires: 300 });
			log('set to watched: ' + videoId);
		}
	},
	onPlayerReady: function(playlist) {
		
		log('youtube player is ready');
		log(playlist, true);
		
		y$.player.playVideo();
	
	},
	onStateChange: function(state) {
		//log('state change to ' + state);
		switch(state) {
			
			case -1: // unstart
			y$.buffering = 0;
			/*
			var videoId = y$.player.getVideoUrl().match(/v=([^&]+)/)[1];
			var url = 'http://gdata.youtube.com/feeds/api/videos/' + videoId + '?v=2&alt=json-in-script&callback=?';
			$.get(url, function(data) {
				log(data.entry.title.$t, true);
			}, 'json');
			*/
			break;
			
			case 0: // ended
			log('the end');
			break;
			
			case 1: // playing
			var videoId = y$.getCurrentVideoId();
			y$.setVideoWatched(videoId);
			$('#black_screen').hide('slow');
			break;
			
			case 2: // pause
			break;
			
			case 3: // buffering
			if (y$.buffering > 0)
				log('buffering ... ');
			y$.buffering++;
			break;
			
			case 5: // cued
			break;
			
			default:
		}
	},
	onError: function(error) {
		log(error);
	},
	onEntryListFetched: function(feed) {
		if (y$.queued.length < 50 && feed.link.length > 0) {
			for (var i = 0; i < feed.link.length; i++) {
				var link = feed.link[i];
				if (link.rel == 'next') {
					return y$.fetchEntryList(link.href);
				}
			}
		}
		var thumbnail = feed.media$group.media$thumbnail[1].url;
		$('#black_screen')
		  .css('background-image', 'url(' + thumbnail + ')')
		  .css('background-position', 'center')
		  .css('background-repeat', 'no-repeat');
		
		y$.cuePlaylist(feed.title.$t);
	},
	cuePlaylist: function(title) {
		if (y$.queued.length == 0) {
			log('本台已全部播完', true);
			$('#black_screen').html('<div><h2>本台已全部播完</h2></div>');
			return;
		}
		log('play list count = ' + y$.queued.length);
		
		var url = sprintf('http://www.youtube.com/v/%s?autohide=1&enablejsapi=1&color=white&fs=1&rel=1&showinfo=1&theme=light&version=3&playerapiid=%s&playlist=%s', y$.queued.shift(), encodeURIComponent(title), y$.queued.join(','));
		log(url);
		var param = {
			allowFullScreen:   true,
			allowScriptAccess: 'always',
			wmode:             'Opaque'
		};
		var attr = { 'id': 'ytplayer' };
		swfobject.embedSWF(url, 'ytplayer', 640, 360, '11', null, null, param, attr);
		//this.onReady();
	},
	fetchEntryList: function(url) {
		url += '&callback=?';
		
		$.get(url, function(data) {
			
			var feed = data.feed;
			var entries = feed.entry;
			log(data);
			
			for (var i = 0; i < entries.length && y$.queued.length < 50; i++) {
				var videoId = entries[i].media$group.yt$videoid.$t;
				if ($.inArray(videoId, y$.watched) == -1) {
					y$.queued.push(videoId);
				}
			}
			
			y$.onEntryListFetched(feed);
			
		}, 'json');
	},
	init: function() {
		
		// load watched list from cookie
		var watchedList = $.cookie('watched');
		if (watchedList) {
			y$.watched = watchedList.split(',');
		}
		log('watched list count = ' + y$.watched.length);
		
		if (!tubeUrls.length) {
			log('no tube url!');
		}
		var url = tubeUrls.shift();
		log('tube url = ' + url);
		tubeUrls.push(url);
		y$.queued = [ ];
		//var url = 'http://gdata.youtube.com/feeds/api/standardfeeds/TW/most_recent?v=2&alt=json-in-script&max-results=50';
		//var url = 'http://gdata.youtube.com/feeds/api/users/ttvnewsview/uploads?v=2&alt=json-in-script&max-results=50';
		y$.fetchEntryList(url);
	}
};

var tubeUrls = [ ];
var y$ = youtube;

var onYouTubePlayerReady = function(playlist) {
	
	log('flash player is ready');
	
	y$.player = $('#ytplayer').get(0);
	var yt = 'y$.';
	
	$('#btn_power').click(function() {
		y$.player.stopVideo();
		$('#black_screen').html('<div><h2>電源已關閉</h2></html>').show('slow');
	});
	
	y$.player.addEventListener('onPlaybackQualityChange', 'y$.onPlaybackQualityChange');
	y$.player.addEventListener('onStateChange', 'y$.onStateChange');
	y$.player.addEventListener('onError', 'y$.onError');
	//y$.player.addEventListener('onReady', 'y$.onReady');
	
	y$.onPlayerReady(decodeURIComponent(playlist));
};

$(function() {
	
	scupio.init();
	browserDetection.init();
	
	var tubeSource = 'http://gdata.youtube.com/feeds/api/users/louisje/playlists?alt=json-in-script&v=2&max-results=9&callback=?';
	
	$('button').button();
	
	$('#btn_power').click(function() {
		var pos = $('#ytplayer').position();
		$('#black_screen')
		  .css('top', pos.top)
		  .css('left', pos.left)
		  .html('<div><h2>電源開啟中</h2></div>')
		  .show();
		$('#btn_power').unbind('click');
		$.get(tubeSource, function(data) {
			var entries = data.feed.entry;
			for (var i = 0; i < entries.length; i++) {
				var url = entries[i].content.src + '&alt=json-in-script&max-results=50';
				tubeUrls.push(url);
			}
			youtube.init();
		}, 'json');
	});
	
	$('#btn_next').click(function() {
		if (y$.player) {
			y$.player.stopVideo();
		}
		$('#black_screen').text('').show();
		youtube.init();
	});
	
	$('#btn_mute').click(function() {
		if (y$.player) {
			if (y$.player.isMuted()) {
				y$.player.unMute();
				log('取消靜音', true);
			} else {
				y$.player.mute();
				log('靜音', true);
			}
		}
	});
	
	//log('navigator.language = ' + navigator.language);
	//log('navigator.browserLanguage = ' + navigator.browserLanguage);
	//log('navigator.systemLanguage = ' + navigator.systemLanguage);
	//log('navigator.userLanguage = ' + navigator.userLanguage);
});
