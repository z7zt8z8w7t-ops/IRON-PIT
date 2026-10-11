'use strict';
let workshopLesson=null,workshopLessonRAF=0;
const WORKSHOP_LESSONS=[
 {target:'.preview',text:'Start with an empty build. Choose a chassis and fit your weapons; each selection will appear in the green schematic.',read:true},
 {target:'#tab-chassis',text:'First, choose your chassis. Armour keeps you alive, but weight slows you down.'},
 {target:'.chassis-card:not(:disabled)',text:'Pick a chassis. Watch the schematic and the stats change.'},
 {target:'#tab-weapons',text:'Now let’s fit some weapons.'},
 {target:'[data-mount-choice="left"]',text:'Choose a hardpoint. Each slot takes different equipment.'},
 {target:'.weapon-card[data-weapon]:not([data-weapon=""]):not(:disabled)',text:'Pick your main weapon. It’ll appear in the slot and on the schematic.'},
 {target:'[data-mount-choice="right"]',text:'Do the same for WPN 2. Choose a weapon for your second hardpoint.'},
 {target:'.weapon-card[data-weapon]:not([data-weapon=""]):not(:disabled)',text:'Fit your second weapon.'},
 {target:'[data-mount-choice="rear"]',text:'Now fit WPN 3. Your support system gives you another way to fight.'},
 {target:'.weapon-card[data-weapon]:not([data-weapon=""]):not(:disabled)',text:'Choose your support system.'},
 {target:'.workshop-metrics',text:'Check your speed and total weight. Bigger guns come with a price.',read:true},
 {target:'#deploy',text:'Happy with the loadout? Hit Deploy. Practice is over now, Rourke.'}
];
function enterGuidedWorkshop(){workshopAudioSession=true;prepareCampaignWorkshop();if(campaignLeague==='rookie'&&!rookieProgress.workshopTutorialSeen)startWorkshopTutorial()}
function clearWorkshopFocus(){for(const el of document.querySelectorAll('.workshop-tutorial-focus'))el.classList.remove('workshop-tutorial-focus')}
function endWorkshopTutorial(saved=true){if(!workshopLesson)return;workshopLesson=null;cancelAnimationFrame(workshopLessonRAF);clearWorkshopFocus();node('workshopLesson')?.remove();if(saved){rookieProgress.workshopTutorialSeen=true;saveRookie()}document.removeEventListener('click',workshopTutorialClick,true);if(!inArena)showPendingWeapon()}
function startWorkshopTutorial(){if(workshopLesson)endWorkshopTutorial(false);closeWorkshopWeapons();showWorkshopTab('chassis');workshopLesson={step:0};const box=document.createElement('aside');box.id='workshopLesson';box.setAttribute('role','dialog');box.setAttribute('aria-label','Dave’s workshop guide');box.innerHTML='<small>DAVE · WORKSHOP GUIDE</small><p></p><div><button class="lesson-skip">SKIP GUIDE</button><button class="lesson-next">NEXT →</button></div>';document.body.append(box);box.querySelector('.lesson-skip').onclick=()=>endWorkshopTutorial();box.querySelector('.lesson-next').onclick=advanceWorkshopLesson;document.addEventListener('click',workshopTutorialClick,true);showWorkshopLesson();workshopLessonRAF=requestAnimationFrame(positionWorkshopLesson)}
function advanceWorkshopLesson(){if(!workshopLesson)return;workshopLesson.step++;if(workshopLesson.step===WORKSHOP_LESSONS.length){endWorkshopTutorial();return}showWorkshopLesson()}
function showWorkshopLesson(){clearWorkshopFocus();const step=WORKSHOP_LESSONS[workshopLesson.step],box=node('workshopLesson');box.querySelector('small').textContent='DAVE · WORKSHOP GUIDE '+(workshopLesson.step+1)+' / '+WORKSHOP_LESSONS.length;box.querySelector('p').textContent='“'+step.text+'”';box.querySelector('.lesson-next').hidden=!step.read;if(step.read)box.querySelector('.lesson-next').classList.add('workshop-tutorial-focus');for(const target of document.querySelectorAll('#builder '+step.target))target.classList.add('workshop-tutorial-focus');const target=document.querySelector('#builder '+step.target);target?.scrollIntoView?.({block:'nearest',inline:'nearest',behavior:'smooth'});positionWorkshopLesson()}
function workshopTutorialClick(e){if(!workshopLesson)return;const step=WORKSHOP_LESSONS[workshopLesson.step],target=e.target.closest?.(step.target);if(e.target.closest?.('#workshopLesson'))return;
 // Deploy cannot jump out halfway through the lesson; the highlighted action remains usable.
 if(e.target.closest?.('#deploy')&&step.target!=='#deploy'){e.preventDefault();e.stopImmediatePropagation();return}
 if(step.read||!target||!node('builder').contains(target))return;
 if(step.target==='#deploy'){endWorkshopTutorial();return}
 // Let the selected control update the garage before moving the guide to its next target.
 setTimeout(()=>{if(workshopLesson&&target&&!target.disabled)advanceWorkshopLesson()},0);
}
function positionWorkshopLesson(){cancelAnimationFrame(workshopLessonRAF);if(!workshopLesson)return;const box=node('workshopLesson'),target=document.querySelector('#builder '+WORKSHOP_LESSONS[workshopLesson.step].target);if(!box||!target)return;const r=target.getBoundingClientRect(),bw=Math.min(360,window.innerWidth*.44),pad=14;box.style.width=bw+'px';const bh=box.getBoundingClientRect().height,top=pad+(window.visualViewport?.offsetTop||0),bottom=window.innerHeight-bh-pad;const options=[{x:pad,y:top},{x:window.innerWidth-bw-pad,y:top},{x:pad,y:bottom},{x:window.innerWidth-bw-pad,y:bottom}];const intersects=o=>Math.max(0,Math.min(o.x+bw,r.right)-Math.max(o.x,r.left))*Math.max(0,Math.min(o.y+bh,r.bottom)-Math.max(o.y,r.top));options.sort((a,b)=>intersects(a)-intersects(b));const best=options[0];box.style.left=best.x+'px';box.style.top=best.y+'px';workshopLessonRAF=requestAnimationFrame(positionWorkshopLesson)}
const lessonBack=node('buildBack').onclick;node('buildBack').onclick=()=>{endWorkshopTutorial(false);lessonBack()};
const lessonExit=exitCampaign;exitCampaign=function(){endWorkshopTutorial(false);lessonExit()};
const lessonPrepare=prepareCampaignWorkshop;prepareCampaignWorkshop=function(){lessonPrepare();if(!node('workshopGuideReplay')){const b=document.createElement('button');b.id='workshopGuideReplay';b.textContent='WORKSHOP GUIDE';b.onclick=startWorkshopTutorial;node('builder').querySelector('.actions').prepend(b)}node('workshopGuideReplay').hidden=!campaignActive};
