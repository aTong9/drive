import { readFile } from "node:fs/promises";

const catalog = JSON.parse(await readFile(new URL("../data/catalog.json", import.meta.url), "utf8"));
const regions = JSON.parse(await readFile(new URL("../data/regions.json", import.meta.url), "utf8"));

const targetPerDivision = 20;
const prefix = "exp20-";
const rows = [];

for (const province of regions.provinces) {
  for (const division of province.divisions) {
    const newLocations = catalog.locations.filter(
      (location) => location.id.startsWith(prefix) && location.province === province.name && location.city === division.name,
    ).length;
    const newRoutes = catalog.routes.filter(
      (route) => route.id.startsWith(prefix) && route.province === province.name && route.cities.includes(division.name),
    ).length;
    rows.push({
      province: province.name,
      city: division.name,
      newLocations,
      newRoutes,
      missingLocations: Math.max(0, targetPerDivision - newLocations),
      missingRoutes: Math.max(0, targetPerDivision - newRoutes),
    });
  }
}

const incomplete = rows.filter((row) => row.missingLocations > 0 || row.missingRoutes > 0);
const totals = rows.reduce(
  (result, row) => ({
    newLocations: result.newLocations + row.newLocations,
    newRoutes: result.newRoutes + row.newRoutes,
    missingLocations: result.missingLocations + row.missingLocations,
    missingRoutes: result.missingRoutes + row.missingRoutes,
  }),
  { newLocations: 0, newRoutes: 0, missingLocations: 0, missingRoutes: 0 },
);

console.log(
  JSON.stringify(
    {
      targetPerDivision,
      divisionCount: rows.length,
      completeDivisionCount: rows.length - incomplete.length,
      incompleteDivisionCount: incomplete.length,
      ...totals,
      nextIncomplete: incomplete.slice(0, 20),
    },
    null,
    2,
  ),
);

if (incomplete.length > 0) process.exitCode = 1;
