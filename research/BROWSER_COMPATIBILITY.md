# Browser compatibility and packaging plan

Status: packaging implemented; store and device validation pending. Researched
2026-08-11. Browser support and store rules change; recheck the linked vendor
documentation before each store submission.

## Recommendation in one page

Prepiši should remain one offline conversion engine with small browser-specific manifests and packages around it.

The practical release order is:

1. Chrome desktop, then Edge desktop: separate named packages from the same Chromium runtime.
2. Edge Android and iOS: request mobile compatibility through the same Microsoft Edge Add-ons submission, then claim support only after certification and real-device tests.
3. Firefox desktop and Firefox for Android: one Firefox Manifest V3 package, with separate minimum versions declared for desktop and Android.
4. Safari on macOS, iOS, and iPadOS: reuse the web-extension files, but package them through Apple's Safari Web Extension tooling and App Store process.
5. Yandex Android and Orion iOS/iPadOS: exploratory manual compatibility routes after the primary packages are published.
6. Samsung Internet: treat as a separate partnership/native-Android packaging project, not as another Chromium ZIP.

Google Chrome on Android is not a target: Google says extensions can only be installed on computers, not mobile devices. Firefox for iOS and Firefox Focus also do not support add-ons. Sources:

- https://support.google.com/chrome_webstore/answer/1698338
- https://extensionworkshop.com/documentation/publish/version-compatibility/

## Why the current architecture travels well

| Current choice | Portability effect |
| --- | --- |
| Manifest V3, toolbar `action`, `activeTab`, `scripting`, and `storage` | Uses the mainstream WebExtensions model. `activeTab` keeps one-click conversion private by default; optional host access is requested only for a site the user explicitly remembers. |
| Firefox-only MV3 event page; no Chromium service worker | Firefox uses a synchronous top-level `webNavigation.onCompleted` listener for remembered navigation. Chromium keeps its existing popup/dynamic-registration path and does not gain a background worker. |
| All conversion data and executable code are packaged locally | Compatible with Manifest V3 remote-code rules and with the extension's privacy claim. |
| Conversion is ordinary JavaScript plus DOM APIs | The language engine itself should remain browser-neutral. |
| Page code is normally injected only after the user opens and uses the popup | Fits the temporary permission model of `activeTab`. On every browser, **Remember on this site** stores a local finite portal-family or exact-host rule; Firefox's MV3 event page reapplies it only after verifying host access. |
| CSS Custom Highlight API is feature-detected | Conversion still works when highlighting is unavailable; only the optional visual emphasis is lost. |
| Generated language files are classic scripts with ordered globals | Works with the current `scripting.executeScript({files: [...]})` approach without a browser-specific bundler. |

The repository changes needed for portability are now implemented:

- `src/platform/webext.js` selects `browser` or `chrome` without forking UI code.
- Target manifests remove Chromium-only fields and add the Firefox identity,
  no-data declaration, Android minimum, and Safari minimum.
- `scripts/package.ps1` produces Chromium, Edge, Firefox, and Safari-source archives.
- The popup uses a Firefox-safe desktop intrinsic width and switches to the
  available width on touch/mobile surfaces.

The remaining work is browser/device QA, store signing and certification, and the
Apple wrapper—not another conversion-engine fork.

WebExtension namespace differences are documented by Mozilla here:
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities

## Compatibility matrix

