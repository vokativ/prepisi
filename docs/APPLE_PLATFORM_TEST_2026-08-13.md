# Apple-platform and macOS browser test — 2026-08-13

This report records observed results from the continuation of the 0.9.0 human
test pass. It supplements `APPLE_PLATFORM_TEST_2026-08-12.md`; it does not turn
support claims into passes where the full checklist remains incomplete. Public
test pages and isolated QA windows/profiles were used. Device identifiers,
account identifiers, private browser content, signing material, and device logs
are omitted.

## Environment and artifacts

- Apple Silicon Mac, macOS 26.5.2 (25F84).
- Google Chrome 151.0.7922.138, Firefox 153.0.4, and Safari 26.5.2.
- Xcode 26.6 (17F113), with a wired iPhone 14 on iOS 26.5.2.
- Extension version 0.9.0. `npm run build:all` rebuilt Chromium, Edge,
  Firefox, and Safari source successfully before testing.
- After the phone and cross-browser sequence, the publishing candidate was
  bumped to 0.9.1 so the final macOS Safari smoke test could be distinguished
  from older QA registrations. All four generated manifests, the containing
  macOS app, and its embedded Safari extension reported 0.9.1. The three
  verified 0.9.0 Safari QA registrations were unregistered without deleting
  their files; Safari then showed one signed Prepiši 0.9.1 entry.
- Edge is not installed on this Mac and was not run.
- The Safari wrapper under ignored `build/safari-app` contained the refreshed
  Safari resources. Its regenerated Xcode project omitted a development-team
  setting, so the already-used QA development team was restored only in that
  ignored project. The iOS app and embedded extension then built, installed,
  and launched on the connected phone.

## Google Chrome on macOS

The unpacked Chromium build was visibly enabled and reloaded from
`build/chromium`.

Observed passes:

- On the RTS Latin parity article, source Latin/Ekavian and three converted
  states were captured for later human linguistic review: Cyrillic/Ijekavian,
  Latin/Ijekavian, and Latin/Ikavian beta. Cyrillic conversion reported 260
  changed text parts; applying Ijekavian after it reported 25. The visible
  article, player, and layout remained readable.
- Visible dialect examples included `VESTI → VIJESTI`, `VREME → VRIJEME`, and
  `mesečno → mjesečno`. Ikavian examples included `VESTI → VISTI` and
  `VREME → VRIME`. These are behavioral observations, not the required human
  judgment of linguistic naturalness.
- Offline installed-extension behavior passed on the public local fixture. The
  fixture was loaded through local HTTP and the server was stopped before using
  the popup. Cyrillic plus Ijekavian still changed nine script parts and two
  dialect parts. **Vrati izvorni tekst** then restored nine parts and the exact
  sampled Latin sentence. Google, Apple, GitHub, the sample URL/email, explicit
  English span, and code remained intact.
- On `chrome://extensions`, attempting conversion produced the friendly visible
  error: `Ova sistemska stranica ne dozvoljava rad dodataka. Otvori običnu
  web-stranicu i pokušaj ponovo.` No system-page content changed.

Still open from the broader checklist:

- permission-revocation timing and tab-discard/low-memory recovery;
- live-site form/editable/load-more evidence and the previously recorded Klix
  protected-text concerns;
- blocked/unreachable pages in the five-site matrix;
- the approximately 30-minute background interval was already observed in
  Safari but was not repeated in Chrome during this continuation.

## Safari on macOS

The refreshed macOS wrapper built and launched through Xcode, and Safari showed
the Prepiši toolbar item. The existing RTS remembered rule and highlight toggle
were visible in the popup. Computer control could open and inspect the popover,
but selecting its radio buttons dismissed the popover without applying the
choice. This is recorded as an automation-control limitation, not a product
failure.

The final signed 0.9.1 smoke test supersedes that current-build limitation with
manual assistance for the affected popover controls. On the RTS Latin parity
article, the user selected Cyrillic plus Ijekavian and enabled Highlight and
Remember. The page visibly converted throughout; examples included `ВИЈЕСТИ`,
`ВРИЈЕМЕ`, `гдје`, `обезбијеђене`, and `мјере`, while `RTS` remained protected.
The reopened popup proved all four requested selections were active.

The user then clicked **Vrati izvorni tekst**. The heading, introduction, and
sampled body paragraphs visibly returned to their Latin/Ekavian source. The
popup correctly showed Source/Source for the restored current document while
Highlight and Remember remained on and the `rts.rs` rule remained stored. An
exact navigation to `https://www.rts.rs/lat/` then automatically reapplied
Cyrillic/Ijekavian; visible examples included `безбједности`, `пјешчари`, and
`мјесечно`. Finally, Klix was opened in a separate tab. It stayed in source
Latin, and its untouched popup showed Source/Source, Highlight off, and Remember
off. The rebuilt macOS Safari runtime therefore passes the corrected page-local
Restore, finite RTS alias sharing, and unrelated-host isolation smoke test.

## Safari on iPhone 14

The refreshed development build installed and launched successfully. Xcode's
device surface captured a public RTS article in source Latin at the top of the
page. The article differed from the earlier parity article, which provides a
useful same-site/new-document check. Its heading began `Kasarna u Valjevu se
sprema za povratak regruta…`; layout, audio controls, sharing controls, and the
visible article introduction were readable in portrait.

