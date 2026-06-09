# Keep Ripping Packs — Roadmap & Steam Path

A working document. Two big sections: **feature/expansion brainstorm** and a **Steam release path**. Effort tiers are rough — T1 = an afternoon, T2 = a weekend, T3 = a multi-week project, T4 = needs an outside hire (art, audio, etc.).

---

## Part 1 — Feature & expansion ideas

Grouped by area. Each idea is independent; pick what fits the vibe.

### A. Pack-opening drama

The core fantasy is the pull. Everything that makes a pull feel bigger pays back the most.

- **Big-pull reveal modal (T2)** — on a Mythic / Foil Legendary+ pull, full-screen takeover with a slow-flip card, particle showers, custom SFX. Skippable. Could trigger once per session per rarity to avoid fatigue.
- **Pack-rip animation (T2)** — instead of cards just appearing, animate the pack tearing open with paper-shred particles, then the cards fan out. ~600ms cinematic on click; chained pulls fast-forward through it.
- **Streak meter (T1)** — track consecutive whiffs (no rare+) and display a small "heating up" indicator that visually intensifies until a hit. Pure flavor — no actual rate boost, just psychology.
- **Pack types beyond standard (T2)** — Holiday Pack (2× foil chance, 5× price), Misprint Pack (rare chase: 1-in-1k card variants), Starter Pack (cheap, all standards). Vintage shop slots could roll these.
- **"Crack a case" mode (T2)** — instead of auto-cracking into supply, let the player crack one box at a time with a satisfying animation, watching the streak unfold.
- **Card-back variants per set (T1 mechanics, T4 art)** — different decade aesthetics: 80s neon, 90s holo, 2000s glossy, etc.

### B. Sand pile / sorting

The sand sort is the most-unique-to-this-game mechanic. Worth deepening.

- **Click upgrades via CLOUT (T1)** — paid passive nodes: +1 click radius, multi-click (drag to chain detonations), gravity bias (rares fall to predictable columns).
- **Critical sort timing (T2)** — clicks have a brief "perfect" window during a wave-0 explosion; landing a click in that window doubles the chain.
- **Sand pile cosmetics (T2)** — alt color palettes (CRT green, glitch rainbow, sepia for vintage years).
- **Pile organizer homie (T2)** — see §E.
- **Dust / trash grains (T2)** — a small % of pulls produce "dust" that takes up pile space but doesn't sort into anything; clears via a paid broom action. Adds friction worth managing.
- **Magnet upgrade (T1)** — CLOUT node that pulls foil grains to top of pile.

### C. Set crafting & collection

- **Card grading (T3)** — PSA10-style. When a Mythic / Foil pulls, roll a grade 1-10. Higher grades list for more. Adds another lottery layer to chase pulls.
- **Card protectors / sleeves (T2)** — buy sleeves to protect specific high-value cards from being accidentally sorted/sold. Aesthetic: a literal sleeve UI element.
- **Album/binder view (T2)** — alternate collection layout that looks like a binder of card pages. Pure cosmetic but a big feels upgrade.
- **Display cases (T3)** — completed sets can be "displayed" in a permanent gallery UI. Bragging-rights real estate.
- **Set bonuses (T2)** — first Complete Set of any rarity grants a permanent tiny boost (e.g. first non-foil → +1 listing slot, first foil → +1 homie pool).
- **Vault organizer (T2)** — drag-and-drop reorder of collection rows by rarity, year, or completion %.

### D. Marketplace

- **Auction listings (T3)** — alternate listing type: set a reserve and a buyout, NPCs bid up over time, ~2-5× normal price ceiling. Higher risk (longer cooldown, maybe expires unsold).
- **Whale buyers (T2)** — once per N minutes, an NPC "collector" appears in the marketplace panel with a specific want ("I'll pay $9k for any Foil Legendary Set"). Fulfill or wait for them to leave.
- **Buy orders (T2)** — flip the marketplace: NPC dealers post offers to BUY specific items; fulfill from your inventory for instant cash above market floor.
- **Market events (T2)** — every ~30 min, a rarity's baseline spikes by 50% for 5 min ("the Legendary market is HOT 🔥"). UI flashes; player rushes to list.
- **Listing categories / search (T1)** — once listings > 5 active, a filter row to show foils only / by rarity / by year.
- **Counter-offers (T3)** — listings sometimes get a counter-offer from an NPC at -10%/-20%; accept for faster cash or hold for full price.

