import { createReadStream, createWriteStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createGunzip } from "node:zlib";
import { createInterface } from "node:readline";

export const LEXICON_SOURCES = Object.freeze({
  srLex: Object.freeze({
    name: "srLex 1.3",
    handle: "11356/1233",
    filename: "srLex_v1.3.gz",
    url: "https://www.clarin.si/repository/xmlui/bitstream/handle/11356/1233/srLex_v1.3.gz?sequence=3&isAllowed=y",
    compressedBytes: 56796017,
    rows: 6905941,
    sha256: "1177ab49a60965fca0ab12d2c901d54e843bff82e805b33fd4c2d0c49a6ecdf9",
    md5: "68507adedfa0d45f4a88242c6d2f7e43"
  }),
  hrLex: Object.freeze({
    name: "hrLex 1.3",
    handle: "11356/1232",
    filename: "hrLex_v1.3.gz",
    url: "https://www.clarin.si/repository/xmlui/bitstream/handle/11356/1232/hrLex_v1.3.gz?sequence=1&isAllowed=y",
    compressedBytes: 54477922,
    rows: 6427709,
    sha256: "94fcccc237cccf2256f382ece8d4ccc523bf80fd73f5e32b858f43412f46f9df",
    md5: "e55a21f10bbb4f6c22afe31a65803649"
  })
});

const EXCLUDED_UPOS = new Set(["PROPN", "NUM", "PUNCT", "SYM", "X"]);

export function normalise(value) {
  return String(value || "").normalize("NFC").toLocaleLowerCase("sr");
}

export function parseLexiconLine(line) {
  const fields = line.split("\t");
  if (fields.length < 8) return null;
  const frequency = Number(fields[6]);
  if (!Number.isFinite(frequency) || frequency < 0) return null;
  return Object.freeze({
    wordform: normalise(fields[0]),
    lemma: normalise(fields[1]),
    msd: fields[2],
    upos: fields[4],
    frequency
  });
}

export function isEligibleLexeme(entry) {
  return Boolean(entry && entry.msd && entry.upos &&
    !EXCLUDED_UPOS.has(entry.upos) &&
    /^\p{L}+$/u.test(entry.lemma) && /^\p{L}+$/u.test(entry.wordform));
}

export function addFrequencyObservation(lemmas, entry) {
  if (!lemmas.has(entry.lemma)) lemmas.set(entry.lemma, { forms: new Map(), upos: new Set() });
  const record = lemmas.get(entry.lemma);
  record.forms.set(entry.wordform, Math.max(record.forms.get(entry.wordform) || 0, entry.frequency));
  record.upos.add(entry.upos);
}

export function summariseLemmaFrequencies(lemmas) {
  return Array.from(lemmas, ([lemma, record]) => Object.freeze({
    lemma,
    frequency: Array.from(record.forms.values()).reduce((sum, value) => sum + value, 0),
    upos: Object.freeze(Array.from(record.upos).sort())
  }));
}

export async function* iterateGzipLines(filePath) {
  const lines = createInterface({
    input: createReadStream(filePath).pipe(createGunzip()),
    crlfDelay: Infinity
  });
  for await (const line of lines) yield line;
}

async function digest(filePath, algorithm) {
  const hash = createHash(algorithm);
  for await (const chunk of createReadStream(filePath)) hash.update(chunk);
  return hash.digest("hex");
}

export async function verifyArchive(source, filePath) {
  const file = await stat(filePath);
  if (file.size !== source.compressedBytes) {
    throw new Error(`${source.name} size mismatch: ${file.size} != ${source.compressedBytes}`);
  }
  const sha256 = await digest(filePath, "sha256");
  if (sha256 !== source.sha256) {
    throw new Error(`${source.name} SHA-256 mismatch: ${sha256}`);
  }
  return Object.freeze({ path: path.resolve(filePath), bytes: file.size, sha256 });
}

async function downloadArchive(source, destination) {
  const response = await fetch(source.url, { headers: { "User-Agent": "Prepisi-data-builder" } });
  if (!response.ok || !response.body) {
    throw new Error(`Download failed (${response.status}): ${source.url}`);
  }
  await pipeline(Readable.fromWeb(response.body), createWriteStream(destination));
  return verifyArchive(source, destination);
}

