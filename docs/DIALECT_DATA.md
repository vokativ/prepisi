# Dialect data model and review policy

This document explains how Prepiši represents jat-pronunciation choices, what
each evidence label means, and how contributors can adjust the vocabulary without
turning a corpus statistic or spelling pattern into a hard linguistic rule.

## What a dialect button means

Prepiši currently exposes three jat-reflex targets:

- **Ekavian**, such as `vetar`, `mleko`, and `vreme`;
- **Ijekavian**, including both `je` and `ije`, such as `vjetar`, `mlijeko`, and
  `vrijeme`;
- **Ikavian (beta)**, such as `vitar`, `mliko`, and `vrime`, only where a reviewed
  third form exists.

These are exact lexical and inflectional relations. They are not a general
Serbian-Croatian-Bosnian-Montenegrin translator and do not select a national
standard. Vocabulary, syntax, foreign-name transcription, and Montenegrin
jekavian jotation are separate product choices.

Script conversion is also independent. For example, `vjetar -> вјетар` combines
an Ijekavian lexical choice with Cyrillic transliteration. It does not make
`dj` a letter: `dj`, `đ`, and `dž` remain distinct.

## Runtime representation

At runtime the converter receives exact rows in this form:

```text
[Ekavian surface form, Ijekavian surface form, Ikavian surface form or null]
```

`null` is an intentional coverage boundary. It means the first two forms are
supported and the Ikavian form is not sufficiently established. The runtime does
not fill that gap with a spelling guess.

The converter builds bidirectional indexes from these rows. Ambiguous surfaces
and ordinary homographs therefore need explicit review: a correct forward mapping
can still be unsafe in reverse. Unchanged forms are valid too; not every inflection
exposes jat on the surface.

## Sources of truth

| Path | Authority | Notes |
|---|---|---|
| `src/dialect-data.js` | Manually reviewed surface rows | Small curated families and regression vocabulary |
| `data/lemma-relations/reviewed.json` | Reviewed seed lemma relations | Additive and explicitly non-exhaustive |
| `data/lemma-relations/human-reviewed.json` | Generated view of approved human reviews | Regenerate from the durable CSV ledger |
| `data/lemma-relations/generated-frequent.json` | Strict generated lemma relations | Admitted only when its release-audit hash passes |
| `data/ikavian-relations/mici-princ.json` | Reviewed Ikavian selections and exclusions | Attestation plus human collision review |
| `data/jat-discovery/reviews.csv` | Durable reviewer decisions | Safe to edit through the documented columns |
| `data/jat-discovery/blocked.json` | Semantic rejections | Prevents spelling lookalikes from returning |
| `data/jat-discovery/audit.json` | Whole-generated-set approval | Must not be updated without a complete audit |
| `research/country-demonym-candidates.json` | Scoped geographic seed list | Jat-sensitive country, demonym, and direction concepts; deliberately not every country |
| `research/generated/country-demonym-audit.json` | Full srLex/hrLex evidence report | Exact paradigms, frequency, POS, compatible slots, and explicit corpus gaps |
| `src/generated/comtext-pairs.js` | Generated aligned-corpus observations | Secondary evidence; not a closed dictionary |
| `src/generated/lexicon-pairs.js` | Generated inflected runtime rows | Derived from relation inputs plus srLex/hrLex morphology |
| `research/generated/*.csv` | Reproducible worklists and reports | Not durable decisions except for designated review columns before import |

All relation-source files are additive. A source count is never used as the
maximum possible vocabulary.

## Evidence levels

The `status` and `role` fields describe why a relation is present. They are not
interchangeable confidence decorations.

### 1. Reviewed primary relation

Examples: `reviewed / primary-seed` and `reviewed / primary-human-review`.

A person has evaluated the lexical equivalence, not merely its spelling. The pull
request should identify the reviewer or normative source, provenance, regional
scope, and relevant homographs. Morphological expansion is still allowed to
reject ambiguous inflection slots.

### 2. Audited strict generation

Example: `generated-strict / supplementary`.

The relation passed documented automatic constraints against pinned srLex/hrLex
archives and the complete accepted set was then audited. The audit pins the
ordered accepted-pair hash. A future algorithm or source change invalidates that
approval until the complete new set is inspected.

