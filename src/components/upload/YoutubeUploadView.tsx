import {
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  Clipboard,
  ExternalLink,
  Eye,
  FileText,
  HardDriveUpload,
  Hash,
  Image,
  Languages,
  ListVideo,
  Settings2,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import type { ResolvedRoute } from "../../types/domain.js";
import { usePlannerStore } from "../../app/store.js";
import {
  buildYoutubeUploadGuide,
  type YoutubeChannelVariant,
  type YoutubeUploadTemplate,
} from "../../services/youtubeUploadService.js";
import {
  dailymotionStandardFit,
  videoDistributionPlatforms,
} from "../../services/videoDistributionService.js";

const templates: Array<{
  value: YoutubeUploadTemplate;
  label: string;
  labelEn: string;
  note: string;
  noteEn: string;
}> = [
  {
    value: "search",
    label: "aBin 专属默认",
    labelEn: "aBin default",
    note: "地点优先；固定夜驾、4K HDR 与声音承诺",
    noteEn: "Location-first title with a clear picture and sound promise",
  },
  {
    value: "immersive",
    label: "沉浸观看",
    labelEn: "Immersive viewing",
    note: "强调情绪、睡眠与专注用途",
    noteEn: "Atmosphere-led framing for sleep and focus",
  },
  {
    value: "archive",
    label: "路线档案",
    labelEn: "Route archive",
    note: "突出线路、城市与长期收藏价值",
    noteEn: "Route, cities and long-term reference value",
  },
];

type UploadLanguageView = "bilingual" | "en" | "zh";

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="upload-copy"
      onClick={() => {
        void navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }}
    >
      <Clipboard size={13} />
      {copied ? "已复制 / Copied" : "复制 / Copy"}
    </button>
  );
}

function BilingualField({
  icon,
  titleZh,
  titleEn,
  english,
  chinese,
  view,
  pre = false,
}: {
  icon: ReactNode;
  titleZh: string;
  titleEn: string;
  english: string;
  chinese: string;
  view: UploadLanguageView;
  pre?: boolean;
}) {
  const Content = pre ? "pre" : "p";
  return (
    <article>
      <header>
        {icon}
        <strong>
          {titleZh} / {titleEn}
        </strong>
      </header>
      <div className={`upload-bilingual-content view-${view}`}>
        {view !== "zh" && (
          <section lang="en">
            <header>
              <small>EN · ORIGINAL</small>
              <CopyButton value={english} />
            </header>
            <Content>{english}</Content>
          </section>
        )}
        {view !== "en" && (
          <section lang="zh-CN">
            <header>
              <small>中文 · 本地化</small>
              <CopyButton value={chinese} />
            </header>
            <Content>{chinese}</Content>
          </section>
        )}
      </div>
    </article>
  );
}

