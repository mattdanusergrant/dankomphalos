# Improvement Plan — dankomphalos

> Generated 2026-07-02 from a full 12-repo portfolio audit (Claude Code session).
> Companion career report: ConductiveOS vault, `09_personal/2026-07-02-life-audit-and-career-plan.md`.

**What this is:** Live static site (dankomphalos.com) for "Dank Omphalos Arthouse" — a Magic/Sorcery TCG card-alter and original-painting consignment gallery — with a public hash-router SPA gallery (index.html) plus a real, invite-only artist portal (planargate.html) wired to Neon Auth and the Neon Data API with row-level security, showing each artist their held stock, advances, and cash-out balances.

**Stack:** Vanilla JS (no framework, no build step), HTML/CSS single-file SPA with hash routing, Neon Auth (Better Auth, email+password) loaded from esm.sh, Neon Data API (PostgREST-style REST over Postgres with RLS), JWT auth flow (/token endpoint, JWKS-verified tokens), GitHub Pages + custom domain (CNAME), Google Fonts (Cinzel / Cormorant Garamond / EB Garamond) · **Maturity:** shipped-live · **Live:** https://dankomphalos.com
**Size:** ~920 lines total (index.html ~560, planargate.html ~360; HTML/CSS/JS inline, zero dependencies checked in)

## What's genuinely good here

