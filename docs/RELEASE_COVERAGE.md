# Release coverage checklist

This file separates packages that can be generated now from platforms that have
actually passed human testing. Store acceptance and a successful device test are
required before changing a platform from **candidate** to **supported**.

Repository, Firefox Android, and partial Apple-platform validation completed on
2026-08-12:

- The shared automated suite passes 86/86, including frozen samples from
  Index.hr, NSPM, Vijesti.me, and Klix.ba.
- Chromium, Edge, Firefox, and Safari-source packages build successfully.
- Mozilla `web-ext lint` reports 0 errors, 0 notices, and 0 warnings for the
  Firefox/Android package.
- A Pixel 7 running Android 17 and Firefox 153.0.3 passed the temporary-install,
  portrait UI, conversion, restore, highlighting, protected-content, dynamic-text,
  tab-local-state, and live RTS checks. The exact results are in
  [`docs/FIREFOX_ANDROID_TEST.md`](FIREFOX_ANDROID_TEST.md).
- Firefox Android did not automatically apply either the original dynamically
  registered hostname rule or either of two reviewed static-catalog variants on
  the next document in initial temporary MV3 tests. The current candidate follows
  Mozilla's event-page pattern: generated `host_permissions`, a synchronous
  `webNavigation.onCompleted` listener, and conditional `scripting.executeScript()`.
  The exact temporary build also left a fresh RTS Latin homepage unchanged despite
  retaining the remembered Cyrillic rule. Firefox desktop and a signed-Android
  regression test remain before support can be claimed.
- The source contains no native binary or operating-system integration. The same
  Chrome/Edge/Firefox packages are therefore expected to run on Windows, macOS,
  and Linux, but the current 0.9 build still needs a fresh human runtime pass on
  every claimed browser/OS combination.
- Safari and all mobile targets require the corresponding Apple/Android device
  environment. A Windows-only check cannot honestly promote them to supported.
- On macOS 26.5.2, Firefox 153.0.4 passed live RTS/Klix conversion,
  restoration, highlighting, dynamic/protected-content fixtures, tab/host
  isolation, and remembered navigation after an idle event-page interval. NSPM
  was unreachable, Vijesti failed with `PR_CONNECT_RESET_ERROR`, and
  protected-text concerns on Klix plus restricted-page, permission-revocation,
  live-form/editable, and offline checks remain open.
- Chrome 151 did not load through the removed branded `--load-extension` flag,
  then passed core RTS/Klix conversion and exact restoration, highlighting,
  repeated modes, dynamic/protected-content fixtures, tab/host isolation, and
  remembered same-host navigation after the user performed a manual Developer
  mode load. Restricted-page/offline checks, blocked live sites, and
  protected-text and first-permission-flow concerns remain.
- Xcode 26.6 compiled the generated Safari wrapper. A development-signed iOS app
  installed and launched on an iPhone 14 running iOS 26.5.2. The enabled iPhone
  extension passed core RTS Cyrillic conversion, portrait readability, protected
  `RTS`/hostname sampling, and source restoration; the rest of the phone runtime
  checklist remains. Safari macOS did not expose the regenerated wrapper in
  Extensions settings.
- A 2026-08-13 follow-up superseded that Safari loading block: macOS Safari
  loaded the extension and passed conversion, restoration, remembered
  next-article navigation, backgrounding, and offline conversion. macOS and
  iPhone both failed to paint Custom Highlight ranges on an affected RTS layout,
  consistent with open WebKit bug 307455. The iPhone run also exposed the old
  apex/`www` persistence split and Restore-overwrites-memory behavior. Their
  automated corrections pass, but rebuilt Safari runtime confirmation remains.
- Exact evidence and pending gates are recorded in
  [`docs/APPLE_PLATFORM_TEST_2026-08-12.md`](APPLE_PLATFORM_TEST_2026-08-12.md).

## Intended coverage

