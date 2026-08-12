import { createReadStream, createWriteStream } from "node:fs";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { once } from "node:events";
import { createHash } from "node:crypto";
import { createInterface } from "node:readline";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  LEXICON_SOURCES,
  addFrequencyObservation,
  csvCell,
  evaluateCandidateForms,
  findFamilyAnchor,
  generateEkavianCandidates,
  generateIToECandidates,
  isEligibleLexeme,
  iterateGzipLines,
  normalise,
  parseLexiconLine,
  summariseLemmaFrequencies,
  withLexiconArchives
} from "./lib/lexicon-utils.mjs";

const require = createRequire(import.meta.url);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TOP_LEMMAS = 10000;
const PARTITIONS = 64;
const MIN_MSD_SLOTS = 3;
const MIN_CHANGED_PAIRS = 2;
const GENERATED_FILENAME = "generated-frequent.json";

function hashPartition(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % PARTITIONS;
}

async function closeStreams(streams) {
  await Promise.all(streams.map((stream) => new Promise((resolve, reject) => {
    stream.once("error", reject);
    stream.end(resolve);
  })));
}

async function rankHrLemmas(hrLexPath, workDirectory) {
  const partitionPaths = Array.from({ length: PARTITIONS }, (_, index) =>
    path.join(workDirectory, `frequency-${String(index).padStart(2, "0")}.tsv`));
  const streams = partitionPaths.map((partitionPath) => createWriteStream(partitionPath, { encoding: "utf8" }));
  let rows = 0;
  let eligibleRows = 0;
  let malformedRows = 0;

  try {
    for await (const line of iterateGzipLines(hrLexPath)) {
      rows += 1;
      const entry = parseLexiconLine(line);
      if (!entry) {
        malformedRows += 1;
        continue;
      }
      if (!isEligibleLexeme(entry)) continue;
      eligibleRows += 1;
      const stream = streams[hashPartition(entry.lemma)];
      if (!stream.write(`${entry.lemma}\t${entry.wordform}\t${entry.frequency}\t${entry.upos}\n`)) {
        await once(stream, "drain");
      }
    }
  } finally {
    await closeStreams(streams);
  }

  if (rows !== LEXICON_SOURCES.hrLex.rows || malformedRows > 0) {
    throw new Error(`hrLex format check failed: ${rows} rows, ${malformedRows} malformed`);
  }

  const ranked = [];
  for (const partitionPath of partitionPaths) {
    const lemmas = new Map();
    const lines = createInterface({ input: createReadStream(partitionPath), crlfDelay: Infinity });
    for await (const line of lines) {
      const [lemma, wordform, frequencyText, upos] = line.split("\t");
      addFrequencyObservation(lemmas, {
        lemma, wordform, frequency: Number(frequencyText), upos
      });
    }
    ranked.push(...summariseLemmaFrequencies(lemmas));
    await rm(partitionPath, { force: true });
  }

  ranked.sort((left, right) => right.frequency - left.frequency || left.lemma.localeCompare(right.lemma, "hr"));
  return Object.freeze({
    rows,
    eligibleRows,
    distinctEligibleLemmas: ranked.length,
    top: Object.freeze(ranked.slice(0, TOP_LEMMAS).map((record, index) =>
      Object.freeze({ ...record, rank: index + 1 })))
  });
}

async function indexSrLemmas(srLexPath) {
  const lemmas = new Map();
  let rows = 0;
  let malformedRows = 0;
  for await (const line of iterateGzipLines(srLexPath)) {
    rows += 1;
    const entry = parseLexiconLine(line);
    if (!entry) {
      malformedRows += 1;
      continue;
    }
    if (!isEligibleLexeme(entry)) continue;
    if (!lemmas.has(entry.lemma)) lemmas.set(entry.lemma, new Set());
    lemmas.get(entry.lemma).add(entry.upos);
  }
  if (rows !== LEXICON_SOURCES.srLex.rows || malformedRows > 0) {
    throw new Error(`srLex format check failed: ${rows} rows, ${malformedRows} malformed`);
  }
  return Object.freeze({ rows, lemmas });
}

function sharedValues(left, right) {
  return Array.from(left).filter((value) => right.has(value)).sort();
}

function candidateKey(ekavian, ijekavian) {
  return `${ekavian}\u0000${ijekavian}`;
}

