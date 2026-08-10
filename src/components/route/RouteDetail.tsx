import { CalendarPlus, Camera, CarFront, Check, ChevronRight, Clock3, CloudSun, Copy, ExternalLink, Footprints, Navigation, Share2, ShieldCheck, Trees, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import type { DrivingSummary, ResolvedRoute } from "../../types/domain.js";
import { usePlannerStore } from "../../app/store.js";
import { createAmapNavigationUrl, createRouteShareUrl } from "../../services/routeShareService.js";
import { GeoPhotoThumbnail } from "../common/GeoPhotoThumbnail.js";
import { CityWeather } from "../common/CityWeather.js";

const timeLabels: Record<string, string> = { sunrise: "日出", morning: "上午", "golden-hour": "黄金时刻", sunset: "日落", "blue-hour": "蓝调时刻", night: "夜间" };
const weatherLabels: Record<string, string> = { sunny: "晴朗", cloudy: "多云", "after-rain": "雨后", fog: "薄雾", rain: "雨天" };
const captureLabels = { "scenic-drive": "风景驾车", "rain-walk": "雨景步行", "stationary-nature": "林间定点" } as const;

function formatDrivingTime(seconds: number) {
  const minutes = Math.max(1, Math.round(seconds / 60));
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return hours ? `${hours}小时${remainder ? `${remainder}分` : ""}` : `${minutes}分钟`;
}

export function RouteDetail({ selected, drivingSummary }: { selected: ResolvedRoute; drivingSummary: DrivingSummary | null }) {
  const closeDetail = usePlannerStore((state) => state.closeDetail);
  const addPlan = usePlannerStore((state) => state.addPlan);
  const setView = usePlannerStore((state) => state.setView);
  const planned = usePlannerStore((state) => state.plans.some((plan) => plan.routeId === selected.route.id));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "shared" | "copied" | "error">("idle");
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [scheduledDate, setScheduledDate] = useState(tomorrow);
  const [objective, setObjective] = useState(`完成「${selected.route.name}」拍摄素材`);
  const { route, waypoints, cameraPresets } = selected;
  const driveOnly = route.executionMode === "drive-only";
  const opensAsDrivingRoute = route.captureStyle === "scenic-drive";
  const usesWgs84 = waypoints.some((waypoint) => waypoint.coordinate.crs === "WGS84");
  const amapNavigationUrl = createAmapNavigationUrl(waypoints, opensAsDrivingRoute);
  const accessOnlyLabel = usesWgs84 ? "公共交通 · 步行连接" : "步行景区 · 导航锚点";
  const accessOnlyMessage = usesWgs84 ? "展示真实地点与行程顺序，不调用高德大陆驾车规划" : "仅展示入口与景区范围，不生成景区内驾车路线";

  useEffect(() => {
    setDialogOpen(false);
    setShareStatus("idle");
    setScheduledDate(tomorrow);
    setObjective(`完成「${selected.route.name}」拍摄素材`);
  }, [selected.route.id]);

  const submitPlan = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addPlan({ routeId: route.id, scheduledDate, objective: objective.trim() });
    setDialogOpen(false);
  };

  const shareRoute = async () => {
    const url = createRouteShareUrl(route.id, window.location.href);
    try {
      if (navigator.share) {
        await navigator.share({ title: route.name, text: `查看这条拍摄路线：${route.name}`, url });
        setShareStatus("shared");
      } else {
        await navigator.clipboard.writeText(url);
        setShareStatus("copied");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareStatus("error");
    }
  };

  return (
    <aside className="detail-panel">
      <div className="detail-hero">
        <GeoPhotoThumbnail id={route.id} label={route.name} type={route.type} points={waypoints} variant="hero" />
        <button className="detail-close" onClick={closeDetail} aria-label="关闭详情"><X size={18} /></button>
        <div className="detail-hero-glow" />
        <div className="detail-hero-copy">
          <span className="hero-badge"><ShieldCheck size={13} /> 来源核验</span>
          <span className={`hero-capture capture-${route.captureStyle} ${driveOnly ? "is-drive-only" : ""}`}>{driveOnly ? "纯驾车 · 无需下车" : captureLabels[route.captureStyle]}</span>
          <p>ROUTE / {route.id.toUpperCase()}</p>
          <h2>{route.name}</h2>
          <div>
            <span><Clock3 size={14} /> {drivingSummary?.status === "ready" ? formatDrivingTime(drivingSummary.durationSeconds) : `行程约 ${route.estimatedDurationMinutes} 分钟`}</span>
            <span><Navigation size={14} /> {drivingSummary?.status === "ready" ? `${(drivingSummary.distanceMeters / 1000).toFixed(1)} 公里` : `${waypoints.length} 个${driveOnly ? "道路锚点" : "拍摄点"}`}</span>
          </div>
        </div>
      </div>

      <div className="detail-scroll">
        <section className="condition-grid">
          <div><span className="condition-icon"><CloudSun size={18} /></span><small>最佳条件</small><strong>{route.best.weather.map((item) => weatherLabels[item]).join(" · ")}</strong></div>
          <div><span className="condition-icon"><Clock3 size={18} /></span><small>推荐时段</small><strong>{route.best.times.map((item) => timeLabels[item]).join(" · ")}</strong></div>
        </section>

        <section className={`driving-result ${drivingSummary?.status ?? "idle"}`} aria-live="polite">
          <div>{drivingSummary?.status === "access-only" ? <Trees size={16} /> : <Navigation size={16} />}<span><small>{drivingSummary?.status === "access-only" ? accessOnlyLabel : "高德实时驾车规划"}</small><strong>{drivingSummary?.status === "access-only" ? accessOnlyMessage : drivingSummary?.status === "ready" ? `${(drivingSummary.distanceMeters / 1000).toFixed(1)} 公里 · ${formatDrivingTime(drivingSummary.durationSeconds)}` : drivingSummary?.status === "error" ? drivingSummary.message : "正在计算道路与通行时间…"}</strong></span></div>
          {drivingSummary?.status === "ready" && <small>{drivingSummary.tollsYuan > 0 ? `预计收费 ¥${drivingSummary.tollsYuan}` : "预计无收费"}{drivingSummary.hasRestriction ? " · 存在无法规避的限行路段" : " · 已规避限行"}</small>}
        </section>

        <CityWeather cities={route.cities} compact />

        <section className="detail-section">
          <div className="section-title"><div><p>ITINERARY</p><h3>{driveOnly ? "连续驾车行程" : "拍摄行程"}</h3></div><span>{waypoints.length} {driveOnly ? "WAYPOINTS" : "STOPS"}</span></div>
          <div className="timeline">
            {waypoints.map((waypoint, index) => (
              <div className="timeline-item" key={waypoint.id}>
                <span className="timeline-index">{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{waypoint.name}</strong><small>{driveOnly ? <CarFront size={12} /> : <Footprints size={12} />} {waypoint.access.note}</small></div>
                <ChevronRight size={16} />
              </div>
            ))}
          </div>
        </section>

        <section className="detail-section">
          <div className="section-title"><div><p>CAMERA KIT</p><h3>推荐设备参数</h3></div><Camera size={18} /></div>
          {cameraPresets.map((preset) => (
            <div className="camera-preset" key={preset.id}>
              <div className="camera-icon"><Camera size={20} /></div>
              <div><strong>{preset.camera}</strong><small>{preset.scene.replaceAll("-", " ")}</small></div>
              <div className="camera-values"><span>{preset.settings.resolution}</span><span>{preset.settings.fps} FPS</span><span>ISO {preset.settings.iso.min}–{preset.settings.iso.max}</span></div>
            </div>
          ))}
        </section>

        <section className="creator-note">
          <span>创作提示</span>
          <p>{route.shootAdvice}</p>
        </section>
      </div>

      <div className="detail-action">
        <div className="detail-action-buttons">
          <button className={`detail-plan-button ${planned ? "is-planned" : ""}`} onClick={() => planned ? setView("plans") : setDialogOpen(true)}>
            {planned ? <Check size={18} /> : <CalendarPlus size={18} />}
            {planned ? "查看拍摄计划" : "加入拍摄计划"}
          </button>
          <button className="detail-share-button" onClick={() => void shareRoute()} aria-label={`分享路线：${route.name}`}>
            {shareStatus === "copied" ? <Copy size={18} /> : <Share2 size={18} />}
            {shareStatus === "copied" ? "已复制" : shareStatus === "shared" ? "已分享" : shareStatus === "error" ? "重试分享" : "分享路线"}
          </button>
          {amapNavigationUrl && <a className="detail-amap-button" href={amapNavigationUrl} target="_blank" rel="noreferrer" aria-label={`在高德地图打开：${route.name}`}>
            <ExternalLink size={18} />
            高德地图打开
          </a>}
        </div>
        <small>{shareStatus === "error" ? "无法调用分享或剪贴板，请检查浏览器权限" : amapNavigationUrl && driveOnly && waypoints.length > 3 ? "高德支持 1 个途经点 · 完整锚点与拍摄说明请保留本站分享链接" : "路线仍需实地核验 · 出发前查看实时路况"}</small>
      </div>

      {dialogOpen && (
        <div className="plan-dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setDialogOpen(false)}>
          <form className="plan-dialog" onSubmit={submitPlan}>
            <button type="button" className="plan-dialog-close" onClick={() => setDialogOpen(false)} aria-label="关闭计划窗口"><X size={17} /></button>
            <p className="eyebrow">NEW SHOOT PLAN</p>
            <h3>安排下一次拍摄</h3>
            <span className="plan-route-name">{route.name}</span>
            <label>拍摄日期<input type="date" min={new Date().toISOString().slice(0, 10)} value={scheduledDate} onChange={(event) => setScheduledDate(event.target.value)} required /></label>
            <label>创作目标<textarea value={objective} onChange={(event) => setObjective(event.target.value)} rows={3} minLength={5} required /></label>
            <div className="plan-dialog-summary"><span><Clock3 size={14} /> 行程约 {route.estimatedDurationMinutes} 分钟</span><span><Camera size={14} /> {cameraPresets.length} 套设备参数</span></div>
            <button type="submit"><CalendarPlus size={17} /> 保存拍摄计划</button>
          </form>
        </div>
      )}
    </aside>
  );
}
