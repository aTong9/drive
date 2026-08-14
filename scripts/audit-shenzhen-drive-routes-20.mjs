import { readFile } from "node:fs/promises";

const catalog = JSON.parse(await readFile(new URL("../data/catalog.json", import.meta.url), "utf8"));
const prefix = "gd-sz-drive-extra20-";
const routes = catalog.routes.filter((item) => item.id.startsWith(prefix));
const locations = new Map(catalog.locations.map((item) => [item.id, item]));
const problems = [];
for (const route of routes) {
  if (route.province !== "广东" || !route.cities.includes("深圳")) problems.push(`${route.id}: wrong city`);
  if (route.captureStyle !== "scenic-drive" || !route.name.includes("纯驾车")) problems.push(`${route.id}: not drive-only`);
  if (route.waypointLocationIds.length < 2) problems.push(`${route.id}: too few waypoints`);
  for (const id of route.waypointLocationIds) {
    const location = locations.get(id);
    if (!location) problems.push(`${route.id}: missing ${id}`);
    else if (location.province !== "广东" || location.city !== "深圳") problems.push(`${route.id}: non-Shenzhen waypoint ${id}`);
  }
}
console.log(JSON.stringify({ expected: 20, actual: routes.length, uniqueIds: new Set(routes.map((item) => item.id)).size, problems }, null, 2));
if (routes.length !== 20 || new Set(routes.map((item) => item.id)).size !== 20 || problems.length) process.exitCode = 1;
