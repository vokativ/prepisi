(function initialiseFirefoxPersistenceBackground(global) {
  "use strict";

  const webext = global.PrepisiWebExt;
  const persistence = global.PrepisiSitePersistence;
  if (!webext?.webNavigation?.onCompleted || !webext?.scripting || !persistence) return;

  async function injectRememberedRule(tabId, url) {
    const site = persistence.descriptorForUrl(url, { curated: true });
    if (!site) return;
    const stored = await webext.storage.local.get({
      [persistence.STORAGE_KEY]: {},
      customProtectedTerms: [],
      respectForeignLanguageSpans: true
    });
    if (!persistence.ruleForSite(stored[persistence.STORAGE_KEY], site)) return;

    const allowed = await webext.permissions.contains({ origins: Array.from(site.matches) });
    if (!allowed) return;
    await webext.scripting.insertCSS({
      target: { tabId },
      files: ["src/highlight.css"]
    });
    await webext.scripting.executeScript({
      target: { tabId },
      files: Array.from(persistence.CONTENT_SCRIPTS)
    });
  }

  // Register synchronously at top level so Firefox can persist this listener
  // and wake the MV3 event page after it has been suspended.
  webext.webNavigation.onCompleted.addListener((details) => {
    if (details.frameId !== 0) return undefined;
    return injectRememberedRule(details.tabId, details.url).catch((error) => {
      global.__PREPISI_BACKGROUND_ERROR__ = String(error?.message || error);
    });
  }, { url: [{ schemes: ["http", "https"] }] });
})(typeof globalThis !== "undefined" ? globalThis : this);
