IRON PIT v88 — FINER ARENA ART AND WEATHER

All nine rebuilt ground textures use the revised finer Ashfall detail scale. Ashfall is dark charcoal with tiny grey ash and smaller wispy vortices. Dust, snowfall, sparks and electrical arcs have finer detail. Dust Crucible storms still obscure mechs and stands. Foundry uses smaller heat wisps and smoke puffs that accumulate and drift downwind; the same hazard area, warnings, damage, sound and smoke persistence remain. Salt shimmer displacement is subtler. Rotor gear/housing sizes and movement stay aligned with the existing mechanics, with finer metalwork. Foundry retains exactly twelve hazard cells, thinner grate bars, more cross beams and scattered small repair plates.

Upload all files in this update over the existing v85, v86 or v87 game, preserving the other assets and audio files.

SPLASH → TEST ARENA → choose one of the nine new arenas → unlocked workshop → START ARENA TEST. ARENA SELECT in the battle HUD returns immediately to the testing selector. Testing does not award wins or campaign progress.

Ashfall: drifting ash, occasional small vortices.
Dust Crucible: random sandstorm periods obscuring the mechs and stands; AI visibility follows the storm.
Drowned Sector: dark water and narrow mud banks, random electrical hazards, four surrounding towers warn yellow then rapidly red. No flashing square.
Blackout: near-black ground, revealed by live mech headlights and collision-aware beam polygons.
Frostbite: finer snow/ice, snowfall, tracks and powder.
Rotor Pit: one central and four corner cogs rotate and carry live mechs, with independent aiming and steering. The two middle nodes are removed.
Foundry: twelve distinct furnace grates, randomly selected white-hot heat haze conceals the ground and actors and deals damage. Four-tower warnings, drifting smoke, existing flamethrower start/loop sound.
Salt Flats: cracked salt art, salt dust and subtle floor shimmer.
Scrapyard: rusted ground art, dust and occasional sparks.

All rebuilt arenas use a 1800 × 2400 playable floor, a 3 by 4 invisible grid of twelve equal 600-unit squares, tower collisions, a blue protective perimeter field and ten inward flamethrowers at non-corner edge nodes. The old forcefield grid is disabled for the rebuilt arenas. Stadium stands, ground, towers, animation and controls are separate render layers. The controls stay in the existing panel beneath the arena canvas.

The testing selector contains only the nine rebuilt arenas. Existing campaign/Quick Battle stages remain on their existing arena modes while the rebuilt arenas are being tested.

Validated: all nine assets loaded and native canvas drawing executed; geometry, collision nodes, ten non-corner nozzles, warning counts, player/AI hazard damage, safe-cell exclusion, sound events, all five cog carrying/release, visibility, session restore, unchanged saved unlocks, random selection and time-step consistency. JavaScript syntax, HTML IDs, script references and every offline cache file checked. Live Safari/iPad playtesting has not yet been performed.

Initial tuning: 85 damage/second for Foundry heat, 75/second for electrified water, 85/second for perimeter flames. Foundry heat lasts 3.4 seconds; electricity 2.4 seconds, both following a 2.2-second tower warning. Damage applies to the cell containing the actor centre; shields use the existing absorption logic. Hazards pause during deployment and cease damaging after match end.
