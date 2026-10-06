(()=>{
'use strict';
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d',{alpha:false});
const overlay=document.getElementById('overlay'),startButton=document.getElementById('start'),altButton=document.getElementById('alt');
const title=document.getElementById('title'),message=document.getElementById('message');
const W=540,H=960,TAU=Math.PI*2;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const angleTo=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x);
const delta=(a,b)=>Math.atan2(Math.sin(b-a),Math.cos(b-a));
const rand=(a,b)=>a+Math.random()*(b-a);
let scale=1,offsetX=0,offsetY=0,last=0,elapsed=0,phase='menu',shake=0,flash=0;
let mechs=[],shots=[],sparks=[],covers=[],decals=[],keys={},touch={left:null,right:null},mouse={x:270,y:430,down:false},audio;
const palette=[['#77968e','#f6ba6c'],['#aa7968','#ffc16f'],['#8e9a69','#dbe299'],['#8791a4','#a8d5f0']];
function resize(){const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(innerWidth*dpr);canvas.height=Math.round(innerHeight*dpr);scale=Math.min(canvas.width/W,canvas.height/H);offsetX=(canvas.width-W*scale)/2;offsetY=(canvas.height-H*scale)/2;altButton.style.right=`${offsetX/dpr+18}px`;altButton.style.bottom=`${offsetY/dpr+310*scale/dpr-32}px`}
addEventListener('resize',resize);resize();
function sound(freq=100,duration=.15,kind='sawtooth',gain=.055){try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.type=kind;o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(35,freq*.45),audio.currentTime+duration);g.gain.setValueAtTime(gain,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+duration)}catch{}}
function reset(){
 elapsed=0;shake=0;flash=0;shots=[];sparks=[];decals=[];
 covers=[{x:75,y:285,w:135,h:35,hp:220,max:220},{x:335,y:334,w:125,h:40,hp:220,max:220},{x:92,y:572,w:128,h:39,hp:220,max:220},{x:337,y:638,w:121,h:37,hp:220,max:220},{x:237,y:470,w:66,h:65,hp:130,max:130}];
 const spawns=[[270,758],[115,168],[429,166],[400,810]];
 mechs=spawns.map(([x,y],i)=>({id:i,x,y,vx:0,vy:0,hp:i===0?220:185,max:i===0?220:185,angle:i===0?-Math.PI/2:Math.PI/2,turret:i===0?-Math.PI/2:Math.PI/2,step:0,foot:0,cool:rand(.2,.8),missile:i===0?3:2,missileCool:0,heat:0,damage:0,target:0,think:0,side:i%2?-1:1,speed:i===0?63:rand(51,59),name:['YOU','RUST HOUND','BULWARK','VULTURE'][i],alive:true,shotCount:0}));
 touch={left:null,right:null};mouse.down=false;phase='playing';overlay.hidden=true;altButton.disabled=false;
}
function finish(win){phase='ended';overlay.hidden=false;title.textContent=win?'VICTORY':'MECH DESTROYED';message.textContent=win?'Last mech standing. The arena is yours.':'Your mech is wrecked. The remaining machines will keep fighting.';startButton.textContent='FIGHT AGAIN';altButton.disabled=true;sound(win?520:63,.55,'sawtooth',.11)}
startButton.addEventListener('click',()=>{reset();sound(150,.24,'sawtooth',.07)});
altButton.addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();missile(mechs[0])});
addEventListener('keydown',e=>{keys[e.code]=true;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code==='Space'&&!e.repeat&&phase==='playing')missile(mechs[0])});
addEventListener('keyup',e=>{keys[e.code]=false});
addEventListener('blur',()=>{keys={};mouse.down=false;touch={left:null,right:null}});
document.addEventListener('visibilitychange',()=>{last=performance.now();if(document.hidden){mouse.down=false;touch={left:null,right:null}}});
function point(e){return {x:(e.clientX*(canvas.width/innerWidth)-offsetX)/scale,y:(e.clientY*(canvas.height/innerHeight)-offsetY)/scale}}
function setStick(st,p){st.x=p.x;st.y=p.y;st.dx=clamp((p.x-st.sx)/67,-1,1);st.dy=clamp((p.y-st.sy)/67,-1,1);const l=Math.hypot(st.dx,st.dy);if(l>1){st.dx/=l;st.dy/=l}}
canvas.addEventListener('pointerdown',e=>{if(phase!=='playing')return;e.preventDefault();canvas.setPointerCapture(e.pointerId);const p=point(e);if(e.pointerType==='mouse'){mouse.down=true;mouse.x=p.x;mouse.y=p.y;return}const hand=p.x<W/2?'left':'right';if(touch[hand])return;touch[hand]={id:e.pointerId,sx:p.x,sy:p.y,x:p.x,y:p.y,dx:0,dy:0};});
canvas.addEventListener('pointermove',e=>{const p=point(e);if(e.pointerType==='mouse'){mouse.x=p.x;mouse.y=p.y;return}for(const hand of ['left','right'])if(touch[hand]?.id===e.pointerId)setStick(touch[hand],p)});
function release(e){if(e.pointerType==='mouse'){mouse.down=false;return}for(const hand of ['left','right'])if(touch[hand]?.id===e.pointerId)touch[hand]=null}
canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
function spark(x,y,color='#f8bb6d',n=9,power=95){for(let i=0;i<n;i++){let a=rand(0,TAU),v=rand(power*.25,power);sparks.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,t:rand(.18,.55),life:0,color,r:rand(1.5,3.5)})}}
function explosion(x,y,power=1){shake=Math.max(shake,6*power);flash=Math.max(flash,.1*power);spark(x,y,'#ffbb69',Math.round(18*power),190*power);spark(x,y,'#4c5a58',Math.round(8*power),90*power);decals.push({x,y,r:18+power*13,t:0});sound(68+rand(0,40),.22+power*.13,'sawtooth',.07*power)}
function damage(m,amount,fromX,fromY){if(!m.alive)return;const incoming=Math.atan2(fromY-m.y,fromX-m.x);const flank=Math.abs(delta(m.turret,incoming));const factor=flank>2.3?1.35:flank>1.15?1.12:.84;m.hp=Math.max(0,m.hp-amount*factor);m.damage=1;spark(m.x+Math.cos(incoming)*18,m.y+Math.sin(incoming)*18,palette[m.id][1],9,110);if(m.id===0)shake=Math.max(shake,3);if(m.hp<=0){m.alive=false;explosion(m.x,m.y,2);decals.push({x:m.x,y:m.y,r:45,t:1});if(m.id===0)finish(false);else if(mechs.slice(1).every(q=>!q.alive))finish(true)}}
function blocked(x,y,r=17){if(x<35+r||x>W-35-r||y<58+r||y>H-66-r)return true;return covers.some(c=>c.hp>0&&x+r>c.x&&x-r<c.x+c.w&&y+r>c.y&&y-r<c.y+c.h)}
function moveMech(m,dx,dy,dt){let nx=clamp(m.x+dx,53,W-53),ny=clamp(m.y+dy,77,H-84);if(!blocked(nx,m.y,19))m.x=nx;else m.vx=0;if(!blocked(m.x,ny,19))m.y=ny;else m.vy=0;for(const q of mechs)if(q!==m&&q.alive){const d=dist(m,q);if(d<38&&d>0){const push=(38-d)*.35;m.x+=(m.x-q.x)/d*push;m.y+=(m.y-q.y)/d*push}}}
function missile(m){if(!m?.alive||m.missile<1||m.missileCool>0||phase!=='playing')return;m.missile--;m.missileCool=1.45;const a=m.turret;shots.push({x:m.x+Math.cos(a)*31,y:m.y+Math.sin(a)*31,vx:Math.cos(a)*190,vy:Math.sin(a)*190,owner:m.id,type:'missile',t:3,damage:52,trail:0});spark(m.x+Math.cos(a)*35,m.y+Math.sin(a)*35,'#ffcf8a',7,80);sound(190,.3,'sawtooth',.08)}
function shoot(m){if(!m.alive||m.cool>0||m.heat>1)return;m.cool=m.id===0?.18:m.id===2?.44:.32;m.heat+=m.id===0?.105:.13;m.shotCount++;const a=m.turret+rand(-.025,.025),side=m.shotCount%2?1:-1;const x=m.x+Math.cos(a)*34+Math.cos(a+Math.PI/2)*side*11,y=m.y+Math.sin(a)*34+Math.sin(a+Math.PI/2)*side*11;shots.push({x,y,vx:Math.cos(a)*470,vy:Math.sin(a)*470,owner:m.id,type:'shell',t:1.35,damage:m.id===2?17:11,trail:0});spark(x,y,'#ffe6a0',4,65);if(m.id===0||Math.random()<.25)sound(m.id===2?82:120,.07,'square',.022)}
function lineClear(a,b){const n=Math.ceil(dist(a,b)/17);for(let i=1;i<n;i++){let x=a.x+(b.x-a.x)*i/n,y=a.y+(b.y-a.y)*i/n;if(covers.some(c=>c.hp>0&&x>c.x&&x<c.x+c.w&&y>c.y&&y<c.y+c.h))return false}return true}
function update(dt){elapsed+=dt;shake=Math.max(0,shake-dt*21);flash=Math.max(0,flash-dt*.8);
 for(const m of mechs){if(!m.alive)continue;m.cool-=dt;m.missileCool-=dt;m.heat=Math.max(0,m.heat-dt*.22);m.damage=Math.max(0,m.damage-dt*2.4);
  let dx=0,dy=0;
  if(m.id===0){dx=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+(touch.left?.dx||0);dy=(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0)+(touch.left?.dy||0);
   const l=Math.hypot(dx,dy);if(l>1){dx/=l;dy/=l}
   if(touch.right&&Math.hypot(touch.right.dx,touch.right.dy)>.18)m.turret=Math.atan2(touch.right.dy,touch.right.dx);
   else if(mouse.down)m.turret=Math.atan2(mouse.y-m.y,mouse.x-m.x);
   if((touch.right&&Math.hypot(touch.right.dx,touch.right.dy)>.18)||mouse.down)shoot(m);
  }else{
   m.think-=dt;if(m.think<=0){const options=mechs.filter(q=>q.alive&&q!==m);options.sort((a,b)=>(dist(m,a)+a.hp*.18)-(dist(m,b)+b.hp*.18));m.target=options[0]?.id??0;m.think=rand(.65,1.7)}
   const q=mechs[m.target];if(q?.alive){const a=angleTo(m,q),d=dist(m,q);m.turret+=clamp(delta(m.turret,a),-dt*1.8,dt*1.8);const forward=d>165?1:d<100?-.65:.12;dx=Math.cos(a)*forward+Math.cos(a+Math.PI/2)*m.side*.68;dy=Math.sin(a)*forward+Math.sin(a+Math.PI/2)*m.side*.68;const l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;if(d<420&&Math.abs(delta(m.turret,a))<.17&&lineClear(m,q))shoot(m);if(d>170&&d<340&&m.missile>0&&Math.random()<dt*.13&&lineClear(m,q))missile(m)}
  }
  const motion=Math.hypot(dx,dy);if(motion>.05){const target=Math.atan2(dy,dx);m.angle+=clamp(delta(m.angle,target),-dt*2,dt*2);m.step+=dt*(m.id===0?7:6);moveMech(m,dx*m.speed*dt,dy*m.speed*dt,dt);m.foot-=dt;if(m.id===0&&m.foot<=0){m.foot=.42;sound(59,.08,'sine',.025);spark(m.x-rand(-12,12),m.y+19,'#71817a',2,16)}}else m.step+=dt*.5;
 }
 for(let i=shots.length-1;i>=0;i--){const s=shots[i],ox=s.x,oy=s.y;s.x+=s.vx*dt;s.y+=s.vy*dt;s.t-=dt;s.trail+=dt;let hit=false;
  if(s.type==='missile'&&s.trail>.06){s.trail=0;spark(s.x,s.y,'#84928c',1,13)}
  if(s.x<38||s.x>W-38||s.y<58||s.y>H-66)hit=true;
  const c=covers.find(c=>c.hp>0&&s.x>c.x&&s.x<c.x+c.w&&s.y>c.y&&s.y<c.y+c.h);if(c){c.hp=Math.max(0,c.hp-s.damage*(s.type==='missile'?1.5:1));hit=true;spark(s.x,s.y,'#e6c085',8,90);if(c.hp<=0){explosion(c.x+c.w/2,c.y+c.h/2,.65);decals.push({x:c.x+c.w/2,y:c.y+c.h/2,r:Math.max(c.w,c.h)/2,t:1})}}
  const m=mechs.find(m=>m.alive&&m.id!==s.owner&&Math.hypot(m.x-s.x,m.y-s.y)<24);if(m){damage(m,s.damage,ox,oy);hit=true}
  if(hit&&s.type==='missile'){explosion(s.x,s.y,.9);for(const q of mechs)if(q.alive&&q.id!==s.owner&&dist(q,s)<55)damage(q,25*(1-dist(q,s)/70),s.x,s.y)}
  if(hit||s.t<=0)shots.splice(i,1)
 }
 for(let i=sparks.length-1;i>=0;i--){const p=sparks[i];p.life+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.exp(-dt*3);p.vy*=Math.exp(-dt*3);if(p.life>p.t)sparks.splice(i,1)}
}
function poly(points,fill,stroke='#15252a',line=2){ctx.beginPath();ctx.moveTo(points[0],points[1]);for(let i=2;i<points.length;i+=2)ctx.lineTo(points[i],points[i+1]);ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.lineWidth=line;ctx.strokeStyle=stroke;ctx.stroke()}}
function rect(x,y,w,h,fill){ctx.fillStyle=fill;ctx.fillRect(x,y,w,h)}
function bar(x,y,w,h,value,color,bg='#132329'){rect(x,y,w,h,bg);rect(x,y,w*clamp(value,0,1),h,color)}
function text(s,x,y,size=15,color='#e6eadf',align='left',weight='700'){ctx.font=`${weight} ${size}px system-ui,Arial`;ctx.textAlign=align;ctx.fillStyle=color;ctx.fillText(s,x,y)}
function mech(m){ctx.save();ctx.translate(m.x,m.y);ctx.fillStyle='#06101488';ctx.beginPath();ctx.ellipse(5,19,34,24,0,0,TAU);ctx.fill();
 const hurt=1-m.hp/m.max,col=palette[m.id][0],accent=palette[m.id][1];
 // Legs rotate towards travel; torso and guns rotate independently.
 ctx.save();ctx.rotate(m.angle+Math.PI/2);for(let side of [-1,1]){let gait=Math.sin(m.step+(side>0?Math.PI:0))*3;poly([side*14,3,side*26,10+gait,side*30,37+gait,side*13,35],col);poly([side*19,30+gait,side*33,37+gait,side*34,47+gait,side*16,44],hurt>.5&&side<0?'#39494b':'#a8afa2');rect(side*20-2,37+gait,8,3,accent)}ctx.restore();
 ctx.rotate(m.turret+Math.PI/2);
 // Weapons are built from the same primitives in the concept sheet.
 for(let side of [-1,1]){poly([side*17,-11,side*32,-13,side*38,21,side*26,28,side*19,13],col);poly([side*29,14,side*38,15,side*38,43,side*28,43],'#344850');rect(side*31-2,39,5,10,'#a7b4a9');rect(side*35-2,39,4,10,'#a7b4a9')}
 poly([-25,-24,-16,-36,16,-36,25,-24,23,16,11,29,-11,29,-23,16],col,'#142329',3);
 poly([-17,-31,-11,-41,11,-41,17,-31,12,-18,-12,-18],'#a2aca1');
 poly([-19,-13,0,-22,19,-13,16,9,0,20,-16,9],'#263a42');
 poly([-13,-9,0,-14,13,-9,9,7,0,11,-9,7],'#12272f');
 poly([-10,-5,10,-5,6,0,-6,0],accent,null);
 ctx.strokeStyle=accent;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-22,15);ctx.lineTo(-11,24);ctx.moveTo(22,15);ctx.lineTo(11,24);ctx.stroke();
 if(m.id===0||m.id===1){poly([-22,-31,-37,-31,-41,-14,-26,-13],'#526962');for(let i=0;i<4;i++){ctx.fillStyle=accent;ctx.beginPath();ctx.arc(-34+i%2*7,-25+Math.floor(i/2)*7,2.3,0,TAU);ctx.fill()}}
 if(m.id===2){poly([23,-6,38,-4,42,51,31,55],'#687b78');rect(32,49,9,12,'#e7aa5e')}
 if(hurt>.25){ctx.strokeStyle='#233238';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-18,-7);ctx.lineTo(-8,2);ctx.lineTo(-12,12);ctx.stroke()}
 if(hurt>.55){poly([12,-31,24,-23,23,-7,13,-13],'#303e40');ctx.fillStyle='#bf7842';ctx.beginPath();ctx.arc(21,8,4,0,TAU);ctx.fill()}
 if(hurt>.7){for(let i=0;i<3;i++){ctx.fillStyle=`rgba(77,84,78,${.22-i*.05})`;ctx.beginPath();ctx.arc(12+Math.sin(elapsed*2+i)*5,23+23*i-elapsed%1*14,10+i*3,0,TAU);ctx.fill()}}
 if(m.damage>0){ctx.globalAlpha=m.damage*.65;poly([-25,-24,-16,-36,16,-36,25,-24,23,16,11,29,-11,29,-23,16],'#ffd596',null);ctx.globalAlpha=1}
 ctx.restore();if(m.alive){bar(m.x-27,m.y-52,54,5,m.hp/m.max,m.id===0?'#a6d5c6':accent);if(m.id===0){ctx.strokeStyle='#b7dfd0';ctx.lineWidth=1.5;ctx.strokeRect(m.x-29,m.y-54,58,9)}}
}
function draw(){ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#080d10';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.setTransform(scale,0,0,scale,offsetX,offsetY);ctx.save();if(shake>0)ctx.translate(rand(-shake,shake),rand(-shake,shake));
 const floor=ctx.createLinearGradient(0,40,0,H);floor.addColorStop(0,'#3b4745');floor.addColorStop(1,'#172329');rect(20,40,500,860,floor);
 ctx.strokeStyle='#9caaa21b';ctx.lineWidth=1;for(let x=40;x<520;x+=60){ctx.beginPath();ctx.moveTo(x,40);ctx.lineTo(x,900);ctx.stroke()}for(let y=55;y<900;y+=60){ctx.beginPath();ctx.moveTo(20,y);ctx.lineTo(520,y);ctx.stroke()}
 for(let x=40;x<520;x+=28){poly([x,40,x+16,40,x+27,54,x+11,54],'#9c8248',null);poly([x,884,x+16,884,x+27,900,x+11,900],'#9c8248',null)}
 ctx.strokeStyle='#75827d';ctx.lineWidth=11;ctx.strokeRect(27,48,486,844);ctx.strokeStyle='#1a292c';ctx.lineWidth=5;ctx.strokeRect(33,55,474,830);
 for(const d of decals){ctx.fillStyle=d.t?'#101b1c':'#121d1dab';ctx.beginPath();ctx.ellipse(d.x,d.y,d.r,d.r*.56,0,0,TAU);ctx.fill();if(d.t){ctx.strokeStyle='#b5673866';ctx.lineWidth=3;ctx.stroke()}}
 for(const c of covers){if(c.hp<=0)continue;const h=c.hp/c.max;rect(c.x+9,c.y+13,c.w,c.h,'#0b1519aa');poly([c.x,c.y,c.x+c.w,c.y,c.x+c.w+7,c.y+10,c.x+7,c.y+10],h<.4?'#565d58':'#929c94');poly([c.x+7,c.y+10,c.x+c.w+7,c.y+10,c.x+c.w+7,c.y+c.h+11,c.x+7,c.y+c.h+11],h<.4?'#394449':'#536467');poly([c.x,c.y,c.x+7,c.y+10,c.x+7,c.y+c.h+11,c.x,c.y+c.h],'#2b3b3f');rect(c.x+c.w*.36,c.y+2,c.w*.24,4,'#d3a55e');if(h<.7){ctx.strokeStyle='#1b2b2d';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(c.x+c.w*.7,c.y+4);ctx.lineTo(c.x+c.w*.61,c.y+12);ctx.lineTo(c.x+c.w*.73,c.y+19);ctx.stroke()}}
 for(const m of mechs)if(!m.alive){ctx.save();ctx.translate(m.x,m.y);ctx.rotate(m.turret+Math.PI/2);poly([-29,-25,23,-34,38,21,-19,32],'#263238');poly([-14,-15,11,-21,20,13,-8,20],'#43504c');ctx.restore()}
 for(const m of mechs)if(m.alive)mech(m);
 for(const s of shots){ctx.strokeStyle=s.type==='missile'?'#ffb16b':'#f8d88e';ctx.lineWidth=s.type==='missile'?6:3;ctx.beginPath();ctx.moveTo(s.x-s.vx*.033,s.y-s.vy*.033);ctx.lineTo(s.x,s.y);ctx.stroke();ctx.fillStyle='#fff2b1';ctx.beginPath();ctx.arc(s.x,s.y,s.type==='missile'?5:3,0,TAU);ctx.fill()}
 for(const p of sparks){ctx.globalAlpha=1-p.life/p.t;ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,p.r,p.r);ctx.globalAlpha=1}
 ctx.restore();if(flash){rect(0,0,W,H,`rgba(255,221,174,${flash*.55})`)}
 // World HUD. Controls remain at consistent virtual positions.
 rect(0,0,W,58,'#0b161bcc');text('IRON PIT',20,29,21,'#f3eee0');text('LAST MECH STANDING',20,47,10,'#e5ad66');const alive=mechs.filter(m=>m.alive).length;text(`${alive} / 4`,W-18,37,25,'#eee9d8','right');
 const player=mechs[0];rect(0,904,W,56,'#0b161be8');text('ARMOUR',18,927,11,'#a8b7b1');bar(84,918,175,13,player?player.hp/player.max:1,'#8bb7a5');text(`${Math.ceil(player?.hp||0)} / 220`,84,947,11,'#d3dfd5');text('MISSILES',307,927,11,'#a8b7b1');text(`${player?.missile||0}`,421,941,24,'#f3b56b');
 for(const [hand,label] of [['left','MOVE'],['right','AIM + FIRE']]){const base={x:hand==='left'?103:435,y:795};const st=touch[hand];ctx.strokeStyle='#a8b8b16e';ctx.fillStyle='#14262acb';ctx.lineWidth=3;ctx.beginPath();ctx.arc(st?st.sx:base.x,st?st.sy:base.y,hand==='left'?55:62,0,TAU);ctx.fill();ctx.stroke();const cx=(st?st.sx:base.x)+(st?.dx||0)*38,cy=(st?st.sy:base.y)+(st?.dy||0)*38;ctx.fillStyle=hand==='left'?'#869f9a':'#d89e60';ctx.beginPath();ctx.arc(cx,cy,hand==='left'?23:27,0,TAU);ctx.fill();if(!st)text(label,base.x,base.y+78,11,'#b6c3bc','center')}
}
function frame(now){let dt=last?Math.min((now-last)/1000,.045):0;last=now;if(phase==='playing')update(dt);draw();requestAnimationFrame(frame)}requestAnimationFrame(frame);
if('serviceWorker'in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();
