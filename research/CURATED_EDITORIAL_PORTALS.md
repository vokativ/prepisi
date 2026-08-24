# Curated editorial portal snapshot

Review dates: **2026-08-13** (national/minority/diaspora news), **2026-08-24**
(IT/technology specialist press, sport, betting-linked sports press, and
user-directed outreach-site additions; see below).

The exhaustive 81-family DNS/editorial-alias refresh was completed on 2026-08-13. Its full regional findings, candidate subdomains, and 5-criteria evaluation method are recorded in
[`PORTAL_ALIAS_DNS_AUDIT_2026-08-13.md`](PORTAL_ALIAS_DNS_AUDIT_2026-08-13.md), and all approved subdomains have been integrated into [`src/curated-portals.js`](../src/curated-portals.js).

All browser builds use one catalog to group remembered rules across finite,
reviewed editorial aliases. Firefox desktop and Android additionally predeclare
the catalog as host permissions for their shared event-page package. The catalog
currently contains **125 portal families**: 78 national publishers in
Serbia, Croatia, Bosnia and Herzegovina, and Montenegro (55 general news +
15 IT/technology specialist press + 8 sports specialist press); 5
betting-linked sports editorial publishers; 18 minority publishers; 8 diaspora
publishers; and 16 exact, user-directed outreach-site families.
The executable, alias-level source of truth is
[`src/curated-portals.js`](../src/curated-portals.js).

This is a popularity-informed curated snapshot, not a claim that these are the
objectively "best" publishers. The research began with country top-100 and
news-category rankings, then retained active original editorial publishers and
broadcasters. The reviewed cap (`test/site-persistence.test.js`, currently
70-125 families) is a sanity ceiling, not a quota to fill.

## Inclusion policy

Include an active publisher that produces recurring news, analysis, magazine,
broadcast, or specialist editorial material in Serbian, Croatian, Bosnian, or
Montenegrin. Editorial viewpoint is not a criterion and inclusion is not an
endorsement.

**Betting-linked sports-publication exception (2026-08-24):** A betting
operator's separately hosted, recurring sports-news publication can enter the
distinct `commercial` tier when its selected hosts are reader-facing editorial
surfaces. This narrow exception does not admit a wagering product itself or
express endorsement. Betting, odds, live-play, account, payment, affiliate,
API, advertising, CDN/static, and wildcard hosts remain absent, even when
linked from a reviewed publication.

**User-directed outreach-site exception (2026-08-24):** Include the exact own
website of an entity explicitly named in
[`docs/LAUNCH_AND_SOCIAL.md`](../docs/LAUNCH_AND_SOCIAL.md), even when it is an
academic, cultural, civil-society, or Wikimedia institution rather than an
editorial publisher. These entries use the distinct `outreach` tier. This is
not a general institutional-site expansion or an endorsement. The three
language-project Wikipedia subdomains are an explicit, narrow exception: they
are community-editable, but are the exact sites of the named Wikipedia
communities. No broad `wikipedia.org` or other user-content host is included.

The exception does not include a social network, Discord, Reddit, Google Group,
mailing list, broad parent domain, wildcard, ad, API, authentication, analytics,
CDN/static-asset, or unrelated user-content host merely because the outreach
entity uses it. Every host must still be exact and must serve the entity's
top-level reading surface or be its canonical redirect destination.

**Permission effect:** The 16 `outreach` families contain 23 hosts. Firefox
generates 46 HTTP/HTTPS install-time permission patterns from them; source
v0.9.3 generates 566 patterns across the entire catalog, not 566 distinct
sites. Firefox is technically authorized on matched pages, but Prepiši makes no
browsing-time network request and injects only after a local remembered rule
exists. Chrome, Edge, and Safari request a matching host only when the user
chooses **Remember on this site**.

## Core national publishers

Serbia (24):

