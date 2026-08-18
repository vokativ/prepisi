import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const curatedPortals = require(path.join(root, "src", "curated-portals.js"));
const persistence = require(path.join(root, "src", "site-persistence.js"));
const buildRoot = path.join(root, "build");
const targets = Object.freeze(["chromium", "edge", "firefox", "safari"]);
const runtimeEntries = Object.freeze([
  "src", "assets", "_locales", "PRIVACY.md", "ATTRIBUTIONS.md", "LICENSE"
]);

function merge(base, overlay) {
  const result = structuredClone(base);
  for (const [key, value] of Object.entries(overlay)) {
    if (value && typeof value === "object" && !Array.isArray(value)
        && result[key] && typeof result[key] === "object" && !Array.isArray(result[key])) {
      result[key] = merge(result[key], value);
    } else {
      result[key] = structuredClone(value);
    }
  }
  return result;
}

async function manifestFor(target) {
  const base = JSON.parse(await fs.readFile(path.join(root, "manifest.json"), "utf8"));
  if (target === "chromium") return base;

  const overlay = JSON.parse(await fs.readFile(path.join(root, "manifests", `${target}.json`), "utf8"));
  for (const key of overlay.remove || []) delete base[key];
  const manifest = merge(base, overlay.manifest || {});
  if (target === "firefox") {
    manifest.permissions = [...manifest.permissions, "webNavigation"];
    manifest.host_permissions = curatedPortals.matchPatterns();
    manifest.background = {
      scripts: [
        "src/platform/webext.js", "src/firefox-diagnostics.js", "src/curated-portals.js",
        "src/site-persistence.js", "src/firefox-background.js"
      ],
      persistent: false
    };
  }
  return manifest;
}

async function build(target) {
  const output = path.join(buildRoot, target);
  const manifest = await manifestFor(target);
  await fs.rm(output, { recursive: true, force: true });
  await fs.mkdir(output, { recursive: true });

  for (const entry of runtimeEntries) {
    await fs.cp(path.join(root, entry), path.join(output, entry), { recursive: true });
  }
  await fs.writeFile(path.join(output, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`${target}: ${path.relative(root, output)} (${manifest.version})`);
}

const requested = process.argv.slice(2);
const selected = requested.length === 0 || requested.includes("all") ? targets : requested;
for (const target of selected) {
  if (!targets.includes(target)) throw new Error(`Unknown browser target: ${target}`);
  await build(target);
}
