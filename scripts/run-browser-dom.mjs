import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Browser-DOM integration test for the conversion engine and content controller.
// The fixture loads repository source files directly, so this does not validate
// extension installation, manifests, popup controls, or browser permissions.

// 1. Start the local fixture server.
const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json"
};

const server = http.createServer((req, res) => {
  const safePath = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, "");
  const filePath = path.join(root, safePath === "/" ? "test/fixture.html" : safePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    res.end(data);
  });
});

await new Promise((resolve) => server.listen(8080, "127.0.0.1", resolve));
console.log("Local HTTP server running on http://127.0.0.1:8080");

// 2. Spawn headless Chrome. The fixture supplies the code under test directly.
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const userDataDir = `/tmp/prepisi-browser-dom-${Date.now()}`;

const chromeProcess = spawn(chromePath, [
  "--headless=new",
  "--remote-debugging-port=9222",
  `--user-data-dir=${userDataDir}`,
  "--no-first-run",
  "--no-default-browser-check"
], { stdio: "ignore" });

// Wait for CDP port 9222
let wsUrl = null;
for (let i = 0; i < 30; i++) {
  await new Promise((r) => setTimeout(r, 200));
  try {
    const res = await fetch("http://127.0.0.1:9222/json/version");
    const data = await res.json();
    wsUrl = data.webSocketDebuggerUrl;
    if (wsUrl) break;
  } catch (e) {
    // retrying...
  }
}

if (!wsUrl) {
  console.error("Failed to connect to Chrome CDP");
  chromeProcess.kill();
  server.close();
  process.exit(1);
}

console.log("Connected to Chrome CDP:", wsUrl);

// Simple CDP JSON-RPC helper using WebSocket or HTTP Target API
// Create a new target page
const createTargetRes = await fetch("http://127.0.0.1:9222/json/new?http://127.0.0.1:8080/test/fixture.html", { method: "PUT" });
const target = await createTargetRes.json();
console.log("Opened target page:", target.id, target.url);

// Use WebSocket to evaluate page behavior
// Use native Node.js WebSocket
const ws = new WebSocket(target.webSocketDebuggerUrl);

await new Promise((resolve) => ws.addEventListener("open", resolve, { once: true }));

let id = 1;
function sendCDP(method, params = {}) {
  return new Promise((resolve, reject) => {
    const reqId = id++;
    const handler = (evt) => {
      const res = JSON.parse(evt.data);
      if (res.id === reqId) {
        ws.removeEventListener("message", handler);
        if (res.error) reject(res.error);
        else resolve(res.result);
      }
    };
    ws.addEventListener("message", handler);
    ws.send(JSON.stringify({ id: reqId, method, params }));
  });
}

// Enable Runtime and Page domains
await sendCDP("Runtime.enable");
await sendCDP("Page.enable");

// Wait for page load
await new Promise((r) => setTimeout(r, 1000));

// Verification steps
const results = [];

// Step 1: Initial state check
const evalInit = await sendCDP("Runtime.evaluate", {
  expression: `document.querySelector("h1").textContent`
});
results.push({ test: "Page Title Initialized", pass: evalInit.result.value.includes("Probna stranica") });

// Step 2: Apply Cyrillic + Ijekavian through the fixture harness.
await sendCDP("Runtime.evaluate", {
  expression: `document.querySelector("#apply-cyr-ijek").click()`
});
await new Promise((r) => setTimeout(r, 200));

const evalCyr = await sendCDP("Runtime.evaluate", {
  expression: `document.querySelector("article").innerText`
});
const cyrText = evalCyr.result.value;
results.push({ test: "Cyrillic + Ijekavian conversion", pass: cyrText.includes("млијеко") || cyrText.includes("мјесто") });
results.push({ test: "Brand Protection (Google/Apple)", pass: cyrText.includes("Google") && cyrText.includes("Apple") && cyrText.includes("GitHub") });
results.push({ test: "URL and Email Protection", pass: cyrText.includes("https://primer.rs/mjesto") && cyrText.includes("test@primer.rs") });
results.push({ test: "English Span Protection", pass: cyrText.includes("This explicitly English sentence should remain untouched.") });
results.push({ test: "Code Block Protection", pass: cyrText.includes('const mjesto = "vrijeme";') });

// Step 3: Apply Dynamic insertion & conversion
await sendCDP("Runtime.evaluate", {
  expression: `document.querySelector("#dynamic").click()`
});
await new Promise((r) => setTimeout(r, 500));

const evalDynamic = await sendCDP("Runtime.evaluate", {
  expression: `document.querySelector("#dynamic-output").innerText`
});
const dynamicText = evalDynamic.result.value;
results.push({
  test: "Dynamic Content Conversion",
  pass: dynamicText.includes("млијеко") || dynamicText.includes("цвијеће") || dynamicText.includes("Ново")
});

// Step 4: Restore Original
await sendCDP("Runtime.evaluate", {
  expression: `document.querySelector("#restore-original").click()`
});
await new Promise((r) => setTimeout(r, 200));

const evalRestored = await sendCDP("Runtime.evaluate", {
  expression: `document.querySelector("article").innerText`
});
const restoredText = evalRestored.result.value;
results.push({ test: "Exact Text Restoration", pass: restoredText.includes("Njegoš čita lepu vest: mleko stiže u sledeće mesto u ponedeljak.") });

// Step 5: Verify Portal Fixtures inside browser DOM
const portalSamples = JSON.parse(fs.readFileSync(path.join(root, "test/fixtures/portal-samples.json"), "utf8"));
for (const sample of portalSamples) {
  const evalSample = await sendCDP("Runtime.evaluate", {
    expression: `globalThis.PrepisiConverter.convertText(${JSON.stringify(sample.source)}, ${JSON.stringify(sample.options)})`
  });
  results.push({
    test: `Portal Fixture Offline Conversion (${sample.portal})`,
    pass: evalSample.result.value === sample.expected
  });
}
console.log("\n=== Automated Browser-DOM Integration Report ===");
let allPassed = true;
for (const res of results) {
  const status = res.pass ? "PASS" : "FAIL";
  console.log(`[${status}] ${res.test}`);
  if (!res.pass) allPassed = false;
}

// Cleanup
await fetch(`http://127.0.0.1:9222/json/close/${target.id}`, { method: "POST" });
ws.close();
chromeProcess.kill();
server.close();

console.log("\nServer & Chrome process shut down.");
if (allPassed) {
  console.log(`SUCCESS: All ${results.length} browser-DOM integration checks passed.`);
  process.exit(0);
} else {
  console.error("FAILURE: Some browser-DOM integration checks failed.");
  process.exit(1);
}