```text
n1info.rs              blic.rs              telegraf.rs
nova.rs                birn.rs              danas.rs
kurir.rs               mondo.rs             rts.rs
srbijadanas.com        juznevesti.com       b92.net
informer.rs            prva.rs              pink.rs
sportske.net           sportklub.n1info.rs  zurnal.politika.rs
startit.rs             sk.rs                buffgaming.rs
itnetwork.rs           sajbersfera.in.rs    netokracija.rs
```

Croatia (24):

```text
index.hr               24sata.hr            dnevnik.hr
jutarnji.hr            net.hr               tportal.hr
vecernji.hr            hrt.hr               dnevno.hr
rtl.hr                 telegram.hr          slobodnadalmacija.hr
direktno.hr            n1info.hr            sportklub.n1info.hr
sportnet.hr            netokracija.com      bug.hr
pcchip.hr              vidi.hr              hcl.hr
pcekspert.com          mob.hr               ictbusiness.info
```

Bosnia and Herzegovina (15):

```text
klix.ba                avaz.ba              sportsport.ba
reprezentacija.ba      srpskainfo.com       nezavisne.com
vijesti.ba             hercegovina.info     n1info.ba
slobodna-bosna.ba      oslobodjenje.ba       vecernji.ba
radiosarajevo.ba       bljesak.info          itportal.ba
```

Montenegro (15):

```text
vijesti.me             cdm.me               dan.co.me
antenam.net            pobjeda.me           in4s.net
borba.me               rtcg.me              standard.co.me
portalanalitika.me     aktuelno.me          mondo.me
kolektiv.me            cgsport.me           sportski.me
```

### IT/technology specialist press addition (2026-08-24)

These fifteen active specialist publications were separately researched for the
0.9.3 catalog update. Each retained host served a top-level editorial surface
or its canonical redirect under a desktop browser user-agent; every `www`
alias below was directly checked. No wildcard, account, ad, asset, or
third-party host was added. The catalog's canonical host is apex-form for
consistent lookup; it is not a claim that the apex is the publisher's preferred
redirect target.

| Market | Publisher | Catalog hosts | Editorial evidence |
| --- | --- | --- | --- |
| RS | Startit | `startit.rs`, `www.startit.rs` | Multiple independent Serbian articles on 18, 17, 16, 14, 12, 11, and 10 August 2026, including named interview/reporting pieces. |
| RS | Svet Kompjutera | `sk.rs`, `www.sk.rs` | The requested publisher's current domain is `sk.rs`, not `svet-kompjutera.com`; bylined review `Soundcore Boom 3i` (22 August 2026), further review (16 July), and August issue (1 August). |
| RS | BuffGaming | `buffgaming.rs`, `www.buffgaming.rs` | Serbian gaming news and original-review publication; named `Blue Lock Live-Action` review (14 August) plus reviews/news from 13–21 August 2026. |
| HR | Netokracija | `netokracija.com`, `www.netokracija.com` | Official page declares Croatian (`inLanguage: hr`) and shows independently bylined articles on 21, 20, 19, 18, 17, 14, and 13 August 2026. |
| HR | BUG / Mreža | `bug.hr`, `www.bug.hr`, `mreza.bug.hr` | BUG declares daily ICT news, analysis, video, commentary, and reviews; direct home-page entries are bylined 18 and 17 August. Mreža is its separately branded ICT-professional editorial surface with direct August 2026 article entries. |
| HR | PC CHIP | `pcchip.hr`, `www.pcchip.hr` | Croatian bylined consumer-tech coverage on 23 August 2026, alongside fresh hardware and AI articles on 18 August. |
| HR | VIDI | `vidi.hr`, `www.vidi.hr` | Croatian technology publication with recurring dated articles on 21 August 2026 and a current computer-coverage list. |
| HR | HCL | `hcl.hr`, `www.hcl.hr` | Croatian gaming-news/review publisher; its home page carried the dated recurring series `Vikend je – što igrate?` on 23 August 2026 alongside daily news/reviews. |
| HR | PC Ekspert | `pcekspert.com`, `www.pcekspert.com` | Croatian hardware-review publication; current `Gigabyte Aorus GeForce RTX 5070 Ti` review and `Intel Core Ultra 7` review dated 6 August 2026. `.com` does not change its Croatian editorial language. |
| HR | Mob.hr | `mob.hr` | Croatian mobile-technology publisher with authored entries dated 17, 14, and 13 August 2026. `www.mob.hr` returned HTTP 403 and is intentionally absent. |
| BA | IT Portal | `itportal.ba`, `www.itportal.ba` | Bosnia-targeted publication with dated advice/review coverage on 12 August 2026. Its own HTML and JSON-LD explicitly declare Croatian (`lang` / `inLanguage: hr`), so the catalog records `HR`, not an inferred Bosnian locale. |

