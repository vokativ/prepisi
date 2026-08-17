# Launch status, review reminders, and social posts

Last updated: 2026-08-17. Extension version: 0.9.1.
Publisher display name: `Nemanja G`. Store mailbox: `hepsesus@gmail.com`.

Promo lines below were produced by `src/converter.js`, not invented by hand.

## What we are waiting for

| Store | Submitted | Status | Typical wait | Where to check |
| --- | --- | --- | --- | --- |
| Chrome Web Store | 2026-08-17 | **Pending review**, auto-publish after approval | Days to a few weeks | `hepsesus@gmail.com` and the [item status page](https://chrome.google.com/webstore/devconsole/e2337773-4e37-4a9e-bfa7-ee518efec7f0/lgcbhfgbbjdhglmomlgkbeikcngjhikb/edit/status) |
| Firefox AMO (desktop + Android) | 2026-08-17 | Validated with 0 errors; in Mozilla signing/review | Often ~24 hours; longer if picked for manual review | Inbox and [AMO developer listing](https://addons.mozilla.org/developers/addon/prepisi-converter/) |
| Microsoft Edge Add-ons | 2026-08-17 | **In review**, public, Productivity, EN-US | Microsoft quoted **7 business days** | Inbox and [Edge overview](https://partner.microsoft.com/en-us/dashboard/microsoftedge/0575918a-bf45-4fee-9f26-f28fcdf02398/overview) |
| Apple Safari / App Store | Not submitted | Paid Developer Program postponed | After a later $99/year enrollment | [developer.apple.com/account](https://developer.apple.com/account) |

Already live for reviewers and the public repo:

- Project / support: <https://github.com/vokativ/prepisi>
- Privacy: <https://github.com/vokativ/prepisi/blob/main/PRIVACY.md>

Chrome item ID: `lgcbhfgbbjdhglmomlgkbeikcngjhikb`. Firefox slug: `prepisi-converter`.
Edge Store ID: `0RDCK9XMTNZC`. Edge product: `0575918a-bf45-4fee-9f26-f28fcdf02398`.
Store install URLs appear only after each review finishes.

## When to go look

Do not poll dashboards hourly. Check `hepsesus@gmail.com` first, including Spam
and Promotions.

1. **Around 2026-08-18 (24 hours after the Firefox submit).** Open AMO. If the
   version is signed, download that exact XPI and retest Firefox desktop plus
   Android remembered navigation before calling the signed package supported.
2. **2026-08-24, then weekly.** Open the Chrome status page. Chrome can take
   multiple weeks. The listing is set to publish automatically after approval.
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
| `docs/images/preview-three-portals.png` | 1200×1760 | README and mobile posts (four stacked cards) |
| `docs/images/preview-conversion.png` | same stacked card | README hero |
| `docs/images/social-card-1200x630.png` | 1200×630 | LinkedIn and X attachment (2×2) |

Verified copy, 2026-08-17:

- **N1, dialect.** `Zamenik načelnika kaže da će u Deliblatskoj peščari najveći problem biti vetar promenljivog pravca.` → `Zamjenik načelnika kaže da će u Deliblatskoj pješčari najveći problem biti vjetar promjenljivog pravca.` Pinned in `test/converter.test.js`.
- **N1, script.** Same source → `Заменик начелника каже да ће у Делиблатској пешчари највећи проблем бити ветар променљивог правца.`
- **Index.hr, script.** Frozen fixture in `test/fixtures/portal-samples.json`.
- **Klix.ba, script.** Same fixture file; Latin → Cyrillic.

Do not attach live page captures that include private UI, account chrome, or
comment threads.

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

Attach `docs/images/social-card-1200x630.png`. On a phone, the taller
`docs/images/preview-three-portals.png` is easier to read.

### X / Twitter scaffold

```text
Prepiši: latinica ↔ ćirilica na Indexu i Klixu.
Na N1 i izgovor i pismo.

https://github.com/vokativ/prepisi
```

After the first store publishes, make a second post with that install URL. Do
not claim every browser until Chrome, Firefox, and Edge have all listed. Do
not claim Safari until the paid Apple program is enrolled.