export function YoutubeUploadView({ routes }: { routes: ResolvedRoute[] }) {
  const projects = usePlannerStore((state) => state.videoProjects);
  const activeProjectId = usePlannerStore(
    (state) => state.activeVideoProjectId,
  );
  const [projectId, setProjectId] = useState(
    activeProjectId || projects[0]?.id || "",
  );
  const [variant, setVariant] = useState<YoutubeChannelVariant>("vision");
  const [template, setTemplate] = useState<YoutubeUploadTemplate>("search");
  const [languageView, setLanguageView] =
    useState<UploadLanguageView>("bilingual");
  const [distributionDuration, setDistributionDuration] = useState(60);
  const project = projects.find((item) => item.id === projectId) ?? projects[0];
  const route = routes.find((item) => item.route.id === project?.routeId);
  const guide = useMemo(
    () => buildYoutubeUploadGuide(project, route, variant, template),
    [project, route, variant, template],
  );
  const dailymotionFit = useMemo(
    () => dailymotionStandardFit(distributionDuration),
    [distributionDuration],
  );
  const studioSettings = [
    ["可见性", "Visibility", guide.visibility, "私密"],
    ["受众", "Audience", guide.audience, "否，不适合儿童"],
    ["分类", "Category", guide.category, "旅行与活动"],
    ["视频语言", "Video language", guide.language, "英语（原始语言）"],
    ["许可", "License", guide.license, "标准 YouTube 许可"],
    ["播放列表", "Playlist", guide.playlist, guide.playlist],
  ] as const;

  return (
    <main className="upload-page">
      <header className="upload-hero">
        <div>
          <p className="eyebrow">YOUTUBE PUBLISHING DESK</p>
          <h1>
            上传参数 <small>Upload parameters</small>
            <br />
            <em>
              先检查，再发布 <small>Check before publishing</small>
            </em>
          </h1>
          <p>
            不连接 YouTube
            API，只把当前项目整理成可以逐项复制和核对的中英双语发布资料。
            <br />
            No upload API—prepare, copy and verify the bilingual publishing
            package locally.
          </p>
        </div>
        <UploadCloud size={58} />
      </header>
      <section className="upload-controls">
        <label>
          视频项目 / Video project
          <select
            value={project?.id ?? ""}
            onChange={(event) => setProjectId(event.target.value)}
          >
            <option value="">通用模板 / General template</option>
            {projects.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <div role="tablist" aria-label="频道版本">
          <button
            className={variant === "vision" ? "active" : ""}
            onClick={() => setVariant("vision")}
          >
            aBin Vision
          </button>
          <button
            className={variant === "ambience" ? "active" : ""}
            onClick={() => setVariant("ambience")}
          >
            aBin Ambience
          </button>
        </div>
        <div
          className="upload-language-tabs"
          role="tablist"
          aria-label="内容语言 / Content language"
        >
          <button
            className={languageView === "bilingual" ? "active" : ""}
            onClick={() => setLanguageView("bilingual")}
          >
            <Languages size={13} />
            中英对照
          </button>
          <button
            className={languageView === "en" ? "active" : ""}
            onClick={() => setLanguageView("en")}
          >
            EN
          </button>
          <button
            className={languageView === "zh" ? "active" : ""}
            onClick={() => setLanguageView("zh")}
          >
            中文
          </button>
        </div>
        <span>
          <Eye size={14} />
          私密优先 / Private first
        </span>
      </section>
      <section
        className="upload-template-picker"
        aria-label="上传模板 / Upload template"
      >
        {templates.map((item) => (
          <button
            key={item.value}
            className={template === item.value ? "active" : ""}
            onClick={() => setTemplate(item.value)}
          >
            <strong>
              {item.label} / {item.labelEn}
            </strong>
            <small>
              {item.note}
              <br />
              {item.noteEn}
            </small>
          </button>
        ))}
      </section>
      <section className="upload-localization-flow">
        <header>
          <Languages size={18} />
          <div>
            <strong>双语发布方式 / Bilingual publishing</strong>
            <p>
              英文填写视频原始标题与简介；处理完成后在 YouTube Studio「字幕 →
              添加语言 →
              中文」中填写独立中文标题与简介，不必把两种语言全部塞进同一个简介。
            </p>
          </div>
        </header>
        <ol>
          <li>
            <i>1</i>
            <span>
              <strong>English original</strong>
              <small>Details → Language: English</small>
            </span>
          </li>
          <li>
            <i>2</i>
            <span>
              <strong>中文本地化</strong>
              <small>Subtitles → Add language → Chinese</small>
            </span>
          </li>
          <li>
            <i>3</i>
            <span>
              <strong>分别检查</strong>
              <small>Title、description、chapters、links</small>
            </span>
          </li>
        </ol>
      </section>
      <section className="upload-readiness-summary">
        <span>
          <strong>{guide.title.length}</strong>英文标题字符 / 100
        </span>
        <span>
          <strong>{guide.titleZh.length}</strong>中文标题字符 / 100
        </span>
        <span>
          <strong>Private</strong>默认可见性
        </span>
        <span>
          <strong>4K HDR</strong>交付目标
        </span>
      </section>
      <div className="upload-layout">
        <section className="upload-fields">
          <BilingualField
            icon={<FileText size={16} />}
            titleZh="标题"
            titleEn="Title"
            english={guide.title}
            chinese={guide.titleZh}
            view={languageView}
          />
          <BilingualField
            icon={<FileText size={16} />}
            titleZh="简介与章节"
            titleEn="Description & chapters"
            english={guide.descriptionEn}
            chinese={guide.descriptionZh}
            view={languageView}
            pre
          />
          <article>
            <header>
              <Hash size={16} />
              <strong>标签 / Tags</strong>
            </header>
            <div className={`upload-bilingual-content view-${languageView}`}>
              {languageView !== "zh" && (
                <section lang="en">
                  <header>
                    <small>EN · ORIGINAL</small>
                    <CopyButton value={guide.tags.join(", ")} />
                  </header>
                  <div className="upload-tags">
                    {guide.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </section>
              )}
              {languageView !== "en" && (
                <section lang="zh-CN">
                  <header>
                    <small>中文 · 本地化</small>
                    <CopyButton value={guide.tagsZh.join(", ")} />
                  </header>
                  <div className="upload-tags">
                    {guide.tagsZh.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </article>
          <BilingualField
            icon={<Image size={16} />}
            titleZh="缩略图提示"
            titleEn="Thumbnail brief"
            english={guide.thumbnailEn}
            chinese={guide.thumbnail}
            view={languageView}
          />
        </section>
        <aside className="upload-settings">
          <h2>
            <Settings2 size={17} /> YouTube Studio 填写值 / Settings
          </h2>
          <dl>
            {studioSettings.map(([zhLabel, enLabel, enValue, zhValue]) => (
              <div key={enLabel}>
                <dt>
                  {zhLabel}
                  <small>{enLabel}</small>
                </dt>
                <dd>
                  <span lang="en">{enValue}</span>
                  <small lang="zh-CN">{zhValue}</small>
                </dd>
              </div>
            ))}
          </dl>
          <h2>
            <ShieldCheck size={17} /> 发布前检查 / Pre-publish checks
          </h2>
          <ol>
            {guide.checks.map((item, index) => (
              <li key={item}>
                <CheckCircle2 size={14} />
                <span>
                  {item}
                  <small>{guide.checksEn[index]}</small>
                </span>
              </li>
            ))}
          </ol>
          <footer>
            <ListVideo size={16} />
            <span>
              <strong>推荐发布顺序 / Publishing order</strong>
              <small>
                私密上传 Private → HDR/版权检查 → 三端试听 → 定时或公开
              </small>
            </span>
          </footer>
        </aside>
      </div>
      <section className="distribution-section">
        <header>
          <div>
            <p className="eyebrow">MULTI-PLATFORM DISTRIBUTION</p>
            <h2>一次成片，按价值分发 / Distribute one master by value</h2>
            <p>
              YouTube 负责增长；Dailymotion 与 Rumble 只做低成本验证；Vimeo
              保存代表作。
              <br />
              YouTube drives growth; use Dailymotion and Rumble for low-cost
              tests, and Vimeo for selected portfolio work.
              规则核对日期：2026-08-18。
            </p>
          </div>
          <CircleDollarSign size={30} />
        </header>
        <div className="distribution-priority" aria-label="平台精力分配">
          <span>
            <strong>80%</strong>YouTube
          </span>
          <span>
            <strong>10–15%</strong>Dailymotion
          </span>
          <span>
            <strong>测试</strong>Rumble
          </span>
          <span>
            <strong>精选</strong>Vimeo
          </span>
        </div>
        <div className="distribution-grid">
          {videoDistributionPlatforms.map((platform) => (
            <article
              key={platform.id}
              className={`distribution-card distribution-${platform.id}`}
            >
              <header>
                <div>
                  <small>
                    {platform.priority} · {platform.effort}
                  </small>
                  <h3>{platform.name}</h3>
                </div>
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`打开 ${platform.name}`}
                >
                  <ExternalLink size={16} />
                </a>
              </header>
              <strong className="distribution-role">{platform.role}</strong>
              <p>{platform.fit}</p>
              <dl>
                <div>
                  <dt>画质与文件</dt>
                  <dd>{platform.videoSupport}</dd>
                </div>
                <div>
                  <dt>赚钱方式</dt>
                  <dd>{platform.monetization}</dd>
                </div>
                <div>
                  <dt>收款</dt>
                  <dd>{platform.payout}</dd>
                </div>
              </dl>
              <div className="distribution-action">
                <CheckCircle2 size={15} />
                <span>
                  <strong>执行建议</strong>
                  {platform.action}
                </span>
              </div>
              <div className="distribution-caution">
                <AlertTriangle size={15} />
                <span>{platform.caution}</span>
              </div>
              <footer>
                {platform.sources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {source.label}
                    <ExternalLink size={11} />
                  </a>
                ))}
              </footer>
            </article>
          ))}
        </div>
        <div className="distribution-tools">
          <article>
            <HardDriveUpload size={22} />
            <div>
              <h3>Dailymotion 4 GB 快速判断</h3>
              <p>
                按其官方建议的 4K 20 Mb/s 视频码率，加 320 kb/s
                音频估算；这是文件体积预判，不代表 HDR 已获支持。
              </p>
            </div>
            <label>
              成片时长
              <input
                type="number"
                min="1"
                max="240"
                value={distributionDuration}
                onChange={(event) =>
                  setDistributionDuration(
                    Math.max(1, Number(event.target.value) || 1),
                  )
                }
              />
              <span>分钟</span>
            </label>
            <output className={dailymotionFit.fits ? "fit" : "over"}>
              <strong>约 {dailymotionFit.estimatedGb.toFixed(1)} GB</strong>
              <small>
                {dailymotionFit.fits ? "标准账户体积可行" : "超过标准账户 4 GB"}
              </small>
            </output>
          </article>
          <aside>
            <ShieldCheck size={22} />
            <div>
              <h3>中国大陆创作者合规核对</h3>
              <p>
                注册前逐个平台确认：创作者计划是否向真实居住地开放、身份证姓名与账户姓名是否一致、profile
                country
                与银行国家是否匹配、付款服务是否可用、税务资料如何申报。不要借用地址、身份或银行卡绕过地区规则。
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
