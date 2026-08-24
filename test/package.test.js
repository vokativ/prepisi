"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const zlib = require("node:zlib");

const root = path.resolve(__dirname, "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const targetSuffixes = { chromium: "chromium", edge: "edge", firefox: "firefox", safari: "safari-source" };

function filesBelow(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory()
      ? filesBelow(absolute).map((relative) => `${entry.name}/${relative}`)
      : [entry.name];
  });
}

// Independent reader: parses the ZIP central directory and inflates each entry with
// zlib.inflateRawSync, a different code path from the writer's zlib.deflateRawSync.
function readZipEntries(zipPath) {
  const buffer = fs.readFileSync(zipPath);
  const eocd = buffer.subarray(buffer.length - 22);
  assert.equal(eocd.readUInt32LE(0), 0x06054b50, "end-of-central-directory signature");
  const entryCount = eocd.readUInt16LE(10);
  const centralDirectoryOffset = eocd.readUInt32LE(16);

  const entries = [];
  let cursor = centralDirectoryOffset;
  for (let i = 0; i < entryCount; i++) {
    assert.equal(buffer.readUInt32LE(cursor), 0x02014b50, "central directory signature");
    const compressionMethod = buffer.readUInt16LE(cursor + 10);
    const modTime = buffer.readUInt16LE(cursor + 12);
    const modDate = buffer.readUInt16LE(cursor + 14);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const nameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const externalAttr = buffer.readUInt32LE(cursor + 38);
    const localHeaderOffset = buffer.readUInt32LE(cursor + 42);
    const name = buffer.toString("utf8", cursor + 46, cursor + 46 + nameLength);

    const localNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localHeaderOffset + 28);
    const dataStart = localHeaderOffset + 30 + localNameLength + localExtraLength;
    const compressed = buffer.subarray(dataStart, dataStart + compressedSize);
    const content = compressionMethod === 0 ? Buffer.from(compressed) : zlib.inflateRawSync(compressed);

    entries.push({ name, content, modTime, modDate, unixMode: (externalAttr >>> 16) & 0o777 });
    cursor += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

test("package.mjs produces valid, content-accurate, reproducible release ZIPs", () => {
  // Isolated build/dist roots: this test's own "build all" must not race the shared
  // build/ directory that test/build.test.js concurrently builds and tears down.
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "prepisi-package-test-"));
  const isolatedBuildRoot = path.join(workspace, "build");
  const isolatedDistRoot = path.join(workspace, "dist");
  try {
    childProcess.execFileSync(process.execPath, [
      path.join(root, "scripts", "package.mjs"),
      `--build-root=${isolatedBuildRoot}`, `--dist-root=${isolatedDistRoot}`
    ], { cwd: root, stdio: "pipe" });

    const firstRunHashes = {};

    for (const [target, suffix] of Object.entries(targetSuffixes)) {
      const zipPath = path.join(isolatedDistRoot, `prepisi-${packageJson.version}-${suffix}.zip`);
      assert.equal(fs.existsSync(zipPath), true, zipPath);
      firstRunHashes[target] = crypto.createHash("sha256").update(fs.readFileSync(zipPath)).digest("hex");

      const entries = readZipEntries(zipPath);
      const entryNames = entries.map((entry) => entry.name).sort();
      const expectedNames = filesBelow(path.join(isolatedBuildRoot, target)).sort();
      assert.deepEqual(entryNames, expectedNames, `${target} archive entries vs build/${target} files`);

      for (const entry of entries) {
        assert.equal(entry.name.includes("\\"), false, `${target}/${entry.name} backslash`);
        assert.equal(entry.name.startsWith("/"), false, `${target}/${entry.name} leading slash`);
        assert.equal(entry.name.endsWith("/"), false, `${target}/${entry.name} directory entry`);
        assert.equal(entry.unixMode, 0o644, `${target}/${entry.name} permission bits`);
        assert.equal(entry.modTime, 0, `${target}/${entry.name} fixed timestamp`);
        assert.equal(entry.modDate, 0x0021, `${target}/${entry.name} fixed date`);

        const sourcePath = path.join(isolatedBuildRoot, target, ...entry.name.split("/"));
        assert.deepEqual(entry.content, fs.readFileSync(sourcePath), `${target}/${entry.name} content match`);
      }

      assert.equal(entryNames.includes("manifest.json"), true, `${target} ships a root manifest.json`);
    }

    // Reproducibility: an unchanged build tree must package to byte-identical archives.
    childProcess.execFileSync(process.execPath, [
      path.join(root, "scripts", "package.mjs"), "--skip-build",
      `--build-root=${isolatedBuildRoot}`, `--dist-root=${isolatedDistRoot}`
    ], { cwd: root, stdio: "pipe" });
    for (const [target, suffix] of Object.entries(targetSuffixes)) {
      const zipPath = path.join(isolatedDistRoot, `prepisi-${packageJson.version}-${suffix}.zip`);
      const secondHash = crypto.createHash("sha256").update(fs.readFileSync(zipPath)).digest("hex");
      assert.equal(secondHash, firstRunHashes[target], `${target} archive is reproducible across runs`);
    }
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});
