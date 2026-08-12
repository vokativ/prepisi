# Apple-platform and macOS browser test — 2026-08-12

This report records observed results from the installed-software pass. It does
not promote a platform to supported unless the complete human checklist passed.
Device identifiers, account identifiers, private browsing data, certificates,
profiles, and device logs are intentionally omitted.

## Environment

- Apple Silicon Mac running macOS 26.5.2.
- Homebrew 6.0.17.
- Homebrew Node 26.7.0 and npm 11.19.0.
- Google Chrome 151.0.7922.138 and Firefox 153.0.4.
- Safari 26.5.2.
- Xcode upgraded during this pass from 26.4.1 to 26.6 (17F113).
- Xcode Command Line Tools 26.6; `xcode-select` points to
  `/Applications/Xcode.app/Contents/Developer`.
- Xcode iOS, iOS Simulator, and macOS 26.5 SDKs installed.
- Wired, paired iPhone 14 running iOS 26.5.2 with Developer Mode enabled.
- Edge was intentionally excluded. No iPadOS device was tested.

## Automated and packaging results

- `npm run check`: pass, 83/83 tests.
- `npm run build:all`: pass for Chromium, Edge, Firefox, and Safari source.
  Edge was built by the shared build command but was not installed or tested.
- `web-ext` 10.6.0 Firefox lint: 0 errors, 0 warnings, 0 notices.
- An untracked Swift Safari wrapper was generated from `build/safari` with
  development bundle identifier `com.vokativ.prepisi.dev`.
- The generated wrapper resources were byte-for-byte identical to
  `build/safari`.
- Xcode 26.6 compiled the macOS wrapper for arm64 with signing disabled and with
  Xcode's local ad-hoc signing.
- Xcode 26.6 compiled the iOS app and embedded Safari extension for the physical
  iPhone using automatic development signing. Deep signature verification
  passed, installation passed, and the containing app launched on the device.
- The iPhone developer disk image initially failed while the device was locked.
  After unlock, Xcode mounted it successfully and reported the image compatible
  and usable.

The generated manifest contains only `activeTab`, `scripting`, and `storage`,
plus optional HTTP/HTTPS host permissions. Static inspection found no extension
runtime `fetch`, XHR, WebSocket, or beacon implementation. The macOS converter
template gives the containing app a network-client entitlement, but the embedded
Safari extension has no network-client entitlement. No browsing-time extension
network request or telemetry was observed or found in source.

## Firefox 153.0.4 on macOS

Test method: official `web-ext` temporary profile using `build/firefox`.

Observed passes:

- RTS Latin to Cyrillic changed 260 text parts in one click. The article heading
  and body changed while the Latin URL and visible `RTS`, `iOS`, `YouTube`,
  `Facebook`, and `Twitter` names remained intact.
- Exact RTS restoration returned all 260 changed parts to the source text.
- Ijekavian conversion with highlighting changed 29 text parts and highlighted
  34 words without breaking the observed page layout.
- Combined Cyrillic plus Ijekavian conversion changed 260 text parts; examples
  included `VIJESTI`, `rješenje`, and the Cyrillic equivalents.
- Ikavian beta and Ekavian changes worked after the combined mode, including
  `vreme/vrijeme/vrime` and `rešenje/rješenje/rišenje` families. Repeated mode
  changes did not visibly compound. Returning both controls to source restored
  the original RTS heading and navigation.
- The popup interface switched between Latin and Cyrillic independently of page
  mode.
- Remembered-site mode was enabled for `rts.rs`. After the MV3 event page had
  been idle, a new same-host Latin-path article opened automatically in Cyrillic.
- An unrelated Index.hr tab and a Klix.ba tab opened with source script,
  source pronunciation, and Remember off. This passed the observed tab/host
  isolation check.
- On the live Klix article, Latin to Cyrillic changed 339 text parts. The page
  remained readable, link targets remained Latin, and visible `Shutterstock`,
  the main `Klix.ba` link, social-network labels, and job-company names remained
  intact. Restoration returned all 339 parts and the original headline/body.
- Klix Ijekavian to Ekavian with highlighting changed 41 text parts and
  highlighted 59 words. Visible examples included `riječima` to `rečima`,
  `gdje` to `gde`, `mjesto` to `mesto`, and `Podijeli` to `Podeli`.
- The user completed Index.hr's human-verification screen in Firefox. The
  Prepiši popup on that untouched tab showed source modes and Remember off.

Observed limitations and failures:

- NSPM failed to connect at both apex and `www` hostnames.
- Vijesti.me failed with Firefox `PR_CONNECT_RESET_ERROR`; the browser security
  failure was not bypassed.
- Klix exposed protected-text concerns requiring follow-up: one promo label
  rendered as `KLIX.БА`; quoted English text was transliterated; and source text
  containing `choditi` rendered with a mixed-script `цходити`. The page markup's
  language annotations were not audited during this pass, so these are recorded
  as concerns rather than accepted protected-text behavior.
- The restricted-page friendly error, exact memory-off permission revocation,
  live load-more/form/editable behavior, and offline conversion were not
  completed in this pass.

Result: useful Firefox macOS runtime coverage passed, including the previously
pending remembered-navigation behavior, but the full acceptance checklist did
not pass.

## Chrome 151.0.7922.138 on macOS

The isolated QA process was first launched with a disposable user-data directory
and the `build/chromium` load flags. Branded Chrome did not register Prepiši;
Chrome removed branded-build support for the `--load-extension` flag starting in
Chrome 137. The user then loaded `build/chromium` manually through Developer
mode. The initial disposable process was stopped after inspection.

