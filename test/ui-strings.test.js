"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "src/ui-strings.js"), "utf8");
const context = vm.createContext({});
context.globalThis = context;
vm.runInContext(source, context);
const ui = context.PrepisiUI;

test("Latin and Cyrillic interfaces have the same complete key set", () => {
  const latinKeys = Object.keys(ui.STRINGS.latin).sort();
  const cyrillicKeys = Object.keys(ui.STRINGS.cyrillic).sort();
  assert.equal(latinKeys.join("\n"), cyrillicKeys.join("\n"));
  assert.ok(latinKeys.length > 40);
});

test("shared UI translator normalises preferences and formats live status", () => {
  assert.equal(ui.normaliseScript("cyrillic"), "cyrillic");
  assert.equal(ui.normaliseScript("unexpected"), "latin");
  assert.equal(
    ui.translate("cyrillic", "restoredDone", { count: 12 }),
    "Враћен је изворни текст (12 делова)."
  );
  assert.equal(ui.translate("latin", "switchInterface"), "Prikaži interfejs ćirilicom");
});

test("every localised page marker and dynamic status key exists in both scripts", () => {
  const files = [
    "src/popup/popup.html", "src/popup/popup.js",
    "src/options/options.html", "src/options/options.js"
  ];
  const pageSource = files.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
  const keys = new Set();
  for (const match of pageSource.matchAll(/data-i18n(?:-aria-label|-title|-placeholder)?="([^"]+)"/gu)) {
    keys.add(match[1]);
  }
  for (const match of pageSource.matchAll(/setStatus\("([^"]+)"/gu)) keys.add(match[1]);

  for (const key of keys) {
    assert.equal(typeof ui.STRINGS.latin[key], "string", `missing Latin ${key}`);
    assert.equal(typeof ui.STRINGS.cyrillic[key], "string", `missing Cyrillic ${key}`);
  }
});

test("UI script is one local preference and remains separate from page conversion state", () => {
  const popup = fs.readFileSync(path.join(root, "src/popup/popup.js"), "utf8");
  const options = fs.readFileSync(path.join(root, "src/options/options.js"), "utf8");
  assert.match(popup, /storage\.local\.set\(\{ uiScript \}\)/u);
  assert.match(options, /storage\.local\.set\(\{ uiScript \}\)/u);
  assert.doesNotMatch(popup, /storage\.local\.set\([^)]*targetScript/su);
  assert.doesNotMatch(popup, /storage\.local\.set\([^)]*targetDialect/su);
});
