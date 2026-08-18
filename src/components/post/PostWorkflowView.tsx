import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  BookOpen,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Clapperboard,
  Compass,
  GitCompareArrows,
  Heart,
  Images,
  ListChecks,
  MapPin,
  Palette,
  Play,
  Rocket,
  RotateCcw,
  Scissors,
  SlidersHorizontal,
  Sparkles,
  Star,
  Workflow,
} from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";
import type {
  DavinciStageId,
  DavinciWorkflow,
  ResolvedRoute,
} from "../../types/domain.js";
import { usePlannerStore } from "../../app/store.js";
import { PostCompareView } from "./PostCompareView.js";
import { PostDecisionTools } from "./PostDecisionTools.js";
import { PostGlossary } from "./PostGlossary.js";
import { auditGradePreset } from "../../services/postDecisionService.js";
import { SonyMrWorkflowPanel } from "./SonyMrWorkflowPanel.js";
import { ColorFinishingGuide } from "./ColorFinishingGuide.js";

const stageIcons = {
  media: Images,
  photo: Sparkles,
  cut: Scissors,
  edit: Clapperboard,
  fusion: Workflow,
  color: Palette,
  fairlight: AudioLines,
  deliver: Rocket,
} as const;

const captureLabels = {
  "scenic-drive": "风景驾车",
  "rain-walk": "雨景步行",
  "stationary-nature": "林间定点",
} as const;

const timelineParameterLabels = {
  temperature: "色温",
  tint: "色调",
  contrast: "对比度",
  pivot: "轴心",
  colorBoost: "色彩增强",
  shadows: "阴影",
  highlights: "高光",
  saturation: "饱和度",
  hueMix: "色相混合",
  lumaMix: "亮度混合",
  midtoneDetail: "中间调细节",
} as const;

function getResolvePresetControls(
  preset: DavinciWorkflow["gradePresets"][number],
) {
  const values = preset.timelineParameters;
  return [
    `TEMP ${values.temperature}`,
    `TINT ${values.tint}`,
    `CONTRAST ${values.contrast}`,
    `PIVOT ${values.pivot}`,
    `SAT ${values.saturation}`,
    `BOOST ${values.colorBoost}`,
  ];
}

function ResolveColorScreenshot({
  preset,
}: {
  preset: DavinciWorkflow["gradePresets"][number];
}) {
  const controls = getResolvePresetControls(preset);
  return (
    <section
      className="resolve-color-shot"
      aria-label={`${preset.name} DaVinci Color 页面操作位置示意`}
    >
      <header>
        <span>
          <i />
          <i />
          <i /> DaVinci Resolve · Color
        </span>
        <small>界面位置示意 · Resolve 21</small>
      </header>
      <div className="resolve-shot-main">
        <div className="resolve-shot-gallery">
          <b>GALLERY</b>
          <span>STILLS</span>
          <span>POWERGRADES</span>
          <span className="selected">{preset.name}</span>
        </div>
        <div className="resolve-shot-viewer">
          <div className={`resolve-scene scene-${preset.id}`}>
            <i />
            <b>{preset.scene}</b>
          </div>
          <footer>
            00:04:18:12 <span>REC.2100 ST2084</span>
          </footer>
        </div>
        <div className="resolve-shot-scopes">
          <b>SCOPES · WAVEFORM</b>
          <svg viewBox="0 0 180 100" aria-hidden="true">
            <polyline points="0,86 18,78 35,80 50,62 65,67 80,45 98,58 112,34 128,48 144,20 160,42 180,12" />
            <line x1="0" y1="75" x2="180" y2="75" />
            <line x1="0" y1="50" x2="180" y2="50" />
            <line x1="0" y1="25" x2="180" y2="25" />
          </svg>
          <small>1000 nits</small>
          <small>100 nits</small>
          <small>0 nits</small>
        </div>
      </div>
      <div className="resolve-shot-tools">
        <div className="resolve-wheels">
          <header>PRIMARIES · COLOR WHEELS</header>
          <div>
            {["LIFT", "GAMMA", "GAIN", "OFFSET"].map((wheel, index) => (
              <span key={wheel}>
                <i
                  style={
                    { "--wheel-rotate": `${index * 72}deg` } as CSSProperties
                  }
                />
                <small>{wheel}</small>
              </span>
            ))}
          </div>
        </div>
        <div className="resolve-controls">
          <header>PRIMARY BARS</header>
          <div>
            {controls.map((control) => {
              const [label = "", ...value] = control.split(" ");
              return (
                <label key={control}>
                  <span>{label}</span>
                  <i>
                    <b style={{ width: `${45 + (control.length % 38)}%` }} />
                  </i>
                  <strong>{value.join(" ")}</strong>
                </label>
              );
            })}
          </div>
        </div>
        <div className="resolve-nodes">
          <header>NODES</header>
          <div>
            {preset.nodeAdjustments.slice(0, 6).map((node, index) => (
              <span key={node} className={index === 0 ? "selected" : ""}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                <small>
                  {(node.split("：")[0] ?? node).replace(/^\d+\s*/, "")}
                </small>
              </span>
            ))}
          </div>
        </div>
      </div>
      <footer>
        <span>左侧 Gallery：保存/调用 PowerGrade</span>
        <span>下方 Primaries：录入基础数值</span>
        <span>右下 Nodes：按顺序搭建节点</span>
        <span>右上 Scopes：以示波器复核</span>
      </footer>
    </section>
  );
}

