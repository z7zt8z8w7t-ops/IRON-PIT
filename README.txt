IRON PIT — FIRST PLAYABLE PROTOTYPE

This is a standalone portrait PWA. Open index.html through a web host such as
GitHub Pages. To put it on your GitHub Pages site, upload the contents of this
folder together to the publishing folder. Keep game.js, sw.js, icon.svg and
manifest.webmanifest alongside index.html.

Controls
  Touch: left thumb walks. Drag with right thumb to aim and fire.
  Tap MISSILE for the explosive alternate weapon (three shots per match).
  Desktop: WASD or arrow keys; hold the mouse button to fire; Space fires missile.

The four mechs fight a free-for-all. Cover blocks movement and shots, and can
be destroyed. Armour has directional protection, and mechs show damage and
leave wrecks. The match ends when your mech is destroyed or you are the last
machine standing.

For offline play, load the hosted game once while online, then add it to the
Home Screen. The service worker saves the game files after the first visit.

Version 1: a focused combat prototype. No hangar or permanent upgrades yet.
