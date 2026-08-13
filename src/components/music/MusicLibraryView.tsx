import { AlertTriangle, ArrowUpRight, CheckCircle2, Download, ExternalLink, FileCheck2, Headphones, Library, Music2, Piano, Search, ShieldCheck, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { filterMusicPlatforms, youtubeMusicLibrary, type MusicFamily, type MusicRisk, type MusicScene } from "../../services/youtubeMusicService.js";

const familyOptions: Array<{ id: MusicFamily | "all"; label: string; icon: typeof Music2 }> = [
  { id: "all", label: "全部音乐", icon: Music2 },
  { id: "piano", label: "疗愈钢琴", icon: Piano },
  { id: "lofi", label: "柔和 Lo-Fi", icon: Headphones },
  { id: "chillhop", label: "Chillhop", icon: Music2 },
  { id: "jazz", label: "少量爵士", icon: Sparkles }
];

const sceneOptions: Array<{ id: MusicScene | "all"; label: string }> = [
  { id: "all", label: "全部场景" }, { id: "countryside", label: "乡村" }, { id: "rain", label: "雨景" },
  { id: "sunrise", label: "日出" }, { id: "city-night", label: "城市夜景" }, { id: "road-driving", label: "公路驾驶" },
  { id: "blue-hour", label: "蓝调时刻" }, { id: "urban", label: "都市" }
];

const sceneLabels = Object.fromEntries(sceneOptions.map((item) => [item.id, item.label])) as Record<MusicScene | "all", string>;
const riskLabels: Record<MusicRisk, string> = { low: "低风险", medium: "需复核", high: "高风险" };
const costLabels = { free: "免费", "free-or-paid": "免费 / 付费", subscription: "订阅", "per-track-or-subscription": "单曲 / 订阅" } as const;
const contentIdLabels = { low: "低 Content ID 风险", "clearlist-required": "发布前清除频道/视频", "code-or-clearlist": "需代码或清除列表", "track-dependent": "按曲目确认" } as const;
const attributionLabels = { "track-dependent": "署名按曲目", "not-generally-required": "通常无需署名", "credit-or-safelist": "需 Credit 或清除列表" } as const;
const monetizationLabels = { allowed: "支持盈利", "allowed-with-track-terms": "盈利需按曲复核", "not-covered": "未覆盖盈利" } as const;
const editingLabels = { "basic-edits": "支持裁切 / 淡化", "derivatives-allowed": "支持加工改编", "sync-only": "仅配画面，不改编", "track-dependent": "剪辑权限按曲确认" } as const;

export function MusicLibraryView() {
  const [family, setFamily] = useState<MusicFamily | "all">("all");
  const [categoryId, setCategoryId] = useState("all");
  const [scene, setScene] = useState<MusicScene | "all">("all");
  const [risk, setRisk] = useState<MusicRisk | "all">("all");
  const [query, setQuery] = useState("");
  const categories = useMemo(() => youtubeMusicLibrary.categories.filter((category) => family === "all" || category.family === family), [family]);
  const platforms = useMemo(() => filterMusicPlatforms({
    ...(categoryId === "all" ? {} : { categoryId }),
    ...(scene === "all" ? {} : { scene }),
    ...(risk === "all" ? {} : { risk }),
    query
  }), [categoryId, scene, risk, query]);

  function selectFamily(next: MusicFamily | "all") {
    setFamily(next);
    setCategoryId("all");
  }

  return <main className="music-page">
    <header className="music-hero">
      <div><p className="eyebrow">YOUTUBE MUSIC CLEARANCE DESK</p><h1>背景音乐库<br /><em>先匹配画面，再清除版权</em></h1><p>为乡村、雨景、日出与夜间驾驶建立可执行的钢琴、Lo-Fi、Chillhop 和轻爵士选曲入口。</p></div>
      <div className="music-summary"><span><strong>{youtubeMusicLibrary.platforms.length}</strong><small>授权平台</small></span><span><strong>{youtubeMusicLibrary.categories.length}</strong><small>声音方向</small></span><span><strong>7</strong><small>拍摄场景</small></span></div>
    </header>

    <section className="music-license-notice"><ShieldCheck size={20} /><div><strong>“免版税”不等于“无版权”</strong><p>{youtubeMusicLibrary.methodology}</p></div><small>核验日期 {youtubeMusicLibrary.accessedAt}</small></section>

    <section className="music-family-tabs" aria-label="音乐大类">{familyOptions.map(({ id, label, icon: Icon }) => <button key={id} className={family === id ? "active" : ""} onClick={() => selectFamily(id)}><Icon size={17} /><span>{label}</span><small>{id === "piano" ? "慢旋律 · 多留白" : id === "lofi" ? "柔节拍 · 夜间流动" : id === "chillhop" ? "爵士和弦 · 松弛律动" : id === "jazz" ? "轻点缀 · 都市蓝调" : "全部声音方向"}</small></button>)}</section>

    <section className="music-category-strip" aria-label="细分音乐类型">
      <button className={categoryId === "all" ? "active" : ""} onClick={() => setCategoryId("all")}>当前大类全部</button>
      {categories.map((category) => <button key={category.id} className={categoryId === category.id ? "active" : ""} onClick={() => setCategoryId(category.id)}>{category.name}</button>)}
    </section>

    <section className="music-direction-grid">{categories.map((category) => <article key={category.id} className={`music-direction family-${category.family}`}>
      <header><span>{category.family === "piano" ? <Piano size={17} /> : category.family === "lofi" ? <Headphones size={17} /> : category.family === "chillhop" ? <Music2 size={17} /> : <Sparkles size={17} />}</span><h2>{category.name}</h2></header>
      <p>{category.description}</p>
      <div>{category.scenes.map((item) => <small key={item}>{sceneLabels[item]}</small>)}</div>
      <footer><strong>混音提示</strong>{category.mixingNotes}</footer>
    </article>)}</section>

    <section className="music-toolbar">
      <label><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索平台、授权说明或音乐方向" /></label>
      <select value={scene} onChange={(event) => setScene(event.target.value as MusicScene | "all")} aria-label="适用场景">{sceneOptions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
      <select value={risk} onChange={(event) => setRisk(event.target.value as MusicRisk | "all")} aria-label="许可风险"><option value="all">全部风险</option><option value="low">低风险</option><option value="medium">需复核</option></select>
    </section>

    <section className="music-platform-grid">
      {platforms.map((platform) => <article className={`music-platform-card risk-${platform.license.risk}`} key={platform.id}>
        <header><span className="music-platform-icon">{platform.importMode === "download-import" ? <Download size={19} /> : <Library size={19} />}</span><div><small>{platform.importMode === "download-import" ? "下载后导入剪辑软件" : "仅限 YouTube 平台许可"}</small><h2>{platform.name}</h2></div><span className={`music-risk risk-${platform.license.risk}`}>{platform.license.risk === "low" ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}{riskLabels[platform.license.risk]}</span></header>
        <p className="music-platform-fit">{platform.catalogFit}</p>
        <dl><div><dt>费用</dt><dd>{costLabels[platform.license.cost]}</dd></div><div><dt>盈利</dt><dd>{monetizationLabels[platform.license.monetization]}</dd></div><div><dt>剪辑</dt><dd>{editingLabels[platform.license.audioEditing]}</dd></div><div><dt>署名</dt><dd>{attributionLabels[platform.license.attribution]}</dd></div><div><dt>Content ID</dt><dd>{contentIdLabels[platform.license.contentId]}</dd></div></dl>
        <div className="music-platform-styles">{platform.supportedCategoryIds.slice(0, 6).map((id) => <span key={id}>{youtubeMusicLibrary.categories.find((category) => category.id === id)?.name}</span>)}</div>
        <aside><AlertTriangle size={15} /><p>{platform.license.notes}</p></aside>
        <section><h3><FileCheck2 size={14} /> 导入与发布清单</h3><ol>{platform.workflow.map((step, index) => <li key={step}><i>{index + 1}</i><span>{step}</span></li>)}</ol></section>
        <footer><a href={platform.url} target="_blank" rel="noreferrer">打开曲库 <ArrowUpRight size={13} /></a><div>{platform.evidence.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">授权依据 <ExternalLink size={11} /></a>)}</div></footer>
      </article>)}
    </section>
    {!platforms.length && <div className="music-empty"><Search size={23} /><strong>没有符合当前条件的平台</strong><span>放宽风险、场景或音乐类型筛选</span></div>}
  </main>;
}
