# Gemini image-generation prompts for the brand identity replacement

Companion to `research/BRAND_IDENTITY_ALTERNATIVES.md`. That note covers *why*
a replacement is needed; this note is the practical prompt set, written for
the actual Google AI Studio model catalog. Save raw exports to
`design/brand-concepts/` — never directly into `assets/`, which ships inside
the packaged extension.

## The idea, precisely, before any prompt

What Balkan Sans actually does for the current icon is not a rotated/mirrored
single-glyph ambigram. Typing the Cyrillic string `ПРЕ` produces a two-row
mark: a Latin transliteration on top (`PRE`) and the Cyrillic original below
(`ПРЕ`), in matching weight, with the row for `Е` visually collapsing since
Cyrillic `Е` and Latin `E` are already the same shape. It is a **stacked
Latin-over-Cyrillic lockup that leans on real homoglyphs where they exist**,
engineered as a font so it works automatically for arbitrary input — not a
letterform that reads two different ways when flipped.

Per the owner's direction: don't overengineer a new rotational-ambigram
invention. **Copy that same logic — a stacked Latin/Cyrillic lockup — with a
different, openly licensed font**, not Balkan Sans's outlines. That is Track B
below, and it's now the primary recommended path, not a fallback.

Worth knowing while prompting: Cyrillic `Е` (position 3 of `ПРЕ`) is an exact
homoglyph of Latin `E` — free, no risk. Cyrillic `Р` (position 2) is an exact
homoglyph of Latin `P`, but that's a *cross-position* coincidence (position 2
of `ПРЕ` looks like Latin `P`, not like Latin `R`), so it doesn't let you
collapse the whole word into one shared row — the two-row stack is still the
right structure, exactly like Balkan Sans uses.

## Which model to use

Per Google's own documentation (`ai.google.dev/gemini-api/docs/image-generation`,
`ai.google.dev/gemini-api/docs/imagen`) and product announcements, checked
2026-08-13:

| Model (AI Studio name) | Model ID | Use it for | Why |
| --- | --- | --- | --- |
| **Nano Banana Pro** | `gemini-3-pro-image` | The wordmark (Track B) and any candidate you're refining toward final | Google's own model card (`deepmind.google/models/model-cards/gemini-3-pro-image/`) reports human-eval benchmark leads over Gemini 2.5 Flash Image, GPT-Image 1, Seedream v4, and Flux specifically in Text Rendering, Text Editing, Multi-Turn, and Visual Design categories; supports genuine multi-turn conversational editing (upload/reference a prior generation and ask for a targeted fix) and up to 4K, 1:1 included |
| **Nano Banana 2** | `gemini-3.1-flash-image` | Fast iteration on Track A symbol concepts, and generating several first-pass Track B drafts before switching to Pro to fix specific glyphs | Its own model page lists "improved i18n text rendering" explicitly; also supports multi-turn editing; 4K, 1:1 included |
| Nano Banana 2 Lite | `gemini-3.1-flash-lite-image` | Cheap bulk exploration only | Google's docs explicitly say it is **not optimized for multi-turn sequential editing** — skip it once you're iterating on a specific candidate |
| Nano Banana (legacy) | `gemini-2.5-flash-image` | Skip | 1024px cap only; Google's own docs recommend migrating off it |

**Do not use the Imagen 4 family** (`imagen-4.0-generate-001` / `-ultra` /
`-fast`) for this, despite the "significantly better text rendering" label
you saw in AI Studio. Three concrete, documented reasons:

1. Google's Imagen API docs explicitly say prompts are **English only**.
   There is no documented support for prompting it to render Cyrillic text at
   all, let alone accurately.
2. Imagen is a **one-shot text-to-image API with no multi-turn editing** —
   there's no way to upload a draft and say "fix the second line," only
   regenerate from scratch. Track B needs that correction loop.
