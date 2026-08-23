import assert from "node:assert/strict";
import test from "node:test";
import type { ResolvedRoute } from "../types/domain.js";
import {
  buildTripDayPlan,
  buildTripResearchSummary,
  dateForTripDay,
  findUnplannedResearchRoutes,
} from "./tripResearchService.js";

function route(
  id: string,
  province: string,
  city: string,
  minutes: number,
  status: "draft" | "source-checked",
) {
  return {
    route: {
      id,
      province,
      cities: [city],
      estimatedDurationMinutes: minutes,
      captureStyle: "scenic-drive",
      verification: { status },
    },
  } as unknown as ResolvedRoute;
}

test("trip research summary exposes geographic scope, duration and planning gaps", () => {
  const summary = buildTripResearchSummary([
    route("a", "云南", "大理", 300, "source-checked"),
    route("b", "云南", "丽江", 300, "draft"),
    route("c", "四川", "成都", 180, "draft"),
  ]);
  assert.equal(summary.routeCount, 3);
  assert.deepEqual(summary.provinces, ["云南", "四川"]);
  assert.deepEqual(summary.cities, ["大理", "丽江", "成都"]);
  assert.equal(summary.totalMinutes, 780);
  assert.equal(summary.estimatedDays, 2);
  assert.equal(summary.draftCount, 2);
  assert.ok(summary.warnings.some((warning) => warning.includes("重新核验")));
  assert.ok(summary.warnings.some((warning) => warning.includes("拆分行程")));
});

test("trip day dates advance safely across month boundaries", () => {
  assert.equal(dateForTripDay("2026-08-31", 1), "2026-08-31");
  assert.equal(dateForTripDay("2026-08-31", 2), "2026-09-01");
  assert.throws(() => dateForTripDay("not-a-date", 1));
});

test("trip day plan preserves route order and starts a new day before exceeding eight hours", () => {
  const routes = [
    route("a", "云南", "大理", 300, "source-checked"),
    route("b", "云南", "丽江", 240, "source-checked"),
    route("c", "四川", "成都", 180, "source-checked"),
  ];
  const days = buildTripDayPlan(routes);
  assert.equal(days.length, 2);
  assert.deepEqual(
    days[0]?.routes.map((item) => item.route.id),
    ["a"],
  );
  assert.deepEqual(
    days[1]?.routes.map((item) => item.route.id),
    ["b", "c"],
  );
  assert.equal(days[1]?.totalMinutes, 420);
});

test("research resume keeps basket order and hides routes already converted to plans", () => {
  const routes = [
    route("a", "云南", "大理", 300, "source-checked"),
    route("b", "云南", "丽江", 240, "source-checked"),
    route("c", "四川", "成都", 180, "source-checked"),
  ];
  const result = findUnplannedResearchRoutes(
    routes,
    ["c", "missing", "a", "b"],
    [
      {
        id: "plan-a",
        routeId: "a",
        scheduledDate: "2026-08-24",
        objective: "拍摄",
        status: "planned",
        createdAt: "2026-08-20T00:00:00.000Z",
      },
    ],
  );
  assert.deepEqual(
    result.map((item) => item.route.id),
    ["c", "b"],
  );
});
