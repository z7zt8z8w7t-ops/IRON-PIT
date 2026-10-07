'use strict';
// Heat per activation (whole volley), independently tracked for each side mount.
const BALLISTIC_HEAT={'machine-gun':2.8,rotary:1.8,siege:22,'tri-salvo':26,railgun:25,flak:16};
const weaponHeat={primary:{id:null,value:0,locked:false,lastShot:-10},secondary:{id:null,value:0,locked:false,lastShot:-10}};
function resetHeat(){for(const slot in weaponHeat)Object.assign(weaponHeat[slot],{id:null,value:0,locked:false,lastShot:-10})}
function syncHeat(slot,id){const h=weaponHeat[slot];if(h&&h.id!==id)Object.assign(h,{id,value:0,locked:false,lastShot:-10});return h}
function canFireHeat(slot,id){return !syncHeat(slot,id)?.locked}
function addWeaponHeat(slot,id){const h=syncHeat(slot,id),amount=BALLISTIC_HEAT[id];if(!h||!amount)return;h.lastShot=last/1000;h.value=Math.min(100,h.value+amount);if(h.value>=100)h.locked=true;drawHeatButton(slot,id)}
function stepHeat(dt){for(const [slot,id,key] of [['primary',build.left,' '],['secondary',build.right,'f']]){const h=syncHeat(slot,id),pressed=firing[slot]||keys.has(key);if(BALLISTIC_HEAT[id]&&(h.locked||(!pressed&&last/1000-h.lastShot>.25))){h.value=Math.max(0,h.value-dt*22);if(h.locked&&h.value<=20)h.locked=false}drawHeatButton(slot,id)}}
function drawHeatButton(slot,id){const b=document.getElementById(slot),h=weaponHeat[slot],enabled=!!BALLISTIC_HEAT[id],label=slot.toUpperCase();b.textContent=h.locked?label+'\nOVERHEATED\n'+Math.max(0,Math.ceil((h.value-20)/22))+'s':label+(enabled?'\nHEAT '+Math.round(h.value)+'%':'');b.style.background=enabled?`linear-gradient(to top,${h.locked?'#843c2e':'#5d4730'} ${h.value}%,#222d2d ${h.value}%)`:'';b.classList.toggle('overheated',h.locked);b.setAttribute?.('aria-label',h.locked?label+' overheated; cooling':label+(enabled?'; heat '+Math.round(h.value)+' percent':''))}
