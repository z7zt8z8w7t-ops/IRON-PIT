'use strict';
function rookieWorkshop97(){return campaignActive&&campaignLeague==='rookie';}
function enforceRookieBuild97(){
 if(!rookieWorkshop97())return;
 if(build.chassis){build.chassis='tank-light';build.turret='turret';}
 build.colour='starter';
 for(const key of ['chassis','turret','colour'])if(node(key))node(key).value=build[key];node('paintChoice').value='starter';
}
function renderWorkshopPreview97(){
 const cv=node('assembly');if(!ready||!cv||node('builder').style.display==='none')return;
 const r=cv.getBoundingClientRect();if(r.width<1||r.height<1)return;
 const [c,w,h]=resize(cv);c.clearRect(0,0,w,h);drawWorkshopSchematic(c,w,h);
}
const refresh97=refreshWorkshop;
refreshWorkshop=function(){
 enforceRookieBuild97();refresh97();
 const rookie=rookieWorkshop97();
 for(const card of document.querySelectorAll('[data-chassis]')){card.hidden=rookie&&card.dataset.chassis!=='tank-light';card.disabled=card.hidden;}
 for(const option of node('chassis').options)option.disabled=rookie&&!!option.value&&option.value!=='tank-light';
 if(campaignActive)node('buildVersion').textContent=campaignLeagueName()+' · v97';
 renderWorkshopPreview97();
};
const update97=update;update=function(){enforceRookieBuild97();update97();};
const deploy97=node('deploy').onclick;node('deploy').onclick=()=>{enforceRookieBuild97();deploy97();};
// Redraw independently of combat frames after entering, resizing or restoring the app.
if(typeof ResizeObserver!=='undefined'){const previewObserver97=new ResizeObserver(renderWorkshopPreview97);previewObserver97.observe(node('builder').querySelector('.preview'));}
for(const event of ['resize','pageshow'])window.addEventListener(event,renderWorkshopPreview97);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)renderWorkshopPreview97();});
WORKSHOP_LESSONS[0].text='Start with an empty build. Choose a chassis and fit your weapons; each selection will appear on your Mech preview.';

// Existing portrait consumers use these originals too, including fixtures and comms.
const portrait97=portraitFor,pilot97=pilotPortrait;
function blazePortrait97(mood){return 'assets/blaze-'+(mood==='win'?'win':mood==='loss'?'loss':'standard')+'-v97.png';}
let kaneOutfit97='corporate';
portraitFor=function(who,mood='focused'){
 if(who==='rivet'||who==='blaze')return blazePortrait97(mood);
 if((who==='hudson'||who==='kane')&&kaneOutfit97==='alternate')return 'assets/kane-alternate-front-v97.png';
 return portrait97(who,mood);
};
pilotPortrait=function(who,mood='focused'){return who==='rivet'?blazePortrait97(mood):pilot97(who,mood);};
for(const img of document.querySelectorAll('[data-pilot="rivet"] img'))img.src=blazePortrait97('focused');
for(let i=0;i<BLAZE_INTERLUDE_PAGES.length;i++)BLAZE_INTERLUDE_PAGES[i].src='assets/blaze-interlude-'+(i+1)+'-v97.png';
BLAZE_INTERLUDE_PAGES[0].alt='Some hours later. Blaze, wearing her battered black flame jacket and torn fishnets, sits at a run-down bar. A comms device sits on the counter.';
preloadComicArtwork(BLAZE_INTERLUDE_PAGES);
// A reversible outfit choice leaves the corporate portrait as the default.
const dialogue97=showStoryDialogue;
showStoryDialogue=function(lines,done,mission,mood={}){
 dialogue97(lines,done,mission,mood);
 const terminal=node('storyBody').querySelector('.transmission');if(!terminal)return;
 const select=document.createElement('select');select.className='kane-outfit97';select.setAttribute('aria-label','Dr Kane outfit');
 for(const [value,label] of [['corporate','Corporate outfit'],['alternate','Alternate outfit']]){const option=document.createElement('option');option.value=value;option.textContent=label;select.append(option);}select.value=kaneOutfit97;
 const sync=()=>{const remote=terminal.dataset.remote||lines.find(([who])=>who!=='jim'&&who!=='rourke')?.[0];select.hidden=remote!=='hudson';if(remote==='hudson')node('storyPortrait').src=portraitFor('hudson',mood.hudson||'focused');terminal.classList.toggle('kane-alternate97',remote==='hudson'&&kaneOutfit97==='alternate');};
 select.onchange=()=>{kaneOutfit97=select.value;sync();};terminal.append(select);sync();
 const observer=new MutationObserver(sync);observer.observe(terminal,{attributes:true,attributeFilter:['data-remote']});
};
