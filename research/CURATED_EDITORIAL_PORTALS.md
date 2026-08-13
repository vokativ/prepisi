# Curated editorial portal snapshot

Review date: **2026-08-13**

The exhaustive 81-family DNS/editorial-alias refresh was completed on 2026-08-13. Its full regional findings, candidate subdomains, and 5-criteria evaluation method are recorded in
[`PORTAL_ALIAS_DNS_AUDIT_2026-08-13.md`](PORTAL_ALIAS_DNS_AUDIT_2026-08-13.md), and all approved subdomains have been integrated into [`src/curated-portals.js`](../src/curated-portals.js).

All browser builds use one catalog to group remembered rules across finite,
reviewed editorial aliases. Firefox desktop and Android additionally predeclare
the catalog as host permissions for their shared event-page package. The catalog
currently contains **81 portal families**: 55 national publishers in
Serbia, Croatia, Bosnia and Herzegovina, and Montenegro; 18 minority publishers;
and 8 diaspora publishers. The executable, alias-level source of truth is
[`src/curated-portals.js`](../src/curated-portals.js).

This is a popularity-informed curated snapshot, not a claim that these are the
81 objectively “best” publishers. The research began with country top-100 and
news-category rankings, then retained active original editorial publishers and
broadcasters. The number 100 was a research ceiling, not a quota to fill.

## Inclusion policy

Include an active publisher that produces recurring news, analysis, magazine,
broadcast, or specialist editorial material in Serbian, Croatian, Bosnian, or
Montenegrin. Editorial viewpoint is not a criterion and inclusion is not an
endorsement.

Exclude social media, forums and community-only sites, search, webmail,
collaboration and cloud tools, ecommerce, classifieds, betting, score and weather
services, government utilities, pure link aggregators, automatically copied news,
inactive publishers, and login-only products. Never grant a country-TLD wildcard
or a multi-tenant host. Also exclude API, authentication, advertising, analytics,
CDN/static-asset, and user-content hosts even when their DNS records or Safari's
website-access UI associate them with a portal page. Host aliases are enumerated
explicitly in the catalog and must serve top-level editorial reading pages or be
their canonical redirect destination.

## Core national publishers

Serbia (15):

```text
n1info.rs              blic.rs              telegraf.rs
nova.rs                birn.rs              danas.rs
kurir.rs               mondo.rs             rts.rs
srbijadanas.com        juznevesti.com       b92.net
informer.rs            prva.rs              pink.rs
```

Croatia (14):

```text
index.hr               24sata.hr            dnevnik.hr
jutarnji.hr            net.hr               tportal.hr
vecernji.hr            hrt.hr               dnevno.hr
rtl.hr                 telegram.hr          slobodnadalmacija.hr
direktno.hr            n1info.hr
```

Bosnia and Herzegovina (13):

```text
klix.ba                avaz.ba              sportsport.ba
srpskainfo.com         nezavisne.com        vijesti.ba
hercegovina.info       n1info.ba            slobodna-bosna.ba
oslobodjenje.ba        vecernji.ba          radiosarajevo.ba
bljesak.info
```

Montenegro (13):

```text
vijesti.me             cdm.me               dan.co.me
antenam.net            pobjeda.me           in4s.net
borba.me               rtcg.me              standard.co.me
portalanalitika.me     aktuelno.me          mondo.me
kolektiv.me
```

## Minority and diaspora publishers

Kosovo (Serbian):

```text
kosovo-online.com      kossev.info          radiokim.net
gorazdevac.com         radiokontaktplus.org radiomitrovicasever.com
```

North Macedonia, Slovenia, Romania, Bulgaria, and Hungary:

```text
slobodenpecat.mk       srbi.org.mk          bkzs.si
sss-zss.si             shds.si              rri.ro
zhr-ucr.ro             bnrnews.bg           snnovineplus.hu
croatica.hu
```

Austria, Germany/DACH, USA, and Australia:

```text
kosmo.at               hrvatskenovine.at    volksgruppen.orf.at
fenix-magazin.de       rasejanje.info       croatiansonline.com
chicagoglasnik.com     serbiantimes.info    srpskatelevizija.com
vjesnik.com.au
```

