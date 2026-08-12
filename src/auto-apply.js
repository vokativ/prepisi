(async function autoApplyRememberedSite() {
  "use strict";

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
  const rule = stored[persistence.STORAGE_KEY]?.[site.key];
  if (!rule) return;

  await globalThis.__PREPISI__.apply({
    customProtectedTerms: stored.customProtectedTerms,
    respectForeignLanguageSpans: stored.respectForeignLanguageSpans,
    ...rule
  });
})().catch((error) => {
  globalThis.__PREPISI_AUTO_APPLY_ERROR__ = String(error?.message || error);
});
