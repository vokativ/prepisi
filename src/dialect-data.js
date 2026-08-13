(function initialisePrepisiDialectData(root) {
  "use strict";

  if (root.PrepisiDialectData) return;

  let comtextData = root.PrepisiComtextData;
  if (!comtextData && typeof module !== "undefined" && module.exports) {
    comtextData = require("./generated/comtext-pairs.js");
  }
  let lexiconData = root.PrepisiLexiconData;
  if (!lexiconData && typeof module !== "undefined" && module.exports) {
    lexiconData = require("./generated/lexicon-pairs.js");
  }

  function family(id, forms, note = "reviewed jat word family") {
    return Object.freeze({
      id,
      note,
      forms: Object.freeze(forms.map((row) => Object.freeze(row)))
    });
  }

  // Rows are [Ekavian, Ijekavian, Ikavian]. A null form is intentional: it
  // means that the reviewed data supports the first two directions but that we
  // do not yet have a sufficiently reliable Ikavian equivalent. This is safer
  // than guessing, particularly because Ikavian has several regional systems.
  const FAMILIES = Object.freeze([
    family("milk", [
      ["mleko", "mlijeko", "mliko"], ["mleka", "mlijeka", "mlika"],
      ["mleku", "mlijeku", "mliku"], ["mlekom", "mlijekom", "mlikom"],
      ["mlečni", "mliječni", "mlični"], ["mlečna", "mliječna", "mlična"],
      ["mlečno", "mliječno", "mlično"]
    ]),
    family("time", [
      ["vreme", "vrijeme", "vrime"], ["vremena", "vremena", "vrimena"],
      ["vremenu", "vremenu", "vrimenu"], ["vremenom", "vremenom", "vrimenom"]
    ]),
    family("word", [
      ["reč", "riječ", "rič"], ["reči", "riječi", "riči"],
      ["rečima", "riječima", "ričima"], ["rečnik", "rječnik", "ričnik"]
    ]),
    family("river", [
      ["reka", "rijeka", "rika"], ["reke", "rijeke", "rike"],
      ["reku", "rijeku", "riku"], ["rekom", "rijekom", "rikom"]
    ]),
    family("place", [
      ["mesto", "mjesto", "misto"], ["mesta", "mjesta", "mista"],
      ["mestu", "mjestu", "mistu"], ["mestom", "mjestom", "mistom"],
      ["mesni", "mjesni", "misni"]
    ]),
    family("where", [
      ["uvek", "uvijek", "uvik"], ["zauvek", "zauvijek", "zauvik"],
      ["gde", "gdje", "di"], ["ovde", "ovdje", "ovdi"],
      ["negde", "negdje", "negdi"], ["nigde", "nigdje", "nigdi"],
      ["svugde", "svugdje", "svugdi"]
    ]),
    family("flower", [
      ["cvet", "cvijet", "cvit"], ["cveta", "cvijeta", "cvita"],
      ["cvetu", "cvijetu", "cvitu"], ["cvetovi", "cvjetovi", "cvitovi"],
      ["cveće", "cvijeće", "cviće"]
    ]),
    family("snow", [
      ["sneg", "snijeg", "snig"], ["snega", "snijega", "sniga"],
      ["snegu", "snijegu", "snigu"]
    ]),
    family("sin", [
      ["greh", "grijeh", "grih"], ["greha", "grijeha", "griha"],
      ["grešni", "grješni", "grišni"]
    ]),
    family("laughter", [
      ["smeh", "smijeh", "smih"], ["smeha", "smijeha", "smiha"],
      ["smešan", "smiješan", "smišan"], ["smešno", "smiješno", "smišno"]
    ]),
    family("beautiful", [
      ["lep", "lijep", "lip"], ["lepa", "lijepa", "lipa"],
      ["lepo", "lijepo", "lipo"], ["lepi", "lijepi", "lipi"],
      ["lepog", "lijepog", "lipog"], ["lepše", "ljepše", "lipše"]
    ]),
    family("child", [
      ["dete", "dijete", "dite"], ["deteta", "djeteta", "diteta"],
      ["detetu", "djetetu", "ditetu"], ["detetom", "djetetom", "ditetom"],
      ["deca", "djeca", "dica"], ["dece", "djece", "dice"],
      ["deci", "djeci", "dici"], ["dečji", "dječji", "dičji"]
    ]),
    family("person", [
      ["čovek", "čovjek", "čovik"], ["čoveka", "čovjeka", "čovika"],
      ["čoveku", "čovjeku", "čoviku"], ["čovekom", "čovjekom", "čovikom"],
      ["čovečji", "čovječji", "čovičji"]
    ]),
    family("two", [
      ["dve", "dvije", "dvi"], ["dvema", "dvjema", "dvima"]
    ]),
    family("after", [["posle", "poslije", "posli"]]),
    family("week", [
      ["nedelja", "nedjelja", "nedilja"], ["nedelje", "nedjelje", "nedilje"],
      ["nedelju", "nedjelju", "nedilju"],
      ["ponedeljak", "ponedjeljak", "ponediljak"],
      ["ponedeljka", "ponedjeljka", "ponediljka"]
    ]),
    family("wednesday", [
      ["sreda", "srijeda", "srida"], ["srede", "srijede", "sride"],
      ["sredu", "srijedu", "sridu"]
    ]),
    family("left", [
      ["levo", "lijevo", "livo"], ["levi", "lijevi", "livi"],
      ["leva", "lijeva", "liva"]
    ]),
    family("next", [
      ["sledeći", "sljedeći", "sljedeći"], ["sledeća", "sljedeća", "sljedeća"],
      ["sledeće", "sljedeće", "sljedeće"], ["sledećeg", "sljedećeg", "sljedećeg"],
      ["sledećem", "sljedećem", "sljedećem"], ["sledeću", "sljedeću", "sljedeću"]
    ]),
    family("change", [
      ["promena", "promjena", "promina"], ["promene", "promjene", "promine"],
      ["promeniti", "promijeniti", "prominit"], ["promenljiv", "promjenljiv", "prominljiv"],
      ["promenljiva", "promjenljiva", "prominljiva"],
      ["promenljivo", "promjenljivo", "prominljivo"],
      ["promenljivog", "promjenljivog", "prominljivog"],
      ["promenljivom", "promjenljivom", "prominljivom"],
      ["promenljivi", "promjenljivi", "prominljivi"]
    ]),
    family("solution", [
      ["rešenje", "rješenje", "rišenje"], ["rešenja", "rješenja", "rišenja"],
      ["rešenju", "rješenju", "rišenju"], ["rešenjem", "rješenjem", "rišenjem"]
    ]),
    family("success", [
      ["uspeh", "uspjeh", "uspih"], ["uspeha", "uspjeha", "uspiha"]
    ]),
    family("news", [
      ["vest", "vijest", "vist"], ["vesti", "vijesti", "visti"],
      ["obavest", "obavijest", "obavist"], ["obavesti", "obavijesti", "obavisti"],
      ["izveštaj", "izvještaj", "izvištaj"], ["izveštaja", "izvještaja", "izvištaja"]
    ]),
    family("understand", [
      ["razumeti", "razumjeti", "razumit"], ["razumeo", "razumio", "razumija"]
    ]),
    family("live", [
      ["živeti", "živjeti", "živit"], ["živeo", "živio", "živija"]
    ]),
    family("love", [
      ["voleti", "voljeti", "volit"], ["voleo", "volio", "volija"]
    ]),
    family("see", [
      ["videti", "vidjeti", "vidit"], ["video", "vidio", "vidija"]
    ]),
    family("sit", [
      ["sedeti", "sjediti", "sidit"], ["sedeo", "sjedio", "sidija"],
      ["sesti", "sjesti", "sist"]
    ]),
    family("sing", [
      ["pevati", "pjevati", "pivat"], ["pevao", "pjevao", "piva"],
      ["pesma", "pjesma", "pisma"], ["pesme", "pjesme", "pisme"]
    ]),

    // Families added from real-page regression reports.
    family("wind", [
      ["vetar", "vjetar", "vitar"], ["vetre", "vjetre", "vitre"],
      ["vetra", "vjetra", "vitra"], ["vetru", "vjetru", "vitru"],
      ["vetrom", "vjetrom", "vitrom"], ["vetrovi", "vjetrovi", "vitrovi"],
      ["vetrove", "vjetrove", "vitrove"], ["vetrova", "vjetrova", "vitrova"],
      ["vetrovima", "vjetrovima", "vitrovima"],
      ["vetrovit", "vjetrovit", "vitrovit"], ["vetrovita", "vjetrovita", "vitrovita"],
      ["vetrovito", "vjetrovito", "vitrovito"]
    ], "N1 article regression: vetar ↔ vjetar"),
    family("substitute", [
      ["zamenik", "zamjenik", "zaminik"], ["zamenika", "zamjenika", "zaminika"],
      ["zameniku", "zamjeniku", "zaminiku"], ["zamenikom", "zamjenikom", "zaminikom"],
      ["zamenici", "zamjenici", "zaminici"], ["zamenike", "zamjenike", "zaminike"],
      ["zamenicima", "zamjenicima", "zaminicima"],
      ["zameniti", "zamijeniti", "zaminit"]
    ], "N1 article regression: zamenik ↔ zamjenik"),
    family("sand", [
      ["pesak", "pijesak", "pisak"], ["peska", "pijeska", "piska"],
      ["pesku", "pijesku", "pisku"], ["peskom", "pijeskom", "piskom"],
      ["peščara", "pješčara", "piščara"], ["peščare", "pješčare", "piščare"],
      ["peščari", "pješčari", "piščari"], ["peščaru", "pješčaru", "piščaru"],
      ["peščarom", "pješčarom", "piščarom"],
      ["peščani", "pješčani", "piščani"], ["peščana", "pješčana", "piščana"],
      ["peščano", "pješčano", "piščano"]
    ], "N1 article regression: peščara ↔ pješčara"),

    // Common news and administrative families. Null Ikavian entries are
    // deliberate until those regional forms receive separate review.
    family("request", [
      ["zahtev", "zahtjev", null], ["zahteva", "zahtjeva", null],
      ["zahtevu", "zahtjevu", null], ["zahtevom", "zahtjevom", null],
      ["zahtevi", "zahtjevi", null], ["zahteve", "zahtjeve", null],
      ["zahtevati", "zahtijevati", null]
    ]),
    family("value", [
      ["vrednost", "vrijednost", null], ["vrednosti", "vrijednosti", null],
      ["vredno", "vrijedno", null], ["vredan", "vrijedan", null],
      ["vredna", "vrijedna", null]
    ]),
    family("part", [
      ["deo", "dio", null], ["dela", "dijela", null],
      ["delu", "dijelu", null], ["delom", "dijelom", null],
      ["delovi", "dijelovi", null], ["delova", "dijelova", null],
      ["delovima", "dijelovima", null], ["delimično", "djelimično", null]
    ]),
    family("price", [
      ["cena", "cijena", null], ["cene", "cijene", null],
      ["cenu", "cijenu", null], ["cenom", "cijenom", null],
      ["cenama", "cijenama", null]
    ]),
    family("president", [
      ["predsednik", "predsjednik", null], ["predsednika", "predsjednika", null],
      ["predsedniku", "predsjedniku", null], ["predsednikom", "predsjednikom", null],
      ["predsednica", "predsjednica", null], ["predsednice", "predsjednice", null]
    ]),
    family("proposal", [
      ["predlog", "prijedlog", null], ["predloga", "prijedloga", null],
      ["predlogu", "prijedlogu", null], ["predlogom", "prijedlogom", null],
      ["predlozi", "prijedlozi", null], ["predloge", "prijedloge", null]
    ]),
    family("measure", [
      ["mera", "mjera", null], ["mere", "mjere", null],
      ["meri", "mjeri", null], ["meru", "mjeru", null],
      ["merom", "mjerom", null], ["merama", "mjerama", null]
    ]),
    family("session", [
      ["sednica", "sjednica", null], ["sednice", "sjednice", null],
      ["sednici", "sjednici", null], ["sednicu", "sjednicu", null],
      ["sednicom", "sjednicom", null], ["sednicama", "sjednicama", null]
    ]),
    family("seat", [
      ["sedište", "sjedište", null], ["sedišta", "sjedišta", null],
      ["sedištu", "sjedištu", null], ["sedištem", "sjedištem", null]
    ]),
    family("month", [
      ["mesec", "mjesec", null], ["meseca", "mjeseca", null],
      ["mesecu", "mjesecu", null], ["mesecom", "mjesecom", null],
      ["meseci", "mjeseci", null], ["mesece", "mjesece", null],
      ["mesecima", "mjesecima", null], ["mesečno", "mjesečno", null]
    ]),
    family("notification", [
      ["obaveštenje", "obavještenje", null], ["obaveštenja", "obavještenja", null],
      ["obaveštenju", "obavještenju", null], ["obaveštenjem", "obavještenjem", null]
    ]),
    family("application", [
      ["primena", "primjena", null], ["primene", "primjene", null],
      ["primeni", "primjeni", null], ["primenu", "primjenu", null],
      ["primenom", "primjenom", null], ["primenjivati", "primjenjivati", null],
      ["primenjuje", "primjenjuje", null], ["primenjuju", "primjenjuju", null]
    ]),
    family("amendment", [
      ["izmena", "izmjena", null], ["izmene", "izmjene", null],
      ["izmeni", "izmjeni", null], ["izmenu", "izmjenu", null],
      ["izmenom", "izmjenom", null], ["izmenama", "izmjenama", null]
    ]),
    family("consequence", [
      ["posledica", "posljedica", null], ["posledice", "posljedice", null],
      ["posledici", "posljedici", null], ["posledicu", "posljedicu", null],
      ["posledicom", "posljedicom", null], ["posledicama", "posljedicama", null]
    ]),
    family("security", [
      ["bezbedan", "bezbjedan", null], ["bezbedna", "bezbjedna", null],
      ["bezbedno", "bezbjedno", null], ["bezbednost", "bezbjednost", null],
      ["bezbednosti", "bezbjednosti", null]
    ]),
    family("germany", [
      ["nemačka", "njemačka", null], ["nemačkama", "njemačkama", null],
      ["nemačke", "njemačke", null], ["nemačkoj", "njemačkoj", null],
      ["nemačkom", "njemačkom", null], ["nemačku", "njemačku", null],
      ["nemac", "nijemac", null], ["nemaca", "nijemaca", null],
      ["nemca", "nijemca", null], ["nemce", "nijemce", null],
      ["nemcem", "nijemcem", null], ["nemci", "nijemci", null],
      ["nemcima", "nijemcima", null], ["nemcu", "nijemcu", null],
      ["nemče", "nijemče", null], ["nemica", "njemica", null],
      ["nemice", "njemice", null], ["nemici", "njemici", null],
      ["nemicom", "njemicom", null], ["nemicama", "njemicama", null],
      ["nemicu", "njemicu", null], ["nemico", "njemico", null],
      ["nemački", "njemački", null], ["nemačkog", "njemačkog", null],
      ["nemačkoga", "njemačkoga", null], ["nemačkome", "njemačkome", null],
      ["nemačkomu", "njemačkomu", null], ["nemačkima", "njemačkima", null],
      ["nemačkih", "njemačkih", null], ["nemačkim", "njemačkim", null],
      ["nemačko", "njemačko", null]
    ], "srLex/hrLex Germany audit; Njemica paradigm cross-checked in HJP"),
    family("north", [
      ["sever", "sjever", null], ["severa", "sjevera", null],
      ["severe", "sjevere", null], ["severi", "sjeveri", null],
      ["severima", "sjeverima", null], ["severom", "sjeverom", null],
      ["severu", "sjeveru", null], ["severna", "sjeverna", null],
      ["severne", "sjeverne", null], ["severni", "sjeverni", null],
      ["severnih", "sjevernih", null], ["severnim", "sjevernim", null],
      ["severno", "sjeverno", null], ["severnoj", "sjevernoj", null],
      ["severnom", "sjevernom", null], ["severnu", "sjevernu", null]
    ], "srLex/hrLex geographic modifier audit: North Macedonia/Korea and direction noun"),
    family("north-korea", [
      ["severnokorejac", "sjevernokorejac", null],
      ["severnokorejka", "sjevernokorejka", null],
      ["severnokorejci", "sjevernokorejci", null]
    ], "srLex/hrLex adjective audit plus LZMK reviewed North Korean demonyms"),
    family("belarusian-adjective", [
      ["beloruska", "bjeloruska", null], ["beloruske", "bjeloruske", null],
      ["beloruski", "bjeloruski", null], ["beloruskih", "bjeloruskih", null],
      ["beloruskim", "bjeloruskim", null], ["belorusko", "bjelorusko", null],
      ["beloruskoj", "bjeloruskoj", null], ["beloruskom", "bjeloruskom", null],
      ["belorusku", "bjelorusku", null]
    ], "srLex/hrLex country-adjective audit: Belarus; country and demonyms remain review-only"),
    family("virgin-islands", [
      ["devica", "djevica", null], ["devicama", "djevicama", null],
      ["device", "djevice", null], ["devici", "djevici", null],
      ["devicom", "djevicom", null], ["devicu", "djevicu", null],
      ["devičanska", "djevičanska", null], ["devičanske", "djevičanske", null],
      ["devičanski", "djevičanski", null], ["devičanskih", "djevičanskih", null],
      ["devičanskim", "djevičanskim", null], ["devičansko", "djevičansko", null],
      ["devičanskoj", "djevičanskoj", null], ["devičanskom", "djevičanskom", null],
      ["devičansku", "djevičansku", null]
    ], "Unicode CLDR territory comparison plus srLex/hrLex morphology audit")
  ]);

  const CURATED_GROUPS = FAMILIES.flatMap((entry) => entry.forms);
  const lexiconIkavianByPair = new Map((lexiconData?.pairs || [])
    .filter(([, , ikavian]) => typeof ikavian === "string" && ikavian)
    .map(([ekavian, ijekavian, ikavian]) => [`${ekavian}\u0000${ijekavian}`, ikavian]));
  const runtimeCuratedGroups = CURATED_GROUPS.map(([ekavian, ijekavian, ikavian]) =>
    Object.freeze([
      ekavian,
      ijekavian,
      ikavian || lexiconIkavianByPair.get(`${ekavian}\u0000${ijekavian}`) || null
    ]));
  const reviewedPairs = new Set(CURATED_GROUPS.map(([ekavian, ijekavian]) => `${ekavian}\u0000${ijekavian}`));
  const reviewedTargets = new Map();
  for (const [ekavian, ijekavian] of CURATED_GROUPS) {
    if (!reviewedTargets.has(ekavian)) reviewedTargets.set(ekavian, new Set());
    reviewedTargets.get(ekavian).add(ijekavian);
  }
  // These corpus outliers conflict with established reviewed forms rather than
  // exposing a contextual ambiguity. Keep the reviewed standard form.
  const reviewedPreferredEkavian = new Set(["video", "zahtevati"]);
  const reportedAmbiguousEkavian = new Set(comtextData?.ambiguousEkavian || []);
  const corpusGroups = (comtextData?.pairs || [])
    .filter(([ekavian, ijekavian]) => !reviewedPairs.has(`${ekavian}\u0000${ijekavian}`))
    .filter(([ekavian, ijekavian]) => {
      const reviewed = reviewedTargets.get(ekavian);
      if (!reviewed || reviewed.has(ijekavian)) return true;
      return reportedAmbiguousEkavian.has(ekavian) && !reviewedPreferredEkavian.has(ekavian);
    })
    .map(([ekavian, ijekavian]) => Object.freeze([
      ekavian,
      ijekavian,
      lexiconIkavianByPair.get(`${ekavian}\u0000${ijekavian}`) || null
    ]));
  const embeddedPairKeys = new Set([
    ...reviewedPairs,
    ...corpusGroups.map(([ekavian, ijekavian]) => `${ekavian}\u0000${ijekavian}`)
  ]);
  const lexiconGroups = (lexiconData?.pairs || [])
    .filter(([ekavian, ijekavian]) => !embeddedPairKeys.has(`${ekavian}\u0000${ijekavian}`))
    .map(([ekavian, ijekavian, ikavian]) => Object.freeze([ekavian, ijekavian, ikavian || null]));
  const GROUPS = Object.freeze([...runtimeCuratedGroups, ...corpusGroups, ...lexiconGroups]);

  function findAmbiguousForms(dialectIndex) {
    const counts = new Map();
    for (const forms of GROUPS) {
      const form = forms[dialectIndex];
      if (form) counts.set(form, (counts.get(form) || 0) + 1);
    }
    return Object.freeze(Array.from(counts)
      .filter(([, count]) => count > 1)
      .map(([form]) => form)
      .sort((left, right) => left.localeCompare(right, "sr")));
  }

  const actualAmbiguousEkavian = findAmbiguousForms(0);
  const actualAmbiguousIjekavian = findAmbiguousForms(1);
  const actualAmbiguousIkavian = findAmbiguousForms(2);
  const SOURCES = Object.freeze({
    curatedFamilies: FAMILIES.length,
    ambiguities: Object.freeze({
      ekavian: actualAmbiguousEkavian,
      ijekavian: actualAmbiguousIjekavian,
      ikavian: actualAmbiguousIkavian
    }),
    comtext: comtextData ? Object.freeze({
      source: comtextData.source,
      commit: comtextData.commit,
      tokenCount: comtextData.tokenCount,
      distinctPairs: comtextData.pairs.length,
      addedPairs: corpusGroups.length,
      reportedAmbiguousEkavian: comtextData.ambiguousEkavian,
      reportedAmbiguousIjekavian: comtextData.ambiguousIjekavian
    }) : null,
    lexicons: lexiconData ? Object.freeze({
      license: lexiconData.license,
      sources: lexiconData.sources,
      relationSources: lexiconData.relationSources,
      relationVocabularyExhaustive: lexiconData.relationVocabularyExhaustive,
      lemmaPairsConsidered: lexiconData.lemmaPairsConsidered,
      matchedLemmaPairs: lexiconData.matchedLemmaPairs,
      sourceRows: lexiconData.sourceRows,
      distinctPairs: lexiconData.pairs.length,
      ikavianPairs: lexiconData.pairs.filter(([, , ikavian]) => Boolean(ikavian)).length,
      addedPairs: lexiconGroups.length
    }) : null
  });
  const api = Object.freeze({ version: "0.9.1", FAMILIES, GROUPS, SOURCES });

  root.PrepisiDialectData = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
