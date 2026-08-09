import { CarFront, Footprints, Search, SlidersHorizontal, Trees } from "lucide-react";
import type { CaptureStyle, ResolvedRoute, RouteMode } from "../../types/domain.js";
import { usePlannerStore } from "../../app/store.js";
import { RouteCard } from "./RouteCard.js";

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

export function RouteList({ routes }: { routes: ResolvedRoute[] }) {
  const state = usePlannerStore();

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

      <div className="capture-heading"><span>选择拍摄方式</span>{state.captureStyle !== "all" && <button onClick={() => state.setCaptureStyle("all")}>清除</button>}</div>
      <div className="capture-modes" aria-label="拍摄方式">
        {captureStyles.map((style) => {
          const Icon = style.icon;
          const active = state.captureStyle === style.value;
          return <button key={style.value} className={`capture-${style.value} ${active ? "active" : ""}`} aria-pressed={active} onClick={() => state.setCaptureStyle(active ? "all" : style.value)}><Icon size={18} /><strong>{style.label}</strong><small>{style.short}</small></button>;
        })}
      </div>

      <div className="light-heading">光线与氛围</div>
      <div className="mode-tabs" role="tablist" aria-label="光线与氛围">
        {modes.map((mode) => (
          <button key={mode.value} role="tab" aria-selected={state.mode === mode.value} onClick={() => state.setMode(mode.value)}>
            {mode.label}
          </button>
        ))}
      </div>

      <label className="duration-filter"><span>最长行程</span><select value={state.maxDurationMinutes} onChange={(event) => state.setMaxDurationMinutes(Number(event.target.value))}><option value={120}>2 小时</option><option value={180}>3 小时</option><option value={240}>4 小时</option><option value={360}>6 小时</option></select></label>

      <div className="list-heading">
        <span><strong>{routes.length}</strong> 条匹配路线</span>
        <button>推荐排序 <span>⌄</span></button>
      </div>

      <div className="route-card-list">
        {routes.length ? routes.map((item) => (
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
            <span>试试清除拍摄方式、放宽最长行程或缩短搜索词</span>
          </div>
        )}
      </div>
    </aside>
  );
}
