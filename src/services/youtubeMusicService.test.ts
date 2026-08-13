import assert from "node:assert/strict";
import test from "node:test";
import { filterMusicAlbums, filterMusicPlatforms, filterMusicTracks, youtubeMusicLibrary } from "./youtubeMusicService.js";

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

test("library excludes paid-only subscription and per-track platforms", () => {
  assert.ok(youtubeMusicLibrary.platforms.every((platform) => platform.kind !== "subscription" && platform.kind !== "per-track"));
  assert.ok(youtubeMusicLibrary.platforms.every((platform) => platform.license.cost !== "subscription" && platform.license.cost !== "per-track-or-subscription"));
});

test("every platform is available through a free usage path", () => {
  assert.ok(youtubeMusicLibrary.platforms.length > 0);
  assert.ok(youtubeMusicLibrary.platforms.every((platform) => platform.license.cost === "free" || platform.license.cost === "free-or-paid"));
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
  assert.ok(lofi.length >= 10);
  assert.ok(lofi.every((album) => album.platformId === "streambeats"));
  assert.ok(filterMusicAlbums({ family: "piano" }).some((album) => album.id === "pixabay-healing-piano"));
  assert.ok(filterMusicAlbums({ family: "jazz" }).some((album) => album.id === "pixabay-night-jazz"));
});

test("tracks reference known platforms and categories", () => {
  const platformIds = new Set(youtubeMusicLibrary.platforms.map((platform) => platform.id));
  const categoryIds = new Set(youtubeMusicLibrary.categories.map((category) => category.id));
  assert.ok(youtubeMusicLibrary.tracks.length >= 9);
  for (const track of youtubeMusicLibrary.tracks) {
    assert.ok(platformIds.has(track.platformId), track.id);
    assert.ok(track.categoryIds.every((id) => categoryIds.has(id)), track.id);
    assert.ok(track.durationSeconds > 0, track.id);
    assert.match(track.downloadUrl, /^https:\/\//);
  }
});

test("track filter combines platform, family, scene and search", () => {
  const nightLofi = filterMusicTracks({ platformId: "streambeats", family: "lofi", scene: "road-driving" });
  assert.ok(nightLofi.length >= 2);
  assert.ok(nightLofi.every((track) => track.platformId === "streambeats"));
  assert.deepEqual(filterMusicTracks({ query: "George Street Shuffle" }).map((track) => track.id), ["incompetech-george-street-shuffle"]);
  assert.ok(filterMusicTracks({ family: "piano", scene: "rain" }).length >= 4);
});

test("DOVA gentle piano recommendations include the reference track and close alternatives", () => {
  const dovaPiano = filterMusicTracks({ platformId: "dova-syndrome", family: "piano" });
  assert.ok(dovaPiano.length >= 16);
  assert.ok(dovaPiano.some((track) => track.id === "dova-pianissimo-of-the-gentleness"));
  assert.ok(dovaPiano.some((track) => track.id === "dova-healing-morning"));
  assert.ok(dovaPiano.some((track) => track.id === "dova-rain-garden"));
  assert.ok(dovaPiano.every((track) => track.categoryIds.includes("gentle-piano")));
});

test("long-term signature profile has a 30-track native-loop DOVA collection", () => {
  const profile = youtubeMusicLibrary.categories.find((category) => category.id === "signature-healing-loop");
  const collection = youtubeMusicLibrary.albums.find((album) => album.id === "dova-signature-loopable-30");
  assert.ok(profile);
  assert.ok(collection);
  assert.equal(collection.platformId, "dova-syndrome");
  assert.equal(collection.trackHighlights.length, 30);
  assert.match(collection.listenUrl, /loop=1/);
  assert.match(collection.listenUrl, /tags_m=m03/);
  assert.match(collection.listenUrl, /tags_m=m04/);
  assert.match(collection.listenUrl, /tags_m=m05/);
  assert.match(collection.listenUrl, /tags_r=r22/);
});
