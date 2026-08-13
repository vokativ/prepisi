# Gemini image-generation prompts for the brand identity replacement

Companion to `research/BRAND_IDENTITY_ALTERNATIVES.md`. That note covers *why*
a replacement is needed and three strategic options; this note is the
practical prompt set for Option 2 (original artwork in the same two-script
spirit), written for Google's Gemini/Nano Banana image models. Save raw
exports to `design/brand-concepts/` — never directly into `assets/`, which
ships inside the packaged extension.

## Which model to use

As of 2026-08, Google's native image-generation family is branded **Nano
Banana**, built on Gemini image models, accessible through the Gemini app
(gemini.google.com) or Google AI Studio (aistudio.google.com):

- **Nano Banana Pro** (Gemini 3 Pro Image) — best for studio-quality control
  and precise brand consistency. Use this for the candidates you're actually
  comparing/keeping.
- **Nano Banana 2** (Gemini 3.1 Flash Image) — faster, cheaper, and
  specifically noted for more reliable text rendering than earlier models.
  Good for quick iteration, especially on the wordmark prompts below.

Both are conversational/multimodal: after a first generation you can reply
with follow-ups like "keep this composition but simplify the arrows" or
"regenerate with a slightly bolder stroke weight" instead of rewriting the
whole prompt. Every generated image carries an invisible SynthID watermark;
that doesn't affect using it as your own icon artwork.

## Read this before generating anything: text rendering is the risk

AI image models are unreliable at rendering precise custom lettering,
**especially non-Latin scripts like Cyrillic**, and especially inside a
stylized logo/icon composition rather than a plain sentence. Even models
marketed for "reliable text rendering" routinely invent, mirror, or garble
individual Cyrillic glyphs. Do not accept a generated wordmark on trust:

1. Zoom in and check every Cyrillic letter in `ПРЕ` (П, Р, Е) individually
   against a reference font. A single wrong glyph make the mark unusable, not
   just imperfect.
2. If a letter is wrong, ask Gemini to redo just the text (conversational
   follow-up: "keep the layout and colors, redraw the Cyrillic text on the
   second line exactly as ПРЕ") rather than accepting close-enough.
3. If it can't get all three Cyrillic letters right after a few attempts,
   fall back to the **Concept A** approach from
   `research/BRAND_IDENTITY_ALTERNATIVES.md`: typeset the real word with an
   actual openly licensed Cyrillic font (PT Sans, Manrope, Inter, IBM Plex
   Sans) instead of asking an image model to draw it — that is the reliable
   path, not a downgrade.

Because of this, the prompt set below is split into a **symbol-only track**
(no literal text — the reliable, lower-risk path, good for the small toolbar
icon) and a **wordmark track** (literal Latin/Cyrillic text — experimental,
verify carefully, best suited to the larger popup header where a mistake is
easier to catch and regenerate).

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

Gemini cannot output real alpha transparency; always ask for a solid
background in the brand green (`#10231E`) and remove/mask it afterward in an
image editor, matching the existing rounded-square mask that
`scripts/render-brand-assets.py` applies.

## Track A — symbol-only icon concepts (reliable; use for the 16–128px icon)

Generate each of these as its own conversation/prompt, then ask for 3–4
variations of whichever one you like best before moving to post-processing.

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

**A2 — Script-bridge / mirror motif.** No literal letters at all — a pure
symbol for "two writing systems, one meaning."

```
Design an abstract geometric icon symbolizing two different alphabets or
writing systems being the same underlying language: two simple angular
letterform-like shapes facing each other, mirrored across a vertical center
line, almost touching or overlapping slightly in the middle, like a visual
rhyme rather than actual readable letters. Cream (#F8F0DD) shapes on a solid
deep green (#10231E) background, with a thin gold (#E8AD38) line marking the
mirror axis. Flat, minimal, geometric, bold enough to read at 16 pixels.
```

**A3 — Split-glyph texture.** A single letterform built from two visibly
different construction styles, without claiming to be two different real
alphabets.

```
Design an icon of one large, bold, abstract letterform-like glyph split
vertically down the middle: the left half built from straight geometric
strokes, the right half built from slightly curved, more calligraphic
strokes, joined seamlessly into one shape — implying two different scripts
merging into one word. Cream (#F8F0DD) on solid deep green (#10231E)
background, one thin gold (#E8AD38) vertical seam marking the split. Flat
vector, no gradients, legible at small sizes.
```

**A4 — Circular conversion badge.** A safer, more conventional "sync/convert"
motif if A1–A3 feel too abstract.

```
Design a circular badge icon: two simple curved arrows forming a closed loop
(like a refresh/sync icon), enclosing a single bold minimal letterform
abstract mark in the center. Cream (#F8F0DD) arrows and mark on a solid deep
green (#10231E) background, with a gold (#E8AD38) accent on one arrow tip.
Flat geometric vector style, bold strokes, must stay legible at 16x16 pixels.
```

## Track B — wordmark concepts (experimental; verify every Cyrillic glyph)

Use these for the larger popup header/settings mark, where there's room to
read text and room to fix mistakes before shipping. Do not use an unverified
result for the small toolbar icon.

**B1 — Two-line stacked wordmark**, matching the current layout without the
Balkan Sans ambigram trick.

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

Follow-up if the Cyrillic is wrong: `The Cyrillic line has an error. Redraw
only the second line as the three Cyrillic capital letters П, Р, Е — keep
everything else (layout, colors, Latin line) exactly the same.`

**B2 — Single-line lockup for a wider header.**

```
Design a horizontal wordmark: the Latin word "PREPISI" in bold geometric
sans-serif capitals, immediately followed by a small gold (#E8AD38) two-arrow
swap icon, followed by the Cyrillic word "ПРЕПИШИ" (capitals: П, Р, Е, П, И,
Ш, И) in the same bold sans-serif style and weight as the Latin word. Cream
(#F8F0DD) text on a solid deep green (#10231E) background, single horizontal
line, flat vector style, no decoration.
```

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
