import assert from "node:assert/strict";
import test from "node:test";
import { createWorkspaceUrl, readWorkspaceUrl } from "./workspaceUrlService.js";
import { usePlannerStore } from "../app/store.js";

test("workspace URLs restore research filters, selected places and route details", () => {
  const href = "https://example.test/drive/?province=青海&city=海南州&q=青海湖&location=qh-qinghai-lake&page=2";
  const location = readWorkspaceUrl(href);
  assert.equal(location.view, "locations");
  assert.equal(location.locationBrowse.query, "青海湖");
  assert.equal(location.locationBrowse.region.city, "海南州");
  assert.equal(location.locationBrowse.detailVisible, true);
  assert.deepEqual(readWorkspaceUrl(createWorkspaceUrl(location, href)), location);
  const route = readWorkspaceUrl("file:///Applications/RoadLens/index.html?route=gd-sz-bay-night&mode=night&minutes=360");
  assert.equal(route.view, "explore");
  assert.equal(route.detailOpen, true);
  assert.equal(route.mode, "night");
  assert.equal(route.maxDurationMinutes, 360);
  assert.deepEqual(readWorkspaceUrl(createWorkspaceUrl(route, "file:///Applications/RoadLens/index.html")), route);
  assert.equal(readWorkspaceUrl("https://example.test/?view=post").view, "post");
  assert.equal(readWorkspaceUrl("https://example.test/").view, "locations");
});

test("URL input cannot introduce invalid workspace, region, enum or numeric states", () => {
  const state = readWorkspaceUrl("https://example.test/?view=bad&province=bad&city=深圳&group=bad&mode=bad&capture=bad&type=bad&minutes=-1&page=NaN&location=<script>");
  assert.equal(state.view, "locations");
  assert.equal(state.mode, "all");
  assert.equal(state.captureStyle, "all");
  assert.equal(state.maxDurationMinutes, 240);
  assert.deepEqual(state.locationBrowse.region, {});
  assert.equal(state.locationBrowse.locationPage, 1);
  assert.equal(state.locationBrowse.detailVisible, false);
  assert.equal(state.locationBrowse.type, "all");
});

test("user filter changes reset only affected pages while URL restoration keeps saved pages", () => {
  const original = usePlannerStore.getState();
  try {
    const restored = readWorkspaceUrl("https://example.test/?q=青海&page=3&routePage=4");
    usePlannerStore.setState(restored);
    assert.equal(usePlannerStore.getState().locationBrowse.locationPage, 3);
    assert.equal(usePlannerStore.getState().locationBrowse.routePage, 4);
    usePlannerStore.getState().setLocationBrowse({ type: "lake" });
    assert.equal(usePlannerStore.getState().locationBrowse.locationPage, 1);
    assert.equal(usePlannerStore.getState().locationBrowse.routePage, 4);
    usePlannerStore.getState().setLocationBrowse({ captureStyle: "scenic-drive" });
    assert.equal(usePlannerStore.getState().locationBrowse.routePage, 1);
    usePlannerStore.setState(restored);
    usePlannerStore.getState().setLocationBrowse({ detailVisible: true, selectedId: "some-place" });
    assert.equal(usePlannerStore.getState().locationBrowse.locationPage, 3);
    assert.equal(usePlannerStore.getState().locationBrowse.routePage, 4);
    usePlannerStore.getState().setLocationBrowse({ query: "深圳" });
    assert.equal(usePlannerStore.getState().locationBrowse.locationPage, 1);
    assert.equal(usePlannerStore.getState().locationBrowse.routePage, 1);
    usePlannerStore.setState(restored);
    assert.equal(usePlannerStore.getState().locationBrowse.locationPage, 3);
    assert.equal(usePlannerStore.getState().locationBrowse.routePage, 4);
  } finally { usePlannerStore.setState(original, true); }
});
