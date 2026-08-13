# Brand concept drafts

Drop raw Gemini/Nano Banana exports here while comparing candidate icon and
wordmark designs. See `research/BRAND_IDENTITY_ALTERNATIVES.md` for why this
exists and `research/BRAND_IDENTITY_GEMINI_PROMPTS.md` for the prompts.

**This folder is intentionally outside `assets/`.** `scripts/build-extension.mjs`
copies the entire `assets/` directory into every packaged browser build, so
anything placed there ships inside the extension. Nothing here is bundled or
distributed until a maintainer deliberately promotes a finished file into
`assets/icons/` (16/32/48/128px) or `assets/wordmark.png`, replacing the
current Balkan Sans-derived versions.

Suggested naming while comparing options: `<concept>-<variant>-<size>.png`,
e.g. `homoglyph-monogram-v1-512.png`, `stacked-wordmark-v3-512.png`. Keep the
Gemini export at whatever resolution it generates; downscaling to the actual
shipped sizes (16/32/48/128) happens only for the final chosen file, the same
way `scripts/render-brand-assets.py` already downsizes its 512px master.

## Current candidates (2026-08-13)

- `Generated Image August 13, 2026 - 10_26PM.jpg` — Nano Banana render of the
  Track B stacked lockup (`PRE` / `ПРЕ`). Has a mirrored/backwards third
  letter ("E") in both rows — needs a corrective conversational follow-up
  before this is usable — and is missing the gold footer strip from the
  shared brief.
- `Generated Image August 13, 2026 - 10_32PM.jpg` — alternate take using the
  first three letters of each alphabet (`ABC` / `АБВ`) instead of the brand
  root word. Cyrillic glyphs render correctly here, but it's a generic
  alphabet-pairing motif rather than brand-specific text. Also missing the
  gold footer strip.
- `Screenshot 2026-08-13 at 22.55.21.png` — manual Courier New mockup of the
  full wordmark (`PREPIŠI` / `ПРЕПИШИ`), captured as a low-resolution
  screenshot with background noise. A cleaner high-resolution export (e.g.
  from Google Slides/Docs instead of a screen capture) is planned as a
  redo.
