import assert from "node:assert/strict";
import test from "node:test";
import { normalizeLongformDraft } from "./longformPlanningService.js";
import { usePlannerStore } from "../app/store.js";

test("longform draft persists serializable inputs and clears readiness only when format changes", () => {
  const initial = usePlannerStore.getState();
  try {
    initial.updateLongformDraft({ targetMinutes: 90, shootDays: 15, bitrateMbps: 400, readiness: [0, 2] });
    const draft = usePlannerStore.getState().longformDraft;
    assert.deepEqual(normalizeLongformDraft(JSON.parse(JSON.stringify(draft))), draft);
    initial.updateLongformDraft({ formatId: draft.formatId });
    assert.deepEqual(usePlannerStore.getState().longformDraft.readiness, [0, 2]);
    initial.updateLongformDraft({ formatId: "cinematic" });
    assert.deepEqual(usePlannerStore.getState().longformDraft.readiness, []);
    assert.equal(usePlannerStore.getState().longformDraft.targetMinutes, 90);
    initial.resetLongformDraft();
    assert.deepEqual(usePlannerStore.getState().longformDraft, normalizeLongformDraft());
    assert.deepEqual(normalizeLongformDraft({ targetMinutes: Infinity, shootDays: 0, bitrateMbps: 9999, readiness: [0, 0, -1, 6, 2.5] }), {
      formatId: "documentary", targetMinutes: 60, shootDays: 1, bitrateMbps: 800, readiness: [0],
    });
  } finally { usePlannerStore.setState(initial, true); }
});
