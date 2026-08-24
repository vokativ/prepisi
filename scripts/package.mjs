import fs from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
function argValue(flag) {
  const arg = process.argv.find((entry) => entry.startsWith(`${flag}=`));
  return arg ? path.resolve(arg.slice(flag.length + 1)) : undefined;
}
const buildRoot = argValue("--build-root") ?? path.join(root, "build");
const distRoot = argValue("--dist-root") ?? path.join(root, "dist");

// Mirrors the previous scripts/package.ps1 (Windows-only, `Compress-Archive`) with a
// dependency-free implementation: Node ships no zip writer, so this hand-writes the
// standard ZIP local/central-directory/EOCD structures using only `node:zlib` (DEFLATE)
// and a table-based CRC32. No third-party npm packages, no external CLI (`zip`/`7z`/
// python), and no PowerShell requirement, matching the project's "no dependency beyond
// Node.js" baseline. Output is deterministic: fixed per-entry timestamp, fixed 0644
// regular-file permissions, sorted entry order, always DEFLATE.
const TARGETS = Object.freeze({
  chromium: "chromium",
  edge: "edge",
  firefox: "firefox",
  safari: "safari-source"
});

const FIXED_DOS_TIME = 0x0000; // 00:00:00
const FIXED_DOS_DATE = 0x0021; // 1980-01-01 (minimum representable DOS date)
const REGULAR_FILE_UNIX_MODE = 0o100644; // -rw-r--r--

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i++) {
    crc = CRC_TABLE[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

async function collectFiles(sourceDir) {
  const files = [];
  async function walk(currentDir, relativePrefix) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(currentDir, entry.name);
      const relative = relativePrefix ? `${relativePrefix}/${entry.name}` : entry.name;
      if (entry.isSymbolicLink()) {
        throw new Error(`Refusing to package a symlink: ${absolute}`);
      } else if (entry.isDirectory()) {
        await walk(absolute, relative);
      } else if (entry.isFile()) {
        files.push({ archiveName: relative, absolutePath: absolute });
      } else {
        throw new Error(`Refusing to package a non-regular file: ${absolute}`);
      }
    }
  }
  await walk(sourceDir, "");
  files.sort((a, b) => (a.archiveName < b.archiveName ? -1 : a.archiveName > b.archiveName ? 1 : 0));
  return files;
}

function writeUInt32LE(buffer, offset, value) {
  buffer.writeUInt32LE(value >>> 0, offset);
}

async function writeZip(sourceDir, destinationPath) {
  const files = await collectFiles(sourceDir);
  if (!files.some((file) => file.archiveName === "manifest.json")) {
    throw new Error(`${sourceDir} does not contain a root manifest.json`);
  }

  const localChunks = [];
  const centralChunks = [];
  let offset = 0;

  for (const { archiveName, absolutePath } of files) {
    const nameBuffer = Buffer.from(archiveName, "utf8");
    const content = await fs.readFile(absolutePath);
    const compressed = zlib.deflateRawSync(content, { level: 6 });
    const crc = crc32(content);
    const generalFlag = 0x0800; // UTF-8 filename flag

    const localHeader = Buffer.alloc(30);
    writeUInt32LE(localHeader, 0, 0x04034b50);
    localHeader.writeUInt16LE(20, 4); // version needed
    localHeader.writeUInt16LE(generalFlag, 6);
    localHeader.writeUInt16LE(8, 8); // compression method: deflate
    localHeader.writeUInt16LE(FIXED_DOS_TIME, 10);
    localHeader.writeUInt16LE(FIXED_DOS_DATE, 12);
    writeUInt32LE(localHeader, 14, crc);
    writeUInt32LE(localHeader, 18, compressed.length);
    writeUInt32LE(localHeader, 22, content.length);
    localHeader.writeUInt16LE(nameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28); // extra field length

    localChunks.push(localHeader, nameBuffer, compressed);

    const centralHeader = Buffer.alloc(46);
    writeUInt32LE(centralHeader, 0, 0x02014b50);
    centralHeader.writeUInt16LE((3 << 8) | 20, 4); // version made by: UNIX, spec 2.0
    centralHeader.writeUInt16LE(20, 6); // version needed
    centralHeader.writeUInt16LE(generalFlag, 8);
    centralHeader.writeUInt16LE(8, 10);
    centralHeader.writeUInt16LE(FIXED_DOS_TIME, 12);
    centralHeader.writeUInt16LE(FIXED_DOS_DATE, 14);
    writeUInt32LE(centralHeader, 16, crc);
    writeUInt32LE(centralHeader, 20, compressed.length);
    writeUInt32LE(centralHeader, 24, content.length);
    centralHeader.writeUInt16LE(nameBuffer.length, 28);
    centralHeader.writeUInt16LE(0, 30); // extra length
    centralHeader.writeUInt16LE(0, 32); // comment length
    centralHeader.writeUInt16LE(0, 34); // disk number start
    centralHeader.writeUInt16LE(0, 36); // internal attributes
    writeUInt32LE(centralHeader, 38, (REGULAR_FILE_UNIX_MODE << 16) >>> 0);
    writeUInt32LE(centralHeader, 42, offset);

    centralChunks.push(centralHeader, nameBuffer);

    offset += localHeader.length + nameBuffer.length + compressed.length;
  }

  const centralDirectoryOffset = offset;
  const centralDirectory = Buffer.concat(centralChunks);

  const eocd = Buffer.alloc(22);
  writeUInt32LE(eocd, 0, 0x06054b50);
  eocd.writeUInt16LE(0, 4); // disk number
  eocd.writeUInt16LE(0, 6); // disk with central directory
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  writeUInt32LE(eocd, 12, centralDirectory.length);
  writeUInt32LE(eocd, 16, centralDirectoryOffset);
  eocd.writeUInt16LE(0, 20); // comment length

  const archive = Buffer.concat([...localChunks, centralDirectory, eocd]);

  await fs.mkdir(path.dirname(destinationPath), { recursive: true });
  const temporaryPath = `${destinationPath}.tmp-${process.pid}`;
  await fs.writeFile(temporaryPath, archive);
  await fs.rename(temporaryPath, destinationPath);
  return { entryCount: files.length, byteLength: archive.length };
}

async function main() {
  const skipBuild = process.argv.includes("--skip-build");
  const packageJson = JSON.parse(await fs.readFile(path.join(root, "package.json"), "utf8"));
  const version = packageJson.version;

  if (!skipBuild) {
    execFileSync(process.execPath, [
      path.join(root, "scripts", "build-extension.mjs"), "all", `--build-root=${buildRoot}`
    ], {
      cwd: root,
      stdio: "inherit"
    });
  }

  await fs.mkdir(distRoot, { recursive: true });
  for (const [target, suffix] of Object.entries(TARGETS)) {
    const sourceDir = path.join(buildRoot, target);
    const destinationPath = path.join(distRoot, `prepisi-${version}-${suffix}.zip`);
    const { entryCount, byteLength } = await writeZip(sourceDir, destinationPath);
    console.log(`${path.relative(root, destinationPath)}: ${entryCount} files, ${byteLength} bytes`);
  }
}

await main();
