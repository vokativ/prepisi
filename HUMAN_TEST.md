# Prepiši 0.9.1 — browser and device test

Use this checklist before publishing. A pass means the extension behaves correctly
on real pages; it does not mean every dialect word is already in the reviewed vocabulary.

## How to run and record the test

This is an observation-based checklist. It may be run manually by a person or,
in a later task, through computer control. A command-line build or the
`npm run test:browser-dom` fixture run is supporting evidence, not a substitute
for observing the installed extension, popup, browser permission UI, and page.

Before starting, record the date, operating-system and browser versions, build
artifact, test profile or window, and device model where relevant. Use an
isolated QA profile/window and public test pages only. Do not expose private tabs,
account pages, form contents, device identifiers, or private browsing data in the
report. Record each item as **Pass**, **Fail**, **Blocked**, or **Not run**, with a
short visible observation for failures and browser-specific behavior.

For a computer-controlled run:

1. The user first installs/enables the intended build and completes any signing,
   device trust, unlock, login, or CAPTCHA step that requires them.
2. Work in one named browser and one visible tab at a time. After every click,
   navigation, reload, background/foreground action, or permission choice,
   inspect the fresh visible state before continuing.
3. Prefer controls identified by their visible label. If the accessibility view
   is incomplete, use a screenshot and report uncertainty instead of inferring a
   pass. Do not reuse a control position after the UI changes.
4. Treat browser- or OS-owned wording as observed behavior. In particular,
   Safari may offer access **once**, **for one day**, or **always** instead of a
   site-saving prompt; record the choice shown and selected.
5. Do not bypass browser security warnings, solve CAPTCHAs, enter credentials,
   or accept an unexpected permission. Mark the item **Blocked — user action
   needed** and continue with independent checks.
6. A physical iPhone pass can be computer-controlled only while its screen is
   available in a controllable Mac window. Unlocking, trust prompts, and actions
   that appear only on the phone remain user-assisted.

Use this compact record for every platform:

```text
Date and extension version:
OS / device:
Browser and exact version:
Artifact and installation method:
Permission duration/options observed:
Checklist results (Pass / Fail / Blocked / Not run):
Known issue references:
```

## Prepare the installed build

Follow `docs/LOCAL_INSTALL.md` for the target browser. For Chrome or Edge, open
its extensions page, enable **Developer mode**, choose **Load unpacked**, and
select `build/chromium` or `build/edge`; then pin **Prepiši** to the toolbar.
Firefox uses `build/firefox`. Safari uses the generated and compiled Apple
wrapper, and iPhone Safari also requires the containing app to be installed and
Prepiši to be enabled under Safari extensions.

Before the first live-page check, confirm visibly that Prepiši is enabled and
that its popup opens from the browser toolbar or Safari extensions menu. Record
an installation or enablement failure as **Blocked** rather than testing the
fixture as a substitute.

For the controlled local fixture, serve `test/fixture.html` over local HTTP. To
produce installed-extension evidence, make changes only through the Prepiši
popup. Do not use the fixture's green development-harness buttons for that pass;
those buttons are reserved for engine/content-controller checks such as
`npm run test:browser-dom`.

The browser should not request permanent access to all websites. Chrome, Edge,
and Safari receive temporary access after the toolbar action is opened; Remember
may request the current hostname or the portal's finite reviewed editorial
aliases. Firefox declares the same reviewed batch, which its install, settings,
or first-use UI may surface, and uses exact-host prompts elsewhere. Safari may
separately ask whether access lasts once, one day, or always; that duration is a
browser-managed choice and is not selected by the extension.

## Representative live pages

