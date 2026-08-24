import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const buildRoot = path.join(root, "build");
const targets = ["chromium", "edge", "firefox", "safari"];
const requiredEntries = ["manifest.json", "src", "assets", "PRIVACY.md", "ATTRIBUTIONS.md", "LICENSE"];
const packageVersion = JSON.parse(
  await fs.readFile(path.join(root, "package.json"), "utf8")
).version;

console.log("=== Verifying Build Output Targets ===");

let totalChecked = 0;
let errors = 0;

for (const target of targets) {
  const targetDir = path.join(buildRoot, target);
  
  // 1. Verify directory existence
  try {
    const stat = await fs.stat(targetDir);
    if (!stat.isDirectory()) throw new Error(`Not a directory: ${targetDir}`);
    console.log(`[PASS] Target directory exists: build/${target}`);
  } catch (e) {
    console.error(`[FAIL] Missing target directory: build/${target}`);
    errors++;
    continue;
  }

  // 2. Check required files & directories
  for (const entry of requiredEntries) {
    const entryPath = path.join(targetDir, entry);
    try {
      await fs.access(entryPath);
      totalChecked++;
    } catch (e) {
      console.error(`[FAIL] Target build/${target} missing entry: ${entry}`);
      errors++;
    }
  }

  // 3. Parse and validate manifest.json
  const manifestPath = path.join(targetDir, "manifest.json");
  try {
    const raw = await fs.readFile(manifestPath, "utf8");
    const manifest = JSON.parse(raw);
    
    if (manifest.manifest_version !== 3) {
      throw new Error(`Expected manifest_version 3, got ${manifest.manifest_version}`);
    }
    if (manifest.name !== "__MSG_extName__") {
      throw new Error(`Unexpected manifest name: ${manifest.name}`);
    }
    const defaultLocaleMessages = JSON.parse(
      await fs.readFile(path.join(targetDir, "_locales", manifest.default_locale, "messages.json"), "utf8")
    );
    if (defaultLocaleMessages.extName?.message !== "Prepiši") {
      throw new Error(`Unexpected resolved extName: ${defaultLocaleMessages.extName?.message}`);
    }
    if (manifest.version !== packageVersion) {
      throw new Error(
        `Expected version ${packageVersion} from package.json, got ${manifest.version}`
      );
    }
    
    // Target specific checks
    if (target === "firefox") {
      if (!manifest.permissions.includes("webNavigation")) {
        throw new Error("Firefox manifest missing webNavigation permission");
      }
      if (!Array.isArray(manifest.host_permissions) || manifest.host_permissions.length === 0) {
        throw new Error("Firefox manifest missing host_permissions");
      }
      console.log(`[PASS] Firefox build contains ${manifest.host_permissions.length} explicit host permission patterns`);
    } else {
      if (manifest.host_permissions) {
        throw new Error(`${target} manifest should not contain host_permissions by default`);
      }
    }

    console.log(`[PASS] Target build/${target}/manifest.json valid (v${manifest.version})`);
  } catch (e) {
    console.error(`[FAIL] Target build/${target}/manifest.json invalid: ${e.message}`);
    errors++;
  }
}

console.log("\n=== Summary ===");
console.log(`Total checks passed: ${totalChecked}`);
if (errors === 0) {
  console.log("SUCCESS: All 4 build targets verified clean and ready for packaging!");
  process.exit(0);
} else {
  console.error(`FAILURE: ${errors} errors detected in build output verification.`);
  process.exit(1);
}
