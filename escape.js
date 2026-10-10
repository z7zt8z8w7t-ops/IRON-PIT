'use strict';
// A fatal hit launches the pilot before the conventional hull explosion.
// Manual eject retains its existing reactor detonation and three-second alarm.
const escapeHulls=[];
const escapeDestroy=destroyMech;
destroyMech=function(x,y,heading,angle,loadout){
 podFlights.push({x,y,a:angle,age:0,colour:loadout.colour,drift:x<ARENA.width/2?-1:1});
 Sound.play('eject-jet',x,y,.8,1,true);
 escapeHulls.push({x,y,heading,angle,loadout:{...loadout},age:0});
};
const escapeStep=stepCombatFx;
stepCombatFx=function(dt){escapeStep(dt);for(let i=escapeHulls.length-1;i>=0;i--){const h=escapeHulls[i];h.age+=dt;if(h.age>=.32){escapeDestroy(h.x,h.y,h.heading,h.angle,h.loadout);escapeHulls.splice(i,1)}}};
const escapeClear=clearCombatFx;
clearCombatFx=function(){escapeHulls.length=0;escapeClear()};
// Also wait for fatal hull explosions before settling a simultaneous kill.
const escapeVictory=checkProgressVictory;
checkProgressVictory=function(){if(!escapeHulls.length)escapeVictory()};
const escapeCosmetics=drawWeaponCosmetics;
drawWeaponCosmetics=function(c){for(const h of escapeHulls){mech(c,h.x,h.y,.85,h.heading,h.angle,h.loadout);c.save();c.translate(h.x,h.y);c.scale(.85,.85);c.rotate(h.angle);drawCockpitBay(c,h.age);c.restore()}escapeCosmetics(c)};
function escapePose(f){
 const t=f.age,drift=f.drift??(f.x<ARENA.width/2?-1:1);
 // Perspective lift towards the camera, ballistic fall, then canopy catch.
 const lift=t<1.1?210*Math.sin(t/1.1*Math.PI/2):t<1.85?210-85*((t-1.1)/.75)**2:125;
 const coast=Math.min(t,1.85),canopy=Math.max(0,Math.min(1,(t-1.85)/.3)),travel=Math.max(0,t-2.15);
 const x=f.x+drift*(42*coast*coast+travel*245)+Math.sin(travel*2.2)*12*canopy;
 const y=f.y-lift-30*coast+travel*20;
 const scale=t<1.1?.85+t*.95:t<1.85?1.895-(t-1.1)*.8:1.30+Math.sin(Math.min(1,(t-1.85)/.3)*Math.PI)*.13;
 return{x,y,scale,canopy,lift,tilt:Math.sin(travel*2.2)*.05*canopy};
}
function drawEscapeLayer(c,view){
 if(!podFlights.length)return;c.save();c.translate(view.x+view.w/2,view.y+view.h/2);c.scale(view.zoom,view.zoom);c.translate(-ARENA.width/2,-ARENA.height/2);
 for(const f of podFlights){const t=f.age,s=escapePose(f);c.save();c.translate(s.x,s.y);c.rotate(s.tilt);c.scale(s.scale,s.scale);
 if(t<.7){c.save();c.rotate(f.a);c.globalCompositeOperation='screen';const g=c.createLinearGradient(0,20,0,120);g.addColorStop(0,'#fff');g.addColorStop(.3,'#70e8ffdd');g.addColorStop(1,'#00baff00');c.fillStyle=g;c.beginPath();c.moveTo(-8,20);c.lineTo(0,120+Math.sin(t*93)*12);c.lineTo(8,20);c.fill();c.restore()}
 const im=colouredSprite('turret',f.colour);c.save();c.rotate(f.a*(1-s.canopy));c.shadowColor='#0009';c.shadowBlur=8;c.drawImage(im,im.width*.32,im.height*.34,im.width*.36,im.height*.51,-24,-40,48,80);c.restore();
 if(s.canopy>0){c.save();c.scale(s.canopy,s.canopy);c.translate(-7,-18);c.strokeStyle='#c2c6aa';c.lineWidth=.8;for(let k=0;k<12;k++){const a=k*Math.PI/6;c.beginPath();c.moveTo(Math.cos(a)*67,Math.sin(a)*65);c.lineTo(Math.cos(a)*12+7,Math.sin(a)*15+18);c.stroke()}const canopy=images['escape-canopy'];c.shadowColor='#0008';c.shadowBlur=7;c.shadowOffsetY=7;c.drawImage(canopy,-94,-91,188,182);c.restore()}
 c.restore();if(t<.7)softSmoke(c,f.x,f.y,20+t*45,.25*(1-t/.7));
 }c.restore();
}
