var anim=true;

function mbr_mketbl(arr,attrs) {
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

function mbr_actspan(el,hvr,stl) {
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

function mbr_colorize(el,hvr,color,mod) {
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
	this.disabled=(el.getAttribute("disabled")=="disabled"||el.disabled)?true:false;
	this.nme=el.getAttribute("name");
	this.maxl=parseInt(document.defaultView.getComputedStyle(el,"").width);
	this.val=parseInt(el.getAttribute("value"));
	this.mn=parseInt(el.getAttribute("min"));
	this.mx=parseInt(el.getAttribute("max"));
	this.zero=40;
	this.left=findPos(el)[0]+this.zero;
	this.scl=(this.mx-this.mn)/(this.maxl-this.zero);
	var timer;
	this.to=[70,700];

	this.div=document.createElement("div");
	this.inp=document.createElement("input");
	this.up=document.createElement("button");
	this.down=document.createElement("button");

	this.inp.slider=this;
	el.slider=this;

	this.up.innerHTML="";
	this.down.innerHTML="";
	this.up.setAttribute("style","visibility: hidden; position: absolute; top: 0px; right: 0px; height: 50%; width: 15px; padding: 0px; margin: 0px; font-size: 8px; border: 0px; border-bottom: 1px solid black; border-left: 1px solid black; border-radius: 0px 4px 0px 0px; background: #ddd;");
	this.down.setAttribute("style","visibility: hidden; position: absolute; bottom: 0px; right: 0px; height: 50%; width: 15px; padding: 0; margin: 0px; font-size: 8px; border: 0px; border-top: 0px solid black; border-left: 1px solid black; border-radius: 0px 0px 4px 0px; background: #ddd;");
	this.inp.value=this.val;
	this.inp.setAttribute("type","text");
	el.removeAttribute("name");
	this.inp.setAttribute("name",this.nme);
	this.inp.setAttribute("size","3");

	el.appendChild(this.div);
	el.appendChild(this.up);
	el.appendChild(this.down);
	this.div.appendChild(this.inp);

	el.onmouseover=function() {if(!_this.disabled){_this.up.style.visibility="visible";_this.down.style.visibility="visible";}}
	el.onmouseout=function() {if(!_this.disabled){_this.up.style.visibility="hidden";_this.down.style.visibility="hidden";}}

	el.onmousedown=function(e) {
		var e=window.event || e;
		if(!_this.disabled&&e.target!=_this.inp&&e.button==0&&e.target!=_this.up&&e.target!=_this.down) {
			_this.dimFind();
			_this.val=(e.pageX<_this.left)?_this.mn:((_this.maxl+_this.left-_this.zero<e.pageX)?_this.mx:Math.round(_this.mn+(e.pageX-_this.left)*_this.scl));
			_this.inp.value=_this.val;
			_this.setWidth();
			_this.reserved();
			calculate();
			window.onmousemove=function(e) {
				_this.val=(e.pageX<_this.left)?_this.mn:((_this.maxl+_this.left-_this.zero<e.pageX)?_this.mx:Math.round(_this.mn+(e.pageX-_this.left)*_this.scl));
				_this.inp.value=_this.val;
				_this.setWidth();
				_this.reserved();
				calculate();
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
		calculate();
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
		var e=window.event || e;
		if(e&&e.pageX&&e.target!=_this.up&&e.target!=_this.down&&e.target==el) this.div.style.width=(e.pageX<this.left||this.maxl+this.left-this.zero<e.pageX)?((this.zero+(parseInt(this.inp.value)-this.mn)/this.scl)+"px"):((e.pageX-this.left)+this.zero+"px");
		else this.div.style.width=Math.round(this.zero+((this.val-this.mn)/this.scl))+"px";
	}

	this.reserved=function() {};

	this.dimFind=function() {
		this.left=findPos(this.el)[0]+this.zero;
		this.maxl=parseInt(document.defaultView.getComputedStyle(this.el,"").width);
		this.scl=(this.mx-this.mn)/(this.maxl-this.zero);
	}

	this.up.onmousedown=function() {_this.inp.value=_this.val+1; _this.inp.onchange(); timer=setTimeout(function() {incr(1);}, _this.to[1]);}
	this.down.onmousedown=function() {_this.inp.value=_this.val-1; _this.inp.onchange(); timer=setTimeout(function() {incr(-1);}, _this.to[1]);}
	this.up.onmouseup=function() {clearTimeout(timer);}
	this.down.onmouseup=function() {clearTimeout(timer);}
	this.up.onmouseover=this.down.onmouseover=function() {this.style.backgroundColor="#0f0";}
	this.up.onmouseout=this.down.onmouseout=function() {this.style.backgroundColor="#ddd"; clearTimeout(timer);}

	this.setWidth();

	this.disable=function(a) {
		_this.disabled=a;
		if(a)_this.div.style.backgroundColor="#aaa";
		else _this.div.style.backgroundColor="";
		_this.inp.disabled=a;
	}

	this.recalc=function() {
		_this.maxl=parseInt(document.defaultView.getComputedStyle(el,"").width);
		_this.left=findPos(el)[0]+_this.zero;
		_this.scl=(_this.mx-_this.mn)/(_this.maxl-_this.zero);
		_this.setWidth();
	}

	if(this.disabled)this.disable(this.disabled);

	function incr(step) {
		_this.inp.value=_this.val+step;
		_this.inp.onchange();
		timer=setTimeout(function() {incr(step);}, _this.to[0]);
	}
}

function Progr(el) {
	this.maxl=parseInt(document.defaultView.getComputedStyle(el,"").height);
	this.val=parseInt(el.getAttribute("value"));
	this.mn=parseInt(el.getAttribute("min"));
	this.mx=parseInt(el.getAttribute("max"));
	this.lim=el.getAttribute("lim").split(",");
	this.lim[0]=parseInt(this.lim[0]);
	this.lim[1]=parseInt(this.lim[1]);
	this.scl=this.maxl/(this.mx-this.mn);

	this.limin=document.createElement("div");
	this.limax=document.createElement("div");
	this.bar=document.createElement("div");
	this.v=document.createElement("div");

	this.limin.setAttribute("class","limin");
	this.limax.setAttribute("class","limax");
	this.bar.setAttribute("class","pr_bar");

	this.limin.style.height=this.lim[0]*this.scl-1+"px";
	this.limax.style.bottom=this.lim[1]*this.scl-1+"px";

	this.bar.style.height=((this.val>this.mx)?this.mx:((this.val<this.mn)?this.mn:this.val))*this.scl+"px";

	el.appendChild(this.limin);
	el.appendChild(this.limax);
	el.appendChild(this.bar);
	this.bar.appendChild(this.v);
	this.v.innerHTML=this.val;

	this.limin.appendChild(document.createTextNode(this.lim[0]));
	this.limax.appendChild(document.createTextNode(this.lim[1]));

	this.change=function(val) {
		this.val=val;
		if(!this.val)this.val=0;
		this.v.innerHTML=this.val;
		this.bar.style.height=((this.val>this.mx)?this.mx:((this.val<this.mn)?this.mn:this.val))*this.scl+"px";
	}
}
