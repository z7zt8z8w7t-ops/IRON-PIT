'use strict';
const REBUILT_ARENAS={
 ashfall:{label:'Ashfall',description:'Drifting ash · occasional ash whirlwinds',ground:'rebuilt-ashfall',dark:0},
 'dust-crucible':{label:'Dust Crucible',description:'Rolling sandstorms obscure the floor and stands',ground:'rebuilt-dust',dark:0},
 'drowned-sector':{label:'Drowned Sector',description:'Filthy dark water · random electrical hazards',ground:'rebuilt-drowned',dark:0},
 blackout:{label:'Blackout',description:'Near darkness · terrain revealed by mech headlights',ground:'rebuilt-blackout',dark:.99},
 frostbite:{label:'Frostbite',description:'Snowfall · powder and fresh tracks',ground:'rebuilt-frostbite',dark:0},
 'rotor-pit':{label:'Rotor Pit',description:'Five moving cogs carry mechs around their centres',ground:'rebuilt-rotor',dark:0},
 foundry:{label:'Foundry',description:'Random white-hot grates · heat haze and drifting smoke',ground:'rebuilt-foundry',dark:0},
 'salt-flats':{label:'Salt Flats',description:'Cracked salt crust · drifting salt dust',ground:'rebuilt-salt',dark:0},
 scrapyard:{label:'Scrapyard',description:'Rusty ground · drifting dust and occasional sparks',ground:'rebuilt-scrap',dark:0}
};
Object.assign(ARENA_VARIANTS,REBUILT_ARENAS);
function rebuiltArena(){return !!REBUILT_ARENAS[arenaKind];}
let rebuiltAssetsReady=false,rebuiltAssetError=null,rebuiltRotor=null,rebuiltHazard=null,rebuiltSmoke=[],rebuiltSmokeWait=0;
let rebuiltStormAge=-1,rebuiltStormDuration=14,rebuiltStormWait=15;
const rebuiltParticles=Array.from({length:260},(_,i)=>({x:(i*937.17)%1800,y:(i*731.31)%2400,seed:i*2.39996}));
const rebuiltAssetIds=[...new Set(Object.values(REBUILT_ARENAS).map(v=>v.ground)),'rebuilt-stadium','rebuilt-cogs'];
Promise.all(rebuiltAssetIds.map(id=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{images[id]=im;resolve();};im.onerror=()=>reject(id);im.src='assets/'+id+'.png?v88';}))).then(()=>{rebuiltAssetsReady=true;layoutCanvas=null;if(!node('testArenaSelect').hidden)renderTestArenaCards();update();}).catch(id=>{rebuiltAssetError=id;node('testArenaNotice').textContent='Arena artwork could not load. Refresh after uploading the complete update.';});
const rebuiltArenaMode=setArenaMode;
setArenaMode=function(mode){rebuiltArenaMode(mode);if(!rebuiltArena())return;Object.assign(ARENA,{size:2400,width:1800,height:2400,spawn:{x:900,y:2140},spawns:[{x:900,y:2140},{x:900,y:260},{x:260,y:1200},{x:1540,y:1200}]});resetUrban();};
const rebuiltFields=fieldEnabled;fieldEnabled=function(){return rebuiltArena()?false:rebuiltFields();};
function rebuiltNodes(){return ArenaLogic.nodes(arenaKind==='rotor-pit');}
function rebuiltNodeBlocked(x,y,r){return rebuiltNodes().some(n=>Math.hypot(x-n.x,y-n.y)<r+42);}
const rebuiltSolid=solidPoint;solidPoint=function(x,y){return rebuiltArena()?(x<0||y<0||x>ARENA.width||y>ARENA.height||rebuiltNodeBlocked(x,y,0)):rebuiltSolid(x,y);};
const rebuiltBlocked=urbanBlocked;urbanBlocked=function(x,y,r=ARENA.radius){return rebuiltArena()?(x<r||y<r||x>ARENA.width-r||y>ARENA.height-r||rebuiltNodeBlocked(x,y,r)):rebuiltBlocked(x,y,r);};
const rebuiltReset=resetTerrain;
resetTerrain=function(){rebuiltReset();Sound.stopLoop('foundry-heat');Sound.stopLoop('water-arcs');rebuiltSmoke=[];rebuiltSmokeWait=0;rebuiltStormAge=-1;rebuiltStormWait=10+Math.random()*12;rebuiltHazard=arenaKind==='foundry'||arenaKind==='drowned-sector'?new ArenaLogic.Hazard(arenaKind==='foundry'?'foundry':'water'):null;
 if(arenaKind==='rotor-pit'){const ds=RotorPit.layout({x:0,y:0,width:1800,height:2400});ds[0].radius=453;for(let i=1;i<ds.length;i++)ds[i].radius=166;rebuiltRotor=new RotorPit.Controller(ds);}else rebuiltRotor=null;
};
const rebuiltPerimeterReset=resetPerimeter;
resetPerimeter=function(){rebuiltPerimeterReset();if(rebuiltArena()&&!weaponRange)perimeterJets=ArenaLogic.jets();};
const rebuiltTerrainStep=stepTerrain;
stepTerrain=function(dt){if(!rebuiltArena())return rebuiltTerrainStep(dt);terrainClock+=dt;
 if(rebuiltRotor){rebuiltRotor.step(battleFinished()?[]:[p,...enemies].filter(aliveActor),dt,(a,x,y)=>urbanMove(a,x,y));terrainAngle=rebuiltRotor.discs[0].angle;}
 if(arenaKind==='dust-crucible'){if(rebuiltStormAge<0){rebuiltStormWait-=dt;if(rebuiltStormWait<=0){rebuiltStormAge=0;rebuiltStormDuration=10+Math.random()*8;}}else{rebuiltStormAge+=dt;if(rebuiltStormAge>rebuiltStormDuration){rebuiltStormAge=-1;rebuiltStormWait=10+Math.random()*22;}}}
 for(let i=rebuiltSmoke.length-1;i>=0;i--){rebuiltSmoke[i].age+=dt;if(rebuiltSmoke[i].age>8)rebuiltSmoke.splice(i,1);}
 if(!rebuiltHazard||weaponRange||battleFinished()){Sound.stopLoop('foundry-heat');Sound.stopLoop('water-arcs');return;}
 const events=rebuiltHazard.step(dt);for(const ev of events)if(ev.phase==='active'&&arenaKind==='foundry'){const b=ArenaLogic.bounds(ev.cell);Sound.play('flame-start',b.x+300,b.y+300,.7,1,true);}
 if(rebuiltHazard.phase==='active'){
  const b=ArenaLogic.bounds(rebuiltHazard.cell),foundry=arenaKind==='foundry';Sound.loop(foundry?'fire-flame':'fire-arc',foundry?'foundry-heat':'water-arcs',b.x+300,b.y+300,.8,1);
  for(const a of [p,...enemies])if(aliveActor(a)&&ArenaLogic.cellAt(a.x,a.y)===rebuiltHazard.cell){const damage=(foundry?85:75)*dt;if(shielded(a))absorbShield(a,damage);else enemyHit(foundry?'flame':'arc',{damage,penetration:1},1,true,'hull',a);}
  if(foundry){rebuiltSmokeWait-=dt;if(rebuiltSmokeWait<=0){for(let i=0;i<3;i++)rebuiltSmoke.push({x:b.x+45+Math.random()*510,y:b.y+45+Math.random()*510,age:0,seed:Math.random()*6.28});if(rebuiltSmoke.length>240)rebuiltSmoke.splice(0,rebuiltSmoke.length-240);rebuiltSmokeWait=.09;}}
 }else{Sound.stopLoop('foundry-heat');Sound.stopLoop('water-arcs');}
};
const rebuiltView=stadiumView;
stadiumView=function(w,h){if(!rebuiltArena())return rebuiltView(w,h);const zoom=Math.min(w/2060,h/2680);return{x:(w-1800*zoom)/2,y:(h-2400*zoom)/2,w:1800*zoom,h:2400*zoom,zoom};};
function rebuiltStrip(c,im,sx,sy,sw,sh,x,y,w,h,vertical){const scale=vertical?w/sw:h/sh,length=(vertical?sh:sw)*scale,total=vertical?h:w;for(let at=0;at<total;at+=length){const size=Math.min(length,total-at);if(vertical)c.drawImage(im,sx,sy,sw,size/scale,x,y+at,w,size);else c.drawImage(im,sx,sy,size/scale,sh,x+at,y,size,h);}}
const rebuiltFrame=drawStadiumFrame;
drawStadiumFrame=function(c,w,h){if(!rebuiltArena()||!rebuiltAssetsReady)return rebuiltFrame(c,w,h);const v=stadiumView(w,h),m=130*v.zoom,im=images['rebuilt-stadium'];c.fillStyle='#080f12';c.fillRect(0,0,w,h);
 rebuiltStrip(c,im,0,0,im.width,65,v.x-m,v.y-m,v.w+2*m,m,false);rebuiltStrip(c,im,0,im.height-65,im.width,65,v.x-m,v.y+v.h,v.w+2*m,m,false);
 rebuiltStrip(c,im,35,0,65,im.height,v.x-m,v.y,m,v.h,true);rebuiltStrip(c,im,im.width-100,0,65,im.height,v.x+v.w,v.y,m,v.h,true);
 c.strokeStyle='#62777a';c.lineWidth=12*v.zoom;c.strokeRect(v.x-7*v.zoom,v.y-7*v.zoom,v.w+14*v.zoom,v.h+14*v.zoom);
};
function rebuiltDrawCog(c,d,index){const im=images['rebuilt-cogs'],large=index===0,sx=large?544:index===1||index===3?260:823,sy=large?700:index<3?240:1170,sr=large?278:96,house=large?588:234,plate=large?453:166;
 c.save();c.translate(d.x,d.y);c.beginPath();c.arc(0,0,house,0,Math.PI*2);c.arc(0,0,plate,0,Math.PI*2,true);c.clip('evenodd');c.drawImage(im,sx-sr,sy-sr,sr*2,sr*2,-house,-house,house*2,house*2);c.restore();
 c.save();c.translate(d.x,d.y);c.fillStyle='#030708';c.beginPath();c.arc(0,0,plate+2,0,Math.PI*2);c.fill();c.rotate(d.angle);c.beginPath();c.arc(0,0,plate,0,Math.PI*2);c.clip();const crop=large?214:68;c.drawImage(im,sx-crop,sy-crop,crop*2,crop*2,-plate,-plate,plate*2,plate*2);c.restore();
}
const rebuiltTerrainDraw=drawTerrain;drawTerrain=function(c){if(!rebuiltArena())return rebuiltTerrainDraw(c);if(rebuiltRotor&&rebuiltAssetsReady)rebuiltRotor.discs.forEach((d,i)=>rebuiltDrawCog(c,d,i));};
const rebuiltGround=drawUrbanGround;
// Draw each Foundry grate into its exact gameplay cell; generated border padding is excluded.
function rebuiltDrawFloor(c){if(!rebuiltAssetsReady)return;const im=images[REBUILT_ARENAS[arenaKind].ground];if(arenaKind!=='foundry'){c.drawImage(im,0,0,1800,2400);return;}const xs=[0,363,724,1086],ys=[0,352,691,1035,1418];for(let row=0;row<4;row++)for(let col=0;col<3;col++){const sx=xs[col]/1086*im.width,sy=ys[row]/1448*im.height,sw=(xs[col+1]-xs[col])/1086*im.width,sh=(ys[row+1]-ys[row])/1448*im.height;c.drawImage(im,sx,sy,sw,sh,col*600,row*600,600,600);}}
drawUrbanGround=function(c,w,h){if(!rebuiltArena())return rebuiltGround(c,w,h);rebuiltDrawFloor(c);if(arenaKind!=='salt-flats'||!rebuiltAssetsReady)return;const im=images['rebuilt-salt'];c.save();c.beginPath();c.rect(0,0,1800,2400);c.clip();for(let j=0;j<24;j++){const dx=Math.sin(terrainClock*2.1+j*.7)*.9,dy=Math.sin(terrainClock*1.7+j*.6)*.5;c.drawImage(im,0,j*im.height/24,im.width,im.height/24,-3+dx,j*100+dy,1806,102);}c.restore();};
const rebuiltNight=drawUrbanNight;
drawUrbanNight=function(c){if(!rebuiltArena())return rebuiltNight(c);if(arenaKind!=='blackout')return;c.save();c.fillStyle='#000000fc';c.fillRect(0,0,1800,2400);for(const a of [p,...enemies]){const state=mechHeadlightState(a);if(!state)continue;for(const side of [-1,1]){const angle=a.angle||0,lx=side*75,ly=15,x=a.x+lx*Math.cos(angle)-ly*Math.sin(angle),y=a.y+lx*Math.sin(angle)+ly*Math.cos(angle);if(solidPoint(x,y))continue;c.save();clipLight(c,lightPolygon(x,y,angle,.88,420,40));c.globalAlpha=.72;c.drawImage(images[REBUILT_ARENAS.blackout.ground],0,0,1800,2400);c.restore();}}c.restore();};
const rebuiltStorm=stormStrength;stormStrength=function(){if(arenaKind!=='dust-crucible')return rebuiltStorm();return rebuiltStormAge<0?0:Math.max(0,Math.min(1,rebuiltStormAge/2.5,(rebuiltStormDuration-rebuiltStormAge)/3));};
const rebuiltWeatherSight=weatherCanSee;weatherCanSee=function(a,b){if(arenaKind!=='dust-crucible')return rebuiltWeatherSight(a,b);const s=stormStrength();return a===b||Math.hypot(a.x-b.x,a.y-b.y)<(terrainClock-(b.lastMuzzleAt??-100)<.45?650:1000-850*s);};
function rebuiltWarningColour(n){const h=rebuiltHazard;if(h&&h.phase==='warning'&&ArenaLogic.corners(h.cell).some(v=>v.x===n.x&&v.y===n.y)){const w=h.warning();return w.lit?(w.red?'#ff2714':'#ffe12b'):null;}const j=perimeterJets.find(j=>j.nodeX===n.x&&j.nodeY===n.y&&j.age>=0&&j.age<PERIMETER.warning);if(j&&Math.sin(j.age*35)>0)return '#ffda35';return null;}
function rebuiltDrawNodes(c){const im=images['rebuilt-stadium'];for(const n of rebuiltNodes()){const nozzle=perimeterJets.find(j=>j.nodeX===n.x&&j.nodeY===n.y);if(nozzle){c.save();c.translate(n.x,n.y);c.rotate(nozzle.a);c.fillStyle='#263236';c.strokeStyle='#819094';c.lineWidth=3;c.fillRect(-10,-72,20,45);c.strokeRect(-10,-72,20,45);c.fillStyle='#090d0f';c.fillRect(-8,-76,16,8);c.restore();}c.save();c.translate(n.x,n.y);c.beginPath();c.arc(0,0,32,0,Math.PI*2);c.clip();c.drawImage(im,375,368,80,85,-43,-43,86,86);c.restore();const col=rebuiltWarningColour(n);if(col){c.save();c.shadowColor=col;c.shadowBlur=40;c.fillStyle=col;c.beginPath();c.arc(n.x,n.y,9,0,Math.PI*2);c.fill();c.restore();}}}
const rebuiltAtmosphere=stepArenaAtmosphere;stepArenaAtmosphere=function(dt){if(arenaKind!=='frostbite')return rebuiltAtmosphere(dt);const current=arenaKind;arenaKind='snow';try{return rebuiltAtmosphere(dt)}finally{arenaKind=current;}};
const rebuiltGroundWeather=drawGroundWeather;
drawGroundWeather=function(c){if(!rebuiltArena())return rebuiltGroundWeather(c);if(arenaKind==='frostbite'){const current=arenaKind;arenaKind='snow';try{rebuiltGroundWeather(c)}finally{arenaKind=current;}}if(rebuiltAssetsReady)rebuiltDrawNodes(c);};
function rebuiltDust(c,opacity=.18,salt=false,overStands=false){const margin=overStands?130:0;c.save();c.beginPath();c.rect(-margin,-margin,1800+2*margin,2400+2*margin);c.clip();if(salt)c.filter='brightness(1.4) saturate(.15)';const tex=dustTexture();for(let i=0;i<(overStands?180:45);i++){const x=((i*383+terrainClock*(100+i%7*22))%(2500))-350,y=(i*277+Math.sin(terrainClock*.4+i)*90)%2400;c.globalAlpha=opacity;c.drawImage(tex,x-160,y-55,360,130);}c.restore();}
function rebuiltWeather(c){const t=terrainClock;
 if(arenaKind==='ashfall'){c.save();for(const v of rebuiltParticles){const x=(v.x+t*(28+10*Math.sin(t*.5)))%1800,y=(v.y+t*9)%2400;c.fillStyle='#706b6680';c.beginPath();c.arc(x,y,0.6+(v.seed%1)*.6,0,7);c.fill();}const phase=t%26;if(phase>15&&phase<22){const fade=Math.sin((phase-15)/7*Math.PI);for(let i=0;i<110;i++){const r=12+i*.65,a=t*4+i*.56;c.fillStyle='rgba(113,111,108,'+(fade*.3)+')';c.beginPath();c.arc(950+Math.cos(a)*r+(phase-15)*22,1050+Math.sin(a)*r,.65+(i%3)*.2,0,7);c.fill();}}c.restore();}
 if(arenaKind==='frostbite'){c.save();c.fillStyle='#f4f8ffc0';for(const v of rebuiltParticles){const x=(v.x+t*45+Math.sin(t+v.seed)*12)%1800,y=(v.y+t*(50+v.seed%35))%2400;c.beginPath();c.arc(x,y,0.7+(v.seed%1)*.65,0,7);c.fill();}c.restore();}
 if(['dust-crucible','salt-flats','scrapyard'].includes(arenaKind)){c.save();c.fillStyle=arenaKind==='salt-flats'?'#dcdad350':'#b49d7250';for(const v of rebuiltParticles){const x=(v.x+t*90)%1800,y=(v.y+Math.sin(t*.6+v.seed)*8)%2400;c.fillRect(x,y,.7+(v.seed%1)*.6,.7);}c.restore();}
 if(arenaKind==='salt-flats')rebuiltDust(c,.20,true);
 if(arenaKind==='scrapyard'){rebuiltDust(c,.17);c.save();c.strokeStyle='#ffc878';c.lineWidth=1;for(let i=0;i<3;i++){const age=(t+i*3.1)%9;if(age>.65)continue;const x=[350,1350,900][i],y=[1000,1700,400][i];for(let k=0;k<16;k++){const a=k*2.399;c.globalAlpha=1-age/.65;c.beginPath();c.moveTo(x+Math.cos(a)*age*45,y+Math.sin(a)*age*45);c.lineTo(x+Math.cos(a)*(age*45+4),y+Math.sin(a)*(age*45+4));c.stroke();}}c.restore();}
}
function rebuiltWaterArcs(c){const h=rebuiltHazard;if(!h||h.kind!=='water'||h.phase!=='active'||battleFinished())return;const b=ArenaLogic.bounds(h.cell),t=terrainClock;c.save();c.shadowColor='#8bf2ff';c.shadowBlur=12;c.strokeStyle='#b4ffff';c.lineWidth=1.5;for(let j=0;j<6;j++){c.beginPath();for(let k=0;k<=36;k++){const x=b.x+25+(k/36)*550,y=b.y+60+j*85+Math.sin(t*33+k*2.7+j)*12;k?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}c.restore();}
function rebuiltFoundry(c){const h=rebuiltHazard;if(!h||h.kind!=='foundry'||h.phase!=='active'||battleFinished())return;const heat=h.heat(),b=ArenaLogic.bounds(h.cell);if(heat<=0)return;c.save();const v=heat<.5?[255,55+heat*260,8+heat*40]:[255,185+(heat-.5)*140,28+(heat-.5)*450],colour=v.map(x=>Math.round(Math.min(255,x))).join(',');
 // Overlapping soft luminous wisps saturate the grate, hiding actors at peak.
 c.globalCompositeOperation='source-over';for(let i=0;i<100;i++){const x=b.x+30+(i%10)*60+Math.sin(terrainClock*5+i)*4,y=b.y+30+Math.floor(i/10)*60+Math.cos(terrainClock*6+i)*4,g=c.createRadialGradient(x,y,0,x,y,85);g.addColorStop(0,'rgba('+colour+','+heat+')');g.addColorStop(.65,'rgba('+colour+','+heat*.85+')');g.addColorStop(1,'rgba('+colour+',0)');c.fillStyle=g;c.fillRect(x-85,y-85,170,170);}c.restore();}
function rebuiltDrawSmoke(c){if(!rebuiltSmoke.length)return;smokeTexture(fxClock+4,true);c.save();for(const s of rebuiltSmoke){const fade=Math.min(1,s.age/.4,(8-s.age)/3),size=120+s.age*38;c.globalAlpha=.45*fade;c.drawImage(smokeGreyCanvas,s.x+s.age*125-size/2,s.y+s.age*40-size/2,size,size);}c.restore();}
const rebuiltSand=drawSandstorm;
drawSandstorm=function(c){if(!rebuiltArena())return rebuiltSand(c);c.save();c.beginPath();c.rect(0,0,1800,2400);c.clip();rebuiltWeather(c);rebuiltWaterArcs(c);rebuiltDrawSmoke(c);rebuiltFoundry(c);c.restore();if(arenaKind==='dust-crucible'){const s=stormStrength();c.save();c.fillStyle='rgba(174,137,85,'+s*.9+')';c.fillRect(-130,-130,2060,2660);c.restore();rebuiltDust(c,.12+s*.9,false,true);}};
const rebuiltPerimeterDraw=drawPerimeter;
drawPerimeter=function(c){if(!rebuiltArena())return rebuiltPerimeterDraw(c);if(rebuiltAssetsReady){rebuiltDrawShield(c);rebuiltDrawNodes(c);}if(weaponRange)return;for(const j of perimeterJets){if(!perimeterActive(j)||battleFinished())continue;const age=j.age-PERIMETER.warning,strength=Math.min(1,age*12,(j.duration-age)*12),range=perimeterReach(j),f=Math.floor(terrainClock*24+j.y)%16;c.save();c.translate(j.x,j.y);c.rotate(j.a-Math.PI/2);c.globalCompositeOperation='screen';c.drawImage(perimeterTexture(),f%4*256,Math.floor(f/4)*128,256,128,0,-range*.26,range*strength,range*.52);c.restore();}};
// Only the new nine arenas appear in the testing route; campaign maps stay intact.
renderTestArenaCards=function(){const list=node('testArenaCards');list.replaceChildren();node('testArenaNotice').textContent=rebuiltAssetError?'Arena artwork could not load.':!rebuiltAssetsReady||!ready?'Loading arena artwork…':'Choose an arena, then build your mech. All equipment is unlocked for this test.';
 for(const [id,v]of Object.entries(REBUILT_ARENAS)){const button=document.createElement('button');button.type='button';button.className='test-arena-card';button.disabled=!rebuiltAssetsReady||!ready;button.dataset.testArena=id;button.setAttribute('aria-label','Test '+v.label);const img=document.createElement('img');img.src='assets/'+v.ground+'.png?v88';img.alt='';img.style.width='100%';img.style.aspectRatio='3 / 4';img.style.objectFit='cover';button.append(img);const title=document.createElement('strong');title.textContent=v.label;button.append(title);const desc=document.createElement('small');desc.textContent=v.description;button.append(desc);button.onclick=()=>enterTestArenaWorkshop(id);list.append(button);}
};
const rebuiltEnterTest=enterTestArenaWorkshop;enterTestArenaWorkshop=function(id){if(!rebuiltAssetsReady||!ready)return;rebuiltEnterTest(id);};
const rebuiltLeaveTest=leaveTestArena;
leaveTestArena=function(){const wasTest=testArenaActive;rebuiltLeaveTest();if(wasTest&&!testArenaActive)setArenaMode('solo');};
node('testArenaBack').onclick=()=>leaveTestArena();
for(const[id,v]of Object.entries(REBUILT_ARENAS)){const option=document.createElement('option');option.value=id;option.textContent=v.label;node('arenaChoice').append(option);}
const rebuiltLabels=refreshTestingLabels;refreshTestingLabels=function(){rebuiltLabels();if(testArenaActive){node('deploy').disabled=node('deploy').disabled||!rebuiltAssetsReady;node('buildVersion').textContent='TEST ARENA · v88';}};
const rebuiltHero=refreshArenaHero;
refreshArenaHero=function(){const id=selectedArena||arenaKind;if(!REBUILT_ARENAS[id])return rebuiltHero();const v=REBUILT_ARENAS[id];node('arenaHeroName').textContent=v.label.toUpperCase();node('arenaHeroDescription').textContent=v.description;if(ready&&rebuiltAssetsReady){const c=node('arenaHeroCanvas').getContext('2d');c.clearRect(0,0,440,390);c.drawImage(images[v.ground],0,0,440,390);}node('levelStatus').textContent='TEST ARENA / '+v.label.toUpperCase();};
const rebuiltReadyTimer=setInterval(()=>{if(rebuiltAssetsReady&&ready){if(!node('testArenaSelect').hidden)renderTestArenaCards();clearInterval(rebuiltReadyTimer);}},150);

const rebuiltCrowdShield=drawCrowdShield;
drawCrowdShield=function(c){if(!rebuiltArena())return rebuiltCrowdShield(c);};
function rebuiltDrawShield(c){c.save();c.globalCompositeOperation='screen';c.shadowColor='#00caff';c.shadowBlur=55;c.strokeStyle='rgba(30,190,255,'+(.68+.08*Math.sin(terrainClock*2.4))+')';c.lineWidth=22;c.strokeRect(0,0,1800,2400);c.shadowBlur=0;c.strokeStyle='#9beeff';c.lineWidth=4;c.strokeRect(0,0,1800,2400);for(const hit of crowdShieldHits){const fade=1-hit.age/.65;glow(c,hit.x,hit.y,55+hit.age*170,'#65cfff',fade*.8);}c.restore();}
