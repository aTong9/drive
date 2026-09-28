import { resolveNightDriveRoute, nightDriveCoordinates, nightDriveCoordinateExclusions } from "../../services/nightDriveCoordinates.js";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronRight, X } from "lucide-react";
import { MapCanvas } from "../map/MapCanvas.js";
import type { DrivingSummary, Location } from "../../types/domain.js";
import { filterNightDriveCities, nightDriveAtlas, nightDriveTotals, nightDriveLinks, type NightDriveCity, type NightDriveStop } from "../../services/nightDriveAtlasService.js";
import type { LocationSummary } from "../../services/browserCatalogService.js";
import { useLocationBrowse } from "../common/useLocationBrowse.js";
import { paginateItems } from "../../services/localPagination.js";
import { LocalPaginationControls } from "../common/LocalPaginationControls.js";

export default function NightDriveAtlas({ locations, onOpenLocation }: { locations: LocationSummary[]; onOpenLocation: (id: string) => void }) {
  const [opened, setOpened] = useState<{ city: NightDriveCity; route: NightDriveCity["routes"][number] }>();
  const [query] = useLocationBrowse("query");
  const [region] = useLocationBrowse("region");
  const [group] = useLocationBrowse("regionGroup");
  const [page, setPage] = useLocationBrowse("locationPage");
  const cities = filterNightDriveCities(query, region, group);
  const paged = paginateItems(cities, page, 12);
  const existing = new Map(locations.map((location) => [`${location.city}/${location.name}`, location.id]));
  const stopRow = (stop: NightDriveStop, city: NightDriveCity, previous?: NightDriveStop, extra = false) => {
    const catalogId = existing.get(`${city.name}/${stop.name}`);
    return <li key={stop.id}>
      <div className="night-drive-stop-title"><strong>{stop.name}</strong><span>{stop.mode}</span></div>
      {stop.note && <p>{stop.note}</p>}
      {nightDriveCoordinateExclusions[stop.id] && <p role="note">{nightDriveCoordinateExclusions[stop.id]!.reason} <a href={nightDriveCoordinateExclusions[stop.id]!.sourceUrl} target="_blank" rel="noreferrer">项目进展依据</a></p>}
      {nightDriveCoordinates[stop.id] && <small>地图定位：<a href={nightDriveCoordinates[stop.id]!.source.url} target="_blank" rel="noreferrer">{nightDriveCoordinates[stop.id]!.name}</a></small>}
      <div className="night-drive-links">
        {nightDriveLinks(city.name, stop, previous, extra).map((link) => <a key={link.url} href={link.url} target={link.url.startsWith("https:") ? "_blank" : undefined} rel="noreferrer" aria-label={`${stop.name}：${link.label}`}>{link.label}</a>)}
        {catalogId && <button aria-label={`${stop.name}：查看已有地点资料`} onClick={() => onOpenLocation(catalogId)}>查看已有地点资料</button>}
      </div>
    </li>;
  };
  return <section className="night-drive-atlas" aria-label="60 城夜景自驾专题">
    {opened && <NightDriveMap city={opened.city} route={opened.route} onClose={() => setOpened(undefined)}>
      <ol>{opened.route.stops.map((stop, index) => stopRow(stop, opened.city, opened.route.stops[index - 1]))}</ol>
    </NightDriveMap>}
    <header>
      <h2>夜驶中国 · 城市夜景拍摄清单</h2>
      <p>{nightDriveTotals.cities} 城 · {nightDriveTotals.routes} 条编排路线 · {nightDriveTotals.stops} 个主线站点 · {nightDriveTotals.extras} 个补拍点</p>
      <p>研究清单 · 待核验。保留原文顺序与提示，主线已补充高德地点坐标；停车入口和夜间开放情况尚未逐点核实。外观不代表车窗无遮挡，步行点需先合法停车，途经桥梁不要临停。</p>
      <p>iPhone 高德入口按名称规划每一段；其他设备可用“地图备用”。出发前核对候选地点、实际道路和当晚亮灯，不保证一晚拍完。</p>
      <small>原始清单编排日期：{nightDriveAtlas.source.date}</small>
      <details><summary>原始清单的收录范围与参考依据</summary>
        <p>导入文件：{nightDriveAtlas.source.fileName}</p>
        {nightDriveAtlas.source.scope.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <div className="night-drive-links">{nightDriveAtlas.source.references.map((reference) => <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer">{reference.label}（原文参考）</a>)}</div>
      </details>
    </header>
    <p role="status">当前筛选 {cities.length} 座城市；检索命中地标时保留整条路线，方便查看前后站点。</p>
    {!cities.length && <p className="library-empty">当前区域没有匹配的夜景清单，请调整城市或关键词。</p>}
    {paged.items.map((city) => <details className="night-drive-city" key={`${city.id}-${query}-${region.city ?? ""}`} open={Boolean(query || region.city) || undefined}>
      <summary><strong>{city.name}</strong><span>{city.province} · {city.routes.length} 条路线 · {city.routes.reduce((n, route) => n + route.stops.length, 0)} 站 · {city.extras.length} 个补拍点</span></summary>
      <div className="night-drive-city-body">
        <p>{city.advice}</p>
        {city.routes.map((route) => <details className="night-drive-route" key={route.id} open>
          <summary><strong>{route.name}</strong><span>{route.stops.length} 站 · 待核验</span></summary>
          <p>{route.direction}</p><p>{route.note}</p>
          <button className="night-drive-open-map" onClick={() => setOpened({ city, route })} aria-label={`${city.name} · ${route.name}：在地图中打开路线`}>在地图中打开路线 <ChevronRight size={15} /></button>
          <ol>{route.stops.map((stop, index) => stopRow(stop, city, route.stops[index - 1]))}</ol>
        </details>)}
        <details className="night-drive-route"><summary><strong>独立补拍点</strong><span>{city.extras.length} 个</span></summary><ul>{city.extras.map((stop) => stopRow(stop, city, undefined, true))}</ul></details>
        <p>{city.sourceNote.replace("详见页末口径", "详见上方收录范围")}</p>
        <div className="night-drive-links">{city.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}（原文参考）</a>)}</div>
      </div>
    </details>)}
    <LocalPaginationControls {...paged} onPageChange={setPage} />
  </section>;
}

const noNearbyLocations: Location[] = [];

function NightDriveMap({ city, route, onClose, children }: { city: NightDriveCity; route: NightDriveCity["routes"][number]; onClose: () => void; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [summary, setSummary] = useState<DrivingSummary | null>(null);
  const [attempt, setAttempt] = useState(0);
  const mapRoute = useMemo(() => resolveNightDriveRoute(city, route), [city, route]);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);
  return <dialog ref={dialog} className="night-drive-map-dialog" aria-labelledby="night-drive-map-title" onCancel={onClose}>
    <header>
      <h2 id="night-drive-map-title">{city.name} · {route.name}</h2>
      <button autoFocus onClick={onClose} aria-label="关闭路线地图"><X size={20} /></button>
    </header>
    <p>{route.stops.length} 站 · 按原顺序规划。使用地点坐标规划道路，出发前请核对实际通行；步行点需另找停车入口。</p>
    {mapRoute.missing.length > 0 && <p role="alert">本次道路规划不含 {mapRoute.missing.join("、")}，其余 {mapRoute.points.length} 站按原序连接。原因详见站点清单。</p>}
    <div role={summary?.status === "error" ? "alert" : "status"} className="night-drive-map-status">
      {summary?.status === "ready" ? `驾车参考：${(summary.distanceMeters / 1000).toFixed(1)} 公里 · 约 ${Math.ceil(summary.durationSeconds / 60)} 分钟（不含拍摄停留）` : summary?.status === "error" ? summary.message : "正在准备站点坐标并规划路线…"}
      <button onClick={() => { setSummary(null); setAttempt((value) => value + 1); }}>重新规划</button>
    </div>
    <MapCanvas key={attempt} selected={undefined} atlasRoute={mapRoute} nearbyLocations={noNearbyLocations} onDrivingSummary={setSummary} />
    {location.hostname !== "atong9.github.io" && <p><a href={`https://atong9.github.io/drive/?browse=night-drive&q=${encodeURIComponent(city.name)}`} target="_blank" rel="noreferrer">在已授权的线上项目打开此城市</a></p>}
    <p className="night-drive-coordinate-credit">坐标来源：高德地图地点查询，仅用于地标定位，不代表停车入口已核验。</p>
    <details><summary>查看全部 {route.stops.length} 站与逐站导航</summary>{children}</details>
  </dialog>;
}