3. Google's Imagen docs state the whole Imagen model family is **being
   deprecated and shut down on 2026-08-17**, with an explicit migration path
   to the Nano Banana/Gemini image models. It is being retired in days, not a
   model worth building a workflow around right now.

Google's own Gemini 3 Pro Image model card lists concrete limitations worth
planning around: **small text is often blurry at 1K** (generate at 2K or 4K
for anything with letterforms this small), long paragraphs/page-length text
can fail, editing sometimes copy-pastes input rather than truly redrawing it,
and it can show **spatial left/right confusion** — worth an explicit check
that a stacked or mirrored layout didn't get flipped. No official source,
including that model card, provides a Cyrillic-specific accuracy metric, and
no independent, verifiable benchmark for Cyrillic text was found either —
treat any blog post claiming a precise percentage (e.g. "94% Cyrillic
accuracy") as unsupported marketing copy, not evidence. This is exactly why
the verification steps below are not optional.

All Nano Banana models are conversational/multimodal in Google AI Studio and
the Gemini app (gemini.google.com): after a first generation, reply with
follow-ups like "keep this composition but simplify the arrows" instead of
rewriting the whole prompt. Every generated image carries an invisible SynthID
watermark; that doesn't affect using it as your own icon artwork. None of
these models has a documented alpha-transparency output — always ask for a
solid background color and mask/crop it afterward.

## Read this before generating anything: text rendering is still the risk

Even the best-suited model here has no documented, verified Cyrillic-accuracy
guarantee. Do not accept a generated wordmark on trust:

1. Zoom in and check every Cyrillic letter in `ПРЕ` (П, Р, Е) individually
   against a reference font. A single wrong glyph makes the mark unusable, not
   just imperfect.
2. If a letter is wrong, use Nano Banana Pro's conversational editing rather
   than restarting: "keep the layout, colors, and Latin line exactly the
   same; redraw only the Cyrillic line as the three capital letters П, Р, Е."
3. If it can't get all three Cyrillic letters right after a few attempts on
   Pro, fall back to typesetting the real word with an actual openly licensed
   Cyrillic font (PT Sans, Manrope, Inter, IBM Plex Sans) instead of asking an
   image model to draw it — that is the reliable path, not a downgrade, and
   `scripts/render-brand-assets.py` is already most of the way to a script
   that could do this mechanically.

## Shared technical brief

Paste this block into every prompt, or keep it in a system/context message if
the tool supports one, so every generation stays consistent:

```
Brand colors, use exactly:
- Deep green: #10231E
- Warm cream: #F8F0DD
- Gold: #E8AD38

Style: flat, minimal geometric vector illustration for a browser-extension
toolbar icon. No gradients, no drop shadows, no glossy 3D plastic app-icon
look, no photorealism, no bevels. Bold, high-contrast, simple enough to stay
legible at 16x16 pixels. Square 1:1 composition, full-bleed background (no
transparency — output a solid background color, it will be masked/cropped
afterward).
```

## Track B — stacked Latin/Cyrillic wordmark (primary recommendation)

Same logic as Balkan Sans, different font. Use **Nano Banana Pro**, and
explicitly request 2K or 4K output — Google's model card notes small text is
often blurry at the default 1K.

**B1 — Two-line stacked wordmark**, for the icon and popup header alike.

```
Design a two-line wordmark logo. Top line: the Latin word "PRE" in bold
geometric sans-serif capitals. Bottom line, directly below and same width:
the Cyrillic word "ПРЕ" (capital letters, Cyrillic Пе-Эр-Е — П, Р, Е) in the
exact same bold geometric sans-serif style, same weight, same size. Both
lines centered, tightly stacked with a small gap between them, cream
(#F8F0DD) text on a solid deep green (#10231E) background. No decoration, no
outline effects. This is for a browser extension that converts between Latin
and Cyrillic Serbian script — the two lines should look like the same word
written twice, once per script, in matching type.
```

Correction follow-up if the Cyrillic is wrong: `The Cyrillic line has an
error. Keep the layout, colors, and Latin line exactly the same; redraw only
the second line as the three Cyrillic capital letters П, Р, Е.`

**B2 — Single-line lockup for a wider header.**

```
Design a horizontal wordmark: the Latin word "PREPISI" in bold geometric
sans-serif capitals, immediately followed by a small gold (#E8AD38) two-arrow
swap icon, followed by the Cyrillic word "ПРЕПИШИ" (capitals: П, Р, Е, П, И,
Ш, И) in the same bold sans-serif style and weight as the Latin word. Cream
(#F8F0DD) text on a solid deep green (#10231E) background, single horizontal
line, flat vector style, no decoration.
```

## Track A — symbol-only icon concepts (backup/companion; no literal text)

Lower risk since there's no text to get wrong, and reads better than any
wordmark at 16px. Use **Nano Banana 2** for fast variation, then Pro on the
winner. Generate each as its own conversation, then ask for 3–4 variations of
whichever one you like best.

**A1 — Homoglyph monogram.** Cyrillic `Р` and Latin `P` are literally the same
shape in every standard typeface — use that fact instead of asking the model
to draw two different alphabets.

```
Design a single bold letterform icon built around the capital letter "P" —
note that this exact shape is simultaneously the Latin letter P and the
Cyrillic letter Р (er), which is the point: one shape, two readings. Render
it in warm cream (#F8F0DD) centered on a solid deep green (#10231E)
background. Beneath the letter, add a small, simple two-arrow refresh/swap
icon (two curved arrows chasing each other in a loop) in gold (#E8AD38),
suggesting conversion or transformation. Keep the letterform very bold and
geometric, no serifs, no decoration. It must read clearly as a single shape
even when shrunk to the size of a small app icon.
```

**A2 — Circular conversion badge.** A safer, more conventional "sync/convert"
motif if A1 feels too abstract.

```
Design a circular badge icon: two simple curved arrows forming a closed loop
(like a refresh/sync icon), enclosing a single bold minimal letterform
abstract mark in the center. Cream (#F8F0DD) arrows and mark on a solid deep
green (#10231E) background, with a gold (#E8AD38) accent on one arrow tip.
Flat geometric vector style, bold strokes, must stay legible at 16x16 pixels.
```

## A harder idea, deliberately not pursued here

A true single-glyph ambigram — one custom shape that reads as a correct Latin
`R` in one orientation and a correct Cyrillic `П` in another (the only letter
pair in `PRE`/`ПРЕ` without a natural homoglyph) — was considered and set
aside. It isn't a documented or reliably reproducible capability of any of
these image models; it's a bespoke type-design problem that would need a
human letterer regardless of model choice. The two-row stack above already
delivers the "two scripts, one word" spirit without that risk, per the
owner's direction to keep this simple.

## After generating: promotion checklist

1. Save every export you're considering into `design/brand-concepts/` with a
   descriptive filename (see that folder's `README.md`).
2. Shrink the leading candidate to 16px (actual pixels, not just a small
   browser window) and confirm it still reads clearly — this is where most
   AI-generated icons fail.
3. For any wordmark candidate, verify all three (or seven) Cyrillic glyphs
   letter-by-letter against `ПРЕ` / `ПРЕПИШИ`.
4. Once you have a final choice, crop/flatten it onto the existing
   rounded-square + gold-footer mask (or replace that mask if the new
   composition doesn't need it — your call), export a 512px master, and
   downscale to 128/48/32/16 the same way `scripts/render-brand-assets.py`
   already does for the current icon.
5. Only then copy the final files into `assets/icons/icon-{16,32,48,128}.png`
   and `assets/wordmark.png`, replacing the Balkan Sans-derived versions, and
   update the "Balkan Sans identity" section of `ATTRIBUTIONS.md` to describe
   the new provenance instead.
