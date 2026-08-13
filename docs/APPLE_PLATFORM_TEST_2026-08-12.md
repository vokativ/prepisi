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

On 2026-08-13, after correcting existing portal-family persistence and Restore
semantics, `npm run check` passed 86/86, all four targets rebuilt, and `web-ext`
10.6.0 again reported 0 errors, 0 warnings, and 0 notices for `build/firefox`.
The refreshed Safari resources compiled unsigned for macOS and generic iOS, and
the compiled extensions contained the corrected files. The regenerated build
still requires the focused signed runtime retest described below.

## Firefox 153.0.4 on macOS

Test method: official `web-ext` temporary profile using `build/firefox`.

Observed passes:

- In a fresh isolated profile, a local QA fixture passed one-click Cyrillic and
  combined Cyrillic plus Ijekavian conversion. Highlighting visibly marked all
  seven changed fixture words.
- Text inserted after conversion was converted automatically. Protected Google,
  Apple, and GitHub names, a URL, an email address, an explicit `lang="en"`
  span, and code remained unchanged.
- The popup switched fully to Cyrillic while the selected page modes remained
  Cyrillic plus Ijekavian, confirming that interface language is independent of
  page conversion.
- The exact-host permission prompt named only `127.0.0.1`. After permission was
  allowed and the event page had about 30 seconds to become idle, a new
  same-host document automatically opened in Cyrillic plus Ijekavian with
  highlighting. Turning Remember off reported that automatic application was
  disabled.

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
- The restricted-page friendly error, permission-panel proof that disabling
  Remember revoked the exact-host grant, live load-more/form/editable behavior,
  and offline conversion were not completed in this pass.

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

- A local QA fixture passed one-click combined Cyrillic plus Ijekavian,
  independent interface-language switching, repeated changes through Latin plus
  Ikavian without visible compounding, and dialect highlighting of 21 words.
- Dynamically appended text converted automatically. Protected Google, Apple,
  and GitHub names, a URL, an email address, a nested `lang="en"` span, and code
  remained unchanged.
- The website-access prompt requested only `127.0.0.1`. After the permission had
  been granted, enabling Remember stored the exact-host rule and a new same-host
  document automatically opened in the selected Ikavian mode. An unrelated
  Klix tab remained in source modes with Remember off. Turning Remember off
  disabled auto-apply, and another same-host document stayed in exact source
  text.
- On the live Klix article, Cyrillic conversion changed 314 text parts. The
  captured heading, six paragraphs, and ten link targets matched their exact
  pre-conversion values after restoration.

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

The user also completed Index.hr's human-verification screen in Chrome. A fresh
unattended Index.hr tab later stopped at Cloudflare's verification screen; it
was not bypassed. NSPM refused the connection and Vijesti.me reset it. The
restricted-page and offline checks were not attempted.

The first gesture that both requested host permission and enabled Remember did
not retain the rule. Repeating Remember after host permission already existed
stored it successfully. This is recorded as a one-off permission-flow concern,
not an unqualified first-try pass. Live Klix also exposed protected-text
concerns: its brand rendered partly as `Klix.ба`, and several foreign company,
job, English, and German snippets were transliterated. These cases need markup
and protection-policy investigation.

Result: Chrome macOS passes core conversion and exact restoration, repeated
modes, highlighting, dynamic fixture content, protected fixture content,
tab/host isolation, and remembered same-host navigation. The complete runtime
checklist remains pending on the restricted/offline checks, blocked live sites,
and the protected-text and first-permission-flow concerns. See the
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

An unattended Xcode-run retry was started after the Chrome and Firefox passes,
without enabling Safari's unsigned-extension bypass or weakening system
security. The Mac locked while the user was away, and macOS would not permit
further Safari/Xcode inspection or operation. The retry was stopped at that
point; it produced no additional Safari runtime evidence.

Result: source, wrapper, compilation, registration, and privacy setup are good;
normal Safari loading remains blocked on a trusted macOS development identity or
an Xcode-run context. No Safari macOS runtime support claim is made.

### 2026-08-13 follow-up

The generated development extension subsequently appeared in Safari, was
enabled, and was exercised by the user. This supersedes only the earlier loading
block above; it does not erase the historical setup evidence.

- Index.hr passed its human-verification screen and ordinary Prepiši conversion.
- On RTS, remembered conversion survived navigation to another article. The
  user also confirmed a roughly 30-minute background interval and conversion of
  an already loaded page after network access was removed.
