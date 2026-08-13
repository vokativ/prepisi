# Portal alias and DNS audit handoff — 2026-08-13

Status: **paused by request**. The audit produced research findings only; none of
the newly discovered hosts below has been added to `src/curated-portals.js`.
Resume from this document rather than repeating completed work.

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

### Serbia, minority, and diaspora — paused after technical sweep

All 41 families and 82 current aliases received DNS and live HTTPS/redirect
checks before the pause. `www.radiokontaktplus.org` was stale/NXDOMAIN while
the apex remained live. `srbijadanas.com` redirected through `www` to the new
official `www.sd.rs`, which needs an explicit migration decision rather than a
wildcard. Telegraf command-line DNS timed out transiently, while its official
page was independently reachable.

Promising candidates had been surfaced but the required 41-row editorial
classification was not finished. Resume by validating and assigning confidence
to:

- Blic: `sportal`, `zena`, `recepti.zena`, `blictv`.
- Nova: `grand`, `zadovoljna` (exclude `idjtv.nova.rs`, which redirects to a
  different registrable domain).
- Danas: `citymagazine`.
- Kurir: `biznis`, `stil`, `zdravlje`.
- Mondo: `lepaisrecna`, `sensa`, `smartlife`, `stvarukusa`, `yumama`.
- RTS: `oko`.
- B92: `superzena`.
- Informer: `sportinjo`.
- Prva: six channel/program hosts (`prvalife`, `plus`, `world`, `kick`, `max`,
  `files`) as medium-confidence product decisions.
- Pink: `redportal` as medium confidence.
- Gorazdevac: `radio` as medium confidence.
- Croatica Hungary: `glasnik` as high confidence; `radio` and `tv` as medium.

The partial sweep had found no additional editorial alias for the remaining
assigned families, but that conclusion must be put into an explicit 41-row table
before the audit can be called complete.

## Implementation state separate from this audit

The existing reviewed aliases are being changed to share one finite remembered
rule on every browser, which fixes the current `rts.rs` versus `www.rts.rs`
split without adding any newly discovered host. `/lat/` is a path and already
matches the same hostname pattern. Newly discovered aliases in this document
remain research candidates until the paused audit is resumed, reviewed, and
explicitly approved.
