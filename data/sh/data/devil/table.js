window.onload = function( )
{
	tbl = new scrollTable( "remixtable", "variable", "both", 500, 500, 70, "1.2em", "3em" );
}

var tbl = null;

//type
//fixed		= カラム幅固定
//variable	= カラム幅可変

//scroll IEのみ有効
//x			= 縦スクロールのみ
//y			= 横スクロールのみ
//both		= x + y

//synchro
//top		= 各行一つ目の要素を抽出して横に配置
//side		= 一行目を抽出して真上に表示
//both		= top + side

function scrollTable( target, type, synchro,
						tableWidth, tableHeight, sideWidth, headerHeight, cellWidth )
{
	this.target			= target;
	this.type			= type;
	this.synchro		= synchro;
	this.tableWidth		= tableWidth;
	this.tableHeight	= tableHeight
	this.sideWidth		= sideWidth;
	this.headerHeight	= headerHeight;
	this.cellWidth		= cellWidth;

	this.moveRate		= 3.0;
	this.drag			= false;
	this.lastSX			= 0;
	this.lastSY			= 0;
	this.lastMX			= 0;
	this.lastMY			= 0;

	this.Init( );
}

scrollTable.prototype.Init = function( )
{
	//tableをdivに格納
	var twrapper	= gid( this.target );
	var table		= gidtag( this.target, "table" )[0];
	var tcontainer	= ele( "div" );
	tcontainer.id	= "tcontainer";
	var tbody		= ele( "div" );
	tbody.id		= "tbody";

	twrapper.appendChild( tcontainer );
	tcontainer.appendChild( tbody );
	tbody.appendChild( table );

	with( tbody.style ) {
		if( is_gecko( ) ) {
			overflow	= "scroll";
			cssFloat	= "right";
		}
		else {
			overflowX = "scroll";
			overflowY = "scroll";
			overflow	= "auto";
			styleFloat	= "right";
		}
		if( this.synchro == "top" )
			width	= this.tableWidth + this.sideWidth + "px";
		else
			width	= this.tableWidth + "px";
		if( this.type == "variable" ) {
			marginLeft	= "-" + this.sideWidth + "px";
			width		= "100%";
		}
		if( this.tableHeight ) height = this.tableHeight + "px";
	}
	if( this.type == "variable" && this.synchro != "top" ) {
		if( is_gecko( ) )
			table.style.paddingLeft = this.sideWidth + "px";
		else
			table.style.marginLeft = this.sideWidth + "px";
	}



	if( this.synchro != "top" ) {
		var tside		= ele( "div" );
		tside.id		= "tside";

		tcontainer.appendChild( tside );

		var tr		= gtn( table, "tr" );
		var buffer	= "";
		for( var i = (this.synchro=="both")?1:0; i < tr.length; i++ ) {
			buffer += '<tr><td>' + tr[i].firstChild.innerHTML + '</td></tr>';
			tr[i].firstChild.style.display = "none";
		}
		tside.innerHTML	= '<table id="tsidetable"><thead id="tsthead">' + buffer + '</thead></table>';

		with( tside.style ) {
			if( is_gecko( ) ) {
				overflow	= "hidden";
				cssFloat	= "left";
			}
			else {
				overflowX	= "hidden";
				overflowY	= "hidden";
				overflow	= "auto";
				styleFloat	= "left";
			}
			width		= this.sideWidth + "px";
			height		= tbody.clientHeight + "px";
		}
	}



	if( this.synchro != "side" ) {
		var thead		= ele( "div" );
		thead.id		= "thead";

		twrapper.insertBefore( thead, twrapper.firstChild );

		var td = gtn( gtn( table, "tr" )[0], "td" );
		var buffer	= "";
		for( var i = 0; i < td.length; i++ ) {
			if( this.synchro == "both" && i == 0 && !is_gecko( ) ) continue;
			buffer += '<td>' + td[i].innerHTML + '</td>';
		}
		gtn( table, "tr" )[0].style.display = "none";
		thead.innerHTML	= '<table id="theadtable"><thead id="ththead"><tr>' + buffer + '</tr></thead></table>';

		with( gid( "thead" ).style ) {
			if( is_gecko( ) ) {
				overflow	= "hidden";
			}
			else {
				overflowX	= "hidden";
				overflowY	= "hidden";
				overflow	= "auto";
			}
			height		= this.headerHeight;
			if( this.type == "variable" && this.synchro != "side" ) {
				width		= "100%";
			}
			else {
				width		= tbody.clientWidth + "px";
			}
			if( this.synchro == "both" && !is_gecko( ) ) {
				marginLeft	= this.sideWidth + "px";
				marginRight	= ( tbody.offsetWidth - tbody.clientWidth ) + "px";
			}
			if( this.synchro == "top" && !is_gecko( ) ) {
				marginRight	= ( tbody.offsetWidth - tbody.clientWidth ) + "px";
			}
		}
	}



	table.style.width = ( this.sideWidth * ( gtn( table, "tr" ).length - 1 ) ) + "px";
	if( this.synchro != "side" ) gid( "theadtable" ).style.width	= ( this.sideWidth * ( gtn( table, "tr" ).length - 1 ) ) + "px";

	if( this.type == "fixed" )
		twrapper.style.width = ( this.tableWidth + this.sideWidth ) + "px";
	else
		twrapper.style.width = "100%";


	var td = gtn( table, "td" );
	for( var i in td ) {
		var str = td[i].innerHTML;
		if( str )	td[i].className	= Race[str];
	}

	InsertRule( "#tbody * td", "text-align:center;width:" + this.cellWidth );
	InsertRule( "#thead * td", "text-align:center;width:" + this.cellWidth );
	InsertRule( "#tside * td", "text-align:center;width:" + this.sideWidth + "px" );
//	InsertRule( "#tside", "background:#fff;" );

	tbody.control		= this;
	tbody.onmousedown	= this.do_onmousedown;
	tbody.onmouseup		= function( ) { this.control.drag = false; };
	tbody.onmousemove	= this.do_onmousemove;
	tbody.onscroll		= this.scrollTBody;
}


