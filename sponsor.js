'use strict';
// Rookie sponsorship is a saved story event, independent of Quick Battle.
STORY_CAST.hudson={name:'Dr Hudson',role:'CORPORATE SPONSOR'};
const hudsonPortrait=portraitFor;
portraitFor=function(who,mood){return who==='hudson'?'assets/story-hudson.png':hudsonPortrait(who,mood)};
const SPONSOR_BRIEF={title:'The Sponsor',round:'ROOKIE CHAMPION',arena:'desert',brief:'Sponsorship secured · Contender League entry earned'};
const SPONSOR_LINES=[
 ['hudson','I’m backing you, Jim. When the time comes, I’ll expect you to back me.']
];
function showSponsorIntroduction(){
 showStoryDialogue(SPONSOR_LINES,()=>{
  rookieProgress.sponsorSeen=true;
  saveRookie();
  showRookieLadder();
 },SPONSOR_BRIEF);
}
const sponsorLadder=showRookieLadder;
showRookieLadder=function(){
 if(rookieProgress.completed===5&&!rookieProgress.sponsorSeen){showSponsorIntroduction();return}
 sponsorLadder();
 if(rookieProgress.completed!==5)return;
 const card=document.createElement('button');card.className='sponsor-card';
 const portrait=document.createElement('img');portrait.src=portraitFor('hudson');portrait.alt='Dr Hudson';
 const copy=document.createElement('span');
 const label=document.createElement('small');label.textContent='SPONSORSHIP SECURED';
 const name=document.createElement('strong');name.textContent='DR HUDSON';
 const action=document.createElement('span');action.textContent='REPLAY TRANSMISSION →';
 copy.append(label,name,action);card.append(portrait,copy);
 card.onclick=showSponsorIntroduction;
 node('storyBody').querySelector('.league-intro').after(card);
};
