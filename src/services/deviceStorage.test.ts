import assert from "node:assert/strict";
import test from "node:test";
import { buildResearchProject } from "./videoProjectService.js";
import { createDeviceStorage, deviceStorage } from "./deviceStorage.js";
import { emptyDeviceState, normalizeDeviceState, parseDeviceBackup, serializeDeviceBackup, type DeviceState } from "./deviceStateService.js";

let saved: string | null = null;
let writes = 0;
let quotaExceeded = false;
const storage = {
  getItem: () => saved,
  setItem: (_name: string, value: string) => {
    if (quotaExceeded) throw new DOMException("Storage full", "QuotaExceededError");
    writes += 1;
    saved = value;
  },
  removeItem: () => { saved = null; },
};
Object.defineProperty(globalThis, "window", { value: { localStorage: storage }, configurable: true });
const { usePlannerStore } = await import("../app/store.js");

test("a failed migration cannot be overwritten by ordinary navigation", async () => {
  saved = JSON.stringify({ version: 10, state: { videoProjects: [buildResearchProject("保留", "目标", ["步骤"]), null] } });
  const original = saved;
  await usePlannerStore.persist.rehydrate();
  usePlannerStore.getState().setView("projects");
  assert.equal(saved, original);
  assert.equal(deviceStorage.getStatus().kind, "read-error");
  assert.equal(deviceStorage.getStatus().original, original);
});

test("quota failures leave the working state usable without throwing from an editor", async () => {
  saved = null;
  await usePlannerStore.persist.rehydrate();
  quotaExceeded = true;
  try {
    assert.doesNotThrow(() => usePlannerStore.getState().updateLongformDraft({ targetMinutes: 90 }));
    assert.equal(usePlannerStore.getState().longformDraft.targetMinutes, 90);
    assert.equal(deviceStorage.getStatus().kind, "write-error");
    assert.match(deviceStorage.getStatus().message, /空间不足/);
    assert.equal(saved, null);
  } finally { quotaExceeded = false; }
  deviceStorage.retry(usePlannerStore.getState());
  assert.equal(deviceStorage.getStatus().kind, "ready");
  assert.equal(JSON.parse(saved!).state.longformDraft.targetMinutes, 90);
});

test("search and navigation do not write the unchanged complete device state", async () => {
  saved = null;
  await usePlannerStore.persist.rehydrate();
  usePlannerStore.getState().updateLongformDraft({ targetMinutes: 80 });
  const before = writes;
  usePlannerStore.getState().setQuery("a");
  usePlannerStore.getState().setQuery("ab");
  usePlannerStore.getState().setView("plans");
  assert.equal(writes, before);
});

test("bad JSON and invalid current-version state remain recoverable after navigation", async () => {
  for (const corrupt of ["{broken JSON", JSON.stringify({ version: 11, state: { plans: false } }), JSON.stringify({ version: 12, state: {} })]) {
    saved = corrupt;
    await usePlannerStore.persist.rehydrate();
    usePlannerStore.getState().setView("locations");
    assert.equal(saved, corrupt);
    assert.equal(deviceStorage.getStatus().kind, "read-error");
    assert.equal(deviceStorage.getStatus().original, corrupt);
  }
});

function completeState(): DeviceState {
  const state = emptyDeviceState();
  const project = buildResearchProject("完整备份测试", "保留拍摄资料", ["拍摄"]);
  state.plans = [{ id: "plan-test", routeId: "route-test", scheduledDate: "2026-09-27", objective: "测试", status: "planned", createdAt: "2026-09-26T00:00:00Z" }];
  state.removedPlans = [{ ...state.plans[0]!, id: "removed-test" }];
  state.videoProjects = [project];
  state.activeVideoProjectId = project.id;
  state.fieldChecks = [{ locationId: "location-test", visitedAt: "2026-09-26", parkingNote: "停车", lightNote: "光线", soundNote: "声音", overallNote: "核验", updatedAt: "2026-09-26T00:00:00Z" }];
  state.postProject = { workflowId: "post-test", videoProjectId: project.id, title: "后期", createdAt: "2026-09-26T00:00:00Z" };
  state.postTasks = [{ id: "task-test", workflowId: "post-test", stageId: "color", title: "调色", completed: true }];
  state.postArchives = { "project-test": { project: state.postProject, tasks: state.postTasks } };
  state.gpxTrack = { id: "gpx-test", name: "轨迹", sourceCrs: "WGS84", importedAt: "2026-09-26T00:00:00Z", points: [{ lat: 22, lng: 114, crs: "GCJ-02" }, { lat: 23, lng: 115, crs: "GCJ-02" }] };
  state.customCameraPresets = [{ id: "custom-中文-1", camera: "个人相机", scene: "daylight-general", settings: { resolution: "4K", fps: 25, shutter: "1/50", iso: { min: 100, max: 3200 }, whiteBalanceKelvin: 5600 }, notes: "保留我的参数" }];
  state.cameraMrAssignments = { MR1: state.customCameraPresets[0]!.id };
  state.favoriteCameraPresetIds = [state.customCameraPresets[0]!.id];
  state.favoriteDavinciPresetIds = ["grade-test"];
  state.researchRouteIds = ["route-test"];
  state.longformDraft = { formatId: "cinematic", targetMinutes: 90, shootDays: 15, bitrateMbps: 400, readiness: [1, 3] };
  return state;
}

