import assert from "node:assert/strict";
import test from "node:test";
import {
  finalCutPracticalTutorials,
  finalCutProSources,
  finalCutProWorkflow,
} from "../data/finalCutProWorkflow.js";

test("Final Cut Pro workflow covers library setup through verified archive", () => {
  assert.deepEqual(
    finalCutProWorkflow.map((stage) => stage.id),
    [
      "library-setup",
      "import-organize",
      "rough-cut",
      "roles-audio",
      "titles-captions",
      "motion-retime",
      "color-finish",
      "index-qc",
      "share-archive",
    ],
  );
  assert.ok(
    finalCutProWorkflow.every(
      (stage) =>
        stage.settings.length >= 4 &&
        stage.actions.length >= 3 &&
        stage.checks.length >= 2,
    ),
  );
  assert.match(finalCutProWorkflow.at(-1)!.actions.join(" "), /独立播放器/);
});

test("Final Cut Pro practical tutorials are followable and use native concepts", () => {
  assert.equal(finalCutPracticalTutorials.length, 27);
  assert.ok(
    finalCutPracticalTutorials.every(
      (tutorial) => tutorial.steps.length >= 4 && tutorial.checks.length >= 3,
    ),
  );
  assert.match(
    finalCutPracticalTutorials[0]!.steps.join(" "),
    /标记.*Command-B.*交叉叠化/,
  );
  assert.match(
    finalCutPracticalTutorials.map((item) => item.title).join(" "),
    /磁性时间线.*Roles.*代理.*色彩管理/,
  );
  assert.deepEqual(
    finalCutPracticalTutorials.slice(-12).map((tutorial) => tutorial.id),
    [
      "fcp-consolidate-handoff",
      "fcp-transcript-visual-search",
      "fcp-synced-clip",
      "fcp-color-match-audition",
      "fcp-roles-stems-share",
      "fcp-voice-isolation-mix",
      "fcp-variable-speed-ramp",
      "fcp-hdr-sdr-deliverable",
      "fcp-chapter-markers-share",
      "fcp-video-noise-reduction",
      "fcp-audio-noise-diagnosis",
      "fcp-deesser-dialogue",
    ],
  );
  assert.equal(finalCutProSources.length, 10);
  assert.ok(
    finalCutProSources.every((source) =>
      source.url.startsWith("https://support.apple.com/"),
    ),
  );
});