function findLemmaCandidates(hrRanking, srIndex) {
  const candidates = new Map();
  for (const hr of hrRanking.top) {
    const hrUpos = new Set(hr.upos);
    const generated = [
      ...generateEkavianCandidates(hr.lemma).map((candidate) => ({ ...candidate, type: "jat" })),
      ...generateIToECandidates(hr.lemma).map((candidate) => ({ ...candidate, type: "i-reflex" }))
    ];
    for (const generatedCandidate of generated) {
      const srUpos = srIndex.lemmas.get(generatedCandidate.ekavian);
      if (!srUpos) continue;
      const sharedUpos = sharedValues(hrUpos, srUpos);
      if (!sharedUpos.length) continue;
      const key = candidateKey(generatedCandidate.ekavian, hr.lemma);
      const existing = candidates.get(key);
      const candidate = Object.freeze({
        ...generatedCandidate,
        frequency: hr.frequency,
        rank: hr.rank,
        sharedUpos: Object.freeze(sharedUpos)
      });
      if (!existing || (existing.type === "i-reflex" && candidate.type === "jat")) candidates.set(key, candidate);
    }
  }
  return Array.from(candidates.values()).sort((left, right) =>
    left.rank - right.rank || left.ekavian.localeCompare(right.ekavian, "sr"));
}

async function loadHigherTrustRelations() {
  const comtextData = require(path.join(projectRoot, "src", "generated", "comtext-pairs.js"));
  const pairs = comtextData.lemmaPairs.map(([ekavian, ijekavian]) => [normalise(ekavian), normalise(ijekavian)]);
  const relationDirectory = path.join(projectRoot, "data", "lemma-relations");
  for (const filename of (await readdir(relationDirectory)).filter((name) =>
    name.endsWith(".json") && name !== GENERATED_FILENAME).sort()) {
    const parsed = JSON.parse(await readFile(path.join(relationDirectory, filename), "utf8"));
    for (const [ekavian, ijekavian] of parsed.pairs || []) pairs.push([normalise(ekavian), normalise(ijekavian)]);
  }
  const exact = new Set();
  const targets = new Map();
  const sources = new Map();
  const anchors = [];
  for (const [ekavian, ijekavian] of pairs) {
    exact.add(candidateKey(ekavian, ijekavian));
    if (!targets.has(ekavian)) targets.set(ekavian, new Set());
    if (!sources.has(ijekavian)) sources.set(ijekavian, new Set());
    targets.get(ekavian).add(ijekavian);
    sources.get(ijekavian).add(ekavian);
    for (const generated of generateEkavianCandidates(ijekavian)) {
      if (generated.ekavian === ekavian) anchors.push(Object.freeze({
        ekavian, ijekavian, skeleton: generated.skeleton, rule: generated.rule
      }));
    }
  }
  const blockedPath = path.join(projectRoot, "data", "jat-discovery", "blocked.json");
  const blockedData = JSON.parse(await readFile(blockedPath, "utf8"));
  const blocked = new Map((blockedData.pairs || []).map((entry) => [
    candidateKey(normalise(entry.ekavian), normalise(entry.ijekavian)),
    entry.reason || "reviewed semantic rejection"
  ]));
  return Object.freeze({ exact, targets, sources, anchors: Object.freeze(anchors), blocked });
}

async function collectRelevantForms(source, archivePath, relevantLemmas) {
  const forms = new Map();
  let rows = 0;
  let malformedRows = 0;
  for await (const line of iterateGzipLines(archivePath)) {
    rows += 1;
    const entry = parseLexiconLine(line);
    if (!entry) {
      malformedRows += 1;
      continue;
    }
    if (!relevantLemmas.has(entry.lemma) || !isEligibleLexeme(entry)) continue;
    if (!forms.has(entry.lemma)) forms.set(entry.lemma, new Map());
    const byMsd = forms.get(entry.lemma);
    if (!byMsd.has(entry.msd)) byMsd.set(entry.msd, new Set());
    byMsd.get(entry.msd).add(entry.wordform);
  }
  if (rows !== source.rows || malformedRows > 0) {
    throw new Error(`${source.name} form pass failed: ${rows} rows, ${malformedRows} malformed`);
  }
  return forms;
}

function addMapping(map, key, value) {
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(value);
}

