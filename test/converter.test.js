"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const converter = require("../src/converter.js");

const script = (targetScript) => ({ targetScript, targetDialect: "original" });
const dialect = (targetDialect, targetScript = "original") => ({ targetScript, targetDialect });

test("converts Serbian Latin text to Cyrillic, including digraphs", () => {
  assert.equal(
    converter.convertText("Njegoš voli džez u Ljubljani.", script("cyrillic")),
    "Његош воли џез у Љубљани."
  );
});

test("converts Cyrillic to Latin with title-case and all-caps digraphs", () => {
  assert.equal(converter.convertText("Љубљана и Његош", script("latin")), "Ljubljana i Njegoš");
  assert.equal(converter.convertText("ЉУБЉАНА И ЊЕГОШ", script("latin")), "LJUBLJANA I NJEGOŠ");
});

test("converts the additional Montenegrin letters in both scripts", () => {
  const latin = "Śekira i źenica. ŚEKIRA.";
  const cyrillic = "С́екира и з́еница. С́ЕКИРА.";
  assert.equal(converter.convertText(latin, script("cyrillic")), cyrillic);
  assert.equal(converter.convertText(cyrillic, script("latin")), latin);
});

test("keeps morphological non-digraphs separate in Latin-to-Cyrillic conversion", () => {
  assert.equal(
    converter.convertText("injekcija konjugacija nadživeti podžanr", script("cyrillic")),
    "инјекција конјугација надживети поджанр"
  );
});

test("keeps d+j separate from the letters đ and dž", () => {
  assert.equal(converter.convertText("ovdje, đe i džem", script("cyrillic")), "овдје, ђе и џем");
  assert.equal(converter.convertText("овдје, ђе и џем", script("latin")), "ovdje, đe i džem");
});

test("does not create mixed-script words for unsupported Latin letters", () => {
  assert.equal(converter.convertText("Washington quiz", script("cyrillic")), "Washington quiz");
});

test("converts common Ekavian forms to Ijekavian", () => {
  assert.equal(
    converter.convertText("Mleko, dete i lepo vreme. Sledeće mesto.", dialect("ijekavian")),
    "Mlijeko, dijete i lijepo vrijeme. Sljedeće mjesto."
  );
});

test("converts the reported N1 wind headline in both dialect directions", () => {
  const ekavian = "Zamenik načelnika kaže da će u Deliblatskoj peščari najveći problem biti vetar promenljivog pravca.";
  const ijekavian = "Zamjenik načelnika kaže da će u Deliblatskoj pješčari najveći problem biti vjetar promjenljivog pravca.";
  assert.equal(converter.convertText(ekavian, dialect("ijekavian")), ijekavian);
  assert.equal(converter.convertText(ijekavian, dialect("ekavian")), ekavian);
});

test("converts corpus-audited Germany and German demonym forms in both directions", () => {
  const ekavian = "Nemačka, nemački mediji, Nemac, Nemci, Nemcu i Nemcima.";
  const ijekavian = "Njemačka, njemački mediji, Nijemac, Nijemci, Nijemcu i Nijemcima.";
  assert.equal(converter.convertText(ekavian, dialect("ijekavian")), ijekavian);
  assert.equal(converter.convertText(ijekavian, dialect("ekavian")), ekavian);
  assert.equal(converter.convertText("putuje u Njemačku", dialect("ekavian")), "putuje u Nemačku");
  assert.equal(
    converter.convertText("Nemica, Nemice, Nemici i Nemicom.", dialect("ijekavian")),
    "Njemica, Njemice, Njemici i Njemicom."
  );
  assert.equal(
    converter.convertText("njemačkoga autora i njemačkome čitaocu", dialect("ekavian")),
    "nemačkoga autora i nemačkome čitaocu"
  );
});

test("converts audited geographic north and Belarusian adjective forms", () => {
  assert.equal(
    converter.convertText("Severna Makedonija i beloruski mediji", dialect("ijekavian")),
    "Sjeverna Makedonija i bjeloruski mediji"
  );
  assert.equal(
    converter.convertText("Sjeverna Koreja i bjeloruske vlasti", dialect("ekavian")),
    "Severna Koreja i beloruske vlasti"
  );
});

