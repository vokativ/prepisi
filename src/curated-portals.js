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

    ["ba-klix", "klix.ba", ["klix.ba", "www.klix.ba"], "core", ["BA"], ["bs"]],
    ["ba-avaz", "avaz.ba", ["avaz.ba", "www.avaz.ba"], "core", ["BA"], ["bs"]],
    ["ba-sportsport", "sportsport.ba", ["sportsport.ba", "www.sportsport.ba"], "core", ["BA"], ["bs"]],
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
    ["au-hrvatski-vjesnik", "vjesnik.com.au", ["vjesnik.com.au", "www.vjesnik.com.au"], "diaspora", ["AU"], ["hr"]]
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
