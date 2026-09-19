import { buildResearchProject } from "../../services/videoProjectService.js";
import { useState } from "react";
import { usePlannerStore } from "../../app/store.js";

export function CreatorProjectNote({ topic, steps, references }: {
  topic: string; steps: string[]; references: Array<{ name: string; url: string }>;
}) {
  const projects = usePlannerStore((state) => state.videoProjects);
  const activeId = usePlannerStore((state) => state.activeVideoProjectId);
  const [projectId, setProjectId] = useState(activeId);
  const [message, setMessage] = useState("");
  const project = projects.find((item) => item.id === projectId);
  const note = [`选题：${topic}`, "执行结构：", ...steps.map((step, index) => `${index + 1}. ${step}`), "原案例参考（仅供研究）：", ...references.map((reference) => `${reference.name}：${reference.url}`)].join("\n");
  return <details className="creator-project-note">
    <summary>{topic}</summary>
    <pre>{note}</pre>
    <button onClick={() => usePlannerStore.getState().saveVideoProject(buildResearchProject(topic, note, steps))}>以此选题建立新项目</button>
    <label>带入视频项目<select value={project?.id ?? ""} onChange={(event) => { setProjectId(event.target.value); setMessage(""); }}>
      <option value="">{projects.length ? "请选择项目" : "暂无已有项目，可先建立选题项目"}</option>
      {projects.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
    </select></label>
    <button disabled={!project} onClick={() => {
      if (!project) return;
      if (!project.objective.includes(note)) usePlannerStore.getState().updateVideoProject(project.id, { objective: `${project.objective}\n\n${note}` });
      setMessage("选题与来源已保存在项目目标中，可继续补充拍摄安排。");
    }}>保存选题到项目</button>
    <button onClick={() => project ? usePlannerStore.getState().selectVideoProject(project.id) : usePlannerStore.getState().setView("plans")}>{project ? "打开项目" : "前往拍摄计划"}</button>
    <p role="status">{message}</p>
  </details>;
}
