
function gid( id )
{
	return document.getElementById( id );
}

function gidtag( id, tag )
{
	return gid( id ).getElementsByTagName( tag );
}

function ele( tag )
{
	return document.createElement( tag );
}

function findlink( rel )
{
	var links = document.getElementsByTagName( 'link' );

	for( var i = 0; i < links.length; i++ ) {
		if( links[i].rel == rel ) return links[i];
	}
}

//マウス座標取得
function getMouseX( e )
{
	if( window.opera )
		return e.clientX;
	else if( document.all )
		return document.body.scrollLeft + event.clientX;
	else if( document.layers || document.getElementById )
		return e.pageX;
}
function getMouseY( e )
{
	if( window.opera )
		return e.clientY;
	else if( document.all )
		return document.body.scrollTop + event.clientY;
	else if( document.layers || document.getElementById )
		return e.pageY;
}

function is_gecko( )
{
	return navigator.userAgent.indexOf( 'Gecko/' ) != -1;
}

function dump( obj )
{
	for( var i in obj )
		alert( i + " : " + obj[i] );
}







//########## Hash ##########//

/* Test Code

	var hs = new Hash( );
	hs.regist( "section", "4" );
	hs.regist( "option", "1" );
	hs.write( );

	var obj = hs.read( );
	for( var i in obj )
		alert( obj[i] );

*/

function Hash( )
{
	this.set = new Array( );
}

//保存する内容を登録
Hash.prototype.regist = function( key, val ) {
	this.set[key] = val;
}

//保存する内容を削除
Hash.prototype.remove = function( key ) {
	this.set[key] = void( 0 );
	delete this.set[key];
}

//ハッシュをアドレスに反映させる
Hash.prototype.write = function( ) {
	var query = "";
	for( var key in this.set ) {
		query += key + "=" + this.set[key] + "&";
	}

	document.location.hash = query.substr( 0, query.length - 1 );
}

//ハッシュを読み込む
Hash.prototype.read = function( ) {
	var obj		= new Array( );
	var split	= document.location.hash.substr( 1 ).split( "&" );
	for( var i in split ) {
		var idx	= split[i].indexOf( "=" );
		var key	= split[i].substr( 0, idx );
		var val	= split[i].substr( idx + 1 );
		obj[key] = val;
	}
	if( obj.length > 0 )
		this.set = obj;

	return obj;
}

//ハッシュ初期化
Hash.prototype.clear = function( ) {
	this.set = new Array( );
	if( document.URL.indexOf( '#' ) != -1 )
		document.location.hash = '';
}





//########## Cookie ##########//

/* Test Code

	var cookie = new Cookie( );
	cookie.settime( 1, 0, 0, 0 );	//1日
	cookie.regist( "hoge", "foo" );
	cookie.regist( "hage", "bar" );
	cookie.write( );

	var obj = cookie.read( );
	for( var i in obj )
		alert( i + "=" + obj[i] );

*/

function Cookie( )
{
	this.limit	= new Date();
	this.set	= new Array( );
}

Cookie.prototype.setdomain = function( domain )
{
	this.domain = domain;
}

Cookie.prototype.setpath = function( path )
{
	this.path = path;
}

//クッキー保持期間の設定
Cookie.prototype.settime = function( day, hou, min, sec ) {
	var time = new Date( );
	day = day * 24 * 60 * 60 * 1000 ;
	hou = hou * 60 * 60 * 1000 ;
	min = min * 60 * 1000 ;
	sec = sec * 1000;
	time.setTime( time.getTime( ) + day + hou + min + sec );
	this.limit = time.toGMTString();
}

//保存する内容を登録
Cookie.prototype.regist = function( key, val ) {
	this.set[key] = val;
}

//保存する内容を削除
Cookie.prototype.remove = function( key ) {
	this.set[key] = void( 0 );
	delete this.set[key];
}

//クッキーに書き込む
Cookie.prototype.write = function( ) {
	var time	= ";expire=" + this.limit;
	var domain	= ";domain=" + this.domain;
	var path	= ";path=" + this.path;
	for( var key in this.set ) {
		var pair = key + "=" + this.set[key] + time + domain + path;
		document.cookie = pair;
	}
}

