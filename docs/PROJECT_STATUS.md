# Project status and machine handoff

Last updated: 2026-08-24. Current live extension version: 0.9.1 on all three
stores. Version 0.9.2 (i18n release) is submitted to Edge (in review, ~7
business days) and Firefox AMO (in review, up to 24h+); Chrome upload is
blocked until its in-flight promo-tile-only review clears. Source HEAD is
**0.9.3**, the next unsubmitted catalog update; it must not be substituted for
the already-built 0.9.2 upload.

## Current state

- Chromium, Edge, Firefox, and Safari-source builds are generated from one
  offline WebExtension engine.
- Script conversion is bidirectional between Latin and Cyrillic.
- Ekavian, Ijekavian, and the reviewed Ikavian beta vocabulary convert in both
  directions.
- Popup choices apply immediately and are tab-local by default.
- **Remember on this site** optionally reapplies the selected modes after
  navigation. Reviewed portal aliases share one finite rule; unknown sites stay
  exact-host only.
- Firefox includes an opt-in, single-host, 40-entry local diagnostic log for
  remembered-navigation testing; it stores no page text or full URLs.
- The interface can switch independently between Latin and Cyrillic.
- Dialect changes can be highlighted without wrapping or rewriting page HTML.
- The project makes no browsing-time network request and stores no page text.

## Verified baseline

- `npm run check`: 91/91 offline unit and integration tests pass (including
  build integrity, curated-catalog invariants, exact outreach-site and
  browser-verified technology-site boundaries, lexicon utils, jat reviews, and
  CLDR territory comparisons).
- `npm run test:browser-dom`: 12/12 browser-DOM integration checks pass in
  headless Chrome on macOS. The fixture covers the conversion engine and content
  controller, including protected text, dynamic insertion, restoration, and
  frozen portal samples. It does not validate extension installation, manifests,
  popup controls, or browser permission flows.
- All four browser targets build and package successfully (`scripts/verify-build-outputs.mjs`: 24/24 build checks pass; 600 explicit host permission patterns generated for Firefox by source v0.9.3, covering 137 catalog families). This script validates the tokenized `__MSG_extName__` manifest name against the resolved default-locale message rather than a hardcoded literal string.
- Mozilla `web-ext` 10.6.0 lint: 0 errors, 0 warnings, and 0 notices.
- Frozen portal fixtures cover RTS, Index.hr, NSPM, Vijesti.me, and Klix.ba.
- Xcode 26.6 compiles `Prepisi (macOS)` and `Prepisi (iOS)` Safari App Wrappers cleanly for macOS 26.5 and physical iPhone 14 (iOS 26.5.2).
- Firefox 153.0.4 on macOS passed core conversion, restoration, highlighting,
  tab/host isolation, protected and dynamic fixture content, and remembered
  navigation after an idle event-page interval. The complete
  platform checklist remains open; see
  [`docs/APPLE_PLATFORM_TEST_2026-08-12.md`](APPLE_PLATFORM_TEST_2026-08-12.md).
- Chrome 151 on macOS passed core RTS and Klix conversion/restoration,
  highlighting, repeated modes, dynamic and protected-content fixtures,
  tab/host isolation, and remembered same-host navigation after a manual
  Developer mode load. Restricted-page and offline installed-extension checks
  also pass; blocked live sites and the remaining recovery gates stay open.
- Safari 26.5.2 on macOS subsequently loaded the development extension and
  passed conversion, restoration, remembered next-article navigation,
  backgrounding, and offline conversion. Custom Highlight ranges did not paint
  on an affected RTS layout, consistent with open WebKit bug 307455.
- The signed 0.9.1 macOS Safari build also passes the corrected page-local
  Restore behavior, remembered sharing from `rts.rs` to `www.rts.rs`, and Klix
  isolation. Three stale 0.9.0 QA registrations were removed so Safari exposes
  one signed 0.9.1 test entry.
- The rebuilt iPhone Safari runtime confirms that the corrected Restore action
  is page-local and that `rts.rs`/`www.rts.rs` share one remembered rule while
  Klix remains isolated. Long-page/cross-tab state, a roughly 30-minute
  background interval, and offline Restore/reconversion pass. Highlighting
  paints on an ordinary RTS layout but still fails on the affected layout,
  consistent with WebKit bug 307455. A forced OS low-memory discard remains
  unverified.
- The user reviewed the 2026-08-13 source/converted screenshot pack and accepted
  its linguistic results without recording an issue. Edge-on-macOS testing is
  deferred and is not part of the current publishing pass.
