(function initialiseOptions() {
  "use strict";

  const webext = globalThis.PrepisiWebExt;

  const terms = document.querySelector("#terms");
  const respectLanguage = document.querySelector("#respect-language");
  const status = document.querySelector("#status");
  const uiScriptToggle = document.querySelector("#ui-script-toggle");
  const diagnostics = globalThis.PrepisiFirefoxDiagnostics;
  const diagnosticsSection = document.querySelector("#firefox-diagnostics");
  const diagnosticsEnabled = document.querySelector("#diagnostics-enabled");
  const diagnosticsHost = document.querySelector("#diagnostics-host");
  const diagnosticsLog = document.querySelector("#diagnostics-log");
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

  async function loadDiagnostics() {
    if (!diagnostics?.isFirefox()) return;
    diagnosticsSection.hidden = false;
    const stored = await webext.storage.local.get({
      [diagnostics.ENABLED_KEY]: false,
      [diagnostics.HOST_KEY]: "",
      [diagnostics.LOG_KEY]: [],
      [diagnostics.INSTALL_KEY]: null
    });
    diagnosticsEnabled.checked = stored[diagnostics.ENABLED_KEY] === true;
    diagnosticsHost.value = stored[diagnostics.HOST_KEY] || "";
    const installKind = stored[diagnostics.INSTALL_KEY] === true
      ? t("diagnosticsTemporary")
      : t("diagnosticsSignedUnknown");
    const entries = Array.isArray(stored[diagnostics.LOG_KEY]) ? stored[diagnostics.LOG_KEY] : [];
    diagnosticsLog.dataset.installKind = installKind;
    diagnosticsLog.textContent = `${installKind}\n${entries.length
      ? entries.map((entry) => JSON.stringify(entry)).join("\n")
      : t("diagnosticsEmpty")}`;
  }

  async function saveDiagnostics() {
    const host = diagnostics.cleanHostname(diagnosticsHost.value);
    if (diagnosticsEnabled.checked && !host) {
      setStatus("diagnosticsHostRequired");
      return;
    }
    await webext.storage.local.set({
      [diagnostics.ENABLED_KEY]: diagnosticsEnabled.checked,
      [diagnostics.HOST_KEY]: host
    });
    diagnosticsHost.value = host;
    setStatus("diagnosticsSaved");
  }

  async function clearDiagnostics() {
    await diagnostics.clear();
    diagnosticsLog.textContent = `${diagnosticsLog.dataset.installKind || ""}\n${t("diagnosticsEmpty")}`.trim();
    setStatus("diagnosticsCleared");
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
    await loadDiagnostics();
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
  document.querySelector("#diagnostics-save").addEventListener("click", saveDiagnostics);
  document.querySelector("#diagnostics-clear").addEventListener("click", clearDiagnostics);
  load().catch((error) => setStatus("loadError", { message: error.message }));
})();