export async function withLexiconArchives(callback, environment = process.env) {
  const suppliedSr = environment.PREPISI_SRLEX_PATH || "";
  const suppliedHr = environment.PREPISI_HRLEX_PATH || "";
  if (Boolean(suppliedSr) !== Boolean(suppliedHr)) {
    throw new Error("Set both PREPISI_SRLEX_PATH and PREPISI_HRLEX_PATH, or neither.");
  }

  if (suppliedSr && suppliedHr) {
    const [srLex, hrLex] = await Promise.all([
      verifyArchive(LEXICON_SOURCES.srLex, suppliedSr),
      verifyArchive(LEXICON_SOURCES.hrLex, suppliedHr)
    ]);
    return callback(Object.freeze({ srLex: srLex.path, hrLex: hrLex.path }));
  }

  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "prepisi-lexicons-"));
  try {
    const srPath = path.join(temporaryDirectory, LEXICON_SOURCES.srLex.filename);
    const hrPath = path.join(temporaryDirectory, LEXICON_SOURCES.hrLex.filename);
    await Promise.all([
      downloadArchive(LEXICON_SOURCES.srLex, srPath),
      downloadArchive(LEXICON_SOURCES.hrLex, hrPath)
    ]);
    return await callback(Object.freeze({ srLex: srPath, hrLex: hrPath }));
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

function jatSegments(word) {
  return Array.from(word.matchAll(/ije|je/gu), (match) => Object.freeze({
    index: match.index,
    text: match[0]
  }));
}

function replaceSegments(word, segments, mask, replacement) {
  let result = "";
  let cursor = 0;
  segments.forEach((segment, index) => {
    result += word.slice(cursor, segment.index);
    result += (mask & (1 << index)) ? replacement : segment.text;
    cursor = segment.index + segment.text.length;
  });
  return result + word.slice(cursor);
}

export function generateEkavianCandidates(ijekavianLemma) {
  const word = normalise(ijekavianLemma);
  const segments = jatSegments(word);
  if (!segments.length || segments.length > 8) return Object.freeze([]);
  const candidates = new Map();
  for (let mask = 1; mask < (1 << segments.length); mask += 1) {
    const ekavian = replaceSegments(word, segments, mask, "e");
    const ikavian = replaceSegments(word, segments, mask, "i");
    const skeleton = replaceSegments(word, segments, mask, "ě");
    const selected = segments.filter((_, index) => mask & (1 << index));
    if (!candidates.has(ekavian)) {
      candidates.set(ekavian, Object.freeze({
        ekavian,
        ijekavian: word,
        ikavianSuggestion: ikavian,
        skeleton,
        rule: selected.map((segment) => `${segment.text}→e`).join("+")
      }));
    }
  }
  return Object.freeze(Array.from(candidates.values()));
}

export function generateIToECandidates(ijekavianLemma) {
  const word = normalise(ijekavianLemma);
  const results = [];
  for (let index = 0; index < word.length; index += 1) {
    if (word[index] !== "i") continue;
    results.push(Object.freeze({
      ekavian: `${word.slice(0, index)}e${word.slice(index + 1)}`,
      ijekavian: word,
      ikavianSuggestion: "",
      skeleton: "",
      rule: "i→e"
    }));
  }
  return Object.freeze(results);
}

export function isAllowedJatPair(ijekavian, ekavian) {
  if (ijekavian === ekavian) return true;
  return generateEkavianCandidates(ijekavian).some((candidate) => candidate.ekavian === ekavian);
}

function commonPrefixLength(left, right) {
  let length = 0;
  while (length < left.length && length < right.length && left[length] === right[length]) length += 1;
  return length;
}

function commonSuffixLength(left, right) {
  let length = 0;
  while (length < left.length && length < right.length &&
    left[left.length - length - 1] === right[right.length - length - 1]) length += 1;
  return length;
}

export function findFamilyAnchor(candidate, anchors) {
  if (!candidate.skeleton || candidate.type !== "jat") return null;
  let best = null;
  for (const anchor of anchors) {
    if (anchor.ekavian === candidate.ekavian && anchor.ijekavian === candidate.ijekavian) continue;
    if (anchor.rule !== candidate.rule || !anchor.skeleton) continue;
    const shared = Math.max(
      commonPrefixLength(candidate.skeleton, anchor.skeleton),
      commonSuffixLength(candidate.skeleton, anchor.skeleton)
    );
    const score = shared / Math.min(candidate.skeleton.length, anchor.skeleton.length);
    if (shared < 3 || score < 0.6) continue;
    if (!best || score > best.score || (score === best.score && shared > best.shared)) {
      best = Object.freeze({
        ekavian: anchor.ekavian,
        ijekavian: anchor.ijekavian,
        shared,
        score
      });
    }
  }
  return best;
}

export function evaluateCandidateForms(ekavianForms, ijekavianForms) {
  let compatibleMsdSlots = 0;
  let changedSurfacePairs = 0;
  let ambiguousMsdSlots = 0;
  const surfacePairs = [];
  if (!ekavianForms || !ijekavianForms) {
    return Object.freeze({ compatibleMsdSlots, changedSurfacePairs, ambiguousMsdSlots, surfacePairs });
  }

  for (const [msd, ekavianSet] of ekavianForms) {
    const ijekavianSet = ijekavianForms.get(msd);
    if (!ijekavianSet) continue;
    const changed = new Map();
    const unchanged = new Map();
    for (const ijekavian of ijekavianSet) {
      for (const ekavian of ekavianSet) {
        if (!isAllowedJatPair(ijekavian, ekavian)) continue;
        const target = ekavian === ijekavian ? unchanged : changed;
        target.set(`${ekavian}\u0000${ijekavian}`, Object.freeze([ekavian, ijekavian]));
      }
    }
    // srLex can contain an Ijekavian variant alongside the Ekavian form under
    // the same lemma. Prefer the unique changed pair; an identical variant is
    // not a competing dialect target. Multiple changed pairs remain unsafe.
    if (changed.size > 1 || (changed.size === 0 && unchanged.size > 1)) {
      ambiguousMsdSlots += 1;
      continue;
    }
    const compatible = changed.size === 1 ? changed : unchanged;
    if (compatible.size !== 1) continue;
    compatibleMsdSlots += 1;
    const pair = compatible.values().next().value;
    if (pair[0] !== pair[1]) {
      changedSurfacePairs += 1;
      surfacePairs.push(pair);
    }
  }
  return Object.freeze({
    compatibleMsdSlots,
    changedSurfacePairs,
    ambiguousMsdSlots,
    surfacePairs: Object.freeze(surfacePairs)
  });
}

export function csvCell(value) {
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "");
  return /[",\r\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
