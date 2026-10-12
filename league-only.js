'use strict';
// Championship and league play are the public entry routes.
// Keep the old terminal DOM for shared workshop initialisers, but retire its routes.
function returnToLeagueSplash(){
 if(duelActive)leaveDuel();
 inArena=false;lockBattlePage(false);closeWorkshopWeapons();
 node('startScreen').hidden=true;node('builder').style.display='none';node('arena').style.display='none';
 selectedMode=null;testLoadouts=false;node('splash').hidden=false;
 Sound.unlock();Sound.startMusic();node('splashCampaign').focus();
}
showLevelSelect=returnToLeagueSplash;
enterSelectedWorkshop=returnToLeagueSplash;
node('modeConfirm').onclick=returnToLeagueSplash;
node('levelBack').onclick=returnToLeagueSplash;
node('startScreen').hidden=true;node('startScreen').inert=true;
node('startScreen').setAttribute('aria-hidden','true');
testLoadouts=false;
try{localStorage.removeItem('iron-pit-test-loadouts');}catch(e){}
updateProgressDisplay();

// Retain shared duel definitions but retire every public entry point.
beginDuelBuild=returnToLeagueSplash;node('twoPlayer').onclick=returnToLeagueSplash;
