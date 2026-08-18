import { ExternalLink, Film, Headphones, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { filterMediaParameters, mediaParameterEntries, mediaParameterSources, type MediaParameterDomain } from "../../services/mediaParameterService.js";

export function MediaParameterGlossary({ initialQuery = "" }: { initialQuery?: string }) {
  const [domain, setDomain] = useState<MediaParameterDomain>("video");
  const [query, setQuery] = useState(initialQuery);
  const entries = useMemo(() => filterMediaParameters(domain, query), [domain, query]);
  const grouped = useMemo(() => entries.reduce((result, entry) => {
    const group = result.get(entry.category) ?? [];
    group.push(entry);
    result.set(entry.category, group);
    return result;
  }, new Map<string, typeof entries>()), [entries]);
  const videoCount = mediaParameterEntries.filter((item) => item.domain === "video").length;
  const audioCount = mediaParameterEntries.length - videoCount;

  return <section className="media-glossary">
    <header><div><p className="eyebrow">VIDEO & AUDIO PARAMETERS</p><h2>影音参数词典</h2><p>理解参数之间的关系，再决定拍摄、剪辑与交付设置。行业知识用于建立判断，不替代具体设备和平台的最新规格。</p></div><dl><div><dt>视频主题</dt><dd>{videoCount}</dd></div><div><dt>音频主题</dt><dd>{audioCount}</dd></div></dl></header>
    <div className="media-glossary-toolbar"><div role="tablist" aria-label="参数领域"><button className={domain === "video" ? "active" : ""} onClick={() => setDomain("video")}><Film size={16} />视频行业</button><button className={domain === "audio" ? "active" : ""} onClick={() => setDomain("audio")}><Headphones size={16} />音频行业</button></div><label><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索 4K、HDR10、HLG、10-bit、LUFS、48 kHz…" /></label></div>
    <aside className="media-glossary-principle"><strong>先分清四个层级</strong><span>采集参数 → 项目/时间线 → 母版编码 → 平台转码与播放</span><p>前一层有更高规格，不代表后面每一层都会保留；例如 4K 只说明像素数量，HDR10 还需要 PQ、Rec.2020、10-bit 与正确元数据。</p></aside>
    <div className="media-glossary-groups">{[...grouped].map(([category, items]) => <section key={category}><header><h3>{category}</h3><span>{items.length} 项</span></header><div>{items.map((entry) => <article key={entry.id}><header><h4>{entry.term}</h4><span>{entry.values}</span></header><dl><div><dt>是什么</dt><dd>{entry.meaning}</dd></div><div><dt>实际影响</dt><dd>{entry.impact}</dd></div><div className="recommended"><dt>你的建议</dt><dd>{entry.recommendation}</dd></div></dl></article>)}</div></section>)}</div>
    {!entries.length && <div className="media-glossary-empty">没有匹配的参数，请尝试更短的关键词。</div>}
    <footer><strong>行业依据 · 核对日期 2026-08-18</strong><div>{mediaParameterSources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<ExternalLink size={11} /></a>)}</div></footer>
  </section>;
}
