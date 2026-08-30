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
  assert.equal(finalCutPracticalTutorials.length, 76);
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
    finalCutPracticalTutorials.slice(-61).map((tutorial) => tutorial.id),
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
      "fcp-relink-original-proxy-media",
      "fcp-freeze-frame-hold-segment",
      "fcp-render-files-storage",
      "fcp-range-volume-keyframes",
      "fcp-record-voiceover-auditions",
      "fcp-secondary-storyline",
      "fcp-batch-share-projects",
      "fcp-snapshot-compound-multicam",
      "fcp-slowmo-video-quality-qc",
      "fcp-match-audio-eq-ab",
      "fcp-adjustment-clip-roles-looks",
      "fcp-duplicate-ranges-review",
      "fcp-beat-detection-story-first",
      "fcp-reveal-source-used-ranges",
      "fcp-caption-format-duplicate-validate",
      "fcp-privacy-blur-object-track-qa",
      "fcp-scrolling-credits-readability-qc",
      "fcp-green-screen-keyer-matte-qc",
      "fcp-ripple-roll-slip-slide-two-up",
      "fcp-reverse-rewind-audio-qc",
      "fcp-distort-horizontal-flip-direction-qc",
      "fcp-paste-attributes-effects-keyframe-qc",
      "fcp-scene-removal-mask-clean-frame-qc",
      "fcp-prores4444-alpha-share-reimport-qc",
      "fcp-library-backup-restore-media-qc",
      "fcp-command-set-customize-export-qc",
      "fcp-replace-options-duration-audition-qc",
      "fcp-iphone-dolby-vision-hlg-export-qc",
      "fcp-vfr-rate-conform-sync-qc",
      "fcp-share-render-error-frame-isolation-qc",
      "fcp-review-copy-timecode-generator-qc",
      "fcp-review-feedback-todo-completed-marker-qc",
      "fcp-clipped-audio-component-voiceover-qc",
      "fcp-multimic-component-phase-cancellation-qc",
      "fcp-gradient-banding-film-grain-master-qc",
      "fcp-moire-blur-effect-mask-track-qc",
      "fcp-horizon-transform-overscan-safe-frame-qc",
      "fcp-chromatic-fringe-color-shape-mask-qc",
      "fcp-auto-exposure-pump-color-keyframes-qc",
      "fcp-lens-distortion-capability-handoff-qc",
      "fcp-rolling-shutter-isolate-correct-qc",
      "fcp-mixed-light-shape-mask-color-qc",
      "fcp-wind-noise-eq-isolation-replace-qc",
      "fcp-interview-static-transform-punch-in-qc",
      "fcp-room-tone-connected-bed-crossfade-qc",
      "fcp-ken-burns-photo-pan-zoom-qc",
      "fcp-connected-broll-dialogue-lock-qc",
      "fcp-before-after-trim-transform-share-qc",
      "fcp-alpha-logo-connected-brand-master-qc",
    ],
  );
  assert.equal(finalCutProSources.length, 57);
  assert.ok(
    finalCutProSources.every((source) =>
      source.url.startsWith("https://support.apple.com/"),
    ),
  );
});
