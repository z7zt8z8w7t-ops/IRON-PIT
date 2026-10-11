 'use strict';
// A bent paper mesh starts at the bottom-right corner and rolls diagonally up.
function turnComicPage(art,frontSrc,nextSrc,done){
 const cv=document.createElement('canvas');cv.className='comic-curl-canvas';cv.setAttribute('aria-hidden','true');cv.width=540;cv.height=Math.round(540*(art.clientHeight||720)/(art.clientWidth||540));art.append(cv);
 const c=cv.getContext('2d'),W=cv.width,H=cv.height,nx=.8,ny=.6,D=nx*W+ny*H;
 let cancelled=false,raf=0;const pages=[frontSrc,nextSrc].map(src=>{const im=new Image();im.src=src;return im});
 function page(im){c.fillStyle='#fff5dd';c.fillRect(0,0,W,H);const k=Math.min(W/im.naturalWidth,H/im.naturalHeight),w=im.naturalWidth*k,h=im.naturalHeight*k;c.drawImage(im,(W-w)/2,(H-h)/2,w,h)}
function transform(x,y,t){const fold=D*(1-t),u=nx*x+ny*y,v=-ny*x+nx*y,r=18+48*Math.sin(Math.PI*Math.min(1,t)),d=u-fold;if(d<=0)return{x,y,z:0,back:false};const theta=Math.min(Math.PI,d/r),q=d>Math.PI*r?fold-(d-Math.PI*r):fold+r*Math.sin(theta),z=d>Math.PI*r?2*r:r*(1-Math.cos(theta));return{x:nx*q-ny*v-z*.16,y:ny*q+nx*v-z*.27,z,back:theta>Math.PI/2,shade:.75+.25*Math.abs(Math.cos(theta))}}
const front=document.createElement('canvas');front.width=W;front.height=H;const fc=front.getContext('2d');
function textureTriangle(a,b,d,A,B,C,back,shade){
 c.save();c.beginPath();c.moveTo(A.x,A.y);c.lineTo(B.x,B.y);c.lineTo(C.x,C.y);c.closePath();c.clip();
 if(back){c.fillStyle='#f0e3c6';c.fillRect(-W,-H,W*3,H*3)}else{
 const det=a.x*(b.y-d.y)+b.x*(d.y-a.y)+d.x*(a.y-b.y);
 if(Math.abs(det)<.01){c.restore();return}
 const xx=(A.x*(b.y-d.y)+B.x*(d.y-a.y)+C.x*(a.y-b.y))/det,xy=(A.y*(b.y-d.y)+B.y*(d.y-a.y)+C.y*(a.y-b.y))/det;
 const yx=(A.x*(d.x-b.x)+B.x*(a.x-d.x)+C.x*(b.x-a.x))/det,yy=(A.y*(d.x-b.x)+B.y*(a.x-d.x)+C.y*(b.x-a.x))/det;
 const tx=A.x-xx*a.x-yx*a.y,ty=A.y-xy*a.x-yy*a.y;
 c.transform(xx,xy,yx,yy,tx,ty);c.drawImage(front,0,0);c.setTransform(1,0,0,1,0,0);
 }
 c.fillStyle='rgba(0,0,0,'+(1-shade)*.4+')';c.fillRect(-W,-H,W*3,H*3);c.restore();
}
function render(t){
 page(pages[1]);const rows=28,cols=20,tri=[];
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
 const a={x:x*W/cols,y:y*H/rows},b={x:(x+1)*W/cols,y:y*H/rows},d={x:x*W/cols,y:(y+1)*H/rows},e={x:(x+1)*W/cols,y:(y+1)*H/rows};
 for(const vertices of [[a,b,d],[b,e,d]]){const p=vertices.map(v=>transform(v.x,v.y,t));tri.push({v:vertices,p,z:p.reduce((s,v)=>s+v.z,0)/3})}
 }
 // Fold shadow travels diagonally with the lifted corner.
 const fold=D*(1-t);c.save();c.strokeStyle='#0004';c.lineWidth=18;c.filter='blur(10px)';c.beginPath();c.moveTo((fold-ny*H)/nx,H);c.lineTo(W,(fold-nx*W)/ny);c.stroke();c.restore();
 tri.sort((a,b)=>a.z-b.z);for(const q of tri){textureTriangle(...q.v,...q.p,q.p[1].back,q.p[1].shade??1)}
}

 function finish(){if(cancelled)return;cancelled=true;cancelAnimationFrame(raf);cv.remove();done()}
 function start(){if(cancelled)return;if(!c||matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return}
  page(pages[0]);fc.drawImage(cv,0,0);const begin=performance.now();
  function tick(now){if(cancelled)return;const u=Math.min(1,(now-begin)/1800);render(u*u*(3-2*u)*1.35);if(u<1)raf=requestAnimationFrame(tick);else finish()}raf=requestAnimationFrame(tick);
 }
 Promise.all(pages.map(im=>new Promise((resolve,reject)=>{if(im.complete&&im.naturalWidth)resolve();else{im.onload=resolve;im.onerror=reject}}))).then(start,finish);
 return()=>{cancelled=true;cancelAnimationFrame(raf);cv.remove()};
}