Observed passes after the manual load:

- On the RTS Latin parity article, one-click Cyrillic conversion changed the
  heading and sampled article paragraphs fully. The live URL and article link
  remained Latin.
- Visible `RTS`, `iOS`, `YouTube`, `Facebook`, `Twitter`, and the Samsung ad
  brand remained intact.
- The three-column desktop layout remained readable and the embedded player and
  its controls remained present.
- Source restoration exactly matched the captured heading, four sampled article
  paragraphs (including punctuation and non-breaking spaces), and article href.
- Ijekavian plus highlighting changed visible families including `gde` to
  `gdje`, `obezbeđene` to `obezbijeđene`, `donela` to `donijela`, and `mere` to
  `mjere`; navigation examples included `VESTI` to `VIJESTI` and `Vreme` to
  `Vrijeme`.
- Dialect-changed words rendered with a yellow background and green underline
  in ordinary body, navigation, and sidebar text. The unchanged headline,
  embedded player, three-column layout, brands, iframes, and form/control
  elements remained present and readable.

The user also completed Index.hr's human-verification screen in Chrome. The
remaining live-site, remembered-navigation, restricted-page, dynamic-content,
and offline checks are not yet complete. NSPM refused the connection. New
Index.hr and Klix QA tabs encountered Cloudflare human checks; these were not
bypassed by automation. Vijesti.me reset the connection. After the highlighted
dialect pass, returning to source with highlighting off again matched the same
captured baseline; no visible compounding occurred across the repeated modes.

Result: core Chrome macOS conversion, protected-name sampling, layout, and exact
restoration pass. The complete runtime checklist remains pending. See the
[Chrome extension update](https://developer.chrome.com/blog/extension-news-june-2025)
for the branded-build flag change that prevented command-line isolated loading.

## Safari 26.5.2 on macOS

The regenerated macOS wrapper compiled successfully. Xcode's locally signed
build passed deep signature verification and PlugInKit registered its embedded
extension. Safari's Extensions settings did not list Prepiši and no Prepiši
toolbar item appeared on the open Index.hr tab. A later team-signed rebuild had
a team identifier but did not validate as trusted on macOS, so it was not used
to weaken Safari settings or enable the unsigned-extension developer bypass.

The user completed Index.hr's human-verification screen in Safari, but website
access prompts, conversion/restoration, remembered navigation, ordinary/flex
highlighting, and offline behavior were not observable with the regenerated
wrapper.

Result: source, wrapper, compilation, registration, and privacy setup are good;
normal Safari loading remains blocked on a trusted macOS development identity or
an Xcode-run context. No Safari macOS runtime support claim is made.

## Safari on iPhone 14 / iOS 26.5.2

Observed setup passes:

- The device is paired, wired, in Developer Mode, and visible to Xcode 26.6.
- Developer disk image services mounted and reported compatible/usable after the
  phone was unlocked.
- Automatic signing produced a development-signed arm64 containing app with the
  expected development bundle identifier and embedded extension.
- The signed app passed deep verification, installed on the phone, appeared in
  the developer-app inventory, and launched successfully.

Pending phone-side work:

- Prepiši was enabled by the user in iPhone **Settings → Apps → Safari →
  Extensions** and website access was allowed.
- Run the full live checklist in mobile Safari, including portrait popup size,
  touch, enlarged text, long pages, backgrounding, tab restoration, low-memory
  recovery, hostname-scoped access, protected text, and offline conversion.

After enablement, the RTS Latin test article was opened remotely in mobile
Safari. Xcode device screenshots confirmed that the source page renders
readably in portrait at normal text size. The user then selected Cyrillic in the
extension. A second device screenshot confirmed that the visible heading and
article body converted fully, `RTS` and the Latin hostname remained intact, and
the portrait layout, article player, and social controls remained readable.

- Returning to source restored the visible heading and sampled article text to
  the captured Latin baseline without a visible layout change.
- Ijekavian plus highlighting visibly changed `gde` to `gdje` and `obezbeđene`
  to `obezbijeđene`. The changed words had the expected yellow/green marking;
  the headline, player, hostname, portrait layout, and controls remained stable.
- Returning pronunciation to source and disabling highlighting restored the
  visible Latin baseline and removed the highlight styling without a layout
  change.

Xcode's device surface can capture the phone but cannot operate its touch UI, so
the remaining extension interactions require phone-side taps.

Result: physical-device build/deploy/enablement and core RTS conversion,
restoration, highlighting, and portrait-readability checks pass. Full iPhone
Safari acceptance remains pending until the rest of the phone checklist is
performed.

## Acceptance and remaining gates

The 0.9 release is not yet accepted for macOS/iPhone support. The following
remain explicitly pending:

- Chrome macOS completion of the remaining live matrix, remembered-navigation,
  restricted-page, dynamic-content, and offline checks.
- Safari macOS normal extension loading and full runtime pass.
- iPhone Safari completion of enlarged-text, long-page, backgrounding, tab
  restoration, low-memory, hostname-permission, protected-text, and offline
  checks.
- Firefox macOS completion of the remaining checklist and investigation of the
  protected-text concerns.
- Edge macOS, iPadOS, store-signed Firefox, and TestFlight/App Store distribution.

Generated browser folders, wrapper projects, DerivedData, certificates,
provisioning profiles, and device output were kept outside version control.
The Firefox temporary `web-ext` session and disposable Chrome process were
stopped after testing. The Chrome and iPhone RTS pages were left in source mode
with highlighting off.
