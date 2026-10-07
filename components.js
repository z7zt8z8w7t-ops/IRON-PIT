'use strict';
const PART_MAX={hull:700,turret:320,leftTrack:200,rightTrack:200,left:170,right:170,rear:200};
const PART_LABEL={hull:'Hull',turret:'Turret',leftTrack:'Left track',rightTrack:'Right track',left:'Left weapon',right:'Right weapon',rear:'Support system'};
function resetParts(){enemy.parts={...PART_MAX};enemy.hp=PART_MAX.hull;enemy.lastPart='';enemy.partSmoke=0}
resetParts();
const alphaMasks={};
function prepareHitMasks(){if(!document.createElement)return;for(const id of ['chassis','turret',...side.map(v=>v[0]),...rear.map(v=>v[0])]){const im=images[id],c=document.createElement('canvas');c.width=im.width;c.height=im.height;const ctx=c.getContext('2d');ctx.drawImage(im,0,0);alphaMasks[id]={w:im.width,h:im.height,data:ctx.getImageData(0,0,im.width,im.height).data}}}
function enemyShapes(){return[
 {part:'rear',x:0,y:52,w:80,h:58,a:enemy.angle,id:enemyLoadout.rear},
 {part:'left',x:-99,y:-34,w:67,h:154,a:enemy.angle,id:enemyLoadout.left,flip:side.findIndex(v=>v[0]===enemyLoadout.left)>=6},
 {part:'right',x:99,y:-34,w:67,h:154,a:enemy.angle,id:enemyLoadout.right,flip:side.findIndex(v=>v[0]===enemyLoadout.right)<6},
 {part:'turret',x:0,y:-12,w:151,h:184,a:enemy.angle,id:'turret'},
 {part:'leftTrack',x:-66,y:30,w:48,h:170,a:enemy.heading,base:true},
 {part:'rightTrack',x:66,y:30,w:48,h:170,a:enemy.heading,base:true},
 {part:'hull',x:0,y:30,w:180,h:170,a:enemy.heading,id:'chassis'}
]}
function partLocal(x,y,s){const dx=(x-enemy.x)/.85,dy=(y-enemy.y)/.85;return{x:dx*Math.cos(s.a)+dy*Math.sin(s.a),y:-dx*Math.sin(s.a)+dy*Math.cos(s.a)}}
function enemyPartAt(x,y){if(!enemy.alive||Math.hypot(x-enemy.x,y-enemy.y)>190)return null;for(const s of enemyShapes()){if(!s.id&&!s.base)continue;const v=partLocal(x,y,s);if(Math.abs(v.x-s.x)>s.w/2||Math.abs(v.y-s.y)>s.h/2)continue;const mask=alphaMasks[s.base?'chassis':s.id];if(mask){let u=s.base?(v.x+90)/180:(v.x-s.x+s.w/2)/s.w,z=s.base?(v.y-30+85)/170:(v.y-s.y+s.h/2)/s.h;if(s.flip)u=1-u;const ix=Math.max(0,Math.min(mask.w-1,Math.floor(u*mask.w))),iy=Math.max(0,Math.min(mask.h-1,Math.floor(z*mask.h)));if(mask.data[(iy*mask.w+ix)*4+3]<32)continue}return s.part}return null}
function componentDistance(x,y,s){const v=partLocal(x,y,s);return Math.hypot(Math.max(0,Math.abs(v.x-s.x)-s.w/2),Math.max(0,Math.abs(v.y-s.y)-s.h/2))*.85}
function componentImpact(id,x,y,stats,hit){if(!enemy.alive)return;const direct=hit?.target===enemy?hit.part:enemyPartAt(x,y);if(direct)enemyHit(id,stats,1,false,direct);if(stats.blast)for(const s of enemyShapes()){if(!enemy.alive)break;if(s.part===direct||enemy.parts[s.part]<=0)continue;const d=componentDistance(x,y,s);if(d<stats.blast)enemyHit(id,stats,.45*(1-d/stats.blast),false,s.part)}}
function brokenSprite(c,id,x,y,w,h,flip,health,colour){c.save();if(health===0)c.filter='grayscale(1) brightness(.25)';sprite(c,id,x,y,w,h,flip,colour);c.restore()}
function drawPartStatus(c){if(!enemy.alive)return;let x=enemy.x-110,y=enemy.y+130;c.font='10px system-ui';for(const key of ['left','right','rear','leftTrack','rightTrack','turret']){c.fillStyle=enemy.parts[key]<=0?'#ff8877':'#bac9b0';c.fillText(PART_LABEL[key]+': '+Math.ceil(enemy.parts[key]),x,y);y+=13}if(enemy.lastPart){c.fillStyle='#ffce8b';c.fillText('HIT: '+PART_LABEL[enemy.lastPart],enemy.x-50,enemy.y-140)}}
