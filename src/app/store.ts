import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FieldCheck, LocalShootPlan, RouteMode, WorkflowStatus } from "../types/domain.js";

type AppView = "explore" | "plans" | "locations";

interface PlannerState {
  view: AppView;
  mode: RouteMode | "all";
  maxDurationMinutes: number;
  query: string;
  selectedRouteId: string;
  detailOpen: boolean;
  plans: LocalShootPlan[];
  fieldChecks: FieldCheck[];
  setView: (view: AppView) => void;
  setMode: (mode: RouteMode | "all") => void;
  setMaxDurationMinutes: (minutes: number) => void;
  setQuery: (query: string) => void;
  selectRoute: (routeId: string) => void;
  closeDetail: () => void;
  addPlan: (input: Pick<LocalShootPlan, "routeId" | "scheduledDate" | "objective">) => void;
  removePlan: (planId: string) => void;
  updatePlanStatus: (planId: string, status: WorkflowStatus) => void;
  saveFieldCheck: (input: Omit<FieldCheck, "updatedAt">) => void;
  removeFieldCheck: (locationId: string) => void;
}

export const usePlannerStore = create<PlannerState>()(persist((set) => ({
  view: "explore",
  mode: "all",
  maxDurationMinutes: 240,
  query: "",
  selectedRouteId: "gd-sz-bay-night",
  detailOpen: true,
  plans: [],
  fieldChecks: [],
  setView: (view) => set({ view }),
  setMode: (mode) => set({ mode }),
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
  saveFieldCheck: (input) => set((state) => ({
    fieldChecks: [
      ...state.fieldChecks.filter((check) => check.locationId !== input.locationId),
      { ...input, updatedAt: new Date().toISOString() }
    ]
  })),
  removeFieldCheck: (locationId) => set((state) => ({ fieldChecks: state.fieldChecks.filter((check) => check.locationId !== locationId) }))
}), {
  name: "roadlens-planner-device-state",
  partialize: (state) => ({ plans: state.plans, fieldChecks: state.fieldChecks })
}));
