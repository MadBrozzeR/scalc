var anim=true;

var mbr={}

function vc(str) {
	var div=document.getElementById("vc");
	div.innerHTML=str;
}

function findPos(obj) {
	var el=obj;
	var left=0;
	var top=0;
	
	if(obj.offsetParent) {
		do {
			left+=obj.offsetLeft;
			top+=obj.offsetTop;
		} while(obj=obj.offsetParent);
		
/*		if(document.documentElement.scrollTop) {
			left-=document.documentElement.scrollLeft;
			top-=document.documentElement.scrollTop;
		}
		else if(document.body.scrollTop) {
			left-=/*window.pageXOffset-*//*document.body.scrollLeft;
			top-=/*window.pageYOffset-*//*document.body.scrollTop;
		}
		left=event.clientX-left;
		top=event.clientY-top;
*/
	}
	return [left,top];
}

mbr.mketbl=function(arr,attrs) {
	var tmp="";
	var table=document.createElement("table");
	table.r=[];
	var ii,jj;
	table.col=new Array();

	table.col[0]=table.appendChild(document.createElement("col"));

	function insVal(val) {
		return (typeof val == "string" || typeof val == "number")?document.createTextNode(val):val;
	}

	for(ii=0;ii<arr.length;ii++) {
		table.r[ii]=table.insertRow(-1);
		table.r[ii].d=[];
		for(jj=0;jj<arr[ii].length;jj++) {
			tmp=arr[ii][jj];
			arr[ii][jj]=table.r[ii].d[jj]=table.r[ii].insertCell(-1);
			arr[ii][jj].appendChild(insVal(tmp));
		}
		if(jj==0){
			arr[ii][jj]=table.r[ii].d[jj]=table.r[ii].insertCell(-1);
		}
	}
	table.setColAttr=function(n,attr,val) {
		for(ii=0;ii<arr.length;ii++) arr[ii][n].setAttribute(attr,val);
	}
	if(attrs) {
		var re=/\s*,\s*/;
		var attrs=attrs.split(re);
		re=/\s*=\s*/;
		for(ii=0;ii<attrs.length;ii++){
			attrs[ii]=attrs[ii].split(re);
			table.setAttribute(attrs[ii][0],attrs[ii][1]);
		}
	}
	table.d=function(a,b){
		return table.r[a].d[b];
	}

	table.insertRowBefore=function(a,arr) {
		var row;
		if (arr.tagName=="TR") row=arr;
		else {
			row=document.createElement("tr");
			row.d=[];
			var ii;
			for(ii=0;ii<arr.length;ii++) {
				row.d[ii]=row.insertCell(-1);
				row.d[ii].appendChild(insVal(arr[ii]));
			}
			if(ii==0){
				row.d[ii]=row.insertCell(-1);
			}
		}
		table.r[a].parentNode.insertBefore(row,table.r[a]);

		return row;
	}

	table.cols=function(n) {
		if(!table.col[n]) {
			var i;
			for(i=table.col.length;i<=n;i++) table.col[i]=table.col[i-1].parentNode.insertBefore(document.createElement("col"),table.col[i-1].nextSibling);
		}
		return table.col[n];
	}
	return table;
}

