// Headless solvability proofs for every Bloom Again vignette. Run: node engine.test.mjs
// Each scene is proven (a) winnable with the intended composition and (b) unwinnable
// without it (negative cases verify the puzzle isn't accidentally trivial). #LLM-generated
import * as E from './engine.js';

let fails = 0;
const ok = (c, m) => { if (!c) { console.error('  ✗ ' + m); fails++; } else console.log('  ✓ ' + m); };
const mid = r => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
const rubFully = (s, m) => { for (let i = 0; i < 60 && !E.rubAt(s, m.x, m.y, 1); i++); };

// ============================================================
console.log('\ni. The Lantern Frame');
// ============================================================
{
  const sc = E.SCENES.lantern;
  const gapMid = mid(sc.gaps[0]);
  const blockMid = mid(sc.blocks[0]);
  const doorRight = sc.doors[0].x + sc.doors[0].w;

  // Intended solution: snap → switch charcoal → rub → carried home.
  const s = E.createState('lantern');
  E.simulate(1.0, s);
  ok(!s.won && s.fig.x < sc.gaps[0].x, 'Figure starts blocked by the inked block');

  E.cycleStyle(s);
  ok(s.style === 'pixel', 'swipe cycles to pixel');
  ok(E.tapAt(s, gapMid.x, gapMid.y) && s.snapped[0], 'tap-snap closes the gap into a ramp');

  E.cycleStyle(s);
  ok(s.style === 'charcoal', 'swipe cycles back to charcoal');
  rubFully(s, blockMid);
  ok(s.erased[0], 'rub erases the inked block');

  E.simulate(8, s);
  ok(s.won, 'Figure is carried through the open door to the goal  ← STAGE i SOLVABLE');

  // Negatives.
  const a = E.createState('lantern');
  rubFully(a, blockMid);
  E.simulate(8, a);
  ok(!a.won, 'erasing without snapping does NOT win (gap is a fatal hole)');

  const b = E.createState('lantern');
  E.cycleStyle(b); E.tapAt(b, gapMid.x, gapMid.y);
  E.cycleStyle(b); rubFully(b, blockMid);
  E.cycleStyle(b); // back to pixel; door slab solid again
  E.simulate(8, b);
  ok(!b.won && b.fig.x < doorRight, 'pixel door slab blocks the Figure (must end in charcoal)');
}

// ============================================================
console.log('\nii. The Lantern, Relit');
// ============================================================
{
  const sc = E.SCENES.relit;
  const blockA = mid(sc.blocks[0]);
  const blockB = mid(sc.blocks[1]);
  const gapMid = mid(sc.gaps[0]);

  // Intended solution: pre-snap the gap (pixel), then rub A (charcoal) →
  // figure drops to mid → rolls down the snapped ramp → hits B → rub B → goal.
  const s = E.createState('relit');
  E.simulate(0.8, s);
  ok(!s.won && s.fig.x < sc.blocks[0].x, 'Figure rests against the upper block');

  E.cycleStyle(s);
  ok(s.style === 'pixel', 'switch to pixel');
  ok(E.tapAt(s, gapMid.x, gapMid.y) && s.snapped[0], 'tap-snap closes the middle gap');

  E.cycleStyle(s);
  rubFully(s, blockA);
  ok(s.erased[0], 'rub erases the upper block');

  // Let the Figure ride the ramp down and rest against block B.
  E.simulate(3, s);
  ok(!s.won && s.fig.x < sc.blocks[1].x, 'Figure carried to the lower block, not yet home');

  rubFully(s, blockB);
  ok(s.erased[1], 'rub erases the lower block');
  E.simulate(4, s);
  ok(s.won, 'Figure rolls into the goal  ← STAGE ii SOLVABLE');

  // Negative: pure-charcoal run — gap is a fatal hole, can't progress.
  const a = E.createState('relit');
  rubFully(a, blockA);
  E.simulate(8, a);
  ok(!a.won, 'pure charcoal cannot solve relit (gap kills the Figure)');

  // Negative: pure-pixel run — block A can't be rubbed, Figure stuck at top.
  const b = E.createState('relit');
  E.cycleStyle(b);
  E.tapAt(b, gapMid.x, gapMid.y);
  E.simulate(8, b);
  ok(!b.won && b.fig.x < sc.blocks[0].x, 'pure pixel cannot solve relit (block A unrubbable)');
}

console.log(fails ? `\nFAILED (${fails})` : '\nALL PASS');
process.exit(fails ? 1 : 0);
