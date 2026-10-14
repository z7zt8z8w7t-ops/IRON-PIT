'use strict';
SLOT_LABELS.primary='WEP1';SLOT_LABELS.secondary='WEP2';SLOT_LABELS.support='SPECWEP';
function fireButtonContent97(button,slot){
 if(button.querySelector('.fire-crosshair97'))return;
 const crosshair=document.createElement('span');crosshair.className='fire-crosshair97';crosshair.setAttribute('aria-hidden','true');
 const label=document.createElement('span');label.className='fire-label97';label.textContent=SLOT_LABELS[slot];
 button.replaceChildren(crosshair,label);button.classList.add('fire-control97');
}
// Heat still fills the complete rectangular housing; only the reticle changes colour.
drawHeatButton=function(slot,id){
 const b=$(slot),h=weaponHeat[slot],cfg=HEAT_CONFIG[id];fireButtonContent97(b,slot);
 b.style.background=cfg?`linear-gradient(to top,${h.locked?'#c02732':'#90202c'} ${h.value}%,#02080b ${h.value}%)`:'';
 b.classList.toggle('overheated',!!h?.locked);
};
function updateControlSignals97(){
 const panel=currentPanel();if(!panel)return;
 const repairing=!!repairState&&!p.dead&&!p.ejecting;
 const offline=!!deployment||p.dead||!!p.ejecting||battleFinished();
 for(const [slot,key,num] of [['primary','left',1],['secondary','right',2]]){
  const b=$(slot),h=weaponHeat[slot];drawHeatButton(slot,build[key]);
  b.dataset.signal=repairing?'repair':h?.locked?'hot':!offline&&!!build[key]?'ready':'unavailable';
  const state=repairing?'weapons offline during repair':h?.locked?'overheated; cooling':!build[key]?'no weapon fitted':offline?'offline':cooldown[slot]>0?'reloading':'ready';
  b.setAttribute('aria-label','WEP'+num+': '+(build[key]?nameOf(build[key]):'empty')+'; '+state+'; heat '+Math.round(h?.value||0)+' percent');b.title=b.getAttribute('aria-label');
 }
 const special=$('support');special.classList.add('special-weapon97');special.textContent='SPECWEP';
 const available=!!build.rear&&!special.disabled&&cooldown.support<=0&&!offline;
 special.dataset.signal=repairing?'repair':available?'ready':'unavailable';
 special.setAttribute('aria-label','Special Weapon: '+(build.rear?nameOf(build.rear):'empty')+'; '+(repairing?'offline during repair':available?(missileLock.held?(missileLock.ready?'locked; release to fire':'acquiring target'):'ready'):'unavailable'));
 special.title=special.getAttribute('aria-label');
 const shield=$('shield'),active=p.shield>0&&!p.dead&&!p.ejecting;
 shield.classList.add('shield-control97');shield.dataset.signal=active?'active':!offline&&!shield.disabled&&p.energy>20?'ready':'unavailable';
 shield.setAttribute('aria-label','Shield; '+(active?'active':shield.dataset.signal==='ready'?'ready':'unavailable; charging')+'; '+Math.round(p.energy)+' percent energy');
 const repair=$('repair');repair.classList.add('repair-control97');repair.classList.toggle('repair-active97',repairing);
}
const diagnostics97=updateDiagnostics;updateDiagnostics=function(){diagnostics97();updateControlSignals97();};
for(const prefix of ['', 'p2-']){
 for(const slot of ['primary','secondary']){const b=document.getElementById(prefix+slot);if(b)fireButtonContent97(b,slot);}
 const special=document.getElementById(prefix+'support');if(special){special.classList.add('special-weapon97');special.textContent='SPECWEP';special.dataset.signal='unavailable';}
 document.getElementById(prefix+'shield')?.classList.add('shield-control97');document.getElementById(prefix+'repair')?.classList.add('repair-control97');
}
