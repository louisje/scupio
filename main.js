
var log = function(text) {
	if (window.console && console.log)
		console.log(text);
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
	setVideoWatched: function(videoId) {
		
		if ($.inArray(videoId, y$.watched) == -1) {
			y$.watched.push(videoId);
			if (y$.watched.length > 100) {
				y$.watched.shift();
			}
			$.cookie('watched', y$.watched.join(','), { /*, expires: 30*/ });
			log('set to watched: ' + videoId);
		}
	},
	onReady: function() {
		
		log('youtube player is ready');
		
	},
	onStateChange: function(state) {
		//log('state change to ' + state);
		switch(state) {
			
			case -1: // unstart
			y$.buffering = 0;
			break;
			
			case 0: // ended
			break;
			
			case 1: // playing
			var videoId = y$.player.getVideoUrl().match(/v=([^&]+)/)[1];
			y$.setVideoWatched(videoId);
			break;
			
			case 2: // pause
			break;
			
			case 3: // buffering
			if (y$buffering > 0)
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
		if (y$.queued.length < 30 && feed.link.length > 0) {
			for (var i = 0; i < feed.link.length; i++) {
				var link = feed.link[i];
				if (link.rel == 'next') {
					return y$.fetchEntryList(link.href);
				}
			}
		}
		
		y$.cuePlaylist();
	},
	cuePlaylist: function() {
		if (y$.queued.length == 0) {
			log('playlist is empty!');
			$('#player_holder').text('Play list is empty or watched');
			return;
		}
		log('play list count = ' + y$.queued.length);
		
		var url = sprintf('http://www.youtube.com/v/%s?autohide=1&enablejsapi=1&color=white&fs=1&rel=1&showinfo=1&theme=light&version=3&playerapiid=%s&playlist=%s', y$.queued.shift(), 'playlist', y$.queued.join(','));
		log(url);
		var param = {
			allowFullScreen:   true,
			allowScriptAccess: "always"
		};
		var attr = { 'id': 'ytplayer' };
		swfobject.embedSWF(url, 'player_holder', 640, 360, '11', null, null, param, attr);
	},
	fetchEntryList: function(url) {
		url += '&callback=?';
		
		$.get(url, function(data) {
			
			var feed = data.feed;
			var entries = feed.entry;
			log(data);
			
			for (var i = 0; i < entries.length; i++) {
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
		
		var url = 'http://gdata.youtube.com/feeds/api/standardfeeds/TW/most_recent?v=2&alt=json-in-script&max-results=50';
		y$.fetchEntryList(url);
	}
};

var y$ = youtube;
var onYouTubePlayerReady = function(videoId) {
	
	y$.player = $('#ytplayer').get(0);
	var yt = 'y$.';
	
	y$.player.addEventListener('onPlaybackQualityChange', 'y$.onPlaybackQualityChange');
	y$.player.addEventListener('onStateChange', 'y$.onStateChange');
	y$.player.addEventListener('onError', 'y$.onError');
	y$.player.addEventListener('onReady', 'y$.onReady');
	
	y$.onPlayerReady(data);
};

$(function() {
	
	scupio.init();
	browserDetection.init();
	youtube.init();
});