| Browser/platform | Public extension path | Expected code reuse | Recommended status | Important caveat |
| --- | --- | ---: | --- | --- |
| Chrome desktop | Chrome Web Store | Current build after ordinary QA | Ship first | Keep `minimum_chrome_version: 105` if highlighting is promised. Chrome's Scripting API itself is available from Chrome 88. |
| Edge desktop | Microsoft Edge Add-ons via Partner Center | Generated Edge package with the shared Chromium runtime | Ship after Chrome | Test once in Edge and submit the Edge ZIP with listing/privacy metadata. |
| Edge Android and iOS | Microsoft Edge Add-ons mobile collection | Same Edge listing and package | First-class candidate | Microsoft's collection explicitly supports iOS and Android, but mobile visibility is curated/certified; call out mobile compatibility in reviewer notes and test both devices before promising support. |
| Brave desktop | Chrome Web Store | Same Chrome listing | Supported through Chrome listing | Brave says it supports nearly all Chromium-compatible extensions and installs them from the Chrome Web Store. |
| Opera desktop | Opera Add-ons/CRX; Chromium extension model | Likely same Chromium source | Best-effort after Edge | Test the exact APIs; Opera documents broad, not universal, `chrome.*` API support. |
| Firefox desktop | AMO, Mozilla-signed XPI | Shared source plus Firefox manifest | Next first-class target | Use `browser_specific_settings.gecko`; set a stable add-on ID and declare no data collection. |
| Firefox for Android | AMO Android listing | Same Firefox package with responsive UI | Next first-class mobile target | Explicitly declare `gecko_android`; test popup, options, touch layout, memory, dynamic pages, and offline behavior on a device. |
| Safari macOS | Safari Web Extension inside a Mac app | Shared web files plus Safari wrapper | First Apple target | Requires Safari packaging, signing, and App Store/TestFlight flow rather than a raw extension ZIP. |
| Safari iOS/iPadOS | Safari Web Extension inside an iOS/iPadOS app | Same Safari web resources and usually the same Xcode project | First iOS target | Users grant website access through Safari. Use a phone-sized popup and test permission prompts. |
| Chrome Android | None | N/A | Do not target | Google's official help says Chrome extensions are computer-only. “Add to Desktop” on a phone queues an extension for desktop; it does not install it on Android. |
| Firefox iOS / Firefox Focus | None | N/A | Do not target | Mozilla's compatibility guidance says these products do not support add-ons. Safari Web Extension is the practical iOS route. |
| Samsung Internet Android | Galaxy Store Android extension app; Samsung approval | Conversion engine may be reusable, package and integration are not | Partnership/backlog | Samsung's public program remains closed beta and permits only approved developers. Contact Samsung before planning implementation. |
| Yandex Browser Android | Installs selected extensions from Chrome Web Store or Opera Add-ons; supports unpacked developer testing | Likely Chromium build | Exploratory mobile target | Vendor does not promise every desktop extension/API will work. Test the popup and the exact `scripting` behavior on-device before claiming support. |
| Opera/Brave Android | No public, vendor-documented general WebExtension release path identified in this review | Unknown | Do not promise support | Revisit only when the vendor publishes a mobile extension developer and distribution path. Being Chromium-based is not sufficient. |
| Orion iOS/iPadOS | User-installed compatible WebExtension | Likely Safari package or store package | Exploratory mobile target | Orion documents partial Chrome/Firefox extension compatibility. Treat manual installation as a test path, not a supported distribution channel until verified. |

## Operating-system coverage

The extension engine and the three desktop WebExtension packages contain no
native binary or operating-system API. Chrome/Edge/Firefox therefore use the same
package on Windows, macOS, and Linux. This is package compatibility, not a
substitute for a smoke test on every operating system before a public support
claim.

| Operating system | Browsers in intended coverage | What can be verified in this repository | Physical test still required |
| --- | --- | --- | --- |
| Windows desktop | Chrome, Edge, Firefox | All target builds, manifest/API gates, offline converter/content tests, Firefox lint | Owner-reported complete (`docs/WINDOWS_DESKTOP_TEST_2026-08-13.md`); exact versions/dates pending for a full dated report |
| macOS desktop | Chrome, Edge, Firefox, Safari | Chrome/Edge/Firefox use the same OS-neutral packages; Safari source manifest is generated and version-gated | All four browsers on a Mac; Safari Xcode wrapper, signing, permissions, and highlight rendering |
| Linux desktop | Chrome/Chromium, Edge, Firefox | Same OS-neutral Chromium/Edge/Firefox packages; no native dependency | Smoke pass on at least one supported distribution/window system per browser |
| Android | Firefox; Edge mobile candidate; Yandex exploratory; Samsung partnership | Firefox Android minimum/API declarations and Edge package are generated | Phone install, popup/touch/text scale, permissions, navigation, tab discard, long-page performance, store visibility |
| iOS/iPadOS | Safari; Edge mobile candidate; Orion exploratory | Safari source and Edge package are generated | Xcode/TestFlight wrapper and Safari permissions; Edge/Orion availability and full device smoke tests |

