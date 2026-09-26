import type { Catalog, Location, Route, Source } from "../types/domain.js";

export type LocationSummary = Pick<Location, "id" | "name" | "province" | "city" | "type" | "coordinate"> & {
  access: Pick<Location["access"], "mode">;
  verification: { status: Location["verification"]["status"]; sources: Array<Pick<Source, "supports" | "platform">> };
};
export type RouteSummary = Omit<Route, "shootAdvice" | "verification"> & {
  verification: Pick<Route["verification"], "status"> & { sources?: Array<Pick<NonNullable<Route["verification"]["sources"]>[number], "platform">> };
};
export interface ResolvedRouteSummary {
  route: RouteSummary;
  waypoints: LocationSummary[];
  cameraPresets: Catalog["cameraPresets"];
}
export interface CatalogIndex {
  schemaVersion: Catalog["schemaVersion"];
  cameraPresets: Catalog["cameraPresets"];
  shootPlans: Catalog["shootPlans"];
  locations: LocationSummary[];
  routes: RouteSummary[];
}
export interface CatalogSearchIndex {
  strings: string[];
  locations: Record<string, number[]>;
  routes: Record<string, number[]>;
}

export function buildCatalogIndex(catalog: Catalog): CatalogIndex {
  return {
    schemaVersion: catalog.schemaVersion,
    cameraPresets: catalog.cameraPresets,
    shootPlans: catalog.shootPlans,
    locations: catalog.locations.map(({ id, name, province, city, type, coordinate, access, verification }) => ({
      id, name, province, city, type, coordinate, access: { mode: access.mode },
      verification: { status: verification.status, sources: verification.sources.map(({ supports, platform }) => ({ supports, ...(platform ? { platform } : {}) })) },
    })),
    routes: catalog.routes.map(({ shootAdvice: _advice, verification, ...route }) => ({
      ...route, verification: { status: verification.status, ...(verification.sources ? { sources: verification.sources.map(({ platform }) => ({ platform })) } : {}) },
    })),
  };
}

export function splitCatalogByProvince<T extends { id: string; province: string }>(items: T[], maximumItems = 60) {
  const provinces = [...new Set(items.map((item) => item.province))];
  const shards: T[][] = [];
  const shardById: Record<string, number> = {};
  for (const province of provinces) {
    const matches = items.filter((item) => item.province === province);
    for (let offset = 0; offset < matches.length; offset += maximumItems) {
      const shard = matches.slice(offset, offset + maximumItems);
      for (const item of shard) shardById[item.id] = shards.length;
      shards.push(shard);
    }
  }
  return { shards, shardById };
}

export function buildCatalogSearchIndex(catalog: Catalog): CatalogSearchIndex {
  const strings: string[] = [];
  const stringIds = new Map<string, number>();
  const reference = (value: string) => {
    const normalized = value.toLowerCase();
    let index = stringIds.get(normalized);
    if (index === undefined) {
      index = strings.length;
      stringIds.set(normalized, index);
      strings.push(normalized);
    }
    return index;
  };
  const aliases = (platform: string | undefined) => platform === "xiaohongshu" ? "小红书 xhs red 来源小红书" : platform;
  const locations = Object.fromEntries(catalog.locations.map((location) => [location.id, [
    location.name, location.province, location.city, location.access.note, location.shooting.advice,
    ...location.verification.sources.map((source) => [aliases(source.platform), source.title, source.url, ...source.supports].filter(Boolean).join(" ")),
  ].map(reference)]));
  const locationNames = new Map(catalog.locations.map((location) => [location.id, location.name]));
  const routes = Object.fromEntries(catalog.routes.map((route) => [route.id, [
    route.name, route.province, ...route.cities, route.shootAdvice, route.verification.note,
    ...route.waypointLocationIds.map((id) => locationNames.get(id) ?? ""),
    ...(route.verification.sources ?? []).map((source) => [aliases(source.platform), source.title, source.author, source.url, ...source.evidence].filter(Boolean).join(" ")),
  ].map(reference)]));
  return { strings, locations, routes };
}
