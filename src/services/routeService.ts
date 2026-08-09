import type { Catalog, PlanRequest, ResolvedRoute, Route } from "../types/domain.js";

function scoreRoute(route: Route): number {
  return route.scores.visual + route.scores.safety + route.scores.youtubePotential;
}

export function recommendRoutes(catalog: Catalog, request: PlanRequest): ResolvedRoute[] {
  const locationsById = new Map(catalog.locations.map((location) => [location.id, location]));
  const presetsById = new Map(catalog.cameraPresets.map((preset) => [preset.id, preset]));

  return catalog.routes
    .filter((route) => route.modes.includes(request.mode))
    .filter((route) => route.estimatedDurationMinutes <= request.maxDurationMinutes)
    .filter((route) => request.city === undefined || route.cities.includes(request.city))
    .sort((left, right) => scoreRoute(right) - scoreRoute(left))
    .map((route) => ({
      route,
      waypoints: route.waypointLocationIds.map((id) => {
        const location = locationsById.get(id);
        if (!location) throw new Error(`Validated catalog lost location reference: ${id}`);
        return location;
      }),
      cameraPresets: route.cameraPresetIds.map((id) => {
        const preset = presetsById.get(id);
        if (!preset) throw new Error(`Validated catalog lost camera preset reference: ${id}`);
        return preset;
      })
    }));
}
