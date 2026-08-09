import assert from "node:assert/strict";
import test from "node:test";
import { createAmapNavigationUrl, createRouteShareUrl, parseSharedRouteId } from "./routeShareService.js";

test("creates a canonical route share URL without local page state", () => {
  assert.equal(
    createRouteShareUrl("gd-sz-bay-night", "https://example.com/drive/?mode=night#detail"),
    "https://example.com/drive/?route=gd-sz-bay-night"
  );
});

test("parses a valid shared route id", () => {
  assert.equal(parseSharedRouteId("https://example.com/drive/?route=fj-xm-shapowei-zhongshan-rain-walk"), "fj-xm-shapowei-zhongshan-rain-walk");
});

test("rejects missing or malformed shared route ids", () => {
  assert.equal(parseSharedRouteId("https://example.com/drive/"), null);
  assert.equal(parseSharedRouteId("https://example.com/drive/?route=../../secret"), null);
  assert.equal(parseSharedRouteId("https://example.com/drive/?route="), null);
});

test("creates an AMap driving URL with one representative via point", () => {
  const url = new URL(createAmapNavigationUrl([
    { name: "起点", coordinate: { lng: 114.01, lat: 22.51, crs: "GCJ-02" } },
    { name: "途经点一", coordinate: { lng: 114.02, lat: 22.52, crs: "GCJ-02" } },
    { name: "途经点二", coordinate: { lng: 114.03, lat: 22.53, crs: "GCJ-02" } },
    { name: "终点", coordinate: { lng: 114.04, lat: 22.54, crs: "GCJ-02" } }
  ], true)!);
  assert.equal(url.origin + url.pathname, "https://uri.amap.com/navigation");
  assert.equal(url.searchParams.get("from"), "114.01,22.51,起点");
  assert.equal(url.searchParams.get("via"), "114.02,22.52,途经点一");
  assert.equal(url.searchParams.get("to"), "114.04,22.54,终点");
  assert.equal(url.searchParams.get("mode"), "car");
  assert.equal(url.searchParams.get("callnative"), "1");
});

test("does not create an AMap URL for WGS84 or incomplete routes", () => {
  assert.equal(createAmapNavigationUrl([], true), null);
  assert.equal(createAmapNavigationUrl([
    { name: "A", coordinate: { lng: 139.7, lat: 35.6, crs: "WGS84" } },
    { name: "B", coordinate: { lng: 139.8, lat: 35.7, crs: "WGS84" } }
  ], true), null);
});
