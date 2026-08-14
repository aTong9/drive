import { AudioLines, Camera, CarFront, CheckCircle2, ChevronRight, Clock3, CloudRain, CloudSun, Download, ExternalLink, Footprints, Globe2, MapPin, Navigation, Search, ShieldCheck, Trees, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type WheelEvent } from "react";
import type { FieldCheck, Location, ResolvedRoute } from "../../types/domain.js";
import { usePlannerStore } from "../../app/store.js";
import { downloadFieldChecks, importFieldChecks as readFieldChecks } from "../../services/fieldCheckExport.js";
import { administrativeDivisionCount, administrativeGroups, divisionLabel, findProvince, provinceLabel, provincesForGroup, type AdministrativeGroupId } from "../../services/regionService.js";
import { paginateItems } from "../../services/localPagination.js";
import { horizontalScrollDelta } from "../../services/horizontalScroll.js";
import { GeoPhotoThumbnail } from "../common/GeoPhotoThumbnail.js";
import { CityWeather } from "../common/CityWeather.js";
import { LocalPaginationControls } from "../common/LocalPaginationControls.js";

const typeLabels: Record<Location["type"], string> = {
  coast: "海岸",
  "city-night": "城市夜景",
  waterfall: "瀑布",
  stream: "溪流",
  forest: "森林",
  mountain: "山地",
  river: "江河",
  lake: "湖泊",
  landmark: "地标"
};

const timeLabels: Record<string, string> = { sunrise: "日出", morning: "上午", "golden-hour": "黄金时刻", sunset: "日落", "blue-hour": "蓝调时刻", night: "夜间" };
const soundLabels: Record<string, string> = { waves: "海浪", water: "溪流", birds: "鸟鸣", urban: "城市底噪", traffic: "道路声", mixed: "混合环境" };
const riskLabels = { low: "低", medium: "中", high: "高" } as const;
const captureLabels = { "scenic-drive": "风景驾车", "rain-walk": "雨天步行", "stationary-nature": "林间定点" } as const;
const captureDescriptions = { "scenic-drive": "真实道路 · 长距离转场", "rain-walk": "停车进入 · 慢行取景", "stationary-nature": "固定机位 · 自然收音" } as const;
const captureIcons = { "scenic-drive": CarFront, "rain-walk": CloudRain, "stationary-nature": Trees } as const;
const LOCATION_PAGE_SIZE = 24;
const ROUTE_PAGE_SIZE = 12;

interface CheckDraft {
  visitedAt: string;
  parkingNote: string;
  lightNote: string;
  soundNote: string;
  overallNote: string;
}

function draftFrom(check: FieldCheck | undefined): CheckDraft {
  return check ? {
    visitedAt: check.visitedAt,
    parkingNote: check.parkingNote,
    lightNote: check.lightNote,
    soundNote: check.soundNote,
    overallNote: check.overallNote
  } : { visitedAt: new Date().toISOString().slice(0, 10), parkingNote: "", lightNote: "", soundNote: "", overallNote: "" };
}