This tier is deliberately conservative. Passing a spelling rule alone is not
sufficient.

### 3. Aligned-corpus observation

Example: `corpus-observed / secondary` for COMtext.SR.

The forms or lemmas occurred at aligned positions in one parallel corpus. This is
useful empirical evidence, especially for inflections, but it can contain domain
choices and annotation errors. COMtext's current 316 distinct lemma relationships
and 748 distinct surface relationships describe that legal corpus only. Neither
number is a hard rule.

### 4. Corpus-attested and reviewed Ikavian relation

Example: `corpus-attested-reviewed / supplementary-ikavian`.

An independently supported Ekavian/Ijekavian relation produced an Ikavian
candidate that occurs exactly in a named corpus, after which a reviewer considered
regional fit and reverse collisions. Attestation is necessary in this workflow,
but not sufficient: `bilo`, for example, is too collision-prone to act as a blind
reverse mapping for `bijelo`.

### 5. Mechanical candidate

Examples: unreviewed rows in `research/generated/jat-candidates.csv` and mechanical
Ikavian suggestions.

These belong in research reports only. They must not be imported into runtime data
until promoted through one of the reviewed paths above.

## Current reproducible snapshot

The following figures describe the version 0.9.1 language-data snapshot
as generated on 2026-08-11. They are
useful audit checks, not language-wide totals or permanent acceptance thresholds:

- 52 manually curated families and 4,102 merged exact surface groups;
- 233 merged groups have a reviewed Ikavian third form;
- 412 deduplicated lemma relationships were considered by the lexicon builder;
- 331 lemma relationships matched srLex/hrLex morphology;
- 3,845 distinct lexicon-expanded surface pairs were emitted, including 80 with
  an Ikavian form;
- 1,900 morphology slots were rejected because competing variants remained;
- the top-10,000 discovery report contains 876 candidates: 195 already known,
  58 strict audited additions, and 623 review candidates;
- 733 rows have a mechanical Ikavian suggestion, but only the reviewed subset is
  eligible for runtime use;
- Mići Princ yielded 37 exact candidate-lemma attestations; 15 reviewed lemma
  families are selected in the durable relation file.

To inspect the live generated counts without editing files:

```text
node -e "const d=require('./src/dialect-data.js'); console.log({families:d.FAMILIES.length,groups:d.GROUPS.length,threeWay:d.GROUPS.filter(row=>row[2]).length})"
node -e "const d=require('./src/generated/lexicon-pairs.js'); console.log({lemmas:d.lemmaPairsConsidered,matched:d.matchedLemmaPairs,pairs:d.pairs.length,ikavian:d.pairs.filter(row=>row[2]).length,rejected:d.rejectedVariantSlots})"
```

## Adding or adjusting data

### Countries and demonyms

The general top-frequency discovery excludes `PROPN`: a capitalised place name
must not become a dialect rule merely because its letters resemble one. Country
and citizen names therefore use a separate, named seed list and an exhaustive
scan of both pinned lexicons. Run `npm run audit:countries` to regenerate the
report after editing that list.

Unicode CLDR 48.1 supplies the complete territory-name check: 264 entries were
compared across Serbian Latin, Croatian, and Bosnian. The four relevant jat
families are Germany, Belarus, `sever/sjever` in three northern territory names,
and `Devičanska/Djevičanska` in the Virgin Islands. The other cross-locale
differences are separate vocabulary or transcription choices.

The morphology list is scoped to country-related concepts whose jat reflex can
actually differ, rather than pretending every ISO country name needs a mapping.
Germany is supported as `Nemačka ↔ Njemačka`, `Nemac ↔ Nijemac`, `Nemica ↔
Njemica`, and `nemački ↔ njemački`, including reviewed inflections. The two
lexicons support the country, male demonym, and adjective families. srLex omits
`Nemica`; that regular paradigm is separately cross-checked against the Croatian
Language Portal and Columbia University's BCMS vocabulary. Belarusian adjectives
and `sever ↔ sjever` are supported, including North Korean adjective and reviewed
demonym forms. The Virgin Islands adjective family is also supported. Belarus
country and citizen nouns remain research candidates because the paired lexicon
evidence is incomplete.

### A small reviewed family

