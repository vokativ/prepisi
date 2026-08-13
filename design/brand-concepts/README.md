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
