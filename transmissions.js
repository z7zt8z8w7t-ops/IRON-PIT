'use strict';
// The same comms treatment is used by briefings, results and workshop rewards.
let transmissionGeneration=0,transmissionClosing=false;
let quickEquipment=[{pending:[],announced:[]},{pending:[],announced:[]}];try{const q=JSON.parse(localStorage.getItem('iron-pit-equipment-comms'));if(Array.isArray(q)&&q.length===2)quickEquipment=q.map(x=>({pending:Array.isArray(x.pending)?x.pending:[],announced:Array.isArray(x.announced)?x.announced:[]}))}catch(e){}
function saveQuickEquipment(){try{localStorage.setItem('iron-pit-equipment-comms',JSON.stringify(quickEquipment))}catch(e){}}
rookieProgress.announced=Array.isArray(rookieProgress.announced)?rookieProgress.announced:[];
rookieProgress.pending=Array.isArray(rookieProgress.pending)?rookieProgress.pending:[];
rookieProgress.repairs=Number(rookieProgress.repairs)||0;
function portraitFor(who,mood='focused'){
 if(who==='dave')return 'assets/story-dave-'+(mood==='loss'?'loss':'win')+'-'+Math.min(2,Math.floor(rookieProgress.repairs/2))+'.jpg';
 return 'assets/story-'+who+(mood==='focused'?'':'-'+mood)+'.jpg';
}
function commsSound(name){Sound.play(name,p.x,p.y,.65,1,true)}
function endTransmission(el,done){if(transmissionClosing)return;transmissionClosing=true;const ticket=transmissionGeneration;el.classList.add('transmission-out');const title=el.querySelector('.transmission-label');if(title)title.textContent='TRANSMISSION ENDED';commsSound('comms-out');resetBattleInputs();setTimeout(()=>{if(ticket!==transmissionGeneration)return;transmissionClosing=false;done()},430)}
showStoryDialogue=function(lines,done,mission=ROOKIE_MATCHES[campaignMission],mood={}){
 resetBattleInputs();hideGameMenus();storyScreen().hidden=false;const ticket=++transmissionGeneration;transmissionClosing=false;
 const body=node('storyBody');body.innerHTML='<div class="story-dialogue transmission"><div class="transmission-label"></div><img id="storyPortrait" alt=""><div class="story-dialogue-copy"><small id="storyRole"></small><h2 id="storyName"></h2><p id="storyLine"></p><small id="storyPage"></small></div></div><div class="mission-brief"><small id="missionRound"></small><h2 id="missionTitle"></h2><p id="missionBrief"></p></div><div class="story-actions"><button id="storySkip">SKIP</button><button id="storyNext" class="primary ready-flash">NEXT</button></div>';
 let page=0,previous=null;const terminal=body.querySelector('.transmission');
 const show=()=>{const[who,line]=lines[page],cast=STORY_CAST[who];terminal.classList.remove('transmission-out');if(previous!==who){terminal.classList.remove('transmission-in');void terminal.offsetWidth;terminal.classList.add('transmission-in');commsSound('comms-in')}previous=who;terminal.querySelector('.transmission-label').textContent='INCOMING TRANSMISSION · '+cast.name.toUpperCase();node('storyPortrait').src=portraitFor(who,mood[who]||'focused');node('storyPortrait').alt=cast.name;node('storyRole').textContent=cast.role;node('storyName').textContent=cast.name.toUpperCase();node('storyLine').textContent='“'+line+'”';node('storyPage').textContent=(page+1)+' / '+lines.length;node('storyNext').textContent=page===lines.length-1?'CONTINUE →':'NEXT →'};
 node('missionRound').textContent=mission.round+' / '+(ARENA_VARIANTS[mission.arena]?.label||'PILOT TRAINING');node('missionTitle').textContent=mission.title.toUpperCase();node('missionBrief').textContent=mission.brief;
 const finish=()=>endTransmission(terminal,done);node('storySkip').onclick=finish;node('storyNext').onclick=()=>{if(transmissionClosing||ticket!==transmissionGeneration)return;if(page+1===lines.length)finish();else{page++;show()}};show();
 node('storySaveStatus').textContent='PROGRESS SAVED ON THIS DEVICE · '+rookieProgress.completed+' / 5 VICTORIES';
};
const guidedLadder=showRookieLadder;showRookieLadder=function(){transmissionGeneration++;transmissionClosing=false;resetBattleInputs();guidedLadder();node('storyBody').querySelector('.league-current')?.classList.add('ready-flash');const im=node('storyBody').querySelector('.league-intro img');if(im)im.src=portraitFor('jim',rookieProgress.completed===5?'win':'focused')};
const guidedMenus=hideGameMenus;hideGameMenus=function(){resetBattleInputs();guidedMenus()};
const guidedWorkshop=refreshWorkshop;refreshWorkshop=function(){guidedWorkshop();node('deploy').classList.add('ready-flash')};
const WEAPON_BRIEFS={
 rotary:['Heavy sustained fire and reliable close-to-mid-range pressure.','Heavier than the belt-fed gun; watch the heat meter.','Use controlled bursts while flanking.'],
 flak:['A spread of shells is forgiving against agile targets.','Damage drops when only part of the spread connects.','Get closer, fire, then reposition during the reload.'],
 swarm:['Separated homing missiles pressure targets around their evasive route.','Needs a lock; smoke, range and cover can spoil the volley.','Hold WPN 3 for a lock, release to launch.'],
 pulse:['Fast laser bursts and accurate direct damage.','Heat limits sustained fire; cover breaks the shot.','Aim first, then fire short bursts.'],
 smart:['Red tracers automatically follow a target inside the aim cone and range.','Spin-up costs time; targets outside the cone are not tracked.','Keep the enemy in front of the turret and hold WPN 1.']
};
function weaponBrief(id){return WEAPON_BRIEFS[id]||['Useful in the right range and loadout.','Weight reduces speed; heat or reloads interrupt firing.','Test it in the range before committing to a match.']}
function weaponMountKey(id){return Object.keys(workshopSlots).find(k=>workshopSlots[k].ids.includes(id))}
function markWeaponAnnounced(id){if(!rookieProgress.announced.includes(id))rookieProgress.announced.push(id);rookieProgress.pending=rookieProgress.pending.filter(x=>x!==id);saveRookie()}
function showWeaponTransmission(id,isUnlock=false){
 if(!id)return;let old=node('weaponTransmission');old?.remove();const el=document.createElement('section');el.id='weaponTransmission';el.className='workshop-transmission';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','Dave: '+nameOf(id));el.innerHTML='<div class="transmission transmission-in"><div class="transmission-label">INCOMING TRANSMISSION · DAVE</div><img class="reward-portrait" alt="Dave"><div class="weapon-brief"><small></small><h2></h2><p class="reward-quote"></p><img class="reward-weapon" alt=""><dl></dl><div class="reward-actions"><button class="fit-weapon ready-flash">FIT WEAPON →</button><button class="later">LATER</button></div></div></div>';
 const card=el.querySelector('.transmission'),key=weaponMountKey(id),brief=weaponBrief(id),profile=chassisProfile(build),weight=WEAPON_WEIGHT[id]||0;
 el.querySelector('.reward-portrait').src=portraitFor('dave','win');el.querySelector('small').textContent=isUnlock?'NEW EQUIPMENT UNLOCKED':'EQUIPMENT BRIEFING';el.querySelector('h2').textContent=nameOf(id).toUpperCase();el.querySelector('.reward-quote').textContent='“'+(isUnlock?'New kit, Jim. ':'')+brief[2]+'”';el.querySelector('.reward-weapon').src='assets/'+id+'.png';
 const facts=[['STRENGTH',brief[0]],['TRADE-OFF',brief[1]],['HARDPOINT',workshopSlots[key]?.label||'SUPPORT'],['WEIGHT / SPEED',weight+' WT · −'+(weight*profile.weightPenalty).toFixed(1)+' U/S on '+profile.name]];
 for(const[label,value]of facts){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;el.querySelector('dl').append(dt,dd)}
 document.body.appendChild(el);++transmissionGeneration;transmissionClosing=false;commsSound('comms-in');el.querySelector('.fit-weapon').focus();
 const close=fit=>endTransmission(card,()=>{if(isUnlock===true)markWeaponAnnounced(id);else if(typeof isUnlock==='string'){const profile=Number(isUnlock.slice(-1)),q=quickEquipment[profile];if(!q.announced.includes(id))q.announced.push(id);q.pending=q.pending.filter(x=>x!==id);saveQuickEquipment();}el.remove();if(fit){openWorkshopWeapons(key);const item=node('weaponCarousel').querySelector('[data-weapon="'+id+'"]');item?.classList.add('new-weapon');item?.scrollIntoView?.({block:'nearest',inline:'center'});item?.focus()}else showPendingWeapon()});
 el.querySelector('.fit-weapon').onclick=()=>close(true);el.querySelector('.later').onclick=()=>close(false);
}
function showPendingWeapon(){if(node('builder').style.display==='none'||node('weaponTransmission'))return;const q=campaignActive?rookieProgress:quickEquipment[builderProfile()],id=q.pending.find(x=>!q.announced.includes(x));if(id)showWeaponTransmission(id,campaignActive?true:'quick'+builderProfile())}
const briefWeapons=openWorkshopWeapons;openWorkshopWeapons=function(key){briefWeapons(key);const cards=Array.from(node('weaponCarousel').children);for(const card of cards){const im=card.querySelector('img');const id=im?im.src.split('/').pop().replace('.png',''):'';card.dataset.weapon=id;if(id&&!card.disabled){const info=document.createElement('button');info.className='weapon-info';info.textContent='BRIEFING';info.setAttribute('aria-label','Briefing: '+nameOf(id));info.onclick=e=>{e?.stopPropagation();showWeaponTransmission(id)};/* Keep controls siblings: nested buttons are invalid on Safari. */const wrap=document.createElement('div');wrap.className='weapon-choice';card.before(wrap);wrap.appendChild(card);wrap.appendChild(info)}}};
// The pending reward lives in the Workshop, never in a separate unlock screen.
const rewardFinish=finishBattle;finishBattle=function(winner){const old=!!battleResult;rewardFinish(winner);if(old||!campaignActive||!campaignOutcome)return;if(campaignOutcome.first){const id=ROOKIE_MATCHES[campaignOutcome.mission].reward;if(!rookieProgress.announced.includes(id)&&!rookieProgress.pending.includes(id))rookieProgress.pending.push(id)}if(!campaignOutcome.won||p.hp<700)rookieProgress.repairs++;saveRookie()};
const rewardPrepare=prepareCampaignWorkshop;prepareCampaignWorkshop=function(){resetBattleInputs();rewardPrepare();showPendingWeapon()};
const rewardQuickWorkshop=enterSelectedWorkshop;enterSelectedWorkshop=function(){resetBattleInputs();rewardQuickWorkshop();showPendingWeapon()};node('modeConfirm').onclick=()=>enterSelectedWorkshop();
const resultReturn=node('return').onclick;node('return').onclick=()=>{
 if(!campaignActive){resultReturn();showPendingWeapon();return}if(!battleResult||!currentPanel().classList.contains('panel-off'))return;
 resetBattleInputs();cancelDeployment();Sound.stopAll();const outcome={...campaignOutcome},m=ROOKIE_MATCHES[outcome.mission];
 const moods={jim:outcome.won?'win':'loss',dave:outcome.won?'win':'loss'};for(const b of m.bots)moods[b.name.toLowerCase()]=outcome.won?'loss':'win';
 if(!outcome.won){showStoryDialogue(m.loss,prepareCampaignWorkshop,m,moods);return}
 const lines=m.win;
 showStoryDialogue(lines,()=>{if(outcome.mission===4){showRookieLadder();return}campaignMission=outcome.mission+1;const next=ROOKIE_MATCHES[campaignMission];showStoryDialogue(next.lines,prepareCampaignWorkshop,next)}, {...m,brief:'MATCH COMPLETE · '+rookieProgress.completed+' / 5 VICTORIES'},moods);
};
// Some iPads allow playback at boot; otherwise the first gesture starts it.
Sound.startMusic();for(const type of ['pointerdown','touchstart','keydown'])document.addEventListener(type,()=>{if(!inArena){Sound.unlock();Sound.startMusic()}},{passive:true});

const equipmentVictory=checkProgressVictory;checkProgressVictory=function(){const before=victoryProfiles.map(x=>x.wins);equipmentVictory();let changed=false;for(let i=0;i<2;i++){if(victoryProfiles[i].wins<=before[i])continue;changed=true;const q=quickEquipment[i];for(const[id,wins]of Object.entries(WEAPON_UNLOCK))if(wins>before[i]&&wins<=victoryProfiles[i].wins&&!q.announced.includes(id)&&!q.pending.includes(id))q.pending.push(id)}if(changed)saveQuickEquipment()};

const commsBuildTurn=displayBuildTurn;displayBuildTurn=function(){commsBuildTurn();showPendingWeapon()};