- Safari's website-access UI offered a time choice such as one day or permanent
  access, rather than a Prepiši-specific “save this site” prompt. This is expected:
  [Safari manages](https://developer.apple.com/documentation/safariservices/managing-safari-web-extension-permissions)
  its own once/day/always access duration separately from the extension's local
  remembered rule.
- Index.hr also caused Safari to surface access for additional hosts loaded by
  the page. This is not evidence that those hosts belong in Prepiši's editorial
  alias family. [Open WebKit bug 290508](https://bugs.webkit.org/show_bug.cgi?id=290508)
  reports that broad optional URL patterns can make Safari ask about unrelated
  subresource hosts. A release follow-up should revisit Safari's broad optional
  host declaration; the extension cannot programmatically choose Safari's
  access duration or approve those prompts.
- Dialect words on a newly opened RTS article converted, but their highlights
  did not paint. Restoring the article and enabling the dialect/highlight choices
  again did not make them visible. The same extension build had painted ordinary
  and wrapped flex-layout fixture text. [WebKit bug 307455](https://bugs.webkit.org/show_bug.cgi?id=307455)
  documents that Custom Highlight ranges fail to paint for direct text in flex,
  grid, and table layout;
  the symptom is therefore recorded as a Safari/WebKit rendering limitation,
  not a conversion or saved-setting failure. A DOM-wrapping fallback was not
  introduced because it would change page structure and needs separate release
  design and testing.

Result after follow-up: Safari macOS loading, conversion, exact restoration,
remembered next-article navigation, backgrounding, and offline conversion pass.
Visible highlighting does not pass on affected live layouts, so full Safari
acceptance remains open.

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

At the end of the unattended desktop pass, Xcode's device service still listed
the iPhone as connected. No additional phone UI interactions were attempted
while the Mac was locked.

Xcode's device surface can capture the phone but cannot operate its touch UI, so
the remaining extension interactions require phone-side taps.

Result: physical-device build/deploy/enablement and core RTS conversion,
restoration, highlighting, and portrait-readability checks pass. Full iPhone
Safari acceptance remains pending until the rest of the phone checklist is
performed.

### 2026-08-13 follow-up

- The user confirmed the same next-article conversion behavior and the same lack
  of visible highlighting on the affected RTS layout as on desktop Safari.
- Increasing Safari's website text size changed the article text while the
  Prepiši popup stayed at its own size. The controls remained usable; popup text
  does not participate in per-website text scaling.
- The current build treated `rts.rs` and `www.rts.rs` as different remembered
  hosts outside Firefox. `/lat/` is only a path and was not part of matching.
- The user observed that an RTS page sometimes retained or skipped the saved
  dialect during the restore/offline sequence. Code inspection found two
  independent causes in the tested build: the apex/`www` exact-host split, and
  **Vrati izvorni tekst** overwriting the remembered rule with source modes and
  disabling the highlight preference.
- **iOS Pull-to-Refresh Behavior**: The user observed on physical iPhone Safari that when **Vrati izvorni tekst** (Restore original text) is clicked, the current page DOM correctly restores to original. However, performing a pull-down refresh in Mobile Safari reloads the document, causing the active **Zapamti na ovom sajtu** (Remember on this site) rule to automatically re-apply the saved script/dialect mode to the fresh page.
- **Product & UX Decision Note (Restore vs Site Memory)**:
  * **Question**: Should clicking **Vrati izvorni tekst** only restore the current document, or should it also clear/update the stored website preference ("Zapamti na ovom sajtu")?
  * **Best Practice Analysis**:
    1. *Page-Local Scope (Recommended)*: **Vrati izvorni tekst** acts solely as an instant, page-local toggle for the active tab's DOM. Users frequently check original spellings or foreign names on a single article without wanting to wipe out their site-wide preference to read that portal (e.g. RTS or Vijesti) in Cyrillic/Ijekavian on subsequent articles.
    2. *Site Rule Scope*: To permanently stop automatic conversion on a website, the user toggles off **Zapamti na ovom sajtu** or selects "Izvorno" as the target mode in the popup.
    3. *UX Clarity*: Maintaining explicit separation between *Document Actions* (Restore page) and *Site Memory Rules* ("Zapamti na ovom sajtu") prevents accidental rule loss and follows standard WebExtension persistence patterns.

A cross-browser implementation is documented above: reviewed portal aliases share one finite explicit rule family on every browser, while unknown sites remain exact-host; Restore changes only the current document, preserves the highlight checkbox, and leaves the remembered next-document rule intact. This correction requires a rebuilt/reloaded Safari wrapper and physical-device retest before it is recorded as an observed pass.

The broader 81-family DNS/editorial-alias audit has been completed and integrated into `src/curated-portals.js`. Its repeatable method and final findings are documented in
[`research/PORTAL_ALIAS_DNS_AUDIT_2026-08-13.md`](../research/PORTAL_ALIAS_DNS_AUDIT_2026-08-13.md).

## Acceptance and remaining gates

The 0.9 release is not yet accepted for macOS/iPhone support. The following
remain explicitly pending:

- Chrome macOS restricted-page and offline checks, retrying the blocked live
  matrix, and investigation of its protected-text and first-permission-flow
  concerns.
- Safari macOS affected-layout highlighting and a rebuilt alias/Restore retest.
- iPhone Safari completion of long-page, tab restoration, low-memory,
  protected-text, and rebuilt alias/Restore checks; affected-layout highlighting
  remains a known WebKit limitation.
- Firefox macOS completion of its restricted-page, permission-revocation,
  live-form/editable, and offline checks, plus investigation of the
  protected-text concerns.
- Edge macOS, iPadOS, store-signed Firefox, and TestFlight/App Store distribution.

Generated browser folders, wrapper projects, DerivedData, certificates,
provisioning profiles, and device output were kept outside version control.
The Firefox temporary `web-ext` session and disposable Chrome process were
stopped after testing. The Chrome and iPhone RTS pages were left in source mode
with highlighting off.