Use `src/dialect-data.js` when the contribution is a small set of explicitly
reviewed surface forms that should be understandable next to its tests. Include
all safe directions, capitalization behavior where relevant, and restoration.
Do not manufacture a complete paradigm from intuition.

### A reusable lemma source

Put a separate JSON file in `data/lemma-relations/` so provenance remains visible.
It must contain `name` and `pairs`; it should also declare `status`, `role`,
`exhaustive`, `license`, and `source`. Two-column rows provide Ekavian/Ijekavian
lemmas. A reviewed third string provides the Ikavian lemma. A source-specific
fourth value may hold evidence metadata, but the current builder does not use it
to decide acceptance.

Then run:

```text
npm run build:lexicons
npm run check
```

The builder matches equal morphosyntactic descriptions in srLex and hrLex. It
rejects slots with competing surface variants instead of choosing arbitrarily.

### A candidate-report decision

In `research/generated/jat-candidates.csv`, edit only:

- `decision`: `approve`, `reject`, or `defer`;
- `reviewer`: a stable name or handle;
- `review_notes`: the evidence, ambiguity, or reason for rejection.

Then run `npm run apply:jat-reviews`. The importer copies the decision to durable
data before any discovery command overwrites the generated report. An approval
becomes a reviewed relation; a rejection becomes a semantic block. A deferral
remains visible without entering runtime data.

### A changed strict-generation result

Run `npm run discover:jat`. If the accepted set differs from the hash in
`data/jat-discovery/audit.json`, the failure is intentional. Review every accepted
pair, record rejected semantic lookalikes in the blocklist, then update the audit
date, reviewer, count, and hash as one deliberate review change. Never copy the
new hash without inspecting the set it represents.

### An Ikavian relation

State which Ikavian variety the evidence represents. Prefer a downloadable,
versioned corpus or dictionary with clear reuse terms. Exact occurrence confirms
attestation, not general equivalence, so review both directions and record unsafe
targets under `excludedAfterReview`. Keep the UI's beta claim until coverage is
broad across relevant varieties and collision behavior has been independently
evaluated.

## Licensing matrix and public-release gate

| Material | Current terms | Repository treatment |
|---|---|---|
| Project code and original project data | GPL-3.0-only | Covered by `LICENSE` |
| srLex/hrLex-derived generated forms | GPL-3.0-only distribution through CC BY-SA 4.0 → GPLv3 compatibility | Keep provenance, transformation record, and source attribution in `ATTRIBUTIONS.md` |
| Mići Princ-derived Ikavian evidence | GPL-3.0-only distribution through CC BY-SA 4.0 → GPLv3 compatibility | Keep dataset handle, creators, method, and license attribution |
| COMtext.SR observations | CC BY 4.0 International, confirmed 2026-08-13 in upstream `## Licence` section (any purpose incl. commercial, with attribution) | Resolved — keep pinned provenance, license link, and attribution in `ATTRIBUTIONS.md` |
| Balkan Sans source font | Privately purchased license | Never commit ZIP/OTF files; publish raster outputs only after confirming the font license permits that distribution |
| Company-name snapshots | Compiled names and source links | Retain snapshot methodology and avoid copying protected editorial content |

The repository-level GPL-3.0-only license gives the project one primary license,
but it does not erase source attribution, compatibility, or asset obligations.
Every new source needs an explicit compatibility check. “Available online” and
“downloadable” do not mean redistributable.

Before making the repository public, maintainers should confirm the permitted
distribution of the Balkan Sans-derived raster marks (or replace them with
originally licensed branding) and verify that ignored private source files are
absent from the initial Git history. The COMtext.SR redistribution status was
resolved 2026-08-13; see `ATTRIBUTIONS.md`.

## Review questions

For every proposed relation, ask:

1. Does it express jat pronunciation rather than vocabulary, translation, or an
   orthographic-standard choice?
2. What supports the lemma equivalence independently of the generated spelling?
3. Does morphology support the proposed inflected forms without competing slots?
4. Is either direction an ordinary homograph or a more common unrelated word?
5. Is the form national, regional, historical, or corpus-specific?
6. Can a regression test show conversion and exact restoration?
7. Are source, version, transformation, license, and reviewer durable in the
   repository?
