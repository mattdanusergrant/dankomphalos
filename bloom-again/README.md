# Bloom Again — prototype

A mobile, touch-first puzzle-box: you can't move the Figure, only **change how the
world is drawn** until it carries itself home. This is the vertical slice — one
charcoal-skinned menu (The Hollow), one vignette (the Lantern Frame), two styles.

GDD: `03_creating/game-ideas/bloom-again.md`.

#LLM-generated

## Play

- **Live (GitHub Pages):** https://mattdanusergrant.github.io/bloom-again/ — served from `main`/root.
- **Local:** `python3 -m http.server` → open `http://localhost:8000`
  (needs a server, not `file://`, because `index.html` imports `engine.js` as a module).

## The Lantern Frame (how to solve)

The Figure rests at the top, blocked by an inked block; a gap and a door lie between
it and the goal `◊`. The scene is a contradiction no single style can resolve:

1. **Pixel** (the world quantizes) — *tap* the shimmering gap to snap it into a solid
   staircase. But pixel renders the door as a solid slab.
2. **Charcoal** (only linework is solid) — the door is just a passable outline. *Rub*
   the inked block to erase it.
3. **Compose:** snap the gap in pixel → switch to charcoal → rub the block away.
   The Figure rolls down the staircase and through the open door. Finished.

**Controls:** single finger *manipulates* (rub in charcoal, tap in pixel). Switch
styles with a **two-finger swipe** or by **tapping the wheel** (bottom-left) — switching
is kept off one-finger gestures on purpose, so it never collides with manipulation.
Desktop: `s` switch · `r` reset · drag to rub · click to tap.

## Layout

- `engine.js` — pure, DOM-free: scene-as-data, `solidity = f(geometry, style)`,
  the carried-Figure physics, and the two gestures. No rendering.
- `index.html` — canvas renderer + touch input; imports the engine.
- `engine.test.mjs` — headless solvability proof. Run: `node engine.test.mjs`.

## Built / not built

**In:** menu→zoom-fall→vignette, charcoal (rub) + pixel (tap), swipe/wheel switching,
carried physics, win→changed menu, hint ladder, soft "destabilise" on rapid switching,
**two vignettes** (Lantern Frame · Lantern, Relit) with the second unlocked on win.

**Deferred (per GDD):** Neon/Oil/Collage, Fixative, audio, save, the other menu skins,
the third vignette, narrative. Staged in after this engine proves fun on a thumb.
