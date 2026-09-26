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
  Leaf,
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
  useRef,
  useState,
} from "react";
import type { AppView } from "./app/store.js";
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
  type LocationDetectionStatus,
} from "./services/currentCityService.js";
import { parseSharedRouteId } from "./services/routeShareService.js";
import { routeMatchesQuery } from "./services/catalogSearchService.js";
import {
  administrativeGroups,
} from "./services/regionService.js";
import {
  applyViewMetadata,
  moreWorkspaceViews,
  searchWorkspaceViews,
  viewPresentation,
} from "./app/viewPresentation.js";
import { useDialogFocus } from "./components/common/useDialogFocus.js";

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

const workspaceIcons = {
  locations: MapIcon, explore: Compass, plans: CalendarDays,
  cameras: Camera, creators: Videotape, projects: FolderKanban,
  post: Clapperboard, music: Music2, longform: Film,
  upload: UploadCloud, dashboard: BarChart3,
};

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
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );
  const [drivingSummary, setDrivingSummary] = useState<DrivingSummary | null>(
    null,
  );
  const { currentRegion, setCurrentRegion, destination, setDestination } = state;
  const [locationStatus, setLocationStatus] =
    useState<LocationDetectionStatus>("idle");
  const [locationMessage, setLocationMessage] = useState("");
  const [routeLinkMessage, setRouteLinkMessage] = useState("");
  const [sharedRouteUnavailable, setSharedRouteUnavailable] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const commandDialogRef = useRef<HTMLElement>(null);
  const handleDrivingSummary = useCallback(
    (summary: DrivingSummary) => setDrivingSummary(summary),
    [],
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#f4f0e5" : "#142421");
    try {
      localStorage.setItem("roadlens-theme", theme);
    } catch { /* Theme switching still works without persistence. */ }
  }, [theme]);
  useEffect(() => applyViewMetadata(state.view), [state.view]);
  useEffect(() => {
    if (window.innerWidth <= 760) usePlannerStore.getState().closeDetail();
  }, []);
  useEffect(() => {
    if (state.routeOpenVersion === 0) return;
    setSharedRouteUnavailable(false);
    setLocationStatus("idle");
    setLocationMessage("");
  }, [state.routeOpenVersion]);
  const locateCurrentCity = useCallback(async () => {
    const routeOpenVersion = usePlannerStore.getState().routeOpenVersion;
    setLocationStatus("locating");
    setLocationMessage("");
    try {
      const region = await detectCurrentRegion();
      if (usePlannerStore.getState().routeOpenVersion !== routeOpenVersion) return;
      setCurrentRegion(region);
      setLocationStatus("ready");
    } catch (error) {
      if (usePlannerStore.getState().routeOpenVersion !== routeOpenVersion) return;
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
    store.selectRoute(routeId);
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
        const matchesDestinationProvince =
          !destination.province || item.route.province === destination.province;
        const matchesDestinationCity =
          !destination.city || item.route.cities.includes(destination.city);
        const destinationGroup = administrativeGroups.find(
          (group) => group.id === destination.groupId,
        );
        const matchesDestinationGroup =
          destination.groupId === "all" ||
          destinationGroup?.provinces.includes(item.route.province as never);
        return (
          matchesMode &&
          matchesCaptureStyle &&
          matchesExecutionMode &&
          matchesDuration &&
          matchesQuery &&
          matchesCurrentCity &&
          matchesDestinationGroup &&
          matchesDestinationProvince &&
          matchesDestinationCity
        );
      }),
    [
      state.mode,
      state.captureStyle,
      state.driveOnly,
      state.maxDurationMinutes,
      state.query,
      currentRegion,
      destination,
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
  const commandGroups = searchWorkspaceViews(commandQuery);
  const openView = (view: AppView) => {
    state.setView(view);
    setCommandOpen(false);
    setCommandQuery("");
  };
  const openRouteFromAnywhere = useCallback((routeId: string) => {
    const target = resolvedRoutes.find((item) => item.route.id === routeId);
    if (!target) return;
    usePlannerStore.getState().selectRoute(routeId);
    setCommandOpen(false);
    setCommandQuery("");
  }, []);
  const closeCommand = useCallback(() => setCommandOpen(false), []);
  useDialogFocus(commandOpen, commandDialogRef, closeCommand);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <header className="topbar">
        <Brand />
        <nav aria-label="主导航">
          <button
            className={state.view === "locations" ? "active" : ""}
            onClick={() => state.setView("locations")}
            aria-current={state.view === "locations" ? "page" : undefined}
          >
            <MapIcon size={17} /> 地点库
          </button>
          <button
            className={state.view === "explore" ? "active" : ""}
            onClick={() => {
              state.closeDetail();
              state.setView("explore");
            }}
            aria-current={state.view === "explore" ? "page" : undefined}
          >
            <Compass size={17} /> 探索路线
          </button>
          <button
            className={state.view === "plans" ? "active" : ""}
            onClick={() => state.setView("plans")}
            aria-current={state.view === "plans" ? "page" : undefined}
          >
            <CalendarDays size={17} /> 拍摄计划{" "}
            <span className="nav-count">{state.plans.length}</span>
          </button>
          <button
            className={state.view === "post" ? "active" : ""}
            onClick={() => state.setView("post")}
            aria-current={state.view === "post" ? "page" : undefined}
          >
            <Clapperboard size={17} /> 后期流程
          </button>
          <button
            className={state.view === "upload" ? "active" : ""}
            onClick={() => state.setView("upload")}
            aria-current={state.view === "upload" ? "page" : undefined}
          >
            <UploadCloud size={17} /> 上传参数
          </button>
          <button
            className={moreWorkspaceViews.has(state.view) ? "active" : ""}
            onClick={() => setCommandOpen(true)}
            aria-expanded={commandOpen}
            aria-controls="command-palette"
            aria-current={
              moreWorkspaceViews.has(state.view) ? "page" : undefined
            }
          >
            <Menu size={17} /> 更多工作台
          </button>
        </nav>
        <div className="topbar-actions">
          <button
            className="command-trigger"
            onClick={() => setCommandOpen(true)}
            aria-label="打开快捷导航"
            aria-expanded={commandOpen}
            aria-controls="command-palette"
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
            aria-label={theme === "dark" ? "切换到晴日手账" : "切换到林间夜色"}
            title={theme === "dark" ? "晴日手账" : "林间夜色"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <span className="journal-stamp" title="在路上，收集日常的光"><Leaf size={15} aria-hidden="true" /> 在路上</span>
          <button
            className="icon-button mobile-menu"
            aria-label="打开更多功能"
            onClick={() => setCommandOpen(true)}
            aria-expanded={commandOpen}
            aria-controls="command-palette"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      <div id="main-content" tabIndex={-1} className="main-content-shell">
        <Suspense fallback={<ViewLoadingState />}>
          {state.view === "dashboard" ? (
            <DashboardView
              routes={resolvedRoutes}
              plans={state.plans}
              checks={state.fieldChecks}
              postTasks={state.postTasks}
              postProject={state.postProject}
              onOpenRoute={openRouteFromAnywhere}
              workflow={davinciWorkflow}
            />
          ) : state.view === "projects" ? (
            <ProjectWorkspaceView routes={resolvedRoutes} />
          ) : state.view === "explore" ? (
            <main
              className={`workspace ${state.detailOpen && selected ? "has-detail" : ""}`}
            >
              <RouteList
                routes={routes}
                allRoutes={resolvedRoutes}
                nearbyLocations={nearbyLocations}
                currentRegion={currentRegion}
                locationStatus={locationStatus}
                locationMessage={locationMessage}
                onLocate={locateCurrentCity}
                onClearLocation={() => {
                  setCurrentRegion(null);
                  setLocationStatus("idle");
                }}
                destination={destination}
                onDestinationChange={(nextDestination) => {
                  setDestination(nextDestination);
                  if (nextDestination.province) {
                    setCurrentRegion(null);
                    setLocationStatus("idle");
                  }
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
            <CameraView
              presets={catalog.cameraPresets}
              routes={resolvedRoutes}
            />
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
      </div>

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
            ref={commandDialogRef}
            className="command-palette"
            id="command-palette"
            role="dialog"
            aria-modal="true"
            aria-labelledby="command-palette-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <Search size={18} />
              <h2 id="command-palette-title" className="sr-only">
                快捷导航
              </h2>
              <input
                aria-label="搜索路线或工作台"
                value={commandQuery}
                onChange={(event) => setCommandQuery(event.target.value)}
                placeholder="搜索路线或打开工作台…"
              />
              <button onClick={closeCommand} aria-label="关闭">
                <X size={17} />
              </button>
            </header>
            {commandGroups.map((group) => (
              <div className="command-section" key={group.title}>
                <small>{group.title}</small>
                <div className="command-view-grid">
                  {group.views.map((view) => {
                    const Icon = workspaceIcons[view];
                    return (
                      <button key={view} onClick={() => openView(view)}
                        aria-current={state.view === view ? "page" : undefined}>
                        <Icon size={17} aria-hidden="true" />
                        <span>{viewPresentation[view].title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="command-section command-results">
              <small>路线结果 · {commandRoutes.length}</small>
              {commandRoutes.map((item) => (
                <button
                  key={item.route.id}
                  onClick={() => {
                    openRouteFromAnywhere(item.route.id);
                  }}
                >
                  <span>
                    <strong>{item.route.name}</strong>
                    <small>
                      {item.route.cities.join(" · ")} ·{" "}
                      预留 {item.route.estimatedDurationMinutes} 分钟
                    </small>
                  </span>
                  <ArrowRight size={15} />
                </button>
              ))}
              {!commandRoutes.length && (
                <div className="command-empty">
                  <p>没有匹配路线，试试城市名或景观关键词。</p>
                  <button onClick={() => setCommandQuery("")}>清除搜索</button>
                </div>
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
          className={state.view === "locations" ? "active" : ""}
          onClick={() => state.setView("locations")}
          aria-current={state.view === "locations" ? "page" : undefined}
        >
          <MapIcon size={19} />
          <span>地点</span>
        </button>
        <button
          className={state.view === "explore" ? "active" : ""}
          onClick={() => {
            state.closeDetail();
            state.setView("explore");
          }}
          aria-current={state.view === "explore" ? "page" : undefined}
        >
          <Compass size={19} />
          <span>探索</span>
        </button>
        <button
          className={state.view === "plans" ? "active" : ""}
          onClick={() => state.setView("plans")}
          aria-current={state.view === "plans" ? "page" : undefined}
        >
          <CalendarDays size={19} />
          <span>计划</span>
        </button>
        <button
          className={
            moreWorkspaceViews.has(state.view) ||
            state.view === "post" ||
            state.view === "upload"
              ? "active"
              : ""
          }
          onClick={() => setCommandOpen(true)}
          aria-expanded={commandOpen}
          aria-controls="command-palette"
          aria-current={
            moreWorkspaceViews.has(state.view) ||
            state.view === "post" ||
            state.view === "upload"
              ? "page"
              : undefined
          }
        >
          <Menu size={19} />
          <span>更多</span>
        </button>
      </nav>
    </div>
  );
}