### E. Helpers & staff

- **Sort Homie (T2)** — new kind: sits next to the sand pile, slow-auto-clicks to sort grains. Cheaper than a Sorter, less efficient.
- **Listing Manager (T2)** — auto-lists ANY crafted set in any rarity from your inventory. Bigger version of the craft homie's list step. Useful once player has multiple rarities flowing.
- **Vintage Buyer (T2)** — auto-spends cash on vintage shop rolls matching a preference (foils only, year ≤ N, etc.).
- **Named homies (T3)** — each pool token is a named homie with a generated nickname ("Jonny Foils", "Slow Pete", "Lucky Lisa"). Different homies have small stat quirks. Player feels attached.
- **Hat shop (T2 mechanics, T4 art)** — cosmetics for homies: top hat, baseball cap variants, bandanas. Cosmetic CLOUT sink late-game.
- **Homie XP / loyalty (T3)** — each homie levels up the more they complete jobs, gaining a small perma-bonus that survives expiry-and-rehire.
- **Scout (T2)** — auto-buys from AVAILABLE. Picks the cheapest unowned offer each tick. Costs a homie-pool token. Limited because it can't trigger refreshes — it just clears the panel faster, turning AVAILABLE from "watch and click" into a passive trickle. Closes the loop on the Phase-2 buy market.
- **Loader (T2)** — auto-presses LOAD on a bound sorter whenever its input drops to zero and there's pile to grab. Trivially solves the busiest manual click in the rip→sort loop without breaking the sand-pile risk (overflow still happens if the loader can't keep up). Pair-cost with the sorter it's bound to.
- **Picker (T2)** — auto-buys Vintage Shop offers below a player-set max price (or for unowned years only). Same shape as Scout. Tradeoff: cash hemorrhage if you set the cap loose, which gives the player a real knob to lose money on.
- **Vaulter (T2)** — auto-vaults crafted Sets/Complete Sets for CLOUT instead of listing. Inverse of the Craft Homie's "auto-list" behavior. Forces a real strategic split between cash income (craft homie) vs CLOUT income (vaulter) — you can only afford one per rarity. Probably the most interesting one because the choice has actual weight.
- **Field Agent (T3)** — un-pinned from a year. Costs 3× the normal token, or uses a separate "agent" pool unlocked deep in CREW. Tradeoff: rare, expensive, works wherever you switch. Late-game power play.
- **Hype Man (T2)** — doesn't do work; speeds adjacent homies by ~20% while alive. Pure multiplier with diminishing returns (two on the same target = 30% not 40%). Adds a positioning puzzle without adding a new action.

### F. World / lore (the cryptid TCG)

The pitch mentions a 30-year cryptid TCG. Currently invisible — just numbered sets. Easy wins here.

- **Set themes & flavor (T1 mechanics, T2 writing)** — each year is a different cryptid era ("1985 — The Mothman Boom", "2008 — Bigfoot Returns"). One-line flavor on each year's pack/set. Vintage-shop tooltip teases the lore.
- **Card flavor text (T2 writing)** — Mythic / Legendary cards have a tiny flavor line on the listing tile.
- **Misprint chase cards (T2)** — 1985's "Mothman Mythic" has a 1-in-2000 "blue-back misprint" variant worth 20× normal. Listing it pops a big fanfare.
- **Era events (T3)** — once player unlocks a year, a "decade event" plays once (a short text card, like a museum plaque) describing the cryptid history.
- **Set narrative arcs (T4 writing)** — across ranges of years, a meta-story unfolds (e.g. years 1-10 = early cryptid hunters, 11-20 = corporate buyout era, 21-30 = digital age).

### G. Progression / meta

