'use strict';
// Rookie sponsorship is a saved story event, independent of Quick Battle.
STORY_CAST.hudson={name:'Dr Hudson',role:'CORPORATE SPONSOR'};
const hudsonPortrait=portraitFor;
portraitFor=function(who,mood){return who==='hudson'?(mood==='win'?'assets/story-hudson-win.png':'assets/story-hudson.png'):hudsonPortrait(who,mood)};
const SPONSOR_BRIEF={title:'The Sponsor',round:'ROOKIE CHAMPION',arena:'desert',brief:'Sponsorship secured · Contender League entry earned'};
const SPONSOR_LINES=[
 ['hudson','Hello, it’s good to finally meet. I’ve been watching your performance, and let’s just say I’m very interested. When the time comes, I’ll expect you to return that interest.']
];
function showSponsorIntroduction(){
 showStoryDialogue(SPONSOR_LINES,()=>{
  rookieProgress.sponsorSeen=true;
  saveRookie();
  showRookieLadder();
 },SPONSOR_BRIEF,{hudson:'win'});
}
const OPENING_LINES=[["dave", "You’ve spent half your life fixing these things for other people. About time you drove one."], ["jim", "Most of the ones I fix haven’t got someone shooting at them."], ["dave", "Give it time."], ["jim", "You really think we can compete with the sponsored teams?"], ["dave", "Their machines cost more. Doesn’t mean their pilots are better."], ["jim", "And if we lose?"], ["dave", "Then we’re walking home."]];
function showOpeningBackstory(){showStoryDialogue(OPENING_LINES,()=>{rookieProgress.introSeen=true;saveRookie();showRookieLadder()},{title:'One Chance',round:'THE BEGINNING',arena:'desert',brief:'Dave reveals a fighting mech assembled from salvaged parts. One entry fee. One chance.'})}
const sponsorLadder=showRookieLadder;
showRookieLadder=function(){
 if(rookieProgress.completed===0&&!rookieProgress.introSeen){showOpeningBackstory();return}
 if(rookieProgress.completed===5&&!rookieProgress.sponsorSeen){showSponsorIntroduction();return}
 sponsorLadder();
 const replay=document.createElement('button');replay.textContent='REPLAY BACKSTORY';replay.onclick=showOpeningBackstory;node('storyBody').append(replay);
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
