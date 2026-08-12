(function initialiseOptions() {
  "use strict";

  const webext = globalThis.PrepisiWebExt;

  const terms = document.querySelector("#terms");
  const respectLanguage = document.querySelector("#respect-language");
  const status = document.querySelector("#status");
  const uiScriptToggle = document.querySelector("#ui-script-toggle");
  let uiScript = globalThis.PrepisiUI.DEFAULT_SCRIPT;
  let currentStatus = null;

  function t(key, values) {
    return globalThis.PrepisiUI.translate(uiScript, key, values);
  }

  function setStatus(key, values = {}) {
    currentStatus = key ? { key, values } : null;
    status.textContent = currentStatus ? t(currentStatus.key, currentStatus.values) : "";
  }

  function renderInterface() {
    globalThis.PrepisiUI.applyStaticText(document, uiScript);
    uiScriptToggle.textContent = uiScript === "cyrillic" ? "L" : "Ћ";
    const companies = globalThis.PrepisiCompanyNames;
    document.querySelector("#company-summary").textContent = t("companySummary", {
      uniqueNames: companies.COUNTS.uniqueNames,
      positions: companies.COUNTS.positions
    });
    if (currentStatus) setStatus(currentStatus.key, currentStatus.values);
  }

  async function load() {
    const stored = await webext.storage.local.get({
      customProtectedTerms: [],
      respectForeignLanguageSpans: true,
      uiScript: globalThis.PrepisiUI.DEFAULT_SCRIPT
    });
    uiScript = globalThis.PrepisiUI.normaliseScript(stored.uiScript);
    renderInterface();
    terms.value = stored.customProtectedTerms.join("\n");
    respectLanguage.checked = stored.respectForeignLanguageSpans;
    document.querySelector("#builtins").textContent = [
      ...globalThis.PrepisiConverter.DEFAULT_PROTECTED_TERMS,
      "Meta", "X"
    ].join(" · ");
  }

  async function save() {
    const customProtectedTerms = Array.from(new Set(
      terms.value.split(/\r?\n/u).map((term) => term.trim()).filter(Boolean)
    ));
    await webext.storage.local.set({
      customProtectedTerms,
      respectForeignLanguageSpans: respectLanguage.checked
    });
    terms.value = customProtectedTerms.join("\n");
    setStatus("savedLocally");
    window.setTimeout(() => setStatus(null), 2500);
  }

  uiScriptToggle.addEventListener("click", async () => {
    uiScript = uiScript === "cyrillic" ? "latin" : "cyrillic";
    renderInterface();
    await webext.storage.local.set({ uiScript });
  });
  document.querySelector("#save").addEventListener("click", save);
  load().catch((error) => setStatus("loadError", { message: error.message }));
})();
