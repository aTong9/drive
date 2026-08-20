import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  Calculator,
  Camera,
  Check,
  ChevronRight,
  Clapperboard,
  ClipboardCheck,
  Copy,
  Film,
  FileText,
  HardDrive,
  Headphones,
  ListChecks,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useState } from "react";
import { usePlannerStore } from "../../app/store.js";
import {
  longformBlueprints,
  longformEditWarnings,
  longformFormats,
  longformPhases,
  longformQualityGates,
  type LongformFormatId,
} from "../../data/longformProduction.js";
import {
  buildLongformShootBlocks,
  buildScaledChapterSchedule,
  estimateLongformScale,
} from "../../services/longformPlanningService.js";
import { Documentary90Tutorial } from "./Documentary90Tutorial.js";
import { FormatProcessTutorial } from "./FormatProcessTutorial.js";

type Workspace =
  | "planner"
  | "schedule"
  | "formats"
  | "production"
  | "shooting"
  | "blueprint"
  | "editing"
  | "quality";

const formatGoals: Array<{
  id: LongformFormatId;
  label: string;
  question: string;
}> = [
  {
    id: "documentary",
    label: "真实人物与事件",
    question: "用行动、采访和证据讲清现实变化",
  },
  {
    id: "cinematic",
    label: "电影式旅行",
    question: "用路线、光线和声音建立章节旅程",
  },
  {
    id: "observational",
    label: "长时间沉浸",
    question: "保持真实、连续、稳定的环境体验",
  },
  {
    id: "road-essay",
    label: "路线与观点",
    question: "用地点、资料和个人观察形成公路散文",
  },
  {
    id: "portrait",
    label: "复杂人物",
    question: "从选择、关系与代价呈现一个人",
  },
  {
    id: "investigative",
    label: "公共问题调查",
    question: "用文件、数据和多方回应建立证据链",
  },
  {
    id: "nature",
    label: "自然与物种",
    question: "在不干扰行为的前提下讲生态关系",
  },
  {
    id: "history",
    label: "文化与历史",
    question: "让现场、档案和不同解释互相验证",
  },
];

