'use strict';
// Render only approved artwork, never the preview's printed navigation strip.
// These clean textures are also used by the page-turn mesh.
const comicArtworkCache=new Map();
const comicArtworkBounds={
 'assets/blaze-interlude-1.png':[16,8,1054,1362],
 'assets/blaze-interlude-2.png':[18,14,1050,1348],
 'assets/blaze-interlude-3.png':[19,14,1048,1348],
 'assets/blaze-interlude-4.png':[19,14,1048,1348],
 'assets/skitter-interlude-1.png':[21,18,982,1468],
 'assets/skitter-interlude-2.png':[17,7,990,1480],
 'assets/skitter-interlude-3.png':[18,14,1050,1350],
 'assets/issue-2-cover.jpg':[0,0,1086,1448],
 'assets/issue-2-1.jpg':[11,10,1064,1428],
 'assets/issue-2-2.jpg':[8,7,1070,1432],
 'assets/issue-2-3.jpg':[17,7,1052,1431],
 'assets/skitter-tower.png':[19,18,986,1499]
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
    if(original==='assets/blaze-interlude-1.png'){
     c.fillStyle='#fff5dd';c.fillRect(margin+22,margin+22,430,77);
     c.strokeStyle='#111';c.lineWidth=5;c.strokeRect(margin+22,margin+22,430,77);
     c.fillStyle='#111';c.font='bold 37px "Chalkboard SE", "Comic Sans MS", sans-serif';
     c.textBaseline='middle';c.fillText('SOME HOURS LATER',margin+39,margin+61,397);
    }
    page.src=cv.toDataURL('image/png')||original;resolve(page.src);
   }catch(error){console.warn('Comic artwork unavailable',original,error);resolve(original)}
  };image.onerror=()=>resolve(original);image.src=original;
 });comicArtworkCache.set(original,pending);return pending;
}
function preloadComicArtwork(pages){return Promise.all(pages.map(prepareComicArtwork))}
