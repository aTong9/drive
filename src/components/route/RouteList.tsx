import { CarFront, Footprints, LocateFixed, MapPin, RefreshCw, RotateCcw, Search, SlidersHorizontal, Trees, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CaptureStyle, Location, ResolvedRoute, RouteMode } from "../../types/domain.js";
import { usePlannerStore } from "../../app/store.js";
import { RouteCard } from "./RouteCard.js";
import type { CurrentRegion, LocationDetectionStatus } from "../../services/currentCityService.js";
import { paginateItems } from "../../services/localPagination.js";
import { LocalPaginationControls } from "../common/LocalPaginationControls.js";

const ROUTE_PAGE_SIZE = 12;

const modes: Array<{ value: RouteMode | "all"; label: string }> = [
  { value: "all", label: "全部" },
  { value: "day", label: "日间" },
  { value: "night", label: "夜景" },
  { value: "sunset", label: "日落" },
  { value: "asmr", label: "自然声" }
];

const captureStyles: Array<{ value: CaptureStyle; label: string; short: string; icon: typeof CarFront }> = [
  { value: "scenic-drive", label: "风景驾车", short: "长距离 · 日夜", icon: CarFront },
  { value: "rain-walk", label: "雨景步行", short: "步道 · 雨后", icon: Footprints },
  { value: "stationary-nature", label: "林间定点", short: "溪瀑 · 自然声", icon: Trees }
];

interface RouteListProps {
  routes: ResolvedRoute[];
  nearbyLocations: Location[];
  currentRegion: CurrentRegion | null;
  locationStatus: LocationDetectionStatus;
  locationMessage: string;
  onLocate: () => void;
  onClearLocation: () => void;
}

