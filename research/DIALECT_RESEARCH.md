# Dialect and transcription research

Research date: 2026-08-11

## Product model

Three transformations must remain independent:

1. **Script** — Serbian/Montenegrin Latin and Cyrillic transliteration.
2. **Jat pronunciation** — reviewed Ekavian, Ijekavian and (beta) Ikavian word
   forms such as `vetar / vjetar / vitar`.
3. **Orthographic standard and foreign-name treatment** — for example source
   `Richter` versus Serbian-transcribed `Rihter`. This is not a jat change and
   cannot safely be inferred from an Ekavian/Ijekavian selection.

The extension must not present a jat converter as a general Serbian–Croatian
translator. Vocabulary, morphology, syntax, spelling and name treatment extend
beyond pronunciation.

## Reusable resources evaluated

### Ekavian and Ijekavian

- **Serbian morphological electronic dictionary / Leximirka.** Its published
  model is the strongest fit: lexical entries are explicitly connected with
  `+Ek` and `+Ijk` relations, and inflectional rules operate on those entries.
  The paper gives pairs including `devojka / djevojka`, `leto / ljeto`,
  `brijeg / breg`, `bezbjednost / bezbednost` and `sljedeći / sledeći`.
  Access and redistribution terms for the underlying dictionary are not clear
  enough to ship its data in this extension.

- **COMtext.SR.legal.** This is a useful aligned observation source:
  it contains parallel Ekavian and Ijekavian versions of the same 105,470-token
  legal corpus, with aligned token IDs, lemmas and morphosyntactic tags. A local,
  in-memory audit found 4,224 changed token occurrences, 748 distinct changed
  surface-form relationships and 316 distinct changed lemma relationships.
  These figures describe this corpus only and are not a language-wide inventory.
  Version 0.5 includes the compact observations on a provisional, fully attributed
  basis at the user's direction. GitHub reports no repository license file or
  SPDX license, so the maintainers should still clarify redistribution terms
  before a public release.

- **srLex 1.3 and hrLex 1.3.** These are large downloadable inflectional
  lexicons with lemmas, surface forms, morphosyntactic tags and frequencies.
  CLARIN distributes them under CC BY-SA 4.0. They are not a parallel
  Ekavian/Ijekavian dictionary, so they cannot be zipped together blindly.
  srLex has 169,328 lemmas and 6,905,941 rows; hrLex has 164,206 lemmas and
  6,427,709 rows. The official archives are about 54.2 MiB and 52.0 MiB gzip,
  expanding to about 1.19 GiB and 1.10 GiB of repetitive eight-column text.
  They are useful build-time validators: start with a reviewed lemma pair,
  match surface forms by compatible morphology, then review the generated rows.
  Attribution and share-alike obligations must be settled before derived data
  is released.

- **CLASSLA.** This Python NLP pipeline supports Serbian and Croatian
  tokenisation, morphology and lemmatisation. It can help an offline data-build
  process, but its models are far too large for a small privacy-first browser
  extension and it does not itself convert Ekavian to Ijekavian.

- **IKI / srpsko-hrvatski.com and Jatolog.** Both demonstrate that substantial
  dictionary-backed conversion is possible. Public descriptions mention
  grammar tables, corpora and thousands of reviewed entries. No reusable,
  clearly licensed library or public API was found, so the extension must not
  scrape or depend on these services.

No maintained, browser-ready open-source JavaScript library was found that
performs reliable bidirectional Ekavian/Ijekavian conversion with inflection.

### Ikavian sources

- **Mići Princ.** CLARIN.SI publishes this 11,591-word, word-aligned text and
  speech corpus of Chakavian micro-dialects under CC BY-SA 4.0. Its text archive
  is only 222 KiB. Intersecting its tokens with the 733 generated Ikavian lemma
  suggestions produced 37 exact lemma attestations. Version 0.6 admits 15 safe
  families after review and expands them through srLex/hrLex to 80 surface rows.
  The repeatable intersection report is
  `research/generated/ikavian-attestations.csv`; durable selections and exclusions
  are stored in `data/ikavian-relations/mici-princ.json`.
  It excludes context-dangerous reverse mappings such as `bijelo / bilo`,
  `plijen / plin`, and the inflected `brijeg / brig / briga` collision.
