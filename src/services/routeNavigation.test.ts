import assert from "node:assert/strict";
import test from "node:test";
import { usePlannerStore } from "../app/store.js";
import { resolvedRoutes } from "./catalogService.js";

test("opening any known route atomically clears conflicting filters and opens its detail", () => {
  const initial = usePlannerStore.getState();
  const target = resolvedRoutes.find((item) => item.route.estimatedDurationMinutes > 240)!;
  assert.ok(target);
  try {
    usePlannerStore.setState({
      currentRegion: { province: "测试省", city: "另一座城" },
      destination: { groupId: "all", province: "测试省", city: "另一座城" },
      query: "不匹配的关键词", driveOnly: true, maxDurationMinutes: 1,
      detailOpen: false, view: "plans",
    });
    usePlannerStore.getState().selectRoute(target.route.id);
    const state = usePlannerStore.getState();
    assert.equal(state.selectedRouteId, target.route.id);
    assert.equal(state.view, "explore");
    assert.equal(state.detailOpen, true);
    assert.equal(state.currentRegion, null);
    assert.deepEqual(state.destination, { groupId: "all", province: "", city: "" });
    assert.equal(state.query, "");
    assert.equal(state.mode, "all");
    assert.equal(state.captureStyle, "all");
    assert.equal(state.driveOnly, false);
    assert.ok(state.maxDurationMinutes >= target.route.estimatedDurationMinutes);
    assert.equal(state.routeOpenVersion, initial.routeOpenVersion + 1);
    state.selectRoute("unknown-route");
    assert.equal(usePlannerStore.getState(), state);
    state.selectRoute(target.route.id);
    assert.equal(usePlannerStore.getState().routeOpenVersion, state.routeOpenVersion + 1);
  } finally {
    usePlannerStore.setState(initial, true);
  }
});
