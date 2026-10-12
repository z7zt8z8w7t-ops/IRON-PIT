'use strict';
// Victory transport uses presentation coordinates; the winner never moves in physics.
let victoryPickup=null;
const PICKUP_END=13.4;
function pickupBusy(){return !!victoryPickup&&!victoryPickup.done;}
function cancelVictoryPickup(){Sound.stopLoop('victory-transport');victoryPickup=null;}
const pickupReset=resetBattleResult;
resetBattleResult=function(){cancelVictoryPickup();return pickupReset();};
const pickupFinish=finishBattle;
finishBattle=function(winner){
 const existed=!!battleResult;pickupFinish(winner);
 if(existed||!winner||weaponRange||typeof trainingActive!=='undefined'&&trainingActive)return;
 const state=typeof duelPlayers!=='undefined'&&duelActive?duelPlayers.find(s=>s.actor===winner):null;
 victoryPickup={result:battleResult,winner,loadout:winner.loadout||state?.build||build,rig:state?.bipedRig|| (winner===p?bipedRig:null),x:winner.x,y:winner.y,heading:winner.heading||0,angle:winner.angle||0,age:0,done:false,events:new Set()};
};
const pickupStep=stepStadium;
stepStadium=function(dt){
 pickupStep(dt);const s=victoryPickup;if(!s)return;
 if(!inArena||battleResult!==s.result){cancelVictoryPickup();return;}
 if(s.done)return;s.age=Math.min(PICKUP_END,s.age+dt);
 const t=s.age;
 if(t>=2&&t<12.5)Sound.loop('deployment-helicopter','victory-transport',s.x,s.y,.75*(t<4?deploymentEase((t-2)/2):t>10?1-deploymentEase((t-10)/2.5):1),1);
 else Sound.stopLoop('victory-transport');
 for(const [at,name,level]of [[5,'deployment-winch',.55],[6.5,'deployment-release',.65],[7.2,'deployment-winch',.55]])if(t>=at&&!s.events.has(at)){s.events.add(at);Sound.play(name,s.x,s.y,level,1,true);}
 if(t>=PICKUP_END){s.done=true;Sound.stopLoop('victory-transport');updateBattlePanel();
  if(typeof campaignActive!=='undefined'&&campaignActive&&campaignOutcome?.won&&s.winner===p)node('return').onclick();
 }
};
// Suppress only the ground rendering of the lifted winner, never its live actor state.
const pickupMech=mech;
mech=function(c,x,y,scale,heading,angle,loadout=build,...rest){
 const s=victoryPickup;if(s&&s.age>=7.2&&loadout===s.loadout&&Math.abs(x-s.x)<1&&Math.abs(y-s.y)<1)return;
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
const pickupAtmosphere=drawStadiumAtmosphere;
drawStadiumAtmosphere=function(c,w,h){
 pickupAtmosphere(c,w,h);const s=victoryPickup;if(!s||s.done||s.age<2)return;
 const v=stadiumView(w,h),z=v.zoom,t=s.age;
 const tx=v.x+v.w/2+(s.x-ARENA.width/2)*z,ty=v.y+v.h/2+(s.y-ARENA.height/2)*z;
 // Clamp the aircraft, rather than the mech, at the perimeter: cables stay attached
 // to the real stopping point and lift the mech clear before the departure.
 const hx=Math.max(v.x+80*z,Math.min(v.x+v.w-80*z,tx));
 const hy=Math.max(v.y+210*z,Math.min(v.y+v.h-180*z,ty-75*z));
 const approach=deploymentEase((t-2)/3),lift=deploymentEase((t-7.2)/2.3),depart=deploymentEase((t-9.5)/3);
 const ax=hx,ay=t<5?hy+(h+500*z)*(1-approach):hy;
 const dx=(w+400*z-hx)*depart,dy=-280*z*depart;
 const mx=tx+(hx-tx)*lift+dx,my=ty+(hy+80*z-ty)*lift+dy;
 c.save();
 if(t>=5&&t<12.5){const attach=deploymentEase((t-5)/1.5);c.strokeStyle='#c5cac3';c.lineWidth=2;
  for(const side of [-1,1]){c.beginPath();c.moveTo(ax+dx+side*35*z,ay+dy+24*z);c.lineTo(t<7.2?ax+side*35*z+(tx-ax)*attach:mx+side*65*z,t<7.2?ay+24*z+(ty+40*z-ay-24*z)*attach:my+40*z);c.stroke();}
 }
 if(t>=7.2&&t<12.5)pickupMech(c,mx,my,.85*z,s.heading,s.angle,s.loadout,s.winner.parts,s.rig);
 if(t<12.5)drawDeploymentAircraft(c,ax+dx,ay+dy,z,depart*.45,t);
 c.fillStyle='#d2f6eb';c.font='bold 12px system-ui';c.textAlign='center';
 c.fillText(t<5?'VICTORY TRANSPORT APPROACH':t<7.2?'ATTACHING WINCH':t<9.5?'LIFTING WINNING MECH':'EXTRACTION COMPLETE',w/2,98);
 if(t>12.5){c.fillStyle='rgba(0,0,0,'+deploymentClamp((t-12.5)/.9)+')';c.fillRect(0,0,w,h);}
 c.restore();
};
