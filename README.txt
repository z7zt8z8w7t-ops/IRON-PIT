IRON PIT v33 — NIGHTTIME STADIUM ONE-ON-ONE

Upload these changed/new files over the existing repository, preserving paths.
Keep existing assets/audio. New assets/stadium-urban.png and audio/crowd-bed.wav
and audio/crowd-cheer.wav are required. Refresh online and check the v33 label
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
