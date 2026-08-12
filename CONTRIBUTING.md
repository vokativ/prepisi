# Contributing to Prepiši

Thank you for helping make Prepiši more accurate and easier to use. The project
welcomes browser compatibility fixes, test cases, documentation, protected-name
improvements, and carefully evidenced dialect relations.

Prepiši changes text that people are actively reading. A plausible-looking wrong
conversion is therefore more harmful than an explicit coverage gap. Contributions
should preserve three principles:

- conversion stays local to the browser;
- script, jat pronunciation, and orthographic-standard choices stay independent;
- generated or corpus-attested forms are not silently promoted to linguistic rules.

## Quick start

The checked-in runtime has no third-party JavaScript dependencies. Use Node.js 18
or newer, then run:

```text
npm test
npm run check
```

`npm run check` checks the JavaScript syntax and runs the complete test suite.
It does not download the large research lexicons.

To load a development build, enable developer mode at `chrome://extensions` or
`edge://extensions`, choose **Load unpacked**, and select the repository root.
Use `HUMAN_TEST.md` for the current real-page test matrix.

## Repository map

| Path | Purpose | Edit directly? |
|---|---|---|
| `src/converter.js` | Script and exact dialect conversion engine | Yes, with tests |
| `src/dialect-data.js` | Small, manually curated surface-form families | Yes, with evidence and tests |
| `data/lemma-relations/` | Durable Ekavian/Ijekavian lemma inputs | Yes; prefer one file per source |
| `data/ikavian-relations/` | Reviewed three-way lemma inputs and exclusions | Yes, with regional context |
| `data/jat-discovery/` | Human decisions, blocklist, and release audit | Yes, through the review workflow |
| `src/generated/` | Compact runtime data produced by scripts | No; regenerate it |
| `research/generated/` | Review reports produced by scripts | Edit only designated review columns |
| `research/cache/` | Local source-corpus cache | No; it is ignored by Git |
| `test/` | Automated behavior and regression cases | Yes |

The linguistic data model and evidence levels are described in
[`docs/DIALECT_DATA.md`](docs/DIALECT_DATA.md).

## Making a dialect-data change

Every pull request that changes a relation should state:

- the exact source and target forms in both directions;
- whether the evidence is a normative source, a reviewed dictionary relation,
  aligned-corpus observation, morphology expansion, or unreviewed suggestion;
- the source URL, version or commit, license, and access date;
- known homographs, competing meanings, regional limitations, and unsafe reverse
  conversions;
- at least one positive and one restoration or reverse-direction test.

Do not infer a universal relation from spelling alone. In particular, do not add
a global `e -> je/ije/i` replacement. A count reported by one corpus, including
COMtext's 316 observed lemma relations, is evidence about that corpus and never a
cap on the language or the repository.

### Add a reviewed relation directly

For a small, independently reviewed source, add a JSON file under
`data/lemma-relations/` instead of merging unrelated provenance into an existing
file. The minimum shape is:

```json
{
  "name": "Descriptive source name",
  "status": "reviewed",
  "role": "primary-seed",
  "exhaustive": false,
  "license": "SPDX identifier or an explicit licensing note",
  "source": "https://example.test/stable-source",
  "pairs": [
    ["ekavian lemma", "ijekavian lemma"]
  ]
}
```

A reviewed Ikavian relation may use a third element, for example
`["vetar", "vjetar", "vitar"]`. A missing third form must remain missing; it is
not permission to generate one at runtime.

Regenerate compact forms with:

```text
npm run build:lexicons
npm run check
```

That build streams pinned srLex/hrLex archives. With no local paths it downloads
the verified archives to a temporary directory. To reuse local copies in
PowerShell, set both paths:

```powershell
$env:PREPISI_SRLEX_PATH = "D:\data\srLex_v1.3.gz"
$env:PREPISI_HRLEX_PATH = "D:\data\hrLex_v1.3.gz"
npm run build:lexicons
```

The build rejects a missing partner archive, unexpected file size, or SHA-256
mismatch.