- planargate.html is a genuine full-stack integration, not a mock: Better Auth sign-up/sign-in, a real JWT minted at /token (correctly distinguished from the opaque session token — the commit history shows he debugged this), PostgREST-style queries with RLS scoping (fetchProfile relies on RLS returning only the caller's row), PATCH with Prefer: return=representation, and an onboarding wizard with per-field public/private visibility toggles.
- Exceptional failure-state UX for a solo operation: notLinkedMsg() prints the signed-in JWT sub, probes a /whoami view to show what the server sees, and emits the exact UPDATE SQL to link the artist row — the error screen is its own runbook. fail() renders every error on-page with a 'paste this to your developer' framing.
- Coherent, deliberate art direction: the entire palette (--ember/--oxblood/--teal/--violet) is derived from the hero painting by the real featured artist (Viviane Freitas), and the deterministic placeholder art (hash() -> ART_PALETTE gradients) keeps unphotographed pieces on-brand. This reads as designed, not templated.
- Consistent XSS hygiene: esc() applied to essentially every interpolation in both files, including attribute values in the onboarding form.
- Disciplined repo curation: the internal deal calculator was deliberately moved out to the private vault ('make dankomphalos live-build-only', 1af5a93) so the public repo is exactly the deployed site; commit messages are specific, incremental, and honestly tagged #LLM-generated.
- It is actually shipped: dankomphalos.com and /planargate.html both serve 200 on a custom domain, hero image was optimized 7MB -> 0.6MB, mobile breakpoints are handled throughout.


## Issues found

- Open self-registration on the 'invite-only' portal: planargate.html renderLogin() exposes authClient.signUp.email to anyone; invite-only is copy, not enforcement. RLS protects data, but any stranger can create an account and then hit the not-linked screen, which leaks internal schema details (artists table, user_id column, the /whoami view) and their JWT sub — debug output that should be gated behind a dev flag in production.
- The visibility feature is half a pipeline: renderOnboarding() collects per-field 'Show on gallery' choices into a visibility JSON, but the public gallery (index.html) never reads the database — it renders a hard-coded DATA seed. The two halves of the product don't actually connect yet.
- The live commercial site displays fabricated content: 3 of 4 artists (Vela Marchetti, Koa Lindqvist, Renza Okonkwo) and all 7 priced pieces in index.html DATA are fictional placeholders with '#' Instagram links — real buyers on a real domain can enquire about art that doesn't exist.
- Unpinned runtime dependency: loadAuth() does import('https://esm.sh/better-auth/client') with no version pin — a breaking better-auth release or esm.sh change silently breaks all artist logins (the code comment even admits 'we may need to pin a version').
- Two divergent portal implementations: index.html #/portal is a demo dashboard with its own money math (ARTIST_SHARE=0.88, owedOf()) while planargate.html is the real one reading owed_on_sale from the DB; the footer 'Artist login' link points at the demo, and nothing on the site links to the real portal.
- The database schema is invisible: error copy references schema.sql ('the Data API column grants in schema.sql may need a run') but no schema, migrations, or RLS policies are committed anywhere in this repo's history — the backend half of the project can't be reviewed or rebuilt from the repo.
- Zero README, zero LICENSE, zero tests, zero CI (the one workflow, deploy-stable.yml, was deleted in 08c08d8); getToken() console.logs the JWT and token-endpoint body in production.
- No Open Graph/Twitter meta and all artwork renders as CSS backgrounds with no alt text — poor sharing and SEO for a business whose product is images.


## Ranked improvements

### 1. Wire the public gallery to the Neon database (finish the visibility pipeline)  `impact 5/5 · effort M`

**Why:** This is the missing half of the product: artists already set per-field 'Show on gallery' toggles in planargate.html's renderOnboarding(), but index.html renders a hard-coded DATA seed with fictional artists. Connecting them turns a brochure into a working two-sided marketplace and removes fake listings from a live commercial domain.

**How:** Create public read-only Postgres views (public_artists, public_pieces) that project only columns where visibility flags allow, grant anonymous SELECT via the Data API, then in index.html replace the DATA constant with a fetch to the same dataApiUrl used in planargate.html's api() helper (keep DATA as offline fallback). Delete or clearly flag the three fictional artists in DATA.artists.

**Career angle:** Turns 'made a static site' into 'shipped a database-driven marketplace with RLS-scoped private data and curated public views' — a full-stack story that holds up in any interview.

### 2. Enforce invite-only auth and gate the debug diagnostics  `impact 5/5 · effort S`

**Why:** renderLogin() lets anyone call authClient.signUp.email, and notLinkedMsg() then shows them your schema internals (artists.user_id, the /whoami view, exact SQL). It's the kind of finding a security reviewer flags in the first ten minutes.

**How:** Disable open sign-up in Neon Auth (or require an invite code checked against an invites table before calling signUp.email in the login submit handler in planargate.html), and wrap the SQL/whoami output in notLinkedMsg() plus the console.log of the JWT in getToken() behind a ?debug=1 query flag.

**Career angle:** Demonstrates security judgment — the differentiator between hobby full-stack and hireable full-stack.

### 3. Commit schema.sql and write a real README  `impact 4/5 · effort S`

**Why:** The repo currently cannot explain itself: no README, and the Postgres schema/RLS policies/column grants the portal depends on (referenced in planargate.html error copy) live only in the private vault. A hiring manager clicking through sees two HTML files and no story; a future maintainer can't rebuild the backend.

**How:** Add schema.sql (artists, artist_pieces, whoami view, RLS policies, grants — none of it is secret) and a README.md covering: what the business is, the architecture (GitHub Pages static frontend + Neon Auth + Data API + RLS, zero servers), a diagram of the auth/token flow in getToken(), and local dev instructions. Link the live site.

**Career angle:** Highest ROI portfolio move in this repo: the impressive part (serverless RLS-backed portal) is currently invisible without reading source.

### 4. Pin and harden the better-auth CDN import  `impact 4/5 · effort S`

**Why:** loadAuth()'s unversioned import('https://esm.sh/better-auth/client') means any upstream release can break every artist's login with no code change on your side — a production reliability hole the code comment already acknowledges.

**How:** Pin an exact version (e.g. https://esm.sh/better-auth@X.Y.Z/client) in planargate.html CONFIG area, or vendor the built client into assets/ since the repo is already dependency-free; keep the existing fail() fallback message.

**Career angle:** Shows supply-chain and production-reliability awareness.

### 5. Consolidate the two portals  `impact 3/5 · effort S`

**Why:** index.html's #/portal demo (its own ARTIST_SHARE/owedOf math, 'Sign in as Vela Marchetti' links) coexists with the real planargate.html, and the footer 'Artist login' link points at the demo. A real invited artist following the site's own link lands in a fake dashboard.

**How:** Point the footer 'Artist login' anchor in index.html at /planargate.html, then delete viewPortalLogin()/viewPortal() and the portal money helpers (num/owedOf/ARTIST_SHARE) from index.html, or keep the demo but move it behind an explicit 'Preview the portal' link on a docs page.

### 6. Add a smoke test + CI, matching the ronin-survivor pattern  `impact 3/5 · effort M`

**Why:** There is currently no automated check that a commit didn't break the router, the escaping, or the portal render paths; the one workflow this repo ever had was deleted. He already built exactly this harness for ronin-survivor (test/smoke.js driving the inline script in Node).

**How:** Port the ronin-survivor test/smoke.js approach: load index.html's script under a DOM stub, drive route() through #/alters, #/piece/p1, #/artist/viviane, #/portal and assert non-empty innerHTML and correct esc() behavior; add .github/workflows/test.yml running it on push. For planargate.html, unit-test jwtPayload(), money(), and the api() error paths with a fetch stub.

**Career angle:** Reusing his own test harness across repos is a strong 'engineering habits' signal — consistency reads as seniority.

### 7. Real payments: replace mailto enquiries with Stripe Payment Links  `impact 3/5 · effort M`

**Why:** enquireHref() funnels purchase intent into an email draft — maximal friction for a one-of-a-kind art business where impulse matters. Payment Links require no backend, fitting the zero-server architecture.

**How:** Add a stripe_link column to pieces (or a field in DATA for now); in viewPiece(), render the 'Enquire to buy' .btn as a Stripe Payment Link when present, keeping mailto as fallback; mark the piece reserved on webhook via a tiny Neon function or manually at first.

**Career angle:** Adds 'integrated payments into a live commerce site' to the resume and creates actual revenue.

### 8. Sharing/SEO pass: OG meta, image alt text, per-piece share cards  `impact 2/5 · effort M`

**Why:** The product is visual art sold largely through Instagram (@dankomphalos, artist IG links) but the site has no Open Graph tags and every artwork is an unlabeled CSS background — links shared to social render blank.

**How:** Add og:/twitter: meta to both HTML heads; give pieceArt() a role='img' + aria-label with title/artist; since hash routes can't vary OG tags, generate lightweight static share pages per piece (or move to query-param routing with a 404.html redirect shim on Pages).


## Skills this repo proves (for hiring managers)

- Serverless full-stack architecture: static GitHub Pages frontend talking directly to Postgres via a PostgREST-style Data API, with security pushed into row-level security policies and JWT verification — a modern, cost-zero pattern he clearly understands rather than cargo-cults (getToken() correctly distinguishes the JWKS-verifiable JWT from the opaque session token).
- Auth integration and debugging under ambiguity: the commit trail (magic link → discovered unavailable → pivoted to email+password → false-success bug fixed → JWT accessor verified live) shows real API-integration grit, not tutorial-following.
- Developer-experience / operability instincts: self-diagnosing error screens that print the exact remediation SQL and probe server-side identity (notLinkedMsg + /whoami) — SRE-grade thinking applied to a two-person art business.
- Visual design and art direction: a cohesive gothic design system (type scale, palette extracted from the flagship painting, deterministic on-brand placeholder art) built in raw CSS with no framework.
- Product/business design for a two-sided marketplace: the consignment model (advance up front, artist keeps the lion's share, cash-out on demand, per-field privacy) is encoded directly in the data model and copy.
- Frontend fundamentals without a framework: hand-rolled hash router, template-literal view functions, consistent output escaping, responsive layout — proves he doesn't need React to ship.


## Career signals

- Ships to production: live custom domain, real business intent, real third-party services (Neon) integrated — not a toy in a sandbox.
- Strong git hygiene: 50 commits over 16 days, each small, descriptive, and honest (explicit #LLM-generated tags, avatar-prefixed messages from his ConductiveOS agent workflow) — evidence he can run an effective AI-assisted development process, which is itself a marketable skill in 2026.
- Deliberate repo curation (moved internal business tooling out of the public repo to keep it 'exactly the live build') shows he thinks about what a repo is for.
- Gaps a hiring manager would notice: no README, no tests, no CI, security naivety (open sign-up + schema-leaking debug output on a production auth page), and fictional artists with prices on a live commercial site — the polish is visual, not operational.
- The most impressive engineering (RLS-scoped portal, JWT flow, self-healing error screens) is completely undiscoverable without reading source — a documentation problem, not a skill problem.
- Breadth signal when paired with his other repos: this proves design + full-stack + commerce; ronin-survivor proves systems programming + testing discipline; together they support 'product engineer' positioning at AI-native startups better than either alone.


## Monetization angles

- It already is a business: the consignment model takes ~12% of retail (ARTIST_SHARE 0.88 in index.html) — the fastest revenue lever is reducing purchase friction by replacing mailto enquiries with Stripe Payment Links per piece.
- Commission pipeline: add a 'commission an alter' intake form (artist, card, budget) feeding the same Neon DB — commissioned alters typically price higher than inventory and require zero stock risk.
- Etsy cross-listing leverage: the Shop field just added to artist profiles (commit 043c5e5) can become affiliate/referral tracking or a managed-Etsy-listing service for roster artists.
- White-label the portal: 'Planar Gate' as a hosted consignment-portal product for other small galleries/alterists — the zero-server Neon architecture makes per-tenant cost near zero; even 2-3 galleries at $30-50/mo validates it as a SaaS story for his resume.
- Prints and playmats of originals (the hero painting is genuinely striking) — print-on-demand needs no inventory and monetizes the existing art direction.


## Standout artifacts to show off

- planargate.html — a complete auth-to-dashboard artist portal (Neon Auth sign-in, JWT minting via /token, RLS-scoped PostgREST queries, onboarding wizard with per-field privacy toggles) in ~360 dependency-light lines; the notLinkedMsg() error screen that prints the operator's exact fix SQL and probes a /whoami view is the single most senior-engineer-flavored code in the repo.
- index.html — the design system: palette variables derived from the featured painting, the hash()->ART_PALETTE deterministic placeholder-art generator (lines ~270-290) keeping an unphotographed catalogue on-brand, and a clean hand-rolled hash router with consistent XSS escaping.
- The git log itself — 50 tight, honest, well-scoped commits documenting a real debugging arc (magic-link dead end -> email+password pivot -> session-token vs JWT distinction) and a disciplined AI-assisted workflow; worth showing alongside the code.


## Cross-repo connections

- ConductiveOS: already the operational backend — the deal calculator and (presumably) schema.sql live in the vault's 07_projects/dankomphalos/. Add a Cloud-avatar Alarm routine that queries the Neon Data API weekly and files a stock/owed-balance report to the vault; the portal becomes a live data source for his personal OS, a great agent-workflow demo.
- mattdanusergrant (MDG.com portfolio): write the case study — 'a zero-server artist consignment portal with Neon Auth + Postgres RLS on GitHub Pages' — using his existing case-study-forge skill; this repo is the strongest full-stack artifact he has to point recruiters at, but only if narrated.
- cartomancy: name implies card/divination territory adjacent to the same Magic/Sorcery TCG audience; cross-link the two sites and reuse index.html's card-frame rendering (.art/.frame CSS) and the hash->palette placeholder-art trick for card displays.
- ronin-survivor: port its test/smoke.js + .github/workflows/test.yml pattern here (the harness for driving an inline <script> headlessly is directly reusable); conversely, Dank Omphalos's artist roster is a natural commissioning pipeline for game art that currently sits gitignored in ConductiveOS's 10_game-asset-library.
- mustdesigngames / mdgarage / fortkickass: extract the design tokens (Cinzel/Garamond stacks, the ember/twilight palette variables, .btn/.card patterns) into a tiny shared CSS file — a one-evening job that makes all his sites read as one studio brand.
- daily-dividend-lab: the portal's ledger math (advances, owed-on-sale, cash-out) and money()/stat-tile components overlap with dividend-tracking UI; a shared vanilla-JS ledger/stat-card component would serve both.


#LLM-generated
