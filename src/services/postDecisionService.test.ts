import assert from "node:assert/strict";
import test from "node:test";
import { auditGradePreset, estimateRenderMinutes, recommendPostPipeline, renderStorageGb } from "./postDecisionService.js";

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
  const result = auditGradePreset({ id: "x", name: "x", scene: "x", accent: "#fff", intent: "x", exposure: "100 nits", whiteBalance: "x", contrast: "x", saturation: "x", nodeAdjustments: ["node"], cautions: ["caution"] });
  assert.equal(result.score, 100);
});
