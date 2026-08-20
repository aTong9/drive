import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Camera,
  Clapperboard,
  Compass,
  Film,
  FolderKanban,
  Map as MapIcon,
  Menu,
  Moon,
  Music2,
  Search,
  Sun,
  UploadCloud,
  Videotape,
  X,
} from "lucide-react";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { DrivingSummary } from "./types/domain.js";
import { Brand } from "./components/common/Brand.js";
import { RouteList } from "./components/route/RouteList.js";
import { MapCanvas } from "./components/map/MapCanvas.js";
import { RouteDetail } from "./components/route/RouteDetail.js";
import { usePlannerStore } from "./app/store.js";
import { catalog, resolvedRoutes } from "./services/catalogService.js";
import { davinciWorkflow } from "./services/workflowService.js";
import {
  detectCurrentRegion,
  type CurrentRegion,
  type LocationDetectionStatus,
} from "./services/currentCityService.js";
import { parseSharedRouteId } from "./services/routeShareService.js";
import { routeMatchesQuery } from "./services/catalogSearchService.js";

const DashboardView = lazy(() =>
  import("./components/dashboard/DashboardView.js").then((module) => ({
    default: module.DashboardView,
  })),
);
const ProjectWorkspaceView = lazy(() =>
  import("./components/project/ProjectWorkspaceView.js").then((module) => ({
    default: module.ProjectWorkspaceView,
  })),
);
const PlanView = lazy(() =>
  import("./components/plan/PlanView.js").then((module) => ({
    default: module.PlanView,
  })),
);
const LocationView = lazy(() =>
  import("./components/location/LocationView.js").then((module) => ({
    default: module.LocationView,
  })),
);
const CameraView = lazy(() =>
  import("./components/camera/CameraView.js").then((module) => ({
    default: module.CameraView,
  })),
);
const PostWorkflowView = lazy(() =>
  import("./components/post/PostWorkflowView.js").then((module) => ({
    default: module.PostWorkflowView,
  })),
);
const CreatorView = lazy(() =>
  import("./components/creator/CreatorView.js").then((module) => ({
    default: module.CreatorView,
  })),
);
const MusicLibraryView = lazy(() =>
  import("./components/music/MusicLibraryView.js").then((module) => ({
    default: module.MusicLibraryView,
  })),
);
const YoutubeUploadView = lazy(() =>
  import("./components/upload/YoutubeUploadView.js").then((module) => ({
    default: module.YoutubeUploadView,
  })),
);
const LongformGuideView = lazy(() =>
  import("./components/longform/LongformGuideView.js").then((module) => ({
    default: module.LongformGuideView,
  })),
);

function ViewLoadingState() {
  return (
    <main className="view-loading" role="status" aria-live="polite">
      <span className="view-loading-dot" />
      正在加载工作区…
    </main>
  );
}

