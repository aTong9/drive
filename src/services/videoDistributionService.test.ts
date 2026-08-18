import assert from "node:assert/strict";
import test from "node:test";
import { dailymotionStandardFit, estimateFileSizeGb, videoDistributionPlatforms } from "./videoDistributionService.js";

test("distribution strategy keeps YouTube first and all four platforms represented", () => {
  assert.deepEqual(videoDistributionPlatforms.map((item) => item.id), ["youtube", "dailymotion", "rumble", "vimeo"]);
  assert.equal(videoDistributionPlatforms.at(0)?.priority, "核心");
});

test("Dailymotion 4 GB limit rejects a typical one-hour 4K 20 Mbps encode", () => {
  assert.ok(estimateFileSizeGb(60, 20) > 9);
  assert.equal(dailymotionStandardFit(60).fits, false);
  assert.equal(dailymotionStandardFit(20).fits, true);
});
