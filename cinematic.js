'use strict';
let openingMovieSession=null;
function playOpeningCinematic(done){
 if(openingMovieSession)return;
 resetBattleInputs();hideGameMenus();storyScreen().hidden=true;
 const el=document.createElement('section');el.id='openingMovie';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','Iron Pit opening cinematic');
 el.innerHTML='<div class="movie-stage"><img class="movie-shot" alt=""><div class="movie-effects"></div><div class="movie-caption" aria-live="polite"><strong></strong><span></span></div></div><div class="movie-controls"><button class="movie-skip">SKIP</button><small></small><button class="movie-pause">PAUSE</button><button class="movie-next">NEXT →</button></div>';
 document.body.append(el);
 const beats=[{shot:0,time:6},{shot:0,time:5},{shot:1,time:4},{shot:2,time:6},{shot:2,time:7},{shot:2,time:4},{shot:3,time:6}];
 const session=openingMovieSession={page:0,elapsed:0,paused:false,last:performance.now(),raf:0,closed:false};let previous=-1;
 const finish=()=>{if(session.closed)return;session.closed=true;cancelAnimationFrame(session.raf);document.removeEventListener('keydown',onKey);el.remove();openingMovieSession=null;resetBattleInputs();done()};
 const show=()=>{const beat=beats[session.page],[who,line]=OPENING_LINES[session.page],im=el.querySelector('.movie-shot');if(previous!==beat.shot){previous=beat.shot;im.src='assets/intro-'+beat.shot+'.jpg';im.alt=['Jim repairing a mech','Dave reveals their salvaged mech','Jim and Dave beside the cockpit','Their mech enters the Iron Pit'][beat.shot];im.style.animation='none';void im.offsetWidth;im.style.animation='';commsSound('comms-in')}
 el.querySelector('.movie-caption strong').textContent=STORY_CAST[who].name.toUpperCase();el.querySelector('.movie-caption span').textContent='“'+line+'”';el.querySelector('.movie-controls small').textContent=(session.page+1)+' / '+beats.length;el.querySelector('.movie-next').textContent=session.page===beats.length-1?'ENTER THE PIT →':'NEXT →';const fx=el.querySelector('.movie-effects');fx.replaceChildren();for(let i=0;i<(beat.shot===0?18:6);i++){const spark=document.createElement('i');spark.style.setProperty('--x',(15+i*4.3)%95+'%');spark.style.setProperty('--y',(40+i*7)%95+'%');spark.style.setProperty('--speed',(1.4+i%4*.7)+'s');fx.append(spark)}};
 const next=()=>{session.elapsed=0;if(++session.page>=beats.length)finish();else show()};
 const pause=()=>{session.paused=!session.paused;el.querySelector('.movie-pause').textContent=session.paused?'RESUME':'PAUSE';el.querySelectorAll('.movie-shot,.movie-effects,.movie-effects i').forEach(n=>n.style.animationPlayState=session.paused?'paused':'running')};
 const onKey=e=>{if(e.key==='Escape'){e.preventDefault();finish()}else if(e.key==='ArrowRight'){e.preventDefault();next()}else if(e.key===' '){e.preventDefault();pause()}};
 el.querySelector('.movie-skip').onclick=finish;el.querySelector('.movie-next').onclick=next;el.querySelector('.movie-pause').onclick=pause;el.querySelector('.movie-stage').onclick=next;document.addEventListener('keydown',onKey);
 const tick=now=>{const dt=Math.min(.1,(now-session.last)/1000);session.last=now;if(!session.paused&&!document.hidden){session.elapsed+=dt;if(session.elapsed>=beats[session.page].time)next()}if(!session.closed)session.raf=requestAnimationFrame(tick)};
 show();el.querySelector('.movie-skip').focus();session.raf=requestAnimationFrame(tick);
}
const splashArt=document.createElement('img');splashArt.id='splashCast';splashArt.src='assets/splash-cast.jpg';splashArt.alt='Iron Pit: Jim, Dave, Rivet, Skitter, Bastion and Dr Hudson';node('splash').prepend(splashArt);
node('splashCampaign').classList.add('ready-flash');node('splashCampaign').setAttribute('aria-label','Championship');node('splashStart').setAttribute('aria-label','Quick Battle');
// Hit targets follow the uniformly scaled full-screen artwork, including crop offsets.
function splashButtonGeometry(width,height,imageWidth=1049,imageHeight=1500){
 const scale=Math.max(width/imageWidth,height/imageHeight),ox=(width-imageWidth*scale)/2,oy=(height-imageHeight*scale)/2;
 if(width>height){const w=Math.min(width*.40,height*.13*895/162),h=w*162/895;return [.68,.83].map(y=>({x:width-w-width*.04,y:height*y,w,h}))}
 return [1135,1275].map(y=>({x:ox+130*scale,y:oy+y*scale,w:790*scale,h:125*scale}));
}
function fitSplashButtons(){
 const host=node('splash'),rect=host.getBoundingClientRect();
 const boxes=splashButtonGeometry(rect.width,rect.height,splashArt.naturalWidth||1049,splashArt.naturalHeight||1500);
 for(const[i,id]of ['splashCampaign','splashStart'].entries()){
  const button=node(id),b=boxes[i];
  for(const[key,value]of Object.entries({left:b.x,top:b.y,width:b.w,height:b.h}))button.style[key]=value+'px';
  // Landscape reflows real button artwork so both actions remain on-screen.
  button.style.backgroundImage=rect.width>rect.height?'url(assets/'+(i?'button-quick-battle.png':'button-championship.png')+')':'none';
  button.style.backgroundSize='contain';button.style.backgroundRepeat='no-repeat';button.style.backgroundPosition='center';
 }
}
splashArt.addEventListener('load',fitSplashButtons);window.addEventListener('resize',fitSplashButtons);
if(typeof ResizeObserver!=='undefined')new ResizeObserver(fitSplashButtons).observe(node('splash'));
fitSplashButtons();
