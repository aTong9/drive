import assert from "node:assert/strict";
import test from "node:test";
import { usePlannerStore } from "../app/store.js";
import { resolvedRoutes } from "./catalogService.js";
import { getDisplayedRouteId, loadRoute, resolvedRouteSummaries } from "./browserCatalogService.js";
import { createWorkspaceUrl, readWorkspaceUrl } from "./workspaceUrlService.js";

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

test("an explicitly opened route matches its URL even when filters exclude it", async () => {
  const href = "https://example.test/?route=gd-sz-bay-night&province=青海";
  const navigation = readWorkspaceUrl(href);
  const filtered = resolvedRouteSummaries.filter((item) => item.route.province === navigation.destination.province);
  assert.ok(filtered.length);
  assert.ok(filtered.every((item) => item.route.id !== navigation.selectedRouteId));
  const selected = getDisplayedRouteId(navigation.selectedRouteId, navigation.detailOpen, filtered);
  assert.equal(selected, new URL(createWorkspaceUrl(navigation, href)).searchParams.get("route"));
  assert.equal((await loadRoute(selected!)).route.id, navigation.selectedRouteId);
  assert.equal(getDisplayedRouteId(navigation.selectedRouteId, true, []), navigation.selectedRouteId);
  assert.equal(getDisplayedRouteId("unknown-route", true, filtered), undefined);
  assert.equal(getDisplayedRouteId(navigation.selectedRouteId, false, filtered), filtered[0]!.route.id);
});
