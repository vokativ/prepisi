(function exposeSitePersistence(global) {
  "use strict";

  if (global.PrepisiSitePersistence) return;

  const STORAGE_KEY = "siteRules";
  const TARGET_KEYS = Object.freeze([
    "targetScript", "targetDialect", "highlightDialectChanges"
  ]);
  const CONTENT_SCRIPTS = Object.freeze([
    "src/platform/webext.js",
    "src/site-persistence.js",
    "src/generated/company-names.js",
    "src/generated/comtext-pairs.js",
    "src/generated/lexicon-pairs.js",
    "src/dialect-data.js",
    "src/converter.js",
    "src/content.js",
    "src/auto-apply.js"
  ]);

  function hash(value) {
    let result = 2166136261;
    for (const character of value) {
      result ^= character.codePointAt(0);
      result = Math.imul(result, 16777619);
    }
    return (result >>> 0).toString(16).padStart(8, "0");
  }

  function descriptorForUrl(value) {
    try {
      const url = new URL(value);
      if (!["http:", "https:"].includes(url.protocol) || !url.hostname) return null;
      const hostname = url.hostname.toLocaleLowerCase("en-US");
      const matches = Object.freeze([
        `http://${hostname}/*`,
        `https://${hostname}/*`
      ]);
      return Object.freeze({
        key: hostname,
        hostname,
        matches,
        id: `prepisi-site-${hash(hostname)}`
      });
    } catch (_) {
      return null;
    }
  }

  function targetSettings(settings = {}) {
    return Object.freeze(Object.fromEntries(TARGET_KEYS.map((key) => [key, settings[key]])));
  }

  function registrationFor(site) {
    return Object.freeze({
      id: site.id,
      matches: Array.from(site.matches),
      js: Array.from(CONTENT_SCRIPTS),
      css: ["src/highlight.css"],
      runAt: "document_idle",
      persistAcrossSessions: true
    });
  }

  const api = Object.freeze({
    STORAGE_KEY,
    TARGET_KEYS,
    CONTENT_SCRIPTS,
    descriptorForUrl,
    targetSettings,
    registrationFor
  });
  global.PrepisiSitePersistence = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