function TutorialVisual({
  kind,
}: {
  kind: DavinciWorkflow["beginnerTutorial"][number]["visual"];
}) {
  const labels = {
    project: ["COLOR SCIENCE", "DWG / INTERMEDIATE", "REC.2100 ST2084"],
    media: ["VIDEO", "ORIGINAL AUDIO", "MUSIC · LICENSES"],
    timeline: ["V1  MAIN PICTURE", "A1  ROAD SOUND", "A2  MUSIC · VISION"],
    color: ["BALANCE", "EXPOSURE", "LOOK", "OUTPUT"],
    audio: ["A1 ROAD", "A2 MUSIC", "A3 ROOM TONE"],
    deliver: ["H.265 MAIN10", "3840 × 2160", "BT.2020 · PQ"],
  } as const;
  return (
    <div
      className={`tutorial-visual visual-${kind}`}
      role="img"
      aria-label={`${kind} 操作界面示意图`}
    >
      <div className="visual-toolbar">
        <i />
        <i />
        <i />
        <span>DaVinci Resolve · {kind.toUpperCase()}</span>
      </div>
      <div className="visual-canvas">
        <b>
          {kind === "color"
            ? "NODE FLOW"
            : kind === "timeline"
              ? "PICTURE MASTER"
              : kind === "audio"
                ? "FAIRLIGHT MIX"
                : "WORKSPACE"}
        </b>
        {labels[kind].map((label, index) => (
          <span
            key={label}
            style={{ "--visual-index": index } as CSSProperties}
          >
            {label}
          </span>
        ))}
      </div>
      <small>界面结构示意 · 按当前 Resolve 版本核对实际位置</small>
    </div>
  );
}

