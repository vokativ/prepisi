# Project status and machine handoff

Last updated: 2026-08-12. Current extension version: 0.9.0.

## Current state

- Chromium, Edge, Firefox, and Safari-source builds are generated from one
  offline WebExtension engine.
- Script conversion is bidirectional between Latin and Cyrillic.
- Ekavian, Ijekavian, and the reviewed Ikavian beta vocabulary convert in both
  directions.
- Popup choices apply immediately and are tab-local by default.
- **Remember on this site** optionally reapplies the selected modes after
  same-host navigation using hostname-scoped permission.
- The interface can switch independently between Latin and Cyrillic.
- Dialect changes can be highlighted without wrapping or rewriting page HTML.
- The project makes no browsing-time network request and stores no page text.

## Verified baseline

- `npm run check`: 76/76 tests pass.
- All four browser targets build and package successfully.
- Mozilla `web-ext lint`: 0 errors, 0 warnings, and 0 notices.
- Frozen portal fixtures cover RTS, Index.hr, NSPM, Vijesti.me, and Klix.ba.

Run after cloning on another machine:

```text
npm run check
npm run build:all
```

No dependency installation is currently required for the ordinary tests and
builds beyond Node.js. Corpus regeneration uses the pinned external inputs and
commands documented in `CONTRIBUTING.md` and `docs/DIALECT_DATA.md`.

## Repository and licensing

- Primary project license: GPL-3.0-only.
- `ATTRIBUTIONS.md` records third-party language-data provenance and required
  notices.
- Never commit the privately licensed Balkan Sans ZIP/OTF files, corpus caches,
  signing keys, generated browser folders, or packaged extension ZIPs. The
  repository ignore rules enforce these boundaries.
- Keep the GitHub repository private until explicit COMtext.SR redistribution
  terms are confirmed or its derived observations are removed, and until the
  right to distribute the Balkan Sans-derived raster identity is confirmed.
- A future non-GPL integration can be discussed with maintainers, but would
  require author permission for affected data or replacement data.

## Next release work

1. Run the 0.9 human checklist in Chrome, Edge, and Firefox on Windows.
2. Repeat desktop smoke tests on macOS and Linux.
3. Test Firefox Android and the approved Edge mobile distribution path.
4. Package and test the Safari wrapper on macOS, iOS, and iPadOS.
5. Continue reviewed dialect-vocabulary expansion and exact regression cases.
6. Resolve the two public-release licensing gates above.
7. Prepare store screenshots, descriptions, privacy URL, signing, and listings.

Detailed instructions are in `HUMAN_TEST.md`, `docs/LOCAL_INSTALL.md`,
`docs/RELEASE_COVERAGE.md`, and `research/BROWSER_COMPATIBILITY.md`.
