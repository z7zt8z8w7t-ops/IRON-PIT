IRON PIT v20 — LOCKED WEAPON / EFFECTS BATCH

Upload every file in Iron_Pit_v20_CHANGED_FILES.zip into the existing repository root,
preserving audio/ folders. Merge/overwrite those folders, do not delete unchanged files.
The zip contains only new or changed files relative to v19. Existing detailed mech
assets and the icon remain in place. After upload completes and GitHub Pages builds,
refresh Safari once. The build screen and arena should both say v20. The new offline
cache includes the sounds and the combat effects file. Later cache changes can reload
an already controlled tab automatically.

CONTROLS
Left: chassis movement, shield immediately to its right.
Middle: large red Eject (hold for 0.45 seconds).
Right: turret left/right buttons, weapon buttons to their right.
Keyboard: WASD/arrows move, Q/E traverse, space/F/R weapons, hold X to eject.
Hold Support to lock swarm/hunter missiles, release to launch. Dense smoke breaks lock.
Enemy has weapons but does not fire. Return to Mech Build and deploy to replace a lost mech.
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
or biped, metal landings, burning wreck. Enemy respawns after 8s.
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
JavaScript syntax; native Canvas renders for both chassis, flame, smoke, mines,
empty cockpit and blast stages; salvo timing/muzzles; plasma delay; heat/recovery
for all 11 heated weapons; exact mine launch/arming counts; smoke lock/expiry;
normal breakup and eject vaporisation; damage simulation; WebAudio loop cleanup,
mute/background and remaining-siren resume; asset/precache and ZIP integrity.
Not tested on a physical iPhone/iPad or a live Safari/GitHub Pages deployment.
