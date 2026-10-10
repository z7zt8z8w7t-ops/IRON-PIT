'use strict';
// Every held control owns exactly one pointer. Global releases cover iPadOS
// cancelling capture, and reset releases both the state and closure ownership.
const battlePointers=new Map();
function clearLocalInputs(){keys.clear();input.move={x:0,y:0};input.aim={x:0,y:0};traverse.left=traverse.right=false;ejectHeld=false;ejectPress=0;for(const slot in firing){firing[slot]=false;stopWeaponSound(slot)}clearLock();Sound.stopMotion();for(const id of ['move','primary','secondary','support','turnLeft','turnRight','eject']){const e=$(id);e?.classList.remove('active');const knob=e?.querySelector('.knob');if(knob)knob.style.transform='';}}
function resetBattleInputs(){for(const session of Array.from(battlePointers.values()))session.release(true);battlePointers.clear();if(duelActive){for(let i=0;i<duelPlayers.length;i++)withDuelPlayer(i,clearLocalInputs)}else clearLocalInputs()}
function attachBattleControls(index=null){const prefix=index===1?'p2-':'',wrap=fn=>index===null?fn:(...args)=>withDuelPlayer(index,()=>fn(...args));
 function bind(id,change,isStick=false){const el=document.getElementById(prefix+id);let pointer=null;const release=cancel=>{if(pointer===null)return;const held=pointer;pointer=null;battlePointers.delete(held);try{if(el.hasPointerCapture?.(held))el.releasePointerCapture(held)}catch(e){}wrap(()=>{change(false,null,cancel);el.classList.remove('active')})()};el.onpointerdown=wrap(e=>{if(pointer!==null||battlePointers.has(e.pointerId)||el.disabled||deployment||p.dead||p.ejecting||battleFinished())return;e.preventDefault();pointer=e.pointerId;battlePointers.set(pointer,{element:el,release});try{el.setPointerCapture(pointer)}catch(err){}change(true,e,false);el.classList.add('active')});el.onpointermove=wrap(e=>{if(isStick&&e.pointerId===pointer)change(true,e,false)});el.onpointerup=e=>{if(e.pointerId===pointer)release(false)};el.onpointercancel=el.onlostpointercapture=e=>{if(e.pointerId===pointer)release(true)};}
 bind('move',(held,e)=>{if(!held){input.move={x:0,y:0};document.getElementById(prefix+'move').querySelector('.knob').style.transform='';return}const el=document.getElementById(prefix+'move'),r=el.getBoundingClientRect(),radius=Math.max(1,r.width/2-20);let x=(e.clientX-r.left-r.width/2)/radius,y=(e.clientY-r.top-r.height/2)/radius;const n=Math.hypot(x,y);if(n>1){x/=n;y/=n}input.move={x,y};const flip=index===1?-1:1;el.querySelector('.knob').style.transform=`translate(${x*radius*flip}px,${y*radius*flip}px)`},true);
 for(const [id,key] of [['turnLeft','left'],['turnRight','right']])bind(id,v=>traverse[key]=v);
 for(const slot of ['primary','secondary'])bind(slot,v=>{firing[slot]=v;if(!v)stopWeaponSound(slot)});
 bind('support',(v,e,cancel)=>supportControl(v,!!cancel));bind('eject',v=>{ejectHeld=v;if(!v)ejectPress=0});
 document.getElementById(prefix+'shield').onclick=wrap(()=>{if(!deployment&&!p.dead&&!p.ejecting&&!battleFinished()&&p.energy>20&&p.shield<=0){p.shield=3;traverse.left=traverse.right=false}});document.getElementById(prefix+'repair').onclick=wrap(beginRepair);
}
// Bubble phase permits the owning handler to process the release first.
for(const type of ['pointerup','pointercancel'])window.addEventListener(type,e=>battlePointers.get(e.pointerId)?.release(type==='pointercancel'));
window.addEventListener('blur',resetBattleInputs);window.addEventListener('pagehide',resetBattleInputs);window.addEventListener('resize',resetBattleInputs);document.addEventListener('visibilitychange',()=>{if(document.hidden)resetBattleInputs()});
const safeDeployment=startDeployment;startDeployment=function(){resetBattleInputs();safeDeployment()};
const safeFinish=finishBattle;finishBattle=function(winner){resetBattleInputs();safeFinish(winner)};
const safeRematch=rematchBattle;rematchBattle=function(){resetBattleInputs();safeRematch()};
const safeLeave=leaveDuel;leaveDuel=function(){resetBattleInputs();safeLeave();attachBattleControls()};
const safeDuelBind=bindDuelControls;bindDuelControls=function(index){safeDuelBind(index);attachBattleControls(index)};
const safeLevel=showLevelSelect;showLevelSelect=function(){resetBattleInputs();safeLevel()};
const safeClear=clearCombatFx;clearCombatFx=function(){resetBattleInputs();safeClear()};
for(const prefix of ['', 'p2-']){const b=document.getElementById(prefix+'rematch');if(b)b.onclick=()=>rematchBattle()}
attachBattleControls();

node('splashStart').onclick=()=>showLevelSelect();

const safeWorkshopBack=node('buildBack').onclick;node('buildBack').onclick=()=>{resetBattleInputs();safeWorkshopBack()};
