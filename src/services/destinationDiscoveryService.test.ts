import assert from "node:assert/strict";
import test from "node:test";
import type { ResolvedRoute } from "../types/domain.js";
import { buildDestinationOverview } from "./destinationDiscoveryService.js";

function route(id: string, type: "coast" | "mountain", visual: number, status: "draft" | "source-checked" | "field-checked") {
  return {
    route: {
      id,
      type,
      captureStyle: "scenic-drive",
      verification: { status },
      scores: { visual, youtubePotential: visual, safety: 5 },
    },
    waypoints: [],
    cameraPresets: [],
  } as unknown as ResolvedRoute;
}

test("destination overview summarizes route mix and prioritizes useful verified routes", () => {
  const overview = buildDestinationOverview([
    route("draft", "coast", 3, "draft"),
    route("checked", "mountain", 5, "source-checked"),
    route("field", "mountain", 5, "field-checked"),
  ]);
  assert.equal(overview.total, 3);
  assert.equal(overview.sourceChecked, 2);
  assert.equal(overview.fieldChecked, 1);
  assert.deepEqual(overview.routeTypes[0], { value: "mountain", label: "山路", count: 2 });
  assert.equal(overview.priorityRoutes[0]?.route.id, "field");
});
