var onloadQue = [];

window.onload = function( )
{
	for( var i in onloadQue ) onloadQue[i]( );
}

var KC = {
	  space	: 32
	, pgup	: 33	//PageUp
	, pgdn	: 34	//PageDown
	, end	: 35
	, home	: 36
	, left	: 37
	, up	: 38
	, right	: 39
	, down	: 40
	, lt	: 188	//<
	, gt	: 190	//>
};

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

function showhide( obj ) {
	with( obj.style ) {
		display = ( display != "none" ) ? "none" : "block";
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

function getScrollTop( )
{
	return ( is_gecko( ) ) ? document.documentElement.scrollTop : document.body.scrollTop;
}

function getScrollLeft( )
{
	return ( is_gecko( ) ) ? document.documentElement.scrollLeft : document.body.scrollLeft;
}

function getClientWidth( )
{
	return ( is_gecko( ) ) ? document.documentElement.clientWidth : document.body.clientWidth;
}

function getClientHeight( )
{
	return ( is_gecko( ) ) ? document.documentElement.clientHeight : document.body.clientHeight;
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

//########## Layer ##########//

/* Test Code

	var layer = new Layer( 'layer', 'LAYER HTML', document.body );
	layer.setPos( 150, 150 );

*/

var layer = [];

function Layer( name, inner, parent )
{
	this.name	= name;
	this.parent	= parent;
	this.drag	= false;
	this.f_drag	= true;

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

Layer.prototype.setDisplay = function( display ) {
	this.element( ).style.display = ( display ) ? "block" : "none";
}

Layer.prototype.getDisplay = function( ) {
	return ( this.element( ).style.display == "block" );
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

Layer.prototype.setDragStatus = function( flag ) {
	this.f_drag = flag;
}

//ドラッグ開始
Layer.prototype.do_onmousedown = function( event ) {
	var obj	= layer[this.id];
	if( !obj.f_drag ) return false;
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
	if( !obj.f_drag ) return false;
	obj.drag	= false;
}

//ドラッグ中
Layer.prototype.do_onmousemove = function( event ) {
	var obj	= layer[this.id];
	if( !obj.f_drag ) return false;
	if( obj.drag ) {
		var X = getMouseX( event );
		var Y = getMouseY( event );

		obj.setPos( X - obj.X, Y - obj.Y );
	}
}

//レイヤー消去
Layer.prototype.do_ondblclick = function( event ) {
//	var obj	= layer[this.id];
	this.removeLayer( );
}