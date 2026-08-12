# Release coverage checklist

This file separates packages that can be generated now from platforms that have
actually passed human testing. Store acceptance and a successful device test are
required before changing a platform from **candidate** to **supported**.

Repository validation completed on Windows on 2026-08-11:

- The shared automated suite passes 76/76, including frozen samples from
  Index.hr, NSPM, Vijesti.me, and Klix.ba.
- Chromium, Edge, Firefox, and Safari-source packages build successfully.
- Mozilla `web-ext lint` reports 0 errors, 0 notices, and 0 warnings for the
  Firefox/Android package.
- The source contains no native binary or operating-system integration. The same
  Chrome/Edge/Firefox packages are therefore expected to run on Windows, macOS,
  and Linux, but the current 0.9 build still needs a fresh human runtime pass on
  every claimed browser/OS combination.
- Safari and all mobile targets require the corresponding Apple/Android device
  environment. A Windows-only check cannot honestly promote them to supported.

## Intended coverage

| Platform | Package | Current gate | Intended status |
| --- | --- | --- | --- |
| Chrome desktop (Windows/macOS/Linux) | `prepisi-<version>-chromium.zip` | Final smoke test on all three OS families and Chrome Web Store submission | First-class |
| Edge desktop (Windows/macOS/Linux) | `prepisi-<version>-edge.zip` | Smoke test on all three OS families and Partner Center submission | First-class |
| Edge Android/iOS | Same Edge Add-ons listing | Microsoft mobile certification/visibility and phone tests | First-class after validation |
| Firefox desktop (Windows/macOS/Linux) | `prepisi-<version>-firefox.zip` | Lint passes; three-OS smoke test and AMO signing remain | First-class |
| Firefox Android | Same AMO package | Android compatibility flag, AMO approval, and phone test | First-class |
| Safari macOS | `prepisi-<version>-safari-source.zip` | Apple wrapper, signing, and Mac test | First-class |
| Safari iOS/iPadOS | Same Apple project | TestFlight/App Store packaging and phone/tablet tests | First-class |
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
  source state. Turn it on, accept the hostname-only prompt, and confirm same-host
  links reapply the three selected modes while cross-host links do not.
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

No store submission should add broader host permissions, telemetry, remote code,
or a network service. The local-only architecture is part of the release contract.
