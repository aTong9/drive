import catalogJson from "../../data/catalog.json" with { type: "json" };
import { recommendRoutes } from "../services/routeService.js";
import type { Catalog, PlanRequest, RouteMode } from "../types/domain.js";

// JSON Schema validation is the runtime trust boundary; TypeScript checks all use after this boundary.
const catalog = catalogJson as Catalog;
const allowedModes: RouteMode[] = ["day", "night", "sunrise", "sunset", "asmr"];
const requestedMode = process.argv[2] ?? "night";

if (!allowedModes.includes(requestedMode as RouteMode)) {
  throw new Error(`Unsupported mode: ${requestedMode}. Use ${allowedModes.join(", ")}`);
}

const request: PlanRequest = {
  mode: requestedMode as RouteMode,
  maxDurationMinutes: Number(process.argv[3] ?? 180),
  city: process.argv[4] ?? "深圳"
};

const recommendations = recommendRoutes(catalog, request);

console.log(`规划条件：${request.city} / ${request.mode} / 最长 ${request.maxDurationMinutes} 分钟`);
if (recommendations.length === 0) {
  console.log("没有符合条件的路线。可增加时长或更换模式。 ");
  process.exitCode = 1;
} else {
  for (const [index, item] of recommendations.entries()) {
    console.log(`\n${index + 1}. ${item.route.name}（约 ${item.route.estimatedDurationMinutes} 分钟）`);
    console.log(`   途经：${item.waypoints.map((point) => point.name).join(" → ")}`);
    console.log(`   设备：${item.cameraPresets.map((preset) => `${preset.camera}/${preset.scene}`).join("；")}`);
    console.log(`   建议：${item.route.shootAdvice}`);
  }
}
