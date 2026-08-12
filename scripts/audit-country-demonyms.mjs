import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  LEXICON_SOURCES,
  evaluateCandidateForms,
  iterateGzipLines,
  parseLexiconLine,
  withLexiconArchives
} from "./lib/lexicon-utils.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const candidatePath = path.join(projectRoot, "research", "country-demonym-candidates.json");
const outputPath = path.join(projectRoot, "research", "generated", "country-demonym-audit.json");

async function collect(source, archivePath, targetLemmas) {
  const lemmas = new Map();
  let rows = 0;
  for await (const line of iterateGzipLines(archivePath)) {
    if (!line) continue;
    rows += 1;
    const entry = parseLexiconLine(line);
    if (!entry || !targetLemmas.has(entry.lemma)) continue;
    if (!lemmas.has(entry.lemma)) {
      lemmas.set(entry.lemma, { forms: new Map(), upos: new Set(), rows: 0, frequency: 0 });
    }
    const record = lemmas.get(entry.lemma);
    record.rows += 1;
    record.frequency += entry.frequency;
    record.upos.add(entry.upos);
    if (!record.forms.has(entry.msd)) record.forms.set(entry.msd, new Set());
    record.forms.get(entry.msd).add(entry.wordform);
  }
  if (rows !== source.rows) throw new Error(`${source.name}: expected ${source.rows} rows, read ${rows}`);
  return lemmas;
}

function summary(record) {
  if (!record) return { present: false, rows: 0, frequency: 0, upos: [], msdSlots: 0, forms: 0 };
  return {
    present: true,
    rows: record.rows,
    frequency: record.frequency,
    upos: Array.from(record.upos).sort(),
    msdSlots: record.forms.size,
    forms: new Set(Array.from(record.forms.values()).flatMap((forms) => Array.from(forms))).size
  };
}

async function audit(archives) {
  const input = JSON.parse(await readFile(candidatePath, "utf8"));
  const srTargets = new Set(input.candidates.map((entry) => entry.ekavian));
  const hrTargets = new Set(input.candidates.map((entry) => entry.ijekavian));
  const [sr, hr] = await Promise.all([
    collect(LEXICON_SOURCES.srLex, archives.srLex, srTargets),
    collect(LEXICON_SOURCES.hrLex, archives.hrLex, hrTargets)
  ]);
  const candidates = input.candidates.map((candidate) => {
    const srRecord = sr.get(candidate.ekavian);
    const hrRecord = hr.get(candidate.ijekavian);
    const evidence = srRecord && hrRecord
      ? evaluateCandidateForms(srRecord.forms, hrRecord.forms)
      : { compatibleMsdSlots: 0, changedSurfacePairs: 0, ambiguousMsdSlots: 0, surfacePairs: [] };
    return {
      ...candidate,
      srLex: summary(srRecord),
      hrLex: summary(hrRecord),
      compatibleMsdSlots: evidence.compatibleMsdSlots,
      changedSurfacePairs: evidence.changedSurfacePairs,
      ambiguousMsdSlots: evidence.ambiguousMsdSlots,
      surfacePairs: evidence.surfacePairs
    };
  });
  const output = {
    generatedOn: new Date().toISOString(),
    scope: input.scope,
    sources: Object.fromEntries(Object.entries(LEXICON_SOURCES).map(([key, source]) => [key, {
      name: source.name, handle: source.handle, rows: source.rows, sha256: source.sha256
    }])),
    candidates
  };
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(output, null, 2));
}

await withLexiconArchives(audit);
