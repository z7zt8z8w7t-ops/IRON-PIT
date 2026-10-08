IRON PIT v28 — LOADOUT WEIGHT, UNLOCKS AND IPAD FIXES

Upload every file in Iron_Pit_v28_CHANGED_FILES.zip into the existing repository
root, overwriting files with the same names. Keep your existing assets and audio; upload the included new and updated audio files with the changed code.
After GitHub Pages finishes updating, open online and refresh. Check that the
builder, HUD and canvas say v28, then deploy. The new offline cache installs once
online. The assets/urban folder is no longer loaded or precached by v28 and may be
deleted once the v28 update has been uploaded successfully. Do not delete the other
assets or audio folders.

V28 UPDATE
Unloaded tank: 170 units/sec. Unloaded biped: 220 units/sec.
Weapon weight is summed across fitted slots; empty slots add zero. Tank penalty:
1.7 units/sec per weight unit, with a 100 units/sec floor. Biped penalty:
3 units/sec per weight unit, with a 110 units/sec floor. Turret speed is unchanged.
A one-machine-gun tank travels at 166.6; a one-machine-gun biped at 214 units/sec.
Biped movement now follows tank stick movement directly, including reversing,
without a turning circle. Feet stay in chassis coordinates and animate with travel.

Weight / victories to unlock:
Machine gun 2 / 0; tri-salvo 6 / 0; mines 4 / 0; rotary 5 / 1; flak 5 / 2;
swarm 6 / 3; pulse 4 / 4; smoke 3 / 5; plasma 8 / 6; flame 5 / 7;
siege 10 / 8; hunter 9 / 9; arc 6 / 10; railgun 9 / 12; barrage 10 / 14;
beam 8 / 16; EMP 7 / 18; mortar 8 / 20.
These are initial balancing figures. Damage, cooling and reload budgets unchanged.

Player One and Player Two victory counts persist separately on this device.
Solo victories count for Player One. A result is counted once; draws award none.
Wait for hostile in-flight rounds and pending ejections before recording the win.
Test mode on the start screen unlocks every weapon but awards no progression.
Saved locked equipment is removed during building; empty slots remain selectable.
No account or online sync: clearing browser/site data removes local progress.

Every build selector now uses an HTML-owned choice list, including modifiers.
Player Two's choices rotate with the build screen; native iPadOS menus are not used.
The eight recessed turret lights follow the armour outline on both chassis and
keep the existing health, repair, boot and self-destruct behaviours.
Matching standard control buttons, with a larger red eject button, apply to both
players. Phone layouts stack turret controls to keep labels and targets usable.
The shared test arena is now 2,640 x 1,800 units, with a wider stadium-shaped ring.
The monument stays circular, sprites keep their proportions, and the entire arena
remains visible. It fills the width at the portrait iPad aspect shown in your photo;
other viewport proportions are fitted without stretching or cropping.

TWO-PLAYER MODE
Start screen: choose Two players, using the iPad in portrait at opposite ends.
Player One builds and confirms. Player Two's entire build screen rotates 180 degrees,
then confirms to start. Each player has an independent loadout and modifiers.
The original black digital control panel is retained at each end; the upper panel
faces Player Two. Both movement sticks, turret buttons and weapons can be held
simultaneously with separate pointer capture. Player Two joystick drawing compensates for its rotated panel; physical stick
direction matches movement on the shared map. Pushing toward the centre drives forward.
No AI mechs in this mode. The original four-mech solo mode remains available.
The 2,640 x 1,800 fixed shared view includes four broad avenues, an outer ring,
rooftops in the building footprints, and a ruined central monument on a circular
plinth. The four separate square blocks have been removed. Roof edges and the
monument block movement and direct-fire projectiles; the ring stays connected.
Ground, roofs and monument are unique cached raster assets, not repeated tiles.
All scenery is fixed. Existing weapons, component damage, gait, shields, repair,
eject and delivery remain, with independent heat, cooldowns and audio per player.
Return to the start screen to build the next match. No automatic respawn.

WEAPON / MUSIC UPDATE
Gameplay music is 25% rather than 16%; menu music remains full volume.
Swarm missiles fan out onto six independent curved approaches, with individual
speeds and curve timing; they converge on a valid acquired target. Existing salvo
count, launch gaps, target lock, damage and screaming sounds are retained.
Every rocket/missile system produces a short plume at its actual launch tube,
plus wider, longer-lived soft-edged exhaust trails. Smoke and particles are capped;
smoke drawing reuses one loaded bitmap to keep the shared view efficient.

