IRON PIT v38 — NIGHTTIME STADIUM ONE-ON-ONE

Upload these changed/new files over the existing repository, preserving paths.
Keep existing assets/audio. New assets/stadium-urban.png and audio/crowd-bed.wav
and audio/crowd-cheer.wav are required. Refresh online and check the v38 label
before using offline. The service worker caches the new artwork and sounds.

One-player mode: one armed enemy, the whole stadium visible. The stadium stands
render below a single detailed nighttime urban image. Five roof footprints are
matched to movement/projectile collisions. Low ground debris does not block routes.
Mechs remain 70 logical pixels wide at the 820 x 892 reference gameplay window,
scaling down on smaller windows. Fixed-camera two-player mode is retained.

Mechs have one health pool. Hits on any mech part damage the main health pool;
individual weapons, legs, tracks and turrets no longer break separately. Shield,
repair and weapon balancing remain active. Blast damage applies once per mech.

Sparse amber streetlighting and existing muzzle flashes/headlights illuminate the
dark field. A separate pulsing blue perimeter force field protects the stands and
reacts to stray shots. Crowd ambience and cheers accompany the action. Music plays
in menus only; there is no music during either gameplay mode.

Automated collision, navigation, damage, audio-state and offline-resource checks
and native canvas rendering are included in validation. Physical iPad Safari/
Home Screen touch and layout still require checking on the device.

V33 update: separate real football ambience, hit swell (four-second cooldown),
and destruction eruption. The bed ducks during the destruction cheer. The transport
and boot sequence now precede a 2.9-second voiced countdown with strong stadium
reverb and a real air-raid siren underneath. Controls and combat remain locked
until the countdown ends. Red perimeter lamps flash once on each number; green
lights fade over two seconds at battle start. Cosmetic fireworks, flares and
wispy crowd smoke draw above the stadium, without combat damage. No large countdown
text. Explosions, smoke and their lighting now extend above the stands.
Twin siege cannon damage reduced from 130 to 97.5 per shell (25%); reload unchanged.
Upload stadium.js and all included sound files, plus the updated cache/scripts.
The edited siren sound is CC BY-SA 3.0; see audio/CREDITS.txt.


v38 — SHIFTING FORCEFIELD 1v1 TEST
One-player versus one armed enemy; two-player map unchanged.
A single unique detailed floor image replaces all buildings in this test.
Visible 3 x 4 grid; emitter nodes at every intersection. Cells measure 583 x 500 world units; narrow dimension after a wall is 482 (over twice the 225.25-unit full armed mech width).
Connected randomized five-wall layouts change every 30 combat seconds. Last five seconds: crowd swell, existing siren, accelerating yellow side lamps, then solid red in final second. Incoming walls show footprints. New-wall activation instantly destroys any overlapping mech, bypassing shields. Timer pauses when hidden, during delivery/countdown, and after match end.
Navigation rebuilds on wall changes. AI reacts to dangerous incoming walls. Permanent spectator shield remains active.
Snow-camouflage tandem-rotor helicopter replaces delivery artwork at approved small scale, with separate opposite-spinning rotors, flashing red/green/white/yellow navigation lights and curved departure.
All three crowd effects are louder. Siege reload and prior balancing unchanged.
Generated art prompt: unique overhead worn blue-grey concrete and flat debris; snow-camouflage edit of approved rotorless helicopter / separate rotor sheet. Artwork produced with built-in image generation.
Upload changed files over v33, preserving paths. Visible version/cache v38.


