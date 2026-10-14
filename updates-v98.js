'use strict';
// Show the approved opening victory page before the existing sponsor scene.
const sponsorIntroduction98=showSponsorIntroduction;
showSponsorIntroduction=function(){
 hideGameMenus();
 const screen=storyScreen();screen.hidden=false;screen.classList.remove('fixtures-screen');
 const body=node('storyBody');body.replaceChildren();
 const page=document.createElement('section');page.className='rookie-winner98';
 const art=document.createElement('img');art.src='assets/rookie-winner-1-v98.png';art.alt='Rourke celebrates on his battered tank as a helicopter lifts it above the cheering Iron Pit crowd. Fireworks surround a giant WINNER screen.';
 const actions=document.createElement('div');actions.className='story-actions';
 const next=document.createElement('button');next.className='primary';next.textContent='NEXT →';
 next.onclick=()=>{next.disabled=true;sponsorIntroduction98();};
 actions.append(next);page.append(art,actions);body.append(page);
 screen.querySelector('header h1').textContent='ROOKIE CHAMPION';
};