mbr.actspan=function(el,hvr,stl) {
	var doc=window.document;
	var _this=this;
	this.to=10;
	this.s0=doc.createElement("span");
	this.s1=doc.createElement("span");
	this.s2=doc.createElement("span");
	this.s1.setAttribute("style",stl);
	this.txt=el.innerHTML;
	this.pos=[0,0];
	this.hover=false;
	this.stop=[true,true];
	el.innerHTML="";
	el.appendChild(this.s0);
	el.appendChild(this.s1);
	el.appendChild(this.s2);
	this.s2.innerHTML=this.txt;
	el.action=this;

	this.colin=function() {
		if(_this.pos[1]<_this.txt.length) {
			if(_this.stop[0])_this.stop[0]=false;
			_this.pos[1]++;
			_this.move();
			setTimeout(function() {_this.colin();},_this.to);
		} else _this.stop[0]=true;
	}

	this.colout=function() {
		if(_this.pos[0]<_this.txt.length) {
			if(_this.stop[1])_this.stop[1]=false;
			_this.pos[0]++;
			_this.move();
			setTimeout(function() {_this.colout();},_this.to);
		} else {
			_this.stop[1]=true;
			_this.reset();
		}
	}

	this.move=function() {
		_this.s0.innerHTML=_this.txt.substr(0,_this.pos[0]);
		_this.s1.innerHTML=_this.txt.substr(_this.pos[0],_this.pos[1]-_this.pos[0]);
		_this.s2.innerHTML=_this.txt.substr(_this.pos[1]);
	}

	this.reset=function() {
		if(_this.stop[0]&&_this.stop[1]) {
			_this.s0.innerHTML="";
			_this.s1.innerHTML="";
			_this.s2.innerHTML=_this.txt;
			_this.pos=[0,0];
			if(_this.hover)_this.colin();
		}
	}

	this.initA=function() {
		if(_this.stop[0]) if(anim) _this.colin();
		else {
			_this.s1.innerHTML=_this.txt;
			_this.s2.innerHTML="";
		}
		_this.hover=true;
	}

	this.initB=function() {
		if(_this.stop[1]) if(anim) _this.colout();
		else {
			_this.s1.innerHTML="";
			_this.s2.innerHTML=_this.txt;
		}
		_this.hover=false;
	}

	if(hvr)hvr.onmouseover=_this.initA;
	if(hvr)hvr.onmouseout=_this.initB;
}

mbr.colorize=function(el,hvr,color,mod) {
	var _this=this;
	this.to=30;
	this.stp=10;
	this.pos=[0,1];
	this.hover=false;
	this.stop=[true,true];
	el.action=this;

	function modx(val) {
		if(mod=="bg") el.style.backgroundColor=val;
		else el.style.color=val;
	}

	this.colorind=function(a) {
		a.replace("#","");
		a.replace(/[^0-9A-Fa-f]/gi,"0");
		if(a.length>3) {
			while(a.length<6)a=a.concat("0");
		}
		else {
			while(a.length<3)a=a.concat("0");
			a=a.charAt(0)+a.charAt(0)+a.charAt(1)+a.charAt(1)+a.charAt(2)+a.charAt(2);
		}
		return [parseInt(a.substr(0,2),16) , parseInt(a.substr(2,2),16) , parseInt(a.substr(4,2),16)];
	}

	this.tocolor=function(arr) {
		return "#"+(arr[0]<16?"0":"")+arr[0].toString(16)+(arr[1]<16?"0":"")+arr[1].toString(16)+(arr[2]<16?"0":"")+arr[2].toString(16);
	}

	for(this.i=0;this.i<color.length;this.i++) color[this.i]=this.colorind(color[this.i]);

	modx(this.tocolor(color[0]));

	this.coldelta=function(col1,col2,hov) {
		var dr=Math.ceil((col2[0]-col1[0])/_this.stp);
		var dg=Math.ceil((col2[1]-col1[1])/_this.stp);
		var db=Math.ceil((col2[2]-col1[2])/_this.stp);
		_this.colmov(col1,col2,[dr,dg,db],0,hov);
	}

	this.colact=function(hov) {
		if(_this.stop[0])_this.stop[0]=false;
		if((_this.pos[1]>0&&_this.pos[0]+_this.pos[1]<color.length)||(_this.pos[1]<0&&_this.pos[0]+_this.pos[1]>-1)) {
			_this.coldelta(color[_this.pos[0]],color[_this.pos[0]+_this.pos[1]],hov);
			_this.pos[0]+=_this.pos[1];
		}
		else {
			_this.pos[1]=-_this.pos[1];
			if(_this.hover!=hov) {
				hov=_this.hover;
				_this.colact(hov);
			} else _this.stop[0]=true;
		}
	}

	this.colmov=function(col1,col2,arr,ind,hov) {
		if(ind+1<_this.stp) {
			ind++;
			modx(_this.tocolor([col1[0]+ind*arr[0],col1[1]+ind*arr[1],col1[2]+ind*arr[2]]));
			setTimeout(function() {_this.colmov(col1,col2,arr,ind,hov)}, _this.to);
		}
		else {
			modx(_this.tocolor(col2));
			_this.colact(hov);
		}
	}

	this.initA=function() {
		_this.hover=true;
		if(_this.stop[0]) {
			if(anim) _this.colact(_this.hover);
			else modx(_this.tocolor(color[color.length-1]));
		}
		return true;
	}

	this.initB=function() {
		_this.hover=false;
		if(_this.stop[0]) {
			if(anim) _this.colact(_this.hover);
			else modx(_this.tocolor(color[0]));
		}
		return true;
	}

	if(hvr)hvr.onmouseover=_this.initA;
	if(hvr)hvr.onmouseout=_this.initB;
}

