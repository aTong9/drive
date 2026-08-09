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
