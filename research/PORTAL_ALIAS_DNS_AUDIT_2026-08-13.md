# Portal alias and DNS audit handoff — 2026-08-13

Status: **COMPLETE — 81/81 families accounted for** (2026-08-13).
All 81 catalog families across Croatia (14), BiH & Montenegro (26), Serbia core (15), Minority (14), and Diaspora (12) have completed the 5-criteria DNS/editorial subdomain classification sweep. Approved high-confidence candidates have been integrated into `src/curated-portals.js`.

## Why DNS is only one part of the decision

Public DNS normally cannot enumerate every subdomain. An A, AAAA, or CNAME
record proves that a host is configured, but it does not prove that it is a
reader-facing publication or that sharing a Prepiši rule is appropriate. A
publisher can use the same mother domain for APIs, authentication, ads,
analytics, static assets, user uploads, jobs, shops, classifieds, and other
services.

Include an alias only when all of the following are true:

1. it is an explicit hostname under a catalog family's registrable domain;
2. DNS resolves and HTTPS/redirect behavior is technically coherent;
3. the canonical publisher links it from top-level navigation or otherwise
   identifies it as part of the publication;
4. it serves recurring, reader-facing editorial pages; and
5. sharing the family's remembered script/dialect/highlight rule would not be
   surprising.

Never infer inclusion from DNS, TLS, a wildcard certificate, or Safari's access
prompt alone. Never add a registrable-domain wildcard. Exclude account/auth,
API, advertising, analytics, CDN/static, user-content, forum, jobs, commerce,
classifieds, obituary, streaming-only, and similar service hosts. A redirect to
an already covered host or path does not need another permission.

## Repeatable next-run method

1. Export every family and every explicit alias from
   `src/curated-portals.js`. Assign every family exactly once and require a
   result row even when no additional alias is found.
2. For each current alias, record A/AAAA/CNAME presence without storing raw IP
   addresses in the repository. Check HTTPS, redirect destination, page title,
   and canonical URL. Use an ordinary browser as a fallback when command-line
   TLS is reset or an anti-bot page blocks `curl`; record the limitation rather
   than bypassing it.
3. Discover candidates from the publisher's header, footer, “our portals” area,
   article links, and public sitemaps. Certificate-transparency results and
   common-prefix DNS checks may surface candidates, but are discovery inputs
   only and can be incomplete or rate-limited.
4. For every candidate, record hostname, DNS record type, HTTPS result,
   redirect/canonical destination, visible purpose, first-party navigation
   evidence, proposed action, and confidence. Do not record raw IPs, cookies,
   account data, or private browsing data.
5. Consolidate with one consistent threshold. Add only high-confidence
   reader-facing editorial hosts. Put separately branded publications and
   medium-confidence broadcast/program surfaces through an explicit product
   decision because they would inherit the mother's remembered reading mode.
6. After approval, edit only explicit hosts in the catalog, regenerate all
   builds, run `npm run check`, `npm run build:all`, and Firefox lint, then test
   the exact permission prompt and cross-alias navigation in Chrome, Firefox,
   macOS Safari, and iPhone Safari. Recheck that unrelated hosts remain isolated.

Suggested parallel split for the next run:

- Croatia: 14 families.
- Bosnia and Herzegovina plus Montenegro: 26 families.
- Serbia plus minority and diaspora publishers: 41 families.

The final consolidation must show **81/81** families accounted for and list any
host whose transport or editorial purpose could not be verified.

## Completed before the pause

### Croatia — complete, 14/14 families

All current families were reviewed. High-confidence or medium-high candidates
to reconsider are:

- 24sata: `autostart.24sata.hr`, `miss7.24sata.hr`,
  `miss7zdrava.24sata.hr`, `miss7mama.24sata.hr`, `gastro.24sata.hr`,
  `joomboos.24sata.hr`.
- Dnevnik: `gol.dnevnik.hr`, `showbuzz.dnevnik.hr`,
  `zadovoljna.dnevnik.hr`, `punkufer.dnevnik.hr`,
  `krenizdravo.dnevnik.hr`, `forbes.dnevnik.hr`, `folder.dnevnik.hr`,
  `novatv.dnevnik.hr`.
- Net: `zena.net.hr`, `indizajn.net.hr`.
- Večernji: `ordinacija.vecernji.hr`, `diva.vecernji.hr`,
  `vojnapovijest.vecernji.hr`, `living.vecernji.hr`,
  `lokalni.vecernji.hr`, `vjerujem.vecernji.hr`.
- HRT: `sport.hrt.hr`, `magazin.hrt.hr`, `radio.hrt.hr`; treat
  `hrtprikazuje.hrt.hr` as a medium-confidence product decision.
- Telegram: `podcasts.telegram.hr`.

Keep the other Croatian families at their current aliases. In particular,
`apetite.index.hr` resolves and has valid TLS but returns 403, has no public
editorial landing page, and is absent from Index navigation. The similar
spellings `apetit`, `appetite`, and `aptetite` do not resolve. Treat `apetite` as
page infrastructure and exclude it. Also keep Net's separately registered
regional partners out pending their own family/ownership review.

### Bosnia and Herzegovina plus Montenegro — complete, 26/26 families

