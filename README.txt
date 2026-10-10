IRON PIT v57 — comic intro and video comms
Apply this patch over a complete working v53, v54, v55 or v56 installation. Keep folder paths and replace matching files. It is not a standalone game.
Championship: quote, black screen while workshop audio fully fades in, three manually turned comic pages, Prepare for Battle fade to black, Dave comms boot, qualifier briefing, workshop.
Pages 1 and 2 have live TURN PAGE buttons and a page-curl transition. Page 3 has PREPARE FOR BATTLE. Artwork and dialogue match the approved previews.
All story transmissions retain the remote portrait for Rourke’s bottom-right replies. Glitches occur only when the remote character changes. Cream comic text remains readable inside the comms frame.
Workshop ambience loops with a two-second crossfade. Quiet radio uses Web Audio gain, band-pass filtering and room reverb. Audio continues through comic, comms and workshop; stops when the league opens or an arena starts.
Offline cache updated to v57. Reload the site online after upload to install the updated cache.
Validated with full-script DOM integration and audio-node mocks, JavaScript syntax checks, cache-file checks and offline media byte-range tests. Real iPad playback and page animation still need device validation.
