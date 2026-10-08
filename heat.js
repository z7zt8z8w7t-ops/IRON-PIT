'use strict';
// Discrete burst lengths and lockout times tuned to the standard sustained DPS budgets.
const HEAT_CONFIG={
 'machine-gun':{shots:88,cool:3.5},rotary:{shots:42,cool:3.5},pulse:{shots:39,cool:3.5},siege:{shots:3,cool:6},railgun:{shots:3,cool:5},plasma:{shots:6,cool:4.731},'tri-salvo':{shots:3,cool:5},flak:{shots:5,cool:3.5},beam:{seconds:3.5,cool:3.5},flame:{seconds:2.98,cool:3.5},arc:{seconds:5.833,cool:3.5}
};
let weaponHeat={primary:{id:null,value:0,locked:false,lastShot:-10},secondary:{id:null,value:0,locked:false,lastShot:-10}};
function resetHeat(){for(const slot in weaponHeat)Object.assign(weaponHeat[slot],{id:null,value:0,locked:false,lastShot:-10})}
function syncHeat(slot,id){const h=weaponHeat[slot];if(h&&h.id!==id)Object.assign(h,{id,value:0,locked:false,lastShot:-10});return h}
function canFireHeat(slot,id){return !syncHeat(slot,id)?.locked}
function addWeaponHeat(slot,id){const h=syncHeat(slot,id),cfg=HEAT_CONFIG[id];if(!h||!cfg)return;const rate=weaponStats(id,modifications[slot]).rate;h.lastShot=last/1000;h.value=Math.min(100,h.value+(cfg.seconds?80*rate/cfg.seconds:80/(cfg.shots-.5)));if(h.value>=100)h.locked=true;drawHeatButton(slot,id)}
function stepHeat(dt){for(const [slot,id,key] of [['primary',build.left,' '],['secondary',build.right,'f']]){const h=syncHeat(slot,id),cfg=HEAT_CONFIG[id],pressed=firing[slot]||keys.has(key);if(cfg&&(h.locked||(!pressed&&last/1000-h.lastShot>.25))){h.value=Math.max(0,h.value-dt*80/cfg.cool);if(h.locked&&h.value<=20)h.locked=false}drawHeatButton(slot,id)}}
function drawHeatButton(slot,id){const b=$(slot),h=weaponHeat[slot],cfg=HEAT_CONFIG[id],label=SLOT_LABELS[slot];b.textContent=h.locked?label+'\nOVERHEATED\n'+Math.max(0,Math.ceil((h.value-20)/(80/cfg.cool)))+'s':label+(cfg?'\nHEAT '+Math.round(h.value)+'%':'');b.style.background=cfg?`linear-gradient(to top,${h.locked?'#481c20':'#0c424f'} ${h.value}%,#02080b ${h.value}%)`:'';b.classList.toggle('overheated',h.locked);b.setAttribute?.('aria-label',h.locked?label+' overheated; cooling':label+(cfg?'; heat '+Math.round(h.value)+' percent':''))}
