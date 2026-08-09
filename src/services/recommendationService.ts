import type { CaptureStyle, ResolvedRoute, Weather } from "../types/domain.js";

export interface RecommendationInput { city: string; availableMinutes: number; weather: Weather; camera: string; objective: CaptureStyle }
export interface RouteRecommendation { item: ResolvedRoute; score: number; reasons: string[] }

export function recommendRoutes(routes: ResolvedRoute[], input: RecommendationInput): RouteRecommendation[] {
  return routes
    .filter((item) => item.route.verification.status !== "draft" && item.route.estimatedDurationMinutes <= input.availableMinutes)
    .map((item) => {
      let score = item.route.scores.visual * 2 + item.route.scores.youtubePotential;
      const reasons: string[] = [`视觉指数 ${item.route.scores.visual}/5`];
      if (item.route.cities.includes(input.city)) { score += 5; reasons.push(`位于${input.city}`); }
      if (item.route.best.weather.includes(input.weather)) { score += 4; reasons.push("匹配当前天气"); }
      if (item.route.captureStyle === input.objective) { score += 6; reasons.push("匹配创作方式"); }
      if (item.cameraPresets.some((preset) => preset.camera === input.camera)) { score += 3; reasons.push(`已有${input.camera}参数`); }
      reasons.push(`可在 ${item.route.estimatedDurationMinutes} 分钟内完成`);
      return { item, score, reasons };
    })
    .sort((a, b) => b.score - a.score || a.item.route.estimatedDurationMinutes - b.item.route.estimatedDurationMinutes)
    .slice(0, 3);
}