mbr.progr=function(el) {
	var _this=this;
	this.el=el;
	this.mn=el.getAttribute("min")?parseFloat(el.getAttribute("min")):0;
	this.mx=el.getAttribute("max")?parseFloat(el.getAttribute("max")):100;
	this.value=el.getAttribute("value")?parseFloat(el.getAttribute("value")):this.mn;
	this.lim=el.getAttribute("lim")?el.getAttribute("lim"):(this.mn+","+this.mx);
	this.lim=this.lim.split(",");
	this.el.style.height="30px";
	this.el.style.position="relative";
	this.img=[new Image(),new Image(),new Image()];
	this.scl=100/(this.mx-this.mn);
	this.tbl=this.el.appendChild(mbr.mketbl([["","",""],[""]],"width=100%, height=100%, border=0, cellspacing=0, cellpadding=0"));
	this.div=this.tbl.d(1,0).appendChild(document.createElement("div"));
	this.vspan=document.createElement("span");
	this.lbl=el.appendChild(document.createElement("div"));
	this.el.action=this;

	this.lbl.innerHTML=el.getAttribute("label")?el.getAttribute("label"):"";
	this.lbl.style.position="absolute";
	this.lbl.style.bottom="2px";
	this.lbl.style.left="10px";
	this.div.style.width=(this.value-this.mn)*this.scl+"%";
	this.div.style.height="100%";
	this.div.style.background="blue";
	this.vspan.innerHTML=this.value;
	this.img[0].width="1";
	this.img[0].height="1";
	this.img[1].width="1";
	this.img[1].height="1";
	this.img[2].width="1";
	this.img[2].height="1";

	this.tbl.style.border="1px solid black";
	this.tbl.d(0,0).style.background="#f33";
	this.tbl.d(0,1).style.background="#afa";
	this.tbl.d(0,2).style.background="#f33";
	this.tbl.d(0,0).style.width=Math.round(this.scl*(parseFloat(this.lim[0])-this.mn)*100)/100+"%";
	this.tbl.d(0,2).style.width=Math.round(this.scl*(this.mx-parseFloat(this.lim[1]))*100)/100+"%";
	this.tbl.d(1,0).colSpan=3;
	this.tbl.d(0,0).style.height="20%";
	this.tbl.d(1,0).style.height="80%";

	this.tbl.d(0,0).appendChild(this.img[0]);
	this.tbl.d(0,1).appendChild(this.img[1]);
	this.tbl.d(0,2).appendChild(this.img[2]);

	this.change=function(val) {
		_this.div.style.width=(val-_this.mn)*_this.scl+"%";
		_this.vspan.innerHTML=val;
	}
}

