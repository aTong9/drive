import assert from "node:assert/strict";
import test from "node:test";
import type { LocalShootPlan, ResolvedRoute } from "../types/domain.js";
import { buildNextShootBriefing } from "./shootBriefingService.js";

const route = (id: string, city: string, minutes: number): ResolvedRoute =>
  ({
    route: {
      id,
      name: `路线 ${id}`,
      cities: [city],
      estimatedDurationMinutes: minutes,
    },
    cameraPresets: [
      {
        id: `preset-${id}`,
        camera: "Sony A7C II",
        scene: "daylight-general",
        settings: {
          resolution: "4K",
          fps: 25,
          shutter: "1/50",
          iso: { min: 100, max: 800 },
          whiteBalanceKelvin: 5600,
        },
        notes: "",
      },
    ],
    waypoints: [],
  }) as unknown as ResolvedRoute;

const plan = (id: string, routeId: string, date: string): LocalShootPlan => ({
  id,
  routeId,
  scheduledDate: date,
  objective: `目标 ${id}`,
  status: "planned",
  createdAt: `2026-08-20T00:00:0${id}.000Z`,
});

test("builds one zero-input briefing for every route on the nearest shoot day", () => {
  const briefing = buildNextShootBriefing(
    [route("a", "广州", 180), route("b", "佛山", 120)],
    [plan("1", "a", "2026-08-25"), plan("2", "b", "2026-08-25")],
    new Date("2026-08-24T08:00:00+08:00"),
  );
  assert.equal(briefing?.relativeLabel, "明天");
  assert.deepEqual(briefing?.cities, ["广州", "佛山"]);
  assert.equal(briefing?.requiresTravelReview, true);
  assert.equal(briefing?.totalMinutes, 300);
  assert.equal(briefing?.routes.length, 2);
  assert.equal(briefing?.presets.length, 2);
});

test("prefers a future plan and ignores completed or unknown routes", () => {
  const completed = {
    ...plan("1", "a", "2026-08-23"),
    status: "captured" as const,
  };
  const briefing = buildNextShootBriefing(
    [route("a", "广州", 180)],
    [
      completed,
      plan("2", "missing", "2026-08-24"),
      plan("3", "a", "2026-08-27"),
    ],
    new Date("2026-08-24T08:00:00+08:00"),
  );
  assert.equal(briefing?.date, "2026-08-27");
  assert.equal(briefing?.relativeLabel, "3 天后");
});

test("returns null when there is no usable planned route", () => {
  assert.equal(buildNextShootBriefing([], [], new Date("2026-08-24")), null);
});
