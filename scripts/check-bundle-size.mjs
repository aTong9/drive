import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { fileUrlPath } from "./file-url-path.mjs";

const assetsDirectory = fileUrlPath(new URL("../dist/assets/", import.meta.url));
const maximumEntryBytes = 500 * 1024;
const maximumCatalogShardBytes = 180 * 1024;
const maximumInitialBytes = 5 * 1024 * 1024;
const maximumInitialGzipBytes = 1.75 * 1024 * 1024;
const files = await readdir(assetsDirectory);
const javascriptFiles = files.filter((file) => file.endsWith(".js"));

if (javascriptFiles.length === 0) {
  throw new Error("No JavaScript assets found in dist/assets; run the production build first.");
}

const assets = await Promise.all(javascriptFiles.map(async (file) => ({
  file,
  bytes: (await stat(join(assetsDirectory, file))).size
})));
const largest = assets.sort((left, right) => right.bytes - left.bytes)[0];
const formattedKiB = (bytes) => `${(bytes / 1024).toFixed(1)} KiB`;

console.log(`Largest JavaScript asset: ${largest.file} (${formattedKiB(largest.bytes)})`);

const oversizedCode = assets.find(({ file, bytes }) => !/^catalog-(?:index|search)-/.test(file) && bytes > maximumEntryBytes);
if (oversizedCode) {
  throw new Error(`${oversizedCode.file} exceeds ${formattedKiB(maximumEntryBytes)} JavaScript budget.`);
}

const catalogShards = assets.filter(({ file }) => /^catalog-(?:locations|routes)-\d+-/.test(file));
const oversizedCatalogShard = catalogShards.find(({ bytes }) => bytes > maximumCatalogShardBytes);
if (oversizedCatalogShard) {
  throw new Error(`Catalog shard ${oversizedCatalogShard.file} exceeds ${formattedKiB(maximumCatalogShardBytes)} budget.`);
}
console.log(`Catalog shards: ${catalogShards.length}; per-shard budget ${formattedKiB(maximumCatalogShardBytes)}.`);
if (!catalogShards.length) throw new Error("No on-demand catalog detail shards were emitted.");

const distDirectory = join(assetsDirectory, "..");
const manifest = JSON.parse(await readFile(join(distDirectory, ".vite/manifest.json"), "utf8"));
const initialAssets = new Set(["index.html", "art/roadlens-countryside.jpg"]);
const visited = new Set();
function visit(key) {
  if (visited.has(key)) return;
  visited.add(key);
  const chunk = manifest[key];
  if (!chunk) throw new Error(`Unknown build manifest entry: ${key}`);
  initialAssets.add(chunk.file);
  for (const css of chunk.css ?? []) initialAssets.add(css);
  for (const dependency of chunk.imports ?? []) visit(dependency);
}
for (const [key, chunk] of Object.entries(manifest)) if (chunk.isEntry) visit(key);
// The default workspace is lazy in code but still part of a real first visit.
visit("src/components/location/LocationView.tsx");
if ([...initialAssets].some((file) => /catalog-(?:locations|routes|search)-/.test(file))) {
  throw new Error("Catalog details or full-text search leaked into the initial static import graph.");
}
let initialBytes = 0;
let initialGzipBytes = 0;
const initialGroups = new Map();
for (const file of initialAssets) {
  const content = await readFile(join(distDirectory, file));
  const gzipBytes = /\.(?:js|css|html)$/.test(file) ? gzipSync(content).length : content.length;
  initialBytes += content.length;
  initialGzipBytes += gzipBytes;
  const group = file.includes("catalog-index-") ? "catalog summary" : file.endsWith(".js") ? "application JS (including default workspace)" : file.endsWith(".css") ? "CSS" : file.endsWith(".html") ? "HTML" : "images";
  const totals = initialGroups.get(group) ?? { bytes: 0, gzipBytes: 0 };
  totals.bytes += content.length;
  totals.gzipBytes += gzipBytes;
  initialGroups.set(group, totals);
}
console.log(`Initial static assets: ${initialAssets.size}; ${formattedKiB(initialBytes)} raw / ${formattedKiB(initialGzipBytes)} gzip.`);
for (const [group, totals] of initialGroups) console.log(`  ${group}: ${formattedKiB(totals.bytes)} raw / ${formattedKiB(totals.gzipBytes)} gzip.`);
if (initialBytes > maximumInitialBytes || initialGzipBytes > maximumInitialGzipBytes) {
  throw new Error(`Initial load exceeds ${formattedKiB(maximumInitialBytes)} raw / ${formattedKiB(maximumInitialGzipBytes)} gzip budget.`);
}
const serviceWorker = await readFile(join(distDirectory, "sw.js"), "utf8");
if (/url:\s*["']assets\/catalog-(?:locations|routes|search)-/.test(serviceWorker)) {
  throw new Error("PWA precache must not download catalog details or full-text search before use.");
}
