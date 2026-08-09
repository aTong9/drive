import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const assetsDirectory = new URL("../dist/assets/", import.meta.url);
const maximumEntryBytes = 500 * 1024;
const files = await readdir(assetsDirectory);
const javascriptFiles = files.filter((file) => file.endsWith(".js"));

if (javascriptFiles.length === 0) {
  throw new Error("No JavaScript assets found in dist/assets; run the production build first.");
}

const assets = await Promise.all(javascriptFiles.map(async (file) => ({
  file,
  bytes: (await stat(join(assetsDirectory.pathname, file))).size
})));
const largest = assets.sort((left, right) => right.bytes - left.bytes)[0];
const formattedKiB = (bytes) => `${(bytes / 1024).toFixed(1)} KiB`;

console.log(`Largest JavaScript asset: ${largest.file} (${formattedKiB(largest.bytes)})`);

if (largest.bytes > maximumEntryBytes) {
  throw new Error(`JavaScript asset exceeds ${formattedKiB(maximumEntryBytes)} budget.`);
}
