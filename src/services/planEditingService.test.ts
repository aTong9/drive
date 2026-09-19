import assert from "node:assert/strict";
import test from "node:test";
import { validatePlanEdit } from "./planEditingService.js";
import { usePlannerStore } from "../app/store.js";
import { buildVideoProject } from "./videoProjectService.js";
import { resolvedRoutes } from "./catalogService.js";

test("plan edits and reversible deletion preserve identity and linked project data", () => {
  const initial = usePlannerStore.getState();
  const route = resolvedRoutes[0]!;
  const plan = { id: "edit-test", routeId: route.route.id, scheduledDate: "2026-10-01", objective: "原目标", status: "planned" as const, createdAt: "2026-09-19" };
  const project = buildVideoProject(plan, route);
  try {
    usePlannerStore.setState({ plans: [plan], removedPlans: [], videoProjects: [project] });
    initial.editPlan(plan.id, "2026-02-30", "无效日期");
    assert.equal(usePlannerStore.getState().plans[0], plan);
    initial.editPlan(plan.id, "2026-09-30", " 新目标 ");
    const edited = usePlannerStore.getState().plans[0]!;
    assert.equal(edited.scheduledDate, "2026-09-30");
    assert.equal(edited.objective, "新目标");
    assert.equal(edited.id, plan.id);
    initial.removePlan(plan.id);
    assert.equal(usePlannerStore.getState().plans.length, 0);
    assert.deepEqual(usePlannerStore.getState().removedPlans, [edited]);
    initial.restorePlan(plan.id);
    initial.restorePlan(plan.id);
    assert.deepEqual(usePlannerStore.getState().plans, [edited]);
    assert.deepEqual(usePlannerStore.getState().removedPlans, []);
    assert.equal(usePlannerStore.getState().videoProjects[0], project);
    assert.ok(validatePlanEdit("2026-09-30", "   "));
    assert.equal(validatePlanEdit("2028-02-29", "闰日"), null);
  } finally { usePlannerStore.setState(initial, true); }
});