mbr.switcher=function(el) {
	this.el=el;
	this.stp=[20,0];
	this.step=1;
	this.unit="px";
	this.pos=0;
	this.value;
	var _this=this;

	this.inp=this.el.appendChild(document.createElement("input"));
	this.list=el.getElementsByTagName("DIV")[0];
	this.els=this.list.getElementsByTagName("DIV");
	this.els.last=this.list.appendChild(document.createElement("div"));
	this.els.last.innerHTML=this.els[0].innerHTML;
	this.inp.type="hidden";
	this.inp.name=el.getAttribute("name")?el.getAttribute("name"):"";
	this.el.removeAttribute("name");
	this.el.style.cursor="default";
	this.el.style.position="relative";
	this.el.style.overflow="hidden";

	this.list.style.position="absolute";
	this.list.style.top="0px";
	this.list.style.left="0px";
	this.list.style.width="100%";
	this.stp[0]=parseFloat(document.defaultView.getComputedStyle(this.list,"").lineHeight);

	this.inp.value=this.value=this.els[0].getAttribute("value");

	function init() {
		if(_this.el.getAttribute("onchange"))_this.onchange=function() {eval(_this.el.getAttribute("onchange"));}
	}

	function moveTo() {
		if(_this.stp[1]<_this.stp[0]&&anim) {
			_this.stp[1]++;
			_this.list.style.top=-((_this.pos-1)*_this.stp[0])-_this.stp[1]+_this.unit;
			setTimeout(function() {moveTo();}, 5);
		} else {
			_this.stp[1]=0;
			_this.list.style.top=-(_this.pos*_this.stp[0])+_this.unit;
			if(_this.pos>=_this.els.length-1) {
				_this.pos=0;
				_this.list.style.top=-_this.pos*_this.stp[0]+_this.unit;
			}
		}
	}

	function chng() {
		_this.pos+=_this.step;
		_this.inp.value=_this.value=(_this.els[_this.pos].getAttribute("value"))?_this.els[_this.pos].getAttribute("value"):((_this.pos>(_this.els.length-2)&&_this.els[0].getAttribute("value"))?_this.els[0].getAttribute("value"):"");
		_this.onchange();
		moveTo();
	}

	this.el.onclick=function(){chng();}
	this.el.ondblclick=function() {return false;}

	this.onchange=function() {}

	init();
}

mbr.plusminus=function(el,val,step) {
	var tbl=el.appendChild(mbr.mketbl([[],[]],"cellspacing=0,cellpadding=0,height=100%,width=10"));
	tbl.up=tbl.d(0,0).appendChild(document.createElement("canvas"));
	tbl.down=tbl.d(1,0).appendChild(document.createElement("canvas"));
	tbl.to=[70,700];
	tbl.bg=["#bbb","#0f0"];
	var timer;

	function incr(step) {
		val.value=parseFloat(val.value)+step;
		val.onchange();
		timer=setTimeout(function() {incr(step);}, tbl.to[0]);
	}

	function dr_init(x,y) {
		tbl.up.setAttribute("width",x);
		tbl.up.setAttribute("height",y);
		tbl.up.c=tbl.up.getContext("2d");
		tbl.down.setAttribute("width",x);
		tbl.down.setAttribute("height",y);
		tbl.down.c=tbl.down.getContext("2d");
	}

	tbl.drow=function(mod) {
		dr_init(8,4);
		if(mod=="tri") {
			tbl.up.c.beginPath();
			tbl.up.c.moveTo(0,4);
			tbl.up.c.lineTo(8,4);
			tbl.up.c.lineTo(4,0);
			tbl.up.c.fill();

			tbl.down.c.beginPath();
			tbl.down.c.moveTo(0,0);
			tbl.down.c.lineTo(8,0);
			tbl.down.c.lineTo(4,4);
			tbl.down.c.fill();
		}
		else if(mod=="pm"){
			tbl.up.c.beginPath();
			tbl.up.c.moveTo(0,3.5);
			tbl.up.c.lineTo(8,3.5);
			tbl.up.c.lineTo(8,4.5);
			tbl.up.c.lineTo(0,4.5);
			tbl.up.c.moveTo(3.5,0);
			tbl.up.c.lineTo(3.5,8);
			tbl.up.c.lineTo(4.5,8);
			tbl.up.c.lineTo(4.5,0);
			tbl.up.c.closePath();
			tbl.up.c.stroke();

			tbl.down.c.beginPath();
			tbl.down.c.moveTo(0,3.5);
			tbl.down.c.lineTo(8,3.5);
			tbl.down.c.lineTo(8,4.5);
			tbl.down.c.lineTo(0,4.5);
			tbl.down.c.closePath();
			tbl.down.c.stroke();
		}
	}

	dr_init(1,1);

	el.style.position="relative";

	tbl.setAttribute("style","position: absolute; top: 0px; right: 0px; font-size: 2px; width: 15px; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: moz-none; -ms-user-select: none; user-select: none; line-height: 1px;");
	tbl.style.height=document.defaultView.getComputedStyle(el,"").height;
	tbl.d(0,0).className="up";
	tbl.d(1,0).className="down";

	tbl.d(0,0).setAttribute("style","height: 50%; background: "+tbl.bg[0]+"; text-align: center;");
	tbl.d(1,0).setAttribute("style","height: 50%; background: "+tbl.bg[0]+"; text-align: center;");

	tbl.d(0,0).onmousedown=function() {val.value=parseFloat(val.value)+step; val.onchange(); timer=setTimeout(function() {incr(step);}, tbl.to[1]);}
	tbl.d(1,0).onmousedown=function() {val.value=parseFloat(val.value)-step; val.onchange(); timer=setTimeout(function() {incr(-step);}, tbl.to[1]);}
	tbl.d(0,0).onmouseup=function() {clearTimeout(timer);}
	tbl.d(1,0).onmouseup=function() {clearTimeout(timer);}
	tbl.d(0,0).onmouseover=tbl.d(1,0).onmouseover=function() {this.style.backgroundColor=tbl.bg[1];}
	tbl.d(0,0).onmouseout=tbl.d(1,0).onmouseout=function() {this.style.backgroundColor=tbl.bg[0]; clearTimeout(timer);}

	tbl.target=function(a) {
		var arr=[tbl.up,tbl.down,tbl.d(0,0),tbl.d(1,0),tbl];
		for(var i=0;i<arr.length;i++) {
			if(arr[i]==a) return true;
		}
		return false;
	}

	return tbl;
}

