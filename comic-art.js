'use strict';
// Blaze and Skitter pages have finished intro-matched borders and load unchanged.
// Finished opening and character pages load unchanged.
// These clean textures are also used by the page-turn mesh.
const comicArtworkCache=new Map();
const comicArtworkBounds={
};
function prepareComicArtwork(page){
 const original=page.originalSrc||page.src;page.originalSrc=original;
 if(!comicArtworkBounds[original])return Promise.resolve(page.src);
 if(comicArtworkCache.has(original))return comicArtworkCache.get(original);
 const pending=new Promise(resolve=>{
  const image=new Image();image.onload=()=>{
   try{
    const [x,y,w,h]=comicArtworkBounds[original],margin=22,cv=document.createElement('canvas');
    cv.width=1086;cv.height=1448;const c=cv.getContext('2d');
    c.fillStyle='#fff5dd';c.fillRect(0,0,cv.width,cv.height);
    const innerW=cv.width-margin*2,innerH=cv.height-margin*2,scale=Math.min(innerW/w,innerH/h),dw=w*scale,dh=h*scale;
    c.drawImage(image,x,y,w,h,(cv.width-dw)/2,(cv.height-dh)/2,dw,dh);
    c.strokeStyle='#111';c.lineWidth=5;c.strokeRect(margin+2.5,margin+2.5,innerW-5,innerH-5);
    page.src=cv.toDataURL('image/png')||original;resolve(page.src);
   }catch(error){console.warn('Comic artwork unavailable',original,error);resolve(original)}
  };image.onerror=()=>resolve(original);image.src=original;
 });comicArtworkCache.set(original,pending);return pending;
}
function preloadComicArtwork(pages){return Promise.all(pages.map(prepareComicArtwork))}
