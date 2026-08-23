import type {
  DavinciGradePreset,
  DavinciWorkflow,
  ResolvedRoute,
} from "../types/domain.js";

export interface RoutePostReference {
  routeId: string;
  routeName: string;
  gradePreset: DavinciGradePreset;
  matchReason: string;
  cameras: string[];
  profiles: string[];
  colorManagementNote: string;
}

function gradeMatch(route: ResolvedRoute): { id: string; reason: string } {
  if (route.route.captureStyle === "rain-walk")
    return { id: "rain-neon", reason: "雨景步行与湿地反光" };
  if (route.route.captureStyle === "stationary-nature")
    return { id: "forest-stream", reason: "自然定点与环境声场景" };
  if (
    route.route.type === "city-night" &&
    route.route.best.times.includes("night")
  )
    return { id: "night-hdr-base", reason: "城市夜景与夜间拍摄" };
  if (route.route.best.times.includes("blue-hour"))
    return { id: "blue-hour-clean", reason: "路线包含蓝调时刻" };
  if (
    route.route.best.times.includes("sunset") ||
    route.route.best.times.includes("golden-hour")
  )
    return { id: "sunset-warm", reason: "路线包含日落或黄金时刻" };
  if (route.route.type === "coast")
    return { id: "coast-midday", reason: "海岸高光与水面反射" };
  if (route.route.type === "city-night")
    return { id: "city-day-clean", reason: "城市建筑与街道层次" };
  return { id: "daylight-natural", reason: "日间公路与自然景观基准" };
}

function colorManagementNote(profiles: string[]) {
  if (profiles.length > 1)
    return "同日包含多种色彩配置；按机位分别设置输入色彩空间，禁止套用同一转换。";
  const profile = profiles[0] ?? "";
  if (/S-Log3/i.test(profile))
    return "S-Log3 素材先设置 S-Gamut3.Cine / S-Log3 输入，再进入 DaVinci Wide Gamut / Intermediate。";
  if (/HLG2|HLG/i.test(profile))
    return "HLG 素材使用 Rec.2100 HLG (Scene) 输入，再进入 DaVinci Wide Gamut / Intermediate。";
  return "先按素材元数据确认输入色彩空间，再进入项目色彩管理；不要仅凭设备名称猜测。";
}

export function buildRoutePostReferences(
  routes: ResolvedRoute[],
  workflow: DavinciWorkflow,
): RoutePostReference[] {
  const gradeById = new Map(
    workflow.gradePresets.map((preset) => [preset.id, preset]),
  );
  return routes.flatMap((route) => {
    const match = gradeMatch(route);
    const gradePreset = gradeById.get(match.id);
    if (!gradePreset) return [];
    const profiles = [
      ...new Set(
        route.cameraPresets
          .map((preset) => preset.settings.profile)
          .filter((profile): profile is string => Boolean(profile)),
      ),
    ];
    return [
      {
        routeId: route.route.id,
        routeName: route.route.name,
        gradePreset,
        matchReason: match.reason,
        cameras: [
          ...new Set(route.cameraPresets.map((preset) => preset.camera)),
        ],
        profiles,
        colorManagementNote: colorManagementNote(profiles),
      },
    ];
  });
}
