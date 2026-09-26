import type { FieldCheck, Location, Route, Source } from "../types/domain.js";

type LocationEvidenceInput = Pick<Location, "id"> & {
  verification: Pick<Location["verification"], "status"> & { sources: Array<Pick<Source, "supports">> };
};
type RouteEvidenceInput = { verification: Pick<Route["verification"], "status"> };

const supportLabels: Record<Source["supports"][number], string> = {
  existence: "地点存在", address: "地址", coordinate: "坐标", access: "通行", "shooting-value": "拍摄价值",
};

export function formatSourceEvidence(source: Source) {
  return `${source.supports.map((support) => supportLabels[support]).join(" · ")} · 查阅于 ${source.accessedAt}`;
}

export function getLocationEvidence(location: LocationEvidenceInput, hasFieldRecord = false) {
  const status = location.verification.status;
  if (hasFieldRecord || status === "field-checked")
    return { label: hasFieldRecord ? "实地记录" : "实地核验", priority: 4, isField: true, researchOnly: false };
  if (status === "draft") return { label: "待核验", priority: 0, isField: false, researchOnly: true };
  const supports = new Set(location.verification.sources.flatMap((source) => source.supports));
  if (supports.has("access")) return { label: "含通行来源", priority: 3, isField: false, researchOnly: false };
  if (supports.has("shooting-value")) return { label: "拍摄价值来源", priority: 2, isField: false, researchOnly: false };
  return { label: "地名坐标来源", priority: 1, isField: false, researchOnly: true };
}

export function getRouteEvidence(route: RouteEvidenceInput, waypoints: LocationEvidenceInput[], checks: FieldCheck[] = []) {
  if (route.verification.status === "draft") return { label: "待核验", priority: 0, isField: false, researchOnly: true };
  if (route.verification.status === "field-checked") return { label: "实地核验", priority: 4, isField: true, researchOnly: false };
  const evidence = waypoints.map((point) => getLocationEvidence(point, checks.some((check) => check.locationId === point.id)));
  if (evidence.length && evidence.every((item) => item.isField))
    return { label: "点位实地记录", priority: 4, isField: true, researchOnly: false };
  if (evidence.length && evidence.every((item) => item.priority >= 3))
    return { label: "点位含通行来源", priority: 3, isField: false, researchOnly: false };
  if (evidence.length && evidence.every((item) => item.researchOnly))
    return { label: "地名坐标来源", priority: 1, isField: false, researchOnly: true };
  return { label: "来源核验", priority: 2, isField: false, researchOnly: false };
}

export function routeDurationLabel(route: RouteEvidenceInput & Pick<Route, "estimatedDurationMinutes">, waypoints: LocationEvidenceInput[]) {
  return `${getRouteEvidence(route, waypoints).researchOnly ? "研究估算" : "拍摄估算"} ${route.estimatedDurationMinutes} 分钟`;
}

export function compareLocationEvidence(left: LocationEvidenceInput, right: LocationEvidenceInput) {
  return getLocationEvidence(right).priority - getLocationEvidence(left).priority;
}

export function compareRouteEvidence(left: { route: RouteEvidenceInput; waypoints: LocationEvidenceInput[] }, right: { route: RouteEvidenceInput; waypoints: LocationEvidenceInput[] }) {
  return getRouteEvidence(right.route, right.waypoints).priority - getRouteEvidence(left.route, left.waypoints).priority;
}
