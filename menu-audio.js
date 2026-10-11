'use strict';
// Web Audio controls the actual volume; iPad media-element volume is unreliable.
const radioMusic={paused:true,volume:.08};
let workshopAudioSession=false;
let radioFailed=false,ambientFailed=false;
let selectedRadioTrack=null,radioGeneration=0;
let radioChain=null,radioBuffer=null,radioLoading=null,radioSource=null,radioOffset=0,radioStarted=0;
let ambientBuffer=null,ambientLoading=null,ambientSource=null,ambientGain=null,ambientOffset=0,ambientStarted=0;
function workshopRadioWanted(){return !inArena&&(!!openingMovieSession?.audioStarted||workshopAudioSession||node('builder').style.display!=='none');}
function ensureRadioChain(){const c=Sound.context;if(!c||radioChain)return;const high=c.createBiquadFilter(),low=c.createBiquadFilter(),drive=c.createWaveShaper(),gain=c.createGain();high.type='highpass';high.frequency.value=550;low.type='lowpass';low.frequency.value=2400;low.Q.value=.7;const curve=new Float32Array(1024);for(let i=0;i<curve.length;i++){const x=i*2/(curve.length-1)-1;curve[i]=Math.tanh(x*2.3)/Math.tanh(2.3)}drive.curve=curve;gain.gain.value=0;high.connect(low);low.connect(drive);let reverb=null;
 if(c.createConvolver){const convolver=c.createConvolver(),dry=c.createGain(),wet=c.createGain(),preDelay=c.createDelay(.2),impulse=c.createBuffer(2,Math.round(c.sampleRate*4),c.sampleRate);for(let ch=0;ch<2;ch++){const a=impulse.getChannelData(ch);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*Math.pow(1-i/a.length,2)}convolver.buffer=impulse;preDelay.delayTime.value=.035;dry.gain.value=.6;wet.gain.value=.4;drive.connect(dry);dry.connect(gain);drive.connect(preDelay);preDelay.connect(convolver);convolver.connect(wet);wet.connect(gain);reverb={convolver,dry,wet,preDelay}}else drive.connect(gain);
 gain.connect(Sound.master);radioChain={high,low,drive,gain,reverb};
}
function crossfadeAmbient(c,input){const n=Math.min(Math.round(input.sampleRate*2),Math.floor(input.length/4)),length=input.length-n,out=c.createBuffer(input.numberOfChannels,length,input.sampleRate);for(let ch=0;ch<input.numberOfChannels;ch++){const a=input.getChannelData(ch),b=out.getChannelData(ch);b.set(a.subarray(n,input.length-n));for(let i=0;i<n;i++){const t=n>1?i/(n-1):1;b[length-n+i]=a[input.length-n+i]*Math.cos(t*Math.PI/2)+a[i]*Math.sin(t*Math.PI/2)}}return out}
function loadWorkshopTrack(kind){const c=Sound.context;if(!c||!c.decodeAudioData)return;const radio=kind==='radio';if(radio?(radioBuffer||radioLoading):(ambientBuffer||ambientLoading))return;
 if(radio&&selectedRadioTrack===null)selectedRadioTrack=WORKSHOP_PLAYLIST[Math.floor(Math.random()*WORKSHOP_PLAYLIST.length)];
 const generation=radioGeneration;const loading=(async()=>{const paths=radio?[selectedRadioTrack,...WORKSHOP_PLAYLIST.filter(path=>path!==selectedRadioTrack)]:['audio/workshop-ambient.mp3'];let lastError;
  for(const path of paths){try{const response=await fetch(path);if(!response.ok)throw Error('Workshop audio unavailable: '+path);const input=await c.decodeAudioData(await response.arrayBuffer());if(radio&&generation!==radioGeneration)return;if(radio){selectedRadioTrack=path;radioBuffer=input;}else ambientBuffer=crossfadeAmbient(c,input);Sound.startMusic();return;}catch(e){lastError=e;}}
  if(radio&&generation!==radioGeneration)return;if(radio)radioFailed=true;else ambientFailed=true;console.warn(lastError?.message);
 })();if(radio)radioLoading=loading;else ambientLoading=loading;
}
function ensureAmbient(){loadWorkshopTrack('ambient')}
function stopRadio(){if(radioSource){radioOffset=(radioOffset+Sound.context.currentTime-radioStarted)%radioBuffer.duration;try{radioSource.stop()}catch(e){}radioSource.disconnect();radioSource=null}radioMusic.paused=true}
function stopAmbient(){if(!ambientSource)return;ambientOffset=(ambientOffset+Sound.context.currentTime-ambientStarted)%ambientBuffer.duration;try{ambientSource.stop()}catch(e){}ambientSource.disconnect();ambientGain.disconnect();ambientSource=null;ambientGain=null}
function setRadioLevel(level){const c=Sound.context;loadWorkshopTrack('radio');radioMusic.volume=.08*level;if(!c||c.state!=='running'||!radioBuffer)return;ensureRadioChain();if(!radioSource){radioSource=c.createBufferSource();radioSource.buffer=radioBuffer;radioSource.loop=true;radioSource.connect(radioChain.high);radioStarted=c.currentTime;radioSource.start(0,radioOffset);radioMusic.paused=false}radioChain.gain.gain.setTargetAtTime(.08*level,c.currentTime,.15)}
function setAmbientLevel(level){const c=Sound.context;ensureAmbient();if(!c||c.state!=='running'||!ambientBuffer)return;if(!ambientSource){ambientSource=c.createBufferSource();ambientSource.buffer=ambientBuffer;ambientSource.loop=true;ambientGain=c.createGain();ambientGain.gain.value=0;ambientSource.connect(ambientGain);ambientGain.connect(Sound.master);ambientStarted=c.currentTime;ambientSource.start(0,ambientOffset)}ambientGain.gain.setTargetAtTime(.8*level,c.currentTime,.15)}
function workshopTracksReady(){return !!(radioBuffer||radioFailed)&&!!(ambientBuffer||ambientFailed)&&(!Sound.context||Sound.context.state==='running')}
function introAudioMix(){const s=openingMovieSession;return s?.audioStarted?Math.min(1,s.totalElapsed):s?0:1}
const normalPauseMusic=Sound.pauseMusic.bind(Sound);
Sound.startMusic=function(){this.music?.pause();if(inArena)workshopAudioSession=false;const s=openingMovieSession;if(node('quoteOpening')||inArena||this.muted||document.hidden||s?.paused){this.pauseMusic();return}if(workshopRadioWanted()){const mix=introAudioMix();setRadioLevel(1);setAmbientLevel(mix)}else{stopRadio();stopAmbient()}};
Sound.pauseMusic=function(){stopRadio();stopAmbient();normalPauseMusic()};Sound.stepMusic=function(){this.startMusic()};
const radioUnlock=Sound.unlock.bind(Sound);Sound.unlock=async function(){await radioUnlock();loadWorkshopTrack('radio');ensureAmbient();this.startMusic()};
// Resume Web Audio from the gesture itself, before any asynchronous loading.
for(const type of ['pointerdown','touchstart','keydown'])document.addEventListener(type,()=>{if(Sound.context&&Sound.context.state!=='running')Sound.context.resume().then(()=>Sound.startMusic()).catch(()=>{})},{capture:true,passive:true});

// Only a real league window stops the workshop bed; intro routing can call this too.
const audioLeague57=showRookieLadder;showRookieLadder=function(){audioLeague57();if(!openingMovieSession&&node('storyBody').querySelector('.rookie-ladder')){workshopAudioSession=false;Sound.pauseMusic()}};
const audioTraining57=startPilotTraining;startPilotTraining=function(after){if(ready){workshopAudioSession=false;Sound.pauseMusic()}return audioTraining57(after)};
const audioExit57=exitCampaign;exitCampaign=function(){workshopAudioSession=false;return audioExit57()};

// Change only on an accepted post-battle navigation, preserving ambience.
function selectNextWorkshopSong(){
 const candidates=WORKSHOP_PLAYLIST.filter(path=>path!==selectedRadioTrack);
 if(!candidates.length)return;
 stopRadio();radioGeneration++;selectedRadioTrack=candidates[Math.floor(Math.random()*candidates.length)];
 radioBuffer=null;radioLoading=null;radioOffset=0;radioFailed=false;
 Sound.unlock();loadWorkshopTrack('radio');Sound.startMusic();
}
