import type { LocalShootPlan, ResolvedRoute } from "../types/domain.js";

const styleLabels = {
  "scenic-drive": "风景驾车",
  "rain-walk": "雨景步行",
  "stationary-nature": "自然定点",
} as const;

export interface TripResearchDay {
  day: number;
  routes: ResolvedRoute[];
  totalMinutes: number;
  provinces: string[];
  cities: string[];
}

export function findUnplannedResearchRoutes(
  routes: ResolvedRoute[],
  researchRouteIds: string[],
  plans: LocalShootPlan[],
) {
  const routeById = new Map(routes.map((item) => [item.route.id, item]));
  const plannedRouteIds = new Set(plans.map((plan) => plan.routeId));
  return researchRouteIds
    .filter((routeId) => !plannedRouteIds.has(routeId))
    .map((routeId) => routeById.get(routeId))
    .filter((item): item is ResolvedRoute => Boolean(item));
}

export function buildTripDayPlan(
  routes: ResolvedRoute[],
  dailyBudgetMinutes = 480,
): TripResearchDay[] {
  const days: TripResearchDay[] = [];
  for (const route of routes) {
    let day = days.at(-1);
    if (
      !day ||
      (day.routes.length > 0 &&
        day.totalMinutes + route.route.estimatedDurationMinutes >
          dailyBudgetMinutes)
    ) {
      day = {
        day: days.length + 1,
        routes: [],
        totalMinutes: 0,
        provinces: [],
        cities: [],
      };
      days.push(day);
    }
    day.routes.push(route);
    day.totalMinutes += route.route.estimatedDurationMinutes;
    if (!day.provinces.includes(route.route.province))
      day.provinces.push(route.route.province);
    for (const city of route.route.cities) {
      if (!day.cities.includes(city)) day.cities.push(city);
    }
  }
  return days;
}

export function dateForTripDay(startDate: string, day: number) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || day < 1)
    throw new Error("行程日期或天数无效");
  const date = new Date(`${startDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) throw new Error("行程日期无效");
  date.setUTCDate(date.getUTCDate() + day - 1);
  return date.toISOString().slice(0, 10);
}

export function buildTripResearchSummary(routes: ResolvedRoute[]) {
  const provinces = [...new Set(routes.map((item) => item.route.province))];
  const cities = [...new Set(routes.flatMap((item) => item.route.cities))];
  const totalMinutes = routes.reduce(
    (total, item) => total + item.route.estimatedDurationMinutes,
    0,
  );
  const styleCounts = new Map<string, number>();
  for (const item of routes) {
    const style = item.route.captureStyle;
    styleCounts.set(style, (styleCounts.get(style) ?? 0) + 1);
  }
  const dominantStyle = [...styleCounts.entries()].sort(
    (a, b) => b[1] - a[1],
  )[0];
  const draftCount = routes.filter(
    (item) => item.route.verification.status === "draft",
  ).length;
  const warnings: string[] = [];
  if (
    dominantStyle &&
    routes.length >= 3 &&
    dominantStyle[1] / routes.length >= 0.75
  ) {
    warnings.push(
      `${styleLabels[dominantStyle[0] as keyof typeof styleLabels]}占比偏高，可补充其他拍摄方式`,
    );
  }
  if (draftCount > 0) warnings.push(`${draftCount} 条路线需要出发前重新核验`);
  if (totalMinutes > 600)
    warnings.push("单日拍摄时间已超过 10 小时，建议拆分行程");
  const days = buildTripDayPlan(routes);
  return {
    routeCount: routes.length,
    provinces,
    cities,
    totalMinutes,
    estimatedDays: days.length,
    days,
    draftCount,
    warnings,
  };
}