- The project owner reports Windows desktop Chrome, Edge, and Firefox testing
  completed 2026-08-12 on the prior development machine (Windows 11 Pro 25H2,
  Chrome 151.0.7922.138, Edge 151.0.4129.78, Firefox 153.0.3 — the current
  stable releases for that date), via a mix of manual and AI-agent-assisted
  testing; see `docs/WINDOWS_DESKTOP_TEST_2026-08-13.md`.
- The release owner publishes as an individual under the dedicated project
  identity `hepsesus@gmail.com`. Public publisher display name is `Nemanja G`.
- GitHub `vokativ/prepisi` is public. Privacy URL:
  `https://github.com/vokativ/prepisi/blob/main/PRIVACY.md`.
- Toolbar icons shipped 2026-08-17 use the original `PRE` / `ПРЕ` lockup, not
  Balkan Sans outlines. **The popup wordmark remains Balkan Sans-derived**;
  confirm its raster-output right or replace it before treating the branding
  release gate as closed. Apple Developer Program enrollment remains postponed.
- Store status: Chrome Web Store item `lgcbhfgbbjdhglmomlgkbeikcngjhikb` is
  **Approved & Published** (live at
  `https://chromewebstore.google.com/detail/prepiši/lgcbhfgbbjdhglmomlgkbeikcngjhikb`);
  Firefox AMO slug `prepisi-converter` is **Approved & Published**, including
  Firefox for Android (live at
  `https://addons.mozilla.org/firefox/addon/prepisi-converter/`); Microsoft
  Edge product `0575918a-bf45-4fee-9f26-f28fcdf02398` is **Approved &
  Published** (live at
  `https://microsoftedge.microsoft.com/addons/detail/prepi%C5%A1i/idgdmkmmdemdhdkenlodijkljpbckool`).
  Check-back dates and social copy live in
  [`docs/LAUNCH_AND_SOCIAL.md`](LAUNCH_AND_SOCIAL.md).

Run after cloning on another machine:

```text
npm run check
npm run build:all
```

No dependency installation is currently required for the ordinary tests and
builds beyond Node.js. Corpus regeneration uses the pinned external inputs and
commands documented in `CONTRIBUTING.md` and `docs/DIALECT_DATA.md`.

## Repository and licensing

- Primary project license: GPL-3.0-only.
- `ATTRIBUTIONS.md` records third-party language-data provenance and required
  notices.
- Never commit the privately licensed Balkan Sans ZIP/OTF files, corpus caches,
  signing keys, generated browser folders, or packaged extension ZIPs. The
  repository ignore rules enforce these boundaries.
- The GitHub repository is public. Balkan Sans OTF/ZIP files stay uncommitted.
  Toolbar icons are original, but the popup wordmark remains Balkan Sans-derived;
  see `ATTRIBUTIONS.md` for the remaining distribution-rights gate.
- A future non-GPL integration can be discussed with maintainers, but would
  require author permission for affected data or replacement data.

## Next release work

1. **Resolve the popup-wordmark rights gate.** Confirm Typotheque permits
   distribution of the existing Balkan Sans-derived raster, or replace
   `assets/wordmark.png` with independently sourced artwork. Do not call the
   branding release gate closed before then.
2. **Watch the published store listings** for review follow-up and user
   feedback. Chrome, Firefox, and Edge are all live.
3. **Retest the Mozilla-signed XPI** on Firefox desktop and Android remembered
   navigation before claiming the signed package is fully supported.
4. **Follow up the README update** with the launch post. Do not claim Safari
   distribution until the paid Apple Developer Program is enrolled and an app
   is submitted.
5. **Apple remains postponed.** Enroll in the paid Developer Program only when
   there are more apps to publish; then register `com.vokativ.prepisi` /
   `com.vokativ.prepisi.Extension`.
