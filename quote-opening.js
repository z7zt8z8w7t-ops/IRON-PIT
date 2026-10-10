'use strict';
let quoteOpeningActive=false;
function playQuoteOpening(done){
 if(quoteOpeningActive)return;quoteOpeningActive=true;Sound.stopAll();resetBattleInputs();
 const el=document.createElement('section');el.id='quoteOpening';el.setAttribute('role','dialog');el.setAttribute('aria-label','Thomas Paine quote');
 const video=document.createElement('video');video.src='assets/quote-opening.mp4';video.preload='auto';video.playsInline=true;video.setAttribute('playsinline','');video.volume=Sound.muted?0:1;
 const actions=document.createElement('div');actions.className='quote-actions';const skip=document.createElement('button');skip.textContent='SKIP';const play=document.createElement('button');play.textContent='PLAY QUOTE';play.hidden=true;actions.append(play,skip);el.append(video,actions);document.body.append(el);
 let closed=false,raf=0,last=performance.now(),elapsed=0,reveal=0;
 const finish=()=>{if(closed)return;closed=true;cancelAnimationFrame(raf);clearTimeout(reveal);video.onended=null;video.onerror=null;video.pause();video.removeAttribute('src');video.load();document.removeEventListener('visibilitychange',visibility);document.removeEventListener('keydown',key);el.remove();quoteOpeningActive=false;resetBattleInputs();done()};
 const attempt=()=>{try{const result=video.play();result?.then(()=>{play.hidden=true}).catch(()=>{if(!closed){play.hidden=false;play.textContent='PLAY QUOTE';skip.textContent='CONTINUE →'}})}catch(e){play.hidden=false;skip.textContent='CONTINUE →'}};
 const key=e=>{if(e.key==='Escape'){e.preventDefault();finish()}};
 const visibility=()=>{last=performance.now();if(document.hidden)video.pause();else if(!closed)attempt()};
 const tick=now=>{if(closed)return;const dt=Math.max(0,Math.min(1,(now-last)/1000));last=now;if(!document.hidden){elapsed+=dt;if(video.ended||(Number.isFinite(video.duration)&&video.duration>0&&video.currentTime>=video.duration-.12)||elapsed>=35){finish();return}}raf=requestAnimationFrame(tick)};
 video.onended=finish;video.onerror=finish;skip.onclick=finish;play.onclick=attempt;document.addEventListener('keydown',key);document.addEventListener('visibilitychange',visibility);
 // Request playback during the Championship gesture, rather than after a timer.
 attempt();reveal=setTimeout(()=>{if(!closed)el.classList.add('visible')},1000);raf=requestAnimationFrame(tick);
}
const campaignStart52=enterCampaign;
function startCampaignFromQuote55(){quoteIntroRequested55=true;campaignStart52()}
node('splashCampaign').onclick=()=>playQuoteOpening(startCampaignFromQuote55);