test("converts the CLDR-identified North Korean and Virgin Islands families", () => {
  assert.equal(
    converter.convertText("Severnokorejac i severnokorejski mediji", dialect("ijekavian")),
    "Sjevernokorejac i sjevernokorejski mediji"
  );
  assert.equal(
    converter.convertText("Britanska Devičanska Ostrva", dialect("ijekavian")),
    "Britanska Djevičanska Ostrva"
  );
  assert.equal(
    converter.convertText("Američka Djevičanska ostrva", dialect("ekavian")),
    "Američka Devičanska ostrva"
  );
});

test("changes reviewed jat forms without changing unrelated e in reći", () => {
  assert.equal(
    converter.convertText("Teško je reći: vetar duva.", dialect("ijekavian")),
    "Teško je reći: vjetar duva."
  );
});

test("uses embedded corpus forms in both directions", () => {
  const ekavian = "Bela boja, maloletnika izbegne i obezbeđen je.";
  const ijekavian = "Bijela boja, maloljetnika izbjegne i obezbijeđen je.";
  assert.equal(converter.convertText(ekavian, dialect("ijekavian")), ijekavian);
  assert.equal(converter.convertText(ijekavian, dialect("ekavian")), ekavian);
});

test("uses a lexicon-expanded form absent from the aligned corpus rows", () => {
  assert.equal(converter.convertText("nedeljna emisija", dialect("ijekavian")), "nedjeljna emisija");
  assert.equal(converter.convertText("nedjeljna emisija", dialect("ekavian")), "nedeljna emisija");
});

test("uses strict frequency-ranked families while withholding semantic lookalikes", () => {
  const ekavian = "Sudelovati, devojčica i potpredsednica predsedaju.";
  const ijekavian = "Sudjelovati, djevojčica i potpredsjednica predsjedaju.";
  assert.equal(converter.convertText(ekavian, dialect("ijekavian")), ijekavian);
  assert.equal(converter.convertText(ijekavian, dialect("ekavian")), ekavian);
  assert.equal(converter.convertText("preko i premijera", dialect("ijekavian")), "preko i premijera");
  assert.equal(converter.convertText("prijeko i premijera", dialect("ekavian")), "prijeko i premijera");
});

test("uses the migrated Nemanja-reviewed noun relation in both directions", () => {
  assert.equal(converter.convertText("Sudelovanje i sudelovanja", dialect("ijekavian")),
    "Sudjelovanje i sudjelovanja");
  assert.equal(converter.convertText("Sudjelovanje i sudjelovanja", dialect("ekavian")),
    "Sudelovanje i sudelovanja");
});

test("withholds ambiguous Ekavian forms while keeping safe reverse mappings", () => {
  assert.equal(converter.convertText("dela zahteva", dialect("ijekavian")), "dela zahteva");
  assert.equal(converter.convertText("dijela i djela", dialect("ekavian")), "dela i dela");
  assert.equal(converter.convertText("zahtjeva i zahtijeva", dialect("ekavian")), "zahteva i zahteva");
});

test("converts Ijekavian Cyrillic to Ekavian Latin in one pass", () => {
  assert.equal(
    converter.convertText("Млијеко и дијете, ријека и снијег.", dialect("ekavian", "latin")),
    "Mleko i dete, reka i sneg."
  );
});

test("converts Ijekavian forms to experimental Ikavian forms", () => {
  assert.equal(
    converter.convertText("Vrijeme, mlijeko i lijepo mjesto.", dialect("ikavian")),
    "Vrime, mliko i lipo misto."
  );
});

test("uses corpus-attested Ikavian forms across inflections in both directions", () => {
  assert.equal(
    converter.convertText(
      "Mjeseca, tijela, vrijednosti, djela, ljepota, zvijezde, svjetlost, cijevi i zvijeri.",
      dialect("ikavian")
    ),
    "Miseca, tila, vridnosti, dila, lipota, zvizde, svitlost, civi i zviri."
  );
  assert.equal(
    converter.convertText("Miseca, tila, vridnosti, dila i zviri.", dialect("ijekavian")),
    "Mjeseca, tijela, vrijednosti, djela i zvijeri."
  );
  assert.equal(converter.convertText("briga, bilo, plin i umiren", dialect("ijekavian")),
    "briga, bilo, plin i umiren");
});