6. **Prepare v0.9.3 only after the v0.9.2 store path is resolved.** Source
   version 0.9.3 expands the remembered-site catalog from 81 to **125**
   families. It adds fifteen vetted regional IT/technology specialist portal
   families (Startit, Svet Kompjutera, BuffGaming, ITNetwork, Sajber Sfera,
   Netokracija Croatia/Serbia, BUG/Mreža, PC CHIP, VIDI, HCL, PC Ekspert,
   Mob.hr, ICT Business, IT Portal); eight dedicated regional sports
   publications (Sportske.net, Sport Klub RS/HR, Sportski žurnal, Sportnet,
   Reprezentacija.ba, CG Sport, Sportski.me); and five separately hosted,
   betting-linked sports editorial portals (Mozzart Sport, Meridian Sport
   RS/BA/ME, Germanijak). The latter use a narrow `commercial` tier: betting,
   account, payment, odds, API, advertising, and static hosts stay absent.
   Reader/WAF failures were rechecked in the local Chrome CDP browser: PC
   Press, ITNetwork, Sajber Sfera, Netokracija Srbija, and ICT Business are
   now browser-verified; only Benchmark remains blocked even in the real
   browser. The outreach tier excludes Reddit, Discord, Google Groups, mailing
   lists, broad parent domains, and other shared/social surfaces; the three
   exact language-project Wikipedia subdomains are the stated
   community-editable exception. Firefox's predeclared **566** explicit
   host-permission patterns cover the whole catalog (not 566 sites), including
   46 patterns from outreach hosts. Firefox is technically authorized on
   declared pages, but Prepiši makes no browsing-time network request and
   injects only after a local remembered rule;
   Chromium/Edge/Safari request a host only after the user opts into
   **Remember on this site**. The full dated evidence, alias checks, and
   exceptions (notably TLS-broken FCJK and Benchmark's persistent Cloudflare
   block) are in
   [`research/CURATED_EDITORIAL_PORTALS.md`](../research/CURATED_EDITORIAL_PORTALS.md).
   Before submission, manually re-check the documented hosts and Firefox
   signed-package behavior.
