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
function drawDeployment(c,w,h){const d=deployment;if(!d)return;const t=d.age,approach=deploymentEase(t/2),depart=deploymentClamp((t-4.5)/2.7),distance=arenaMode==='duel'?ARENA.height+450:h/(2*ZOOM)+420,py=t<2?p.y+distance*(1-approach):p.y-370*depart+105*depart*depart,px=p.x+(ARENA.width-p.x+500)*depart*depart,heading=t<=4.5?0:Math.atan2(2*(ARENA.width-p.x+500)*depart,370-210*depart);
 if(t<7.3){c.save();c.globalAlpha=.20*(1-depart);c.fillStyle='#000';c.beginPath();c.ellipse(px+20,py+28,75,190,heading,0,Math.PI*2);c.fill();c.restore()}
 // Low-opacity downwash wisps and touchdown dust remain below the airframe.
 if(t>1.4&&t<6.4){const strength=Math.sin(deploymentClamp((t-1.4)/5)*Math.PI)*.15;for(let i=0;i<24;i++){const a=i*2.39996+t*.12,r=90+((i*37+t*110)%200),x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r,size=42+i%14;const g=c.createRadialGradient(x,y,0,x,y,size);g.addColorStop(0,'rgba(173,161,134,'+strength+')');g.addColorStop(1,'rgba(173,161,134,0)');c.fillStyle=g;c.fillRect(x-size,y-size,size*2,size*2)}}
 const drop=deploymentEase((t-2)/2),mx=t<2?px:p.x,my=t<2?py:p.y;mech(c,mx,my,t<4?1.07-.22*drop:.85,p.heading,p.angle,build,p.parts,build.chassis==='biped'?bipedRig:null);
 if(t<4.5){c.save();c.strokeStyle='#afb4ab';c.lineWidth=2;for(const side of [-1,1]){c.beginPath();c.moveTo(px+side*42,py+24);c.lineTo(mx+side*80,my+61);c.stroke()}c.restore()}
 if(t<7.3)drawDeploymentAircraft(c,px,py,1,heading);
}
 function drawDeploymentAircraft(c,x,y,scale,heading=0){const t=deployment.age;c.save();c.translate(x,y);c.rotate(heading);c.scale(scale,scale);c.drawImage(images['helicopter-snow'],150,0,360,1024,-72.5,-207,145,414);
 for(const[yy,sign]of [[-114,1],[114,-1]]){c.save();c.translate(0,yy);for(let j=0;j<4;j++){c.save();c.globalAlpha=j===0?.85:.12;c.rotate(sign*t*34-j*.15);c.drawImage(images['helicopter-snow'],690,130,780,760,-139,-135.5,278,271);c.restore()}c.restore()}
 const on=Math.sin(t*Math.PI*3)>0;for(const[x,y,col]of [[-49,-115,'#ff3525'],[49,-115,'#35ff55'],[-53,118,'#ff3525'],[53,118,'#35ff55'],[0,-197,'#ffffff'],[0,191,'#ffdc25']]){c.fillStyle=on?col:'#20262c';c.shadowColor=col;c.shadowBlur=on?15:0;c.beginPath();c.arc(x,y,3.5,0,Math.PI*2);c.fill()}c.restore()}
