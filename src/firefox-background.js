(function initialiseFirefoxPersistenceBackground(global) {
  "use strict";

  const webext = global.PrepisiWebExt;
  const persistence = global.PrepisiSitePersistence;
  const diagnostics = global.PrepisiFirefoxDiagnostics;
  if (!webext?.webNavigation?.onCompleted || !webext?.scripting || !persistence) return;

  webext.runtime?.onInstalled?.addListener((details) => {
    webext.storage.local.set({
      [diagnostics?.INSTALL_KEY || "firefoxInstallTemporary"]: details?.temporary === true
    });
  });
  diagnostics?.record("background-start").catch(() => undefined);

  async function injectRememberedRule(tabId, url) {
    const site = persistence.descriptorForUrl(url, { curated: true });
    if (!site) return;
    await diagnostics?.record("navigation-completed", { host: site.key, tabId, frameId: 0 });
    const stored = await webext.storage.local.get({
      [persistence.STORAGE_KEY]: {},
      customProtectedTerms: [],
      respectForeignLanguageSpans: true
    });
    if (!persistence.ruleForSite(stored[persistence.STORAGE_KEY], site)) {
      await diagnostics?.record("rule-missing", { host: site.key, tabId });
      return;
    }
    const allowed = await webext.permissions.contains({ origins: Array.from(site.matches) });
    await diagnostics?.record("permission-checked", {
      host: site.key, tabId, result: allowed ? "granted" : "missing"
    });
    if (!allowed) return;
    await webext.scripting.insertCSS({
      target: { tabId },
      files: ["src/highlight.css"]
    });
    await diagnostics?.record("css-inserted", { host: site.key, tabId });
    const injectionResults = await webext.scripting.executeScript({
      target: { tabId },
      files: Array.from(persistence.CONTENT_SCRIPTS)
    });
    const acknowledgement = injectionResults?.[0]?.result;
    await diagnostics?.record("scripts-executed", {
      host: site.key,
      tabId,
      result: acknowledgement?.stage === "auto-apply-complete"
        ? `changed:${acknowledgement.changedTextNodes || 0}`
        : acknowledgement?.stage || "no-acknowledgement"
    });
  }

  // Register synchronously at top level so Firefox can persist this listener
  // and wake the MV3 event page after it has been suspended.
  webext.webNavigation.onCompleted.addListener((details) => {
    if (details.frameId !== 0) return undefined;
    return injectRememberedRule(details.tabId, details.url).catch((error) => {
      global.__PREPISI_BACKGROUND_ERROR__ = String(error?.message || error);
      const site = persistence.descriptorForUrl(details.url, { curated: true });
      return diagnostics?.record("background-error", {
        host: site?.key,
        tabId: details.tabId,
        frameId: details.frameId,
        error: error?.message || error
      }).catch(() => undefined);
    });
  }, { url: [{ schemes: ["http", "https"] }] });
})(typeof globalThis !== "undefined" ? globalThis : this);
