'use strict';
// Overlapping complete recordings with a twelve-second equal-power crossfade.
const FoundryAmbient={buffer:null,loading:null,nodes:new Set(),next:0,context:null,
 stop(){for(const n of this.nodes){try{n.source.stop();}catch(e){}n.source.disconnect();n.gain.disconnect();}this.nodes.clear();this.next=0;},
 async load(c){if(this.buffer)return this.buffer;if(!this.loading)this.loading=fetch('audio/foundry-motor.mp3?v91').then(r=>{if(!r.ok)throw Error('Foundry ambience');return r.arrayBuffer();}).then(b=>c.decodeAudioData(b)).then(b=>this.buffer=b).catch(e=>{this.loading=null;console.warn(e);});return this.loading;},
 schedule(c,time,first){const buffer=this.buffer,cross=Math.min(12,buffer.duration/3),source=c.createBufferSource(),gain=c.createGain(),level=.33;source.buffer=buffer;source.connect(gain);gain.connect(Sound.dry);const curve=new Float32Array(65);for(let i=0;i<65;i++)curve[i]=level*Math.sin(i/64*Math.PI/2);gain.gain.setValueAtTime(0,time);gain.gain.setValueCurveAtTime(curve,time,first?1.5:cross);gain.gain.setValueAtTime(level,time+buffer.duration-cross);gain.gain.setValueCurveAtTime(Float32Array.from(curve).reverse(),time+buffer.duration-cross,cross);const n={source,gain};this.nodes.add(n);source.onended=()=>{source.disconnect();gain.disconnect();this.nodes.delete(n);};source.start(time);this.next=time+buffer.duration-cross;},
 step(){const c=Sound.context,wanted=inArena&&arenaKind==='foundry'&&!weaponRange&&!document.hidden&&!Sound.muted&&!(victoryPickup&&victoryPickup.age>=PICKUP_EXIT)&&(!battleFinished()||!!victoryPickup);if(!wanted||!c||c.state!=='running'){this.stop();return;}if(!this.buffer){this.load(c);return;}if(!this.nodes.size){this.schedule(c,c.currentTime+.02,true);}if(this.next<c.currentTime+1)this.schedule(c,Math.max(this.next,c.currentTime+.02),false);}
};
const foundrySoundStop=Sound.stopAll;Sound.stopAll=function(){FoundryAmbient.stop();return foundrySoundStop.call(this);};
const foundryStadiumStep=stepStadium;stepStadium=function(dt){foundryStadiumStep(dt);FoundryAmbient.step();};

const foundryMusicStep=Sound.stepMusic;Sound.stepMusic=function(dt){foundryMusicStep.call(this,dt);FoundryAmbient.step();};
