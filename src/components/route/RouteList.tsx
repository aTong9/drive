import { Search, SlidersHorizontal } from "lucide-react";
import type { ResolvedRoute, RouteMode } from "../../types/domain.js";
import { usePlannerStore } from "../../app/store.js";
import { RouteCard } from "./RouteCard.js";

const modes: Array<{ value: RouteMode | "all"; label: string }> = [
  { value: "all", label: "全部" },
  { value: "day", label: "日间" },
  { value: "night", label: "夜景" },
  { value: "sunset", label: "日落" },
  { value: "asmr", label: "自然声" }
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

      <div className="mode-tabs" role="tablist" aria-label="拍摄模式">
        {modes.map((mode) => (
          <button key={mode.value} role="tab" aria-selected={state.mode === mode.value} onClick={() => state.setMode(mode.value)}>
            {mode.label}
          </button>
        ))}
      </div>

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
            <span>试试切换拍摄模式或缩短搜索词</span>
          </div>
        )}
      </div>
    </aside>
  );
}
