'use strict';
function resetWorkshopLoadout70(){
 build={...build,chassis:'',turret:'',left:'',right:'',rear:''};
 modifications={primary:'standard',secondary:'standard',support:'standard'};
 for(const key of ['chassis','turret','left','right','rear'])node(key).value='';
 closeWorkshopWeapons();showWorkshopTab('chassis');update();saveWorkshopBuild();
 if(campaignActive){rookieProgress.build={...build};saveRookie();}
}
const prepareEmpty70=prepareCampaignWorkshop;
prepareCampaignWorkshop=function(){prepareEmpty70();resetWorkshopLoadout70();};
const selectedEmpty70=enterSelectedWorkshop;
enterSelectedWorkshop=function(){const valid=selectedMode&&selectedArena;selectedEmpty70();if(valid)resetWorkshopLoadout70();};
// modeConfirm retains a direct reference, so update its handler too.
node('modeConfirm').onclick=enterSelectedWorkshop;
const duelEmpty70=displayBuildTurn;
displayBuildTurn=function(){duelEmpty70();resetWorkshopLoadout70();};
const returnEmpty70=node('return').onclick;
node('return').onclick=()=>{
 const wasArena=inArena,ticket=transmissionGeneration;
 returnEmpty70();
 const accepted=wasArena&&(!inArena||ticket!==transmissionGeneration);
 if(accepted){selectNextWorkshopSong();if(node('builder').style.display!=='none')resetWorkshopLoadout70();}
};
// Guard before campaign wrappers can substitute a default qualifier chassis.
const emptyDeploy70=node('deploy').onclick;
node('deploy').onclick=()=>{if(!build.chassis){node('status').textContent='Choose a chassis before deploying.';showWorkshopTab('chassis');return}emptyDeploy70();};
// Weapon modifier controls are disabled for this build; rewards still unlock equipment.
node('modifierChoices').hidden=true;node('workshopModifier').parentElement.hidden=true;
const emptyRefresh70=refreshWorkshop;
refreshWorkshop=function(){emptyRefresh70();node('buildBack').hidden=campaignActive;if(!build.chassis){node('schematicTitle').textContent='SELECT A CHASSIS';node('workshopSpeed').textContent='—';node('workshopWeight').textContent='0';node('workshopTTK').textContent='—';node('workshopTarget').textContent='';}node('deploy').disabled=!ready||!build.chassis;};

const emptyLesson70=startWorkshopTutorial;startWorkshopTutorial=function(){resetWorkshopLoadout70();emptyLesson70();};
