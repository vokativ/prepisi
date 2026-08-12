import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import {
  LEXICON_SOURCES,
  evaluateCandidateForms,
  generateEkavianCandidates,
  iterateGzipLines,
  normalise,
  parseLexiconLine,
  withLexiconArchives
} from "./lib/lexicon-utils.mjs";

const require = createRequire(import.meta.url);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const comtextData = require(path.join(projectRoot, "src", "generated", "comtext-pairs.js"));

async function loadLemmaRelations() {
  // Relation sources are additive inputs, never a closed vocabulary. COMtext
  // contributes only relationships observed in one legal corpus; its count is
  // descriptive evidence, not a language-wide rule or a build limit.
  const relationSources = [{
    name: "COMtext.SR observed lemma relations",
    status: "corpus-observed",
    role: "secondary",
    exhaustive: false,
    pairs: comtextData.lemmaPairs.map(([ekavian, ijekavian]) => [ekavian, ijekavian])
  }];
  const relationDirectories = ["lemma-relations", "ikavian-relations"];
  for (const directory of relationDirectories) {
    const relationDirectory = path.join(projectRoot, "data", directory);
    for (const filename of (await readdir(relationDirectory)).filter((name) => name.endsWith(".json")).sort()) {
      const parsed = JSON.parse(await readFile(path.join(relationDirectory, filename), "utf8"));
    if (!parsed.name || !Array.isArray(parsed.pairs)) throw new Error(`Invalid relation source: ${filename}`);
    if (parsed.status === "generated-strict" && parsed.releaseAudit?.passed !== true) {
      throw new Error(`Generated relation source has not passed release audit: ${filename}`);
    }
    relationSources.push({
      name: parsed.name,
      status: parsed.status || "unclassified",
      role: parsed.role || "supplementary",
      exhaustive: parsed.exhaustive === true,
      releaseAuditPassed: parsed.releaseAudit?.passed ?? null,
      license: parsed.license || null,
      source: parsed.source || null,
      pairs: parsed.pairs
    });
    }
  }

  const relationMap = new Map();
  for (const source of relationSources) {
    for (const pair of source.pairs) {
      if (!Array.isArray(pair) || pair.length < 2) throw new Error(`Invalid pair in ${source.name}`);
      const ekavian = normalise(pair[0]);
      const ijekavian = normalise(pair[1]);
      const ikavian = pair[2] && typeof pair[2] === "string" ? normalise(pair[2]) : null;
      if (!/^\p{L}+$/u.test(ekavian) || !/^\p{L}+$/u.test(ijekavian)) {
        throw new Error(`Invalid lemma pair in ${source.name}: ${pair.join(" / ")}`);
      }
      if (ikavian && !/^\p{L}+$/u.test(ikavian)) {
        throw new Error(`Invalid Ikavian lemma in ${source.name}: ${pair.join(" / ")}`);
      }
      const key = `${ekavian}\u0000${ijekavian}`;
      if (!relationMap.has(key)) relationMap.set(key, { sources: new Set(), ikavian: new Set() });
      relationMap.get(key).sources.add(source.name);
      if (ikavian) relationMap.get(key).ikavian.add(ikavian);
    }
  }

  const pairs = Array.from(relationMap, ([key, record]) => {
    const [ekavian, ijekavian] = key.split("\u0000");
    if (record.ikavian.size > 1) throw new Error(`Conflicting Ikavian lemmas for ${ekavian} / ${ijekavian}`);
    return Object.freeze([
      ekavian,
      ijekavian,
      record.ikavian.values().next().value || null,
      Object.freeze(Array.from(record.sources).sort())
    ]);
  }).sort((left, right) => left[0].localeCompare(right[0], "sr") || left[1].localeCompare(right[1], "sr"));
  return Object.freeze({
    pairs,
    sources: Object.freeze(relationSources.map((source) => Object.freeze({
      name: source.name,
      status: source.status,
      role: source.role,
      exhaustive: source.exhaustive,
      releaseAuditPassed: source.releaseAuditPassed ?? null,
      license: source.license || null,
      source: source.source || null,
      suppliedPairs: source.pairs.length
    })))
  });
}

