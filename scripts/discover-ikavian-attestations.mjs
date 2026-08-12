import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { csvCell, normalise } from "./lib/lexicon-utils.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const corpusDirectory = path.resolve(process.env.PREPISI_MICI_PRINC_DIR ||
  path.join(projectRoot, "research", "cache", "MP-json"));

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted && character === '"' && text[index + 1] === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (!quoted && character === ",") {
      row.push(cell);
      cell = "";
    } else if (!quoted && (character === "\n" || character === "\r")) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const [headings, ...values] = rows;
  return values.map((cells) => Object.fromEntries(headings.map((heading, index) => [heading, cells[index] || ""])));
}

async function corpusTokens() {
  const counts = new Map();
  const filenames = (await readdir(corpusDirectory)).filter((name) => /^MP_\d+\.json$/u.test(name)).sort();
  for (const filename of filenames) {
    const turns = JSON.parse(await readFile(path.join(corpusDirectory, filename), "utf8"));
    for (const turn of turns) {
      for (const match of String(turn.text || "").matchAll(/\p{L}+/gu)) {
        const token = normalise(match[0]);
        counts.set(token, (counts.get(token) || 0) + 1);
      }
    }
  }
  return counts;
}

async function main() {
  const [tokens, candidateText, decisions] = await Promise.all([
    corpusTokens(),
    readFile(path.join(projectRoot, "research", "generated", "jat-candidates.csv"), "utf8"),
    readFile(path.join(projectRoot, "data", "ikavian-relations", "mici-princ.json"), "utf8").then(JSON.parse)
  ]);
  const selected = new Set(decisions.pairs.map(([ekavian, ijekavian, ikavian]) =>
    `${ekavian}\u0000${ijekavian}\u0000${ikavian}`));
  const excluded = new Map(decisions.excludedAfterReview.map(([ekavian, ijekavian, ikavian, reason]) =>
    [`${ekavian}\u0000${ijekavian}\u0000${ikavian}`, reason]));
  const hits = parseCsv(candidateText)
    .filter((candidate) => candidate.ikavian_suggestion && tokens.has(normalise(candidate.ikavian_suggestion)))
    .sort((left, right) => Number(left.hr_rank) - Number(right.hr_rank));
  const headings = [
    "review_state", "review_reason", "attestations", "generated_status", "hr_rank",
    "ekavian_lemma", "ijekavian_lemma", "ikavian_suggestion", "rule", "reasons"
  ];
  const rows = hits.map((candidate) => {
    const key = `${candidate.ekavian_lemma}\u0000${candidate.ijekavian_lemma}\u0000${candidate.ikavian_suggestion}`;
    const state = selected.has(key) ? "selected" : excluded.has(key) ? "excluded" : "covered-or-defer";
    return [
      state, excluded.get(key) || "", tokens.get(normalise(candidate.ikavian_suggestion)),
      candidate.generated_status, candidate.hr_rank, candidate.ekavian_lemma,
      candidate.ijekavian_lemma, candidate.ikavian_suggestion, candidate.rule, candidate.reasons
    ].map(csvCell).join(",");
  });
  const outputPath = path.join(projectRoot, "research", "generated", "ikavian-attestations.csv");
  await writeFile(outputPath, `${headings.join(",")}\n${rows.join("\n")}\n`, "utf8");
  console.log(JSON.stringify({
    corpusDirectory,
    distinctCorpusTokens: tokens.size,
    exactCandidateLemmaHits: hits.length,
    selected: hits.filter((candidate) => selected.has(
      `${candidate.ekavian_lemma}\u0000${candidate.ijekavian_lemma}\u0000${candidate.ikavian_suggestion}`)).length,
    outputPath
  }, null, 2));
}

await main();
