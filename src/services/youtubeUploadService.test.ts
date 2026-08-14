import assert from "node:assert/strict";
import test from "node:test";
import { buildYoutubeUploadGuide } from "./youtubeUploadService.js";
import { estimateSocialBladeEarnings } from "./youtubeCreatorService.js";

test("provides conservative upload defaults without a connected YouTube API", () => {
  const guide = buildYoutubeUploadGuide(undefined, undefined, "ambience");
  assert.equal(guide.visibility, "Private");
  assert.match(guide.title, /Real Road Sounds 4K HDR — No Music, No Talking/);
  assert.match(guide.description, /No music, no talking, no artificial sound loops/);
  assert.ok(guide.checks.some((item) => item.includes("2160p HDR")));
});

test("keeps the two aBin channel promises distinct", () => {
  const vision = buildYoutubeUploadGuide(undefined, undefined, "vision");
  const ambience = buildYoutubeUploadGuide(undefined, undefined, "ambience");
  assert.match(vision.title, /Cinematic Night Drive/);
  assert.match(vision.description, /licensed music/i);
  assert.match(ambience.title, /No Music, No Talking/);
  assert.match(ambience.description, /真实道路与自然环境声/);
  assert.notEqual(vision.playlist, ambience.playlist);
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
  assert.match(immersive.description, /cinematic night journey/i);
  assert.match(archive.title, /Night Drive Film/);
});
