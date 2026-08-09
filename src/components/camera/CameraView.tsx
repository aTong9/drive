import { Aperture, Camera, CheckCircle2, ChevronRight, CircleGauge, Film, Focus, Gauge, Navigation, Search, SunMedium, ThermometerSun } from "lucide-react";
import { useMemo, useState } from "react";
import type { CameraPreset, ResolvedRoute } from "../../types/domain.js";
import { usePlannerStore } from "../../app/store.js";

const sceneLabels: Record<CameraPreset["scene"], string> = {
  "coast-sunset": "海岸日落",
  "city-night-driving": "城市夜间驾驶",
  "city-night-tripod": "城市夜景三脚架",
  "forest-stream-static": "林间溪流定点"
};

export function CameraView({ presets, routes }: { presets: CameraPreset[]; routes: ResolvedRoute[] }) {
  const cameras = ["全部设备", ...new Set(presets.map((preset) => preset.camera))];
  const [camera, setCamera] = useState("全部设备");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(presets[0]?.id ?? "");
  const selectRoute = usePlannerStore((state) => state.selectRoute);
  const filtered = useMemo(() => presets.filter((preset) => {
    const needle = query.trim().toLowerCase();
    return (camera === "全部设备" || preset.camera === camera) && (!needle || preset.camera.toLowerCase().includes(needle) || sceneLabels[preset.scene].includes(needle));
  }), [camera, presets, query]);
  const selected = presets.find((preset) => preset.id === selectedId) ?? filtered[0] ?? presets[0];
  if (!selected) return null;
  const relatedRoutes = routes.filter((route) => route.route.cameraPresetIds.includes(selected.id));

  return (
    <main className="camera-page">
      <section className="camera-browser">
        <header className="camera-head"><div><p className="eyebrow">CAMERA PRESETS</p><h1>场景参数库</h1><p>不是万能参数，而是每次现场判断的可靠起点。</p></div><div className="camera-count"><strong>{presets.length}</strong><small>场景预设</small></div></header>
        <label className="camera-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索设备或拍摄场景" /></label>
        <div className="camera-tabs">{cameras.map((item) => <button key={item} className={camera === item ? "active" : ""} onClick={() => setCamera(item)}>{item}</button>)}</div>
        <div className="preset-grid">
          {filtered.map((preset) => <button key={preset.id} className={`preset-card ${selected.id === preset.id ? "active" : ""}`} onClick={() => setSelectedId(preset.id)}>
            <div className="preset-card-top"><span><Camera size={17} /></span><small>{sceneLabels[preset.scene]}</small></div>
            <h2>{preset.camera}</h2>
            <p>{preset.notes}</p>
            <div><span>{preset.settings.resolution}</span><span>{preset.settings.fps} FPS</span><span>{preset.settings.shutter}</span></div>
          </button>)}
        </div>
      </section>

      <aside className="camera-detail">
        <div className="camera-detail-hero"><span className="camera-hero-icon"><Camera size={29} /></span><p>{sceneLabels[selected.scene]}</p><h2>{selected.camera}</h2><small>PRESET / {selected.id.toUpperCase()}</small></div>
        <div className="camera-detail-scroll">
          <section className="exposure-grid">
            <div><Film size={18} /><small>分辨率</small><strong>{selected.settings.resolution}</strong></div>
            <div><CircleGauge size={18} /><small>帧率</small><strong>{selected.settings.fps} FPS</strong></div>
            <div><Gauge size={18} /><small>快门</small><strong>{selected.settings.shutter}</strong></div>
            <div><Aperture size={18} /><small>光圈</small><strong>{selected.settings.aperture ?? "自动"}</strong></div>
            <div><Focus size={18} /><small>ISO 范围</small><strong>{selected.settings.iso.min}–{selected.settings.iso.max}</strong></div>
            <div><ThermometerSun size={18} /><small>白平衡</small><strong>{selected.settings.whiteBalanceKelvin}K</strong></div>
          </section>
          {selected.settings.profile && <div className="profile-bar"><SunMedium size={17} /><span><small>色彩配置</small><strong>{selected.settings.profile}</strong></span><CheckCircle2 size={15} /></div>}
          <section className="camera-note"><p className="eyebrow">FIELD NOTES</p><h3>现场调整提示</h3><p>{selected.notes}</p></section>
          <section><p className="eyebrow">EXPOSURE LOGIC</p><h3>参数逻辑</h3><ul><li>快门约为帧率两倍的倒数，保留自然运动模糊。</li><li>优先保护高光，再在允许范围内提升 ISO。</li><li>固定白平衡，避免连续镜头出现色温漂移。</li></ul></section>
          <section><p className="eyebrow">RELATED ROUTES</p><h3>适用路线</h3>{relatedRoutes.length ? relatedRoutes.map((route) => <button className="camera-route" key={route.route.id} onClick={() => selectRoute(route.route.id)}><Navigation size={15} /><span>{route.route.name}<small>{route.route.cities.join(" · ")} · 约 {route.route.estimatedDurationMinutes} 分钟</small></span><ChevronRight size={15} /></button>) : <p className="camera-no-route">暂无关联路线</p>}</section>
        </div>
      </aside>
    </main>
  );
}
