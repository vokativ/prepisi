"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const persistence = require("../src/site-persistence.js");
const curated = require("../src/curated-portals.js");

test("creates a narrow HTTP/HTTPS registration for one uncurated hostname", () => {
  const site = persistence.descriptorForUrl("https://example.com/article.html");
  assert.equal(site.key, "example.com");
  assert.deepEqual(Array.from(site.matches), [
    "http://example.com/*", "https://example.com/*"
  ]);
  assert.match(site.id, /^prepisi-site-[0-9a-f]{8}$/u);
  assert.equal(persistence.descriptorForUrl("about:debugging"), null);
  assert.equal(persistence.descriptorForUrl("file:///tmp/article.html"), null);
});

test("curated portal aliases share one rule key and explicit permissions", () => {
  const apex = persistence.descriptorForUrl("https://index.hr/vijesti");
  const www = persistence.descriptorForUrl("https://www.index.hr/vijesti");
  assert.equal(apex.key, "index.hr");
  assert.equal(www.key, "index.hr");
  assert.equal(apex.curated, true);
  assert.deepEqual(Array.from(www.matches), [
    "http://index.hr/*", "https://index.hr/*",
    "http://www.index.hr/*", "https://www.index.hr/*"
  ]);
  assert.equal(www.id, apex.id);
  assert.ok(www.registrationIds.includes(www.id));
  assert.equal(new Set(www.registrationIds).size, www.registrationIds.length);
  assert.equal(persistence.ruleForSite({ "www.index.hr": { targetScript: "latin" } }, apex).targetScript,
    "latin");
});

test("an explicit non-curated descriptor remains exact-host", () => {
  const site = persistence.descriptorForUrl("https://www.index.hr/vijesti", { curated: false });
  assert.equal(site.key, "www.index.hr");
  assert.equal(site.curated, false);
  assert.deepEqual(Array.from(site.matches), [
    "http://www.index.hr/*", "https://www.index.hr/*"
  ]);
});

test("RTS paths share one finite apex and www portal family", () => {
  const homepage = persistence.descriptorForUrl("https://rts.rs/lat/");
  const article = persistence.descriptorForUrl("https://www.rts.rs/vesti/clanak.html?view=full");
  assert.equal(homepage.key, "rts.rs");
  assert.equal(article.key, "rts.rs");
  assert.deepEqual(Array.from(article.hosts), ["rts.rs", "www.rts.rs", "oko.rts.rs"]);
  assert.deepEqual(Array.from(article.matches), [
    "http://rts.rs/*", "https://rts.rs/*",
    "http://www.rts.rs/*", "https://www.rts.rs/*",
    "http://oko.rts.rs/*", "https://oko.rts.rs/*"
  ]);
  assert.equal(article.registrationIds.length, 3);

  const oko = persistence.descriptorForUrl("https://oko.rts.rs/tekst");
  assert.equal(oko.key, "rts.rs");
  assert.equal(oko.curated, true);
  assert.deepEqual(Array.from(oko.hosts), ["rts.rs", "www.rts.rs", "oko.rts.rs"]);
});

test("curated catalog is normalized, non-overlapping, and below the reviewed cap", () => {
  assert.ok(curated.portals.length >= 70);
  assert.ok(curated.portals.length <= 125);
  const ids = new Set();
  const hosts = new Set();
  for (const portal of curated.portals) {
    assert.match(portal.id, /^[a-z0-9-]+$/u);
    assert.equal(ids.has(portal.id), false, portal.id);
    ids.add(portal.id);
    assert.ok(portal.hosts.includes(portal.canonicalHost));
    for (const host of portal.hosts) {
      assert.match(host, /^(?!www\.www\.)[a-z0-9.-]+$/u);
      assert.doesNotMatch(host, /[*\/]/u);
      assert.equal(hosts.has(host), false, host);
      hosts.add(host);
      assert.equal(curated.portalForHostname(host), portal);
    }
  }
  assert.equal(curated.matchPatterns().length, hosts.size * 2);
});

test("outreach entities use exact own-site families, never social platforms", () => {
  const expected = {
    "outreach-wikimedia-rs": ["wikimedia.rs"],
    "outreach-sr-wikipedia": ["sr.wikipedia.org"],
    "outreach-hr-wikipedia": ["hr.wikipedia.org"],
    "outreach-bs-wikipedia": ["bs.wikipedia.org"],
    "outreach-classla": ["clarin.si", "www.clarin.si"],
    "outreach-sigslav": ["sigslav.cs.helsinki.fi"],
    "outreach-bsnlp": ["bsnlp.cs.helsinki.fi"],
    "outreach-ffzg-nlp": ["inf.ffzg.unizg.hr"],
    "outreach-airi": ["airi.uniri.hr", "www.airi.uniri.hr"],
    "outreach-share": ["sharefoundation.info", "www.sharefoundation.info"],
    "outreach-isj-sanu": ["www.isj.sanu.ac.rs"],
    "outreach-matica-srpska": ["maticasrpska.org.rs", "www.maticasrpska.org.rs"],
    "outreach-fcjk": ["fcjk.ac.me"],
    "outreach-cirilica": ["cirilica-beograd.rs", "www.cirilica-beograd.rs"],
    "rs-pcpress": ["pcpress.rs", "www.pcpress.rs"],
    "rs-nspm": ["nspm.rs", "www.nspm.rs"]
  };
  const outreach = curated.portals.filter((portal) => portal.tier === "outreach");
  assert.deepEqual(Object.fromEntries(outreach.map((portal) => [portal.id, Array.from(portal.hosts)])), expected);
  assert.equal(outreach.some((portal) => /(?:^|\.)(?:reddit\.com|discord\.com|groups\.google\.com|mailman\.ijs\.si)$/u.test(portal.canonicalHost)), false);
});

test("browser-verified technology sites use the inspected alias families", () => {
  const expected = {
    "rs-itnetwork": ["itnetwork.rs", "www.itnetwork.rs"],
    "rs-sajbersfera": ["sajbersfera.in.rs"],
    "rs-netokracija": ["netokracija.rs", "www.netokracija.rs"],
    "hr-ictbusiness": ["ictbusiness.info", "www.ictbusiness.info"]
  };
  for (const [id, hosts] of Object.entries(expected)) {
    const portal = curated.portals.find((candidate) => candidate.id === id);
    assert.ok(portal, id);
    assert.deepEqual(Array.from(portal.hosts), hosts);
    assert.equal(portal.tier, "core");
  }
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

test("registration uses one canonical ID for every explicit alias match", () => {
  const site = persistence.descriptorForUrl("https://www.rts.rs/lat/");
  const registration = persistence.registrationFor(site);
  assert.equal(registration.id, persistence.descriptorForUrl("https://rts.rs/").id);
  assert.deepEqual(registration.matches, Array.from(site.matches));
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
    __PREPISI__: { apply: async (settings) => {
      calls.push(settings);
      return { changedTextNodes: 2 };
    } }
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
