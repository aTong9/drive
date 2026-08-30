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
  assert.equal(capcutPracticalTutorials.length, 76);
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
    capcutPracticalTutorials.slice(-61).map((tutorial) => tutorial.id),
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
      "capcut-chroma-key-green-screen",
      "capcut-multicam-sync-switch",
      "capcut-split-scenes-review",
      "capcut-color-match-reference",
      "capcut-text-to-speech-qa",
      "capcut-external-audio-sync",
      "capcut-audio-only-export",
      "capcut-custom-lut-intensity",
      "capcut-optical-flow-slowmo-qc",
      "capcut-record-voiceover-input-qc",
      "capcut-screen-record-webcam-qc",
      "capcut-long-video-to-shorts-review",
      "capcut-filler-words-manual-review",
      "capcut-smart-search-context-review",
      "capcut-bilingual-captions-translation-qa",
      "capcut-face-license-blur-track-qa",
      "capcut-scrolling-end-credits-qc",
      "capcut-music-copyright-check-evidence",
      "capcut-frame-trim-duration-qc",
      "capcut-reverse-clip-audio-qc",
      "capcut-mirror-text-direction-qc",
      "capcut-copy-paste-attributes-batch-qc",
      "capcut-auto-remove-background-edge-qc",
      "capcut-alpha-export-capability-fallback-qc",
      "capcut-draft-duplicate-cloud-recovery-qc",
      "capcut-custom-shortcuts-conflict-qc",
      "capcut-replace-clip-duration-fallback-qc",
      "capcut-iphone-hdr-capability-handoff-qc",
      "capcut-vfr-cfr-long-sync-qc",
      "capcut-export-error-segment-isolation-qc",
      "capcut-review-copy-watermark-player-time-qc",
      "capcut-review-feedback-marker-task-track-qc",
      "capcut-clipped-audio-backup-voiceover-qc",
      "capcut-multimic-phase-cancellation-qc",
      "capcut-gradient-banding-capability-handoff-qc",
      "capcut-moire-overlay-mask-soften-qc",
      "capcut-horizon-rotate-scale-safe-frame-qc",
      "capcut-chromatic-fringe-mask-hsl-qc",
      "capcut-auto-exposure-pump-keyframe-qc",
      "capcut-lens-distortion-capability-handoff-qc",
      "capcut-rolling-shutter-diagnosis-handoff-qc",
      "capcut-mixed-light-overlay-mask-color-qc",
      "capcut-wind-noise-diagnosis-replace-qc",
      "capcut-interview-static-punch-in-jump-cut-qc",
      "capcut-room-tone-bed-dialogue-edit-qc",
      "capcut-photo-pan-zoom-keyframe-qc",
      "capcut-broll-overlay-dialogue-lock-qc",
      "capcut-before-after-split-screen-export-qc",
      "capcut-alpha-logo-corner-brand-master-qc",
    ],
  );
  assert.equal(capcutProSources.length, 40);
  assert.ok(
    capcutProSources.every((source) =>
      source.url.startsWith("https://www.capcut.com/"),
    ),
  );
});
