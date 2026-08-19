import type {
  Location,
  ResolvedRoute,
  RouteResearchSource,
} from "../types/domain.js";

function sourceText(source: RouteResearchSource) {
  const platformAliases =
    source.platform === "xiaohongshu"
      ? "小红书 xhs red 来源小红书"
      : source.platform;
  return [
    platformAliases,
    source.title,
    source.author,
    source.url,
    ...source.evidence,
  ]
    .filter(Boolean)
    .join(" ");
}

export function locationMatchesQuery(location: Location, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const sources = location.verification.sources.map((source) =>
    [
      source.platform === "xiaohongshu"
        ? "小红书 xhs red 来源小红书"
        : source.platform,
      source.title,
      source.url,
      ...source.supports,
    ]
      .filter(Boolean)
      .join(" "),
  );
  return [
    location.name,
    location.province,
    location.city,
    location.access.note,
    location.shooting.advice,
    ...sources,
  ]
    .join(" ")
    .toLowerCase()
    .includes(needle);
}

export function routeMatchesQuery(
  { route, waypoints }: ResolvedRoute,
  query: string,
) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [
    route.name,
    route.province,
    ...route.cities,
    route.shootAdvice,
    route.verification.note,
    ...waypoints.map((point) => point.name),
    ...(route.verification.sources ?? []).map(sourceText),
  ]
    .join(" ")
    .toLowerCase()
    .includes(needle);
}

export function hasXiaohongshuSource(
  sources: RouteResearchSource[] | undefined,
) {
  return sources?.some((source) => source.platform === "xiaohongshu") ?? false;
}
