'use strict';
// Only the workshop radio remains; menus and combat never start the removed song.
const radioMusic=new Audio('audio/workshop-radio.mp3');radioMusic.loop=true;radioMusic.preload='auto';
const workshopAmbient=new Audio('audio/workshop-ambient.mp3');workshopAmbient.loop=true;workshopAmbient.preload='auto';
let radioChain=null;
function workshopRadioWanted(){return !!openingMovieSession||node('builder').style.display!=='none'&&!inArena;}
function ensureRadioChain(){const c=Sound.context;if(!c||radioChain||!c.createMediaElementSource)return;try{const source=c.createMediaElementSource(radioMusic),high=c.createBiquadFilter(),low=c.createBiquadFilter(),drive=c.createWaveShaper(),gain=c.createGain();high.type='highpass';high.frequency.value=360;low.type='lowpass';low.frequency.value=3200;low.Q.value=.7;const curve=new Float32Array(1024);for(let i=0;i<curve.length;i++){const x=i*2/(curve.length-1)-1;curve[i]=Math.tanh(x*1.7)/Math.tanh(1.7);}drive.curve=curve;gain.gain.value=.7;source.connect(high);high.connect(low);low.connect(drive);drive.connect(gain);gain.connect(Sound.master);radioChain={source,high,low,drive,gain};}catch(e){console.warn('Radio effect unavailable',e)}}
function introAudioMix(){const s=openingMovieSession;if(!s)return null;const intro=Math.min(1,s.totalElapsed/5),out=s.phase==='arena'?Math.max(0,1-s.elapsed/3):1;return intro*out;}
const normalPauseMusic=Sound.pauseMusic.bind(Sound);
Sound.startMusic=function(){this.music?.pause();const s=openingMovieSession;if(node('quoteOpening')||inArena||this.muted||document.hidden||s?.paused){this.pauseMusic();return;}if(workshopRadioWanted()){ensureRadioChain();const mix=introAudioMix()??1;radioMusic.volume=.7*mix;if(radioMusic.paused)radioMusic.play().catch(()=>{});if(s){workshopAmbient.volume=.45*mix;if(workshopAmbient.paused)workshopAmbient.play().catch(()=>{});}else workshopAmbient.pause();}else{radioMusic.pause();workshopAmbient.pause();}};
Sound.pauseMusic=function(){radioMusic.pause();workshopAmbient.pause();normalPauseMusic();};
Sound.stepMusic=function(){this.startMusic();};
const radioUnlock=Sound.unlock.bind(Sound);Sound.unlock=async function(){await radioUnlock();ensureRadioChain();this.startMusic();};