async function collectForms(source, relevantLemmas, archivePath) {
  const forms = new Map();
  let rows = 0;
  let selectedRows = 0;
  let malformedRows = 0;

  for await (const line of iterateGzipLines(archivePath)) {
    if (!line) continue;
    rows += 1;
    const entry = parseLexiconLine(line);
    if (!entry) {
      malformedRows += 1;
      continue;
    }
    const { wordform, lemma, msd } = entry;
    if (!relevantLemmas.has(lemma) || !/^\p{L}+$/u.test(wordform) || !msd) continue;

    selectedRows += 1;
    if (!forms.has(lemma)) forms.set(lemma, new Map());
    const byMsd = forms.get(lemma);
    if (!byMsd.has(msd)) byMsd.set(msd, new Set());
    byMsd.get(msd).add(wordform);
  }

  if (rows !== source.rows || malformedRows > 0) {
    throw new Error(`${source.name} format check failed: ${rows} rows, ${malformedRows} malformed`);
  }
  return Object.freeze({ forms, rows, selectedRows, compressedBytes: source.compressedBytes, origin: archivePath });
}

function compilePairs(lemmaRelations, srLex, hrLex) {
  const compiled = new Map();
  let matchedLemmaPairs = 0;
  let matchedMsdSlots = 0;
  let rejectedVariantSlots = 0;

  for (const [ekavianLemma, ijekavianLemma, ikavianLemma] of lemmaRelations.pairs) {
    const ekavianByMsd = srLex.forms.get(ekavianLemma);
    const ijekavianByMsd = hrLex.forms.get(ijekavianLemma);
    if (!ekavianByMsd || !ijekavianByMsd) continue;
    matchedLemmaPairs += 1;

    for (const [msd, ekavianForms] of ekavianByMsd) {
      const ijekavianForms = ijekavianByMsd.get(msd);
      if (!ijekavianForms) continue;
      let surfacePairs = [];
      if (ekavianForms.size === 1 && ijekavianForms.size === 1) {
        surfacePairs = [Object.freeze([
          ekavianForms.values().next().value,
          ijekavianForms.values().next().value
        ])];
      } else {
        const evidence = evaluateCandidateForms(
          new Map([[msd, ekavianForms]]),
          new Map([[msd, ijekavianForms]])
        );
        if (evidence.ambiguousMsdSlots || evidence.compatibleMsdSlots !== 1) {
          rejectedVariantSlots += 1;
          continue;
        }
        surfacePairs = evidence.surfacePairs;
      }

      matchedMsdSlots += 1;
      for (const [ekavian, ijekavian] of surfacePairs) {
        const ikavianCandidates = ikavianLemma
          ? generateEkavianCandidates(ijekavian)
            .filter((candidate) => candidate.ekavian === ekavian)
            .map((candidate) => candidate.ikavianSuggestion)
          : [];
        const ikavian = new Set(ikavianCandidates).size === 1 ? ikavianCandidates[0] : null;
        if (ekavian === ijekavian && !ikavian) continue;
        const key = `${ekavian}\u0000${ijekavian}`;
        if (!compiled.has(key)) compiled.set(key, { evidence: 0, ikavian: new Set() });
        const record = compiled.get(key);
        record.evidence += 1;
        if (ikavian) record.ikavian.add(ikavian);
      }
    }
  }

  const pairs = Array.from(compiled, ([key, record]) => {
    const [ekavian, ijekavian] = key.split("\u0000");
    const ikavian = record.ikavian.size === 1 ? record.ikavian.values().next().value : null;
    return Object.freeze([ekavian, ijekavian, ikavian, record.evidence]);
  }).sort((left, right) => left[0].localeCompare(right[0], "sr") || left[1].localeCompare(right[1], "sr"));

  return Object.freeze({ pairs, matchedLemmaPairs, matchedMsdSlots, rejectedVariantSlots });
}

