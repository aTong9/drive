import {
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clapperboard,
  FolderKanban,
  MapPinned,
  Route,
  SlidersHorizontal,
  Sparkles,
  Timer,
  Video,
} from "lucide-react";
import type {
  CaptureStyle,
  DavinciWorkflow,
  FieldCheck,
  LocalPostProject,
  LocalPostTask,
  LocalShootPlan,
  ResolvedRoute,
  Weather,
} from "../../types/domain.js";
import { buildDashboardMetrics } from "../../services/dashboardService.js";
import { usePlannerStore } from "../../app/store.js";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { recommendRoutes } from "../../services/recommendationService.js";
import {
  getNextProjectAction,
  getProjectProgress,
  getRetrospectiveInsights,
  hasRetrospectiveData,
} from "../../services/videoProjectService.js";
import { buildNextShootBriefing } from "../../services/shootBriefingService.js";
import {
  buildTripResearchSummary,
  findUnplannedResearchRoutes,
} from "../../services/tripResearchService.js";
import { buildRoutePostReferences } from "../../services/productionReferenceService.js";

const projectStatusLabels = {
  planning: "策划中",
  ready: "待出发",
  shooting: "拍摄中",
  ingest: "素材接收",
  editing: "后期制作",
  review: "交付质检",
  published: "已发布",
} as const;

const shootTimeLabels: Record<string, string> = {
  sunrise: "日出",
  morning: "上午",
  afternoon: "下午",
  "golden-hour": "黄金时刻",
  sunset: "日落",
  "blue-hour": "蓝调时刻",
  night: "夜间",
};

