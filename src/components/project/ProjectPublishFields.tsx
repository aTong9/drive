import { useState } from "react";
import type { LocalVideoProject, ProjectPublishPackage, ResolvedRoute } from "../../types/domain.js";
import { generateProjectDescription } from "../../services/videoProjectService.js";

export function ProjectPublishFields({ project, route, onChange }: {
  project: LocalVideoProject;
  route?: ResolvedRoute | undefined;
  onChange: (publish: ProjectPublishPackage) => void;
}) {
  const { publish, channelMode } = project;
  const [replacement, setReplacement] = useState<string | null>(null);
  const channels = (["vision", "ambience"] as const).filter((channel) => channelMode === "dual" || channelMode === channel);
  return <>
    {channels.map((channel) => <label key={channel}>
      {channel === "vision" ? "Vision" : "Ambience"} 标题
      <input value={publish[`${channel}Title`]} onChange={(event) => onChange({ ...publish, [`${channel}Title`]: event.target.value })} />
    </label>)}
    <label>发布简介
      <textarea value={publish.description} onChange={(event) => onChange({ ...publish, description: event.target.value })} />
      <button type="button" className="publish-generate" onClick={() => {
        const description = generateProjectDescription(project, route);
        if (publish.description && publish.description !== description) { setReplacement(description); return; }
        onChange({ ...publish, description });
      }}>根据路线、设备、章节与音乐署名重新生成</button>
    </label>
    {replacement !== null && <section role="alert" className="project-gate-warning">
      <p>重新生成将替换当前发布简介。</p>
      <button onClick={() => { onChange({ ...publish, description: replacement }); setReplacement(null); }}>确认替换简介</button>
      <button onClick={() => setReplacement(null)}>保留原文</button>
    </section>}
    <label>章节<textarea value={publish.chapters} onChange={(event) => onChange({ ...publish, chapters: event.target.value })} /></label>
    <label>缩略图说明<textarea value={publish.thumbnailNote} onChange={(event) => onChange({ ...publish, thumbnailNote: event.target.value })} /></label>
    <p>以下状态分别手动确认；复制资料不会修改上传、处理或发布状态。</p>
    <div className="project-publish-milestones">
      {channels.flatMap((channel) => ([
        [`${channel}Uploaded`, `${channel === "vision" ? "Vision" : "Ambience"} 已上传`],
        [`${channel}Processed`, `${channel === "vision" ? "Vision" : "Ambience"} 平台处理完成`],
        [`${channel}Published`, `${channel === "vision" ? "Vision" : "Ambience"} 已发布`],
      ] as const).map(([key, label]) => <button key={key} aria-pressed={Boolean(publish[key])} className={publish[key] ? "done" : ""}
        onClick={() => onChange({ ...publish, [key]: !publish[key] })}>{label}</button>))}
      <button aria-pressed={publish.hdrVerified} className={publish.hdrVerified ? "done" : ""}
        onClick={() => onChange({ ...publish, hdrVerified: !publish.hdrVerified })}>2160p HDR 已核验</button>
    </div>
  </>;
}
