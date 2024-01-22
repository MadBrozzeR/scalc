function mobileCalc() {
	var mobil=window.open("","mobil");
	var mwin=mobil;
	var moiltbl=new Array();
	var proptbl=new Array();
	var theads=["","Таблица масел","Таблица пропорций","Параметры будущего мыла"];
	var sliders=new Array();
	var seloils=new Array();
	var selacids=[];
	var cremcb=mwin.document.createElement("label");
	var totaloil;

	function mke_mass() {
		var input=mwin.document.createElement("input");
		input.className="m";
		input.chb=mwin.document.createElement("input");
		input.dsp=mwin.document.createElement("span");
		input.chb.type="checkbox";
		input.onchange=function() {input.chb.checked=true; input.chb.onchange();}
		input.value=0;
		input.dsp.innerHTML=0;
		input.eq=function() {input.dsp.innerHTML=input.value;}
		input.inp=input;

		return input;
	}

	function mke_slider(nme,val,mn,mx) {
		var div=mwin.document.createElement("input");
		div.inp=mwin.document.createElement("input");
		div.inp.dsp=mwin.document.createElement("span");
		div.type="range";
		div.inp.type="text";
		div.inp.className="m";
		div.inp.value=val;
		div.inp.setAttribute("name",nme);
		div.setAttribute("value",val);
		div.setAttribute("min",mn);
		div.setAttribute("max",mx);

		div.val=val;

		div.mass=mke_mass();
		div.mass.chb.onchange=function() {div.disable(this.checked);}

		div.inp.eq=function() {this.dsp.innerHTML=(this.disabled)?"Нет":("("+this.value+"%)");}
		div.inp.eq();
		div.onchange=function() {
			div.inp.value=parseFloat(div.value);
			div.val=parseFloat(div.inp.value);
			calculate(expt);
			div.mass.eq();
			div.inp.eq();
		}
		div.inp.onchange=function() {
			if(parseFloat(div.inp.value)>mx)div.inp.value=mx;
			else if(parseFloat(div.inp.value)<mn)div.inp.value=mn;
			div.value=parseFloat(div.inp.value);
			div.val=parseFloat(div.inp.value);
			calculate(expt);
			div.mass.eq();
			div.inp.eq();
		}

		div.disable=function(a) {
			div.disabled=a;
			div.inp.disabled=a;
			calculate(expt);
			div.mass.eq();
			div.inp.eq();
		}

		div.toVal=function(v) {
			div.val=v;
			div.value=v;
			div.inp.value=v;
			div.mass.eq();
			div.inp.eq();
		}

		return div;
	}

	function mke_progr(val,mn,mx,lim) {
		var div=mwin.document.createElement("div");
		div.style.height="25px";
		div.img=[new Image(),new Image(),new Image()];
		div.scl=100/(mx-mn);
		div.tbl=div.appendChild(mbr.mketbl([["","",""],[""]],"width=100%, height=100%, border=0, cellspacing=0, cellpadding=0"));
		div.div=div.tbl.d(1,0).appendChild(mwin.document.createElement("div"));
		div.vspan=mwin.document.createElement("span");

		div.div.style.width=(val-mn)*div.scl+"%";
		div.div.style.height="100%";
		div.div.style.background="blue";
		div.vspan.innerHTML=val;
		div.img[0].width="1";
		div.img[0].height="1";
		div.img[1].width="1";
		div.img[1].height="1";
		div.img[2].width="1";
		div.img[2].height="1";

		div.tbl.style.border="1px solid black";
		div.tbl.d(0,0).style.background="#f33";
		div.tbl.d(0,1).style.background="#afa";
		div.tbl.d(0,2).style.background="#f33";
		div.tbl.d(0,0).style.width=Math.round(div.scl*(lim[0]-mn)*100)/100+"%";
		div.tbl.d(0,2).style.width=Math.round(div.scl*(mx-lim[1])*100)/100+"%";
		div.tbl.d(1,0).colSpan=3;
		div.tbl.d(0,0).style.height="20%";
		div.tbl.d(1,0).style.height="80%";

		div.tbl.d(0,0).appendChild(div.img[0]);
		div.tbl.d(0,1).appendChild(div.img[1]);
		div.tbl.d(0,2).appendChild(div.img[2]);

		div.change=function(val) {
			div.div.style.width=(val-mn)*div.scl+"%";
			div.vspan.innerHTML=val;
		}

		return div;
	}

	function showtbl(tbl) {
		if(tbl.style.display=="none")tbl.style.display="inline-table";
		else tbl.style.display="none";
	}

	function showoil(el) {
		var i,ii=false;
		for(i=0;i<seloils.length;i++){
			if(seloils[i][0]==oils[el.i][0]) {ii=i; break;}
		}
		if(ii!==false) {
			seloils[ii].changevbl(el.checked);
		}
		else if(el.checked)addoil(el);

		calculate(expt);
	}

	function addacid(el) {
		var l=selacids.push({})-1;
		selacids[l].fullname=el.fullname;
		selacids[l].k=el.k;
		selacids[l].na=el.na;
		selacids[l].slider=mke_slider("","0","0",el.maxpc);
		selacids[l].r=[];
		selacids[l].r[0]=mwin.body.proptbl.insertRowBefore(11,[el.fullname,""]);
		selacids[l].r[1]=mwin.body.proptbl.insertRowBefore(11,[selacids[l].slider.inp,selacids[l].slider,selacids[l].slider.mass,selacids[l].slider.mass.chb]);
		selacids[l].r[2]=mwin.body.proptbl.insertRowBefore(11,[]);
		propgrp([selacids[l].r[0],selacids[l].r[1],selacids[l].r[2]],selacids[l].slider.mass);
		selacids[l].comp={
			box: selacids[l].slider.mass.chb,
			slider: selacids[l].slider,
			mass: selacids[l].slider.mass
		}
	}

	function addoil(el) {
		var l=seloils.push(oils[el.i])-1;
		seloils[l].chb=el;
		seloils[l].vbl=true;
		seloils[l].r=[];
		seloils[l].slider=mke_slider("",0,0,100);
		seloils[l].fix=seloils[l].slider.mass.chb;
		seloils[l].mass=seloils[l].slider.mass;
		seloils[l].koh=seloils[l][2][0];
		seloils[l].naoh=seloils[l][2][1];
		seloils[l].params=seloils[l][6].concat(seloils[l][4],seloils[l][5]);
		seloils[l].r[0]=mwin.body.proptbl.insertRowBefore(4,["Убрать",seloils[l][1],""]);
		seloils[l].r[1]=mwin.body.proptbl.insertRowBefore(4,[seloils[l].slider.inp,seloils[l].slider,seloils[l].slider.mass,seloils[l].slider.mass.chb]);
		seloils[l].r[2]=mwin.body.proptbl.insertRowBefore(4,[]);
		seloils[l].r[0].d[0].style.textAlign="center";

		propgrp([seloils[l].r[0],seloils[l].r[1],seloils[l].r[2]],seloils[l].mass);

		seloils[l].r[0].d[0].style.cursor="pointer";
		seloils[l].r[0].d[0].onclick=function() {seloils[l].changevbl(false);}

		seloils[l].changevbl=function(a) {
			if(this.chb.checked!=a)this.chb.checked=a;
			this.vbl=a;
			if(a) {
				mwin.body.proptbl.insertRowBefore(4,seloils[l].r[0]);
				mwin.body.proptbl.insertRowBefore(4,seloils[l].r[1]);
				mwin.body.proptbl.insertRowBefore(4,seloils[l].r[2]);
			}
			else {
				clearNode(seloils[l].r[0]);
				clearNode(seloils[l].r[1]);
				clearNode(seloils[l].r[2]);
			}
			calculate(expt);
		}
	}
	
	mwin.document.write("<?xml version=\"1.0\" encoding=\"utf-8\"?><!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\"><html><head></head><body></body></html>");
	mwin.head=mwin.document.getElementsByTagName("HEAD")[0];
	mwin.body=mwin.document.getElementsByTagName("BODY")[0];
	mwin.body.style.margin="0px";
	mwin.head.meta=mwin.head.appendChild(mwin.document.createElement("meta"));
	mwin.head.meta.setAttribute("name","viewport");
	mwin.head.meta.setAttribute("content","width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1");
	mwin.head.Link=mwin.head.appendChild(mwin.document.createElement("link"));
	mwin.head.Link.setAttribute("rel","stylesheet");
	mwin.head.Link.setAttribute("type","text/css");
	mwin.head.Link.setAttribute("href",css_mob);
	mwin.head.Title=mwin.head.appendChild(mwin.document.createElement("title"));
	mwin.head.Title.appendChild(mwin.document.createTextNode("Калькулятор"));

	for(i=0;i<oils.length;i++) {
		moiltbl[i]=[mwin.document.createElement("label")];
		moiltbl[i].div=moiltbl[i][0].appendChild(mwin.document.createElement("div"));
		moiltbl[i].chb=moiltbl[i].div.appendChild(mwin.document.createElement("input"));
		moiltbl[i].span=moiltbl[i].div.appendChild(mwin.document.createElement("span"));
		moiltbl[i].span.innerHTML=oils[i][1];
		moiltbl[i].chb.type="checkbox";
		moiltbl[i].chb.i=i;
		moiltbl[i].chb.onchange=function() {showoil(this);}
	}

	sliders[0]=[mke_slider("","33","0","200"),mke_slider("","2","0","100"),mke_slider("","30","0","100")];
	sliders[1]=[];
	cremcb.div=cremcb.appendChild(mwin.document.createElement("div"));
	cremcb.chb=cremcb.div.appendChild(mwin.document.createElement("input"));
	cremcb.chb.type="checkbox";
	sliders[0][2].disable(true);
	cremcb.chb.onchange=function() {sliders[0][2].disable(!this.checked);}

	totaloil=mke_mass();
	totaloil.value=500;
	totaloil.onchange=function() {calculate(expt);}
	totaloil.prct=mwin.document.createElement("div");
	totaloil.prct.val=totaloil.prct.appendChild(mwin.document.createElement("span"));
	totaloil.prct.appendChild(mwin.document.createTextNode("% "));
	totaloil.optim=totaloil.prct.appendChild(mwin.document.createElement("span"));
	totaloil.optim.innerHTML="(сбалансировать)";
	totaloil.prct.val.innerHTML="0";
	totaloil.prct.onclick=function() {opt_prc(expt);}

	var countspan=[mwin.document.createElement("span"),mwin.document.createElement("span"),mwin.document.createElement("span")];
	countspan[0].innerHTML=countspan[1].innerHTML=countspan[2].innerHTML="0";

	proptbl=[
		["%","Масла","Масса, г."],
		["Общий процент и вес масел"],
		[totaloil.prct,totaloil],
		[],
		["%","Дополнительно","Масса, г."],
		["Жидкость",""],
		[sliders[0][0].inp,sliders[0][0],sliders[0][0].mass,sliders[0][0].mass.chb],
		[],
		["Неомыляемые масла",""],
		[sliders[0][1].inp,sliders[0][1],"",""],
		[],
		[cremcb,"Крем-мыло (% NaOH)",""],
		[sliders[0][2].inp,sliders[0][2],"",""],
		[],
		["Итого NaOH",countspan[0]],
		["Итого KOH",countspan[1]],
		["Вес мыла",countspan[2]],
		["","","",""]
	];

	for(i=1;i<theads.length;i++) {
		theads[0]=theads[i];
		theads[i]=mwin.document.createElement("div");
		theads[i].innerHTML=theads[0];
	}

	mwin.body.oiltbl=mbr.mketbl(moiltbl,"width=100%, cellpadding=2, cellspacing=2, border=0, class=mOils");
	mwin.body.proptbl=mbr.mketbl(proptbl,"width=100%, cellpadding=0, cellspacing=0, border=1, class=mProp");

	for(i=0;i<acids.length;i++) {
		addacid(acids[i]);
	}

	mwin.body.proptbl.style.margin="10px 0px 10px 0px";

	function propgrp(arr,mas) {
		var i;
		var clkbl,disp,lft;
		for(i=0;i<arr[0].d.length;i++) {
			arr[0].d[i].className="h";
		}
		if(arr[0].d.length==1) {arr[0].d[0].colSpan=4;clkbl=arr[0].d[0];}
		else if(arr[0].d.length==2) {arr[0].d[0].colSpan=4;clkbl=arr[0].d[0]; disp=arr[0].d[1];}
		else if(arr[0].d.length==3) {arr[0].d[1].colSpan=3;clkbl=arr[0].d[1]; disp=arr[0].d[2]; lft=arr[0].d[0];}
		disp.colSpan=2;
		disp.style.display="none";

		for(i=0;i<arr[1].d.length;i++) {
			arr[1].d[i].className="d";
		}
		arr[2].d[0].className="span";
		arr[2].d[0].colSpan=4;
		if(mas) disp.appendChild(mas.dsp);

		function collapse() {
			if(arr[1].style.display=="none") {
				arr[1].style.display="table-row";
				arr[2].style.display="table-row";
				disp.style.display="none";
				clkbl.colSpan+=2;
				if(lft) {
					clkbl.colSpan-=1;
					lft.style.display="table-cell";
				}
			}
			else {
				arr[1].style.display="none";
				arr[2].style.display="none";
				disp.style.display="table-cell";
				clkbl.colSpan-=2;
				if(lft) {
					clkbl.colSpan+=1;
					lft.style.display="none";
				}
			}
		}
		collapse();
		clkbl.onclick=collapse;
		disp.onclick=collapse;
	}

	propgrp([mwin.body.proptbl.r[5],mwin.body.proptbl.r[6],mwin.body.proptbl.r[7]],sliders[0][0].mass);
	propgrp([mwin.body.proptbl.r[8],mwin.body.proptbl.r[9],mwin.body.proptbl.r[10]],sliders[0][1].inp);
	propgrp([mwin.body.proptbl.r[11],mwin.body.proptbl.r[12],mwin.body.proptbl.r[13]],sliders[0][2].inp);

	mwin.body.proptbl.cols(0).style.width="60px";
	mwin.body.proptbl.cols(2).style.width="100px";
	mwin.body.proptbl.cols(3).style.width="20px";
	mwin.body.proptbl.d(1,0).style.fontWeight="900";
	mwin.body.proptbl.d(0,2).colSpan=2;
	mwin.body.proptbl.d(4,2).colSpan=2;
	mwin.body.proptbl.d(2,0).colSpan=2;
	mwin.body.proptbl.d(2,1).colSpan=2;
	mwin.body.proptbl.d(1,0).colSpan=4;
	mwin.body.proptbl.d(14,0).colSpan=2;
	mwin.body.proptbl.d(14,1).colSpan=2;
	mwin.body.proptbl.d(15,0).colSpan=2;
	mwin.body.proptbl.d(15,1).colSpan=2;
	mwin.body.proptbl.d(16,0).colSpan=2;
	mwin.body.proptbl.d(16,1).colSpan=2;
	mwin.body.proptbl.r[3].className="span";
	mwin.body.proptbl.d(3,0).colSpan=4;
	mwin.body.proptbl.d(0,0).className="h1";
	mwin.body.proptbl.d(0,1).className="h1";
	mwin.body.proptbl.d(0,2).className="h1";
	mwin.body.proptbl.d(4,0).className="h1";
	mwin.body.proptbl.d(4,1).className="h1";
	mwin.body.proptbl.d(4,2).className="h1";
	mwin.body.proptbl.d(1,0).className="h";
	mwin.body.proptbl.d(2,0).className="d";
	mwin.body.proptbl.d(2,1).className="d";
	mwin.body.proptbl.d(14,0).className="c";
	mwin.body.proptbl.d(14,1).className="c";
	mwin.body.proptbl.d(15,0).className="c";
	mwin.body.proptbl.d(15,1).className="c";
	mwin.body.proptbl.d(16,0).className="c";
	mwin.body.proptbl.d(16,1).className="c";

	mwin.body.proptbl.d(11,0).style.textAlign="center";

	var pr_bar=[mke_progr(0,0,100,[29,54]),mke_progr(0,0,100,[12,22]),mke_progr(0,0,100,[44,69]),mke_progr(0,0,100,[14,46]),mke_progr(0,0,100,[16,48]),mke_progr(0,0,200,[41,70]),mke_progr(0,0,260,[136,165])];

	mwin.body.progrtbl=mbr.mketbl(
		[
			["Твёрдость",	pr_bar[0], pr_bar[0].vspan,"[29-54]"],
			["Очищение",	pr_bar[1], pr_bar[1].vspan,"[12-22]"],
			["Кондиция",	pr_bar[2], pr_bar[2].vspan,"[44-69]"],
			["Пузыри",	pr_bar[3], pr_bar[3].vspan,"[14-46]"],
			["Кремовость",	pr_bar[4], pr_bar[4].vspan,"[16-48]"],
			["Йодное",	pr_bar[5], pr_bar[5].vspan,"[41-70]"],
			["INS",		pr_bar[6], pr_bar[6].vspan,"[136-165]"]
		],
		"width=100%, class=mProgr"
	);
	mwin.body.progrtbl.cols(0).style.width="10px";
	mwin.body.progrtbl.cols(2).style.width="30px";
	mwin.body.progrtbl.cols(3).style.width="10px";

	mwin.body.maintbl=mwin.body.appendChild(mbr.mketbl([[theads[1]],[mwin.body.oiltbl],[theads[2]],[mwin.body.proptbl],[theads[3]],[mwin.body.progrtbl]],"width=100%, cellspacing=0, cellpadding=0, border=0, class=mTbl"));
	mwin.body.maintbl.d(0,0).className="h";
	mwin.body.maintbl.d(0,0).onclick=function() {showtbl(mwin.body.oiltbl);}
	mwin.body.maintbl.d(2,0).className="h";
	mwin.body.maintbl.d(2,0).onclick=function() {showtbl(mwin.body.proptbl);}
	mwin.body.maintbl.d(4,0).className="h";
	mwin.body.maintbl.d(4,0).onclick=function() {showtbl(mwin.body.progrtbl);}

	var expt=[totaloil,
		sliders[0][0].inp,
		sliders[0][1].inp,
		sliders[0][2].inp,
		sliders[0][0].mass.chb,
		cremcb.chb,
		sliders[0][0].mass,
		pr_bar,
		countspan[1],
		countspan[0],
		countspan[2],
		totaloil.prct.val,
		selacids,
		seloils
	];
}
