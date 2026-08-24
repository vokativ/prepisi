# Project status and machine handoff

Last updated: 2026-08-24. Current live extension version: 0.9.1. Version
0.9.2 (i18n release, see "Next release work" below) is prepared in the
repository and pending packaging/upload; it is not yet submitted anywhere.

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

- `npm run check`: 88/88 offline unit and integration tests pass (including
  build integrity, lexicon utils, jat reviews, and CLDR territory comparisons).
- `npm run test:browser-dom`: 12/12 browser-DOM integration checks pass in
  headless Chrome on macOS. The fixture covers the conversion engine and content
  controller, including protected text, dynamic insertion, restoration, and
  frozen portal samples. It does not validate extension installation, manifests,
  popup controls, or browser permission flows.
- All four browser targets build and package successfully (`scripts/verify-build-outputs.mjs`: 24/24 build checks pass; 432 explicit host permissions generated for Firefox). This script now validates the tokenized `__MSG_extName__` manifest name against the resolved default-locale message rather than a hardcoded literal string.
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
6. **Ship the prepared v0.9.2 name+description localization.** `_locales/{en,sr,hr,bs}/messages.json`
   plus `manifest.json`'s `__MSG_extName__` / `__MSG_extDescription__` /
   `default_locale` are committed, version-bumped to 0.9.2 in `package.json`
   and `manifest.json` together, and pass `npm run check` (88/88, including
   two new tests asserting manifest i18n tokens and cross-locale key/message
   parity), `npm run build:all`, `node scripts/verify-build-outputs.mjs`
   (24/24, after fixing a real bug this release exposed: the script rejected
   the tokenized manifest name), and Firefox `web-ext lint` (0/0/0).
   - **Correction to an earlier claim in this file:** direct verification
     against the live AMO listing (both `/sr/` and `/hr/` locale paths) shows
     Serbian/Croatian store-listing translations are **not** actually live on
     any store yet, contrary to a prior note here. Chrome's per-locale store
     listing is gated on the locales present in the *uploaded package's*
     `_locales/` folder (confirmed against Chrome's own developer docs), and
     the currently live 0.9.1 packages on all three stores predate this i18n
     work entirely (added one commit after the `v0.9.1` tag). Shipping
     localized store listings therefore requires the v0.9.2 package first.
   - `scripts/build-extension.mjs` shares one `_locales` copy across all four
     targets, so this is a **three-store release** (Chrome, Edge, and
     Firefox), not a Chrome/Edge-only change as previously assumed.
   - Bosnian (`bs`) is included and works on Firefox (Mozilla's WebExtensions
     i18n follows BCP 47 without a fixed locale whitelist), but Chrome and
     Edge silently ignore unrecognized locale folders and `bs` is not on
     Chrome's fixed ~55-locale list — Bosnian-locale Chrome/Edge users still
     fall back to English. This is a real platform constraint, not a bug.
   - Montenegrin has no shippable browser-UI locale on Chrome, Edge, or
     Firefox today (no `cnr`/`me` code in Chrome's locale list, and no
     Montenegrin language pack in Firefox), so an in-extension-name/description
     Montenegrin locale is not currently achievable in any of the three
     `_locales` systems; the extension's own script/dialect conversion still
     covers Montenegrin readers regardless.
   - Packaging (`npm run package`) requires Windows PowerShell
     (`scripts/package.ps1`, uses `Compress-Archive`) and must be run on the
     project owner's Windows machine; it cannot run on the Linux development
     workstation.
   - Release order: submit all three stores together (owner's explicit
     choice, overriding a more conservative staged rollout). Note this
     collides with the Chrome graphics-only promo-tile review already
     in flight from this same session — Chrome may end up processing two
     queued submissions.
   - Once Mozilla signs the v0.9.2 XPI, this resets the "retest the signed
     package on Firefox desktop and Android" gate (item 3 above) for the new
     version; the existing 0.9.1 signed-package verification does not carry
     forward.

Firefox Android event-page research is recorded in
`research/FIREFOX_MV3_ANDROID_EVENT_PAGES.md`; repository guardrails are also
summarized in `AGENTS.md`.
