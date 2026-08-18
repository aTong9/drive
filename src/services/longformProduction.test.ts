import assert from "node:assert/strict";
import test from "node:test";
import { documentary90Chapters, documentary90Targets, documentaryLessons } from "../data/documentaryTutorial.js";
import { longformBlueprints, longformEditWarnings, longformFormats, longformPhases, longformQualityGates } from "../data/longformProduction.js";

test("longform guide covers documentary, cinematic and observational formats", () => {
  assert.deepEqual(longformFormats.map((item) => item.id), ["documentary", "cinematic", "observational", "road-essay", "portrait", "investigative", "nature", "history"]);
  for (const format of longformFormats) {
    assert.ok(format.structure.length >= 4);
    assert.ok(format.shooting.length >= 4);
    assert.ok(format.editing.length >= 4);
    assert.ok(format.risks.length >= 4);
  }
});
test("longform production covers the full lifecycle", () => {
  assert.ok(longformPhases.length >= 9);
  for (const phase of longformPhases) assert.ok(phase.tasks.length >= 3 && phase.checks.length >= 3);
});
test("longform guide includes editing risks and corrective action", () => {
  assert.ok(longformEditWarnings.length >= 6);
  for (const item of longformEditWarnings) assert.ok(item[0] && item[1] && item[2]);
});
test("every longform format has an actionable production blueprint", () => {
  assert.deepEqual(longformBlueprints.map((item) => item.formatId), longformFormats.map((item) => item.id));
  for (const blueprint of longformBlueprints) {
    assert.ok(blueprint.chapterPlan.length >= 4);
    assert.ok(blueprint.preparation.length >= 4);
    assert.ok(blueprint.interviewQuestions.length >= 3);
    assert.ok(blueprint.soundPlan.length >= 4);
    assert.ok(blueprint.shootingDay.length >= 5);
    assert.ok(blueprint.editPasses.length >= 5);
  }
});
test("release quality gates cover the complete delivery chain", () => {
  assert.deepEqual(longformQualityGates.map((gate) => gate.category), ["故事与结构", "事实与伦理", "画面与连续性", "声音与音乐", "色彩与HDR", "字幕与可访问性", "交付与归档"]);
  assert.ok(longformQualityGates.reduce((total, gate) => total + gate.items.length, 0) >= 35);
  for (const gate of longformQualityGates) assert.ok(gate.items.length >= 5);
});
test("the documentary tutorial is a complete 90 minute production course", () => {
  assert.equal(documentary90Chapters.reduce((total, chapter) => total + chapter.minutes, 0), 90);
  assert.equal(documentary90Chapters.length, 9);
  assert.ok(documentary90Targets.length >= 6);
  for (const chapter of documentary90Chapters) {
    assert.ok(chapter.storyJob.length > 15);
    assert.ok(chapter.requiredScenes.length >= 4);
    assert.ok(chapter.warning.length > 10);
  }
  assert.deepEqual(documentaryLessons.map((lesson) => lesson.id), ["premise", "characters", "preproduction", "field", "interview", "editing", "delivery"]);
  for (const lesson of documentaryLessons) {
    assert.equal(lesson.steps.length, 4);
    for (const step of lesson.steps) assert.ok(step.detail && step.example && step.check);
  }
});
