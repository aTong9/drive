import assert from "node:assert/strict";
import test from "node:test";
import type { DavinciWorkflow, ResolvedRoute } from "../types/domain.js";
import { buildRoutePostReferences } from "./productionReferenceService.js";

const grade = (id: string) =>
  ({
    id,
    name: id,
    timelineParameters: {},
  }) as DavinciWorkflow["gradePresets"][number];
const workflow = {
  gradePresets: [
    grade("rain-neon"),
    grade("forest-stream"),
    grade("night-hdr-base"),
    grade("blue-hour-clean"),
    grade("sunset-warm"),
    grade("coast-midday"),
    grade("city-day-clean"),
    grade("daylight-natural"),
  ],
} as DavinciWorkflow;

function route(
  id: string,
  type: string,
  captureStyle: string,
  times: string[],
  profiles: string[],
) {
  return {
    route: { id, name: id, type, captureStyle, best: { times } },
    cameraPresets: profiles.map((profile, index) => ({
      camera: `camera-${index}`,
      settings: { profile },
    })),
  } as unknown as ResolvedRoute;
}

test("matches shooting conditions to a restrained DaVinci starting preset", () => {
  const references = buildRoutePostReferences(
    [
      route(
        "night",
        "city-night",
        "scenic-drive",
        ["blue-hour", "night"],
        ["S-Log3"],
      ),
      route("rain", "city-night", "rain-walk", ["night"], ["HLG2"]),
      route("forest", "forest", "stationary-nature", ["morning"], ["Standard"]),
    ],
    workflow,
  );
  assert.deepEqual(
    references.map((item) => item.gradePreset.id),
    ["night-hdr-base", "rain-neon", "forest-stream"],
  );
});

test("preserves color-management boundaries for mixed camera profiles", () => {
  const [reference] = buildRoutePostReferences(
    [
      route(
        "mixed",
        "coast",
        "scenic-drive",
        ["afternoon"],
        ["S-Log3", "HLG2"],
      ),
    ],
    workflow,
  );
  assert.equal(reference?.gradePreset.id, "coast-midday");
  assert.match(reference?.colorManagementNote ?? "", /分别设置输入色彩空间/);
});
