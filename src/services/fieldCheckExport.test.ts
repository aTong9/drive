import assert from "node:assert/strict";
import test from "node:test";
import { createFieldCheckDraft, fieldCheckForLocation, importFieldChecks } from "./fieldCheckExport.js";
import { usePlannerStore } from "../app/store.js";
import type { Location } from "../types/domain.js";

const location = { id: "loc-a" } as Location;
const payload = { exportType: "roadlens-field-checks", exportVersion: "1.0.0", catalogSchemaVersion: "2.0.0", exportedAt: "2026-01-01T00:00:00Z", records: [{ location: { id: "loc-a" }, fieldCheck: { locationId: "loc-a", visitedAt: "2026-01-01", parkingNote: "ok", lightNote: "ok", soundNote: "ok", overallNote: "ok", updatedAt: "2026-01-01T00:00:00Z" } }] };

test("imports version-matched field checks", async () => {
  const checks = await importFieldChecks(new File([JSON.stringify(payload)], "checks.json"), "2.0.0", [location]);
  assert.equal(checks[0]?.locationId, "loc-a");
});

test("rejects unknown location references", async () => {
  await assert.rejects(() => importFieldChecks(new File([JSON.stringify(payload)], "checks.json"), "2.0.0", []), /未知地点/);
});

test("rejects malformed field notes and impossible visit dates", async () => {
  for (const patch of [{ parkingNote: {} }, { lightNote: [] }, { soundNote: 1 }, { updatedAt: {} }, { visitedAt: "2026-02-30" }]) {
    const record = { ...payload.records[0], fieldCheck: { ...payload.records[0]!.fieldCheck, ...patch } };
    const file = new File([JSON.stringify({ ...payload, records: [record] })], "checks.json");
    await assert.rejects(() => importFieldChecks(file, "2.0.0", [location]), /核验字段/);
  }
});

test("field-check file import rejects repeated locations before any records are returned", async () => {
  const duplicate = { ...payload, records: [payload.records[0], { ...payload.records[0], fieldCheck: { ...payload.records[0]!.fieldCheck, overallNote: "另一条记录" } }] };
  await assert.rejects(() => importFieldChecks(new File([JSON.stringify(duplicate)], "duplicates.json"), "2.0.0", [location]), /重复/);
});

test("a draft from one location cannot be saved after browser navigation selects another", () => {
  const original = usePlannerStore.getState();
  try {
    usePlannerStore.setState({ fieldChecks: [] });
    const draft = { ...createFieldCheckDraft("location-b"), overallNote: "仅属于 B 的核验" };
    const wrongLocation = fieldCheckForLocation(draft, "location-a");
    if (wrongLocation) usePlannerStore.getState().saveFieldCheck(wrongLocation);
    assert.equal(wrongLocation, null);
    assert.deepEqual(usePlannerStore.getState().fieldChecks, []);
    const correctLocation = fieldCheckForLocation(draft, "location-b");
    assert.ok(correctLocation);
    usePlannerStore.getState().saveFieldCheck(correctLocation);
    assert.equal(usePlannerStore.getState().fieldChecks[0]?.locationId, "location-b");
    assert.equal(usePlannerStore.getState().fieldChecks[0]?.overallNote, "仅属于 B 的核验");
  } finally { usePlannerStore.setState(original, true); }
});