- **Makarska littoral corpus.** This is directly relevant Neo-Štokavian Ikavian
  material and includes contemporary questionnaires plus historical texts, but
  the publication describes an online research system rather than a clearly
  licensed downloadable dataset. It is a good author-contact candidate, not yet
  a reproducible extension input.
- **CroDi.** The diachronic corpus includes 16th–19th-century Štokavian,
  Chakavian, and Kajkavian texts. It is useful for linguistic research but mixes
  periods and varieties, is exposed primarily through ANNIS, and its public page
  states all rights reserved; it is not a clean source for a modern Ikavian button.
- **CLASSLA-web 2.0.** This CC0 collection is extremely large and downloadable,
  but it labels language and script rather than jat dialect. It can attest
  frequency after candidate generation; it cannot by itself supply equivalence.
- **Mrežni rječnik kajkavske donjosutlanske ikavice.** The Institute for Croatian
  Language makes this valuable dictionary searchable online, but it represents a
  specific Kajkavian Ikavian system and does not advertise a downloadable data
  license. It should not be silently treated as general Štokavian Ikavian.

### Script conversion

Several libraries handle Serbian Latin/Cyrillic transliteration, including the
MIT-licensed JavaScript package `@exvorn/serbian-transliteration`, the PHP
`turanjanin/serbian-transliterator`, and ICU transforms. These solve script
mapping, not dialect conversion. The current extension engine is smaller,
dependency-free, already handles Montenegrin `ś / ź`, and has page-specific
protection and round-trip tests, so adding a dependency would not currently
improve the missing dialect coverage.

`dj`, `đ`, and `dž` must remain distinct in both code and linguistic review.
Across the shared Latin alphabet, `đ` is a single letter and `dž` is a digraph
letter, but plain `d + j` is not a letter. Consequently `ovdje` transliterates
as `овдје`. Croatian orthography lists only `dž`, `lj`, and `nj` as digraphs;
Montenegrin orthography does the same, while also describing the optional
language-specific jekavian jotation `dje → đe`. Its dictionary gives
`ovdje / ovđe` as doublets. That distinction belongs in a future Montenegrin
standard option, not in the generic Ijekavian jat target.

The PHP library is nevertheless a useful reference because it includes a larger
list of false `lj / nj / dž` digraphs and common foreign-word exceptions. Those
lists should be evaluated separately with license attribution before reuse.

### Foreign-name transcription

Croatian orthography normally keeps personal names from Latin-script languages
in their source spelling. Serbian editorial guidance normally transcribes a
foreign name according to the source language, often showing the original form
on first mention. Therefore `Richter → Rihter` is an orthographic-standard
choice, not an Ekavian/Ijekavian change.

Epitran can map supported source orthographies to IPA and includes Serbian, but
it does not provide the required pipeline: identify a named entity, identify its
source language, obtain the correct pronunciation, map that pronunciation to
normative Serbian spelling, inflect it, and reverse the process without losing
the original. A dependable implementation needs a name dictionary plus
language-specific rules and confidence handling. Until then, source foreign
names should be preserved rather than corrupted by character-level Cyrillic
conversion.

## Adopted data workflow

The runtime stays small and offline. Reviewed word families live in
`src/dialect-data.js`; each row is `[Ekavian, Ijekavian, Ikavian]`. Compact
generated rows live beside them under `src/generated`. A null
Ikavian value is an explicit coverage gap, not a guessed conversion.

The implemented expansion pipeline is:

1. Add or import an Ekavian/Ijekavian lemma relation as another JSON source.
   Sources are additive and explicitly non-exhaustive; COMtext is secondary
   evidence, not a 316-pair limit.
2. Generate candidate inflections with compatible morphosyntactic tags from
   srLex/hrLex or another clearly licensed source.
3. Compare candidates against aligned corpora and frequency data.
4. Human-review ambiguous rows and preserve multiple meanings rather than
   forcing one spelling.
