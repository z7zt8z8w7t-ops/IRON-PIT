'use strict';
// Victory transport uses presentation coordinates; the winner never moves in physics.
let victoryPickup=null;
const PICKUP_LIFT=7.2,PICKUP_TURN=9.5,PICKUP_DEPART=11,PICKUP_EXIT=14.5,PICKUP_END=15.4;
function pickupBusy(){return !!victoryPickup&&!victoryPickup.done;}
function cancelVictoryPickup(){Sound.stopLoop('victory-transport');victoryPickup=null;}
const pickupReset=resetBattleResult;
resetBattleResult=function(){cancelVictoryPickup();return pickupReset();};
const pickupFinish=finishBattle;
finishBattle=function(winner){
 const existed=!!battleResult;pickupFinish(winner);
 if(existed||!winner||weaponRange||(typeof trainingActive!=='undefined'&&trainingActive&&trainingState?.stage!==11))return;
 const state=typeof duelPlayers!=='undefined'&&duelActive?duelPlayers.find(s=>s.actor===winner):null;
 victoryPickup={result:battleResult,winner,loadout:winner.loadout||state?.build||build,rig:state?.bipedRig|| (winner===p?bipedRig:null),x:winner.x,y:winner.y,heading:winner.heading||0,angle:winner.angle||0,age:0,done:false,events:new Set()};
};
const pickupStep=stepStadium;
stepStadium=function(dt){
 pickupStep(dt);const s=victoryPickup;if(!s)return;
 if(!inArena||battleResult!==s.result){cancelVictoryPickup();return;}
 if(s.done)return;s.age=Math.min(PICKUP_END,s.age+dt);
 const t=s.age;
 if(t>=2&&t<PICKUP_EXIT)Sound.loop('deployment-helicopter','victory-transport',s.x,s.y,.75*(t<4?deploymentEase((t-2)/2):t>12?1-deploymentEase((t-12)/(PICKUP_EXIT-12)):1),1);
 else Sound.stopLoop('victory-transport');
 for(const [at,name,level]of [[5,'deployment-winch',.55],[6.5,'deployment-release',.65],[7.2,'deployment-winch',.55]])if(t>=at&&!s.events.has(at)){s.events.add(at);Sound.play(name,s.x,s.y,level,1,true);}
 if(t>=PICKUP_END){s.done=true;Sound.stopLoop('victory-transport');updateBattlePanel();
  if(typeof campaignActive!=='undefined'&&campaignActive&&campaignOutcome?.won&&s.winner===p)node('return').onclick();
 }
};
// Suppress only the ground rendering of the lifted winner, never its live actor state.
const pickupMech=mech;
mech=function(c,x,y,scale,heading,angle,loadout=build,...rest){
 const s=victoryPickup;if(s&&s.age>=PICKUP_LIFT&&loadout===s.loadout&&Math.abs(x-s.x)<1&&Math.abs(y-s.y)<1)return;
 return pickupMech(c,x,y,scale,heading,angle,loadout,...rest);
};
const pickupReport=showBattleReport;
showBattleReport=function(...args){if(pickupBusy())return;return pickupReport(...args);};
const pickupPanel=updateBattlePanel;
updateBattlePanel=function(){pickupPanel();if(!pickupBusy())return;
 for(const id of ['return','rematch']){const el=$(id);if(el)el.hidden=true;}
};
const pickupRematch=rematchBattle;
rematchBattle=function(){if(pickupBusy())return;return pickupRematch();};
const pickupReturn=node('return').onclick;
node('return').onclick=function(){if(pickupBusy())return;return pickupReturn();};
// Ground lighting follows the same visibility rule as the lifted mech.
const pickupHeadlightState=mechHeadlightState;
mechHeadlightState=function(actor){if(victoryPickup&&actor===victoryPickup.winner&&victoryPickup.age>=PICKUP_LIFT)return null;return pickupHeadlightState(actor);};
function pickupPresentation(s,v,w,h){
 const z=v.zoom,t=s.age,tx=v.x+v.w/2+(s.x-ARENA.width/2)*z,ty=v.y+v.h/2+(s.y-ARENA.height/2)*z;
 const hx=Math.max(v.x+80*z,Math.min(v.x+v.w-80*z,tx)),hy=Math.max(v.y+210*z,Math.min(v.y+v.h-180*z,ty-75*z));
 const exitX=w+600*z,exitY=hy-240*z,exitHeading=Math.atan2(exitX-hx,-(exitY-hy));
 const approach=deploymentEase((t-2)/3),lift=deploymentEase((t-PICKUP_LIFT)/(PICKUP_TURN-PICKUP_LIFT));
 const turn=deploymentEase((t-PICKUP_TURN)/(PICKUP_DEPART-PICKUP_TURN)),depart=deploymentEase((t-PICKUP_DEPART)/(PICKUP_EXIT-PICKUP_DEPART)),heading=exitHeading*turn;
 const ax=hx+(exitX-hx)*depart,ay=(t<5?hy+(h+500*z)*(1-approach):hy)+(exitY-hy)*depart;
 const slingX=ax-Math.sin(heading)*80*z,slingY=ay+Math.cos(heading)*80*z;
 return{z,t,tx,ty,ax,ay,heading,mx:tx+(slingX-tx)*lift,my:ty+(slingY-ty)*lift,mechHeading:s.heading+heading,mechAngle:s.angle+heading};
}
function drawPickupLamps(c,view){
 // These lamps belong to the airborne sprite; no beam remains at its old floor position.
 c.save();c.translate(view.mx,view.my);c.rotate(view.mechAngle);c.scale(.85*view.z,.85*view.z);c.globalCompositeOperation='screen';
 for(const side of [-1,1]){glow(c,side*88,18,22,'#fff0c9',.27);c.fillStyle='#fff0c9';c.beginPath();c.arc(side*88,18,3,0,Math.PI*2);c.fill();}
 c.restore();
}
function drawVictoryPickup(c,w,h){
 const s=victoryPickup;if(!s||s.done||s.age<2)return;
 const view=pickupPresentation(s,stadiumView(w,h),w,h),{z,t,tx,ty,ax,ay,mx,my,heading}=view;
 c.save();
 if(t>=5&&t<PICKUP_EXIT){const attach=deploymentEase((t-5)/1.5);c.strokeStyle='#c5cac3';c.lineWidth=2;
  for(const side of [-1,1]){const anchorX=ax+(side*35*Math.cos(heading)-24*Math.sin(heading))*z,anchorY=ay+(side*35*Math.sin(heading)+24*Math.cos(heading))*z;
   const mount=rotatePoint(side*65,40,view.mechAngle),endX=mx+mount.x*z,endY=my+mount.y*z;
   const ground=rotatePoint(side*65,40,s.angle),groundX=tx+ground.x*z,groundY=ty+ground.y*z;
   c.beginPath();c.moveTo(anchorX,anchorY);c.lineTo(t<PICKUP_LIFT?anchorX+(groundX-anchorX)*attach:endX,t<PICKUP_LIFT?anchorY+(groundY-anchorY)*attach:endY);c.stroke();}
 }
 if(t>=PICKUP_LIFT&&t<PICKUP_EXIT){pickupMech(c,mx,my,.85*z,view.mechHeading,view.mechAngle,s.loadout,s.winner.parts,s.rig);drawPickupLamps(c,view);}
 if(t<PICKUP_EXIT)drawDeploymentAircraft(c,ax,ay,z,heading,t);
 c.fillStyle='#d2f6eb';c.font='bold 12px system-ui';c.textAlign='center';
 c.fillText(t<5?'VICTORY TRANSPORT APPROACH':t<PICKUP_LIFT?'ATTACHING WINCH':t<PICKUP_TURN?'LIFTING WINNING MECH':t<PICKUP_DEPART?'TURNING TO EXIT':t<PICKUP_EXIT?'EXTRACTING WINNING MECH':'EXTRACTION COMPLETE',w/2,98);
 if(t>PICKUP_EXIT){c.fillStyle='rgba(0,0,0,'+deploymentClamp((t-PICKUP_EXIT)/(PICKUP_END-PICKUP_EXIT))+')';c.fillRect(0,0,w,h);}
 c.restore();
};
