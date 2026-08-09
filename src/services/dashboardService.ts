import type { FieldCheck, LocalPostTask, LocalShootPlan, ResolvedRoute } from "../types/domain.js";

export interface DashboardMetrics {
  routeCount: number; plannedCount: number; capturedCount: number; publishedCount: number; checkedLocationCount: number;
  checkCoverage: number; postProgress: number; recentPlans: Array<{ plan: LocalShootPlan; routeName: string }>;
}

export function buildDashboardMetrics(routes: ResolvedRoute[], plans: LocalShootPlan[], checks: FieldCheck[], postTasks: LocalPostTask[]): DashboardMetrics {
  const uniqueLocations = new Set(routes.flatMap((item) => item.waypoints.map((point) => point.id)));
  const checkedLocationCount = new Set(checks.filter((check) => uniqueLocations.has(check.locationId)).map((check) => check.locationId)).size;
  const routeNames = new Map(routes.map((item) => [item.route.id, item.route.name]));
  return {
    routeCount: routes.length,
    plannedCount: plans.filter((plan) => plan.status === "planned").length,
    capturedCount: plans.filter((plan) => plan.status === "captured" || plan.status === "published").length,
    publishedCount: plans.filter((plan) => plan.status === "published").length,
    checkedLocationCount,
    checkCoverage: uniqueLocations.size ? Math.round(checkedLocationCount / uniqueLocations.size * 100) : 0,
    postProgress: postTasks.length ? Math.round(postTasks.filter((task) => task.completed).length / postTasks.length * 100) : 0,
    recentPlans: [...plans].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4).map((plan) => ({ plan, routeName: routeNames.get(plan.routeId) ?? "未知路线" }))
  };
}
