import { useState } from "react";
import { validatePlanEdit } from "../../services/planEditingService.js";
import {
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  Navigation,
  Trash2,
  Video,
} from "lucide-react";
import type { ResolvedRoute, WorkflowStatus } from "../../types/domain.js";
import { usePlannerStore } from "../../app/store.js";
import { buildVideoProject } from "../../services/videoProjectService.js";

const statusLabels: Record<WorkflowStatus, string> = {
  idea: "想法",
  planned: "已计划",
  captured: "已拍摄",
  published: "已发布",
};

export function PlanView({ routes }: { routes: ResolvedRoute[] }) {
  const plans = usePlannerStore((state) => state.plans);
  const removedPlans = usePlannerStore((state) => state.removedPlans);
  const restorePlan = usePlannerStore((state) => state.restorePlan);
  const editPlan = usePlannerStore((state) => state.editPlan);
  const [editingId, setEditingId] = useState("");
  const [editError, setEditError] = useState("");
  const removePlan = usePlannerStore((state) => state.removePlan);
  const updatePlanStatus = usePlannerStore((state) => state.updatePlanStatus);
  const selectRoute = usePlannerStore((state) => state.selectRoute);
  const saveVideoProject = usePlannerStore((state) => state.saveVideoProject);
  const videoProjects = usePlannerStore((state) => state.videoProjects);
  const selectVideoProject = usePlannerStore(
    (state) => state.selectVideoProject,
  );
  const routeById = new Map(routes.map((item) => [item.route.id, item]));
  const sortedPlans = [...plans].sort((a, b) =>
    a.scheduledDate.localeCompare(b.scheduledDate),
  );

  return (
    <main className="plan-page">
      <header className="plan-page-head">
        <div>
          <p className="eyebrow">SHOOTING PLANS</p>
          <h1>
            把灵感变成
            <br />
            <em>下一次出发</em>
          </h1>
        </div>
        <div className="plan-stats">
          <span>
            <strong>{plans.length}</strong>
            <small>全部计划</small>
          </span>
          <span>
            <strong>
              {plans.filter((plan) => plan.status === "planned").length}
            </strong>
            <small>等待拍摄</small>
          </span>
          <span>
            <strong>
              {plans.filter((plan) => plan.status === "captured").length}
            </strong>
            <small>完成拍摄</small>
          </span>
        </div>
      </header>

      {removedPlans.length > 0 && <details className="plan-undo" open>
        <summary>已删除计划 · {removedPlans.length}（可恢复，视频项目保留）</summary>
        {removedPlans.map((plan) => <p key={plan.id}>{plan.scheduledDate} · {routeById.get(plan.routeId)?.route.name ?? plan.routeId} <button onClick={() => restorePlan(plan.id)}>撤销删除</button></p>)}
      </details>}
      {sortedPlans.length === 0 ? (
        <section className="plan-empty">
          <span>
            <CalendarDays size={28} />
          </span>
          <h2>还没有拍摄计划</h2>
          <p>从探索路线中选择一条路线，设定日期和创作目标。</p>
          <button onClick={() => usePlannerStore.getState().setView("explore")}>
            探索拍摄路线 <ChevronRight size={16} />
          </button>
        </section>
      ) : (
        <section className="plan-grid">
          {sortedPlans.map((plan) => {
            const item = routeById.get(plan.routeId);
            if (!item) return null;
            const existingProject = videoProjects.find(
              (project) => project.planId === plan.id,
            );
            const date = new Date(`${plan.scheduledDate}T00:00:00`);
            return (
              <article className="plan-card" key={plan.id}>
                <div className="plan-date">
                  <strong>{String(date.getDate()).padStart(2, "0")}</strong>
                  <span>
                    {date.toLocaleDateString("zh-CN", { month: "short" })}
                  </span>
                  <small>
                    {date.toLocaleDateString("zh-CN", { weekday: "short" })}
                  </small>
                </div>
                <div className="plan-card-body">
                  <div className="plan-card-top">
                    <span className={`plan-status ${plan.status}`}>
                      {statusLabels[plan.status]}
                    </span>
                    <button
                      onClick={() => removePlan(plan.id)}
                      aria-label={`删除${item.route.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <h2>{item.route.name}</h2>
                  {editingId === plan.id ? <form className="plan-edit" onSubmit={(event) => {
                    event.preventDefault();
                    const form = new FormData(event.currentTarget);
                    const date = String(form.get("date") ?? "");
                    const objective = String(form.get("objective") ?? "");
                    const error = validatePlanEdit(date, objective);
                    setEditError(error ?? "");
                    if (error) return;
                    editPlan(plan.id, date, objective); setEditingId("");
                  }}>
                    <label>拍摄日期<input name="date" type="date" required defaultValue={plan.scheduledDate} /></label>
                    <label>拍摄目标<textarea name="objective" required defaultValue={plan.objective} /></label>
                    {existingProject && <small>只修改计划；关联视频项目的记录保持原样。</small>}
                    {editError && <p role="alert">{editError}</p>}
                    <div><button type="submit">保存修改</button><button type="button" onClick={() => setEditingId("")}>取消</button></div>
                  </form> : <p>{plan.objective}</p>}
                  <div className="plan-meta">
                    <span>
                      <Clock3 size={13} /> 预留 {item.route.estimatedDurationMinutes} 分钟
                    </span>
                    <span>
                      <MapPin size={13} /> {item.waypoints.length} 个{item.route.executionMode === "drive-only" ? "道路锚点" : "拍摄点"}
                    </span>
                  </div>
                  <div className="plan-kit">
                    <Camera size={14} />{" "}
                    {item.cameraPresets
                      .map((preset) => preset.camera)
                      .join(" · ")}
                  </div>
                  <div className="plan-actions">
                    <button onClick={() => { setEditingId(plan.id); setEditError(""); }}>编辑日期与目标</button>
                    <button
                      onClick={() =>
                        existingProject
                          ? selectVideoProject(existingProject.id)
                          : saveVideoProject(buildVideoProject(plan, item))
                      }
                    >
                      <Video size={15} />{" "}
                      {existingProject ? "继续视频项目" : "建立视频项目"}
                    </button>
                    {plan.status === "planned" ? (
                      <button
                        onClick={() => updatePlanStatus(plan.id, "captured")}
                      >
                        <CheckCircle2 size={15} /> 标记已拍摄
                      </button>
                    ) : plan.status === "captured" ? (
                      <button
                        onClick={() => updatePlanStatus(plan.id, "published")}
                      >
                        <CheckCircle2 size={15} /> 标记已发布
                      </button>
                    ) : (
                      <button
                        onClick={() => updatePlanStatus(plan.id, "captured")}
                      >
                        <CalendarDays size={15} /> 恢复为已拍摄
                      </button>
                    )}
                    <button onClick={() => selectRoute(item.route.id)}>
                      <Navigation size={15} /> 查看路线
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
