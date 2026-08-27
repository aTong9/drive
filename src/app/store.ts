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

interface PlannerState {
  view: AppView;
  mode: RouteMode | "all";
  captureStyle: CaptureStyle | "all";
  driveOnly: boolean;
  maxDurationMinutes: number;
  query: string;
  selectedRouteId: string;
  detailOpen: boolean;
  plans: LocalShootPlan[];
  videoProjects: LocalVideoProject[];
  activeVideoProjectId: string;
  fieldChecks: FieldCheck[];
  postTasks: LocalPostTask[];
  postProject: LocalPostProject | null;
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
      view: "locations",
      mode: "all",
      captureStyle: "all",
      driveOnly: false,
      maxDurationMinutes: 240,
      query: "",
      selectedRouteId: "gd-sz-bay-night",
      detailOpen: true,
      plans: [],
      videoProjects: [],
      activeVideoProjectId: "",
      fieldChecks: [],
      postTasks: [],
      postProject: null,
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
      selectRoute: (selectedRouteId) =>
        set({ selectedRouteId, detailOpen: true, view: "explore" }),
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
        })),
      updatePlanStatus: (planId, status) =>
        set((state) => ({
          plans: state.plans.map((plan) =>
            plan.id === planId ? { ...plan, status } : plan,
          ),
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
        set({
          postProject: {
            ...project,
            workflowId: workflow.id,
            createdAt: new Date().toISOString(),
          },
          postTasks: workflow.stages.flatMap((stage) =>
            stage.tasks.map((title, index) => ({
              id: `${workflow.id}-${stage.id}-${index + 1}`,
              workflowId: workflow.id,
              stageId: stage.id,
              title,
              completed: false,
            })),
          ),
        }),
      togglePostTask: (taskId) =>
        set((state) => ({
          postTasks: state.postTasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task,
          ),
        })),
      clearPostWorkflow: () => set({ postTasks: [], postProject: null }),
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
      version: 7,
      migrate: (persisted) => {
        const state = persisted as Partial<PlannerState>;
        return {
          plans: state.plans ?? [],
          videoProjects: (state.videoProjects ?? []).map(normalizeVideoProject),
          activeVideoProjectId: state.activeVideoProjectId ?? "",
          fieldChecks: state.fieldChecks ?? [],
          postTasks: state.postTasks ?? [],
          postProject: state.postProject ?? null,
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
        plans: state.plans,
        videoProjects: state.videoProjects,
        activeVideoProjectId: state.activeVideoProjectId,
        fieldChecks: state.fieldChecks,
        postTasks: state.postTasks,
        postProject: state.postProject,
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
