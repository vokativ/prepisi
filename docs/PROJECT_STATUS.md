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

- `npm run check`: 87/87 unit and integration tests pass (including build integrity, lexicon utils, jat reviews, and CLDR territory comparisons).
- `npm run test:e2e`: 12/12 automated E2E browser tests pass cleanly in headless Chrome on macOS (covering DOM conversion, script transliteration, dialect changes, brand/URL protection, dynamic content insertion, text restoration, and portal fixtures).
- All four browser targets build and package successfully (`scripts/verify-build-outputs.mjs`: 24/24 build checks pass; 432 explicit host permissions generated for Firefox).
- Mozilla `web-ext` 10.6.0 lint: 0 errors, 0 warnings, and 0 notices.
- Frozen portal fixtures cover RTS, Index.hr, NSPM, Vijesti.me, and Klix.ba.
- Xcode 26.6 compiles `Prepisi (macOS)` and `Prepisi (iOS)` Safari App Wrappers cleanly for macOS 26.5 and physical iPhone 14 (iOS 26.5.2).
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

1. **Manual Device Retest**: Run physical iPhone 14 check with the compiled `Prepisi (iOS)` Safari App Wrapper and complete desktop Chrome/Firefox/Safari manual sign-off checklist (`HUMAN_TEST.md`).
2. **Make Repository Public**: Change GitHub repository visibility from private to public when ready.
3. **Public Privacy Policy**: Provide the public `PRIVACY.md` URL (e.g. GitHub raw URL or GitHub Pages link) for Chrome Web Store, Mozilla AMO, and Apple App Store submission listings.
4. **Store Packaging & Listings**: Upload built binaries (`build/chromium`, `build/firefox`, and Xcode iOS/macOS archives), prepare store screenshots, descriptions, and submit listings under GPL-3.0-only license.
`research/FIREFOX_MV3_ANDROID_EVENT_PAGES.md`; repository guardrails are also
summarized in `AGENTS.md`.