test("dialect conversion preserves capitalization", () => {
  assert.equal(converter.convertText("MLIJEKO Mlijeko mlijeko", dialect("ekavian")), "MLEKO Mleko mleko");
});

test("preserves built-in brands, URLs, email addresses and handles", () => {
  const source = "Google čita vesti na https://primer.rs/mesto; piši a@primer.rs ili @moj_nalog.";
  assert.equal(
    converter.convertText(source, script("cyrillic")),
    "Google чита вести на https://primer.rs/mesto; пиши a@primer.rs или @moj_nalog."
  );
});

test("preserves custom names as whole terms", () => {
  assert.equal(
    converter.convertText("Moja Firma čita tekst, ali FirmaX nije isto.", {
      ...script("cyrillic"),
      customProtectedTerms: ["Moja Firma"]
    }),
    "Moja Firma чита текст, али FirmaX није исто."
  );
});

test("preserves stylized and foreign multiword names without freezing local names", () => {
  const source = "OpenAI i N1 prate Harry Kanea u Luštica Bay, a Crna Gora čita vesti.";
  assert.equal(
    converter.convertText(source, script("cyrillic")),
    "OpenAI и N1 прате Harry Kanea у Luštica Bay, а Црна Гора чита вести."
  );
});

test("preserves foreign-name spelling as a separate concern from dialect conversion", () => {
  assert.equal(
    converter.convertText("Richterova skala i vetar", dialect("ijekavian")),
    "Richterova skala i vjetar"
  );
  assert.equal(
    converter.convertText("Richterova skala", script("cyrillic")),
    "Richterova скала"
  );
  assert.equal(
    converter.convertText("Rihterova skala", script("cyrillic")),
    "Рихтерова скала"
  );
});

test("preserves letter-number and camel-case brands discovered in live headlines", () => {
  assert.equal(
    converter.convertText("Boom93, HRT1 i TikToker koriste OpenAI.", script("cyrillic")),
    "Boom93, HRT1 и TikToker користе OpenAI."
  );
});

test("preserves case-sensitive brands without freezing their lowercase homonyms", () => {
  assert.equal(
    converter.convertText("Meta ima metu, a Luštica Bay-u slijedi popust.", script("cyrillic")),
    "Meta има мету, а Luštica Bay-у слиједи попуст."
  );
});

test("protects the bundled company lists only in official capitalization", () => {
  assert.equal(converter.DEFAULT_CASE_SENSITIVE_TERMS.includes("Orange"), true);
  assert.equal(converter.DEFAULT_CASE_SENSITIVE_TERMS.includes("Volkswagen Group"), true);
  assert.equal(
    converter.convertText("Orange i Target, ali orange i target.", script("cyrillic")),
    "Orange и Target, али оранге и таргет."
  );
});

test("reports exact output ranges for dialect changes only", () => {
  const converted = converter.convertTextDetailed("Vetar i lepo mesto.", {
    targetScript: "cyrillic", targetDialect: "ijekavian"
  });
  assert.equal(converted.text, "Вјетар и лијепо мјесто.");
  assert.deepEqual(
    converted.dialectRanges.map((range) => converted.text.slice(range.start, range.end)),
    ["Вјетар", "лијепо", "мјесто"]
  );
  assert.deepEqual(converter.convertTextDetailed("Lepo mesto", script("cyrillic")).dialectRanges, []);
});

test("original mode is an exact no-op", () => {
  const source = "Latinica, ћирилица, Google & riječ — isto.";
  assert.equal(converter.convertText(source), source);
});

test("script conversion round-trips representative unambiguous text", () => {
  const source = "Njegoš čita pažljivo i sluša džez.";
  const cyrillic = converter.convertText(source, script("cyrillic"));
  assert.equal(converter.convertText(cyrillic, script("latin")), source);
});

