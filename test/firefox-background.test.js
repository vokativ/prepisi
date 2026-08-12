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
  const calls = { css: [], scripts: [] };
  let listener;
  let filter;
  const context = vm.createContext({
    PrepisiSitePersistence: persistence,
    PrepisiWebExt: {
      webNavigation: {
        onCompleted: {
          addListener(callback, suppliedFilter) {
            listener = callback;
            filter = suppliedFilter;
          }
        }
      },
      storage: { local: { get: async () => ({
        siteRules: rules,
        customProtectedTerms: [],
        respectForeignLanguageSpans: true
      }) } },
      permissions: { contains: async () => true },
      scripting: {
        insertCSS: async (details) => calls.css.push(details),
        executeScript: async (details) => calls.scripts.push(details)
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

  const forgotten = backgroundWithRules({});
  await forgotten.listener({
    tabId: 8, frameId: 0, url: "https://www.rts.rs/lat/druga.html"
  });
  await forgotten.listener({
    tabId: 8, frameId: 2, url: "https://www.rts.rs/lat/iframe.html"
  });
  assert.deepEqual(forgotten.calls, { css: [], scripts: [] });
});
