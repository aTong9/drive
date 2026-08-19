import assert from "node:assert/strict";
import test from "node:test";
import catalog from "../../data/catalog.json" with { type: "json" };
import {
  administrativeDivisionCount,
  administrativeGroups,
  administrativeProvinces,
  divisionLabel,
  provinceLabel,
  provincesForGroup
} from "./regionService.js";
import { resolveAdministrativeRegion } from "./regionService.js";

test("national directory contains every province-level unit exactly once", () => {
  assert.equal(administrativeProvinces.length, 34);
  assert.equal(new Set(administrativeProvinces.map((province) => province.name)).size, 34);
  assert.equal(administrativeDivisionCount, 391);
});

test("every province-level unit has a source-checked location and an explorable route", () => {
  const expected = administrativeProvinces.map((province) => province.name).sort();
  const locationProvinces = [...new Set(catalog.locations.filter((location) => location.verification.status !== "draft").map((location) => location.province))].sort();
  const routeProvinces = [...new Set(catalog.routes.filter((route) => route.verification.status !== "draft").map((route) => route.province))].sort();
  assert.deepEqual(locationProvinces, expected);
  assert.deepEqual(routeProvinces, expected);
});

test("drive-only library exposes the newly added Guangdong routes", () => {
  const visibleDriveRoutes = catalog.routes.filter(
    (route) => route.captureStyle === "scenic-drive" && route.executionMode === "drive-only",
  );
  const expectedBatches = [
    ["gd-sz-drive-extra20-", 20],
    ["gd-hz-drive-extra50-", 50],
    ["gd-sz-drive-extra50-", 50],
    ["gd-gz-drive-extra50-", 50],
  ] as const;
  for (const [prefix, expected] of expectedBatches) {
    assert.equal(visibleDriveRoutes.filter((route) => route.id.startsWith(prefix)).length, expected);
  }
  assert.equal(visibleDriveRoutes.filter((route) => route.province === "广东" && route.cities.includes("深圳")).length, 101);
});

test("every administrative division has one national scenic-driving corridor", () => {
  const routes = catalog.routes.filter((route) => route.id.startsWith("cn-scenic-road-2026-"));
  const expected = administrativeProvinces.flatMap((province) =>
    province.divisions.map((division) => `${province.name}/${division.name}`),
  );
  const actual = routes.map((route) => `${route.province}/${route.cities[0]}`);
  assert.equal(routes.length, administrativeDivisionCount);
  assert.deepEqual(actual.sort(), expected.sort());
  assert.ok(routes.every((route) => route.captureStyle === "scenic-drive" && route.verification.status === "draft"));
});

test("first-, new-first-, and second-tier cities receive four additional scenic routes", () => {
  const routes = catalog.routes.filter((route) => route.id.startsWith("cn-tier-city-scenic-2026-"));
  const counts = new Map<string, number>();
  for (const route of routes) {
    const key = `${route.province}/${route.cities[0]}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  assert.equal(routes.length, 196);
  assert.equal(counts.size, 49);
  assert.ok([...counts.values()].every((count) => count === 4));
  assert.equal(new Set(routes.map((route) => route.name)).size, routes.length);
});

test("geographic groups partition the national directory", () => {
  const grouped = administrativeGroups.flatMap((group) => [...group.provinces]);
  assert.equal(grouped.length, 34);
  assert.equal(new Set(grouped).size, 34);
  assert.deepEqual([...grouped].sort(), administrativeProvinces.map((province) => province.name).sort());
  assert.equal(provincesForGroup("east").length, 8);
});

test("directory resolves official display labels", () => {
  assert.equal(provinceLabel("广西"), "广西壮族自治区");
  assert.equal(divisionLabel("云南", "大理"), "大理白族自治州");
  assert.equal(divisionLabel("海南", "陵水"), "陵水黎族自治县");
});

test("reverse-geocoder labels resolve to catalog province and city names", () => {
  assert.deepEqual(resolveAdministrativeRegion("广东省", "深圳市"), { province: "广东", city: "深圳" });
  assert.deepEqual(resolveAdministrativeRegion("北京市", ""), { province: "北京", city: "北京" });
  assert.deepEqual(resolveAdministrativeRegion("广西壮族自治区", "桂林市"), { province: "广西", city: "桂林" });
});
