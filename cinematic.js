 'use strict';
let openingMovieSession=null,comicInterludeActive=false;
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
 const session=openingMovieSession={page:0,totalElapsed:0,waitElapsed:0,phase:'comic',audioStarted:pages!==COMIC_PAGES&&!comicInterludeActive,paused:false,last:performance.now(),raf:0,closed:false,turning:false};
 workshopAudioSession=session.audioStarted;resetBattleInputs();hideGameMenus();storyScreen().hidden=true;
 const el=document.createElement('section');el.id='openingMovie';el.dataset.phase=comicInterludeActive?'entering':'comic';if(comicInterludeActive)el.classList.add('comic-interlude');if(pages===SKITTER_INTERLUDE_PAGES)el.classList.add('skitter-interlude');if(pages===BLAZE_INTERLUDE_PAGES)el.classList.add('blaze-interlude');el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','Iron Pit comic introduction');
 el.innerHTML='<div class="comic-book"><div class="comic-art"><img class="comic-page" alt=""></div><div class="comic-footer"><small class="comic-count"></small><div class="comic-controls"><button class="comic-previous" disabled>PREVIOUS</button><button class="comic-skip">SKIP</button><button class="comic-next" disabled>TURN PAGE →</button></div></div></div>';
 document.body.append(el);
 const button=el.querySelector('.comic-next'),art=el.querySelector('.comic-art'),image=el.querySelector('.comic-page');button.disabled=false;
 const previousButton=el.querySelector('.comic-previous'),skipButton=el.querySelector('.comic-skip');
 let transitionTimer=0,cancelTurn=()=>{};const fadeTime=comicInterludeActive?2000:850;
 const enableControls=()=>{button.disabled=session.turning;skipButton.disabled=session.turning;previousButton.disabled=session.turning||session.page===0;};
 const startAudio=()=>{if(comicInterludeActive)return;if(!session.audioStarted){session.audioStarted=true;workshopAudioSession=true;Sound.unlock();Sound.startMusic();}};
 const show=()=>{const page=pages[session.page];image.src=page.src;image.alt=page.alt;el.querySelector('.comic-count').textContent=(session.page+1)+' / '+pages.length;button.textContent=session.page===pages.length-1?lastLabel:'TURN PAGE →';};
 const finish=()=>{if(session.closed)return;session.closed=true;if(comicInterludeActive)ComicAudio.end(0);clearTimeout(transitionTimer);cancelTurn();cancelAnimationFrame(session.raf);document.removeEventListener('keydown',onKey);el.remove();openingMovieSession=null;comicInterludeActive=false;if(Sound.dry)Sound.dry.gain.value=.88;resetBattleInputs();done();Sound.startMusic();};
 const next=()=>{if(session.closed||session.turning||session.phase!=='comic')return;session.turning=true;enableControls();
  if(session.page===pages.length-1){if(comicInterludeActive)ComicAudio.end(2);session.phase='leaving';el.dataset.phase='leaving';transitionTimer=setTimeout(finish,fadeTime);return}
  startAudio();
  const front=pages[session.page].src;session.page++;show();
  cancelTurn=turnComicPage(art,front,pages[session.page].src,()=>{session.turning=false;enableControls();button.focus();});
 };
 const onKey=e=>{if(e.key==='ArrowRight'){e.preventDefault();next()}};
 previousButton.onclick=()=>{if(session.closed||session.turning||session.page===0||session.phase!=='comic')return;session.turning=true;enableControls();const front=pages[session.page].src;session.page--;show();cancelTurn=turnComicPage(art,front,pages[session.page].src,()=>{session.turning=false;enableControls();previousButton.focus();},true);};
 skipButton.onclick=()=>{if(session.closed||session.turning||session.phase!=='comic')return;if(comicInterludeActive)ComicAudio.end(2);startAudio();session.turning=true;enableControls();session.phase='leaving';el.dataset.phase='leaving';transitionTimer=setTimeout(finish,fadeTime);};
 button.onclick=next;document.addEventListener('keydown',onKey);show();enableControls();
 if(comicInterludeActive){session.phase='entering';session.turning=true;enableControls();preloadComicArtwork(pages).then(()=>{if(session.closed)return;show();void el.offsetWidth;el.dataset.phase='comic';transitionTimer=setTimeout(()=>{if(session.closed)return;session.phase='comic';session.turning=false;enableControls();},2000);});}
 const tick=now=>{if(session.closed)return;const dt=Math.max(0,Math.min(.1,(now-session.last)/1000));session.last=now;
  if(!document.hidden){if(session.audioStarted)session.totalElapsed+=dt;
   Sound.startMusic();}else Sound.pauseMusic();
  session.raf=requestAnimationFrame(tick);
 };
 Sound.startMusic();session.raf=requestAnimationFrame(tick);
}
const splashArt=document.createElement('img');splashArt.id='splashCast';splashArt.src='assets/splash-v61.jpg';splashArt.alt='Iron Pit: Rourke and Dave, with Dr Lilith Kane above them';node('splash').prepend(splashArt);
node('splashCampaign').classList.add('ready-flash');node('splashCampaign').setAttribute('aria-label','Championship');node('splashStart').setAttribute('aria-label','Quick Battle');
const splashActions=document.createElement('div');splashActions.id='splashActions';
for(const[id,asset,label]of [['splashCampaign','button-championship.png','Championship'],['splashStart','button-quick-battle.png','Quick Battle']]){const button=node(id);button.type='button';button.replaceChildren();const image=document.createElement('img');image.src='assets/'+asset;image.alt='';image.setAttribute('aria-hidden','true');button.append(image);button.setAttribute('aria-label',label);splashActions.append(button);}node('splash').append(splashActions);

