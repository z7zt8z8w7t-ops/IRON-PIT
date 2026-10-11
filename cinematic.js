 'use strict';
let openingMovieSession=null;
const COMIC_PAGES=[
 {src:'assets/intro-comic-cover.jpg',alt:'Iron Pit Issue 1: arena combat seen from the stands. Rourke’s mech remains unrevealed.'},
 {src:'assets/intro-comic-1.jpg',alt:'Page 1: Daves Fix n Spray exterior; Dave and Rourke repairing a customer mech. Dave: You’ve spent half your life fixing these things for other people. I think it’s about time you drove one. Rourke: Hmmm, I can drive em, but I can’t afford em.'},
 {src:'assets/intro-comic-2.jpg',alt:'Page 2: Dave reveals the bare-steel mech. Dave: Well maybe you don’t need to. Rourke: Is that for me? Beside the cockpit, Rourke: You really think we can compete with the sponsored teams? Dave: Their machines cost more. Doesn’t mean their pilots are better.'},
 {src:'assets/intro-comic-3.jpg',alt:'Page 3: Rourke’s mech enters the Iron Pit. Rourke: And if we lose? Dave: Then I guess we’re walking home.'}
];
// Start loading comic art during the quote, before the audio fade-in.
for(const page of COMIC_PAGES){const image=new Image();image.src=page.src;}
function playOpeningCinematic(done,pages=COMIC_PAGES,lastLabel='PREPARE FOR BATTLE →'){
 if(openingMovieSession)return;
 const session=openingMovieSession={page:0,totalElapsed:0,waitElapsed:0,phase:'comic',audioStarted:pages!==COMIC_PAGES,paused:false,last:performance.now(),raf:0,closed:false,turning:false};
 workshopAudioSession=session.audioStarted;resetBattleInputs();hideGameMenus();storyScreen().hidden=true;
 const el=document.createElement('section');el.id='openingMovie';el.dataset.phase='comic';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','Iron Pit comic introduction');
 el.innerHTML='<div class="comic-book"><div class="comic-art"><img class="comic-page" alt=""></div><div class="comic-footer"><small class="comic-count"></small><button class="comic-next" disabled>TURN PAGE →</button></div></div>';
 document.body.append(el);
 const button=el.querySelector('.comic-next'),art=el.querySelector('.comic-art'),image=el.querySelector('.comic-page');button.disabled=false;
 let transitionTimer=0,cancelTurn=()=>{};
 const show=()=>{const page=pages[session.page];image.src=page.src;image.alt=page.alt;el.querySelector('.comic-count').textContent=(session.page+1)+' / '+pages.length;button.textContent=session.page===pages.length-1?lastLabel:'TURN PAGE →';};
 const finish=()=>{if(session.closed)return;session.closed=true;clearTimeout(transitionTimer);cancelTurn();cancelAnimationFrame(session.raf);document.removeEventListener('keydown',onKey);el.remove();openingMovieSession=null;resetBattleInputs();done();Sound.startMusic();};
 const next=()=>{if(session.closed||session.turning||session.phase!=='comic')return;session.turning=true;button.disabled=true;
  if(session.page===pages.length-1){session.phase='leaving';el.dataset.phase='leaving';transitionTimer=setTimeout(finish,850);return}
  if(!session.audioStarted){session.audioStarted=true;workshopAudioSession=true;Sound.unlock();Sound.startMusic();}
  const front=pages[session.page].src;session.page++;show();
  cancelTurn=turnComicPage(art,front,pages[session.page].src,()=>{session.turning=false;button.disabled=false;button.focus();});
 };
 const onKey=e=>{if(e.key==='ArrowRight'){e.preventDefault();next()}};
 button.onclick=next;document.addEventListener('keydown',onKey);show();
 const tick=now=>{if(session.closed)return;const dt=Math.max(0,Math.min(.1,(now-session.last)/1000));session.last=now;
  if(!document.hidden){if(session.audioStarted&&(Sound.muted||workshopTracksReady()))session.totalElapsed+=dt;
   Sound.startMusic();}else Sound.pauseMusic();
  session.raf=requestAnimationFrame(tick);
 };
 Sound.startMusic();session.raf=requestAnimationFrame(tick);
}
const splashArt=document.createElement('img');splashArt.id='splashCast';splashArt.src='assets/splash-v61.jpg';splashArt.alt='Iron Pit: Rourke and Dave, with Dr Lilith Kane above them';node('splash').prepend(splashArt);
node('splashCampaign').classList.add('ready-flash');node('splashCampaign').setAttribute('aria-label','Championship');node('splashStart').setAttribute('aria-label','Quick Battle');
const splashActions=document.createElement('div');splashActions.id='splashActions';
for(const[id,asset,label]of [['splashCampaign','button-championship.png','Championship'],['splashStart','button-quick-battle.png','Quick Battle']]){const button=node(id);button.type='button';button.replaceChildren();const image=document.createElement('img');image.src='assets/'+asset;image.alt='';image.setAttribute('aria-hidden','true');button.append(image);button.setAttribute('aria-label',label);splashActions.append(button);}node('splash').append(splashActions);
