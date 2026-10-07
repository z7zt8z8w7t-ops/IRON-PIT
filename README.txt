IRON PIT — MECH BUILD / WEAPON EFFECTS v18

Upload the COMPLETE contents to your GitHub Pages repository root, including
audio.js, enemy.js, weapons.js, the audio folder and the assets folder. This replaces earlier builds. Open once online before
offline play; Add to Home Screen on iPad. Service-worker cache updated to v18.

Driving movement unchanged: 260 world units/second, same joystick and zoom.
Turret: hold left/right buttons, 75 degrees/second; release holds direction.
Primary fires left mount; Secondary fires right mount; Support fires rear pod.
Keyboard: WASD/arrows move, Q/E traverse, Space/F/R fire the three slots.
Shield button remains beside movement controls.

12 side weapons, 6 support systems, green-white and rust-red/white chassis/turret schemes.
Each weapon has sprite-relative muzzle points, transformed with mount flip,
mech scale and turret rotation. Twin siege and pulse weapons fire both ports;
tri-salvo fires all three, rotary cycles barrel ports, rear launchers use
multiple pod ports. Rear weapons are on top of rear turret roof.

Weapon-specific rounds/tracers, muzzle flashes, shell ejection, rocket exhaust
and smoke, guided hunter missiles, plasma trails, laser pulses/sustained beam,
short-range flame, branching arc and EMP rings. Mortar airburst produces spread
of impact bursts; mines deploy behind and trigger near targets or the player
once armed; smoke canisters deploy behind and produce lingering clouds.
Impacts use generated texture atlas plus animated particles: sparks, debris,
explosions, plasma splash, fire, scorch decals, EMP and shield ripples.

Stationary test targets (not enemies) north/west/south of spawn, with a shield
target east of spawn. They are indestructible so you can keep testing effects.
One armed enemy patrols the arena, takes component hits and respawns after 4 seconds.
It cannot fire. Weapon damage is provisional for this test. Weapon speeds/ranges/rates are provisional.
Visual effects preview sheet was art direction; this build animates game-scale
textures and particles rather than displaying that static sheet.

Verified: syntax; mocked runtime covering all 18 systems, independent firing,
multi-barrel ports, rotation transforms, swept collision, shield absorption,
particle limits, unchanged movement and hold angle. Actual Canvas renderer
also used to inspect a firing test. Browser touch/offline testing on iPad is
still required. 37 firing/impact/shield samples integrated. Real firearm recordings supply
ballistic layers; fictional weapon sounds are designed composites. Source
credits and CC0 information in audio/CREDITS.txt. Added reverb is removed. Existing dry/master gains and sample levels unchanged. Compressor and a 24-voice cap control overlap.
Tap a control to unlock audio on iPad. SOUND ON/OFF toggles mute.
Turret and weapon controls enlarged. Driving speed and movement unchanged.
Mine dispenser now sprays five mines per activation, with five ejections and
arming click; mines travel out behind turret and arm after 1.1 seconds.
Audio loading/unlock/playback/mute verified with mocked Web Audio;
37 PCM files validated. Actual iPad listening and touch testing still needed.
Full armed mech icon: 192px/512px manifest icons and 180px Apple touch icon.
If iPad keeps the old Home Screen icon, remove that shortcut and Add to Home
Screen again after opening the updated site.
Enemy patrol/damage/respawn tested and actual arena Canvas rendered.

v8 control layout: movement stick and Shield on the left; Primary, Secondary,
Support and turret left/right buttons on the right.

v8: weapon balance and local lighting.
All individual projectile hits count; old global damage debounce removed.
Enemy armour reduces raw damage by up to 25%, reduced by penetration.
Per-slot build modifiers: Standard; Power (+25% damage, +15% cooldown);
Rapid (-20% cooldown, -12% damage); Armour piercing (+40 percentage points
penetration, -10% damage); Wide blast (+35% radius, -10% damage).
Only applicable options are shown. Loadout stats show raw whole-volley damage.
Modifiers are snapshotted per projectile, including mines and mortar bomblets.
Explosive damage falls off with distance; flak loses damage over distance;
railgun has high armour penetration. Flame burns after contact, sustained beam
builds damage, arc/EMP temporarily slow the test mech. EMP temporarily suppresses
the fixed shield test target. These are provisional test balance values.
Muzzle and blast lighting uses local screen-blended gradients after drawing
mechs/ground. Flame and beam cast matching light. No full-screen flash.
Verified: modifier formulas, separate twin hits, burn, beam buildup, EMP slow,
projectile collision/ports and actual Canvas lighting render.
Engine/track and turret sounds added in v12. Extra weapon bass remains pending.


v9: component damage and manual missile lock.
Enemy has independent hull, turret, left/right tracks, left/right weapons and
support health. Alpha masks follow the visible sprite layers and turret angle.
Destroyed weapons darken and smoke. Direct hits damage the struck component
with some hull damage; explosions can damage nearby components. One broken
track reduces speed/turning; two immobilise it. Turret damage slows rotation;
destruction freezes it. Hull destruction removes the mech, then respawns it
fully repaired after four seconds. Enemy weapons never fire in this test.
Player component damage is not exercised because the enemy does not fire.

