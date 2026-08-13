# Project status and machine handoff

Last updated: 2026-08-13. Current extension version: 0.9.1.

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

- `npm run check`: 86/86 offline unit and integration tests pass (including
  build integrity, lexicon utils, jat reviews, and CLDR territory comparisons).
- `npm run test:browser-dom`: 12/12 browser-DOM integration checks pass in
  headless Chrome on macOS. The fixture covers the conversion engine and content
  controller, including protected text, dynamic insertion, restoration, and
  frozen portal samples. It does not validate extension installation, manifests,
  popup controls, or browser permission flows.
- All four browser targets build and package successfully (`scripts/verify-build-outputs.mjs`: 24/24 build checks pass; 432 explicit host permissions generated for Firefox).
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
  completed on the prior development machine, via a mix of manual and
  AI-agent-assisted testing. No repository artifact captured exact versions or
  dates at the time; see `docs/WINDOWS_DESKTOP_TEST_2026-08-13.md`.
- The release owner chose individual publication under their personal legal
  name, not publication through the company account. Apple production signing,
  GitHub ownership, and store registrations must use the personal accounts.
- Personal Chrome, Mozilla, and Microsoft publisher-account setup and the
  recommended submission order are documented in
  `docs/PERSONAL_PUBLISHER_ACCOUNTS.md`. A read-only Gmail search found no prior
  registration evidence for those three developer programs in the connected
  mailbox.

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
- Keep the GitHub repository private until the right to distribute the Balkan
  Sans-derived raster identity is confirmed, or that branding is replaced.
  COMtext.SR's dataset redistribution terms were confirmed 2026-08-13 (CC BY
  4.0 International, any purpose including commercial, with attribution); see
  `ATTRIBUTIONS.md`.
- A future non-GPL integration can be discussed with maintainers, but would
  require author permission for affected data or replacement data.

## Next release work

1. **Finalize the 0.9.1 Candidate**: Review the release diff and generate clean
   store artifacts. The current publishing pass includes macOS Chrome, Firefox,
   and Safari plus physical iPhone Safari; Edge-on-macOS is explicitly deferred.
2. **Pre-Publishing Apple Signing Gate**: Enroll or sign in to the individual
   Apple Developer membership, select that personal team for every target, and
   register permanent Bundle Identifiers (`com.vokativ.prepisi` /
   `com.vokativ.prepisi.Extension`) before generating signed production release
   archives. The tested wrapper still uses temporary `.dev` identifiers.
3. **Resolve Public-Release Rights**: COMtext.SR's redistribution terms were
   confirmed 2026-08-13 (CC BY 4.0 International); see `ATTRIBUTIONS.md`. The
   remaining rights gate is the Balkan Sans-derived raster identity: confirm
   distribution rights with Typotheque or replace the icon/wordmark with
   originally licensed branding; see `research/BRAND_IDENTITY_ALTERNATIVES.md`.
   The Git history's personal Gmail address was sanitized 2026-08-13 (rewritten
   to the GitHub `noreply` address with `git filter-repo` and force-pushed);
   the local commit identity now also uses that address for future commits.
4. **Personal Repository and Privacy URL**: Reauthenticate GitHub as the intended
   personal owner, confirm whether `vokativ/prepisi` is the desired permanent
   repository, and publish `PRIVACY.md` at a stable public URL for the browser
   and Apple store listings.
5. **Store Packaging & Listings**: Upload built binaries (`build/chromium`,
   `build/firefox`, and Xcode iOS/macOS archives), prepare store screenshots and
   descriptions, and submit listings under the GPL-3.0-only license.

Firefox Android event-page research is recorded in
`research/FIREFOX_MV3_ANDROID_EVENT_PAGES.md`; repository guardrails are also
summarized in `AGENTS.md`.