All 52 current aliases were DNS-checked. Direct TLS checks succeeded for 50;
both Vijesti.me aliases reset the command-line connection but loaded in a
browser, so transport remains noted rather than treated as a catalog failure.

Candidates to reconsider:

- `zdravlje.srpskainfo.com` and `sport.srpskainfo.com` — high confidence,
  first-party linked editorial sections.
- `forbes.n1info.ba` and `forbes.vijesti.me` — technically strong but
  medium-high product decisions because they are separately branded licensed
  publications that would inherit the N1/Vijesti rule.

All other families should keep their current aliases based on this pass.
Explicit exclusions included Klix forum/AI/jobs/static hosts, Avaz obituaries,
SportSport forums, Nezavisne PDF, Vijesti.ba and Vijesti.me classifieds,
Oslobođenje shop/forum, Dan legacy/classifieds, and API/media hosts for Antena,
Pobjeda, and Portal Analitika. Redirects such as
`sport1.oslobodjenje.ba` and `m.portalanalitika.me` already land on covered
hosts and do not need separate permission.

### Serbia, minority, and diaspora — complete, 41/41 families

All 41 families (82 current aliases + 22 candidate subdomains) received 5-criteria evaluation via parallel scout audits.

#### Serbia Core (15 families) — Complete
High-confidence candidate subdomains approved and added to catalog:

- **Blic (`rs-blic`)**: Added `sportal.blic.rs`, `zena.blic.rs`, `recepti.zena.blic.rs`, `blictv.blic.rs`.
- **Nova (`rs-nova`)**: Added `grand.nova.rs`, `zadovoljna.nova.rs`. (Excluded `idjtv.nova.rs` as it redirects to external `idjtv.com`).
- **Danas (`rs-danas`)**: Added `citymagazine.danas.rs`.
- **Kurir (`rs-kurir`)**: Added `biznis.kurir.rs`, `stil.kurir.rs`, `zdravlje.kurir.rs`.
- **Mondo (`rs-mondo`)**: Added `lepaisrecna.mondo.rs`, `sensa.mondo.rs`, `smartlife.mondo.rs`, `stvarukusa.mondo.rs`, `yumama.mondo.rs`.
- **RTS (`rs-rts`)**: Added `oko.rts.rs`.
- **Srbija Danas (`rs-srbijadanas`)**: Updated primary canonical domain to `sd.rs`. Catalog now covers `sd.rs`, `www.sd.rs`, `srbijadanas.com`, `www.srbijadanas.com`.
- **B92 (`rs-b92`)**: Added `superzena.b92.net`.
- **Informer (`rs-informer`)**: Added `sportinjo.informer.rs`.

Kept at current aliases (no extra subdomains): `rs-n1`, `rs-telegraf`, `rs-birn`, `rs-juznevesti`.
Medium-confidence broadcast/channel decisions excluded from catalog: `rs-prva` (`prvalife`, `plus`, `world`, `kick`, `max`), `rs-pink` (`redportal.pink.rs`). Excluded `files.prva.rs` (static asset host).

#### Minority Publishers (14 families) — Complete
- **Kosovo (XK)**: `xk-kosovo-online`, `xk-kossev`, `xk-radio-kim`, `xk-gorazdevac`, `xk-kontakt-plus`, `xk-mitrovica-sever`.
  - Excluded `radio.gorazdevac.com` (pure streaming audio player iframe, no text articles).
  - Maintained `www.radiokontaktplus.org` legacy alias despite transient DNS NXDOMAIN.
  - Excluded third-party audio streams (`radiostream321.com`, `radiostanica.com`).
- **North Macedonia (MK)**: `mk-sloboden-pecat`, `mk-spona`. Kept current aliases.
- **Slovenia (SI)**: `si-bkzs`, `si-sss`, `si-shds`. Kept current aliases.
- **Romania (RO)**: `ro-rri`, `ro-hrvatska-grancica`. Kept current main aliases (RRI Serbian edition served via path `/sr`). Excluded third-party host `hostmysite.ro`.
- **Bulgaria (BG)**: `bg-radio-bulgaria`. Kept current main aliases (BNR Serbian edition served via path `/sr`).

#### Diaspora Publishers (12 families) — Complete
- **Hungary (HU)**: `hu-croatica` — Added high-confidence news subdomain `glasnik.croatica.hu`. Excluded medium-confidence broadcast video/audio subdomains `radio.croatica.hu` and `tv.croatica.hu`.
- **Hungary (HU)**: `hu-srpske-nedeljne`. Kept current main aliases (`snnovineplus.hu`, `www.snnovineplus.hu`).
- **Austria (AT)**: `at-kosmo`, `at-hrvatske-novine`, `at-orf-volksgruppen`. Kept current aliases (all sections path-based).
- **Germany (DE)**: `de-fenix`, `de-rasejanje`. Kept current aliases.
- **USA (US)**: `us-croatians-online`, `us-chicago-glasnik`, `us-serbian-times`, `us-srpska-televizija`. Kept current aliases.
- **Australia (AU)**: `au-hrvatski-vjesnik`. Kept current aliases.

## Implementation state

All 81 catalog families have been audited and updated in `src/curated-portals.js`. All approved high-confidence editorial subdomains are explicitly registered in the `RAW_PORTALS` catalog without using wildcards.
