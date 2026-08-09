import { BarChart3, Bell, CalendarDays, Camera, Clapperboard, Compass, Map as MapIcon, Menu, Settings2, Videotape } from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import type { DrivingSummary } from "./types/domain.js";
import { Brand } from "./components/common/Brand.js";
import { RouteList } from "./components/route/RouteList.js";
import { MapCanvas } from "./components/map/MapCanvas.js";
import { RouteDetail } from "./components/route/RouteDetail.js";
import { usePlannerStore } from "./app/store.js";
import { catalog, resolvedRoutes } from "./services/catalogService.js";
import { davinciWorkflow } from "./services/workflowService.js";
import { detectCurrentRegion, type CurrentRegion, type LocationDetectionStatus } from "./services/currentCityService.js";
import { parseSharedRouteId } from "./services/routeShareService.js";

const DashboardView = lazy(() => import("./components/dashboard/DashboardView.js").then((module) => ({ default: module.DashboardView })));
const PlanView = lazy(() => import("./components/plan/PlanView.js").then((module) => ({ default: module.PlanView })));
const LocationView = lazy(() => import("./components/location/LocationView.js").then((module) => ({ default: module.LocationView })));
const CameraView = lazy(() => import("./components/camera/CameraView.js").then((module) => ({ default: module.CameraView })));
const PostWorkflowView = lazy(() => import("./components/post/PostWorkflowView.js").then((module) => ({ default: module.PostWorkflowView })));
const CreatorView = lazy(() => import("./components/creator/CreatorView.js").then((module) => ({ default: module.CreatorView })));

function ViewLoadingState() {
  return <main className="view-loading" role="status" aria-live="polite"><span className="view-loading-dot" />正在加载工作区…</main>;
}

