'use strict';
// Quiet workshop radio plus a sample-continuous, two-second ambience crossfade.
const radioMusic=new Audio('audio/workshop-radio.mp3');radioMusic.loop=true;radioMusic.preload='auto';
let radioChain=null,ambientBuffer=null,ambientLoading=null,ambientSource=null,ambientGain=null,ambientOffset=0,ambientStarted=0;
function workshopRadioWanted(){return !!openingMovieSession||node('builder').style.display!=='none'&&!inArena;}
function ensureRadioChain(){const c=Sound.context;if(!c||radioChain||!c.createMediaElementSource)return;try{const source=c.createMediaElementSource(radioMusic),high=c.createBiquadFilter(),low=c.createBiquadFilter(),drive=c.createWaveShaper(),gain=c.createGain();high.type='highpass';high.frequency.value=360;low.type='lowpass';low.frequency.value=3200;low.Q.value=.7;const curve=new Float32Array(1024);for(let i=0;i<curve.length;i++){const x=i*2/(curve.length-1)-1;curve[i]=Math.tanh(x*1.7)/Math.tanh(1.7);}drive.curve=curve;gain.gain.value=.7;source.connect(high);high.connect(low);low.connect(drive);let reverb=null;if(c.createConvolver&&c.createBuffer){const convolver=c.createConvolver(),dry=c.createGain(),wet=c.createGain(),impulse=c.createBuffer(2,Math.round(c.sampleRate*.4),c.sampleRate);for(let ch=0;ch<2;ch++){const a=impulse.getChannelData(ch);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*Math.pow(1-i/a.length,2.5)}convolver.buffer=impulse;dry.gain.value=.88;wet.gain.value=.12;drive.connect(dry);dry.connect(gain);drive.connect(convolver);convolver.connect(wet);wet.connect(gain);reverb={convolver,dry,wet}}else drive.connect(gain);gain.connect(Sound.master);radioChain={source,high,low,drive,gain,reverb};}catch(e){console.warn('Radio effect unavailable',e)}}
function crossfadeAmbient(c,input){
 const n=Math.min(Math.round(input.sampleRate*2),Math.floor(input.length/4)),length=input.length-n;
 const out=c.createBuffer(input.numberOfChannels,length,input.sampleRate);
 for(let ch=0;ch<input.numberOfChannels;ch++){const a=input.getChannelData(ch),b=out.getChannelData(ch);b.set(a.subarray(n,input.length-n));for(let i=0;i<n;i++){const t=i/(n-1);b[length-n+i]=a[input.length-n+i]*Math.cos(t*Math.PI/2)+a[i]*Math.sin(t*Math.PI/2)}}
 return out;
}
function ensureAmbient(){const c=Sound.context;if(!c||ambientBuffer||ambientLoading||!c.decodeAudioData||!c.createBuffer)return;
 ambientLoading=fetch('audio/workshop-ambient.mp3').then(r=>{if(!r.ok)throw Error('Workshop ambience unavailable');return r.arrayBuffer()}).then(bytes=>c.decodeAudioData(bytes)).then(input=>{ambientBuffer=crossfadeAmbient(c,input);Sound.startMusic()}).catch(e=>console.warn(e.message));
}
function stopAmbient(){if(!ambientSource)return;const c=Sound.context;ambientOffset=(ambientOffset+c.currentTime-ambientStarted)%ambientBuffer.duration;try{ambientSource.stop()}catch(e){}ambientSource.disconnect();ambientGain.disconnect();ambientSource=null;ambientGain=null;}
function setAmbientLevel(level){const c=Sound.context;ensureAmbient();if(!c||!ambientBuffer||c.state!=='running')return;if(!ambientSource){ambientSource=c.createBufferSource();ambientSource.buffer=ambientBuffer;ambientSource.loop=true;ambientGain=c.createGain();ambientGain.gain.value=0;ambientSource.connect(ambientGain);ambientGain.connect(Sound.master);ambientStarted=c.currentTime;ambientSource.start(0,ambientOffset)}ambientGain.gain.setTargetAtTime(.8*level,c.currentTime,.15);}
function introAudioMix(){const s=openingMovieSession;if(!s)return 1;return Math.min(1,s.totalElapsed/5)*(s.phase==='arena'?Math.max(0,1-s.elapsed/3):1)}
const normalPauseMusic=Sound.pauseMusic.bind(Sound);
Sound.startMusic=function(){this.music?.pause();const s=openingMovieSession;if(node('quoteOpening')||inArena||this.muted||document.hidden||s?.paused){this.pauseMusic();return}if(workshopRadioWanted()){ensureRadioChain();const mix=introAudioMix();radioMusic.volume=.15*mix;if(radioMusic.paused)radioMusic.play().catch(()=>{});setAmbientLevel(mix)}else{radioMusic.pause();stopAmbient()}};
Sound.pauseMusic=function(){radioMusic.pause();stopAmbient();normalPauseMusic()};Sound.stepMusic=function(){this.startMusic()};
const radioUnlock=Sound.unlock.bind(Sound);Sound.unlock=async function(){await radioUnlock();ensureRadioChain();ensureAmbient();this.startMusic()};
