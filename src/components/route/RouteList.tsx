import {
  ArrowDown,
  ArrowUp,
  BookmarkPlus,
  CalendarPlus,
  CarFront,
  Check,
  ChevronDown,
  Footprints,
  LocateFixed,
  MapPinned,
  MapPin,
  RefreshCw,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Trees,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  CaptureStyle,
  RouteMode,
} from "../../types/domain.js";
import type { LocationSummary, ResolvedRouteSummary } from "../../services/catalogSummary.js";
import { usePlannerStore } from "../../app/store.js";
import { RouteCard } from "./RouteCard.js";
import type {
  CurrentRegion,
  LocationDetectionStatus,
} from "../../services/currentCityService.js";
import { paginateItems } from "../../services/localPagination.js";
import { LocalPaginationControls } from "../common/LocalPaginationControls.js";
import { scrollElementIntoView } from "../../utils/scrollIntoView.js";
import {
  administrativeGroups,
  administrativeProvinces,
  divisionLabel,
  findProvince,
  provinceLabel,
  type AdministrativeGroupId,
} from "../../services/regionService.js";
import { buildDestinationOverview } from "../../services/destinationDiscoveryService.js";
import { compareRouteEvidence } from "../../services/catalogEvidenceService.js";
import { localDateInput } from "../../services/localDate.js";
import {
  buildTripResearchSummary,
  dateForTripDay,
} from "../../services/tripResearchService.js";

const ROUTE_PAGE_SIZE = 12;

function formatRouteMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${hours ? `${hours}小时` : ""}${remainder ? `${remainder}分` : ""}`;
}

const modes: Array<{ value: RouteMode | "all"; label: string }> = [
  { value: "all", label: "全部" },
  { value: "day", label: "日间" },
  { value: "night", label: "夜景" },
  { value: "sunset", label: "日落" },
  { value: "asmr", label: "自然声" },
];

const captureStyles: Array<{
  value: CaptureStyle;
  label: string;
  short: string;
  icon: typeof CarFront;
}> = [
  {
    value: "scenic-drive",
    label: "风景驾车",
    short: "长距离 · 日夜",
    icon: CarFront,
  },
  {
    value: "rain-walk",
    label: "雨景步行",
    short: "步道 · 雨后",
    icon: Footprints,
  },
  {
    value: "stationary-nature",
    label: "林间定点",
    short: "溪瀑 · 自然声",
    icon: Trees,
  },
];

interface RouteListProps {
  routes: ResolvedRouteSummary[];
  allRoutes: ResolvedRouteSummary[];
  nearbyLocations: LocationSummary[];
  currentRegion: CurrentRegion | null;
  locationStatus: LocationDetectionStatus;
  locationMessage: string;
  onLocate: () => void;
  onClearLocation: () => void;
  destination: {
    groupId: AdministrativeGroupId | "all";
    province: string;
    city: string;
  };
  onDestinationChange: (destination: {
    groupId: AdministrativeGroupId | "all";
    province: string;
    city: string;
  }) => void;
}

export function RouteList({
  routes,
  allRoutes,
  nearbyLocations,
  currentRegion,
  locationStatus,
  locationMessage,
  onLocate,
  onClearLocation,
  destination,
  onDestinationChange,
}: RouteListProps) {
  const state = usePlannerStore();
  const [sort, setSort] = useState<"recommended" | "shortest" | "visual">(
    "recommended",
  );
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(() => window.innerWidth > 760);
  const [destinationOpen, setDestinationOpen] = useState(true);
  const [researchOpen, setResearchOpen] = useState(false);
  const listTopRef = useRef<HTMLDivElement>(null);
  const routeCounts = useMemo(() => {
    const provinces = new Map<string, number>();
    const cities = new Map<string, number>();
    for (const item of allRoutes) {
      provinces.set(
        item.route.province,
        (provinces.get(item.route.province) ?? 0) + 1,
      );
      for (const city of item.route.cities) {
        const key = `${item.route.province}/${city}`;
        cities.set(key, (cities.get(key) ?? 0) + 1);
      }
    }
    return { provinces, cities };
  }, [allRoutes]);
  const visibleProvinces = useMemo(() => {
    if (destination.groupId === "all") return administrativeProvinces;
    const names = administrativeGroups.find(
      (group) => group.id === destination.groupId,
    )?.provinces;
    return administrativeProvinces.filter((province) =>
      names?.includes(province.name as never),
    );
  }, [destination.groupId]);
  const selectedProvince = findProvince(destination.province);
  const destinationOverview = useMemo(
    () => buildDestinationOverview(routes),
    [routes],
  );
  const researchRoutes = useMemo(() => {
    const routeById = new Map(
      allRoutes.map((item) => [item.route.id, item] as const),
    );
    return state.researchRouteIds
      .map((id) => routeById.get(id))
      .filter((item): item is ResolvedRouteSummary => Boolean(item));
  }, [allRoutes, state.researchRouteIds]);
  const researchSummary = useMemo(
    () => buildTripResearchSummary(researchRoutes),
    [researchRoutes],
  );
  const selectedForResearch = allRoutes.find(
    (item) => item.route.id === state.selectedRouteId,
  );
  const selectedInResearch = selectedForResearch
    ? state.researchRouteIds.includes(selectedForResearch.route.id)
    : false;
  const displayRoutes = useMemo(
    () =>
      [...routes].sort((a, b) =>
        sort === "shortest"
          ? a.route.estimatedDurationMinutes - b.route.estimatedDurationMinutes
          : sort === "visual"
            ? b.route.scores.visual - a.route.scores.visual ||
              b.route.scores.youtubePotential - a.route.scores.youtubePotential
            : compareRouteEvidence(a, b) || b.route.scores.youtubePotential -
                a.route.scores.youtubePotential ||
              b.route.scores.visual - a.route.scores.visual,
      ),
    [routes, sort],
  );
  const pagedRoutes = useMemo(
    () => paginateItems(displayRoutes, page, ROUTE_PAGE_SIZE),
    [displayRoutes, page],
  );
  const sortLabels = {
    recommended: "推荐排序",
    shortest: "行程最短",
    visual: "画面优先",
  } as const;
  const cycleSort = () =>
    setSort((value) =>
      value === "recommended"
        ? "shortest"
        : value === "shortest"
          ? "visual"
          : "recommended",
    );
  const resetFilters = () => {
    state.setQuery("");
    state.setMode("all");
    state.setCaptureStyle("all");
    state.setDriveOnly(false);
    state.setMaxDurationMinutes(960);
    onClearLocation();
    onDestinationChange({ groupId: "all", province: "", city: "" });
  };
  const changePage = (nextPage: number) => {
    setPage(nextPage);
    scrollElementIntoView(listTopRef.current);
  };

  useEffect(
    () => setPage(1),
    [
      state.query,
      state.mode,
      state.captureStyle,
      state.driveOnly,
      state.maxDurationMinutes,
      currentRegion?.province,
      currentRegion?.city,
      destination.province,
      destination.city,
      sort,
    ],
  );

  return (
    <aside className="route-sidebar">
      <div className="route-sidebar-head">
        <div>
          <p className="eyebrow">EXPLORE ROUTES</p>
          <h1>
            寻找下一段
            <br />
            <em>光影旅程</em>
          </h1>
        </div>
        <button
          className={`icon-button mobile-filter ${filtersOpen ? "active" : ""}`}
          aria-label={filtersOpen ? "收起筛选" : "打开筛选"}
          aria-expanded={filtersOpen}
          aria-controls="route-filter-panel"
          onClick={() => setFiltersOpen((value) => !value)}
        >
          <SlidersHorizontal size={18} />
          {(state.captureStyle !== "all" ||
            state.driveOnly ||
            state.mode !== "all" ||
            state.maxDurationMinutes !== 960) && <i />}
        </button>
      </div>

      <label className="search-field">
        <Search size={17} />
        <input
          value={state.query}
          onChange={(event) => state.setQuery(event.target.value)}
          placeholder="搜索城市、路线、来源或小红书帖子"
        />
        <kbd>⌘ K</kbd>
      </label>

      <section
        className={`destination-picker ${destinationOpen ? "is-open" : ""}`}
      >
        <button
          className="destination-picker-head"
          onClick={() => setDestinationOpen((open) => !open)}
          aria-expanded={destinationOpen}
          aria-controls="destination-picker-body"
        >
          <MapPinned size={16} />
          <span>
            <small>目的地探索</small>
            <strong>
              {destination.city
                ? `${provinceLabel(destination.province)} · ${divisionLabel(destination.province, destination.city)}`
                : destination.province
                  ? provinceLabel(destination.province)
                  : destination.groupId !== "all"
                    ? (administrativeGroups.find(
                        (group) => group.id === destination.groupId,
                      )?.label ?? "目的地区域")
                    : "先选地区，再看适合拍什么"}
            </strong>
          </span>
          <i>{destinationOpen ? "收起" : "选择"}</i>
        </button>
        {destinationOpen && (
          <div className="destination-picker-body" id="destination-picker-body">
            <div className="destination-groups" aria-label="全国地理分区">
              <button
                className={destination.groupId === "all" ? "active" : ""}
                onClick={() =>
                  onDestinationChange({
                    groupId: "all",
                    province: "",
                    city: "",
                  })
                }
              >
                全国
              </button>
              {administrativeGroups.map((group) => (
                <button
                  key={group.id}
                  className={destination.groupId === group.id ? "active" : ""}
                  onClick={() =>
                    onDestinationChange({
                      groupId: group.id,
                      province: "",
                      city: "",
                    })
                  }
                >
                  {group.label}
                </button>
              ))}
            </div>
            <div className="destination-selects">
              <label>
                <small>省级目的地</small>
                <select
                  value={destination.province}
                  onChange={(event) =>
                    onDestinationChange({
                      groupId: destination.groupId,
                      province: event.target.value,
                      city: "",
                    })
                  }
                >
                  <option value="">全国全部省份</option>
                  {visibleProvinces.map((province) => (
                    <option key={province.name} value={province.name}>
                      {province.label} ·{" "}
                      {routeCounts.provinces.get(province.name) ?? 0} 条
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <small>城市 / 地区</small>
                <select
                  value={destination.city}
                  disabled={!selectedProvince}
                  onChange={(event) =>
                    onDestinationChange({
                      groupId: destination.groupId,
                      province: destination.province,
                      city: event.target.value,
                    })
                  }
                >
                  <option value="">
                    {selectedProvince ? "全部城市与地区" : "请先选择省份"}
                  </option>
                  {selectedProvince?.divisions.map((division) => (
                    <option key={division.name} value={division.name}>
                      {division.label} ·{" "}
                      {routeCounts.cities.get(
                        `${selectedProvince.name}/${division.name}`,
                      ) ?? 0}{" "}
                      条
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {(destination.groupId !== "all" ||
              destination.province ||
              destination.city) && (
              <button
                className="destination-clear"
                onClick={() =>
                  onDestinationChange({
                    groupId: "all",
                    province: "",
                    city: "",
                  })
                }
              >
                查看全国路线
              </button>
            )}
          </div>
        )}
      </section>

      {(destination.groupId !== "all" ||
        destination.province ||
        destination.city) &&
        routes.length > 0 && (
          <section className="destination-overview" aria-label="目的地拍摄概览">
            <header>
              <span>
                <small>DESTINATION SNAPSHOT</small>
                <strong>这里适合拍什么</strong>
              </span>
              <b>{destinationOverview.total} 条</b>
            </header>
            <div className="destination-overview-tags">
              {destinationOverview.routeTypes.map((item) => (
                <span key={item.value}>
                  {item.label} {item.count}
                </span>
              ))}
              {destinationOverview.captureStyles.map((item) => (
                <span key={item.value}>
                  {item.label} {item.count}
                </span>
              ))}
            </div>
            <footer>
              <span>{destinationOverview.sourceChecked} 条已有来源证据</span>
              <span>{destinationOverview.fieldChecked} 条已有实地核验</span>
              <button
                onClick={() => {
                  const first = destinationOverview.priorityRoutes[0];
                  if (first) state.selectRoute(first.route.id);
                }}
              >
                打开优先路线
              </button>
            </footer>
          </section>
        )}

      <section className={`trip-research ${researchOpen ? "is-open" : ""}`}>
        <header>
          <button
            className="trip-research-toggle"
            onClick={() => setResearchOpen((open) => !open)}
            aria-expanded={researchOpen}
            aria-controls="trip-research-body"
          >
            <BookmarkPlus size={16} />
            <span>
              <small>TRIP RESEARCH</small>
              <strong>旅行拍摄篮</strong>
            </span>
            <b>{researchRoutes.length}</b>
            <ChevronDown size={14} />
          </button>
          {selectedForResearch && (
            <button
              className={`trip-add-current ${selectedInResearch ? "active" : ""}`}
              onClick={() => {
                state.toggleResearchRoute(selectedForResearch.route.id);
                setResearchOpen(true);
              }}
            >
              {selectedInResearch ? (
                <Check size={13} />
              ) : (
                <BookmarkPlus size={13} />
              )}
              {selectedInResearch ? "已加入当前路线" : "加入当前路线"}
            </button>
          )}
        </header>
        {researchOpen && (
          <div className="trip-research-body" id="trip-research-body">
            {researchRoutes.length ? (
              <>
                <div className="trip-summary-grid">
                  <span>
                    <strong>{researchSummary.provinces.length}</strong>
                    <small>省级目的地</small>
                  </span>
                  <span>
                    <strong>{researchSummary.cities.length}</strong>
                    <small>城市 / 地区</small>
                  </span>
                  <span>
                    <strong>
                      {formatRouteMinutes(researchSummary.totalMinutes)}
                    </strong>
                    <small>拍摄时间</small>
                  </span>
                  <span>
                    <strong>{researchSummary.estimatedDays}</strong>
                    <small>建议天数</small>
                  </span>
                </div>
                {researchSummary.warnings.length > 0 && (
                  <ul className="trip-warnings">
                    {researchSummary.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                )}
                <label className="trip-start-date">
                  <span>计划从哪天出发</span>
                  <input
                    type="date"
                    min={localDateInput()}
                    value={state.researchStartDate}
                    onChange={(event) => {
                      if (event.target.value)
                        state.setResearchStartDate(event.target.value);
                    }}
                  />
                </label>
                <div className="trip-route-list">
                  {researchSummary.days.map((day) => (
                    <section key={day.day} className="trip-day">
                      <header>
                        <span>
                          DAY {day.day} ·{" "}
                          {dateForTripDay(
                            state.researchStartDate,
                            day.day,
                          ).slice(5)}
                        </span>
                        <strong>{formatRouteMinutes(day.totalMinutes)}</strong>
                        <small>{day.cities.join(" · ")}</small>
                        <button
                          className="trip-day-plan"
                          onClick={() => {
                            const scheduledDate = dateForTripDay(
                              state.researchStartDate,
                              day.day,
                            );
                            const unplanned = day.routes.filter(
                              (item) =>
                                !state.plans.some(
                                  (plan) => plan.routeId === item.route.id,
                                ),
                            );
                            if (!unplanned.length) {
                              state.setView("plans");
                              return;
                            }
                            for (const item of unplanned) {
                              state.addPlan({
                                routeId: item.route.id,
                                scheduledDate,
                                objective: `行程第 ${day.day} 天 · ${item.route.name}`,
                              });
                            }
                            state.setView("plans");
                          }}
                        >
                          <CalendarPlus size={11} />
                          {day.routes.every((item) =>
                            state.plans.some(
                              (plan) => plan.routeId === item.route.id,
                            ),
                          )
                            ? "查看计划"
                            : "转为计划"}
                        </button>
                      </header>
                      {day.routes.map((item) => {
                        const routeIndex = state.researchRouteIds.indexOf(
                          item.route.id,
                        );
                        return (
                          <div key={item.route.id}>
                            <button
                              onClick={() => state.selectRoute(item.route.id)}
                            >
                              <strong>{item.route.name}</strong>
                              <small>
                                {provinceLabel(item.route.province)} ·{" "}
                                {item.route.cities
                                  .map((city) =>
                                    divisionLabel(item.route.province, city),
                                  )
                                  .join(" / ")}
                              </small>
                            </button>
                            <div className="trip-order-actions">
                              <button
                                disabled={routeIndex <= 0}
                                aria-label={`上移路线：${item.route.name}`}
                                onClick={() =>
                                  state.moveResearchRoute(item.route.id, "up")
                                }
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button
                                disabled={
                                  routeIndex ===
                                  state.researchRouteIds.length - 1
                                }
                                aria-label={`下移路线：${item.route.name}`}
                                onClick={() =>
                                  state.moveResearchRoute(item.route.id, "down")
                                }
                              >
                                <ArrowDown size={12} />
                              </button>
                              <button
                                aria-label={`从旅行拍摄篮移除：${item.route.name}`}
                                onClick={() =>
                                  state.toggleResearchRoute(item.route.id)
                                }
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </section>
                  ))}
                </div>
                <p className="trip-travel-boundary">
                  按每天最多 8
                  小时拍摄自动分组；城市间驾车、休息、天气和临时管制时间尚未计入。
                </p>
                <button
                  className="trip-clear"
                  onClick={state.clearResearchRoutes}
                >
                  清空拍摄篮
                </button>
              </>
            ) : (
              <p className="trip-empty">
                打开一条候选路线后加入这里，用来组合跨城市拍摄行程。
              </p>
            )}
          </div>
        )}
      </section>

      <div className={`current-city ${locationStatus}`}>
        <span className="current-city-icon">
          <LocateFixed size={15} />
        </span>
        <span>
          <small>
            {locationStatus === "locating"
              ? "正在识别当前位置"
              : currentRegion
                ? "当前城市"
                : "位置筛选"}
          </small>
          <strong>
            {currentRegion
              ? `${currentRegion.province} · ${currentRegion.city}`
              : locationMessage || "定位后优先显示身边内容"}
          </strong>
        </span>
        {locationStatus === "locating" ? (
          <i className="location-spinner" />
        ) : currentRegion ? (
          <button onClick={onClearLocation} aria-label="清除当前城市筛选">
            <X size={14} />
          </button>
        ) : (
          <button onClick={onLocate} aria-label="重新定位">
            <RefreshCw size={14} />
          </button>
        )}
      </div>

      {currentRegion && (
        <div className="nearby-locations">
          <div>
            <span>当前城市地点</span>
            <button onClick={() => state.setView("locations")}>
              进入地点库
            </button>
          </div>
          {nearbyLocations.length ? (
            nearbyLocations.slice(0, 3).map((location) => (
              <button
                key={location.id}
                onClick={() => state.setView("locations")}
              >
                <MapPin size={13} />
                <span>
                  <strong>{location.name}</strong>
                  <small>
                    {location.access.mode === "drive"
                      ? "驾车可达"
                      : "停车后步行"}
                  </small>
                </span>
              </button>
            ))
          ) : (
            <p>该城市尚无来源核验地点</p>
          )}
        </div>
      )}

      <section
        id="route-filter-panel"
        className={`route-filter-panel ${filtersOpen ? "is-open" : "is-collapsed"}`}
        aria-label="路线筛选"
      >
        <div className="capture-heading">
          <span>选择拍摄方式</span>
          {state.captureStyle !== "all" && (
            <button onClick={() => state.setCaptureStyle("all")}>清除</button>
          )}
        </div>
        <div className="capture-modes" aria-label="拍摄方式">
          {captureStyles.map((style) => {
            const Icon = style.icon;
            const active = state.captureStyle === style.value;
            return (
              <button
                key={style.value}
                className={`capture-${style.value} ${active ? "active" : ""}`}
                aria-pressed={active}
                onClick={() =>
                  state.setCaptureStyle(active ? "all" : style.value)
                }
              >
                <Icon size={18} />
                <strong>{style.label}</strong>
                <small>{style.short}</small>
              </button>
            );
          })}
        </div>

        <button
          className={`drive-only-filter ${state.driveOnly ? "active" : ""}`}
          aria-pressed={state.driveOnly}
          onClick={() => state.setDriveOnly(!state.driveOnly)}
        >
          <CarFront size={16} />
          <span>
            <strong>只看纯驾车</strong>
            <small>全程不停车 · 无需下车</small>
          </span>
          <i>{state.driveOnly ? "已开启" : "开启"}</i>
        </button>

        <div className="light-heading">光线与氛围</div>
        <div className="mode-tabs" role="tablist" aria-label="光线与氛围">
          {modes.map((mode) => (
            <button
              key={mode.value}
              role="tab"
              aria-selected={state.mode === mode.value}
              onClick={() => state.setMode(mode.value)}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <label className="duration-filter">
          <span>最长行程</span>
          <select
            value={state.maxDurationMinutes}
            onChange={(event) =>
              state.setMaxDurationMinutes(Number(event.target.value))
            }
          >
            <option value={120}>2 小时</option>
            <option value={180}>3 小时</option>
            <option value={240}>4 小时</option>
            <option value={360}>6 小时</option>
            <option value={480}>8 小时</option>
            <option value={600}>10 小时</option>
            <option value={720}>2—3 日</option>
            <option value={960}>多日路线</option>
          </select>
        </label>
      </section>

      <div ref={listTopRef} className="list-heading">
        <span>
          <strong>{routes.length}</strong> 条
          {destination.city
            ? `${divisionLabel(destination.province, destination.city)}路线`
            : destination.province
              ? `${provinceLabel(destination.province)}路线`
              : destination.groupId !== "all"
                ? `${administrativeGroups.find((group) => group.id === destination.groupId)?.label ?? "区域"}路线`
                : "全国匹配路线"}
        </span>
        <div>
          {!filtersOpen && (
            <button
              className="filter-summary-trigger"
              onClick={() => setFiltersOpen(true)}
            >
              <SlidersHorizontal size={13} />
              筛选
            </button>
          )}
          <button onClick={cycleSort} aria-label="切换路线排序">
            {sortLabels[sort]} <span>⌄</span>
          </button>
        </div>
      </div>

      <div className="route-card-list">
        {displayRoutes.length ? (
          pagedRoutes.items.map((item) => (
            <RouteCard
              key={item.route.id}
              route={item.route}
              waypoints={item.waypoints}
              active={item.route.id === state.selectedRouteId}
              onSelect={() => state.selectRoute(item.route.id)}
            />
          ))
        ) : (
          <div className="empty-state">
            <Search size={22} />
            <strong>没有找到路线</strong>
            <span>
              {currentRegion
                ? `${currentRegion.city}暂无匹配路线，可清除位置筛选查看全国路线`
                : "试试清除拍摄方式、放宽最长行程或缩短搜索词"}
            </span>
            <button className="empty-reset" onClick={resetFilters}>
              <RotateCcw size={13} /> 重置全部筛选
            </button>
          </div>
        )}
      </div>
      <LocalPaginationControls {...pagedRoutes} onPageChange={changePage} />
    </aside>
  );
}
