'use strict';
SLOT_LABELS.support='SpecWep';
function updateControlSignals96(){
 const panel=currentPanel();if(!panel)return;
 const repairing=!!repairState&&!p.dead&&!p.ejecting;
 for(const [slot,key,num] of [['primary','left',1],['secondary','right',2]]){
  const b=$(slot),hot=!!weaponHeat[slot]?.locked,available=!!build[key]&&!b.disabled;
  b.classList.add('crosshair-fire96');
  b.dataset.signal=repairing?'repair':hot?'hot':available?'ready':'unavailable';
  b.style.removeProperty('background');
  const state=repairing?'weapons offline during repair':hot?'overheated; cooling':!build[key]?'no weapon fitted':cooldown[slot]>0?'reloading':available?'ready':'offline';
  b.setAttribute('aria-label','Slot '+num+': '+(build[key]?nameOf(build[key]):'empty')+'; '+state);
  b.title=b.getAttribute('aria-label');
 }
 const special=$('support');special.classList.add('special-weapon96');special.textContent='SpecWep';
 const available=!!build.rear&&!special.disabled&&cooldown.support<=0&&!p.dead&&!p.ejecting&&!deployment&&!battleFinished();
 special.dataset.signal=repairing?'repair':available?'ready':'unavailable';
 special.setAttribute('aria-label','Special Weapon: '+(build.rear?nameOf(build.rear):'empty')+'; '+(repairing?'offline during repair':available?(missileLock.held?(missileLock.ready?'locked; release to fire':'acquiring target'):'ready'):'unavailable'));
 special.title=special.getAttribute('aria-label');
 const shield=$('shield');shield.classList.add('shield-control96');shield.classList.toggle('shield-active96',p.shield>0&&!p.dead&&!p.ejecting);shield.setAttribute('aria-label','Shield; '+(p.shield>0?'active':p.energy>20?'ready':'charging')+'; '+Math.round(p.energy)+' percent energy');
 const repair=$('repair');repair.classList.add('repair-control96');repair.classList.toggle('repair-active96',repairing);
}
const diagnostics96=updateDiagnostics;
updateDiagnostics=function(){diagnostics96();updateControlSignals96();};
for(const prefix of ['', 'p2-']){
 for(const slot of ['primary','secondary'])document.getElementById(prefix+slot)?.classList.add('crosshair-fire96');
 const special=document.getElementById(prefix+'support');if(special){special.classList.add('special-weapon96');special.textContent='SpecWep';special.dataset.signal='unavailable';}
 document.getElementById(prefix+'shield')?.classList.add('shield-control96');
 document.getElementById(prefix+'repair')?.classList.add('repair-control96');
}
