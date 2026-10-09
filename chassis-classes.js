'use strict';
// Paint choice is independent of class. Legacy IDs remain valid save-game aliases.
const CHASSIS_CLASSES={
 'tank-light':{name:'Light tank',type:'tank',grade:'light',speed:210,armour:.12,weightPenalty:1.7,minimum:105,accent:'#bddd76',asset:'tank-light',width:205,height:212.5},
 chassis:{name:'Assault tank',type:'tank',grade:'assault',speed:170,armour:.25,weightPenalty:1.7,minimum:90,accent:'#efc078',asset:'tank-assault',width:225,height:212.5},
 'tank-heavy':{name:'Heavy tank',type:'tank',grade:'heavy',speed:140,armour:.38,weightPenalty:1.7,minimum:75,accent:'#9caedc',asset:'tank-heavy',width:245,height:225},
 'biped-light':{name:'Light biped',type:'biped',grade:'light',speed:260,armour:.12,weightPenalty:3,minimum:130,accent:'#75e8df',partWidth:.82,footWidth:.82},
 biped:{name:'Assault biped',type:'biped',grade:'assault',speed:220,armour:.25,weightPenalty:3,minimum:110,accent:'#bba1ec',partWidth:1,footWidth:1},
 'biped-heavy':{name:'Heavy biped',type:'biped',grade:'heavy',speed:180,armour:.38,weightPenalty:3,minimum:90,accent:'#bad5d9',partWidth:1.2,footWidth:1.25}
};
const CHASSIS_IDS=Object.keys(CHASSIS_CLASSES);
const CHASSIS_ASSETS=['tank-light','tank-assault','tank-heavy',...['light','assault','heavy'].flatMap(g=>['hip','thigh','shin','knee','foot'].map(p=>'biped-'+g+'-'+p))];
function chassisProfile(loadout){return CHASSIS_CLASSES[typeof loadout==='string'?loadout:loadout?.chassis]||CHASSIS_CLASSES.chassis}
function isBiped(loadout){return chassisProfile(loadout).type==='biped'}
function bipedAsset(id,loadout){return id.replace('biped-','biped-'+chassisProfile(loadout).grade+'-')}
function applyChassisPanel(){const panel=currentPanel();if(panel)panel.style.setProperty('--pad-accent',chassisProfile(build).accent)}