The user then selected Cyrillic plus Ijekavian, enabled highlighting, and kept
Remember on. A second Xcode device screenshot visibly confirmed full Cyrillic
conversion of the heading and introduction. `RTS` remained protected, the
portrait layout and controls remained stable, and the date word
`SREDA → СРИЈЕДА` painted with the configured yellow and
green highlight styling.

The user then chose **Vrati izvorni tekst** without changing the Remember or
highlight controls. A third device screenshot returned the heading,
introduction, date, and highlight appearance to source. After cropping only the
changing iPhone status bar, an image comparison reported zero differing pixels
between the original source screenshot and the restored screenshot. Exact
current-document restoration therefore passes on this observed viewport.

After a user pull-to-refresh, the saved Cyrillic plus Ijekavian rule reapplied
to the fresh document: the heading and introduction returned to Cyrillic,
`SREDA` returned as `СРИЈЕДА`, and `RTS` remained protected. This passes the
rebuilt Restore/Remember rule behavior and shows that the refreshed document did
not inherit stale source modes. The yellow/green highlight visible before
Restore was not painted after refresh. A device screenshot of the open popup
proved that Cyrillic, Ijekavian, Highlight, and Remember were all still selected.
Preference persistence therefore passes, but automatic post-refresh highlight
painting fails on this observed page state. The user then toggled Highlight off
and back on. A fresh device screenshot still showed no yellow/green paint around
`СРИЈЕДА`, while conversion remained applied. The failure is therefore broader
than failure to restore the saved highlight preference during automatic apply;
manual repaint also fails in this refreshed WebKit page state. This remains
consistent with the recorded WebKit bug 307455 limitation.

The user next entered the exact `https://www.rts.rs/lat/` URL without reopening
the extension. The fresh RTS homepage automatically appeared in Cyrillic and
Ijekavian. Visible examples included `безбједности` and `Делиблатској
пјешчари`; RTS branding and the portrait layout remained intact. Safari's
collapsed address bar displayed the registrable `rts.rs` name, as expected for
its compact UI. This observed navigation passes remembered-rule sharing from
the apex RTS article to the `www.rts.rs` alias and closes the alias split found
in the previous iPhone build.

For the unrelated-host isolation check, the user opened `https://www.klix.ba/`
and then opened Prepiši without changing any controls. The Klix page remained
in its source Latin text. The popup visibly showed Source script, Source
dialect, Highlight off, and Remember off. The saved RTS family rule therefore
did not leak to Klix; unrelated-host remembered-rule isolation passes on the
rebuilt iPhone runtime.

The user then closed the Klix popup, returned to the existing RTS tab, scrolled
well down the long homepage, backgrounded Safari for approximately 30 minutes,
and returned to that same tab. A device screenshot showed Safari at the retained
deep scroll position with later RTS sections still rendered in Cyrillic and the
page readable. This passes the combined long-page conversion, cross-tab return,
scroll-position/tab-state restoration, and background/foreground check. The
RTS tab did not inherit Klix's Source state. This observation does not prove an
OS low-memory discard, because iOS did not visibly discard the tab.

Finally, with the RTS page already loaded, the user enabled Airplane Mode and
disabled Wi-Fi. They observed that **Vrati izvorni tekst** restored the page to
its source Latin text and that selecting Cyrillic plus Ijekavian converted it
again without connectivity. The final device screenshot contains the iOS
airplane indicator and visibly converted Cyrillic text. On this ordinary deep
homepage layout, yellow/green dialect highlighting also painted successfully on
forms including `свјетске` and `дио`. Offline restoration and conversion pass,
and ordinary-layout highlighting passes separately from the affected article
layout failure recorded above.

Pending continuation steps:

- an explicit OS low-memory/tab-discard recovery remains unverified because it
  cannot be forced reliably through the available device controls;
- affected RTS highlight painting remains subject to the recorded WebKit bug
  307455 limitation.

## Local linguistic-review pack

Ignored local evidence is stored under
`artifacts/human-test-2026-08-13/linguistic-review/`. It contains paired source
and converted screenshots plus a short review rubric. The images show public
page content only and are not committed. The user reviewed the pairs on
2026-08-13 and reported that they looked acceptable, with no linguistic issues
recorded. Human linguistic acceptance for this screenshot set passes.

## Acceptance status

The added Chrome restricted-page and offline checks pass. The achievable
refreshed-iPhone sequence now passes build/deploy, conversion, exact Restore,
remembered refresh, RTS alias sharing, unrelated-host isolation, long-page and
cross-tab state, approximately 30-minute background recovery, offline behavior,
and ordinary-layout highlighting. The known affected-layout WebKit highlight
failure and an unforced OS low-memory discard remain explicitly open. Human
linguistic review passes. Edge is explicitly deferred and is not part of the
current publishing pass. The refreshed macOS Safari 0.9.1 persistence smoke
test passes. Remaining desktop recovery/live-site gates still limit broader
cross-platform claims, while the Apple/Chrome publishing pass can proceed with
the documented Safari highlighting limitation.