Browser CDP audit resolved four prior reader/WAF deferrals:

| Market | Publisher | Catalog hosts | Live-browser evidence |
| --- | --- | --- | --- |
| RS | ITNetwork | `itnetwork.rs`, `www.itnetwork.rs` | Local Chrome loaded the live Serbian multi-section portal; apex canonicalized to `www`; reviews/news dated 20–23 August 2026 spanned Hardware, AI, Games, and Business. |
| RS | Sajber Sfera | `sajbersfera.in.rs` | Cloudflare completed in the real browser after ten seconds; named author Mihailo Ivanjac and security, hardware, AI, software, and gaming articles were dated 11–22 August 2026. `www` remains unverified and is absent. |
| RS | Netokracija Srbija | `netokracija.rs`, `www.netokracija.rs` | Local Chrome loaded apex → `www`; live Serbian digital/technology reporting names Marko Crnjanski, Anastasija Uspenski, Matija Jovanović, and Aleksandra Čvorović. |
| HR | ICT Business | `ictbusiness.info`, `www.ictbusiness.info` | Local Chrome loaded active Croatian ICT reporting, named interviews, own ICTbusiness TV coverage, and business/telecom/Internet sections; prior direct checks showed apex → `www`. |

`benchmark.rs` remains deferred: even the local Chrome agent reached a
Cloudflare “Sorry, you have been blocked” page, with no readable editorial
content. `portalanalitika.me` was already in the catalog and is not a second
family. `pcpress.rs` is retained in the separate user-directed `outreach` tier:
the local Chrome agent completed its challenge and showed current, bylined
Serbian Business & ICT News on 21 August 2026; stale `pc.pcpress.rs` remains
excluded.

### Sports and betting-linked sports press addition (2026-08-24)

The eight `core` families below are dedicated, active regional sports
publications. The five `commercial` families are separate reader-facing sports
publications operated in betting ecosystems; the catalog does not include their
wagering products. Each exact host was checked for current editorial use and
canonical behavior. Redirect-only `www` aliases are intentionally absent.
`sportklub.n1info.com` is not an alias: DNS returned NXDOMAIN. The active,
market-specific Sport Klub surfaces are separate portal families so an N1
remembered rule does not unexpectedly apply to them.