There is no extension route for Chrome on Android or Firefox on iOS. Safari is
not available on Windows or Linux. Those are product limits, not missing build
targets in this repository.

Official sources for the table:

- Chrome Scripting API and minimum platform: https://developer.chrome.com/docs/extensions/reference/api/scripting
- Chrome `activeTab` privacy and lifetime: https://developer.chrome.com/docs/extensions/develop/concepts/activeTab
- Chrome distribution: https://developer.chrome.com/docs/extensions/how-to/distribute
- Edge extension overview: https://learn.microsoft.com/en-us/microsoft-edge/extensions/
- Edge publishing: https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension
- Edge mobile extensions collection: https://microsoftedge.microsoft.com/addons/collections/mobile_android_extensions
- Edge mobile stable release notes: https://learn.microsoft.com/en-us/deployedge/microsoft-edge-relnote-mobile-stable-channel
- Brave Chrome Web Store support: https://support.brave.com/hc/en-us/articles/360017909112-How-can-I-add-extensions-to-Brave
- Opera Chromium/CRX compatibility: https://help.opera.com/en/extensions/
- Firefox Android development: https://extensionworkshop.com/documentation/develop/developing-extensions-for-firefox-for-android/
- Firefox version and Android declaration: https://extensionworkshop.com/documentation/publish/version-compatibility/
- Firefox signing/distribution: https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/
- Safari Web Extensions: https://developer.apple.com/documentation/safariservices/safari-web-extensions
- Safari packaging: https://developer.apple.com/documentation/safariservices/packaging-a-web-extension-for-safari
- Safari permissions: https://developer.apple.com/documentation/safariservices/managing-safari-web-extension-permissions
- Samsung extension model: https://developer.samsung.com/internet/android/extension-guide.html
- Samsung developer approval: https://developer.samsung.com/internet/android/extensions-dev-overview.html
- Yandex Browser Android extensions and developer loading: https://yandex.com/support/browser-mobile-android-phone/en/personal-settings/extensions
- Orion iOS/iPadOS extension installation: https://help.kagi.com/orion/browser-extensions/ios-ipados-extensions.html

## Browser/API decisions

### Minimum versions for equivalent features

The optional dialect highlighting determines the cleanest minimum versions:

| Engine | CSS Custom Highlight API |
| --- | --- |
| Chromium | Chrome/Edge 105 |
| Firefox | Firefox 140 |
| WebKit | Safari 17.2 |

Google's web-platform support table lists these versions:
https://web.dev/blog/web-platform-06-2025

Safari's own release notes confirm Custom Highlights in Safari 17.2:
https://webkit.org/blog/14787/webkit-features-in-safari-17-2/

Firefox's release notes confirm the API in Firefox 140:
https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/140

Recommendation:

- Chromium: retain 105.
- Firefox desktop: set `strict_min_version` to `140.0` so every supported install has highlighting and Firefox's built-in data declaration UI.
- Firefox Android: set `strict_min_version` to `142.0`. Mozilla says its built-in data-collection declaration is supported on Android from 142; this also includes Gecko's Highlight API.
- Safari: set `browser_specific_settings.safari.strict_min_version` to `17.2` if the published listing promises highlighting everywhere. Safari Web Extensions themselves exist earlier (iOS 15+), so a lower version is possible if highlighting is explicitly described as unavailable on older Safari.

The converter already checks for `CSS.highlights` and `Highlight`, so lowering a minimum version later is safe for conversion. It changes the supported feature promise, not the conversion engine.

Mozilla's current data declaration requirements:
https://extensionworkshop.com/documentation/develop/firefox-builtin-data-consent/

### Scripting and permissions

