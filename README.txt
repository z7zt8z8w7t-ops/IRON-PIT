IRON PIT v32 — NIGHTTIME STADIUM ONE-ON-ONE

Upload these changed/new files over the existing repository, preserving paths.
Keep existing assets/audio. New assets/stadium-urban.png and audio/crowd-bed.wav
and audio/crowd-cheer.wav are required. Refresh online and check the v32 label
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