mbr.number=function(el) {
	this.el=el;
	var _this=this;
	this.inp=el.appendChild(document.createElement("input"));
	this.lbl=el.appendChild(document.createElement("div"));
	this.mn=el.getAttribute("min")?parseFloat(el.getAttribute("min")):false;
	this.mx=el.getAttribute("max")?parseFloat(el.getAttribute("max")):false;
	this.stp=el.getAttribute("step")?parseFloat(el.getAttribute("step")):1;
	this.defval=this.value=el.getAttribute("value")?parseFloat(el.getAttribute("value")):(this.mn?this.mn:0);
	this.inp.value=this.value;
	this.inp.name=el.getAttribute("name")?el.getAttribute("name"):"";	

	function tonum(mod) {
		if(mod==1||mod==3)_this.value=_this.inp.value=_this.inp.value.replace(/[^0-9\.\-,]/g,"");
		if(mod==2||mod==3) {
			if(_this.mx!==false&&_this.inp.value>_this.mx)_this.value=_this.inp.value=_this.mx;
			else if(_this.mn!==false&&_this.inp.value<_this.mn)_this.value=_this.inp.value=_this.mn;
		}
	}

	this.defaults=function() {
		this.value=this.inp.value=this.defval;
	}

	el.style.position="relative";
	el.style.overflow="visible";
	this.inp.setAttribute("style","width: 100%; height: 100%; -moz-box-sizing: border-box; box-sizing: border-box;");

	this.lbl.className="label";
	this.lbl.setAttribute("style","position: absolute;");
	this.lbl.innerHTML=el.getAttribute("label")?el.getAttribute("label"):"";
	this.lbl.onclick=function() {_this.inp.focus(); _this.inp.value=""; _this.inp.value=_this.value;}

	this.bt=mbr.plusminus(el,this.inp,_this.stp);
	this.bt.style.visibility="hidden";
	this.bt.drow("tri");

	this.inp.onkeyup=function() {tonum(1);}
	this.inp.onchange=function() {tonum(2); _this.onchange();}

	el.onmouseover=function() {_this.bt.style.visibility="visible";}
	el.onmouseout=function() {_this.bt.style.visibility="hidden";}

	function init() {
		if(_this.el.getAttribute("onchange"))_this.onchange=function() {eval(_this.el.getAttribute("onchange"));}
	}

	this.onchange=function() {}

	init();
}
/*
mbr.slider=function(el) {
	var _this=this;
	this.el=el;
	el.action=this;
	this.mn=parseFloat(el.getAttribute("min"));
	this.mx=parseFloat(el.getAttribute("max"));
	this.scl=100/(this.mx-this.mn);
	this.value=el.getAttribute("value")?parseFloat(el.getAttribute("value")):this.mn;
	this.div=el.appendChild(document.createElement("div"));

	this.div.style.height="100%";
	this.div.style.width=(this.value-this.mn)*this.scl+"%";

	function mPos(e) {
		var e=window.event || e;
		return [e.pageX,e.pageY];
	}

	function sPos() {
		posFind(el)[0];
	}

	el.onclick=function() {
		alert(document.defaultView.getComputedStyle(el,"").width);
	}
}
*/
function setCookie(name, value, expires, path, domain) {
  var cookie = name + "=" + escape(value) + ";";
  if (expires) {
    // If it's a date
    if(expires instanceof Date) {
      // If it isn't a valid date
      if (isNaN(expires.getTime()))
       expires = new Date();
    }
    else
      expires = new Date(new Date().getTime() + parseInt(expires) * 1000 * 60 * 60 * 24);
    cookie += "expires=" + expires.toGMTString() + ";";
  }
  if (path)
    cookie += "path=" + path + ";";
  if (domain)
    cookie += "domain=" + domain + ";";
  document.cookie = cookie;
}

