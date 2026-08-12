import { AudioLines, BookOpen, CalendarDays, Camera, Check, CheckCircle2, ChevronDown, Clapperboard, Images, ListChecks, MapPin, Palette, Rocket, RotateCcw, Scissors, SlidersHorizontal, Sparkles, Workflow } from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";
import type { DavinciStageId, DavinciWorkflow, ResolvedRoute } from "../../types/domain.js";
import { usePlannerStore } from "../../app/store.js";

const stageIcons = { media: Images, photo: Sparkles, cut: Scissors, edit: Clapperboard, fusion: Workflow, color: Palette, fairlight: AudioLines, deliver: Rocket } as const;

const captureLabels = { "scenic-drive": "风景驾车", "rain-walk": "雨景步行", "stationary-nature": "林间定点" } as const;

const resolvePresetControls = {
  "daylight-natural": ["TEMP 5600K", "TINT 0", "CONTRAST 1.08", "PIVOT 0.45", "SAT 48", "BOOST 8"],
  "sunset-warm": ["TEMP 6200K", "TINT +2", "CONTRAST 1.12", "PIVOT 0.42", "SAT 52", "HIGHLIGHTS -15"],
  "night-hdr-base": ["TEMP 4500K", "TINT +3", "CONTRAST 1.18", "PIVOT 0.38", "SAT 44", "HIGHLIGHTS -20"],
  "blue-hour-clean": ["TEMP 4700K", "TINT +2", "CONTRAST 1.10", "PIVOT 0.40", "SAT 46", "BOOST 10"],
  "cinematic-road": ["OFFSET -0.03", "CONTRAST 1.15", "PIVOT 0.40", "SAT 42", "BOOST 15", "LUMA MIX 85"]
} as const;

function ResolveColorScreenshot({ preset }: { preset: DavinciWorkflow["gradePresets"][number] }) {
  const controls = resolvePresetControls[preset.id as keyof typeof resolvePresetControls] ?? [];
  return <section className="resolve-color-shot" aria-label={`${preset.name} DaVinci Color 页面操作位置示意`}>
    <header><span><i /><i /><i /> DaVinci Resolve · Color</span><small>界面位置示意 · Resolve 21</small></header>
    <div className="resolve-shot-main">
      <div className="resolve-shot-gallery"><b>GALLERY</b><span>STILLS</span><span>POWERGRADES</span><span className="selected">{preset.name}</span></div>
      <div className="resolve-shot-viewer"><div className={`resolve-scene scene-${preset.id}`}><i /><b>{preset.scene}</b></div><footer>00:04:18:12 <span>REC.2100 ST2084</span></footer></div>
      <div className="resolve-shot-scopes"><b>SCOPES · WAVEFORM</b><svg viewBox="0 0 180 100" aria-hidden="true"><polyline points="0,86 18,78 35,80 50,62 65,67 80,45 98,58 112,34 128,48 144,20 160,42 180,12" /><line x1="0" y1="75" x2="180" y2="75" /><line x1="0" y1="50" x2="180" y2="50" /><line x1="0" y1="25" x2="180" y2="25" /></svg><small>1000 nits</small><small>100 nits</small><small>0 nits</small></div>
    </div>
    <div className="resolve-shot-tools">
      <div className="resolve-wheels"><header>PRIMARIES · COLOR WHEELS</header><div>{["LIFT", "GAMMA", "GAIN", "OFFSET"].map((wheel, index) => <span key={wheel}><i style={{ "--wheel-rotate": `${index * 72}deg` } as CSSProperties} /><small>{wheel}</small></span>)}</div></div>
      <div className="resolve-controls"><header>PRIMARY BARS</header><div>{controls.map((control) => { const [label = "", ...value] = control.split(" "); return <label key={control}><span>{label}</span><i><b style={{ width: `${45 + (control.length % 38)}%` }} /></i><strong>{value.join(" ")}</strong></label>; })}</div></div>
      <div className="resolve-nodes"><header>NODES</header><div>{preset.nodeAdjustments.slice(0, 6).map((node, index) => <span key={node} className={index === 0 ? "selected" : ""}><b>{String(index + 1).padStart(2, "0")}</b><small>{(node.split("：")[0] ?? node).replace(/^\d+\s*/, "")}</small></span>)}</div></div>
    </div>
    <footer><span>左侧 Gallery：保存/调用 PowerGrade</span><span>下方 Primaries：录入基础数值</span><span>右下 Nodes：按顺序搭建节点</span><span>右上 Scopes：以示波器复核</span></footer>
  </section>;
}

