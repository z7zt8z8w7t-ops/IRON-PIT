'use strict';
// Both fixture views use the same live match data and approved portrait assets.
function fixtureCard70(m,i,choose){
 const won=i<campaignCompleted(),current=i===campaignCompleted(),row=document.createElement(choose?'button':'article');
 row.className=(choose?'league-match ':'')+'fixture-card70'+(won?' won':'')+(current?' current':'');row.dataset.mission=i;
 if(choose){row.disabled=i>campaignCompleted();row.onclick=choose;}
 row.setAttribute('aria-label',m.round+', Rourke versus '+m.opponent+', '+(won?'won':current?'next match':'locked'));
 row.innerHTML='<div class="fixture-copy70"><small></small><strong></strong><div class="fixture-arena70"><canvas width="420" height="210"></canvas><span></span></div><div class="fixture-reward70"><img alt=""><span></span></div></div><div class="fixture-rivals70"></div><span class="fixture-state70"></span>';
 row.querySelector('small').textContent=m.round.replace('ROOKIE ','').replace('CHALLENGER ','');
 row.querySelector('strong').textContent='ROURKE vs '+m.opponent.toUpperCase().replace(' + ',' vs ');
 const arena=row.querySelector('.fixture-arena70'),preview=arena.querySelector('canvas');preview.dataset.fixtureArena=m.arena;preview.setAttribute('role','img');preview.setAttribute('aria-label',ARENA_VARIANTS[m.arena].label+' arena preview');arena.querySelector('span').textContent=ARENA_VARIANTS[m.arena].label.toUpperCase();drawFixtureArena85(preview);
 const reward=row.querySelector('.fixture-reward70');reward.querySelector('img').src='assets/'+m.reward+'.png';reward.querySelector('span').textContent='REWARD: '+m.rewardText.toUpperCase();
 row.querySelector('.fixture-state70').textContent=won?'WON':current?'NEXT MATCH':'LOCKED';
 const rivals=row.querySelector('.fixture-rivals70');for(const bot of m.bots){const id=bot.name==='BLAZE'?'rivet':bot.name.toLowerCase(),box=document.createElement('div');box.className='fixture-rival70';const portrait=document.createElement('img');portrait.src=pilotPortrait(id);portrait.alt=STORY_CAST[id]?.name||bot.name;const cv=document.createElement('canvas');cv.width=200;cv.height=200;cv.setAttribute('aria-label',bot.name+' fitted '+chassisProfile(bot.loadout).name);cv.dataset.fixtureMech=JSON.stringify(bot.loadout);const label=document.createElement('small');label.className='fixture-rival-name';label.textContent=bot.name;box.append(portrait,cv,label);rivals.append(box)}
 if(won){const cross=document.createElementNS('http://www.w3.org/2000/svg','svg');cross.setAttribute('viewBox','0 0 800 140');cross.setAttribute('preserveAspectRatio','none');cross.setAttribute('aria-hidden','true');cross.classList.add('fixture-cross');cross.innerHTML='<path d="M30 17 Q280 70 770 126 M765 15 Q425 63 34 125 M40 22 Q310 72 758 120 M752 24 Q390 85 42 117" />';row.append(cross)}return row;
}
const fixtureArenaArt85=new Image();fixtureArenaArt85.onload=()=>{for(const cv of document.querySelectorAll('[data-fixture-arena]'))drawFixtureArena85(cv)};// Retired atlas: all fixture previews use live rebuilt arena artwork.
const FIXTURE_ART_BOUNDS85={desert:[0,0,652,527],flooded:[665,0,647,527],night:[0,587,652,540],rotating:[665,587,647,540]};
function drawFixtureArena85(cv){const c=cv.getContext('2d'),kind=REBUILT_ALIASES[cv.dataset.fixtureArena]||cv.dataset.fixtureArena,v=REBUILT_ARENAS[kind];c.fillStyle='#09131a';c.fillRect(0,0,cv.width,cv.height);if(!v||!rebuiltAssetsReady)return;const ground=images[v.ground];c.drawImage(ground,0,0,cv.width,cv.height);if(kind==='rotor-pit'){c.save();c.scale(cv.width/1800,cv.height/2400);RotorPit.layout({x:0,y:0,width:1800,height:2400}).forEach((d,i)=>rebuiltDrawCog(c,{...d,angle:0},i));c.restore();}if(kind==='blackout'){c.fillStyle='#0008';c.fillRect(0,0,cv.width,cv.height);}if(kind==='mist'){c.globalAlpha=.25;c.drawImage(images['rebuilt-mist-cloud'],0,0,cv.width,cv.height);c.globalAlpha=1;} }
function drawFixtureMechs70(){if(!ready)return;for(const cv of document.querySelectorAll('[data-fixture-arena]'))drawFixtureArena85(cv);for(const cv of document.querySelectorAll('[data-fixture-mech]')){const c=cv.getContext('2d');c.clearRect(0,0,200,200);mech(c,100,105,.47,0,0,JSON.parse(cv.dataset.fixtureMech));}}
function populateFixtures70(list,choose=false){list.replaceChildren();for(let i=campaignMatches().length-1;i>=0;i--){const m=campaignMatches()[i];list.append(fixtureCard70(m,i,choose?()=>{campaignMission=i;showStoryDialogue(m.lines,prepareCampaignWorkshop,m)}:null));}drawFixtureMechs70();}
const oldRoster70=showLeagueFixturesTransmission;
showLeagueFixturesTransmission=function(done){oldRoster70(done);const list=node('storyBody').querySelector('.comms-fixtures');populateFixtures70(list);const count=document.createElement('div');count.className='fixture-total70';count.textContent=campaignCompleted()+' / '+campaignMatches().length+' VICTORIES';list.after(count);};
// Keep league switching from the existing league window.
const oldLadder70=showRookieLadder;
showRookieLadder=function(){
 oldLadder70();const body=node('storyBody'),list=body.querySelector('.rookie-ladder');if(!list)return;
 populateFixtures70(list,true);const links=body.querySelector('.league-links'),screen=storyScreen();
 screen.classList.remove('fixtures-screen');screen.classList.add('comms-screen');
 body.replaceChildren();const terminal=document.createElement('div');terminal.className='story-dialogue transmission';
 terminal.innerHTML='<div class="comms-window fixture-feed"><h2></h2></div><img class="comms-frame" src="assets/comms-frame-v68.png" alt=""><div class="story-actions"><button id="storyBack">BACK</button><button id="storySkip">SKIP</button><button id="storyNext" class="primary">NEXT →</button></div>';
 const window=terminal.querySelector('.fixture-feed');window.querySelector('h2').textContent=campaignLeagueName()+' FIXTURES';list.classList.add('comms-fixtures');window.append(list);
 const count=document.createElement('div');count.className='fixture-total70';count.textContent=campaignCompleted()+' / '+campaignMatches().length+' VICTORIES';window.append(count);if(links)window.append(links);body.append(terminal);
 node('storyBack').onclick=node('storySkip').onclick=exitCampaign;
 node('storyNext').onclick=()=>list.querySelector('[data-mission="'+Math.min(campaignCompleted(),campaignMatches().length-1)+'"]').click();
};
// Assets load before gameplay, but a newly opened roster can beat preload.
const fixtureReady70=setInterval(()=>{if(ready){drawFixtureMechs70();clearInterval(fixtureReady70)}},200);