scrollTable.prototype.scrollTBody = function( )
{
	if( this.control.synchro != "side" ) gid( "thead" ).scrollLeft = gid( "tbody" ).scrollLeft;
	if( this.control.synchro != "top" ) gid( "tside" ).scrollTop = gid( "tbody" ).scrollTop;
}

scrollTable.prototype.do_onmousedown = function( e )
{
	if( this.control.synchro != "top" ) {
		var mx = getMouseX( e ) - gid( "tside" ).offsetWidth;
		if( mx >= gid( "tbody" ).clientWidth && mx <= gid( "tbody" ).offsetWidth ) {
			this.control.drag = false;
			return false;
		}
	}
	if( this.control.synchro != "side" ) {
		var my = getMouseY( e ) - gid( "thead" ).offsetHeight;
		if( my >= gid( "tbody" ).clientHeight && my <= gid( "tbody" ).offsetHeight ) {
			this.control.drag = false;
			return false;
		}
	}
	if( this.control.drag ) {
		this.control.drag = false;
	}
	else {
		this.control.lastSX	= gid( "tbody" ).scrollLeft;
		this.control.lastSY	= gid( "tbody" ).scrollTop;
		this.control.lastMX	= getMouseX( e );
		this.control.lastMY	= getMouseY( e );
		this.control.drag	= true;
	}
	return false;
}

//ドラッグ中
scrollTable.prototype.do_onmousemove = function( e )
{
	if( this.control.synchro != "top" ) {
		var mx = getMouseX( e ) - gid( "tside" ).offsetWidth;
		if( mx >= gid( "tbody" ).clientWidth && mx <= gid( "tbody" ).offsetWidth ) {
			this.control.drag = false;
			return false;
		}
	}
	if( this.control.synchro != "side" ) {
		var my = getMouseY( e ) - gid( "thead" ).offsetHeight;
		if( my >= gid( "tbody" ).clientHeight && my <= gid( "tbody" ).offsetHeight ) {
			this.control.drag = false;
			return false;
		}
	}
	if( this.control.drag ) {
		var X = getMouseX( e );
		var Y = getMouseY( e );

		if( this.control.synchro != "side" ) {
			gid( "thead" ).scrollLeft	= this.control.lastSX - ( X - this.control.lastMX ) * this.control.moveRate;
			gid( "tbody" ).scrollLeft	= this.control.lastSX - ( X - this.control.lastMX ) * this.control.moveRate;
		}
		if( this.control.synchro != "top" ) {
			gid( "tside" ).scrollTop	= this.control.lastSY - ( Y - this.control.lastMY ) * this.control.moveRate;
			gid( "tbody" ).scrollTop	= this.control.lastSY - ( Y - this.control.lastMY ) * this.control.moveRate;
		}

		this.control.lastSX	= gid( "tbody" ).scrollLeft;
		this.control.lastSY	= gid( "tbody" ).scrollTop;
		this.control.lastMX	= getMouseX( e );
		this.control.lastMY	= getMouseY( e );
	}
}

function hiLight( )
{
	if( this.className ) {
		document.styleSheets[0].removeRule( 0 );
		document.styleSheets[0].addRule( "." + this.className, "{color:#faa;}", 0 );
	}
}

var Race = {
	  "魔神" : "majin"
	, "女神" : "megami"
	, "破壊神" : "hakai"
	, "地母神" : "dibo"
	, "鬼神" : "kisin"
	, "邪神" : "jasin"
	, "幻魔" : "genma"
	, "妖魔" : "youma"
	, "妖精" : "yousei"
	, "夜魔" : "yama"
	, "魔王" : "maou"
	, "大天使" : "daiten"
	, "天使" : "tensi"
	, "堕天使" : "daten"
	, "龍神" : "ryuujinn"
	, "龍王" : "ryuuou"
	, "邪龍" : "jaryuu"
	, "霊鳥" : "reityou"
	, "妖鳥" : "youtyou"
	, "凶鳥" : "kyoutyou"
	, "神獣" : "sinnjuu"
	, "聖獣" : "seijuu"
	, "魔獣" : "majuu"
	, "妖獣" : "youjuu"
	, "地霊" : "tirei"
	, "妖鬼" : "youki"
	, "鬼女" : "kijo"
	, "邪鬼" : "jaki"
	, "幽鬼" : "yuuki"
	, "悪霊" : "akuryou"
	, "屍鬼" : "siki"
	, "神樹" : "sinju"
	, "妖樹" : "youju"
	, "外道" : "gedou"
}



//common



function InsertRule( selector, property, index )
{
	if( !index ) index = 0;
	if( is_gecko( ) )
		document.styleSheets[0].insertRule( selector + "{" + property + "}", index );
	else
		document.styleSheets[0].addRule( selector, "{" + property + "}", index );
}

function gtn( obj, tag )
{
	return obj.getElementsByTagName( tag );
}