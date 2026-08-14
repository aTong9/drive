import assert from "node:assert/strict";
import test from "node:test";
import { buildYoutubeUploadGuide } from "./youtubeUploadService.js";
import { estimateSocialBladeEarnings } from "./youtubeCreatorService.js";

test("provides conservative upload defaults without a connected YouTube API", () => {
  const guide = buildYoutubeUploadGuide(undefined, undefined, "ambience");
  assert.equal(guide.visibility, "Private");
  assert.match(guide.title, /Natural Ambience 4K HDR/);
  assert.ok(guide.checks.some((item) => item.includes("2160p HDR")));
});

test("matches Social Blade's public default CPM estimate range", () => {
  assert.deepEqual(estimateSocialBladeEarnings(100_000), {
    monthlyLow: 25,
    monthlyHigh: 400,
    yearlyLow: 300,
    yearlyHigh: 4800,
  });
});

test("provides distinct search, immersive and archive upload templates", () => {
  const search = buildYoutubeUploadGuide(undefined, undefined, "vision", "search");
  const immersive = buildYoutubeUploadGuide(undefined, undefined, "vision", "immersive");
  const archive = buildYoutubeUploadGuide(undefined, undefined, "vision", "archive");
  assert.equal(new Set([search.title, immersive.title, archive.title]).size, 3);
  assert.match(immersive.description, /电影感旅程/);
  assert.match(archive.title, /Archive/);
});
