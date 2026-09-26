import assert from "node:assert/strict";
import test from "node:test";
import { importFieldChecks } from "./fieldCheckExport.js";
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
