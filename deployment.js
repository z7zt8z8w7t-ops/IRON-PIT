'use strict';
// Delivery is an isolated phase: all four combatants wait until cockpit boot completes.
let deployment=null;
const DEPLOYMENT_DURATION=11.1;
const deploymentClamp=v=>Math.max(0,Math.min(1,v));
const deploymentEase=v=>{v=deploymentClamp(v);return v*v*(3-2*v)};
function deploymentControls(disabled){for(const id of ['primary','secondary','support','shield','eject','turnLeft','turnRight','repair'])$(id).disabled=disabled;$('move').style.pointerEvents=disabled?'none':'';const panel=currentPanel();if(panel){panel.classList.toggle('booting',disabled);panel.style.filter=disabled?'brightness(.25)':''}}
function startDeployment(){if(!duelActive||p.duelIndex===0)resetStadium();cancelDeployment();stopFiring();keys.clear();input.move={x:0,y:0};input.aim={x:0,y:0};const state=deployment={age:0,ready:false,generation:p.generation,events:new Set()};deploymentControls(true);$('deploymentStatus').textContent='PREPARING TRANSPORT';$('deploymentStatus').hidden=false;
 Promise.resolve(Sound.unlock()).then(()=>Sound.loading).then(()=>{if((deployment===state||(typeof duelPlayers!=='undefined'&&duelActive&&duelPlayers.some(s=>s.deployment===state)))&&inArena)state.ready=true}).catch(()=>{if(deployment===state||(typeof duelPlayers!=='undefined'&&duelActive&&duelPlayers.some(s=>s.deployment===state)))state.ready=true});
}
function cancelDeployment(){Sound.stopLoop('deployment-rotor'+(p.id||''));deployment=null;deploymentControls(false);$('deploymentStatus').hidden=true;if(typeof repairState!=='undefined')updateDiagnostics()}
function stepDeployment(dt){const d=deployment;if(!d||!d.ready)return;d.age=Math.min(DEPLOYMENT_DURATION,d.age+dt);const t=d.age;const panel=currentPanel();if(panel&&t>=7.8)panel.style.filter='brightness(1)';else if(panel&&t>6.3)panel.style.filter='brightness('+(.25+.75*deploymentClamp((t-6.3)/1.5)*(Math.sin(t*37)>.05?1:.65))+')';
 const level=t<1.8?.08+.67*deploymentEase(t/1.8):t<4.5?.75:.75*Math.max(.01,1-deploymentEase((t-4.5)/3.2));if(t<7.8)Sound.loop('deployment-helicopter','deployment-rotor'+(p.id||''),p.x,p.y,level,1);else Sound.stopLoop('deployment-rotor'+(p.id||''));
 for(const [at,name,level]of [[2,'deployment-winch',.55],[4,'deployment-land',1],[4.35,'deployment-release',.8],[6.45,'deployment-boot',.5],[7.8,'deployment-boot',.7]]){const key=at+name;if(t>=at&&!d.events.has(key)){d.events.add(key);Sound.play(name,p.x,p.y,level,1,true)}}
 $('deploymentStatus').textContent=t<2?'TRANSPORT APPROACH':t<4?'LOWERING MECH':t<4.5?'TOUCHDOWN · RELEASE':t<6.3?'TRANSPORT DEPARTURE':t<7.8?'COCKPIT BOOT SEQUENCE':'ALL SYSTEMS ONLINE';
 if(t>=8.2){$('deploymentStatus').hidden=true;if(!duelActive||p.duelIndex===0)beginStadiumCountdown()}
 if(t>=DEPLOYMENT_DURATION){cancelDeployment();keys.clear();input.move={x:0,y:0};input.aim={x:0,y:0};stopFiring();Sound.startMusic()}
}
function drawDeploymentCockpit(c){const t=deployment?.age;if(t===undefined)return;const progress=deploymentClamp((t-6.3)/1.2);const on=t>6.3&&(t>7.5||Math.sin(t*37)>.05);c.save();c.fillStyle='#0d161d';c.globalAlpha=on?1-progress*.8:1;c.fillRect(-16,-28,32,58);c.globalAlpha=1;for(const side of [-1,1])for(let j=0;j<4;j++){const lit=on&&(t>7.5||j===Math.floor(t*8)%4);drawTurretLamp(c,side,j,lit?'#75e8ec':'#2a363c',lit?1:.4)}c.restore()}
function drawDeployment(c,w,h){const d=deployment;if(!d)return;const t=d.age,approach=deploymentEase(t/2),depart=deploymentEase((t-4.5)/2.7),distance=arenaMode==='duel'?ARENA.height+450:h/(2*ZOOM)+420,py=t<2?p.y+distance*(1-approach):p.y-distance*depart,px=p.x+depart*160;
 if(t<7.3){c.save();c.globalAlpha=.20*(1-depart);c.fillStyle='#000';c.beginPath();c.ellipse(px+35,py+48,175,235,0,0,Math.PI*2);c.fill();c.restore()}
 // Low-opacity downwash wisps and touchdown dust remain below the airframe.
 if(t>1.4&&t<6.4){const strength=Math.sin(deploymentClamp((t-1.4)/5)*Math.PI)*.15;for(let i=0;i<24;i++){const a=i*2.39996+t*.12,r=90+((i*37+t*110)%200),x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r,size=42+i%14;const g=c.createRadialGradient(x,y,0,x,y,size);g.addColorStop(0,'rgba(173,161,134,'+strength+')');g.addColorStop(1,'rgba(173,161,134,0)');c.fillStyle=g;c.fillRect(x-size,y-size,size*2,size*2)}}
 const drop=deploymentEase((t-2)/2),mx=t<2?px:p.x,my=t<2?py:p.y;mech(c,mx,my,t<4?1.07-.22*drop:.85,p.heading,p.angle,build,p.parts,build.chassis==='biped'?bipedRig:null);
 if(t<4.5){c.save();c.strokeStyle='#afb4ab';c.lineWidth=2;for(const side of [-1,1]){c.beginPath();c.moveTo(px+side*42,py+24);c.lineTo(mx+side*80,my+61);c.stroke()}c.restore()}
 if(t<7.3)drawDeploymentAircraft(c,px,py,1.22);
}
 function deploymentPath(c,points,fill,stroke='#53616a'){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.stroke()}}
 function drawDeploymentAircraft(c,x,y,scale){c.save();c.translate(x,y);c.scale(scale,scale);
 // The airframe, rotor pylons and nacelles are all strictly overhead.
 c.shadowColor='#000b';c.shadowBlur=14;c.shadowOffsetY=10;
 deploymentPath(c,[[-34,-131],[-49,-101],[-47,100],[-29,132],[29,132],[47,100],[49,-101],[34,-131]],'#242e31');
 deploymentPath(c,[[-34,-125],[-41,-87],[-37,90],[-27,118],[27,118],[37,90],[41,-87],[34,-125]],'#526052');
 c.shadowBlur=0;c.shadowOffsetY=0;
 deploymentPath(c,[[-27,-118],[-33,-90],[-3,-87],[-3,-119]],'#173942','#86989a');deploymentPath(c,[[3,-119],[3,-87],[33,-90],[27,-118]],'#173942','#86989a');
 for(const side of [-1,1]){c.fillStyle='#182124';c.fillRect(side*53-9,31,18,64);c.fillStyle='#63705d';c.fillRect(side*54-8,33,16,53);for(let i=0;i<7;i++){c.fillStyle='#192327';c.fillRect(side*54-6,39+i*6,12,2)}c.fillStyle='#181e24';c.fillRect(side*45-5,-72,10,23);c.fillRect(side*43-5,97,10,23)}
 for(let j=0;j<5;j++){const yy=-69+j*33;c.fillStyle=j%2?'#4b584c':'#56634f';c.fillRect(-30,yy,60,27);c.strokeStyle='#75816b';c.strokeRect(-30,yy,60,27);for(const xx of [-27,27]){c.fillStyle='#b0b2a0';c.fillRect(xx-1,yy+4,2,2);c.fillRect(xx-1,yy+21,2,2)}}
 for(let i=0;i<90;i++){const x=Math.sin(i*64.2)*31,y=Math.sin(i*19.8)*109;c.fillStyle=i%3?'#141e222d':'#c1c5ad40';c.fillRect(x,y,1+i%3,1)}
 c.fillStyle='#c4c5af';c.font='10px monospace';c.textAlign='center';c.fillText('IP–47',0,32);c.fillStyle='#181f23';c.fillRect(-14,49,28,16);c.fillStyle='#677367';c.fillRect(-10,52,20,10);
 for(const yy of [-83,100]){c.fillStyle='#233035';c.fillRect(-22,yy-16,44,32);c.strokeStyle='#899181';c.strokeRect(-22,yy-16,44,32);c.fillStyle='#a1a58f';c.beginPath();c.arc(0,yy,9,0,Math.PI*2);c.fill();
 c.save();c.translate(0,yy);c.rotate(deployment.age*42*(yy<0?1:-1));for(let j=0;j<3;j++){c.rotate(Math.PI*2/3);c.globalAlpha=.65;deploymentPath(c,[[5,-4],[145,-8],[153,0],[5,5]],'#182125','#647074');c.globalAlpha=.12;c.fillStyle='#afbec0';c.beginPath();c.arc(0,0,151,j*.4,j*.4+1.2);c.lineTo(0,0);c.fill()}c.globalAlpha=1;c.restore();c.fillStyle='#849082';c.beginPath();c.arc(0,yy,8,0,Math.PI*2);c.fill()}
 for(const [x,col]of [[-48,'#ff5040'],[48,'#6afa8c']]){c.fillStyle=col;c.shadowColor=col;c.shadowBlur=8;c.fillRect(x-2,-19,4,5)}c.restore()}