function evaluateCandidates(candidates, higherTrust, srForms, hrForms) {
  const targets = new Map();
  const sources = new Map();
  for (const candidate of candidates.filter((entry) => entry.type === "jat")) {
    addMapping(targets, candidate.ekavian, candidate.ijekavian);
    addMapping(sources, candidate.ijekavian, candidate.ekavian);
  }

  return candidates.map((candidate) => {
    const evidence = evaluateCandidateForms(
      srForms.get(candidate.ekavian),
      hrForms.get(candidate.ijekavian)
    );
    const reasons = [];
    const key = candidateKey(candidate.ekavian, candidate.ijekavian);
    const known = higherTrust.exact.has(key);
    const familyAnchor = findFamilyAnchor(candidate, higherTrust.anchors);
    if (candidate.type !== "jat") reasons.push("i-reflex-review-only");
    if (candidate.type === "jat" && !familyAnchor) reasons.push("no-higher-trust-family-anchor");
    if ((targets.get(candidate.ekavian)?.size || 0) !== 1) reasons.push("competing-ijekavian-targets");
    if ((sources.get(candidate.ijekavian)?.size || 0) !== 1) reasons.push("competing-ekavian-sources");
    if (higherTrust.targets.has(candidate.ekavian) && !higherTrust.targets.get(candidate.ekavian).has(candidate.ijekavian)) {
      reasons.push("conflicts-with-higher-trust-ekavian-map");
    }
    if (higherTrust.sources.has(candidate.ijekavian) && !higherTrust.sources.get(candidate.ijekavian).has(candidate.ekavian)) {
      reasons.push("conflicts-with-higher-trust-ijekavian-map");
    }
    if (evidence.compatibleMsdSlots < MIN_MSD_SLOTS) reasons.push("fewer-than-three-compatible-msd-slots");
    if (evidence.changedSurfacePairs < MIN_CHANGED_PAIRS) reasons.push("fewer-than-two-changed-surface-pairs");
    if (evidence.ambiguousMsdSlots > 0) reasons.push("ambiguous-surface-variants");
    if (higherTrust.blocked.has(key)) reasons.push("manually-blocked-semantic-lookalike");

    const status = known ? "known" : (reasons.length ? "review" : "accepted");
    return Object.freeze({
      ...candidate,
      ...evidence,
      familyAnchor: familyAnchor ? `${familyAnchor.ekavian}↔${familyAnchor.ijekavian}` : "",
      status,
      reasons: Object.freeze(reasons)
    });
  });
}

function relationArtifact(accepted, releaseAudit) {
  return {
    name: "Prepiši strict frequency-ranked jat discovery",
    status: "generated-strict",
    role: "supplementary",
    exhaustive: false,
    methodVersion: 1,
    topLemmaFamilies: TOP_LEMMAS,
    thresholds: {
      uniqueBidirectionalLemma: true,
      higherTrustFamilyAnchor: true,
      semanticBlocklist: true,
      compatibleMsdSlots: MIN_MSD_SLOTS,
      changedSurfacePairs: MIN_CHANGED_PAIRS,
      ambiguousMsdSlots: 0
    },
    sourceArchives: Object.fromEntries(Object.entries(LEXICON_SOURCES).map(([key, source]) => [key, {
      name: source.name, handle: source.handle, sha256: source.sha256
    }])),
    releaseAudit,
    pairs: accepted.map((candidate) => [candidate.ekavian, candidate.ijekavian])
  };
}

function acceptedPairsHash(accepted) {
  const pairs = accepted.map((candidate) => [candidate.ekavian, candidate.ijekavian]);
  return createHash("sha256").update(JSON.stringify(pairs)).digest("hex");
}

