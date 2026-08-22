import assert from "node:assert/strict";
import test from "node:test";
import catalog from "../../data/catalog.json" with { type: "json" };
import {
  sonyMrAudio,
  sonyMrExportPresets,
  sonyMrWorkflows,
} from "../data/sonyMrWorkflow.js";

test("Sony A7C II MR1 MR2 MR3 presets match the current in-camera setup", () => {
  const presets = catalog.cameraPresets.filter((preset) =>
    preset.id.startsWith("a7c2-mr"),
  );
  assert.deepEqual(
    presets.map((preset) => preset.id),
    ["a7c2-mr1-night-slog3", "a7c2-mr2-daylight-general", "a7c2-mr3-day-hlg"],
  );
  assert.deepEqual(
    presets.map((preset) => preset.settings.iso),
    [
      { min: 800, max: 12800 },
      { min: 800, max: 3200 },
      { min: 100, max: 3200 },
    ],
  );
  assert.match(presets[0]!.settings.profile!, /S-Log3/);
  assert.match(presets[1]!.settings.profile!, /S-Log3/);
  assert.match(presets[2]!.settings.profile!, /HLG2/);
});
test("each camera memory has a distinct Resolve and delivery route", () => {
  assert.deepEqual(
    sonyMrWorkflows.map((item) => item.id),
    ["MR1", "MR2", "MR3"],
  );
  assert.match(sonyMrWorkflows[0]!.output, /ST2084/);
  assert.ok(
    sonyMrWorkflows.every((workflow) => workflow.importChecks.length === 3),
  );
  assert.ok(
    sonyMrWorkflows.every((workflow) => workflow.projectSettings.length === 6),
  );
  assert.ok(
    sonyMrWorkflows.every((workflow) =>
      workflow.timeline.includes("DaVinci Wide Gamut / Intermediate"),
    ),
  );
  assert.equal(
    sonyMrWorkflows[0]!.exportPresetId,
    sonyMrWorkflows[1]!.exportPresetId,
  );
  assert.notEqual(
    sonyMrWorkflows[1]!.exportPresetId,
    sonyMrWorkflows[2]!.exportPresetId,
  );
  assert.match(sonyMrWorkflows[2]!.input, /HLG/);
  const mr3 = sonyMrWorkflows[2]!;
  assert.match(mr3.input, /Rec\.2100 HLG \(Scene\)/);
  assert.match(mr3.timeline, /DaVinci Wide Gamut \/ Intermediate/);
  assert.equal(mr3.importChecks.length, 3);
  assert.equal(mr3.projectSettings.length, 6);
  assert.match(mr3.importChecks.join(" "), /59\.94 fps/);
  assert.match(mr3.projectSettings.join(" "), /Linear Mapped/);
  assert.match(mr3.warning, /不要再添加.*CST/);
  for (const slogWorkflow of sonyMrWorkflows.slice(0, 2)) {
    assert.match(
      slogWorkflow.importChecks.join(" "),
      /S-Gamut3\.Cine \/ S-Log3/,
    );
    assert.match(slogWorkflow.importChecks.join(" "), /29\.97 fps/);
    assert.match(slogWorkflow.projectSettings.join(" "), /Rec\.2100 ST2084/);
    assert.match(slogWorkflow.projectSettings.join(" "), /Linear Mapped/);
    assert.match(slogWorkflow.warning, /不要再添加重复.*CST/);
  }
  assert.match(sonyMrAudio.output, /48 kHz/);
});
test("three camera memories reduce to two exact Resolve export presets", () => {
  assert.equal(sonyMrExportPresets.length, 2);
  assert.deepEqual(
    sonyMrExportPresets.map((preset) => preset.name),
    ["Sony_A7CII_SLog3_HDR10_YouTube", "Sony_A7CII_HLG_HDR_YouTube"],
  );
  assert.ok(
    sonyMrExportPresets.every((preset) => preset.bitrate.includes("80,000")),
  );
  assert.equal(sonyMrExportPresets[0]!.gammaTag, "ST2084 / PQ");
  assert.equal(sonyMrExportPresets[1]!.gammaTag, "HLG");
  assert.equal(sonyMrExportPresets[1]!.input, "Rec.2100 HLG (Scene)");
  assert.match(sonyMrExportPresets[1]!.timeline, /Wide Gamut/);
});
