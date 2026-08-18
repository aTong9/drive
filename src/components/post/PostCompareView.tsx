import { GitCompareArrows } from "lucide-react";
import { useState } from "react";
import { postPipelineProfiles } from "../../services/postDecisionService.js";

const rows = [
  ["输入素材", "input"], ["项目色彩管理", "project"], ["时间线空间", "timeline"], ["输出空间", "output"], ["视频导出", "render"], ["音频导出", "audio"]
] as const;

export function PostCompareView() {
  const [ids, setIds] = useState([postPipelineProfiles[0]!.id, postPipelineProfiles[1]!.id]);
  const selected = ids.map((id) => postPipelineProfiles.find((item) => item.id === id)!).filter(Boolean);
  return <section className="post-workspace post-compare"><header><div><p className="eyebrow">PIPELINE COMPARE</p><h2>后期链路对比</h2><p>横向核对输入解释、工作空间与交付标签，避免把HLG、PQ和Rec.709混为一谈。</p></div><GitCompareArrows size={28} /></header><div className="post-compare-selectors">{ids.map((id, index) => <label key={`${id}-${index}`}>方案 {index + 1}<select value={id} onChange={(event) => setIds(ids.map((value, itemIndex) => itemIndex === index ? event.target.value : value))}>{postPipelineProfiles.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>)}{ids.length < 3 && <button onClick={() => setIds([...ids, postPipelineProfiles.find((item) => !ids.includes(item.id))?.id ?? postPipelineProfiles[0]!.id])}>+ 第三套方案</button>}</div><div className="post-compare-table"><div className="head"><strong>参数</strong>{selected.map((item) => <strong key={item.id}>{item.name}</strong>)}</div>{rows.map(([label, key]) => <div key={key}><b>{label}</b>{selected.map((item) => <span key={item.id}>{item[key]}</span>)}</div>)}</div></section>;
}