async function verifyReleaseAudit(accepted) {
  const auditPath = path.join(projectRoot, "data", "jat-discovery", "audit.json");
  let audit = null;
  try {
    audit = JSON.parse(await readFile(auditPath, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const sha256 = acceptedPairsHash(accepted);
  const passed = Boolean(audit &&
    audit.methodVersion === 1 &&
    audit.acceptedPairCount === accepted.length &&
    audit.acceptedPairsSha256 === sha256 &&
    audit.sourceArchives?.srLex === LEXICON_SOURCES.srLex.sha256 &&
    audit.sourceArchives?.hrLex === LEXICON_SOURCES.hrLex.sha256);
  return Object.freeze({
    passed,
    acceptedPairsSha256: sha256,
    reviewedOn: passed ? audit.reviewedOn : null,
    reviewer: passed ? audit.reviewer : null
  });
}

function reviewCsv(evaluated) {
  const headings = [
    "generated_status", "decision", "reviewer", "review_notes",
    "hr_rank", "hr_frequency", "ekavian_lemma", "ijekavian_lemma",
    "ikavian_suggestion", "rule", "family_anchor", "upos", "compatible_msd_slots",
    "changed_surface_pairs", "ambiguous_msd_slots", "reasons"
  ];
  const rows = evaluated.map((candidate) => [
    candidate.status, "", "", "", candidate.rank, candidate.frequency, candidate.ekavian,
    candidate.ijekavian, candidate.ikavianSuggestion, candidate.rule, candidate.familyAnchor,
    candidate.sharedUpos, candidate.compatibleMsdSlots, candidate.changedSurfacePairs,
    candidate.ambiguousMsdSlots, candidate.reasons
  ].map(csvCell).join(","));
  return `${headings.join(",")}\n${rows.join("\n")}\n`;
}

export async function discoverJatCandidates(archives) {
  const workDirectory = await mkdtemp(path.join(os.tmpdir(), "prepisi-jat-discovery-"));
  try {
    const [hrRanking, srIndex, higherTrust] = await Promise.all([
      rankHrLemmas(archives.hrLex, workDirectory),
      indexSrLemmas(archives.srLex),
      loadHigherTrustRelations()
    ]);
    const candidates = findLemmaCandidates(hrRanking, srIndex);
    const srLemmas = new Set(candidates.map((candidate) => candidate.ekavian));
    const hrLemmas = new Set(candidates.map((candidate) => candidate.ijekavian));
    const [srForms, hrForms] = await Promise.all([
      collectRelevantForms(LEXICON_SOURCES.srLex, archives.srLex, srLemmas),
      collectRelevantForms(LEXICON_SOURCES.hrLex, archives.hrLex, hrLemmas)
    ]);
    const evaluated = evaluateCandidates(candidates, higherTrust, srForms, hrForms);
    const accepted = evaluated.filter((candidate) => candidate.status === "accepted");
    const releaseAudit = await verifyReleaseAudit(accepted);
    const generatedDirectory = path.join(projectRoot, "research", "generated");
    const relationDirectory = path.join(projectRoot, "data", "lemma-relations");
    await Promise.all([mkdir(generatedDirectory, { recursive: true }), mkdir(relationDirectory, { recursive: true })]);

    const summary = {
      methodVersion: 1,
      sourceArchives: Object.fromEntries(Object.entries(LEXICON_SOURCES).map(([key, source]) => [key, {
        name: source.name, handle: source.handle, rows: source.rows,
        compressedBytes: source.compressedBytes, sha256: source.sha256
      }])),
      ranking: {
        unit: "lemma-family",
        requested: TOP_LEMMAS,
        eligibleRows: hrRanking.eligibleRows,
        distinctEligibleLemmas: hrRanking.distinctEligibleLemmas,
        evaluatedLemmas: hrRanking.top.length
      },
      thresholds: relationArtifact([], releaseAudit).thresholds,
      candidates: candidates.length,
      accepted: accepted.length,
      known: evaluated.filter((candidate) => candidate.status === "known").length,
      review: evaluated.filter((candidate) => candidate.status === "review").length,
      manuallyBlocked: evaluated.filter((candidate) =>
        candidate.reasons.includes("manually-blocked-semantic-lookalike")).length,
      ikavianSuggestions: evaluated.filter((candidate) => candidate.ikavianSuggestion).length,
      releaseAudit
    };

    await Promise.all([
      writeFile(path.join(relationDirectory, GENERATED_FILENAME), `${JSON.stringify(relationArtifact(accepted, releaseAudit), null, 2)}\n`, "utf8"),
      writeFile(path.join(generatedDirectory, "jat-candidates.csv"), reviewCsv(evaluated), "utf8"),
      writeFile(path.join(generatedDirectory, "jat-summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8")
    ]);
    console.log(JSON.stringify(summary, null, 2));
    if (!releaseAudit.passed) {
      throw new Error(`Generated accepted-pair audit mismatch: ${releaseAudit.acceptedPairsSha256}`);
    }
    return Object.freeze(summary);
  } finally {
    await rm(workDirectory, { recursive: true, force: true });
  }
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) await withLexiconArchives(discoverJatCandidates);
