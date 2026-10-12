IRON PIT v90 — NEW SINGLE-PLAYER ARENAS

Install: unzip this package into the existing IRON-PIT-main game folder, replacing files with the same names. It is a cumulative update for the supplied v85 project and includes the v87/v88 arena work. Deploy the updated folder normally, then reload the game. The service worker uses a new v90 cache.

Campaign arenas and fixture previews now use the rebuilt artwork:
Rookie: Ashfall, Frostbite, Blackout, Scrapyard, Dust Crucible.
Challenger: Drowned Sector, Rotor Pit, Foundry, Mist, Frostbite, Salt Flats, Foundry.
Opponents, rewards and existing league progression are preserved. Legacy arena names resolve to the new arenas.

All rebuilt floors measure 1800 x 2400 with twelve equal 600 x 600 cells. Grid lines are invisible. The shared stadium has tiny crowds, raised overhanging balconies, floodlights, signal lights, stone tower surrounds and glowing blue caps. The balcony foreground hides part of mechs at the floor edges. Tower collisions and permanent perimeter shielding remain separate from floor artwork.

Shifting internal forcefields use horizontal or vertical node connections only. Connections between two perimeter nodes are excluded. Generated wall layouts are checked for connected routes with large-mech clearance and tower collision.

Rotor Pit uses five damaged metal discs, keeps the two middle nodes removed, and carries both player and enemy mechs.
Mist adds layered translucent clouds with soft irregular edges, deformation and drift. Visibility affects AI.
Foundry uses overhead translucent flame patches with softened edges, heat refraction and darker drifting, deforming smoke. Fire lasts 2.45 seconds; smoke lingers. The four bordering towers warn yellow then rapidly red. Flame-start and flamethrower sounds are reused.
Foundry machinery uses the supplied electricmotor recording, compressed to MP3, with a twelve-second equal-power crossfade. It continues through extraction and stops at the helicopter's exit. Muting, hiding the app or leaving the arena cleans up the loop.
Lab/workshop ambience gain is reduced by 50% with reverb.

Quick Battle, Test Arena and Two Player public routes are removed. The workshop weapon range remains available for weapon fitting.

Validation: JavaScript syntax, menu/league routing, all ten artwork loads and native Canvas renders, twelve-cell geometry, node/jet placement, tower/forcefield collision and route connectivity, player/AI hazard damage, rotor carrying, storm visibility, Foundry timing at 30/120 Hz, crossfade scheduling/extraction cleanup, and every offline-cache path.
An actual iPad/Safari playthrough has not been run in this environment.