The default remains `activeTab` plus `scripting`: it avoids required persistent
host permissions, and the injection calls exist in Manifest V3 in Chrome and
Firefox. Safari also implements the WebExtensions scripting model.

Same-site navigation is an explicit opt-in because `activeTab` lifetimes are not
identical: Chrome retains temporary access across same-origin navigation, while
Firefox revokes it when the page navigates. **Remember on this site** therefore
requests optional HTTP/HTTPS access for only the current hostname and uses
`scripting.registerContentScripts()` with `persistAcrossSessions: true`. This is
supported below every declared project minimum (Chrome 96+, Firefox 101+, Safari
16.4+). Turning the switch off unregisters the script, removes the local rule,
and releases that optional host permission.

- Chrome: `scripting` is Chrome 88+, Manifest V3; `activeTab` provides temporary host permission.
- Firefox: `scripting.executeScript()` is available for Manifest V3 from Firefox 101. Firefox and Safari can return partial results when permissions differ across frames, while Chrome rejects the whole injection if a required frame lacks permission. Prepiši currently targets the top frame, which minimizes this difference.
- Built-in and privileged pages remain unavailable in every browser; the existing friendly error state should stay.
- Registered content scripts survive browser restarts, but an extension update
  removes registrations. Opening the popup once on a remembered site restores
  that site's registration; this must be covered by update testing.

Sources:

- https://developer.chrome.com/docs/extensions/reference/api/scripting
- https://developer.chrome.com/docs/extensions/develop/concepts/activeTab
- https://developer.chrome.com/docs/extensions/reference/api/permissions
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/executeScript
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/insertCSS
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/registerContentScripts
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions
- https://webkit.org/blog/13966/webkit-features-in-safari-16-4/

### Highlighting limitation on Safari

Safari 17.2+ supports the API, but WebKit currently has an open bug where custom highlights may not render for text under `display: flex` or `inline-flex`. Conversion is unaffected. Keep this in the Safari test plan and do not replace the current non-DOM-mutating highlight design solely for this issue unless real sites make it severe.

Source: https://bugs.webkit.org/show_bug.cgi?id=307455

## Proposed repository/build shape

Do not fork the converter or data by browser. Build target directories from shared source and a target manifest:

```text
manifests/
  edge.json
  firefox.json
  safari.json
src/
  platform/
    webext.js
  ...all existing shared engine and UI files...
scripts/
  build-extension.mjs
  package.ps1
build/
  chromium/       # generated, ignored
  edge/           # generated, ignored
  firefox/        # generated, ignored
  safari/         # generated, ignored
dist/
  prepisi-<version>-chromium.zip
  prepisi-<version>-edge.zip
  prepisi-<version>-firefox.zip
safari/           # generated Xcode wrapper or App Store packager output; decide whether to commit
```

The root `manifest.json` contains the shared Chromium-compatible manifest. Target
overlays contain only browser-specific differences; `edge.json` is intentionally
empty today so Microsoft gets a separately named artifact without a code fork.

Suggested Firefox overlay (the final ID is a project-owner decision and must remain stable):

```json
{
  "browser_specific_settings": {
    "gecko": {
      "id": "prepisi@example.invalid",
      "strict_min_version": "140.0",
      "data_collection_permissions": {
        "required": ["none"]
      }
    },
    "gecko_android": {
      "strict_min_version": "142.0"
    }
  }
}
```

The placeholder ID must not ship. Choose a durable ID before the first AMO signing because it becomes the add-on's identity.

Suggested Safari overlay:

```json
{
  "browser_specific_settings": {
    "safari": {
      "strict_min_version": "17.2"
    }
  }
}
```

The Chromium overlay should retain `minimum_chrome_version: "105"`. The Firefox and Safari output manifests should omit that Chromium-only key.

The build should use an explicit allowlist like the current packager. In particular, never ship:

- `research/cache/` corpora;
- source/download archives;
- the purchased Balkan Sans font ZIP or OTF files;
- tests, screenshots, or reviewer CSVs;
- unpublished/licensing-uncertain source datasets.

## Packaging and store notes

### Chromium desktop and Edge mobile

