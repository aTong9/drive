import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Disc3,
  Download,
  ExternalLink,
  FileCheck2,
  Headphones,
  Library,
  Music2,
  Piano,
  Play,
  Repeat2,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildPlatformAttributionTemplate,
  filterMusicAlbums,
  filterMusicPlatforms,
  filterMusicTracks,
  youtubePianoCreators,
  youtubeMusicLibrary,
  type MusicFamily,
  type MusicRisk,
  type MusicScene,
} from "../../services/youtubeMusicService.js";

const familyOptions: Array<{
  id: MusicFamily | "all";
  label: string;
  icon: typeof Music2;
}> = [
  { id: "all", label: "全部音乐", icon: Music2 },
  { id: "piano", label: "疗愈钢琴", icon: Piano },
  { id: "lofi", label: "Lo-Fi / Chillhop", icon: Headphones },
  { id: "jazz", label: "放松爵士", icon: Sparkles },
];

const sceneOptions: Array<{ id: MusicScene | "all"; label: string }> = [
  { id: "all", label: "全部场景" },
  { id: "countryside", label: "乡村" },
  { id: "rain", label: "雨景" },
  { id: "sunrise", label: "日出" },
  { id: "city-night", label: "城市夜景" },
  { id: "road-driving", label: "公路驾驶" },
  { id: "blue-hour", label: "蓝调时刻" },
  { id: "urban", label: "都市" },
];

const sceneLabels = Object.fromEntries(
  sceneOptions.map((item) => [item.id, item.label]),
) as Record<MusicScene | "all", string>;
const riskLabels: Record<MusicRisk, string> = {
  low: "低风险",
  medium: "需复核",
  high: "高风险",
};
const costLabels = {
  free: "免费",
  "free-or-paid": "免费 / 付费",
  subscription: "订阅",
  "per-track-or-subscription": "单曲 / 订阅",
} as const;
const contentIdLabels = {
  low: "低 Content ID 风险",
  "clearlist-required": "发布前清除频道/视频",
  "code-or-clearlist": "需代码或清除列表",
  "track-dependent": "按曲目确认",
} as const;
const attributionLabels = {
  "track-dependent": "署名按曲目",
  "not-generally-required": "通常无需署名",
  "credit-or-safelist": "需 Credit 或清除列表",
} as const;
const monetizationLabels = {
  allowed: "支持盈利",
  "allowed-with-track-terms": "盈利需按曲复核",
  "not-covered": "未覆盖盈利",
} as const;
const editingLabels = {
  "basic-edits": "支持裁切 / 淡化",
  "derivatives-allowed": "支持加工改编",
  "sync-only": "仅配画面，不改编",
  "track-dependent": "剪辑权限按曲确认",
} as const;
const formatDuration = (seconds: number | null) =>
  seconds === null
    ? "时长待核实"
    : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
const TRACKS_PER_PAGE = 24;
const ALBUMS_PER_PAGE = 8;

const musicTaskOptions = [
  {
    id: "long-drive",
    label: "长视频驾驶",
    note: "优先单首 10 分钟以上",
    family: "all",
    scene: "road-driving",
    longOnly: true,
  },
  {
    id: "night-drive",
    label: "城市夜驾",
    note: "Lo-Fi · 柔节拍 · 低风险",
    family: "lofi",
    scene: "city-night",
    longOnly: false,
  },
  {
    id: "rain-walk",
    label: "雨景步行",
    note: "钢琴 · 留白 · 不抢环境声",
    family: "piano",
    scene: "rain",
    longOnly: false,
  },
  {
    id: "nature",
    label: "自然纪录",
    note: "疗愈 · 乡村 · 弱存在感",
    family: "piano",
    scene: "countryside",
    longOnly: false,
  },
] as const;

