'use strict';
let openingMovieSession=null;
function playOpeningCinematic(done){
 if(openingMovieSession)return;resetBattleInputs();hideGameMenus();storyScreen().hidden=true;
 const el=document.createElement('section');el.id='openingMovie';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','Iron Pit opening cinematic');
 el.innerHTML='<div class="movie-stage"><img class="movie-shot" alt=""><div class="movie-effects"></div><div class="movie-caption" aria-live="polite"><strong></strong><span></span></div></div><div class="movie-controls"><button class="movie-skip">SKIP</button><small></small><button class="movie-pause">PAUSE</button><button class="movie-next">NEXT →</button></div>';
 document.body.append(el);
 // The interior reveal deliberately precedes the exterior, as approved.
 const beats=[{phase:'black',time:3},{phase:'interior',shot:'intro-interior',time:4},{phase:'exterior',shot:'workshop-exterior',time:5},...OPENING_LINES.map((line,i)=>({phase:'dialogue',shot:i<3?'intro-2':'intro-1',line:i,time:[9,6,6,8,7,5,6][i]})),{phase:'arena',shot:'intro-0',time:5}];
 const session=openingMovieSession={page:0,elapsed:0,totalElapsed:0,phase:'black',paused:false,last:performance.now(),raf:0,closed:false};let previous=null;
 const finish=()=>{if(session.closed)return;session.closed=true;cancelAnimationFrame(session.raf);document.removeEventListener('keydown',onKey);el.remove();openingMovieSession=null;Sound.startMusic();resetBattleInputs();done()};
 const show=()=>{const beat=beats[session.page],im=el.querySelector('.movie-shot');session.phase=beat.phase;el.dataset.phase=beat.phase;im.hidden=!beat.shot;if(beat.shot&&previous!==beat.shot){previous=beat.shot;im.src='assets/'+beat.shot+'.jpg';im.alt=({ 'intro-interior':'Inside Daves Fix n Spray','workshop-exterior':'Daves Fix n Spray with the Iron Pit arena behind it','intro-2':'Rourke repairing the bare-steel mech with Dave','intro-1':'Rourke and Dave beside the cockpit','intro-0':'The bare-steel mech enters the Iron Pit'})[beat.shot];im.style.animation='none';void im.offsetWidth;im.style.animation='';}
 const caption=el.querySelector('.movie-caption');caption.hidden=beat.line===undefined;if(beat.line!==undefined){const[who,line]=OPENING_LINES[beat.line];caption.dataset.speaker=who;el.querySelector('.movie-caption strong').textContent=STORY_CAST[who].name.toUpperCase();el.querySelector('.movie-caption span').textContent=line;}
 el.querySelector('.movie-controls small').textContent=(session.page+1)+' / '+beats.length;el.querySelector('.movie-next').textContent=session.page===beats.length-1?'ENTER THE PIT →':'NEXT →';Sound.startMusic();};
 const next=()=>{session.elapsed=0;if(++session.page>=beats.length)finish();else show()};
 const pause=()=>{session.paused=!session.paused;el.querySelector('.movie-pause').textContent=session.paused?'RESUME':'PAUSE';el.querySelectorAll('.movie-shot,.movie-effects,.movie-effects i').forEach(n=>n.style.animationPlayState=session.paused?'paused':'running');Sound.startMusic();};
 const onKey=e=>{if(e.key==='Escape'){e.preventDefault();finish()}else if(e.key==='ArrowRight'){e.preventDefault();next()}else if(e.key===' '){e.preventDefault();pause()}};
 el.querySelector('.movie-skip').onclick=finish;el.querySelector('.movie-next').onclick=next;el.querySelector('.movie-pause').onclick=pause;el.querySelector('.movie-stage').onclick=next;document.addEventListener('keydown',onKey);
 const tick=now=>{const dt=Math.min(.1,(now-session.last)/1000);session.last=now;if(!session.paused&&!document.hidden){session.elapsed+=dt;session.totalElapsed+=dt;Sound.startMusic();if(session.elapsed>=beats[session.page].time)next()}else Sound.pauseMusic();if(!session.closed)session.raf=requestAnimationFrame(tick)};
 show();el.querySelector('.movie-skip').focus();session.raf=requestAnimationFrame(tick);
}
const splashArt=document.createElement('img');splashArt.id='splashCast';splashArt.src='assets/splash-cast.jpg';splashArt.alt='Iron Pit: Rourke, Dave, Rivet, Skitter, Bastion, Zane, Silas Voss and Dr Lilith Kane';node('splash').prepend(splashArt);
node('splashCampaign').classList.add('ready-flash');node('splashCampaign').setAttribute('aria-label','Championship');node('splashStart').setAttribute('aria-label','Quick Battle');
const splashActions=document.createElement('div');splashActions.id='splashActions';
for(const[id,asset,label]of [['splashCampaign','button-championship.png','Championship'],['splashStart','button-quick-battle.png','Quick Battle']]){const button=node(id);button.type='button';button.replaceChildren();const image=document.createElement('img');image.src='assets/'+asset;image.alt='';image.setAttribute('aria-hidden','true');button.append(image);button.setAttribute('aria-label',label);splashActions.append(button);}node('splash').append(splashActions);
