# Project status and machine handoff

Last updated: 2026-08-12. Current extension version: 0.9.0.

## Current state

- Chromium, Edge, Firefox, and Safari-source builds are generated from one
  offline WebExtension engine.
- Script conversion is bidirectional between Latin and Cyrillic.
- Ekavian, Ijekavian, and the reviewed Ikavian beta vocabulary convert in both
  directions.
- Popup choices apply immediately and are tab-local by default.
- **Remember on this site** optionally reapplies the selected modes after
  same-host navigation using hostname-scoped permission.
- Firefox includes an opt-in, single-host, 40-entry local diagnostic log for
  remembered-navigation testing; it stores no page text or full URLs.
- The interface can switch independently between Latin and Cyrillic.
- Dialect changes can be highlighted without wrapping or rewriting page HTML.
- The project makes no browsing-time network request and stores no page text.

## Verified baseline

- `npm run check`: 86/86 unit and integration tests pass.
- `npm run test:e2e`: 12/12 automated E2E browser tests pass cleanly in headless Chrome on macOS (covering DOM conversion, script transliteration, dialect changes, brand/URL protection, dynamic content insertion, text restoration, and portal fixtures).
- All four browser targets build and package successfully (`scripts/verify-build-outputs.mjs`: 24/24 build checks pass).
- Mozilla `web-ext` 10.6.0 lint: 0 errors, 0 warnings, and 0 notices.
- Frozen portal fixtures cover RTS, Index.hr, NSPM, Vijesti.me, and Klix.ba.
- Xcode 26.6 generates and compiles `Prepisi (macOS)` and `Prepisi (iOS)` Safari App Wrappers cleanly for macOS 26.5 and physical iPhone 14 (iOS 26.5.2).
- Firefox 153.0.4 on macOS passed core RTS/Klix conversion, restoration,
  highlighting, dynamic and protected-content fixtures, tab/host isolation, and
  remembered navigation after an idle event-page interval. The complete
  platform checklist remains open; see
  [`docs/APPLE_PLATFORM_TEST_2026-08-12.md`](APPLE_PLATFORM_TEST_2026-08-12.md).
- Chrome 151 on macOS passed core RTS and Klix conversion/restoration,
  highlighting, repeated modes, dynamic and protected-content fixtures,
  tab/host isolation, and remembered same-host navigation after a manual
  Developer mode load. The restricted/offline checks and blocked live sites
  remain open.
- Safari 26.5.2 on macOS subsequently loaded the development extension and
  passed conversion, restoration, remembered next-article navigation,
  backgrounding, and offline conversion. Custom Highlight ranges did not paint
  on an affected RTS layout, consistent with open WebKit bug 307455.
- The iPhone Safari follow-up reproduced that affected-layout highlighting
  limitation and exposed an `rts.rs`/`www.rts.rs` remembered-rule split plus a
  Restore action that overwrote the saved dialect. The code correction shares
  existing finite portal aliases on every build and makes Restore page-local;
  rebuilt Mac/iPhone runtime confirmation is pending.

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
- Keep the GitHub repository private until explicit COMtext.SR redistribution
  terms are confirmed or its derived observations are removed, and until the
  right to distribute the Balkan Sans-derived raster identity is confirmed.
- A future non-GPL integration can be discussed with maintainers, but would
  require author permission for affected data or replacement data.

## Next release work

1. Finish the dated macOS/iPhone pass: run the remaining Chrome/Firefox
   restricted-page and offline checks, reload the rebuilt Safari wrapper and
   confirm cross-alias/Restore behavior on macOS and iPhone, and complete the
   iPhone extension's remaining recovery and protected-text checks.
2. Investigate the Chrome/Firefox Klix protected-text concerns and Chrome's
   first-permission-flow concern, then retry Index.hr, NSPM, and Vijesti from the
   dated macOS report.
3. On the next Firefox Android session, enable the options-page diagnostic log
   for the explicit test domain and compare a clean temporary install with a
   clean Mozilla-signed XPI; add Nightly if the signed Release build still fails.
4. Run the remaining 0.9 human checklist in Chrome, Edge, and Firefox on Windows
   and Linux, then test the approved Edge mobile distribution path.
5. Test the Safari wrapper on iPadOS; Edge macOS remains intentionally deferred.
6. Continue reviewed dialect-vocabulary expansion and exact regression cases.
7. Completed the 81-family DNS/editorial-alias audit and integrated approved candidate
   subdomains into `src/curated-portals.js`; see
   [`research/PORTAL_ALIAS_DNS_AUDIT_2026-08-13.md`](../research/PORTAL_ALIAS_DNS_AUDIT_2026-08-13.md).
8. Resolve the two public-release licensing gates above.
9. Prepare store screenshots, descriptions, privacy URL, signing, and listings.

Detailed instructions are in `HUMAN_TEST.md`, `docs/LOCAL_INSTALL.md`,
`docs/RELEASE_COVERAGE.md`, and `research/BROWSER_COMPATIBILITY.md`. The exact
Firefox Android state and rationale are in `docs/FIREFOX_ANDROID_TEST.md` and
`research/FIREFOX_MV3_ANDROID_EVENT_PAGES.md`; repository guardrails are also
summarized in `AGENTS.md`.