test("complete backup round-trips every persisted collection, settings and progress", () => {
  const state = completeState();
  assert.deepEqual(parseDeviceBackup(serializeDeviceBackup(state)), state);
  const before = writes;
  const restored = deviceStorage.replace(parseDeviceBackup(serializeDeviceBackup(state)));
  usePlannerStore.setState(restored);
  assert.equal(writes, before + 1);
  assert.equal(deviceStorage.getStatus().kind, "ready");
  assert.deepEqual(JSON.parse(saved!).state, state);
  assert.deepEqual(usePlannerStore.getState().postArchives, state.postArchives);
});

test("a failed complete restore preserves both saved data and current work", () => {
  const original = saved;
  const current = usePlannerStore.getState();
  quotaExceeded = true;
  try {
    assert.throws(() => {
      const restored = deviceStorage.replace(emptyDeviceState());
      usePlannerStore.setState(restored);
    }, /Storage full/);
    assert.equal(saved, original);
    assert.equal(usePlannerStore.getState(), current);
  } finally { quotaExceeded = false; }
});

test("legacy valid state gains missing fields without losing project work", () => {
  const project = buildResearchProject("旧项目", "保留进度", ["步骤"]);
  project.deliveryItems = [{ id: "legacy-item", title: "aBin Vision 与 Ambience 画面长度一致", completed: true, note: "核对过" }];
  const { mediaBatches: _batches, musicTracks: _music, ...legacy } = project;
  const restored = normalizeDeviceState({ videoProjects: [legacy] });
  assert.equal(restored.videoProjects[0]?.deliveryItems[0]?.title, "Vision 与 Ambience 画面长度一致");
  assert.equal(restored.videoProjects[0]?.deliveryItems[0]?.completed, true);
  assert.deepEqual(restored.videoProjects[0]?.mediaBatches, []);
  assert.deepEqual(restored.plans, []);
});

test("strict backup import rejects invalid nested fields, duplicate ids and missing collections", () => {
  const original = saved;
  const mutations: Array<(state: Record<string, unknown>) => void> = [
    (state) => { state.plans = false; },
    (state) => { delete state.postArchives; },
    (state) => { state.longformDraft = { formatId: "cinematic", targetMinutes: "90" }; },
    (state) => { state.videoProjects = [null]; },
    (state) => { state.cameraMrAssignments = { MR1: false }; },
    (state) => { state.favoriteCameraPresetIds = ["same", "same"]; },
    (state) => { state.plans = [{ ...completeState().plans[0], status: ["planned"] }]; },
    (state) => { state.fieldChecks = [{ ...completeState().fieldChecks[0], parkingNote: {} }]; },
    (state) => { state.fieldChecks = [{ ...completeState().fieldChecks[0], visitedAt: "2026-02-30" }]; },
    (state) => { state.postTasks = [{ ...completeState().postTasks[0], completed: "true" }]; },
    (state) => { state.customCameraPresets = [{ ...completeState().customCameraPresets[0], settings: { fps: 0 } }]; },
    (state) => { state.gpxTrack = { ...completeState().gpxTrack, points: [{ lat: 900, lng: 0, crs: "WGS84" }, { lat: 0, lng: 0, crs: "WGS84" }] }; },
  ];
  for (const mutate of mutations) {
    const envelope = JSON.parse(serializeDeviceBackup(completeState())) as { state: Record<string, unknown> };
    mutate(envelope.state);
    assert.throws(() => parseDeviceBackup(JSON.stringify(envelope)));
    assert.equal(saved, original);
  }
});

test("unavailable browser storage is visible and subsequent edits cannot erase it", () => {
  let accessed = 0;
  const denied = createDeviceStorage(() => { accessed += 1; throw new DOMException("denied", "SecurityError"); });
  assert.equal(denied.storage.getItem("test"), null);
  denied.storage.setItem("test", { state: completeState(), version: 11 });
  assert.equal(accessed, 1);
  assert.equal(denied.getStatus().kind, "read-error");
});

test("retrospective edits reject invalid numbers while cleared inputs remain backup-safe", () => {
  usePlannerStore.setState(deviceStorage.replace(completeState()));
  for (const field of ["views7d", "clickThroughRate", "averageViewMinutes", "averagePercentageViewed"] as const) {
    const current = () => usePlannerStore.getState().videoProjects[0]!;
    const edit = (value: number) => usePlannerStore.getState().updateVideoProject(current().id, {
      retrospective: { ...current().retrospective, metrics: { ...current().retrospective.metrics, [field]: value } },
    });
    edit(12);
    const previousSave = saved;
    for (const invalid of [-1, NaN, Infinity]) {
      edit(invalid);
      assert.equal(current().retrospective.metrics[field], 12);
      assert.equal(saved, previousSave);
    }
    edit(Number(""));
    assert.equal(current().retrospective.metrics[field], 0);
    const restored = parseDeviceBackup(serializeDeviceBackup(usePlannerStore.getState()));
    assert.equal(restored.videoProjects[0]?.retrospective.metrics[field], 0);
  }
});
