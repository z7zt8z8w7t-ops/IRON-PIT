IRON PIT v44 — ROOKIE LEAGUE

CHANGED-FILES UPDATE OVER v43
Extract this ZIP and upload all included files into your existing GitHub
repository root. Keep assets/ and audio/ folders and all other existing files.
Do not delete the previous build. Allow the online version to load completely
until v44 appears, then launch the installed PWA offline.

CHAMPIONSHIP
Choose CHAMPIONSHIP on the splash screen or Mission Select.
Jim is the player pilot. Dave is the mechanic. Rivet and Skitter are female
rivals; Bastion pilots a heavy tank. Approved portraits accompany tap-through
briefings and post-match dialogue. SKIP advances to the next playable screen.

The Rookie ladder runs upwards: qualifier at the bottom, final at the top.
1. First Blood: Rivet, Dust Crucible in clear golden-hour conditions.
   Starter Light tank or Light biped; machine gun, tri-salvo and mines available.
   Reward: Championship entry and Rotary autocannon.
2. Catch Me If You Can: Skitter, Frostbite. Rotary + mines, Light biped.
   Reward: Flak cannon.
3. Heavy Metal: Bastion, Blackout. Heavy tank, Rotary + Flak.
   Reward: Swarm missiles.
4. Three's a Crowd: Skitter and Bastion, Chainworks. All against all.
   Reward: Pulse lasers.
5. The Rematch: upgraded Rivet, Dust Crucible with stadium-wide sandstorms.
   Reward: Smart gun, sponsorship and Rookie Champion status.

The qualifier restricts chassis to Light variants. Later matches allow all
six existing chassis classes. Weapon damage, heat, reload, weights and speed
penalties retain the existing balance. Rival behaviour preserves two-thumb
limits: movement pauses to fire one system; shield activation pauses aiming.
Skitter repositions between firing sequences. AI tolerates empty hardpoints.

Campaign saves and rewards are separate from Quick Battle wins. The testing
unlock toggle does not bypass campaign equipment progression. Losses give no
rewards; retry from the Workshop. Completed matches can be replayed without
duplicate rewards. The Contender League is not implemented in this update.
Progress is stored locally on this device; clearing site data removes it.

WORKSHOP AND MISSION SELECT
The main assembly is a digital green schematic. Chassis carousel thumbnails
show your chosen paint. The prominent PAINT SCHEME row changes the scheme.
Mission Select has a large selected-stadium preview, navigation arrows,
thumbnail carousel, combat mode cards and a flashing CONFIRM -> WORKSHOP.
The existing control panel geometry remains unchanged.

PILOT ESCAPE
Fatal damage automatically launches the cockpit pod, then the ordinary mech
explosion follows. Manual eject retains the three-second reactor alarm and
nuclear sequence. The pod jets upwards on a steep arc, falls away slightly,
then opens an olive military parachute. The canopy is above the pod and drifts
off screen. Escape effects draw above the stadium and explosion overlays.
All temporary escape objects are cleared on redeploy.

VERIFICATION
JavaScript syntax checks; runtime integration of all five missions, reward
saves/reload, loss/retry, replays, unlock isolation, empty-hardpoint AI, native
canvas rendering, normal and nuclear escape, shared-iPad startup and damage,
Quick Battle 1v2/1v3, and Weapon Test startup/simulation/return.
All service-worker cache entries checked for existing files; patch applied to
a fresh v43 baseline and checked against the completed v44 tree.
Safari touch behaviour and exact iPad layout require device testing. No claim
of measured iPhone/iPad performance or browser-level layout validation.