// Approved Skitter interlude: the final Next fades out before Bastion's comms boot.
const SKITTER_INTERLUDE_PAGES=[
 {src:'assets/skitter-tower.png',alt:'Some hours later. The sinister Voss Industries tower looms over the futuristic financial district.'},
 {src:'assets/skitter-interlude-1.png',alt:'Voss, concealed in shadow: A newcomer. In a machine held together by scrap and optimism. Explain to me how he defeated you. Skitter: He was better than I expected. Voss: Then perhaps the problem was your expectations. Quinn watches nervously.'},
 {src:'assets/skitter-interlude-2.png',alt:'Voss: You will face him again. And you will win. Skitter: And if I don’t? Voss: There will be consequences. Your sponsorship can be withdrawn. Your debts cannot. Skitter cries alone in the rainy street as people pass without noticing.'},
 {src:'assets/skitter-interlude-3.png',alt:'Voss sits completely hidden in shadow, with a few lights on his motorised chair. He tells Quinn: Get me Bastion.'}
];
function playSkitterInterlude(done){playComicInterlude(done,SKITTER_INTERLUDE_PAGES)}
for(const page of SKITTER_INTERLUDE_PAGES){const image=new Image();image.src=page.src}

// Approved post-qualifier interlude. Caller remains unseen and unnamed.
const BLAZE_INTERLUDE_PAGES=[
 {src:'assets/blaze-interlude-1.png',alt:'Some hours later. Blaze, in battered purple pilot armour, sits at a run-down bar seen from behind. An anonymous comms device sits on the counter.'},
 {src:'assets/blaze-interlude-2.png',alt:'Blaze: You should consider getting Rourke on the team. Device: The newcomer who just beat you? Blaze: His Mech may look like a pile of scrap, but he knows how to use it. Device: Hmmm, I’ll keep an eye on him and if I like what I see, maybe…. A drunk approaches in the background, then sits beside Blaze.'},
 {src:'assets/blaze-interlude-3.png',alt:'Drunk: Hey sexy. Blaze punches him in the nose. He lies unconscious on the bar as she drinks from a wine bottle. Device: …in the meantime get yourself cleaned up, I’ve got a different assignment for you.'},
 {src:'assets/blaze-interlude-4.png',alt:'The drunk lies unconscious on the counter in the foreground. Blaze walks out facing the street, carrying comms in her left hand and throwing cash backwards with her right. Blaze: Just send me the details. Device: Good, we’ll speak soon.'}
];
function playComicInterlude(done,pages,lastLabel='NEXT →'){
 if(openingMovieSession||comicInterludeActive)return;
 comicInterludeActive=true;workshopAudioSession=false;resetBattleInputs();Sound.stopAll();
 if(radioChain){radioChain.gain.gain.cancelScheduledValues?.(Sound.context.currentTime);radioChain.gain.gain.value=0;}
 if(Sound.dry){Sound.dry.gain.cancelScheduledValues?.(Sound.context.currentTime);Sound.dry.gain.value=0;}
 hideGameMenus();storyScreen().hidden=true;
 if(pages===BLAZE_INTERLUDE_PAGES)ComicAudio.begin('blaze');else if(pages===SKITTER_INTERLUDE_PAGES)ComicAudio.begin('skitter');
 playOpeningCinematic(done,pages,lastLabel);
}
function playBlazeInterlude(done){playComicInterlude(done,BLAZE_INTERLUDE_PAGES)}
for(const page of BLAZE_INTERLUDE_PAGES){const image=new Image();image.src=page.src}

preloadComicArtwork(SKITTER_INTERLUDE_PAGES);preloadComicArtwork(BLAZE_INTERLUDE_PAGES);

// Approved post-Bastion interlude; final NEXT continues to the semi-final briefing.
const BASTION_INTERLUDE_PAGES=[
 {src:"assets/bastion-interlude-1.png",alt:"A few hours later. Exterior of Voss Experimentals, a dim futuristic weapons laboratory."},
 {src:"assets/bastion-interlude-2.png",alt:"Bastion’s dismantled black-and-red heavy tank. Quinn: Well…..You’ve brought most of it back. Bastion: Just Fix it. Quinn: It’s not that simple, this will take time. Bastion: Which you won’t have much left of if you don’t sort this."},
 {src:"assets/bastion-interlude-3.png",alt:"Voss arrives in shadow in his motorised chair. Voss: Bastion, you appear to have failed me. Battle footage fills the video wall. Voss: First Skitter, now you. This newcomer is becoming expensive."},
 {src:"assets/bastion-interlude-4.png",alt:"Bastion: Put me back in the arena. I’ll finish him, permanently. Voss grips Bastion’s neck as Quinn watches nervously. Voss: I already gave you that opportunity, and you failed."},
 {src:"assets/bastion-interlude-5.png",alt:"Skitter enters; Bastion holds his injured neck. Voss: Next time, you’ll be working together. Bastion: She’ll just get in my way. Voss: Well then, use her as a shield. Just make sure Rourke dies in the pit. Now get out, both of you. Bastion and Skitter leave. Quinn: And if they fail again?"},
 {src:"assets/bastion-interlude-6.png",alt:"Half of Voss’s face is lit red; Quinn smiles manically behind him. Voss: Then I’ll find better pilots, and you’ll have some new subjects to test your weapons on."}
];
function playBastionInterlude(done){playComicInterlude(done,BASTION_INTERLUDE_PAGES)}
preloadComicArtwork(BASTION_INTERLUDE_PAGES);