No UK-specific publisher met the current-language, activity, and original
editorial bar. No Latin American host qualified: the current Croatia-focused
publishers found there primarily publish in Spanish or Portuguese. This is a
documented empty result, not a reason to add marginal domains. Australia’s SBS
has strong current Bosnian, Croatian, and Serbian sections, but `sbs.com.au` is a
large predominantly English host; WebExtension host permissions cannot be
limited to `/language/...`, so it is deliberately excluded. `vjesnik.com.au` is
the sole confident Australian inclusion. `srpskiglas.com.au` and `domovina.info`
remain candidates pending proof of a current regular web publishing cadence.

## Evidence and method

- [Similarweb Serbia all-sites ranking](https://www.similarweb.com/top-websites/serbia/),
  [Serbia News & Media](https://www.similarweb.com/top-websites/serbia/news-and-media/),
  and [Croatia all-sites ranking](https://www.similarweb.com/top-websites/croatia/)
  were checked for July 2026. Similarweb describes these as estimated traffic
  rankings based on unique visitors and page views.
- Reuters Institute Digital News Report 2026 weekly-use charts supplied the
  national news-brand shortlists for [Serbia](https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2026/serbia)
  and [Croatia](https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2026/croatia).
  Those figures are survey-recalled weekly brand use, not web market share.
- July 2026 Ahrefs country top-100 snapshots supported discovery in
  [Bosnia and Herzegovina](https://ahrefstop.com/websites/bosnia-and-herzegovina)
  and [Montenegro](https://ahrefstop.com/websites/montenegro). They estimate
  organic search visits, not total audience.
- Independent cross-checks included Bosnia’s [Media Ownership Monitor](https://bosnia-herzegovina.mom-gmr.org/en/findings/findings/)
  and Montenegro’s [2025 regulator/Ipsos audience study](https://amu.me/wp-content/uploads/2025/12/Saopstenje-AMU-predstavio-istrazivanje-o-povjerenju-u-programe-crnogorskih-emitera.pdf).
- Minority and diaspora sites were individually checked for language, editorial
  character, and recent activity. Strong institutional corroboration included
  the [European Endowment for Democracy profile of Radio KIM](https://democracyendowment.eu/stories/radio-kim),
  [Croatian government diaspora profiles](https://hrvatiizvanrh.gov.hr/croats-abroad/2464),
  and the [Australian multicultural-media participant list](https://www.infrastructure.gov.au/sites/default/files/documents/nmap-independent-multicultural-media-australia-imma.pdf).

Rankings and publisher activity change. Review the catalog before every release
that changes Firefox hosts, record the date, and retest aliases. New host access
in an extension update may not receive the same user-facing prompt as first
installation, so catalog changes require explicit release and privacy review.

## Runtime and privacy effect

Every build uses the catalog to describe an opted-in portal as a finite set of
explicit aliases; Chrome, Edge, and Safari request those aliases only when the
user enables site memory. Unknown sites remain exact-host. Only Firefox receives
the catalog as a generated MV3 `host_permissions` list. Its non-persistent
background event page synchronously registers a filtered
`webNavigation.onCompleted` listener, checks the local remembered-rule map, and
uses `scripting.executeScript()` only when a rule and permission are present.
This follows Mozilla's documented MV3 event-page model: top-level listeners are
persisted and wake the page after suspension. It also leaves the roughly 250 KiB
offline conversion stack unloaded on catalog pages that have not been remembered.

The catalog is the single source for both Firefox manifest permission patterns
and cross-browser portal-family aliases. Remembering a curated portal applies
only to its explicitly listed editorial hosts; non-catalog sites remain
exact-host opt-ins. Chromium, Edge, and Safari receive neither static catalog
permissions nor the Firefox navigation listener.

Two simpler manifest-only variants were tested first on Android: static
`content_scripts.matches` by itself, and the same matches combined with explicit
`host_permissions`. Neither automatically converted the next RTS document in the
temporary-install session. The final event-page design therefore needs its own
Firefox desktop and signed-Android validation rather than relying on manifest
declarations alone. Its unsigned temporary Android retest also left a newly opened
RTS Latin homepage unchanged despite a retained remembered Cyrillic rule; see the
dated device-test report. The design remains the official MV3 candidate, not a
verified Android durability fix.

Architecture references: Mozilla's
[Background scripts](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Background_scripts),
[MV3 migration guide](https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/),
[`webNavigation`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webNavigation),
and [`scripting.executeScript()`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/executeScript).
Bypass Paywalls Clean was also reviewed as a real-world host-catalog example, but
its Firefox injector is MV2 (`background.scripts`, `tabs.onUpdated`, and
`tabs.executeScript`) and was not copied as the MV3 lifecycle design.
