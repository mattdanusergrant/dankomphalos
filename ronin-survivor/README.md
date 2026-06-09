# Ronin Survivor

A *Vampire Survivors*–style horde-survival auto-battler with an **Afro Samurai–inspired** theme (theme *inspired by*, deliberately legally distinct — original title, original procedurally-drawn art). A lone afro'd swordsman holds his ground on a blood-red road: you only move, your blade swings itself, and the swarm never stops.

**Play it:** <https://mattdanusergrant.github.io/ronin-survivor/>

## Repo contents

- `index.html` — the prototype. Single self-contained file (vanilla JS/Canvas, no build step, no dependencies).
- `design-docs/GDD.md` — design doc v0.1 (pillars, core loop, prototype scope, balance knobs, open questions).
- `.github/workflows/pages.yml` — auto-deploys `index.html` to GitHub Pages on every push to `main`.

## How to play

- **On a phone:** open the hosted URL above.
- **Locally:** open `index.html` in any browser, or `python3 -m http.server` from the repo root and visit `http://localhost:8000`.

**Controls:** **Move** with WASD / arrow keys, or **drag anywhere** on a touchscreen (a virtual stick appears). That's the only input — your weapons fire automatically. Walk over glowing **ki** to fill the level bar; on level-up, **tap a boon** to draft it. Don't let enemies touch you. Pause with **Esc/P** or the **II** button.

**Goal:** survive as long as you can. Difficulty rises with the clock; a **warlord** arrives every minute. Build toward a screen-clearing storm of steel and spirit-fire before the swarm overwhelms you.

## What's in the prototype

- Move-only control (WASD/arrows, or drag-anywhere virtual joystick on touch)
- 4 auto-firing weapons × 6 levels (Katana Sweep, Throwing Stars, Ki Wave, Spirit Blades)
- 7 stackable passives
- Level-up boon draft (3-of-N, pauses time)
- Time-scaled swarms; warlord boss every 60s
- Hit-juice (flash, knockback, damage numbers, sparks, screen-shake, i-frames)
- Title / pause / game-over-with-stats flow

## What's not in the prototype yet

Audio, meta-progression between runs, weapon evolutions, multiple characters/stages, a victory condition, save/persistence — see the GDD's open questions and next steps.

## Enabling GitHub Pages (one-time)

The workflow at `.github/workflows/pages.yml` deploys the prototype to Pages automatically, but the repo's Pages source has to be set to **GitHub Actions** once:

1. Repo **Settings → Pages**
2. *Build and deployment* → Source: **GitHub Actions**

After the next push to `main`, the site goes live at `https://mattdanusergrant.github.io/ronin-survivor/`.
