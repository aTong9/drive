import type { Catalog, Location, ResolvedRoute, Route } from "../types/domain.js";
import type { CatalogSearchIndex, LocationSummary, ResolvedRouteSummary } from "./catalogSummary.js";
import { catalogIndex, loadLocationShard, loadRouteShard, loadSearchIndex, locationShardById, routeShardById } from "./catalogIndexData.js";

export { catalogIndex };
export type { CatalogIndex, LocationSummary, RouteSummary, ResolvedRouteSummary } from "./catalogSummary.js";
const locationSummaries = new Map(catalogIndex.locations.map((location) => [location.id, location]));
const routeSummaries = new Map(catalogIndex.routes.map((route) => [route.id, route]));
const presetsById = new Map(catalogIndex.cameraPresets.map((preset) => [preset.id, preset]));
export const resolvedRouteSummaries: ResolvedRouteSummary[] = catalogIndex.routes.map((route) => ({
  route,
  waypoints: route.waypointLocationIds.map((id) => {
    const location = locationSummaries.get(id);
    if (!location) throw new Error(`Unknown location ${id}`);
    return location;
  }),
  cameraPresets: route.cameraPresetIds.map((id) => {
    const preset = presetsById.get(id);
    if (!preset) throw new Error(`Unknown camera preset ${id}`);
    return preset;
  }),
}));
export const getRouteSummary = (id: string) => routeSummaries.get(id);
export function getDisplayedRouteId(selectedRouteId: string, detailOpen: boolean, filteredRoutes: ResolvedRouteSummary[]): string | undefined {
  return detailOpen ? getRouteSummary(selectedRouteId)?.id
    : (filteredRoutes.find((item) => item.route.id === selectedRouteId) ?? filteredRoutes[0])?.route.id;
}
const locationRequests = new Map<number, Promise<Location[]>>();
const routeRequests = new Map<number, Promise<Route[]>>();
function readShard<T>(id: number, requests: Map<number, Promise<T[]>>, load: (id: number) => Promise<T[]>) {
  let request = requests.get(id);
  if (!request) {
    request = load(id).catch((error: unknown) => { requests.delete(id); throw error; });
    requests.set(id, request);
  }
  return request;
}

export async function loadLocation(id: string): Promise<Location> {
  const shard = locationShardById[id];
  if (shard === undefined) throw new Error(`目录中没有地点：${id}`);
  const location = (await readShard(shard, locationRequests, loadLocationShard)).find((item) => item.id === id);
  if (!location) throw new Error(`地点数据不完整：${id}`);
  return location;
}
export async function loadRoute(id: string): Promise<ResolvedRoute> {
  const shard = routeShardById[id];
  if (shard === undefined) throw new Error(`目录中没有路线：${id}`);
  const route = (await readShard(shard, routeRequests, loadRouteShard)).find((item) => item.id === id);
  if (!route) throw new Error(`路线数据不完整：${id}`);
  return { route, waypoints: await Promise.all(route.waypointLocationIds.map(loadLocation)), cameraPresets: route.cameraPresetIds.map((presetId) => presetsById.get(presetId)!) };
}
export async function loadRegion(province: string) {
  const [locations, routes] = await Promise.all([
    Promise.all(catalogIndex.locations.filter((location) => location.province === province).map((location) => loadLocation(location.id))),
    Promise.all(catalogIndex.routes.filter((route) => route.province === province).map((route) => loadRoute(route.id))),
  ]);
  return { locations, resolvedRoutes: routes };
}
let fullRequest: Promise<{ catalog: Catalog; resolvedRoutes: ResolvedRoute[] }> | undefined;
export function loadFullCatalog() {
  fullRequest ??= Promise.all([
    Promise.all(catalogIndex.locations.map((location) => loadLocation(location.id))),
    Promise.all(catalogIndex.routes.map((route) => loadRoute(route.id))),
  ]).then(([locations, resolvedRoutes]) => ({
    catalog: { schemaVersion: catalogIndex.schemaVersion, cameraPresets: catalogIndex.cameraPresets, shootPlans: catalogIndex.shootPlans, locations, routes: resolvedRoutes.map((item) => item.route) },
    resolvedRoutes,
  })).catch((error: unknown) => { fullRequest = undefined; throw error; });
  return fullRequest;
}
let searchIndex: CatalogSearchIndex | undefined;
let searchRequest: Promise<void> | undefined;
export function loadCatalogSearch() {
  searchRequest ??= loadSearchIndex().then((index) => { searchIndex = index; }).catch((error: unknown) => { searchRequest = undefined; throw error; });
  return searchRequest;
}
function matchesSummary(kind: "locations" | "routes", id: string, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  if (!searchIndex) throw new Error("全文检索索引尚未加载");
  return searchIndex[kind][id]?.map((reference) => searchIndex!.strings[reference]).join(" ").includes(needle) ?? false;
}
export const locationSummaryMatchesQuery = (location: LocationSummary, query: string) => matchesSummary("locations", location.id, query);
export const routeSummaryMatchesQuery = ({ route }: ResolvedRouteSummary, query: string) => matchesSummary("routes", route.id, query);
