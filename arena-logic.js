(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ArenaLogic=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const WIDTH=1800,HEIGHT=2400,CELL=600;
 function nodes(rotor=false){const out=[];for(let row=0;row<=4;row++)for(let col=0;col<=3;col++){if(rotor&&row===2&&(col===1||col===2))continue;out.push({x:col*CELL,y:row*CELL,col,row,id:col+':'+row});}return out;}
 function cellAt(x,y){if(x<0||y<0||x>=WIDTH||y>=HEIGHT)return -1;return Math.floor(y/CELL)*3+Math.floor(x/CELL);}
 function bounds(cell){return{x:(cell%3)*CELL,y:Math.floor(cell/3)*CELL,w:CELL,h:CELL};}
 function corners(cell){const b=bounds(cell);return[{x:b.x,y:b.y},{x:b.x+CELL,y:b.y},{x:b.x,y:b.y+CELL},{x:b.x+CELL,y:b.y+CELL}];}
 function jets(){const out=[];for(const n of nodes()){const edge=n.col===0||n.col===3||n.row===0||n.row===4,corner=(n.col===0||n.col===3)&&(n.row===0||n.row===4);if(!edge||corner)continue;const a=n.col===0?Math.PI/2:n.col===3?-Math.PI/2:n.row===0?Math.PI:0;out.push({...n,a,x:n.x+Math.sin(a)*72,y:n.y-Math.cos(a)*72,nodeX:n.x,nodeY:n.y,age:-1,duration:1});}return out;}
 class Hazard{
  constructor(kind,rng=Math.random){this.kind=kind;this.rng=rng;this.last=-1;this.reset();}
  reset(){this.phase='waiting';this.age=0;this.cell=-1;this.wait=4+this.rng()*6;}
  get duration(){return this.kind==='foundry'?2.45:2.4;}
  step(dt){if(!Number.isFinite(dt)||dt<0)throw new RangeError('Invalid time step');const events=[];while(dt>0){const limit=this.phase==='waiting'?this.wait:this.phase==='warning'?2.2:this.duration;const amount=Math.min(dt,Math.max(0,limit-this.age));this.age+=amount;dt-=amount;if(this.age+1e-9<limit)break;this.age=0;if(this.phase==='waiting'){let cell=Math.floor(this.rng()*11);if(cell>=this.last&&this.last>=0)cell++;if(this.last<0)cell=Math.floor(this.rng()*12);this.cell=cell;this.last=cell;this.phase='warning';}else if(this.phase==='warning')this.phase='active';else{this.phase='waiting';this.cell=-1;this.wait=4+this.rng()*7;}events.push({phase:this.phase,cell:this.cell});}return events;}
  warning(){if(this.phase!=='warning')return null;const red=this.age>=1.35,t=red?this.age-1.35:this.age;return{red,lit:Math.floor(t*(red?12:4.6))%2===0};}
  heat(){if(this.phase!=='active'||this.kind!=='foundry')return 0;const v=Math.max(0,Math.min(1,this.age/.55,(this.duration-this.age)/.30));return v*v*(3-2*v);}
 }
 function edges(rotor=false){const out=[],ns=nodes(rotor),edge=n=>n.col===0||n.col===3||n.row===0||n.row===4;for(const a of ns)for(const b of ns){if(a.id>=b.id||edge(a)&&edge(b))continue;if(a.x!==b.x&&a.y!==b.y)continue;if(ns.some(n=>n!==a&&n!==b&&(a.x===b.x?n.x===a.x&&n.y>Math.min(a.y,b.y)&&n.y<Math.max(a.y,b.y):n.y===a.y&&n.x>Math.min(a.x,b.x)&&n.x<Math.max(a.x,b.x))))continue;const vertical=a.x===b.x;out.push({key:a.id+'-'+b.id,a,b,x:Math.min(a.x,b.x)-(vertical?9:0),y:Math.min(a.y,b.y)-(vertical?0:9),w:vertical?18:Math.abs(b.x-a.x),h:vertical?Math.abs(b.y-a.y):18});}return out;}
 return{WIDTH,HEIGHT,CELL,nodes,cellAt,bounds,corners,jets,edges,Hazard};
});
