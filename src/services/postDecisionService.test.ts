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

test("post pipeline keeps HLG and PQ distinct", () => {
  const pipeline = recommendPostPipeline("hlg", "hdr10");
  assert.match(pipeline.input, /HLG/);
  assert.match(pipeline.output, /ST2084/);
});

test("MR3 can stay HLG from input through delivery", () => {
  const pipeline = recommendPostPipeline("hlg", "hlg");
  assert.equal(pipeline.id, "hlg-hlg");
  assert.match(pipeline.timeline, /HLG/);
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
  assert.equal(davinciWorkflow.gradePresets.length, 16);
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
  assert.ok(resolvePracticalTutorials.length >= 6);
  assert.equal(resolvePracticalTutorials[0].id, "marker-cross-dissolve");
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
});
