import assert from "node:assert/strict";
import test from "node:test";
import {
  capcutPracticalTutorials,
  capcutProSources,
  capcutProWorkflow,
} from "../data/capcutProWorkflow.js";

test("CapCut Pro workflow covers the complete edit-to-delivery chain", () => {
  assert.deepEqual(
    capcutProWorkflow.map((stage) => stage.id),
    [
      "project-setup",
      "media-organize",
      "rough-cut",
      "captions-graphics",
      "motion-transition",
      "speed-reframe",
      "color-finish",
      "audio-mix",
      "qc-export",
    ],
  );
  assert.ok(capcutProWorkflow.every((stage) => stage.settings.length >= 4));
  assert.ok(capcutProWorkflow.every((stage) => stage.actions.length >= 3));
  assert.ok(capcutProWorkflow.every((stage) => stage.checks.length >= 2));
  assert.match(capcutProWorkflow.at(-1)!.actions.join(" "), /独立播放器/);
});

test("CapCut practical tutorials remain followable and verifiable", () => {
  assert.equal(capcutPracticalTutorials.length, 27);
  assert.ok(
    capcutPracticalTutorials.every(
      (tutorial) => tutorial.steps.length >= 4 && tutorial.checks.length >= 3,
    ),
  );
  assert.ok(
    capcutPracticalTutorials.every(
      (tutorial) =>
        tutorial.estimatedMinutes >= 8 && tutorial.estimatedMinutes <= 15,
    ),
  );
  assert.match(capcutPracticalTutorials[0]!.steps.join(" "), /真实剪辑点/);
  assert.match(
    capcutPracticalTutorials.find(
      (tutorial) => tutorial.id === "capcut-auto-captions",
    )!.pitfall,
    /直接导出/,
  );
  assert.deepEqual(
    capcutPracticalTutorials.slice(-12).map((tutorial) => tutorial.id),
    [
      "capcut-project-handoff",
      "capcut-transcript-edit",
      "capcut-vocal-isolation",
      "capcut-mask-pip",
      "capcut-freeze-explain",
      "capcut-proxy-preview",
      "capcut-music-ducking",
      "capcut-nested-version",
      "capcut-cover-frame-export",
      "capcut-video-noise-reduction",
      "capcut-audio-noise-reduction-ab",
      "capcut-enhance-voice-dialogue",
    ],
  );
  assert.equal(capcutProSources.length, 6);
  assert.ok(
    capcutProSources.every((source) =>
      source.url.startsWith("https://www.capcut.com/"),
    ),
  );
});
