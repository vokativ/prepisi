(function exposeWebExtensionAPI(global) {
  "use strict";

  const api = global.browser || global.chrome;
  if (!api) throw new Error("WebExtension API is unavailable.");

  global.PrepisiWebExt = api;
})(globalThis);
