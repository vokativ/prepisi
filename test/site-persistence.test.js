"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const persistence = require("../src/site-persistence.js");

test("creates a narrow HTTP/HTTPS registration for one hostname", () => {
  const site = persistence.descriptorForUrl("https://www.nspm.rs/hronika/article.html");
  assert.equal(site.key, "www.nspm.rs");
  assert.deepEqual(Array.from(site.matches), [
    "http://www.nspm.rs/*", "https://www.nspm.rs/*"
  ]);
  assert.match(site.id, /^prepisi-site-[0-9a-f]{8}$/u);
  assert.equal(persistence.descriptorForUrl("about:debugging"), null);
  assert.equal(persistence.descriptorForUrl("file:///tmp/article.html"), null);
});

test("registered site scripts are ordered, local, persistent, and top-frame only", () => {
  const registration = persistence.registrationFor(
    persistence.descriptorForUrl("https://www.index.hr/chill/article")
  );
  assert.equal(registration.persistAcrossSessions, true);
  assert.equal(registration.allFrames, undefined);
  assert.equal(registration.runAt, "document_idle");
  assert.deepEqual(registration.css, ["src/highlight.css"]);
  assert.ok(registration.js.indexOf("src/converter.js") < registration.js.indexOf("src/content.js"));
  assert.ok(registration.js.indexOf("src/content.js") < registration.js.indexOf("src/auto-apply.js"));
  for (const file of registration.js) {
    assert.equal(fs.existsSync(path.join(root, file)), true, file);
    assert.doesNotMatch(file, /^(?:https?:|\/)/u);
  }
});

test("automatic content script applies only a stored rule for the current hostname", async () => {
  const calls = [];
  const context = vm.createContext({
    location: { href: "https://www.nspm.rs/new-page" },
    PrepisiSitePersistence: persistence,
    PrepisiWebExt: {
      storage: { local: { get: async () => ({
        siteRules: {
          "www.nspm.rs": {
            targetScript: "latin", targetDialect: "ijekavian", highlightDialectChanges: true
          }
        },
        customProtectedTerms: ["AfD"],
        respectForeignLanguageSpans: true
      }) } }
    },
    __PREPISI__: { apply: async (settings) => calls.push(settings) }
  });
  context.globalThis = context;
  const source = fs.readFileSync(path.join(root, "src", "auto-apply.js"), "utf8");
  await vm.runInContext(source, context);
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [{
    customProtectedTerms: ["AfD"],
    respectForeignLanguageSpans: true,
    targetScript: "latin",
    targetDialect: "ijekavian",
    highlightDialectChanges: true
  }]);
});
