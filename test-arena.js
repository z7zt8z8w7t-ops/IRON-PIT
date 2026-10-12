'use strict';
// Testing is a temporary session. It never grants campaign rewards.
let testArenaActive=false,testArenaSnapshot=null;
const TEST_ARENA_SAVE_KEYS=['iron-pit-build-v2','iron-pit-modifications','iron-pit-pilots','iron-pit-arena','iron-pit-test-loadouts'];
function testArenaStop(){
 resetBattleInputs();cancelDeployment();cancelVictoryPickup();stopRepair();stopFiring();cancelLaunches();Sound.stopAll();
 inArena=false;weaponRange=false;rangeHUD.hidden=true;matchProgress=null;resetBattleResult();clearCombatFx();lockBattlePage(false);
 node('arena').style.display='none';node('builder').style.display='none';node('startScreen').hidden=true;
 closeWorkshopWeapons();closeBuildPickers();
}
function openTestArenaSelect(){
 if(!testArenaActive){
  const storage={};for(const key of TEST_ARENA_SAVE_KEYS){try{storage[key]=localStorage.getItem(key)}catch(e){}}
  testArenaSnapshot={build:{...build},mods:{...modifications},arena:arenaKind,selectedArena,selectedMode,selectedOpponents,buildTurn,testLoadouts,pilots:[...quickPilots],storage};
  testArenaActive=true;testLoadouts=true;
 }
 testArenaStop();node('splash').hidden=true;node('testArenaSelect').hidden=false;node('testArenaExit').hidden=true;
 renderTestArenaCards();Sound.unlock();Sound.startMusic();node('testArenaBack').focus();
}
function enterTestArenaWorkshop(id){
 if(!testArenaActive||!ARENA_VARIANTS[id])return;
 arenaKind=id;selectedArena=id;selectedMode='1';selectedOpponents=1;buildTurn=-1;
 testLoadouts=true;node('arenaChoice').value=id;setArenaMode('solo');
 node('testArenaSelect').hidden=true;node('splash').hidden=true;
 node('onePlayer').onclick();resetWorkshopLoadout70();update();refreshTestingLabels();
 node('buildBack').focus();
}
function leaveTestArena(){
 if(!testArenaActive)return;
 testArenaStop();const snap=testArenaSnapshot;testArenaActive=false;testArenaSnapshot=null;
 build={...snap.build};modifications={...snap.mods};arenaKind=snap.arena;selectedArena=snap.selectedArena;
 selectedMode=snap.selectedMode;selectedOpponents=snap.selectedOpponents;buildTurn=snap.buildTurn;
 testLoadouts=snap.testLoadouts;quickPilots=[...snap.pilots];
 for(const [key,value]of Object.entries(snap.storage)){try{if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value)}catch(e){}}
 for(const key in build)if(node(key))node(key).value=build[key];node('arenaChoice').value=arenaKind;
 node('testArenaSelect').hidden=true;node('testArenaExit').hidden=true;updateProgressDisplay();update();
 node('splash').hidden=false;Sound.startMusic();node('splashTestArena').focus();
}
function refreshTestingLabels(){
 node('testArenaExit').hidden=!testArenaActive;
 if(!testArenaActive)return;
 node('workshopMode').textContent='TEST ARENA · '+ARENA_VARIANTS[arenaKind].label.toUpperCase();
 node('buildVersion').textContent='TEST ARENA · v87';node('buildBack').hidden=false;
 node('buildBack').textContent='BACK TO ARENA SELECT';node('deploy').textContent='START ARENA TEST →';
 node('loadoutReadout').textContent='ALL EQUIPMENT UNLOCKED · TEST SESSION';
}
function renderTestArenaCards(){
 const list=node('testArenaCards');list.replaceChildren();
 for(const [id,v]of Object.entries(ARENA_VARIANTS)){
  const button=document.createElement('button');button.type='button';button.className='test-arena-card';
  button.setAttribute('aria-label','Test '+v.label);button.dataset.testArena=id;
  const canvas=document.createElement('canvas');canvas.width=180;canvas.height=170;canvas.setAttribute('aria-hidden','true');
  button.append(canvas);const title=document.createElement('strong');title.textContent=v.label;button.append(title);
  const description=document.createElement('small');description.textContent=v.description;button.append(description);
  button.onclick=()=>enterTestArenaWorkshop(id);list.append(button);
  if(ready){const c=canvas.getContext('2d');c.fillStyle='#071019';c.fillRect(0,0,180,170);
   c.drawImage(images[v.ground],25,24,130,122);c.fillStyle='rgba(0,8,22,'+v.dark+')';c.fillRect(25,24,130,122);
   if(id==='rotating')c.drawImage(images['arena-platform'],54,49,72,72);
   c.drawImage(images['stadium-frame'],0,0,180,170);
  }
 }
}
const testArenaAvailability=weaponAvailable;
weaponAvailable=function(id,profile){return testArenaActive||testArenaAvailability(id,profile)};
const testArenaSave=save;save=function(){if(!testArenaActive)return testArenaSave()};
const testArenaWorkshopSave=saveWorkshopBuild;saveWorkshopBuild=function(){if(!testArenaActive)return testArenaWorkshopSave()};
const testArenaPilot=choosePilot;
choosePilot=function(id){
 if(!testArenaActive)return testArenaPilot(id);
 let previous,read=false;try{previous=localStorage.getItem('iron-pit-pilots');read=true}catch(e){}
 try{return testArenaPilot(id)}finally{if(read){try{if(previous===null)localStorage.removeItem('iron-pit-pilots');else localStorage.setItem('iron-pit-pilots',previous)}catch(e){}}}
};
const testArenaRefresh=refreshWorkshop;refreshWorkshop=function(){testArenaRefresh();refreshTestingLabels()};
const testArenaUpdate=update;update=function(){testArenaUpdate();refreshTestingLabels()};
const testArenaBack=node('buildBack').onclick;
node('buildBack').onclick=()=>testArenaActive?openTestArenaSelect():testArenaBack();
const testArenaLevels=showLevelSelect;
showLevelSelect=function(){leaveTestArena();node('testArenaSelect').hidden=true;return testArenaLevels()};
const testArenaCampaign=enterCampaign;
enterCampaign=function(){leaveTestArena();node('testArenaSelect').hidden=true;return testArenaCampaign()};
node('splashCampaign').onclick=()=>enterCampaign();
node('splashTestArena').onclick=openTestArenaSelect;
node('testArenaBack').onclick=leaveTestArena;node('testArenaExit').onclick=openTestArenaSelect;
const testArenaDeploy=node('deploy').onclick;
node('deploy').onclick=()=>{testArenaDeploy();if(testArenaActive&&inArena&&matchProgress)matchProgress.test=true;refreshTestingLabels()};
const testArenaReturn=node('return').onclick;
node('return').onclick=()=>{testArenaReturn();refreshTestingLabels()};
const testArenaReady=setInterval(()=>{if(ready){if(!node('testArenaSelect').hidden)renderTestArenaCards();clearInterval(testArenaReady)}},150);