SOLO ARENA / MATCH
3,000 x 3,000 units, open 1,200-unit central circle, six radial avenues, and an
outer ring 450 units wide. Horizontal avenues are 675 units wide; diagonal ones
450 units. Blue streets/plaza, purple fixed building blocks, ochre central monument.
This is deliberately plain coloured-block artwork to test layout and clearances.
Three enemies: Breaker (rotary/siege/hunter), Volt (pulse/plasma/swarm),
Salvo (machine gun/tri-salvo/barrage). Every enemy targets any surviving rival,
including other enemies, navigates connected roads, traverses its turret, and fires
when aimed with line of sight. Reload and heat budgets match standard player weapons.
Enemies use energy shields when damaged. Two-thumb behaviour: movement OR one selected weapon system; a 0.3-second switch pause and 0.35-second recovery between bursts. Swarm/hunter acquisition occurs while stopped, with one second of lock time. Triggered salvos finish even when the bot later moves. Shield activation interrupts turret aiming for 0.5 seconds. Target changes have a 0.6-second reaction delay; firing requires 0.35 seconds of settled aim, with small aiming error. Weapon damage, reloads, heat and hull health are unchanged. All four mechs have component damage;
destroyed guns cannot fire, track/leg damage slows movement, turret loss stops fire.
No automatic respawn; the last survivor wins. Return to Mech Build and deploy to
start a new match. Enemy names and different minimap markers identify opponents.

CONTROLS
Left: chassis movement stick, weapon buttons immediately to its right.
Middle: mini-map in the control panel.
Right: shield to the left of turret turn buttons; Eject directly beneath shield.
Eject retains its 0.45-second hold.
Keyboard: WASD/arrows move, Q/E traverse, space/F/R weapons, hold X to eject.
Hold Slot 3 to lock swarm/hunter missiles, release to launch. Dense smoke breaks lock.
All three enemies carry different weapons and fight every other mech. Return to Mech Build and deploy to replace a lost mech.
Tank: 170 unloaded units/sec, reverse drive supported. Biped: 220 unloaded units/sec, existing stride
and direct movement. Weapon weight reduces both speeds. Turret: 75 degrees/sec. Arena zoom: 40%.

MOUNTS
Slot 1 left shoulder; Slot 2 right shoulder; Slot 3 raised on rear of turret.
Muzzles and component hit regions use the same mount geometry. Support rockets launch
forward over the turret. Mines deploy behind it.

WEAPONS / AUDIO
Systemkollaps by NickPanek: supplied full MP3, looping at volume 0.25 during battle.
One music player; full volume in the builder; pause on mute, defeat or background. Resume
when unmuted/re-entering/returning to the foreground. Cached for offline playback.
Music plays separately from spatial weapon/movement SFX.
MG is faster than rotary. Individual real recording excerpts replace ballistic,
rocket and missile launch sounds, with approved energy sounds and stronger bass.
Plasma charges for 0.3s before the projectile leaves its muzzle.
Tri-salvo: 3 rockets, 0.2s gaps. Swarm: 6 missiles, 0.1s gaps, slower corkscrew
and curved guidance, loud pitched firework whistles during flight, ending on impact.
Barrage: 5 rockets, 0.5s gaps, slightly varied launch pitches.
Thicker smoke trails. Five spinning baton mines: soft thuds, flight whooshes and an
arming beep on each landing. Flamethrower: concentrated turbulent jet widening at
its end, fire/smoke/lighting, approved sustained roar, stopping on release/overheat.
Beam and arc sounds also follow firing rather than repeatedly stacking full clips.
Larger soft-edged smoke screens drift, disperse and fade over 11 seconds.
No reverb added. Existing engine, hydraulic turret and biped movement sounds retained.
Sound source credits and licenses: audio/CREDITS.txt (also linked in the builder).

DESTRUCTION
Normal destruction: large lit fireball, shockwave, detailed parts thrown from tank
or biped, metal landings, burning wreck. Destroyed enemies remain eliminated until the next deployment.
Eject: immediate jet-powered canopy pod, detailed empty cockpit bay with fast red
strobes. Three-second ominous siren (no countdown numbers or beeps), 0.12-second
white pulse expanding/contracting and vaporising the abandoned mech, then fiery
shockwave and nuclear boom. Area damage: up to 1800 at the centre, tapering to zero
at 480 units. The escape pod is visual only; redeploy through Mech Build afterwards.