test("matches the paired RTS Latin and Cyrillic article text", () => {
  const latin = "Prva grupa potrošača nema vodu od do 18 časova, a druga grupa potrošača večeras od 18.00 do 06.00 narednog dana. Kako su najavili iz Opštinske uprave, tamo gde budu uvedene restrikcije trebalo bi da budu obezbeđene i mobilne i stacionarne cisterne sa pijaćom vodom.";
  const cyrillic = "Прва група потрошача нема воду од до 18 часова, а друга група потрошача вечерас од 18.00 до 06.00 наредног дана. Како су најавили из Општинске управе, тамо где буду уведене рестрикције требало би да буду обезбеђене и мобилне и стационарне цистерне са пијаћом водом.";
  assert.equal(converter.convertText(latin, script("cyrillic")), cyrillic);
  assert.equal(converter.convertText(cyrillic, script("latin")), latin);
});

test("every embedded form converts in every unambiguous supported direction", () => {
  const dialects = ["ekavian", "ijekavian", "ikavian"];
  const ambiguous = {
    ekavian: new Set(converter.DIALECT_SOURCES.ambiguities.ekavian),
    ijekavian: new Set(converter.DIALECT_SOURCES.ambiguities.ijekavian),
    ikavian: new Set(converter.DIALECT_SOURCES.ambiguities.ikavian)
  };
  for (const forms of converter.DIALECT_GROUPS) {
    for (const [sourceIndex, source] of forms.entries()) {
      if (!source) continue;
      dialects.forEach((targetDialect, targetIndex) => {
        const sourceDialect = dialects[sourceIndex];
        const expected = ambiguous[sourceDialect].has(source)
          ? source
          : (forms[targetIndex] || source);
        assert.equal(
          converter.convertDialectLatin(source, targetDialect),
          expected,
          `${source} → ${targetDialect}`
        );
      });
    }
  }
});

test("dialect data is organised as auditable word families", () => {
  const wind = converter.DIALECT_FAMILIES.find((entry) => entry.id === "wind");
  assert.ok(wind);
  assert.deepEqual(Array.from(wind.forms[0]), ["vetar", "vjetar", "vitar"]);
  assert.equal(converter.DIALECT_SOURCES.comtext.distinctPairs, 748);
  assert.equal(converter.DIALECT_SOURCES.comtext.tokenCount, 105470);
  assert.equal(converter.DIALECT_SOURCES.lexicons.sourceRows.srLex, 6905941);
  assert.equal(converter.DIALECT_SOURCES.lexicons.sourceRows.hrLex, 6427709);
  assert.equal(converter.DIALECT_SOURCES.lexicons.relationVocabularyExhaustive, false);
  assert.equal(converter.DIALECT_SOURCES.lexicons.lemmaPairsConsidered, 412);
  assert.equal(converter.DIALECT_SOURCES.lexicons.distinctPairs, 3845);
  assert.equal(converter.DIALECT_SOURCES.lexicons.ikavianPairs, 80);
  const human = converter.DIALECT_SOURCES.lexicons.relationSources
    .find((source) => source.status === "reviewed" && source.role === "primary-human-review");
  assert.equal(human.suppliedPairs, 1);
  const generated = converter.DIALECT_SOURCES.lexicons.relationSources
    .find((source) => source.status === "generated-strict");
  assert.equal(generated.suppliedPairs, 58);
  assert.equal(generated.releaseAuditPassed, true);
  const ikavian = converter.DIALECT_SOURCES.lexicons.relationSources
    .find((source) => source.status === "corpus-attested-reviewed");
  assert.equal(ikavian.suppliedPairs, 15);
  assert.equal(ikavian.license, "CC BY-SA 4.0");
  assert.equal(ikavian.source, "https://hdl.handle.net/11356/1765");
  assert.equal(
    converter.DIALECT_SOURCES.lexicons.relationSources.find((source) => source.status === "corpus-observed").role,
    "secondary"
  );
  assert.ok(converter.DIALECT_SOURCES.lexicons.addedPairs > 0);
});
