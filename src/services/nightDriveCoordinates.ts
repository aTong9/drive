import { createAmapNavigationUrl } from "./routeShareService.js";
import data from "../../data/night-drive-coordinates.json" with { type: "json" };
import type { NightDriveCity } from "./nightDriveAtlasService.js";

export interface NightDriveCoordinate {
  name: string;
  coordinate: { lat: number; lng: number; crs: "GCJ-02" };
  source: { title: string; url: string; accessedAt: string; supports: string[] };
}
export interface NightDriveMapPoint { id: string; name: string; index: number; mode: string; coordinate: NightDriveCoordinate["coordinate"] }
export interface NightDriveMapRoute { id: string; name: string; points: NightDriveMapPoint[]; missing: string[] }
export const nightDriveCoordinateExclusions: Record<string, { reason: string; sourceUrl: string }> = data.excluded;
export const nightDriveCoordinates: Record<string, NightDriveCoordinate> = data.points as Record<string, NightDriveCoordinate>;

export function resolveNightDriveRoute(city: NightDriveCity, route: NightDriveCity["routes"][number]): NightDriveMapRoute {
  const points: NightDriveMapPoint[] = [];
  const missing: string[] = [];
  for (const [index, stop] of route.stops.entries()) {
    const place = nightDriveCoordinates[stop.id];
    if (!place) { missing.push(`${index + 1}. ${stop.name}`); continue; }
    points.push({ id: stop.id, name: stop.name, index, mode: stop.mode, coordinate: place.coordinate });
  }
  return { id: route.id, name: `${city.name} · ${route.name}`, points, missing };
}

export function createNightDriveAppUrl(route: NightDriveMapRoute, platform: "ios" | "android"): string | null {
  const first = route.points[0];
  const last = route.points.at(-1);
  if (!first || !last || route.points.length < 2) return null;
  const params = new URLSearchParams({ sourceApplication: "RoadLens", slat: String(first.coordinate.lat), slon: String(first.coordinate.lng), sname: first.name, dlat: String(last.coordinate.lat), dlon: String(last.coordinate.lng), dname: last.name, dev: "0", t: "0", m: "0" });
  const via = route.points.slice(1, -1);
  if (via.length) {
    params.set("vian", String(via.length));
    params.set("vialons", via.map((point) => point.coordinate.lng).join("|"));
    params.set("vialats", via.map((point) => point.coordinate.lat).join("|"));
    params.set("vianames", via.map((point) => point.name.replaceAll("|", " ")).join("|"));
  }
  return `${platform === "ios" ? "iosamap://path" : "amapuri://route/plan/"}?${params.toString().replaceAll("+", "%20")}`;
}

export function createNightDriveWebSegments(route: NightDriveMapRoute) {
  const segments: Array<{ href: string; label: string }> = [];
  // 高德网页仅支持一个途经点；每段最多三站，相邻段共享端点。
  for (let i = 0; i < route.points.length - 1; i += 2) {
    const points = route.points.slice(i, i + 3);
    const href = createAmapNavigationUrl(points, true);
    if (href) segments.push({ href, label: points.map((point) => `${point.index + 1}. ${point.name}`).join(" → ") });
  }
  return segments;
}
