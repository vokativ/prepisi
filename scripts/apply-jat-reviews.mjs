import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const stablePath = path.join(projectRoot, "data", "jat-discovery", "reviews.csv");
const generatedPath = path.join(projectRoot, "research", "generated", "jat-candidates.csv");
const humanRelationsPath = path.join(projectRoot, "data", "lemma-relations", "human-reviewed.json");
const blockedPath = path.join(projectRoot, "data", "jat-discovery", "blocked.json");

export function parseReviewCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') quoted = false;
      else cell += character;
    } else if (character === '"') quoted = true;
    else if (character === ",") {
      row.push(cell);
      cell = "";
    } else if (character === "\n") {
      row.push(cell.replace(/\r$/u, ""));
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      cell = "";
    } else cell += character;
  }
  if (cell.length || row.length) {
    row.push(cell.replace(/\r$/u, ""));
    if (row.some((value) => value.length > 0)) rows.push(row);
  }
  if (!rows.length) return [];
  const headings = rows.shift().map((heading) => heading.trim());
  return rows.map((values) => Object.fromEntries(
    headings.map((heading, index) => [heading, values[index] || ""])
  ));
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/u.test(text) ? `"${text.replace(/"/gu, '""')}"` : text;
}

function decisionFrom(value) {
  const decision = String(value || "").trim().toLocaleLowerCase("en");
  if (["approve", "approved", "accept", "accepted", "ok", "da"].includes(decision)) return "approve";
  if (["reject", "rejected", "block", "blocked", "no", "ne"].includes(decision)) return "reject";
  if (["defer", "later", "review", "?"].includes(decision)) return "defer";
  if (!decision) return "";
  throw new Error(`Unknown review decision: ${value}`);
}

function keyOf(record) {
  return `${record.ekavian_lemma.normalize("NFC").toLocaleLowerCase("sr")}\u0000` +
    record.ijekavian_lemma.normalize("NFC").toLocaleLowerCase("sr");
}

function normaliseRecord(record) {
  return {
    decision: decisionFrom(record.decision),
    reviewer: String(record.reviewer || "").trim(),
    ekavian_lemma: String(record.ekavian_lemma || "").trim().normalize("NFC"),
    ijekavian_lemma: String(record.ijekavian_lemma || "").trim().normalize("NFC"),
    notes: String(record.notes || record.review_notes || "").trim()
  };
}

function generatedReview(record) {
  let decision = record.decision;
  let reviewer = record.reviewer;
  const legacy = String(record.generated_status || record.status || "").match(/^OK\s*\(([^)]+)\)$/iu);
  if (!decision && legacy) {
    decision = "approve";
    reviewer ||= legacy[1].trim();
  }
  return normaliseRecord({ ...record, decision, reviewer });
}

async function readCsvIfPresent(filename) {
  try { return parseReviewCsv(await readFile(filename, "utf8")); }
  catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

export async function applyJatReviews() {
  const merged = new Map();
  for (const record of (await readCsvIfPresent(stablePath)).map(normaliseRecord)) {
    if (record.decision && record.ekavian_lemma && record.ijekavian_lemma) merged.set(keyOf(record), record);
  }
  for (const record of (await readCsvIfPresent(generatedPath)).map(generatedReview)) {
    if (record.decision && record.ekavian_lemma && record.ijekavian_lemma) merged.set(keyOf(record), record);
  }

  const reviews = Array.from(merged.values()).sort((left, right) =>
    left.ekavian_lemma.localeCompare(right.ekavian_lemma, "sr") ||
    left.ijekavian_lemma.localeCompare(right.ijekavian_lemma, "sr"));
  const approved = reviews.filter((record) => record.decision === "approve");
  const rejected = reviews.filter((record) => record.decision === "reject");

  let existingBlocked = { name: "Prepiši reviewed semantic rejections", pairs: [] };
  try { existingBlocked = JSON.parse(await readFile(blockedPath, "utf8")); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  const retainedBlocked = (existingBlocked.pairs || []).filter((entry) => entry.source !== "jat-reviews");
  const blockedPairs = [
    ...retainedBlocked,
    ...rejected.map((record) => ({
      ekavian: record.ekavian_lemma,
      ijekavian: record.ijekavian_lemma,
      reason: record.notes || `Rejected by ${record.reviewer || "human reviewer"}.`,
      source: "jat-reviews",
      reviewer: record.reviewer
    }))
  ];

  const stableHeadings = ["decision", "reviewer", "ekavian_lemma", "ijekavian_lemma", "notes"];
  const stableCsv = `${stableHeadings.join(",")}\n${reviews.map((record) =>
    stableHeadings.map((heading) => csvCell(record[heading])).join(",")).join("\n")}${reviews.length ? "\n" : ""}`;
  const humanRelations = {
    name: "Prepiši human-reviewed jat relations",
    status: "reviewed",
    role: "primary-human-review",
    exhaustive: false,
    generatedFrom: "data/jat-discovery/reviews.csv",
    pairs: approved.map((record) => [record.ekavian_lemma, record.ijekavian_lemma]),
    reviews: approved.map((record) => ({
      ekavian: record.ekavian_lemma,
      ijekavian: record.ijekavian_lemma,
      reviewer: record.reviewer,
      notes: record.notes
    }))
  };

  await Promise.all([
    mkdir(path.dirname(stablePath), { recursive: true }),
    mkdir(path.dirname(humanRelationsPath), { recursive: true })
  ]);
  await Promise.all([
    writeFile(stablePath, stableCsv, "utf8"),
    writeFile(humanRelationsPath, `${JSON.stringify(humanRelations, null, 2)}\n`, "utf8"),
    writeFile(blockedPath, `${JSON.stringify({ ...existingBlocked, pairs: blockedPairs }, null, 2)}\n`, "utf8")
  ]);

  return Object.freeze({ reviews: reviews.length, approved: approved.length, rejected: rejected.length,
    deferred: reviews.filter((record) => record.decision === "defer").length });
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) console.log(JSON.stringify(await applyJatReviews(), null, 2));