- **Achievements (T2)** — typical list: first foil, first complete set, all 30 years unlocked, first vault, 1k packs opened, etc. Unlocks cosmetic stuff (color schemes, alt sound packs).
- **Prestige (T3)** — once player vaults all 60 variants (the existing arc), a "Prestige" button resets progress for a permanent global multiplier (e.g. +5% sell prices, +1 starter table) that compounds across prestiges. Adds infinite long-tail.
- **Statistics page (T1)** — lifetime totals: packs ripped, foils pulled, sets crafted, biggest single sale, total cash earned, time-played. Modal opened from the header.
- **Daily challenge (T3)** — every 24h, a goal appears: "List a Foil Rare Set within 5 minutes" / "Hit 50 sort-pile clicks in one minute". Modest CLOUT/cash reward. Hooks return visits.
- **Tutorial / onboarding (T2)** — fresh save shows numbered tooltips on first pack click, first sort, first craft. Skippable. Reduces the "I don't know what to do" drop-off.

### H. Multiplayer / social

Tread carefully — multiplayer can balloon scope fast. But low-touch options:

- **Discord rich presence (T2)** — shows "Ripping Set 27" / "12 Foil Mythics" in the Discord status. Free marketing.
- **Async leaderboards (T3)** — weekly resets, categories like "most CLOUT earned this week" / "fastest first foil mythic". Requires a tiny backend or use a third-party service.
- **Trade with friends (T4)** — async card trading via shareable codes. Major undertaking; design carefully or skip.
- **Twitch integration (T3)** — viewers can vote on next pull location or chip in coins. Streamer-bait feature.

### I. Quality of life

- **Save export/import (T1)** — base64-encoded blob the player can copy to a file. Already a single localStorage entry, trivial to add.
- **Cloud save (T3)** — Firebase or similar. Needed for cross-device. Could pair with optional account.
- **Settings modal (T1)** — sound volume sliders, animation speed, reduced motion mode, color blind palette, save-export, reset.
- **Keyboard shortcuts (T1)** — `B` buys a pack, `R` opens, `S` opens sorters, etc. Power-user accelerator.
- **Mobile-first overhaul (T3)** — current responsive is partial; a real mobile pass (touch-first hit areas, vertical layout) could open a huge audience.
- **Pause / speed (T1)** — pause button, 2×/4× simulation speed for the late-game grind.

---

## Part 2 — Path to Steam

You're right that art is the biggest single blocker, but there's a longer list of work. Sequencing matters — burn cash on art too early and you'll regret it if mechanics still need to shift.

### Stage 0 — What you have today

A single self-contained `index.html` (~5,800 lines of vanilla JS + CSS) with:
- A working core loop with real depth (sand pile, market, CLOUT, vintage scaling, homies, tables)
- Save persistence via `localStorage`
- A Game Design panel for live tuning
- A `GAME_DESIGN.md` design doc that's currently kept in sync
- GitHub Pages deployment

That's already a respectable demo. The web link is shareable. **Get feedback on the web version first** before spending a dollar on Steam — it's almost free to iterate.

### Stage 1 — Validate on the web (cost: time only)

Goals: confirm the game's hook is real before investing in Steam-prep.

1. **Post on r/incremental_games** with the GitHub Pages link. Itch.io page is also free and gives you analytics + a place to collect feedback.
2. **Watch what playtesters do** — analytics for "did anyone reach Complete Set", "how long until first quit", drop-off points.
3. **Iterate the loop**, not the visuals. The cheap fixes here (better hooks, tutorials, satisfying feedback) compound through every later stage.

Skip this and the rest is a gamble.

### Stage 2 — Desktop wrapper (cost: free, T2 work)

Steam needs a downloadable executable. Two solid options:

- **Tauri** (Rust + webview) — tiny binaries (~5MB), modern, actively developed. Recommended.
- **Electron** (Node + Chromium) — 100MB+ binaries, slower, but huge ecosystem and easy to set up if you're not into Rust.

What you'd add:
- File-based save (replace `localStorage`, or sync from it)
- Window controls (title, size, fullscreen)
- Cross-platform build pipeline (GitHub Actions can produce Win/Mac/Linux binaries automatically)

