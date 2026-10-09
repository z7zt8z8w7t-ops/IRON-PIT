IRON PIT v43 — SIX CHASSIS / NAMED STADIUM ARENAS

This is a changed-files update over v42. Extract the ZIP and upload its contents
into the existing repository root, preserving assets/ paths. Keep all existing
files and audio. Refresh while online until the visible label says v43, then
allow asset loading to finish before launching offline.

FLOW
START -> choose 1v1, 1v2, 1v3 free-for-all, two-player, or weapon test -> choose
arena -> flashing CONFIRM -> Workshop -> DEPLOY. Both selections are required.
Two-player builds happen in turn; Player Two's entire Workshop rotates 180
 degrees, including weapon choices. Both humans play in the selected stadium.

WORKSHOP
Swipe the six chassis cards. The live mech is fully coloured and opaque, showing the selected paint job.
Tap WPN 1, WPN 2 or WPN 3 on the schematic
and swipe compatible weapons. Each choice shows its name, image, weight and
victory requirement. Choose a modifier in the same panel. PAINT toggles the
existing two complete paint schemes independently of chassis class.
The Workshop fits one screen without vertical scrolling on portrait iPads.

CHASSIS                          UNLOADED SPEED   ARMOUR REDUCTION
Light tank                            210 U/s          12%
Assault tank (four track pods)         170 U/s          25%
Heavy tank                            140 U/s          38%
Light biped                           260 U/s          12%
Assault biped                         220 U/s          25%
Heavy biped                           180 U/s          38%
Weapon weight subtracts 1.7 U/s per weight unit from tanks, 3 U/s from bipeds,
with class-specific minimum speeds. Penetration reduces armour protection.
All classes retain one 700 HP hull; individual component damage stays removed.
Existing turret, weapon positions, health/repair/eject lights and weapon
balance are retained. Bipeds use the direct movement control and forward gait.

TTK
Workshop EST. TOTAL TTK is an ideal approximate simulation of all equipped
systems firing together against a stationary 700 HP assault target at 300 U,
shields off. Includes standard heat, reloads, armour, modifiers and approximate
travel time. It is not a promise of real match time: misses, shields, movement,
two-thumb controls and area effects change results. Mines and smoke do not
contribute to forward-fire TTK. Use WEAPON TEST ARENA for actual game collision
measurements at 300/500/800 U. Results remain saved locally on the device.

CONTROLS
WPN 1 sits directly beside the chassis stick; WPN 2 directly beside turret
arrows. Combined turret arrow width matches chassis stick diameter. Outer
controls use available panel height. Middle top: SHIELD / REPAIR / WPN 3.
EJECT spans the row beneath. Panel height is preserved. Each chassis has its
own accent colour. WPN labels stay centred; heat fills the button red upwards,
then drains during cooling. Missile lock is indicated by a bright border.
Post-match Workshop and Rematch still appear only after complete shutdown.

ARENAS
Dust Crucible: golden-hour sand and worn concrete, warm long mech shadows,
fine drifting sand and intermittent obscuring sandstorms. First storm begins
at 15 seconds, peaks after seven seconds, fades out by 48; repeats every 65.
Dust extends over the crowd stands and baked stadium floodlights as well as
the arena. The controller stays clear. Mech lights and muzzle flashes remain
above dust. AI, smart-gun and missile lock
visibility are restricted during storms; muzzle flashes briefly reveal a target.
Drowned Sector: blue-hour flooded industrial floor, reflections, ripples/wakes.
No rain, lightning, electrical shutdown or weather damage.
Blackout: dark ground, restrained lighting and under-arm headlights.
Rotor Pit: fast rotating central steel platform and stationary outer routes.
Nodes covered by the platform stay excluded.
Frostbite: snow-covered floor in cold daylight; fading track marks/footprints
and small moving-mech powder effects. No slippery movement penalty.
Chainworks: moving industrial conveyor belts alter mech position.

FORCEFIELDS
Horizontal, vertical and true 45-degree diagonal barriers. The grid uses square
cells; nodes sit at intersections. Random layouts are checked by flood-filling
floor with clearance inflated beyond the largest mech's radius. Starting
positions stay clear. Walls change every 15 seconds, with a five-second
klaxon/yellow warning, then steady red before switching. Activation on top of
any mech is lethal. Bullets collide with the same geometry as movement.

OFFLINE / PERFORMANCE
All v43 scripts, stylesheet, splash artwork and chassis parts are cached with
the existing assets and audio. No external fonts or online runtime dependency.
Dust texture, mech shadows and paint variants are reused. Snow marks are
capped at 240 and expire; dust uses a bounded particle/texture budget.

VALIDATION
Native-canvas renders of all six chassis and arenas; 60 generated layouts
checked for connected floor and spawn clearance; diagonal collision, storm
visibility/reveal, snow marks, solo counts, two-player builds/controls, weapon
range, post-match shutdown and service-worker offline requests checked.
Physical Safari/iPad touch layout, sound and frame rate need device testing.
