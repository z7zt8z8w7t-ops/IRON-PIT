IRON PIT — MECH BUILD / WEAPON EFFECTS v7

Upload the COMPLETE contents to your GitHub Pages repository root, including
audio.js, enemy.js, weapons.js, the audio folder and the assets folder. This replaces v3. Open once online before
offline play; Add to Home Screen on iPad. Service-worker cache updated to v7.

Driving movement unchanged: 260 world units/second, same joystick and zoom.
Turret: hold left/right buttons, 45 degrees/second; release holds direction.
Primary fires left mount; Secondary fires right mount; Support fires rear pod.
Keyboard: WASD/arrows move, Q/E traverse, Space/F/R fire the three slots.
Shield button remains beside turret controls.

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
One unarmed enemy patrols the arena, takes hits and respawns after 4 seconds.
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
Audio loading/unlock/playback/reverb/mute verified with mocked Web Audio;
37 PCM files validated. Actual iPad listening and touch testing still needed.
Full armed mech icon: 192px/512px manifest icons and 180px Apple touch icon.
If iPad keeps the old Home Screen icon, remove that shortcut and Add to Home
Screen again after opening the updated site.
Unarmed enemy patrol/damage/respawn tested and actual arena Canvas rendered.

v7 control layout: movement stick and Shield on the left; Primary, Secondary,
Support and turret left/right buttons on the right.
