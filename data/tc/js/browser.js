var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));

try {
var pageTracker = _gat._getTracker("UA-120208-1");
pageTracker._trackPageview();
} catch(err) {}

// for IE7
if( window.clipboardData != undefined
	&& navigator.userAgent.indexOf( "MSIE 6" ) != -1
	&& document.getElementById( "navi" )
	&& document.getElementById( "top" ) ) {
	
	function fix( ) {
		var chapter = document.getElementById( "chapter" );
		var navi    = document.getElementById( "navi" );
		var top     = document.getElementById( "top" );
		
		var scy = document.body.scrollTop;
		var clh = document.body.clientHeight;
		
		chapter.style.top = scy;
		navi.style.top = scy;
		top.style.top = scy + clh - top.clientHeight;
	}
	
	window.onload = function( ) {
		fix( );
		var timer = null;
		
		window.onscroll = function( ) {
			clearTimeout( timer );
			timer = setTimeout( fix, 16 );
		};
	}
	
	var script2 = document.createElement( "script" );
	script2.charset = "UTF-8";
	script2.type = "text/javascript";
	script2.src = "js/minmax.js";
	document.getElementsByTagName("head")[0].appendChild( script2 );
}