export function App() {
  const state = usePlannerStore();
  const [drivingSummary, setDrivingSummary] = useState<DrivingSummary | null>(null);
  const [currentRegion, setCurrentRegion] = useState<CurrentRegion | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationDetectionStatus>("idle");
  const [locationMessage, setLocationMessage] = useState("");
  const [routeLinkMessage, setRouteLinkMessage] = useState("");
  const handleDrivingSummary = useCallback((summary: DrivingSummary) => setDrivingSummary(summary), []);
  const locateCurrentCity = useCallback(async () => {
    setLocationStatus("locating");
    setLocationMessage("");
    try {
      const region = await detectCurrentRegion();
      setCurrentRegion(region);
      setLocationStatus("ready");
    } catch (error) {
      const denied = typeof error === "object" && error !== null && "code" in error && error.code === 1;
      setLocationStatus(denied ? "denied" : "error");
      setLocationMessage(denied ? "定位权限未开启，可手动重试" : error instanceof Error ? error.message : "定位失败");
    }
  }, []);
  useEffect(() => {
    const hasRouteParameter = new URL(window.location.href).searchParams.has("route");
    const routeId = parseSharedRouteId(window.location.href);
    if (!routeId) {
      if (hasRouteParameter) setRouteLinkMessage("分享链接格式无效，可继续浏览其他路线");
      void locateCurrentCity();
      return;
    }
    const target = resolvedRoutes.find((item) => item.route.id === routeId);
    if (!target) {
      setRouteLinkMessage("分享链接中的路线已不存在，可继续浏览其他路线");
      void locateCurrentCity();
      return;
    }
    const store = usePlannerStore.getState();
    store.setMode("all");
    store.setCaptureStyle("all");
    store.setMaxDurationMinutes(Math.max(store.maxDurationMinutes, target.route.estimatedDurationMinutes));
    store.setQuery("");
    store.selectRoute(routeId);
    setCurrentRegion(null);
    setLocationStatus("idle");
    setRouteLinkMessage(`已打开分享路线：${target.route.name}`);
  }, [locateCurrentCity]);

  useEffect(() => {
    if (!routeLinkMessage) return;
    const timeout = window.setTimeout(() => setRouteLinkMessage(""), 5000);
    return () => window.clearTimeout(timeout);
  }, [routeLinkMessage]);
  const routes = useMemo(() => resolvedRoutes.filter((item) => {
    const query = state.query.trim().toLowerCase();
    const matchesMode = state.mode === "all" || item.route.modes.includes(state.mode);
    const matchesCaptureStyle = state.captureStyle === "all" || item.route.captureStyle === state.captureStyle;
    const matchesDuration = item.route.estimatedDurationMinutes <= state.maxDurationMinutes;
    const matchesQuery = !query || item.route.name.toLowerCase().includes(query) || item.route.cities.some((city) => city.includes(query));
    const matchesCurrentCity = !currentRegion || item.route.cities.includes(currentRegion.city);
    return matchesMode && matchesCaptureStyle && matchesDuration && matchesQuery && matchesCurrentCity;
  }), [state.mode, state.captureStyle, state.maxDurationMinutes, state.query, currentRegion]);

  const nearbyLocations = useMemo(() => currentRegion ? catalog.locations.filter((location) => location.province === currentRegion.province && location.city === currentRegion.city) : [], [currentRegion]);

  const selected = routes.find((item) => item.route.id === state.selectedRouteId) ?? routes[0];

  return (
    <div className="app-shell">
      <header className="topbar">
        <Brand />
        <nav aria-label="主导航">
          <button className={state.view === "dashboard" ? "active" : ""} onClick={() => state.setView("dashboard")}><BarChart3 size={17} /> 资产</button>
          <button className={state.view === "explore" ? "active" : ""} onClick={() => state.setView("explore")}><Compass size={17} /> 探索路线</button>
          <button className={state.view === "plans" ? "active" : ""} onClick={() => state.setView("plans")}><CalendarDays size={17} /> 拍摄计划 <span className="nav-count">{state.plans.length}</span></button>
          <button className={state.view === "locations" ? "active" : ""} onClick={() => state.setView("locations")}><MapIcon size={17} /> 地点库</button>
          <button className={state.view === "cameras" ? "active" : ""} onClick={() => state.setView("cameras")}><Camera size={17} /> 参数库</button>
          <button className={state.view === "post" ? "active" : ""} onClick={() => state.setView("post")}><Clapperboard size={17} /> 后期流程</button>
          <button className={state.view === "creators" ? "active" : ""} onClick={() => state.setView("creators")}><Videotape size={17} /> 创作者</button>
        </nav>
        <div className="topbar-actions">
          <button className="icon-button" aria-label="通知"><Bell size={18} /><i /></button>
          <button className="icon-button" aria-label="设置"><Settings2 size={18} /></button>
          <span className="avatar">RL</span>
          <button className="icon-button mobile-menu" aria-label="菜单"><Menu size={20} /></button>
        </div>
      </header>

      <Suspense fallback={<ViewLoadingState />}>
        {state.view === "dashboard" ? <DashboardView routes={resolvedRoutes} plans={state.plans} checks={state.fieldChecks} postTasks={state.postTasks} postProject={state.postProject} /> : state.view === "explore" ? (
          <main className={`workspace ${state.detailOpen && selected ? "has-detail" : ""}`}>
            <RouteList routes={routes} nearbyLocations={nearbyLocations} currentRegion={currentRegion} locationStatus={locationStatus} locationMessage={locationMessage} onLocate={locateCurrentCity} onClearLocation={() => { setCurrentRegion(null); setLocationStatus("idle"); }} />
            <MapCanvas selected={selected} nearbyLocations={nearbyLocations} onDrivingSummary={handleDrivingSummary} />
            {state.detailOpen && selected && <RouteDetail selected={selected} drivingSummary={drivingSummary?.routeId === selected.route.id ? drivingSummary : null} />}
          </main>
        ) : state.view === "plans" ? <PlanView routes={resolvedRoutes} /> : state.view === "locations" ? <LocationView locations={catalog.locations} routes={resolvedRoutes} catalogSchemaVersion={catalog.schemaVersion} /> : state.view === "cameras" ? <CameraView presets={catalog.cameraPresets} routes={resolvedRoutes} /> : state.view === "post" ? <PostWorkflowView workflow={davinciWorkflow} routes={resolvedRoutes} /> : <CreatorView />}
      </Suspense>

      {routeLinkMessage && <div className="route-link-notice" role="status" aria-live="polite">{routeLinkMessage}</div>}

      <nav className="mobile-nav" aria-label="移动端导航">
        <button className={state.view === "dashboard" ? "active" : ""} onClick={() => state.setView("dashboard")}><BarChart3 size={19} /><span>资产</span></button>
        <button className={state.view === "explore" ? "active" : ""} onClick={() => state.setView("explore")}><Compass size={19} /><span>探索</span></button>
        <button className={state.view === "plans" ? "active" : ""} onClick={() => state.setView("plans")}><CalendarDays size={19} /><span>计划</span></button>
        <button className={state.view === "locations" ? "active" : ""} onClick={() => state.setView("locations")}><MapIcon size={19} /><span>地点</span></button>
        <button className={state.view === "cameras" ? "active" : ""} onClick={() => state.setView("cameras")}><Camera size={19} /><span>参数</span></button>
        <button className={state.view === "post" ? "active" : ""} onClick={() => state.setView("post")}><Clapperboard size={19} /><span>后期</span></button>
        <button className={state.view === "creators" ? "active" : ""} onClick={() => state.setView("creators")}><Videotape size={19} /><span>创作者</span></button>
      </nav>
    </div>
  );
}
