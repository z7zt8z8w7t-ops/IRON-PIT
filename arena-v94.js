'use strict';
// All belt geometry is expressed in the existing 600-unit grid.
const SCRAPYARD_BELTS94=Object.freeze([
 Object.freeze({x:900,y:300,length:1500,width:300,angle:0,speed:85}),
 Object.freeze({x:900,y:2100,length:1500,width:300,angle:Math.PI,speed:85}),
 Object.freeze({x:900,y:1200,length:1200,width:300,angle:-Math.PI/2,speed:85})
]);
function scrapyardBeltAt94(x,y){return SCRAPYARD_BELTS94.find(b=>{const dx=x-b.x,dy=y-b.y,along=dx*Math.cos(b.angle)+dy*Math.sin(b.angle),across=-dx*Math.sin(b.angle)+dy*Math.cos(b.angle);return Math.abs(along)<b.length/2-105&&Math.abs(across)<b.width*.37;});}
const terrainStep94=stepTerrain;
stepTerrain=function(dt){terrainStep94(dt);if(arenaKind!=='scrapyard'||weaponRange||deployment||battleFinished())return;for(const actor of [p,...enemies]){if(!aliveActor(actor)||actor.ejecting)continue;const belt=scrapyardBeltAt94(actor.x,actor.y);if(!belt)continue;urbanMove(actor,actor.x+Math.cos(belt.angle)*belt.speed*dt,actor.y+Math.sin(belt.angle)*belt.speed*dt);}};
function drawScrapyardBelts94(c){const im=images['scrapyard-conveyor'];if(!im)return;const sx=25,sy=131,sw=2124,sh=433;
 for(const b of SCRAPYARD_BELTS94){c.save();c.translate(b.x,b.y);c.rotate(b.angle);c.drawImage(im,sx,sy,sw,sh,-b.length/2,-b.width/2,b.length,b.width);
  // Only the slats and painted arrows scroll; rollers, bolts and rails stay fixed.
  const edge=105,band=b.width*.74,tileWidth=600,phase=(terrainClock*b.speed)%tileWidth,left=-b.length/2+edge,right=b.length/2-edge;
  c.save();c.beginPath();c.rect(left,-band/2,right-left,band);c.clip();for(let x=left-tileWidth+phase;x<right;x+=tileWidth)c.drawImage(im,224,190,1690,320,x,-band/2,tileWidth,band);c.restore();c.restore();
 }
}
let foundryEmbers94=null;
function foundryFloor94(){if(foundryEmbers94)return foundryEmbers94;const im=images['rebuilt-foundry'];if(!im)return null;const cv=document.createElement('canvas');cv.width=im.width;cv.height=im.height;const c=cv.getContext('2d');c.drawImage(im,0,0);const data=c.getImageData(0,0,cv.width,cv.height),px=data.data;
 // Suppress orange emissive gaps without darkening neutral beams or yellow paint.
 const xs=[0,363,724,1086],ys=[0,352,691,1035,1418,1448];
 for(let i=0;i<px.length;i+=4){const pixel=i/4,x=(pixel%cv.width)*1086/cv.width,y=Math.floor(pixel/cv.width)*1448/cv.height;if(xs.some(v=>Math.abs(x-v)<24)||ys.some(v=>Math.abs(y-v)<24))continue;const r=px[i],g=px[i+1],b=px[i+2];if(r<50||r<g*1.10||r<b*1.30)continue;const strength=Math.min(1,(r-b)/40),dim=1-.90*strength;px[i]=Math.round(r*dim);px[i+1]=Math.round(g*dim);px[i+2]=Math.round(b*dim);}
 c.putImageData(data,0,0);foundryEmbers94=cv;return cv;
}
const floorDraw94=rebuiltDrawFloor;
rebuiltDrawFloor=function(c){if(arenaKind==='foundry'&&rebuiltAssetsReady){const original=images['rebuilt-foundry'],dim=foundryFloor94();if(dim){images['rebuilt-foundry']=dim;try{return floorDraw94(c);}finally{images['rebuilt-foundry']=original;}}}floorDraw94(c);if(arenaKind==='scrapyard'&&rebuiltAssetsReady)drawScrapyardBelts94(c);};
let blackoutTowerPools94=null;
function towerPools94(){if(blackoutTowerPools94)return blackoutTowerPools94;const im=images['rebuilt-blackout'];if(!im)return null;const radius=190;blackoutTowerPools94=rebuiltNodes().map(n=>{const cv=document.createElement('canvas');cv.width=cv.height=radius*2;const c=cv.getContext('2d');c.drawImage(im,im.width/1800*(n.x-radius),im.height/2400*(n.y-radius),im.width/1800*radius*2,im.height/2400*radius*2,0,0,radius*2,radius*2);c.globalCompositeOperation='source-atop';c.fillStyle='#4b9dce45';c.fillRect(0,0,cv.width,cv.height);c.globalCompositeOperation='destination-in';const g=c.createRadialGradient(radius,radius,10,radius,radius,radius);g.addColorStop(0,'rgba(255,255,255,.25)');g.addColorStop(.4,'rgba(255,255,255,.12)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,cv.width,cv.height);return{x:n.x-radius,y:n.y-radius,canvas:cv};});return blackoutTowerPools94;}
const nightDraw94=drawUrbanNight;
drawUrbanNight=function(c){nightDraw94(c);if(arenaKind!=='blackout'||!rebuiltAssetsReady)return;const pools=towerPools94();if(!pools)return;c.save();c.globalCompositeOperation='screen';for(const pool of pools)c.drawImage(pool.canvas,pool.x,pool.y,380,380);c.restore();};
