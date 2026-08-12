"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));

test("manifest is a minimal-permission Chromium MV3 extension", () => {
  assert.equal(manifest.manifest_version, 3);
  assert.deepEqual(manifest.permissions.sort(), ["activeTab", "scripting", "storage"].sort());
  assert.equal(manifest.host_permissions, undefined);
  assert.deepEqual(manifest.optional_host_permissions, ["http://*/*", "https://*/*"]);
  assert.equal(manifest.content_scripts, undefined);
  assert.equal(manifest.background, undefined);
});

test("every manifest page exists inside the extension", () => {
  const referencedFiles = [
    manifest.action.default_popup,
    manifest.options_page,
    ...Object.values(manifest.icons),
    ...Object.values(manifest.action.default_icon)
  ];
  for (const relativePath of referencedFiles) {
    assert.equal(fs.existsSync(path.join(root, relativePath)), true, relativePath);
  }
});

test("package and manifest versions stay aligned", () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  assert.equal(packageJson.version, manifest.version);
  assert.equal(packageJson.license, "GPL-3.0-only");
  assert.match(fs.readFileSync(path.join(root, "LICENSE"), "utf8"),
    /^GNU GENERAL PUBLIC LICENSE\r?\nVersion 3, 29 June 2007/u);
});

test("extension source makes no network requests", () => {
  const sources = [
    "src/generated/company-names.js", "src/generated/comtext-pairs.js", "src/generated/lexicon-pairs.js",
    "src/dialect-data.js", "src/platform/webext.js", "src/ui-strings.js",
    "src/converter.js", "src/content.js", "src/site-persistence.js", "src/auto-apply.js",
    "src/popup/popup.js", "src/options/options.js"
  ].map((relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8")).join("\n");
  assert.doesNotMatch(sources, /\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon/u);
});

test("extension pages use the shared promise-based WebExtension namespace", () => {
  const adapter = fs.readFileSync(path.join(root, "src/platform/webext.js"), "utf8");
  const uiSource = ["src/popup/popup.js", "src/options/options.js"]
    .map((relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8")).join("\n");
  assert.match(adapter, /global\.browser \|\| global\.chrome/u);
  assert.match(uiSource, /PrepisiWebExt/u);
  assert.doesNotMatch(uiSource, /\b(?:chrome|browser)\./u);
});

test("company vocabulary is an offline multi-country snapshot", () => {
  const companies = require("../src/generated/company-names.js");
  assert.equal(companies.COUNTS.positions, 715);
  assert.equal(companies.COUNTS.uniqueNames, 711);
  assert.deepEqual(Object.values(companies.LISTS).map((names) => names.length), [500, 100, 40, 40, 35]);
});

test("popup applies selections instantly and has no confirmation button", () => {
  const popup = fs.readFileSync(path.join(root, manifest.action.default_popup), "utf8");
  const popupScript = fs.readFileSync(path.join(root, "src/popup/popup.js"), "utf8");
  assert.doesNotMatch(popup, /id="apply"/u);
  assert.match(popupScript, /control\.addEventListener\("change", \(\) => requestApply\(\)\)/u);
});

test("popup prefers active-page state and stores navigation rules only after site opt-in", () => {
  const popupScript = fs.readFileSync(path.join(root, "src/popup/popup.js"), "utf8");
  assert.match(popupScript, /__PREPISI__\?\.getStatus/u);
  assert.match(popupScript, /current\?\.options/u);
  assert.match(popupScript, /permissions\.request\(\{ origins:/u);
  assert.match(popupScript, /persistence\.STORAGE_KEY/u);
  assert.match(popupScript, /registerContentScripts/u);
});

test("site persistence is optional, hostname-scoped, and initiated by its own control", () => {
  const popup = fs.readFileSync(path.join(root, manifest.action.default_popup), "utf8");
  const popupScript = fs.readFileSync(path.join(root, "src/popup/popup.js"), "utf8");
  assert.match(popup, /id="remember-site"/u);
  assert.doesNotMatch(popupScript, /<all_urls>/u);
  assert.doesNotMatch(manifest.optional_host_permissions.join("\n"), /<all_urls>/u);
});

test("popup scripts are external, preserving the default extension CSP", () => {
  const popup = fs.readFileSync(path.join(root, manifest.action.default_popup), "utf8");
  assert.doesNotMatch(popup, /<script(?![^>]*\bsrc=)/iu);
  assert.ok(popup.indexOf("platform/webext.js") < popup.indexOf("popup.js"));
});

test("popup keeps a Firefox-safe intrinsic width and does not style nested labels as buttons", () => {
  const popup = fs.readFileSync(path.join(root, manifest.action.default_popup), "utf8");
  const popupCss = fs.readFileSync(path.join(root, "src/popup/popup.css"), "utf8");
  assert.match(popupCss, /body\s*\{\s*width:\s*370px;/u);
  assert.doesNotMatch(popupCss, /max-width:\s*100vw/u);
  assert.match(popupCss, /\.segments label > span/u);
  assert.doesNotMatch(popupCss, /\.segments span\s*\{/u);
  assert.match(popup, /class="segment-text" data-i18n="dialectIkavian"/u);
  assert.match(popupCss, /@media \(max-width: 360px\)/u);
  assert.match(popupCss, /@media \(hover: none\) and \(pointer: coarse\)/u);
  assert.match(popupCss, /footer\s*\{\s*flex-wrap:\s*wrap;/u);
});

test("programmatic injection paths are extension-root-relative for Firefox", () => {
  const popupScript = fs.readFileSync(path.join(root, "src/popup/popup.js"), "utf8");
  const injectedPaths = Array.from(popupScript.matchAll(/"(\/?src\/(?:[^"\\]|\\.)+)"/gu),
    (match) => match[1]);
  assert.ok(injectedPaths.length >= 7);
  for (const injectedPath of injectedPaths) assert.match(injectedPath, /^\/src\//u);
});
