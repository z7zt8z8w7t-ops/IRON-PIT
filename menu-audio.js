'use strict';
// Web Audio controls the actual volume; iPad media-element volume is unreliable.
const radioMusic={paused:true,volume:.10};
let workshopAudioSession=false;
let radioFailed=false,ambientFailed=false;
const workshopRadioTracks=['audio/workshop-radio.mp3','audio/workshop-radio-alternative.mp3'];
let selectedRadioTrack=null;
const workshopRadioElement=document.createElement('audio');workshopRadioElement.loop=true;workshopRadioElement.preload='auto';workshopRadioElement.setAttribute('playsinline','');
let radioPlayPending=false,radioNeedsGesture=false,radioRetryAfter=0;
let radioChain=null,radioSource=null,radioLevel=-1;
let ambientBuffer=null,ambientLoading=null,ambientSource=null,ambientGain=null,ambientOffset=0,ambientStarted=0;
function workshopRadioWanted(){return !inArena&&(!!openingMovieSession?.audioStarted||workshopAudioSession||node('builder').style.display!=='none');}
function ensureRadioChain(){const c=Sound.context;if(!c||radioChain)return;const high=c.createBiquadFilter(),low=c.createBiquadFilter(),drive=c.createWaveShaper(),gain=c.createGain();high.type='highpass';high.frequency.value=360;low.type='lowpass';low.frequency.value=3200;low.Q.value=.7;const curve=new Float32Array(1024);for(let i=0;i<curve.length;i++){const x=i*2/(curve.length-1)-1;curve[i]=Math.tanh(x*1.7)/Math.tanh(1.7)}drive.curve=curve;gain.gain.value=0;high.connect(low);low.connect(drive);let reverb=null;
 if(c.createConvolver){const convolver=c.createConvolver(),dry=c.createGain(),wet=c.createGain(),impulse=c.createBuffer(2,Math.round(c.sampleRate*4),c.sampleRate);for(let ch=0;ch<2;ch++){const a=impulse.getChannelData(ch);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*Math.pow(1-i/a.length,2)}convolver.buffer=impulse;dry.gain.value=.6;wet.gain.value=.4;drive.connect(dry);dry.connect(gain);drive.connect(convolver);convolver.connect(wet);wet.connect(gain);reverb={convolver,dry,wet}}else drive.connect(gain);
 gain.connect(Sound.master);radioChain={high,low,drive,gain,reverb};
}
function crossfadeAmbient(c,input){const n=Math.min(Math.round(input.sampleRate*2),Math.floor(input.length/4)),length=input.length-n,out=c.createBuffer(input.numberOfChannels,length,input.sampleRate);for(let ch=0;ch<input.numberOfChannels;ch++){const a=input.getChannelData(ch),b=out.getChannelData(ch);b.set(a.subarray(n,input.length-n));for(let i=0;i<n;i++){const t=n>1?i/(n-1):1;b[length-n+i]=a[input.length-n+i]*Math.cos(t*Math.PI/2)+a[i]*Math.sin(t*Math.PI/2)}}return out}
function loadWorkshopTrack(kind){if(kind==='radio')return;const c=Sound.context;if(!c||!c.decodeAudioData||ambientBuffer||ambientLoading)return;
 ambientLoading=fetch('audio/workshop-ambient.mp3').then(r=>{if(!r.ok)throw Error('Workshop ambience unavailable');return r.arrayBuffer()}).then(bytes=>c.decodeAudioData(bytes)).then(input=>{ambientBuffer=crossfadeAmbient(c,input);Sound.startMusic()}).catch(e=>{ambientFailed=true;console.warn(e.message)});
}
function ensureAmbient(){loadWorkshopTrack('ambient')}
function stopRadio(){workshopRadioElement.pause();radioMusic.paused=true;}
function stopAmbient(){if(!ambientSource)return;ambientOffset=(ambientOffset+Sound.context.currentTime-ambientStarted)%ambientBuffer.duration;try{ambientSource.stop()}catch(e){}ambientSource.disconnect();ambientGain.disconnect();ambientSource=null;ambientGain=null}
function setRadioLevel(level){const c=Sound.context;if(!c)return;ensureRadioChain();radioMusic.volume=.10*level;
 if(!radioSource){radioSource=c.createMediaElementSource(workshopRadioElement);radioSource.connect(radioChain.high);}
 if(selectedRadioTrack===null){selectedRadioTrack=workshopRadioTracks[Math.floor(Math.random()*workshopRadioTracks.length)];workshopRadioElement.src=selectedRadioTrack;radioFailed=false;radioNeedsGesture=false;}
 // Do not append automation events every frame; Safari can build up an unbounded queue.
 const target=.10*level;if(Math.abs(target-radioLevel)>.001){radioChain.gain.gain.cancelScheduledValues?.(c.currentTime);radioChain.gain.gain.setTargetAtTime(target,c.currentTime,.15);radioLevel=target;}
 if(workshopRadioElement.paused&&!radioPlayPending&&!radioNeedsGesture&&performance.now()>=radioRetryAfter){radioPlayPending=true;try{Promise.resolve(workshopRadioElement.play()).then(()=>{radioPlayPending=false;radioMusic.paused=false;if(!workshopRadioWanted()||Sound.muted||document.hidden)stopRadio();}).catch(e=>{radioPlayPending=false;radioMusic.paused=true;radioNeedsGesture=e.name==='NotAllowedError';radioFailed=!radioNeedsGesture;radioRetryAfter=performance.now()+2000;console.warn('Workshop radio:',e.message);});}catch(e){radioPlayPending=false;radioNeedsGesture=true;}}
}
workshopRadioElement.addEventListener('error',()=>{radioFailed=true;radioRetryAfter=performance.now()+2000;});
function setAmbientLevel(level){const c=Sound.context;ensureAmbient();if(!c||c.state!=='running'||!ambientBuffer)return;if(!ambientSource){ambientSource=c.createBufferSource();ambientSource.buffer=ambientBuffer;ambientSource.loop=true;ambientGain=c.createGain();ambientGain.gain.value=0;ambientSource.connect(ambientGain);ambientGain.connect(Sound.master);ambientStarted=c.currentTime;ambientSource.start(0,ambientOffset)}ambientGain.gain.setTargetAtTime(.8*level,c.currentTime,.15)}
function workshopTracksReady(){return !!(!workshopRadioElement.paused||radioFailed)&&!!(ambientBuffer||ambientFailed)&&(!Sound.context||Sound.context.state==='running')}
function introAudioMix(){const s=openingMovieSession;return s?.audioStarted?Math.min(1,s.totalElapsed/1):1}
const normalPauseMusic=Sound.pauseMusic.bind(Sound);
Sound.startMusic=function(){this.music?.pause();if(inArena)workshopAudioSession=false;const s=openingMovieSession;if(node('quoteOpening')||inArena||this.muted||document.hidden||s?.paused){this.pauseMusic();return}if(workshopRadioWanted()){const mix=introAudioMix();setRadioLevel(mix);setAmbientLevel(mix)}else{stopRadio();stopAmbient();if(selectedRadioTrack!==null){selectedRadioTrack=null;workshopRadioElement.removeAttribute('src');workshopRadioElement.load();}radioFailed=false;radioNeedsGesture=false;}};
Sound.pauseMusic=function(){stopRadio();stopAmbient();normalPauseMusic()};Sound.stepMusic=function(){this.startMusic()};
const radioUnlock=Sound.unlock.bind(Sound);Sound.unlock=async function(){const pending=radioUnlock();radioNeedsGesture=false;radioRetryAfter=0;this.startMusic();await pending;ensureAmbient();this.startMusic()};
// Resume Web Audio from the gesture itself, before any asynchronous loading.
for(const type of ['pointerdown','touchstart','keydown'])document.addEventListener(type,()=>{if(Sound.context&&Sound.context.state!=='running')Sound.context.resume().then(()=>Sound.startMusic()).catch(()=>{})},{capture:true,passive:true});

// Only a real league window stops the workshop bed; intro routing can call this too.
const audioLeague57=showRookieLadder;showRookieLadder=function(){audioLeague57();if(!openingMovieSession&&node('storyBody').querySelector('.rookie-ladder')){workshopAudioSession=false;Sound.pauseMusic()}};
const audioTraining57=startPilotTraining;startPilotTraining=function(after){if(ready){workshopAudioSession=false;Sound.pauseMusic()}return audioTraining57(after)};
const audioExit57=exitCampaign;exitCampaign=function(){workshopAudioSession=false;return audioExit57()};
