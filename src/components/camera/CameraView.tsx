import { Aperture, BookOpen, Camera, Check, ChevronRight, CircleGauge, Copy, Download, ExternalLink, Film, Focus, Gauge, GitCompareArrows, Headphones, Heart, Layers3, Maximize2, Navigation, Plus, Save, Search, ShieldCheck, SlidersHorizontal, Sparkles, Star, SunMedium, ThermometerSun, Wind, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CameraPreset, ResolvedRoute } from "../../types/domain.js";
import { usePlannerStore } from "../../app/store.js";
import { MediaParameterGlossary } from "./MediaParameterGlossary.js";
import { CameraCompareView } from "./CameraCompareView.js";
import { CameraDecisionTools } from "./CameraDecisionTools.js";
import { auditCameraPreset, cameraParameterLinks, clonePresetAsCustom, type CameraParameterKey } from "../../services/cameraDecisionService.js";

const sceneLabels: Record<CameraPreset["scene"], string> = {
  "coast-sunset": "海岸日落",
  "city-night-driving": "城市夜间驾驶",
  "city-night-tripod": "城市夜景定点",
  "forest-stream-static": "林间溪流定点",
  "daylight-general": "MR2 白天通用",
  "daylight-walk": "日间步行",
  "rain-walk": "雨景步行",
  "blue-hour-walk": "蓝调步行"
};

const routeMatchesScene = (route: ResolvedRoute, scene: CameraPreset["scene"]) => {
  if (scene === "city-night-driving") return route.route.executionMode === "drive-only";
  if (scene === "city-night-tripod" || scene === "blue-hour-walk") return route.route.type === "city-night" && route.route.executionMode !== "drive-only";
  if (scene === "coast-sunset") return route.route.type === "coast";
  if (scene === "forest-stream-static") return ["forest", "waterfall", "river", "lake"].includes(route.route.type) && route.route.executionMode !== "drive-only";
  if (scene === "rain-walk") return route.route.captureStyle === "rain-walk";
  if (scene === "daylight-general") return route.route.modes.includes("day");
  return route.route.executionMode !== "drive-only";
};

type CameraWorkspace = "presets" | "glossary" | "compare" | "tools" | "favorites";

