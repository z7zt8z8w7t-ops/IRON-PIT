'use strict';
// One filtered music source continues between workshop and intro scenes.
const radioMusic=new Audio('audio/workshop-radio.mp3');radioMusic.loop=true;radioMusic.preload='auto';let radioChain=null;
function workshopRadioWanted(){return !!node('openingMovie')||node('builder').style.display!=='none'&&!inArena;}
function ensureRadioChain(){const c=Sound.context;if(!c||radioChain)return;if(!c.createMediaElementSource)return;try{const source=c.createMediaElementSource(radioMusic),high=c.createBiquadFilter(),low=c.createBiquadFilter(),drive=c.createWaveShaper(),gain=c.createGain();high.type='highpass';high.frequency.value=360;low.type='lowpass';low.frequency.value=3200;low.Q.value=.7;const curve=new Float32Array(1024);for(let i=0;i<curve.length;i++){const x=i*2/(curve.length-1)-1;curve[i]=Math.tanh(x*1.7)/Math.tanh(1.7);}drive.curve=curve;gain.gain.value=.7;source.connect(high);high.connect(low);low.connect(drive);drive.connect(gain);gain.connect(Sound.master);radioChain={source,high,low,drive,gain};}catch(e){console.warn('Radio effect unavailable',e)}}
const normalStartMusic=Sound.startMusic.bind(Sound),normalPauseMusic=Sound.pauseMusic.bind(Sound);
Sound.startMusic=function(){if(node('quoteOpening')||inArena||this.muted||document.hidden){this.pauseMusic();return;}if(workshopRadioWanted()){this.music?.pause();ensureRadioChain();radioMusic.volume=.7;if(radioMusic.paused)radioMusic.play().catch(()=>{});}else{radioMusic.pause();normalStartMusic();}};
Sound.pauseMusic=function(){radioMusic.pause();normalPauseMusic();};
Sound.stepMusic=function(){if(inArena||this.muted||document.hidden||node('quoteOpening')){this.pauseMusic();return;}this.startMusic();};
const radioUnlock=Sound.unlock.bind(Sound);Sound.unlock=async function(){await radioUnlock();ensureRadioChain();this.startMusic();};
