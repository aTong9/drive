import { readFile } from "node:fs/promises";

const regions = JSON.parse(
  await readFile(new URL("../data/regions.json", import.meta.url), "utf8"),
);
const research = JSON.parse(
  await readFile(
    new URL("../data/xiaohongshu-route-research.json", import.meta.url),
    "utf8",
  ),
);
const expected = regions.provinces.flatMap((province) =>
  province.divisions.map((division) => `${province.name}/${division.name}`),
);
const keys = research.entries.map((entry) => `${entry.province}/${entry.city}`);
const unique = new Set(keys);
const problems = [];
if (research.platform !== "xiaohongshu") problems.push("wrong platform");
if (keys.length !== expected.length || unique.size !== expected.length)
  problems.push("coverage or duplicate mismatch");
for (const key of expected)
  if (!unique.has(key)) problems.push(`missing ${key}`);
for (const entry of research.entries) {
  if (!["queued", "reviewed", "published"].includes(entry.status))
    problems.push(`${entry.province}/${entry.city}: invalid status`);
  if (
    !Array.isArray(entry.queries) ||
    entry.queries.length < 3 ||
    !entry.queries.every((query) => query.includes(entry.city))
  )
    problems.push(`${entry.province}/${entry.city}: invalid queries`);
}
console.log(
  JSON.stringify(
    {
      entries: keys.length,
      divisions: expected.length,
      provinces: new Set(research.entries.map((entry) => entry.province)).size,
      reviewed: research.entries.filter((entry) => entry.status !== "queued")
        .length,
      problems,
    },
    null,
    2,
  ),
);
if (problems.length) process.exitCode = 1;
