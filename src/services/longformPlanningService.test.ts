import assert from "node:assert/strict";
import test from "node:test";
import { longformBlueprints } from "../data/longformProduction.js";
import {
  buildLongformShootBlocks,
  buildScaledChapterSchedule,
  estimateLongformScale,
} from "./longformPlanningService.js";

test("estimates longform footage and two-copy storage from a production scale", () => {
  const estimate = estimateLongformScale({
    formatId: "documentary",
    targetMinutes: 60,
    shootDays: 10,
    bitrateMbps: 200,
  });
  assert.equal(estimate.captureHoursLow, 8);
  assert.equal(estimate.captureHoursHigh, 15);
  assert.equal(estimate.storageGbHigh, 1350);
  assert.equal(estimate.twoCopyStorageGb, 2700);
  assert.equal(estimate.scheduleStatus, "comfortable");
});

test("flags a shoot plan below the format-specific day range as tight", () => {
  const estimate = estimateLongformScale({
    formatId: "nature",
    targetMinutes: 60,
    shootDays: 4,
    bitrateMbps: 100,
  });
  assert.equal(estimate.scheduleStatus, "tight");
  assert.ok(estimate.captureHoursHigh > estimate.captureHoursLow);
  assert.ok(
    estimate.captureMinutesPerDayHigh > estimate.captureMinutesPerDayLow,
  );
});

test("scales every blueprint chapter to the requested finished runtime", () => {
  const blueprint = longformBlueprints.find(
    (item) => item.formatId === "cinematic",
  )!;
  const chapters = buildScaledChapterSchedule("cinematic", 60, blueprint);
  assert.equal(chapters.length, blueprint.chapterPlan.length);
  assert.equal(chapters[0]?.startMinute, 0);
  assert.equal(chapters.at(-1)?.endMinute, 60);
  assert.equal(
    chapters.reduce((total, chapter) => total + chapter.durationMinutes, 0),
    60,
  );
  assert.ok(chapters.every((chapter) => chapter.durationMinutes > 0));
});

test("builds a practical shoot schedule for one-day and multi-day projects", () => {
  const blueprint = longformBlueprints[0]!;
  assert.equal(buildLongformShootBlocks(1, blueprint).length, 1);
  assert.equal(buildLongformShootBlocks(2, blueprint).length, 2);
  const blocks = buildLongformShootBlocks(10, blueprint);
  assert.equal(blocks.length, 3);
  assert.match(blocks[0]!.range, /第 1 天/);
  assert.match(blocks.at(-1)!.name, /结果、反证与缺口补拍/);
});