| Platform | Package | Current gate | Intended status |
| --- | --- | --- | --- |
| Chrome desktop (Windows/macOS/Linux) | `prepisi-<version>-chromium.zip` | Broad macOS runtime pass; restricted/offline and blocked-site checks, other-OS smoke tests, and Chrome Web Store submission remain | First-class |
| Edge desktop (Windows/macOS/Linux) | `prepisi-<version>-edge.zip` | Smoke test on all three OS families and Partner Center submission | First-class |
| Edge Android/iOS | Same Edge Add-ons listing | Microsoft mobile certification/visibility and phone tests | First-class after validation |
| Firefox desktop (Windows/macOS/Linux) | `prepisi-<version>-firefox.zip` | Lint and broad macOS runtime pass; remaining restricted/offline/form checks, other-OS smoke tests, and AMO signing remain | First-class |
| Firefox Android | Same AMO package | Core phone smoke passed; remembered navigation, remaining mobile checks, AMO signing, and signed-build retest remain | First-class |
| Safari macOS | `prepisi-<version>-safari-source.zip` | Wrapper loads and broad runtime passes; affected-layout highlighting and rebuilt alias/Restore retest remain | First-class |
| Safari iOS/iPadOS | Same Apple project | iPhone build/install/enable/core RTS pass; rebuilt alias/Restore, recovery/protected-text, iPad, TestFlight, and App Store tests remain | First-class |
| Brave/Opera desktop | Chromium package | Compatibility smoke tests | Best effort |
| Yandex Android | Published Chromium listing or unpacked test | Manual phone test | Exploratory |
| Orion iOS/iPadOS | Compatible published package | Manual phone/tablet test | Exploratory |
| Samsung Internet | Separate approved Android application | Samsung partner access | Partnership backlog |

Yandex and Orion are useful because they expose manual mobile compatibility
paths that the dominant Chrome-on-Android and Firefox-on-iOS products do not.
They are test routes, not substitutes for Chrome, Edge, Firefox, or Safari on
desktop.

## Shared smoke test

Run this checklist independently on each platform that will be called supported:

- Convert the paired RTS Latin and Cyrillic articles in both directions.
- Restore the original text exactly.
- Change Ekavian, Ijekavian, and Ikavian forms in both scripts.
- Confirm one-click changes and tab-local state.
- With **Remember on this site** off, confirm a new document starts from its
  source state. Verify a curated portal's explicit apex/`www` aliases share the
  rule on every browser; Firefox should need no second catalog-host prompt,
  while other browsers may request that finite alias family. Confirm unrelated
  hosts do not inherit the rule.
- Toggle dialect highlighting and confirm script-only changes are not highlighted.
- Check protected brands, foreign names, URLs, email addresses, form controls,
  and explicitly foreign-language spans.
- Confirm newly inserted article text is converted.
- Confirm a restricted browser page produces the friendly error state.
- Repeat the core conversion while the device is offline.

Real-site smoke-test set:

- RTS paired scripts: `https://rts.rs/lat/vesti/drustvo/6017125/gornji-milanovac-restrikcije-voda-cacak.html`
  and the same URL without `/lat`.
- Index.hr Latin article: `https://www.index.hr/chill/clanak/taron-egerton-otkrio-detalje-izbacene-scene-poljupca-u-legendi-s-tomom-hardyjem/2822634.aspx`.
- NSPM Cyrillic article: `https://www.nspm.rs/hronika/srce-svetosavska-nagrada-za-danku-nesovic-je-ponizenje-za-srpski-narod.html`.
- Vijesti.me Latin archive: `https://www.vijesti.me/arhiva/vijesti/politika`.
- Klix.ba Latin article: `https://www.klix.ba/magazin/muzika/hadzicko-ljeto-2026-donosi-vise-od-50-aktivnosti-na-preko-15-lokacija-sirom-opcine/260611027`.

Short, dated text samples from these portals are frozen in
`test/fixtures/portal-samples.json`; automated tests never contact the sites.

Mobile additionally requires a portrait-width popup check, touch and text-scaling
review, a long-article performance check, and a tab-discard/low-memory check.

## Submission order

1. Generate and test the Chrome and Edge desktop packages.
2. Submit the Edge package with Android/iOS compatibility called out in the
   certification notes; claim mobile support only after it appears and passes tests.
3. Lint and sign the Firefox package, then test the exact signed build on desktop
   and Android before enabling the Android AMO listing.
4. Convert the Safari source package into the Apple wrapper, test macOS, then use
   TestFlight for iPhone and iPad.
5. Test Brave, Opera, Yandex, and Orion only after the primary packages are stable.

No store submission should add all-sites or country-TLD host permissions,
telemetry, remote code, or a network service. Changes to Firefox's finite portal
catalog require research, privacy review, and release testing. The local-only
architecture is part of the release contract.
