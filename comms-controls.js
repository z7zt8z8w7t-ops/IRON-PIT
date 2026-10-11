
'use strict';
// Move only the illustrated button face, leaving the frame housing stationary.
const heldCommsButtons=new Map();
function commsButtonClick(){const c=Sound.context;if(Sound.muted||!c||c.state!=='running')return;const buffer=c.createBuffer(1,Math.ceil(c.sampleRate*.045),c.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.exp(-i/(c.sampleRate*.009));const source=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain();filter.type='bandpass';filter.frequency.value=1300;filter.Q.value=1.2;gain.gain.value=.18;source.buffer=buffer;source.connect(filter);filter.connect(gain);gain.connect(Sound.master);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect()};source.start();}
document.addEventListener('pointerdown',event=>{const button=event.target.closest?.('.transmission .story-actions button');if(!button||button.disabled)return;heldCommsButtons.set(event.pointerId,button);button.classList.add('hardware-pressed');commsButtonClick();},{passive:true});
function releaseCommsButton(event){const button=heldCommsButtons.get(event.pointerId);if(button){button.classList.remove('hardware-pressed');heldCommsButtons.delete(event.pointerId);}}
for(const type of ['pointerup','pointercancel'])document.addEventListener(type,releaseCommsButton,{passive:true});
window.addEventListener('blur',()=>{for(const button of heldCommsButtons.values())button.classList.remove('hardware-pressed');heldCommsButtons.clear();});
