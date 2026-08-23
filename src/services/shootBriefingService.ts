import type {
  CameraPreset,
  LocalShootPlan,
  ResolvedRoute,
} from "../types/domain.js";

export interface ShootBriefRoute {
  planId: string;
  objective: string;
  route: ResolvedRoute;
}

export interface ShootBriefing {
  date: string;
  relativeLabel: string;
  cities: string[];
  requiresTravelReview: boolean;
  totalMinutes: number;
  routes: ShootBriefRoute[];
  presets: CameraPreset[];
}

function localDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function relativeDateLabel(date: string, today: string) {
  const offset = Math.round(
    (new Date(`${date}T00:00:00`).getTime() -
      new Date(`${today}T00:00:00`).getTime()) /
      86_400_000,
  );
  if (offset === 0) return "今天";
  if (offset === 1) return "明天";
  if (offset > 1) return `${offset} 天后`;
  return "日期已过，请重新安排";
}

export function buildNextShootBriefing(
  routes: ResolvedRoute[],
  plans: LocalShootPlan[],
  now = new Date(),
): ShootBriefing | null {
  const routeById = new Map(routes.map((item) => [item.route.id, item]));
  const planned = plans
    .filter((plan) => plan.status === "planned" && routeById.has(plan.routeId))
    .sort(
      (left, right) =>
        left.scheduledDate.localeCompare(right.scheduledDate) ||
        left.createdAt.localeCompare(right.createdAt),
    );
  if (!planned.length) return null;

  const today = localDateValue(now);
  const nextDate =
    planned.find((plan) => plan.scheduledDate >= today)?.scheduledDate ??
    planned[0]!.scheduledDate;
  const briefRoutes = planned
    .filter((plan) => plan.scheduledDate === nextDate)
    .map((plan) => ({
      planId: plan.id,
      objective: plan.objective,
      route: routeById.get(plan.routeId)!,
    }));
  const presets = [
    ...new Map(
      briefRoutes
        .flatMap((item) => item.route.cameraPresets)
        .map((preset) => [preset.id, preset]),
    ).values(),
  ];

  const cities = [
    ...new Set(briefRoutes.flatMap((item) => item.route.route.cities)),
  ];
  return {
    date: nextDate,
    relativeLabel: relativeDateLabel(nextDate, today),
    cities,
    requiresTravelReview: cities.length > 1,
    totalMinutes: briefRoutes.reduce(
      (total, item) => total + item.route.route.estimatedDurationMinutes,
      0,
    ),
    routes: briefRoutes,
    presets,
  };
}
