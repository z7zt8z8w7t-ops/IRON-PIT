(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.IronPitGrinders=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 // Shared with the renderer: one 600-unit tile, two 300-unit sliding covers.
 class Controller{
  constructor(rng=Math.random){this.rng=rng;this.reset();}
  reset(){this.tiles=[];this.pending=null;this.age=0;this.wait=8+this.rng()*5;}
  step(dt){
   if(!Number.isFinite(dt)||dt<0)throw new RangeError('Invalid time step');
   while(dt>0){
    const limit=this.pending?(this.pending.phase==='warning'?3:1.6):this.wait;
    const amount=Math.min(dt,Math.max(0,limit-this.age));this.age+=amount;dt-=amount;
    if(this.pending)this.pending.age=this.age;
    if(this.age+1e-9<limit)break;
    this.age=0;
    if(!this.pending){
     const available=Array.from({length:12},(_,i)=>i).filter(i=>!this.tiles.some(t=>t.cell===i));
     if(!available.length){this.wait=Infinity;break;}
     this.pending={cell:available[Math.min(available.length-1,Math.floor(this.rng()*available.length))],phase:'warning',age:0};this.tiles.push(this.pending);
    }else if(this.pending.phase==='warning'){this.pending.phase='opening';this.pending.age=0;}
    else{this.pending.phase='open';this.pending.age=1.6;this.pending=null;this.wait=8+this.rng()*6;}
   }
  }
  warning(){const t=this.pending;if(!t||t.phase!=='warning')return null;const red=t.age>=1.8;return{cell:t.cell,red,lit:Math.floor((red?t.age-1.8:t.age)*(red?12:4))%2===0};}
  opening(tile){if(tile.phase==='warning')return 0;if(tile.phase==='open')return 1;const v=Math.min(1,tile.age/1.6);return v*v*(3-2*v);}
  catches(x,y,r=0){return this.tiles.find(t=>{const u=this.opening(t);if(u<=0)return false;const cx=(t.cell%3)*600+300,top=Math.floor(t.cell/3)*600+30,half=u*280;return x-r<cx+half&&x+r>cx-half&&y+r>top&&y-r<top+540;});}
 }
 return{Controller};
});
