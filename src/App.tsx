import { Bell, CalendarDays, Compass, Map as MapIcon, Menu, Settings2 } from "lucide-react";
import catalogJson from "../data/catalog.json" with { type: "json" };
import { useCallback, useMemo, useState } from "react";
import type { Catalog, DrivingSummary, ResolvedRoute } from "./types/domain.js";
import { Brand } from "./components/common/Brand.js";
import { RouteList } from "./components/route/RouteList.js";
import { MapCanvas } from "./components/map/MapCanvas.js";
import { RouteDetail } from "./components/route/RouteDetail.js";
import { PlanView } from "./components/plan/PlanView.js";
import { usePlannerStore } from "./app/store.js";

const catalog = catalogJson as Catalog;
const locationsById = new Map(catalog.locations.map((location) => [location.id, location]));
const presetsById = new Map(catalog.cameraPresets.map((preset) => [preset.id, preset]));
const resolvedRoutes: ResolvedRoute[] = catalog.routes.map((route) => ({
  route,
  waypoints: route.waypointLocationIds.map((id) => {
    const location = locationsById.get(id);
    if (!location) throw new Error(`Unknown location ${id}`);
    return location;
  }),
  cameraPresets: route.cameraPresetIds.map((id) => {
    const preset = presetsById.get(id);
    if (!preset) throw new Error(`Unknown camera preset ${id}`);
    return preset;
  })
}));

export function App() {
  const state = usePlannerStore();
  const [drivingSummary, setDrivingSummary] = useState<DrivingSummary | null>(null);
  const handleDrivingSummary = useCallback((summary: DrivingSummary) => setDrivingSummary(summary), []);
  const routes = useMemo(() => resolvedRoutes.filter((item) => {
    const query = state.query.trim().toLowerCase();
    const matchesMode = state.mode === "all" || item.route.modes.includes(state.mode);
    const matchesDuration = item.route.estimatedDurationMinutes <= state.maxDurationMinutes;
    const matchesQuery = !query || item.route.name.toLowerCase().includes(query) || item.route.cities.some((city) => city.includes(query));
    return matchesMode && matchesDuration && matchesQuery;
  }), [state.mode, state.maxDurationMinutes, state.query]);

  const selected = resolvedRoutes.find((item) => item.route.id === state.selectedRouteId) ?? routes[0] ?? resolvedRoutes[0];
  if (!selected) return null;

  return (
    <div className="app-shell">
      <header className="topbar">
        <Brand />
        <nav aria-label="主导航">
          <button className={state.view === "explore" ? "active" : ""} onClick={() => state.setView("explore")}><Compass size={17} /> 探索路线</button>
          <button className={state.view === "plans" ? "active" : ""} onClick={() => state.setView("plans")}><CalendarDays size={17} /> 拍摄计划 <span className="nav-count">{state.plans.length}</span></button>
          <button><MapIcon size={17} /> 地点库</button>
        </nav>
        <div className="topbar-actions">
          <button className="icon-button" aria-label="通知"><Bell size={18} /><i /></button>
          <button className="icon-button" aria-label="设置"><Settings2 size={18} /></button>
          <span className="avatar">RL</span>
          <button className="icon-button mobile-menu" aria-label="菜单"><Menu size={20} /></button>
        </div>
      </header>

      {state.view === "explore" ? (
        <main className={`workspace ${state.detailOpen ? "has-detail" : ""}`}>
          <RouteList routes={routes} />
          <MapCanvas selected={selected} onDrivingSummary={handleDrivingSummary} />
          {state.detailOpen && <RouteDetail selected={selected} drivingSummary={drivingSummary?.routeId === selected.route.id ? drivingSummary : null} />}
        </main>
      ) : <PlanView routes={resolvedRoutes} />}

      <nav className="mobile-nav" aria-label="移动端导航">
        <button className={state.view === "explore" ? "active" : ""} onClick={() => state.setView("explore")}><Compass size={19} /><span>探索</span></button>
        <button className={state.view === "plans" ? "active" : ""} onClick={() => state.setView("plans")}><CalendarDays size={19} /><span>计划</span></button>
        <button><MapIcon size={19} /><span>地点</span></button>
      </nav>
    </div>
  );
}
