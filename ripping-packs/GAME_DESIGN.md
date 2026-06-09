# Keep Ripping Packs — Game Design Document

A single-file browser idler about cracking trading-card booster packs, sorting the sand pile, and selling completed sets on a live market. Built as one HTML file with vanilla JS + CSS. All gameplay state persists in `localStorage`.

> **About this doc.** Sections 1–19 below describe the **original design vision** that the prototype was built against — a multi-set economy with 10-card packs and a single click-AoE sorting mode. The actual shipping prototype has diverged significantly during balancing. **Section 0 (immediately below) is the source of truth for current behaviour.** Where a later section conflicts, treat the §0 description as authoritative.

---

## 0. Current implementation (live)

### Scope
- **Single set, 36 cards**: `SET_SIZES = { standard: 18, rare: 9, epic: 3, legendary: 3, mythic: 3 }`. The multi-set / vintage system described in §19 is paused (`CURRENT_SET_ID = 1`, `setAgeMult` returns 1×).
- **15-card packs**: `PACK_COMMON_SLOTS = 14` standards + `PACK_RARE_SLOTS = 1` rare-slot. With probability `FOIL_PER_PACK = 0.005` (1 in 200) a common slot is replaced by a foil-sheet pull.
- **Pack cost** $3, box $100, case $500.

### Pack rolls — print-sheet model
The old `PACK_FOIL_CHANCE` + `PACK_UPGRADE_CHANCE` + `RARE_PLUS_WEIGHTS` system is gone. Drop rates now come from physical print sheets plus slot weights:

- One **per-rarity sheet** in `PRINT_SHEETS` (non-foil) and `FOIL_PRINT_SHEETS`. Each sheet has `{ prints: N }` per card; sheet area = `SET_SIZES[r] × prints[r]`. Defaults are 144 slots / sheet (12×12 grid); `auditPrintSheets()` warns if a sheet isn't a sensible rectangle.
- **Per-card prints don't affect drop rates** — they only set sheet dimension. Card-id selection within a rarity is uniform.
- What rarity a slot lands on is controlled by **slot weights**:
  - `RARE_SLOT_WEIGHTS` = `{ rare: 0.75, epic: 0.12, legendary: 0.08, mythic: 0.05 }`
  - `FOIL_SLOT_WEIGHTS` = `{ standard: 0.67, rare: 0.25, epic: 0.04, legendary: 0.03, mythic: 0.01 }`
- Per-pack rate of a specific (rarity, foil) card = `slots_of_that_kind × weight[r] / SET_SIZES[r]`.

### Pricing — derived from drop rates
Hand-tuned `BASELINE` prices are gone; baselines compute from drop rates:

```
K           = PACK_COST · VALUE_MULTIPLIER / total_unique_printed_cards
singleCard  = K / specificCardRatePerPack(rarity, foil)
setBaseline = N · singleCard · (1 + SET_BUNDLE_BONUS)
complete    = Σ component sets · (1 + COMPLETE_SET_PREMIUM)
```

- `VALUE_MULTIPLIER` (default 1.0) is the **pack EV ÷ pack cost** ratio. At 1.0 ripping is exactly break-even on expected card value.
- `SET_BUNDLE_BONUS` (default 0) is the premium for selling a Set vs. its singles. Currently 0 — there is no singles market.
- `COMPLETE_SET_PREMIUM` (default 0.25) is the apex-Set crafting bonus.

Market price still scales each baseline by NPC scarcity (`marketPriceFor`), clamped between `PRICE_FLOOR_RATIO` and `PRICE_CEIL_RATIO`.

### Sorting — four interaction modes
The single click-AoE sort described in §4 has been replaced by **four switchable modes**. Click the hint text under the unsorted pile to rotate them; `SORT_MODE` in the Game Design panel persists the choice.

| Mode | `SORT_MODE` | How it clears |
|---|---|---|
| Hover and click | `hover_and_click` | Dwell to mark grains (`HOVER_DWELL_MS`, cap `MAX_HIGHLIGHTS`), click to clear all marks. No chain. |
| Hover and move | `hover_and_move` | Moving the cursor clears `SORT_MOVE_GRAINS` (1) nearest grains in `SORT_MOVE_BASE_RADIUS` (0.6c) every `SORT_MOVE_COOLDOWN_MS` (120ms). No chain. |
| Hover and pulse | `hover_and_pulse` *(default)* | A pulse fires every `SORT_PULSE_MS` (1400ms) clearing `SORT_PULSE_GRAINS` (5) nearest grains in `SORT_PULSE_BASE_RADIUS` (1.1c). No chain. |
| Click and chain | `click_and_chain` | Click finds the nearest grain within `SORT_CHAIN_CLICK_RADIUS` (1c, "hunt and peck"). Cleared grains propagate by type (cascading): standards roll per-direction chance (`SORT_STD_CHAIN_CHANCE = 0.25`, hard cap `SORT_STD_CHAIN_CAP = 0.95`, never 100%); rares chain `SORT_RARE_CHAIN_DIST` (2) in a random axis (50/50); foils chain `SORT_FOIL_CHAIN_DIST` (2) in all 4. |

Only `hover_and_click` and `click_and_chain` respond to canvas clicks; the other two ignore clicks (mode-specific guard in the click handler).

### Sorting upgrades
Each mode has its own **cash-cost** upgrade tree (3 subtracks × 6 escalating nodes), opened via "⬆ SORTING UPGRADES" above the unsorted pile. The button always targets the active mode's tree.

| Mode (branch) | Subtracks |
|---|---|
| `sort_click` | Max marks · Cursor radius · Marking speed |
| `sort_move` | Cursor size · Clear speed · Cards cleared |
| `sort_pulse` | Pulse rate · Pulse radius · Cards cleared |
| `sort_chain` | Std chain chance · Rare chain dist · Foil chain dist |

The old PAINT/CLOUT marking tree from §6 has been retired. LISTINGS (still CLOUT) is the only remaining non-sorting branch.

### Debug mode & Balance Tuner
- Toggle **Enable Debug Mode** at the top of the Game Design panel (persisted in `ripping_packs_debug_mode`). Reveals the advanced design form, exposes header chip currency injectors (click CASH → +$100,000, click CLOUT → +100), and shows a **FILL BULK** button under the activity log.
- The **Balance Tuner** inside the Game Design panel surfaces every tuned-during-balancing knob (slot weights, pack composition, pricing) as live inputs — edits apply to the running game instantly, persist, and refresh a preview table of per-pack odds + single/Set prices + pack-EV ratio.
- The same Balance Tuner is served standalone on mobile/touch devices in place of gameplay (which is desktop-only by design — the sort modes need a mouse).
- The **Reset** button now also clears debug mode in addition to the save and design overrides.
- The sort-mode cycler (click the hint text) works regardless of debug state.

---

## 1. Pitch

> *Open packs. Watch cards rain into a pile of colored sand. Click the sand (or type the right keys) to sort. Spot the rare and foil grains and crit your sort. Craft full sets. List them on a live drift market with a 10-slot cap. Buy sorting machines and hire "Homies" to grind for you while you chase the next legendary.*

The fantasy is the **pack-opening loop**, dramatized: pulls drop physical-feeling grains into a sand pile, sorting reads as a tactile act (click into a grain mix and time it right for a crit), and selling is a tiny live market with drifting prices and a finite shelf.

---

## 2. Core Loop

```
BUY → RIP → SORT → CRAFT → LIST → SELL → BUY ...
```

1. **Buy** packs, sealed boxes, or cases from the shop.
2. **Rip** a pack — input modes routing into the same `ripOne()`:
   - **Click** the booster (manual single rip — always available)
   - **Type** the on-screen prompt word (post-unlock — see §8)
   - **Hover** the booster — passive autorip every `HOVER_AUTORIP_MS` (default 1s). Gated behind `eff().packAutorip`; no CLOUT node grants it yet, so dark by default. Pre-wired for a future upgrade.
   - **Hold** mouse button on the booster — autorip rate **doubles** to every 500ms while held. Gated behind `eff().packAutoripHold` (which also requires `packAutorip`). Same future-upgrade hook.
3. **Sort** the unsorted pile by clicking the sand canvas — every click detonates the nearest grain plus a 4-orthogonal AoE, and any non-standard caught in the blast chain-explodes (rares trigger a `RARE_BLAST_REACH`-cell "+" arm, foils trigger a `FOIL_BLAST_REACH`-cell "+" arm; see §4).
4. **Craft** Standard / Rare / Foil Standard sets when you've collected one of every card in that rarity.
5. **List** crafted sets on the marketplace, max 10 active listings.
6. **Sell** — each listing resolves on its own cooldown for the current market price.
7. **Reinvest** profits into more packs, Sorters ($1,000 each, permanent), or Homies ($20 + 1 box, temporary).

