(function initialisePopup() {
  "use strict";

  const webext = globalThis.PrepisiWebExt;
  const persistence = globalThis.PrepisiSitePersistence;
  const firefoxBuild = Boolean(webext.runtime.getManifest().browser_specific_settings?.gecko);

  const DEFAULTS = {
    customProtectedTerms: [],
    respectForeignLanguageSpans: true
  };
  const UI_PREFERENCE = { uiScript: globalThis.PrepisiUI.DEFAULT_SCRIPT };
  const ORIGINAL_PAGE_STATE = Object.freeze({
    targetScript: "original",
    targetDialect: "original",
    highlightDialectChanges: false
  });

  const restoreButton = document.querySelector("#restore");
  const uiScriptToggle = document.querySelector("#ui-script-toggle");
  const highlightDialect = document.querySelector("#highlight-dialect");
  const rememberSite = document.querySelector("#remember-site");
  const status = document.querySelector("#status");
  const instantControls = Array.from(document.querySelectorAll(
    "input[name='targetScript'], input[name='targetDialect'], #highlight-dialect"
  ));
  let applying = false;
  let uiScript = UI_PREFERENCE.uiScript;
  let currentTab = null;
  let currentSite = null;
  let currentStatus = { key: "initialStatus", values: {}, type: "" };

  function t(key, values) {
    return globalThis.PrepisiUI.translate(uiScript, key, values);
  }

  function renderStatus() {
    const values = { ...currentStatus.values };
    if (currentStatus.key === "conversionDone") {
      values.highlighted = values.highlightedCount
        ? t("highlightedCount", { count: values.highlightedCount }) : "";
    }
    status.textContent = t(currentStatus.key, values);
    status.className = `status ${currentStatus.type}`.trim();
  }

  function setStatus(key, values = {}, type = "") {
    currentStatus = { key, values, type };
    renderStatus();
  }

  function renderInterface() {
    globalThis.PrepisiUI.applyStaticText(document, uiScript);
    uiScriptToggle.textContent = uiScript === "cyrillic" ? "L" : "Ћ";
    renderStatus();
  }

  function setBusy(busy) {
    for (const control of [...instantControls, restoreButton]) control.disabled = busy;
    if (rememberSite.dataset.unsupported !== "true") rememberSite.disabled = busy;
  }

  function selected(name) {
    return document.querySelector(`input[name='${name}']:checked`)?.value;
  }

  function readForm() {
    return {
      targetScript: selected("targetScript") || ORIGINAL_PAGE_STATE.targetScript,
      targetDialect: selected("targetDialect") || ORIGINAL_PAGE_STATE.targetDialect,
      highlightDialectChanges: highlightDialect.checked
    };
  }

  function fillForm(settings) {
    for (const name of ["targetScript", "targetDialect"]) {
      const input = document.querySelector(`input[name='${name}'][value='${settings[name]}']`);
      if (input) input.checked = true;
    }
    highlightDialect.checked = settings.highlightDialectChanges === true;
  }

  async function activeTab() {
    const [tab] = await webext.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error(t("noActivePage"));
    return tab;
  }

  async function pageStatus(tab) {
    const results = await webext.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => globalThis.__PREPISI__?.getStatus?.() || null
    });
    return results[0]?.result || null;
  }

  function supportsSitePersistence() {
    if (firefoxBuild) return Boolean(webext.permissions?.request && webext.permissions?.contains);
    return Boolean(webext.permissions?.request && webext.permissions?.contains &&
      webext.scripting?.registerContentScripts && webext.scripting?.unregisterContentScripts);
  }

  async function unregisterSite(site) {
    if (firefoxBuild) return;
    if (!site || !webext.scripting?.unregisterContentScripts) return;
    try {
      await webext.scripting.unregisterContentScripts({ ids: [site.id] });
    } catch (_) {
      // The script was not registered in this extension session.
    }
  }

  async function registerSite(site) {
    if (!supportsSitePersistence()) throw new Error(t("sitePersistenceUnsupported"));
    if (firefoxBuild) return;
    await unregisterSite(site);
    await webext.scripting.registerContentScripts([persistence.registrationFor(site)]);
  }

  async function saveSiteRule(settings) {
    if (!currentSite || !rememberSite.checked) return;
    const stored = await webext.storage.local.get({ [persistence.STORAGE_KEY]: {} });
    const rules = { ...stored[persistence.STORAGE_KEY] };
    for (const key of currentSite.legacyKeys) delete rules[key];
    await webext.storage.local.set({
      [persistence.STORAGE_KEY]: {
        ...rules,
        [currentSite.key]: persistence.targetSettings(settings)
      }
    });
  }

  async function forgetSite(site) {
    if (!site) return;
    const stored = await webext.storage.local.get({ [persistence.STORAGE_KEY]: {} });
    const rules = { ...stored[persistence.STORAGE_KEY] };
    for (const key of new Set([site.key, ...site.legacyKeys])) delete rules[key];
    await webext.storage.local.set({ [persistence.STORAGE_KEY]: rules });
    await unregisterSite(site);
    if (!(firefoxBuild && site.curated)) {
      await webext.permissions?.remove?.({ origins: Array.from(site.matches) });
    }
  }

  async function loadPageSettings() {
    const [preferences, tab] = await Promise.all([
      webext.storage.local.get({ ...DEFAULTS, [persistence.STORAGE_KEY]: {} }),
      activeTab()
    ]);
    currentTab = tab;
    currentSite = persistence.descriptorForUrl(tab.url);
    let rememberedRule = currentSite
      ? persistence.ruleForSite(preferences[persistence.STORAGE_KEY], currentSite) : null;
    let isRemembered = false;
    if (!supportsSitePersistence()) {
      rememberSite.dataset.unsupported = "true";
      rememberSite.disabled = true;
    } else if (rememberedRule && currentSite) {
      isRemembered = await webext.permissions.contains({ origins: Array.from(currentSite.matches) });
      if (isRemembered) {
        rememberSite.checked = true;
        await registerSite(currentSite);
      } else {
        await forgetSite(currentSite);
        rememberedRule = null;
      }
    }
    let current = null;
    try {
      current = await pageStatus(tab);
    } catch (_) {
      // Restricted browser pages cannot be inspected. They still show the
      // neutral controls instead of leaking the choice from another tab.
    }
    const settings = {
      customProtectedTerms: preferences.customProtectedTerms,
      respectForeignLanguageSpans: preferences.respectForeignLanguageSpans,
      ...ORIGINAL_PAGE_STATE,
      ...(isRemembered ? rememberedRule : {}),
      ...(current?.options || {})
    };
    fillForm(settings);
    setStatus(current?.active ? "tabConfigured" :
      isRemembered ? "siteRemembered" : "tabOriginal",
    isRemembered ? { site: currentSite.hostname } : {});
    const needsApply = isRemembered && !current?.active &&
      (settings.targetScript !== "original" || settings.targetDialect !== "original");
    return { settings, needsApply };
  }

  async function settingsFromForm() {
    return { ...await webext.storage.local.get(DEFAULTS), ...readForm() };
  }

  async function applyToPage(settings) {
    const tab = await activeTab();
    try {
      await webext.scripting.removeCSS({ target: { tabId: tab.id }, files: ["/src/highlight.css"] });
    } catch (_) {
      // There is nothing to remove on the first use in a tab.
    }
    await webext.scripting.insertCSS({ target: { tabId: tab.id }, files: ["/src/highlight.css"] });
    await webext.scripting.executeScript({
      target: { tabId: tab.id },
      files: [
        "/src/generated/company-names.js",
        "/src/generated/comtext-pairs.js", "/src/generated/lexicon-pairs.js",
        "/src/dialect-data.js", "/src/converter.js", "/src/content.js"
      ]
    });
    const results = await webext.scripting.executeScript({
      target: { tabId: tab.id },
      func: (pageSettings) => globalThis.__PREPISI__.apply(pageSettings),
      args: [settings]
    });
    return results[0]?.result;
  }

  async function runApply(settings) {
    setStatus("rewriting");
    const result = await applyToPage(settings);
    if (result?.active) {
      setStatus("conversionDone", {
        count: result.changedTextNodes,
        highlightedCount: settings.highlightDialectChanges ? result.highlightedWords : 0
      }, "success");
    } else {
      setStatus("restoredDone", { count: result?.restoredTextNodes || 0 }, "success");
    }
  }

  async function requestApply(settingsOverride) {
    if (applying) return;
    applying = true;
    setBusy(true);
    try {
      const settings = settingsOverride || await settingsFromForm();
      await runApply(settings);
      await saveSiteRule(settings);
    } catch (error) {
      const restricted = /Cannot access|extensions gallery|chrome:\/\/|edge:\/\/|Missing host permission/i.test(error.message);
      setStatus(restricted ? "restrictedPage" : "applyFailed",
        restricted ? {} : { message: error.message }, "error");
    } finally {
      applying = false;
      setBusy(false);
    }
  }

  rememberSite.addEventListener("change", () => {
    const enabling = rememberSite.checked;
    if (!currentSite || !supportsSitePersistence()) {
      rememberSite.checked = false;
      setStatus(currentSite ? "sitePersistenceUnsupported" : "restrictedPage", {}, "error");
      return;
    }

    if (!enabling) {
      applying = true;
      setBusy(true);
      forgetSite(currentSite).then(() => {
        setStatus("siteForgotten", { site: currentSite.hostname }, "success");
      }).catch((error) => {
        rememberSite.checked = true;
        setStatus("applyFailed", { message: error.message }, "error");
      }).finally(() => {
        applying = false;
        setBusy(false);
      });
      return;
    }

    // Request must begin directly inside the user's change gesture, especially
    // in Firefox; do not put an awaited operation before this call.
    const permissionRequest = webext.permissions.request({ origins: Array.from(currentSite.matches) });
    applying = true;
    setBusy(true);
    Promise.resolve(permissionRequest).then(async (granted) => {
      if (!granted) {
        rememberSite.checked = false;
        setStatus("sitePermissionDenied", {}, "error");
        return;
      }
      const settings = await settingsFromForm();
      await saveSiteRule(settings);
      await registerSite(currentSite);
      await runApply(settings);
      setStatus("siteRemembered", { site: currentSite.hostname }, "success");
    }).catch(async (error) => {
      rememberSite.checked = false;
      await forgetSite(currentSite).catch(() => {});
      setStatus("applyFailed", { message: error.message }, "error");
    }).finally(() => {
      applying = false;
      setBusy(false);
    });
  });

  for (const control of instantControls) control.addEventListener("change", () => requestApply());
  uiScriptToggle.addEventListener("click", async () => {
    uiScript = uiScript === "cyrillic" ? "latin" : "cyrillic";
    renderInterface();
    await webext.storage.local.set({ uiScript });
  });
  restoreButton.addEventListener("click", async () => {
    const settings = { ...await webext.storage.local.get(DEFAULTS), ...ORIGINAL_PAGE_STATE };
    fillForm(settings);
    await requestApply(settings);
  });
  document.querySelector("#settings").addEventListener("click", () => webext.runtime.openOptionsPage());

  fillForm(ORIGINAL_PAGE_STATE);
  webext.storage.local.get(UI_PREFERENCE).then((stored) => {
    uiScript = globalThis.PrepisiUI.normaliseScript(stored.uiScript);
    renderInterface();
    return loadPageSettings();
  }).then((loaded) => loaded?.needsApply ? requestApply(loaded.settings) : null)
    .catch((error) => setStatus("settingsLoadFailed", { message: error.message }, "error"));
})();
