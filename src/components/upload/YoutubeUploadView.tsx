import { AlertTriangle, CheckCircle2, CircleDollarSign, Clipboard, ExternalLink, Eye, FileText, HardDriveUpload, Hash, Image, ListVideo, Settings2, ShieldCheck, UploadCloud } from "lucide-react";
import { useMemo, useState } from "react";
import type { ResolvedRoute } from "../../types/domain.js";
import { usePlannerStore } from "../../app/store.js";
import { buildYoutubeUploadGuide, type YoutubeChannelVariant, type YoutubeUploadTemplate } from "../../services/youtubeUploadService.js";
import { dailymotionStandardFit, videoDistributionPlatforms } from "../../services/videoDistributionService.js";

const templates: Array<{ value: YoutubeUploadTemplate; label: string; note: string }> = [
  { value: "search", label: "aBin 专属默认", note: "地点优先；固定夜驾、4K HDR 与声音承诺" },
  { value: "immersive", label: "沉浸观看", note: "强调情绪、睡眠与专注用途" },
  { value: "archive", label: "路线档案", note: "突出线路、城市与长期收藏价值" },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return <button className="upload-copy" onClick={() => { void navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); }}><Clipboard size={13} />{copied ? "已复制" : "复制"}</button>;
}

export function YoutubeUploadView({ routes }: { routes: ResolvedRoute[] }) {
  const projects = usePlannerStore((state) => state.videoProjects);
  const activeProjectId = usePlannerStore((state) => state.activeVideoProjectId);
  const [projectId, setProjectId] = useState(activeProjectId || projects[0]?.id || "");
  const [variant, setVariant] = useState<YoutubeChannelVariant>("vision");
  const [template, setTemplate] = useState<YoutubeUploadTemplate>("search");
  const [distributionDuration, setDistributionDuration] = useState(60);
  const project = projects.find((item) => item.id === projectId) ?? projects[0];
  const route = routes.find((item) => item.route.id === project?.routeId);
  const guide = useMemo(() => buildYoutubeUploadGuide(project, route, variant, template), [project, route, variant, template]);
  const dailymotionFit = useMemo(() => dailymotionStandardFit(distributionDuration), [distributionDuration]);

  return <main className="upload-page">
    <header className="upload-hero"><div><p className="eyebrow">YOUTUBE PUBLISHING DESK</p><h1>上传参数<br /><em>先检查，再发布</em></h1><p>不连接 YouTube API，只把当前项目整理成可以逐项复制和核对的发布资料。</p></div><UploadCloud size={58} /></header>
    <section className="upload-controls"><label>视频项目<select value={project?.id ?? ""} onChange={(event) => setProjectId(event.target.value)}><option value="">通用模板</option>{projects.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><div role="tablist" aria-label="频道版本"><button className={variant === "vision" ? "active" : ""} onClick={() => setVariant("vision")}>aBin Vision</button><button className={variant === "ambience" ? "active" : ""} onClick={() => setVariant("ambience")}>aBin Ambience</button></div><span><Eye size={14} />默认先设为私密</span></section>
    <section className="upload-template-picker" aria-label="上传模板">{templates.map((item) => <button key={item.value} className={template === item.value ? "active" : ""} onClick={() => setTemplate(item.value)}><strong>{item.label}</strong><small>{item.note}</small></button>)}</section>
    <div className="upload-layout"><section className="upload-fields">
      <article><header><FileText size={16} /><strong>标题</strong><small>{guide.title.length}/100</small><CopyButton value={guide.title} /></header><p>{guide.title}</p></article>
      <article><header><FileText size={16} /><strong>简介、章节与署名</strong><CopyButton value={guide.description} /></header><pre>{guide.description}</pre></article>
      <article><header><Hash size={16} /><strong>标签</strong><CopyButton value={guide.tags.join(", ")} /></header><div className="upload-tags">{guide.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>
      <article><header><Image size={16} /><strong>缩略图提示</strong></header><p>{guide.thumbnail}</p></article>
    </section><aside className="upload-settings">
      <h2><Settings2 size={17} /> YouTube Studio 填写值</h2>
      <dl><div><dt>可见性</dt><dd>{guide.visibility}</dd></div><div><dt>受众</dt><dd>{guide.audience}</dd></div><div><dt>分类</dt><dd>{guide.category}</dd></div><div><dt>视频语言</dt><dd>{guide.language}</dd></div><div><dt>许可</dt><dd>{guide.license}</dd></div><div><dt>播放列表</dt><dd>{guide.playlist}</dd></div></dl>
      <h2><ShieldCheck size={17} /> 发布前检查</h2><ol>{guide.checks.map((item) => <li key={item}><CheckCircle2 size={14} />{item}</li>)}</ol>
      <footer><ListVideo size={16} /><span><strong>推荐发布顺序</strong><small>私密上传 → HDR/版权检查 → 三端试听 → 定时或公开</small></span></footer>
    </aside></div>
    <section className="distribution-section">
      <header><div><p className="eyebrow">MULTI-PLATFORM DISTRIBUTION</p><h2>一次成片，按价值分发</h2><p>YouTube 负责增长；Dailymotion 与 Rumble 只做低成本验证；Vimeo 保存代表作。规则核对日期：2026-08-18。</p></div><CircleDollarSign size={30} /></header>
      <div className="distribution-priority" aria-label="平台精力分配"><span><strong>80%</strong>YouTube</span><span><strong>10–15%</strong>Dailymotion</span><span><strong>测试</strong>Rumble</span><span><strong>精选</strong>Vimeo</span></div>
      <div className="distribution-grid">{videoDistributionPlatforms.map((platform) => <article key={platform.id} className={`distribution-card distribution-${platform.id}`}>
        <header><div><small>{platform.priority} · {platform.effort}</small><h3>{platform.name}</h3></div><a href={platform.url} target="_blank" rel="noreferrer" aria-label={`打开 ${platform.name}`}><ExternalLink size={16} /></a></header>
        <strong className="distribution-role">{platform.role}</strong><p>{platform.fit}</p>
        <dl><div><dt>画质与文件</dt><dd>{platform.videoSupport}</dd></div><div><dt>赚钱方式</dt><dd>{platform.monetization}</dd></div><div><dt>收款</dt><dd>{platform.payout}</dd></div></dl>
        <div className="distribution-action"><CheckCircle2 size={15} /><span><strong>执行建议</strong>{platform.action}</span></div>
        <div className="distribution-caution"><AlertTriangle size={15} /><span>{platform.caution}</span></div>
        <footer>{platform.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<ExternalLink size={11} /></a>)}</footer>
      </article>)}</div>
      <div className="distribution-tools">
        <article><HardDriveUpload size={22} /><div><h3>Dailymotion 4 GB 快速判断</h3><p>按其官方建议的 4K 20 Mb/s 视频码率，加 320 kb/s 音频估算；这是文件体积预判，不代表 HDR 已获支持。</p></div><label>成片时长<input type="number" min="1" max="240" value={distributionDuration} onChange={(event) => setDistributionDuration(Math.max(1, Number(event.target.value) || 1))} /><span>分钟</span></label><output className={dailymotionFit.fits ? "fit" : "over"}><strong>约 {dailymotionFit.estimatedGb.toFixed(1)} GB</strong><small>{dailymotionFit.fits ? "标准账户体积可行" : "超过标准账户 4 GB"}</small></output></article>
        <aside><ShieldCheck size={22} /><div><h3>中国大陆创作者合规核对</h3><p>注册前逐个平台确认：创作者计划是否向真实居住地开放、身份证姓名与账户姓名是否一致、profile country 与银行国家是否匹配、付款服务是否可用、税务资料如何申报。不要借用地址、身份或银行卡绕过地区规则。</p></div></aside>
      </div>
    </section>
  </main>;
}
