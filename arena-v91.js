'use strict';
// Floor physics stay 1800 × 2400. Only the outer architecture adapts to the canvas.
let v91FrameExtent=null;
const v91FrameCache=new Map();
function v91FrameImage(){return images[arenaKind==='proving-ground'?'rebuilt-proving-frame':'rebuilt-stadium-v91'];}
function v91BuildFrame(w,h,v){const im=v91FrameImage(),key=(arenaKind==='proving-ground'?'yard':'stadium')+':'+w+':'+h+':'+(arenaKind==='blackout');if(v91FrameCache.has(key))return v91FrameCache.get(key);const cv=document.createElement('canvas');cv.width=Math.ceil(w);cv.height=Math.ceil(h);const c=cv.getContext('2d'),sx=1800/836,sy=2400/1086;
 // Tile existing fine-scale exterior art into unused screen margins, then paint
 // the approved complete frame over it. Crowds retain their original pixel scale.
 const tile=document.createElement('canvas');tile.width=Math.max(1,Math.round(70*sx*v.zoom));tile.height=Math.max(1,Math.round(32*sy*v.zoom));tile.getContext('2d').drawImage(im,350,0,70,32,0,0,tile.width,tile.height);c.fillStyle=c.createPattern(tile,'repeat');c.fillRect(0,0,w,h);
 c.drawImage(im,v.x-190*sx*v.zoom,v.y-74*sy*v.zoom,im.width*sx*v.zoom,im.height*sy*v.zoom);
 if(arenaKind==='blackout'){c.globalCompositeOperation='source-atop';c.fillStyle='#000000f2';c.fillRect(0,0,w,h);}
 if(v91FrameCache.size>=6)v91FrameCache.delete(v91FrameCache.keys().next().value);v91FrameCache.set(key,cv);return cv;}
