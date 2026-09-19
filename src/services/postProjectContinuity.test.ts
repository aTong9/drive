import assert from "node:assert/strict";
import test from "node:test";
import { usePlannerStore } from "../app/store.js";
import { davinciWorkflow } from "./workflowService.js";

test("post checklists retain progress per project and clearing one never clears another", () => {
  const initial = usePlannerStore.getState();
  const a = { videoProjectId: "a", title: "项目甲" };
  const b = { videoProjectId: "b", title: "项目乙" };
  try {
    usePlannerStore.setState({ postProject: null, postTasks: [], postArchives: {} });
    initial.importPostWorkflow(davinciWorkflow, a);
    const task = usePlannerStore.getState().postTasks[0]!;
    initial.togglePostTask(task.id);
    initial.importPostWorkflow(davinciWorkflow, b);
    assert.equal(usePlannerStore.getState().postTasks[0]!.completed, false);
    initial.importPostWorkflow(davinciWorkflow, a);
    assert.equal(usePlannerStore.getState().postTasks[0]!.completed, true);
    initial.importPostWorkflow(davinciWorkflow, a);
    assert.equal(usePlannerStore.getState().postTasks[0]!.completed, true);
    initial.importPostWorkflow(davinciWorkflow, b);
    initial.clearPostWorkflow();
    initial.importPostWorkflow(davinciWorkflow, a);
    assert.equal(usePlannerStore.getState().postTasks[0]!.completed, true);
    initial.importPostWorkflow(davinciWorkflow, b);
    assert.equal(usePlannerStore.getState().postTasks[0]!.completed, false);
    initial.importPostWorkflow(davinciWorkflow, { planId: "a", title: "独立计划" });
    assert.equal(usePlannerStore.getState().postTasks[0]!.completed, false);
  } finally { usePlannerStore.setState(initial, true); }
});