export function App() {
  const state = usePlannerStore();
  const [theme, setTheme] = useState<"dark" | "light">(() =>
    localStorage.getItem("roadlens-theme") === "light" ? "light" : "dark",
  );
  const [drivingSummary, setDrivingSummary] = useState<DrivingSummary | null>(
    null,
  );
  const [currentRegion, setCurrentRegion] = useState<CurrentRegion | null>(
    null,
  );
  const [locationStatus, setLocationStatus] =
    useState<LocationDetectionStatus>("idle");
  const [locationMessage, setLocationMessage] = useState("");
  const [routeLinkMessage, setRouteLinkMessage] = useState("");
  const [sharedRouteUnavailable, setSharedRouteUnavailable] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const handleDrivingSummary = useCallback(
    (summary: DrivingSummary) => setDrivingSummary(summary),
    [],
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("roadlens-theme", theme);
  }, [theme]);
  useEffect(() => {
    if (window.innerWidth <= 760) usePlannerStore.getState().closeDetail();
  }, []);
  const locateCurrentCity = useCallback(async () => {
    setLocationStatus("locating");
    setLocationMessage("");
    try {
      const region = await detectCurrentRegion();
      setCurrentRegion(region);
      setLocationStatus("ready");
    } catch (error) {
      const denied =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 1;
      setLocationStatus(denied ? "denied" : "error");
      setLocationMessage(
        denied
          ? "定位权限未开启，可手动重试"
          : error instanceof Error
            ? error.message
            : "定位失败",
      );
    }
  }, []);
  useEffect(() => {
    const hasRouteParameter = new URL(window.location.href).searchParams.has(
      "route",
    );
    const routeId = parseSharedRouteId(window.location.href);
    if (!routeId) {
      setSharedRouteUnavailable(false);
      if (hasRouteParameter)
        setRouteLinkMessage("分享链接格式无效，可继续浏览其他路线");
      void locateCurrentCity();
      return;
    }
    const target = resolvedRoutes.find((item) => item.route.id === routeId);
    if (!target) {
      setSharedRouteUnavailable(true);
      usePlannerStore.getState().closeDetail();
      setRouteLinkMessage(
        "分享路线尚未包含在当前版本，请刷新或等待最新版本发布",
      );
      void locateCurrentCity();
      return;
    }
    setSharedRouteUnavailable(false);
    const store = usePlannerStore.getState();
    store.setMode("all");
    store.setCaptureStyle("all");
    store.setDriveOnly(false);
    store.setMaxDurationMinutes(
      Math.max(store.maxDurationMinutes, target.route.estimatedDurationMinutes),
    );
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
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
      if (event.key === "Escape") setCommandOpen(false);
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);
  const routes = useMemo(
    () =>
      resolvedRoutes.filter((item) => {
        const query = state.query.trim().toLowerCase();
        const matchesMode =
          state.mode === "all" || item.route.modes.includes(state.mode);
        const matchesCaptureStyle =
          state.captureStyle === "all" ||
          item.route.captureStyle === state.captureStyle;
        const matchesExecutionMode =
          !state.driveOnly || item.route.executionMode === "drive-only";
        const matchesDuration =
          item.route.estimatedDurationMinutes <= state.maxDurationMinutes;
        const matchesQuery = routeMatchesQuery(item, query);
        const matchesCurrentCity =
          !currentRegion || item.route.cities.includes(currentRegion.city);
        return (
          matchesMode &&
          matchesCaptureStyle &&
          matchesExecutionMode &&
          matchesDuration &&
          matchesQuery &&
          matchesCurrentCity
        );
      }),
    [
      state.mode,
      state.captureStyle,
      state.driveOnly,
      state.maxDurationMinutes,
      state.query,
      currentRegion,
    ],
  );

  const nearbyLocations = useMemo(
    () =>
      currentRegion
        ? catalog.locations.filter(
            (location) =>
              location.province === currentRegion.province &&
              location.city === currentRegion.city,
          )
        : [],
    [currentRegion],
  );

  const selected = sharedRouteUnavailable
    ? undefined
    : (routes.find((item) => item.route.id === state.selectedRouteId) ??
      routes[0]);
  const commandRoutes = useMemo(() => {
    const query = commandQuery.trim().toLowerCase();
    return resolvedRoutes
      .filter((item) => routeMatchesQuery(item, query))
      .slice(0, 7);
  }, [commandQuery]);
  const openView = (
    view:
      | "dashboard"
      | "projects"
      | "explore"
      | "plans"
      | "locations"
      | "cameras"
      | "post"
      | "longform"
      | "creators"
      | "music"
      | "upload",
  ) => {
    state.setView(view);
    setCommandOpen(false);
    setCommandQuery("");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Brand />
        <nav aria-label="主导航">
          <button
            className={state.view === "dashboard" ? "active" : ""}
            onClick={() => state.setView("dashboard")}
          >
            <BarChart3 size={17} /> 资产
          </button>
          <button
            className={state.view === "projects" ? "active" : ""}
            onClick={() => state.setView("projects")}
          >
            <FolderKanban size={17} /> 视频项目{" "}
            <span className="nav-count">{state.videoProjects.length}</span>
          </button>
          <button
            className={state.view === "explore" ? "active" : ""}
            onClick={() => {
              state.closeDetail();
              state.setView("explore");
            }}
          >
            <Compass size={17} /> 探索路线
          </button>
          <button
            className={state.view === "plans" ? "active" : ""}
            onClick={() => state.setView("plans")}
          >
            <CalendarDays size={17} /> 拍摄计划{" "}
            <span className="nav-count">{state.plans.length}</span>
          </button>
          <button
            className={state.view === "locations" ? "active" : ""}
            onClick={() => state.setView("locations")}
          >
            <MapIcon size={17} /> 地点库
          </button>
          <button
            className={state.view === "post" ? "active" : ""}
            onClick={() => state.setView("post")}
          >
            <Clapperboard size={17} /> 后期流程
          </button>
          <button
            className={state.view === "upload" ? "active" : ""}
            onClick={() => state.setView("upload")}
          >
            <UploadCloud size={17} /> 上传参数
          </button>
          <button
            className={
              ["cameras", "longform", "creators", "music"].includes(state.view)
                ? "active"
                : ""
            }
            onClick={() => setCommandOpen(true)}
          >
            <Menu size={17} /> 更多工作台
          </button>
        </nav>
        <div className="topbar-actions">
          <button
            className="command-trigger"
            onClick={() => setCommandOpen(true)}
            aria-label="打开快捷导航"
          >
            <Search size={16} />
            <span>搜索与跳转</span>
            <kbd>⌘ K</kbd>
          </button>
          <button
            className="icon-button theme-toggle"
            onClick={() =>
              setTheme((value) => (value === "dark" ? "light" : "dark"))
            }
            aria-label={theme === "dark" ? "切换到白天模式" : "切换到暗黑模式"}
            title={theme === "dark" ? "白天模式" : "暗黑模式"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <span className="avatar">RL</span>
          <button
            className="icon-button mobile-menu"
            aria-label="打开更多功能"
            onClick={() => setCommandOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      <Suspense fallback={<ViewLoadingState />}>
        {state.view === "dashboard" ? (
          <DashboardView
            routes={resolvedRoutes}
            plans={state.plans}
            checks={state.fieldChecks}
            postTasks={state.postTasks}
            postProject={state.postProject}
          />
        ) : state.view === "projects" ? (
          <ProjectWorkspaceView routes={resolvedRoutes} />
        ) : state.view === "explore" ? (
          <main
            className={`workspace ${state.detailOpen && selected ? "has-detail" : ""}`}
          >
            <RouteList
              routes={routes}
              nearbyLocations={nearbyLocations}
              currentRegion={currentRegion}
              locationStatus={locationStatus}
              locationMessage={locationMessage}
              onLocate={locateCurrentCity}
              onClearLocation={() => {
                setCurrentRegion(null);
                setLocationStatus("idle");
              }}
            />
            <MapCanvas
              selected={selected}
              nearbyLocations={nearbyLocations}
              onDrivingSummary={handleDrivingSummary}
            />
            {state.detailOpen && selected && (
              <RouteDetail
                selected={selected}
                drivingSummary={
                  drivingSummary?.routeId === selected.route.id
                    ? drivingSummary
                    : null
                }
              />
            )}
          </main>
        ) : state.view === "plans" ? (
          <PlanView routes={resolvedRoutes} />
        ) : state.view === "locations" ? (
          <LocationView
            locations={catalog.locations}
            routes={resolvedRoutes}
            catalogSchemaVersion={catalog.schemaVersion}
          />
        ) : state.view === "cameras" ? (
          <CameraView presets={catalog.cameraPresets} routes={resolvedRoutes} />
        ) : state.view === "post" ? (
          <PostWorkflowView
            workflow={davinciWorkflow}
            routes={resolvedRoutes}
          />
        ) : state.view === "longform" ? (
          <LongformGuideView />
        ) : state.view === "creators" ? (
          <CreatorView />
        ) : state.view === "upload" ? (
          <YoutubeUploadView routes={resolvedRoutes} />
        ) : (
          <MusicLibraryView />
        )}
      </Suspense>

      {routeLinkMessage && (
        <div className="route-link-notice" role="status" aria-live="polite">
          {routeLinkMessage}
        </div>
      )}

      {commandOpen && (
        <div
          className="command-backdrop"
          onMouseDown={() => setCommandOpen(false)}
        >
          <section
            className="command-palette"
            role="dialog"
            aria-modal="true"
            aria-label="快捷导航"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <Search size={18} />
              <input
                autoFocus
                value={commandQuery}
                onChange={(event) => setCommandQuery(event.target.value)}
                placeholder="搜索路线或打开工作台…"
              />
              <button onClick={() => setCommandOpen(false)} aria-label="关闭">
                <X size={17} />
              </button>
            </header>
            <div className="command-section">
              <small>工作台</small>
              <div className="command-view-grid">
                <button onClick={() => openView("cameras")}>
                  <Camera size={16} />
                  <span>相机参数库</span>
                </button>
                <button onClick={() => openView("longform")}>
                  <Film size={16} />
                  <span>长片制作指南</span>
                </button>
                <button onClick={() => openView("projects")}>
                  <FolderKanban size={16} />
                  <span>视频项目工作台</span>
                </button>
                <button onClick={() => openView("creators")}>
                  <Videotape size={16} />
                  <span>创作者研究</span>
                </button>
                <button onClick={() => openView("music")}>
                  <Music2 size={16} />
                  <span>音乐素材库</span>
                </button>
                <button onClick={() => openView("post")}>
                  <Clapperboard size={16} />
                  <span>达芬奇流程</span>
                </button>
                <button onClick={() => openView("upload")}>
                  <UploadCloud size={16} />
                  <span>YouTube 上传参数</span>
                </button>
              </div>
            </div>
            <div className="command-section command-results">
              <small>路线结果 · {commandRoutes.length}</small>
              {commandRoutes.map((item) => (
                <button
                  key={item.route.id}
                  onClick={() => {
                    state.selectRoute(item.route.id);
                    setCommandOpen(false);
                    setCommandQuery("");
                  }}
                >
                  <span>
                    <strong>{item.route.name}</strong>
                    <small>
                      {item.route.cities.join(" · ")} ·{" "}
                      {Math.round(item.route.estimatedDurationMinutes / 60)}{" "}
                      小时
                    </small>
                  </span>
                  <ArrowRight size={15} />
                </button>
              ))}
              {!commandRoutes.length && (
                <p>没有匹配路线，试试城市名或景观关键词。</p>
              )}
            </div>
            <footer>
              <span>
                <kbd>⌘ K</kbd> 打开
              </span>
              <span>
                <kbd>Esc</kbd> 关闭
              </span>
              <span>共 {resolvedRoutes.length} 条路线</span>
            </footer>
          </section>
        </div>
      )}

      <nav className="mobile-nav" aria-label="移动端导航">
        <button
          className={state.view === "dashboard" ? "active" : ""}
          onClick={() => state.setView("dashboard")}
        >
          <BarChart3 size={19} />
          <span>资产</span>
        </button>
        <button
          className={state.view === "projects" ? "active" : ""}
          onClick={() => state.setView("projects")}
        >
          <FolderKanban size={19} />
          <span>项目</span>
        </button>
        <button
          className={state.view === "explore" ? "active" : ""}
          onClick={() => {
            state.closeDetail();
            state.setView("explore");
          }}
        >
          <Compass size={19} />
          <span>探索</span>
        </button>
        <button
          className={state.view === "plans" ? "active" : ""}
          onClick={() => state.setView("plans")}
        >
          <CalendarDays size={19} />
          <span>计划</span>
        </button>
        <button
          className={state.view === "locations" ? "active" : ""}
          onClick={() => state.setView("locations")}
        >
          <MapIcon size={19} />
          <span>地点</span>
        </button>
        <button
          className={
            [
              "cameras",
              "post",
              "longform",
              "creators",
              "music",
              "upload",
            ].includes(state.view)
              ? "active"
              : ""
          }
          onClick={() => setCommandOpen(true)}
        >
          <Menu size={19} />
          <span>更多</span>
        </button>
      </nav>
    </div>
  );
}
