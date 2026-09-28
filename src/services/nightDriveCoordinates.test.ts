import assert from "node:assert/strict";
import test from "node:test";
import { Ajv2020 } from "ajv/dist/2020.js";
import schema from "../../schemas/night-drive-coordinates.schema.json" with { type: "json" };
import coordinates from "../../data/night-drive-coordinates.json" with { type: "json" };
import { nightDriveAtlas } from "./nightDriveAtlasService.js";
import { resolveNightDriveRoute } from "./nightDriveCoordinates.js";

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
