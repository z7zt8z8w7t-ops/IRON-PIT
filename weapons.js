'use strict';
// Normalised firing points measured against each cropped approved sprite.
const GUNS={
 'machine-gun':{ports:[[.55,.01]],rate:.095,speed:1500,kind:'bullet',color:'#ffd08a'},
 rotary:{ports:[[.42,.01],[.48,.01],[.55,.01],[.61,.01]],cycle:true,rate:.055,speed:1350,kind:'bullet',color:'#ffbd69'},
 siege:{ports:[[.30,.015],[.51,.015]],rate:.85,speed:820,kind:'shell',color:'#ffc875'},
 'tri-salvo':{ports:[[.24,.015],[.43,.015],[.62,.015]],rate:1.3,speed:470,kind:'rocket',color:'#ffb36a'},
 railgun:{ports:[[.36,.015]],rate:1.05,speed:2600,kind:'rail',color:'#d9f5ff'},
 flak:{ports:[[.42,.02]],rate:.65,speed:920,kind:'flak',color:'#ffd17f'},
 plasma:{ports:[[.45,.015]],rate:.48,speed:540,kind:'plasma',color:'#52e8ff'},
 pulse:{ports:[[.35,.04],[.64,.04]],rate:.22,speed:2200,kind:'pulse',color:'#ff4545'},
 beam:{ports:[[.4,.015]],rate:.07,speed:0,kind:'beam',color:'#ffbe51',range:780},
 flame:{ports:[[.24,.015]],rate:.055,speed:340,kind:'flame',color:'#ff922f',range:260},
 arc:{ports:[[.37,.015],[.63,.015]],rate:.13,speed:0,kind:'arc',color:'#b985ff',range:360},
 emp:{ports:[[.38,.015]],rate:1.1,speed:480,kind:'emp',color:'#5c9dff'},
 swarm:{ports:[[.20,.02],[.28,.02],[.36,.02],[.64,.02],[.72,.02],[.80,.02]],rate:1.8,speed:440,kind:'rocket',color:'#ffc581'},
 hunter:{ports:[[.23,.02],[.36,.02],[.64,.02],[.77,.02]],rate:2.2,speed:380,kind:'rocket',color:'#ffc581'},
 barrage:{ports:[[.20,.02],[.30,.02],[.40,.02],[.60,.02],[.70,.02],[.80,.02]],rate:2.0,speed:520,kind:'rocket',color:'#ffc581'},
 mortar:{ports:[[.33,.10],[.73,.10]],rate:2.3,speed:390,kind:'mortar',color:'#ffd279'},
 mines:{ports:[[.5,.98]],rate:1.4,speed:0,kind:'mine',color:'#d9b54f'},
 smoke:{ports:[[.25,.88],[.75,.88]],rate:2.8,speed:150,kind:'smoke',color:'#b3bbb7'}
};
const rounds=[],particles=[],flashes=[],lines=[],marks=[],mines=[];const barrelCycle={};const targets=[{x:1200,y:820,r:56,shield:false},{x:1500,y:1050,r:56,shield:true},{x:900,y:1050,r:56,shield:false},{x:1200,y:1530,r:56,shield:false}];
const MAX_PARTICLES=950,MECH_SCALE=.85;
function emit(o){if(particles.length<MAX_PARTICLES)particles.push(o)}
function worldPoint(x,y,a=p.angle){return{x:p.x+(x*Math.cos(a)-y*Math.sin(a))*MECH_SCALE,y:p.y+(x*Math.sin(a)+y*Math.cos(a))*MECH_SCALE}}
const PRIMARY_IDS=['machine-gun','rotary','pulse','beam','flame','arc'];
const SECONDARY_IDS=['siege','railgun','plasma','tri-salvo','flak','emp'];
function weaponMount(slot,id){if(slot==='primary')return{x:0,y:66,w:67,h:154,flip:false};if(slot==='secondary')return{x:-99,y:-34,w:67,h:154,flip:side.findIndex(v=>v[0]===id)>=6};return{x:99,y:-25,w:80,h:112,flip:false}}
function mountPorts(id,offset){const g=GUNS[id],m=weaponMount(offset<0?'primary':offset>0?'secondary':'support',id);return g.ports.map(([u,v])=>worldPoint(m.x+((m.flip?1-u:u)-.5)*m.w,m.y+(v-.5)*m.h))}
function puff(x,y,color,n,speed,size,life){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=Math.random()*speed;emit({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,color,size:size*(.4+Math.random()),life,max:life,kind:'spark'})}}
function smokePuff(x,y,size=9,life=.8){emit({x,y,vx:(Math.random()-.5)*12,vy:(Math.random()-.5)*12,color:'#88918b',size,life,max:life,kind:'smoke'})}
function addMark(x,y,r){marks.push({x,y,r,life:14});if(marks.length>90)marks.shift()}
function impact(id,x,y,shield=false,stats=weaponStats(id),hit=null){const g=GUNS[id];if(!shield)componentImpact(id,x,y,stats,hit);if(typeof Sound!=='undefined')Sound.play(shield?'shield':'hit-'+id,x,y,.72);if(shield){if(id==='emp')for(const t of targets)if(t.shield&&Math.hypot(x-t.x,y-t.y)<t.r+25){t.shield=false;t.shieldTimer=2.5}flashes.push({x,y,r:5,max:55,life:.4,total:.4,color:'#65d9ff',ring:true,tex:7});puff(x,y,'#9deaff',14,100,2,.32);return}
 const kind=g.kind;
 if(['rocket','shell','mortar','mine'].includes(kind)){const r=id==='hunter'?62:kind==='shell'?42:kind==='mine'?48:30;flashes.push({x,y,r,max:r,life:.28,total:.28,color:'#ffb44d',tex:2});puff(x,y,'#ffb64e',26,190,3,.6);puff(x,y,'#827868',14,115,4,.9);for(let j=0;j<9;j++)smokePuff(x+(Math.random()-.5)*r,y+(Math.random()-.5)*r,12,1.3);addMark(x,y,r*.5)}
 else if(kind==='flak'){puff(x,y,'#ffe5ae',35,240,1.5,.5);puff(x,y,'#8b9386',12,130,3,.5);addMark(x,y,12)}
 else if(kind==='plasma'){flashes.push({x,y,r:24,max:32,life:.45,total:.45,color:'#58edff',tex:3});puff(x,y,'#59e4ff',22,100,3,.6);addMark(x,y,14)}
 else if(kind==='emp'){flashes.push({x,y,r:10,max:110,life:.65,total:.65,color:'#5fafff',ring:true});for(let i=0;i<5;i++)lines.push({x,y,ex:x+(Math.random()-.5)*80,ey:y+(Math.random()-.5)*80,life:.25,total:.25,color:'#71b8ff',arc:true});}
 else if(kind==='arc'){for(let i=0;i<5;i++)lines.push({x,y,ex:x+(Math.random()-.5)*75,ey:y+(Math.random()-.5)*75,life:.2,total:.2,color:g.color,arc:true});puff(x,y,g.color,5,60,2,.2)}
 else if(kind==='flame'){emit({x,y,vx:0,vy:0,size:12,life:.65,max:.65,color:'#ff9d35',kind:'fire'});smokePuff(x,y,12,1);addMark(x,y,8)}
 else{puff(x,y,kind==='rail'?'#ecfaff':g.color,kind==='rail'?28:8,kind==='rail'?210:100,1.5,.3);flashes.push({x,y,r:kind==='rail'?15:6,max:12,life:.12,total:.12,color:g.color});addMark(x,y,kind==='rail'?7:3)}
}
function sweepHit(x,y,ex,ey){let best=null,tmin=1;const dx=ex-x,dy=ey-y,aa=dx*dx+dy*dy;if(aa<.0001)return null;for(const t of targets){const rr=t.r+(t.shield?20:0),cx=x-t.x,cy=y-t.y,b=2*(cx*dx+cy*dy),cc=cx*cx+cy*cy-rr*rr,d=b*b-4*aa*cc;if(d>=0){const q=(-b-Math.sqrt(d))/(2*aa);if(q>=0&&q<=tmin){tmin=q;best={x:x+dx*q,y:y+dy*q,target:t}}}}if(enemy.alive){const steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)*tmin/2));for(let i=0;i<=steps;i++){const q=tmin*i/steps,part=enemyPartAt(x+dx*q,y+dy*q);if(part){best={x:x+dx*q,y:y+dy*q,target:enemy,part};break}}}return best}
function fireWeapon(id,offset,lockedTarget=null){if(!id)return;if(typeof Sound!=='undefined')Sound.play('fire-'+id,p.x,p.y,.85);const g=GUNS[id],stats=shotStats(id,offset);let ports=mountPorts(id,offset);const swarmCentre=ports.reduce((c,v)=>({x:c.x+v.x/ports.length,y:c.y+v.y/ports.length}),{x:0,y:0});if(g.cycle){const i=barrelCycle[id]||0;ports=[ports[i%ports.length]];barrelCycle[id]=i+1}
 for(const point of ports){let a=p.angle;const {x,y}=point;if(id==='swarm'||id==='barrage')a+=(ports.indexOf(point)-(ports.length-1)/2)*.018;
 if(g.kind==='mine'){for(let j=-2;j<=2&&mines.length<30;j++){const a=p.angle+Math.PI+j*.19;mines.push({x,y,vx:Math.sin(a)*(135+Math.abs(j)*12),vy:-Math.cos(a)*(135+Math.abs(j)*12),life:20,armed:1.1,stats})}continue}
 if(g.kind==='smoke')a+=Math.PI+(ports.indexOf(point)?-.3:.3);
 if(['beam','arc'].includes(g.kind)){let ex=x+Math.sin(a)*g.range,ey=y-Math.cos(a)*g.range;const hit=sweepHit(x,y,ex,ey);if(hit){ex=hit.x;ey=hit.y;impact(id,ex,ey,hit.target.shield,stats,hit)}lines.push({x,y,ex,ey,color:g.color,life:g.rate*1.5,total:g.rate*1.5,arc:g.kind==='arc'});continue}
 flashes.push({x,y,r:g.kind==='bullet'?5:9,max:9,life:g.kind==='shell'?.1:.065,total:g.kind==='shell'?.1:.065,color:g.color,muzzle:true,lightRadius:g.kind==='shell'?170:g.kind==='bullet'?80:115});
 if(['bullet','shell','flak'].includes(g.kind))emit({x,y,vx:Math.cos(a)*90,vy:Math.sin(a)*90,size:2,life:.7,max:.7,color:'#b89956',kind:'case'});
 if(rounds.length<230)rounds.push({x,y,px:x,py:y,a,id,stats,target:lockedTarget,targetLife:lockedTarget?.generation,speed:g.speed,life:g.kind==='flame'?.7:g.kind==='mortar'?1.3:g.kind==='smoke'?.45:2,age:0,trail:0,travel:0,...(id==='swarm'?{cx:swarmCentre.x,cy:swarmCentre.y,ca:p.angle,phase:ports.indexOf(point)*Math.PI*2/ports.length,launchX:x-swarmCentre.x,launchY:y-swarmCentre.y}: {})});
 }
}
function stepWeapons(dt){for(const t of targets)if(t.shieldTimer>0){t.shieldTimer-=dt;if(t.shieldTimer<=0)t.shield=true}
 for(let i=rounds.length-1;i>=0;i--){const e=rounds[i],g=GUNS[e.id];e.life-=dt;e.age+=dt;e.px=e.x;e.py=e.y;if(e.id==='swarm'){let steer=.6*Math.cos(e.age*1.7);const guided=e.target?.alive&&e.target.generation===e.targetLife&&e.age>.18;if(guided){const desired=Math.atan2(e.target.x-e.cx,-(e.target.y-e.cy)),diff=Math.atan2(Math.sin(desired-e.ca),Math.cos(desired-e.ca));steer=Math.max(-2.2,Math.min(2.2,diff*3))}e.ca+=steer*dt;e.cx+=Math.sin(e.ca)*e.speed*dt;e.cy-=Math.cos(e.ca)*e.speed*dt;const distance=guided?Math.hypot(e.target.x-e.cx,e.target.y-e.cy):999,amp=22*Math.min(1,e.age/.2)*Math.min(1,distance/130),phase=e.phase+e.age*12,sideways=Math.sin(phase)*amp,forward=Math.cos(phase)*amp*.35,launch=Math.max(0,1-e.age/.3);e.x=e.cx+Math.cos(e.ca)*sideways+Math.sin(e.ca)*forward+e.launchX*launch;e.y=e.cy+Math.sin(e.ca)*sideways-Math.cos(e.ca)*forward+e.launchY*launch;e.a=Math.atan2(e.x-e.px,-(e.y-e.py))}else{if(e.target?.alive&&e.target.generation===e.targetLife&&e.age>.18){const desired=Math.atan2(e.target.x-e.x,-(e.target.y-e.y)),diff=Math.atan2(Math.sin(desired-e.a),Math.cos(desired-e.a)),speed=e.id==='hunter'?1.1:1.6;e.a+=Math.max(-dt*speed,Math.min(dt*speed,diff))}e.x+=Math.sin(e.a)*e.speed*dt;e.y-=Math.cos(e.a)*e.speed*dt;}e.travel+=e.speed*dt;e.trail-=dt;
 if(e.trail<=0){if(g.kind==='rocket')smokePuff(e.x,e.y,e.id==='hunter'?8:4,.7);if(g.kind==='plasma')emit({x:e.x,y:e.y,vx:0,vy:0,color:g.color,size:4,life:.15,max:.15,kind:'spark'});if(g.kind==='flame')emit({x:e.x+(Math.random()-.5)*e.age*50,y:e.y+(Math.random()-.5)*e.age*50,vx:0,vy:0,color:'#ff8b31',size:5+e.age*18,life:.25,max:.25,kind:'fire'});e.trail=.025}
 const hit=g.kind==='mortar'||g.kind==='smoke'?null:sweepHit(e.px,e.py,e.x,e.y);const wall=e.x<15||e.x>2385||e.y<15||e.y>2385;
 if(hit||wall||e.life<=0){const x=hit?hit.x:Math.max(15,Math.min(2385,e.x)),y=hit?hit.y:Math.max(15,Math.min(2385,e.y));if(g.kind==='smoke'){for(let j=0;j<42;j++)smokePuff(x+(Math.random()-.5)*85,y+(Math.random()-.5)*85,20,4+Math.random()*2)}else if(g.kind==='mortar'){for(let j=0;j<7;j++)impact(e.id,x+(Math.random()-.5)*110,y+(Math.random()-.5)*110,false,e.stats)}else if(hit||wall)impact(e.id,x,y,hit?.target.shield,e.id==='flak'?{...e.stats,damage:e.stats.damage*Math.max(.35,1-e.travel/1200)}:e.stats,hit);rounds.splice(i,1)}
 }
 for(let i=mines.length-1;i>=0;i--){const m=mines[i];m.life-=dt;m.armed-=dt;m.x+=m.vx*dt;m.y+=m.vy*dt;m.vx*=Math.exp(-4*dt);m.vy*=Math.exp(-4*dt);if(m.life<=0||m.armed<=0&&([...targets,...(enemy.alive?[enemy]:[])].some(t=>Math.hypot(t.x-m.x,t.y-m.y)<t.r+38)||Math.hypot(p.x-m.x,p.y-m.y)<55)){impact('mines',m.x,m.y,false,m.stats);mines.splice(i,1)}}
 for(const arr of [particles,flashes,lines,marks])for(let i=arr.length-1;i>=0;i--){const e=arr[i];e.life-=dt;if(e.vx!==undefined){e.x+=e.vx*dt;e.y+=e.vy*dt;e.vx*=Math.exp(-3*dt);e.vy*=Math.exp(-3*dt)}if(e.life<=0)arr.splice(i,1)}
}
function texture(c,index,x,y,size,alpha=1){const im=images.fx;if(!im)return;c.save();c.globalAlpha=alpha;const w=im.width/4,h=im.height/2;c.drawImage(im,(index%4)*w,Math.floor(index/4)*h,w,h,x-size/2,y-size/2,size,size);c.restore()}
function glow(c,x,y,r,color,alpha=1){c.save();c.globalAlpha=alpha;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(.3,color+'bb');g.addColorStop(1,color+'00');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);c.restore()}
function drawWeapons(c){
 for(const t of targets){c.save();c.translate(t.x,t.y);c.fillStyle='#4c5849';c.strokeStyle='#a4a58c';c.lineWidth=3;c.fillRect(-43,-43,86,86);c.strokeRect(-43,-43,86,86);c.strokeStyle='#adb18c';for(const a of [-1,1])for(const b of [-1,1]){c.beginPath();c.arc(a*35,b*35,3,0,7);c.stroke()}c.strokeStyle='#a8a88b';c.beginPath();c.arc(0,0,23,0,7);c.moveTo(-30,0);c.lineTo(30,0);c.moveTo(0,-30);c.lineTo(0,30);c.stroke();c.fillStyle='#b7bdaa';c.font='10px system-ui';c.fillText(t.shield?'SHIELD TEST':'ARMOUR TEST',-34,64);if(t.shield){c.fillStyle='#479fff22';c.strokeStyle='#68cfff99';c.beginPath();c.arc(0,0,t.r+20,0,7);c.fill();c.stroke()}c.restore()}
 for(const m of marks){c.globalAlpha=Math.min(.65,m.life/3);c.fillStyle='#10140f';c.beginPath();c.ellipse(m.x,m.y,m.r,m.r*.7,0,0,Math.PI*2);c.fill();texture(c,4,m.x,m.y,m.r*3,Math.min(.6,m.life/3))}c.globalAlpha=1;
 for(const e of particles){const alpha=e.life/e.max;c.save();c.globalAlpha=alpha*(e.kind==='smoke'?.18:1);c.fillStyle=e.color;if(e.kind==='smoke'){texture(c,0,e.x,e.y,e.size*3*(2-alpha),alpha*.4)}else if(e.kind==='case'){c.translate(e.x,e.y);c.rotate(e.life*12);c.fillRect(-2,-1,4,2)}else if(e.kind==='fire'){texture(c,1,e.x,e.y,e.size*3,alpha);c.fillStyle='#ffd88a';c.beginPath();c.arc(e.x,e.y,e.size*.2,0,7);c.fill()}else{c.beginPath();c.arc(e.x,e.y,e.kind==='smoke'?e.size*(2-alpha):e.size,0,7);c.fill()}c.restore()}
 for(const e of rounds){const g=GUNS[e.id];c.save();c.translate(e.x,e.y);c.rotate(e.a);if(g.kind==='rocket'){glow(c,0,9,12,'#ff9b35');c.fillStyle='#b6bab0';c.beginPath();c.moveTo(0,-9);c.lineTo(3,-3);c.lineTo(3,6);c.lineTo(-3,6);c.lineTo(-3,-3);c.closePath();c.fill();c.fillStyle='#675f42';c.fillRect(-4,5,8,3)}else if(g.kind==='plasma'){glow(c,0,0,12,g.color);c.fillStyle='#d5ffff';c.beginPath();c.ellipse(0,0,3,6,0,0,7);c.fill()}else if(g.kind==='emp'){c.strokeStyle=g.color;c.lineWidth=2;c.beginPath();c.ellipse(0,0,12,5,0,0,7);c.stroke();glow(c,0,0,12,g.color,.5)}else if(g.kind!=='flame'){c.strokeStyle=g.color;c.lineWidth=g.kind==='rail'?1:g.kind==='pulse'?2:1.4;c.beginPath();c.moveTo(0,0);c.lineTo(0,g.kind==='rail'?80:g.kind==='pulse'?35:g.kind==='bullet'?18:12);c.stroke();if(['shell','mortar','flak'].includes(g.kind)){c.fillStyle='#9ca598';c.fillRect(-2,-4,4,9)}}c.restore()}
 for(const l of lines){c.save();c.globalAlpha=l.life/l.total;c.strokeStyle=l.color;c.lineWidth=l.arc?1.5:3;c.beginPath();c.moveTo(l.x,l.y);if(l.arc){for(let j=1;j<12;j++)c.lineTo(l.x+(l.ex-l.x)*j/12+(Math.random()-.5)*15,l.y+(l.ey-l.y)*j/12+(Math.random()-.5)*15)}c.lineTo(l.ex,l.ey);c.stroke();c.strokeStyle='#fff9';c.lineWidth=.7;c.stroke();c.restore()}
 for(const m of mines){c.fillStyle='#333e35';c.strokeStyle='#a6a58b';c.lineWidth=2;c.beginPath();c.arc(m.x,m.y,7,0,7);c.fill();c.stroke();c.fillStyle=m.armed>0?'#ffd564':'#ff713e';c.fillRect(m.x-2,m.y-2,4,4)}
 for(const f of flashes){const a=f.life/f.total;if(f.tex!==undefined)texture(c,f.tex,f.x,f.y,f.ring?f.max*(1-a)*2:f.r*2.8,a);if(f.ring){c.save();c.globalAlpha=a;c.strokeStyle=f.color;c.lineWidth=3;for(let j=0;j<3;j++){c.beginPath();c.arc(f.x,f.y,Math.max(1,f.max*(1-a)+j*8),0,7);c.stroke()}c.restore()}else glow(c,f.x,f.y,f.r,f.color,a)}
}