5. Export only compact generated rows needed by the extension; the multi-gigabyte
   source text never ships.
6. Add every real-page report as a bidirectional regression test.

### Frequency-ranked bootstrap results

Version 0.5 uses hrLex's absolute-frequency field to rank lemma families. It
deduplicates repeated `(lemma, wordform)` analyses, excludes proper names and
non-lexical UPOS categories, and scans the top 10,000 of 99,544 eligible lemmas.
Candidate spelling rules are applied from the Ijekavian side because `ije` and
`je` expose likely jat positions more clearly; modern spelling is never treated
as semantic proof.

The pinned run produced 876 candidates: 195 known relationships, 58 new
strict relationships, 623 review candidates, and 733 unshipped Ikavian
suggestions. Strict acceptance requires a unique bidirectional lemma match,
shared UPOS, a higher-trust reflex-pattern anchor, at least three compatible MSD
slots, at least two changed forms, no ambiguous changed target, and no semantic
blocklist entry. All 59 initially eligible pairs were inspected; the false
`preko / prijeko` relationship was blocked and the remaining 58 were hash-pinned
for release. One additional human-reviewed relation was migrated from the review
report (`sudelovanje / sudjelovanje`). Version 0.6 adds the reviewed Mići Princ
subset. Expanding the combined 412 lemma relationships produces 3,845 surface
pairs, including 80 Ikavian rows, while rejecting 1,900 unresolved variant slots.

Human decisions are durable inputs, not edits to generated status. Reviewers fill
`decision`, `reviewer`, and `review_notes` in the generated candidate CSV, then
run `npm run apply:jat-reviews`. The importer saves decisions in
`data/jat-discovery/reviews.csv`; builds import that ledger before regenerating
the candidate report.

This gives the browser extension deterministic, explainable behaviour without
network requests while allowing corpus-backed coverage to grow outside runtime.

## Sources

- [Leximirka / Serbian morphological dictionary paper](https://infoteka.bg.ac.rs/ojs/index.php/Infoteka/article/download/2019.19.2.4_en/180/)
- [COMtext.SR repository](https://github.com/ICEF-NLP/COMtext.SR)
- [ReLDI Serbian srLex description](https://reldi.rs/blog/serbian-lexicon/)
- [ReLDI Croatian hrLex description](https://reldi.rs/blog/croatian-lexicon/)
- [CLARIN srLex 1.3 metadata and CC BY-SA license](https://b2find.eudat.eu/dataset/aea68ca3-269b-54b4-a0fb-f7589fa96b1b)
- [CLASSLA package](https://pypi.org/project/classla/)
- [Serbian transliterator with exceptions](https://github.com/turanjanin/serbian-transliterator)
- [MIT JavaScript Serbian transliteration package](https://www.npmjs.com/package/@exvorn/serbian-transliteration)
- [Croatian orthography: writing names](https://pravopis.hr/pravilo/pisanje-imena/47/)
- [University of Belgrade Serbian author guidance on foreign names](https://zivijezici.fil.bg.ac.rs/index.php/zivijezici/sr_Latn/Guidelines)
- [Epitran orthography-to-IPA library](https://github.com/dmort27/epitran)
- [Croatian alphabet and digraphs](https://pravopis.hr/slova/)
- [Montenegrin orthography and `ovdje / ovđe` doublets](https://ucg.ac.me/skladiste/blog_19952/objava_68038/fajlovi/pravopis_crnogorskoga_jezika.pdf)
- [Mići Princ dataset and CC BY-SA metadata](https://hdl.handle.net/11356/1765)
- [CroDi diachronic Croatian corpus](https://westslang.sprachen.hu-berlin.de/crodi/crodi.html)
- [CLASSLA-web South Slavic corpora](https://clarinsi.github.io/classla-web/)
- [Makarska littoral dialect corpus paper](https://doi.org/10.2478/jazcas-2021-0045)
- [Mrežni rječnik kajkavske donjosutlanske ikavice](https://ikavci.ihjj.hr/)
