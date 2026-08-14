import { readFile } from "node:fs/promises";

const catalog = JSON.parse(await readFile(new URL("../data/catalog.json", import.meta.url), "utf8"));
const locations = new Map(catalog.locations.map((item) => [item.id, item]));
const targets = [["惠州", "hz"], ["深圳", "sz"], ["广州", "gz"]];
const rows = [];
const problems = [];
for (const [city, code] of targets) {
  const routes = catalog.routes.filter((item) => item.id.startsWith(`gd-${code}-drive-extra50-`));
  for (const route of routes) {
    if (route.province !== "广东" || route.cities.length !== 1 || route.cities[0] !== city) problems.push(`${route.id}: wrong city`);
    if (route.captureStyle !== "scenic-drive" || route.executionMode !== "drive-only" || !route.name.includes("纯驾车")) problems.push(`${route.id}: not drive-only`);
    if (route.waypointLocationIds.length < 2) problems.push(`${route.id}: too few waypoints`);
    for (const id of route.waypointLocationIds) {
      const location = locations.get(id);
      if (!location) problems.push(`${route.id}: missing ${id}`);
      else if (location.province !== "广东" || location.city !== city) problems.push(`${route.id}: wrong-city waypoint ${id}`);
    }
  }
  rows.push({ city, expected: 50, actual: routes.length, uniqueIds: new Set(routes.map((item) => item.id)).size, uniqueNames: new Set(routes.map((item) => item.name)).size, uniquePaths: new Set(routes.map((item) => item.waypointLocationIds.join(">"))).size });
}
console.log(JSON.stringify({ rows, problems }, null, 2));
if (rows.some((row) => row.actual !== 50 || row.uniqueIds !== 50 || row.uniqueNames !== 50 || row.uniquePaths !== 50) || problems.length) process.exitCode = 1;