export function DashboardView({
  routes,
  plans,
  checks,
  postTasks,
  postProject,
  onOpenRoute,
  workflow,
}: {
  routes: ResolvedRoute[];
  plans: LocalShootPlan[];
  checks: FieldCheck[];
  postTasks: LocalPostTask[];
  postProject: LocalPostProject | null;
  onOpenRoute: (routeId: string) => void;
  workflow: DavinciWorkflow;
}) {
  const metrics = buildDashboardMetrics(routes, plans, checks, postTasks);
  const nextShoot = buildNextShootBriefing(routes, plans);
  const postReferences = buildRoutePostReferences(
    nextShoot?.routes.map((item) => item.route) ?? [],
    workflow,
  );
  const setView = usePlannerStore((state) => state.setView);
  const videoProjects = usePlannerStore((state) => state.videoProjects);
  const researchRouteIds = usePlannerStore((state) => state.researchRouteIds);
  const activeVideoProjectId = usePlannerStore(
    (state) => state.activeVideoProjectId,
  );
  const currentProject =
    videoProjects.find((project) => project.id === activeVideoProjectId) ??
    videoProjects.at(-1);
  const nextProjectAction = currentProject
    ? getNextProjectAction(currentProject)
    : "";
  const currentProjectProgress = currentProject
    ? getProjectProgress(currentProject)
    : null;
  const latestReviewedProject = [...videoProjects]
    .reverse()
    .find(hasRetrospectiveData);
  const latestInsight = latestReviewedProject
    ? getRetrospectiveInsights(latestReviewedProject)[0]
    : "";
  const unplannedResearchRoutes = useMemo(
    () => findUnplannedResearchRoutes(routes, researchRouteIds, plans),
    [plans, researchRouteIds, routes],
  );
  const researchSummary = useMemo(
    () => buildTripResearchSummary(unplannedResearchRoutes),
    [unplannedResearchRoutes],
  );
  const cities = [...new Set(routes.flatMap((item) => item.route.cities))];
  const cameras = [
    ...new Set(
      routes.flatMap((item) =>
        item.cameraPresets.map((preset) => preset.camera),
      ),
    ),
  ];
  const [recommendInput, setRecommendInput] = useState<{
    city: string;
    availableMinutes: number;
    weather: Weather;
    camera: string;
    objective: CaptureStyle;
  }>({
    city: cities[0] ?? "深圳",
    availableMinutes: 240,
    weather: "cloudy",
    camera: cameras[0] ?? "Sony A7C II",
    objective: "scenic-drive",
  });
  const recommendations = useMemo(
    () => recommendRoutes(routes, recommendInput),
    [routes, recommendInput],
  );
  return (
    <main className="dashboard-page">
      <header className="dashboard-head">
        <div>
          <p className="eyebrow">CREATOR WORKBENCH</p>
          <h1>创作工作台</h1>
          <p>自动接续路线研究、下次拍摄和当前项目，参数需要时直接查看。</p>
        </div>
        <button onClick={() => setView("explore")}>
          继续探索 <ChevronRight size={15} />
        </button>
      </header>
      {!nextShoot && !currentProject && unplannedResearchRoutes.length === 0 && <section className="dashboard-start">
        <h2>从一个想拍的地方开始</h2>
        <p>先找地点或研究选题，确定方向后再安排拍摄。</p>
        <button onClick={() => setView("locations")}>寻找拍摄地点 <ChevronRight size={15} /></button>
        <button onClick={() => setView("creators")}>研究第一条选题</button>
      </section>}
      {nextShoot && (
        <section className="dashboard-shoot-brief" aria-label="下次拍摄简报">
          <header>
            <div>
              <small>NEXT SHOOT BRIEF · 自动汇总，无需再次填写</small>
              <h2>{nextShoot.relativeLabel}拍什么</h2>
            </div>
            <dl>
              <div>
                <dt>日期</dt>
                <dd>{nextShoot.date}</dd>
              </div>
              <div>
                <dt>目的地</dt>
                <dd>
                  {nextShoot.requiresTravelReview
                    ? `跨 ${nextShoot.cities.length} 城，需复核交通`
                    : nextShoot.cities.join(" · ")}
                </dd>
              </div>
              <div>
                <dt>纯拍摄</dt>
                <dd>
                  {Math.floor(nextShoot.totalMinutes / 60)} 小时{" "}
                  {nextShoot.totalMinutes % 60 || ""}
                  {nextShoot.totalMinutes % 60 ? " 分" : ""}
                </dd>
              </div>
            </dl>
          </header>
          <div className="shoot-brief-routes">
            {nextShoot.routes.map(
              ({ planId, objective, route: item }, index) => (
                <button key={planId} onClick={() => onOpenRoute(item.route.id)}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{item.route.name}</strong>
                    <small>
                      {objective} ·{" "}
                      {item.route.best.times
                        .map((time) => shootTimeLabels[time] ?? time)
                        .join(" / ")}
                    </small>
                  </div>
                  <ChevronRight size={15} />
                </button>
              ),
            )}
          </div>
          <div className="shoot-brief-parameters">
            <header>
              <SlidersHorizontal size={15} />
              <span>
                <strong>直接照着设</strong>
                <small>{nextShoot.presets.length} 组路线匹配参数</small>
              </span>
            </header>
            <div>
              {nextShoot.presets.slice(0, 4).map((preset) => (
                <article key={preset.id}>
                  <span>
                    <Camera size={13} />
                    {preset.camera}
                  </span>
                  <strong>
                    {preset.settings.resolution} · {preset.settings.fps}fps ·{" "}
                    {preset.settings.shutter}
                  </strong>
                  <small>
                    ISO {preset.settings.iso.min}–{preset.settings.iso.max} · WB{" "}
                    {preset.settings.whiteBalanceKelvin}K
                    {preset.settings.profile
                      ? ` · ${preset.settings.profile}`
                      : ""}
                  </small>
                </article>
              ))}
            </div>
            <footer
              className={nextShoot.requiresTravelReview ? "needs-review" : ""}
            >
              <Timer size={13} />
              城市间交通、天气等待与临时管制未计入纯拍摄时长
              <button onClick={() => setView("plans")}>
                查看当天计划 <ChevronRight size={13} />
              </button>
            </footer>
          </div>
        </section>
      )}
      {currentProject && (
        <section className="dashboard-current-project">
          <span>
            <FolderKanban size={21} />
          </span>
          <div>
            <small>CURRENT VIDEO PROJECT</small>
            <h2>{currentProject.title}</h2>
            <p>下一步 · {nextProjectAction}</p>
          </div>
          <dl>
            <div>
              <dt>状态</dt>
              <dd>{projectStatusLabels[currentProject.status]}</dd>
            </div>
            <div>
              <dt>镜头</dt>
              <dd>
                {
                  currentProject.shots.filter(
                    (shot) =>
                      shot.captureStatus === "captured" ||
                      shot.captureStatus === "waived",
                  ).length
                }
                /{currentProject.shots.length}
              </dd>
            </div>
            <div>
              <dt>全流程</dt>
              <dd>{currentProjectProgress?.percent ?? 0}%</dd>
            </div>
          </dl>
          <button onClick={() => usePlannerStore.getState().selectVideoProject(currentProject.id)}>
            继续项目 <ChevronRight size={14} />
          </button>
        </section>
      )}
      {latestReviewedProject && latestInsight && (
        <section className="dashboard-learning">
          <Sparkles size={17} />
          <div>
            <small>LAST PROJECT LEARNING · {latestReviewedProject.title}</small>
            <strong>{latestInsight}</strong>
          </div>
          <button
            onClick={() =>
              usePlannerStore
                .getState()
                .selectVideoProject(latestReviewedProject.id)
            }
          >
            查看复盘 <ChevronRight size={13} />
          </button>
        </section>
      )}
      {unplannedResearchRoutes.length > 0 && (
        <section
          className="dashboard-research-resume"
          aria-label="待继续的旅行路线研究"
        >
          <header>
            <span>
              <Route size={18} />
            </span>
            <div>
              <small>TRIP RESEARCH · 尚未转为正式计划</small>
              <h2>继续整理这趟拍摄行程</h2>
            </div>
            <dl>
              <div>
                <dt>候选路线</dt>
                <dd>{researchSummary.routeCount} 条</dd>
              </div>
              <div>
                <dt>目的地</dt>
                <dd>
                  {researchSummary.provinces.length} 省 ·{" "}
                  {researchSummary.cities.length} 城
                </dd>
              </div>
              <div>
                <dt>建议安排</dt>
                <dd>{researchSummary.estimatedDays} 天</dd>
              </div>
            </dl>
            <button onClick={() => setView("explore")}>
              继续研究 <ChevronRight size={14} />
            </button>
          </header>
          <div>
            {unplannedResearchRoutes.slice(0, 4).map((item, index) => (
              <button
                key={item.route.id}
                onClick={() => onOpenRoute(item.route.id)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.route.name}</strong>
                <small>
                  {item.route.cities.join(" · ")} ·{" "}
                  预留 {item.route.estimatedDurationMinutes} 分钟
                </small>
              </button>
            ))}
            {unplannedResearchRoutes.length > 4 && (
              <small>
                另有 {unplannedResearchRoutes.length - 4} 条保留在拍摄篮中
              </small>
            )}
          </div>
          {researchSummary.warnings.length > 0 && (
            <footer>{researchSummary.warnings[0]}</footer>
          )}
        </section>
      )}
      {postReferences.length > 0 && (
        <section
          className="dashboard-post-reference"
          aria-label="拍摄到后期参数衔接"
        >
          <header>
            <div>
              <small>CAPTURE → DAVINCI · 根据下次路线自动匹配</small>
              <h2>拍完以后，从这里开始调</h2>
              <p>这些是可复现的调色起点，不是自动套用的最终风格。</p>
            </div>
            <button onClick={() => setView("post")}>
              打开后期参数库 <ChevronRight size={14} />
            </button>
          </header>
          <div>
            {postReferences.slice(0, 3).map((reference, index) => (
              <article key={reference.routeId}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div className="post-reference-title">
                  <small>{reference.routeName}</small>
                  <strong>{reference.gradePreset.name}</strong>
                  <p>
                    {reference.matchReason} · {reference.gradePreset.intent}
                  </p>
                </div>
                <dl>
                  <div>
                    <dt>对比度</dt>
                    <dd>{reference.gradePreset.timelineParameters.contrast}</dd>
                  </div>
                  <div>
                    <dt>Pivot</dt>
                    <dd>{reference.gradePreset.timelineParameters.pivot}</dd>
                  </div>
                  <div>
                    <dt>饱和度</dt>
                    <dd>
                      {reference.gradePreset.timelineParameters.saturation}
                    </dd>
                  </div>
                </dl>
                <footer>
                  <b>{reference.cameras.join(" · ") || "按素材确认设备"}</b>
                  <small>
                    {reference.profiles.join(" · ") || "色彩配置未标注"}
                  </small>
                  <p>{reference.colorManagementNote}</p>
                </footer>
              </article>
            ))}
          </div>
        </section>
      )}
      <details className="dashboard-history">
        <summary>累计统计与历史记录</summary>
      <section className="dashboard-stats">
        <article>
          <Route size={19} />
          <span>
            <strong>{metrics.routeCount}</strong>
            <small>核验路线</small>
          </span>
        </article>
        <article>
          <CalendarDays size={19} />
          <span>
            <strong>{metrics.plannedCount}</strong>
            <small>等待拍摄</small>
          </span>
        </article>
        <article>
          <Camera size={19} />
          <span>
            <strong>{metrics.capturedCount}</strong>
            <small>完成拍摄</small>
          </span>
        </article>
        <article>
          <Video size={19} />
          <span>
            <strong>{metrics.publishedCount}</strong>
            <small>已发布作品</small>
          </span>
        </article>
      </section>
      <section className="dashboard-grid">
        <article className="dashboard-panel coverage-panel">
          <header>
            <div>
              <p className="eyebrow">FIELD KNOWLEDGE</p>
              <h2>实地核验覆盖</h2>
            </div>
            <MapPinned size={18} />
          </header>
          <div
            className="coverage-ring"
            style={
              {
                "--coverage": `${metrics.checkCoverage * 3.6}deg`,
              } as CSSProperties
            }
          >
            <span>
              <strong>{metrics.checkCoverage}%</strong>
              <small>{metrics.checkedLocationCount} 个地点</small>
            </span>
          </div>
          <p>只有实地记录过的停车、光线和声音信息才计入覆盖率。</p>
          <button onClick={() => setView("locations")}>
            管理地点核验 <ChevronRight size={14} />
          </button>
        </article>
        <article className="dashboard-panel post-panel">
          <header>
            <div>
              <p className="eyebrow">POST PRODUCTION</p>
              <h2>当前后期项目</h2>
            </div>
            <Clapperboard size={18} />
          </header>
          {postTasks.length ? (
            <>
              <strong>{postProject?.title ?? "独立后期项目"}</strong>
              <div className="dashboard-progress">
                <i>
                  <b style={{ width: `${metrics.postProgress}%` }} />
                </i>
                <span>{metrics.postProgress}%</span>
              </div>
              <p>
                {postTasks.filter((task) => task.completed).length} /{" "}
                {postTasks.length} 项任务完成
              </p>
            </>
          ) : (
            <div className="dashboard-empty-mini">尚未导入达芬奇后期流程</div>
          )}
          <button onClick={() => setView("post")}>
            打开后期流程 <ChevronRight size={14} />
          </button>
        </article>
        <article className="dashboard-panel activity-panel">
          <header>
            <div>
              <p className="eyebrow">RECENT PLANS</p>
              <h2>最近创作计划</h2>
            </div>
            <CheckCircle2 size={18} />
          </header>
          {metrics.recentPlans.length ? (
            metrics.recentPlans.map(({ plan, routeName }) => (
              <div className="dashboard-plan-row" key={plan.id}>
                <span className={`plan-dot ${plan.status}`} />
                <div>
                  <strong>{routeName}</strong>
                  <small>
                    {plan.scheduledDate} ·{" "}
                    {plan.status === "planned"
                      ? "等待拍摄"
                      : plan.status === "captured"
                        ? "进入后期"
                        : "已发布"}
                  </small>
                </div>
              </div>
            ))
          ) : (
            <div className="dashboard-empty-mini">还没有创作计划</div>
          )}
          <button onClick={() => setView("plans")}>
            查看全部计划 <ChevronRight size={14} />
          </button>
        </article>
      </section>
      </details>
      <details className="recommend-panel">
        <summary>
          <div>
            <p className="eyebrow">EXPLAINABLE RECOMMENDATION</p>
            <h2>需要时，再按条件找路线</h2>
            <p>位置、时间、天气、设备和目标都明确时，再打开这组高级筛选。</p>
          </div>
          <span>
            <Sparkles size={18} />
            展开条件推荐 <ChevronRight size={15} />
          </span>
        </summary>
        <div className="recommend-body">
          <div className="recommend-controls">
            <label>
              当前位置
              <select
                value={recommendInput.city}
                onChange={(event) =>
                  setRecommendInput({
                    ...recommendInput,
                    city: event.target.value,
                  })
                }
              >
                {cities.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </label>
            <label>
              可用时间
              <select
                value={recommendInput.availableMinutes}
                onChange={(event) =>
                  setRecommendInput({
                    ...recommendInput,
                    availableMinutes: Number(event.target.value),
                  })
                }
              >
                <option value={120}>2 小时</option>
                <option value={180}>3 小时</option>
                <option value={240}>4 小时</option>
                <option value={360}>6 小时</option>
              </select>
            </label>
            <label>
              天气
              <select
                value={recommendInput.weather}
                onChange={(event) =>
                  setRecommendInput({
                    ...recommendInput,
                    weather: event.target.value as Weather,
                  })
                }
              >
                <option value="sunny">晴朗</option>
                <option value="cloudy">多云</option>
                <option value="after-rain">雨后</option>
                <option value="fog">薄雾</option>
                <option value="rain">雨天</option>
              </select>
            </label>
            <label>
              设备
              <select
                value={recommendInput.camera}
                onChange={(event) =>
                  setRecommendInput({
                    ...recommendInput,
                    camera: event.target.value,
                  })
                }
              >
                {cameras.map((camera) => (
                  <option key={camera}>{camera}</option>
                ))}
              </select>
            </label>
            <label>
              创作目标
              <select
                value={recommendInput.objective}
                onChange={(event) =>
                  setRecommendInput({
                    ...recommendInput,
                    objective: event.target.value as CaptureStyle,
                  })
                }
              >
                <option value="scenic-drive">风景驾车</option>
                <option value="rain-walk">雨景步行</option>
                <option value="stationary-nature">林间定点</option>
              </select>
            </label>
          </div>
          <div className="recommend-results">
            {recommendations.length ? (
              recommendations.map(({ item, score, reasons }, index) => (
                <button
                  key={item.route.id}
                  onClick={() => onOpenRoute(item.route.id)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <small>
                      {item.route.verification.status === "field-checked"
                        ? "实地核验"
                        : "来源核验"}{" "}
                      · 匹配分 {score}
                    </small>
                    <strong>{item.route.name}</strong>
                    <p>{reasons.join(" · ")}</p>
                  </div>
                  <ChevronRight size={16} />
                </button>
              ))
            ) : (
              <div className="dashboard-empty-mini">
                当前条件下没有通过验证且时长合适的路线
              </div>
            )}
          </div>
        </div>
      </details>
    </main>
  );
}
