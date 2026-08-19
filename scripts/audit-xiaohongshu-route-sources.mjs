import { readFile } from "node:fs/promises";

const catalog = JSON.parse(
  await readFile(new URL("../data/catalog.json", import.meta.url), "utf8"),
);
const expectedRouteIds = new Set([
  "gd-roadnet-2026-27",
  "gd-roadnet-2026-40",
  "ln-dl-xinghai-bangchuidao-coast",
  "zj-nb-songlan-shipu-coast",
  "gx-bh-silver-guantouling-coast",
  "gx-gl-elephant-yulong",
  "yn-lj-old-town-yulong-altitude",
]);
const sourced = catalog.routes.filter((route) =>
  route.verification.sources?.some(
    (source) => source.platform === "xiaohongshu",
  ),
);
const problems = [];
for (const route of sourced) {
  for (const source of route.verification.sources.filter(
    (item) => item.platform === "xiaohongshu",
  )) {
    if (!source.url.startsWith("https://www.xiaohongshu.com/explore/"))
      problems.push(`${route.id}: non-canonical URL`);
    if (
      !source.title ||
      !source.author ||
      !source.accessedAt ||
      !source.evidence?.length
    )
      problems.push(`${route.id}: incomplete source`);
  }
}
for (const id of expectedRouteIds)
  if (!sourced.some((route) => route.id === id)) problems.push(`missing ${id}`);
console.log(
  JSON.stringify(
    {
      routes: sourced.length,
      expected: expectedRouteIds.size,
      ids: sourced.map((route) => route.id),
      problems,
    },
    null,
    2,
  ),
);
if (problems.length || sourced.length < expectedRouteIds.size)
  process.exitCode = 1;