function TutorialVisual({ kind }: { kind: DavinciWorkflow["beginnerTutorial"][number]["visual"] }) {
  const labels = { project: ["COLOR SCIENCE", "DWG / INTERMEDIATE", "REC.2100 ST2084"], media: ["VIDEO", "ORIGINAL AUDIO", "MUSIC · LICENSES"], timeline: ["V1  MAIN PICTURE", "A1  ROAD SOUND", "A2  MUSIC · VISION"], color: ["BALANCE", "EXPOSURE", "LOOK", "OUTPUT"], audio: ["A1 ROAD", "A2 MUSIC", "A3 ROOM TONE"], deliver: ["H.265 MAIN10", "3840 × 2160", "BT.2020 · PQ"] } as const;
  return <div className={`tutorial-visual visual-${kind}`} role="img" aria-label={`${kind} 操作界面示意图`}><div className="visual-toolbar"><i /><i /><i /><span>DaVinci Resolve · {kind.toUpperCase()}</span></div><div className="visual-canvas"><b>{kind === "color" ? "NODE FLOW" : kind === "timeline" ? "PICTURE MASTER" : kind === "audio" ? "FAIRLIGHT MIX" : "WORKSPACE"}</b>{labels[kind].map((label, index) => <span key={label} style={{ "--visual-index": index } as CSSProperties}>{label}</span>)}</div><small>界面结构示意 · 按当前 Resolve 版本核对实际位置</small></div>;
}

