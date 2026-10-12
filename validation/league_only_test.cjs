const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const root=__dirname+'/test_arena_work/IRON-PIT-main/';
const nodes=new Map();const node=id=>{if(!nodes.has(id))nodes.set(id,{hidden:false,style:{},setAttribute(k,v){this[k]=v},focus(){this.focused=true}});return nodes.get(id)};
let ladder=0,saves=0,unlocked=0,music=0;
const c={node,duelActive:false,inArena:true,selectedMode:'test',testLoadouts:true,buildTurn:0,campaignActive:false,campaignLeague:null,campaignMission:0,campaignOutcome:{},campaignQuickBuild:null,campaignQuickArena:null,arenaKind:'night',build:{chassis:'chassis'},modifications:{primary:'standard'},rookieProgress:{completed:0},campaignCompleted:()=>0,campaignMatches:()=>[{},{}],showRookieLadder:()=>ladder++,BOT_ACTORS:[],campaignBots:[],Sound:{unlock(){unlocked++},startMusic(){music++},stopAll(){}},localStorage:{removeItem(key){assert.equal(key,'iron-pit-test-loadouts')}},leaveDuel(){c.duelActive=false},lockBattlePage(){},closeWorkshopWeapons(){},cancelDeployment(){},stopFiring(){},stopRepair(){},clearCombatFx(){},storyScreen:()=>node('story'),saveWorkshopBuild(){saves++},update(){},updateProgressDisplay(){},showLevelSelect(){throw Error('retired route used')},enterSelectedWorkshop(){throw Error('retired entry used')}};
vm.createContext(c);
function getfn(name){const s=fs.readFileSync(root+'campaign.js','utf8');const start=s.indexOf('function '+name+'(');let d=0,j=s.indexOf('{',start);for(;j<s.length;j++){if(s[j]==='{')d++;else if(s[j]==='}'&&!--d)break}return s.slice(start,j+1)}
vm.runInContext(getfn('enterCampaign')+'\n'+getfn('exitCampaign'),c);
vm.runInContext(fs.readFileSync(root+'league-only.js','utf8'),c);
assert.equal(typeof c.beginDuelBuild,'function');c.beginDuelBuild();assert.equal(c.testLoadouts,false);assert.equal(node('startScreen').inert,true);
for(const call of [()=>c.showLevelSelect(),()=>c.enterSelectedWorkshop(),()=>node('modeConfirm').onclick()]){call();assert.equal(node('splash').hidden,false);assert.equal(node('startScreen').hidden,true);assert.equal(node('builder').style.display,'none');assert.equal(c.inArena,false)}
c.enterCampaign();assert.equal(c.campaignActive,true);assert.equal(c.selectedMode,'story');assert.equal(c.campaignLeague,'rookie');assert.equal(ladder,1);
c.exitCampaign();assert.equal(c.campaignActive,false);assert.equal(node('splash').hidden,false);assert.equal(node('startScreen').hidden,true);assert.equal(saves,1);
c.rookieProgress.completed=5;c.enterCampaign();assert.equal(c.campaignLeague,'challenger');assert.equal(ladder,2);
const html=fs.readFileSync(root+'index.html','utf8');for(const id of ['splashStart','splashTestArena','testArenaSelect','testArenaExit'])assert.ok(!html.includes('id="'+id+'"'),id);
assert.ok(!html.includes('src="test-arena.js'));assert.ok(!html.includes('href="test-arena.css'));
for(const n of ['workshop.js','workshop-v52.js','controls.js','cinematic.js','campaign.js'])assert.ok(!fs.readFileSync(root+n,'utf8').includes("node('splashStart')"),n);
assert.ok(!fs.readFileSync(root+'rebuilt-arenas.js','utf8').match(/testArena|refreshTestingLabels|enterTestArenaWorkshop|leaveTestArena/));
console.log('PASS: removed entries/modules, retired routes closed, testing unlock disabled, rookie/challenger entry, campaign exit to splash.');
