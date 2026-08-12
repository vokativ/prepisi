# Firefox Android device test — 2026-08-12

## Test environment

- Host: Windows, repository build `0.9.0`
- Device: Google Pixel 7, Android 17 (API 37), 1080 × 2400 portrait
- Browser: Firefox for Android `153.0.3` (`org.mozilla.firefox`)
- Install: unsigned temporary add-on loaded from `build/firefox` with `web-ext`
- Connection: USB debugging plus Firefox **Remote debugging via USB**
- Validation before device testing: 82/82 automated tests; Firefox `web-ext lint`
  reported 0 errors, 0 warnings, and 0 notices

This was not the signed AMO artifact, so it is a development smoke test rather
than the final Android release sign-off.

## What passed

| Area | Result | Notes |
| --- | --- | --- |
| Temporary install | Pass | Firefox displayed the add-on confirmation and exposed Prepiši under **Menu → Extensions**. |
| Portrait popup | Pass | The full popup fit at 1080 × 2400 with no horizontal scrolling; all controls were visible and touchable. |
| Latin → Cyrillic | Pass | Verified on a deterministic local fixture and the live RTS Latin article. |
| Ekavian/Ijekavian/Ikavian | Pass | One-click mode changes worked; the fixture produced the expected changed text. |
| Exact restore | Pass | **Vrati izvorni tekst** restored 11 fixture text parts exactly, including dynamically added text. |
| Highlighting | Pass | Dialect changes were highlighted without highlighting script-only changes or breaking layout. |
| Protected content | Pass | Google, Apple, GitHub, URLs, email, code, and an explicitly English span remained unchanged. |
| Dynamic content | Pass | Text inserted after conversion was converted automatically. |
| Interface script | Pass | All visible popup labels switched to Cyrillic and back to Latin. |
| Tab-local state | Pass | A newly opened document began in its source state while the first page retained its converted preview. |
| Live long article | Pass | The RTS article converted to Cyrillic/Ijekavian (24 visible text nodes in the tested viewport) and remained usable. |
| Host permission scope | Pass | Firefox requested access to one domain, shown as `rts.rs`, rather than all websites. Turning memory off removed the rule. |

## Confirmed failure in the tested build: remembered navigation

The **Zapamti na ovom sajtu** rule and its exact-host permission are stored and
recognized. Reopening Prepiši on another `rts.rs` document applies the stored
selection. However, a newly opened same-host document remained in Latin until
the popup was opened. The same behavior was reproduced on the local fixture and
on `https://rts.rs/lat/`.

Firefox accepted `scripting.registerContentScripts()` without reporting an
error, but the registered script did not run on the next navigation in this
temporary Android session. A Firefox-only `tabs.onUpdated` event-page fallback
was also prototyped and device-tested. Firefox installed it without manifest or
lint warnings, but the USB debugger exposed no running background actor and the
page still remained unchanged. The experimental fallback and its extra `tabs`
permission were therefore reverted rather than shipping unverified code.

This means the generic, hostname-on-demand design in the tested 0.9 build passes manual use
but does not pass the Android checklist item that requires automatic reapplication
after following a same-host link.

## Permission and MV3 design decision

The follow-up implementation adds 81 reviewed portal families as generated
Firefox MV3 host permissions. An intermediate device
build with only `content_scripts.matches` neither disclosed/granted the batch nor
converted the next RTS document; adding the same catalog to `host_permissions`
also did not make the static script run in that temporary session. It deliberately
does not request all websites, and optional exact-host access remains available elsewhere. The
selection policy and domains are in
[`research/CURATED_EDITORIAL_PORTALS.md`](../research/CURATED_EDITORIAL_PORTALS.md).

The final candidate was then rerun on the same Pixel. The temporary-install
confirmation did not enumerate the full catalog. Turning Remember on produced a
single Firefox prompt for the explicit `rts.rs` and `www.rts.rs` aliases and the
popup stored/applied the Cyrillic rule. A different RTS article opened without
reopening the popup still remained Latin. The generated manifest contained the
correct four HTTP/HTTPS RTS patterns in both fields, and Mozilla lint reported no
problem. No runtime error appeared in the `web-ext` runner log.

The current candidate replaces both static variants and the earlier
`tabs.onUpdated` prototype with Mozilla's documented MV3 event-page pattern. A
non-persistent background page registers `webNavigation.onCompleted` synchronously
at top level and calls `scripting.executeScript()` only after finding a local rule.
This design has 82/82 automated checks, including a listener/injection unit test,
and Mozilla `web-ext lint` reports 0 errors, warnings, and notices.

The exact generated candidate was then temporarily installed on the same Pixel.
The RTS portal-family rule survived the reinstall: opening the popup showed
**Ćirilica**, **Izvorni**, and **Zapamti na ovom sajtu** selected and reported 193
changed text parts. With the popup closed, opening the valid
`https://www.rts.rs/lat/` homepage in a new tab still left its headlines in Latin
after ten seconds. The event-page design therefore also fails the automatic-
navigation requirement in this unsigned temporary Android session.

Follow-up research found prior Firefox defects in which suspended MV3 event
pages did not wake, but no report that exactly matches Firefox Android 153.0.3
and this listener/injection sequence. Mozilla's current documentation and
Firefox source both support the synchronous, top-level
`webNavigation.onCompleted` design used here. The most important remaining
ambiguity is that a temporary `web-ext` installation does not reproduce a
signed install's permission flow and can retain local storage after removal.
The evidence, ranked hypotheses, and durable diagnostic plan are in
[`research/FIREFOX_MV3_ANDROID_EVENT_PAGES.md`](../research/FIREFOX_MV3_ANDROID_EVENT_PAGES.md).

This negative result does not invalidate Mozilla's MV3 design, but it means this
repository cannot claim Android durability from the documentation alone. Retest
the exact signed AMO artifact and Firefox desktop. If the signed Android build
also fails, keep manual popup conversion and do not justify the catalog solely as
an Android durability fix; an Android-specific upstream report/minimal reproduction
will then be the appropriate next engineering step.

## Not covered in this pass

- Signed AMO installation and persistence after a normal Firefox restart
- Offline conversion (not run to avoid disrupting the connected device)
- Enlarged Android/Firefox text scaling
- Tab discard or low-memory recovery on a browser profile with many existing tabs
- The complete five-site live sweep; RTS plus the deterministic fixture were used
- Firefox Desktop regression after signing
- Durable stage-by-stage background diagnostics without an attached toolbox

Firefox Android remains a **candidate**, not a supported release target, until
the curated build and remaining mobile checks pass on the signed artifact.
