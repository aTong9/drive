import { Camera, CheckCircle2, ChevronRight, CloudSun, ExternalLink, Footprints, MapPin, Navigation, Search, ShieldCheck, Trash2, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import type { FieldCheck, Location, ResolvedRoute } from "../../types/domain.js";
import { usePlannerStore } from "../../app/store.js";

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

export function LocationView({ locations, routes }: { locations: Location[]; routes: ResolvedRoute[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Location["type"] | "all">("all");
  const [selectedId, setSelectedId] = useState(locations[0]?.id ?? "");
  const [editing, setEditing] = useState(false);
  const fieldChecks = usePlannerStore((state) => state.fieldChecks);
  const saveFieldCheck = usePlannerStore((state) => state.saveFieldCheck);
  const removeFieldCheck = usePlannerStore((state) => state.removeFieldCheck);
  const selectRoute = usePlannerStore((state) => state.selectRoute);
  const selected = locations.find((location) => location.id === selectedId) ?? locations[0];
  const check = selected ? fieldChecks.find((item) => item.locationId === selected.id) : undefined;
  const [draft, setDraft] = useState<CheckDraft>(() => draftFrom(check));

  const filtered = useMemo(() => locations.filter((location) => {
    const needle = query.trim().toLowerCase();
    return (type === "all" || location.type === type) && (!needle || location.name.toLowerCase().includes(needle) || location.city.includes(needle));
  }), [locations, query, type]);

  if (!selected) return null;
  const relatedRoutes = routes.filter((route) => route.route.waypointLocationIds.includes(selected.id));
  const openLocation = (location: Location) => {
    setSelectedId(location.id);
    setEditing(false);
    setDraft(draftFrom(fieldChecks.find((item) => item.locationId === location.id)));
  };
  const submitCheck = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveFieldCheck({ locationId: selected.id, ...draft });
    setEditing(false);
  };

  return (
    <main className="location-page">
      <section className="location-browser">
        <header className="location-head"><div><p className="eyebrow">LOCATION LIBRARY</p><h1>拍摄地点库</h1></div><div><strong>{locations.length}</strong><small>真实地点</small><strong>{fieldChecks.length}</strong><small>实地核验</small></div></header>
        <label className="location-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索地点或城市" /></label>
        <div className="location-filters">
          <button className={type === "all" ? "active" : ""} onClick={() => setType("all")}>全部</button>
          {[...new Set(locations.map((location) => location.type))].map((item) => <button key={item} className={type === item ? "active" : ""} onClick={() => setType(item)}>{typeLabels[item]}</button>)}
        </div>
        <div className="location-grid">
          {filtered.map((location) => {
            const fieldChecked = fieldChecks.some((item) => item.locationId === location.id);
            return <button key={location.id} className={`location-card ${selected.id === location.id ? "active" : ""}`} onClick={() => openLocation(location)}>
              <span className={`location-card-icon type-${location.type}`}><MapPin size={18} /></span>
              <div><span>{typeLabels[location.type]} · {location.city}</span><h2>{location.name}</h2><small><Footprints size={12} /> {location.access.mode === "drive" ? "驾车可达" : "停车后步行"}</small></div>
              <span className={`location-check ${fieldChecked ? "field" : ""}`}>{fieldChecked ? <CheckCircle2 size={13} /> : <ShieldCheck size={13} />}{fieldChecked ? "实地" : "来源"}</span>
            </button>;
          })}
        </div>
      </section>

      <aside className="location-detail">
        <div className="location-detail-hero"><span>{typeLabels[selected.type]}</span><h2>{selected.name}</h2><p><MapPin size={14} /> {selected.province} · {selected.city} · {selected.coordinate.lng.toFixed(6)}, {selected.coordinate.lat.toFixed(6)}</p></div>
        <div className="location-detail-scroll">
          <div className="location-facts">
            <span><CloudSun size={17} /><small>最佳时段</small><strong>{selected.shooting.bestTimes.map((item) => timeLabels[item]).join(" · ")}</strong></span>
            <span><Camera size={17} /><small>拍摄方式</small><strong>{selected.shooting.modes.map((item) => item.replaceAll("-", " ")).join(" · ")}</strong></span>
          </div>
          <section><p className="eyebrow">ACCESS</p><h3>到达方式</h3><p>{selected.access.note}</p></section>
          <section><p className="eyebrow">SHOOTING NOTE</p><h3>拍摄建议</h3><p>{selected.shooting.advice}</p></section>
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
