import { CheckCircle2, Clipboard, Eye, FileText, Hash, Image, ListVideo, Settings2, ShieldCheck, UploadCloud } from "lucide-react";
import { useMemo, useState } from "react";
import type { ResolvedRoute } from "../../types/domain.js";
import { usePlannerStore } from "../../app/store.js";
import { buildYoutubeUploadGuide, type YoutubeChannelVariant, type YoutubeUploadTemplate } from "../../services/youtubeUploadService.js";

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
  const project = projects.find((item) => item.id === projectId) ?? projects[0];
  const route = routes.find((item) => item.route.id === project?.routeId);
  const guide = useMemo(() => buildYoutubeUploadGuide(project, route, variant, template), [project, route, variant, template]);

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
  </main>;
}
