import assert from "node:assert/strict";
import test from "node:test";
import { filterMusicPlatforms, youtubeMusicLibrary } from "./youtubeMusicService.js";

test("music library references valid category ids", () => {
  const ids = new Set(youtubeMusicLibrary.categories.map((category) => category.id));
  assert.equal(ids.size, youtubeMusicLibrary.categories.length);
  for (const platform of youtubeMusicLibrary.platforms) for (const id of platform.supportedCategoryIds) assert.ok(ids.has(id), `${platform.id}: ${id}`);
});

test("all requested scene families are represented", () => {
  assert.deepEqual(new Set(youtubeMusicLibrary.categories.map((category) => category.family)), new Set(["piano", "lofi", "chillhop", "jazz"]));
  assert.deepEqual(new Set(youtubeMusicLibrary.categories.flatMap((category) => category.scenes)), new Set(["countryside", "rain", "sunrise", "city-night", "road-driving", "blue-hour", "urban"]));
});

test("chillhop is a first-class family with all requested directions", () => {
  const ids = new Set(youtubeMusicLibrary.categories.filter((category) => category.family === "chillhop").map((category) => category.id));
  assert.deepEqual(ids, new Set(["night-drive-chillhop", "jazzhop", "warm-sunset-chillhop", "rainy-day-chillhop", "japanese-chillhop"]));
  assert.ok(filterMusicPlatforms({ categoryId: "night-drive-chillhop", scene: "road-driving", risk: "low" }).length > 0);
});

test("platform filter combines category, scene and risk", () => {
  const results = filterMusicPlatforms({ categoryId: "warm-lofi", scene: "road-driving", risk: "low" });
  assert.ok(results.length > 0);
  assert.ok(results.every((platform) => platform.supportedCategoryIds.includes("warm-lofi") && platform.license.risk === "low"));
});

test("creator libraries expose free monetization and editing terms", () => {
  const requestedIds = new Set(["zukisuzuki-bgm", "streambeats", "dova-syndrome", "chillpeach", "scott-buckley", "purrple-cat", "roa-music", "peritune", "khaim", "ncs"]);
  const requested = youtubeMusicLibrary.platforms.filter((platform) => requestedIds.has(platform.id));
  assert.equal(requested.length, requestedIds.size);
  assert.ok(requested.every((platform) => platform.license.cost === "free"));
  assert.ok(requested.every((platform) => platform.importMode === "download-import"));
  assert.ok(requested.every((platform) => platform.license.monetization !== "not-covered"));
  assert.ok(requested.every((platform) => platform.license.audioEditing !== undefined));
});
