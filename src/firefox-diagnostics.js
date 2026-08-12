(function exposeFirefoxDiagnostics(global) {
  "use strict";

  if (global.PrepisiFirefoxDiagnostics) return;

  const webext = global.PrepisiWebExt;
  const ENABLED_KEY = "firefoxDiagnosticsEnabled";
  const HOST_KEY = "firefoxDiagnosticHost";
  const LOG_KEY = "firefoxDiagnosticLog";
  const INSTALL_KEY = "firefoxInstallTemporary";
  const MAX_ENTRIES = 40;
  let writeChain = Promise.resolve();

  function isFirefox() {
    try {
      return Boolean(webext?.runtime?.getManifest?.().browser_specific_settings?.gecko);
    } catch (_) {
      return false;
    }
  }

  function cleanHostname(value) {
    const candidate = String(value || "").trim().toLocaleLowerCase("en-US");
    if (!candidate) return "";
    try {
      return new URL(candidate.includes("://") ? candidate : `https://${candidate}`).hostname;
    } catch (_) {
      return "";
    }
  }

  function cleanText(value, limit = 240) {
    return String(value ?? "")
      .replace(/\b(?:https?|moz-extension):\/\/\S+/giu, "[url]")
      .replace(/[\r\n\t]+/gu, " ")
      .slice(0, limit);
  }

  async function append(stage, details = {}) {
    if (!isFirefox() || !webext?.storage?.local) return false;
    const stored = await webext.storage.local.get({
      [ENABLED_KEY]: false,
      [HOST_KEY]: "",
      [LOG_KEY]: []
    });
    if (stored[ENABLED_KEY] !== true) return false;

    const configuredHost = cleanHostname(stored[HOST_KEY]);
    const host = cleanHostname(details.host);
    // Host-specific records require an explicit test host. This prevents an
    // accidentally enabled diagnostic session from becoming browsing history.
    if (host && (!configuredHost || host !== configuredHost)) return false;

    const entry = {
      time: new Date().toISOString(),
      stage: cleanText(stage, 64)
    };
    if (host) entry.host = host;
    if (Number.isInteger(details.tabId)) entry.tabId = details.tabId;
    if (Number.isInteger(details.frameId)) entry.frameId = details.frameId;
    if (details.result !== undefined) entry.result = cleanText(details.result, 120);
    if (details.error !== undefined) entry.error = cleanText(details.error, 240);

    const previous = Array.isArray(stored[LOG_KEY]) ? stored[LOG_KEY] : [];
    await webext.storage.local.set({
      [LOG_KEY]: [...previous, entry].slice(-MAX_ENTRIES)
    });
    return true;
  }

  function record(stage, details = {}) {
    writeChain = writeChain.then(() => append(stage, details), () => append(stage, details));
    return writeChain;
  }

  async function clear() {
    if (webext?.storage?.local) await webext.storage.local.set({ [LOG_KEY]: [] });
  }

  const api = Object.freeze({
    ENABLED_KEY,
    HOST_KEY,
    LOG_KEY,
    INSTALL_KEY,
    MAX_ENTRIES,
    isFirefox,
    cleanHostname,
    record,
    clear
  });
  global.PrepisiFirefoxDiagnostics = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
