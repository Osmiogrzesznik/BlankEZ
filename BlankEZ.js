var tolerance=1000;

function greenScreen(imageData,tolerance) {
   
    var data = imageData.data;
    var start = {
        red: data[0],
        green: data[1],
        blue: data[2]
    };

    // iterate over all pixels
    for(var i = 0, n = data.length; i < n; i += 4) {
        var diff = Math.abs(data[i] - data[0]) + Math.abs(data[i+1] - data[1]) + Math.abs(data[i+2] - data[2]);
        data[i + 3] = (diff*diff)/tolerance;
    }
    
    B.ctx2.putImageData(imageData, 0, 0);
    //$container.css('background',$('#color').val());
return imageData;
}

var imageLoader = document.getElementById('imageLoader');

    imageLoader.addEventListener('change', handleImage, false);



function handleImage(e){

    var reader = new FileReader();
    reader.onload = function(event){
        eZ.img = new Image();
        eZ.img.onload = function(){
    let d=eZ.suggestDims(this.width,this.height);
           
    cnv = document.createElement('canvas');
//    cnv.style.border="10px solid red";
  //  cnv.style.padding="10px";
    cnv.id = "cnv";
    cnv.width= d.x;
    cnv.height= d.y;
    B.cnv = cnv;
    B.ctx = cnv.getContext('2d');
    B.ctx.drawImage(eZ.img, 0, 0, cnv.width, cnv.height);

 document.body.appendChild(cnv);
B.imageData = B.ctx.getImageData(0, 0, cnv.width, cnv.height);

cnv2 = document.createElement('canvas');
 cnv2.style.border="1px solid red";
 cnv2.style.padding="1px";
    cnv2.id = "cnv2";
    cnv2.width= d.x;
    cnv2.height= d.y;
    B.cnv2 = cnv2;
    B.ctx2 = cnv2.getContext('2d');

 document.body.appendChild(cnv2);

eZ.imageData = greenScreen(B.imageData,tolerance);


eZ.img2 = new Image();

eZ.img2.onload = function(){


 document.body.appendChild(eZ.img2);
eZ.prepareAndDraw();}
eZ.img2.src =B.cnv2.toDataURL('image/webp');





       
        }
        eZ.img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}



var B= {
byId: function(x){
return document.getElementById(x);
},
prec: function(x,d){
return Math.round(x/d)*d;
}
}



window.addEventListener('load',function(){


eZ.init({controlsDestinations:["controls"]});

var nodeList = document.getElementsByClassName('draggable');
 
  for(var i=0;i<nodeList.length;i++) {
    var obj = nodeList[i];

    obj.addEventListener('touchmove', function(event) {
 	    event.preventDefault(); 
 	     moveControls(event);
 	   }, false);


	obj.addEventListener('touchcancel', function(event) {
    	 event.preventDefault(); 
    	  moveControls(event);
	    }, false);

  }

B.byId("rot90").addEventListener('change',function(e){
     
	eZ.bools.rot90 = e.target.checked;
	eZ.prepareAndDraw();
	alert(eZ.bools.rot90);


},false);


B.byId("maxAbsolute").addEventListener('change',function(e){
     
	eZ.bools.maxAbsolute = e.target.checked;
	eZ.prepareAndDraw();
	alert(eZ.bools.maxAbsolute);


},false);



}, false);// end of onload listener




var eZ = {
suggestDims: function(ix,iy){
let 
/*
ix= eZ.img.width,
iy= eZ.img.height,*/
ir= ix/iy,
u= eZ.usr.parms,
dr = u.dx/u.dy,
nx1 = u.dy * ir,
ny1 = u.dy,
nx2 = u.dx,
ny2 = u.dx / ir;
nx1 = B.prec(nx1,1);
ny2 = B.prec(ny2,1);

dec= prompt("to keep image ratio enter:"
          +"\n\"op1\":dx="+nx1+" dy="+ny1
          +"\n\"op2\":dx="+nx2+" dy="+ny2
          +"\n\"x=\": calculate dy from given dx"
          +"\n\"y=\": calculate dx from given dy"
          +"\nanything else: dont keep the image ratio");

switch (dec){
 case "op1":u.dx=nx1;u.dy=ny1;break;
 case "op2":u.dx=nx2;u.dy=ny2;break;
 default:
 if (/=/.test(dec)){
  dec.replace(/s+/g,'');
  dar=dec.split('=');
  if (dar[0]=='x'){u.dy=B.prec(Number(dar[1])/ir,1)}
  else if(dar[0]=='y'){u.dx=B.prec(Number(dar[1])*ir,1)}
  else {alert("incorrect");suggestDims(ix,iy);}
  u["d"+dar[0]]=Number(dar[1]);
  }
 else{alert("not keeping ratio")}
}
 alert(
     "dx="+u.dx+" dy="+u.dy
     )
return {x:u.dx,y:u.dy};
},

init: function (options){
this.ctrls=1;
eZ.ctrls={cX:0,cY:0};
eZ.origmaxx;
eZ.origmaxy;
eZ.tempdx;
eZ.canvas = document.getElementById('canvas');
eZ.ctx = eZ.canvas.getContext('2d');
eZ.H =eZ.canvas.height;
eZ.W =eZ.canvas.width;
eZ.o = 4;
eZ.G54onCanvas={};
eZ.cSets=0;

if (options){
options.controlsDestinations ? 
	(eZ.deployControls(options.controlsDestinations),eZ.prepareAndDraw()):
	(alert("no options.controlDestinations array of Id\'s found in init() parameters!"),0);
	return;	
} 
else{
	alert("no options found in init() parameters!");
	return;
}

eZ.prepareAndDraw();
},

supportedEventsArray:['input'],

scales:{
spcy:0.1,
spcx:0.1,
dx:12.5,
dy:6.25,
startx:25,
starty:-12.5,
maxx:25,
maxy:-12.5,
sheetx:50,
sheety:25,
G54x:25,
G54y:-12.5,
},

incr:{
spcy:1,
spcx:1,
dx:5,
dy:5,
startx:5,
starty:-5,
maxx:5,
maxy:-5,
sheetx:1,
sheety:1,
G54x:1,
G54y:-1,

},



liveCtrls:{
spcy:"spc y",
spcx:"spc x",
dx:"dim x",
dy:"dim y",
startx:"offs x",
starty:"offs y",
maxx:"max x",
maxy:"max y",
sheetx:"sheet x",
sheety:"sheet y",
G54x:"G54x",
G54y:"G54y",

},



T1:"<div id=\'XXX\' class=\'group\'><div id=\'XXXlabel\' class=\'label\'>LABEL</div><input type=\'number\' id=\'XXXIO\' class=\'textIO\' onchange='eZ.txtinp(event,this)' value=",

T2:"></input><DIV id=\'XXXminus\' class=\'btnminus arrow\' onclick='eZ.minus(event,this)'></DIV><input type=\'range\' id=\'XXXs\' class=\'slider\'style=\'width:250px;\' value=",

T3:" oninput='eZ.updateRest(event,this);' onchange='eZ.updateAndDraw(event,this);'></input><DIV id=\'XXXplus\' class=\'btnplus arrow\' onclick='eZ.plus(event,this)'></DIV></div>",



deployControls: function(places){
let 
nArr = Object.keys(eZ.liveCtrls),
l = nArr.length,
gTA = [eZ.T1,eZ.T2,eZ.T3],
pL = places.length,
evs = eZ.supportedEventsArray,
evsl = evs.length;
eZ.grpIds={};


for(eZ.cSets; eZ.cSets < pL;eZ.cSets++)
	{
	
	let
	 s=eZ.cSets, 
	 plc = B.byId(places[s])
	
	
	for (i=0; i < l; i++){
		
		let 
		pN=nArr[i],//parameterName indexed
		pNi= nArr[i]+s,
          v=eZ.usr.parms[pN];
          gT=gTA[0]+v+gTA[1]+B.prec(v/eZ.scales[pN],1)+gTA[2];
		grp = gT.replace( /XXX/g , pNi );
		grp = grp.replace( /LABEL/g , eZ.liveCtrls[nArr[i]]);//usun to s potem
		
		eZ.grpIds[pNi]=pN;
         
		plc.innerHTML += grp;
		


           //alert(eZ.grpIds[pNi]);
          // alert(pNi);
		}
     //alert(JSON.stringify(eZ.grpIds));
	}
},

updateRest(e,el){
     
	let pNi= e.target.parentElement.id,
     pN = eZ.grpIds[pNi];
 //alert(pNi);



let outp =B.byId(pNi+"IO");
     let val=B.prec(e.target.value * eZ.scales[pN],1);
     val= eZ.setToDif0(pN,val,()=>B.prec(eZ.scales[pN]*4,1));

	eZ.usr.parms[pN] =outp.value= val;
	


},

updateAndDraw(e,el){

     eZ.updateRest(e,el);


	eZ.prepareAndDraw();
},

plus(e,el){
let pNi= e.target.parentElement.id,
pN = eZ.grpIds[pNi];
	eZ.usr.parms[pN] = B.byId(pNi+"IO").value =Number(B.byId(pNi+"IO").value) + eZ.incr[pN];
	eZ.prepareAndDraw();
},



minus(e,el){
let pNi= e.target.parentElement.id,
pN = eZ.grpIds[pNi];
eZ.usr.parms[pN] = B.byId(pNi+"IO").value =Number(B.byId(pNi+"IO").value) - eZ.incr[pN];
	eZ.prepareAndDraw();
},


txtinp(e,el){

let pNi= e.target.parentElement.id,
pN = eZ.grpIds[pNi];
eZ.usr.parms[pN] = B.byId(pNi+"s").value= e.target.value;
	eZ.prepareAndDraw();
},


setToDif0(pN,value,D){

if (pN == "dx" || pN == "dy")
{
value = !value ? D(value): value=0? D(value):value;
}

return value;
},


/*---------------------------PARAMETERS-----------------------------------------*/







bools:{
	  rot90 :                false        ,
	  maxAbsolute:             true      ,
	},



usr:{
	parms:{
		
			G54x:0,
			G54y:-0,
		
		sheetx:2500,
		sheety:1250,
	     spcy :          -10            ,
		 spcx :          -20             ,
		 dx:          240             ,	
		 dy:            340             ,
		 startx:          20                 ,
		 starty:          -10                ,
		 maxx:             2500                ,
		 maxy:        -1250          ,
		},
	},

calc:{
	 parms:{
		G54x:0,
			G54y:-0,
		sheetx:2500,
		sheety:1250,
         spcy :          0             ,
		spcx :          5             ,
		 dx:          200             ,	
		 dy:            300           ,
		 startx:          400                 ,
		 starty:          -400                ,
		 maxx:             2500                ,
		 maxy:        -1250          ,
		}
      },


rotate : function(rot){
let
c= eZ.calc.parms,
u= eZ.usr.parms,
y= -Math.abs(u.dy),//no matter usr puts -or + in calcs its -
x= -Math.abs(u.dx);//as above

c.dx = rot? y:x;
c.dy = rot? x:y;
},



prepareAndDraw: function(){
console.clear();
let 
c= eZ.calc.parms,
u= eZ.usr.parms;

c.spcx = u.spcx;
c.spcy = u.spcy;//zostaw tak moze ujemne wartosci sie przydadza
c.sheetx = Math.abs(u.sheetx);
c.sheety = Math.abs(u.sheety);





c.G54y = u.G54y;
c.G54x = -u.G54x;//odwracamy tylko znak x usra by pasowalo do canvas


c.maxx= eZ.bools.maxAbsolute ? 
	u.maxx : 
	u.maxx + u.startx;

c.maxy= eZ.bools.maxAbsolute ? 
	u.maxy : 
	u.maxy + u.starty;

c.maxx > c.sheetx ? 
     c.maxx=c.sheetx://nie odwracamy znaku jeszcze
     0;

Math.abs(c.maxy) > c.sheety ? 
    (c.maxy = -c.sheety):0;



c.starty= u.starty//tu moze byc bug , max w trybi nieabsolute
c.startx= -u.startx;//odwracamy iksy dla canvas
c.maxx= -c.maxx;//to samo

eZ.G54onCanvas={
       x:eZ.W+c.G54x-eZ.W*1/10,//maly offs zeby widac pktG54
       y:eZ.H+c.G54y-eZ.H*1/10
       };




eZ.rotate(eZ.bools.rot90); // takes care of dx and dy u->c process

eZ.drawEverything(eZ.ctx,eZ.canvas);



//this could return an array of objects later on
},




drawEverything: function (ctx,canvas){
/*
alert(eZ.img.width);
 alert(JSON.stringify(eZ.img.height));
*/

let
c= eZ.calc.parms,
u= eZ.usr.parms,
G54onCanvas=eZ.G54onCanvas;

var fontsize= Math.abs(c.dy/4);


var cycl=0;

canvas.width = canvas.width;//clear canvas

ctx.imageSmoothingEnabled = false;
ctx.save();


ctx.setLineDash([1,1,2,2,3,3,4,4]);



ctx.fillStyle = "gray";
ctx.fillRect
    (
    G54onCanvas.x- c.sheetx,
    G54onCanvas.y- c.sheety,
    c.sheetx,
    c.sheety,
    );

ctx.strokeStyle = "#FF00FF";
ctx.strokeRect
    (
    G54onCanvas.x - u.maxx,
    G54onCanvas.y + u.maxy,
    Math.abs(c.startx + u.maxx),
    Math.abs(c.starty - u.maxy),
    );



ctx.restore();

document.querySelector("#log").innerText = "";


for (var x=c.startx-c.spcx;
	Math.abs(x+c.dx)<=Math.abs(c.maxx)-c.spcx;
	x+=c.dx-c.spcx){

	for (var y=c.starty-c.spcy;
		Math.abs(y+c.dy)<=Math.abs(c.maxy)-c.spcy;
		y+=c.dy-c.spcy){
	
		//alert("x:"+x+" y:"+y);
		cycl++;
		eZ.drawPartBlock(x,y,c.dx,c.dy,G54onCanvas,cycl,fontsize);
	
	
	
	}

}

/*------------------Draws G54-----Still in drawEverything()-------- -------------*/



G54info = "G54 "+"x:"+u.G54x+" y:"+u.G54y;


ctx.strokeStyle="white";
ctx.lineWidth=4;


ctx.textAlign= "end";
ctx.font= fontsize+"px Arial";


ctx.strokeText(G54info,G54onCanvas.x-eZ.o,G54onCanvas.y-fontsize/4);

ctx.strokeRect
    (
    G54onCanvas.x-eZ.o,
    G54onCanvas.y-eZ.o,
    eZ.o,
    eZ.o,
    );


ctx.fillStyle = "green";

ctx.fillText(G54info,G54onCanvas.x-eZ.o,G54onCanvas.y-fontsize/4);




ctx.fillRect
    (
    G54onCanvas.x-eZ.o,
    G54onCanvas.y-eZ.o,
    eZ.o,
    eZ.o,
    );









}, // end of drawEverything



drawPartBlock:function(x,y,dx,dy,G54onCanvas,cycl,fontsize){
let ctx=eZ.ctx;





//


ctx.globalCompositeOperation = 'xor';
ctx.globalAlpha = 1;

ctx.fillStyle = "rgba(255,0,0,.5)";
ctx.fillRect
    (
    G54onCanvas.x+x+dx,
    G54onCanvas.y+y+dy,
    Math.abs(dx),
    Math.abs(dy),
    );
ctx.fill();





if (eZ.img2){

ctx.globalCompositeOperation = 'exclude';

ctx.drawImage
    (
    eZ.img2,
    G54onCanvas.x+x+dx,
    G54onCanvas.y+y+dy,
    Math.abs(dx),
    Math.abs(dy),
    );
}

ctx.globalCompositeOperation = 'source-over';

ctx.save();
ctx.setLineDash([5,10]);
ctx.lineWidth = 0.9
ctx.strokeStyle = "solid black";
ctx.strokeStyle = "black";
ctx.strokeRect
    (
    G54onCanvas.x+x+dx,
    G54onCanvas.y+y+dy,
    Math.abs(dx),
    Math.abs(dy),
    );
ctx.stroke();
ctx.restore();

let midx=(G54onCanvas.x+x+dx)+Math.abs(dx/2);
let midy=(G54onCanvas.y+y+dy)+Math.abs(dy/2);

//alert([midx,midy]);

let cinfo= cycl;
let xinfo = "x:"+(-x);
let yinfo = "y:"+y;


ctx.textAlign= "center";
ctx.font= fontsize+"px Arial";


ctx.strokeStyle="black";
ctx.lineWidth=4;

ctx.strokeText(cinfo,midx,midy-fontsize/2,Math.abs(dx)*3/4);


ctx.strokeStyle="white";

ctx.strokeText(xinfo,midx,midy+fontsize/2  ,Math.abs(dx)*3/4);
ctx.strokeText(yinfo,midx,midy+fontsize*3/2,Math.abs(dx)*3/4);




ctx.fillStyle="white";
ctx.fillText(cinfo,midx,midy-fontsize/2,Math.abs(dx)*3/4);

ctx.fillStyle="black";
ctx.fillText(xinfo,midx,midy+fontsize/2  ,Math.abs(dx)*3/4);
ctx.fillText(yinfo,midx,midy+fontsize*3/2,Math.abs(dx)*3/4);



document.querySelector("#log").innerText+=
("\n cycle:"+cycl+" x:" + x + " y:" + y);


console.warn("x:" + x
			+" y:" + y
/*
			+"\nG54onCanvasx drawnfrom:"+(G54onCanvas.x+x+dx)
			+"\nG54onCanvasy drawnfrom:"+(G54onCanvas.y+y+dy)
		    +"\nG54onCanvasx drawnto:"+(G54onCanvas.x+x)
		    +"\nG54onCanvasy drawnto:"+(G54onCanvas.y+y)
*/
		  );
}






}//------end of eZ object








function moveintoview(){}




function moveControls(event){

	var touch = event.targetTouches[0];
	if (touch){
      // Place element where the finger is

var sX = window.pageXOffset;
var sY = window.pageYOffset;
     
	      
	Ex = touch.pageX<0 ? "200px":touch.pageX-sX;
	Ey = touch.pageY<0 ? (console.log("touch beyond screen!:"+touch.pageY),'1000px'):touch.pageY-sY;
	Ex<100 ? Ex=100:0;
     Ey<100 ? Ey=100:0;



    Tstyle = event.target.parentElement.style;
      TzoomF= B.prec((Tstyle.zoom.replace("%","")/100),.01);
     


	eZ.ctrls.cX = Tstyle.left =B.prec(Ex/TzoomF,1)+'px';
     eZ.ctrls.cY = Tstyle.top =B.prec(Ey/TzoomF,1)+'px';

 // console.log();
  
     console.log([Tstyle.zoom,TzoomF,Ex,eZ.ctrls.cX]);
    

      
console.log("↹:\n"+eZ.ctrls.cX+"\n"+eZ.ctrls.cY)

//event.target.innerText="↹:\n"+ctrls.cX+"\n"+ctrls.cY;
	}
	else
	{alert(touch);}

}

































/*--------------------------IDEAS-----------------------------*/


/*


B:{
GrpTmplt:
'<div id="XXXgroup" class="group">
<div id="XXXlabel" class="label">space</div>
<input type="number" id="XXXIO" class="textIO" value=1 
></input>
<DIV id="XXXminus" class="btnminus arrow"></DIV>
<input type="range" id="XXX" class="slider"
 style="width:150px;"
max-value=30
 min-value=0 
></input>
<DIV id="XXXplus" class="btnplus arrow"></DIV>
</div><!--endof spcgroup-->',
}
w sumie łatwiej jest dodawać ten string 
i 
robić
bEZ.sldrgrp.replace(/XXX/g,parametername)

tylko potem dodac do kazdego elementu parametername eventlistener


function DeployControls


parameters : {

"spc":{
companions(IOcontrols):["textIO","rangeI","btnplus","btnminus"],
label:"space",
rangeToValueMultiplier:0.1,( *0.1 jest jak /10)
values:{
x:1
y:1
}
}


for each parameter spc,dx,dy,maxx,maxxy,startx,starty,G54,sheet,
i dwa ticki : rotate i maxAbsolute
generate div with id=parametername+"group"
generate text field of type number with id=parametername
generate companions with id=parametername+companion[name]


for each event supported input,change
if event is change then 
update values of parameter
update values of update companions
drawEverything()

if event is input then just update companions

B.byId(parameter).addEventListener(typeofeventsupported,

*/

//Zrob to


//funkcja rotate zamieniajaca dx i dy miejscami!!!!!(musi być zrobiona ze świadomościa innych znakòw na canvas ???





/*
do ponizszych rozkmin potrzebny jest minimalsafespace np 1mm pomiedzy czesciami , zeby nie bylo tak , ze :
a) wyjdzie ze program policzy sobie cienki jak wlosek pasek materialu ktory bedzie sie przepalal albo wyginal od goraca w gore

b)czesci moga sie poluzowac i wystawac - kolizja z nozzle (dyszą)
przy cieciu nastepnej czesci obok


minsafespace= i.e. 1 (mm)
minspc

n=Math.floor(maxx/(dx+minspc))

ILE CZESCI WEJDZIE NA SHEET PRZY MINIMALNEJ BEZPIECZNEJ ODLEGŁOŚCI

n=Math.floor(1000/(98+2))



space to reszta z dzielenia maxx/dx dzielona na tyle ile calych dx wejdzie w maxx
(tu bedzie uzyty %, czyli modulus)
SPC=((maxx/(dx+minspc))-Math.floor(maxx/(dx+minspc)))/n SPACING PARTS EQUALLY (NOT RECOMMENDED - BUGS(SPACE AT THE END?))

SPACE PARTS BETWEEN MINSPC AND MAXSPC(I.E. 4MM MAX)



n*dx+n*space
TRAJEKTORIA MASZYNOWE ZERA KAZDEJ CZESCI

((n+1)*dx)+ ((n+1)*space)
TRAJEKTORIA MASZYNOWE KONCA KAZDEJ CZESCI

NA CANVAS TRZEBA BEDZIE TO LICZYC JAKOS OD TYLU
Y IDZIE W MINUS DO GORY TAKZE Z Y-KIEM TRZEBA BEDZIE MIEC TO NA UWADZE PRZY OBLICZENIACH

max sheet w maszynie:2500 x 1250 y
dla canvas to jest 1250 yzero oraz -2500 xzero G54onCanvas


do ponizszych rozkmin potrzebny jest minimalsafespace np 1mm pomiedzy czesciami , zeby nie bylo tak , ze :
a) wyjdzie ze program policzy sobie cienki jak wlosek pasek materialu ktory bedzie sie przepalal albo wyginal od goraca w gore

b)czesci moga sie poluzowac i wystawac - kolizja z nozzle (dyszą)
przy cieciu nastepnej czesci obok


czesci zaczynaja sie od 0,0, czyli 0*dx+0*space,0  druga czesc to 1*dx+1*space,0 trzecia to 2*dx+2*space,0
 poweidzmy teraz ze czwarta, (3*dx + 3*space + dx + space) > maxx 
albo druga konczaca sie na 1*dx+1*space , wystaje poza sheet , czyli (1*dx+1*space) > maxx

maxx/dx=ileczesci bez odstepow wejdzie, pierwsza czesc na xy 0 0 druga na dx1 
*/

/*

opcja która może być zrobiona później dużo później 
służąca do Zazebiania czesci (nestingu), 

zrobisz zdjęcie części możliwie jak najbardziej prostopadle w dół
, program następnie uruchamia graficzny interfejs, Który pozwala użytkownikowi nakładać na siebie dwa duszki zdjęcia i mierzy offset zdjęć w stosunku do siebie w osi X oraz W osi Y.
*/


// max moglby byc podany jako wymiar sheeta a program sam kalkulować może gdzie się konczy ostatnia czesc i czy nie wykracza poza sheet. 
// co wiecej moglby dobierać najbezpieczniejsze/najefektywniejsze rozstawienie (wielkośc przerw w xsie pomiedzy czesciami) dzielac rozmiar sheeta przez podany dx (czy dy) uwzgledniajac tez ostatnia przerwe od krawedzi sheeta

// potrzeba dropdowna czy radio z defaultowymi maxX maxy  2500mm maxx
// 1250mm maxy
// jesli odznaczysz radio mozesz wypelnic pole z wymiarem w przypadku cutoffa(resztek)
// powinien policzyć tez ile powtorzeń "pól pracy" aczesci z tego bedzie(pole "ilosc czesci na pole pracy")... 
//moze wyswietlac na canvas, z osiami x i y i coprdynatami przy kazdym rzedzie/kolumnie wyswietlac liczbe rzedow kolumn i razy ile czesci na polecpracy 
// overlapx i overlapy jesli czesci sa zazębialne

//POTEM MOZE UZYWAC LICZNIKA DO przewidzenia kiedy koniec

//musi bycmin jeden zeby nie infinitować i konwertuj na ujemne jeśli jest dodatnia(nie ma dla d znaczenia