function generatedModule(compiled, metrics) {
  const rows = compiled.pairs
    .map(([ekavian, ijekavian, ikavian, evidence]) =>
      `    ${JSON.stringify([ekavian, ijekavian, ikavian, evidence])}`)
    .join(",\n");
  return `// Generated by scripts/build-lexicon-data.mjs. Do not edit manually.\n` +
`(function initialisePrepisiLexiconData(root) {\n` +
`  "use strict";\n\n` +
`  if (root.PrepisiLexiconData) return;\n` +
`  const api = Object.freeze({\n` +
`    license: "CC BY-SA 4.0",\n` +
`    sources: Object.freeze(${JSON.stringify({
      srLex: { name: LEXICON_SOURCES.srLex.name, handle: LEXICON_SOURCES.srLex.handle, sha256: LEXICON_SOURCES.srLex.sha256 },
      hrLex: { name: LEXICON_SOURCES.hrLex.name, handle: LEXICON_SOURCES.hrLex.handle, sha256: LEXICON_SOURCES.hrLex.sha256 }
    })}),\n` +
`    relationSources: Object.freeze(${JSON.stringify(metrics.relationSources)}),\n` +
`    relationVocabularyExhaustive: false,\n` +
`    lemmaPairsConsidered: ${metrics.lemmaPairsConsidered},\n` +
`    matchedLemmaPairs: ${compiled.matchedLemmaPairs},\n` +
`    matchedMsdSlots: ${compiled.matchedMsdSlots},\n` +
`    rejectedVariantSlots: ${compiled.rejectedVariantSlots},\n` +
`    sourceRows: Object.freeze(${JSON.stringify(metrics.sourceRows)}),\n` +
`    pairs: Object.freeze([\n${rows}\n    ].map((row) => Object.freeze(row)))\n` +
`  });\n\n` +
`  root.PrepisiLexiconData = api;\n` +
`  if (typeof module !== "undefined" && module.exports) module.exports = api;\n` +
`})(typeof globalThis !== "undefined" ? globalThis : this);\n`;
}

export async function buildLexiconData(archives) {
  const lemmaRelations = await loadLemmaRelations();
  const ekavianLemmas = new Set(lemmaRelations.pairs.map(([lemma]) => lemma));
  const ijekavianLemmas = new Set(lemmaRelations.pairs.map(([, lemma]) => lemma));
  const [srLex, hrLex] = await Promise.all([
    collectForms(LEXICON_SOURCES.srLex, ekavianLemmas, archives.srLex),
    collectForms(LEXICON_SOURCES.hrLex, ijekavianLemmas, archives.hrLex)
  ]);
  const compiled = compilePairs(lemmaRelations, srLex, hrLex);
  const outputDirectory = path.join(projectRoot, "src", "generated");
  const outputPath = path.join(outputDirectory, "lexicon-pairs.js");
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, generatedModule(compiled, {
    sourceRows: { srLex: srLex.rows, hrLex: hrLex.rows },
    relationSources: lemmaRelations.sources,
    lemmaPairsConsidered: lemmaRelations.pairs.length
  }), "utf8");

  const summary = {
    outputPath,
    relationSources: lemmaRelations.sources,
    lemmaPairsConsidered: lemmaRelations.pairs.length,
    matchedLemmaPairs: compiled.matchedLemmaPairs,
    matchedMsdSlots: compiled.matchedMsdSlots,
    rejectedVariantSlots: compiled.rejectedVariantSlots,
    distinctSurfacePairs: compiled.pairs.length,
    ikavianSurfacePairs: compiled.pairs.filter(([, , ikavian]) => ikavian).length,
    srLex: { rows: srLex.rows, selectedRows: srLex.selectedRows, compressedBytes: srLex.compressedBytes },
    hrLex: { rows: hrLex.rows, selectedRows: hrLex.selectedRows, compressedBytes: hrLex.compressedBytes }
  };
  console.log(JSON.stringify(summary, null, 2));
  return Object.freeze(summary);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) await withLexiconArchives(buildLexiconData);