export function CameraView({ presets: catalogPresets, routes }: { presets: CameraPreset[]; routes: ResolvedRoute[] }) {
  const customPresets = usePlannerStore((state) => state.customCameraPresets);
  const favoriteIds = usePlannerStore((state) => state.favoriteCameraPresetIds);
  const mrAssignments = usePlannerStore((state) => state.cameraMrAssignments);
  const toggleFavorite = usePlannerStore((state) => state.toggleFavoriteCameraPreset);
  const assignMr = usePlannerStore((state) => state.assignCameraMr);
  const saveCustomPreset = usePlannerStore((state) => state.saveCustomCameraPreset);
  const removeCustomPreset = usePlannerStore((state) => state.removeCustomCameraPreset);
  const presets = useMemo(() => [...catalogPresets, ...customPresets], [catalogPresets, customPresets]);
  const [workspace, setWorkspace] = useState<CameraWorkspace>("presets");
  const [fieldMode, setFieldMode] = useState(false);
  const [parameterKey, setParameterKey] = useState<CameraParameterKey | null>(null);
  const [glossaryQuery, setGlossaryQuery] = useState("");
  const [customName, setCustomName] = useState("");
  const [personalDraft, setPersonalDraft] = useState({ fps: "", shutter: "", aperture: "", isoMin: "", isoMax: "", wb: "" });
  const devices = ["全部设备", ...new Set(presets.map((preset) => preset.camera))];
  const scenes = ["全部场景", ...new Set(presets.map((preset) => sceneLabels[preset.scene]))];
  const [device, setDevice] = useState("全部设备");
  const [scene, setScene] = useState("全部场景");
  const [query, setQuery] = useState("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [selectedId, setSelectedId] = useState(presets.find((preset) => preset.camera.includes("Pocket 3"))?.id ?? presets[0]?.id ?? "");
  const selectRoute = usePlannerStore((state) => state.selectRoute);
  const filtered = useMemo(() => presets.filter((preset) => {
    const needle = query.trim().toLowerCase();
    return (device === "全部设备" || preset.camera === device)
      && (scene === "全部场景" || sceneLabels[preset.scene] === scene)
      && (workspace !== "favorites" || favoriteIds.includes(preset.id))
      && (!needle || `${preset.camera} ${sceneLabels[preset.scene]} ${preset.notes} ${preset.settings.profile ?? ""}`.toLowerCase().includes(needle));
  }), [device, favoriteIds, presets, query, scene, workspace]);
  useEffect(() => { const firstId = filtered[0]?.id; if (firstId && !filtered.some((preset) => preset.id === selectedId)) setSelectedId(firstId); }, [filtered, selectedId]);
  const selected = filtered.find((preset) => preset.id === selectedId) ?? filtered[0] ?? presets[0];
  useEffect(() => { if (selected) setPersonalDraft({ fps: String(selected.settings.fps), shutter: selected.settings.shutter, aperture: selected.settings.aperture ?? "", isoMin: String(selected.settings.iso.min), isoMax: String(selected.settings.iso.max), wb: String(selected.settings.whiteBalanceKelvin) }); }, [selected?.id]);
  if (!selected) return null;
  const presetAudit = auditCameraPreset(selected);
  const explicitRoutes = routes.filter((route) => route.route.cameraPresetIds.includes(selected.id));
  const relatedRoutes = (explicitRoutes.length ? explicitRoutes : routes.filter((route) => routeMatchesScene(route, selected.scene))).slice(0, 8);
  const advancedSettings = [
    ["编码", selected.settings.codec], ["色深", selected.settings.colorDepth], ["曝光模式", selected.settings.exposureMode], ["曝光补偿", selected.settings.exposureCompensation],
    ["对焦", selected.settings.focus], ["稳定方式", selected.settings.stabilization], ["锐化", selected.settings.sharpness === undefined ? undefined : String(selected.settings.sharpness)],
    ["被摄物识别", selected.settings.subjectRecognition], ["APS-C / S35", selected.settings.cropMode], ["斑马线", selected.settings.zebra],
    ["Proxy", selected.settings.proxy], ["Log监看", selected.settings.logMonitoring],
    ["降噪", selected.settings.noiseReduction === undefined ? undefined : String(selected.settings.noiseReduction)], ["滤镜", selected.settings.filter], ["收音", selected.settings.audio]
  ].filter((item): item is string[] => Boolean(item[1]));
  const parameterText = [
    `${selected.camera}｜${sceneLabels[selected.scene]}`,
    `${selected.settings.resolution}｜${selected.settings.fps} FPS｜${selected.settings.shutter}`,
    `ISO ${selected.settings.iso.min}–${selected.settings.iso.max}｜WB ${selected.settings.whiteBalanceKelvin}K｜${selected.settings.aperture ?? "自动光圈"}`,
    ...advancedSettings.map(([label, value]) => `${label}：${value}`),
    `现场原则：${selected.notes}`
  ].join("\n");
  const copyParameters = async () => {
    try { await navigator.clipboard.writeText(parameterText); setCopyStatus("copied"); window.setTimeout(() => setCopyStatus("idle"), 1600); }
    catch { setCopyStatus("error"); }
  };
  const exportChecklist = () => {
    const payload = { exportType: "roadlens-camera-playbook", exportVersion: "1.0.0", exportedAt: new Date().toISOString(), preset: selected, matchedRouteIds: relatedRoutes.map((route) => route.route.id) };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${selected.id}-field-check.json`; document.body.append(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url);
  };
  const explainParameter = (key: CameraParameterKey) => setParameterKey(key);
  const openGlossary = (key: CameraParameterKey) => { setGlossaryQuery(cameraParameterLinks[key].label); setWorkspace("glossary"); setParameterKey(null); };
  const openPreset = (id: string) => { setSelectedId(id); setWorkspace("presets"); window.setTimeout(() => document.querySelector(".camera-library-layout")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0); };
  const saveCopy = () => { const base = clonePresetAsCustom(selected, customName); const copy: CameraPreset = { ...base, settings: { ...base.settings, fps: Number(personalDraft.fps) || base.settings.fps, shutter: personalDraft.shutter || base.settings.shutter, ...(personalDraft.aperture ? { aperture: personalDraft.aperture } : {}), iso: { min: Number(personalDraft.isoMin) || base.settings.iso.min, max: Number(personalDraft.isoMax) || base.settings.iso.max }, whiteBalanceKelvin: Number(personalDraft.wb) || base.settings.whiteBalanceKelvin } }; saveCustomPreset(copy); setSelectedId(copy.id); setCustomName(""); };
  const advancedParameterKey = (label: string): CameraParameterKey | undefined => ({ "编码": "codec", "色深": "colorDepth", "对焦": "focus", "稳定方式": "stabilization", "收音": "audio", "滤镜": "shutter" } as Partial<Record<string, CameraParameterKey>>)[label];

  return <main className="camera-library-page">
    <header className="camera-library-head"><div><p className="eyebrow">CAMERA PLAYBOOK</p><h1>相机参数库</h1><p>从设备能力出发，按场景选择参数，再用现场核验完成最后判断。</p></div><dl><div><dt>设备</dt><dd>{devices.length - 1}</dd></div><div><dt>参数方案</dt><dd>{presets.length}</dd></div><div><dt>场景覆盖</dt><dd>{scenes.length - 1}</dd></div></dl></header>
    <nav className="camera-workspace-tabs" aria-label="相机参数工作区">
      <button className={workspace === "presets" ? "active" : ""} onClick={() => setWorkspace("presets")}><Camera size={16} /><span>拍摄预设<small>按设备和场景选择</small></span></button>
      <button className={workspace === "glossary" ? "active" : ""} onClick={() => { setGlossaryQuery(""); setWorkspace("glossary"); }}><BookOpen size={16} /><span>参数词典<small>视频与音频知识</small></span></button>
      <button className={workspace === "compare" ? "active" : ""} onClick={() => setWorkspace("compare")}><GitCompareArrows size={16} /><span>参数对比<small>最多三套方案</small></span></button>
      <button className={workspace === "tools" ? "active" : ""} onClick={() => setWorkspace("tools")}><SlidersHorizontal size={16} /><span>决策工具<small>场景生成与曝光</small></span></button>
      <button className={workspace === "favorites" ? "active" : ""} onClick={() => setWorkspace("favorites")}><Heart size={16} /><span>我的收藏<small>{favoriteIds.length}套常用方案</small></span></button>
    </nav>
    {(workspace === "presets" || workspace === "favorites") && <>
    <section className="camera-library-flow" aria-label="参数使用流程"><span><b>01</b>选择设备</span><i /><span><b>02</b>匹配场景</span><i /><span><b>03</b>应用起点</span><i /><span><b>04</b>现场核验</span></section>

    <section className="camera-library-toolbar">
      <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索设备、场景、色彩配置或拍摄提示" /></label>
      <div className="camera-device-tabs">{devices.map((item) => <button key={item} className={device === item ? "active" : ""} onClick={() => setDevice(item)}>{item}</button>)}</div>
      <div className="camera-scene-tabs">{scenes.map((item) => <button key={item} className={scene === item ? "active" : ""} onClick={() => setScene(item)}>{item}</button>)}</div>
    </section>

    <div className="camera-library-layout">
      <section className="camera-preset-browser"><header><div><small>MATCHED PRESETS</small><h2>{workspace === "favorites" ? "收藏与个人预设" : device === "全部设备" ? "全部设备方案" : device}</h2></div><span>{filtered.length} 套可用</span></header>
        <div className="camera-preset-list">{filtered.map((preset) => <button key={preset.id} className={selected.id === preset.id ? "active" : ""} onClick={() => setSelectedId(preset.id)}><span className="camera-preset-icon"><Camera size={19} /></span><div><small>{sceneLabels[preset.scene]}{Object.entries(mrAssignments).find(([, id]) => id === preset.id)?.[0] ? ` · ${Object.entries(mrAssignments).find(([, id]) => id === preset.id)?.[0]}` : ""}</small><strong>{preset.camera}{preset.id.startsWith("custom-") ? " · 个人" : ""}</strong><p>{preset.notes}</p><footer><span>{preset.settings.resolution}</span><span>{preset.settings.fps} FPS</span><span>{preset.settings.profile ?? "标准色彩"}</span></footer></div>{favoriteIds.includes(preset.id) ? <Star size={16} fill="currentColor" /> : <ChevronRight size={16} />}</button>)}</div>
        {!filtered.length && <div className="camera-empty">没有符合当前筛选条件的参数方案</div>}
      </section>

      {filtered.length > 0 && <aside className="camera-playbook-detail">
        <header><span><Camera size={24} /></span><div><small>{sceneLabels[selected.scene]}</small><h2>{selected.camera}</h2><p>{selected.id.toUpperCase()}</p></div>{selected.sourceUrl && <a href={selected.sourceUrl} target="_blank" rel="noreferrer" title="查看设备官方规格"><ExternalLink size={15} /></a>}</header>
        <div className="camera-playbook-actions"><button onClick={copyParameters}><Copy size={13} />{copyStatus === "copied" ? "已复制参数" : copyStatus === "error" ? "复制失败" : "复制参数"}</button><button onClick={exportChecklist}><Download size={13} />导出现场清单</button><button className={favoriteIds.includes(selected.id) ? "active" : ""} onClick={() => toggleFavorite(selected.id)}><Heart size={13} fill={favoriteIds.includes(selected.id) ? "currentColor" : "none"} />{favoriteIds.includes(selected.id) ? "已收藏" : "收藏"}</button><button onClick={() => setFieldMode(true)}><Maximize2 size={13} />现场模式</button></div>
        <div className="camera-detail-body">
          <section><div className="camera-section-title"><SlidersHorizontal size={15} /><div><small>BASE SETTINGS · 点击参数查看解释</small><h3>核心拍摄参数</h3></div></div><div className="camera-core-grid"><button onClick={() => explainParameter("resolution")}><Film size={16} /><small>画幅</small><strong>{selected.settings.resolution}</strong></button><button onClick={() => explainParameter("fps")}><CircleGauge size={16} /><small>帧率</small><strong>{selected.settings.fps} FPS</strong></button><button onClick={() => explainParameter("shutter")}><Gauge size={16} /><small>快门</small><strong>{selected.settings.shutter}</strong></button><button onClick={() => explainParameter("aperture")}><Aperture size={16} /><small>光圈</small><strong>{selected.settings.aperture ?? "自动"}</strong></button><button onClick={() => explainParameter("iso")}><Focus size={16} /><small>ISO</small><strong>{selected.settings.iso.min}–{selected.settings.iso.max}</strong></button><button onClick={() => explainParameter("whiteBalance")}><ThermometerSun size={16} /><small>白平衡</small><strong>{selected.settings.whiteBalanceKelvin}K</strong></button></div></section>
          {advancedSettings.length > 0 && <section><div className="camera-section-title"><Layers3 size={15} /><div><small>ADVANCED CONTROL · 可点击项目带有解释</small><h3>高级控制</h3></div></div><dl className="camera-advanced-grid">{advancedSettings.map(([label = "参数", value = ""]) => { const key = advancedParameterKey(label); return <div key={label} className={key ? "explainable" : ""} onClick={key ? () => explainParameter(key) : undefined}><dt>{label}</dt><dd>{label === "收音" ? <Headphones size={13} /> : label === "滤镜" ? <SunMedium size={13} /> : <Sparkles size={13} />}{value}</dd></div>; })}</dl></section>}
          <section className="camera-field-note"><Wind size={16} /><div><small>现场调整原则</small><p>{selected.notes}</p></div></section>
          <section className="camera-preset-audit"><div className="camera-section-title"><ShieldCheck size={15} /><div><small>PRESET HEALTH</small><h3>预设完整性检查</h3></div><strong>{presetAudit.score}</strong></div><div className="camera-audit-meter"><i style={{ width: `${presetAudit.score}%` }} /></div>{presetAudit.warnings.length ? <ul>{presetAudit.warnings.map((item) => <li key={item}><span>需补充</span>{item}</li>)}</ul> : <p>当前方案未发现明显的参数链路缺口。</p>}{presetAudit.strengths.map((item) => <p key={item}><Check size={13} />{item}</p>)}</section>
          <section><div className="camera-section-title"><SlidersHorizontal size={15} /><div><small>SETUP ORDER</small><h3>开拍前设置顺序</h3></div></div><ol className="camera-check-list">{(selected.setup ?? ["设定分辨率、帧率与色彩配置", "按现场频闪确定快门", "固定白平衡并设置 ISO 上限", "回放短片后再正式录制"]).map((item, index) => <li key={item}><span>{index + 1}</span>{item}</li>)}</ol></section>
          <section><div className="camera-section-title"><ShieldCheck size={15} /><div><small>FIELD VERIFICATION</small><h3>现场核验</h3></div></div><ul className="camera-verify-list">{(selected.fieldChecks ?? ["示波器与斑马纹确认高光", "放大检查对焦和运动模糊", "连续镜头白平衡不漂移", "试听环境声和风噪"]).map((item) => <li key={item}><Check size={13} />{item}</li>)}</ul></section>
          <section><div className="camera-section-title"><Navigation size={15} /><div><small>SCENE MATCH</small><h3>适用路线</h3></div></div>{relatedRoutes.length ? relatedRoutes.map((route) => <button className="camera-route" key={route.route.id} onClick={() => selectRoute(route.route.id)}><Navigation size={15} /><span>{route.route.name}<small>{route.route.cities.join(" · ")} · 约 {route.route.estimatedDurationMinutes} 分钟</small></span><ChevronRight size={15} /></button>) : <p className="camera-no-route">暂无匹配路线</p>}</section>
          <section><div className="camera-section-title"><Save size={15} /><div><small>PERSONAL PRESET</small><h3>修改、收藏与相机MR</h3></div></div><div className="camera-personal-controls"><label className="name">个人预设名称<input value={customName} onChange={(event) => setCustomName(event.target.value)} placeholder="例如：阴天海岸HDR" /></label><div className="camera-personal-values"><label>FPS<input value={personalDraft.fps} onChange={(e) => setPersonalDraft({ ...personalDraft, fps: e.target.value })} /></label><label>快门<input value={personalDraft.shutter} onChange={(e) => setPersonalDraft({ ...personalDraft, shutter: e.target.value })} /></label><label>光圈<input value={personalDraft.aperture} onChange={(e) => setPersonalDraft({ ...personalDraft, aperture: e.target.value })} /></label><label>ISO最低<input value={personalDraft.isoMin} onChange={(e) => setPersonalDraft({ ...personalDraft, isoMin: e.target.value })} /></label><label>ISO最高<input value={personalDraft.isoMax} onChange={(e) => setPersonalDraft({ ...personalDraft, isoMax: e.target.value })} /></label><label>白平衡K<input value={personalDraft.wb} onChange={(e) => setPersonalDraft({ ...personalDraft, wb: e.target.value })} /></label></div><button onClick={saveCopy}><Plus size={13} />保存为个人预设</button><div className="camera-mr-buttons">{(["MR1", "MR2", "MR3"] as const).map((slot) => <button key={slot} className={mrAssignments[slot] === selected.id ? "active" : ""} onClick={() => assignMr(slot, selected.id)}>{slot}<small>{mrAssignments[slot] === selected.id ? "当前" : "写入"}</small></button>)}</div>{selected.id.startsWith("custom-") && <button className="danger" onClick={() => { removeCustomPreset(selected.id); setSelectedId(catalogPresets[0]?.id ?? ""); }}><X size={13} />删除个人预设</button>}</div></section>
        </div>
      </aside>}
    </div>
    </>}
    {workspace === "glossary" && <MediaParameterGlossary key={glossaryQuery} initialQuery={glossaryQuery} />}
    {workspace === "compare" && <CameraCompareView presets={presets} />}
    {workspace === "tools" && <CameraDecisionTools presets={presets} onSelectPreset={openPreset} />}
    {parameterKey && <div className="camera-parameter-backdrop" onClick={() => setParameterKey(null)}><aside onClick={(event) => event.stopPropagation()}><button onClick={() => setParameterKey(null)}><X size={16} /></button><small>{cameraParameterLinks[parameterKey].label}</small><h2>{cameraParameterLinks[parameterKey].short}</h2><p>{cameraParameterLinks[parameterKey].why}</p><button className="primary" onClick={() => openGlossary(parameterKey)}>在参数词典中查看完整说明<BookOpen size={14} /></button></aside></div>}
    {fieldMode && <div className="camera-field-mode"><header><div><small>FIELD MODE</small><h2>{selected.camera} · {sceneLabels[selected.scene]}</h2></div><button onClick={() => setFieldMode(false)}><X size={20} /></button></header><div className="camera-field-values"><article><small>画幅 / 帧率</small><strong>{selected.settings.resolution}<br />{selected.settings.fps} FPS</strong></article><article><small>快门 / 光圈</small><strong>{selected.settings.shutter}<br />{selected.settings.aperture ?? "自动"}</strong></article><article><small>ISO / WB</small><strong>{selected.settings.iso.min}–{selected.settings.iso.max}<br />{selected.settings.whiteBalanceKelvin}K</strong></article><article><small>对焦 / 防抖</small><strong>{selected.settings.focus ?? "检查预设"}<br />{selected.settings.stabilization ?? "检查预设"}</strong></article></div><section><h3>现场原则</h3><p>{selected.notes}</p></section><ol>{(selected.fieldChecks ?? []).map((item) => <li key={item}><Check size={18} />{item}</li>)}</ol><footer><button onClick={copyParameters}><Copy size={16} />复制整套参数</button></footer></div>}
  </main>;
}
