import catalogSchema from "../../schemas/roadlens-catalog.schema.json" with { type: "json" };
import type { CameraPreset, FieldCheck, LocalGpxTrack, LocalPostProject, LocalPostTask, LocalShootPlan, LocalVideoProject } from "../types/domain.js";
import { validatePersonalCameraDraft } from "./cameraDecisionService.js";
import { validateFieldCheck } from "./fieldCheckExport.js";
import { localDateInput } from "./localDate.js";
import { normalizeLongformDraft, type LongformDraft } from "./longformPlanningService.js";
import { validatePlanEdit } from "./planEditingService.js";
import { normalizeVideoProject, validateVideoProject } from "./videoProjectService.js";

export const deviceStateVersion = 11;
export const deviceStorageKey = "roadlens-planner-device-state";

export interface DeviceState {
  longformDraft: LongformDraft;
  plans: LocalShootPlan[];
  removedPlans: LocalShootPlan[];
  videoProjects: LocalVideoProject[];
  activeVideoProjectId: string;
  fieldChecks: FieldCheck[];
  postTasks: LocalPostTask[];
  postProject: LocalPostProject | null;
  postArchives: Record<string, { project: LocalPostProject; tasks: LocalPostTask[] }>;
  gpxTrack: LocalGpxTrack | null;
  favoriteCameraPresetIds: string[];
  favoriteDavinciPresetIds: string[];
  cameraMrAssignments: Partial<Record<"MR1" | "MR2" | "MR3", string>>;
  customCameraPresets: CameraPreset[];
  researchRouteIds: string[];
  researchStartDate: string;
}

export function emptyDeviceState(): DeviceState {
  return {
    longformDraft: normalizeLongformDraft(), plans: [], removedPlans: [], videoProjects: [], activeVideoProjectId: "",
    fieldChecks: [], postTasks: [], postProject: null, postArchives: {}, gpxTrack: null,
    favoriteCameraPresetIds: [], favoriteDavinciPresetIds: [],
    cameraMrAssignments: { MR1: "a7c2-mr1-night-slog3", MR2: "a7c2-mr2-daylight-general", MR3: "a7c2-mr3-day-hlg" },
    customCameraPresets: [], researchRouteIds: [], researchStartDate: localDateInput(new Date(), 1),
  };
}

