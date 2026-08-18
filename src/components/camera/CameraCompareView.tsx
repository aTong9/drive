import { Check, GitCompareArrows, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { CameraPreset } from "../../types/domain.js";

const rows: Array<{ label: string; value: (preset: CameraPreset) => string }> = [
  { label: "分辨率", value: (p) => p.settings.resolution }, { label: "帧率", value: (p) => `${p.settings.fps} FPS` },
  { label: "快门", value: (p) => p.settings.shutter }, { label: "光圈", value: (p) => p.settings.aperture ?? "自动" },
  { label: "ISO", value: (p) => `${p.settings.iso.min}–${p.settings.iso.max}` }, { label: "白平衡", value: (p) => `${p.settings.whiteBalanceKelvin}K` },
  { label: "色彩配置", value: (p) => p.settings.profile ?? "标准" }, { label: "编码", value: (p) => p.settings.codec ?? "未指定" },
  { label: "色深", value: (p) => p.settings.colorDepth ?? "未指定" }, { label: "对焦", value: (p) => p.settings.focus ?? "未指定" },
  { label: "防抖", value: (p) => p.settings.stabilization ?? "未指定" }, { label: "收音", value: (p) => p.settings.audio ?? "未指定" },
];

export function CameraCompareView({ presets }: { presets: CameraPreset[] }) {
  const [ids, setIds] = useState(() => presets.slice(0, 3).map((item) => item.id));
  const selected = useMemo(() => ids.map((id) => presets.find((item) => item.id === id)).filter((item): item is CameraPreset => Boolean(item)), [ids, presets]);
  const add = () => { const next = presets.find((item) => !ids.includes(item.id)); if (next && ids.length < 3) setIds([...ids, next.id]); };
  return <section className="camera-compare-workspace"><header><div><p className="eyebrow">SIDE-BY-SIDE</p><h2>参数方案对比</h2><p>最多选择三套方案，直接查看场景之间真正需要改变的设置。</p></div>{ids.length < 3 && <button onClick={add}><Plus size={14} />增加一列</button>}</header>
    <div className="camera-compare-selectors">{ids.map((id, index) => <label key={`${id}-${index}`}>方案 {index + 1}<span><select value={id} onChange={(event) => setIds(ids.map((item, itemIndex) => itemIndex === index ? event.target.value : item))}>{presets.map((preset) => <option key={preset.id} value={preset.id}>{preset.camera} · {preset.scene}</option>)}</select>{ids.length > 2 && <button onClick={() => setIds(ids.filter((_, itemIndex) => itemIndex !== index))} aria-label="移除对比列"><X size={14} /></button>}</span></label>)}</div>
    <div className="camera-compare-table"><div className="camera-compare-row head"><strong>参数</strong>{selected.map((preset) => <div key={preset.id}><GitCompareArrows size={16} /><span><strong>{preset.camera}</strong><small>{preset.scene}</small></span></div>)}</div>{rows.map((row) => { const values = selected.map(row.value); const same = new Set(values).size === 1; return <div className="camera-compare-row" key={row.label}><strong>{row.label}{same && <Check size={11} />}</strong>{values.map((value, index) => <span key={`${row.label}-${selected[index]?.id}`}>{value}</span>)}</div>; })}<div className="camera-compare-row notes"><strong>现场原则</strong>{selected.map((preset) => <p key={preset.id}>{preset.notes}</p>)}</div></div>
  </section>;
}
