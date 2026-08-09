import catalogJson from "../../data/catalog.json" with { type: "json" };
import type { Catalog, ResolvedRoute } from "../types/domain.js";

export const catalog = catalogJson as Catalog;
const locationsById = new Map(catalog.locations.map((location) => [location.id, location]));
const presetsById = new Map(catalog.cameraPresets.map((preset) => [preset.id, preset]));
export const resolvedRoutes: ResolvedRoute[] = catalog.routes.map((route) => ({
  route,
  waypoints: route.waypointLocationIds.map((id) => { const location = locationsById.get(id); if (!location) throw new Error(`Unknown location ${id}`); return location; }),
  cameraPresets: route.cameraPresetIds.map((id) => { const preset = presetsById.get(id); if (!preset) throw new Error(`Unknown camera preset ${id}`); return preset; })
}));
