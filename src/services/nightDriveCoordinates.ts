import data from "../../data/night-drive-coordinates.json" with { type: "json" };
import type { NightDriveCity } from "./nightDriveAtlasService.js";

export interface NightDriveCoordinate {
  name: string;
  coordinate: { lat: number; lng: number; crs: "GCJ-02" };
  source: { title: string; url: string; accessedAt: string; supports: string[] };
}
export interface NightDriveMapPoint { id: string; name: string; index: number; mode: string; coordinate: { lat: number; lng: number } }
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
