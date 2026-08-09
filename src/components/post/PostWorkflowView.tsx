import { AudioLines, CalendarDays, Camera, Check, CheckCircle2, Clapperboard, Images, ListChecks, MapPin, Palette, Rocket, RotateCcw, Scissors, Sparkles, Workflow } from "lucide-react";
import { useMemo, useState } from "react";
import type { DavinciStageId, DavinciWorkflow, ResolvedRoute } from "../../types/domain.js";
import { usePlannerStore } from "../../app/store.js";

const stageIcons = { media: Images, photo: Sparkles, cut: Scissors, edit: Clapperboard, fusion: Workflow, color: Palette, fairlight: AudioLines, deliver: Rocket } as const;

const captureLabels = { "scenic-drive": "风景驾车", "rain-walk": "雨景步行", "stationary-nature": "林间定点" } as const;

export function PostWorkflowView({ workflow, routes }: { workflow: DavinciWorkflow; routes: ResolvedRoute[] }) {
  const [mode, setMode] = useState<"category" | "pipeline">("category");
  const [selectedId, setSelectedId] = useState<DavinciStageId>(workflow.stages[0]?.id ?? "media");
  const plans = usePlannerStore((state) => state.plans);
  const [selectedPlanId, setSelectedPlanId] = useState(() => plans.at(-1)?.id ?? "");
  const postTasks = usePlannerStore((state) => state.postTasks);
  const postProject = usePlannerStore((state) => state.postProject);
  const importPostWorkflow = usePlannerStore((state) => state.importPostWorkflow);
  const togglePostTask = usePlannerStore((state) => state.togglePostTask);
  const clearPostWorkflow = usePlannerStore((state) => state.clearPostWorkflow);
  const selected = workflow.stages.find((stage) => stage.id === selectedId) ?? workflow.stages[0];
  const completed = postTasks.filter((task) => task.completed).length;
  const progress = postTasks.length ? Math.round(completed / postTasks.length * 100) : 0;
  const tasksByStage = useMemo(() => new Map(workflow.stages.map((stage) => [stage.id, postTasks.filter((task) => task.stageId === stage.id)])), [postTasks, workflow.stages]);
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);
  const projectRoute = routes.find((route) => route.route.id === (postProject?.routeId ?? selectedPlan?.routeId));
  const importWorkflow = () => {
    const plan = plans.find((item) => item.id === selectedPlanId);
    const route = routes.find((item) => item.route.id === plan?.routeId);
    importPostWorkflow(workflow, { ...(plan ? { planId: plan.id } : {}), ...(route ? { routeId: route.route.id } : {}), title: plan ? plan.objective : "独立后期项目" });
    setMode("pipeline");
  };
  if (!selected) return null;

  return <main className="post-page">
    <header className="post-head">
      <div><p className="eyebrow">POST PRODUCTION</p><h1>达芬奇后期流程</h1><p>从素材接收到交付归档，把拍摄成果变成可复现的成片流程。</p></div>
      <div className="post-head-actions"><div className="post-mode"><button className={mode === "category" ? "active" : ""} onClick={() => setMode("category")}>按类目</button><button className={mode === "pipeline" ? "active" : ""} onClick={() => setMode("pipeline")}>整套流程</button></div>{postTasks.length ? <button className="post-clear" onClick={clearPostWorkflow}><RotateCcw size={14} /> 重置流程</button> : <button className="post-import" onClick={importWorkflow}><ListChecks size={15} /> 导入整套流程</button>}</div>
    </header>

    <nav className="resolve-stage-rail" aria-label="DaVinci Resolve 工作区">
      {workflow.stages.map((stage) => { const Icon = stageIcons[stage.id]; const stageTasks = tasksByStage.get(stage.id) ?? []; const done = stageTasks.length > 0 && stageTasks.every((task) => task.completed); return <button key={stage.id} className={`${selected.id === stage.id ? "active" : ""} stage-${stage.id}`} onClick={() => { setSelectedId(stage.id); if (mode === "pipeline") document.getElementById(`post-${stage.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}><Icon size={21} /><span>{stage.label}</span><small>{stage.englishLabel}</small>{done && <CheckCircle2 size={11} className="stage-done" />}</button>; })}
    </nav>

    {!postTasks.length && <section className="post-project-picker"><label><CalendarDays size={15} /><span><small>关联拍摄计划</small><select value={selectedPlanId} onChange={(event) => setSelectedPlanId(event.target.value)}><option value="">独立后期项目</option>{plans.map((plan) => { const route = routes.find((item) => item.route.id === plan.routeId); return <option key={plan.id} value={plan.id}>{plan.scheduledDate} · {route?.route.name ?? plan.objective}</option>; })}</select></span></label><p>{selectedPlan ? "导入后会携带路线、地点、拍摄方式和设备参数。" : plans.length ? "也可以不关联计划，建立独立后期清单。" : "还没有设备内拍摄计划，可先独立导入，或从路线详情建立拍摄计划。"}</p></section>}

    {mode === "category" ? <section className="post-category">
      <div className={`post-stage-hero stage-${selected.id}`}><span>{String(workflow.stages.findIndex((stage) => stage.id === selected.id) + 1).padStart(2, "0")}</span><div><small>{selected.englishLabel.toUpperCase()}</small><h2>{selected.label}</h2><p>{selected.summary}</p></div></div>
      <div className="post-stage-body"><section><p className="eyebrow">CHECKLIST</p><h3>关键动作</h3><ol>{selected.tasks.map((task, index) => <li key={task}><span>{index + 1}</span>{task}</li>)}</ol></section><aside><small>完成标准</small><strong>{selected.output}</strong><p>本页内容基于 Blackmagic Design 官方工作区与培训材料整理，具体工具随软件版本变化。</p><a href={workflow.sourceUrl} target="_blank" rel="noreferrer">查看官方资料</a></aside></div>
    </section> : <section className="post-pipeline">
      {postProject && <div className="post-handoff"><div><small>当前后期项目</small><h2>{postProject.title}</h2>{projectRoute && <p>{projectRoute.route.name}</p>}</div>{projectRoute && <dl><div><dt>拍摄方式</dt><dd>{captureLabels[projectRoute.route.captureStyle]}</dd></div><div><dt><MapPin size={12} /> 素材地点</dt><dd>{projectRoute.waypoints.map((point) => point.name).join(" · ")}</dd></div><div><dt><Camera size={12} /> 相机参数</dt><dd>{projectRoute.cameraPresets.map((preset) => preset.camera).join(" · ")}</dd></div></dl>}</div>}
      <div className="post-progress"><div><span><strong>{progress}%</strong> 已完成</span><small>{completed} / {postTasks.length || workflow.stages.reduce((sum, stage) => sum + stage.tasks.length, 0)} 项</small></div><i><b style={{ width: `${progress}%` }} /></i>{!postTasks.length && <button onClick={importWorkflow}>导入并开始勾选</button>}</div>
      {workflow.stages.map((stage, stageIndex) => { const Icon = stageIcons[stage.id]; const localTasks = tasksByStage.get(stage.id) ?? []; return <article id={`post-${stage.id}`} className={`pipeline-stage stage-${stage.id}`} key={stage.id}><header><span><Icon size={19} /></span><div><small>STEP {String(stageIndex + 1).padStart(2, "0")} · {stage.englishLabel}</small><h2>{stage.label}</h2><p>{stage.summary}</p></div><strong>{localTasks.filter((task) => task.completed).length}/{stage.tasks.length}</strong></header><div>{stage.tasks.map((title, index) => { const localTask = localTasks[index]; return <button key={title} className={localTask?.completed ? "done" : ""} onClick={() => localTask && togglePostTask(localTask.id)} disabled={!localTask}><span>{localTask?.completed ? <Check size={14} /> : index + 1}</span>{title}</button>; })}</div><footer>完成标准 · {stage.output}</footer></article>; })}
    </section>}
  </main>;
}
