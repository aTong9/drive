import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CaptureStyle, DavinciWorkflow, FieldCheck, LocalGpxTrack, LocalPostProject, LocalPostTask, LocalShootPlan, LocalVideoProject, RouteMode, VideoProjectStatus, WorkflowStatus } from "../types/domain.js";

type AppView = "dashboard" | "projects" | "explore" | "plans" | "locations" | "cameras" | "post" | "creators" | "music";

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
  setView: (view: AppView) => void;
  setMode: (mode: RouteMode | "all") => void;
  setCaptureStyle: (captureStyle: CaptureStyle | "all") => void;
  setDriveOnly: (driveOnly: boolean) => void;
  setMaxDurationMinutes: (minutes: number) => void;
  setQuery: (query: string) => void;
  selectRoute: (routeId: string) => void;
  closeDetail: () => void;
  addPlan: (input: Pick<LocalShootPlan, "routeId" | "scheduledDate" | "objective">) => void;
  removePlan: (planId: string) => void;
  updatePlanStatus: (planId: string, status: WorkflowStatus) => void;
  saveVideoProject: (project: LocalVideoProject) => void;
  selectVideoProject: (projectId: string) => void;
  updateVideoProjectStatus: (projectId: string, status: VideoProjectStatus) => void;
  toggleProjectShot: (projectId: string, shotId: string) => void;
  toggleProjectPackItem: (projectId: string, itemId: string) => void;
  saveFieldCheck: (input: Omit<FieldCheck, "updatedAt">) => void;
  removeFieldCheck: (locationId: string) => void;
  importFieldChecks: (checks: FieldCheck[]) => void;
  importPostWorkflow: (workflow: DavinciWorkflow, project: Omit<LocalPostProject, "workflowId" | "createdAt">) => void;
  togglePostTask: (taskId: string) => void;
  clearPostWorkflow: () => void;
  setGpxTrack: (track: LocalGpxTrack | null) => void;
}

export const usePlannerStore = create<PlannerState>()(persist((set) => ({
  view: "explore",
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
  setView: (view) => set({ view }),
  setMode: (mode) => set({ mode }),
  setCaptureStyle: (captureStyle) => set({ captureStyle }),
  setDriveOnly: (driveOnly) => set({ driveOnly, captureStyle: driveOnly ? "scenic-drive" : "all" }),
  setMaxDurationMinutes: (maxDurationMinutes) => set({ maxDurationMinutes }),
  setQuery: (query) => set({ query }),
  selectRoute: (selectedRouteId) => set({ selectedRouteId, detailOpen: true, view: "explore" }),
  closeDetail: () => set({ detailOpen: false }),
  addPlan: (input) => set((state) => ({
    plans: [
      ...state.plans.filter((plan) => plan.routeId !== input.routeId),
      {
        ...input,
        id: `plan-${input.routeId}-${Date.now()}`,
        status: "planned",
        createdAt: new Date().toISOString()
      }
    ]
  })),
  removePlan: (planId) => set((state) => ({ plans: state.plans.filter((plan) => plan.id !== planId) })),
  updatePlanStatus: (planId, status) => set((state) => ({
    plans: state.plans.map((plan) => plan.id === planId ? { ...plan, status } : plan)
  })),
  saveVideoProject: (project) => set((state) => ({ videoProjects: [...state.videoProjects.filter((item) => item.id !== project.id), project], activeVideoProjectId: project.id, view: "projects" })),
  selectVideoProject: (activeVideoProjectId) => set({ activeVideoProjectId, view: "projects" }),
  updateVideoProjectStatus: (projectId, status) => set((state) => ({ videoProjects: state.videoProjects.map((project) => project.id === projectId ? { ...project, status, updatedAt: new Date().toISOString() } : project) })),
  toggleProjectShot: (projectId, shotId) => set((state) => ({ videoProjects: state.videoProjects.map((project) => project.id === projectId ? { ...project, updatedAt: new Date().toISOString(), shots: project.shots.map((shot) => shot.id === shotId ? { ...shot, completed: !shot.completed } : shot) } : project) })),
  toggleProjectPackItem: (projectId, itemId) => set((state) => ({ videoProjects: state.videoProjects.map((project) => project.id === projectId ? { ...project, updatedAt: new Date().toISOString(), packItems: project.packItems.map((item) => item.id === itemId ? { ...item, completed: !item.completed } : item) } : project) })),
  saveFieldCheck: (input) => set((state) => ({
    fieldChecks: [
      ...state.fieldChecks.filter((check) => check.locationId !== input.locationId),
      { ...input, updatedAt: new Date().toISOString() }
    ]
  })),
  removeFieldCheck: (locationId) => set((state) => ({ fieldChecks: state.fieldChecks.filter((check) => check.locationId !== locationId) })),
  importFieldChecks: (checks) => set((state) => ({ fieldChecks: [...state.fieldChecks.filter((existing) => !checks.some((incoming) => incoming.locationId === existing.locationId)), ...checks] })),
  importPostWorkflow: (workflow, project) => set({ postProject: { ...project, workflowId: workflow.id, createdAt: new Date().toISOString() }, postTasks: workflow.stages.flatMap((stage) => stage.tasks.map((title, index) => ({ id: `${workflow.id}-${stage.id}-${index + 1}`, workflowId: workflow.id, stageId: stage.id, title, completed: false }))) }),
  togglePostTask: (taskId) => set((state) => ({ postTasks: state.postTasks.map((task) => task.id === taskId ? { ...task, completed: !task.completed } : task) })),
  clearPostWorkflow: () => set({ postTasks: [], postProject: null }),
  setGpxTrack: (gpxTrack) => set({ gpxTrack })
}), {
  name: "roadlens-planner-device-state",
  partialize: (state) => ({ plans: state.plans, videoProjects: state.videoProjects, activeVideoProjectId: state.activeVideoProjectId, fieldChecks: state.fieldChecks, postTasks: state.postTasks, postProject: state.postProject, gpxTrack: state.gpxTrack })
}));
