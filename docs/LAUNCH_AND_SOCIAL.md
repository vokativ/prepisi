# Launch status, review reminders, and social posts

Last updated: 2026-08-18. Extension version: 0.9.1.
Publisher display name: `Nemanja G`. Store mailbox: `hepsesus@gmail.com`.

Promo lines below were produced by `src/converter.js`, not invented by hand.

## What we are waiting for

| Store | Submitted | Status | Typical wait | Where to check |
| --- | --- | --- | --- | --- |
| Chrome Web Store | 2026-08-17 | **Approved & Live** (published 2026-08-18) | — | [Public Store Listing](https://chromewebstore.google.com/detail/prepi%C5%A1i/lgcbhfgbbjdhglmomlgkbeikcngjhikb) |
| Firefox AMO (desktop + Android) | 2026-08-17 | Validated with 0 errors; in Mozilla signing/review | Often ~24 hours; longer if picked for manual review | Inbox and [AMO developer listing](https://addons.mozilla.org/developers/addon/prepisi-converter/) |
| Microsoft Edge Add-ons | 2026-08-17 | **In review**, public, Productivity, EN-US | Microsoft quoted **7 business days** | Inbox and [Edge overview](https://partner.microsoft.com/en-us/dashboard/microsoftedge/0575918a-bf45-4fee-9f26-f28fcdf02398/overview) |
| Apple Safari / App Store | Not submitted | Paid Developer Program postponed | After a later $99/year enrollment | [developer.apple.com/account](https://developer.apple.com/account) |

Already live for reviewers and the public repo:

- Project / support: <https://github.com/vokativ/prepisi>
- Privacy: <https://github.com/vokativ/prepisi/blob/main/PRIVACY.md>

Chrome item ID: `lgcbhfgbbjdhglmomlgkbeikcngjhikb` (Live: <https://chromewebstore.google.com/detail/prepi%C5%A1i/lgcbhfgbbjdhglmomlgkbeikcngjhikb>).
Firefox slug: `prepisi-converter`.
Edge Store ID: `0RDCK9XMTNZC`. Edge product: `0575918a-bf45-4fee-9f26-f28fcdf02398`.

## When to go look

Do not poll dashboards hourly. Check `hepsesus@gmail.com` first, including Spam
and Promotions.

1. **Around 2026-08-18 (24 hours after the Firefox submit).** Open AMO. If the
   version is signed, download that exact XPI and retest Firefox desktop plus
   Android remembered navigation before calling the signed package supported.
2. **Chrome Web Store published.** The extension is live on the Chrome Web Store.
3. **2026-08-26 (seven business days after the Edge submit).** Open Partner
   Center. If it is still "In review", wait. If published, add the public URL
   to the README and to a follow-up social post.
4. **Any rejection or "more information needed" mail.** Reply from
   `hepsesus@gmail.com` with the same reviewer note used at submit: 100%
   offline, no remote code, source at the GitHub URL above.

Safari stays postponed until there are more Apple apps to justify the annual
fee. Local Xcode and iPhone testing already passed on the free Apple ID.

## Promo graphics

RTS already has its own Latin/Cyrillic switch, so launch images do not lead
with RTS.

What each panel must show:

- **Croatian and Bosnian portals:** Latin → Cyrillic. Dialect is optional.
- **Serbian portal:** two conversions of the same N1 headline — dialect
  (Ekavian → Ijekavian) and script (Latin → Cyrillic).

| File | Size | Use |
| --- | --- | --- |
| `docs/images/badges/badge-chrome.svg` | Vector SVG | README & web store badge (Chrome) |
| `docs/images/badges/badge-firefox.svg` | Vector SVG | README & web store badge (Firefox) |
| `docs/images/badges/badge-edge.svg` | Vector SVG | README & web store badge (Edge) |
| `docs/images/store/screenshot-1-dialect-n1.png` | 1280×800 | Store Slide 1: Dialect Conversion (Ekavica ↔ Ijekavica) |
| `docs/images/store/screenshot-2-script-n1.png` | 1280×800 | Store Slide 2: Script Conversion (Latinica ↔ Ćirilica) |
| `docs/images/store/screenshot-3-script-index.png` | 1280×800 | Store Slide 3: Regional Reading & Name Protection (Index.hr) |
| `docs/images/store/screenshot-4-privacy-klix.png` | 1280×800 | Store Slide 4: Regional Coverage & 100% Privacy (Klix.ba) |
| `docs/images/live/n1-source.png` | 950×540 | N1 source, Latin/Ekavian |
| `docs/images/live/n1-dialect.png` | 950×540 | N1 after Ekavian → Ijekavian |
| `docs/images/live/n1-script.png` | 950×540 | N1 after Latinica → Ćirilica |
| `docs/images/live/index-source.png` / `index-script.png` | 1305×760 each | Index.hr source → Cyrillic pair |
| `docs/images/live/klix-source.png` / `klix-script.png` | 900×510 each | Klix.ba source → Cyrillic pair |
| `docs/images/preview-conversion.png` | 1600×2042 | README full vertical collage |
| `docs/images/social-card-1200x630.png` | 1200×630 | Compact overview only |
| `docs/images/store-promo-tile-440x280.png` | 440×280 | Chrome Web Store small promo tile |
Use the individual files as a **four-image carousel** on LinkedIn or X: N1
source → N1 Ijekavian, then Index.hr source → Index.hr Cyrillic; make Klix a
second carousel or a later post. Actual side-by-side screenshots are clearer
than an illustrated explainer on a phone.

These are actual browser screenshots made after accepting each portal's cookie
banner and applying the shipped converter. They show ordinary public portal
layout and advertising; no account UI, comments, or private content is present.

- **N1 (Srbija), dialect & script.** Article *"Polarni put svile"* (`https://n1info.rs/svet/polarni-ledeni-put-svile-rusija-kina/`).
  - Dialect: `nedeljnu liniju ... Severni morski put` → `nedjeljnu liniju ... Sjeverni morski put`.
  - Script: `Kina se priprema ...` → `Кина се припрема ...`.
- **Index.hr (Hrvatska), script.** `Taron Egerton otkrio reakciju Toma Hardyja ...` → `Тарон Егертон открио реакцију Toma Hardyja ...`.
- **Klix.ba (BiH), script.** `"Hadžićko ljeto 2026" ...` → `"Хаџићко љето 2026" ...`.

## Social drafts

Write the public post in Serbian or BCMS in your own voice. Keep paragraphs
short for phone clients. Put the GitHub link on its own line.

### Talking points

- N1, Index.hr i Klix ne pišu istim pismom. Na srpskom portalu Prepiši menja i
  izgovor (ekavica ↔ ijekavica) i pismo (latinica ↔ ćirilica). Na hrvatskom i
  bosanskom portalu prvo se vidi prelaz latinica → ćirilica.
- Radi u tabu, bez naloga, bez slanja teksta na server.
- Firefox i na Androidu, čim AMO potpiše paket.
- Otvoren kod, GPL-3.0.

### LinkedIn scaffold

```text
Čitaj kako ti odgovara.

Prepiši pretvara tekst na stranici koju već čitaš.

N1: ekavica → ijekavica, i odvojeno latinica → ćirilica
Index.hr: latinica → ćirilica
Klix.ba: latinica → ćirilica

100% offline. Nema telemetrije. GPL-3.0.

https://github.com/vokativ/prepisi
```

Attach the individual N1 source and N1 Ijekavian screenshots first; add the
Index.hr source/Cyrillic pair as the next carousel items. They remain legible
on a phone. The 1200×630 card is only a compact alternative.

### X / Twitter scaffold

```text
Prepiši: latinica ↔ ćirilica na Indexu i Klixu.
Na N1 i izgovor i pismo.

https://github.com/vokativ/prepisi
```

After the first store publishes, make a second post with that install URL. Do
not claim every browser until Chrome, Firefox, and Edge have all listed. Do
not claim Safari until the paid Apple program is enrolled.