The pack's CTA tag rotates every 30s through whatever rip modes the player has actually unlocked (`activeCtaMessages()`) — so until the autorip upgrades are granted, it stays parked on "CLICK TO RIP" rather than advertising modes that do nothing. Once enabled, the autorip system uses `canRip()` to gate each tick (empty supply / full pile silently no-ops instead of spamming the error SFX) and a window-level `mouseup` catches the "press → drag off pack → release" case so the doubled rate can't get stuck on.

> **Multi-set context.** The game ships with 30 yearly sets (2001 – 2030). The
> sections below describe the loop *within an active year*. Set 30 is the
> current year and the only one unlocked at fresh-boot — older years (the
> "vintage shop") open up as you craft Complete Sets. The cross-year
> structure, pricing curve, CLOUT scaling, and per-year state buckets are
> covered in detail in **§19 Multi-Set / Vintage System**.

---

## 3. Cards & Rarities

Each booster pack contains **10 cards**: 9 standards + 1 slot that upgrades through a rarity chain (Standard → Rare → Epic → Legendary → Mythic). Every card slot independently rolls a foil chance and an additional upgrade chance.

### Set sizes (unique card IDs per rarity)

| Rarity     | Set size | Grid layout      |
|------------|----------|------------------|
| Standard   | 36       | 2 rows × 18      |
| Rare       | 18       | 1 row            |
| Epic       | 9        | 1 row            |
| Legendary  | 6        | 1 row            |
| Mythic     | 3        | 1 row            |

Foil variants exist for every rarity (separate card identities).

### Inventory model — *priced* vs *bulk*

- **Bulk (sortable):** Standard, Rare, and Foil Standard cards. These never have per-card market prices. They flow through the unsorted pile → sand-sort → per-id buffer, and only liquidate by crafting a full Set into a market item.
- **Priced (per-id market):** Epic, Legendary, Mythic, and foil variants of Rare/Epic/Legendary/Mythic. These go straight into a per-id inventory and can be listed individually by clicking their cell in the collection grid.

---

## 4. Sand Pile + Sorting

Newly pulled bulk cards drop into the sand canvas as **colored grains** — green for standard, blue for rare, rainbow-shimmer for foil standard. Each grain represents one card stacked physically in the pile.

### Click-to-detonate

Sorting is purely positional — there's no "pull random cards from the top." Every sort is a click that detonates a grain in the pile.

1. Click → search a 4-cell (`SORT_CLICK_RADIUS_CELLS`) Manhattan diamond around the click for the nearest grain of any type. If none, the click does nothing.
2. **Wave 0 (click AoE):** the seed grain plus its 4 orthogonal neighbors are destroyed. Every non-standard cell destroyed here is queued as a wave-1 detonator.
3. **Wave N+1 (chain):** every queued detonator triggers its own type's blast — both follow a clean "+" ray shape (no diagonals):
   - **Rare** → `RARE_BLAST_REACH` (default 3) cells along each cardinal axis.
   - **Foil Standard** → `FOIL_BLAST_REACH` (default 6) cells along each cardinal axis. Foils explode bigger.
4. Standards in any blast are consumed but don't propagate the chain.
5. Each destruction spawns an **expanding pop** in the rarity's color on the canvas. Waves are spaced by `CHAIN_STEP_MS` (90ms) so each pop reads.
6. **Every destroyed grain is fully sorted** — set progress, collection flash, market-key tracking, same as the old hand-sort.
7. After the chain finishes, the pile gravity-settles: every surviving grain above a destroyed cell becomes a falling grain at its previous visual Y and physics-falls down to fill the gap.

Outcomes:
- Click on a pure-standard area: just **5 cards** sorted (seed + 4 orthos).
- Click on a lone rare: 5 cards from the click AoE + 4 × `RARE_BLAST_REACH` (12 at default) from the rare's "+" arm — minus the overlap with the click AoE.
- Click on a lone foil: 5 cards from the click AoE + 4 × `FOIL_BLAST_REACH` (24 at default) from the foil's "+" arm — minus overlap.
- Click into a chain of orthogonally-connected rares: ripples outward along the connecting rares, each adding another rare blast.
- Click on a mixed cluster: the foil's longer "+" reach can pull in another non-standard several cells away that wouldn't be reachable from a rare alone.

### Unsorted cap

`UNSORTED_CAPACITY = 1000` cards. The grid is `50 × 25 = 1250` cells deliberately oversized so a full pile (capped at 1000) leaves a few rows of visual headroom above the highest peak. The pack opener refuses to rip when the active year's pile is at cap; the typing mini-game silently drops keys.

---

## 5. Crafting Sets

When `bulkInvById[key]` holds at least 1 of every card ID in a rarity, a glowing **CRAFT … SET** button appears in the vault's tracking row for that rarity. Crafting:

- Consumes 1 of every card ID (per-rarity set completion drops to 0)
- Decrements `state.stock[rarity]` (or `state.stockFoil.standard` for foil track)
- Adds 1 to the matching Set item key (`standardSet` / `rareSet` / `foilStandardSet`)

### Set baselines (market items)

Every rarity (bulk and priced, foil and non-foil) has its own craftable Set item — 12 tracks total (10 per-rarity + 2 Complete Sets). All Set baselines are **explicit** — there are no per-card market prices, so Set value isn't derived from singles. Each Set baseline reflects the long-horizon cash value of completing that whole rarity. Expected packs-to-complete drives the scale:

| Set                  | Set size | ~Packs to complete | Baseline $ |
|----------------------|---------:|-------------------:|-----------:|
| Standard Set         | 36       | ~50                | $50        |
| Rare Set             | 18       | ~50                | $150       |
| Epic Set             | 9        | ~250               | $300       |
| Legendary Set        | 6        | ~600               | $700       |
| Mythic Set           | 3        | ~2,500             | $2,000     |
| Foil Standard Set    | 36       | ~250               | $500       |
| Foil Rare Set        | 18       | ~2,500             | $2,000     |
| Foil Epic Set        | 9        | ~12,500            | $7,000     |
| Foil Legendary Set   | 6        | ~30,000            | $20,000    |
| Foil Mythic Set      | 3        | ~125,000           | $60,000    |
| **Complete Set**     | (sum of 5 non-foil) | sum after all 5 rarities done | $4,000  (~1.25× sum) |
| **Foil Complete Set**| (sum of 5 foil)     | sum after all 5 foil rarities done | $120,000 (~1.34× sum) |

