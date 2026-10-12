'use strict';
// Dedicated comic sound bed: bypasses the workshop radio and the muted SFX bus.
const ComicAudio={
 profiles:{
  blaze:[{path:'audio/bar-ambience.mp3',level:.65,crossfade:true,reverb:true},{path:'audio/blaze-bar.m4a',level:.25,reverb:true}],
  skitter:[{path:'audio/voss-towers.m4a',level:.65}],
  semifinal:[{path:'audio/voss-towers.m4a',level:.65}],
  bastion:[{path:'audio/lab-ambience.mp3',level:.325,crossfade:true,reverb:true}]
 },
 cache:new Map(),session:null,generation:0,
 load(track){
  const c=Sound.context;if(!c)return Promise.resolve(null);
  if(!this.cache.has(track.path))this.cache.set(track.path,(async()=>{
   const response=await fetch(track.path);if(!response.ok)throw Error('Comic audio unavailable: '+track.path);
   const input=await c.decodeAudioData(await response.arrayBuffer());return track.crossfade?crossfadeAmbient(c,input):input;
  })().catch(error=>{this.cache.delete(track.path);console.warn(error.message);return null;}));
  return this.cache.get(track.path);
 },
 preload(){if(!Sound.context)return;for(const tracks of Object.values(this.profiles))for(const track of tracks)this.load(track);},
 async begin(kind){
  this.end(0);const generation=++this.generation;
  const session=this.session={generation,kind,tracks:[],effects:[],shotPlayed:false,kaneRequested:false,chain:null,closing:false,timer:0};
  // unlock() creates/resumes the context immediately inside the NEXT gesture.
  await Sound.unlock();if(this.session!==session)return;
  if(kind==='semifinal')this.load({path:'audio/voss-shoots.mp3'});
  await Promise.all((this.profiles[kind]||[]).map(async profile=>{
   const buffer=await this.load(profile);if(this.session!==session||!buffer)return;
   session.tracks.push({profile,buffer,offset:0,source:null,started:0,gain:null});this.update();
  }));
 },
 makeChain(session){
  const c=Sound.context,output=c.createGain();output.gain.value=.8;output.connect(Sound.master);
  const input=c.createGain(),dry=c.createGain();input.connect(dry);dry.connect(output);
  const nodes=[input,dry,output];
  if((session.kind==='blaze'||session.kind==='bastion')&&c.createConvolver){
   const wet=c.createGain(),delay=c.createDelay(.2),reverb=c.createConvolver(),ir=c.createBuffer(2,Math.round(c.sampleRate*(session.kind==='bastion'?2.4:4)),c.sampleRate);
   for(let ch=0;ch<2;ch++){const data=ir.getChannelData(ch);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,2.5);}
   reverb.buffer=ir;delay.delayTime.value=.035;dry.gain.value=session.kind==='bastion'?.8:.7;wet.gain.value=session.kind==='bastion'?.2:.4;
   input.connect(delay);delay.connect(reverb);reverb.connect(wet);wet.connect(output);nodes.push(wet,delay,reverb);
  }else dry.gain.value=1;
  session.chain={input,output,nodes};
 },
 update(){
  const s=this.session,c=Sound.context;if(!s||s.closing||!c)return;
  if(Sound.muted||document.hidden||c.state!=='running'){this.pause();return;}
  if(!s.chain)this.makeChain(s);
  for(const t of s.tracks){if(t.source||(t.profile.deferred&&!s.kaneRequested))continue;
   const source=c.createBufferSource(),gain=c.createGain();source.buffer=t.buffer;source.loop=true;gain.gain.value=t.profile.level;
   if(t.profile.fadeIn&&!t.hasStarted){gain.gain.setValueAtTime(0,c.currentTime);gain.gain.linearRampToValueAtTime(t.profile.level,c.currentTime+t.profile.fadeIn);}t.hasStarted=true;
   source.connect(gain);gain.connect(s.chain.input);t.source=source;t.gain=gain;t.started=c.currentTime;source.start(0,t.offset%t.buffer.duration);
  }
 },
 async gunshot(){
  const s=this.session;if(!s||s.kind!=='semifinal'||s.closing||s.shotPlayed)return;
  s.shotPlayed=true;await Sound.unlock();const buffer=await this.load({path:'audio/voss-shoots.mp3'});
  const c=Sound.context;if(this.session!==s||s.closing||!buffer||Sound.muted||document.hidden||c.state!=='running')return;
  if(!s.chain)this.makeChain(s);
  const source=c.createBufferSource(),dry=c.createGain(),wet=c.createGain(),delay=c.createDelay(.2),reverb=c.createConvolver();
  source.buffer=buffer;source.loop=false;dry.gain.value=.9;wet.gain.value=.28;delay.delayTime.value=.025;
  const ir=c.createBuffer(2,Math.round(c.sampleRate*1.6),c.sampleRate);
  for(let ch=0;ch<2;ch++){const data=ir.getChannelData(ch);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,3);}
  reverb.buffer=ir;source.connect(dry);dry.connect(s.chain.output);source.connect(delay);delay.connect(reverb);reverb.connect(wet);wet.connect(s.chain.output);
  const effect={source,nodes:[source,dry,wet,delay,reverb],timer:0};s.effects.push(effect);
  effect.timer=setTimeout(()=>{effect.nodes.forEach(n=>n.disconnect());s.effects=s.effects.filter(e=>e!==effect);},(buffer.duration+1.8)*1000);source.start(0);
 },
 pause(){
  const s=this.session,c=Sound.context;if(!s||!c)return;
  for(const e of s.effects||[]){clearTimeout(e.timer);try{e.source.stop()}catch(error){}e.nodes.forEach(n=>n.disconnect());}s.effects=[];
  for(const t of s.tracks){if(!t.source)continue;t.offset=(t.offset+c.currentTime-t.started)%t.buffer.duration;
   try{t.source.stop()}catch(e){}t.source.disconnect();t.gain.disconnect();t.source=null;t.gain=null;
  }
  // Clear the reverberation tail when sound is muted or the app is hidden.
  if(s.chain){s.chain.nodes.forEach(n=>n.disconnect());s.chain=null;}
 },
 end(seconds=2){
  const s=this.session;if(!s)return;
  s.closing=true;clearTimeout(s.timer);
  const dispose=()=>{if(this.session!==s)return;this.pause();this.session=null;++this.generation;};
  const c=Sound.context;
  if(seconds>0&&s.chain&&c){const gain=s.chain.output.gain;gain.cancelScheduledValues(c.currentTime);gain.setValueAtTime(gain.value,c.currentTime);gain.linearRampToValueAtTime(0,c.currentTime+seconds);s.timer=setTimeout(dispose,seconds*1000);}
  else dispose();
 }
};
