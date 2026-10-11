IRON PIT v68 — DRONES — CHANGED FILES ONLY

Apply over v62, preserving folders and replacing matching files.

Adds Hunter drone pod in rear slot 3. Three compact drones launch with a short stagger, fly over ground forcefields and fire four-shot machine-gun bursts with the existing machine-gun sound. Bullets use normal cover, shield and forcefield collisions. Drones can be shot down. Up to three active drones per pilot; launcher reload 12 seconds, deployed drone lifetime 35 seconds.

Available after Challenger round 3, or after nine Quick Battle wins (or All Weapons Unlocked testing). Existing Hunter missiles are retained. Quinn's three neutral arena drones now share the miniature artwork and machine-gun burst behaviour.

Workshop mount artwork, hit masks, weapon cards, loadout saving and offline cache include the new pod. v62 splash fix retained.

Validation: full script startup, seven league rounds and targeted drone launch/ownership/cadence/collision/reset checks. Real iPad verification remains.

V64: Built-in comms SKIP/NEXT hardware controls. Quote NEXT explodes into the comic cover; cover TURN PAGE starts workshop audio. Two randomly selected workshop radio tracks at 10% with four-second large-room reverb. Apply changed files over v63.

V65: Workshop radio streams through Web Audio filters and room reverb; playback is requested in the page-turn gesture, without decoding whole songs or waiting on radio readiness to fade the ambience. Apply over v64.

V66 music isolation test: Restore the v63 decoded Web Audio player with the original song only, 10% gain and four-second room reverb. Quote NEXT reveals the cover and starts music; cover TURN PAGE still fades in ambience. Apply over v65.

V67: Original working radio player retained; cover TURN PAGE starts music and ambience together. Quote NEXT reveals the cover with explosion only. Visible splash, workshop and arena labels updated to v68. Apply over v66.

V68: Approved new comms frame with BACK/SKIP/NEXT. Comic PREVIOUS reverses the curl; SKIP starts comms (and starts audio when skipping the cover). Original working decoded audio player randomly selects a song from workshop-playlist.js at startup, retaining it through the session. 8% gain, 550–2400 Hz radio band, stronger distortion and four-second room reverb. To add songs, upload local files and append their paths to WORKSHOP_PLAYLIST; this shared list also supplies offline cache entries. Apply over v67.