`SET_CRAFT_MULTIPLIER` (default `1.0`) is a **global Set-price multiplier** applied at price time across every Set listing. The "Premium Sets" upgrade node bumps it by +0.10 → +10% sell price for every Set you list, current-year or vintage. Floor of 0.1 in the design panel (can't go below 10× discount).

> **Why the new shape?** Earlier iterations let you list individual cards (mythics, foil rares, etc.) for cash, and the per-rarity Set baseline was a +15% premium over selling singles. When single listings were retired, the per-card values became economically dead — the player's only cash exit is a Set listing. The new baselines re-ground the economy on "what does this rarity earn you over its grind?" with a long-horizon target of ~$4/pack revenue (vs $3/pack cost). See **§19.5** for how the vintage shop scales these on top.

---

## 6. Marketplace

A 10-slot, single-tier market. Each slot holds one listing — either a priced single (mythic, non-standard foil) or a crafted Set.

### Listing tiles

Listings render as 30px miniature trading cards:
- Rarity-tinted background + border + glow
- Small rarity glyph in the top-left corner
- **Big centered price** (compact format — `$42`, `$1.5k`, `$25k`)
- Tiny card ID along the bottom (or `SET` for crafted sets)
- Gold countdown badge in the top-right
- Full unabbreviated price + rarity label in the `title` attribute for hover

Set listings get a stacked-cards illusion via offset shadows. Foil listings shimmer with a rainbow gradient. Empty slots render as dashed `+` placeholders so the slot cap is visible.

### Pricing & cooldown

Every listing posts at **1× current market price**. Resolve cooldown is uniform in `[LISTING_COOLDOWN_MIN, LISTING_COOLDOWN_MAX]` (default 10–20s). Every listing eventually sells.

Click a listing tile to **cancel and return** the card/set to inventory.

### Cap behavior

When 10 slots are full:
- The collection-grid click-to-list path shows "All 10 listing slots full" and refuses
- The vault's `LIST` buttons swap to `SLOTS FULL` text and disable

---

## 6b. Collection cells

The collection grid is now a pure visual progression tracker — 18px-wide cells that display only ownership, nothing else. No card numbers, no prices, no count badges, no listed stars. Owned cells fill with the rarity color (and shimmer for foils); unowned cells stay as faint outlines. Newly-collected cells animate via the existing card-pop flash.

**Listing singles is gone.** The only way to monetize cards is to complete a rarity's Set and craft + list that Set via the marketplace. So mythics, foil rares, foil epics, etc. all funnel through Set crafting now — no more impulse-listing a lucky pull.

---

## 7. The Sand Pile — Visualization

`spawnSandFromPulls()` creates falling grains for each newly opened bulk card, with staggered Y offsets so they read as a sand-fall stream. Grains physics-fall down a column until they hit the existing pile height. `stepSandAnim` runs on `requestAnimationFrame` whenever there's motion or a foil-standard grain is in the pile (which keeps its color shimmer animating).

Foil standard grains rotate through HSL hues every ~24ms — they visibly sparkle in the pile.

---

## 8. Typing Mini-Game

A typing zone under the pack opener shows a 3–7 letter word from a curated thematic list: `rip, tear, pack, open, more, another, cards, rare, epic, legendary, mythic, foil, sealed, booster, holo, shiny, gem, hit, chase, pull, bust, crack, slab, mint, vault, set, collect, score, pile, drop, stack, deck, binder, graded, case, box, spread, lucky, hot, fresh, shred, sort, homie, sorter, go`.

- The next-letter slot pulses white with a gold underline
- Each correct keystroke calls `ripOne()` — if a pack actually opens, the letter flashes (gold → white scale-up → gold) and advances
- Wrong keys are ignored silently
- If supply is empty or the unsorted pile is full, the press is dropped (no advance, no pack consumed) — the game self-throttles
- Word completes → 280ms beat → new word picked

The handler is suppressed when focus is on an input/textarea or any modifier is held, so the Game Design panel and other text inputs still work normally.

### 8a. First-session gates

Three player-facing surfaces are hidden on a fresh save and unlock progressively, so the first session is just the core current-year loop instead of a wall of widgets:

| Gate | What it hides | Unlock condition | State field |
|------|---------------|------------------|-------------|
| **Type-to-rip** | the typing mini-game (replaced by a pink→gold "KEEP RIPPING · X%" progress bar that fills 1% per manual `ripOne()`) | 100 manual rips (`TYPING_UNLOCK_RIPS`) — homie rips don't count | `state.manualRips` |
| **Year picker** | the `<select>` dropdown (replaced by a static label `The 2030 Set` with identical chrome) | First successful `craftCompleteSet()` (foil OR non-foil) | `state.firstSetCrafted` |
| **Vintage Packs shop** | the entire `#vintage-shop` widget incl. its `⬆ VINTAGE` upgrade trigger | Same flag — `state.firstSetCrafted` | (shared with year picker) |

Each unlock fires `SFX.unlock()` + a hint message. `handleTypingKey` silently drops keys pre-unlock so the player can't accidentally rip-by-leaning on the keyboard. `renderTypingZone` bails before building the per-letter word DOM until unlocked. Both state fields persist in the save and backfill from prior progress in `load()` — but `firstSetCrafted` is **recomputed unconditionally** every load from complete-set evidence (invById complete-set keys, vaultedSets, and the `completeSetCrafts` / `foilCompleteSetCrafts` lifetime counters), so saves that were unlocked under an older "any per-rarity Set" rule re-lock cleanly until a real Complete Set lands.

**Typing-unlock celebration.** The 100th manual rip doesn't snap straight from bar → typing UI. The bar instead pins at 100% with an "UNLOCKED!" label, shakes, flashes white-hot, and explodes outward (1.2s, `TYPING_CELEBRATE_MS`) while a confetti burst spawns from the bar's centroid. The `#typing-zone` container is locked to `min-height: 64px` so the swap from bar → typing UI doesn't shift anything below it. After the timer fires, `bar.hidden = true` is the actual hide — a `.rip-progress[hidden] { display: none; }` rule had to be added so the `[hidden]` attribute outranks the element's own `display: flex`.

---

## 8b. CLOUT — vault a Complete Set, once per variant

CLOUT comes from one path only: **vaulting a Complete Set**. There are two flavors split by foil status — foil first in the UI since it's the rarer prize:

| Set                  | Ingredients (5 each)                                           | List $    | Vault → CLOUT (Set 30) |
|----------------------|----------------------------------------------------------------|-----------:|------------------------:|
| **Complete Foil Set**| foilStandardSet, foilRareSet, foilEpicSet, foilLegendarySet, foilMythicSet | $120,000 | 500 |
| **Complete Set**     | standardSet, rareSet, epicSet, legendarySet, mythicSet         |  $4,000   |  50 |

**Each vault redemption is once per (year × foil-variant), ever.** The full game holds 30 years × 2 variants = **60 total CLOUT vault claims** for a player who chases every set across every year. Subsequent crafts of the same variant can still be listed for cash, just not re-vaulted — the VAULT button reads "VAULTED ✓" in gold once the variant is claimed and is permanently disabled.

The design intent: CLOUT pulls the player toward a "complete the whole game" collection arc rather than grinding one easy set on repeat for infinite progress.

Vintage years multiply the CLOUT reward by `cloutScaleFor(setId) = 1 + (30 − setId) × 0.07` — see §19.5. Set 01's Complete Foil Set vaults for **1,515 CLOUT** at the apex.

Each Complete Set crafted lands in `state.sets[setId].invById[key]` and can be:
- **Vaulted** (first time only) — consumes the Complete Set, grants scaled CLOUT.
- **Listed** for cash at the marketplace baseline (~$4k non-foil / ~$120k foil at Set 30, scaled for vintage years).

Per-rarity sets have no vault path — they're ingredients (or cash, via LIST). Both Complete Set rows sit at the top of the marketplace column, foil first; the foil row gets a rainbow border + shimmering label, the non-foil row uses a gold accent. Each row's CRAFT button shows `X/5` ingredient progress until all five are held, then lights up.

### Sorter upgrades — cash, not CLOUT

Sorter speed + buffer upgrades are paid in cash from each sorter card's `⬆ $X` button (see §9). They never showed up in the CLOUT tree.

### CLOUT upgrade tree — three branches

| Branch | Nodes (CLOUT cost) | What it does |
|--------|-------------------|--------------|
| **MARKING** | Steadier Hand (8) → Wider Sweep (25) → Pile Mastery (80) → Steady Aim (250); Bigger Brush (100) → Massive Brush (300) → Mop Brush (700); Quick Eye (40) → Snap Focus (120) → Reflexes (350) | +max highlight marks, +cursor radius, −marking-mode dwell time |
| **LISTINGS** | Side Hustle (5) → Shop Front (20) → Storefront (60) → Online Empire (200) | +1 / +1 / +2 / +3 marketplace slots |
| **VINTAGE** | Curator's Pick (50) → Faster Restock (100) → Estate Sale (200) → Box Hunter (350) → Time Traveler (600) | +slots / −60s refresh / +slot / box+12 case+6 weight / +slot −60s |
| **CREW** | Apprentice (40) → Crew Member (120) → Full-Time Staff (350) | +1 / +1 / +1 homie pool (shared by rip + craft homies) |

The VINTAGE branch was previously called MARKET — it's been fully retargeted at the Vintage Packs shop. Earlier MARKET-branch effects (listing cooldown delta, NPC absorb delta, Set craft multiplier delta) are no-op delta hooks that still exist in code but no node carries them anymore.

**CLOUT is a spendable balance**, not a running total. The header violet chip shows `N CLOUT · UPGRADES` and opens the upgrade grid modal. The resource colors are now: **CASH** = dollar-bill green (`--cash: #85bb65`), applied to the hero chip and every USD label across the UI (pack/box/case prices, vintage prices, sorter shop, sell-prices, LIST buttons); **CLOUT** = violet (`--clout: #b35dff`), applied to the hero chip, the small ⬆ upgrade triggers, the upgrades modal title/balance/border/cost lines, and the VAULT button. Gold (`--gold`) remains the generic UI accent for non-money chrome: typing letters, hint text, sorter chrome, focus rings, completed-milestone markers, etc.

Modal UI: three columns (one per branch), each node card shows its name, effect, cost, and status — **owned** (gold border), **available** (pink pulse, clickable), **unaffordable** (dim pink), **locked** (dashed, prereqs unmet).

---

## 9. Helpers — Homies & Sorters

Three kinds of helper: **rip homies** (auto-rip packs), **craft homies** (auto-craft and auto-list a rarity's Sets), and **sorters** (auto-process sand-pile grains). All three are *year-pinned* — they record the active set at hire/install time and only ever touch that year's bundle, even if the player switches active.

### Shared homie pool + tables

Both rip and craft homies draw from a **shared token pool** (`state.homiePool`, capped at `homiePoolMax()`):

- **Base pool size** = `HOMIE_POOL_BASE` (default **1** — fresh saves start with a single homie). Hiring any homie consumes one token; expiry refunds one token back to the pool.
- **Pool growth** has two independent paths:
  - The CLOUT **CREW** branch (see §8b table): three nodes (Apprentice → Crew Member → Full-Time Staff) at 40 / 120 / 350 CLOUT, each +1 pool. Purchasing a node immediately refunds the new headroom into the current pool.
  - **First-craft milestones** — lifetime flags (`state.craftMilestones` / `craftMilestonesFoil`) flip true the first time the player (or a craft homie acting on their behalf) crafts a Set of each rarity in each variant. 5 non-foil + 5 foil = 10 milestones, each +1 pool, immediately deposited as an IDLE 🧢. Decoupled from per-year `setsCelebrated` so switching years can't double-grant. Pre-milestone saves are backfilled from `setsCelebrated` / `setsCelebratedFoil` across all years so no earned labor is lost.
- **Cap:** `homiePoolMax()` = `HOMIE_POOL_BASE + crew + milestones`, clamped to `HOMIE_MAX` (12). Today that's 1 base + 3 CREW + 10 milestones = 14 raw → clamped to 12; the 12th slot is the "final homie" whose unlock condition is TBD.
- A header **HOMIES** chip (cyan, between CLOUT and the sound toggle) shows `available / max`. Greys out when empty.
- An **IDLE** window in the left gutter of the booster-pack area renders one bobbing 🧢 emoji per available pool token (not just a number) so the player can see their bench at a glance. Stack staggers its bob via `:nth-child` animation delays.

Every homie slot — the 12 rip-homie sprites flanking the booster pack (two lanes per side, three vertical tiers each) AND the 5 craft-homie slots on the rarity rows — is a **table** the homie sits at. Tables unlock **sequentially** along a single 17-step path: the 6 inner-lane rip slots first (center-out order `1, 4, 0, 3, 2, 5`), then the 5 craft-homie rarities low-to-high (`standard → rare → epic → legendary → mythic`), then the 6 outer-lane rip slots in the mirroring pattern (`7, 10, 6, 9, 8, 11`) as an endgame scale-up.

Players start with **zero tables bought**. The very first slot — rip slot 1 (left-middle of the pack) — renders as a `🪑 BUY TABLE · $100` chip; every later slot is hidden. Buying the current next-in-line table costs a flat `TABLE_COST` (default **$100**, tunable) and **reveals the next slot** as the new purchaseable chip. The newly-revealed slot still needs its own table buy before it can be hired into — visibility and functionality are separate steps. Tables persist forever once bought.

The cascade: spend $100 → first rip table opens → spend $100 → second rip table opens (slot 4) → ... → after the 6th rip table → Standard craft table appears → spend → Rare craft → ... → final Mythic craft table.

For rip slots, locked-but-not-next-in-line renders nothing at all. For craft slots, locked-but-not-next renders an invisible placeholder so the 3-column rarity-row grid stays aligned with the rows above and below.

### Rip Homie — temporary auto-ripper

- **Cost:** $20 + 1 sealed box (consumed from the active year's stash) + 1 homie token from the shared pool
- **Effect:** spawns an animated 🧢 sprite at the clicked table with a live progress bar; auto-rips one pack every 3s from its personal 36-pack pool
- **Lifetime:** until the box is empty (~108s total, faster with multiple homies — up to 12 tables once the player has bought through the outer lane, but always capped by available pool tokens)
- **Slot selection:** clicking an empty table hires *that specific table*, not the lowest free one
- **Year binding:** homie remembers `setId` at hire; if you switch years mid-job, they keep ripping the original year silently in the background (no canvas spam, no SFX leakage)

### Craft Homie — temporary per-rarity auto-crafter (NEW)

One slot per rarity row (5 total) sits between the rarity name and the foil/non-foil action stacks. Empty slots show `+ HIRE $20`; click to spawn a craft homie for that rarity.

- **Cost:** $20, no box required
- **Lifetime:** 2 minutes (`CRAFT_HOMIE_DURATION_MS`)
- **Single cooldown:** every `CRAFT_HOMIE_TICK_MS` (default 5s) the homie takes exactly **one action**, then resets the cooldown. List and craft share this one timer — there's no parallelism.
- **Decision tree (evaluated each cooldown cycle, top-down, first match wins):**
  1. List a **foil set** of the homie's rarity into an open marketplace slot.
  2. List a **non-foil set** of the homie's rarity into an open marketplace slot.
  3. Craft a **foil set** of the homie's rarity (consumes 1 of each foil card in the rarity).
  4. Craft a **non-foil set** of the homie's rarity (consumes 1 of each non-foil card).

  Listing is always prioritized over crafting. If none of the four conditions hold (marketplace full AND inventory dry, OR nothing left to craft), the homie no-ops, the cooldown holds, and the next tick re-evaluates. Listings are silent (no per-action hint or SFX) and use the standard baseline price.
- **Marketplace pressure:** with the unified cooldown, a jammed marketplace simply means every cycle that has nothing to list falls through to a craft (or a no-op). Inventory keeps building behind the jam; as soon as a slot frees up, the very next cycle starts draining it.
- **Cap:** one craft homie per (rarity × year). Hiring a duplicate is refused.
- **Disabled when nothing to craft:** the hire slot is greyed out unless the player has either (a) ever completed that rarity's foil or non-foil collection in the active year (`setsCelebrated[r] || setsCelebratedFoil[r]`) — permanent unlock — OR (b) currently has a craftable Set queued. Tooltip on disabled: *"Collect a full RARITY set before hiring a craft homie — nothing for them to do yet."* `hireCraftHomie()` re-checks the gate as defense in depth.
- **Visual:** when active, the slot shows a bobbing 🧢, a green countdown badge (`2m` → `45s`), and a green progress bar that drains over the 2-minute lifetime.
- **Year binding:** same model as rip homies — pinned at hire, mutations route through `withActiveSet(setId, …)`, silent if the player isn't viewing that year.

The 1Hz countdown repaint is an in-place DOM patch (`paintCraftHomieCountdowns`) — not a full vault rebuild — so the surrounding CRAFT / LIST buttons don't flicker or lose hover state every second.

### Sorter — permanent two-stage sorting machine

- **Cost:** $1,000 each, max **3** per save (`SORTER_MAX`)
- **Two buffers:** `input` (raw, manually loaded from the pile) and `output` (processed, ready to collect). The sorter only moves cards from `input` → `output`; it never reaches into the pile on its own.
- **Manual LOAD:** Click the blue **LOAD N** button to scoop *every grain in the pile* (bottom-up across all columns) into the sorter's input, capped by remaining capacity. The `N` shows the number that will actually be moved. Each loaded grain leaves a tombstone in the pile, and the rest of the pile gravity-settles down to fill the gaps.
- **Tick:** every `sorterInterval(level)` ms the sorter pops one grain from input (weighted by what's loaded) into output. With input empty, the sorter idles.
- **Buffer cap:** 500 at Lv 1 (`SORTER_BASE_CAPACITY`), +100 slots per buffer level (`SORTER_BUFFER_PER_LEVEL`). Counted across input + output combined. When at cap, LOAD refuses until you COLLECT.
- **Manual COLLECT:** click the gold-glowing **COLLECT N** button to flush output into stock — set-progress + flash animations fire as the cards land.
- **Year binding:** pinned at install. LOAD scoops the bound year's pile; COLLECT writes to that year's stock; both wrap in `withActiveSet(setId, …)`.

### Sorter row layout

Each sorter renders as a fixed-width row inside the sorters modal so columns align vertically when multiple sorters are stacked:

```
[ ⌛ hopper ] [ rate /s ] [⬆ SPD $X] [ ] [ ✓ sorted/cap ] [⬆ BUF $X] [ ] [ LOAD N ] [ COLLECT N ]
   64px        56px        78px      gap     100px           78px      gap    88px       88px
```

Color flow signals data direction: **blue ⌛ hopper** (going in) → **neutral rate** (process) → **gold ✓ sorted** (going out, **orange** when full).

### Sorter upgrades — split tracks

Speed and buffer are **independent paid tracks**, both capped at L10. Each track shares the same cost ladder: `BASE + STEP × (L − 1)` with `SORTER_UPGRADE_BASE_COST = $1,000` and `SORTER_UPGRADE_STEP = $1,000`.

| Level | Speed (cards/s) | Capacity | SPD upgrade | BUF upgrade |
|------:|----------------:|---------:|------------:|------------:|
| 1     | 1.0             | 500      | —           | —           |
| 2     | 2.0             | 600      | $1,000      | $1,000      |
| 3     | 3.0             | 700      | $2,000      | $2,000      |
| 4     | 4.0             | 800      | $3,000      | $3,000      |
| 5     | 5.0             | 900      | $4,000      | $4,000      |
| 6     | 6.0             | 1,000    | $5,000      | $5,000      |
| 7     | 7.0             | 1,100    | $6,000      | $6,000      |
| 8     | 8.0             | 1,200    | $7,000      | $7,000      |
| 9     | 9.0             | 1,300    | $8,000      | $8,000      |
| 10    | 10.0            | 1,400    | $9,000      | $9,000      |

Speed: `sorterInterval(level) = max(50, SORTER_BASE_MS / level)`. Interval floor 50ms.
Capacity: `sorterCapacity(bufferLevel) = SORTER_BASE_CAPACITY + (bufferLevel − 1) × 100`.

Per-sorter cost to fully max: $1,000 buy + $45,000 speed + $45,000 buffer = **$91,000**. Three maxed sorters = $273k — late-game commitment territory, on par with foil Complete Set listing income.

---

## 10. Boxes — Sealed Inventory

Boxes are an **owned resource**, distinct from loose packs. Both live per-year under `state.sets[setId].boxesOwned` and `state.sets[setId].packSupply`.

- Buying a Box: `+1` to that year's boxesOwned (no longer +36 loose packs)
- Buying a Case: `+6` boxesOwned (= `CASE_SIZE / BOX_SIZE`)
- Clicking the pack auto-cracks a sealed box into 36 loose packs when supply is dry (`maybeCrackBox`)
- Hiring a rip homie consumes 1 box from the active year and gives the homie a personal 36-pack pool (independent of `packSupply`)
- Supply readout: `Supply: N · 📦 M`

### Starter inventory

Fresh boot grants a full **case** (`CASE_SIZE / BOX_SIZE = 6` boxes = 216 packs) on the house, plus $50 coins. Earlier iterations gave a single box, but with foil completes and the no-singles economy, 36 packs wasn't enough to actually complete a sellable Set in the first session. A case gives ~$50–$150 of expected first-session revenue, enough to bootstrap into buy → rip → sort → craft → list.

Hint at boot: *"A case on the house — start ripping!"*

### Unsorted pile cap

`UNSORTED_CAPACITY = 1000` cards. The grid is `SAND_COLS × SAND_ROWS = 50 × 25 = 1250` cells — deliberately oversized vs the 1000 cap so a "full" pile (avg height 20) sits ~5 rows below the visible ceiling. The pack opener refuses to rip when the active year's pile is at cap; the typing mini-game silently drops keys.

### Click buffer

`SAND_BUFFER_ROWS = 1` reserved at the **bottom** of the canvas — grains never settle there, but clicks in that strip still hit the lowest grain in the column via the existing `SORT_CLICK_RADIUS_CELLS` Manhattan-radius search. Bottom-row picks used to require pixel-perfect aim at the canvas edge; the buffer adds a 10px tall "safety net" hit-zone beneath every column's lowest grain.

Canvas is `500 × 260` desktop, aspect-ratio `50/26` mobile (50 cols × 25 grain rows + 1 click-buffer row, 10px per cell). The buffer is purely visual — `SAND_ROWS` (grain capacity per column) is 25, but `UNSORTED_CAPACITY = 1000` caps the total fill before any column can actually reach 25. The three canvas-row → pile-row hit-tests (`findClickedGrain`, `cellsWithinRadius`, hover dwell) subtract `SAND_BUFFER_ROWS` to convert click coords back to pile indices.

---

## 11. Economy & Default Pricing

Pack/box/case costs:
- **Pack:** $3
- **Box:** $100 (36 packs worth, ~7% discount)
- **Case:** $500 (6 boxes worth, ~23% discount)

Pack/box/case prices scale linearly with set age in the **vintage shop** — `packCost(setId) = PACK_COST × (31 − setId)`. The regular buy buttons only sell current-year (Set 30) stock; vintage years are exclusively serviced by the Vintage Packs shop (see §19.4). A Set 01 vintage pack costs $90; a Set 01 case costs $15,000.

Market baselines — see §5 for the full per-Set table. Quick reference:

- Standard $50, Rare $150, Epic $300, Legendary $700, Mythic $2,000
- Foil Standard $500, Foil Rare $2,000, Foil Epic $7,000, Foil Legendary $20,000, Foil Mythic $60,000
- Complete Set $4,000, Complete Foil Set $120,000

Vintage years multiply sell-price baselines by `cloutScaleFor(setId) = 1 + (30 − setId) × 0.07`. Set 01 mythic sets list for **~3.03×** their Set 30 baseline (see §19.5).

At ~$3/pack cost and the long-horizon revenue curve above, a player who completes every non-foil Set across 2,500 packs (the mythic-completion median) walks away with roughly $16k in Set listings — a $4k–$6k positive ROI for the grind, plus 50 CLOUT and the option to vault for the Complete Set. Foils are pure prestige; they're ROI-negative even as listings (~125k packs of $375k cost for a $60k Foil Mythic Set) and are worth grinding only for the CLOUT in §8b.

---

## 12. Market Simulation — NPC inventory model

Prices are driven by simulated NPC supply, not a periodic ticker.

Each priced (setId, key, id) — every set item across every year — has its own per-year virtual NPC inventory level at `state.sets[setId].marketInv[key][id]`. The price is computed lazily whenever it's read:

```
baseline_eff = BASELINE[key] × cloutScaleFor(setId) × setCraftMultiplierEffective()
price        = baseline_eff × (MARKET_TARGET_STOCK / max(1, currentInv))
              clamped to [baseline_eff × PRICE_FLOOR_RATIO, baseline_eff × PRICE_CEIL_RATIO]
```

Defaults: `MARKET_TARGET_STOCK = 5`, `PRICE_FLOOR_RATIO = 0.67`, `PRICE_CEIL_RATIO = 1.5`. Scarcity swings gently — max-to-min ratio is 2.25× (vs the old 35× spread):

- **5 in NPC stock** → price = exactly baseline (equilibrium)
- **1 in NPC stock** → price clamped at **1.5× baseline** (high, but not a spike)
- **≥ 7 in NPC stock** → price clamped at **0.67× baseline** (discounted, but not crushed)

The tighter clamp is intentional. Older iterations had 5–7× spikes from a single empty NPC, which made the displayed price feel more like a slot-machine roll than a market — listings sold for radically different cash depending on whether you happened to be the third or thirteenth seller of that item recently. The new band keeps prices readable: the player can plan a craft + list cycle and trust the displayed price won't surprise them.

Events that move inventory:

- **Listing sells (player → NPC)** → `marketInv[key][id] += 1`. The very next sale of that same id fetches less.
- **NPC absorption** → no real ticker. When the next price is read, `decayMarketInv` lazily subtracts `elapsed_seconds × MARKET_DECAY_RATE` from the inventory (default 0.05/sec → 1 card absorbed per 20s of real time).
- **Listing cancelled / new pull** → market unaffected.

The lazy-compute pattern means prices only update when the game reads them — `renderVault` doesn't tear down buttons on a 7-second ticker anymore.

Dramaturgy: flood the market with foil epics in a session and prices visibly tank. Take a break, come back later, NPCs have absorbed the surplus, prices have recovered. Permanent crashes are impossible (decay eventually wins), but short-term swings are real.

---

## 13. UI Layout (2-column at desktop)

Header carries the cash + CLOUT chips, packs/foils stats, mute toggle (🔊 / 🔇), Game Design button, Reset button.

| Column            | Contains                                                                  |
|-------------------|---------------------------------------------------------------------------|
| **OPENING** (left)| H2 "OPENING" · static year label `The 2030 Set` (pre-unlock) or dropdown of all 30 years (post-`firstSetCrafted`) · Pack/Box/Case buy buttons (disabled on vintage years with explanatory tooltip) · set-progress meters · pack opener with the IDLE-homies window in the left gutter and bobbing 🧢 homie sprites flanking the pack (only the bought tables render; the next-in-line slot shows a `🪑 BUY TABLE` chip) · typing zone (progress bar or mini-game per `manualRips`) · hint line · sand canvas (260px = 25 grain rows + 1 click buffer) · sorter shop button |
| **MARKETPLACE** (right) | H2 "MARKETPLACE" · Vintage Packs row with 5 tiles + `⬆ VINTAGE` upgrade trigger (hidden until `firstSetCrafted`) · LISTINGS panel (10-slot marketplace) · collection grid titled `COLLECTION · THE YYYY SET` at h2 size · per-rarity action rows: rarity name + craft-homie slot (locked-purchaseable, fully-locked placeholder, empty hire, or active — per the table cascade) + foil action stack + non-foil action stack |
| **Footer**        | One-line flavor copy                                                      |

Mobile collapses to single column. Cells shrink to 16px and the standard grid stays 36-wide; pack box is 150×215.

### Pack visual

Booster pack has the set/year label at the top, "BOOSTER" middle, supply count beneath, and a pulsing "CLICK TO RIP" call-to-action near the bottom (gentle 1.6s opacity pulse, mutes when `.disabled`).

### Year picker

A `<select>` dropdown post-unlock; before the vintage gate flips, a static `<div id="active-set-label">` with identical chrome shows the same text. Each option reads `The YYYY Set` (with a 🔒 prefix on years the player hasn't bought a pack of yet — those carry the `disabled` attribute). The select inherits the active year's patina tier so the chrome shifts sepia when shopping a vintage year. While year-switching is temporarily blocked (busy state — see §19.3.1), the select gets a `.locked` class (dashed border, dimmed) and its tooltip explains the specific reason. `renderYearPicker` explicitly toggles `display: block/none` on the label and the select per render — relying on the `hidden` attribute alone didn't work since the CSS rules use `display: block`.

### Sorter modal

Opens via the **SORTERS** button beneath the sand canvas. Each sorter card uses the fixed-width grid described in §9 so columns align vertically when stacking multiple sorters.

### Vault Summary

Removed. The old per-year stamp row above the marketplace was deleted; the year picker dropdown is the sole year-switching surface.

---

## 14. State Schema (high level)

Save schema is **v5**. Top-level state holds cross-set fields (cash, CLOUT,
upgrade nodes, listings, staff); per-year inventory lives under
`state.sets[setId]` and is lazy-materialized — touched years exist, others
don't.

```
state = {
  // ---- cross-set --------------------------------------------------------
  coins, packsOpened,
  activeSetId,                   // 1..30; which year you're viewing/ripping
  clout, cloutSpent,             // spendable balance + lifetime spend
  unlockedNodes: [],             // upgrade tree (CLOUT-bought, global)
  completeSetCrafts: { [setId]: count },
                                 // lifetime non-foil Complete Set crafts —
                                 // STAT ONLY now, no longer drives unlocks
  firstSetCrafted: bool,         // flipped once any per-rarity craftSet()
                                 // succeeds; gates year picker + vintage
                                 // shop visibility (§8a)
  manualRips:      int,          // ripOne() count (not homie rips);
                                 // unlocks typing mini-game at 100 (§8a)
  yearUnlocked:    { [setId]: bool },
                                 // years the player has bought packs of
                                 // (Set 30 always unlocked by definition)
  homies:   [
    // rip homie (legacy default — no `kind` field):
    { uid, slot, setId, packsRemaining, lastRipAt, startAt },
    // craft homie:
    { uid, kind: "craft", setId, craftRarity, startAt, expiresAt, lastCraftAt }
  ],
  sorters:  [{ uid, level, bufferLevel, setId, input{}, output{}, lastSortAt }],
  listings: [{ uid, setId, rarity, cardId, foil, askPrice, resolveAt,
               willResolve }],
  vintageShop: { slots: [{ year, type, cooldownEndsAt } | null × N] },
  listingsUidCounter, homieUidCounter, sorterUidCounter,
  marketVersion, setVersion,     // schema stamps

  // ---- per-year buckets — lazy-materialized via setStateFor(setId) ------
  sets: {
    [setId]: {
      packSupply, boxesOwned,
      unsorted:   { standard, rare, foilStandard },
      stock:      { [rarity]: count, non-foil },
      stockFoil:  { [rarity]: count, foil },
      opened, openedFoil,        // lifetime pull counters (per year)
      pile: [[grainKey,...], ...],
      owned:     { [rarity]: [unique IDs collected] },
      ownedFoil: { [rarity]: [unique foil IDs collected] },
      setsCelebrated, setsCelebratedFoil,   // first-completion flags
      invById:     { [marketKey]: {id:count} },   // priced + set items
      bulkInvById: { standard, rare, foilStandard: {id:count} },
      vaultedSets: { [completeSetKey]: 0 | 1 }, // permanent flag — capped at 1
      marketInv,                                  // NPC market level per
      marketInvUpdated,                           // (key,id), per year
    },
  },
}
```

Two accessors do almost all the work:

- **`setStateFor(setId)`** — returns the per-year bundle, creating an empty
  one on first touch.
- **`cur()`** — shortcut for `setStateFor(state.activeSetId)`. Almost every
  inventory-touching code path uses `cur()` so it reads/writes the active
  year's bundle.

A third helper, **`withActiveSet(setId, fn)`**, temporarily swaps
`state.activeSetId` for the duration of `fn` and restores it in a `finally`
block. Used for staff operations that must mutate a year other than the one
currently being viewed (a Set 25 homie ripping while the player is on Set 30).

Save migration: bumping `SAVE_KEY` v4 → v5 means old saves are silently
ignored — the player starts fresh on the new schema. (Legacy migration
tail in `load()` was removed during the refactor; future schema bumps will
similarly assume reset.) `load()` does minimal sanity backfills against the
v5 shape: top-level cross-set fields default to safe values, each per-year
bundle is re-skeletoned against `blankSetState()` for any missing fields,
and pile tombstones from interrupted chain animations are cleaned.

---

## 15. Configurability — Game Design Panel

Press the **DESIGN** button to open a modal exposing every tunable as a numeric input, grouped: Economy, Pack Odds, Sorting, Marketplace, Staff, Market Baselines. Values persist in `localStorage` per-browser. **Apply & Reload** restarts the game with the new constants. A **RESET** button at the bottom wipes the save entirely.

This makes the whole game a live design sandbox — every drop-rate, every baseline, every cooldown, every cost is hot-swappable for tuning.

---

## 16. Out-of-Scope (current build) / Roadmap Hooks

- **Multiplayer / trades:** none.
- **Cosmetics:** no custom card art or alternate sleeve themes yet. Cards across years are visually distinguished only by the patina tint applied to the active workspace + a corner setId chip on listings.
- **Achievements / quests:** none. The closest analog is the 60-claim CLOUT collection arc (§8b).
- **Mobile-first polish:** layout adapts but interaction is desktop-pointed (the canvas crit is generous enough for touch, but the typing mini-game is desktop-only).
- **Homie variants:** two kinds now (rip + craft, see §9). Future: rare-finder homies, focused-rarity sorter homies.
- **Schema versioning:** `state.setVersion` / `state.marketVersion` fields are still written on boot but no current `load()` path reads them — the v4→v5 SAVE_KEY bump invalidated the only consumer that would have used them. If a future bump needs the dynamic migration (card-ID clamping etc.), the migration path needs to be re-implemented; presently no such migration runs.
- **CLOUT-bought sorter scaling:** retired entirely. Sorter speed + buffer are cash-only paid via each sorter card's ⬆ buttons.

---

## 17. Pacing — One Player's Day

Approximate. The economy was re-grounded around Set-only liquidation (§5), the starter is a case (216 packs), and sorters scale to 10 cards/s + 1,400 cap. Numbers below are rough horizons, not targets.

| Time-in     | Cash range  | Activity                                                                            |
|------------:|-------------|-------------------------------------------------------------------------------------|
| 0–10 min    | $50 → $300  | Crack starter case (6 boxes auto into supply). Hand-rip + type-rip. Sort the pile.  |
| 10–30 min   | $300 → $2k  | Buy first table ($100) for the left-middle rip slot. First Standard + Rare Sets land. List them; buy more packs. Hire first rip homie once a sealed box is in stock. |
| 30–90 min   | $2k → $10k  | Buy first Sorter ($1k). Speed L2-3. Hire craft homies on Standard + Rare rows.      |
| 1.5–4 hrs   | $10k → $50k | 2–3 sorters. Crafting Epic + Legendary Sets. First non-foil Complete Set vault (50 CLOUT). First vintage shop pack click; Set N unlocks. |
| 4–12 hrs    | $50k → $250k| Sorters maxing (~$91k each). Foil Standard / Foil Rare Sets. CLOUT spent on MARKING + LISTINGS branches. Multiple vintage years partially populated. |
| 12+ hrs     | $250k+      | Foil Epic / Foil Legendary Sets. First Complete Foil Set vault (500 CLOUT, more for vintage). VINTAGE branch upgrades unlock Box Hunter for case-heavy rolls. Chasing the 60-variant CLOUT collection arc. |

CLOUT progression isn't gated on cash — it's gated on the **once-per-(year × foil-variant)** redemption (§8b). The full game offers 60 vault claims; collecting all of them is the long-game prestige arc.

---

## 18. Look & Feel

Dark plum / indigo panel palette, gold accents for cash and CTAs. Pixel-bold display font (`Press Start 2P` if loaded, else system mono). Color codes by rarity:

- Standard: green `#5ad06a`
- Rare: blue `#5aa8ff`
- Epic: purple `#c060ff`
- Legendary: gold `#ffd84d`
- Mythic: orange `#ff7a3d`
- Foils: rainbow shimmer gradient

CSS animations carry the game's tactility: card-pop flash for new pulls, sand-pile bobbing for foil grains, gold pulse for available craft/collect buttons, scale-up for typed letters that hit, stacked-card shadow on Set listings.

---

## 19. Multi-Set / Vintage System

The game ships with **30 yearly sets, Set 01 (2001) through Set 30 (2030)**.
Set 30 is the current year and the only set unlocked at fresh-boot; older
years open up through the "vintage shop" as you make progress in the
current year. All 30 years share the same card layout, rarities, and core
loop — they differ only by their `setId` tag, visual patina tint, pricing,
and CLOUT reward scaling.

### 19.1 The active-set pointer

`state.activeSetId` is the single source of truth for "which year is the
player currently working on." It's mutated by:

- Clicking a year chip in the year picker (above the shop's buy buttons)
- Clicking a vault summary stamp (above the listings panel)
- Internally, the `withActiveSet(setId, fn)` helper that wraps staff ops
  (homie rips, sorter load/collect) so they mutate their pinned year's
  bundle, not whatever the player happens to be viewing

The active set drives:
- Which year's pack supply / box stash you rip from
- Which year's vault grid + craft tracks render
- Which year's sand pile + sorters animate
- Pack/box/case price labels in the shop
- Patina filter on the active workspace

### 19.2 The year picker

A `<select>` dropdown beneath the "OPENING" h2 (was a chip array — replaced for compactness once 30 years were in play). Each option text:

```
Set 30 · 2030 — current year       (active, selected)
Set 29 · 2029
Set 25 · 2025                       (unlocked via vintage pack purchase)
🔒 Set 24 · 2024
🔒 Set 20 · 2020 — midcentury
🔒 Set 5 · 2005 — vintage
```

- Locked years prefix with 🔒 and carry the `disabled` attribute (un-selectable in the UI)
- The select's own chrome inherits the active year's patina tier (sepia for vintage)
- While year-switching is blocked (busy state — see §19.3.1), the select gets a `.locked` class and its tooltip names the blocker
- Selecting a year fires `change` → `switchToSet(sid)`; refused switches snap the dropdown back to the actual active

### 19.3 Unlock gate — "buy a vintage pack"

A year unlocks the moment you **buy a booster pack of that year** from the Vintage Packs shop. Tracked at `state.yearUnlocked[setId]`. Set 30 is always unlocked.

```
isSetUnlocked(setId):
  if (setId == 30) return true
  return state.yearUnlocked[setId] === true
```

Earlier iterations gated unlocks behind crafting a Set N+1 non-foil Complete Set (29 sequential crafts to walk back from Set 30 to Set 01). The current model is simpler and player-driven: see a Set 17 pack in the vintage shop, buy it, Set 17 is now in the year picker. `state.completeSetCrafts` is still tracked for stats but no longer drives the gate.

#### 19.3.1 Switch gating — "finish what you started"

Even an unlocked year can be temporarily blocked from being switched to. `yearSwitchBlockReason()` checks three conditions; any one of them refuses the switch with an explanatory hint and a snap-back on the dropdown:

1. **Any homie hired** (`state.homies.length > 0`) — wait for them to finish
2. **Any sorter has non-zero input or output** — collect them first
3. **Active year's pile has unsorted bulk** (`unsortedTotal() > 0`) — sort them first

The intent: the player can't abandon a year mid-session leaving in-flight work behind. Switching feels like a deliberate "I'm done here, moving on" gesture. Side effect: each session has a natural sorting beat between year visits.

### 19.3.2 Migration from the old unlock model

Existing saves had `state.completeSetCrafts` populated but no `state.yearUnlocked`. The `load()` backfill seeds yearUnlocked from any prior progress: any year N where the old rule would have applied (Set N+1 crafted) is grandfathered, and any year with prior pack-opening activity is also grandfathered. No player loses access to a year they were previously working on.

### 19.4 The Vintage Packs shop — and pricing curve

A 5-slot widget (`VINTAGE_SLOTS_BASE = 5`, upgradeable to 8 via VINTAGE CLOUT nodes) lives in the right-hand MARKETPLACE column, directly above the listings panel. Each slot displays a random past-year offering — pack, box, or case — refreshing on a per-slot 5-minute cooldown after purchase (`VINTAGE_REFRESH_MS = 5 min`, reducible by upgrade nodes).

**Year roll** is weighted toward recent years (`1/age` where `age = 31 − setId`): Set 29 ≈ 18%, Set 25 ≈ 6%, Set 1 ≈ 1%. Set 30 is excluded — vintage means past years only.

**Type roll** (`VINTAGE_TYPE_WEIGHTS`, design-panel tunable): pack 80, box 16, case 4 → ~80% / 16% / 4%. The Box Hunter upgrade node bumps box +12 / case +6 → ~67% / 24% / 9%.

#### Buy flow — supply, not auto-rip

Clicking a vintage slot:

1. Charges the per-year price (see ladder below)
2. Adds to that year's supply: pack = +1 packSupply; box = +1 boxesOwned; case = +6 boxesOwned (= `CASE_SIZE / BOX_SIZE`)
3. Flips `state.yearUnlocked[year] = true` (unlocks the year picker — see §19.3)
4. Empties the slot and starts its cooldown

The pack is **not auto-ripped**. To open it, the player switches to that year via the picker (subject to switch gating, §19.3.1) and rips manually from supply.

#### Vintage-only sales path

Once a vintage year is unlocked, the **regular** buy-pack / buy-box / buy-case buttons in the shop column are disabled with the tooltip *"Vintage years only sell via the Vintage Packs shop — switch to Set 30 to buy current-year stock."* The vintage shop is the **only** way to acquire old-year stock. Every old-year session starts at the vintage shop for resupply.

#### Pricing curve

Pack / box / case cost scales **linearly** with set age — same formula whether you buy via the vintage shop or the regular buttons at Set 30:

```
setAgeMult(setId)  = max(1, 31 − setId)
packCost(setId)    = PACK_COST * setAgeMult(setId)
boxCost(setId)     = BOX_COST  * setAgeMult(setId)
caseCost(setId)    = CASE_COST * setAgeMult(setId)
```

| Set | Mult | Pack | Box   | Case   |
|----:|----:|------|-------|--------|
| 30  | 1×  | $3   | $100  | $500   |
| 25  | 6×  | $18  | $600  | $3,000 |
| 15  | 16× | $48  | $1,600| $8,000 |
| 01  | 30× | $90  | $3,000| $15,000|

Vintage packs cost a lot; the rewards scale separately (next section).

### 19.5 Reward curve — selling + CLOUT

Sell-price baselines **and** Complete Set vault CLOUT both scale by a
**gentler** curve:

```
cloutScaleFor(setId) = 1 + max(0, 30 − setId) * 0.07
```

| Set | Scale | Complete Set CLOUT | Foil Complete CLOUT | Mythic sell mult |
|----:|------:|-------------------:|--------------------:|------------------:|
| 30  | 1.00× | 50                 | 500                 | 1.00× baseline   |
| 25  | 1.35× | 68                 | 675                 | 1.35× baseline   |
| 15  | 2.05× | 103                | 1,025               | 2.05× baseline   |
| 01  | 3.03× | 151                | 1,515               | 3.03× baseline   |

This is applied in two places:

- **`marketPriceFor(setId, key, id)`** multiplies `BASELINE[key]` by
  `cloutScaleFor(setId)` before the NPC inventory factor.
- **`vaultCompleteSet`** awards `round(def.clout * cloutScaleFor(activeSetId))`
  CLOUT.

**Why the asymmetric curves?** Pack costs scale steeply (30×) so vintage
hunting is a real cost commitment, but rewards scale gently (3×) so
chasing old years is a CLOUT play, not a cash arbitrage. Set 01 foil
Complete Set is the apex prize at **1,515 CLOUT** per vault deposit.

> **Tuning note.** The 0.07/year gentle scale was tentatively set to make
> vintage hunting expensive-but-not-impossible. A real playtest may show
> the cost curve dominates and vintage feels unrewarding — if so, bump the
> scale (0.10? 0.15?) or flip pack cost to also use the gentle scale.

### 19.6 Per-year state buckets

See §14 for the full schema. Conceptually:

- **Shared at top level:** cash, lifetime packs opened, CLOUT (it's a
  cross-year currency), upgrade nodes, listings (each tagged with its
  setId), homies, sorters.
- **Per year (`state.sets[setId]`):** pack supply, sealed boxes,
  inventory (priced + bulk), unsorted pile, sand pile, owned card IDs,
  set-completion flags, vault deposits, **NPC market levels**.

Each year has its **own** NPC market — a Set 25 mythic and a Set 30 mythic
are different items with separately-flooding inventories. Listing a glut
of Set 25 mythics doesn't drop Set 30 mythic prices.

Bundles are **lazy-materialized**. A fresh boot only writes `state.sets[30]`;
older years are created on demand via `setStateFor(setId)` (called by
`cur()`, by buying packs of that year, by hiring a homie there, etc.).
Most saves will only have 2–4 entries in `state.sets` — the years the
player has actually touched.

### 19.7 Listings across years

`state.listings` stays a **flat array** — set listings, crafted-set
listings, and complete-set listings all live together. Each listing
record carries its own `setId`. This means:

- **Render** is set-agnostic — the marketplace shows all your active
  listings regardless of which year you're viewing.
- **Cancel** returns inventory to `setStateFor(l.setId)`, not `cur()` —
  so a S25 listing cancelled while you're on S30 returns the set item to
  the right bundle.
- **Resolve** (expired path) likewise routes to the listing's own bundle.
- **NPC absorption** on sale: `npcAbsorbSale(l.setId, l.rarity, l.cardId)` —
  each year's market inflates only from sales within that year.

The 10-slot listing cap (`LISTING_SLOTS`, upgradable) is shared — you can
hold 10 listings total across all years, not 10 per year.

### 19.8 Staff pinned to their hire year

Homies and sorters both record their `setId` at hire/install time:

```
state.homies.push({ uid, slot, setId: activeSetId, ... })
state.sorters.push({ uid, level, setId: activeSetId, ... })
```

- **Hiring** consumes a box from the **active year's** stash. If you want
  a Set 25 homie, you need to buy a Set 25 box first.
- **Homie rips** wrap `homieRipPack(homie)` in `withActiveSet(homie.setId,
  fn)` so the rip mutates the homie's year's inventory. Visual side
  effects (falling sand, hit pops, particle confetti, flash queue) are
  gated on `homie.setId === state.activeSetId` ("watching") — off-screen
  rips silently update inventory without spamming the active view.
- **Sorter LOAD/COLLECT** likewise wrap their inner functions in
  `withActiveSet(sorter.setId, fn)`. The sorter pulls from its pinned
  year's pile and writes to its pinned year's stock.
- **Sprites + sorter cards** show a small `S{N}` badge so the year tag is
  visible at a glance.

This means you can run staff in parallel across years — a Set 30 homie
ripping current packs while a Set 25 sorter chews through your vintage
pile in the background, no interference.

#### The `fallingGrains` setId tag

Sand grains in mid-fall are tagged with their origin setId. Three rules
keep them tidy:

- **`syncPileWithStock`** only counts in-flight grains for the active set
  when checking if the pile needs a rebuild (prevents off-screen grains
  from corrupting the active set's pile reconciliation).
- **`drawSand`** skips grains whose `setId !== activeSetId` so off-screen
  rips don't visually bleed into the wrong canvas.
- **`stepSandAnim`** settles off-screen grains *instantly* into their own
  year's pile (the player isn't watching them animate anyway).
- **`rebuildPileFromStock`** drops the rebuilt year's in-flight grains to
  avoid double-counting when they would otherwise later land.

### 19.9 Visual patina — three tiers

The age tier drives a sepia CSS filter applied to the player's active
workspace:

| Set range | Tier         | Filter                                              |
|-----------|--------------|-----------------------------------------------------|
| 20–30     | "" (current) | none — full color                                   |
| 10–19     | midcentury   | `sepia(0.25) hue-rotate(-6deg) saturate(0.92)`      |
| 01–09     | vintage      | `sepia(0.55) hue-rotate(-12deg) saturate(0.85) brightness(0.95)` |

The tier is applied to **the pack, the vault grid, and the stock-rows
container** in `renderHeader`. Year-picker chips, vault summary stamps,
and individual listing cards each carry their own tier class — so when
viewing the marketplace, you can read each listing's year tier (current,
midcentury, vintage) at a glance.

### 19.10 Vault summary (retired)

An earlier iteration had a horizontal "vault stamps" strip between the marketplace listings and the per-year collection grid, showing one stamp per year with vault activity. It was removed — the year-picker dropdown is the sole year-switching surface now. The collection grid's title (`COLLECTION · SET N · YYYY`, h2-sized) is the only year identifier in the marketplace column.

### 19.11 Sold / expired / cancelled messages

Listing-resolution hints prefix the year, e.g.

- `"Sold Set 25 FOIL MYTHIC SET @ $5,432."`
- `"Set 5 listing expired — returned to inventory."`
- `"Cancelled Set 12 listing — returned to inventory."`

When multiple listings resolve in the same tick, only the last hint shows
— but the year tag makes it unambiguous which one paid out.

### 19.12 Open design questions

These were intentionally left as v1 defaults pending real playtest:

- **Cost-vs-reward curve.** Linear pack costs (31−setId) with gentle
  reward scaling (1 + 0.07×age) makes vintage hunting a CLOUT-only play.
  If it feels like a money pit in practice, candidate fixes: bump CLOUT
  scale to 0.10–0.15/year, OR flip pack cost to gentle, OR drop pack
  cost scaling entirely and let only CLOUT scale.
- **Unlock gate granularity.** One non-foil Complete Set per year is the
  current threshold. If players grind 5+ before moving on, the gate
  feels symbolic; if they barely make 1, it feels punishing. Watch
  median crafts-per-year for the first 3 sets unlocked.
- **Cross-year sorter ergonomics.** A Set 25 sorter installed beside the
  Set 25 pile is invisible to a player who's currently on Set 30 (the
  sorters modal lists all of them, but the active canvas only shows the
  current year's pile). May want a "switch to S25" shortcut in the
  modal when clicking on a non-active-year sorter card.
- **Per-card visual differentiation.** Cards across years currently
  differ only by their setId tag and the patina filter applied at the
  grid level. Per-year card art, alternate frames, or holo variants
  are pure cosmetics work and out of scope so far.

---

## 20. Audio + Cash celebration

### Web Audio SFX module

No asset files, no preloading. Each named sound is a tiny oscillator + ADSR envelope (~60–200ms, mostly two/three-note motifs). The module lazy-creates one `AudioContext` and resumes it on every play attempt so the first user gesture wakes it (browser autoplay policy).

| Name | Tone | Event |
|---|---|---|
| `sale` | two-note ascending chime ("ka-ching") | listing sells |
| `rip` | short downward sawtooth | pack tear (manual + watched homie) |
| `sort` | brief square tick | sand-pile click |
| `pullFoil` | high two-note sparkle | foil pull (non-standard) |
| `pullMythic` | three-note ascending triangle | mythic/legendary pull |
| `craft` | C-E-G triangle arpeggio | set craft (manual + non-silent craft-homie) |
| `vault` | A-E-A descending-low resonant | Complete Set vault deposit |
| `buy` | quick upward sine | purchase confirm |
| `switch` | short upward triangle | year picker change |
| `unlock` | C-G-C ascending triangle | new vintage year unlocked |
| `error` | low sawtooth thud | refused action (no supply, locked year, busy switch, dupe vault, etc.) |

Off-screen homie rips set a `_silentPulls` flag around the addPull batch so foil / mythic chimes only fire for pulls the player can see. Craft homies use `craftSet(key, { silent: true })` for the same reason — no audio leakage from background workers.

### Cash gain celebration

`celebrateCashGain($)` pulses the header `#coins` with a `cash-bump` keyframe (gold scale-up + glow) and spawns a `+$N` popup floating 64px upward over 1.4s. Wired into `resolveListings()` — every sold listing fires it alongside `SFX.sale()`.

### Mute toggle

🔊 / 🔇 button in the header next to Game Design / Reset. Persists to `localStorage[SFX_MUTE_KEY]`. When muted, `audioCtx()` returns null and every `SFX.*` call becomes a no-op.

---

*End of design doc.*
