import assert from "node:assert/strict";
import test from "node:test";
import {
  auditGradePreset,
  estimateRenderMinutes,
  recommendPostPipeline,
  renderStorageGb,
} from "./postDecisionService.js";
import {
  colorFinishingWorkflow,
  resolvePracticalTutorials,
} from "../data/colorFinishingWorkflow.js";
import {
  getResolveTutorialsForWorkspace,
  resolveTutorialCatalog,
} from "../data/resolveTutorialCatalog.js";

test("post pipeline keeps HLG and PQ distinct", () => {
  const pipeline = recommendPostPipeline("hlg", "hdr10");
  assert.match(pipeline.input, /HLG/);
  assert.match(pipeline.output, /ST2084/);
});

test("MR3 stays HLG at input and delivery while grading in DWG", () => {
  const pipeline = recommendPostPipeline("hlg", "hlg");
  assert.equal(pipeline.id, "hlg-hlg");
  assert.match(pipeline.input, /HLG \(Scene\)/);
  assert.match(pipeline.timeline, /DaVinci Wide Gamut/);
  assert.match(pipeline.output, /HLG/);
});

test("post render calculators estimate storage and duration", () => {
  assert.equal(renderStorageGb(80, 90), 54);
  assert.equal(estimateRenderMinutes(90, 0.5), 180);
});

test("grade audit rewards reproducible preset metadata", () => {
  const result = auditGradePreset({
    id: "x",
    name: "x",
    scene: "x",
    accent: "#fff",
    intent: "x",
    exposure: "100 nits",
    whiteBalance: "x",
    contrast: "x",
    saturation: "x",
    timelineParameters: {
      temperature: "0",
      tint: "0",
      contrast: "1",
      pivot: "0.5",
      colorBoost: "0",
      shadows: "0",
      highlights: "0",
      saturation: "50",
      hueMix: "100",
      lumaMix: "100",
      midtoneDetail: "0",
    },
    nodeAdjustments: ["node"],
    cautions: ["caution"],
  });
  assert.equal(result.score, 100);
});

test("every scene preset exposes screenshot-style timeline parameters", async () => {
  const { davinciWorkflow } = await import("./workflowService.js");
  assert.equal(davinciWorkflow.gradePresets.length, 17);
  for (const preset of davinciWorkflow.gradePresets) {
    assert.deepEqual(Object.keys(preset.timelineParameters), [
      "temperature",
      "tint",
      "contrast",
      "pivot",
      "colorBoost",
      "shadows",
      "highlights",
      "saturation",
      "hueMix",
      "lumaMix",
      "midtoneDetail",
    ]);
    assert.ok(preset.nodeAdjustments.length >= 4);
    assert.ok(preset.cautions.length >= 1);
  }
  const night = davinciWorkflow.gradePresets.find(
    (preset) => preset.id === "night-hdr-base",
  )!;
  assert.deepEqual(night.timelineParameters, {
    temperature: "-120",
    tint: "+1.00",
    contrast: "1.056",
    pivot: "0.397",
    colorBoost: "-4.00",
    shadows: "-5.00",
    highlights: "-9.00",
    saturation: "45.00",
    hueMix: "100.00（保持）",
    lumaMix: "100.00",
    midtoneDetail: "0.00",
  });
  const warmAnimation = davinciWorkflow.gradePresets.find(
    (preset) => preset.id === "miyazaki-warm-animation",
  )!;
  assert.equal(warmAnimation.name, "宫崎骏感·温暖手绘动画色");
  assert.match(warmAnimation.intent, /原创调色起点/);
  assert.match(warmAnimation.cautions.join(" "), /并非.*官方 LUT/);
  assert.deepEqual(warmAnimation.timelineParameters, {
    temperature: "+180",
    tint: "-1.00",
    contrast: "0.950",
    pivot: "0.440",
    colorBoost: "+14.00",
    shadows: "+4.00",
    highlights: "-14.00",
    saturation: "53.00",
    hueMix: "100.00（保持）",
    lumaMix: "100.00",
    midtoneDetail: "-8.00",
  });
});

test("color finishing workflow reaches verified delivery", () => {
  assert.deepEqual(
    colorFinishingWorkflow.map((stage) => stage.id),
    [
      "project-management",
      "input-normalize",
      "cleanup",
      "primary-balance",
      "shot-match",
      "secondary",
      "creative-look",
      "texture-output",
      "hdr-safety",
      "timeline-qc",
      "audio-qc",
      "deliver-verify",
    ],
  );
  assert.ok(colorFinishingWorkflow.every((stage) => stage.actions.length >= 3));
  assert.ok(colorFinishingWorkflow.every((stage) => stage.checks.length >= 2));
  assert.ok(
    colorFinishingWorkflow.every((stage) => stage.settings.length >= 3),
  );
  assert.match(
    colorFinishingWorkflow
      .find((stage) => stage.id === "audio-qc")!
      .settings.map((setting) => setting.value)
      .join(" "),
    /48 kHz.*320 kb\/s/,
  );
  assert.match(
    colorFinishingWorkflow
      .find((stage) => stage.id === "deliver-verify")!
      .settings.map((setting) => setting.value)
      .join(" "),
    /80,000 Kb\/s/,
  );
  assert.match(colorFinishingWorkflow.at(-1)!.checks.join(" "), /元数据/);
});

