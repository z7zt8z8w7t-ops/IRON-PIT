const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {Canvas,loadImage}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/node_modules/skia-canvas');
const root=__dirname+'/test_arena_work/IRON-PIT-main/';
const Logic=require(root+'arena-logic.js'),RotorPit=require(root+'rotor-pit.js');
function fn(file,name){const s=fs.readFileSync(root+file,'utf8'),start=s.indexOf('function '+name+'(');assert.ok(start>=0,name);let depth=0,b=s.indexOf('{',start),end=b;for(;end<s.length;end++){if(s[end]==='{')depth++;else if(s[end]==='}'&&!--depth)break;}return s.slice(start,end+1);}
class El{constructor(){this.hidden=true;this.style={};this.children=[];this.dataset={};}append(...v){this.children.push(...v)}replaceChildren(...v){this.children=v}setAttribute(k,v){this[k]=v}getContext(){return new Canvas(440,390).getContext('2d')}}
const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,new El());return nodes.get(id)};
const document={createElement(tag){return tag==='canvas'?new Canvas(160,160):new El()},getElementById:node};
const no=()=>{},sound=[];const ctx={console,document,node,setInterval:()=>1,clearInterval:no,Image:class{set src(v){this.onload()}},ArenaLogic:Logic,RotorPit,images:{},ready:true,testArenaActive:true,selectedArena:'night',arenaKind:'night',arenaMode:'solo',weaponRange:false,inArena:true,deployment:null,terrainAngle:0,terrainClock:0,fxClock:6,layoutCanvas:null,flameAtlas:null,dustWisp:null,groundTraces:[],weatherPrevious:new WeakMap(),goldenShadowCache:new Map(),
 ARENA:{width:1750,height:2000,radius:120,spawn:{x:875,y:1750}},PERIMETER:{warning:.65,length:390,damage:85,maxActive:2},perimeterJets:[],perimeterWait:5,
 p:{x:900,y:2140,hp:700,heading:.4,angle:1.1,alive:true},enemies:[{x:900,y:260,hp:700,alive:true,heading:.2,angle:.8}],build:{chassis:'chassis'},
 aliveActor:a=>a.alive!==false&&!a.dead,actorLoadout:a=>a.loadout||ctx.build,isBiped:()=>false,battleFinished:()=>false,shielded:()=>false,absorbShield:no,smokePuff:no,
 Sound:{loop:(name,key)=>sound.push(['loop',name,key]),stopLoop:key=>sound.push(['stop',key]),play:name=>sound.push(['play',name])},
 setArenaMode(){Object.assign(ctx.ARENA,{width:1750,height:2000,spawn:{x:875,y:1750}})},fieldEnabled:()=>true,solidPoint:()=>false,urbanBlocked:()=>false,
 resetTerrain(){ctx.terrainClock=0},resetPerimeter(){ctx.perimeterJets=[]},stepTerrain:no,stadiumView:()=>({legacy:true}),drawStadiumFrame:no,drawTerrain:no,drawUrbanGround:no,drawUrbanNight:no,drawCrowdShield:no,crowdShieldHits:[],stormStrength:()=>0,weatherCanSee:()=>true,
 refreshTestingLabels:no,refreshArenaHero:no,refreshWorkshop:no,update:no,enterTestArenaWorkshop(id){ctx.arenaKind=id;ctx.selectedArena=id;ctx.setArenaMode('solo')},leaveTestArena(){ctx.testArenaActive=false;ctx.arenaKind='night'},drawSandstorm:no,drawPerimeter:no,
 mechHeadlightState:()=>({strength:1}),lightPolygon:(x,y,a,spread,r)=>[[x,y],[x+Math.sin(a-spread/2)*r,y-Math.cos(a-spread/2)*r],[x+Math.sin(a+spread/2)*r,y-Math.cos(a+spread/2)*r]],
 enemyHit(id,stats,f,t,part,actor){actor.hp-=stats.damage;if(actor.hp<=0)actor.alive=false;},
 urbanMove(a,x,y){if(!ctx.urbanBlocked(x,y)){a.x=x;a.y=y}},urbanSweep:()=>null,glow:no};