function getCookie(name) {
  var regexp = new RegExp("(?:^" + name + "|;\\s*"+ name + ")=(.*?)(?:;|$)", "g");
  var result = regexp.exec(document.cookie);
  return (result === null) ? null : unescape(result[1]);
}

function unsetCookie(name, path, domain) {
  // If the cookie exists
  if (getCookie(name))
    setCookie(name, "", -1, path, domain);
}

function slidObj(el) {
	this.el=el;
	var _this=this;
	this.zero=40;
	this.disabled=(el.getAttribute("disabled")=="disabled"||el.disabled)?true:false;
	this.nme=el.getAttribute("name");
	this.defval=this.val=parseInt(el.getAttribute("value"));
	this.mn=parseInt(el.getAttribute("min"));
	this.mx=parseInt(el.getAttribute("max"));

	this.dimFind=function() {
		this.left=findPos(this.el)[0]+this.zero;
		this.maxl=parseInt(document.defaultView.getComputedStyle(this.el,"").width);
		this.scl=(this.mx-this.mn)/(this.maxl-this.zero);
	}
	this.dimFind();

	this.defaults=function() {
		this.inp.value=this.defval;
		this.inp.onchange();
	}

	this.div=document.createElement("div");
	this.inp=document.createElement("input");
	this.bt=mbr.plusminus(el,this.inp,1);
	this.bt.style.visibility="hidden";
	this.bt.style.top="-1px";
	this.bt.style.right="-1px";
	this.bt.style.height="100%";
	this.bt.drow("tri");
	
	this.inp.slider=this;
	el.slider=this;

	this.inp.value=this.val;
	this.inp.type="text";
	el.removeAttribute("name");
	this.inp.setAttribute("name",this.nme);
	this.inp.setAttribute("size","3");

	el.appendChild(this.div);
	this.div.appendChild(this.inp);

	el.onmouseover=function() {if(!_this.disabled){_this.bt.style.visibility="visible";}}
	el.onmouseout=function() {if(!_this.disabled){_this.bt.style.visibility="hidden";}}

	function move(e) {
		_this.val=(e.pageX<_this.left)?_this.mn:((_this.maxl+_this.left-_this.zero<e.pageX)?_this.mx:Math.round(_this.mn+(e.pageX-_this.left)*_this.scl));
		_this.inp.value=_this.val;
		_this.setWidth();
		_this.reserved();
		_this.onchange();
	}

	function init() {
		if(el.getAttribute("onchange"))_this.onchange=function(){eval(el.getAttribute("onchange"));}
	}

	el.onmousedown=function(e) {
		var e=window.event || e;
		if(!_this.disabled&&e.target!=_this.inp&&e.button==0&&!_this.bt.target(e.target)) {
			_this.dimFind();
			move(e);
			window.onmousemove=function(e) {
				move(e);
			}
			window.onmouseup=function() {window.onmousemove=null; window.onmousedown=function() {return true;}}
			window.onmousedown=function() {return false;}
		}
		else if(_this.disabled) {return false;}
	}
	this.inp.onchange=function() {
		_this.dimFind();
		if(this.value>_this.mx) {_this.val=_this.mx;this.value=_this.val;}
		else if(this.value<_this.mn) {_this.val=_this.mn;this.value=_this.val;}
		else _this.val=parseFloat(this.value);
		_this.setWidth();
		_this.reserved();
		_this.onchange();
	}

	this.toVal=function(a) {
		_this.dimFind();
		if(a>_this.mx) {_this.val=_this.mx;this.inp.value=_this.val;}
		else if(a<_this.mn) {_this.val=_this.mn;this.inp.value=_this.val;}
		else {_this.val=a; this.inp.value=a;}
		_this.setWidth();
		_this.reserved();
	}

	this.setWidth=function() {
		if(isNaN(this.scl)) return false;
		var e=window.event || e;
		if(e&&e.pageX&&!_this.bt.target(e.target)&&e.target==el) this.div.style.width=(e.pageX<this.left||this.maxl+this.left-this.zero<e.pageX)?((this.zero+(parseInt(this.inp.value)-this.mn)/this.scl)+"px"):((e.pageX-this.left)+this.zero+"px");
		else this.div.style.width=Math.round(this.zero+((this.val-this.mn)/this.scl))+"px";
	}

	this.setWidth();

	this.disable=function(a) {
		_this.disabled=a;
		if(a)_this.div.style.backgroundColor="#aaa";
		else _this.div.style.backgroundColor="";
		_this.inp.disabled=a;
	}

	if(this.disabled)this.disable(this.disabled);

	this.reserved=function() {}
	this.onchange=function() {}

	init();

	var oldResize=window.onresize;
	window.onresize=function() {if(typeof oldResize == 'function')oldResize(); _this.dimFind(); _this.setWidth();}
}

