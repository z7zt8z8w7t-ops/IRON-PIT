'use strict';
// Approved art selections. Original portraits remain available for other moods.
const portraits95=portraitFor;
const pilotPortrait95=pilotPortrait;
pilotPortrait=function(who,mood='focused'){return who==='jim'?portraitFor(who,mood):pilotPortrait95(who,mood);};
portraitFor=function(who,mood='focused'){
 if(who==='jim'||who==='rourke')return 'assets/rourke-'+(mood==='win'?'win':mood==='loss'?'loss':'standard')+'-v95.png';
 if(who==='hudson'||who==='kane'){
  if(['loss','stern','financial'].includes(mood))return 'assets/kane-stern-v95.jpg';
  if(!['win','league-win','championship-win'].includes(mood))return 'assets/kane-smile-v95.jpg';
 }
 return portraits95(who,mood);
};
// The original standard face is also used in roster/build pilot cards.
for(const img of document.querySelectorAll('[data-pilot="jim"] img, img[src="assets/story-jim.jpg"]'))img.src=portraitFor('jim');
splashArt.src='assets/splash-v95.png';
COMIC_PAGES.splice(0,COMIC_PAGES.length,
 {src:'assets/intro-cover-v95.png',alt:'Iron Pit — The Rookie Leagues. The exterior arena at dusk, with the approved logo and cream border.'},
 {src:'assets/intro-1-v95.png',alt:'Dave’s Fix n Spray and Proving Ground. Dave and Rourke stand beside Rourke’s towering, scorched bare-steel light tank.'},
 {src:'assets/intro-2-v95.png',alt:'Dave: You bought the cheapest mech in the yard. Rourke: You said you could fix anything. Dave: Getting it moving is one thing. Keeping you alive is another. Rourke: Then let’s start with moving.'},
 {src:'assets/intro-3-v95.png',alt:'Dave: Why the Pit, Rourke? Rourke: I’m tired of scraping by. Taking whatever work someone throws me. I want something that’s mine. Something I can build on.'}
);
preloadComicArtwork(COMIC_PAGES);

// New floor, same arena architecture and collision grid as the other stadiums.
REBUILT_ARENAS['iron-pit']={label:'Iron Pit',description:'Sliding iron covers · permanent grinder pits',ground:'iron-pit-v95',dark:0};
ARENA_VARIANTS['iron-pit']=REBUILT_ARENAS['iron-pit'];
const championshipFinal95=CHALLENGER_MATCHES[CHALLENGER_MATCHES.length-1];
championshipFinal95.arena='iron-pit';
championshipFinal95.brief+=' Watch the tower warnings: amber, then rapid red. Covers slide aside and grinders stay open.';
championshipFinal95.lines.splice(1,0,['dave','The Iron Pit floor opens over grinders. Watch the amber lights, then the fast red warning. Once a square opens, stay clear—it stays open.']);

let artworkReady95=false;
const artworkLoad95=Promise.all(['iron-pit-v95','grinder-v95'].map(id=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{images[id]=im;resolve();};im.onerror=()=>reject(new Error(id));im.src='assets/'+id+'.png?v95';}))).then(()=>{artworkReady95=true;}).catch(error=>{console.error('Iron Pit artwork failed',error);node('loading').textContent='Iron Pit artwork failed to load. Please reload.';});
const grinders95=new IronPitGrinders.Controller(),grinderCrushes95=[];
const terrainReset95=resetTerrain;
resetTerrain=function(){terrainReset95();grinders95.reset();grinderCrushes95.length=0;for(const a of [p,...enemies])a.grinderDeath=false;};
const terrainStep95=stepTerrain;
stepTerrain=function(dt){
 terrainStep95(dt);
 if(arenaKind!=='iron-pit'||weaponRange||deployment||battleFinished()||trainingActive||!artworkReady95)return;
 grinders95.step(dt);
 // Resolve every actor before settling a result, including simultaneous falls.
 for(const actor of [p,...enemies]){
  if(!aliveActor(actor)||actor.ejecting)continue;
  const tile=grinders95.catches(actor.x,actor.y,ARENA.radius*.45);if(!tile)continue;
  const loadout={...actorLoadout(actor)};
  actor.hp=0;actor.parts.hull=0;actor.dead=true;actor.alive=false;actor.shield=0;actor.grinderDeath=true;
  if(actor===p){stopFiring();cancelPlayerLaunches();stopRepair();ejectHeld=false;ejectPress=0;input.move={x:0,y:0};}
  grinderCrushes95.push({x:actor.x,y:actor.y,heading:actor.heading,angle:actor.angle,loadout,cell:tile.cell,age:0,burst:false,pieces:mechFragments(loadout,actor.heading,actor.angle)});
  crowdDestroyReaction();Sound.play('mech-explosion',actor.x,actor.y,.75,.65,true);
 }
};
// Grinder deaths bypass destroyMech's automatic escape-pod wrapper.
const victoryCheck95=checkProgressVictory;
checkProgressVictory=function(){if(!grinderCrushes95.some(h=>h.age<1.15))victoryCheck95();};
const combatStep95=stepCombatFx;
stepCombatFx=function(dt){combatStep95(dt);for(let i=grinderCrushes95.length-1;i>=0;i--){const h=grinderCrushes95[i];h.age+=dt;if(!h.burst&&h.age>.7){h.burst=true;blastEvents.push({x:h.x,y:h.y,age:0,nuke:false});Sound.play('mech-explosion',h.x,h.y,1.1,.8,true);}if(h.age>2)grinderCrushes95.splice(i,1);}};
const clearCombat95=clearCombatFx;
clearCombatFx=function(){grinderCrushes95.length=0;clearCombat95();};
const battleReport95=showBattleReport;
showBattleReport=function(panel,a){battleReport95(panel,a);if(a.grinderDeath)panel.querySelector('.report-header strong').textContent='MECH DESTROYED';};

