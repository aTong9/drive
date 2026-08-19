import { readFile } from "node:fs/promises";

const catalog = JSON.parse(await readFile(new URL("../data/catalog.json", import.meta.url), "utf8"));
const regions = JSON.parse(await readFile(new URL("../data/regions.json", import.meta.url), "utf8"));
const prefix = "cn-scenic-road-2026-";
const routes = catalog.routes.filter((route) => route.id.startsWith(prefix));
const locations = new Map(catalog.locations.map((location) => [location.id, location]));
const expected = regions.provinces.flatMap((province) => province.divisions.map((division) => `${province.name}/${division.name}`));
const covered = new Map();
const problems = [];

for (const route of routes) {
  const key = `${route.province}/${route.cities[0]}`;
  covered.set(key, (covered.get(key) ?? 0) + 1);
  if (route.cities.length !== 1 || route.captureStyle !== "scenic-drive") problems.push(`${route.id}: wrong city/style contract`);
  if (route.executionMode) problems.push(`${route.id}: unverified corridor must not claim drive-only execution`);
  if (route.verification.status !== "draft") problems.push(`${route.id}: must remain draft until first drive`);
  if (route.scores?.visual !== 5 || route.scores?.youtubePotential !== 5) problems.push(`${route.id}: scenic scores are not prioritized`);
  if (route.waypointLocationIds.length !== 2) problems.push(`${route.id}: expected two endpoints`);
  for (const id of route.waypointLocationIds) {
    const location = locations.get(id);
    if (!location) problems.push(`${route.id}: missing waypoint ${id}`);
    else if (location.province !== route.province || location.city !== route.cities[0]) problems.push(`${route.id}: waypoint ${id} is outside ${key}`);
  }
}

const missing = expected.filter((key) => covered.get(key) !== 1);
const unexpected = [...covered.keys()].filter((key) => !expected.includes(key));
if (missing.length) problems.push(`missing or duplicate divisions: ${missing.join(", ")}`);
if (unexpected.length) problems.push(`unexpected divisions: ${unexpected.join(", ")}`);
console.log(JSON.stringify({ routes: routes.length, expectedDivisions: expected.length, coveredDivisions: covered.size, provinces: new Set(routes.map((route) => route.province)).size, problems }, null, 2));
if (routes.length !== expected.length || covered.size !== expected.length || problems.length) process.exitCode = 1;