export function LocationView({ locations, routes, catalogSchemaVersion }: { locations: Location[]; routes: ResolvedRoute[]; catalogSchemaVersion: string }) {
  const [query, setQuery] = useState("");
  const [browseMode, setBrowseMode] = useState<"locations" | "routes">("locations");
  const [type, setType] = useState<Location["type"] | "all">("all");
  const [captureStyle, setCaptureStyle] = useState<ResolvedRoute["route"]["captureStyle"] | "all">("all");
  const [driveOnly, setDriveOnly] = useState(false);
  const [region, setRegion] = useState<{ province?: string; city?: string }>({});
  const [regionGroup, setRegionGroup] = useState<AdministrativeGroupId | "all">("all");
  const [locationPage, setLocationPage] = useState(1);
  const [routePage, setRoutePage] = useState(1);
  const [selectedId, setSelectedId] = useState(locations[0]?.id ?? "");
  const [detailVisible, setDetailVisible] = useState(true);
  const [editing, setEditing] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const importInputRef = useRef<HTMLInputElement>(null);
  const resultsTopRef = useRef<HTMLDivElement>(null);
  const fieldChecks = usePlannerStore((state) => state.fieldChecks);
  const saveFieldCheck = usePlannerStore((state) => state.saveFieldCheck);
  const removeFieldCheck = usePlannerStore((state) => state.removeFieldCheck);
  const importFieldChecks = usePlannerStore((state) => state.importFieldChecks);
  const selectStoredRoute = usePlannerStore((state) => state.selectRoute);
  const setExploreMode = usePlannerStore((state) => state.setMode);
  const setExploreCaptureStyle = usePlannerStore((state) => state.setCaptureStyle);
  const setExploreDriveOnly = usePlannerStore((state) => state.setDriveOnly);
  const setExploreDuration = usePlannerStore((state) => state.setMaxDurationMinutes);
  const setExploreQuery = usePlannerStore((state) => state.setQuery);
  const selectRoute = (routeId: string) => {
    const target = routes.find((item) => item.route.id === routeId);
    setExploreMode("all");
    setExploreCaptureStyle("all");
    setExploreDriveOnly(false);
    setExploreDuration(Math.max(360, target?.route.estimatedDurationMinutes ?? 360));
    setExploreQuery("");
    selectStoredRoute(routeId);
  };
  const selected = locations.find((location) => location.id === selectedId) ?? locations[0];
  const check = selected ? fieldChecks.find((item) => item.locationId === selected.id) : undefined;
  const [draft, setDraft] = useState<CheckDraft>(() => draftFrom(check));

  const filtered = useMemo(() => locations.filter((location) => {
    const needle = query.trim().toLowerCase();
    const matchesRegion = (!region.province || location.province === region.province) && (!region.city || location.city === region.city);
    return matchesRegion && (type === "all" || location.type === type) && (!needle || location.name.toLowerCase().includes(needle) || location.city.includes(needle));
  }), [locations, query, region, type]);
  const provinces = provincesForGroup(regionGroup);
  const cities = findProvince(region.province)?.divisions ?? [];
  const coveredProvinceCount = new Set(locations.map((location) => location.province)).size;
  const filteredRoutes = useMemo(() => routes.filter(({ route, waypoints }) => {
    const needle = query.trim().toLowerCase();
    const matchesRegion = (!region.province || route.province === region.province) && (!region.city || route.cities.includes(region.city));
    const matchesQuery = !needle || route.name.toLowerCase().includes(needle) || route.cities.some((city) => city.includes(needle)) || waypoints.some((point) => point.name.toLowerCase().includes(needle));
    return matchesRegion && matchesQuery && (captureStyle === "all" || route.captureStyle === captureStyle) && (!driveOnly || route.executionMode === "drive-only");
  }), [routes, query, region, captureStyle, driveOnly]);
  const pagedLocations = useMemo(() => paginateItems(filtered, locationPage, LOCATION_PAGE_SIZE), [filtered, locationPage]);
  const pagedRoutes = useMemo(() => paginateItems(filteredRoutes, routePage, ROUTE_PAGE_SIZE), [filteredRoutes, routePage]);

  useEffect(() => setLocationPage(1), [query, region.province, region.city, type]);
  useEffect(() => setRoutePage(1), [query, region.province, region.city, captureStyle, driveOnly]);

  if (!selected) return null;
  const relatedRoutes = routes.filter((route) => route.route.waypointLocationIds.includes(selected.id));
  const openLocation = (location: Location) => {
    setSelectedId(location.id);
    setDetailVisible(true);
    setEditing(false);
    setDraft(draftFrom(fieldChecks.find((item) => item.locationId === location.id)));
  };
  const submitCheck = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveFieldCheck({ locationId: selected.id, ...draft });
    setEditing(false);
  };
  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const checks = await readFieldChecks(file, catalogSchemaVersion, locations);
      importFieldChecks(checks);
      setImportMessage(`已导入 ${checks.length} 条核验记录`);
    } catch (error) {
      setImportMessage(error instanceof Error ? error.message : "导入失败");
    }
  };
  const changePage = (page: number, setPage: (page: number) => void) => {
    setPage(page);
    resultsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const scrollRegionOptions = (event: WheelEvent<HTMLDivElement>) => {
    const rail = event.currentTarget;
    if (rail.scrollWidth <= rail.clientWidth) return;
    const delta = horizontalScrollDelta(event.deltaX, event.deltaY);
    if (!delta) return;
    event.preventDefault();
    rail.scrollLeft += delta;
  };

  return (
    <main className={`location-page mode-${browseMode}`}>
      <section className="location-browser">
        <header className="location-head"><div><p className="eyebrow">PLACE & ROUTE ATLAS</p><h1>地点与路线图鉴</h1><p className="location-intro">全国行政目录负责完整导航，来源核验内容负责真实拍摄决策；两者分层展示。</p>{importMessage && <small className="import-message">{importMessage}</small>}</div><div className="location-head-actions"><div className="location-head-stats"><strong>{coveredProvinceCount}/34</strong><small>实景省级覆盖</small><strong>{administrativeDivisionCount}</strong><small>城市与区域</small><strong>{locations.length}</strong><small>真实地点</small><strong>{routes.length}</strong><small>完整路线</small></div><input ref={importInputRef} type="file" accept="application/json,.json" hidden onChange={handleImport} /><button className="import-checks" onClick={() => importInputRef.current?.click()}><Download size={15} /> 导入核验</button><button className="export-checks" disabled={!fieldChecks.length} onClick={() => downloadFieldChecks(catalogSchemaVersion, locations, fieldChecks)} title={fieldChecks.length ? "导出全部实地核验数据" : "添加实地核验后可导出"}><Download size={15} /> 导出 JSON</button></div></header>
        <section className="region-browser" aria-label="地点行政区划">
          <div className="region-path">
            <Globe2 size={14} />
            <button onClick={() => { setRegion({}); setRegionGroup("all"); }}>全国</button>
            {region.province && <><ChevronRight size={12} /><button onClick={() => setRegion({ province: region.province! })}>{provinceLabel(region.province)}</button></>}
            {region.city && <><ChevronRight size={12} /><strong>{divisionLabel(region.province, region.city)}</strong></>}
          </div>
          {!region.province && <div className="region-groups" aria-label="按地理分区筛选省级行政区">
            <button className={regionGroup === "all" ? "active" : ""} onClick={() => setRegionGroup("all")}>全部 34</button>
            {administrativeGroups.map((group) => <button key={group.id} className={regionGroup === group.id ? "active" : ""} onClick={() => setRegionGroup(group.id)}>{group.label} {group.provinces.length}</button>)}
          </div>}
          <div className={`region-options ${!region.province ? "province-options" : ""}`} onWheel={region.province ? scrollRegionOptions : undefined}>
            {!region.province ? provinces.map((province) => {
              const locationCount = locations.filter((location) => location.province === province.name).length;
              const routeCount = routes.filter((route) => route.route.province === province.name).length;
              return <button key={province.name} className={locationCount ? "has-content" : "directory-only"} onClick={() => setRegion({ province: province.name })}>
                <span>{province.label}</span>
                <small>{locationCount || routeCount ? `${locationCount} 地点 · ${routeCount} 路线` : "行政目录 · 待核验"}</small>
                <ChevronRight size={14} />
              </button>;
            }) : <>
              <button className={!region.city ? "active" : ""} onClick={() => setRegion({ province: region.province! })}>
                <span>全部区域</span>
                <small>{locations.filter((location) => location.province === region.province).length} 地点</small>
              </button>
              {cities.map((city) => {
                const locationCount = locations.filter((location) => location.province === region.province && location.city === city.name).length;
                const routeCount = routes.filter((route) => route.route.province === region.province && route.route.cities.includes(city.name)).length;
                return <button key={city.name} className={`${region.city === city.name ? "active " : ""}${locationCount || routeCount ? "has-content" : "directory-only"}`} onClick={() => setRegion({ province: region.province!, city: city.name })}>
                  <span>{city.label}</span>
                  <small>{locationCount || routeCount ? `${locationCount} 地点 · ${routeCount} 路线` : "行政目录 · 待核验"}</small>
                </button>;
              })}
            </>}
          </div>
          {region.city && <CityWeather cities={[region.city]} />}
        </section>
        <div className="library-switch" role="tablist" aria-label="浏览内容"><button role="tab" aria-selected={browseMode === "locations"} onClick={() => setBrowseMode("locations")}><MapPin size={16} /><span>地点</span><small>{filtered.length} 个可用地点</small></button><button role="tab" aria-selected={browseMode === "routes"} onClick={() => setBrowseMode("routes")}><Navigation size={16} /><span>路线</span><small>{filteredRoutes.length} 条完整流程</small></button></div>
        <div ref={resultsTopRef} className="location-results-anchor" />
        <label className="location-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={browseMode === "locations" ? "搜索地点或城市" : "搜索路线、途经点或城市"} /></label>
        {browseMode === "locations" ? <><div className="location-filters">
          <button className={type === "all" ? "active" : ""} onClick={() => setType("all")}>全部</button>
          {[...new Set(locations.map((location) => location.type))].map((item) => <button key={item} className={type === item ? "active" : ""} onClick={() => setType(item)}>{typeLabels[item]}</button>)}
        </div>
        <div className="location-grid">
          {pagedLocations.items.map((location) => {
            const fieldChecked = fieldChecks.some((item) => item.locationId === location.id);
            return <button key={location.id} className={`location-card ${selected.id === location.id ? "active" : ""}`} onClick={() => openLocation(location)}>
              <GeoPhotoThumbnail id={location.id} label={location.name} type={location.type} points={[location]} variant="location" />
              <div><span>{typeLabels[location.type]} · {location.city}</span><h2>{location.name}</h2><small><Footprints size={12} /> {location.access.mode === "drive" ? "驾车可达" : "停车后步行"}</small></div>
              <span className={`location-check ${fieldChecked ? "field" : ""}`}>{fieldChecked ? <CheckCircle2 size={13} /> : <ShieldCheck size={13} />}{fieldChecked ? "实地" : "来源"}</span>
            </button>;
          })}
        </div><LocalPaginationControls {...pagedLocations} onPageChange={(page) => changePage(page, setLocationPage)} /></> : <><div className="capture-library-filters"><button className={captureStyle === "all" && !driveOnly ? "active" : ""} onClick={() => { setCaptureStyle("all"); setDriveOnly(false); }}><Navigation size={18} /><span><strong>全部路线</strong><small>查看所有创作流程</small></span></button>{(["scenic-drive", "rain-walk", "stationary-nature"] as const).map((style) => { const Icon = captureIcons[style]; return <button key={style} className={`${captureStyle === style && !driveOnly ? "active" : ""} style-${style}`} onClick={() => { setCaptureStyle(style); setDriveOnly(false); }}><Icon size={18} /><span><strong>{captureLabels[style]}</strong><small>{captureDescriptions[style]}</small></span></button>; })}<button className={`drive-only-library-filter ${driveOnly ? "active" : ""}`} aria-pressed={driveOnly} onClick={() => { setDriveOnly(!driveOnly); setCaptureStyle(!driveOnly ? "scenic-drive" : "all"); }}><CarFront size={18} /><span><strong>只看纯驾车</strong><small>全程不停车 · 无需下车</small></span></button></div><div className="library-route-grid">{pagedRoutes.items.map(({ route, waypoints }) => { const Icon = captureIcons[route.captureStyle]; const routeDriveOnly = route.executionMode === "drive-only"; return <article className={`library-route-card style-${route.captureStyle}`} key={route.id}><GeoPhotoThumbnail id={route.id} label={route.name} type={route.type} points={waypoints} /><div className="library-route-top"><span><Icon size={16} /> {routeDriveOnly ? "纯驾车 · 无需下车" : captureLabels[route.captureStyle]}</span><small><ShieldCheck size={12} /> 来源核验</small></div><h2>{route.name}</h2><div className="library-route-meta"><span><Clock3 size={13} /> 约 {route.estimatedDurationMinutes} 分钟</span><span><MapPin size={13} /> {waypoints.length} 个{routeDriveOnly ? "道路锚点" : "拍摄点"}</span><span>{route.cities.join(" · ")}</span></div><ol>{waypoints.map((point, index) => <li key={point.id}><i>{String(index + 1).padStart(2, "0")}</i><span><strong>{point.name}</strong><small>{routeDriveOnly ? "连续驾车经过" : point.access.mode === "drive" ? "驾车到达" : "停车后步行"}</small></span></li>)}</ol><p>{route.shootAdvice}</p><button onClick={() => selectRoute(route.id)}>在地图中打开路线 <ChevronRight size={15} /></button></article>; })}</div><LocalPaginationControls {...pagedRoutes} onPageChange={(page) => changePage(page, setRoutePage)} />{filteredRoutes.length === 0 && <div className="library-empty"><Navigation size={24} /><strong>当前区域没有匹配路线</strong><span>尝试切换城市或拍摄方式</span></div>}</>}
        {browseMode === "locations" && filtered.length === 0 && <div className="library-empty"><MapPin size={24} /><strong>该区域已进入全国行政目录</strong><span>拍摄地点与路线仍待来源核验，暂无虚构占位数据</span></div>}
      </section>

      <aside className={`location-detail ${detailVisible && browseMode === "locations" && filtered.some((location) => location.id === selected.id) ? "" : "is-hidden"}`}>
        <div className="location-detail-hero"><GeoPhotoThumbnail id={selected.id} label={selected.name} type={selected.type} points={[selected]} variant="hero" /><button className="location-detail-close" onClick={() => setDetailVisible(false)} aria-label="关闭地点详情"><X size={17} /></button><span>{typeLabels[selected.type]}</span><h2>{selected.name}</h2><p><MapPin size={14} /> {selected.province} · {selected.city} · {selected.coordinate.lng.toFixed(6)}, {selected.coordinate.lat.toFixed(6)}</p></div>
        <div className="location-detail-scroll">
          <div className="location-facts">
            <span><CloudSun size={17} /><small>最佳时段</small><strong>{selected.shooting.bestTimes.map((item) => timeLabels[item]).join(" · ")}</strong></span>
            <span><Camera size={17} /><small>拍摄方式</small><strong>{selected.shooting.modes.map((item) => item.replaceAll("-", " ")).join(" · ")}</strong></span>
          </div>
          <CityWeather cities={[selected.city]} compact />
          <section><p className="eyebrow">ACCESS</p><h3>到达方式</h3><p>{selected.access.note}</p></section>
          <section><p className="eyebrow">SHOOTING NOTE</p><h3>拍摄建议</h3><p>{selected.shooting.advice}</p></section>
          <section><p className="eyebrow">SOUND ENVIRONMENT</p><h3>声音环境</h3><div className="sound-environment"><div><AudioLines size={17} /><span><small>主要声景</small><strong>{selected.soundEnvironment.character.map((item) => soundLabels[item]).join(" · ")}</strong></span></div><dl><div><dt>噪声风险</dt><dd>{riskLabels[selected.soundEnvironment.noiseRisk]}</dd></div><div><dt>人流风险</dt><dd>{riskLabels[selected.soundEnvironment.crowdRisk]}</dd></div></dl><p>{selected.soundEnvironment.weatherSensitivity}</p><strong>{selected.soundEnvironment.recordingAdvice}</strong></div></section>
          <section><div className="location-section-title"><div><p className="eyebrow">VERIFICATION</p><h3>核验记录</h3></div>{check && <button onClick={() => { removeFieldCheck(selected.id); setDraft(draftFrom(undefined)); }} aria-label="删除实地核验"><Trash2 size={14} /></button>}</div>
            {check && !editing ? <div className="field-check-card"><span><CheckCircle2 size={15} /> {check.visitedAt} 已实地核验</span><dl><div><dt>停车</dt><dd>{check.parkingNote || "未记录"}</dd></div><div><dt>光线</dt><dd>{check.lightNote || "未记录"}</dd></div><div><dt>声音</dt><dd>{check.soundNote || "未记录"}</dd></div></dl><p>{check.overallNote}</p><button onClick={() => { setDraft(draftFrom(check)); setEditing(true); }}>编辑记录</button></div> :
            editing ? <form className="field-check-form" onSubmit={submitCheck}>
              <label>核验日期<input type="date" value={draft.visitedAt} onChange={(event) => setDraft({ ...draft, visitedAt: event.target.value })} required /></label>
              <label>停车情况<input value={draft.parkingNote} onChange={(event) => setDraft({ ...draft, parkingNote: event.target.value })} placeholder="例如：1号停车场，工作日有空位" /></label>
              <label>现场光线<input value={draft.lightNote} onChange={(event) => setDraft({ ...draft, lightNote: event.target.value })} placeholder="例如：蓝调时刻建筑灯光稳定" /></label>
              <label>声音环境<input value={draft.soundNote} onChange={(event) => setDraft({ ...draft, soundNote: event.target.value })} placeholder="例如：海浪清晰，偶有车辆噪声" /></label>
              <label>综合备注<textarea value={draft.overallNote} onChange={(event) => setDraft({ ...draft, overallNote: event.target.value })} rows={3} placeholder="记录机位、限制和下次改进" required /></label>
              <div><button type="button" onClick={() => setEditing(false)}>取消</button><button type="submit">保存核验</button></div>
            </form> : <button className="start-field-check" onClick={() => { setDraft(draftFrom(undefined)); setEditing(true); }}><CheckCircle2 size={16} /> 添加实地核验</button>}
          </section>
          <section><p className="eyebrow">SOURCES</p><h3>来源证据</h3>{selected.verification.sources.map((source) => <a className="source-link" key={source.url} href={source.url} target="_blank" rel="noreferrer"><span>{source.title}<small>{source.supports.join(" · ")}</small></span><ExternalLink size={14} /></a>)}</section>
          {relatedRoutes.length > 0 && <section><p className="eyebrow">RELATED ROUTES</p><h3>关联路线</h3>{relatedRoutes.map((route) => <button className="related-route" key={route.route.id} onClick={() => selectRoute(route.route.id)}><Navigation size={15} /><span>{route.route.name}</span><ChevronRight size={15} /></button>)}</section>}
        </div>
      </aside>
    </main>
  );
}
