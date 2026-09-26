import { validatePlanEdit } from "../services/planEditingService.js";
import { normalizeLongformDraft, type LongformDraft } from "../services/longformPlanningService.js";
import { resolvedRoutes } from "../services/catalogService.js";
import type { CurrentRegion } from "../services/currentCityService.js";
import type { AdministrativeGroupId } from "../services/regionService.js";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CaptureStyle,
  CameraPreset,
  DavinciWorkflow,
  FieldCheck,
  LocalGpxTrack,
  LocalPostProject,
  LocalPostTask,
  LocalShootPlan,
  LocalVideoProject,
  RouteMode,
  VideoProjectStatus,
  WorkflowStatus,
} from "../types/domain.js";
import { normalizeVideoProject } from "../services/videoProjectService.js";

export type AppView =
  | "dashboard"
  | "projects"
  | "explore"
  | "plans"
  | "locations"
  | "cameras"
  | "post"
  | "longform"
  | "creators"
  | "music"
  | "upload";

const postContextKey = (project: Pick<LocalPostProject, "workflowId" | "videoProjectId" | "planId" | "routeId">) =>
  JSON.stringify([project.workflowId, project.videoProjectId ? "video" : project.planId ? "plan" : "route", project.videoProjectId ?? project.planId ?? project.routeId ?? "standalone"]);

