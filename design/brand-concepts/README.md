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

## Current candidates (2026-08-13)

- `icon-stacked-pre-v1-nanobanana.jpg` — Nano Banana render of the Track B
  stacked lockup (`PRE` / `ПРЕ`). Has a mirrored/backwards third letter ("E")
  in both rows — needs a corrective conversational follow-up before this is
  usable — and is missing the gold footer strip from the shared brief. Kept
  as an active candidate pending that fix.
- `icon-alphabet-abc-v1-nanobanana.jpg` — alternate take using the first
  three letters of each alphabet (`ABC` / `АБВ`) instead of the brand root
  word. Cyrillic glyphs render correctly. Also missing the gold footer strip.
  Kept as an active candidate: it may read more clearly to people who read
  both scripts, at the cost of not spelling anything brand-specific — still
  under consideration.
- `wordmark-courier-v1-screenshot-lowres.png` — superseded. Manual Courier
  New mockup of the full wordmark (`PREPIŠI` / `ПРЕПИШИ`), captured as a
  low-resolution screenshot with background noise.
- `wordmark-courier-v2-slides-export.png` — replaces v1. Exported directly
  from a Slides/Docs deck instead of a screen capture: 851×318px, clean flat
  vector-quality edges, no noise. **Verified letter-by-letter**: top row
  reads `PREPIŠI` (P, R, E, P, I, Š, I — caron correctly placed on Š) and the
  bottom row reads `ПРЕПИШИ` (П, Р, Е, П, И, Ш, И) — all glyphs correctly
  oriented (no mirroring, unlike the AI-generated icons). Currently grey text
  (#595959-ish) on a plain white background at 72 DPI, not yet in brand
  colors — still needs recoloring to cream-on-green before promotion, and is
  a modest source resolution (851px wide) for a master asset, so treat it as
  a locked-in content/layout reference rather than final pixels.

Suggested naming for any further exports: `<concept>-<variant>-<detail>.png`,
matching the pattern above. Keep exports at whatever resolution they're
generated/exported at; downscaling to the actual shipped sizes (16/32/48/128)
happens only for the final chosen file, the same way
`scripts/render-brand-assets.py` already downsizes its 512px master.
