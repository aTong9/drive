import { readFile } from "node:fs/promises";

const catalog = JSON.parse(await readFile(new URL("../data/catalog.json", import.meta.url), "utf8"));
const prefix = "gd-roadnet-2026-";
const routes = catalog.routes.filter((route) => route.id.startsWith(prefix));
const locations = new Map(catalog.locations.map((location) => [location.id, location]));
const problems = [];
for (const route of routes) {
  if (route.province !== "广东" || route.captureStyle !== "scenic-drive") problems.push(`${route.id}: wrong province/style`);
  if (!route.name.endsWith("广东风景驾驶路线")) problems.push(`${route.id}: not labelled as a scenic driving route`);
  if (!['coast', 'mountain'].includes(route.type)) problems.push(`${route.id}: non-scenic route type ${route.type}`);
  if (route.scores?.visual !== 5 || route.scores?.youtubePotential !== 5) problems.push(`${route.id}: scenic scores are not prioritized`);
  if (route.waypointLocationIds.length < 2) problems.push(`${route.id}: fewer than two waypoints`);
  for (const id of route.waypointLocationIds) {
    const location = locations.get(id);
    if (!location) problems.push(`${route.id}: missing waypoint ${id}`);
    else if (location.province !== "广东") problems.push(`${route.id}: non-Guangdong waypoint ${id}`);
  }
}
const representedCities = new Set(routes.flatMap((route) => route.cities));
console.log(JSON.stringify({ routes: routes.length, uniqueIds: new Set(routes.map((route) => route.id)).size, uniqueNames: new Set(routes.map((route) => route.name)).size, representedCities: representedCities.size, problems }, null, 2));
if (routes.length !== 45 || new Set(routes.map((route) => route.id)).size !== routes.length || new Set(routes.map((route) => route.name)).size !== routes.length || representedCities.size !== 21 || problems.length) process.exitCode = 1;