| Tier | Market | Publisher | Exact catalog hosts | Verification boundary |
| --- | --- | --- | --- | --- |
| `core` | RS | Sportske.net | `sportske.net` | Active Serbian multi-sport reporting; `www` redirects to apex. |
| `core` | RS | Sport Klub | `sportklub.n1info.rs` | Active Serbian editorial surface; direct fetch is protected, while indexed official section/imprint pages establish the host. `sportklub.rs` redirects here and the nonexistent `.com` host is excluded. |
| `core` | RS | Sportski žurnal | `zurnal.politika.rs` | Active sports-publication canonical host; legacy `zurnal.rs` redirects and is omitted. |
| `core` | HR | Sport Klub | `sportklub.n1info.hr` | Active Croatian editorial surface; direct fetch is protected, and current indexed official pages establish the host. |
| `core` | HR | Sportnet | `sportnet.hr` | Active Croatian multi-sport reporting; `www` redirects to apex. |
| `core` | BA | Reprezentacija.ba | `reprezentacija.ba` | Active Bosnian football and national-team editorial reporting; `www` redirects to apex. |
| `core` | ME | CG Sport | `cgsport.me` | Active Montenegrin multi-sport editorial reporting; `www` redirects to apex. |
| `core` | ME | Sportski.me | `sportski.me` | Active Montenegrin multi-sport editorial reporting; `www` redirects to apex. |
| `commercial` | RS | Mozzart Sport | `mozzartsport.com`, `www.mozzartsport.com` | Separate Serbian sports publication; no Mozzart betting, account, or payment host. |
| `commercial` | RS | Meridian Sport | `meridiansport.rs` | Separate Serbian sports publication; protected direct fetch, indexed official editorial pages; no Meridian betting host. |
| `commercial` | HR | Germanijak | `germanijak.hr`, `www.germanijak.hr` | Both serve the editorial surface; `www` is the declared canonical host. Germania wagering hosts are excluded. |
| `commercial` | BA | Meridian Sport | `meridiansport.ba` | Separate Bosnian sports publication; its wagering link leaves the host and is excluded. |
| `commercial` | ME | Meridian Sport | `meridiansport.me` | Separate Montenegrin sports publication; its wagering link leaves the host and is excluded. |

### User-directed outreach-site addition (2026-08-24)

The outreach plan named these entities. Their own sites are intentionally in
the catalog so that a user can apply and remember Prepiši there; the list does
not imply that any entity endorses the extension. It adds 16 families / 23
hosts, or 46 Firefox HTTP/HTTPS host-permission patterns. Reddit, Discord,
Google Groups, and the CLASSLA mailing list remain absent because they are
social/shared platforms rather than the entity's own site.

| Outreach entity | Exact catalog hosts | Verification boundary |
| --- | --- | --- |
| Wikimedia Serbia | `wikimedia.rs` | `www` has a TLS name mismatch; omitted. |
| Serbian, Croatian, Bosnian Wikipedia | `sr.wikipedia.org`; `hr.wikipedia.org`; `bs.wikipedia.org` | Language-project hosts only; no broad `wikipedia.org`, no Discord host. |
| CLASSLA / CLARIN.SI | `clarin.si`, `www.clarin.si` | Apex redirects to the verified `www` site; no `mailman.ijs.si` or Discord. |
| SIGSLAV; SlavNLP/BSNLP | `sigslav.cs.helsinki.fi`; `bsnlp.cs.helsinki.fi` | Narrow program/workshop subdomains only; no parent Helsinki host. |
| FFZG NLP section; AIRI | `inf.ffzg.unizg.hr`; `airi.uniri.hr`, `www.airi.uniri.hr` | Narrow department/lab hosts only; no parent university hosts. |
| SHARE Foundation | `sharefoundation.info`, `www.sharefoundation.info` | `www` canonically redirects to apex. |
| Institut za srpski jezik SANU | `www.isj.sanu.ac.rs` | The official `www` host was verified; apex timed out and is omitted. |
| Matica srpska | `maticasrpska.org.rs`, `www.maticasrpska.org.rs` | Both exact aliases serve the institution. |
| FCJK | `fcjk.ac.me` | The entity's named own host is retained; its TLS certificate was invalid at review time, so `www` is omitted. |
| Udruženje „Dobrica Erić“ | `cirilica-beograd.rs`, `www.cirilica-beograd.rs` | Both exact aliases serve the association. |
| PC Press | `pcpress.rs`, `www.pcpress.rs` | Local Chrome completed its challenge and showed current bylined news; stale `pc.pcpress.rs` is explicitly excluded. |
| NSPM | `nspm.rs`, `www.nspm.rs` | Both aliases resolve; a January 2026 editorial article was read directly. |

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
