import { readFile } from "node:fs/promises";

const catalog = JSON.parse(await readFile(new URL("../data/catalog.json", import.meta.url), "utf8"));
const municipalities = ["北京", "上海", "天津", "重庆"];
const target = 100;
const prefix = "exp100-";
const rows = municipalities.map((city) => {
  const locations = catalog.locations.filter(
    (item) => item.id.startsWith(prefix) && item.province === city && item.city === city,
  ).length;
  const routes = catalog.routes.filter(
    (item) => item.id.startsWith(prefix) && item.province === city && item.cities.includes(city),
  ).length;
  return { city, locations, routes, complete: locations >= target && routes >= target };
});

console.log(JSON.stringify({ target, prefix, rows, complete: rows.every((row) => row.complete) }, null, 2));
if (rows.some((row) => !row.complete)) process.exitCode = 1;