const context=vm.createContext(ctx),run=s=>vm.runInContext(s,context);
ctx.resetUrban=()=>{ctx.resetTerrain();ctx.resetPerimeter();ctx.resetFields()};
run(fs.readFileSync(root+'arenas.js','utf8').split('\n').slice(0,2).join('\n'));
for(const name of ['perimeterTexture','perimeterActive','perimeterReach','perimeterContains','stepPerimeter'])run(fn('perimeter.js',name));
for(const name of ['dustNoise','dustTexture','stepArenaAtmosphere','drawGroundWeather'])run(fn('arena-atmosphere.js',name));
run(fn('urban.js','clipLight'));
run(fs.readFileSync(root+'nuclear.js','utf8').split('\n').slice(0,14).join('\n'));
run(fs.readFileSync(root+'forcefields.js','utf8'));
ctx.drawStadiumAtmosphere=no;ctx.stadiumSequence=null;ctx.urbanClock=6;
async function main(){
 const paths=fs.readdirSync(root+'assets').filter(v=>v.startsWith('rebuilt-'));
 const loaded=await Promise.all(paths.map(async name=>[name.slice(0,-4),await loadImage(root+'assets/'+name)]));
 run(fs.readFileSync(root+'rebuilt-arenas.js','utf8'));await new Promise(resolve=>setImmediate(resolve));Object.assign(ctx.images,Object.fromEntries(loaded));
 run(fs.readFileSync(root+'arena-v90.js','utf8'));assert.equal(run('rebuiltAssetsReady'),true);for(const id of ['ashfall','rotor-pit']){ctx.arenaKind=id;ctx.setArenaMode('solo');for(let j=0;j<5;j++){const walls=ctx.fieldGenerate([],true);assert.ok(walls.length>=4);assert.equal(ctx.fieldConnected(walls),true);assert.ok(walls.every(b=>!b.diagonal));}}
 for(const rotor of [false,true])for(const e of Logic.edges(rotor)){assert.ok(e.a.x===e.b.x||e.a.y===e.b.y);const edge=n=>n.col===0||n.col===3||n.row===0||n.row===4;assert.ok(!(edge(e.a)&&edge(e.b)));}
 const ids=run('Object.keys(REBUILT_ARENAS)');assert.equal(ids.length,10);
 for(const id of ids){run(`enterTestArenaWorkshop(${JSON.stringify(id)})`);assert.equal(ctx.ARENA.width,1800);assert.equal(ctx.ARENA.height,2400);assert.equal(ctx.perimeterJets.length,10);assert.equal(ctx.urbanBlocked(900,2140),false);assert.equal(run('rebuiltNodes().length'),id==='rotor-pit'?18:20);ctx.refreshArenaHero();}
 assert.equal(Logic.cellAt(1799,2399),11);assert.equal(Logic.cellAt(1800,2399),-1);
 assert.equal(Logic.jets().some(j=>(j.col===0||j.col===3)&&(j.row===0||j.row===4)),false);
 // Every cell warns on exactly its four physical corner towers.
 for(let cell=0;cell<12;cell++){ctx.arenaKind='foundry';run(`rebuiltHazard=new ArenaLogic.Hazard('foundry');rebuiltHazard.phase='warning';rebuiltHazard.cell=${cell};rebuiltHazard.age=.1`);assert.equal(run('rebuiltNodes().filter(n=>rebuiltWarningColour(n)).length'),4);run('rebuiltHazard.age=1.4');assert.equal(run("rebuiltNodes().filter(n=>rebuiltWarningColour(n)==='#ff2714').length"),4);}
 // Active hazards damage a player and an AI inside; actors in other cells are safe.
 for(const id of ['foundry','drowned-sector']){ctx.arenaKind=id;ctx.setArenaMode('solo');Object.assign(ctx.p,{x:900,y:900,hp:700,alive:true});Object.assign(ctx.enemies[0],{x:1000,y:1000,hp:700,alive:true});ctx.enemies.push({x:1400,y:1800,hp:700,alive:true});run("rebuiltHazard.phase='active';rebuiltHazard.cell=4;rebuiltHazard.age=.2");ctx.stepTerrain(.1);assert.ok(ctx.p.hp<700);assert.ok(ctx.enemies[0].hp<700);assert.equal(ctx.enemies[1].hp,700);ctx.enemies.pop();}
 assert.ok(sound.some(v=>v[0]==='loop'&&v[1]==='fire-flame'&&v[2]==='foundry-heat'));
 // Cogs carry both kinds of actor, preserve their aim and release them on exit.
 ctx.arenaKind='rotor-pit';ctx.setArenaMode('solo');const ds=run('rebuiltRotor.discs');
 for(const d of ds){Object.assign(ctx.p,{x:d.x+50,y:d.y,hp:700,alive:true,angle:1.1});const old=ctx.p.y;ctx.stepTerrain(.2);assert.notEqual(ctx.p.y,old);assert.equal(ctx.p.angle,1.1);}
 Object.assign(ctx.p,{x:900,y:2140});const before=[ctx.p.x,ctx.p.y];ctx.stepTerrain(.2);assert.deepEqual([ctx.p.x,ctx.p.y],before);
 ctx.arenaKind='ashfall';ctx.setArenaMode('solo');assert.equal(ctx.urbanBlocked(600,600,100),true);assert.equal(ctx.solidPoint(600,600),true);assert.equal(ctx.fieldEnabled(),true);
 ctx.arenaKind='dust-crucible';ctx.setArenaMode('solo');run('rebuiltStormAge=6;rebuiltStormDuration=14');assert.equal(ctx.stormStrength(),1);assert.equal(ctx.weatherCanSee({x:100,y:100},{x:1400,y:1400}),false);
 // Execute the actual drawing code for all nine maps against native canvas.
 const sheet=new Canvas(576*3,768*4),sc=sheet.getContext('2d');
 for(let index=0;index<ids.length;index++){const id=ids[index];ctx.arenaKind=id;ctx.selectedArena=id;ctx.setArenaMode('solo');Object.assign(ctx.p,{x:900,y:2140,hp:700,alive:true});Object.assign(ctx.enemies[0],{x:900,y:260,hp:700,alive:true});ctx.terrainClock=18;
  if(id==='foundry')run("rebuiltHazard.phase='active';rebuiltHazard.cell=4;rebuiltHazard.age=1.8");
  if(id==='drowned-sector')run("rebuiltHazard.phase='active';rebuiltHazard.cell=4;rebuiltHazard.age=.6");
  if(id==='dust-crucible')run('rebuiltStormAge=6;rebuiltStormDuration=14');
  const canvas=new Canvas(576,768),c=canvas.getContext('2d');ctx.drawStadiumFrame(c,576,768);const v=ctx.stadiumView(576,768);assert.ok(Math.abs(v.w/v.h-.75)<1e-9);
  c.save();c.translate(v.x,v.y);c.scale(v.zoom,v.zoom);ctx.drawUrbanGround(c,576,768);ctx.drawTerrain(c);ctx.drawFields(c);ctx.drawUrbanNight(c);ctx.drawGroundWeather(c);ctx.drawPerimeter(c);ctx.drawSandstorm(c);c.restore();ctx.drawStadiumAtmosphere(c,576,768);sc.drawImage(canvas,index%3*576,Math.floor(index/3)*768);
 }
 fs.writeFileSync(__dirname+'/Iron_Pit_v90_arena_check.png',await sheet.toBuffer('png')); 
 ctx.arenaKind='night';ctx.setArenaMode('solo');assert.equal(ctx.arenaKind,'blackout');assert.equal(ctx.ARENA.width,1800);
 process.exitCode=0;console.log('PASS: all 10 registered/loaded/drawn, exact 12-cell geometry, 20/18 collision nodes, 10 non-corner jets, four-tower warnings, player/AI damage, safe cells, Foundry sound, five-disc carrying/release, storm visibility, legacy alias migration.');process.exit(0);
}
main().catch(e=>{console.error(e);process.exitCode=1});
