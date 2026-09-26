import assert from "node:assert/strict";
import test from "node:test";
import { localDateInput } from "./localDate.js";

test("date inputs follow the local calendar at midnight and daylight-saving boundaries", () => {
  const originalTimezone = process.env.TZ;
  try {
    process.env.TZ = "Asia/Shanghai";
    const midnight = new Date("2026-09-26T01:00:00+08:00");
    assert.equal(localDateInput(midnight), "2026-09-26");
    assert.equal(localDateInput(midnight, 1), "2026-09-27");
    assert.equal(localDateInput(new Date("2026-12-31T23:30:00+08:00"), 1), "2027-01-01");
    assert.equal(midnight.toISOString(), "2026-09-25T17:00:00.000Z");
    process.env.TZ = "America/New_York";
    assert.equal(localDateInput(new Date("2026-03-07T23:30:00-05:00"), 1), "2026-03-08");
    assert.equal(localDateInput(new Date("2026-11-01T00:30:00-04:00"), 1), "2026-11-02");
  } finally {
    if (originalTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimezone;
  }
});
