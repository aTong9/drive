import assert from "node:assert/strict";
import test from "node:test";
import { Ajv2020 } from "ajv/dist/2020.js";
import schema from "../../schemas/night-drive-coordinates.schema.json" with { type: "json" };
import coordinates from "../../data/night-drive-coordinates.json" with { type: "json" };
import { createNightDriveShareUrl, findSharedNightDriveRoute, nightDriveAtlas } from "./nightDriveAtlasService.js";
import { createNightDriveAppUrl, createNightDriveWebSegments, resolveNightDriveRoute } from "./nightDriveCoordinates.js";

test("all 67 routes open with stored coordinates, without name lookup or silently omitted stops", () => {
  const validate = new Ajv2020({ allErrors: true }).compile(schema);
  assert.ok(validate(coordinates), JSON.stringify(validate.errors));
  const ids = nightDriveAtlas.cities.flatMap((city) => city.routes.flatMap((route) => route.stops.map((stop) => stop.id)));
  assert.equal(Object.keys(coordinates.points).length + Object.keys(coordinates.excluded).length, ids.length);
  assert.deepEqual(Object.keys(coordinates.excluded), ["city-46-r1-s6"]);
  for (const city of nightDriveAtlas.cities) for (const route of city.routes) {
    const mapped = resolveNightDriveRoute(city, route);
    assert.equal(mapped.missing.length, route.stops.filter((stop) => stop.id in coordinates.excluded).length);
    assert.ok(mapped.points.length >= 2 && mapped.points.length <= 18);
    assert.deepEqual(mapped.points.map((point) => point.id), route.stops.filter((stop) => !(stop.id in coordinates.excluded)).map((stop) => stop.id));
    assert.ok(mapped.points.every((point) => Number.isFinite(point.coordinate.lng) && Number.isFinite(point.coordinate.lat)));
  }
});

test("shared night routes restore exactly and Amap links retain all ordered coordinates", () => {
  assert.equal(findSharedNightDriveRoute("https://atong9.github.io/drive/?nightRoute=unknown"), undefined);
  for (const city of nightDriveAtlas.cities) for (const route of city.routes) {
    const share = createNightDriveShareUrl(city, route);
    assert.equal(new URL(share).searchParams.get("browse"), "night-drive");
    assert.equal(findSharedNightDriveRoute(share)?.route.id, route.id);
    const mapped = resolveNightDriveRoute(city, route);
    for (const platform of ["ios", "android"] as const) {
      const app = new URL(createNightDriveAppUrl(mapped, platform)!);
      assert.equal(app.protocol, platform === "ios" ? "iosamap:" : "amapuri:");
      assert.equal(app.searchParams.get("slon"), String(mapped.points[0]!.coordinate.lng));
      assert.equal(app.searchParams.get("dlon"), String(mapped.points.at(-1)!.coordinate.lng));
      assert.equal(Number(app.searchParams.get("vian")), mapped.points.length - 2);
      assert.deepEqual(app.searchParams.get("vialons")!.split("|").map(Number), mapped.points.slice(1, -1).map((point) => point.coordinate.lng));
      assert.deepEqual(app.searchParams.get("vialats")!.split("|").map(Number), mapped.points.slice(1, -1).map((point) => point.coordinate.lat));
    }
    const segments = createNightDriveWebSegments(mapped).map((segment) => new URL(segment.href));
    const actual = segments.flatMap((segment, index) => [index ? null : segment.searchParams.get("from"), segment.searchParams.get("via"), segment.searchParams.get("to")].filter(Boolean));
    assert.deepEqual(actual, mapped.points.map((point) => `${point.coordinate.lng},${point.coordinate.lat},${point.name}`));
  }
  assert.equal(createNightDriveAppUrl({ id: "empty", name: "", points: [], missing: [] }, "ios"), null);
});
