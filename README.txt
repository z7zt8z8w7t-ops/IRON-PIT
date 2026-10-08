IRON PIT v24 — RADIAL FREE-FOR-ALL LAYOUT TEST

Upload every file in Iron_Pit_v24_CHANGED_FILES.zip into the existing repository
root, overwriting files with the same names. All mech assets/audio remain unchanged.
After GitHub Pages finishes updating, open online and refresh. Check that the
builder, HUD and canvas say v24, then deploy. The new offline cache installs once
online. The assets/urban folder is no longer loaded or precached by v24 and may be
deleted once the v24 update has been uploaded successfully. Do not delete the other
assets or audio folders. FULL_BUILD contains the complete runtime without urban art.

ARENA / MATCH
3,000 x 3,000 units, open 1,200-unit central circle, six radial avenues, and an
outer ring 450 units wide. Horizontal avenues are 675 units wide; diagonal ones
450 units. Blue streets/plaza, purple fixed building blocks, ochre central monument.
This is deliberately plain coloured-block artwork to test layout and clearances.
Three enemies: Breaker (rotary/siege/hunter), Volt (pulse/plasma/swarm),
Salvo (machine gun/tri-salvo/barrage). Every enemy targets any surviving rival,
including other enemies, navigates connected roads, traverses its turret, and fires
when aimed with line of sight. Reload and heat budgets match standard player weapons.
Enemies use energy shields when damaged. All four mechs have component damage;
destroyed guns cannot fire, track/leg damage slows movement, turret loss stops fire.
No automatic respawn; the last survivor wins. Return to Mech Build and deploy to
start a new match. Enemy names and different minimap markers identify opponents.

CONTROLS
Left: chassis movement, shield immediately to its right.
Middle: large red Eject (hold for 0.45 seconds).
Right: turret left/right buttons, weapon buttons to their right.
Keyboard: WASD/arrows move, Q/E traverse, space/F/R weapons, hold X to eject.
Hold Support to lock swarm/hunter missiles, release to launch. Dense smoke breaks lock.
All three enemies carry different weapons and fight every other mech. Return to Mech Build and deploy to replace a lost mech.
Tank: 130 units/sec, reverse drive supported. Biped: 160 units/sec, existing stride
and turning preserved. Turret: 75 degrees/sec. Arena zoom: 50%.

MOUNTS
Primary left shoulder; secondary right shoulder; support raised on rear of turret.
Muzzles and component hit regions use the same mount geometry. Support rockets launch
forward over the turret. Mines deploy behind it.

WEAPONS / AUDIO
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
strobes. Three-second ominous siren (no countdown numbers or beeps), 0.25-second
white pulse expanding/contracting and vaporising the abandoned mech, then fiery
shockwave and nuclear boom. Area damage: up to 1800 at the centre, tapering to zero
at 480 units. The escape pod is visual only; redeploy through Mech Build afterwards.

BALANCE — standard loadout, raw damage before armour / hit location
Primary: MG 9/bullet at .10s; rotary 15/shell at .12s; pulse 2x10 at .20s;
beam 120/sec; flame 120 direct/sec + 30/sec burn; arc 80/sec.
Secondary: siege 2x130/3s; railgun 200/2.5s; plasma 100/.9s;
tri-salvo 3x45/2s; flak 5x18/1s (range falloff); EMP 40/8s plus disruption.
Support: swarm 6x36/6s; hunter 4x90/9s; barrage 5x56/7s;
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
105 cached resources, version queries and old cache cleanup. ZIP integrity checked.
Not tested on a physical iPhone or live Safari/GitHub Pages deployment.
