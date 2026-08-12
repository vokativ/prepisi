import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(projectRoot, "research", "generated", "cldr-territory-comparison.json");
const version = "48.1.0";
const locales = ["sr-Latn", "hr", "bs"];

async function loadTerritories(locale) {
  const url = `https://raw.githubusercontent.com/unicode-org/cldr-json/${version}/cldr-json/cldr-localenames-full/main/${locale}/territories.json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${locale}: ${response.status} ${response.statusText}`);
  const json = await response.json();
  return { url, values: json.main[locale].localeDisplayNames.territories };
}

const loaded = Object.fromEntries(await Promise.all(locales.map(async (locale) => [
  locale, await loadTerritories(locale)
])));
const codes = Array.from(new Set(locales.flatMap((locale) => Object.keys(loaded[locale].values))))
  .filter((code) => /^[A-Z]{2}$/u.test(code))
  .sort();
const territories = codes.map((code) => ({
  code,
  srLatn: loaded["sr-Latn"].values[code] || null,
  hr: loaded.hr.values[code] || null,
  bs: loaded.bs.values[code] || null
}));
const differences = territories.filter(({ srLatn, hr, bs }) =>
  new Set([srLatn, hr, bs]).size > 1);

const report = {
  generatedOn: new Date().toISOString(),
  source: "Unicode CLDR territory display names",
  version,
  license: "Unicode-3.0",
  urls: Object.fromEntries(locales.map((locale) => [locale, loaded[locale].url])),
  territoryCount: territories.length,
  identicalCount: territories.length - differences.length,
  differingCount: differences.length,
  differences,
  territories
};
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  outputPath,
  territoryCount: report.territoryCount,
  identicalCount: report.identicalCount,
  differingCount: report.differingCount,
  differences
}, null, 2));