export function PostWorkflowView({
  workflow,
  routes,
}: {
  workflow: DavinciWorkflow;
  routes: ResolvedRoute[];
}) {
  const [mode, setMode] = useState<
    | "overview"
    | "guide"
    | "presets"
    | "compare"
    | "tools"
    | "glossary"
    | "favorites"
    | "pipeline"
    | "tutorial"
  >("overview");
  const [selectedPresetId, setSelectedPresetId] = useState(
    workflow.gradePresets[0]?.id ?? "",
  );
  const [openTutorialId, setOpenTutorialId] = useState(
    workflow.beginnerTutorial[0]?.id ?? "",
  );
  const [selectedId, setSelectedId] = useState<DavinciStageId>(
    workflow.stages[0]?.id ?? "media",
  );
  const plans = usePlannerStore((state) => state.plans);
  const [selectedPlanId, setSelectedPlanId] = useState(
    () => plans.at(-1)?.id ?? "",
  );
  const postTasks = usePlannerStore((state) => state.postTasks);
  const postProject = usePlannerStore((state) => state.postProject);
  const importPostWorkflow = usePlannerStore(
    (state) => state.importPostWorkflow,
  );
  const togglePostTask = usePlannerStore((state) => state.togglePostTask);
  const clearPostWorkflow = usePlannerStore((state) => state.clearPostWorkflow);
  const favoritePresetIds = usePlannerStore(
    (state) => state.favoriteDavinciPresetIds,
  );
  const toggleFavoritePreset = usePlannerStore(
    (state) => state.toggleFavoriteDavinciPreset,
  );
  const selected =
    workflow.stages.find((stage) => stage.id === selectedId) ??
    workflow.stages[0];
  const selectedPreset =
    workflow.gradePresets.find((preset) => preset.id === selectedPresetId) ??
    workflow.gradePresets[0];
  const selectedPresetAudit = selectedPreset
    ? auditGradePreset(selectedPreset)
    : undefined;
  const completed = postTasks.filter((task) => task.completed).length;
  const progress = postTasks.length
    ? Math.round((completed / postTasks.length) * 100)
    : 0;
  const tasksByStage = useMemo(
    () =>
      new Map(
        workflow.stages.map((stage) => [
          stage.id,
          postTasks.filter((task) => task.stageId === stage.id),
        ]),
      ),
    [postTasks, workflow.stages],
  );
  const selectedStageIndex = workflow.stages.findIndex(
    (stage) => stage.id === selected?.id,
  );
  const selectedStageTasks = selected
    ? (tasksByStage.get(selected.id) ?? [])
    : [];
  const selectedStageCompleted = selectedStageTasks.filter(
    (task) => task.completed,
  ).length;
  const stageIsDone = (stageId: DavinciStageId) => {
    const tasks = tasksByStage.get(stageId) ?? [];
    return tasks.length > 0 && tasks.every((task) => task.completed);
  };
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);
  const projectRoute = routes.find(
    (route) =>
      route.route.id === (postProject?.routeId ?? selectedPlan?.routeId),
  );
  const importWorkflow = () => {
    const plan = plans.find((item) => item.id === selectedPlanId);
    const route = routes.find((item) => item.route.id === plan?.routeId);
    importPostWorkflow(workflow, {
      ...(plan ? { planId: plan.id } : {}),
      ...(route ? { routeId: route.route.id } : {}),
      title: plan ? plan.objective : "独立后期项目",
    });
    setMode("pipeline");
  };
  if (!selected) return null;

  return (
    <main className="post-page">
      <header className="post-head">
        <div>
          <p className="eyebrow">POST PRODUCTION</p>
          <h1>达芬奇后期流程</h1>
          <p>从素材接收到交付归档，把拍摄成果变成可复现的成片流程。</p>
        </div>
        <div className="post-head-actions">
          <div className="post-mode">
            <button
              className={mode === "overview" ? "active" : ""}
              onClick={() => setMode("overview")}
            >
              <Compass size={12} /> 总览
            </button>
            <button
              className={mode === "presets" ? "active" : ""}
              onClick={() => setMode("presets")}
            >
              <SlidersHorizontal size={12} /> 调色预设
            </button>
            <button
              className={mode === "glossary" ? "active" : ""}
              onClick={() => setMode("glossary")}
            >
              <BookOpen size={12} /> 参数词典
            </button>
            <button
              className={mode === "compare" ? "active" : ""}
              onClick={() => setMode("compare")}
            >
              <GitCompareArrows size={12} /> 链路对比
            </button>
            <button
              className={mode === "tools" ? "active" : ""}
              onClick={() => setMode("tools")}
            >
              <SlidersHorizontal size={12} /> 决策工具
            </button>
            <button
              className={mode === "favorites" ? "active" : ""}
              onClick={() => setMode("favorites")}
            >
              <Heart size={12} /> 收藏 {favoritePresetIds.length}
            </button>
            <button
              className={
                mode === "guide" || mode === "tutorial" ? "active" : ""
              }
              onClick={() => setMode("guide")}
            >
              流程指南
            </button>
            <button
              className={mode === "pipeline" ? "active" : ""}
              onClick={() => setMode("pipeline")}
            >
              <ListChecks size={12} /> 项目执行
            </button>
          </div>
        </div>
      </header>

      {(mode === "guide" || mode === "presets" || mode === "pipeline") && (
        <nav className="resolve-stage-rail" aria-label="DaVinci Resolve 工作区">
          {workflow.stages.map((stage) => {
            const Icon = stageIcons[stage.id];
            const stageTasks = tasksByStage.get(stage.id) ?? [];
            const done =
              stageTasks.length > 0 &&
              stageTasks.every((task) => task.completed);
            return (
              <button
                key={stage.id}
                className={`${selected.id === stage.id ? "active" : ""} stage-${stage.id}`}
                onClick={() => {
                  setSelectedId(stage.id);
                  if (mode !== "pipeline" && stage.id === "color")
                    setMode("presets");
                  else if (mode !== "pipeline") setMode("guide");
                }}
              >
                <Icon size={21} />
                <span>{stage.label}</span>
                <small>{stage.englishLabel}</small>
                {done && <CheckCircle2 size={11} className="stage-done" />}
              </button>
            );
          })}
        </nav>
      )}

      {mode === "overview" ? (
        <section className="post-overview">
          <div className="post-overview-hero">
            <div>
              <p className="eyebrow">ONE MASTER · TWO CHANNELS</p>
              <h2>先建立母版，再分发双频道</h2>
              <p>
                一条 Picture Master 保持画面锁定；aBin Vision
                使用道路声与授权音乐，aBin Ambience 只保留真实环境声。
              </p>
            </div>
            <dl>
              <div>
                <dt>工作区</dt>
                <dd>{workflow.stages.length}</dd>
              </div>
              <div>
                <dt>任务</dt>
                <dd>
                  {workflow.stages.reduce(
                    (sum, stage) => sum + stage.tasks.length,
                    0,
                  )}
                </dd>
              </div>
              <div>
                <dt>调色起点</dt>
                <dd>{workflow.gradePresets.length}</dd>
              </div>
              <div>
                <dt>交付</dt>
                <dd>4K HDR</dd>
              </div>
            </dl>
          </div>
          <SonyMrWorkflowPanel />
          <div className="post-overview-grid">
            <section>
              <header>
                <small>RECOMMENDED PATH</small>
                <h3>推荐执行顺序</h3>
              </header>
              <ol>
                <li>
                  <span>01</span>
                  <div>
                    <strong>确认项目上下文</strong>
                    <p>
                      选择拍摄计划或建立独立项目，先锁定路线、帧率和输出目标。
                    </p>
                  </div>
                </li>
                <li>
                  <span>02</span>
                  <div>
                    <strong>按工作区推进</strong>
                    <p>
                      从 Media 到 Deliver
                      依序处理，不在调色前跳过素材整理与锁画。
                    </p>
                  </div>
                </li>
                <li>
                  <span>03</span>
                  <div>
                    <strong>匹配后再套风格</strong>
                    <p>先逐镜匹配曝光与白平衡，再从场景预设库选择起点。</p>
                  </div>
                </li>
                <li>
                  <span>04</span>
                  <div>
                    <strong>双频道质检交付</strong>
                    <p>
                      核对 Vision 与 Ambience 画面同步、响度、HDR
                      元数据和上传结果。
                    </p>
                  </div>
                </li>
              </ol>
              <div className="post-overview-links">
                <button onClick={() => setMode("guide")}>查看工作区指南</button>
                <button onClick={() => setMode("tutorial")}>
                  从新手教程开始
                </button>
              </div>
            </section>
            <aside>
              {postTasks.length ? (
                <>
                  <small>CURRENT PROJECT</small>
                  <h3>{postProject?.title ?? "当前后期项目"}</h3>
                  <div className="overview-progress">
                    <strong>{progress}%</strong>
                    <span>
                      <i>
                        <b style={{ width: `${progress}%` }} />
                      </i>
                      {completed} / {postTasks.length} 项完成
                    </span>
                  </div>
                  {projectRoute && (
                    <p>
                      {projectRoute.route.name}
                      <br />
                      {projectRoute.waypoints
                        .map((point) => point.name)
                        .join(" · ")}
                    </p>
                  )}
                  <button
                    className="overview-primary"
                    onClick={() => setMode("pipeline")}
                  >
                    <Play size={14} /> 继续项目执行
                  </button>
                  <button
                    className="overview-reset"
                    onClick={clearPostWorkflow}
                  >
                    <RotateCcw size={13} /> 重置当前流程
                  </button>
                </>
              ) : (
                <>
                  <small>START A PROJECT</small>
                  <h3>建立后期执行清单</h3>
                  <label>
                    <CalendarDays size={15} />
                    <span>
                      <small>关联拍摄计划</small>
                      <select
                        value={selectedPlanId}
                        onChange={(event) =>
                          setSelectedPlanId(event.target.value)
                        }
                      >
                        <option value="">独立后期项目</option>
                        {plans.map((plan) => {
                          const route = routes.find(
                            (item) => item.route.id === plan.routeId,
                          );
                          return (
                            <option key={plan.id} value={plan.id}>
                              {plan.scheduledDate} ·{" "}
                              {route?.route.name ?? plan.objective}
                            </option>
                          );
                        })}
                      </select>
                    </span>
                  </label>
                  <p>
                    {selectedPlan
                      ? "将携带路线、地点、拍摄方式和设备参数。"
                      : plans.length
                        ? "也可以建立不关联拍摄计划的独立项目。"
                        : "还没有拍摄计划，可先独立建立，之后再补充项目资料。"}
                  </p>
                  <button className="overview-primary" onClick={importWorkflow}>
                    <ListChecks size={14} /> 导入完整执行清单
                  </button>
                </>
              )}
            </aside>
          </div>
        </section>
      ) : mode === "guide" ? (
        <section className="post-category">
          <div className={`post-stage-hero stage-${selected.id}`}>
            <span>
              {String(
                workflow.stages.findIndex((stage) => stage.id === selected.id) +
                  1,
              ).padStart(2, "0")}
            </span>
            <div>
              <small>{selected.englishLabel.toUpperCase()}</small>
              <h2>{selected.label}</h2>
              <p>{selected.summary}</p>
            </div>
          </div>
          <div className="post-stage-body">
            <section>
              <p className="eyebrow">CHECKLIST</p>
              <h3>关键动作</h3>
              <ol>
                {selected.tasks.map((task, index) => (
                  <li key={task}>
                    <span>{index + 1}</span>
                    {task}
                  </li>
                ))}
              </ol>
            </section>
            <aside>
              <small>完成标准</small>
              <strong>{selected.output}</strong>
              <p>
                本页内容基于 Blackmagic Design
                官方工作区与培训材料整理，具体工具随软件版本变化。
              </p>
              <a href={workflow.sourceUrl} target="_blank" rel="noreferrer">
                查看官方资料
              </a>
            </aside>
          </div>
        </section>
      ) : mode === "presets" && selectedPreset ? (
        <section className="grade-presets-page">
          <header>
            <div>
              <p className="eyebrow">COLOR STARTING POINTS</p>
              <h2>{workflow.gradePresets.length} 套场景调色预设</h2>
              <p>
                参数用于建立调色起点。先匹配曝光与白平衡，再按素材、监看环境和交付色彩空间微调。
              </p>
            </div>
            <span>DWG / Intermediate → Rec.2100 PQ</span>
          </header>
          <div className="grade-preset-tabs">
            {workflow.gradePresets.map((preset) => (
              <button
                key={preset.id}
                className={preset.id === selectedPreset.id ? "active" : ""}
                style={{ "--preset-accent": preset.accent } as CSSProperties}
                onClick={() => setSelectedPresetId(preset.id)}
              >
                <i />{" "}
                <span>
                  {preset.name}
                  <small>{preset.scene}</small>
                </span>
              </button>
            ))}
          </div>
          <div className="grade-preset-actions">
            <button
              className={
                favoritePresetIds.includes(selectedPreset.id) ? "active" : ""
              }
              onClick={() => toggleFavoritePreset(selectedPreset.id)}
            >
              <Heart
                size={13}
                fill={
                  favoritePresetIds.includes(selectedPreset.id)
                    ? "currentColor"
                    : "none"
                }
              />
              {favoritePresetIds.includes(selectedPreset.id)
                ? "已收藏"
                : "收藏预设"}
            </button>
            <span>完整性 {selectedPresetAudit?.score ?? 0}</span>
          </div>
          <article
            className="grade-preset-card"
            style={
              { "--preset-accent": selectedPreset.accent } as CSSProperties
            }
          >
            <div className="preset-preview">
              <div className="preset-sky" />
              <div className="preset-road" />
              <span>{selectedPreset.name}</span>
              <small>LOOK PREVIEW · 示意</small>
            </div>
            <div className="preset-content">
              <p className="preset-intent">{selectedPreset.intent}</p>
              <dl>
                <div>
                  <dt>曝光目标</dt>
                  <dd>{selectedPreset.exposure}</dd>
                </div>
                <div>
                  <dt>白平衡</dt>
                  <dd>{selectedPreset.whiteBalance}</dd>
                </div>
                <div>
                  <dt>对比度</dt>
                  <dd>{selectedPreset.contrast}</dd>
                </div>
                <div>
                  <dt>饱和度</dt>
                  <dd>{selectedPreset.saturation}</dd>
                </div>
              </dl>
              <section className="timeline-parameter-sheet">
                <header>
                  <div>
                    <small>TIMELINE LEVEL</small>
                    <h3>当前时间线级参数</h3>
                  </div>
                  <span>按图示模式抄录</span>
                </header>
                <dl>
                  {Object.entries(selectedPreset.timelineParameters).map(
                    ([key, value]) => (
                      <div key={key}>
                        <dt>
                          {
                            timelineParameterLabels[
                              key as keyof typeof timelineParameterLabels
                            ]
                          }
                        </dt>
                        <dd>{value}</dd>
                      </div>
                    ),
                  )}
                </dl>
                <p>
                  色相与亮度混合默认保持不变；只有预设明确给出不同值时才调整。所有数值均为镜头匹配完成后的时间线
                  Look 起点。
                </p>
              </section>
              <h3>推荐节点调整</h3>
              <ol>
                {selectedPreset.nodeAdjustments.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
              {selectedPreset.cautions.map((item) => (
                <p className="preset-caution" key={item}>
                  {item}
                </p>
              ))}
            </div>
          </article>
          <ResolveColorScreenshot preset={selectedPreset} />
          <ColorFinishingGuide preset={selectedPreset} />
        </section>
      ) : mode === "glossary" ? (
        <PostGlossary />
      ) : mode === "compare" ? (
        <PostCompareView />
      ) : mode === "tools" ? (
        <PostDecisionTools />
      ) : mode === "favorites" ? (
        <section className="post-workspace post-favorites">
          <header>
            <div>
              <p className="eyebrow">SAVED LOOKS</p>
              <h2>收藏的调色预设</h2>
              <p>
                保留最常用的场景起点，打开后仍需逐镜完成曝光、白平衡与示波器复核。
              </p>
            </div>
            <Heart size={28} />
          </header>
          <div>
            {workflow.gradePresets
              .filter((preset) => favoritePresetIds.includes(preset.id))
              .map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPresetId(preset.id);
                    setMode("presets");
                  }}
                >
                  <i style={{ background: preset.accent }} />
                  <span>
                    <small>{preset.scene}</small>
                    <strong>{preset.name}</strong>
                    <p>{preset.intent}</p>
                  </span>
                  <Star size={15} fill="currentColor" />
                </button>
              ))}
          </div>
          {!favoritePresetIds.length && (
            <p className="post-empty">还没有收藏调色预设。</p>
          )}
        </section>
      ) : mode === "tutorial" ? (
        <section className="beginner-tutorial">
          <header>
            <div>
              <p className="eyebrow">BEGINNER GUIDE</p>
              <h2>第一次完成一条 4K HDR 成片</h2>
              <p>
                按顺序展开六个章节。每章包含操作位置、逐步动作、界面示意和可核验的完成标准。
              </p>
            </div>
            <a href={workflow.sourceUrl} target="_blank" rel="noreferrer">
              打开 Blackmagic 官方培训资料
            </a>
          </header>
          <div className="tutorial-layout">
            <nav>
              {workflow.beginnerTutorial.map((tutorial, index) => (
                <button
                  key={tutorial.id}
                  className={tutorial.id === openTutorialId ? "active" : ""}
                  onClick={() => setOpenTutorialId(tutorial.id)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{tutorial.title.replace(/^\d+\s*/, "")}</strong>
                    <small>
                      {
                        workflow.stages.find(
                          (stage) => stage.id === tutorial.workspace,
                        )?.label
                      }
                    </small>
                  </div>
                  <ChevronDown size={14} />
                </button>
              ))}
            </nav>
            <div className="tutorial-chapters">
              {workflow.beginnerTutorial.map((tutorial) => (
                <article
                  key={tutorial.id}
                  className={tutorial.id === openTutorialId ? "active" : ""}
                >
                  <TutorialVisual kind={tutorial.visual} />
                  <div className="tutorial-copy">
                    <small>
                      {workflow.stages
                        .find((stage) => stage.id === tutorial.workspace)
                        ?.englishLabel.toUpperCase()}
                    </small>
                    <h3>{tutorial.title}</h3>
                    <p>{tutorial.purpose}</p>
                    <ol>
                      {tutorial.actions.map((action, index) => (
                        <li key={action}>
                          <span>{index + 1}</span>
                          <p>{action}</p>
                        </li>
                      ))}
                    </ol>
                    <footer>
                      <CheckCircle2 size={15} />
                      <span>
                        <small>完成检查</small>
                        {tutorial.checkpoint}
                      </span>
                    </footer>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="post-pipeline">
          {postProject && (
            <div className="post-handoff">
              <div>
                <small>当前后期项目</small>
                <h2>{postProject.title}</h2>
                {projectRoute && <p>{projectRoute.route.name}</p>}
              </div>
              {projectRoute && (
                <dl>
                  <div>
                    <dt>拍摄方式</dt>
                    <dd>{captureLabels[projectRoute.route.captureStyle]}</dd>
                  </div>
                  <div>
                    <dt>
                      <MapPin size={12} /> 素材地点
                    </dt>
                    <dd>
                      {projectRoute.waypoints
                        .map((point) => point.name)
                        .join(" · ")}
                    </dd>
                  </div>
                  <div>
                    <dt>
                      <Camera size={12} /> 相机参数
                    </dt>
                    <dd>
                      {projectRoute.cameraPresets
                        .map((preset) => preset.camera)
                        .join(" · ")}
                    </dd>
                  </div>
                </dl>
              )}
            </div>
          )}
          <div className="post-progress">
            <div>
              <span>
                <strong>{progress}%</strong> 已完成
              </span>
              <small>
                {completed} /{" "}
                {postTasks.length ||
                  workflow.stages.reduce(
                    (sum, stage) => sum + stage.tasks.length,
                    0,
                  )}{" "}
                项
              </small>
            </div>
            <i>
              <b style={{ width: `${progress}%` }} />
            </i>
            {!postTasks.length && (
              <button onClick={() => setMode("overview")}>先建立项目</button>
            )}
          </div>
          <section className="post-master-status">
            <article className={stageIsDone("edit") ? "done" : ""}>
              <small>PICTURE MASTER</small>
              <strong>画面母版</strong>
              <span>
                {stageIsDone("edit") ? "已锁画" : "等待 Edit 工作区锁画"}
              </span>
            </article>
            <article className={stageIsDone("fairlight") ? "done" : ""}>
              <small>aBin VISION</small>
              <strong>道路声 + 授权音乐</strong>
              <span>
                {stageIsDone("fairlight")
                  ? "音频结构已完成"
                  : "由锁定母版同步派生"}
              </span>
            </article>
            <article className={stageIsDone("fairlight") ? "done" : ""}>
              <small>aBin AMBIENCE</small>
              <strong>真实环境声</strong>
              <span>
                {stageIsDone("fairlight")
                  ? "无音乐版本已完成"
                  : "保持相同画面结构"}
              </span>
            </article>
            <article className={stageIsDone("deliver") ? "done" : ""}>
              <small>4K HDR DELIVERY</small>
              <strong>双频道交付</strong>
              <span>
                {stageIsDone("deliver") ? "等待上传复核" : "HEVC Main10 · PQ"}
              </span>
            </article>
          </section>
          <div className="pipeline-focus-head">
            <div>
              <small>ACTIVE WORKSPACE</small>
              <h2>{selected.label}</h2>
              <p>
                一次只完成一个工作区。勾完当前检查项并确认完成标准，再进入下一步。
              </p>
            </div>
            <span>
              <strong>{selectedStageCompleted}</strong> /{" "}
              {selected.tasks.length}
            </span>
          </div>
          {(() => {
            const stage = selected;
            const Icon = stageIcons[stage.id];
            return (
              <article
                id={`post-${stage.id}`}
                className={`pipeline-stage pipeline-stage-focus stage-${stage.id}`}
              >
                <header>
                  <span>
                    <Icon size={19} />
                  </span>
                  <div>
                    <small>
                      STEP {String(selectedStageIndex + 1).padStart(2, "0")} ·{" "}
                      {stage.englishLabel}
                    </small>
                    <h2>{stage.label}</h2>
                    <p>{stage.summary}</p>
                  </div>
                  <strong>
                    {selectedStageCompleted}/{stage.tasks.length}
                  </strong>
                </header>
                <div>
                  {stage.tasks.map((title, index) => {
                    const localTask = selectedStageTasks[index];
                    return (
                      <button
                        key={title}
                        className={localTask?.completed ? "done" : ""}
                        onClick={() =>
                          localTask && togglePostTask(localTask.id)
                        }
                        disabled={!localTask}
                      >
                        <span>
                          {localTask?.completed ? (
                            <Check size={14} />
                          ) : (
                            index + 1
                          )}
                        </span>
                        {title}
                      </button>
                    );
                  })}
                </div>
                <footer>完成标准 · {stage.output}</footer>
              </article>
            );
          })()}
          <nav className="pipeline-step-nav">
            <button
              disabled={selectedStageIndex <= 0}
              onClick={() => {
                const previous = workflow.stages[selectedStageIndex - 1];
                if (previous) setSelectedId(previous.id);
              }}
            >
              <ArrowLeft size={14} /> 上一工作区
            </button>
            <div>
              <small>下一步</small>
              <strong>
                {workflow.stages[selectedStageIndex + 1]?.label ??
                  "全部工作区已完成"}
              </strong>
            </div>
            <button
              disabled={selectedStageIndex >= workflow.stages.length - 1}
              onClick={() => {
                const next = workflow.stages[selectedStageIndex + 1];
                if (next) setSelectedId(next.id);
              }}
            >
              下一工作区 <ArrowRight size={14} />
            </button>
          </nav>
        </section>
      )}
    </main>
  );
}
