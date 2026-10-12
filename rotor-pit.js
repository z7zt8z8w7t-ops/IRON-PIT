(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RotorPit = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  const RAD = Math.PI / 180;
  function layout(bounds) {
    const { x, y, width, height } = bounds;
    if (![x, y, width, height].every(Number.isFinite) || width <= 0 || height <= 0)
      throw new RangeError('Playable bounds must be finite and positive.');
    const s = Math.min(width / 3, height / 4);
    const left = x + (width - 3 * s) / 2;
    const top = y + (height - 4 * s) / 2;
    return [
      { id: 'centre', x: left + 1.5*s, y: top + 2*s, radius: .92*s, omega: 18*RAD },
      { id: 'top-left', x: left + .5*s, y: top + .5*s, radius: .32*s, omega: -35*RAD },
      { id: 'top-right', x: left + 2.5*s, y: top + .5*s, radius: .32*s, omega: 35*RAD },
      { id: 'bottom-left', x: left + .5*s, y: top + 3.5*s, radius: .32*s, omega: 35*RAD },
      { id: 'bottom-right', x: left + 2.5*s, y: top + 3.5*s, radius: .32*s, omega: -35*RAD }
    ];
  }
  class Controller {
    constructor(discs) {
      this.discs = discs.map(d => {
        if (![d.x,d.y,d.radius,d.omega].every(Number.isFinite) || d.radius <= 0)
          throw new RangeError('Each cog needs a finite centre, positive radius and angular speed.');
        return {...d, angle: 0};
      });
    }
    reset() { for (const d of this.discs) d.angle = 0; }
    support(actor) {
      if (!actor || actor.dead || actor.airborne || actor.ejecting || actor.extracted ||
          !Number.isFinite(actor.x) || !Number.isFinite(actor.y)) return null;
      return this.discs.find(d => (actor.x-d.x)**2 + (actor.y-d.y)**2 <= d.radius**2) || null;
    }
    step(actors, dt, move) {
      if (!Number.isFinite(dt) || dt < 0) throw new RangeError('dt must be finite and nonnegative.');
      if (dt === 0) return;
      const unique = [...new Set(actors)];
      // Small collision steps prevent tunnelling when a frame is late.
      const count = Math.max(1, Math.ceil(dt / (1/60)));
      const interval = dt / count;
      for (let i=0; i<count; i++) {
        for (const actor of unique) {
          const d = this.support(actor);
          if (!d) continue;
          const delta = d.omega * interval, c = Math.cos(delta), s = Math.sin(delta);
          const dx = actor.x-d.x, dy = actor.y-d.y;
          const x = d.x + c*dx - s*dy, y = d.y + s*dx + c*dy;
          if (move) move(actor, x, y);
          else { actor.x=x; actor.y=y; }
          // Aim, steering, velocity and health remain owned by the game.
        }
        for (const d of this.discs) d.angle = (d.angle+d.omega*interval) % (Math.PI*2);
      }
    }
  }
  return {layout, Controller};
});
