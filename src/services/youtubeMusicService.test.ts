import assert from "node:assert/strict";
import test from "node:test";
import { filterMusicPlatforms, youtubeMusicLibrary } from "./youtubeMusicService.js";

test("music library references valid category ids", () => {
  const ids = new Set(youtubeMusicLibrary.categories.map((category) => category.id));
  assert.equal(ids.size, youtubeMusicLibrary.categories.length);
  for (const platform of youtubeMusicLibrary.platforms) for (const id of platform.supportedCategoryIds) assert.ok(ids.has(id), `${platform.id}: ${id}`);
});

test("all requested scene families are represented", () => {
  assert.deepEqual(new Set(youtubeMusicLibrary.categories.map((category) => category.family)), new Set(["piano", "lofi", "jazz"]));
  assert.deepEqual(new Set(youtubeMusicLibrary.categories.flatMap((category) => category.scenes)), new Set(["countryside", "rain", "sunrise", "city-night", "road-driving", "blue-hour", "urban"]));
});

test("platform filter combines category, scene and risk", () => {
  const results = filterMusicPlatforms({ categoryId: "warm-lofi", scene: "road-driving", risk: "low" });
  assert.ok(results.length > 0);
  assert.ok(results.every((platform) => platform.supportedCategoryIds.includes("warm-lofi") && platform.license.risk === "low"));
});
