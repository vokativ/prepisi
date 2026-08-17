# Data attributions

Prepiši 0.9.1 includes compact, generated Ekavian/Ijekavian/Ikavian form relationships.
The extension performs all conversion locally and does not ship the source
archives or contact these projects while a user browses.

## srLex 1.3 and hrLex 1.3

srLex and hrLex were created by Nikola Ljubešić and distributed through the
CLARIN.SI repository under CC BY-SA 4.0. Prepiši uses their wordform, lemma and
morphosyntactic fields during the offline build to expand already supplied lemma
relationships. Only a compact generated result is included in the extension.

- srLex 1.3: <https://hdl.handle.net/11356/1233>
- hrLex 1.3: <https://hdl.handle.net/11356/1232>
- License: <https://creativecommons.org/licenses/by-sa/4.0/>

Changes made by Prepiši include filtering to supplied Ekavian/Ijekavian lemma
relationships, matching equal morphosyntactic descriptions, rejecting slots with
multiple competing surface variants, deduplicating exact pairs, and adding
ambiguity safeguards. Creative Commons officially designates GPLv3 as a one-way
compatible license for adaptations of CC BY-SA 4.0 material. Prepiši therefore
distributes its adapted generated tables with the GPL-3.0-only program while
retaining this attribution, the upstream CC BY-SA 4.0 notice, and the record of
changes. Compatibility declaration:
<https://creativecommons.org/compatible-licenses/>.

Version 0.5 additionally ranks the 10,000 most frequent hrLex lemma families,
generates spelling-rule candidates, validates them against srLex morphology, and
ships 58 newly inferred relationships after a full release audit. One additional
human-reviewed relationship (`sudelovanje / sudjelovanje`) is tracked separately.
The source archives are pinned by SHA-256; only 3,845 compact derived surface pairs are
included, not the original archives.

## Unicode CLDR 48.1

The research audit compares Serbian Latin, Croatian, and Bosnian territory
display names from Unicode CLDR JSON 48.1.0. The complete comparison is retained
for reproducibility; only reviewed jat families derived from it enter the runtime.

- Release: <https://cldr.unicode.org/downloads/cldr-48>
- JSON project: <https://github.com/unicode-org/cldr-json/tree/48.1.0>
- License: <https://www.unicode.org/license.txt> (`Unicode-3.0`)

## Mići Princ Chakavian corpus

Version 0.6 uses the openly available Mići Princ text corpus as a narrow Ikavian
attestation source. The dataset was created by Nikola Ljubešić, Peter Rupnik, and
Tea Perinčić and is distributed by CLARIN.SI under CC BY-SA 4.0.

- Dataset: <https://hdl.handle.net/11356/1765>
- Text archive: `MP.json.tgz`, MD5 `984df31d6c5df7027dc188a714a17f15`
- Size reported by CLARIN.SI: 11,591 words

Prepiši does not ingest arbitrary Chakavian spelling or grammar. It intersects
the corpus with already validated Ekavian/Ijekavian jat relations, checks exact
Ikavian token attestation, manually excludes obvious reverse-direction collisions,
and uses srLex/hrLex morphology to expand 15 lemma families into 80 compact
three-way surface rows. The source corpus is not included in the extension archive.

## COMtext.SR

Prepiši also includes relationships observed in the aligned Ekavian and
Ijekavian legal corpus from ICEF-NLP/COMtext.SR, pinned to commit
`ee8c2432fb4229012a3cb396b7823639216fc3da`:

<https://github.com/ICEF-NLP/COMtext.SR>

COMtext is treated as a secondary, non-exhaustive observation source. Its 316
observed lemma relationships and 748 observed surface-form relationships are
properties of this one corpus, not rules or limits for the language. Verified
2026-08-13: the pinned commit's README and the current upstream `main` README
both carry a `## Licence` section stating that every COMtext.SR dataset is
published under CC BY 4.0 International and every fine-tuned model under
Apache 2.0, "free to use for any purpose, including commercial, with
attribution of authorship" (translated from the original Serbian). This
attribution entry, the pinned commit, and the upstream project link fulfil the
CC BY 4.0 attribution requirement, so this source no longer blocks the
public-release decision. Project contact for optional written confirmation or
collaboration: dr Vuk Batanović, COMtext.SR project lead,
<vuk.batanovic@ic.etf.bg.ac.rs>. License text:
<https://creativecommons.org/licenses/by/4.0/>. Project page:
<https://www.ic.etf.bg.ac.rs/projects/comtext-sr/>.

## Prepiši reviewed relations

Independently reviewed seed relationships are maintained in
`data/lemma-relations/reviewed.json`. Additional reviewed dictionaries can be
added as separate source files; no existing source count limits the combined
vocabulary.

## Company-name snapshot

Prepiši includes company names only—not financial values—from 2026 snapshots of
the Fortune 500, FTSE 100, CAC 40, DAX 40, and IBEX 35. There are 715 list
positions and 711 unique names after overlap. The snapshot sources and dates are
embedded in `src/generated/company-names.js`; official index pages are retained
there as methodology links. These facts are compiled into the extension and are
never requested while a user browses.

## Brand identity

Toolbar icons are original raster `PRE` / `ПРЕ` lockups, independently rendered
without Balkan Sans outlines. The popup wordmark (`assets/wordmark.png`) remains
a Balkan Sans-derived raster from the project owner's Typotheque-licensed font.
The OTF/ZIP font files are not included in this repository or extension package.
Public distribution of that remaining wordmark stays subject to confirmation of
the applicable Typotheque raster-output right or a replacement wordmark.
