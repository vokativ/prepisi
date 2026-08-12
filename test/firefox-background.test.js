"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const persistence = require("../src/site-persistence.js");
const source = fs.readFileSync(path.join(root, "src/firefox-background.js"), "utf8");

function backgroundWithRules(rules) {
  const calls = { css: [], scripts: [], diagnostics: [], storageSets: [] };
  let listener;
  let filter;
  const context = vm.createContext({
    PrepisiSitePersistence: persistence,
    PrepisiFirefoxDiagnostics: {
      INSTALL_KEY: "firefoxInstallTemporary",
      record: async (stage, details) => calls.diagnostics.push({ stage, details })
    },
    PrepisiWebExt: {
      runtime: {
        onInstalled: { addListener() {} }
      },
      webNavigation: {
        onCompleted: {
          addListener(callback, suppliedFilter) {
            listener = callback;
            filter = suppliedFilter;
          }
        }
      },
      storage: { local: {
        get: async () => ({
          siteRules: rules,
          customProtectedTerms: [],
          respectForeignLanguageSpans: true
        }),
        set: async (details) => calls.storageSets.push(details)
      } },
      permissions: { contains: async () => true },
      scripting: {
        insertCSS: async (details) => calls.css.push(details),
        executeScript: async (details) => {
          calls.scripts.push(details);
          return [{ result: { stage: "auto-apply-complete", changedTextNodes: 3 } }];
        }
      }
    }
  });
  context.globalThis = context;
  vm.runInContext(source, context);
  return { calls, listener, filter };
}

test("Firefox MV3 event page registers a top-level navigation listener", () => {
  const background = backgroundWithRules({});
  assert.equal(typeof background.listener, "function");
  assert.deepEqual(JSON.parse(JSON.stringify(background.filter)), {
    url: [{ schemes: ["http", "https"] }]
  });
});

test("Firefox MV3 event page injects ordered scripts only for a remembered rule", async () => {
  const remembered = backgroundWithRules({
    "rts.rs": { targetScript: "cyrillic", targetDialect: "original" }
  });
  await remembered.listener({
    tabId: 7, frameId: 0, url: "https://www.rts.rs/lat/vesti.html"
  });
  assert.deepEqual(JSON.parse(JSON.stringify(remembered.calls.css)), [{
    target: { tabId: 7 }, files: ["src/highlight.css"]
  }]);
  assert.deepEqual(JSON.parse(JSON.stringify(remembered.calls.scripts[0].files)),
    Array.from(persistence.CONTENT_SCRIPTS));
  assert.deepEqual(remembered.calls.diagnostics.map((entry) => entry.stage), [
    "background-start", "navigation-completed", "permission-checked",
    "css-inserted", "scripts-executed"
  ]);
  assert.equal(remembered.calls.diagnostics.at(-1).details.result, "changed:3");

  const forgotten = backgroundWithRules({});
  await forgotten.listener({
    tabId: 8, frameId: 0, url: "https://www.rts.rs/lat/druga.html"
  });
  await forgotten.listener({
    tabId: 8, frameId: 2, url: "https://www.rts.rs/lat/iframe.html"
  });
  assert.deepEqual(forgotten.calls.css, []);
  assert.deepEqual(forgotten.calls.scripts, []);
  assert.deepEqual(forgotten.calls.diagnostics.map((entry) => entry.stage), [
    "background-start", "navigation-completed", "rule-missing"
  ]);
});
