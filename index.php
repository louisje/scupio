<html>
<head>
<link type="text/css" rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/themes/start/jquery-ui.css"/>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.js"></script>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.js"></script>
<script type="text/javascript" src='http://rec.scupio.com/recweb/rec.aspx?act=cc'></script>
<script type="text/javascript" src="webtoolkit.sprintf.js"></script>
<script type="text/javascript">
$(function() {
  var categories = {
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
  };
  
  if (typeof window.__scupioecCookieChannel != 'undefined') {
    var channels = window.__scupioecCookieChannel;
    if (channels.lenght == 0) {
      $('#container').text('No Data');
      return;
    }
    $('#container').text('');
    for (i = 0; i < channels.length; i++) {
      var channel = channels[i];
      var persentage = sprintf('%2.1f', (channel.w * 100));
      if (categories[channel.ch]) {
        var item = $('<div style="width: 400px; margin: 10px"/>').append($('<span style="position: absolute"/>').text(categories[channel.ch] + ': ' + persentage + '%')).progressbar({ value: channel.w * 100 });
        item.appendTo('#container');
      }
      //document.write("visited channel:"+info.ch.toString()+" , weight:"+info.w.toString()+"<br>");
    }
  }
});
</script>
</head>
<body>
<div id="container">Loading ...</div>
</body>
</html>