export function PostWorkflowView({ workflow, routes }: { workflow: DavinciWorkflow; routes: ResolvedRoute[] }) {
  const [mode, setMode] = useState<"category" | "presets" | "pipeline" | "tutorial">("category");
  const [selectedPresetId, setSelectedPresetId] = useState(workflow.gradePresets[0]?.id ?? "");
  const [openTutorialId, setOpenTutorialId] = useState(workflow.beginnerTutorial[0]?.id ?? "");
  const [selectedId, setSelectedId] = useState<DavinciStageId>(workflow.stages[0]?.id ?? "media");
  const plans = usePlannerStore((state) => state.plans);
  const [selectedPlanId, setSelectedPlanId] = useState(() => plans.at(-1)?.id ?? "");
  const postTasks = usePlannerStore((state) => state.postTasks);
  const postProject = usePlannerStore((state) => state.postProject);
  const importPostWorkflow = usePlannerStore((state) => state.importPostWorkflow);
  const togglePostTask = usePlannerStore((state) => state.togglePostTask);
  const clearPostWorkflow = usePlannerStore((state) => state.clearPostWorkflow);
  const selected = workflow.stages.find((stage) => stage.id === selectedId) ?? workflow.stages[0];
  const selectedPreset = workflow.gradePresets.find((preset) => preset.id === selectedPresetId) ?? workflow.gradePresets[0];
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
      <div className="post-head-actions"><div className="post-mode"><button className={mode === "category" ? "active" : ""} onClick={() => setMode("category")}>按类目</button><button className={mode === "presets" ? "active" : ""} onClick={() => setMode("presets")}><SlidersHorizontal size={12} /> 场景预设</button><button className={mode === "pipeline" ? "active" : ""} onClick={() => setMode("pipeline")}>整套流程</button><button className={mode === "tutorial" ? "active" : ""} onClick={() => setMode("tutorial")}><BookOpen size={12} /> 新手教程</button></div>{postTasks.length ? <button className="post-clear" onClick={clearPostWorkflow}><RotateCcw size={14} /> 重置流程</button> : <button className="post-import" onClick={importWorkflow}><ListChecks size={15} /> 导入整套流程</button>}</div>
    </header>

    <nav className="resolve-stage-rail" aria-label="DaVinci Resolve 工作区">
      {workflow.stages.map((stage) => { const Icon = stageIcons[stage.id]; const stageTasks = tasksByStage.get(stage.id) ?? []; const done = stageTasks.length > 0 && stageTasks.every((task) => task.completed); return <button key={stage.id} className={`${selected.id === stage.id ? "active" : ""} stage-${stage.id}`} onClick={() => { setSelectedId(stage.id); if (stage.id === "color") setMode("presets"); else if (mode === "presets") setMode("category"); if (mode === "pipeline") document.getElementById(`post-${stage.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}><Icon size={21} /><span>{stage.label}</span><small>{stage.englishLabel}</small>{done && <CheckCircle2 size={11} className="stage-done" />}</button>; })}
    </nav>

    {!postTasks.length && <section className="post-project-picker"><label><CalendarDays size={15} /><span><small>关联拍摄计划</small><select value={selectedPlanId} onChange={(event) => setSelectedPlanId(event.target.value)}><option value="">独立后期项目</option>{plans.map((plan) => { const route = routes.find((item) => item.route.id === plan.routeId); return <option key={plan.id} value={plan.id}>{plan.scheduledDate} · {route?.route.name ?? plan.objective}</option>; })}</select></span></label><p>{selectedPlan ? "导入后会携带路线、地点、拍摄方式和设备参数。" : plans.length ? "也可以不关联计划，建立独立后期清单。" : "还没有设备内拍摄计划，可先独立导入，或从路线详情建立拍摄计划。"}</p></section>}

    {mode === "category" ? <section className="post-category">
      <div className={`post-stage-hero stage-${selected.id}`}><span>{String(workflow.stages.findIndex((stage) => stage.id === selected.id) + 1).padStart(2, "0")}</span><div><small>{selected.englishLabel.toUpperCase()}</small><h2>{selected.label}</h2><p>{selected.summary}</p></div></div>
      <div className="post-stage-body"><section><p className="eyebrow">CHECKLIST</p><h3>关键动作</h3><ol>{selected.tasks.map((task, index) => <li key={task}><span>{index + 1}</span>{task}</li>)}</ol></section><aside><small>完成标准</small><strong>{selected.output}</strong><p>本页内容基于 Blackmagic Design 官方工作区与培训材料整理，具体工具随软件版本变化。</p><a href={workflow.sourceUrl} target="_blank" rel="noreferrer">查看官方资料</a></aside></div>
    </section> : mode === "presets" && selectedPreset ? <section className="grade-presets-page">
      <header><div><p className="eyebrow">COLOR STARTING POINTS</p><h2>五套场景调色预设</h2><p>参数用于建立调色起点。先匹配曝光与白平衡，再按素材、监看环境和交付色彩空间微调。</p></div><span>DWG / Intermediate → Rec.2100 PQ</span></header>
      <div className="grade-preset-tabs">{workflow.gradePresets.map((preset) => <button key={preset.id} className={preset.id === selectedPreset.id ? "active" : ""} style={{ "--preset-accent": preset.accent } as CSSProperties} onClick={() => setSelectedPresetId(preset.id)}><i /> <span>{preset.name}<small>{preset.scene}</small></span></button>)}</div>
      <article className="grade-preset-card" style={{ "--preset-accent": selectedPreset.accent } as CSSProperties}>
        <div className="preset-preview"><div className="preset-sky" /><div className="preset-road" /><span>{selectedPreset.name}</span><small>LOOK PREVIEW · 示意</small></div>
        <div className="preset-content"><p className="preset-intent">{selectedPreset.intent}</p><dl><div><dt>曝光目标</dt><dd>{selectedPreset.exposure}</dd></div><div><dt>白平衡</dt><dd>{selectedPreset.whiteBalance}</dd></div><div><dt>对比度</dt><dd>{selectedPreset.contrast}</dd></div><div><dt>饱和度</dt><dd>{selectedPreset.saturation}</dd></div></dl><h3>推荐节点调整</h3><ol>{selectedPreset.nodeAdjustments.map((item) => <li key={item}>{item}</li>)}</ol>{selectedPreset.cautions.map((item) => <p className="preset-caution" key={item}>{item}</p>)}</div>
      </article>
      <ResolveColorScreenshot preset={selectedPreset} />
    </section> : mode === "tutorial" ? <section className="beginner-tutorial">
      <header><div><p className="eyebrow">BEGINNER GUIDE</p><h2>第一次完成一条 4K HDR 成片</h2><p>按顺序展开六个章节。每章包含操作位置、逐步动作、界面示意和可核验的完成标准。</p></div><a href={workflow.sourceUrl} target="_blank" rel="noreferrer">打开 Blackmagic 官方培训资料</a></header>
      <div className="tutorial-layout"><nav>{workflow.beginnerTutorial.map((tutorial, index) => <button key={tutorial.id} className={tutorial.id === openTutorialId ? "active" : ""} onClick={() => setOpenTutorialId(tutorial.id)}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{tutorial.title.replace(/^\d+\s*/, "")}</strong><small>{workflow.stages.find((stage) => stage.id === tutorial.workspace)?.label}</small></div><ChevronDown size={14} /></button>)}</nav><div className="tutorial-chapters">{workflow.beginnerTutorial.map((tutorial) => <article key={tutorial.id} className={tutorial.id === openTutorialId ? "active" : ""}><TutorialVisual kind={tutorial.visual} /><div className="tutorial-copy"><small>{workflow.stages.find((stage) => stage.id === tutorial.workspace)?.englishLabel.toUpperCase()}</small><h3>{tutorial.title}</h3><p>{tutorial.purpose}</p><ol>{tutorial.actions.map((action, index) => <li key={action}><span>{index + 1}</span><p>{action}</p></li>)}</ol><footer><CheckCircle2 size={15} /><span><small>完成检查</small>{tutorial.checkpoint}</span></footer></div></article>)}</div></div>
    </section> : <section className="post-pipeline">
      {postProject && <div className="post-handoff"><div><small>当前后期项目</small><h2>{postProject.title}</h2>{projectRoute && <p>{projectRoute.route.name}</p>}</div>{projectRoute && <dl><div><dt>拍摄方式</dt><dd>{captureLabels[projectRoute.route.captureStyle]}</dd></div><div><dt><MapPin size={12} /> 素材地点</dt><dd>{projectRoute.waypoints.map((point) => point.name).join(" · ")}</dd></div><div><dt><Camera size={12} /> 相机参数</dt><dd>{projectRoute.cameraPresets.map((preset) => preset.camera).join(" · ")}</dd></div></dl>}</div>}
      <div className="post-progress"><div><span><strong>{progress}%</strong> 已完成</span><small>{completed} / {postTasks.length || workflow.stages.reduce((sum, stage) => sum + stage.tasks.length, 0)} 项</small></div><i><b style={{ width: `${progress}%` }} /></i>{!postTasks.length && <button onClick={importWorkflow}>导入并开始勾选</button>}</div>
      {workflow.stages.map((stage, stageIndex) => { const Icon = stageIcons[stage.id]; const localTasks = tasksByStage.get(stage.id) ?? []; return <article id={`post-${stage.id}`} className={`pipeline-stage stage-${stage.id}`} key={stage.id}><header><span><Icon size={19} /></span><div><small>STEP {String(stageIndex + 1).padStart(2, "0")} · {stage.englishLabel}</small><h2>{stage.label}</h2><p>{stage.summary}</p></div><strong>{localTasks.filter((task) => task.completed).length}/{stage.tasks.length}</strong></header><div>{stage.tasks.map((title, index) => { const localTask = localTasks[index]; return <button key={title} className={localTask?.completed ? "done" : ""} onClick={() => localTask && togglePostTask(localTask.id)} disabled={!localTask}><span>{localTask?.completed ? <Check size={14} /> : index + 1}</span>{title}</button>; })}</div><footer>完成标准 · {stage.output}</footer></article>; })}
    </section>}
  </main>;
}