const readinessItems = [
  "一句话能说明观众为什么要看完",
  "主要人物、地点或路线已经获得接触与拍摄许可",
  "至少三章存在真实的信息、地点或状态变化",
  "最低画面覆盖和独立声音计划在现有条件下可完成",
  "电池、存储、天气、交通和人员安全都有备选方案",
  "素材双备份、授权、字幕、HDR与发布交付路径已经确定",
];
export function LongformGuideView() {
  const setView = usePlannerStore((state) => state.setView);
  const [workspace, setWorkspace] = useState<Workspace>("planner");
  const [formatId, setFormatId] = useState(longformFormats[0]!.id);
  const [phaseId, setPhaseId] = useState(longformPhases[0]!.id);
  const [targetMinutes, setTargetMinutes] = useState(60);
  const [shootDays, setShootDays] = useState(10);
  const [bitrateMbps, setBitrateMbps] = useState(200);
  const [readiness, setReadiness] = useState<Set<number>>(() => new Set());
  const [briefCopied, setBriefCopied] = useState(false);
  const format = longformFormats.find((item) => item.id === formatId)!;
  const phase = longformPhases.find((item) => item.id === phaseId)!;
  const blueprint = longformBlueprints.find(
    (item) => item.formatId === formatId,
  )!;
  const scale = estimateLongformScale({
    formatId,
    targetMinutes,
    shootDays,
    bitrateMbps,
  });
  const readinessProgress = Math.round(
    (readiness.size / readinessItems.length) * 100,
  );
  const chapterSchedule = buildScaledChapterSchedule(
    formatId,
    targetMinutes,
    blueprint,
  );
  const shootBlocks = buildLongformShootBlocks(shootDays, blueprint);
  const projectBrief = [
    `# ${format.name}项目简报`,
    "",
    `- 观众承诺：${format.promise}`,
    `- 目标成片：${targetMinutes} 分钟`,
    `- 计划拍摄：${shootDays} 天`,
    `- 建议素材：${scale.captureHoursLow.toFixed(1)}–${scale.captureHoursHigh.toFixed(1)} 小时`,
    `- 原始素材上限：约 ${Math.round(scale.storageGbHigh)} GB`,
    `- 双份存储：约 ${(scale.twoCopyStorageGb / 1000).toFixed(1)} TB`,
    `- 最低覆盖：${blueprint.minimumCoverage}`,
    "",
    "## 成片章节",
    ...chapterSchedule.map(
      (chapter) =>
        `${chapter.index}. ${chapter.range}｜${chapter.purpose}\n   - ${chapter.material}`,
    ),
    "",
    "## 拍摄排期",
    ...shootBlocks.map(
      (block) =>
        `- ${block.range}｜${block.name}\n  - 目标：${block.goal}\n  - 验收：${block.proof}`,
    ),
    "",
    `## 开机准备度：${readinessProgress}%`,
    ...readinessItems.map(
      (item, index) => `- [${readiness.has(index) ? "x" : " "}] ${item}`,
    ),
  ].join("\n");
  const chooseFormat = (nextId: LongformFormatId) => {
    setFormatId(nextId);
    setReadiness(new Set());
  };
  const copyProjectBrief = async () => {
    await navigator.clipboard.writeText(projectBrief);
    setBriefCopied(true);
    window.setTimeout(() => setBriefCopied(false), 1500);
  };
  return (
    <main className="longform-page">
      <header className="longform-head">
        <div>
          <p className="eyebrow">LONGFORM PRODUCTION</p>
          <h1>长片制作指南</h1>
          <p>
            纪录片、电影式旅行、沉浸环境与公路散文，从选题、拍摄到剪辑交付的完整方法。
          </p>
        </div>
        <dl>
          <div>
            <dt>长片类型</dt>
            <dd>{longformFormats.length}</dd>
          </div>
          <div>
            <dt>制作阶段</dt>
            <dd>{longformPhases.length}</dd>
          </div>
          <div>
            <dt>核心原则</dt>
            <dd>真实 · 连续 · 可验证</dd>
          </div>
        </dl>
      </header>
      <nav className="longform-tabs">
        <button
          className={workspace === "planner" ? "active" : ""}
          onClick={() => setWorkspace("planner")}
        >
          <Calculator size={17} />
          <span>
            项目启动<small>选类型、算规模、查准备度</small>
          </span>
        </button>
        <button
          className={workspace === "formats" ? "active" : ""}
          onClick={() => setWorkspace("formats")}
        >
          <Film size={17} />
          <span>
            类型方法<small>先决定观众承诺</small>
          </span>
        </button>
        <button
          className={workspace === "schedule" ? "active" : ""}
          onClick={() => setWorkspace("schedule")}
        >
          <CalendarDays size={17} />
          <span>
            章节排期<small>时间线、拍摄日与简报</small>
          </span>
        </button>
        <button
          className={workspace === "production" ? "active" : ""}
          onClick={() => setWorkspace("production")}
        >
          <Workflow size={17} />
          <span>
            完整流程<small>从选题到归档</small>
          </span>
        </button>
        <button
          className={workspace === "shooting" ? "active" : ""}
          onClick={() => setWorkspace("shooting")}
        >
          <Camera size={17} />
          <span>
            拍摄设计<small>画面、声音与安全</small>
          </span>
        </button>
        <button
          className={workspace === "blueprint" ? "active" : ""}
          onClick={() => setWorkspace("blueprint")}
        >
          <BookOpen size={17} />
          <span>
            实战蓝图<small>采访、章节与拍摄日</small>
          </span>
        </button>
        <button
          className={workspace === "editing" ? "active" : ""}
          onClick={() => setWorkspace("editing")}
        >
          <Clapperboard size={17} />
          <span>
            剪辑诊断<small>问题、原因与修正</small>
          </span>
        </button>
        <button
          className={workspace === "quality" ? "active" : ""}
          onClick={() => setWorkspace("quality")}
        >
          <ClipboardCheck size={17} />
          <span>
            交付质检<small>事实、声画与归档</small>
          </span>
        </button>
      </nav>
      {workspace === "planner" && (
        <section className="longform-planner">
          <header>
            <div>
              <p className="eyebrow">PROJECT STARTER</p>
              <h2>先判断要拍什么，再确认能不能拍完</h2>
              <p>
                以下结果用于制定素材、存储和拍摄日预算，不代表必须为了素材比而过量拍摄。
              </p>
            </div>
            <span className={`schedule-${scale.scheduleStatus}`}>
              {scale.scheduleStatus === "tight"
                ? "日程偏紧"
                : scale.scheduleStatus === "extended"
                  ? "长期跟拍"
                  : "日程合理"}
            </span>
          </header>
          <div className="longform-planner-grid">
            <section className="longform-goal-picker">
              <h3>1 · 这部片最主要的观众承诺是什么？</h3>
              <div>
                {formatGoals.map((goal) => (
                  <button
                    key={goal.id}
                    className={formatId === goal.id ? "active" : ""}
                    onClick={() => chooseFormat(goal.id)}
                  >
                    <strong>{goal.label}</strong>
                    <span>{goal.question}</span>
                  </button>
                ))}
              </div>
            </section>
            <section className="longform-scale-planner">
              <h3>2 · 项目规模预估</h3>
              <div className="longform-scale-inputs">
                <label>
                  目标成片
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={targetMinutes}
                    onChange={(event) =>
                      setTargetMinutes(
                        Math.max(10, Number(event.target.value) || 10),
                      )
                    }
                  />
                  <span>分钟</span>
                </label>
                <label>
                  计划拍摄
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={shootDays}
                    onChange={(event) =>
                      setShootDays(Math.max(1, Number(event.target.value) || 1))
                    }
                  />
                  <span>天</span>
                </label>
                <label>
                  相机码率
                  <input
                    type="number"
                    min="25"
                    max="800"
                    value={bitrateMbps}
                    onChange={(event) =>
                      setBitrateMbps(
                        Math.max(25, Number(event.target.value) || 25),
                      )
                    }
                  />
                  <span>Mb/s</span>
                </label>
              </div>
              <div className="longform-scale-results">
                <article>
                  <small>建议录制素材</small>
                  <strong>
                    {scale.captureHoursLow.toFixed(1)}–
                    {scale.captureHoursHigh.toFixed(1)} 小时
                  </strong>
                  <span>不是有效成片时长</span>
                </article>
                <article>
                  <small>每日录制目标</small>
                  <strong>
                    {Math.round(scale.captureMinutesPerDayLow)}–
                    {Math.round(scale.captureMinutesPerDayHigh)} 分钟
                  </strong>
                  <span>按 {shootDays} 个拍摄日均分</span>
                </article>
                <article>
                  <small>原始素材上限估算</small>
                  <strong>{Math.round(scale.storageGbHigh)} GB</strong>
                  <span>按 {bitrateMbps} Mb/s</span>
                </article>
                <article>
                  <small>双份存储最低准备</small>
                  <strong>
                    {(scale.twoCopyStorageGb / 1000).toFixed(1)} TB
                  </strong>
                  <span>不含代理与项目缓存</span>
                </article>
              </div>
              <aside>
                <HardDrive size={16} />
                <p>
                  {format.name}通常建议 {scale.suggestedDaysLow}–
                  {scale.suggestedDaysHigh} 个拍摄日；当前蓝图要求：
                  {blueprint.minimumCoverage}
                </p>
              </aside>
            </section>
          </div>
          <section className="longform-readiness">
            <header>
              <div>
                <h3>3 · 开机准备度</h3>
                <p>这些条件没有满足时，先缩短成片或减少题材范围。</p>
              </div>
              <strong>{readinessProgress}%</strong>
            </header>
            <div>
              {readinessItems.map((item, index) => (
                <label
                  key={item}
                  className={readiness.has(index) ? "checked" : ""}
                >
                  <input
                    type="checkbox"
                    checked={readiness.has(index)}
                    onChange={() =>
                      setReadiness((current) => {
                        const next = new Set(current);
                        if (next.has(index)) next.delete(index);
                        else next.add(index);
                        return next;
                      })
                    }
                  />
                  <span>
                    <Check size={12} />
                    {item}
                  </span>
                </label>
              ))}
            </div>
            <footer>
              <button onClick={() => setReadiness(new Set())}>
                <RotateCcw size={13} />
                清空检查
              </button>
              <button
                className="primary"
                onClick={() => setWorkspace("schedule")}
              >
                生成章节与拍摄排期
                <ChevronRight size={14} />
              </button>
              <button onClick={() => setWorkspace("formats")}>
                进入 {format.name} 完整教程
              </button>
              <button onClick={() => setView("projects")}>建立视频项目</button>
            </footer>
          </section>
        </section>
      )}
      {workspace === "schedule" && (
        <section className="longform-schedule">
          <header>
            <div>
              <p className="eyebrow">CHAPTER & SHOOT SCHEDULE</p>
              <h2>
                {format.name} · {targetMinutes} 分钟执行时间线
              </h2>
              <p>
                章节时长按类型结构缩放；它是剪辑目标，不要求现实事件严格按分钟发生。
              </p>
            </div>
            <button onClick={() => void copyProjectBrief()}>
              <Copy size={14} />
              {briefCopied ? "已复制项目简报" : "复制 Markdown 项目简报"}
            </button>
          </header>
          <section className="longform-chapter-clock">
            <header>
              <div>
                <h3>成片章节时钟</h3>
                <p>
                  四章合计 {targetMinutes}{" "}
                  分钟，必须各自带来新的信息、地点、行动或理解。
                </p>
              </div>
              <span>{chapterSchedule.length} 章</span>
            </header>
            <div>
              {chapterSchedule.map((chapter) => {
                const share = chapter.durationMinutes / targetMinutes;
                return (
                  <article key={chapter.index}>
                    <header>
                      <span>{String(chapter.index).padStart(2, "0")}</span>
                      <div>
                        <small>
                          {chapter.range} · {chapter.durationMinutes} 分钟
                        </small>
                        <h3>{chapter.purpose}</h3>
                      </div>
                    </header>
                    <p>{chapter.material}</p>
                    <dl>
                      <div>
                        <dt>建议素材覆盖</dt>
                        <dd>
                          {(scale.captureHoursLow * share).toFixed(1)}–
                          {(scale.captureHoursHigh * share).toFixed(1)} 小时
                        </dd>
                      </div>
                      <div>
                        <dt>本章退出条件</dt>
                        <dd>核心动作或问题发生可验证变化</dd>
                      </div>
                    </dl>
                    <aside>
                      <AlertTriangle size={12} />
                      {format.risks[(chapter.index - 1) % format.risks.length]}
                    </aside>
                  </article>
                );
              })}
            </div>
          </section>
          <div className="longform-schedule-lower">
            <section className="longform-shoot-blocks">
              <header>
                <h3>拍摄日分块</h3>
                <p>
                  按照“建立基线 → 核心行动 →
                  结果与补缺”推进，不按镜头数量制造虚假进度。
                </p>
              </header>
              <div>
                {shootBlocks.map((block, index) => (
                  <article key={block.range}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <small>{block.range}</small>
                      <h3>{block.name}</h3>
                      <p>{block.goal}</p>
                      <aside>
                        <Check size={12} />
                        <strong>完成证据：</strong>
                        {block.proof}
                      </aside>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <aside className="longform-brief-preview">
              <header>
                <FileText size={17} />
                <div>
                  <small>PROJECT BRIEF</small>
                  <h3>当前项目简报</h3>
                </div>
              </header>
              <dl>
                <div>
                  <dt>类型</dt>
                  <dd>{format.name}</dd>
                </div>
                <div>
                  <dt>成片</dt>
                  <dd>{targetMinutes} 分钟</dd>
                </div>
                <div>
                  <dt>拍摄</dt>
                  <dd>{shootDays} 天</dd>
                </div>
                <div>
                  <dt>素材</dt>
                  <dd>
                    {scale.captureHoursLow.toFixed(1)}–
                    {scale.captureHoursHigh.toFixed(1)} 小时
                  </dd>
                </div>
                <div>
                  <dt>双份存储</dt>
                  <dd>{(scale.twoCopyStorageGb / 1000).toFixed(1)} TB</dd>
                </div>
                <div>
                  <dt>准备度</dt>
                  <dd>{readinessProgress}%</dd>
                </div>
              </dl>
              <p>{blueprint.minimumCoverage}</p>
              <footer>
                <button onClick={() => setWorkspace("planner")}>
                  返回修改规模
                </button>
                <button className="primary" onClick={() => setView("projects")}>
                  建立视频项目
                  <ChevronRight size={13} />
                </button>
              </footer>
            </aside>
          </div>
        </section>
      )}
      {workspace === "formats" && (
        <>
          <section className="longform-formats">
            <nav>
              {longformFormats.map((item) => (
                <button
                  key={item.id}
                  className={item.id === format.id ? "active" : ""}
                  onClick={() => setFormatId(item.id)}
                >
                  <small>{item.english}</small>
                  <strong>{item.name}</strong>
                  <span>{item.duration}</span>
                </button>
              ))}
            </nav>
            <article>
              <header>
                <div>
                  <small>{format.english}</small>
                  <h2>{format.name}</h2>
                  <p>{format.promise}</p>
                </div>
                <span>{format.duration}</span>
              </header>
              <div className="longform-format-grid">
                <section>
                  <h3>
                    <Sparkles size={15} />
                    叙事结构
                  </h3>
                  <ol>
                    {format.structure.map((item, index) => (
                      <li key={item}>
                        <span>{index + 1}</span>
                        {item}
                      </li>
                    ))}
                  </ol>
                </section>
                <section>
                  <h3>
                    <Camera size={15} />
                    拍摄方法
                  </h3>
                  <ul>
                    {format.shooting.map((item) => (
                      <li key={item}>
                        <Check size={13} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>
                    <Clapperboard size={15} />
                    剪辑方法
                  </h3>
                  <ul>
                    {format.editing.map((item) => (
                      <li key={item}>
                        <Check size={13} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
                <aside>
                  <h3>
                    <AlertTriangle size={15} />
                    高风险问题
                  </h3>
                  {format.risks.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </aside>
              </div>
            </article>
          </section>
          {format.id === "documentary" ? (
            <Documentary90Tutorial
              openCameraLibrary={() => setView("cameras")}
              openPostWorkflow={() => setView("post")}
            />
          ) : (
            <FormatProcessTutorial format={format} blueprint={blueprint} />
          )}
        </>
      )}
      {workspace === "production" && (
        <section className="longform-production">
          <nav>
            {longformPhases.map((item, index) => (
              <button
                key={item.id}
                className={item.id === phase.id ? "active" : ""}
                onClick={() => setPhaseId(item.id)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.name}</strong>
              </button>
            ))}
          </nav>
          <article>
            <header>
              <small>阶段输出</small>
              <h2>{phase.name}</h2>
              <p>{phase.output}</p>
            </header>
            <div>
              <section>
                <h3>必须完成</h3>
                <ol>
                  {phase.tasks.map((item, index) => (
                    <li key={item}>
                      <span>{index + 1}</span>
                      {item}
                    </li>
                  ))}
                </ol>
              </section>
              <aside>
                <h3>
                  <ShieldCheck size={15} />
                  进入下一阶段前确认
                </h3>
                {phase.checks.map((item) => (
                  <p key={item}>
                    <Check size={13} />
                    {item}
                  </p>
                ))}
              </aside>
            </div>
            <footer>
              <button onClick={() => setView("projects")}>
                打开视频项目工作台
                <ChevronRight size={14} />
              </button>
            </footer>
          </article>
        </section>
      )}
      {workspace === "shooting" && (
        <section className="longform-shooting">
          <header>
            <div>
              <p className="eyebrow">COVERAGE SYSTEM</p>
              <h2>长片拍摄覆盖模型</h2>
              <p>
                每一个重要场景都要能回答“在哪里、谁在做什么、关键细节是什么、发生了什么变化、如何结束”。
              </p>
            </div>
            <Camera size={28} />
          </header>
          <div className="coverage-sequence">
            {[
              ["01", "建立", "地点、时间、天气、方向"],
              ["02", "行动", "人物或车辆完整动作"],
              ["03", "关系", "主体与环境的中景"],
              ["04", "细节", "手、工具、路牌、纹理"],
              ["05", "反应", "人物、环境或结果变化"],
              ["06", "结束", "动作完成或离开画面"],
            ].map(([number, title, note]) => (
              <article key={number}>
                <span>{number}</span>
                <strong>{title}</strong>
                <p>{note}</p>
              </article>
            ))}
          </div>
          <div className="longform-sound-safety">
            <section>
              <Headphones size={20} />
              <div>
                <h3>声音必须单独设计</h3>
                <p>
                  主声、环境声、Room
                  Tone、过渡声和音乐不是同一件事。每个地点至少录制60秒纯环境声；纪录采访要同时监听主声和备份声道。
                </p>
              </div>
            </section>
            <section>
              <ShieldCheck size={20} />
              <div>
                <h3>真实性与安全优先</h3>
                <p>
                  不能为了镜头让驾驶者操作设备，不能让被摄者重复危险动作，也不能用剪辑伪造事件因果。敏感素材和肖像授权必须可追溯。
                </p>
              </div>
            </section>
          </div>
          <footer>
            <button onClick={() => setView("cameras")}>打开相机参数库</button>
            <button onClick={() => setView("plans")}>建立拍摄计划</button>
          </footer>
        </section>
      )}
      {workspace === "blueprint" && (
        <section className="longform-blueprint">
          <header>
            <div>
              <p className="eyebrow">PRODUCTION BLUEPRINT</p>
              <h2>{format.name}实战蓝图</h2>
              <p>
                {blueprint.target}｜{blueprint.shootingRatio}
              </p>
            </div>
            <select
              value={formatId}
              onChange={(e) => setFormatId(e.target.value as typeof formatId)}
            >
              {longformFormats.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </header>
          <aside className="blueprint-minimum">
            <ShieldCheck size={17} />
            <div>
              <small>最低覆盖标准</small>
              <p>{blueprint.minimumCoverage}</p>
            </div>
          </aside>
          <div className="blueprint-chapters">
            {blueprint.chapterPlan.map((item) => (
              <article key={item.range}>
                <small>{item.range}</small>
                <strong>{item.purpose}</strong>
                <p>{item.material}</p>
              </article>
            ))}
          </div>
          <div className="blueprint-grid">
            <section>
              <h3>前期准备</h3>
              {blueprint.preparation.map((item) => (
                <p key={item}>
                  <Check size={12} />
                  {item}
                </p>
              ))}
            </section>
            <section>
              <h3>采访与提问</h3>
              {blueprint.interviewQuestions.map((item) => (
                <p key={item}>
                  <span>Q</span>
                  {item}
                </p>
              ))}
            </section>
            <section>
              <h3>声音计划</h3>
              {blueprint.soundPlan.map((item) => (
                <p key={item}>
                  <Headphones size={12} />
                  {item}
                </p>
              ))}
            </section>
            <section>
              <h3>拍摄日顺序</h3>
              {blueprint.shootingDay.map((item, index) => (
                <p key={item}>
                  <span>{index + 1}</span>
                  {item}
                </p>
              ))}
            </section>
          </div>
          <section className="blueprint-edit-passes">
            <h3>剪辑版本迭代</h3>
            <div>
              {blueprint.editPasses.map((item, index) => (
                <article key={item.name}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.name}</strong>
                  <p>{item.goal}</p>
                  <small>不要：{item.doNot}</small>
                </article>
              ))}
            </div>
          </section>
        </section>
      )}
      {workspace === "editing" && (
        <section className="longform-editing">
          <header>
            <div>
              <p className="eyebrow">EDIT DIAGNOSIS</p>
              <h2>长片剪辑常见问题</h2>
              <p>
                不要只问“哪里剪短”，先判断缺的是信息、行动、空间、声音还是结构变化。
              </p>
            </div>
            <ListChecks size={28} />
          </header>
          <div>
            {longformEditWarnings.map(([problem, signal, fix], index) => (
              <article key={problem}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <small>问题</small>
                  <h3>{problem}</h3>
                  <p>{signal}</p>
                </div>
                <aside>
                  <small>修正方向</small>
                  <p>{fix}</p>
                </aside>
              </article>
            ))}
          </div>
          <footer>
            <button onClick={() => setView("post")}>
              进入达芬奇后期流程
              <ChevronRight size={14} />
            </button>
          </footer>
        </section>
      )}
      {workspace === "quality" && (
        <section className="longform-quality">
          <header>
            <div>
              <p className="eyebrow">FINAL QUALITY GATES</p>
              <h2>发布前完整质检</h2>
              <p>
                质检不是最后随便看一遍，而是分别验证故事、事实、连续性、声音、色彩、字幕和可恢复性。
              </p>
            </div>
            <ClipboardCheck size={28} />
          </header>
          <div>
            {longformQualityGates.map((gate, index) => (
              <article key={gate.category}>
                <header>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{gate.category}</h3>
                  <small>{gate.items.length}项</small>
                </header>
                {gate.items.map((item) => (
                  <p key={item}>
                    <Check size={12} />
                    {item}
                  </p>
                ))}
              </article>
            ))}
          </div>
          <aside>
            <AlertTriangle size={18} />
            <p>
              <strong>
                任何一项发现事实错误、隐私风险、离线媒体、削波、错误HDR标签或授权不明，都应停止发布。
              </strong>
              先回到对应制作阶段修正，再重新进行相关质检。
            </p>
          </aside>
          <footer>
            <button onClick={() => setView("post")}>打开后期执行清单</button>
            <button onClick={() => setView("upload")}>检查上传参数</button>
          </footer>
        </section>
      )}
    </main>
  );
}