function Progr(el) {
	this.maxl=parseInt(document.defaultView.getComputedStyle(el,"").height);
	this.val=parseInt(el.getAttribute("value"));
	this.mn=parseInt(el.getAttribute("min"));
	this.mx=parseInt(el.getAttribute("max"));
	this.lim=el.getAttribute("lim").split(",");
	this.lim[0]=parseInt(this.lim[0]);
	if(!isNaN(this.lim[1]))this.lim[1]=parseInt(this.lim[1]);
	this.scl=this.maxl/(this.mx-this.mn);

	this.limin=document.createElement("div");
	this.limax=document.createElement("div");
	this.bar=document.createElement("div");
	this.v=document.createElement("div");

	this.limin.setAttribute("class","limin");
	this.limax.setAttribute("class","limax");
	this.bar.setAttribute("class","pr_bar");

	var dec=parseInt(el.getAttribute("dec"));
	dec=(dec>0)?Math.pow(10,dec):1;

	if(this.lim[0]===0&&this.lim[1]===0) this.limax.style.display=this.limin.style.display="none";
	else if(this.lim.length==1) {
		this.limax.style.bottom=this.lim[0]*this.scl-1+"px";
		this.limax.appendChild(document.createTextNode(this.lim[0]));
		this.limin.style.display="none";
	}
	else {
		this.limin.style.height=this.lim[0]*this.scl-1+"px";
		this.limax.style.bottom=this.lim[1]*this.scl-1+"px";

		this.limin.appendChild(document.createTextNode(this.lim[0]));
		this.limax.appendChild(document.createTextNode(this.lim[1]));
	}

	this.bar.style.height=((this.val>this.mx)?this.mx:((this.val<this.mn)?this.mn:this.val))*this.scl+"px";

	el.appendChild(this.limin);
	el.appendChild(this.limax);
	el.appendChild(this.bar);
	this.bar.appendChild(this.v);
	this.v.innerHTML=this.val;

	this.change=function(val) {
		this.val=val;
		if(!this.val)this.val=0;
		this.v.innerHTML=Math.round(this.val*dec)/dec;
		this.bar.style.height=((this.val>this.mx)?this.mx:((this.val<this.mn)?this.mn:this.val))*this.scl+"px";
	}
}
