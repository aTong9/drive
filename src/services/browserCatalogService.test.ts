import assert from "node:assert/strict";
import test from "node:test";
import { catalog, resolvedRoutes } from "./catalogService.js";
import { catalogIndex, getRouteSummary, loadCatalogSearch, loadFullCatalog, loadLocation, loadRegion, loadRoute, locationSummaryMatchesQuery, resolvedRouteSummaries, routeSummaryMatchesQuery } from "./browserCatalogService.js";
import { locationMatchesQuery, routeMatchesQuery } from "./catalogSearchService.js";

test("summary catalog preserves nationwide discovery while details stay behind explicit loaders", async () => {
  assert.equal(catalogIndex.locations.length, catalog.locations.length);
  assert.equal(catalogIndex.routes.length, catalog.routes.length);
  assert.equal(new Set(catalogIndex.locations.map((location) => location.province)).size, 34);
  assert.equal("shooting" in catalogIndex.locations[0]!, false);
  assert.equal("shootAdvice" in catalogIndex.routes[0]!, false);
  const original = resolvedRoutes.find((item) => item.route.estimatedDurationMinutes > 240)!;
  assert.equal(getRouteSummary(original.route.id)?.estimatedDurationMinutes, original.route.estimatedDurationMinutes);
  assert.deepEqual(await loadRoute(original.route.id), original);
  assert.deepEqual(await loadLocation(original.waypoints[0]!.id), original.waypoints[0]);
  await assert.rejects(loadLocation("missing-location"), /目录中没有地点/);
  await assert.rejects(loadRoute("missing-route"), /目录中没有路线/);
  const region = await loadRegion("青海");
  assert.deepEqual(region.locations, catalog.locations.filter((location) => location.province === "青海"));
  assert.deepEqual(region.resolvedRoutes, resolvedRoutes.filter((item) => item.route.province === "青海"));
  await loadCatalogSearch();
  for (const query of ["青海湖", "小红书", "官方", "停车", "通行", "不存在的关键词", "", "  深圳  "]) {
    assert.deepEqual(catalogIndex.locations.filter((location) => locationSummaryMatchesQuery(location, query)).map((item) => item.id), catalog.locations.filter((location) => locationMatchesQuery(location, query)).map((item) => item.id));
    assert.deepEqual(resolvedRouteSummaries.filter((route) => routeSummaryMatchesQuery(route, query)).map((item) => item.route.id), resolvedRoutes.filter((route) => routeMatchesQuery(route, query)).map((item) => item.route.id));
  }
  assert.deepEqual(await loadFullCatalog(), { catalog, resolvedRoutes });
});
