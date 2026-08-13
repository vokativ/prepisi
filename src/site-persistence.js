(function exposeSitePersistence(global) {
  "use strict";

  if (global.PrepisiSitePersistence) return;

  const curated = global.PrepisiCuratedPortals ||
    (typeof require === "function" ? require("./curated-portals.js") : null);

  const STORAGE_KEY = "siteRules";
  const TARGET_KEYS = Object.freeze([
    "targetScript", "targetDialect", "highlightDialectChanges"
  ]);
  const CONTENT_SCRIPTS = Object.freeze([
    "src/platform/webext.js",
    "src/curated-portals.js",
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

  function descriptorForUrl(value, options = {}) {
    try {
      const url = new URL(value);
      if (!["http:", "https:"].includes(url.protocol) || !url.hostname) return null;
      const hostname = url.hostname.toLocaleLowerCase("en-US");
      // A reviewed portal family is safe to share across builds because it is a
      // finite list of explicit editorial aliases, never a registrable-domain
      // wildcard. Unknown sites remain exact-host.
      const useCurated = options.curated ?? true;
      const portal = useCurated ? curated?.portalForHostname(hostname) : null;
      const hosts = portal?.hosts || [hostname];
      const key = portal?.canonicalHost || hostname;
      const registrationIds = Object.freeze(Array.from(new Set([key, ...hosts]))
        .map((host) => `prepisi-site-${hash(host)}`));
      const matches = Object.freeze(hosts.flatMap((host) => [
        `http://${host}/*`, `https://${host}/*`
      ]));
      return Object.freeze({
        key,
        hostname,
        hosts,
        legacyKeys: Object.freeze(Array.from(hosts)),
        curated: Boolean(portal),
        matches,
        id: `prepisi-site-${hash(key)}`,
        registrationIds
      });
    } catch (_) {
      return null;
    }
  }

  function targetSettings(settings = {}) {
    return Object.freeze(Object.fromEntries(TARGET_KEYS.map((key) => [key, settings[key]])));
  }

  function ruleForSite(rules, site) {
    if (!rules || !site) return null;
    return rules[site.key] || site.legacyKeys.map((key) => rules[key]).find(Boolean) || null;
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
    ruleForSite,
    targetSettings,
    registrationFor
  });
  global.PrepisiSitePersistence = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
