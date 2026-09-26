import assert from "node:assert/strict";
import test from "node:test";
import { recommendRoutes } from "./recommendationService.js";
import type { ResolvedRoute } from "../types/domain.js";

const base = { route: { id: "route-a", name: "A", province: "广东", cities: ["深圳"], type: "coast", captureStyle: "scenic-drive", modes: ["day"], estimatedDurationMinutes: 120, waypointLocationIds: [], best: { seasons: ["spring"], times: ["morning"], weather: ["cloudy"] }, cameraPresetIds: [], shootAdvice: "advice enough", scores: { visual: 5, road: 4, parking: 3, safety: 4, youtubePotential: 5 }, status: "idea", verification: { status: "source-checked", note: "verified enough" } }, waypoints: [], cameraPresets: [] } as unknown as ResolvedRoute;

test("recommendation explains validated matching route", () => {
  const results = recommendRoutes([base], { city: "深圳", availableMinutes: 180, weather: "cloudy", camera: "Sony", objective: "scenic-drive" });
  assert.equal(results.length, 1); assert.ok(results[0]?.reasons.includes("匹配创作方式")); assert.ok(results[0]?.reasons.includes("匹配当前天气"));
});

test("recommendation excludes routes beyond available time", () => {
  assert.equal(recommendRoutes([base], { city: "深圳", availableMinutes: 60, weather: "cloudy", camera: "Sony", objective: "scenic-drive" }).length, 0);
});

test("recommendation never substitutes a different city and labels time as an estimate", () => {
  const input = { city: "南昌", availableMinutes: 240, weather: "cloudy", camera: "Sony", objective: "scenic-drive" } as const;
  assert.deepEqual(recommendRoutes([base], input), []);
  const results = recommendRoutes([base], { ...input, city: "深圳" });
  assert.ok(results[0]?.reasons.some((reason) => reason.includes("估算") && reason.includes("不含交通")));
});