v38 — SIX SELECTABLE 1v1 ARENAS
Start-menu arena selector: Desert, Flooded, Dark nighttime, Rotating centre, Snow, Conveyor belts. Choice is saved locally; shared-iPad two-player map remains its existing separate test arena.
Unique detailed desert/flood/snow ground images, fine-scale surface detail and low decorative edge debris; no extra debris collisions. Night version uses flooded ground under stronger night shading. Mechanical variants use desert ground with darker industrial lighting, separate metal platform and animated conveyor lanes.
Rotating centre: 1000-unit turntable at 0.13 radians/second carries living mechs and their facing/turret angles. Two mounted forcefield walls rotate with it; three outer corner walls remain fixed. Layout alternates mounted horizontal/vertical pairs with the same 20-second changes and five-second lethal warnings. Visible beams, light clipping, movement and projectile collisions use transformed wall coordinates. Navigation refreshes during rotation.
Conveyors: opposing 65-unit/second belts carry living mechs, stop against active walls and boundaries, with animated treads and arrows. No added ice/water movement penalties.
Helicopter and rotor layers are now above the stadium stands without field clipping.
One-time winner announcements after projectiles settle: You are victorious / Breaker wins / Player one or two wins, with stadium reverb. Audio bundled for offline play.
All new assets included in v38 offline cache. Upload changed files over v34 preserving paths.
Generated ground prompts: unique overhead finely detailed military desert/flooded/snow concrete and edge debris, no mechs/buildings/grid/lights. Separate transparent radial mechanical turntable, generated with built-in image tool.

V36 UPDATE
Upload changed files over v35, preserving directories. Visible version: v38.
Rotating floor: doubled speed; covered fixed grid nodes omitted and excluded.
Workshop is on the controller. Destroyed panels glitch for two seconds then show Signal Lost. Winner controls power down. Workshop and Rematch remain available.
Victory: supplied Aggressive Huge Hit Logo with stadium PA reverb/echo, winner voice overlapping the clip and ten staggered fireworks.
1v1 stadium: ten detailed perimeter flame units. Random 0.8-1.2-second bursts follow a 0.65-second amber warning; maximum two active. Flames cause 85 hull damage/second, shields absorb damage, and standing forcefields block the jets. Smoke and light linger. Cached flame atlas also improves mech flamethrower visuals.
Offline: all new scripts/audio bundled in v38 cache. Physical iPad/Safari testing remains necessary.

V37 UPDATE
Upload this changed-files package over v36, preserving folder paths. Visible label and offline cache: v38.
Smart Gun (Slot 1): 600-unit acquisition distance, +/-20-degree aim cone, 0.4s acquisition, line-of-sight and smoke checks; red ballistic tracers with target velocity lead. Outside lock range/cone it fires straight. Five weight units, unlocks at five victories. Uploaded Jim Rogers minigun start/fire/stop clips; bullets and flashes stop when winding down.
Harpoon Cannon (Slot 2): seven weight units, unlocks at seven victories. Steel bolt embeds and its point disappears. Cable reels target towards the shooter for up to 2.5 seconds; it releases on death, obstruction or excessive distance. Shield prevents attachment.
Cluster Mortar (Slot 3): replaces the previous cluster effect with one lofted shell, an early burst away from the enemy, seven staggered fan-out homing rockets, flight sounds and individual explosions.
Both current colour schemes apply to new sprites. Shoulder orientation uses the existing mirrored mount system.
Forcefields change every 20 seconds, warning at 15 seconds; five-second klaxon and solid red until change.
Winner/loss control panels fully power down. Loss uses tearing/glitches; winner uses normal fade. Workshop and Rematch appear only after shutdown and the final result has settled.
WEAPON RANGE: in the Workshop, fit your weapons and press Weapon range. Choose Slot 1/2/3 or All slots, choose 300/500/800 units centre-to-centre, then RUN TEST. Stationary 700-health tracked target, shields/repair off. It times the first firing command through destruction, including heating, reloads, charge and travel. Automated simultaneous all-slot firing is a diagnostic ceiling, not a two-thumb control simulation. Movement is frozen during the run. RESET starts a fresh target; Workshop returns to building. Last 100 results are saved on this device. Mines are fired at a target behind you.
Turn on Test: all weapons unlocked in the build menu to compare every weapon immediately.
TTK_RESULTS.txt and TTK_RESULTS.json contain the virtual runs. They are reference files, not required for game loading.
Validation: native canvas game harness, actual weapon simulation at 60Hz; range/cone/obstruction, tether collision, child count, no firing during spin-down, shutdown timing on both panels, six arenas, movement/collision regressions and all 160 offline resources. Physical Safari/iPad audio and touch remain to be checked on device.

V38: Smart Gun tracers now match the approved preview: up to 55 world units long, five-unit bright red trail, pale 1.8-unit core and soft red glow. Damage, firing rate, projectile speed and audio timing remain at v37 values. Upload over v37 preserving folders.
