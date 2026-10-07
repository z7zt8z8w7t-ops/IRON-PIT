IRON PIT — MECH BUILD / WEAPON EFFECTS v9

Upload the COMPLETE contents to your GitHub Pages repository root, including
audio.js, enemy.js, weapons.js, the audio folder and the assets folder. This replaces earlier builds. Open once online before
offline play; Add to Home Screen on iPad. Service-worker cache updated to v9.

Driving movement unchanged: 260 world units/second, same joystick and zoom.
Turret: hold left/right buttons, 45 degrees/second; release holds direction.
Primary fires left mount; Secondary fires right mount; Support fires rear pod.
Keyboard: WASD/arrows move, Q/E traverse, Space/F/R fire the three slots.
Shield button remains beside movement controls.

12 side weapons, 6 support systems, one green-white chassis/turret set.
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
Engine/track and turret sounds and extra bass remain pending; not in this build.


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
