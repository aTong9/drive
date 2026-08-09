import { ArrowUpRight, CarFront, ExternalLink, Footprints, Headphones, Search, Sparkles, Trees, Video, Videotape } from "lucide-react";
import { useMemo, useState } from "react";
import { youtubeCreatorResearch, type CreatorCategory } from "../../services/youtubeCreatorService.js";

const categories: Array<{ value: CreatorCategory | "all"; label: string; icon: typeof Video }> = [
  { value: "all", label: "全部", icon: Videotape },
  { value: "scenic-drive", label: "风景驾车", icon: CarFront },
  { value: "rain-walk", label: "雨天步行", icon: Footprints },
  { value: "stationary-nature", label: "自然定点", icon: Trees },
  { value: "urban-walk", label: "城市步行", icon: Footprints },
  { value: "guided-walk", label: "路线导览", icon: Video },
  { value: "cinematic-landscape", label: "电影风景", icon: Sparkles }
];

const categoryLabels = Object.fromEntries(categories.map((item) => [item.value, item.label])) as Record<CreatorCategory | "all", string>;

export function CreatorView() {
  const [category, setCategory] = useState<CreatorCategory | "all">("all");
  const [query, setQuery] = useState("");
  const creators = useMemo(() => youtubeCreatorResearch.creators.filter((creator) => {
    const needle = query.trim().toLowerCase();
    return (category === "all" || creator.category === category) && (!needle || creator.name.toLowerCase().includes(needle) || creator.region.toLowerCase().includes(needle) || creator.positioning.toLowerCase().includes(needle));
  }), [category, query]);

  return <main className="creator-page">
    <header className="creator-hero">
      <div><p className="eyebrow">GLOBAL CREATOR FIELD NOTES</p><h1>全球影像创作者<br /><em>为什么有人愿意一直看</em></h1><p>不是复制爆款，而是拆解与你的风景驾车、雨天步行、自然定点和电影感旅行最相关的观看价值。</p></div>
      <div className="creator-summary"><span><strong>{youtubeCreatorResearch.creators.length}</strong><small>代表频道</small></span><span><strong>6</strong><small>内容模型</small></span><span><strong>3</strong><small>可复用维度</small></span></div>
    </header>

    <section className="creator-method"><Headphones size={19} /><div><strong>如何阅读这份分析</strong><p>{youtubeCreatorResearch.methodology}</p></div><small>核验日期 {youtubeCreatorResearch.accessedAt}</small></section>

    <section className="creator-toolbar">
      <div className="creator-categories">{categories.map(({ value, label, icon: Icon }) => <button key={value} className={category === value ? "active" : ""} onClick={() => setCategory(value)}><Icon size={14} />{label}</button>)}</div>
      <label><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索频道、地区或定位" /></label>
    </section>

    <section className="creator-grid">
      {creators.map((creator, index) => <article className={`creator-card category-${creator.category}`} key={creator.id}>
        <header><span className="creator-index">{String(index + 1).padStart(2, "0")}</span><div><small>{categoryLabels[creator.category]} · {creator.region}</small><h2>{creator.name}</h2></div><a href={creator.channelUrl} target="_blank" rel="noreferrer" aria-label={`打开 ${creator.name} YouTube 频道`}><Videotape size={17} /></a></header>
        <p className="creator-positioning">{creator.positioning}</p>
        <a className="creator-proof" href={creator.representative.url} target="_blank" rel="noreferrer"><Video size={15} /><span><small>代表内容 / 公开表现</small><strong>{creator.representative.title}</strong><p>{creator.representative.observedPerformance}</p></span><ArrowUpRight size={14} /></a>
        <section><h3>为什么获得播放</h3><ol>{creator.whyItWorks.map((reason, reasonIndex) => <li key={reason}><i>{reasonIndex + 1}</i><span>{reason}</span></li>)}</ol></section>
        <section><h3>可转成你的工作流</h3><div className="creator-patterns">{creator.patterns.map((pattern) => <span key={pattern}>{pattern}</span>)}</div></section>
        <footer><strong>边界</strong><p>{creator.caution}</p><a href={creator.evidence[0]?.url ?? creator.channelUrl} target="_blank" rel="noreferrer">查看证据 <ExternalLink size={12} /></a></footer>
      </article>)}
    </section>
    {!creators.length && <div className="creator-empty"><Search size={22} /><strong>没有匹配创作者</strong><span>尝试清除分类或缩短搜索词</span></div>}
  </main>;
}
