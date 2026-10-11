'use strict';
// Rear-launched miniature drones share the ordinary projectile/collision pipeline.
const deployedDrones=[];
const dronesClearFx=clearCombatFx;
clearCombatFx=function(){deployedDrones.length=0;dronesClearFx()};
const DRONE_CONFIG={width:50,radius:19,hp:65,life:35,range:740,speed:180,shots:4,interval:.1,pause:2.6};
function droneActors(){return typeof duelActive!=='undefined'&&duelActive?duelPlayers.map(s=>s.actor):[p,...enemies]}
function allHunterDrones(){return [...deployedDrones,...(challengeRunning()&&challengeState.mode==='drones'?challengeState.drones:[])]}
function droneRoundActive(){return inArena&&!deployment&&!battleResult&&!(typeof duelActive!=='undefined'&&duelActive&&duelPlayers.some(s=>s.deployment))}
function makeHunterDrone(x,y,index,owner=null,stats=null){return {x,y,index,owner,ownerGeneration:owner?.generation,hp:65,maxHP:65,age:0,a:owner?.heading||0,launchDelay:owner?index*.2:0,cooldown:.7+index*.25,burst:0,shotWait:0,life:owner?DRONE_CONFIG.life:Infinity,stats:stats||{damage:3.7,penetration:.05},shield:false,alive:false,drone:true}}
const dronesInitialise=initialiseProgressMatch;
initialiseProgressMatch=function(duel){deployedDrones.length=0;dronesInitialise(duel);if(challengeState?.mode==='drones')challengeState.drones=challengeState.drones.map((d,i)=>makeHunterDrone(d.x,d.y,i))};
const droneFireWeapon=fireWeapon;
fireWeapon=function(id,offset,target=null){if(id!=='drones')return droneFireWeapon(id,offset,target);const owner=activeShooter||p;if(!aliveActor(owner)||owner.parts?.rear<=0)return;
 const existing=deployedDrones.filter(d=>d.owner===owner&&d.hp>0&&d.ownerGeneration===owner.generation).length;
 const stats=owner.human?weaponStats(id,owner.modifications?.support):owner===p?shotStats(id,offset):weaponStats(id);
 const m=weaponMount('support',id),a=owner.heading;
 for(let i=existing;i<3;i++){const lx=(i-1)*24,ly=m.y;const x=owner.x+(lx*Math.cos(a)-ly*Math.sin(a))*MECH_SCALE,y=owner.y+(lx*Math.sin(a)+ly*Math.cos(a))*MECH_SCALE;deployedDrones.push(makeHunterDrone(x,y,i,owner,stats));smokePuff(x,y,5,.25)}
 if(weaponRange&&rangeState?.running)rangeState.shotsFired+=3-existing;
};
function fireDroneBullet(d,target){if(rounds.length>=230)return;const a=Math.atan2(target.x-d.x,-(target.y-d.y)),x=d.x+Math.sin(a)*15,y=d.y-Math.cos(a)*15;
 Sound.play('fire-machine-gun',x,y,.65,null,true);
 flashes.push({x,y,r:4,max:7,life:.06,total:.06,color:'#ffd08a',muzzle:true,lightRadius:45});
 // Ownership excludes the launching mech, and lets ordinary shields/cover stop bullets.
 const owner=d.owner||d;
 rounds.push({owner,x,y,px:x,py:y,a,id:'machine-gun',stats:{...d.stats},speed:GUNS['machine-gun'].speed,life:1.1,age:0,trail:0,travel:0,droneSource:d});
}
function stepHunterDrones(dt){if(!droneRoundActive()||document.hidden)return;
 for(let i=deployedDrones.length-1;i>=0;i--){const d=deployedDrones[i];if(d.hp<=0||d.ownerGeneration!==d.owner.generation||!aliveActor(d.owner)||d.life<=0)deployedDrones.splice(i,1)}
 for(const d of allHunterDrones()){if(d.hp<=0)continue;d.age+=dt;d.life-=dt;d.launchDelay=Math.max(0,d.launchDelay-dt);if(d.launchDelay>0)continue;
  const living=droneActors().filter(aliveActor);if(!d.owner&&living.length<2){d.burst=0;continue}
  const candidates=living.filter(a=>a!==d.owner);candidates.sort((a,b)=>Math.hypot(a.x-d.x,a.y-d.y)-Math.hypot(b.x-d.x,b.y-d.y));const target=candidates[0];if(!target){d.burst=0;continue}
  const dx=target.x-d.x,dy=target.y-d.y,distance=Math.hypot(dx,dy);d.a=Math.atan2(dx,-dy);
  // Direct flight deliberately bypasses ground navigation and forcefield collisions.
  const orbit=d.age*.6+d.index*2.094,goalX=target.x+Math.cos(orbit)*290,goalY=target.y+Math.sin(orbit)*290;
  const gx=goalX-d.x,gy=goalY-d.y,len=Math.hypot(gx,gy),f=Math.min(1,DRONE_CONFIG.speed*dt/Math.max(1,len));
  d.x=Math.max(25,Math.min(ARENA.width-25,d.x+gx*f));d.y=Math.max(25,Math.min(ARENA.height-25,d.y+gy*f));
  d.cooldown=Math.max(0,d.cooldown-dt);d.shotWait-=dt;
  const clear=distance<DRONE_CONFIG.range&&!urbanSweep(d.x,d.y,target.x,target.y);
  if(!clear){d.burst=0;d.cooldown=Math.max(d.cooldown,.35);continue}
  if(!d.burst&&d.cooldown<=0){d.burst=DRONE_CONFIG.shots;d.shotWait=0}
  if(d.burst&&d.shotWait<=0){fireDroneBullet(d,target);d.burst--;d.shotWait+=DRONE_CONFIG.interval;if(!d.burst)d.cooldown=DRONE_CONFIG.pause}
 }
}
const dronesStepWeapons=stepWeapons;
stepWeapons=function(dt){dronesStepWeapons(dt);stepHunterDrones(dt)};
const hunterDroneSweep=sweepHit;
sweepHit=function(x,y,ex,ey,owner){let best=hunterDroneSweep(x,y,ex,ey,owner);if(!droneRoundActive())return best;const dx=ex-x,dy=ey-y,aa=dx*dx+dy*dy;if(!aa)return best;
 for(const d of allHunterDrones()){if(d.hp<=0||d.launchDelay>0||d===owner||d.owner&&d.owner===owner)continue;const cx=x-d.x,cy=y-d.y,b=2*(cx*dx+cy*dy),cc=cx*cx+cy*cy-DRONE_CONFIG.radius**2,disc=b*b-4*aa*cc;if(disc<0)continue;const t=cc<=0?0:(-b-Math.sqrt(disc))/(2*aa);if(t>=0&&t<=1&&t<(best?.t??1))best={x:x+dx*t,y:y+dy*t,t,target:d,drone:d,owner}}
 return best;
};
const hunterDroneImpact=impact;
impact=function(id,x,y,shield,stats=weaponStats(id),hit){if(!hit?.drone)return hunterDroneImpact(id,x,y,shield,stats,hit);const d=hit.drone;d.hp=Math.max(0,d.hp-stats.damage);puff(x,y,d.hp?'#fff0ba':'#ffb64e',d.hp?5:14,110,2,.35);Sound.play(d.hp?'hit-machine-gun':'hit-rotary',x,y,.65);if(!d.hp)addMark(x,y,12)};
function drawHunterDrones(c){if(!droneRoundActive())return;const im=images['drone-flight'];if(!im)return;
 for(const d of allHunterDrones()){if(d.hp<=0||d.launchDelay>0)continue;const bob=Math.sin(d.age*4+d.index)*2;
  c.save();c.translate(d.x+7,d.y+10);c.fillStyle='#0006';c.beginPath();c.ellipse(0,0,24,13,d.a,0,Math.PI*2);c.fill();c.restore();
  c.save();c.translate(d.x,d.y+bob);c.rotate(d.a);const h=DRONE_CONFIG.width*im.height/im.width;c.drawImage(im,-25,-h/2,50,h);
  c.globalAlpha=.35;c.strokeStyle='#d7d1a6';c.lineWidth=1.5;
  for(const x of [-15,15]){c.save();c.translate(x,0);c.rotate(d.age*36+d.index);for(let j=0;j<3;j++){c.rotate(Math.PI*2/3);c.beginPath();c.moveTo(2,0);c.lineTo(8,0);c.stroke()}c.restore()}
  c.restore();c.save();c.fillStyle='#071419';c.fillRect(d.x-18,d.y-25,36,3);c.fillStyle=d.owner?'#a5e8c5':'#ff8578';c.fillRect(d.x-18,d.y-25,36*d.hp/65,3);c.restore();
 }
}
// Draw in the common air/effects layer for both single-player and local duels.
const dronesDrawCosmetics=drawWeaponCosmetics;
drawWeaponCosmetics=function(c){dronesDrawCosmetics(c);drawHunterDrones(c)};