drawStadiumFrame=function(c,w,h){if(!rebuiltArena()||!rebuiltAssetsReady)return rebuiltFrame(c,w,h);const v=stadiumView(w,h);v91FrameExtent={w,h,v,canvas:v91BuildFrame(w,h,v)};c.drawImage(v91FrameExtent.canvas,0,0,w,h);};
v90FrameArt=function(c){if(!v91FrameExtent)return;const {w,h,v,canvas}=v91FrameExtent;c.drawImage(canvas,-v.x/v.zoom,-v.y/v.zoom,w/v.zoom,h/v.zoom);};
// Tower sprite and collision remain independent of the surrounding frame art.
const v91DrawNodes=rebuiltDrawNodes;
rebuiltDrawNodes=function(c){if(arenaKind!=='blackout')return v91DrawNodes(c);const im=images['rebuilt-stadium'];for(const n of rebuiltNodes()){c.save();c.translate(n.x,n.y);c.filter='brightness(.18)';c.beginPath();c.ellipse(0,7,54,60,0,0,Math.PI*2);c.clip();c.drawImage(im,346,359,79,91,-59,-59,118,136);c.restore();const warning=rebuiltWarningColour(n);c.save();c.globalAlpha=warning?.45:.16;c.shadowColor=warning||'#17c8ff';c.shadowBlur=warning?12:6;c.fillStyle=warning||'#17c8ff';c.beginPath();c.arc(n.x,n.y-12,13,0,Math.PI*2);c.fill();c.restore();}};
const v91Shield=rebuiltDrawShield;rebuiltDrawShield=function(c){c.save();if(arenaKind==='blackout')c.globalAlpha=.12;v91Shield(c);c.restore();};
const v91Signals=v90SignalLights;v90SignalLights=function(c){c.save();if(arenaKind==='blackout')c.filter='brightness(.12)';v91Signals(c);c.restore();};
// Blackout internal walls keep their collision/damage but emit much less light.
const v91FieldsDraw=drawFields;drawFields=function(c){if(arenaKind!=='blackout')return v91FieldsDraw(c);if(!fieldState||!fieldEnabled())return;c.save();c.strokeStyle='#1584a4';c.shadowColor='#137793';c.shadowBlur=5;c.lineWidth=6;for(const b of fieldState.walls){c.beginPath();if(b.w<b.h){c.moveTo(b.x+9,b.y);c.lineTo(b.x+9,b.y+b.h);}else{c.moveTo(b.x,b.y+9);c.lineTo(b.x+b.w,b.y+9);}c.stroke();}if(fieldState.next){const warning=fieldWarningLights();c.strokeStyle=fieldState.age>=14?'#ad3025':'#a68b26';c.globalAlpha=.2+.3*warning.alpha;for(const b of fieldState.next){c.beginPath();if(b.w<b.h){c.moveTo(b.x+9,b.y);c.lineTo(b.x+9,b.y+b.h);}else{c.moveTo(b.x,b.y+9);c.lineTo(b.x+b.w,b.y+9);}c.stroke();}}c.restore();};
let frostStormAge=-1,frostStormWait=15,frostStormDuration=14;
const v91TerrainReset=resetTerrain;resetTerrain=function(){v91TerrainReset();frostStormAge=-1;frostStormWait=12+Math.random()*14;};
const v91TerrainStep=stepTerrain;stepTerrain=function(dt){v91TerrainStep(dt);if(arenaKind!=='frostbite'||weaponRange)return;if(frostStormAge<0){frostStormWait-=dt;if(frostStormWait<=0){frostStormAge=0;frostStormDuration=10+Math.random()*10;}}else{frostStormAge+=dt;if(frostStormAge>=frostStormDuration){frostStormAge=-1;frostStormWait=12+Math.random()*22;}}};
function frostStormStrength(){return frostStormAge<0?0:Math.max(0,Math.min(1,frostStormAge/3,(frostStormDuration-frostStormAge)/4));}
const v91WeatherSight=weatherCanSee;weatherCanSee=function(a,b){if(arenaKind!=='frostbite')return v91WeatherSight(a,b);const s=frostStormStrength();return a===b||Math.hypot(a.x-b.x,a.y-b.y)<(terrainClock-(b.lastMuzzleAt??-100)<.45?650:1000-850*s);};
const v91Weather=rebuiltWeather;rebuiltWeather=function(c){if(!['dust-crucible','frostbite','mist'].includes(arenaKind))v91Weather(c);};
// Floor hazards and wreck smoke stay below the balcony. Storms/mist are later layers.
drawSandstorm=function(c){if(!rebuiltArena())return rebuiltSand(c);c.save();c.beginPath();c.rect(0,0,1800,2400);c.clip();rebuiltWeather(c);rebuiltWaterArcs(c);rebuiltDrawSmoke(c);rebuiltFoundry(c);c.restore();};
function drawFullStadiumWeather(c,w,h){if(!rebuiltArena()||weaponRange||!rebuiltAssetsReady)return;const kind=arenaKind;if(!['dust-crucible','frostbite','mist'].includes(kind))return;const v=stadiumView(w,h),b={x:-v.x/v.zoom,y:-v.y/v.zoom,w:w/v.zoom,h:h/v.zoom},t=terrainClock;c.save();c.translate(v.x,v.y);c.scale(v.zoom,v.zoom);
 if(kind==='mist'){c.fillStyle='rgba(111,133,146,'+(.16+.04*Math.sin(t*.17))+')';c.fillRect(b.x,b.y,b.w,b.h);const im=images['rebuilt-mist-cloud'];for(let i=0;i<28;i++){const seed=i*2.399,x=b.x+((i*481+t*(12+i%4*3))%(b.w+1500))-750,y=b.y+((i*739+t*5)%(b.h+1500))-750,ww=1100+180*Math.sin(t*.13+seed),hh=1100+220*Math.cos(t*.17+seed);c.save();c.translate(x,y);c.rotate(.16*Math.sin(t*.11+seed));c.globalAlpha=.17+.16*(.5+.5*Math.sin(t*.23+seed));c.drawImage(im,-ww/2,-hh/2,ww,hh);c.restore();}}
 else{const snow=kind==='frostbite',s=snow?frostStormStrength():stormStrength();c.fillStyle=snow?'rgba(178,199,217,'+s*.82+')':'rgba(174,137,85,'+s*.9+')';c.fillRect(b.x,b.y,b.w,b.h);if(snow)c.filter='brightness(2.8) saturate(0)';const tex=dustTexture();for(let i=0;i<140;i++){const x=b.x+((i*383+t*(100+i%7*22))%(b.w+850))-425,y=b.y+((i*277+Math.sin(t*.4+i)*90)%(b.h+700))-350;c.save();c.translate(x,y);c.rotate(.15*Math.sin(t*.3+i));c.globalAlpha=snow?.02+s*.34:.1+s*.68;c.drawImage(tex,-230,-80,460,160);c.restore();}c.filter='none';if(snow){c.fillStyle='#f4f8ffb0';for(let i=0;i<600;i++){const seed=i*2.399,x=b.x+(i*937.17+t*(45+s*200)+Math.sin(t+seed)*12)%b.w,y=b.y+(i*731.31+t*(50+seed%35))%b.h;c.beginPath();c.arc(x,y,.7+(seed%1)*.65,0,Math.PI*2);c.fill();}}}
 c.restore();}

const provingCrowd=updateCrowdAudio;updateCrowdAudio=function(){if(arenaKind==='proving-ground'){Sound.stopLoop('stadium-crowd');return;}return provingCrowd();};
const provingCrowdHit=crowdHitReaction;crowdHitReaction=function(){if(arenaKind!=='proving-ground')provingCrowdHit();};
const provingCrowdDestroy=crowdDestroyReaction;crowdDestroyReaction=function(){if(arenaKind!=='proving-ground')provingCrowdDestroy();};
