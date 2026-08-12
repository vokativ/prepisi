# Country and demonym dialect audit

This audit answers a narrow question: which country names, citizen names, and
geographic modifiers contain an Ekavian/Ijekavian jat difference that Prepiši
should convert? It is not a general translation table between national standards.

## Method

`npm run audit:territories` compares all 264 two-letter territory entries in
Unicode CLDR 48.1.0 for Serbian Latin, Croatian, and Bosnian. Of those, 174 have
the same display name and 90 differ in some way. Most differences are vocabulary,
transcription, or naming convention—not jat—such as `Švajcarska / Švicarska`,
`Holandija / Nizozemska`, and `Španija / Španjolska`.

The complete comparison is `generated/cldr-territory-comparison.json`. Its jat
families are:

- `Nemačka / Njemačka`;
- `Belorusija / Bjelorusija`;
- `sever / sjever`, occurring in North Korea, North Macedonia, and the Northern
  Mariana Islands;
- `Devičanska / Djevičanska`, occurring in the British and U.S. Virgin Islands.

`npm run audit:countries` then reads every row in the pinned srLex 1.3 and hrLex 1.3
archives (13,333,650 rows in total), without applying the normal `PROPN`
exclusion. It selects the named candidate lemmas, groups their surface forms by
morphosyntactic description, and reports compatible or ambiguous slots in
`generated/country-demonym-audit.json`.

The seed list is `country-demonym-candidates.json`. Additions are explicit so an
ordinary spelling resemblance cannot silently convert a place name. Most country
and demonym names do not contain a varying jat reflex and need no entry.

## Current decision

| Concept | Runtime decision | Evidence |
|---|---|---|
| Germany | Include `Nemačka ↔ Njemačka` | 13 compatible srLex/hrLex slots; no ambiguous slots |
| German, male | Include `Nemac ↔ Nijemac` | 14 compatible slots; no ambiguous slots |
| German, female | Include `Nemica ↔ Njemica` with reviewed inflections | hrLex plus HJP's full `Njemica` paradigm and Columbia's explicit BCMS pairing; srLex gap remains recorded |
| German adjective | Include `nemački ↔ njemački` with reviewed inflections | Both lexicons plus HJP paradigm; competing alternative endings are mapped only as exact reviewed pairs |
| North | Include `sever ↔ sjever` and `severni ↔ sjeverni` | Both lexicons; used by three CLDR territory names |
| North Korean | Include the adjective and reviewed `Severnokorejac/Sjevernokorejka/Severnokorejci` forms | Both lexicons support the adjective; LZMK's Croatian exonym registry explicitly lists the three demonym forms |
| Belarusian adjective | Include `beloruski ↔ bjeloruski` | Both lexicons support the adjective family |
| Belarus country/demonyms | Keep review-only | Paired lexicon coverage is absent or incomplete |
| Virgin Islands | Include `devica ↔ djevica` and `devičanski ↔ djevičanski` inflections | CLDR identifies the territory-name difference; both lexicons support the noun and adjective morphology |

External cross-checks:

- Croatian Language Portal, `Nijemac`/`Njemica`: https://hjp.znanje.hr/index.php?id=eF1gXhQ%3D&show=search_by_id
- Croatian Language Portal, `Njemačka`: https://hjp.znanje.hr/index.php?id=eFxjWRE%3D&show=search_by_id
- Croatian Language Portal, `njemački`: https://hjp.znanje.hr/index.php?id=eFxjWRI%3D&show=search_by_id
- Columbia University BCMS vocabulary: https://bcs.lrc.columbia.edu/wp-content/uploads/2021/10/Lekcija-9-Rjec%CC%8Cnik_Rec%CC%8Cnik.pdf
- Unicode CLDR 48.1 release: https://cldr.unicode.org/downloads/cldr-48
- LZMK Croatian exonym registry, North Korea: https://egzonimi.lzmk.hr/?p=2376

## Known limitation

CLDR makes the territory-name claim complete for its 264 entries. The demonym
claim is still not exhaustive: srLex/hrLex are morphological lexicons, not
semantic registries, and CLDR does not supply citizen names. They can verify
paradigms for demonyms we name, but cannot discover every demonym on their own.
Expanding that part still requires a reviewed semantic seed list.