- Chrome Web Store accepts the extension package and is the public distribution route. Chrome only permits general direct installation of store-signed extensions; self-hosting is mainly an enterprise-policy route.
- Edge accepts a ZIP in Partner Center and asks for purpose, permission justification, privacy practices, listing material, and reviewer notes.
- Microsoft's official mobile collection now says Edge extensions are available
  on both iOS and Android. Submit the Edge package once, identify mobile
  compatibility in certification notes, and verify that the approved listing is
  actually offered on each mobile platform before changing the support claim.
- Edge 150 added an Android/iOS managed `ExtensionInstallForcelist`, but that is
  enterprise deployment of store IDs, not a public arbitrary-file sideload route.
- Brave users can install the Chrome Web Store item, so a separate Brave listing is unnecessary.
- Opera is compatible with Chromium CRX extensions but maintains its own API compatibility and catalog; test before submitting there.

Sources:

- https://developer.chrome.com/docs/extensions/how-to/distribute
- https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension
- https://microsoftedge.microsoft.com/addons/collections/mobile_android_extensions
- https://learn.microsoft.com/en-us/deployedge/microsoft-edge-relnote-mobile-stable-channel
- https://support.brave.com/hc/en-us/articles/360017909112-How-can-I-add-extensions-to-Brave
- https://help.opera.com/en/extensions/architecture-overview/

### Firefox desktop and Android

- Use `web-ext lint` against declared `gecko` and `gecko_android` minimum versions.
- Use `web-ext run` for desktop and `web-ext run -t firefox-android` with ADB for Android.
- Use `web-ext build` or create a ZIP whose root contains `manifest.json`. Firefox's installed package is an XPI, which is structurally a ZIP.
- Release/Beta Firefox requires Mozilla signing whether the extension is AMO-listed or self-distributed. AMO listing is the sensible public route and handles updates.
- Include `browser_specific_settings.gecko_android` or AMO will not advertise the extension as Android-compatible.
- New AMO submissions must declare collection/transmission. Prepiši should declare `required: ["none"]`, matching its local-only implementation and privacy document.

Sources:

- https://extensionworkshop.com/documentation/develop/developing-extensions-for-firefox-for-android/
- https://extensionworkshop.com/documentation/publish/package-your-extension/
- https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings

### Safari macOS, iOS, and iPadOS

- Run Apple's Safari Web Extension Packager on a prepared Safari target directory. It creates an Xcode project containing a macOS and/or iOS app that embeds the web extension.
- The current command is `xcrun safari-web-extension-packager /path/to/extension`; `--rebuild-project` adds platforms to an existing project. Apple's tool reports unsupported manifest keys.
- Apple also documents a web-based App Store Connect packager that accepts an extension ZIP without a Mac/Xcode for conversion and TestFlight packaging. A Mac/device pass is still needed for responsible functional QA.
- Distribution is through App Store Connect/App Store; beta distribution is through TestFlight. A Safari Web Extension is not published as a loose ZIP.
- Safari website-access permission is user-controlled. Preserve `activeTab`; do not expand to `<all_urls>` merely to simplify the port.
- Safari 16+ can sync an installed extension between Apple devices when the app/extension bundle identifiers are configured appropriately.

Sources:

- https://developer.apple.com/safari/extensions/
- https://developer.apple.com/documentation/safariservices/packaging-a-web-extension-for-safari
- https://developer.apple.com/documentation/safariservices/managing-safari-web-extension-permissions
- https://developer.apple.com/documentation/SafariServices/syncing-safari-web-extensions-across-devices-and-platforms

### Additional mobile compatibility routes

Samsung Internet's public documentation describes extensions as Android applications distributed through the Galaxy Store, with actions surfaced in Samsung Internet's tools/context menus. It also states that the development program is closed beta and all third-party extension apps are validated and approved by Samsung. Therefore this is not a simple repackaging task. Contact Samsung and obtain program access before budgeting it.

