(function exposeCuratedPortals(global) {
  "use strict";

  if (global.PrepisiCuratedPortals) return;

  // Firefox predeclares these hosts; every browser uses the same reviewed alias
  // families when the user opts into site memory. Keep aliases explicit: a
  // registrable-domain wildcard could cover unrelated account, ad, or
  // user-content subdomains.
  const RAW_PORTALS = [
    ["rs-n1", "n1info.rs", ["n1info.rs", "www.n1info.rs"], "core", ["RS"], ["sr"]],
    ["rs-blic", "blic.rs", ["blic.rs", "www.blic.rs", "sportal.blic.rs", "zena.blic.rs", "recepti.zena.blic.rs", "blictv.blic.rs"], "core", ["RS"], ["sr"]],
    ["rs-telegraf", "telegraf.rs", ["telegraf.rs", "www.telegraf.rs"], "core", ["RS"], ["sr"]],
    ["rs-nova", "nova.rs", ["nova.rs", "www.nova.rs", "radar.nova.rs", "grand.nova.rs", "zadovoljna.nova.rs"], "core", ["RS"], ["sr"]],
    ["rs-birn", "birn.rs", ["birn.rs", "www.birn.rs"], "core", ["RS"], ["sr"]],
    ["rs-danas", "danas.rs", ["danas.rs", "www.danas.rs", "citymagazine.danas.rs"], "core", ["RS"], ["sr"]],
    ["rs-kurir", "kurir.rs", ["kurir.rs", "www.kurir.rs", "biznis.kurir.rs", "stil.kurir.rs", "zdravlje.kurir.rs"], "core", ["RS"], ["sr"]],
    ["rs-mondo", "mondo.rs", ["mondo.rs", "www.mondo.rs", "lepaisrecna.mondo.rs", "sensa.mondo.rs", "smartlife.mondo.rs", "stvarukusa.mondo.rs", "yumama.mondo.rs"], "core", ["RS"], ["sr"]],
    ["rs-rts", "rts.rs", ["rts.rs", "www.rts.rs", "oko.rts.rs"], "core", ["RS"], ["sr"]],
    ["rs-srbijadanas", "sd.rs", ["sd.rs", "www.sd.rs", "srbijadanas.com", "www.srbijadanas.com"], "core", ["RS"], ["sr"]],
    ["rs-juznevesti", "juznevesti.com", ["juznevesti.com", "www.juznevesti.com"], "core", ["RS"], ["sr"]],
    ["rs-b92", "b92.net", ["b92.net", "www.b92.net", "superzena.b92.net"], "core", ["RS"], ["sr"]],
    ["rs-informer", "informer.rs", ["informer.rs", "www.informer.rs", "sportinjo.informer.rs"], "core", ["RS"], ["sr"]],
    ["rs-prva", "prva.rs", ["prva.rs", "www.prva.rs"], "core", ["RS"], ["sr"]],
    ["rs-pink", "pink.rs", ["pink.rs", "www.pink.rs"], "core", ["RS"], ["sr"]],
    ["rs-sportske", "sportske.net", ["sportske.net"], "core", ["RS"], ["sr"]],
    ["rs-sportklub", "sportklub.n1info.rs", ["sportklub.n1info.rs"], "core", ["RS"], ["sr"]],
    ["rs-sportski-zurnal", "zurnal.politika.rs", ["zurnal.politika.rs"], "core", ["RS"], ["sr"]],
    ["rs-startit", "startit.rs", ["startit.rs", "www.startit.rs"], "core", ["RS"], ["sr"]],
    ["rs-svetkompjutera", "sk.rs", ["sk.rs", "www.sk.rs"], "core", ["RS"], ["sr"]],
    ["rs-buffgaming", "buffgaming.rs", ["buffgaming.rs", "www.buffgaming.rs"], "core", ["RS"], ["sr"]],
    ["rs-itnetwork", "itnetwork.rs", ["itnetwork.rs", "www.itnetwork.rs"], "core", ["RS"], ["sr"]],
    ["rs-sajbersfera", "sajbersfera.in.rs", ["sajbersfera.in.rs"], "core", ["RS"], ["sr"]],
    ["rs-netokracija", "netokracija.rs", ["netokracija.rs", "www.netokracija.rs"], "core", ["RS"], ["sr"]],
    ["rs-velikeprice", "velikeprice.com", ["velikeprice.com"], "core", ["RS"], ["sr"]],
    ["rs-vreme", "vreme.com", ["vreme.com"], "core", ["RS"], ["sr"]],
    ["rs-nedeljnik", "www.nedeljnik.rs", ["nedeljnik.rs", "www.nedeljnik.rs"], "core", ["RS"], ["sr"]],
    ["rs-pescanik", "pescanik.net", ["pescanik.net"], "core", ["RS"], ["sr"]],

    ["hr-index", "index.hr", ["index.hr", "www.index.hr"], "core", ["HR"], ["hr"]],
    ["hr-24sata", "24sata.hr", ["24sata.hr", "www.24sata.hr", "express.24sata.hr", "autostart.24sata.hr", "miss7.24sata.hr", "miss7zdrava.24sata.hr", "miss7mama.24sata.hr", "gastro.24sata.hr", "joomboos.24sata.hr"], "core", ["HR"], ["hr"]],
    ["hr-dnevnik", "dnevnik.hr", ["dnevnik.hr", "www.dnevnik.hr", "gol.dnevnik.hr", "showbuzz.dnevnik.hr", "zadovoljna.dnevnik.hr", "punkufer.dnevnik.hr", "krenizdravo.dnevnik.hr", "forbes.dnevnik.hr", "folder.dnevnik.hr", "novatv.dnevnik.hr"], "core", ["HR"], ["hr"]],
    ["hr-jutarnji", "jutarnji.hr", ["jutarnji.hr", "www.jutarnji.hr"], "core", ["HR"], ["hr"]],
    ["hr-net", "net.hr", ["net.hr", "www.net.hr", "zena.net.hr", "indizajn.net.hr"], "core", ["HR"], ["hr"]],
    ["hr-tportal", "tportal.hr", ["tportal.hr", "www.tportal.hr"], "core", ["HR"], ["hr"]],
    ["hr-vecernji", "vecernji.hr", ["vecernji.hr", "www.vecernji.hr", "ordinacija.vecernji.hr", "diva.vecernji.hr", "vojnapovijest.vecernji.hr", "living.vecernji.hr", "lokalni.vecernji.hr", "vjerujem.vecernji.hr"], "core", ["HR"], ["hr"]],
    ["hr-hrt", "hrt.hr", ["hrt.hr", "www.hrt.hr", "vijesti.hrt.hr", "glashrvatske.hrt.hr", "sport.hrt.hr", "magazin.hrt.hr", "radio.hrt.hr"], "core", ["HR"], ["hr"]],
    ["hr-dnevno", "dnevno.hr", ["dnevno.hr", "www.dnevno.hr"], "core", ["HR"], ["hr"]],
    ["hr-rtl", "rtl.hr", ["rtl.hr", "www.rtl.hr"], "core", ["HR"], ["hr"]],
    ["hr-telegram", "telegram.hr", ["telegram.hr", "www.telegram.hr", "podcasts.telegram.hr"], "core", ["HR"], ["hr"]],
    ["hr-slobodnadalmacija", "slobodnadalmacija.hr", ["slobodnadalmacija.hr", "www.slobodnadalmacija.hr"], "core", ["HR"], ["hr"]],
    ["hr-direktno", "direktno.hr", ["direktno.hr", "www.direktno.hr"], "core", ["HR"], ["hr"]],
    ["hr-n1", "n1info.hr", ["n1info.hr", "www.n1info.hr"], "core", ["HR"], ["hr"]],
    ["hr-sportklub", "sportklub.n1info.hr", ["sportklub.n1info.hr"], "core", ["HR"], ["hr"]],
    ["hr-sportnet", "sportnet.hr", ["sportnet.hr"], "core", ["HR"], ["hr"]],
    ["hr-netokracija", "netokracija.com", ["netokracija.com", "www.netokracija.com"], "core", ["HR"], ["hr"]],
    ["hr-bug", "bug.hr", ["bug.hr", "www.bug.hr", "mreza.bug.hr"], "core", ["HR"], ["hr"]],
    ["hr-pcchip", "pcchip.hr", ["pcchip.hr", "www.pcchip.hr"], "core", ["HR"], ["hr"]],
    ["hr-vidi", "vidi.hr", ["vidi.hr", "www.vidi.hr"], "core", ["HR"], ["hr"]],
    ["hr-hcl", "hcl.hr", ["hcl.hr", "www.hcl.hr"], "core", ["HR"], ["hr"]],
    ["hr-pcekspert", "pcekspert.com", ["pcekspert.com", "www.pcekspert.com"], "core", ["HR"], ["hr"]],
    ["hr-mobhr", "mob.hr", ["mob.hr"], "core", ["HR"], ["hr"]],
    ["hr-ictbusiness", "ictbusiness.info", ["ictbusiness.info", "www.ictbusiness.info"], "core", ["HR"], ["hr"]],
    ["hr-lupiga", "lupiga.com", ["lupiga.com", "www.lupiga.com"], "core", ["HR"], ["hr"]],
    ["hr-kritika-hdp", "kritika-hdp.hr", ["kritika-hdp.hr"], "core", ["HR"], ["hr"]],
    ["hr-booksa", "booksa.hr", ["booksa.hr", "www.booksa.hr"], "core", ["HR"], ["hr"]],
    ["hr-portalnovosti", "www.portalnovosti.com", ["portalnovosti.com", "www.portalnovosti.com"], "core", ["HR"], ["sr"]],

    ["ba-klix", "klix.ba", ["klix.ba", "www.klix.ba"], "core", ["BA"], ["bs"]],
    ["ba-avaz", "avaz.ba", ["avaz.ba", "www.avaz.ba"], "core", ["BA"], ["bs"]],
    ["ba-sportsport", "sportsport.ba", ["sportsport.ba", "www.sportsport.ba"], "core", ["BA"], ["bs"]],
    ["ba-reprezentacija", "reprezentacija.ba", ["reprezentacija.ba"], "core", ["BA"], ["bs"]],
    ["ba-srpskainfo", "srpskainfo.com", ["srpskainfo.com", "www.srpskainfo.com", "zdravlje.srpskainfo.com", "sport.srpskainfo.com"], "core", ["BA"], ["sr"]],
    ["ba-nezavisne", "nezavisne.com", ["nezavisne.com", "www.nezavisne.com"], "core", ["BA"], ["sr"]],
    ["ba-vijesti", "vijesti.ba", ["vijesti.ba", "www.vijesti.ba"], "core", ["BA"], ["bs"]],
    ["ba-hercegovina", "hercegovina.info", ["hercegovina.info", "www.hercegovina.info"], "core", ["BA"], ["hr"]],
    ["ba-n1", "n1info.ba", ["n1info.ba", "www.n1info.ba", "forbes.n1info.ba"], "core", ["BA"], ["bs", "hr", "sr"]],
    ["ba-slobodna-bosna", "slobodna-bosna.ba", ["slobodna-bosna.ba", "www.slobodna-bosna.ba"], "core", ["BA"], ["bs"]],
    ["ba-oslobodjenje", "oslobodjenje.ba", ["oslobodjenje.ba", "www.oslobodjenje.ba"], "core", ["BA"], ["bs"]],
    ["ba-vecernji", "vecernji.ba", ["vecernji.ba", "www.vecernji.ba"], "core", ["BA"], ["hr"]],
    ["ba-radiosarajevo", "radiosarajevo.ba", ["radiosarajevo.ba", "www.radiosarajevo.ba"], "core", ["BA"], ["bs"]],
    ["ba-bljesak", "bljesak.info", ["bljesak.info", "www.bljesak.info"], "core", ["BA"], ["hr"]],
    ["ba-itportal", "itportal.ba", ["itportal.ba", "www.itportal.ba"], "core", ["BA"], ["hr"]],
    ["ba-prometej", "www.prometej.ba", ["prometej.ba", "www.prometej.ba"], "core", ["BA"], ["bs"]],

    ["me-vijesti", "vijesti.me", ["vijesti.me", "www.vijesti.me", "forbes.vijesti.me"], "core", ["ME"], ["cnr", "sr"]],
    ["me-cdm", "cdm.me", ["cdm.me", "www.cdm.me"], "core", ["ME"], ["cnr"]],
    ["me-dan", "dan.co.me", ["dan.co.me", "www.dan.co.me"], "core", ["ME"], ["cnr", "sr"]],
    ["me-antena-m", "antenam.net", ["antenam.net", "www.antenam.net"], "core", ["ME"], ["cnr"]],
    ["me-pobjeda", "pobjeda.me", ["pobjeda.me", "www.pobjeda.me"], "core", ["ME"], ["cnr"]],
    ["me-in4s", "in4s.net", ["in4s.net", "www.in4s.net"], "core", ["ME"], ["sr"]],
    ["me-borba", "borba.me", ["borba.me", "www.borba.me"], "core", ["ME"], ["sr"]],
    ["me-rtcg", "rtcg.me", ["rtcg.me", "www.rtcg.me"], "core", ["ME"], ["cnr"]],
    ["me-standard", "standard.co.me", ["standard.co.me", "www.standard.co.me"], "core", ["ME"], ["cnr"]],
    ["me-analitika", "portalanalitika.me", ["portalanalitika.me", "www.portalanalitika.me"], "core", ["ME"], ["cnr"]],
    ["me-aktuelno", "aktuelno.me", ["aktuelno.me", "www.aktuelno.me"], "core", ["ME"], ["cnr"]],
    ["me-mondo", "mondo.me", ["mondo.me", "www.mondo.me"], "core", ["ME"], ["cnr", "sr"]],
    ["me-kolektiv", "kolektiv.me", ["kolektiv.me", "www.kolektiv.me"], "core", ["ME"], ["cnr"]],

    // Large multi-language international broadcaster exception (2026-08-24):
    // each of these serves its Serbian/Croatian/Bosnian section from a shared
    // host that also carries many unrelated-language editions. Host-level
    // permission scope therefore covers the whole domain, not just the
    // Balkan-language paths; see the inclusion-policy exception in
    // research/CURATED_EDITORIAL_PORTALS.md before adding another one.
    ["intl-dw", "www.dw.com", ["www.dw.com"], "core", ["RS", "HR"], ["sr", "hr"]],
    ["intl-bbc-serbian", "www.bbc.com", ["www.bbc.com"], "core", ["RS"], ["sr"]],
    ["au-sbs", "www.sbs.com.au", ["www.sbs.com.au"], "diaspora", ["AU"], ["bs", "hr", "sr"]],

    // Betting-linked publications use their own editorial reading hosts. Do not
    // add betting, account, payment, odds, API, advertising, or static hosts.
    ["rs-mozzart-sport", "mozzartsport.com", ["mozzartsport.com", "www.mozzartsport.com"], "commercial", ["RS"], ["sr"]],
    ["rs-meridian-sport", "meridiansport.rs", ["meridiansport.rs"], "commercial", ["RS"], ["sr"]],
    ["hr-germanijak", "www.germanijak.hr", ["germanijak.hr", "www.germanijak.hr"], "commercial", ["HR"], ["hr"]],
    ["ba-meridiansport", "meridiansport.ba", ["meridiansport.ba"], "commercial", ["BA"], ["bs"]],
    ["me-meridiansport", "meridiansport.me", ["meridiansport.me"], "commercial", ["ME"], ["cnr"]],

    ["me-cgsport", "cgsport.me", ["cgsport.me"], "core", ["ME"], ["cnr"]],
    ["me-sportski", "sportski.me", ["sportski.me"], "core", ["ME"], ["cnr"]],


    ["xk-kosovo-online", "kosovo-online.com", ["kosovo-online.com", "www.kosovo-online.com"], "minority", ["XK"], ["sr"]],
    ["xk-kossev", "kossev.info", ["kossev.info", "www.kossev.info"], "minority", ["XK"], ["sr"]],
    ["xk-radio-kim", "radiokim.net", ["radiokim.net", "www.radiokim.net"], "minority", ["XK"], ["sr"]],
    ["xk-gorazdevac", "gorazdevac.com", ["gorazdevac.com", "www.gorazdevac.com"], "minority", ["XK"], ["sr"]],
    ["xk-kontakt-plus", "radiokontaktplus.org", ["radiokontaktplus.org", "www.radiokontaktplus.org"], "minority", ["XK"], ["sr"]],
    ["xk-mitrovica-sever", "radiomitrovicasever.com", ["radiomitrovicasever.com", "www.radiomitrovicasever.com"], "minority", ["XK"], ["sr"]],
    ["mk-sloboden-pecat", "slobodenpecat.mk", ["slobodenpecat.mk", "www.slobodenpecat.mk"], "minority", ["MK"], ["sr"]],
    ["mk-spona", "srbi.org.mk", ["srbi.org.mk", "www.srbi.org.mk"], "minority", ["MK"], ["sr"]],
    ["si-bkzs", "bkzs.si", ["bkzs.si", "www.bkzs.si"], "minority", ["SI"], ["bs"]],
    ["si-sss", "sss-zss.si", ["sss-zss.si", "www.sss-zss.si"], "minority", ["SI"], ["sr"]],
    ["si-shds", "shds.si", ["shds.si", "www.shds.si"], "minority", ["SI"], ["hr"]],
    ["ro-rri", "rri.ro", ["rri.ro", "www.rri.ro"], "minority", ["RO"], ["sr"]],
    ["ro-hrvatska-grancica", "zhr-ucr.ro", ["zhr-ucr.ro", "www.zhr-ucr.ro"], "minority", ["RO"], ["hr"]],
    ["bg-radio-bulgaria", "bnrnews.bg", ["bnrnews.bg", "www.bnrnews.bg"], "minority", ["BG"], ["sr"]],
    ["hu-srpske-nedeljne", "snnovineplus.hu", ["snnovineplus.hu", "www.snnovineplus.hu"], "minority", ["HU"], ["sr"]],
    ["hu-croatica", "croatica.hu", ["croatica.hu", "www.croatica.hu", "glasnik.croatica.hu"], "minority", ["HU"], ["hr"]],
    ["at-kosmo", "kosmo.at", ["kosmo.at", "www.kosmo.at"], "diaspora", ["AT"], ["bs", "hr", "sr"]],
    ["at-hrvatske-novine", "hrvatskenovine.at", ["hrvatskenovine.at", "www.hrvatskenovine.at"], "minority", ["AT"], ["hr"]],
    ["at-orf-volksgruppen", "volksgruppen.orf.at", ["volksgruppen.orf.at"], "minority", ["AT"], ["hr"]],
    ["de-fenix", "fenix-magazin.de", ["fenix-magazin.de", "www.fenix-magazin.de"], "diaspora", ["DE"], ["hr"]],
    ["de-rasejanje", "rasejanje.info", ["rasejanje.info", "www.rasejanje.info"], "diaspora", ["DE", "AT", "CH"], ["sr"]],
    ["us-croatians-online", "croatiansonline.com", ["croatiansonline.com", "www.croatiansonline.com"], "diaspora", ["US"], ["hr"]],
    ["us-chicago-glasnik", "chicagoglasnik.com", ["chicagoglasnik.com", "www.chicagoglasnik.com"], "diaspora", ["US"], ["sr"]],
    ["us-serbian-times", "serbiantimes.info", ["serbiantimes.info", "www.serbiantimes.info"], "diaspora", ["US"], ["sr"]],
    ["us-srpska-televizija", "srpskatelevizija.com", ["srpskatelevizija.com", "www.srpskatelevizija.com"], "diaspora", ["US"], ["sr"]],
    ["au-hrvatski-vjesnik", "vjesnik.com.au", ["vjesnik.com.au", "www.vjesnik.com.au"], "diaspora", ["AU"], ["hr"]],

    // User-directed outreach sites. Keep this separate from editorial coverage:
    // each is a named entity's exact site, never a social platform, broad parent
    // domain, or wildcard; the three Wikipedia language-project hosts are explicit.
    ["outreach-wikimedia-rs", "wikimedia.rs", ["wikimedia.rs"], "outreach", ["RS"], ["sr"]],
    ["outreach-sr-wikipedia", "sr.wikipedia.org", ["sr.wikipedia.org"], "outreach", ["RS"], ["sr"]],
    ["outreach-hr-wikipedia", "hr.wikipedia.org", ["hr.wikipedia.org"], "outreach", ["HR"], ["hr"]],
    ["outreach-bs-wikipedia", "bs.wikipedia.org", ["bs.wikipedia.org"], "outreach", ["BA"], ["bs"]],
    ["outreach-classla", "www.clarin.si", ["clarin.si", "www.clarin.si"], "outreach", ["SI"], ["bs", "hr", "sr"]],
    ["outreach-sigslav", "sigslav.cs.helsinki.fi", ["sigslav.cs.helsinki.fi"], "outreach", ["FI"], ["en"]],
    ["outreach-bsnlp", "bsnlp.cs.helsinki.fi", ["bsnlp.cs.helsinki.fi"], "outreach", ["FI"], ["en"]],
    ["outreach-ffzg-nlp", "inf.ffzg.unizg.hr", ["inf.ffzg.unizg.hr"], "outreach", ["HR"], ["hr"]],
    ["outreach-airi", "airi.uniri.hr", ["airi.uniri.hr", "www.airi.uniri.hr"], "outreach", ["HR"], ["hr"]],
    ["outreach-share", "sharefoundation.info", ["sharefoundation.info", "www.sharefoundation.info"], "outreach", ["RS"], ["sr"]],
    ["outreach-isj-sanu", "www.isj.sanu.ac.rs", ["www.isj.sanu.ac.rs"], "outreach", ["RS"], ["sr"]],
    ["outreach-matica-srpska", "maticasrpska.org.rs", ["maticasrpska.org.rs", "www.maticasrpska.org.rs"], "outreach", ["RS"], ["sr"]],
    ["outreach-fcjk", "fcjk.ac.me", ["fcjk.ac.me"], "outreach", ["ME"], ["cnr"]],
    ["outreach-cirilica", "cirilica-beograd.rs", ["cirilica-beograd.rs", "www.cirilica-beograd.rs"], "outreach", ["RS"], ["sr"]],
    ["rs-pcpress", "pcpress.rs", ["pcpress.rs", "www.pcpress.rs"], "outreach", ["RS"], ["sr"]],
    ["rs-nspm", "nspm.rs", ["nspm.rs", "www.nspm.rs"], "outreach", ["RS"], ["sr"]],
  ];

  const byHost = new Map();
  const portals = Object.freeze(RAW_PORTALS.map(([id, canonicalHost, hosts, tier, markets, languages]) => {
    const portal = Object.freeze({
      id,
      canonicalHost,
      hosts: Object.freeze(Array.from(hosts)),
      tier,
      markets: Object.freeze(Array.from(markets)),
      languages: Object.freeze(Array.from(languages))
    });
    for (const host of portal.hosts) byHost.set(host, portal);
    return portal;
  }));

  function portalForHostname(value) {
    const hostname = String(value || "").toLocaleLowerCase("en-US").replace(/\.$/u, "");
    return byHost.get(hostname) || null;
  }

  function matchPatterns() {
    return portals.flatMap((portal) => portal.hosts.flatMap((host) => [
      `http://${host}/*`, `https://${host}/*`
    ]));
  }

  const api = Object.freeze({ portals, portalForHostname, matchPatterns });
  global.PrepisiCuratedPortals = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
