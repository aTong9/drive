import assert from "node:assert/strict";
import test from "node:test";
import { wgs84ToGcj02 } from "./gpxImport.js";

test("converts mainland WGS84 coordinate to GCJ-02", () => {
  const point = wgs84ToGcj02(39.908823, 116.39747);
  assert.ok(Math.abs(point.lat - 39.910226) < .0001); assert.ok(Math.abs(point.lng - 116.403714) < .0001); assert.equal(point.crs, "GCJ-02");
});

test("leaves coordinates outside China numerically unchanged", () => {
  assert.deepEqual(wgs84ToGcj02(51.5074, -0.1278), { lat: 51.5074, lng: -0.1278, crs: "GCJ-02" });
});