Time estimate: 2-4 days to get a working bundle.

### Stage 3 — Steam Direct + storefront (cost: $100)

Once you're sure you want to release:

1. Pay the [Steam Direct fee](https://partner.steamgames.com/steamdirect) — $100 per app. Recoupable after $1,000 of sales.
2. Fill out tax + payment info (US-based: W-9; international: W-8BEN).
3. Build the **store page** — this is what wishlists run on:
   - **Capsule art**: 184×69, 374×448, 467×181, 616×353, 920×430 (multiple sizes for different surfaces)
   - **Header capsule**: the one that shows on the home page (920×430)
   - **5-10 screenshots** (1920×1080 ideal)
   - **30-60s trailer** (often the biggest single conversion driver)
   - **Short + long description**
   - **Categories / tags** (Idle, Clicker, Card Game, Trading, Strategy)

Trailer is do-able with OBS + DaVinci Resolve (free) once the game looks the part.

### Stage 4 — Steamworks integration (T3 work)

- **Achievements** — easy SDK call; map your existing milestones.
- **Cloud saves** — Steam Cloud syncs a directory automatically; just point your save file there.
- **Trading cards** — Steam's own meta-economy. Requires applying after a threshold of sales; gives the game extra visibility.
- **Steam Input** — controller support, if you want it (worth it for the couch idle audience).
- **Big Picture / Steam Deck compatibility** — easy if your UI scales well; Steam Deck users love idlers.

### Stage 5 — Art (T4, the big spend)

The art question. Realistic scope tiers:

#### Tier 1 — Minimum viable ($1-3k)
- Capsule art + trailer key-art (~$500-1k from a freelance illustrator)
- UI polish pass (icons, fonts, color cleanup, a real logo) — could DIY with a designer friend
- Custom pack art for **just the current year** (Set 30) — one pack design, foil treatment
- Cards stay as emoji + rarity colors. Bet on "stylized minimalism" being the look.
- Maybe music — there are royalty-free idler-friendly tracks for $50-200 on AudioJungle / Soundstripe

This works if the gameplay is the draw. Examples of successful Steam idlers with minimal art: [NGU Industries], [Antimatter Dimensions]. Aesthetic = "deliberate UI minimalism", not "we ran out of money".

#### Tier 2 — Respectable indie ($5-15k)
- One coherent art style (pixel art is the cheapest), executed by one freelance artist over a few months
- Pack art per set (30 designs) or per era (5-6 designs reused across years with patina tweaks)
- Card frames + a small number of card illustrations (~30-50 hand-drawn for the rarest cards; the rest stay procedurally tinted)
- Custom SFX library — $200-500 from sfxr/freesound or a sound designer
- Music: 2-3 looping tracks, $500-1500

This is the sweet spot — looks "real", doesn't bankrupt you. **This is what I'd aim for.**

#### Tier 3 — Premium ($30k+)
- Full hand-painted card art (540+ cards for priced rarities alone if you went deep)
- Animated card reveals
- Full voice acting (NPC dealers, achievement narrator)
- Original soundtrack
- 4K capsule + trailer with motion design

This is the "actually compete with The Banner Saga / Slay the Spire" tier. Don't start here. Maybe upgrade post-launch with revenue.

#### Art strategy notes

- **Pixel art is the cheapest coherent style** that doesn't look cheap. ~$50-150 per pack illustration from a freelance pixel artist.
- **AI-generated art is risky on Steam** — Valve has been increasingly strict about AI disclosure; reception in the indie community is hostile in many corners. If you go this route, polish heavily, disclose honestly, and expect some review backlash.
- **Style consistency > individual asset quality** — players forgive simple if it's coherent. Mixed styles read as "asset flip".
- **Cards as procedural compositions** — each card art could be (background swatch) + (silhouette of cryptid) + (frame). Generate 540+ "unique" cards from ~50 components. Lots of TCG games do this.
- **Start with capsule + trailer art** — that's what drives wishlists. The in-game art can be in progress while wishlists accumulate.

Recommended hire path: find ONE artist on Reddit r/INAT, r/HungryArtists, ArtStation, or Twitter whose style you love and commission them for a coherent pass. Avoid art-by-committee.

### Stage 6 — Pre-launch (T3+)

- **Wishlists are everything.** Steam algorithm favors high-wishlist launches. Aim for 5k+ before launch; 10k is solid; 20k+ is a meaningful win.
- **Demo + Steam Next Fest** — Valve runs Next Fest 3× a year. A demo is the single best way to bootstrap wishlists.
- **Localization** — at minimum English; ideally Simplified Chinese (#1 region for indies), Spanish, German, Russian, Korean. Use Crowdin or hire freelancers; budget $300-1k for a basic 5-language pass.
- **Bug bash + beta** — invite ~50 testers from your web playtest list.
- **Press / streamer outreach** — email small streamers in the idle niche with free keys. PressKit() (free) makes a clean media-kit page.

### Stage 7 — Launch & post-launch

- **Launch discount**: 10-15% is standard. Bigger discounts ≠ more sales for indies usually.
- **Roadmap post-launch** — a public "coming next" list on the Steam page builds confidence.
- **Updates cadence** — even small content patches keep your game in the Steam algorithm's "recent activity" bucket, which surfaces it more.

### Realistic budget for a respectable Steam launch

Assuming you do all engineering and design yourself, and outsource only art + music + a bit of localization:

| Item | Low | High |
|---|---:|---:|
| Steam Direct fee | $100 | $100 |
| Capsule + key art | $500 | $1,500 |
| In-game art (pack designs, frames, UI) | $3,000 | $10,000 |
| Music (2-3 tracks) | $500 | $1,500 |
| SFX | $200 | $500 |
| Localization (basic 5-language) | $300 | $1,000 |
| Trailer (DIY) | $0 | $500 |
| Misc (legal, screenshots, marketing tools) | $200 | $1,000 |
| **Total** | **~$5,000** | **~$16,000** |

Cheaper if you go AI-art (with the caveats above) or know an artist friend. More if you want true premium.

### Other Steam blockers worth knowing about

1. **Save tampering** — Steam users WILL edit save files. Your current localStorage save is plaintext JSON. Nothing wrong with that for an idler (no PvP, no leaderboards-that-matter), but worth deciding the policy: lean in (encourage tinkering) or sign saves to gate achievements.
2. **Cheat engines** — if you ship leaderboards, expect spoofing. Best practice: server-side ranks with sanity checks, or just don't have competitive leaderboards.
3. **Reviews** — Steam needs 10+ reviews before showing a review score. Encourage reviews politely in-game ("If you're having fun, leaving a review really helps!" — once, after ~30 min of play, never again).
4. **Refund policy** — Steam refunds anyone who plays under 2 hours and asks. Idlers are vulnerable here. Make sure the first 2 hours feel like real progress.
5. **Steam Deck verification** — easy to get if your game scales properly; gives a visibility boost.

---

## Part 3 — Suggested next steps

If you want a sane order of operations:

1. **Right now**: keep iterating on the web version, polish the loop, fix friction in the first 5 minutes.
2. **Soon (cost: $0)**: post to r/incremental_games and itch.io for feedback. Get 20 strangers playing it.
3. **If feedback is good**: pick a few feature ideas from Part 1 (T1/T2 ones) that close obvious gaps, ship them, share again.
4. **When the loop is clearly fun**: wrap in Tauri, polish a Steam page mockup (even mock art is fine), float it past playtesters.
5. **Decide on art tier**: probably Tier 2 above. Find one artist with a style you love. Commission a capsule + 3-5 in-game illustrations as a test piece before committing to the whole project.
6. **Steam Direct + page goes live** — start building wishlists 3-6 months ahead of launch. Demo at the next Steam Next Fest.
7. **Launch.** Update for 6+ months. Decide if it's a hit, a hobby, or a portfolio piece.

Plenty of indie devs have made a living from much less than what's already here. The mechanics are solid; the rest is craft and patience.

— end of report
