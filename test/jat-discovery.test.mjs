import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  LEXICON_SOURCES,
  addFrequencyObservation,
  evaluateCandidateForms,
  findFamilyAnchor,
  generateEkavianCandidates,
  generateIToECandidates,
  isAllowedJatPair,
  isEligibleLexeme,
  parseLexiconLine,
  summariseLemmaFrequencies
} from "../scripts/lib/lexicon-utils.mjs";

test("parses the official eight-column lexicon shape and excludes unsuitable lemmas", () => {
  const noun = parseLexiconLine("vremena\tvrijeme\tNcnpg\t_\tNOUN\t_\t120\t1.2");
  assert.deepEqual(noun, {
    wordform: "vremena", lemma: "vrijeme", msd: "Ncnpg", upos: "NOUN", frequency: 120
  });
  assert.equal(isEligibleLexeme(noun), true);
  assert.equal(isEligibleLexeme(parseLexiconLine("Google\tGoogle\tNp\t_\tPROPN\t_\t90\t0.9")), false);
  assert.equal(parseLexiconLine("too\tfew\tfields"), null);
});

test("deduplicates repeated analyses before summing lemma-family frequency", () => {
  const lemmas = new Map();
  addFrequencyObservation(lemmas, { lemma: "vrijeme", wordform: "vrijeme", frequency: 100, upos: "NOUN" });
  addFrequencyObservation(lemmas, { lemma: "vrijeme", wordform: "vrijeme", frequency: 100, upos: "NOUN" });
  addFrequencyObservation(lemmas, { lemma: "vrijeme", wordform: "vremena", frequency: 40, upos: "NOUN" });
  assert.deepEqual(summariseLemmaFrequencies(lemmas), [
    { lemma: "vrijeme", frequency: 140, upos: ["NOUN"] }
  ]);
});

test("generates one or more je/ije replacements and an auditable Ikavian suggestion", () => {
  const vrijeme = generateEkavianCandidates("vrijeme").find((candidate) => candidate.ekavian === "vreme");
  assert.equal(vrijeme.ikavianSuggestion, "vrime");
  assert.ok(generateEkavianCandidates("sljedeći").some((candidate) => candidate.ekavian === "sledeći"));
  assert.ok(generateEkavianCandidates("obavještenje").some((candidate) => candidate.ekavian === "obaveštene"));
  assert.equal(isAllowedJatPair("bezbjednost", "bezbednost"), true);
  assert.equal(isAllowedJatPair("doktor", "daktor"), false);
});

test("keeps i to e discovery separate for review-only reflexes", () => {
  assert.ok(generateIToECandidates("dio").some((candidate) => candidate.ekavian === "deo"));
  assert.equal(generateEkavianCandidates("dio").length, 0);
});

test("requires a same-reflex family anchor to block semantic lookalikes", () => {
  const anchors = [
    { ekavian: "mleko", ijekavian: "mlijeko", skeleton: "mlěko", rule: "ije→e" },
    { ekavian: "mera", ijekavian: "mjera", skeleton: "měra", rule: "je→e" }
  ];
  const mlecan = generateEkavianCandidates("mliječan").find((candidate) => candidate.ekavian === "mlečan");
  const premijera = generateEkavianCandidates("premijera").find((candidate) => candidate.ekavian === "premera");
  assert.equal(findFamilyAnchor({ ...mlecan, type: "jat" }, anchors).ekavian, "mleko");
  assert.equal(findFamilyAnchor({ ...premijera, type: "jat" }, anchors), null);
});

test("documents the reviewed semantic rejection that spelling cannot resolve", async () => {
  const { readFile } = await import("node:fs/promises");
  const blocked = JSON.parse(await readFile(new URL("../data/jat-discovery/blocked.json", import.meta.url), "utf8"));
  assert.ok(blocked.pairs.some((entry) => entry.ekavian === "preko" && entry.ijekavian === "prijeko"));
});

test("keeps human candidate decisions outside the generated report", async () => {
  const { readFile } = await import("node:fs/promises");
  const { parseReviewCsv } = await import("../scripts/apply-jat-reviews.mjs");
  const reviews = parseReviewCsv(await readFile(new URL("../data/jat-discovery/reviews.csv", import.meta.url), "utf8"));
  const nemanja = reviews.find((entry) => entry.ekavian_lemma === "sudelovanje");
  assert.deepEqual(nemanja, {
    decision: "approve", reviewer: "Nemanja", ekavian_lemma: "sudelovanje",
    ijekavian_lemma: "sudjelovanje", notes: ""
  });
  const human = JSON.parse(await readFile(new URL("../data/lemma-relations/human-reviewed.json", import.meta.url), "utf8"));
  assert.ok(human.pairs.some(([ekavian, ijekavian]) => ekavian === "sudelovanje" && ijekavian === "sudjelovanje"));
});