test("Resolve practical tutorials turn markers into verified edits", () => {
  assert.deepEqual(
    resolvePracticalTutorials.map((tutorial) => tutorial.id),
    [
      "marker-cross-dissolve",
      "marker-match-cut",
      "j-l-cut",
      "broll-cover",
      "audio-crossfade",
      "beat-marker-edit",
      "foreground-occlusion-cut",
      "whip-pan-match",
      "dip-to-color",
      "smooth-cut-repair",
      "speed-ramp-transition",
      "transition-qc",
      "multicam-sync-edit",
      "stabilize-crop-qc",
      "dialogue-cleanup-fairlight",
      "subtitle-style-export",
      "tracker-callout",
      "adjustment-clip-version",
      "voiceover-record",
      "project-archive-restore",
      "transcription-rough-cut",
      "object-removal-clean-plate",
      "gallery-still-shot-match",
      "render-queue-versions",
      "proxy-original-relink",
      "vertical-social-version",
      "fairlight-loudness-pass",
      "timeline-version-compare",
      "temporal-spatial-noise-reduction",
      "fairlight-noise-reduction-ab",
      "fairlight-de-esser-dialogue",
      "media-metadata-smart-bins",
      "photo-rate-sort-album",
      "fusion-delta-keyer-clean-plate",
      "media-clone-checksum-backup",
      "photo-keyframe-push-in",
      "color-power-window-track",
      "photo-nondestructive-crop-ratios",
      "fusion-planar-screen-replacement",
      "deliver-individual-clips-handles",
      "media-dual-system-audio-sync",
      "color-skin-qualifier-vectorscope",
      "fairlight-automatic-ducking",
      "cut-source-tape-assembly",
      "edit-scene-cut-detection-review",
      "edit-freeze-frame-hold",
      "edit-render-cache-smart-user",
      "fusion-text-plus-lower-third",
      "edit-compound-clip-decompose",
      "edit-render-in-place-restore",
      "colortrace-revised-timeline",
      "edit-optical-flow-speed-warp-qc",
      "fairlight-dialogue-leveler-ab",
      "color-shared-node-linked-fix",
      "edit-dynamic-project-timeline-copy",
      "fairlight-ai-remove-silence-review",
      "media-intellisearch-context-review",
      "edit-animated-subtitles-word-highlight",
      "color-face-plate-mosaic-track",
      "edit-scroll-credits-readability-qc",
      "media-dual-mono-channel-map-qc",
      "edit-ripple-roll-slip-slide-qc",
      "edit-reverse-speed-audio-continuity-qc",
      "edit-flip-horizontal-text-direction-qc",
      "edit-paste-attributes-selective-qc",
      "color-magic-mask-subject-background-qc",
      "deliver-alpha-prores4444-roundtrip-qc",
      "deliver-live-save-project-backup-restore-drill",
      "edit-keyboard-preset-conflict-qc",
      "edit-replace-edit-playhead-sync-qc",
      "color-iphone-hdr-managed-sdr-hlg-qc",
      "media-vfr-cfr-sync-transcode-qc",
      "deliver-render-failure-range-isolation-qc",
      "deliver-review-copy-data-burnin-qc",
      "edit-review-feedback-marker-status-qc",
      "fairlight-clipped-audio-backup-adr-qc",
      "fairlight-multimic-phase-cancellation-qc",
      "color-gradient-banding-source-grade-export-qc",
      "color-moire-window-blur-track-qc",
      "edit-horizon-level-rotate-safe-crop-qc",
      "color-chromatic-fringe-qualifier-window-qc",
      "color-auto-exposure-pump-dynamic-keyframes-qc",
      "edit-lens-correction-straight-line-qc",
      "edit-rolling-shutter-diagnosis-handoff-qc",
      "color-mixed-light-power-window-track-qc",
      "fairlight-wind-rumble-eq-replace-qc",
      "edit-interview-static-punch-in-jump-cut-qc",
      "fairlight-room-tone-bed-dialogue-edit-qc",
      "edit-dynamic-zoom-still-photo-qc",
      "edit-broll-place-on-top-dialogue-lock-qc",
      "edit-before-after-split-screen-export-qc",
      "edit-alpha-logo-corner-brand-master-qc",
    ],
  );
  assert.match(
    resolvePracticalTutorials[0].steps.join(" "),
    /标记本身不是剪辑点/,
  );
  assert.match(resolvePracticalTutorials[0].steps.join(" "), /Cross Dissolve/);
  assert.ok(
    resolvePracticalTutorials.every((tutorial) => tutorial.steps.length >= 4),
  );
  assert.ok(
    resolvePracticalTutorials.every((tutorial) => tutorial.checks.length >= 3),
  );
  assert.ok(
    resolvePracticalTutorials.every(
      (tutorial) =>
        tutorial.estimatedMinutes >= 5 && tutorial.estimatedMinutes <= 20,
    ),
  );
  assert.ok(
    resolvePracticalTutorials.every(
      (tutorial) => tutorial.prerequisite.trim().length >= 18,
    ),
  );
  assert.deepEqual(
    [...new Set(resolvePracticalTutorials.map((tutorial) => tutorial.level))],
    ["入门", "进阶", "谨慎使用", "质检"],
  );
  assert.ok(
    resolvePracticalTutorials
      .slice(0, 12)
      .every((tutorial) => tutorial.steps.some((step) => /标记/.test(step))),
  );
  assert.match(
    resolvePracticalTutorials.find(
      (tutorial) => tutorial.id === "smooth-cut-repair",
    )!.pitfall,
    /不是通用转场/,
  );
  assert.match(
    resolvePracticalTutorials.find(
      (tutorial) => tutorial.id === "speed-ramp-transition",
    )!.pitfall,
    /Optical Flow/,
  );
  assert.deepEqual(
    [
      ...new Set(
        resolvePracticalTutorials.map(
          (tutorial) => tutorial.category.split(" · ")[0],
        ),
      ),
    ].sort(),
    [
      "修复",
      "动画",
      "媒体",
      "剪辑",
      "声音",
      "合成",
      "字幕",
      "多平台",
      "性能",
      "整理",
      "标题",
      "照片",
      "调色",
      "交付",
      "质检",
      "节奏",
      "转场",
      "变速",
    ].sort(),
  );
});

