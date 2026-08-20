import assert from "node:assert/strict";
import test from "node:test";
import { ordinaryCreatorModels } from "../data/ordinaryCreatorModels.js";
import {
  estimateCreatorRevenuePotential,
  sortCreatorModelsByRevenuePotential,
} from "./creatorRevenuePotentialService.js";

test("creator revenue potential produces a valid annual range for every direction", () => {
  for (const model of ordinaryCreatorModels) {
    const estimate = estimateCreatorRevenuePotential(model);
    assert.ok(estimate.score >= 25 && estimate.score <= 96);
    assert.ok(estimate.annualMinCny > 0);
    assert.ok(estimate.annualMaxCny > estimate.annualMinCny);
    assert.equal(estimate.rationale.length, 5);
  }
});

test("revenue potential sorting is monotonic in both directions", () => {
  const descending = sortCreatorModelsByRevenuePotential(
    ordinaryCreatorModels,
    "desc",
  );
  const ascending = sortCreatorModelsByRevenuePotential(
    ordinaryCreatorModels,
    "asc",
  );
  for (let index = 1; index < descending.length; index += 1) {
    assert.ok(
      estimateCreatorRevenuePotential(descending[index - 1]!).score >=
        estimateCreatorRevenuePotential(descending[index]!).score,
    );
    assert.ok(
      estimateCreatorRevenuePotential(ascending[index - 1]!).score <=
        estimateCreatorRevenuePotential(ascending[index]!).score,
    );
  }
});
