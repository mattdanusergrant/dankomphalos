# Keep Ripping Packs

An incremental clicker about cracking trading-card booster packs, sorting the
spill into a sand pile, and selling completed sets on a live market — across
**30 years** of a fictional cryptid TCG.

**Play:** https://mattdanusergrant.github.io/ripping-packs/

## How to play

You start with **one sealed case** (6 boxes = 216 packs) on the house.

1. **Click the pack** (or type the word above it) to rip a booster. Each pack
   spits 10 cards into the sand pile — green grains are Standards, blue are
   Rares, rainbow-shimmer are Foil Standards. Premium pulls (Epic, Legendary,
   Mythic, foils) skip the pile and go straight into your priced inventory.
2. **Sort the pile** by clicking grains. The clicked grain detonates with a
   `+` blast that consumes its orthogonal neighbors. Rares chain-detonate
   4 cells in every cardinal direction; foils chain 8. A click on a dense
   cluster can sweep the whole pile in one go.
3. **Craft Sets** when you've collected one of every card in a rarity. Each
   rarity has its own foil and non-foil track (10 craft tracks total).
4. **List crafted Sets** on the marketplace. Listings resolve on a 10–20s
   cooldown for cash. The cap is 10 active listings; upgradeable.
5. **Vault Complete Sets** — combine 5 per-rarity Sets into a non-foil
   Complete Set ($4,000 baseline / 50 CLOUT) or 5 foil Sets into a Complete
   Foil Set ($120,000 / 500 CLOUT). Vault is **one redemption per (year ×
   foil-variant), ever** — the long-game collection arc is 60 total claims
   across all 30 years.
6. **Reinvest** in:
   - More packs / boxes / cases ($3 / $100 / $500 for current-year stock)
   - **Sorters** ($1,000 each, max 3) that auto-process the pile
   - **Rip homies** ($20 + 1 box) that crack packs for 108 seconds
   - **Craft homies** ($20) that auto-craft a rarity's Sets for 8 minutes
   - CLOUT upgrades — paint mode, listing slots, vintage shop slots

## Vintage shop

A 5-slot row of randomly-rolled past-year offerings — packs, boxes, and (rare)
cases — refreshing on a 5-minute cooldown after purchase. Year roll skews
toward recent years (Set 29 ≈ 18%, Set 1 ≈ 1%); type roll skews toward packs
(80% / 16% / 4%). Buying any vintage pack **unlocks** that year in the picker.

Once a year is unlocked, switch to it via the dropdown to rip what you bought.
The regular buy buttons only sell current-year stock — vintage years are
exclusively serviced by the vintage shop, so every old-year session starts
there for resupply.

Vintage prices are steep — a Set 01 case is $15,000 — but vintage Complete
Sets give scaled-up CLOUT (Set 01 Foil Complete vaults for **1,515 CLOUT**,
the apex of the collection arc).

## Sound

11 synthesized SFX (Web Audio API, no asset files) hook into every gameplay
event — sale chime, pack rip, sort tick, foil sparkle, mythic fanfare, craft
arpeggio, vault tone, buy/switch/unlock confirmation, error thud. The 🔊
toggle in the header mutes everything; the ⚙ Settings panel exposes a
volume slider. Preferences persist in localStorage.

## Big-pull reveal

Manual rips that produce a **Foil Mythic**, **Mythic**, or **Foil
Legendary** trigger a full-screen takeover: a back-facing card flips
over to reveal the pull, with a rarity-tinted face (and a holo shimmer
for foils). Each tier fires at most once per page-load so consistent
mythic hitters aren't fatigued. Click / Esc / Space / Enter dismisses
early; otherwise it auto-fades after 4.5 s. Reduced-motion mode skips
the flip and shimmer.

## Tutorial

Fresh saves get a 5-step coachmark walkthrough (welcome → rip → sort →
craft → done). Each action step auto-advances when the player completes
the action (first rip / first 10 sorts / first set craft). Skippable any
time, and never re-shown after dismissal. Existing saves are treated as
veterans and skipped silently.

## Achievements

The 🏆 button in the header opens an achievements modal with 18 lifetime
milestones across Opening, Foils, Crafting, Vault, Cash, CLOUT, and
Session. Unlocks fire a milestone log entry + sfx as they happen.
Locked rows show a progress bar against their target. Veteran saves
silently grant any already-earned milestones on first load instead of
spamming the log.

## Statistics

The 📊 button in the header opens a Statistics modal with lifetime totals
— packs opened, foils pulled (with rate), Sets crafted, Complete Sets
vaulted, lifetime cash earned, biggest single sale, CLOUT earned/spent,
time played, and first-played date.

## Settings

The ⚙ button in the header opens a settings modal with:

- **SFX volume** slider (0–100%) and mute toggle
- **Reduced motion** — flattens CSS animations and transitions for
  motion-sensitive players
- **Save export/import** — base64 blob round-trip for backups or
  cross-browser transfer
- **Reset** — wipes save and Game Design overrides (was previously a
  header button; moved here so it's less easy to hit by accident)

## Run locally

Open `index.html` in any modern browser. No build step, no dependencies.
Saves live in localStorage per-browser.

## Tuning sandbox

Press **Game Design** in the header to open a modal that exposes every
constant (drop rates, baselines, costs, intervals, capacities) as a numeric
input. Edit, Apply & Reload to restart with the new values — overrides
persist per-browser. **Reset** wipes the save entirely.

See [`GAME_DESIGN.md`](./GAME_DESIGN.md) for the full design doc.

## Status

Playtest build. Single HTML file, ~5,500 lines of inline JS + CSS, no
dependencies. Recently shipped: multi-set system (30 years), vintage shop,
craft homies, audio module, no-singles economy retune, sorter rework.
