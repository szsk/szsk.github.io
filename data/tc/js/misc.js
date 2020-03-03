$(function(){

$('span.yt > a').click(function() {
  var a = $(this);
  a.attr("href").match(/v=([^#]+)(?:#t=(\d+)m(\d+)s)?/);
  var id = RegExp.$1;
  var m = RegExp.$2 || 0;
  var s = RegExp.$3 || 0;
  var start = "&start=" + (parseInt(m) * 60 + parseInt(s));

  var html = '<object width="480" height="385">' +
  '<param name="movie" value="http://www.youtube.com/v/' + id + '&hl=ja_JP&fs=1&rel=0&autoplay=1' + start + '"></param>' +
  '<param name="allowFullScreen" value="true"></param>' +
  '<param name="allowscriptaccess" value="always"></param>' +
  '<embed src="http://www.youtube.com/v/' + id + '&hl=ja_JP&fs=1&rel=0&autoplay=1' + start + '" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="480" height="385"></embed></object>';
 
  var box = $(document.createElement("div")).html(html);

  box.lightbox_me({
    centered: true,  
    onLoad: function(){}
  });
  return false;
});

});
