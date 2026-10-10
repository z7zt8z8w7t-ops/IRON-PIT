 'use strict';
let openingMovieSession=null;
const COMIC_PAGES=[
 {src:'assets/intro-comic-1.jpg',alt:'Page 1: Daves Fix n Spray exterior; Dave and Rourke repairing a customer mech. Dave: You’ve spent half your life fixing these things for other people. I think it’s about time you drove one. Rourke: Hmmm, I can drive em, but I can’t afford em.'},
 {src:'assets/intro-comic-2.jpg',alt:'Page 2: Dave reveals the bare-steel mech. Dave: Well maybe you don’t need to. Rourke: Is that for me? Beside the cockpit, Rourke: You really think we can compete with the sponsored teams? Dave: Their machines cost more. Doesn’t mean their pilots are better.'},
 {src:'assets/intro-comic-3.jpg',alt:'Page 3: Rourke’s mech enters the Iron Pit. Rourke: And if we lose? Dave: Then I guess we’re walking home.'}
];
// Start loading comic art during the quote, before the audio fade-in.
for(const page of COMIC_PAGES){const image=new Image();image.src=page.src;}
function playOpeningCinematic(done){
 if(openingMovieSession)return;
 workshopAudioSession=true;resetBattleInputs();hideGameMenus();storyScreen().hidden=true;
 const el=document.createElement('section');el.id='openingMovie';el.dataset.phase='black';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','Iron Pit comic introduction');
 el.innerHTML='<div class="comic-book"><div class="comic-art"><img class="comic-page" alt=""></div><div class="comic-footer"><small class="comic-count"></small><button class="comic-next" disabled>TURN PAGE →</button></div></div>';
 document.body.append(el);
 const session=openingMovieSession={page:0,totalElapsed:0,waitElapsed:0,phase:'black',paused:false,last:performance.now(),raf:0,closed:false,turning:false};
 const button=el.querySelector('.comic-next'),art=el.querySelector('.comic-art'),image=el.querySelector('.comic-page');button.disabled=true;
 let transitionTimer=0;
 const show=()=>{const page=COMIC_PAGES[session.page];image.src=page.src;image.alt=page.alt;el.querySelector('.comic-count').textContent=(session.page+1)+' / 3';button.textContent=session.page===2?'PREPARE FOR BATTLE →':'TURN PAGE →';};
 const finish=()=>{if(session.closed)return;session.closed=true;clearTimeout(transitionTimer);cancelAnimationFrame(session.raf);document.removeEventListener('keydown',onKey);el.remove();openingMovieSession=null;resetBattleInputs();done();Sound.startMusic();};
 const next=()=>{if(session.closed||session.turning||session.phase!=='comic')return;session.turning=true;button.disabled=true;
  if(session.page===2){session.phase='leaving';el.dataset.phase='leaving';transitionTimer=setTimeout(finish,850);return}
  const sheet=document.createElement('img');sheet.className='comic-turn-sheet';sheet.src=COMIC_PAGES[session.page].src;sheet.alt='';sheet.setAttribute('aria-hidden','true');art.append(sheet);session.page++;show();
  transitionTimer=setTimeout(()=>{sheet.remove();session.turning=false;button.disabled=false;button.focus();},820);
 };
 const onKey=e=>{if(e.key==='ArrowRight'){e.preventDefault();next()}};
 button.onclick=next;document.addEventListener('keydown',onKey);show();
 const tick=now=>{if(session.closed)return;const dt=Math.max(0,Math.min(.1,(now-session.last)/1000));session.last=now;
  if(!document.hidden){if(session.phase==='black'){session.waitElapsed+=dt;const tracksReady=Sound.muted||workshopTracksReady();if(tracksReady)session.totalElapsed+=dt;
    // Allow the mixer to reach its final quiet levels before revealing page one.
    if(session.totalElapsed>=5.8){session.phase='comic';el.dataset.phase='comic';button.disabled=false;button.focus();}}
   Sound.startMusic();}else Sound.pauseMusic();
  session.raf=requestAnimationFrame(tick);
 };
 Sound.startMusic();session.raf=requestAnimationFrame(tick);
}
const splashArt=document.createElement('img');splashArt.id='splashCast';splashArt.src='assets/splash-cast.jpg';splashArt.alt='Iron Pit: Rourke, Dave, Rivet, Skitter, Bastion, Zane, Silas Voss and Dr Lilith Kane';node('splash').prepend(splashArt);
node('splashCampaign').classList.add('ready-flash');node('splashCampaign').setAttribute('aria-label','Championship');node('splashStart').setAttribute('aria-label','Quick Battle');
const splashActions=document.createElement('div');splashActions.id='splashActions';
for(const[id,asset,label]of [['splashCampaign','button-championship.png','Championship'],['splashStart','button-quick-battle.png','Quick Battle']]){const button=node(id);button.type='button';button.replaceChildren();const image=document.createElement('img');image.src='assets/'+asset;image.alt='';image.setAttribute('aria-hidden','true');button.append(image);button.setAttribute('aria-label',label);splashActions.append(button);}node('splash').append(splashActions);
