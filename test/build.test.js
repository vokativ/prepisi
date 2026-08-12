"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const baseManifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
const curated = require("../src/curated-portals.js");
const persistence = require("../src/site-persistence.js");

function filesBelow(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(absolute) : [path.relative(directory, absolute)];
  });
}

test("browser builds share one runtime and contain target-specific manifests", () => {
  childProcess.execFileSync(process.execPath, ["scripts/build-extension.mjs", "all"], {
    cwd: root,
    stdio: "pipe"
  });

  const manifests = Object.fromEntries(["chromium", "edge", "firefox", "safari"].map((target) => [
    target,
    JSON.parse(fs.readFileSync(path.join(root, "build", target, "manifest.json"), "utf8"))
  ]));
  for (const target of Object.keys(manifests)) {
    assert.equal(manifests[target].version, baseManifest.version);
    assert.equal(fs.existsSync(path.join(root, "build", target, "src", "converter.js")), true);
    assert.equal(fs.existsSync(path.join(root, "build", target, "src", "auto-apply.js")), true);
    assert.equal(fs.existsSync(path.join(root, "build", target, "src", "platform", "webext.js")), true);
    assert.match(fs.readFileSync(path.join(root, "build", target, "LICENSE"), "utf8"),
      /^GNU GENERAL PUBLIC LICENSE\r?\nVersion 3, 29 June 2007/u);
    const packagedSmoke = childProcess.execFileSync(process.execPath, ["-e", [
      "const converter = require('./src/converter.js');",
      "process.stdout.write(converter.convertText('vrijeme i Njemačka',",
      "  { targetScript: 'cyrillic', targetDialect: 'ekavian' }));"
    ].join("\n")], {
      cwd: path.join(root, "build", target), encoding: "utf8"
    });
    assert.equal(packagedSmoke, "време и Немачка");
    const files = filesBelow(path.join(root, "build", target));
    assert.equal(files.some((file) => /(?:^|[\\/])(?:test|research|data|scripts)(?:[\\/]|$)/u.test(file)), false);
    assert.equal(files.some((file) => /\.(?:otf|ttf)$/iu.test(file)), false);
    assert.equal(files.some((file) => /\.(?:exe|dll|dylib|so|node)$/iu.test(file)), false);
  }

  for (const manifest of Object.values(manifests)) {
    assert.deepEqual(manifest.optional_host_permissions, ["http://*/*", "https://*/*"]);
  }

  for (const target of ["chromium", "edge", "safari"]) {
    assert.equal(manifests[target].host_permissions, undefined);
    assert.equal(manifests[target].content_scripts, undefined);
  }
  assert.equal(manifests.firefox.manifest_version, 3);
  assert.equal(manifests.firefox.action.default_popup, "src/popup/popup.html");
  assert.equal(manifests.firefox.browser_action, undefined);
  assert.deepEqual(manifests.firefox.permissions, [
    "activeTab", "scripting", "storage", "webNavigation"
  ]);
  assert.deepEqual(manifests.firefox.host_permissions, curated.matchPatterns());
  assert.equal(manifests.firefox.content_scripts, undefined);
  assert.deepEqual(manifests.firefox.background, {
    scripts: [
      "src/platform/webext.js", "src/firefox-diagnostics.js", "src/curated-portals.js",
      "src/site-persistence.js", "src/firefox-background.js"
    ],
    persistent: false
  });

  assert.equal(manifests.chromium.minimum_chrome_version, "105");
  assert.equal(manifests.chromium.browser_specific_settings, undefined);
  assert.deepEqual(manifests.edge, manifests.chromium);
  assert.equal(manifests.firefox.minimum_chrome_version, undefined);
  assert.equal(manifests.firefox.browser_specific_settings.gecko.strict_min_version, "140.0");
  assert.equal(manifests.firefox.browser_specific_settings.gecko_android.strict_min_version, "142.0");
  assert.deepEqual(manifests.firefox.browser_specific_settings.gecko.data_collection_permissions.required, ["none"]);
  assert.match(manifests.firefox.browser_specific_settings.gecko.id, /^\{[0-9a-f-]+\}$/u);
  assert.equal(manifests.safari.minimum_chrome_version, undefined);
  assert.equal(manifests.safari.browser_specific_settings.safari.strict_min_version, "17.2");
});
