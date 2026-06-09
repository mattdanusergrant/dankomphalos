# Ronin Survivor — GDD v0.1

**Slug:** `afro-survivor` · **Working public title:** *Ronin Survivor* · **Status:** playable web prototype

A *Vampire Survivors*–style horde-survival auto-battler, themed as an homage to **Afro Samurai** — a lone afro'd swordsman with the No.1-rival headband, walking a blood-red road, cut down by endless waves of foes who want the headband off his head. Theme is *inspired by*, deliberately **legally distinct** (same posture as Sigil Tactics): no licensed names, art, or music — original assets and an original title.

> Genre reference: *Vampire Survivors* (auto-attacking, move-only control, swarms, level-up boon drafts, escalating time pressure). Aesthetic reference: *Afro Samurai* (stark ink-black + bone-white + blood-red, lone-swordsman fantasy, drifting petals, a red sun).

---

## Pillars

1. **One input, deep choices.** You only move. Every weapon fires itself. All the decision-making is in *positioning* and the *boon draft* on level-up.
2. **The swarm is the clock.** Difficulty is time, not stages. Enemies get more numerous and tougher every second; warlords (bosses) arrive on a timer.
3. **Power fantasy by minute 5.** Start fragile with one blade; end the run a whirling storm of steel and spirit-fire. The curve from "barely surviving" to "screen-clearing" is the product.
4. **Style is a feature.** Drawn-not-licensed art; high-contrast Afro-Samurai palette; satisfying hit-feedback (flash, knockback, sparks, screen-shake, damage numbers).

---

## Core loop

```
move to dodge / herd enemies  →  weapons auto-hit  →  foes drop ki
   →  collect ki, fill the bar  →  LEVEL UP: draft 1 of 3 boons
   →  stronger build  →  bigger swarm  →  repeat until you fall (or the timer ends)
```

A run is a single continuous arena (infinite scroll, camera follows the player). No menus mid-run except the level-up draft (which pauses time).

---

## Prototype scope (what is built — `web/index.html`)

Single self-contained file, vanilla JS + Canvas, no build step, mobile-portrait first. Built to this DoD — **all verified headlessly** (node syntax check + DOM-stubbed sim: spawn/kite/level-up/all-four-weapons/boss/render all pass):

- **Control:** WASD/arrows on desktop; drag-anywhere virtual joystick on touch. Move-only; weapons are automatic.
- **4 weapons**, each 6 levels:
  | Weapon | Behaviour |
  |---|---|
  | **Katana Sweep** (starter) | Periodic radial cut — hits every foe within reach *around* you. Levels: +dmg, +range, faster, wider visual sweep. |
  | **Throwing Stars** | Auto-targets the nearest foes; piercing shuriken. Levels: +count, +dmg. |
  | **Ki Wave** | Forward piercing crescent in your facing direction; hits all in its path. Levels: wider, +dmg. |
  | **Spirit Blades** | Blades orbit you, damaging on contact (per-foe hit cooldown). Levels: +count, +dmg. |
- **7 passives** (stackable, capped): Whetstone (+dmg), Iron Will (+max HP & heal), Swift Geta (+move), Quick Hands (−cooldowns), Soul Pull (+pickup range), Calm Breath (+regen), Ambition (+ki gain).
- **Level-up draft:** time pauses, 3 random eligible options (new weapon / weapon level / passive), tap to pick. Fallback "Second Wind" full-heal if everything is maxed.
- **Enemies:** footpad → ronin → ninja → brute, weighted in by elapsed time; global HP scales with time. **Warlord boss** every 60s with its own health bar, ki burst on death, and an incoming-banner.
- **Ki / XP:** orbs drop on kill, magnet-pull within pickup range, quadratic level curve.
- **Juice:** hit-flash, knockback, damage numbers, death sparks, screen-shake, i-frames + hurt-flash, drifting petals, red-sun vignette, grid ground.
- **Flow:** title → play → pause (resume/abandon) → game-over with run stats (time survived, felled, level) + restart.

### Deliberately NOT in the prototype (next-up)
- Meta-progression (persistent unlocks / gold between runs), audio/music, more weapons & evolutions (VS-style weapon+passive fusions), multiple characters, stage variety, a true win condition / time cap, save/persistence, settings.

---

## Progression & balance (current first pass)

- **Player:** 100 HP, 148 px/s, 0.7s i-frames on contact.
- **Level curve:** `xpNext = round(5 + lvl²·1.15 + lvl·3)` — gentle early, steepening.
- **Enemy HP scale:** `×(1 + t/75)`; **spawn interval:** `max(0.18s, 1.05 − t·0.0065)`.
- **Boss HP:** 900 × time-scale, every 60s.

These are *feel-tunable knobs*, not committed design. First playtest goal: confirm the "minute-5 power fantasy" curve lands and early survival is tense-but-fair, then tune.

---

## Tech

- **Web-first**, single `index.html`, zero dependencies/build (matches Sigil Tactics & tcg-pack-clicker). Runs by opening the file or via any static host.
- Fixed-ish timestep via rAF with a dt clamp; world-space + camera; Canvas 2D draws all art procedurally (no image assets — keeps it self-contained and dodges the asset-library gitignore).

---

## Open questions (for the Operator)

1. **Title.** *Ronin Survivor* is a placeholder. Keep it, or pick another legally-distinct name? (Direct "Afro Samurai" naming is a trademark risk if ever shared publicly.)
2. **Win condition.** Endless-until-death (current), or a survive-to-N-minutes victory + boss finale (classic VS)?
3. **Meta-progression.** Add persistent between-run upgrades (gold → permanent stat boosts / unlocks)? This is what gives VS-likes their retention.
4. **Audio.** Lo-fi/hip-hop-samurai loop + SFX — generate procedurally (WebAudio) to stay asset-free, or source licensed tracks?
5. **Characters.** One swordsman, or multiple with different starting weapons/stats?
6. **Evolutions.** Add VS-style weapon+passive fusion ultimates (the depth hook)?

---

## Next steps

1. Operator playtest on phone → tune the difficulty/level curve and confirm the power-fantasy arc.
2. Resolve title + win-condition (Q1–Q2) — both are cheap and load-bearing.
3. Add WebAudio SFX/music (biggest felt-quality jump, still asset-free).
4. If the core proves fun: meta-progression + weapon evolutions (the retention layer).

To put it on a phone-reachable URL, see `07_projects/afro-survivor/DEPLOY.md` (the vault repo is private, so GitHub Pages serves from a separate public repo — same pattern as tcg-pack-clicker / sigil-tactics).

#LLM-generated