test("pins the manually audited strict accepted-pair set", async () => {
  const { readFile } = await import("node:fs/promises");
  const { createHash } = await import("node:crypto");
  const relation = JSON.parse(await readFile(new URL("../data/lemma-relations/generated-frequent.json", import.meta.url), "utf8"));
  const audit = JSON.parse(await readFile(new URL("../data/jat-discovery/audit.json", import.meta.url), "utf8"));
  const hash = createHash("sha256").update(JSON.stringify(relation.pairs)).digest("hex");
  assert.equal(relation.pairs.length, audit.acceptedPairCount);
  assert.equal(hash, audit.acceptedPairsSha256);
});

test("counts unique compatible morphology and reports ambiguous slots", () => {
  const ekavian = new Map([
    ["N1", new Set(["vreme"])],
    ["N2", new Set(["vremena"])],
    ["N3", new Set(["vremenu", "vremenuje"])]
  ]);
  const ijekavian = new Map([
    ["N1", new Set(["vrijeme"])],
    ["N2", new Set(["vremena"])],
    ["N3", new Set(["vremenu", "vrijemenu"])]
  ]);
  const evidence = evaluateCandidateForms(ekavian, ijekavian);
  assert.equal(evidence.compatibleMsdSlots, 3);
  assert.equal(evidence.changedSurfacePairs, 2);
  assert.equal(evidence.ambiguousMsdSlots, 0);

  const ambiguous = evaluateCandidateForms(
    new Map([["N1", new Set(["vreme"])]]),
    new Map([["N1", new Set(["vrijeme", "vrjeme"])]]),
  );
  assert.equal(ambiguous.ambiguousMsdSlots, 1);
});

test("pins the official v1.3 archive sizes and SHA-256 hashes", () => {
  assert.equal(LEXICON_SOURCES.srLex.compressedBytes, 56796017);
  assert.equal(LEXICON_SOURCES.hrLex.compressedBytes, 54477922);
  assert.match(LEXICON_SOURCES.srLex.sha256, /^[0-9a-f]{64}$/u);
  assert.match(LEXICON_SOURCES.hrLex.sha256, /^[0-9a-f]{64}$/u);
});

test("country and demonym audit records evidence and explicit corpus gaps", () => {
  const audit = JSON.parse(fs.readFileSync(
    new URL("../research/generated/country-demonym-audit.json", import.meta.url), "utf8"
  ));
  const byPair = new Map(audit.candidates.map((entry) =>
    [`${entry.ekavian}\u0000${entry.ijekavian}`, entry]));
  const germany = byPair.get("nemačka\u0000njemačka");
  const germans = byPair.get("nemac\u0000nijemac");
  assert.equal(germany.compatibleMsdSlots, 13);
  assert.equal(germany.ambiguousMsdSlots, 0);
  assert.equal(germans.compatibleMsdSlots, 14);
  assert.equal(germans.ambiguousMsdSlots, 0);
  assert.equal(byPair.get("nemica\u0000njemica").srLex.present, false);
  assert.equal(byPair.get("belorusija\u0000bjelorusija").srLex.present, false);
  assert.equal(byPair.get("severnokorejski\u0000sjevernokorejski").compatibleMsdSlots, 28);
  assert.equal(byPair.get("devica\u0000djevica").compatibleMsdSlots, 13);
  assert.equal(byPair.get("devičanski\u0000djevičanski").compatibleMsdSlots, 27);
});

test("pins the complete CLDR territory comparison and its jat families", () => {
  const report = JSON.parse(fs.readFileSync(
    new URL("../research/generated/cldr-territory-comparison.json", import.meta.url), "utf8"
  ));
  assert.equal(report.version, "48.1.0");
  assert.equal(report.territoryCount, 264);
  assert.equal(report.identicalCount, 174);
  assert.equal(report.differingCount, 90);

  const byCode = new Map(report.territories.map((entry) => [entry.code, entry]));
  assert.deepEqual(byCode.get("DE"), {
    code: "DE", srLatn: "Nemačka", hr: "Njemačka", bs: "Njemačka"
  });
  assert.deepEqual(byCode.get("BY"), {
    code: "BY", srLatn: "Belorusija", hr: "Bjelorusija", bs: "Bjelorusija"
  });
  assert.deepEqual(
    ["KP", "MK", "MP"].map((code) => byCode.get(code).srLatn),
    ["Severna Koreja", "Severna Makedonija", "Severna Marijanska Ostrva"]
  );
  assert.deepEqual(
    ["VG", "VI"].map((code) => byCode.get(code).bs),
    ["Britanska Djevičanska ostrva", "Američka Djevičanska ostrva"]
  );
});