| Page | Main starting form | First test | What it covers |
|---|---|---|---|
| [RTS](https://www.rts.rs/) | Cyrillic, mostly Ekavian | Latin + original pronunciation | Cyrillic → Latin, digraph capitalization, large dynamic news page |
| [Index.hr](https://www.index.hr/) | Latin, mostly Ijekavian | Cyrillic + original pronunciation | Croatian news layout, protected names, and reviewed alias-family behavior |
| [NSPM](https://www.nspm.rs/) | Cyrillic, mostly Ekavian | Latin + original pronunciation | Cyrillic → Latin on a smaller editorial site |
| [Klix](https://www.klix.ba/) | Latin, Ijekavian | Cyrillic + original pronunciation | Bosnian Ijekavian and brand-heavy text |
| [Vijesti](https://www.vijesti.me/) | Latin, Ijekavian | Cyrillic + original pronunciation | Montenegrin content and `ś / ź` when present |

For an exact script-parity check, use the same RTS article in
[Latin](https://rts.rs/lat/vesti/drustvo/6017125/gornji-milanovac-restrikcije-voda-cacak.html)
and [Cyrillic](https://rts.rs/vesti/drustvo/6017125/gornji-milanovac-restrikcije-voda-cacak.html).
RTS can remember its own script preference independently of the URL, so compare
the article text and verify the visible source script before starting.

For each page, open one article rather than testing only the homepage.

## Required behavior

- [ ] Latin → Cyrillic changes visible prose without changing layout or links.
- [ ] Cyrillic → Latin renders `Lj`, `Nj`, and `Dž` correctly in title case and
      `LJ`, `NJ`, and `DŽ` in all-caps text.
- [ ] Ekavian → Ijekavian changes known forms such as `mleko → mlijeko`,
      `dete → dijete`, `mesto → mjesto`, and `vetar → vjetar`.
- [ ] Each script or pronunciation button applies on one click, without a separate
      confirmation button.
- [ ] After changing one tab, opening Prepiši on another untouched tab shows
      **Izvorno / Izvorni**; returning to the first tab shows that tab's choices.
- [ ] The small header button changes every popup string between Latin and
      Cyrillic in one click, without changing the page's selected script or
      pronunciation. The same preference appears on the settings page.
- [ ] With **Zapamti na ovom sajtu** off, reloading or navigating to a new
      document starts that document in its source state.
- [ ] Turn **Zapamti na ovom sajtu** on. Accept the exact-host permission when
      shown, or the finite explicit alias-family request on a reviewed portal; a
      curated Firefox portal should already have access. Follow an article link:
      the selected script, dialect, and highlight setting are reapplied without
      reopening the popup. On RTS, also cross between `rts.rs` and `www.rts.rs`;
      `/lat/` is a path and must not create a separate saved rule.
- [ ] An unrelated host does not inherit the remembered rule. Turning site memory
      off stops later automatic conversion. It removes optional exact-host access;
      Firefox catalog access remains installed but dormant without a rule.
- [ ] With **Istakni promenjene reči** enabled, dialect-changed words are marked;
      script-only changes are not marked and the page layout remains unchanged.
- [ ] Ijekavian → Ekavian changes those forms in the opposite direction.
- [ ] Frequency-discovered families work both ways, for example
      `sudelovati ↔ sudjelovati`, `devojčica ↔ djevojčica`, and
      `predsedati ↔ predsjedati`; the human-reviewed noun
      `sudelovanje ↔ sudjelovanje` works too.
- [ ] Semantic lookalikes remain unchanged: `preko` must not become `prijeko`,
      and `premijera` must not become `premera`.
- [ ] Ikavian beta changes known forms such as `vrijeme → vrime`,
      `mlijeko → mliko`, `mjeseca → miseca`, `tijela → tila`, and
      `vrijednosti → vridnosti`, and can change them back.
- [ ] A combined conversion works, for example Cyrillic Ijekavian → Latin Ekavian.
- [ ] Switching modes repeatedly never compounds changes.
- [ ] **Vrati izvorni tekst** restores the exact source text for the current
      document, keeps the highlight checkbox unchanged, and does not replace the
      remembered mode that should apply to the next document.
- [ ] Text loaded after scrolling or clicking “load more” is converted too.
- [ ] Inputs, textareas, editable content, code blocks, SVG, and embedded players
      remain usable and unchanged.
- [ ] URLs, email addresses, and @handles remain unchanged.
- [ ] Built-in brands such as Google, Apple, GitHub, and YouTube remain unchanged.
- [ ] Sample list companies such as `Orange`, `Volkswagen Group`, `AstraZeneca`,
      `L'Oréal`, and `Telefónica` remain unchanged in official capitalization;
      lowercase ordinary words such as `orange` are not frozen.
- [ ] `ovdje` transliterates to `овдје`, `đe` to `ђе`, and `džem` to `џем`.
- [ ] Source-spelled foreign names such as `Richterova` remain intact; they must
      never become broken mixed forms such as `Рицхтерова`.
- [ ] A custom protected company name entered in settings remains unchanged.
- [ ] An explicitly English-language span remains unchanged.
- [ ] Browser-granted temporary access expires according to the duration shown by
      that browser. Do not fail the extension merely because Safari offers once,
      one day, or always. After access expires or is revoked, pages remain
      unmodified unless an active remembered rule and its required access remain;
      Firefox's disclosed catalog permission remains dormant without a rule.

## Additional browser sign-off

Run `npm run build:all` first. Firefox desktop and Android use `build/firefox`;
Safari packaging begins from `build/safari` and still requires Apple's wrapper.
For each claimed platform, repeat the required behavior above and also verify.
Perform the ordinary-layout highlight check separately from a known affected
flex layout so one result does not hide the other:

- [ ] the popup fits a portrait phone viewport without horizontal scrolling;
- [ ] the controls remain usable with touch and enlarged text;
- [ ] enlarged page text does not imply that the extension popup itself must
      scale; record page text and popup text as separate observations;
- [ ] highlighting paints on the ordinary local fixture in Firefox 140+,
      Android Firefox 142+, and Safari 17.2+;
- [ ] highlighting on the affected Safari flex-layout case is recorded
      separately, including a reference to WebKit bug 307455 if reproduced;
- [ ] conversion and restoration still work offline;
- [ ] after about 30 minutes in the background, conversion, restoration, and the
      current tab state remain correct;
- [ ] tab discard or low-memory recovery, navigation, and browser permission
      prompts never show another page's state;
- [ ] on iPhone, a pull-to-refresh after **Vrati izvorni tekst** may reapply the
      remembered rule; verify that this matches the saved rule and is not a
      stale dialect from another host;
- [ ] reviewed aliases such as `rts.rs`, `www.rts.rs`, and `oko.rts.rs` share the
      intended rule, `/lat/` remains only a path variant, and an unrelated host
      remains isolated.

Generated Firefox and Safari source builds are not considered released support
until these checks pass on the relevant desktop and mobile devices.

## Release sign-off

Sign off version 0.9.1 only when:

1. All five pages remain readable and interactive after conversion.
2. Restoration is exact on all five pages.
3. No form field or code sample is modified.
4. There is no repeatable severe mis-conversion outside the documented lexical
   limitations.
5. At least one other speaker performs the explicitly human linguistic/readability
   review in their preferred script and pronunciation. Computer control can run
   the behavioral checks but cannot replace this judgment.

## Report a bad conversion

Record one issue per example:

```text
Page URL:
Settings (script + pronunciation):
Original text:
Actual result:
Expected result:
Is this a brand/name, ordinary word, or dialect form?
Screenshot (optional):
```

Exact examples are more useful than general reports because they can become
regression tests and reviewed vocabulary entries.
