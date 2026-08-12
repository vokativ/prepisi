(async function autoApplyRememberedSite() {
  "use strict";

  if (globalThis.__PREPISI_AUTO_APPLY_PROMISE__) {
    await globalThis.__PREPISI_AUTO_APPLY_PROMISE__;
    return;
  }

  globalThis.__PREPISI_AUTO_APPLY_PROMISE__ = (async () => {

  const webext = globalThis.PrepisiWebExt;
  const persistence = globalThis.PrepisiSitePersistence;
  const site = persistence?.descriptorForUrl(globalThis.location?.href);
  if (!webext || !site || !globalThis.__PREPISI__?.apply) return;

  const defaults = {
    [persistence.STORAGE_KEY]: {},
    customProtectedTerms: [],
    respectForeignLanguageSpans: true
  };
  const stored = await webext.storage.local.get(defaults);
  const rule = persistence.ruleForSite(stored[persistence.STORAGE_KEY], site);
  if (!rule) return;

  const result = await globalThis.__PREPISI__.apply({
    customProtectedTerms: stored.customProtectedTerms,
    respectForeignLanguageSpans: stored.respectForeignLanguageSpans,
    ...rule
  });
  return { stage: "auto-apply-complete", changedTextNodes: result?.changedTextNodes || 0 };
  })();
  return await globalThis.__PREPISI_AUTO_APPLY_PROMISE__;
})().catch((error) => {
  globalThis.__PREPISI_AUTO_APPLY_ERROR__ = String(error?.message || error);
  return { stage: "auto-apply-error", error: String(error?.message || error) };
});
