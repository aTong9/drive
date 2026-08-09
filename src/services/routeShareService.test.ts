import assert from "node:assert/strict";
import test from "node:test";
import { createRouteShareUrl, parseSharedRouteId } from "./routeShareService.js";

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
