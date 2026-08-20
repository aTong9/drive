import {
  estimateCreatorRevenuePotential,
  sortCreatorModelsByRevenuePotential,
} from "../../services/creatorRevenuePotentialService.js";
import {
  ArrowUpRight,
  Calculator,
  CameraOff,
  CarFront,
  Check,
  ExternalLink,
  Film,
  Footprints,
  Headphones,
  Layers3,
  Search,
  Sparkles,
  Trees,
  UserRound,
  Video,
  Videotape,
  Volume2,
  Waves,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  appearanceModeLabels,
  ordinaryCreatorModels,
  type AppearanceMode,
} from "../../data/ordinaryCreatorModels.js";
import {
  creatorAnalyticsTools,
  estimateSocialBladeEarnings,
  socialBladeUrl,
  viewStatsUrl,
  youtubeCreatorResearch,
  type CreatorCategory,
} from "../../services/youtubeCreatorService.js";

const categories: Array<{
  value: CreatorCategory | "all";
  label: string;
  icon: typeof Video;
}> = [
  { value: "all", label: "全部", icon: Videotape },
  { value: "scenic-drive", label: "风景驾车", icon: CarFront },
  { value: "rain-walk", label: "雨天步行", icon: Footprints },
  { value: "stationary-nature", label: "自然定点", icon: Trees },
  { value: "urban-walk", label: "城市步行", icon: Footprints },
  { value: "guided-walk", label: "路线导览", icon: Video },
  { value: "cinematic-landscape", label: "电影风景", icon: Sparkles },
  { value: "nature-ambience", label: "Nature Ambience", icon: Waves },
  { value: "ambient-cinema", label: "Ambient Cinema", icon: Film },
  { value: "asmr-nature", label: "ASMR Nature", icon: Volume2 },
];

const categoryLabels = Object.fromEntries(
  categories.map((item) => [item.value, item.label]),
) as Record<CreatorCategory | "all", string>;