BALANCE — standard loadout, raw damage before armour / hit location
Slot 1: MG 9/bullet at .10s; rotary 15/shell at .12s; pulse 2x10 at .20s;
beam 120/sec; flame 120 direct/sec + 30/sec burn; arc 80/sec.
Slot 2: siege 2x130/3s; railgun 200/2.5s; plasma 100/.9s;
tri-salvo 3x45/2s; flak 5x18/1s (range falloff); EMP 40/8s plus disruption.
Slot 3: swarm 6x36/6s; hunter 4x90/9s; barrage 5x56/7s;
mines 5x66/10s; smoke 0/12s; cluster mortar 2x110/7s.
Each mortar divides its 110 damage budget among seven cluster impacts.
Reloads run from the first activation / launch, not the final rocket.
Hull baseline 700. Sustained DPS targets include cooling:
MG65, rotary75, pulse70, beam60, flame75, arc50, siege65, rail60,
plasma65, tri45, flak60; EMP5, swarm36, hunter40, barrage40, mines33, mortar31.
All ballistic and energy side weapons except EMP overheat independently.
Full heat lockout: MG/rotary/pulse/flak/beam/flame/arc 3.5s;
siege6s, rail5s, plasma4.731s, tri5s. Heat unlocks at 20%.
Released weapons cool after a .25s pause; cooldowns and mods still affect play.
Sustained hold-fire simulation was within 2.5% of standard target DPS.
Actual damage depends on accuracy, armour, component hit, splash and modifiers.


VALIDATION
Real asset Canvas rendering at phone resolution and whole-map overview; connected
spawn routes, full movement clearances, fixed wall/monument collisions, shot ownership,
player/enemy and enemy/enemy damage, shields, support guidance, delayed launch ownership,
heat, component disablement, elimination, redeployment, and a 120-second free-for-all
simulation. Existing mount/muzzle, launch timings, five mines, smoke, flame, heat,
eject, breakup and track/biped movement regressions passed. Offline harness checks
106 cached resources, version queries and old cache cleanup. ZIP integrity checked.
Two-minute simulation additionally checked no move-and-fire activation, no concurrent weapon activations, all three weapon slots used, shield aiming pause, and music mute/background/return lifecycle. Control DOM order and compact widths checked.
Not tested on a physical iPhone or live Safari/GitHub Pages deployment.

V26: eight-second twin-rotor delivery, lowered OH-58 sound, winch/landing/release effects, cockpit flicker and paired startup lamps. All actors wait until boot completes. Mute, backgrounding and returning to the builder stop deployment audio.

V26 complete update:
- 40% camera zoom, smoother wall-tangent sliding; blocked bipeds can steer out of walls.
- Black digital controls, Slot 1/2/3 names in controls/build menu, central radar and repair.
- Repair restores up to 150 hull over five seconds, two uses per deployment. Weapons and queued launches stop; destroyed parts are not restored.
- Eight turret lamps: paired boot, paired health loss from front to back per 25%, circular yellow repair chase and accelerating red self-destruct flashes.
- Reactor white pulse lasts 0.12 seconds; vaporisation at 3.03 seconds, fire/cloud detonation at 3.12 seconds. Larger visuals retain the existing 480-unit damage radius.
- Continuous turbulent overhead mushroom cloud, larger soft smoke and bass-enhanced detonation.
- Systemkollaps targets full volume in the menu and 16% in play, with a smooth transition. First touch enables audio on Safari.
- Sound mute, backgrounding, returning to the builder and redeploy stop the transport loop.

Validation: actual-sprite canvas rendering, deployment freeze/control release, repair limits and gun loss, movement clearance, weapon timing/heat, FFA behaviour, audio lifecycle and complete offline cache. Physical iPhone Safari and the live GitHub Pages deployment were not available for testing.

V27 VALIDATION
Automated native-canvas/DOM checks: sequential builds and upper-screen orientation;
simultaneous pointer input; independent movement, turret, heat, repair and shields;
ring clearances; roof/monument collision and direct-fire cover; human-on-human hits;
P2 eject and shared timers; match reset, solo return and background cleanup.
Audio banks, independent swarm paths and launch smoke verified. Existing 120-second
solo combat and weapon regressions passed. All 120 offline resources verified in the complete runtime.
Physical iPad multitouch and Safari layout/performance still need device testing.

V28 checks passed: speed/weight/floors, direct and reverse gait, rotated HTML choices,
locked equipment, separate profiles/single-count wins/test mode, rectangular arena
clearances, all lamp housings on opaque armour, independent controls/repair and
solo return. Native rendering checked. Physical iPad Safari still needs testing.
