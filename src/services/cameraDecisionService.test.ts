import assert from "node:assert/strict";
import test from "node:test";
import type { CameraPreset } from "../types/domain.js";
import { auditCameraPreset, clonePresetAsCustom, estimateNdStops, flickerSafeShutters, recordingMinutesForStorage, recordingStorageGb, recommendPreset, shutterForFps } from "./cameraDecisionService.js";

const presets: CameraPreset[] = [{ id: "day", camera: "Sony A7C II", scene: "daylight-general", settings: { resolution: "4K", fps: 30, shutter: "1/60", iso: { min: 800, max: 3200 }, whiteBalanceKelvin: 5600, profile: "S-Log3" }, notes: "day preset notes" }];

test("camera decision tools calculate shutter and ND stops", () => {
  assert.equal(shutterForFps(30), "1/60");
  assert.equal(shutterForFps(60), "1/120");
  assert.equal(estimateNdStops(4.4), 4);
});

test("scene generator recommends a matching daylight HDR preset", () => {
  assert.equal(recommendPreset(presets, { device: "Sony A7C II", light: "day", movement: "drive", weather: "clear", nd: true, delivery: "hdr10", sound: "ambience" })?.preset.id, "day");
  assert.match(clonePresetAsCustom(presets[0]!, "我的白天").id, /^custom-/);
});

test("storage calculator converts bitrate, duration and capacity", () => {
  assert.equal(recordingStorageGb(100, 60), 45);
  assert.equal(recordingMinutesForStorage(128, 100).toFixed(1), "170.7");
});

test("flicker helper prioritizes a mains-safe shutter near 180 degrees", () => {
  assert.deepEqual(flickerSafeShutters(25, 50), ["1/50", "1/100", "1/150"]);
  assert.deepEqual(flickerSafeShutters(30, 60), ["1/60", "1/120", "1/180"]);
});

test("preset audit finds missing production metadata", () => {
  const result = auditCameraPreset(presets[0]!);
  assert.ok(result.warnings.some((item) => item.includes("10-bit")));
  assert.ok(result.warnings.some((item) => item.includes("编码格式")));
  assert.ok(result.score < 100);
});