//クッキーを読み込む
Cookie.prototype.read = function( ) {
	var obj		= new Array( );
	var split	= document.cookie.split( "; " );
	for( var i = 0; i < split.length; i++ ) {
		if( split[i].length == 0 ) continue;
//		alert( "[" + split[i] + "]" );
		var idx	= split[i].indexOf( "=" );
		var key	= split[i].substr( 0, idx );
		var val	= split[i].substr( idx + 1 );
		obj[key] = val;
	}
	if( obj.length > 0 )
		this.set = obj;

	return obj;
}

//クッキー初期化
Cookie.prototype.clear = function( ) {
	this.settime( 0, 0, 0, -1 );
	this.write( );
}






//########## Layer ##########//

/* Test Code

	var layer = new Layer( 'layer', 'LAYER HTML', document.body );
	layer.setPos( 150, 150 );

*/

function Layer( name, inner, parent )
{
	this.name	= name;
	this.parent	= parent;
	this.drag	= false;

	this.makeLayer( parent );
	this.setInner( inner );
	this.setMouseEvent( );
}

//レイヤー作成
Layer.prototype.makeLayer = function( parent ) {
	var div	= document.createElement( 'div' );
	div.id	= this.name;

	with( div.style ) {
		display		= 'block';
		position	= 'absolute';
		left		= '0px';
		top			= '0px';
	}
	div.className	= 'param_layer'

	this.layer_div = div;
	this.layer_div.controller = this;

	parent.appendChild( div );
}

//レイヤー削除
Layer.prototype.removeLayer = function( ) {
	this.parent.removeChild( gid( this.name ) );
	layer[this.name] = void( 0 );
	delete layer[this.name];
	delete this;
}

//HTML挿入
Layer.prototype.setInner = function( inner ) {
	if( void( 0 )==inner || inner == null ) return;
	if( typeof( inner )=='object' ) {
		this.element( ).innerHTML = '';
		this.element( ).appendChild( inner );
	}
	else {
		this.element( ).innerHTML = inner;
	}
}

//表示位置設定
Layer.prototype.setPos = function( x, y ) {
	with( this.element( ).style ) {
		left	= parseInt( x ) + 'px';
		top		= parseInt( y ) + 'px';
	}
}

//表示する
Layer.prototype.show = function( ) {
	return this.element( ).style.display = 'block';
}

//隠す
Layer.prototype.hide = function( ) {
	return this.element( ).style.display = 'none';
}

//要素取得
Layer.prototype.element = function( ) {
	return this.layer_div;
}

//マウスイベント設定
Layer.prototype.setMouseEvent = function( ) {
	this.element( ).onmousedown	= this.do_onmousedown;
	this.element( ).onmouseup	= this.do_onmouseup;
	this.element( ).onmousemove	= this.do_onmousemove;
//	this.element( ).ondblclick	= this.do_ondblclick;
}

//ドラッグ開始
Layer.prototype.do_onmousedown = function( event ) {
	var obj	= layer[this.id];
	if( is_gecko( ) ) {
		obj.X	= event.layerX;
		obj.Y	= event.layerY;
	}
	else {
		obj.X	= obj.element( ).style.pixelLeft - getMouseX( event );
		obj.Y	= obj.element( ).style.pixelTop - getMouseY( event );
		obj.X	*= ( -1 );
		obj.Y	*= ( -1 );
	}

	obj.drag = true;
	return false;
}

//ドラッグ終了
Layer.prototype.do_onmouseup = function( event ) {
	var obj		= layer[this.id];
	obj.drag	= false;
}

//ドラッグ中
Layer.prototype.do_onmousemove = function( event ) {
	var obj	= layer[this.id];
	if( obj.drag ) {
		var X = getMouseX( event );
		var Y = getMouseY( event );

		obj.setPos( X - obj.X, Y - obj.Y );
	}
}

//レイヤー消去
Layer.prototype.do_ondblclick = function( event ) {
	var obj	= layer[this.id];
	obj.removeLayer( );
}
