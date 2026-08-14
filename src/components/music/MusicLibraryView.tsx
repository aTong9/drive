import { AlertTriangle, ArrowUpRight, CheckCircle2, ChevronLeft, ChevronRight, Disc3, Download, ExternalLink, FileCheck2, Headphones, Library, Music2, Piano, Play, Repeat2, RotateCcw, Search, ShieldCheck, SlidersHorizontal, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { filterMusicAlbums, filterMusicPlatforms, filterMusicTracks, youtubeMusicLibrary, type MusicFamily, type MusicRisk, type MusicScene } from "../../services/youtubeMusicService.js";

const familyOptions: Array<{ id: MusicFamily | "all"; label: string; icon: typeof Music2 }> = [
  { id: "all", label: "全部音乐", icon: Music2 },
  { id: "piano", label: "疗愈钢琴", icon: Piano },
  { id: "lofi", label: "Lo-Fi / Chillhop", icon: Headphones },
  { id: "jazz", label: "放松爵士", icon: Sparkles }
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
const formatDuration = (seconds: number | null) => seconds === null ? "曲目页" : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
const TRACKS_PER_PAGE = 24;

export function MusicLibraryView() {
  const [family, setFamily] = useState<MusicFamily | "all">("all");
  const [categoryId, setCategoryId] = useState("all");
  const [scene, setScene] = useState<MusicScene | "all">("all");
  const [risk, setRisk] = useState<MusicRisk | "all">("all");
  const [query, setQuery] = useState("");
  const [albumPlatformId, setAlbumPlatformId] = useState("all");
  const [trackPage, setTrackPage] = useState(1);
  const categories = useMemo(() => youtubeMusicLibrary.categories.filter((category) => family === "all" || (family === "lofi" ? category.family === "lofi" || category.family === "chillhop" : category.family === family)), [family]);
  const platforms = useMemo(() => filterMusicPlatforms({
    ...(categoryId === "all" ? {} : { categoryId }),
    ...(scene === "all" ? {} : { scene }),
    ...(risk === "all" ? {} : { risk }),
    query
  }), [categoryId, scene, risk, query]);
  const albums = useMemo(() => filterMusicAlbums({
    ...(albumPlatformId === "all" ? {} : { platformId: albumPlatformId }),
    ...(family === "all" ? {} : { family }),
    ...(categoryId === "all" ? {} : { categoryId }),
    ...(scene === "all" ? {} : { scene }),
    query
  }), [albumPlatformId, family, categoryId, scene, query]);
  const tracks = useMemo(() => filterMusicTracks({
    ...(albumPlatformId === "all" ? {} : { platformId: albumPlatformId }),
    ...(family === "all" ? {} : { family }),
    ...(categoryId === "all" ? {} : { categoryId }),
    ...(scene === "all" ? {} : { scene }),
    query
  }), [albumPlatformId, family, categoryId, scene, query]);
  const freePlatforms = useMemo(() => youtubeMusicLibrary.platforms.filter((platform) => platform.license.cost === "free" || platform.license.cost === "free-or-paid"), []);
  const trackPageCount = Math.max(1, Math.ceil(tracks.length / TRACKS_PER_PAGE));
  const visibleTracks = tracks.slice((trackPage - 1) * TRACKS_PER_PAGE, trackPage * TRACKS_PER_PAGE);
  const selectedPlatformTrackCount = albumPlatformId === "all" ? youtubeMusicLibrary.tracks.length : youtubeMusicLibrary.tracks.filter((track) => track.platformId === albumPlatformId).length;

  useEffect(() => setTrackPage(1), [albumPlatformId, categoryId, family, query, scene]);

  function selectFamily(next: MusicFamily | "all") {
    setFamily(next);
    setCategoryId("all");
  }

  function activateSignatureProfile() {
    setFamily("piano");
    setCategoryId("signature-healing-loop");
    setScene("all");
    setRisk("all");
    setQuery("");
    setAlbumPlatformId("dova-syndrome");
  }

  function resetDiscovery() {
    setFamily("all");
    setCategoryId("all");
    setScene("all");
    setRisk("all");
    setQuery("");
    setAlbumPlatformId("all");
  }

  return <main className="music-page">
    <header className="music-hero">
      <div><p className="eyebrow">YOUTUBE MUSIC CLEARANCE DESK</p><h1>背景音乐库<br /><em>先匹配画面，再清除版权</em></h1><p>为乡村、雨景、日出与夜间驾驶建立可执行的钢琴、Lo-Fi、Chillhop 和轻爵士选曲入口。</p></div>
      <div className="music-summary"><span><strong>{youtubeMusicLibrary.albums.length}</strong><small>精选专辑</small></span><span><strong>{youtubeMusicLibrary.tracks.length}</strong><small>可用单曲</small></span><span><strong>{youtubeMusicLibrary.platforms.length}</strong><small>免费平台</small></span></div>
    </header>

    <section className="music-license-notice"><ShieldCheck size={20} /><div><strong>“免版税”不等于“无版权”</strong><p>{youtubeMusicLibrary.methodology}</p></div><small>核验日期 {youtubeMusicLibrary.accessedAt}</small></section>

    <section className="music-signature-profile">
      <header><div className="music-signature-icon"><SlidersHorizontal size={19} /></div><div><p className="eyebrow">PRIMARY MUSIC PROFILE</p><h2>长期主筛选标准</h2><span>先验授权，再验原生循环，最后听感筛选</span></div><div className="music-signature-actions"><button className="primary" onClick={activateSignatureProfile}><Repeat2 size={14} />查看原生循环严选</button><button onClick={resetDiscovery}><RotateCcw size={13} />重置</button></div></header>
      <div className="music-profile-rules"><article><small>必须全部满足</small><div>{["Healing", "Warm", "Calm", "Gentle", "YouTube 盈利", "可裁切 / Fade / Loop"].map((item) => <span key={item}>{item}</span>)}</div></article><article><small>优先加权</small><div>{["Slow", "Weak", "Ambient", "Lo-Fi", "Piano", "Synth Pad", "Soft Guitar"].map((item) => <span key={item}>{item}</span>)}</div></article><article className="avoid"><small>排除或降级</small><div>{["Strong Drums", "Funk", "EDM", "Energetic", "Intense", "Loud"].map((item) => <span key={item}>{item}</span>)}</div></article></div>
      <footer><strong>来源优先级</strong><ol><li><i>1</i>DOVA-SYNDROME</li><li><i>2</i>StreamBeats</li><li><i>3</i>其他授权清晰平台</li></ol><p><Repeat2 size={13} />“原生 Loopable”与“仅允许后期循环”分开管理</p></footer>
    </section>

    <section className="music-family-tabs" aria-label="音乐大类">{familyOptions.map(({ id, label, icon: Icon }) => <button key={id} className={family === id ? "active" : ""} onClick={() => selectFamily(id)}><Icon size={17} /><span>{label}</span><small>{id === "piano" ? "慢旋律 · 多留白" : id === "lofi" ? "柔节拍 · 夜间驾驶" : id === "jazz" ? "夜曲 · 都市蓝调" : "全部三个分类"}</small></button>)}</section>

    <section className="music-discovery-layout">
      <aside className="music-filter-panel">
        <header><p className="eyebrow">FILTER</p><h2>筛选音乐</h2>{categoryId === "signature-healing-loop" && <span className="music-filter-active"><Repeat2 size={12} />原生循环严格模式</span>}</header>
        <label className="music-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索专辑、曲目或平台" /></label>
        <label><span>免费音乐平台（{freePlatforms.length}）</span><select value={albumPlatformId} onChange={(event) => setAlbumPlatformId(event.target.value)}><option value="all">全部免费平台</option>{freePlatforms.map((platform) => <option key={platform.id} value={platform.id}>{platform.name}</option>)}</select></label>
        <label><span>适用画面</span><select value={scene} onChange={(event) => setScene(event.target.value as MusicScene | "all")}>{sceneOptions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        <div className="music-filter-group"><span>细分方向</span><div className="music-category-strip" aria-label="细分音乐类型"><button className={categoryId === "all" ? "active" : ""} onClick={() => setCategoryId("all")}>全部</button>{categories.map((category) => <button key={category.id} className={categoryId === category.id ? "active" : ""} onClick={() => setCategoryId(category.id)}>{category.name}</button>)}</div></div>
        <div className="music-filter-tip"><ShieldCheck size={15} /><p>当前只展示有免费使用路径的平台。下载后仍需保存曲目许可与署名文本。</p></div>
      </aside>

      <div className="music-results-panel">
        <header className="music-album-heading"><div><p className="eyebrow">CURATED ALBUMS</p><h2>适合当前方向的专辑</h2><span>{albums.length} 专辑 · {tracks.length} 单曲</span></div></header>
        <section className="music-album-grid">
      {albums.map((album) => {
        const platform = youtubeMusicLibrary.platforms.find((item) => item.id === album.platformId);
        return <article className="music-album-card" key={album.id}>
          <header><span><Disc3 size={20} /></span><div><small>{album.kind === "official-album" ? "官方发行专辑" : "编辑精选合辑"} · {platform?.name}</small><h2>{album.title}</h2><p>{album.artist}</p></div></header>
          <p className="music-album-description">{album.description}</p>
          <div className="music-album-scenes">{album.scenes.map((item) => <span key={item}>{sceneLabels[item]}</span>)}</div>
          <section><strong>{album.trackHighlights.length > 6 ? `严格筛选曲目 · ${album.trackHighlights.length} 首` : "推荐曲目 / 搜索方向"}</strong><ol>{album.trackHighlights.slice(0, 6).map((track) => <li key={track}>{track}</li>)}</ol>{album.trackHighlights.length > 6 && <details className="music-album-track-details"><summary>展开其余 {album.trackHighlights.length - 6} 首</summary><ol start={7}>{album.trackHighlights.slice(6).map((track) => <li key={track}>{track}</li>)}</ol></details>}</section>
          <aside><strong>{album.credit}</strong><p>{album.licenseNote}</p></aside>
          <footer><a href={album.listenUrl} target="_blank" rel="noreferrer"><Play size={12} />试听专辑</a><a className="primary" href={album.downloadUrl} target="_blank" rel="noreferrer"><Download size={12} />{album.downloadLabel}</a></footer>
        </article>;
      })}
        </section>
        {!albums.length && <div className="music-empty music-album-empty"><Disc3 size={23} /><strong>当前平台或分类暂无专辑</strong><span>切换平台、场景或清空搜索词</span></div>}
        <header className="music-track-heading"><div><p className="eyebrow">READY-TO-USE TRACKS</p><h2>可直接试听与下载的单曲</h2></div><span>{tracks.length} 首</span></header>
        <section className="music-catalog-progress" aria-label="曲库扩充进度">
          <div><strong>{albumPlatformId === "all" ? "全部平台当前收录" : `${freePlatforms.find((platform) => platform.id === albumPlatformId)?.name ?? "当前平台"}收录进度`}</strong><span>{selectedPlatformTrackCount} / {albumPlatformId === "all" ? freePlatforms.length * 100 : 100}</span></div>
          <progress value={Math.min(selectedPlatformTrackCount, albumPlatformId === "all" ? freePlatforms.length * 100 : 100)} max={albumPlatformId === "all" ? freePlatforms.length * 100 : 100} />
          <small>阶段目标：每个免费平台至少 100 首；再按平台适配类型检查各分类覆盖。</small>
        </section>
        <section className="music-track-list">
          {visibleTracks.map((track) => {
            const platform = youtubeMusicLibrary.platforms.find((item) => item.id === track.platformId);
            return <article className="music-track-card" key={track.id}>
              <div className="music-track-index"><Music2 size={16} /></div>
              <div className="music-track-copy"><header><div><h3>{track.title}</h3><p>{track.artist} · {platform?.name}</p></div><time>{formatDuration(track.durationSeconds)}</time></header><p>{track.description}</p><div className="music-album-scenes">{track.scenes.map((item) => <span key={item}>{sceneLabels[item]}</span>)}</div><aside><strong>{track.credit}</strong><p>{track.licenseNote}</p></aside></div>
              <footer><a href={track.listenUrl} target="_blank" rel="noreferrer"><Play size={12} />试听</a><a className="primary" href={track.downloadUrl} target="_blank" rel="noreferrer"><Download size={12} />{track.downloadLabel}</a></footer>
            </article>;
          })}
        </section>
        {tracks.length > TRACKS_PER_PAGE && <nav className="music-track-pagination" aria-label="单曲分页"><button disabled={trackPage === 1} onClick={() => setTrackPage((page) => Math.max(1, page - 1))}><ChevronLeft size={14} />上一页</button><span>第 {trackPage} / {trackPageCount} 页 · 每页 {TRACKS_PER_PAGE} 首</span><button disabled={trackPage === trackPageCount} onClick={() => setTrackPage((page) => Math.min(trackPageCount, page + 1))}>下一页<ChevronRight size={14} /></button></nav>}
        {!tracks.length && <div className="music-empty music-track-empty"><Music2 size={23} /><strong>当前条件暂无单曲</strong><span>切换平台、场景或清空搜索词</span></div>}
      </div>
    </section>

    <section className="music-source-heading"><div><p className="eyebrow">FREE LICENSED SOURCES</p><h2>免费平台与授权说明</h2><span>{platforms.length} 个符合当前方向的平台</span></div><select value={risk} onChange={(event) => setRisk(event.target.value as MusicRisk | "all")} aria-label="许可风险"><option value="all">全部许可风险</option><option value="low">优先：低风险</option><option value="medium">需逐曲复核</option></select></section>
    <section className="music-platform-grid">
      {platforms.map((platform) => <article className={`music-platform-card risk-${platform.license.risk}`} key={platform.id}>
        <header><span className="music-platform-icon">{platform.importMode === "download-import" ? <Download size={19} /> : <Library size={19} />}</span><div><small>{platform.importMode === "download-import" ? "下载后导入剪辑软件" : "仅限 YouTube 平台许可"}</small><h2>{platform.name}</h2></div><span className={`music-risk risk-${platform.license.risk}`}>{platform.license.risk === "low" ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}{riskLabels[platform.license.risk]}</span></header>
        <p className="music-platform-fit">{platform.catalogFit}</p>
        <dl><div><dt>费用</dt><dd>{costLabels[platform.license.cost]}</dd></div><div><dt>盈利</dt><dd>{monetizationLabels[platform.license.monetization]}</dd></div><div><dt>剪辑</dt><dd>{editingLabels[platform.license.audioEditing]}</dd></div><div><dt>署名</dt><dd>{attributionLabels[platform.license.attribution]}</dd></div><div><dt>Content ID</dt><dd>{contentIdLabels[platform.license.contentId]}</dd></div></dl>
        <div className="music-platform-styles">{platform.supportedCategoryIds.slice(0, 4).map((id) => <span key={id}>{youtubeMusicLibrary.categories.find((category) => category.id === id)?.name}</span>)}</div>
        <details><summary><FileCheck2 size={14} />查看许可重点与发布清单</summary><aside><AlertTriangle size={15} /><p>{platform.license.notes}</p></aside><section><h3>导入与发布清单</h3><ol>{platform.workflow.map((step, index) => <li key={step}><i>{index + 1}</i><span>{step}</span></li>)}</ol></section></details>
        <footer><a href={platform.url} target="_blank" rel="noreferrer">打开曲库 <ArrowUpRight size={13} /></a><div>{platform.evidence.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">授权依据 <ExternalLink size={11} /></a>)}</div></footer>
      </article>)}
    </section>
    {!platforms.length && <div className="music-empty"><Search size={23} /><strong>没有符合当前条件的平台</strong><span>放宽风险、场景或音乐类型筛选</span></div>}
  </main>;
}