### Review frequency-ranked jat candidates

The generated worklist is `research/generated/jat-candidates.csv`. Edit only
`decision`, `reviewer`, and `review_notes`; accepted decision values include
`approve`, `reject`, and `defer`. Do not edit `generated_status` or the measured
columns.

Save decisions durably before regenerating the report:

```text
npm run apply:jat-reviews
```

This updates:

- `data/jat-discovery/reviews.csv` for durable human decisions;
- `data/lemma-relations/human-reviewed.json` for approvals;
- `data/jat-discovery/blocked.json` for semantic rejections.

To repeat the pinned top-10,000 discovery pass and regenerate its worklist:

```text
npm run discover:jat
```

This is a research build: it reads roughly 13.3 million compressed lexicon rows
and can take substantially longer than the ordinary checks. If the strict
accepted set changes, the command fails until a maintainer has reviewed the whole
new set and deliberately updates `data/jat-discovery/audit.json`. Do not change
the audit hash merely to make the build pass.

### Review Ikavian attestations

`data/ikavian-relations/mici-princ.json` is the durable selection and exclusion
record. `research/generated/ikavian-attestations.csv` is a generated intersection
report, not the source of truth. With the Mići Princ JSON files available locally:

```powershell
$env:PREPISI_MICI_PRINC_DIR = "D:\data\MP-json"
npm run discover:ikavian
```

An attested spelling proves that the form occurred in that corpus. It does not by
itself prove a safe general-purpose equivalence. Record the regional variety and
exclude reverse-direction homographs explicitly.

## Generated data and networked builds

Generated runtime files are intentionally committed so ordinary extension builds
remain self-contained. Regenerate only the part relevant to a change:

- `npm run build:comtext` downloads the two files pinned in
  `scripts/build-comtext-data.mjs` and rewrites `src/generated/comtext-pairs.js`;
- `npm run build:lexicons` rewrites `src/generated/lexicon-pairs.js`;
- `npm run build:data` imports reviews, refreshes COMtext, repeats jat discovery,
  and rebuilds the lexicon output;
- `npm run build:all` creates unpacked Chromium, Firefox, and Safari source trees
  under ignored `build/` directories on any Node-supported platform;
- `npm run package` creates Chromium and Firefox ZIPs plus a Safari source ZIP on
  a machine with PowerShell.

Networked data builds must retain source pinning and integrity checks. A pull
request should include both the durable input/decision change and the resulting
generated diff so reviewers can audit them together.

## Licensing and private assets

The project is distributed under GPL-3.0-only. Adapted CC BY-SA 4.0 language
data is included through that license's official one-way compatibility with
GPLv3, while upstream attribution and notices remain mandatory. Read
`ATTRIBUTIONS.md` and the licensing section of
[`docs/DIALECT_DATA.md`](docs/DIALECT_DATA.md) before adding or regenerating data.
Do not copy a website, dictionary, model, or corpus merely because it is publicly
reachable.

The Balkan Sans source ZIP and OTF files are privately licensed and must never be
committed. Maintainers with the license can run `npm run render:brand`; everyone
else can use the checked-in raster assets. The public repository should also
exclude `research/cache/`, local srLex/hrLex archives, and packaged `dist/`
outputs, as enforced by `.gitignore`.

Do not add data with missing or incompatible redistribution terms to a public
release. If a future integrator needs a permissive or proprietary-compatible
license, maintainers must obtain permission from the affected data authors or
replace the derived material before offering different terms.

## Pull-request checklist

- Keep the change focused and explain user-visible behavior.
- Add automated tests for conversion changes and a real-page example when useful.
- Run `npm run check`.
- Confirm that conversion remains bidirectional and restoration returns exact
  original text.
- Confirm that no page text, browsing data, or identifier is sent off-device.
- Document every new data source, version, license, transformation, and limit.
- Do not include font binaries, corpus caches, lexicon archives, credentials, or
  browsing screenshots containing private information.