interface PlannerState {
  longformDraft: LongformDraft;
  updateLongformDraft: (patch: Partial<LongformDraft>) => void;
  resetLongformDraft: () => void;
  currentRegion: CurrentRegion | null;
  destination: { groupId: AdministrativeGroupId | "all"; province: string; city: string };
  setCurrentRegion: (region: CurrentRegion | null) => void;
  setDestination: (destination: PlannerState["destination"]) => void;
  view: AppView;
  mode: RouteMode | "all";
  captureStyle: CaptureStyle | "all";
  driveOnly: boolean;
  maxDurationMinutes: number;
  query: string;
  selectedRouteId: string;
  routeOpenVersion: number;
  detailOpen: boolean;
  plans: LocalShootPlan[];
  removedPlans: LocalShootPlan[];
  restorePlan: (planId: string) => void;
  editPlan: (planId: string, scheduledDate: string, objective: string) => void;
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
  setView: (view: AppView) => void;
  setMode: (mode: RouteMode | "all") => void;
  setCaptureStyle: (captureStyle: CaptureStyle | "all") => void;
  setDriveOnly: (driveOnly: boolean) => void;
  setMaxDurationMinutes: (minutes: number) => void;
  setQuery: (query: string) => void;
  selectRoute: (routeId: string) => void;
  closeDetail: () => void;
  addPlan: (
    input: Pick<LocalShootPlan, "routeId" | "scheduledDate" | "objective">,
  ) => void;
  removePlan: (planId: string) => void;
  updatePlanStatus: (planId: string, status: WorkflowStatus) => void;
  addProjectMusic: (projectId: string, track: LocalVideoProject["musicTracks"][number]) => void;
  saveVideoProject: (project: LocalVideoProject) => void;
  selectVideoProject: (projectId: string) => void;
  updateVideoProjectStatus: (
    projectId: string,
    status: VideoProjectStatus,
  ) => void;
  toggleProjectShot: (projectId: string, shotId: string) => void;
  setProjectShotStatus: (
    projectId: string,
    shotId: string,
    status: LocalVideoProject["shots"][number]["captureStatus"],
  ) => void;
  toggleProjectPackItem: (projectId: string, itemId: string) => void;
  toggleProjectWorkflowItem: (
    projectId: string,
    scope: "ingest" | "delivery",
    itemId: string,
  ) => void;
  updateVideoProject: (
    projectId: string,
    patch: Partial<LocalVideoProject>,
  ) => void;
  saveFieldCheck: (input: Omit<FieldCheck, "updatedAt">) => void;
  removeFieldCheck: (locationId: string) => void;
  importFieldChecks: (checks: FieldCheck[]) => void;
  importPostWorkflow: (
    workflow: DavinciWorkflow,
    project: Omit<LocalPostProject, "workflowId" | "createdAt">,
  ) => void;
  togglePostTask: (taskId: string) => void;
  clearPostWorkflow: () => void;
  setGpxTrack: (track: LocalGpxTrack | null) => void;
  toggleFavoriteCameraPreset: (presetId: string) => void;
  toggleFavoriteDavinciPreset: (presetId: string) => void;
  assignCameraMr: (slot: "MR1" | "MR2" | "MR3", presetId: string) => void;
  saveCustomCameraPreset: (preset: CameraPreset) => void;
  removeCustomCameraPreset: (presetId: string) => void;
  toggleResearchRoute: (routeId: string) => void;
  moveResearchRoute: (routeId: string, direction: "up" | "down") => void;
  setResearchStartDate: (date: string) => void;
  clearResearchRoutes: () => void;
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set) => ({
      longformDraft: normalizeLongformDraft(),
      updateLongformDraft: (patch) => set((state) => ({ longformDraft: normalizeLongformDraft({ ...state.longformDraft, ...patch,
        readiness: patch.formatId && patch.formatId !== state.longformDraft.formatId ? [] : patch.readiness ?? state.longformDraft.readiness,
      }) })),
      resetLongformDraft: () => set({ longformDraft: normalizeLongformDraft() }),
      currentRegion: null,
      destination: { groupId: "all", province: "", city: "" },
      setCurrentRegion: (currentRegion) => set({ currentRegion }),
      setDestination: (destination) => set({ destination }),
      view: "locations",
      mode: "all",
      captureStyle: "all",
      driveOnly: false,
      maxDurationMinutes: 240,
      query: "",
      selectedRouteId: "gd-sz-bay-night",
      routeOpenVersion: 0,
      detailOpen: true,
      plans: [],
      removedPlans: [],
      videoProjects: [],
      activeVideoProjectId: "",
      fieldChecks: [],
      postTasks: [],
      postProject: null,
      postArchives: {},
      gpxTrack: null,
      favoriteCameraPresetIds: [],
      favoriteDavinciPresetIds: [],
      cameraMrAssignments: {
        MR1: "a7c2-mr1-night-slog3",
        MR2: "a7c2-mr2-daylight-general",
        MR3: "a7c2-mr3-day-hlg",
      },
      customCameraPresets: [],
      researchRouteIds: [],
      researchStartDate: new Date(Date.now() + 86400000)
        .toISOString()
        .slice(0, 10),
      setView: (view) => set({ view }),
      setMode: (mode) => set({ mode }),
      setCaptureStyle: (captureStyle) => set({ captureStyle }),
      setDriveOnly: (driveOnly) =>
        set({ driveOnly, captureStyle: driveOnly ? "scenic-drive" : "all" }),
      setMaxDurationMinutes: (maxDurationMinutes) =>
        set({ maxDurationMinutes }),
      setQuery: (query) => set({ query }),
      selectRoute: (selectedRouteId) => {
        const target = resolvedRoutes.find((item) => item.route.id === selectedRouteId);
        if (!target) return;
        set((state) => ({
          selectedRouteId, detailOpen: true, view: "explore",
          routeOpenVersion: state.routeOpenVersion + 1,
          currentRegion: null,
          destination: { groupId: "all", province: "", city: "" },
          mode: "all", captureStyle: "all", driveOnly: false, query: "",
          maxDurationMinutes: Math.max(state.maxDurationMinutes, target.route.estimatedDurationMinutes),
        }));
      },
      closeDetail: () => set({ detailOpen: false }),
      addPlan: (input) =>
        set((state) => ({
          plans: [
            ...state.plans.filter((plan) => plan.routeId !== input.routeId),
            {
              ...input,
              id: `plan-${input.routeId}-${Date.now()}`,
              status: "planned",
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      removePlan: (planId) =>
        set((state) => ({
          plans: state.plans.filter((plan) => plan.id !== planId),
          removedPlans: [...state.removedPlans, ...state.plans.filter((plan) => plan.id === planId)],
        })),
      restorePlan: (planId) => set((state) => ({
        plans: [...state.plans, ...state.removedPlans.filter((plan) => plan.id === planId && !state.plans.some((active) => active.id === planId))],
        removedPlans: state.removedPlans.filter((plan) => plan.id !== planId),
      })),
      editPlan: (planId, scheduledDate, objective) => {
        if (validatePlanEdit(scheduledDate, objective)) return;
        set((state) => ({ plans: state.plans.map((plan) => plan.id === planId ? { ...plan, scheduledDate, objective: objective.trim() } : plan) }));
      },
      updatePlanStatus: (planId, status) =>
        set((state) => ({
          plans: state.plans.map((plan) =>
            plan.id === planId ? { ...plan, status } : plan,
          ),
        })),
      addProjectMusic: (projectId, track) => set((state) => ({
        videoProjects: state.videoProjects.map((project) => project.id !== projectId || project.musicTracks.some((item) => item.id === track.id) ? project : {
          ...project, musicTracks: [...project.musicTracks, { ...track, licenseStatus: "candidate", licenseReference: "" }], updatedAt: new Date().toISOString(),
        }),
      })),
      saveVideoProject: (project) =>
        set((state) => ({
          videoProjects: [
            ...state.videoProjects.filter((item) => item.id !== project.id),
            project,
          ],
          activeVideoProjectId: project.id,
          view: "projects",
        })),
      selectVideoProject: (activeVideoProjectId) =>
        set({ activeVideoProjectId, view: "projects" }),
      updateVideoProjectStatus: (projectId, status) =>
        set((state) => ({
          videoProjects: state.videoProjects.map((project) =>
            project.id === projectId
              ? { ...project, status, updatedAt: new Date().toISOString() }
              : project,
          ),
        })),
      toggleProjectShot: (projectId, shotId) =>
        set((state) => ({
          videoProjects: state.videoProjects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  updatedAt: new Date().toISOString(),
                  shots: project.shots.map((shot) =>
                    shot.id === shotId
                      ? {
                          ...shot,
                          completed: shot.captureStatus !== "captured",
                          captureStatus:
                            shot.captureStatus === "captured"
                              ? "pending"
                              : "captured",
                        }
                      : shot,
                  ),
                }
              : project,
          ),
        })),
      setProjectShotStatus: (projectId, shotId, captureStatus) =>
        set((state) => ({
          videoProjects: state.videoProjects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  updatedAt: new Date().toISOString(),
                  shots: project.shots.map((shot) =>
                    shot.id === shotId
                      ? {
                          ...shot,
                          captureStatus,
                          completed: captureStatus === "captured",
                        }
                      : shot,
                  ),
                }
              : project,
          ),
        })),
      toggleProjectPackItem: (projectId, itemId) =>
        set((state) => ({
          videoProjects: state.videoProjects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  updatedAt: new Date().toISOString(),
                  packItems: project.packItems.map((item) =>
                    item.id === itemId
                      ? { ...item, completed: !item.completed }
                      : item,
                  ),
                }
              : project,
          ),
        })),
      toggleProjectWorkflowItem: (projectId, scope, itemId) =>
        set((state) => ({
          videoProjects: state.videoProjects.map((project) => {
            if (project.id !== projectId) return project;
            const key = scope === "ingest" ? "ingestItems" : "deliveryItems";
            const items = project[key] ?? [];
            return {
              ...project,
              [key]: items.map((item) =>
                item.id === itemId
                  ? { ...item, completed: !item.completed }
                  : item,
              ),
              updatedAt: new Date().toISOString(),
            };
          }),
        })),
      updateVideoProject: (projectId, patch) =>
        set((state) => ({
          videoProjects: state.videoProjects.map((project) =>
            project.id === projectId
              ? { ...project, ...patch, updatedAt: new Date().toISOString() }
              : project,
          ),
        })),
      saveFieldCheck: (input) =>
        set((state) => ({
          fieldChecks: [
            ...state.fieldChecks.filter(
              (check) => check.locationId !== input.locationId,
            ),
            { ...input, updatedAt: new Date().toISOString() },
          ],
        })),
      removeFieldCheck: (locationId) =>
        set((state) => ({
          fieldChecks: state.fieldChecks.filter(
            (check) => check.locationId !== locationId,
          ),
        })),
      importFieldChecks: (checks) =>
        set((state) => ({
          fieldChecks: [
            ...state.fieldChecks.filter(
              (existing) =>
                !checks.some(
                  (incoming) => incoming.locationId === existing.locationId,
                ),
            ),
            ...checks,
          ],
        })),
      importPostWorkflow: (workflow, project) =>
        set((state) => {
          const postArchives = { ...state.postArchives };
          if (state.postProject) postArchives[postContextKey(state.postProject)] = { project: state.postProject, tasks: state.postTasks };
          const key = postContextKey({ ...project, workflowId: workflow.id });
          const saved = postArchives[key];
          return {
            postArchives,
            postProject: saved ? { ...saved.project, ...project } : { ...project, workflowId: workflow.id, createdAt: new Date().toISOString() },
            postTasks: saved?.tasks ?? workflow.stages.flatMap((stage) => stage.tasks.map((title, index) => ({
              id: `${workflow.id}-${stage.id}-${index + 1}`, workflowId: workflow.id, stageId: stage.id, title, completed: false,
            }))),
          };
        }),
      togglePostTask: (taskId) =>
        set((state) => ({
          postTasks: state.postTasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task,
          ),
        })),
      clearPostWorkflow: () => set((state) => {
        const postArchives = { ...state.postArchives };
        if (state.postProject) delete postArchives[postContextKey(state.postProject)];
        return { postTasks: [], postProject: null, postArchives };
      }),
      setGpxTrack: (gpxTrack) => set({ gpxTrack }),
      toggleFavoriteCameraPreset: (presetId) =>
        set((state) => ({
          favoriteCameraPresetIds: state.favoriteCameraPresetIds.includes(
            presetId,
          )
            ? state.favoriteCameraPresetIds.filter((id) => id !== presetId)
            : [...state.favoriteCameraPresetIds, presetId],
        })),
      toggleFavoriteDavinciPreset: (presetId) =>
        set((state) => ({
          favoriteDavinciPresetIds: state.favoriteDavinciPresetIds.includes(
            presetId,
          )
            ? state.favoriteDavinciPresetIds.filter((id) => id !== presetId)
            : [...state.favoriteDavinciPresetIds, presetId],
        })),
      assignCameraMr: (slot, presetId) =>
        set((state) => ({
          cameraMrAssignments: {
            ...state.cameraMrAssignments,
            [slot]: presetId,
          },
        })),
      saveCustomCameraPreset: (preset) =>
        set((state) => ({
          customCameraPresets: [
            ...state.customCameraPresets.filter(
              (item) => item.id !== preset.id,
            ),
            preset,
          ],
        })),
      removeCustomCameraPreset: (presetId) =>
        set((state) => ({
          customCameraPresets: state.customCameraPresets.filter(
            (item) => item.id !== presetId,
          ),
          favoriteCameraPresetIds: state.favoriteCameraPresetIds.filter(
            (id) => id !== presetId,
          ),
        })),
      toggleResearchRoute: (routeId) =>
        set((state) => ({
          researchRouteIds: state.researchRouteIds.includes(routeId)
            ? state.researchRouteIds.filter((id) => id !== routeId)
            : [...state.researchRouteIds, routeId],
        })),
      moveResearchRoute: (routeId, direction) =>
        set((state) => {
          const index = state.researchRouteIds.indexOf(routeId);
          const target = direction === "up" ? index - 1 : index + 1;
          if (
            index < 0 ||
            target < 0 ||
            target >= state.researchRouteIds.length
          )
            return state;
          const researchRouteIds = [...state.researchRouteIds];
          [researchRouteIds[index], researchRouteIds[target]] = [
            researchRouteIds[target]!,
            researchRouteIds[index]!,
          ];
          return { researchRouteIds };
        }),
      setResearchStartDate: (researchStartDate) => set({ researchStartDate }),
      clearResearchRoutes: () => set({ researchRouteIds: [] }),
    }),
    {
      name: "roadlens-planner-device-state",
      version: 11,
      migrate: (persisted) => {
        const state = persisted as Partial<PlannerState>;
        return {
          longformDraft: normalizeLongformDraft(state.longformDraft),
          plans: state.plans ?? [],
          removedPlans: state.removedPlans ?? [],
          videoProjects: (state.videoProjects ?? []).map(normalizeVideoProject),
          activeVideoProjectId: state.activeVideoProjectId ?? "",
          fieldChecks: state.fieldChecks ?? [],
          postTasks: state.postTasks ?? [],
          postProject: state.postProject ?? null,
          postArchives: state.postArchives ?? {},
          gpxTrack: state.gpxTrack ?? null,
          favoriteCameraPresetIds: state.favoriteCameraPresetIds ?? [],
          favoriteDavinciPresetIds: state.favoriteDavinciPresetIds ?? [],
          cameraMrAssignments: {
            MR1: "a7c2-mr1-night-slog3",
            MR2: "a7c2-mr2-daylight-general",
            MR3: "a7c2-mr3-day-hlg",
            ...(state.cameraMrAssignments ?? {}),
          },
          customCameraPresets: state.customCameraPresets ?? [],
          researchRouteIds: state.researchRouteIds ?? [],
          researchStartDate:
            state.researchStartDate ??
            new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        };
      },
      partialize: (state) => ({
        longformDraft: state.longformDraft,
        plans: state.plans,
        removedPlans: state.removedPlans,
        videoProjects: state.videoProjects,
        activeVideoProjectId: state.activeVideoProjectId,
        fieldChecks: state.fieldChecks,
        postTasks: state.postTasks,
        postProject: state.postProject,
        postArchives: state.postArchives,
        gpxTrack: state.gpxTrack,
        favoriteCameraPresetIds: state.favoriteCameraPresetIds,
        favoriteDavinciPresetIds: state.favoriteDavinciPresetIds,
        cameraMrAssignments: state.cameraMrAssignments,
        customCameraPresets: state.customCameraPresets,
        researchRouteIds: state.researchRouteIds,
        researchStartDate: state.researchStartDate,
      }),
    },
  ),
);
