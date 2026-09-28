import assert from "node:assert/strict";
import test from "node:test";
import { Ajv2020 } from "ajv/dist/2020.js";
import schema from "../../schemas/night-drive-atlas.schema.json" with { type: "json" };
import { filterNightDriveCities, nightDriveAtlas, nightDriveTotals, nightDriveLinks } from "./nightDriveAtlasService.js";
import { findProvince } from "./regionService.js";
import { createWorkspaceUrl, readWorkspaceUrl } from "./workspaceUrlService.js";

test("imported night-drive atlas retains every ordered stop, safe link and research boundary", () => {
  const validate = new Ajv2020({ allErrors: true }).compile(schema);
  assert.ok(validate(nightDriveAtlas), JSON.stringify(validate.errors));
  assert.deepEqual(nightDriveTotals, { cities: 60, routes: 67, stops: 653, extras: 267 });
  const ids: string[] = [];
  const names: string[] = [];
  for (const city of nightDriveAtlas.cities) {
    assert.ok(findProvince(city.province)?.divisions.some((division) => division.name === city.name), city.name);
    for (const route of city.routes) {
      route.stops.forEach((stop, index) => {
        const link = new URL(nightDriveLinks(city.name, stop, route.stops[index - 1])[0]!.url);
        assert.equal(link.protocol, "iosamap:");
        assert.equal(link.searchParams.get("dname"), stop.navigationName);
        assert.equal(link.searchParams.get("sname"), index ? route.stops[index - 1]!.navigationName : null);
      });
    }
    for (const stop of [...city.routes.flatMap((route) => route.stops), ...city.extras]) {
      ids.push(stop.id); names.push(`${city.name}/${stop.name}`);
      assert.equal("coordinate" in stop, false);
      for (const link of nightDriveLinks(city.name, stop)) {
        const url = new URL(link.url);
        assert.ok(url.protocol === "iosamap:" ? url.hostname === "path" : url.protocol === "https:" && url.hostname === "uri.amap.com");
        if (url.protocol === "https:") assert.equal(url.searchParams.get("city"), city.name);
      }
    }
  }
  assert.equal(new Set(ids).size, 920);
  assert.equal(new Set(names).size, 920);
  assert.equal(nightDriveAtlas.source.status, "unverified");
  assert.equal(nightDriveAtlas.cities[0]!.routes[0]!.stops.length, 16);
});

test("night-drive city and landmark filters respect region and survive URL restoration", () => {
  assert.deepEqual(filterNightDriveCities("广州塔", {}, "all").map((city) => city.name), ["广州"]);
  assert.deepEqual(filterNightDriveCities("", { province: "广东", city: "深圳" }, "all").map((city) => city.name), ["深圳"]);
  assert.equal(filterNightDriveCities("广州塔", { province: "北京" }, "all").length, 0);
  assert.equal(filterNightDriveCities("广州塔", {}, "north").length, 0);
  const url = "https://example.test/?browse=night-drive&q=广州塔";
  const state = readWorkspaceUrl(url);
  assert.equal(state.locationBrowse.browseMode, "night-drive");
  assert.equal(new URL(createWorkspaceUrl(state, url)).searchParams.get("browse"), "night-drive");
});