export function CreatorView() {
  const [researchMode, setResearchMode] = useState<"benchmarks" | "models">(
    "benchmarks",
  );
  const [category, setCategory] = useState<CreatorCategory | "all">("all");
  const [appearanceMode, setAppearanceMode] = useState<AppearanceMode | "all">(
    "all",
  );
  const [query, setQuery] = useState("");
  const [modelQuery, setModelQuery] = useState("");
  const [modelPage, setModelPage] = useState(1);
  const [revenueSort, setRevenueSort] = useState<
    "annual-desc" | "annual-asc" | "library"
  >("annual-desc");
  const [revenueTierFilter, setRevenueTierFilter] = useState<
    "all" | "top" | "mid" | "starter"
  >("all");
  const [costFilter, setCostFilter] = useState<"all" | "low" | "high">("all");
  const [cardDensity, setCardDensity] = useState<"compact" | "detailed">(
    "compact",
  );
  const [monthlyViews, setMonthlyViews] = useState(1000000);
  const earnings = estimateSocialBladeEarnings(monthlyViews);
  const money = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  const creators = useMemo(
    () =>
      youtubeCreatorResearch.creators.filter((creator) => {
        const needle = query.trim().toLowerCase();
        return (
          (category === "all" || creator.category === category) &&
          (!needle ||
            creator.name.toLowerCase().includes(needle) ||
            creator.region.toLowerCase().includes(needle) ||
            creator.positioning.toLowerCase().includes(needle))
        );
      }),
    [category, query],
  );
  const matchingChannelModels = ordinaryCreatorModels.filter((model) => {
    const needle = modelQuery.trim().toLowerCase();
    const revenue = estimateCreatorRevenuePotential(model);
    const tierMatches =
      revenueTierFilter === "all" ||
      (revenueTierFilter === "top" && ["S", "A"].includes(revenue.tier)) ||
      (revenueTierFilter === "mid" && ["B", "C"].includes(revenue.tier)) ||
      (revenueTierFilter === "starter" && ["D", "E"].includes(revenue.tier));
    const costMatches =
      costFilter === "all" ||
      (costFilter === "low" && revenue.costPenalty < 1) ||
      (costFilter === "high" && revenue.costPenalty >= 1);
    return (
      (appearanceMode === "all" || model.mode === appearanceMode) &&
      tierMatches &&
      costMatches &&
      (!needle ||
        model.title.toLowerCase().includes(needle) ||
        model.category.toLowerCase().includes(needle) ||
        model.promise.toLowerCase().includes(needle) ||
        model.references.some((reference) =>
          reference.name.toLowerCase().includes(needle),
        ))
    );
  });
  const filteredChannelModels =
    revenueSort === "library"
      ? matchingChannelModels
      : sortCreatorModelsByRevenuePotential(
          matchingChannelModels,
          revenueSort === "annual-desc" ? "desc" : "asc",
        );
  const modelPageSize = 8;
  const modelPageCount = Math.max(
    1,
    Math.ceil(filteredChannelModels.length / modelPageSize),
  );
  const currentModelPage = Math.min(modelPage, modelPageCount);
  const channelModels = filteredChannelModels.slice(
    (currentModelPage - 1) * modelPageSize,
    currentModelPage * modelPageSize,
  );
  const topPotentialCount = filteredChannelModels.filter((model) =>
    ["S", "A"].includes(estimateCreatorRevenuePotential(model).tier),
  ).length;
  const lowCostCount = filteredChannelModels.filter(
    (model) => estimateCreatorRevenuePotential(model).costPenalty < 1,
  ).length;
  const facelessCount = filteredChannelModels.filter(
    (model) => model.mode === "faceless",
  ).length;

  return (
    <main className="creator-page">
      <header className="creator-hero">
        <div>
          <p className="eyebrow">GLOBAL CREATOR FIELD NOTES</p>
          <h1>
            全球影像创作者
            <br />
            <em>为什么有人愿意一直看</em>
          </h1>
          <p>
            不是复制爆款，而是拆解与你的风景驾车、雨天步行、自然定点和电影感旅行最相关的观看价值。
          </p>
        </div>
        <div className="creator-summary">
          <span>
            <strong>{youtubeCreatorResearch.creators.length}</strong>
            <small>代表频道</small>
          </span>
          <span>
            <strong>{categories.length - 1}</strong>
            <small>内容模型</small>
          </span>
          <span>
            <strong>3</strong>
            <small>可复用维度</small>
          </span>
        </div>
      </header>

      <section className="creator-method">
        <Headphones size={19} />
        <div>
          <strong>如何阅读这份分析</strong>
          <p>{youtubeCreatorResearch.methodology}</p>
        </div>
        <small>核验日期 {youtubeCreatorResearch.accessedAt}</small>
      </section>

      <nav className="creator-research-tabs" aria-label="创作者研究主视图">
        <button
          className={researchMode === "benchmarks" ? "active" : ""}
          onClick={() => setResearchMode("benchmarks")}
        >
          <Videotape size={17} />
          <span>
            <strong>全球标杆博主</strong>
            <small>
              原有深度研究 · {youtubeCreatorResearch.creators.length} 位
            </small>
          </span>
          <em>{youtubeCreatorResearch.creators.length}</em>
        </button>
        <button
          className={researchMode === "models" ? "active" : ""}
          onClick={() => setResearchMode("models")}
        >
          <Layers3 size={17} />
          <span>
            <strong>普通人频道方向</strong>
            <small>露脸与不露脸 · 每类含多个案例</small>
          </span>
          <em>{ordinaryCreatorModels.length}</em>
        </button>
      </nav>

      {researchMode === "models" && (
        <section className="ordinary-channel-lab">
          <header>
            <div>
              <small>STARTABLE CHANNEL MODELS</small>
              <h2>普通人也能开始的频道方向</h2>
              <p>
                先按你愿不愿露脸选择生产方式，再看技能、场景和可持续选题。参考频道用于研究结构，不代表复制定位或保证收入。
              </p>
            </div>
            <span>
              <strong>{ordinaryCreatorModels.length}</strong>
              <small>种可执行方向</small>
            </span>
          </header>
          <div className="ordinary-channel-controls">
            <nav aria-label="按露脸方式筛选普通人频道方向">
              {(
                [
                  ["all", "全部方式", Layers3],
                  ["on-camera", "露脸主导", UserRound],
                  ["faceless", "完全不露脸", CameraOff],
                  ["hybrid", "可露脸／不露脸", Video],
                ] as const
              ).map(([value, label, Icon]) => (
                <button
                  key={value}
                  className={appearanceMode === value ? "active" : ""}
                  onClick={() => {
                    setAppearanceMode(value);
                    setModelPage(1);
                  }}
                >
                  <Icon size={14} />
                  {label}
                  <em>
                    {value === "all"
                      ? ordinaryCreatorModels.length
                      : ordinaryCreatorModels.filter(
                          (model) => model.mode === value,
                        ).length}
                  </em>
                </button>
              ))}
            </nav>
            <label>
              <Search size={14} />
              <input
                value={modelQuery}
                onChange={(event) => {
                  setModelQuery(event.target.value);
                  setModelPage(1);
                }}
                placeholder="搜索方向或参考博主"
              />
            </label>
            <label className="ordinary-revenue-sort">
              <Calculator size={14} />
              <select
                aria-label="频道方向收益排序"
                value={revenueSort}
                onChange={(event) => {
                  setRevenueSort(
                    event.target.value as
                      "annual-desc" | "annual-asc" | "library",
                  );
                  setModelPage(1);
                }}
              >
                <option value="annual-desc">年收益潜力：高到低</option>
                <option value="annual-asc">年收益潜力：低到高</option>
                <option value="library">资料库原顺序</option>
              </select>
            </label>
            <label className="ordinary-revenue-filter">
              <select
                aria-label="收益潜力等级筛选"
                value={revenueTierFilter}
                onChange={(event) => {
                  setRevenueTierFilter(
                    event.target.value as "all" | "top" | "mid" | "starter",
                  );
                  setModelPage(1);
                }}
              >
                <option value="all">全部收益等级</option>
                <option value="top">S–A 高潜力</option>
                <option value="mid">B–C 中等潜力</option>
                <option value="starter">D–E 起步型</option>
              </select>
            </label>
            <label className="ordinary-revenue-filter">
              <select
                aria-label="启动成本筛选"
                value={costFilter}
                onChange={(event) => {
                  setCostFilter(event.target.value as "all" | "low" | "high");
                  setModelPage(1);
                }}
              >
                <option value="all">全部启动成本</option>
                <option value="low">低成本优先</option>
                <option value="high">设备／运营成本较高</option>
              </select>
            </label>
          </div>
          <aside className="ordinary-revenue-method">
            <Calculator size={17} />
            <div>
              <strong>成熟期年收益潜力模型</strong>
              <p>
                默认按广告价值、购买意图、常青搜索、变现宽度和生产效率综合排序，并扣除高设备与运营成本。区间假设频道已稳定运营，不代表参考博主真实收入，也不保证你能达到。
              </p>
            </div>
          </aside>
          <div className="ordinary-decision-summary">
            <span>
              <strong>{filteredChannelModels.length}</strong>
              当前匹配
            </span>
            <span>
              <strong>{topPotentialCount}</strong>
              S–A 高潜力
            </span>
            <span>
              <strong>{lowCostCount}</strong>
              低成本方向
            </span>
            <span>
              <strong>{facelessCount}</strong>
              完全不露脸
            </span>
            <div>
              <button
                className={cardDensity === "compact" ? "active" : ""}
                onClick={() => setCardDensity("compact")}
              >
                快速浏览
              </button>
              <button
                className={cardDensity === "detailed" ? "active" : ""}
                onClick={() => setCardDensity("detailed")}
              >
                展开详情
              </button>
            </div>
          </div>
          <div className="ordinary-channel-grid">
            {channelModels.map((model) => {
              const revenue = estimateCreatorRevenuePotential(model);
              return (
                <article
                  key={model.id}
                  className={`ordinary-channel-card mode-${model.mode}`}
                >
                  <header>
                    <span>{appearanceModeLabels[model.mode]}</span>
                    <small>{model.category}</small>
                    <h3>{model.title}</h3>
                    <p>{model.promise}</p>
                  </header>
                  <aside>
                    <strong>为什么普通人可做</strong>
                    <p>{model.beginnerFit}</p>
                  </aside>
                  <section className="ordinary-revenue-estimate">
                    <div>
                      <span>收益潜力 {revenue.tier}</span>
                      <strong>
                        ¥{Math.round(revenue.annualMinCny / 10000)}万–¥
                        {Math.round(revenue.annualMaxCny / 10000)}万／年
                      </strong>
                      <small>成熟期宽区间 · 综合得分 {revenue.score}/100</small>
                    </div>
                    <p>{revenue.rationale.join(" · ")}</p>
                  </section>
                  <details
                    className="ordinary-card-details"
                    open={cardDensity === "detailed" ? true : undefined}
                  >
                    <summary>
                      <span>查看装备、固定流程、选题与参考博主</span>
                      <em>{model.references.length} 位参考</em>
                    </summary>
                    <section>
                      <h4>最低装备</h4>
                      <div className="ordinary-kit">
                        {model.minimumKit.map((item) => (
                          <span key={item}>
                            <Check size={10} />
                            {item}
                          </span>
                        ))}
                      </div>
                    </section>
                    <section>
                      <h4>每期固定结构</h4>
                      <ol>
                        {model.repeatableFormat.map((step, index) => (
                          <li key={step}>
                            <i>{index + 1}</i>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </section>
                    <section>
                      <h4>第一批可拍选题</h4>
                      <div className="ordinary-topics">
                        {model.firstTopics.map((topic) => (
                          <span key={topic}>{topic}</span>
                        ))}
                      </div>
                    </section>
                    <section>
                      <h4>同类型参考博主</h4>
                      <div className="ordinary-references">
                        {model.references.map((reference, index) => (
                          <a
                            key={reference.url}
                            href={reference.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <i>{String(index + 1).padStart(2, "0")}</i>
                            <span>{reference.name}</span>
                            <ExternalLink size={11} />
                          </a>
                        ))}
                      </div>
                    </section>
                    <section>
                      <h4>可能收入路径</h4>
                      <p className="ordinary-income">
                        {model.incomePaths.join(" · ")}
                      </p>
                    </section>
                    <footer>
                      <strong>边界</strong>
                      <p>{model.caution}</p>
                    </footer>
                  </details>
                </article>
              );
            })}
          </div>
          <nav
            className="ordinary-channel-pagination"
            aria-label="普通人频道方向本地分页"
          >
            <span>
              显示{" "}
              {(currentModelPage - 1) * modelPageSize +
                (filteredChannelModels.length ? 1 : 0)}
              –
              {Math.min(
                currentModelPage * modelPageSize,
                filteredChannelModels.length,
              )}{" "}
              · 共 {filteredChannelModels.length} 个方向
            </span>
            <div>
              <button
                disabled={currentModelPage <= 1}
                onClick={() => setModelPage((page) => Math.max(1, page - 1))}
              >
                上一页
              </button>
              <strong>
                第 {currentModelPage} / {modelPageCount} 页
              </strong>
              <button
                disabled={currentModelPage >= modelPageCount}
                onClick={() =>
                  setModelPage((page) => Math.min(modelPageCount, page + 1))
                }
              >
                下一页
              </button>
            </div>
          </nav>
        </section>
      )}

      {researchMode === "benchmarks" && (
        <>
          <section className="socialblade-panel">
            <div>
              <Calculator size={20} />
              <span>
                <strong>Social Blade 收入区间估算</strong>
                <small>
                  输入频道近 30 日播放量；采用其公开默认 CPM $0.25–$4.00 /
                  千次播放。
                </small>
              </span>
            </div>
            <label>
              近 30 日播放量
              <input
                type="number"
                min={0}
                step={10000}
                value={monthlyViews}
                onChange={(event) =>
                  setMonthlyViews(Number(event.target.value))
                }
              />
            </label>
            <dl>
              <div>
                <dt>月估算</dt>
                <dd>
                  {money(earnings.monthlyLow)}–{money(earnings.monthlyHigh)}
                </dd>
              </div>
              <div>
                <dt>年化估算</dt>
                <dd>
                  {money(earnings.yearlyLow)}–{money(earnings.yearlyHigh)}
                </dd>
              </div>
            </dl>
            <p>
              仅为广告毛收入宽区间，不代表实际到账；未计地区、广告填充、版权分成、税费、会员和赞助。
            </p>
            <a
              href="https://socialblade.com/youtube/"
              target="_blank"
              rel="noreferrer"
            >
              打开 Social Blade <ExternalLink size={13} />
            </a>
          </section>

          <section className="creator-toolbar">
            <div className="creator-categories">
              {categories.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  className={category === value ? "active" : ""}
                  onClick={() => setCategory(value)}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
            <label>
              <Search size={15} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索频道、地区或定位"
              />
            </label>
          </section>

          <section className="creator-grid">
            {creators.map((creator, index) => (
              <article
                className={`creator-card category-${creator.category}`}
                key={creator.id}
              >
                <header>
                  <span className="creator-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <small>
                      {categoryLabels[creator.category]} · {creator.region}
                    </small>
                    <h2>{creator.name}</h2>
                  </div>
                  <a
                    href={creator.channelUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`打开 ${creator.name} YouTube 频道`}
                  >
                    <Videotape size={17} />
                  </a>
                </header>
                <p className="creator-positioning">{creator.positioning}</p>
                <a
                  className="creator-proof"
                  href={creator.representative.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Video size={15} />
                  <span>
                    <small>代表内容 / 公开表现</small>
                    <strong>{creator.representative.title}</strong>
                    <p>{creator.representative.observedPerformance}</p>
                  </span>
                  <ArrowUpRight size={14} />
                </a>
                <section>
                  <h3>为什么获得播放</h3>
                  <ol>
                    {creator.whyItWorks.map((reason, reasonIndex) => (
                      <li key={reason}>
                        <i>{reasonIndex + 1}</i>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ol>
                </section>
                <section>
                  <h3>可转成你的工作流</h3>
                  <div className="creator-patterns">
                    {creator.patterns.map((pattern) => (
                      <span key={pattern}>{pattern}</span>
                    ))}
                  </div>
                </section>
                <footer>
                  <strong>边界</strong>
                  <p>{creator.caution}</p>
                </footer>
                <nav
                  className="creator-analytics"
                  aria-label={`${creator.name} 频道分析工具`}
                >
                  <a href={creator.channelUrl} target="_blank" rel="noreferrer">
                    <span>
                      YouTube<small>免费 · 频道</small>
                    </span>
                    <ExternalLink size={12} />
                  </a>
                  <a
                    href={viewStatsUrl(creator.channelUrl)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>
                      ViewStats<small>部分免费 · 收益</small>
                    </span>
                    <ExternalLink size={12} />
                  </a>
                  <a
                    href={socialBladeUrl(creator.channelUrl)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>
                      Social Blade<small>部分免费 · 趋势</small>
                    </span>
                    <ExternalLink size={12} />
                  </a>
                  <a
                    href={creatorAnalyticsTools.hypeAuditor}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>
                      HypeAuditor<small>免费试算 · 商单</small>
                    </span>
                    <ExternalLink size={12} />
                  </a>
                  <a
                    href={creatorAnalyticsTools.noxInfluencer}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>
                      NoxInfluencer<small>免费试算 · 交叉验证</small>
                    </span>
                    <ExternalLink size={12} />
                  </a>
                  <a
                    href={creator.evidence[0]?.url ?? creator.channelUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>
                      研究证据<small>公开来源</small>
                    </span>
                    <ExternalLink size={12} />
                  </a>
                </nav>
              </article>
            ))}
          </section>
          {!creators.length && (
            <div className="creator-empty">
              <Search size={22} />
              <strong>没有匹配创作者</strong>
              <span>尝试清除分类或缩短搜索词</span>
            </div>
          )}
        </>
      )}
    </main>
  );
}
