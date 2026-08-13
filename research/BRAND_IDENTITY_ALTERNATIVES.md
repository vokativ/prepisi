# Brand identity alternatives to the Balkan Sans-derived mark

Status: researched 2026-08-13. This is a decision-support note, not a finished
design. It exists because the current toolbar icon and popup wordmark are
rendered from a privately licensed font (`ATTRIBUTIONS.md` → "Balkan Sans
identity"), and the project owner has not yet confirmed that the purchased
Typotheque license permits distributing the *raster output* of that font
inside a public, freely redistributable browser extension. Until that is
confirmed or the mark is replaced, the current icon/wordmark stays a
public-release gate (`docs/PROJECT_STATUS.md`, `docs/PERSONAL_PUBLISHER_ACCOUNTS.md`).

## Why the current mark matters, not just what it is

`scripts/render-brand-assets.py` renders the icon from **Balkan Sans One**, a
Typotheque typeface built specifically so a single Cyrillic string and its
Latin transliteration share structural strokes — one glyph set reads as
`ПРЕ` and, rotated/mirrored, doubles as `PRE`. That is not decorative: it is
the single clearest visual expression of what Prepiši does (pairing Cyrillic
and Latin, and by extension Ekavian/Ijekavian/Ikavian, as the same underlying
language). Losing that mechanism is a real design loss, not just a licensing
inconvenience, so the goal below is to keep the *spirit* — visibly pairing two
scripts in one mark — without depending on Typotheque's specific artwork.

## Option 1 — Ask Typotheque for a logo-only usage rider (do this in parallel; low cost)

Many type foundries sell static "logo usage" rights separately from the
desktop/webfont license, specifically because a baked PNG/SVG derived from
their outlines is legally distinct from redistributing the font software. This
is a single email to Typotheque support referencing the existing purchase,
asking whether the current license (or a small add-on) covers shipping fixed
raster marks (not the OTF/ZIP, which already never ships) inside a free,
open-source (GPL-3.0) browser extension distributed through the Chrome Web
Store, Microsoft Edge Add-ons, AMO, and the App Store. A yes keeps the current
icon and wordmark exactly as-is. A no or non-response (reasonable to time-box
to ~2 weeks) falls through to Option 2. This does not block anything else and
should be sent regardless of which fallback is chosen.

## Option 2 — Original artwork in the same two-script spirit (recommended fallback)

Two concept directions were prototyped with Pillow against a Unicode-coverage
system font (not Balkan Sans — the renders are reproducible from any
OFL/redistributable Cyrillic+Latin font such as **PT Sans**, **Manrope**,
**Inter**, or **IBM Plex Sans**, all of which ship a real Cyrillic character
set and an explicit redistribution-friendly license). The rough previews are
saved at `design/brand-concepts/concept-a-stacked-wordmark-draft.png` and
`design/brand-concepts/concept-b-homoglyph-monogram-draft.png` (first-pass
drafts, not final art — see that folder's `README.md` for why they live
outside `assets/`):

- **Concept A — plain two-line lockup.** Latin `PRE` stacked directly over
  Cyrillic `ПРЕ` in the same bold weight, on the existing green field with the
  gold footer strip. This keeps the "two scripts, one word, stacked together"
  reading that the user asked to preserve, without attempting Balkan Sans's
  ambigram illusion (that specific glyph-sharing trick is the part that is
  actually derived from Typotheque's design and the part worth not
  recreating closely). It is legally clean because it uses only an ordinary,
  openly licensed font in its normal form — no redesigned letterforms. The
  first prototype ran the two lines slightly too tight (they touch); that is
  a five-minute kerning/line-height fix, not a structural problem.
- **Concept B — homoglyph monogram.** Cyrillic `Р` (er) and Latin `P` are the
  same shape in every standard typeface — a typographic fact, not anyone's
  intellectual property. A single bold `P/Р` glyph, with a small
  conversion/swap cue (two opposing arrows) beneath it, reads at small toolbar
  sizes (16–32px) much better than any multi-line text mark, small text is the
  actual weak point of the current icon. The first prototype's arrow cue
  (plain ellipse arcs) did not read clearly as "conversion" and needs real
  chevron/arrow iconography instead.

Recommendation: ship **Concept A** for the popup wordmark and settings header,
where there is room for two lines of text, and a refined **Concept B**-style
mark (or a simplified single-line wordmark) for the 16/32px toolbar icon sizes
where the current design is already hard to read. Both are renderable with a
small variant of `scripts/render-brand-assets.py` pointed at a bundled
OFL-licensed font instead of the private Balkan Sans archive, so the existing
green/cream/gold identity and build step do not need to change, only the font
source and glyph layout.

### Producing Option 2 artwork with Gemini image generation

The owner is generating candidate artwork with Gemini's Nano Banana image
models rather than (or in addition to) the font-render script above. Full
prompt text, model guidance, and a Cyrillic-text-rendering risk warning are in
`research/BRAND_IDENTITY_GEMINI_PROMPTS.md`. Save raw exports to
`design/brand-concepts/`, not `assets/`.

## Option 3 — Commission original bespoke artwork

If the ambigram-style shared-stroke trick itself (not just a stacked
two-script lockup) is important to keep, the safe way to keep it is to pay a
type/logo designer for a small work-for-hire mark inspired by the same idea
but independently drawn — style and genre are not protectable, only the
specific outlines are, so an original redraw removes the licensing question
permanently. This is more expensive than Option 2 and slower than Option 1,
so it is a later upgrade, not a blocker for the first public release.

## Suggested sequencing

1. Send the Typotheque logo-rights email now (Option 1); it costs nothing to
   ask and may make the rest of this moot.
2. In parallel, generate candidates for Concept A/B (and any Track A
   symbol-only variants) using the Gemini prompts in
   `research/BRAND_IDENTITY_GEMINI_PROMPTS.md`, or the font-render approach
   above, so the release is not blocked on a foundry's response time.
3. Revisit Option 3 only if the team later wants to reclaim the exact
   ambigram effect as a distinctive trademark-able mark.

None of this blocks the COMtext.SR gate, which was resolved separately on
2026-08-13 (`ATTRIBUTIONS.md`).
