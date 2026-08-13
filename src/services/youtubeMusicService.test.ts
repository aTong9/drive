import assert from "node:assert/strict";
import test from "node:test";
import { filterMusicAlbums, filterMusicPlatforms, youtubeMusicLibrary } from "./youtubeMusicService.js";

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
  const requestedIds = new Set(["zukisuzuki-bgm", "streambeats", "dova-syndrome", "chillpeach", "scott-buckley", "purrple-cat", "roa-music", "peritune", "khaim", "ncs", "pixabay-music", "mixkit", "incompetech", "audionautix", "bensound-free", "freebgm-jp", "bgmer", "otologic", "maou-damashii", "musmus", "hmix-gallery", "amacha-music", "oto-note", "red-bears"]);
  const requested = youtubeMusicLibrary.platforms.filter((platform) => requestedIds.has(platform.id));
  assert.equal(requested.length, requestedIds.size);
  assert.ok(requested.every((platform) => platform.license.cost === "free"));
  assert.ok(requested.every((platform) => platform.importMode === "download-import"));
  assert.ok(requested.every((platform) => platform.license.monetization !== "not-covered"));
  assert.ok(requested.every((platform) => platform.license.audioEditing !== undefined));
});

test("albums reference known platforms and categories", () => {
  const platformIds = new Set(youtubeMusicLibrary.platforms.map((platform) => platform.id));
  const categoryIds = new Set(youtubeMusicLibrary.categories.map((category) => category.id));
  assert.ok(youtubeMusicLibrary.albums.length >= 9);
  for (const album of youtubeMusicLibrary.albums) {
    assert.ok(platformIds.has(album.platformId), album.id);
    assert.ok(album.categoryIds.every((id) => categoryIds.has(id)), album.id);
    assert.match(album.downloadUrl, /^https:\/\//);
  }
});

test("album filter combines platform and the three active families", () => {
  const lofi = filterMusicAlbums({ platformId: "streambeats", family: "lofi", scene: "road-driving" });
  assert.ok(lofi.length >= 2);
  assert.ok(lofi.every((album) => album.platformId === "streambeats"));
  assert.ok(filterMusicAlbums({ family: "piano" }).some((album) => album.id === "pixabay-healing-piano"));
  assert.ok(filterMusicAlbums({ family: "jazz" }).some((album) => album.id === "pixabay-night-jazz"));
});