Yandex Browser for Android is the only additional Android Chromium browser found in this review with clear public vendor instructions for third-party extensions. Its official help says users can install from the Chrome or Opera catalogs and developers can load an unpacked extension by selecting `manifest.json`. This makes it an inexpensive compatibility experiment after the Chrome package is published, but not a first-class promise until device tests pass.

Orion documents user-installed extension compatibility on iOS/iPadOS. That makes
it a useful manual Apple-device experiment outside Safari, but partial API support
and a small user base make it exploratory rather than an intended release target.

Sources:

- https://developer.samsung.com/internet/android/extension-guide.html
- https://developer.samsung.com/internet/android/extensions-dev-overview.html
- https://yandex.com/support/browser-mobile-android-phone/en/personal-settings/extensions
- https://help.kagi.com/orion/browser-extensions/ios-ipados-extensions.html

## Required test gates

### Shared automated tests

- Run converter/content tests once against the shared engine.
- Add a build test that creates every target manifest, parses it, verifies the same version, and rejects forbidden files.
- Add static checks that extension UI code uses the cross-browser adapter rather than raw `chrome.*`/`browser.*` calls.
- Confirm every built package contains no network endpoint or remote executable code.

### Browser smoke tests

For every supported browser/platform:

1. Open the Latin and Cyrillic versions of the same RTS article.
2. Convert Latin to Cyrillic and Cyrillic to Latin; compare meaningful body text while accounting for site chrome and dynamic timestamps.
3. Restore the original text exactly.
4. Switch Ekavian/Ijekavian/Ikavian in both scripts.
5. Verify tab-local state in two tabs. With site memory off, navigation starts
   from the new page; with it on, same-host navigation reapplies the selected
   modes and cross-host navigation does not.
6. Verify newly inserted article text is converted by the mutation observer.
7. Verify protected names, URLs, email addresses, code, inputs, and explicitly foreign-language spans remain unchanged.
8. Verify highlight on/off. On platforms below the Highlight API threshold, verify conversion works without highlights.
9. Try a browser-internal page and confirm the friendly restricted-page message.
10. Verify the extension remains fully functional offline.

RTS paired fixtures supplied for manual comparison:

- Latin: https://rts.rs/lat/vesti/drustvo/6017125/gornji-milanovac-restrikcije-voda-cacak.html
- Cyrillic: https://rts.rs/vesti/drustvo/6017125/gornji-milanovac-restrikcije-voda-cacak.html

Mobile-specific gates:

- Popup fits portrait phone width without horizontal scrolling.
- Controls meet touch-target and text-scaling expectations.
- Opening and returning from the options page is understandable.
- Page conversion does not cause long UI stalls on a long news article.
- Android low-memory/tab-discard behavior does not create misleading state.
- Safari permission prompts, Firefox Android menu placement, and Edge mobile
  listing/install behavior are documented with screenshots for testers.

## Concrete implementation sequence

1. Add a tiny `webext` namespace adapter and replace direct API calls in popup/options code. **Implemented.**
2. Make popup sizing responsive without changing the desktop visual identity. **Implemented.**
3. Generate Chromium, Edge, Firefox, and Safari-source packages from the shared runtime; keep the explicit package allowlist. **Implemented.**
4. Add optional exact-host or finite reviewed-alias navigation continuity. Chromium and Safari use dynamic content-script registration; Firefox uses a non-persistent MV3 event page plus its predeclared portal catalog. **Implemented; signed Firefox Android durability remains unverified.**
5. Smoke-test the Edge package on desktop, submit it to Partner Center with mobile compatibility in the certification notes, then test the approved listing on Android and iOS.
6. Lint the Firefox package with `web-ext`, test Firefox desktop, and obtain Mozilla signing.
7. Test the same signed Firefox artifact on Android before enabling Android compatibility on the AMO listing.
8. Build the Safari wrapper from the Safari target directory, review converter warnings, then test macOS followed by iPhone/iPad.
9. Publish Chromium, Firefox, and Safari through their respective stores. Edge remains a second listing, not a code fork.
10. Test the published packages in Brave, Opera, Yandex Android, and Orion iOS/iPadOS. Pursue Samsung only after the primary targets are stable.
