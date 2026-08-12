# Firefox MV3 Android event-page research

Status: researched 2026-08-12 after the Pixel 7 temporary-install test. This
note distinguishes confirmed facts from hypotheses. It does not claim that the
same failure occurs in a signed Firefox package.

## Conclusion

Yes: Firefox extension developers have reported the same broad class of MV3
failure—an event page is suspended and then does not wake when a registered
event fires. Mozilla has fixed several such defects. The clearest example is
[bug 1905505](https://bugzilla.mozilla.org/show_bug.cgi?id=1905505), which
Mozilla described as repeatedly observed in deployed extensions. It could
terminate an event page immediately when an event tried to wake it. It affected
Android as well as desktop and was fixed in Firefox 129 and ESR 128.

That old bug is not a direct explanation for the Prepiši failure on Firefox for
Android 153.0.3. No existing report was found that exactly matches all of these
conditions: current Firefox Android, a top-level
`webNavigation.onCompleted` listener, granted origin access, and
`scripting.executeScript()` failing after an unsigned temporary installation.
If the signed package or current Nightly reproduces it with the diagnostics
below, it is likely worth a new reduced Bugzilla report.

## Why the current pattern is credible

The implementation is not based on an informal workaround. Mozilla's current
[background-script guide](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Background_scripts)
requires MV3 event listeners to be registered synchronously at top level. It
specifically recommends a filtered `webNavigation.onCompleted` listener and
using the `tabId` and `frameId` delivered by the event. Prepiši does all three.

Firefox's implementation also treats this event as wakeable. The Firefox 140
[source for `ext-webNavigation.js`](https://fossies.org/linux/www/firefox-140.0.source.tar.xz/firefox-140.0/toolkit/components/extensions/parent/ext-webNavigation.js)
lists `onCompleted` in `PERSISTENT_EVENTS`. Firefox's source documentation
describes how a primed placeholder listener queues an event, starts the event
page, and is replaced when the background script synchronously registers the
same listener again:
[Implementing an event](https://firefox-source-docs.mozilla.org/toolkit/components/extensions/webextensions/events.html).

The absence of a “running background actor” in the USB debugger is therefore
not itself an error. An idle MV3 event page is supposed to disappear and be
re-created for its persisted listeners.

## Similar reports and what they establish

| Evidence | Relevance to Prepiši |
| --- | --- |
| [Bug 1905505](https://bugzilla.mozilla.org/show_bug.cgi?id=1905505): event page terminated immediately during wake; verified fixed in Firefox 129 | Confirms the exact failure class existed in the wild and affected Android. Too old to explain Firefox 153 unless there is a regression. |
| [Android event-page compatibility audit, bug 1823436](https://bugzilla.mozilla.org/show_bug.cgi?id=1823436) | Mozilla audited Fenix/GeckoView restart behavior. The audit also recorded very few built-in Fenix extensions using event pages, so the architecture is supported but historically had limited built-in Android coverage. |
| [Mozilla Android lifecycle explanation](https://discourse.mozilla.org/t/is-non-persistent-background-script-mandatory-for-android/123839) | Android can kill Firefox's extension process. Mozilla recommends designing for event-page restart even when an MV2 persistent background is used. Moving back to a nominally persistent background would not eliminate Android lifecycle risk. |
| [Bug 1851873](https://bugzilla.mozilla.org/show_bug.cgi?id=1851873) and related event-listener work | Shows that wake-up behavior is API-specific and has required explicit persistence or startup handling and regression tests. It is not evidence that `webNavigation.onCompleted` is currently broken. |
| [Bug 1818668](https://bugzilla.mozilla.org/show_bug.cgi?id=1818668): navigation events may be reordered when an event page restarts | Confirms that primed `webNavigation` events are used in practice. Prepiši listens only to `onCompleted`, so event ordering is not its likely failure. |

## Temporary-install and permission evidence

The device test used `web-ext`, which creates a temporary installation. Mozilla
explicitly says a
[temporary installation does not fully mimic a signed extension](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/):
installation-time permission prompts are not displayed, and local storage can
remain after removal and browser restart. Both effects appeared in this test:
the catalog was not enumerated at installation and the old RTS rule survived a
reinstall.

Firefox 127+ normally displays and grants MV3 origins declared in
`host_permissions` or `content_scripts` during a normal installation. Mozilla
still advises checking with `permissions.contains()` and requesting missing
access:

- [Manifest V3 migration guide](https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/)
- [MDN `host_permissions`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/host_permissions)
- [Mozilla's Firefox 127/128 permission rollout](https://blog.mozilla.org/addons/2024/05/14/manifest-v3-updates/)

Other extension developers have seen content scripts silently fail because MV3
origin access was not actually granted, including
[this Firefox support report](https://discourse.mozilla.org/t/content-scripts-do-not-load/130009)
and [bug 1810910](https://bugzilla.mozilla.org/show_bug.cgi?id=1810910).
Prepiši's popup did report that the RTS portal-family permission was present
after its explicit request, so missing permission is not a complete explanation.
However, the static-content-script experiments occurred inside the same
temporary-install state and are not equivalent to a clean, signed install.

## Comparison with Bypass Paywalls Clean

The supplied
[Bypass Paywalls Clean repository](https://gitflic.ru/project/magnolia1234/bypass-paywalls-firefox-clean)
is useful evidence for the permission UX: its default Firefox package declares
a limited publisher list and asks separately for additional/custom origins. Its
documentation also treats a signed XPI and a temporary add-on as distinct test
and installation paths.

It is not a credible MV3 event-page reference for this problem. The available
Firefox lineage and published manifests are Manifest V2 and use a traditional
background page. Its working Android behavior therefore supports the curated
host-list product model, but does not validate MV3 event-page wake-up.

## Ranked explanations for the observed result

1. **Temporary-install origin or registration state.** This best explains the
   missing install-time host list and the static content-script failure. It does
   not fully explain the later programmatic injection after
   `permissions.contains()` succeeded.
2. **The event fired, but rule lookup, permission checking, CSS insertion, or
   script execution failed.** The current code stores an error only in an
   in-memory global. That disappears when the event page is destroyed, so the
   clean `web-ext` runner output cannot exclude this.
3. **A current Android/GeckoView event-page wake regression.** This is plausible
   because Mozilla has fixed this class before, but it is not demonstrated by
   the current logs.
4. **Android killed the extension process at an awkward point.** Mozilla says
   event pages should restart when a persisted API event is called, but Android
   process lifecycle makes this an important signed-build and low-memory test.
5. **An old fixed Firefox defect.** Unlikely on 153.0.3; the most relevant known
   defect was fixed in 129.

## Implemented diagnostic build

Do not keep the event page alive with timers and do not use an open extension
toolbox during the decisive test. Developer Tools prevents normal idle
termination and can hide the bug being tested.

The Firefox settings page now exposes an opt-in diagnostic ring buffer in
`storage.local`. It accepts one explicit test hostname, discards host-specific
events for every other hostname, retains at most 40 entries, and records no page
text, URL path, query, or full URL. It records:

1. background script evaluated and whether the install is temporary
   (`runtime.onInstalled` supplies `details.temporary`);
2. `webNavigation.onCompleted` received, including time, top-frame flag, and
   test hostname;
3. portal descriptor and remembered-rule lookup result;
4. `permissions.contains()` result for every explicit alias pattern;
5. `insertCSS` success or exact rejection;
6. `executeScript` success/result or exact rejection;
7. the final acknowledgment and changed-node count returned by `auto-apply.js`
   to `scripting.executeScript()`.

The user can inspect and clear the log without attaching an extension debugger.
Disable and clear it after the targeted test.

Also create a minimal reproduction containing only a top-level
`webNavigation.onCompleted` listener, one test origin, `storage.local` markers,
and one one-line injected script. This separates Firefox lifecycle behavior from
Prepiši's converter and catalog.

## Test matrix when the phone is available again

1. Start with a clean add-on/profile state; do not infer a clean install from
   retained `storage.local` data.
2. Run the minimal reproduction on Firefox desktop, terminate its event page,
   and navigate without opening its debugger.
3. Run the same temporary package on Firefox Android Release and Nightly.
4. Install an unlisted Mozilla-signed XPI on Android and verify the full
   installation permission prompt. This is the decisive comparison with the
   temporary test.
5. Test after normal idle, after force-closing Firefox, and after Android
   low-memory process reclamation.
6. If `onCompleted` is recorded but injection fails, file against the failing
   permission or scripting API. If it is never recorded in a signed/current
   Nightly build, file a reduced WebExtensions event-page wake-up bug and attach
   the minimal extension, versions, device details, and stored diagnostic log.

Until that matrix passes, Firefox Android remains a candidate target. Manual
popup conversion is verified; automatic remembered navigation is not.
