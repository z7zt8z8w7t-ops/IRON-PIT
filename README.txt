IRON PIT v45 — PILOT TRAINING / ANIME STORY CAST

CHANGED-FILES UPDATE OVER v44
Extract this ZIP and upload every included file into your existing GitHub
repository root. Preserve assets/ and audio/ folders and all existing files
not included here. Do not delete the previous build. Load online fully until
v45 is visible, then reopen the installed PWA offline. Existing local campaign
progress, equipment, paint and Quick Battle wins are retained.

CONTROL FIX
Each held control owns its pointer. An unrelated finger cannot release it.
Pointer cancellation, lost capture and global pointer-up release the owner.
Blur, hidden page, resize, deployment, rematch and menu changes clear held
inputs, turret turns, weapon loops, locks, eject presses and the stick graphic.
Both shared-iPad players have separate pointer ownership and input states.

PILOT TRAINING
Available on Mission Select and offered before the first Rookie qualifier.
Dave guides actual driving checkpoints, turret alignment, WPN 1 and WPN 2
hits, the five-mine volley, shield absorption, five-second repair, a forcefield
warning and escape to a safe area, an easy duel, then manual ejection.
The relevant controls pulse. Lessons advance on actions, not a timed slideshow.
Unrelated systems remain offline until their drill. Skip or replay at any time.
Training awards no wins or equipment and restores the prior loadout and mode.

TRANSMISSIONS AND EQUIPMENT
Every briefing/result uses quoted dialogue, an incoming communications tone,
scanlines, a signal transition and a short closing animation. Consecutive lines
from one character keep their connection. NEXT/CONTINUE, the current Rookie
match, DEPLOY and report actions pulse; BACK and SKIP remain steady.
New weapons trigger Dave's transmission inside the Workshop, with a thumbnail,
strengths, drawbacks, hardpoint, weight and the selected chassis' speed penalty.
FIT WEAPON opens the appropriate carousel and highlights the new weapon; it
does not silently change the loadout. LATER acknowledges the transmission.
Unlocked weapon cards have a BRIEFING button to revisit the overview.
Campaign and Quick Battle equipment events are independently saved. Unseen
new rewards remain pending until the Workshop; existing v44 unlocks remain
available and can be reviewed through BRIEFING without a duplicate reward.

ANIME CAST
Jim, Dave, Rivet, Skitter and Bastion now use illustrated anime portraits based
on the approved photo references. Rival and pilot result portraits show smug
wins or lightly bruised, determined losses. Dave remains uninjured, looking
proud after wins or encouraging after losses, with progressively more oil as
repairs accumulate. The previous Skitter game portrait is replaced at the same
asset path. Original uploaded reference photos are not deleted.
Mechs, arenas and weapon artwork retain their realistic style.

VICTORY AND AFTER-ACTION REPORT
The control panel shuts down fully before results appear. A win uses the normal
shutdown; a loss retains glitches and screen tearing. The report fills the
controller area with actual projectile hit accuracy against mechs (including
shield contact), health damage dealt/taken, kills, battle duration, remaining
health and the favourite weapon by accumulated firing activity. Utility/beam
systems contribute damage and use time, but do not invent a bullet accuracy.
These figures are actual match events, not the Workshop TTK estimate.
A large pulsing NEXT BATTLE continues Rookie dialogue into the next Workshop.
The final goes to Championship Results on the completed ladder. Losses offer
Workshop or Retry; Quick Battle and shared-iPad matches return to the Workshop.
The winner receives a survivor spotlight, green/white perimeter lighting,
crowd eruption, existing announcer/victory audio, fireworks and short cosmetic
perimeter flame bursts. Weapon systems deactivate immediately on match end.

MUSIC
Menu music is attempted when the splash screen boots. iPadOS may require the
first touch before audio playback; any first gesture retries it. No music plays
during gameplay. Sound on/off is respected.

UNCHANGED
All six chassis classes, two available paints, weapon stats/weight/heat/reload,
15-second forcefield changes with five-second warnings, normal and nuclear
parachute escapes, stadiums, control geometry and existing gameplay modes.
The next championship league is not implemented in this update.

VERIFICATION
JavaScript syntax and boot with native canvas assets; pointer ownership,
global release/cancel, blur, rematch and both shared-iPad inputs; real training
bullets/rockets/shield collision simulation; all ten tutorial drills and skip /
replay / no-reward isolation; all five campaign matches, result portraits,
quoted transmissions, pending rewards, fit-carousels and save/reload; report
accuracy/actual health damage/shutdown timing; Quick Battle reward isolation;
Smart Gun firing and spin-down; all Quick Battle modes and Weapon Test range.
Every offline cache URL exists. Changed-file archive applied to a fresh v44
baseline and verified against the complete v45 tree.
These are headless runtime/native-canvas checks, not Safari touch or CSS-layout
tests. Please verify the installed PWA's exact layout and multitouch on iPad.
