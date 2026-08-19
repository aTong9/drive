import { readFile } from "node:fs/promises";

const catalog = JSON.parse(await readFile(new URL("../data/catalog.json", import.meta.url), "utf8"));
const prefix = "cn-tier-city-scenic-2026-";
const nationalPrefix = "cn-scenic-road-2026-";
const routes = catalog.routes.filter((route) => route.id.startsWith(prefix));
const cityKeys = new Set(routes.map((route) => `${route.province}/${route.cities[0]}`));
const problems = [];
for (const key of cityKeys) {
  const [province, city] = key.split("/");
  const additions = routes.filter((route) => route.province === province && route.cities[0] === city);
  const national = catalog.routes.filter((route) => route.id.startsWith(nationalPrefix) && route.province === province && route.cities[0] === city);
  const pairs = [...additions, ...national].map((route) => [...route.waypointLocationIds].sort().join("|"));
  if (additions.length !== 4 || national.length !== 1) problems.push(`${key}: expected 4 additions plus 1 national route`);
  if (new Set(pairs).size !== pairs.length) problems.push(`${key}: duplicate endpoint pair`);
}
for (const route of routes) {
  if (route.captureStyle !== "scenic-drive" || route.executionMode) problems.push(`${route.id}: wrong scenic execution contract`);
  if (route.verification.status !== "draft") problems.push(`${route.id}: must remain draft until first drive`);
}
console.log(JSON.stringify({ routes: routes.length, enhancedCities: cityKeys.size, routesPerCity: 4, minimumBatchRoutesPerCity: 5, uniqueNames: new Set(routes.map((route) => route.name)).size, problems }, null, 2));
if (routes.length !== 196 || cityKeys.size !== 49 || new Set(routes.map((route) => route.name)).size !== routes.length || problems.length) process.exitCode = 1;
