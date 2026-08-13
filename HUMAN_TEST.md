# Prepiši 0.9.0 — human browser test

Use this checklist before publishing. A pass means the extension behaves correctly
on real pages; it does not mean every dialect word is already in the reviewed vocabulary.

## Install the unpacked build

1. Open `chrome://extensions` or `edge://extensions`.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select the repository root (the folder containing
   `manifest.json`), or run `npm run build:chromium` and select `build/chromium`.
4. Pin **Prepiši** to the toolbar.

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
| [N1 Serbia](https://n1info.rs/) | Latin, mostly Ekavian | Cyrillic + original pronunciation | Latin → Cyrillic, embedded media, foreign names |
| [Klix](https://www.klix.ba/) | Latin, Ijekavian | Cyrillic + original pronunciation | Bosnian Ijekavian and brand-heavy text |
| [Vijesti](https://www.vijesti.me/) | Latin, Ijekavian | Cyrillic + original pronunciation | Montenegrin content and `ś / ź` when present |
| [HRT](https://www.hrt.hr/) | Latin, Ijekavian | Cyrillic + original pronunciation | Croatian text, mixed regional and foreign names |

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
- [ ] Closing or navigating away removes temporary access except for Firefox's
      disclosed catalog. Catalog pages remain unmodified unless explicitly remembered.

## Additional browser sign-off

Run `npm run build:all` first. Firefox desktop and Android use `build/firefox`;
Safari packaging begins from `build/safari` and still requires Apple's wrapper.
For each claimed platform, repeat the required behavior above and also verify:

- [ ] the popup fits a portrait phone viewport without horizontal scrolling;
- [ ] the controls remain usable with touch and enlarged text;
- [ ] highlighting works on Firefox 140+/Android 142+ and Safari 17.2+;
- [ ] conversion and restoration still work offline;
- [ ] tab discard, navigation, and browser permission prompts never show another
      page's state.

Generated Firefox and Safari source builds are not considered released support
until these checks pass on the relevant desktop and mobile devices.

## Human sign-off

Sign off version 0.9.0 only when:

1. All five pages remain readable and interactive after conversion.
2. Restoration is exact on all five pages.
3. No form field or code sample is modified.
4. There is no repeatable severe mis-conversion outside the documented lexical
   limitations.
5. At least one other speaker tests their preferred script and pronunciation.

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