export function MusicLibraryView() {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [section, setSection] = useState<"tracks" | "albums" | "platforms" | "creators">("tracks");
  const [family, setFamily] = useState<MusicFamily | "all">("all");
  const [categoryId, setCategoryId] = useState("all");
  const [scene, setScene] = useState<MusicScene | "all">("all");
  const [risk, setRisk] = useState<MusicRisk | "all">("all");
  const [query, setQuery] = useState("");
  const [longTracksOnly, setLongTracksOnly] = useState(false);
  const [albumPlatformId, setAlbumPlatformId] = useState("all");
  const [activeMusicTask, setActiveMusicTask] = useState<string | null>(null);
  const [albumPage, setAlbumPage] = useState(1);
  const [trackPage, setTrackPage] = useState(1);
  const [copiedPlatformId, setCopiedPlatformId] = useState<string | null>(null);
  const categories = useMemo(
    () =>
      youtubeMusicLibrary.categories.filter(
        (category) =>
          family === "all" ||
          (family === "lofi"
            ? category.family === "lofi" || category.family === "chillhop"
            : category.family === family),
      ),
    [family],
  );
  const platforms = useMemo(
    () =>
      filterMusicPlatforms({
        ...(risk === "all" ? {} : { risk }),
        query,
      }),
    [risk, query],
  );
  const albums = useMemo(
    () =>
      filterMusicAlbums({
        ...(albumPlatformId === "all" ? {} : { platformId: albumPlatformId }),
        ...(risk === "all" ? {} : { risk }),
        ...(family === "all" ? {} : { family }),
        ...(categoryId === "all" ? {} : { categoryId }),
        ...(scene === "all" ? {} : { scene }),
        query,
      }),
    [albumPlatformId, family, categoryId, scene, query, risk],
  );
  const tracks = useMemo(
    () =>
      filterMusicTracks({
        ...(albumPlatformId === "all" ? {} : { platformId: albumPlatformId }),
        ...(risk === "all" ? {} : { risk }),
        ...(family === "all" ? {} : { family }),
        ...(categoryId === "all" ? {} : { categoryId }),
        ...(scene === "all" ? {} : { scene }),
        ...(longTracksOnly ? { minDurationSeconds: 600 } : {}),
        query,
      }),
    [albumPlatformId, family, categoryId, scene, longTracksOnly, query, risk],
  );
  const freePlatforms = useMemo(
    () =>
      youtubeMusicLibrary.platforms.filter(
        (platform) =>
          platform.license.cost === "free" ||
          platform.license.cost === "free-or-paid",
      ),
    [],
  );
  const pianoCreators = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return youtubePianoCreators.filter(
      (creator) => !normalizedQuery || `${creator.name} ${creator.focus}`.toLocaleLowerCase().includes(normalizedQuery),
    );
  }, [query]);
  const trackPageCount = Math.max(
    1,
    Math.ceil(tracks.length / TRACKS_PER_PAGE),
  );
  const albumPageCount = Math.max(
    1,
    Math.ceil(albums.length / ALBUMS_PER_PAGE),
  );
  const currentAlbumPage = Math.min(albumPage, albumPageCount);
  const visibleAlbums = albums.slice(
    (currentAlbumPage - 1) * ALBUMS_PER_PAGE,
    currentAlbumPage * ALBUMS_PER_PAGE,
  );
  const visibleTracks = tracks.slice(
    (trackPage - 1) * TRACKS_PER_PAGE,
    trackPage * TRACKS_PER_PAGE,
  );

  useEffect(
    () => setTrackPage(1),
    [albumPlatformId, categoryId, family, longTracksOnly, query, scene, risk],
  );
  useEffect(
    () => setAlbumPage(1),
    [albumPlatformId, categoryId, family, query, scene, risk],
  );

  function selectFamily(next: MusicFamily | "all") {
    setFamily(next);
    setCategoryId("all");
    setActiveMusicTask(null);
  }

  function activateMusicTask(task: (typeof musicTaskOptions)[number]) {
    setSection("tracks");
    setTrackPage(1);
    setActiveMusicTask(task.id);
    setFamily(task.family);
    setCategoryId("all");
    setScene(task.scene);
    setRisk(task.id === "night-drive" ? "low" : "all");
    setQuery("");
    setLongTracksOnly(task.longOnly);
    setAlbumPlatformId("all");
  }

  function activateSignatureProfile() {
    setSection("tracks");
    setTrackPage(1);
    setFamily("piano");
    setCategoryId("signature-healing-loop");
    setScene("all");
    setRisk("all");
    setQuery("");
    setLongTracksOnly(false);
    setAlbumPlatformId("dova-syndrome");
    setActiveMusicTask(null);
  }

  function resetDiscovery() {
    setTrackPage(1);
    setAlbumPage(1);
    setFamily("all");
    setCategoryId("all");
    setScene("all");
    setRisk("all");
    setQuery("");
    setLongTracksOnly(false);
    setAlbumPlatformId("all");
    setActiveMusicTask(null);
  }

  async function copyPlatformAttribution(platformId: string) {
    const platform = youtubeMusicLibrary.platforms.find(
      (item) => item.id === platformId,
    );
    if (!platform) return;
    await navigator.clipboard.writeText(
      buildPlatformAttributionTemplate(platform),
    );
    setCopiedPlatformId(platformId);
    window.setTimeout(
      () =>
        setCopiedPlatformId((current) =>
          current === platformId ? null : current,
        ),
      1800,
    );
  }

  return (
    <main className="music-page">
      <header className="music-hero">
        <div>
          <h1>
            音乐素材库
          </h1>
          <p>
            按画面和时长找音乐，试听后逐曲确认授权。
          </p>
        </div>
        <div className="music-summary">
          <span>
            <strong>{youtubeMusicLibrary.albums.length}</strong>
            <small>精选专辑</small>
          </span>
          <span>
            <strong>{youtubeMusicLibrary.tracks.length}</strong>
            <small>收录单曲</small>
          </span>
          <span>
            <strong>{youtubeMusicLibrary.platforms.length}</strong>
            <small>免费平台</small>
          </span>
        </div>
      </header>

      <section className="music-license-notice">
        <ShieldCheck size={20} />
        <div>
          <strong>“免版税”不等于“无版权”</strong>
          <details><summary>下载前确认单曲许可、署名及 Content ID 要求</summary><p>{youtubeMusicLibrary.methodology}</p></details>
        </div>
        <small>核验日期 {youtubeMusicLibrary.accessedAt}</small>
      </section>

      <nav className="music-section-tabs" aria-label="素材类型">
        {([
          ["tracks", "单曲"], ["albums", "专辑"],
          ["platforms", "平台与授权"], ["creators", "钢琴创作者"],
        ] as const).map(([id, label]) => (
          <button key={id} aria-pressed={section === id} className={section === id ? "active" : ""}
            onClick={() => { if (section !== id) { setSection(id); resetDiscovery(); } }}>
            {label}
          </button>
        ))}
      </nav>
      <label className="music-search music-main-search">
        <Search size={18} />
        <input aria-label="搜索当前素材" type="search" value={query}
          onChange={(event) => { setQuery(event.target.value); setActiveMusicTask(null); }}
          placeholder={section === "creators" ? "搜索创作者姓名或风格" : section === "platforms" ? "搜索平台名称或授权说明" : "搜索曲名、音乐人或平台"} />
      </label>
      {(section === "tracks" || section === "albums") && <>
      <section className="music-decision-hub">

        <div className="music-task-options" aria-label="快捷选曲">
          <button onClick={activateSignatureProfile}><Repeat2 size={14} />原生循环严选</button>
          {musicTaskOptions.map((task) => (
            <button
              key={task.id}
              title={task.note}
              className={activeMusicTask === task.id ? "active" : ""}
              aria-pressed={activeMusicTask === task.id}
              onClick={() => activateMusicTask(task)}
            >
              <strong>{task.label}</strong>

            </button>
          ))}
        </div>
      </section>


      <section className="music-family-tabs" aria-label="音乐大类">
        {familyOptions.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={family === id ? "active" : ""}
            aria-pressed={family === id}
            onClick={() => selectFamily(id)}
          >
            <Icon size={17} />
            <span>{label}</span>
            <small>
              {id === "piano"
                ? "慢旋律 · 多留白"
                : id === "lofi"
                  ? "柔节拍 · 夜间驾驶"
                  : id === "jazz"
                    ? "夜曲 · 都市蓝调"
                    : "全部三个分类"}
            </small>
          </button>
        ))}
      </section>

      <section className="music-discovery-layout">
        <aside className="music-filter-panel">
          <button className="music-mobile-filter-toggle" aria-expanded={filtersOpen} aria-controls="music-filter-fields" onClick={() => setFiltersOpen(!filtersOpen)}>
            <SlidersHorizontal size={16} />{filtersOpen ? "收起筛选" : section === "tracks" ? "展开筛选：平台、场景、时长" : "展开筛选：平台、场景、风格"}
          </button>
          <div id="music-filter-fields" className={`music-filter-fields${filtersOpen ? " is-open" : ""}`}>
          <header>
            <p className="eyebrow">FILTER</p>
            <h2>筛选音乐</h2>
            {categoryId === "signature-healing-loop" && (
              <span className="music-filter-active">
                <Repeat2 size={12} />
                原生循环严格模式
              </span>
            )}
          </header>
          <label>
            <span>免费音乐平台（{freePlatforms.length}）</span>
            <select
              value={albumPlatformId}
              onChange={(event) => {
                setAlbumPlatformId(event.target.value);
                setActiveMusicTask(null);
              }}
            >
              <option value="all">全部免费平台</option>
              {freePlatforms.map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>适用画面</span>
            <select
              value={scene}
              onChange={(event) => {
                setScene(event.target.value as MusicScene | "all");
                setActiveMusicTask(null);
              }}
            >
              {sceneOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          {section === "tracks" && <label className="music-duration-filter">
            <input
              type="checkbox"
              checked={longTracksOnly}
              onChange={(event) => {
                setLongTracksOnly(event.target.checked);
                setActiveMusicTask(null);
              }}
            />
            <span>
              <strong>单首 10 分钟以上</strong>
              <small>仅显示已核实时长 ≥ 10:00 的曲目</small>
            </span>
          </label>}
          <div className="music-filter-tip">
            <ShieldCheck size={15} />
            <p><strong>固定标准：排除 AI 生成音乐</strong><br />已披露 AI 生成、AI 改编的曲目不予收录；来源不明仍需复核。</p>
          </div>
          <label>
            <span>细分方向</span>
            <select value={categoryId} onChange={(event) => { setCategoryId(event.target.value); setActiveMusicTask(null); }}>
              <option value="all">全部方向</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          <label>
            <span>平台许可风险</span>
            <select value={risk} onChange={(event) => { setRisk(event.target.value as MusicRisk | "all"); setActiveMusicTask(null); }}>
              <option value="all">全部风险</option>
              <option value="low">低风险</option>
              <option value="medium">需复核</option>
              <option value="high">高风险</option>
            </select>
          </label>
          <div className="music-filter-tip">
            <ShieldCheck size={15} />
            <p>
              当前只展示有免费使用路径的平台。下载后仍需保存曲目许可与署名文本。
            </p>
          </div>
          </div>
        </aside>

        <div className="music-results-panel" ref={resultsRef}>
          <div className="music-active-filters" aria-label="已选筛选条件">
            <span role="status">找到 {section === "tracks" ? `${tracks.length} 首单曲` : `${albums.length} 张专辑`}</span>
            {[
              { label: familyOptions.find((item) => item.id === family)?.label, active: family !== "all", clear: () => selectFamily("all") },
              { label: categories.find((item) => item.id === categoryId)?.name, active: categoryId !== "all", clear: () => setCategoryId("all") },
              { label: sceneLabels[scene], active: scene !== "all", clear: () => setScene("all") },
              { label: freePlatforms.find((item) => item.id === albumPlatformId)?.name, active: albumPlatformId !== "all", clear: () => setAlbumPlatformId("all") },
              { label: risk === "all" ? "" : riskLabels[risk], active: risk !== "all", clear: () => setRisk("all") },
              { label: "≥ 10 分钟", active: section === "tracks" && longTracksOnly, clear: () => setLongTracksOnly(false) },
              { label: `搜索：${query}`, active: !!query, clear: () => setQuery("") },
            ].filter((item) => item.active).map((item) => (
              <button key={item.label} aria-label={`移除${item.label}`} onClick={() => { item.clear(); setActiveMusicTask(null); }}>{item.label} ×</button>
            ))}
            <button onClick={resetDiscovery}><RotateCcw size={13} />重置筛选</button>
          </div>
          {section === "albums" && <>

          <header className="music-album-heading">
            <div>
              <p className="eyebrow">CURATED ALBUMS</p>
              <h2>适合当前方向的专辑</h2>
              <span>
                {albums.length} 张匹配专辑
              </span>
            </div>
          </header>
          <section className="music-album-grid">
            {visibleAlbums.map((album) => {
              const platform = youtubeMusicLibrary.platforms.find(
                (item) => item.id === album.platformId,
              );
              return (
                <article className="music-album-card" key={album.id}>
                  <header>
                    <span>
                      <Disc3 size={20} />
                    </span>
                    <div>
                      <small>
                        {album.kind === "official-album"
                          ? "官方发行专辑"
                          : "编辑精选合辑"}{" "}
                        · {platform?.name}
                      </small>
                      <h2>{album.title}</h2>
                      <p>{album.artist}</p>
                    </div>
                  </header>
                  <p className="music-album-description">{album.description}</p>
                  <div className="music-album-scenes">
                    {album.scenes.map((item) => (
                      <span key={item}>{sceneLabels[item]}</span>
                    ))}
                  </div>
                  <details className="music-album-decision-details">
                    <summary>
                      查看推荐曲目与授权提示{" "}
                      <span>{album.trackHighlights.length} 首</span>
                    </summary>
                    <section>
                      <strong>
                        {album.trackHighlights.length > 6
                          ? `严格筛选曲目 · ${album.trackHighlights.length} 首`
                          : "推荐曲目 / 搜索方向"}
                      </strong>
                      <ol>
                        {album.trackHighlights.slice(0, 6).map((track) => (
                          <li key={track}>{track}</li>
                        ))}
                      </ol>
                      {album.trackHighlights.length > 6 && (
                        <details className="music-album-track-details">
                          <summary>
                            展开其余 {album.trackHighlights.length - 6} 首
                          </summary>
                          <ol start={7}>
                            {album.trackHighlights.slice(6).map((track) => (
                              <li key={track}>{track}</li>
                            ))}
                          </ol>
                        </details>
                      )}
                    </section>
                    <aside>
                      <strong>{album.credit}</strong>
                      <p>{album.licenseNote}</p>
                    </aside>
                  </details>
                  <footer>
                    <a href={album.listenUrl} target="_blank" rel="noreferrer">
                      <Play size={12} />
                      试听专辑
                    </a>
                    <a
                      className="primary"
                      href={album.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Download size={12} />
                      {album.downloadLabel}
                    </a>
                  </footer>
                </article>
              );
            })}
          </section>
          {albums.length > ALBUMS_PER_PAGE && (
            <nav
              className="music-track-pagination music-album-pagination"
              aria-label="专辑分页"
            >
              <button
                disabled={currentAlbumPage === 1}
                onClick={() => { setAlbumPage((page) => Math.max(1, page - 1)); resultsRef.current?.scrollIntoView({ block: "start" }); }}
              >
                <ChevronLeft size={14} />
                上一页
              </button>
              <span>
                专辑第 {currentAlbumPage} / {albumPageCount} 页 · 共{" "}
                {albums.length} 张
              </span>
              <button
                disabled={currentAlbumPage === albumPageCount}
                onClick={() => { setAlbumPage((page) => Math.min(albumPageCount, page + 1)); resultsRef.current?.scrollIntoView({ block: "start" }); }}
              >
                下一页
                <ChevronRight size={14} />
              </button>
            </nav>
          )}
          {!albums.length && (
            <div className="music-empty music-album-empty">
              <Disc3 size={23} />
              <strong>当前平台或分类暂无专辑</strong>
              <span>尝试移除上方条件，或重置筛选。</span>
              <button onClick={resetDiscovery}>清空条件，查看全部</button>
            </div>
          )}
          </>}
          {section === "tracks" && <>
          <h2 className="sr-only">单曲试听与下载</h2>
          <section className="music-track-list">
            {visibleTracks.map((track) => {
              const platform = youtubeMusicLibrary.platforms.find(
                (item) => item.id === track.platformId,
              );
              return (
                <article className="music-track-card" key={track.id}>
                  <div className="music-track-index">
                    <Music2 size={16} />
                  </div>
                  <div className="music-track-copy">
                    <header>
                      <div>
                        <h3>{track.title}</h3>
                        <p>
                          {track.artist} · {platform?.name}
                        </p>
                      </div>
                      <time>{formatDuration(track.durationSeconds)}</time>
                    </header>
                    <p>{track.description}</p>
                    <div className="music-album-scenes">
                      {track.scenes.map((item) => (
                        <span key={item}>{sceneLabels[item]}</span>
                      ))}
                    </div>
                    <details className="music-track-license">
                      <summary>署名与授权要求 · {platform ? riskLabels[platform.license.risk] : "需复核"}</summary>
                      <aside><strong>{track.credit}</strong><p>{track.licenseNote}</p></aside>
                    </details>
                  </div>
                  <footer>
                    <a href={track.listenUrl} target="_blank" rel="noreferrer">
                      <Play size={12} />
                      试听
                    </a>
                    <a
                      className="primary"
                      href={track.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Download size={12} />
                      {track.downloadLabel}
                    </a>
                  </footer>
                </article>
              );
            })}
          </section>
          {tracks.length > TRACKS_PER_PAGE && (
            <nav className="music-track-pagination" aria-label="单曲分页">
              <button
                disabled={trackPage === 1}
                onClick={() => { setTrackPage((page) => Math.max(1, page - 1)); resultsRef.current?.scrollIntoView({ block: "start" }); }}
              >
                <ChevronLeft size={14} />
                上一页
              </button>
              <span>
                第 {trackPage} / {trackPageCount} 页 · 每页 {TRACKS_PER_PAGE} 首
              </span>
              <button
                disabled={trackPage === trackPageCount}
                onClick={() => { setTrackPage((page) => Math.min(trackPageCount, page + 1)); resultsRef.current?.scrollIntoView({ block: "start" }); }}
              >
                下一页
                <ChevronRight size={14} />
              </button>
            </nav>
          )}
          {!tracks.length && (
            <div className="music-empty music-track-empty">
              <Music2 size={23} />
              <strong>当前条件暂无单曲</strong>
              <span>尝试移除上方条件，或重置筛选。</span>
              <button onClick={resetDiscovery}>清空条件，查看全部</button>
            </div>
          )}
          </>}
        </div>
      </section>
      </>}

      {section === "creators" && <>
      <section className="music-source-heading music-creator-heading">
        <div>
          <p className="eyebrow">HUMAN PIANO CREATORS</p>
          <h2>真人 Piano 创作者</h2>
          <span>{pianoCreators.length} / {youtubePianoCreators.length} 位 · 一位创作者只计一次</span>
        </div>
      </section>
      <aside className="music-creator-notice">
        <ShieldCheck size={17} />
        <p><strong>真人频道筛选原则：</strong>这里只收录本人演奏或具名真人创作者频道，不收单曲、播放列表或聚合音乐库。未发现 AI 披露不等于绝对保证；频道内容默认仅供发现，商用、剪辑、Fade 与 Loop 均须逐曲取得许可。</p>
      </aside>
      <section className="music-creator-grid">
        {pianoCreators.map((creator) => (
          <article className="music-creator-card" key={creator.id}>
            <header>
              <span className="music-creator-avatar"><Piano size={18} /></span>
              <div>
                <small>个人频道</small>
                <h3>{creator.name}</h3>
              </div>
              <span className="music-human-badge"><CheckCircle2 size={12} />真人</span>
            </header>
            <div className="music-creator-tags">
              <span>{creator.focus.replaceAll("-", " ")}</span>
              <span>复用需逐曲许可</span>
            </div>
            <p>优先查看 10 分钟以上的慢速、温暖、平静钢琴内容；公开视频不代表可下载或放入盈利视频。</p>
            <footer>
              <a href={creator.youtubeUrl} target="_blank" rel="noreferrer">打开 YouTube <ArrowUpRight size={13} /></a>
              <a href={creator.evidenceUrl} target="_blank" rel="noreferrer">身份依据 <ExternalLink size={12} /></a>
            </footer>
          </article>
        ))}
      </section>
      {!pianoCreators.length && (
        <div className="music-empty">
          <Search size={23} />
          <strong>没有符合搜索条件的 Piano 创作者</strong>
          <span>清空搜索词，查看全部创作者</span>
        </div>
      )}

      </>}
      {section === "platforms" && <>
      <section className="music-source-heading">
        <div>
          <p className="eyebrow">FREE LICENSED SOURCES</p>
          <h2>免费平台与授权说明</h2>
          <span>{platforms.length} 个符合当前方向的平台</span>
        </div>
        <select
          value={risk}
          onChange={(event) => {
            setRisk(event.target.value as MusicRisk | "all");
            setActiveMusicTask(null);
          }}
          aria-label="许可风险"
        >
          <option value="all">全部许可风险</option>
          <option value="low">优先：低风险</option>
          <option value="medium">需逐曲复核</option>
          <option value="high">高风险</option>
        </select>
      </section>
      <section className="music-platform-grid">
        {platforms.map((platform) => (
          <article
            className={`music-platform-card risk-${platform.license.risk}`}
            key={platform.id}
          >
            <header>
              <span className="music-platform-icon">
                {platform.importMode === "download-import" ? (
                  <Download size={19} />
                ) : (
                  <Library size={19} />
                )}
              </span>
              <div>
                <small>
                  {platform.importMode === "download-import"
                    ? "下载后导入剪辑软件"
                    : "仅限 YouTube 平台许可"}
                </small>
                <h2>{platform.name}</h2>
              </div>
              <span className={`music-risk risk-${platform.license.risk}`}>
                {platform.license.risk === "low" ? (
                  <CheckCircle2 size={12} />
                ) : (
                  <AlertTriangle size={12} />
                )}
                {riskLabels[platform.license.risk]}
              </span>
            </header>
            <p className="music-platform-fit">{platform.catalogFit}</p>
            <dl>
              <div>
                <dt>费用</dt>
                <dd>{costLabels[platform.license.cost]}</dd>
              </div>
              <div>
                <dt>盈利</dt>
                <dd>{monetizationLabels[platform.license.monetization]}</dd>
              </div>
              <div>
                <dt>剪辑</dt>
                <dd>{editingLabels[platform.license.audioEditing]}</dd>
              </div>
              <div>
                <dt>署名</dt>
                <dd>{attributionLabels[platform.license.attribution]}</dd>
              </div>
              <div>
                <dt>Content ID</dt>
                <dd>{contentIdLabels[platform.license.contentId]}</dd>
              </div>
            </dl>
            <div className="music-platform-styles">
              {platform.supportedCategoryIds.slice(0, 4).map((id) => (
                <span key={id}>
                  {
                    youtubeMusicLibrary.categories.find(
                      (category) => category.id === id,
                    )?.name
                  }
                </span>
              ))}
            </div>
            <details>
              <summary>
                <FileCheck2 size={14} />
                查看许可重点、署名模板与发布清单
              </summary>
              <aside>
                <AlertTriangle size={15} />
                <p>{platform.license.notes}</p>
              </aside>
              <section>
                <h3>导入与发布清单</h3>
                <ol>
                  {platform.workflow.map((step, index) => (
                    <li key={step}>
                      <i>{index + 1}</i>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
              <section className="music-attribution-template">
                <header>
                  <div>
                    <h3>YouTube 简介署名模板</h3>
                    <small>发布前替换方括号内容，并保留逐曲专属 Credit</small>
                  </div>
                  <button
                    type="button"
                    onClick={() => void copyPlatformAttribution(platform.id)}
                  >
                    {copiedPlatformId === platform.id ? (
                      <Check size={13} />
                    ) : (
                      <Copy size={13} />
                    )}
                    {copiedPlatformId === platform.id ? "已复制" : "复制模板"}
                  </button>
                </header>
                <pre>{buildPlatformAttributionTemplate(platform)}</pre>
              </section>
            </details>
            <footer>
              <a href={platform.url} target="_blank" rel="noreferrer">
                打开曲库 <ArrowUpRight size={13} />
              </a>
              <div>
                {platform.evidence.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    授权依据 <ExternalLink size={11} />
                  </a>
                ))}
              </div>
            </footer>
          </article>
        ))}
      </section>
      {!platforms.length && (
        <div className="music-empty">
          <Search size={23} />
          <strong>没有符合当前条件的平台</strong>
          <span>放宽风险筛选或清空搜索词</span>
        </div>
      )}
      </>}
      <details className="music-profile-details">
        <summary>查看长期选曲标准与来源优先级</summary>
      <section className="music-signature-profile">
        <header>
          <div className="music-signature-icon">
            <SlidersHorizontal size={19} />
          </div>
          <div>
            <p className="eyebrow">PRIMARY MUSIC PROFILE</p>
            <h2>长期主筛选标准</h2>
            <span>先排除 AI 生成，再验授权与原生循环，最后听感筛选</span>
          </div>
          <div className="music-signature-actions">
            <button className="primary" onClick={activateSignatureProfile}>
              <Repeat2 size={14} />
              查看原生循环严选
            </button>
            <button onClick={resetDiscovery}>
              <RotateCcw size={13} />
              重置
            </button>
          </div>
        </header>
        <div className="music-profile-rules">
          <article>
            <small>必须全部满足</small>
            <div>
              {[
                "Healing",
                "Warm",
                "Calm",
                "Gentle",
                "排除 AI 生成音乐",
                "YouTube 盈利",
                "可裁切 / Fade / Loop",
              ].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
          <article>
            <small>优先加权</small>
            <div>
              {[
                "Slow",
                "Weak",
                "Ambient",
                "Lo-Fi",
                "Piano",
                "Synth Pad",
                "Soft Guitar",
              ].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
          <article className="avoid">
            <small>排除或降级</small>
            <div>
              {[
                "Strong Drums",
                "Funk",
                "EDM",
                "Energetic",
                "Intense",
                "Loud",
              ].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        </div>
        <footer>
          <strong>来源优先级</strong>
          <ol>
            <li>
              <i>1</i>DOVA-SYNDROME
            </li>
            <li>
              <i>2</i>StreamBeats
            </li>
            <li>
              <i>3</i>其他授权清晰平台
            </li>
          </ol>
          <p>
            <Repeat2 size={13} />
            “原生 Loopable”与“仅允许后期循环”分开管理
          </p>
        </footer>
      </section>

      </details>
    </main>
  );
}
