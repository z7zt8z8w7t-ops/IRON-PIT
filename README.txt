IRON PIT v58 — changed-files update for v57
Apply over a complete v57 installation. Replace matching files and preserve folder paths. This ZIP is not a standalone game.
Fixed the invalid pilot-bio element lookup that interrupted workshop setup and prevented the game render loop starting. Deployment no longer waits for the entire sound bank to load.
Quote stays on screen with NEXT until pressed. NEXT starts the workshop audio fade; the comic appears after that fade completes.
Workshop radio volume is 7%, with a longer, stronger room reverb. Ambience retains its crossfade loop.
Remote comms dialogue is bottom left; Rourke replies stay bottom right without changing the remote image.
After opening qualifier comms, new pilots get START TUTORIAL / SKIP TUTORIAL. Tutorial returns directly to the workshop.
Championship hides Pilot permanently and Livery until Rookie sponsorship. Quick Battle retains all four tabs.
Upper workshop shows a green schematic with the chosen chassis and mounted weapons. Selected weapon slots show weapon images. Deploy spans the bottom panel.
Offline cache updated to v58. Reload online after upload to install the new cache.
Verified strict DOM ID lookup, tutorial and comms routing, 449 actual game frames through deployment into combat, audio-node gains/reverb, JavaScript syntax, cached asset paths and media byte ranges. Actual iPad playback and appearance still require device testing.