export function RouteList({ routes, nearbyLocations, currentRegion, locationStatus, locationMessage, onLocate, onClearLocation }: RouteListProps) {
  const state = usePlannerStore();
  const [sort, setSort] = useState<"recommended" | "shortest" | "visual">("recommended");
  const [page, setPage] = useState(1);
  const listTopRef = useRef<HTMLDivElement>(null);
  const displayRoutes = useMemo(() => [...routes].sort((a, b) => sort === "shortest" ? a.route.estimatedDurationMinutes - b.route.estimatedDurationMinutes : sort === "visual" ? b.route.scores.visual - a.route.scores.visual || b.route.scores.youtubePotential - a.route.scores.youtubePotential : b.route.scores.youtubePotential - a.route.scores.youtubePotential || b.route.scores.visual - a.route.scores.visual), [routes, sort]);
  const pagedRoutes = useMemo(() => paginateItems(displayRoutes, page, ROUTE_PAGE_SIZE), [displayRoutes, page]);
  const sortLabels = { recommended: "推荐排序", shortest: "行程最短", visual: "画面优先" } as const;
  const cycleSort = () => setSort((value) => value === "recommended" ? "shortest" : value === "shortest" ? "visual" : "recommended");
  const resetFilters = () => { state.setQuery(""); state.setMode("all"); state.setCaptureStyle("all"); state.setDriveOnly(false); state.setMaxDurationMinutes(960); onClearLocation(); };
  const changePage = (nextPage: number) => {
    setPage(nextPage);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => setPage(1), [state.query, state.mode, state.captureStyle, state.driveOnly, state.maxDurationMinutes, currentRegion?.province, currentRegion?.city, sort]);

  return (
    <aside className="route-sidebar">
      <div className="route-sidebar-head">
        <div>
          <p className="eyebrow">EXPLORE ROUTES</p>
          <h1>寻找下一段<br /><em>光影旅程</em></h1>
        </div>
        <button className="icon-button mobile-filter" aria-label="打开筛选"><SlidersHorizontal size={18} /></button>
      </div>

      <label className="search-field">
        <Search size={17} />
        <input value={state.query} onChange={(event) => state.setQuery(event.target.value)} placeholder="搜索城市或路线" />
        <kbd>⌘ K</kbd>
      </label>

      <div className={`current-city ${locationStatus}`}>
        <span className="current-city-icon"><LocateFixed size={15} /></span>
        <span><small>{locationStatus === "locating" ? "正在识别当前位置" : currentRegion ? "当前城市" : "位置筛选"}</small><strong>{currentRegion ? `${currentRegion.province} · ${currentRegion.city}` : locationMessage || "定位后优先显示身边内容"}</strong></span>
        {locationStatus === "locating" ? <i className="location-spinner" /> : currentRegion ? <button onClick={onClearLocation} aria-label="清除当前城市筛选"><X size={14} /></button> : <button onClick={onLocate} aria-label="重新定位"><RefreshCw size={14} /></button>}
      </div>

      {currentRegion && <div className="nearby-locations">
        <div><span>当前城市地点</span><button onClick={() => state.setView("locations")}>进入地点库</button></div>
        {nearbyLocations.length ? nearbyLocations.slice(0, 3).map((location) => <button key={location.id} onClick={() => state.setView("locations")}><MapPin size={13} /><span><strong>{location.name}</strong><small>{location.access.mode === "drive" ? "驾车可达" : "停车后步行"}</small></span></button>) : <p>该城市尚无来源核验地点</p>}
      </div>}

      <div className="capture-heading"><span>选择拍摄方式</span>{state.captureStyle !== "all" && <button onClick={() => state.setCaptureStyle("all")}>清除</button>}</div>
      <div className="capture-modes" aria-label="拍摄方式">
        {captureStyles.map((style) => {
          const Icon = style.icon;
          const active = state.captureStyle === style.value;
          return <button key={style.value} className={`capture-${style.value} ${active ? "active" : ""}`} aria-pressed={active} onClick={() => state.setCaptureStyle(active ? "all" : style.value)}><Icon size={18} /><strong>{style.label}</strong><small>{style.short}</small></button>;
        })}
      </div>

      <button className={`drive-only-filter ${state.driveOnly ? "active" : ""}`} aria-pressed={state.driveOnly} onClick={() => state.setDriveOnly(!state.driveOnly)}>
        <CarFront size={16} />
        <span><strong>只看纯驾车</strong><small>全程不停车 · 无需下车</small></span>
        <i>{state.driveOnly ? "已开启" : "开启"}</i>
      </button>

      <div className="light-heading">光线与氛围</div>
      <div className="mode-tabs" role="tablist" aria-label="光线与氛围">
        {modes.map((mode) => (
          <button key={mode.value} role="tab" aria-selected={state.mode === mode.value} onClick={() => state.setMode(mode.value)}>
            {mode.label}
          </button>
        ))}
      </div>

      <label className="duration-filter"><span>最长行程</span><select value={state.maxDurationMinutes} onChange={(event) => state.setMaxDurationMinutes(Number(event.target.value))}><option value={120}>2 小时</option><option value={180}>3 小时</option><option value={240}>4 小时</option><option value={360}>6 小时</option><option value={480}>8 小时</option><option value={600}>10 小时</option><option value={720}>2—3 日</option><option value={960}>多日路线</option></select></label>

      <div ref={listTopRef} className="list-heading">
        <span><strong>{routes.length}</strong> 条匹配路线</span>
        <button onClick={cycleSort} aria-label="切换路线排序">{sortLabels[sort]} <span>⌄</span></button>
      </div>

      <div className="route-card-list">
        {displayRoutes.length ? pagedRoutes.items.map((item) => (
          <RouteCard
            key={item.route.id}
            route={item.route}
            waypoints={item.waypoints}
            active={item.route.id === state.selectedRouteId}
            onSelect={() => state.selectRoute(item.route.id)}
          />
        )) : (
          <div className="empty-state">
            <Search size={22} />
            <strong>没有找到路线</strong>
            <span>{currentRegion ? `${currentRegion.city}暂无匹配路线，可清除位置筛选查看全国路线` : "试试清除拍摄方式、放宽最长行程或缩短搜索词"}</span>
            <button className="empty-reset" onClick={resetFilters}><RotateCcw size={13} /> 重置全部筛选</button>
          </div>
        )}
      </div>
      <LocalPaginationControls {...pagedRoutes} onPageChange={changePage} />
    </aside>
  );
}