// Source floor excludes generated stands; the existing v91 frame is retained.
function ironFloor95(c){
 const im=images['iron-pit-v95'],xs=[232,480,730,985],ys=[127,365,566,765,964];
 // Align the approved iron plates to the same 3 × 4, 600-unit tower grid.
 for(let row=0;row<4;row++)for(let col=0;col<3;col++)c.drawImage(im,xs[col]/1216*im.width,ys[row]/1293*im.height,(xs[col+1]-xs[col])/1216*im.width,(ys[row+1]-ys[row])/1293*im.height,col*600,row*600,600,600);
}
const floor95=rebuiltDrawFloor;
rebuiltDrawFloor=function(c){if(arenaKind!=='iron-pit'||!artworkReady95)return floor95(c);ironFloor95(c);};
function drawGrinder95(c,tile){
 const b=ArenaLogic.bounds(tile.cell),u=grinders95.opening(tile);if(u<=0)return;
 const half=300*u,im=images['grinder-v95'],floor=images['iron-pit-v95'];
 c.save();c.beginPath();c.rect(b.x,b.y,600,600);c.clip();
 c.fillStyle='#010203';c.fillRect(b.x,b.y,600,600);
 c.drawImage(im,b.x+12,b.y+12,576,576);
 // Opposing serrated rollers move toward the central throat, inside the pit.
 c.save();c.beginPath();c.rect(b.x+36,b.y+38,528,524);c.clip();
 for(let row=0;row<2;row++){
  const y=b.y+38+row*262,phase=((terrainClock*75)%66)*(row?-1:1);
  c.save();c.beginPath();c.rect(b.x+36,y,528,262);c.clip();
  for(let n=-1;n<2;n++)c.drawImage(im,im.width*.045,im.height*(row?.51:.13),im.width*.91,im.height*.35,b.x+36+n*528+phase,y-5+Math.sin(terrainClock*25)*3,528,272);
  c.restore();
 }
 c.restore();
 // Covers slide outward, disappearing beneath the intact neighbouring plates.
 for(const side of [-1,1]){
  c.save();c.beginPath();c.rect(b.x+(side<0?0:300+half),b.y,300-half,600);c.clip();
  const shift=side*half;c.translate(shift,0);ironFloor95(c);c.restore();
 }
 c.strokeStyle='#242b2b';c.lineWidth=13;c.strokeRect(b.x+5,b.y+5,590,590);
 c.restore();
}
const terrainDraw95=drawTerrain;
drawTerrain=function(c){terrainDraw95(c);if(arenaKind==='iron-pit'&&artworkReady95)for(const tile of grinders95.tiles)drawGrinder95(c,tile);};
const warningColour95=rebuiltWarningColour;
rebuiltWarningColour=function(n){if(arenaKind==='iron-pit'){const w=grinders95.warning();if(w&&ArenaLogic.corners(w.cell).some(v=>v.x===n.x&&v.y===n.y))return w.lit?(w.red?'#ff2517':'#ffb52d'):'#27241c';}return warningColour95(n);};
const cosmetics95=drawWeaponCosmetics;
drawWeaponCosmetics=function(c){
 cosmetics95(c);if(arenaKind!=='iron-pit')return;
 for(const h of grinderCrushes95){
  const b=ArenaLogic.bounds(h.cell),u=Math.min(1,h.age/1.05);
  c.save();c.beginPath();c.rect(b.x+15,b.y+15,570,570);c.clip();
  c.translate(h.x,h.y+u*80);c.rotate(Math.sin(h.age*65)*u*.18);c.scale(1-u*.8,1-u*.92);c.globalAlpha=1-u;
  if(h.age<.3)mech(c,0,0,.85,h.heading,h.angle,h.loadout);
  else for(const f of h.pieces){c.save();c.translate(f.x*(1-u)+Math.sin(f.dir)*u*35,f.y*(1-u));c.rotate(f.angle+f.spin*u);c.scale(f.flip?-1:1,1);c.drawImage(f.image,-f.w/2,-f.h/2,f.w,f.h);c.restore();}
  c.restore();
  if(h.age<1)for(let j=0;j<7;j++){const a=j*2.399+h.age*4;glow(c,h.x+Math.cos(a)*h.age*95,h.y+Math.sin(a)*h.age*75,6,'#ffc45e',.8*(1-h.age));}
 }
};

// Fixtures and deployment share the final's arena ID. Use a whole-arena preview.
const fixture95=fixtureCard70;
fixtureCard70=function(m,i,choose){const card=fixture95(m,i,choose);if(m.arena==='iron-pit'){const im=card.querySelector('.fixture-arena70 img');if(im)im.src='assets/iron-pit-v95.png';}return card;};
