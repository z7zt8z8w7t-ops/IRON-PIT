'use strict';
const PALETTES={green:{name:'Green / white',cockpit:'Cyan'},red:{name:'Rust red / white',cockpit:'Amber'}};
const colourSprites={};
function rgbHue(r,g,b){const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;let h=0;if(d){h=max===r?((g-b)/d+6)%6:max===g?(b-r)/d+2:(r-g)/d+4;h/=6}return {h,s:max?d/max:0,v:max}}
function hsvRGB(h,s,v){const n=h*6,i=Math.floor(n),f=n-i,p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s);return [[v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]][i%6]}
function prepareColourSprites(){if(!document.createElement)return;for(const id of ['chassis','turret',...BIPED_ASSETS,...CHASSIS_ASSETS,...side.map(v=>v[0]),...rear.map(v=>v[0])]){const im=images[id],canvas=document.createElement('canvas');canvas.width=im.width;canvas.height=im.height;const c=canvas.getContext('2d');c.drawImage(im,0,0);const pixels=c.getImageData(0,0,canvas.width,canvas.height),d=pixels.data;for(let i=0;i<d.length;i+=4){if(d[i+3]===0)continue;const hsv=rgbHue(d[i]/255,d[i+1]/255,d[i+2]/255);let replacement=null;if(hsv.h>=.105&&hsv.h<=.48&&hsv.s>=.06&&hsv.s<.55&&hsv.v>=.16&&hsv.v<.65){replacement=hsvRGB(.012,Math.min(.72,hsv.s*1.8+.25),hsv.v)}else if(id==='turret'&&hsv.h>.46&&hsv.h<.60&&hsv.s>.45){replacement=hsvRGB(.095,hsv.s,hsv.v)}if(replacement)for(let k=0;k<3;k++)d[i+k]=Math.round(replacement[k]*255)}c.putImageData(pixels,0,0);colourSprites[id]=canvas}}
function colouredSprite(id,colour){return colour==='red'&&colourSprites[id]?colourSprites[id]:images[id]}
// v54 paint layers are clipped to armour pixels, retaining mechanical details.
Object.assign(PALETTES,{
 starter:{name:'Bare Steel · Scorched',cockpit:'Cyan',base:[.48,.50,.52]},
 inferno:{name:'Inferno',cockpit:'Cyan',base:[.13,.15,.17],accent:'#ff681c',pattern:'flames'},
 bluefire:{name:'Blue Fire',cockpit:'Cyan',base:[.15,.20,.25],accent:'#11bfff',pattern:'flames'},
 toxic:{name:'Toxic',cockpit:'Cyan',base:[.12,.15,.12],accent:'#9dee21',pattern:'flames'},
 shark:{name:'Shark',cockpit:'Cyan',base:[.25,.40,.52],pattern:'shark'},
 hazard:{name:'Hazard',cockpit:'Cyan',base:[.18,.19,.18],accent:'#efc62a',pattern:'stripes'},
 desertcamo:{name:'Desert Camo',cockpit:'Cyan',base:[.65,.55,.42],accent:'#4e4032',pattern:'camo'},
 urbancamo:{name:'Urban Camo',cockpit:'Cyan',base:[.37,.42,.46],accent:'#151b22',pattern:'camo'},
 snowcamo:{name:'Snow Camo',cockpit:'Cyan',base:[.77,.81,.82],accent:'#7a8590',pattern:'camo'},
 racer:{name:'Racer',cockpit:'Cyan',base:[.64,.08,.06],accent:'#eee9de',pattern:'racer'},
 reactor:{name:'Reactor',cockpit:'Cyan',base:[.31,.10,.49],accent:'#22e8f6',pattern:'circuit'},
 warworn:{name:'War Worn',cockpit:'Cyan',base:[.68,.26,.05],pattern:'wear'},
 midnightgold:{name:'Midnight Gold',cockpit:'Cyan',base:[.09,.10,.11],accent:'#d7ae53',pattern:'gold'},
 anarchy:{name:'Anarchy',cockpit:'Cyan',base:[.08,.09,.10],accent:'#e32829',pattern:'anarchy'}
});
const liverySprites=new Map();
function liveryNoise(x,y,k=0){return Math.abs(Math.sin(x*12.9898+y*78.233+k*31.13)*43758.5453)%1}
function paintLiverySprite(id,colour){const im=images[id],cfg=PALETTES[colour];if(!im||!cfg?.base)return im;const w=im.width,h=im.height,cv=document.createElement('canvas');cv.width=w;cv.height=h;const c=cv.getContext('2d');c.drawImage(im,0,0);const raw=c.getImageData(0,0,w,h),d=raw.data,mask=document.createElement('canvas');mask.width=w;mask.height=h;const mc=mask.getContext('2d'),md=mc.createImageData(w,h);
for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(!d[i+3])continue;const u0=x/w,v0=y/h;const tracked=id==='chassis'||id.includes('tank');const weapon=[...side,...rear].some(v=>v[0]===id);if(tracked&&(u0<.2||u0>.8)||weapon&&v0<.28)continue;const r=d[i]/255,g=d[i+1]/255,b=d[i+2]/255,hsv=rgbHue(r,g,b);const body=hsv.v>.20&&hsv.v<.95&&hsv.s<.60&&(hsv.h<.48||hsv.s<.12);if(!body)continue;const light=.38+hsv.v*1.14,n=liveryNoise(x,y),u=x/w,v=y/h;let tone=cfg.base;
if(cfg.pattern==='camo'){const patch=Math.sin(u*22+Math.sin(v*31)*2)+Math.cos(v*24+u*9);tone=patch>.7?cfg.base.map(k=>Math.min(.94,k+.17)):patch<-.6?cfg.base.map(k=>k*.56):cfg.base;}
if(colour==='starter'){const scorch=Math.exp(-((u-.23)**2+(v-.66)**2)/.015)+Math.exp(-((u-.76)**2+(v-.26)**2)/.012);tone=cfg.base.map(k=>k*(1-Math.min(.78,scorch*.72)));if(n>.967)tone=[.28,.17,.09];}
if(cfg.pattern==='wear'&&n>.76)tone=[.34,.36,.37];
for(let k=0;k<3;k++)d[i+k]=Math.max(0,Math.min(255,Math.round(tone[k]*light*255)));md.data[i]=md.data[i+1]=md.data[i+2]=255;md.data[i+3]=d[i+3];}
c.putImageData(raw,0,0);mc.putImageData(md,0,0);const overlay=document.createElement('canvas');overlay.width=w;overlay.height=h;const o=overlay.getContext('2d');o.scale(w,h);o.lineWidth=.028;o.fillStyle=cfg.accent||'#b8b9b5';o.strokeStyle=o.fillStyle;
if(cfg.pattern==='flames')for(const side of [-1,1])for(let n=0;n<4;n++){const x=.5+side*(.19+n*.035);o.beginPath();o.moveTo(x-.055,.95);o.bezierCurveTo(x-.08,.65,x+.07,.6,x,.27+n*.06);o.bezierCurveTo(x+.1,.55,x+.13,.72,x+.045,.95);o.fill();}
if(cfg.pattern==='stripes'){o.lineWidth=.085;for(let n=-1;n<2;n+=.24){o.beginPath();o.moveTo(n,0);o.lineTo(n+1,1);o.stroke();}}
if(cfg.pattern==='racer'){o.fillRect(.32,0,.055,1);o.fillRect(.625,0,.055,1);if(id.includes('tank')||id==='chassis'){o.font='bold .15px sans-serif';o.textAlign='center';o.fillText('07',.18,.6);o.fillText('07',.82,.6);}}
if(cfg.pattern==='circuit'||cfg.pattern==='gold'){o.lineWidth=.018;for(const side of [-1,1]){o.beginPath();o.moveTo(.5+side*.38,.12);o.lineTo(.5+side*.24,.35);o.lineTo(.5+side*.34,.58);o.lineTo(.5+side*.2,.92);o.stroke();}}
if(cfg.pattern==='anarchy'){o.lineWidth=.035;o.beginPath();o.arc(.26,.43,.15,0,Math.PI*2);o.stroke();o.beginPath();o.moveTo(.12,.62);o.lineTo(.25,.22);o.lineTo(.39,.62);o.moveTo(.12,.47);o.lineTo(.4,.45);o.stroke();for(let n=0;n<12;n++){o.fillStyle='#de222255';o.fillRect(.12+n*.023,.49+liveryNoise(n,3)*.05,.007,.08*liveryNoise(n,8));}}
if(colour==='starter'){o.strokeStyle='#c9c6b3';o.lineWidth=.012;o.strokeRect(.17,.57,.18,.14);for(let n=0;n<10;n++){o.beginPath();o.moveTo(.17+n*.02,.57);o.lineTo(.176+n*.02,.56);o.stroke();}o.font='bold .1px sans-serif';o.fillStyle='#dcdedb';o.fillText('01',.65,.8);}
if(cfg.pattern==='shark'&&(id==='chassis'||id.includes('tank')||id==='turret')){for(const side of [-1,1]){o.save();o.translate(.5+side*.27,.5);o.scale(side,1); // Mirror eyes and mouths in-place; jaws point outwards.
o.fillStyle='#a5171c';o.strokeStyle='#e7e5dc';o.lineWidth=.014;o.beginPath();o.moveTo(-.1,-.08);o.lineTo(.15,-.15);o.lineTo(.12,.22);o.lineTo(-.1,.12);o.closePath();o.fill();o.stroke();o.fillStyle='#f1e8d8';for(let n=0;n<5;n++){const x=-.08+n*.045;o.beginPath();o.moveTo(x,-.075-n*.015);o.lineTo(x+.034,-.09-n*.015);o.lineTo(x+.016,.025-n*.012);o.closePath();o.fill();o.beginPath();o.moveTo(x,.125+n*.016);o.lineTo(x+.035,.14+n*.016);o.lineTo(x+.018,.05+n*.012);o.closePath();o.fill();}o.fillStyle='#faf3e1';o.beginPath();o.moveTo(-.06,-.23);o.lineTo(.085,-.2);o.lineTo(.045,-.29);o.closePath();o.fill();o.fillStyle='#ee2628';o.beginPath();o.arc(.035,-.24,.022,0,7);o.fill();o.restore();}}
o.setTransform(1,0,0,1,0,0);o.globalCompositeOperation='destination-in';o.drawImage(mask,0,0);c.drawImage(overlay,0,0);return cv;}
const baseColouredSprite=colouredSprite;colouredSprite=function(id,colour){if(!PALETTES[colour]?.base)return baseColouredSprite(id,colour);const key=id+'|'+colour;if(!liverySprites.has(key)&&images[id])liverySprites.set(key,paintLiverySprite(id,colour));return liverySprites.get(key)||images[id]};