const keys = Object.keys(emptyDeviceState()) as Array<keyof DeviceState>;
export function selectDeviceState(state: DeviceState): DeviceState {
  return Object.fromEntries(keys.map((key) => [key, state[key]])) as unknown as DeviceState;
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
const text = (value: unknown): value is string => typeof value === "string";
const nonempty = (value: unknown): value is string => text(value) && value.length > 0;
const timestamp = (value: unknown) => text(value) && Number.isFinite(Date.parse(value));
const finite = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);
function list<T>(value: unknown, valid: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(valid);
}
function unique<T>(items: T[], identity: (item: T) => string): boolean {
  return new Set(items.map(identity)).size === items.length;
}
function plan(value: unknown): value is LocalShootPlan {
  return record(value) && nonempty(value.id) && nonempty(value.routeId) && text(value.scheduledDate) && text(value.objective) &&
    !validatePlanEdit(value.scheduledDate, value.objective) && timestamp(value.createdAt) &&
    text(value.status) && ["idea", "planned", "captured", "published"].includes(value.status);
}
function postProject(value: unknown): value is LocalPostProject {
  return record(value) && nonempty(value.workflowId) && text(value.title) && timestamp(value.createdAt) &&
    ["videoProjectId", "planId", "routeId"].every((key) => value[key] === undefined || text(value[key]));
}
function postTask(value: unknown): value is LocalPostTask {
  return record(value) && nonempty(value.id) && nonempty(value.workflowId) && text(value.title) && typeof value.completed === "boolean" &&
    text(value.stageId) && ["media", "photo", "cut", "edit", "fusion", "color", "fairlight", "deliver"].includes(value.stageId);
}
function cameraPreset(value: unknown): value is CameraPreset {
  if (!record(value) || !nonempty(value.id) || !text(value.camera) || !text(value.notes) ||
    !text(value.scene) || !catalogSchema.$defs.cameraPreset.properties.scene.enum.includes(value.scene) || !record(value.settings)) return false;
  const settings = value.settings;
  if (!record(settings.iso) || !text(settings.resolution) || !text(settings.shutter) ||
    ![settings.fps, settings.whiteBalanceKelvin, settings.iso.min, settings.iso.max].every(finite)) return false;
  if (Object.keys(validatePersonalCameraDraft({ fps: String(settings.fps), shutter: settings.shutter,
    aperture: text(settings.aperture) ? settings.aperture : "", isoMin: String(settings.iso.min), isoMax: String(settings.iso.max), wb: String(settings.whiteBalanceKelvin) })).length) return false;
  const properties = catalogSchema.$defs.cameraPreset.properties.settings.properties;
  return Object.entries(settings).every(([key, item]) => {
    const rule = properties[key as keyof typeof properties];
    return Boolean(rule) && (key === "iso" || (rule.type === "string" ? text(item) : finite(item) && (rule.type !== "integer" || Number.isInteger(item))));
  }) && [value.setup, value.fieldChecks].every((items) => items === undefined || list(items, text)) &&
    (value.sourceUrl === undefined || (text(value.sourceUrl) && /^https:\/\/[^\s]+$/.test(value.sourceUrl)));
}
function gpx(value: unknown): value is LocalGpxTrack {
  return record(value) && nonempty(value.id) && text(value.name) && value.sourceCrs === "WGS84" && timestamp(value.importedAt) &&
    Array.isArray(value.points) && value.points.length >= 2 && value.points.length <= 10000 && value.points.every((point: unknown) =>
      record(point) && finite(point.lat) && Math.abs(point.lat) <= 90 && finite(point.lng) && Math.abs(point.lng) <= 180 && text(point.crs) && ["WGS84", "GCJ-02"].includes(point.crs));
}
/** Older device versions can omit newly added collections; present values are never silently discarded. */
export function normalizeDeviceState(value: unknown, complete = false): DeviceState {
  if (!record(value)) throw new Error("本地资料不是有效的数据对象");
  const defaults = emptyDeviceState();
  if (complete && keys.some((key) => !Object.hasOwn(value, key))) throw new Error("完整备份缺少资料字段");
  const state = { ...defaults, ...value };
  const validArrays = [
    list(state.plans, plan) && unique(state.plans, (item) => item.id),
    list(state.removedPlans, plan) && unique(state.removedPlans, (item) => item.id),
    list(state.videoProjects, validateVideoProject) && unique(state.videoProjects, (item) => item.id),
    list(state.fieldChecks, validateFieldCheck) && unique(state.fieldChecks, (item) => item.locationId),
    list(state.postTasks, postTask) && unique(state.postTasks, (item) => item.id),
    list(state.customCameraPresets, cameraPreset) && unique(state.customCameraPresets, (item) => item.id),
    ...[state.favoriteCameraPresetIds, state.favoriteDavinciPresetIds, state.researchRouteIds].map((items) => list(items, nonempty) && unique(items, (id) => id)),
  ];
  const draft = state.longformDraft;
  const normalizedDraft = record(draft) ? normalizeLongformDraft(draft) : null;
  const validDraft = normalizedDraft && (!complete || Object.keys(normalizedDraft).every((key) => Object.hasOwn(draft, key))) && Object.entries(draft).every(([key, item]) =>
    Object.hasOwn(normalizedDraft, key) && JSON.stringify(item) === JSON.stringify(normalizedDraft[key as keyof LongformDraft]));
  const validArchives = record(state.postArchives) && Object.values(state.postArchives).every((archive) =>
    record(archive) && postProject(archive.project) && list(archive.tasks, postTask) && unique(archive.tasks, (item) => item.id));
  const validAssignments = record(state.cameraMrAssignments) && Object.entries(state.cameraMrAssignments).every(([slot, id]) => ["MR1", "MR2", "MR3"].includes(slot) && nonempty(id));
  if (validArrays.includes(false) || !validDraft || !validArchives || !validAssignments ||
    !text(state.activeVideoProjectId) || !text(state.researchStartDate) || (state.researchStartDate !== "" && validatePlanEdit(state.researchStartDate, "出发")) ||
    (state.postProject !== null && !postProject(state.postProject)) || (state.gpxTrack !== null && !gpx(state.gpxTrack)))
    throw new Error("本地资料含无效字段、日期或重复记录，原数据已保留");
  return { ...selectDeviceState(state), longformDraft: normalizedDraft!, videoProjects: state.videoProjects.map(normalizeVideoProject) };
}

export function serializeDeviceBackup(state: DeviceState): string {
  return JSON.stringify({ exportType: "roadlens-device-backup", exportVersion: "1.0.0", stateVersion: deviceStateVersion,
    exportedAt: new Date().toISOString(), state: normalizeDeviceState(selectDeviceState(state), true) }, null, 2);
}

export function parseDeviceBackup(source: string): DeviceState {
  const value: unknown = JSON.parse(source);
  if (!record(value) || value.exportType !== "roadlens-device-backup" || value.exportVersion !== "1.0.0" ||
    value.stateVersion !== deviceStateVersion || !timestamp(value.exportedAt)) throw new Error("不是受支持的 RoadLens 完整备份");
  return normalizeDeviceState(value.state, true);
}
