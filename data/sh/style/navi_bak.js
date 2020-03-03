var now			= 0;
var max			= 0;
var mode		= true;
var mouseX		= 0;
var mouseY		= 0;
var layer		= new Array( );
var xml			= new Array( );
xml['devil']	= new Array( );
xml['item']		= new Array( );
xml['skill']	= new Array( );
var hash		= new Hash( );
var cookie		= new Cookie( );
var moffset		= -80;
var footer;

//window.onload	= Init;
window.onload	= addpopup;

function addpopup( )
{
	if( !gid( 'content' ) ) return;
	//悪魔データへのリンクを全てポップアップに
	var link = gidtag( 'content', 'a' );
	for( var i = 0; i < link.length; i++ ) {
		var array = link[i].href.match( /\/(devil)\/(\d+)\.html#\w(\d+)/ );
		if( array && array[1] && array[2] && array[3] ) {
			var parent = ( is_gecko( ) ) ? link[i].parentNode : link[i].parentElement;

			var span = ele( 'span' );
			span['type']			= array[1];
			span['race']			= array[2];
			span['xmlid']			= array[3];
			span.onmousedown		= popup;
			span.innerHTML			= '[!]';
			span.style.fontWeight	= 'bold';
			parent.insertBefore( span, parent.firstChild );
		}
	}
}

function Init( )
{
	if( !gid( "navi" ) ) return;
	max	= gidtag( 'navi', 'a' ).length;

	//ハッシュから初期表示位置を取得
	var obj = hash.read( );
	if( obj['section'] )	now = parseInt( obj['section'] );
	else					now = 0;
	if( now > max )			now = max;

	create_footer( );

	//クッキーから表示状態を読み込む
	var obj = cookie.read( );

	//クッキーが無い＝初回訪問時からナビを有効にする
	mode = ( !obj['navi'] || obj['navi'] == 'on' ) ? true : false;
	if( mode )	enable_navi( );
}

//フッター作成
function create_footer( )
{
	footer					= ele( 'div' );
	footer.timer			= null;
	footer.id				= 'js_footer';
	with( footer.style ) {
		bottom		= '0px';
		display		= 'none';
		position	= ( is_gecko( ) ) ? 'fixed' : 'absolute';
	}

	footer.show = function( ) {
		footer.style.display = 'block';
		clearTimeout( this.timer );
	}
	footer.hide = function( ) {
		footer.style.display = 'none';
		footer.timer = setTimeout( "footer.show()", 3000 );
	}

//	footer.onclick			= footer.hide;
	window.onscroll			= footer.hide;

	var help				= ele( 'span' );
	help.onclick			= function( event ) { openhelp( event ); };
	help.innerHTML			= '[?]';

	var ctrl				= ele( 'span' );
	ctrl.onclick			= flip;
	ctrl.innerHTML			= ( mode ) ? '[無効化]' : '[有効化]';

	footer.appendChild( help );
	footer.appendChild( ctrl );

	var first				= ele( 'span' );
	first.onmousedown		= function( ) { rep( 0 ); };
	first.innerHTML			= '[&laquo;]';
	first.style.marginLeft	= '33%';

	var prev				= ele( 'span' );
	prev.onmousedown			= function( ) { rep( now - 1 ); };
	prev.innerHTML			= '[&lt;]';

	var next				= ele( 'span' );
	next.onmousedown			= function( ) { rep( now + 1 ); };
	next.innerHTML			= '[&gt;]';

	var last				= ele( 'span' );
	last.onmousedown			= function( ) { rep( max - 1 ); };
	last.innerHTML			= '[&raquo;]';

	var section				= ele( 'span' );
	section.id				= 'section';
	section.style.position	= 'absolute';
	section.style.right		= '0px';
	section.innerHTML		= ( now + 1 ) + '/' + max;

	footer.appendChild( first );
	footer.appendChild( prev );
	footer.appendChild( next );
	footer.appendChild( last );
	footer.appendChild( section );

	gid( 'wrapper' ).appendChild( footer );

	footer.style.display			= 'block';
	gid( 'footer' ).style.display	= 'none';
}

function section( )
{
	gid( 'section' ).innerHTML = ( now + 1 ) + '/' + max;
	footer.show( );
}

function enable_navi( )
{
	//テキストを隠す
	var dd = gidtag( 'content', 'dd' );
	for( var i = 0; i < max; i++ ) {
		dd[i].style.display = ( i == now ) ? 'block' : 'none';
	}

	//サイドメニューからリンクを取り払う
	var list = gidtag( 'navi', 'li' );
	for( var i = 0; i < max; i++ ) {
		list[i].className = 'disable';
		list[i].innerHTML = '<span onmouseover="rep(' + i + ')">'
					+ list[i].firstChild.firstChild.nodeValue + '</span>';
	}

	gidtag( 'navi', 'li' )[now].className	= 'enable';

	//悪魔データへのリンクを全てポップアップに
	var link = gidtag( 'content', 'a' );
	for( var i = 0; i < link.length; i++ ) {
		var array = link[i].href.match( /\/(devil|item)\/(\d+|\w+)\.html#\w(\d+)/ );
		if( array && array[1] && array[2] && array[3] ) {
			link[i]['type']		= array[1];
			link[i]['race']		= array[2];
			link[i]['xmlid']	= array[3];
			link[i].className	= 'js_popup';
			link[i].onmousedown	= popup;
			link[i].removeAttribute( 'href' );
		}
	}

	mode = true;
}

function disable_navi( )
{
	//テキストを表示する
	var dd = gidtag( 'content', 'dd' );
	for( var i = 0; i < max; i++ )
		dd[i].style.display = 'block';

	//サイドメニューにリンクを戻す
	var list = gidtag( 'navi', 'li' );
	for( var i = 0; i < max; i++ ) {
		list[i].removeAttribute( 'class' );		//Mozilla用
		list[i].removeAttribute( 'className' );	//IE用
		list[i].innerHTML = '<a href="#s' + ( i + 1 ) + '">'
					+ list[i].firstChild.firstChild.nodeValue + '</a>';
	}

	//悪魔データへのリンクを全て戻す
	var link = gidtag( 'content', 'a' );
	for( var i = 0; i < link.length; i++ ) {
		if( link[i].race ) {
			link[i].setAttribute( 'href', '../../data/devil/'
				+ link[i].race + '.html#D' + link[i].xmlid );
			link[i].style.cursor			= '';
			link[i].style.textDecoration	= '';
			link[i].onmousedown				= null;
		}
	}

	hash.clear( );
	now = 0;

	mode = false;
}

function flip(  )
{
	mode = mode ^ 1;

	if( mode ) {
		enable_navi( );
	}
	else {
		disable_navi( );
	}

	cookie.settime( 30, 0, 0, 0 );
	cookie.regist( 'navi', ( mode ) ? 'on' : 'off' );
	cookie.write( );

	this.innerHTML = ( mode ) ? '[無効化]' : '[有効化]';
}

function popup( e )
{
	var id		= this.xmlid;
	var type	= this.type;
	mouseX		= getMouseX( e ) + moffset;
	mosueY		= getMouseY( e ) + moffset;

	if( layer[id] && !id && !type ) return;

	if( xml[type][id] ) {
		layer[id] = new Layer( id, xml[type][id], gid( 'wrapper' ) );
		layer[id].setPos( mouseX, mosueY );
		return;
	}
	var req = new XMLHttpRequest( );
	if( req ) {
		req.onreadystatechange = function( ) {
			if( req.readyState == 4 && req.status == 200 ) {
				xml[type][id] = req.responseText;
				layer[id] = new Layer( id, xml[type][id], gid( 'wrapper' ) );
				layer[id].setPos( mouseX, mosueY );
			}
		};
		req.open( 'GET', '../../xml/' + type + '/' + id + '.xml', true );
		req.send( null );
	}
}

//ヘルプ表示
function openhelp( e )
{
	var html =
		  '-HELP-（ダブルクリックで閉じます）<br />'
		+ '<ul style="margin:0 0 0 20px;list-style-type:disc;">'
		+ '<li>[← or →]<br />項目へ移動</li>'
		+ '<li>[数字キー]<br />項目の表示</li>'
		+ '<li>[Ctrl + ← or →]<br />前もしくは次の文書へ移動</li>'
		+ '<li>[Ctrl + ↑]<br />ページの一番上まで移動</li>'
		+ '</ul>'
		+ '右側の青い項目か、左の数字部分に<br />'
		+ 'マウスカーソルを重ねると、下に文章を表示します。';
	var id = 'help';
	if( layer[id] ) return;
	layer[id] = new Layer( id, html, gid( 'wrapper' ) );
	layer[id].setPos( getMouseX( e ), getMouseY( e ) - 300 );
}

//文章の表示入れ替え
function rep( id )
{
/*/
	if( max <= id || id < 0 ) return;
/*/ //ループ
	if( max <= id )	id = 0;
	if( id < 0 )	id = max - 1;
//*/

	var dd = gidtag( 'content', 'dd' );
	dd[now].style.display = 'none';
	gidtag( 'navi', 'li' )[now].className	= 'disable';
//	gidtag( 'tnav', 'span' )[now].className	= 'disable';

	var dd = gidtag( 'content', 'dd' );
	dd[id].style.display = 'block';
	gidtag( 'navi', 'li' )[id].className	= 'enable';
//	gidtag( 'tnav', 'span' )[id].className	= 'enable';

	now = id;
	hash.regist( 'section', now );
	hash.write( );

	section( );
}

//キー操作
window.document.onkeydown = function( e ) {
	var KeyEvent = e ? e : event;	//IEとFirefoxのEventの違いの為
	with( KeyEvent ) {
		if( ctrlKey ) {
			if( keyCode == 37 && findlink( 'prev' ) )
				document.location.href = findlink( 'prev' ).href;		//Ctrl + ←
			if( keyCode == 39 && findlink( 'next' ) )
				document.location.href = findlink( 'next' ).href;		//Ctrl + →
			if( keyCode == 38 )
				document.location.href = '#top';						//Ctrl + ↑
			return;
		}
		if( keyCode == 47 )						rep( now - 1 );			//←
		if( keyCode == 39 )						rep( now + 1 );			//→
		if( keyCode >= 49 && keyCode <= 57 )	rep( keyCode - 49 );
		if( keyCode >= 97 && keyCode <= 105 )	rep( keyCode - 97 );	//テンキー
	}
/*
32 Space
33 PageUp
34 PageDown
35 End
36 Home
37 ←
38 ↑
39 →
40 ↓

188 <
190 >
*/

}

/*
//マウスホイール操作（IEのみ）
window.document.onmousewheel = function( )
{
	if( event.wheelDelta > 0 )	rep( now - 1 );
	else						rep( now + 1 );
}
*/