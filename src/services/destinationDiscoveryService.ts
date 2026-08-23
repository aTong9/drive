import type { CaptureStyle, ResolvedRoute, Route } from "../types/domain.js";

const routeTypeLabels: Record<Route["type"], string> = {
  coast: "滨海",
  "city-night": "城市夜景",
  mountain: "山路",
  forest: "森林",
  waterfall: "瀑布",
  river: "江河",
  lake: "湖泊",
};

const captureStyleLabels: Record<CaptureStyle, string> = {
  "scenic-drive": "风景驾车",
  "rain-walk": "雨景步行",
  "stationary-nature": "自然定点",
};

function rankRoute(item: ResolvedRoute) {
  const verified = item.route.verification.status === "field-checked" ? 2 : 0;
  return (
    item.route.scores.youtubePotential * 2 +
    item.route.scores.visual * 2 +
    item.route.scores.safety +
    verified
  );
}

function topCounts<T extends string>(values: T[], labels: Record<T, string>) {
  const counts = new Map<T, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([value, count]) => ({ value, label: labels[value], count }));
}

export function buildDestinationOverview(routes: ResolvedRoute[]) {
  const sourceChecked = routes.filter(
    (item) => item.route.verification.status !== "draft",
  ).length;
  const fieldChecked = routes.filter(
    (item) => item.route.verification.status === "field-checked",
  ).length;
  return {
    total: routes.length,
    sourceChecked,
    fieldChecked,
    routeTypes: topCounts(
      routes.map((item) => item.route.type),
      routeTypeLabels,
    ),
    captureStyles: topCounts(
      routes.map((item) => item.route.captureStyle),
      captureStyleLabels,
    ),
    priorityRoutes: [...routes].sort((a, b) => rankRoute(b) - rankRoute(a)).slice(0, 5),
  };
}