With swarm or hunter missiles selected, hold Support (or R) while pointing
within a narrow cone at the enemy. One second of clear line of sight acquires
a lock; release fires guided missiles. Early release fires unguided. Turning
away or an obstructing test target resets acquisition. Pointer cancellation
does not fire. Guidance starts after launch over the turret and cannot follow
a respawned enemy. Rocket barrage remains unguided.
Verified in mocked runtime: lock timing, early release, cone loss, component
destruction, respawn, all 18 effects, multi-barrel ports and driving. Native
Canvas arena frame inspected. Browser/iPad touch testing is still required.


v10: second complete mech colour scheme.
Choose Green / white with cyan cockpit, or Rust red / white with amber cockpit
on the build screen. Choice saves with the build and updates live assembly.
All 12 side weapons work in both colours on either side; all six support
systems match too. Existing sprites are recoloured once during loading and
cached, preserving transparency, damage texture and shading. Energy weapon
glows retain their weapon identity. Enemy uses rust red / amber, still never
fires. Damage, controls, lock-on, sound and driving are retained from v9.
Verified: 20 cached recoloured sprites; unchanged alpha masks; selector and
saved preference; clear build restores green; native Canvas renders for both
mechs and arena; twin-barrel firing and unchanged movement speed.
iPad/browser touch and listening tests remain required.


v12: movement and turret audio.
Two six-second mono loops: low engine rumble/track clatter while driving and
mechanical traverse noise while rotating the turret. Engine mix gain .19;
turret .34; weapon gains unchanged. Driving intensity controls engine gain
and playback speed. Release fades the loops; return/blur stops them and
hidden pages cannot restart them. Mute affects all sounds. No reverb.
Original designed mechanical composites, not recordings of a real tank.
Verified loop reuse, gain ordering, fade targets, mute, cleanup/background
suppression, JS syntax and native Canvas/game runtime. Actual iPad listening
and touch testing remains required.


v13 movement audio replaces the designed v12 sounds with the approved
recording previews. Deeper bass-heavy Leopard engine loop, engine mix .40
(previous .19). Turret uses trimmed hydraulic start (.32s), movement loop
(1.215s) and stop (0.87s), mix .55. Hold schedules start then loop; release
fades moving layers and plays stop exactly once. Quick taps cancel a pending
loop; repeat presses fade old stop tail. Return/blur/mute/background clears
motion nodes without playing a tail. No reverb. Sources/licenses in
audio/CREDITS.txt. Install these changed files over v12 and merge audio/.
Verified JS syntax, scheduled start/loop, hold reuse, rapid release/repress,
stop-once, engine gain and mute/background cleanup with mocked Web Audio.
Actual iPad listening and touch testing remains required.


v18: modular biped chassis, heat and swapped controls.
Chassis selector: Heavy tracked (existing) or Heavy armoured biped. Same
independently selected turret, side mounts and rear support, with green or
red armour. Biped has separate thigh, shin, knee and foot sprites and a
hip-centred upper assembly. World-space feet remain planted during stance;
alternating swings and articulated knees handle walking and pivoting.
Tracked speed remains 260 world units/sec. Biped speed is 70 world units/sec
with 75-unit full strides; lower-chassis turn limit 45 degrees/sec. This
walking speed keeps feet within leg reach. Turret is independently 75
degrees/sec on both chassis (previous 45). Biped has no diesel loop; existing
turret start/loop/stop audio retained. Enemy still tracked and never fires.

Control groups swapped: turret and Primary/Secondary/Support on LEFT; movement
stick and Shield on RIGHT. Keyboard bindings unchanged.
Ballistic side mounts have independent heat: MG, rotary, siege, tri-salvo,
railgun, flak. Heat is per whole firing activation. At 100% the mount stops
firing; cools 22 points/sec and unlocks at 20% (about 3.6 sec). Releasing the
trigger cools after .25 sec. Heat/cooldown shown on each weapon button.
Energy/specialist and support systems retain previous behaviour.

Validated: JS syntax, load/save/reset and both colour renders; native Canvas
biped build/arena; planted feet on stop, tracked 260 and biped 70 speeds;
independent heat lock/recovery, nonballistic exemption; 75-degree traverse;
twin muzzle firing; audio start/loop/stop regression. iPad browser touch,
performance and audio listening checks are still required.
Upload root changed files and MERGE assets/; keep all existing audio/assets.

V15: biped speed 120 world units/sec (was70), footstep-synchronised robotic
walking and hydraulic whine. Turret + shield left; movement + weapons right.
Upload only files in this patch, preserving audio folder. Build label v18.

V16: approved option B: 140 world units/sec, 210 units per full stride
(105 per alternating footfall), 1.5 sec leg cycle at full speed. Forward
foot placement extends to support the longer planted stride. Biped chassis
turns 67.5 degrees/sec (was45). Turret speed remains75 degrees/sec.
Hydraulic swing and landing sounds follow the updated gait automatically.
This patch contains only biped.js, index.html, sw.js and this README.

V17: biped steers only while walking, with approx119-unit minimum turning
radius. Forward gait rotates with the chassis; no world-anchored pivot feet.
140 units/sec,105 units per alternating step,67.5 degrees/sec full-speed
steering. Shield sits immediately right of the left turret controls.
Patch: biped.js,game.js,index.html,sw.js,README.txt. Upload over v16.

V18: tracked chassis25% larger (including matching hull/track hit regions),
tracked player speed130 units/sec. Biped160 units/sec,105 units per footstep.
Biped steering90 degrees/sec; minimum radius~102 units at full speed.
This patch changes size/speed/steering only; new eject/control layout pending.
Upload the six files in this patch over v17.
