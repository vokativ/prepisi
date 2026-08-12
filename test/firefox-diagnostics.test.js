"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "src/firefox-diagnostics.js"), "utf8");

function diagnosticsContext(initial) {
  let stored = structuredClone(initial);
  const context = vm.createContext({
    URL,
    Date,
    PrepisiWebExt: {
      runtime: { getManifest: () => ({ browser_specific_settings: { gecko: {} } }) },
      storage: { local: {
        get: async (defaults) => ({ ...defaults, ...stored }),
        set: async (values) => { stored = { ...stored, ...values }; }
      } }
    }
  });
  context.globalThis = context;
  vm.runInContext(source, context);
  return { diagnostics: context.PrepisiFirefoxDiagnostics, stored: () => stored };
}

test("Firefox diagnostics are opt-in, host-scoped, bounded, and omit URLs", async () => {
  const disabled = diagnosticsContext({});
  assert.equal(await disabled.diagnostics.record("navigation", { host: "rts.rs" }), false);

  const enabled = diagnosticsContext({
    firefoxDiagnosticsEnabled: true,
    firefoxDiagnosticHost: "rts.rs",
    firefoxDiagnosticLog: []
  });
  assert.equal(await enabled.diagnostics.record("navigation", {
    host: "www.index.hr", result: "ignored"
  }), false);
  for (let index = 0; index < 45; index += 1) {
    await enabled.diagnostics.record("navigation", {
      host: "rts.rs", tabId: index, result: "ok", url: "https://rts.rs/private/path"
    });
  }
  const log = enabled.stored().firefoxDiagnosticLog;
  assert.equal(log.length, 40);
  assert.equal(log[0].tabId, 5);
  assert.equal(log.at(-1).host, "rts.rs");
  assert.equal("url" in log.at(-1), false);

  await enabled.diagnostics.record("error", {
    host: "rts.rs", error: "Failure at https://rts.rs/private/path?token=secret"
  });
  assert.equal(enabled.stored().firefoxDiagnosticLog.at(-1).error, "Failure at [url]");
});
