import assert from "node:assert/strict";
import test from "node:test";
import type { CameraPreset } from "../types/domain.js";
import {
  auditCameraPreset,
  buildIsoScenarioExamples,
  clonePresetAsCustom,
  estimateNdStops,
  flickerSafeShutters,
  recordingMinutesForStorage,
  recordingStorageGb,
  recommendPreset,
  shutterForFps,
} from "./cameraDecisionService.js";

const presets: CameraPreset[] = [
  {
    id: "day",
    camera: "Sony A7C II",
    scene: "daylight-general",
    settings: {
      resolution: "4K",
      fps: 30,
      shutter: "1/60",
      iso: { min: 800, max: 3200 },
      whiteBalanceKelvin: 5600,
      profile: "S-Log3",
    },
    notes: "day preset notes",
  },
];

test("camera decision tools calculate shutter and ND stops", () => {
  assert.equal(shutterForFps(30), "1/60");
  assert.equal(shutterForFps(60), "1/120");
  assert.equal(estimateNdStops(4.4), 4);
});

test("scene generator recommends a matching daylight HDR preset", () => {
  assert.equal(
    recommendPreset(presets, {
      device: "Sony A7C II",
      light: "day",
      movement: "drive",
      weather: "clear",
      nd: true,
      delivery: "hdr10",
      sound: "ambience",
    })?.preset.id,
    "day",
  );
  assert.match(clonePresetAsCustom(presets[0]!, "我的白天").id, /^custom-/);
});

test("scene generator keeps HLG HDR and HDR10 PQ as distinct delivery routes", () => {
  const hlgPreset: CameraPreset = {
    ...presets[0]!,
    id: "hlg-day",
    settings: {
      ...presets[0]!.settings,
      iso: { min: 100, max: 3200 },
      profile: "PP10 · HLG2 / BT.2020",
    },
  };
  const candidates = [hlgPreset, presets[0]!];
  const pq = recommendPreset(candidates, {
    device: "Sony A7C II",
    light: "day",
    movement: "drive",
    weather: "clear",
    nd: true,
    delivery: "hdr10",
    sound: "ambience",
    illumination: "harsh-sun",
    motion: "normal",
    depth: "deep",
    fps: 30,
  });
  const hlg = recommendPreset(candidates, {
    device: "Sony A7C II",
    light: "day",
    movement: "drive",
    weather: "clear",
    nd: false,
    delivery: "hlg",
    sound: "ambience",
    illumination: "open-shade",
    motion: "normal",
    depth: "deep",
    fps: 30,
  });
  assert.equal(pq?.preset.id, "day");
  assert.equal(pq?.deliveryRoute.id, "pq-hdr10");
  assert.equal(hlg?.preset.id, "hlg-day");
  assert.equal(hlg?.deliveryRoute.id, "hlg-hdr");
  assert.match(hlg!.exposure.isoRecommendation, /ISO 100/);
  assert.doesNotMatch(hlg!.deliveryRoute.label, /HDR10/);
  const isoExamples = buildIsoScenarioExamples(hlgPreset);
  assert.equal(isoExamples.length, 6);
  assert.equal(isoExamples[0]!.start, 100);
  assert.ok(isoExamples.at(-1)!.start > isoExamples[0]!.start);

  const nightLog: CameraPreset = {
    ...presets[0]!,
    id: "night-log",
    scene: "city-night-driving",
    settings: { ...presets[0]!.settings, iso: { min: 800, max: 12800 } },
  };
  const night = recommendPreset([hlgPreset, nightLog], {
    device: "Sony A7C II",
    light: "night",
    movement: "drive",
    weather: "clear",
    nd: false,
    delivery: "hlg",
    sound: "ambience",
    illumination: "city-night",
  });
  assert.equal(night?.preset.id, "night-log");
  assert.ok(night?.adjustments.some((item) => item.includes("Log 采集")));
});

test("scene generator applies manual shutter aperture ISO and white balance controls", () => {
  const result = recommendPreset(presets, {
    device: "Sony A7C II",
    light: "day",
    movement: "drive",
    weather: "clear",
    nd: false,
    delivery: "hdr10",
    sound: "ambience",
    fps: 30,
    shutterOverride: "1/125",
    apertureOverride: "F8",
    whiteBalanceOverride: 5200,
    isoMode: "manual",
    manualIso: 100,
    focusOverride: "single-lock",
    stabilizationOverride: "active",
    zebraOverride: "off",
    meteringOverride: "highlight",
    audioControl: "auto",
    focalLength: 35,
    resolutionOverride: "1080p",
    recordingQuality: "420-8",
    codecOverride: "prores",
    exposureCompensation: "-0.7",
    cropMode: "aps-c",
    proxy: "on",
  })!;
  assert.equal(result.exposure.shutter, "1/125");
  assert.equal(result.exposure.aperture, "F8");
  assert.equal(result.exposure.whiteBalance, "5200K（手动锁定）");
  assert.equal(result.exposure.isoRange, "100（手动锁定）");
  assert.ok(
    result.exposure.compatibilityWarnings.some((item) =>
      item.includes("ISO 100"),
    ),
  );
  assert.ok(
    result.exposure.compatibilityWarnings.some((item) =>
      item.includes("1/125"),
    ),
  );
  assert.equal(result.exposure.fieldControls.focus, "单次对焦后锁定");
  assert.equal(result.exposure.fieldControls.zebra, "关闭");
  assert.ok(
    result.exposure.compatibilityWarnings.some((item) =>
      item.includes("斑马线"),
    ),
  );
  assert.ok(
    result.exposure.compatibilityWarnings.some((item) =>
      item.includes("自动增益"),
    ),
  );
  assert.equal(result.exposure.recordingControls.focal, "35mm（约 53mm 等效）");
  assert.equal(result.exposure.recordingControls.quality, "4:2:0 8-bit");
  assert.equal(
    result.exposure.recordingControls.proxy,
    "开启（便于剪辑，不替代原始素材）",
  );
  assert.ok(
    result.exposure.compatibilityWarnings.some((item) =>
      item.includes("至少10-bit"),
    ),
  );
  assert.ok(
    result.exposure.compatibilityWarnings.some((item) =>
      item.includes("ProRes"),
    ),
  );
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