7. **Shipped v0.9.2: Chrome/Edge/Firefox name+description i18n, submitted to
   all three stores.** `_locales/{en,sr,hr,bs}/messages.json` plus
   `manifest.json`'s `__MSG_extName__` / `__MSG_extDescription__` /
   `default_locale` shipped in v0.9.2. `npm run check` 88/88 (incl. two new
   tests: manifest i18n tokens, cross-locale key/message parity),
   `npm run build:all`, `node scripts/verify-build-outputs.mjs` 24/24 (after
   fixing a real bug this release exposed: the script rejected the
   tokenized manifest name), Firefox `web-ext lint` 0/0/0.
   - **Submission results (2026-08-24):**
     - **Chrome:** blocked. The dashboard disables new package uploads while
       a submission is "Pending review" — the small-promo-tile fix from
       earlier this session is still in Chrome's review queue. v0.9.2 must
       wait for that to clear before it can be uploaded.
     - **Edge:** v0.9.2 package uploaded and verified (Partner Center itself
       reported "Languages in package: Bosnian, English, Croatian, Serbian"
       — Edge, unlike Chrome, does not reject the `bs` locale folder). All
       four per-locale store listings (name/description/logo/small tile)
       filled and marked Complete, then submitted: status **"In review,"
       expect a response in 7 business days.** v0.9.1 stays live during
       review.
     - **Firefox AMO:** v0.9.2 XPI uploaded, validated with 0 errors/warnings,
       Firefox desktop + Android compatibility enabled, submitted ("may take
       up to 24 hours, longer if selected for manual review"). AMO's
       per-locale store listing is a *separate* system from the package
       `_locales/` folder (unlike Chrome): Hrvatski and Srpski listing
       entries already existed with real translated name/summary/description
       (pre-existing project work, not written this session) and were
       re-saved to confirm persistence. Live-verified in a real browser
       (not a locale-blind fetch) at `addons.mozilla.org/hr/.../` and
       `/sr/.../` — both correctly serve the Croatian/Serbian text. AMO's
       "New Locales" picker does not offer Bosnian at all (a real gap in
       AMO's listing-locale list, separate from Firefox's runtime
       `_locales/bs` support, which does work).
   - `scripts/build-extension.mjs` shares one `_locales` copy across all four
     targets, so this was correctly treated as a **three-store release**
     (Chrome, Edge, and Firefox), not Chrome/Edge-only as first assumed.
   - Bosnian (`bs`) ships and is confirmed functional on Firefox and Edge;
     Chrome's fixed ~55-locale list excludes `bs`, so Chrome will silently
     ignore that folder once its v0.9.2 upload eventually goes through —
     Bosnian-locale Chrome users fall back to English there. Real platform
     constraint, not a bug.
   - Montenegrin has no shippable browser-UI locale on Chrome, Edge, or
     Firefox today (no `cnr`/`me` code on Chrome's list, no Montenegrin
     Firefox language pack), so an in-extension-name/description Montenegrin
     locale is not currently achievable on any of the three; the extension's
     own script/dialect conversion still covers Montenegrin readers
     regardless.
   - Packaging (`npm run package`) now runs on any OS with only Node.js: it
     was rewritten (`scripts/package.mjs`) as a dependency-free ZIP writer
     (hand-written local/central-directory/EOCD structures via `node:zlib`
     DEFLATE + a small CRC32 table, no third-party npm packages, no `zip`/
     `7z`/Python requirement). Verified independently against `unzip -t`,
     `python3 -m zipfile -t`, and `7z t` (all pass), and against
     `test/package.test.js`, which parses the archives back with its own
     reader (`zlib.inflateRawSync`, a different code path from the writer)
     and asserts exact content equality against `build/<target>` plus
     run-to-run byte-for-byte reproducibility. The Windows-only
     `scripts/package.ps1` (`Compress-Archive`) is removed; there is now one
     canonical packaging implementation for every OS, and it produced the
     actual ZIPs uploaded to Edge and AMO above.
   - **Still open:** upload v0.9.2 to Chrome once the pending promo-tile
     review clears (package is already built in `dist/`, nothing else
     blocks it). Retest the newly Mozilla-signed v0.9.2 XPI on Firefox
     desktop and Android before claiming full v0.9.2 support — this is a
     fresh signed artifact and does not inherit 0.9.1's signed-package
     verification.

8. **Expanded the still-unreleased source catalog from 125 to 134 families
   (2026-08-24), on top of the unsubmitted v0.9.3 work above.** Added nine
   read-verified long-form culture/analysis/criticism portals: Velike priče,
   Vreme, Nedeljnik, Peščanik (Serbia); Lupiga, Kritika HDP, Booksa, Portal
   Novosti (Croatia); Prometej.ba (Bosnia and Herzegovina). Portal Novosti's
   own automated read (direct fetch, a rendering proxy, and a real headless
   browser) was blocked by an active Cloudflare Turnstile challenge; it was
   added only after the user supplied a live real-browser screenshot of
   `www.portalnovosti.com` showing a dated 24 August 2026 article and the
   site's own Ćirilica/Latinica script toggle — script conversion is
   confirmed robust there, but the site's own content does not exercise
   Ekavian/Ijekavian dialect conversion. Firefox's predeclared
   host-permission pattern count moved from 566 to **594**
   (`node scripts/verify-build-outputs.mjs`). `npm run check` 92/92 (incl. the
   raised `test/site-persistence.test.js` catalog cap, now 70-140), and
   `npm run build:all` all pass. Full per-site verification evidence and
   evaluated-but-excluded candidates (Telegram.hr already present; Radar
   already covered via the existing `rs-nova` family; Balkan Insight excluded
   as predominantly English; Mešanac excluded as non-editorial) are recorded
   in
   [`research/CURATED_EDITORIAL_PORTALS.md`](../research/CURATED_EDITORIAL_PORTALS.md).
   This further raises the still-unsubmitted v0.9.3 host-permission surface;
   review it alongside item 6 before that release ships.

9. **Added a large multi-language broadcaster exception (2026-08-24).**
   Deutsche Welle's Serbian/Croatian sections (`www.dw.com`), BBC News na
   srpskom (`www.bbc.com`), and Australia's SBS Bosnian/Croatian/Serbian
   sections (`www.sbs.com.au`) are each served from one large shared host
   that also carries many unrelated-language editions; `curated-portals.js`
   only matches/predeclares permissions per hostname, so each entry's
   permission and remembered-rule scope necessarily covers the whole shared
   host. Previously this was a hard exclusion (matching the existing SBS/UK
   rationale); the project owner explicitly requested the exception, judging
   that a user who enables **Remember on this site** on `dw.com`, `bbc.com`,
   or `sbs.com.au` knows which language section they are on. Catalog now 137
   families; Firefox's predeclared host-permission pattern count moved from
   594 to **600**. `npm run check` 92/92, `npm run build:all` and
   `node scripts/verify-build-outputs.mjs` 24/24 pass. See the new
   "Large multi-language broadcaster exception" sections in
   [`research/CURATED_EDITORIAL_PORTALS.md`](../research/CURATED_EDITORIAL_PORTALS.md).

Firefox Android event-page research is recorded in
`research/FIREFOX_MV3_ANDROID_EVENT_PAGES.md`; repository guardrails are also
summarized in `AGENTS.md`.