test("Resolve tutorials belong to their actual workspace", () => {
  assert.equal(resolveTutorialCatalog.length, resolvePracticalTutorials.length);
  assert.ok(resolveTutorialCatalog.every((tutorial) => tutorial.workspace));
  assert.deepEqual(
    getResolveTutorialsForWorkspace("color").map((tutorial) => tutorial.id),
    [
      "adjustment-clip-version",
      "gallery-still-shot-match",
      "temporal-spatial-noise-reduction",
      "color-power-window-track",
      "color-skin-qualifier-vectorscope",
      "colortrace-revised-timeline",
      "color-shared-node-linked-fix",
      "color-face-plate-mosaic-track",
      "color-magic-mask-subject-background-qc",
      "color-iphone-hdr-managed-sdr-hlg-qc",
      "color-gradient-banding-source-grade-export-qc",
      "color-moire-window-blur-track-qc",
      "color-chromatic-fringe-qualifier-window-qc",
      "color-auto-exposure-pump-dynamic-keyframes-qc",
      "color-mixed-light-power-window-track-qc",
    ],
  );
  assert.deepEqual(
    getResolveTutorialsForWorkspace("edit").at(-1)!.id,
    "edit-alpha-logo-corner-brand-master-qc",
  );
  assert.ok(
    getResolveTutorialsForWorkspace("fairlight").every((tutorial) =>
      /声音|响度|降噪|人声/.test(`${tutorial.category} ${tutorial.title}`),
    ),
  );
  assert.ok(
    getResolveTutorialsForWorkspace("deliver").every((tutorial) =>
      /字幕|交付|归档|渲染|竖屏/.test(`${tutorial.category} ${tutorial.title}`),
    ),
  );
  assert.deepEqual(
    getResolveTutorialsForWorkspace("photo").map((tutorial) => tutorial.id),
    [
      "photo-rate-sort-album",
      "photo-keyframe-push-in",
      "photo-nondestructive-crop-ratios",
    ],
  );
  assert.deepEqual(
    getResolveTutorialsForWorkspace("media").map((tutorial) => tutorial.id),
    [
      "proxy-original-relink",
      "media-metadata-smart-bins",
      "media-clone-checksum-backup",
      "media-dual-system-audio-sync",
      "media-intellisearch-context-review",
      "media-dual-mono-channel-map-qc",
      "media-vfr-cfr-sync-transcode-qc",
    ],
  );
  assert.deepEqual(
    getResolveTutorialsForWorkspace("fusion").map((tutorial) => tutorial.id),
    [
      "tracker-callout",
      "object-removal-clean-plate",
      "fusion-delta-keyer-clean-plate",
      "fusion-planar-screen-replacement",
      "fusion-text-plus-lower-third",
    ],
  );
  assert.ok(
    getResolveTutorialsForWorkspace("deliver").some(
      (tutorial) => tutorial.id === "deliver-individual-clips-handles",
    ),
  );
  assert.ok(
    getResolveTutorialsForWorkspace("fairlight").some(
      (tutorial) => tutorial.id === "fairlight-automatic-ducking",
    ),
  );
});
