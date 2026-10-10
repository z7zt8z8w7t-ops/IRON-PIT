'use strict';
// Chassis mass and fitted equipment share the Workshop's weight units.
const CHASSIS_MASS={'tank-light':28,chassis:48,'tank-heavy':72,'biped-light':24,biped:44,'biped-heavy':68};
function mechMass(actor){const b=actorLoadout(actor);return (CHASSIS_MASS[b.chassis]||48)+loadoutWeight(b)}
function collisionActors(){return [...new Set([p,...enemies])].filter(aliveActor)}
function mechRadius(actor){const grade=chassisProfile(actorLoadout(actor)).grade;return grade==='heavy'?112:grade==='light'?98:105}
const terrainMove=urbanMove;
function moveContact(actor,x,y,actors,visiting){
 if(visiting.has(actor))return false;
 visiting.add(actor);
 const ox=actor.x,oy=actor.y;
 terrainMove(actor,x,y);
 // Wall/forcefield clipping must not transmit a push beyond the wall.
 for(const other of actors){
  if(other===actor)continue;
  const dx=other.x-actor.x,dy=other.y-actor.y,d=Math.hypot(dx,dy),limit=mechRadius(actor)+mechRadius(other);
  if(d>=limit-.001)continue;
  if(mechMass(actor)<=mechMass(other)*1.05){visiting.delete(actor);return false}
  const nx=d>.001?dx/d:1,ny=d>.001?dy/d:0,depth=limit-d+.01;
  const tx=other.x+nx*depth,ty=other.y+ny*depth;
  if(!moveContact(other,tx,ty,actors,visiting)||Math.hypot(other.x-actor.x,other.y-actor.y)<limit-.001){visiting.delete(actor);return false}
 }
 visiting.delete(actor);
 return Number.isFinite(actor.x)&&Number.isFinite(actor.y)&&Math.hypot(actor.x-ox,actor.y-oy)<=Math.hypot(x-ox,y-oy)+.1;
}
urbanMove=function(actor,x,y,r){
 const actors=collisionActors();
 if(!actors.includes(actor))return terrainMove(actor,x,y,r);
 const dx=x-actor.x,dy=y-actor.y,n=Math.max(1,Math.ceil(Math.hypot(dx,dy)/4));
 for(let i=0;i<n;i++){
  const snapshot=actors.map(a=>[a,a.x,a.y]);
  const contact=actors.find(a=>a!==actor&&Math.hypot(a.x-actor.x,a.y-actor.y)<mechRadius(a)+mechRadius(actor)+5);
  const factor=contact&&mechMass(actor)>mechMass(contact)*1.05?1-.5*mechMass(contact)/mechMass(actor):1;
  if(!moveContact(actor,actor.x+dx/n*factor,actor.y+dy/n*factor,actors,new Set())){
   for(const[a,ax,ay]of snapshot){a.x=ax;a.y=ay}
   break;
  }
 }
};
const massWorkshop=refreshWorkshop;
refreshWorkshop=function(){massWorkshop();const weight=node('workshopWeight');weight.textContent=((CHASSIS_MASS[build.chassis]||48)+loadoutWeight(build))+' WT';weight.previousElementSibling.textContent='TOTAL WEIGHT';weight.parentElement.title='Chassis plus fitted weapons. Heavier mechs can push lighter opponents; similar weights resist.'};
refreshWorkshop();
