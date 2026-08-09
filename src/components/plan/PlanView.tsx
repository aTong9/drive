import { CalendarDays, Camera, CheckCircle2, ChevronRight, Clock3, MapPin, Navigation, Trash2 } from "lucide-react";
import type { ResolvedRoute, WorkflowStatus } from "../../types/domain.js";
import { usePlannerStore } from "../../app/store.js";

const statusLabels: Record<WorkflowStatus, string> = {
  idea: "想法",
  planned: "已计划",
  captured: "已拍摄",
  published: "已发布"
};

export function PlanView({ routes }: { routes: ResolvedRoute[] }) {
  const plans = usePlannerStore((state) => state.plans);
  const removePlan = usePlannerStore((state) => state.removePlan);
  const updatePlanStatus = usePlannerStore((state) => state.updatePlanStatus);
  const selectRoute = usePlannerStore((state) => state.selectRoute);
  const routeById = new Map(routes.map((item) => [item.route.id, item]));
  const sortedPlans = [...plans].sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

  return (
    <main className="plan-page">
      <header className="plan-page-head">
        <div><p className="eyebrow">SHOOTING CALENDAR</p><h1>把灵感变成<br /><em>下一次出发</em></h1></div>
        <div className="plan-stats">
          <span><strong>{plans.length}</strong><small>全部计划</small></span>
          <span><strong>{plans.filter((plan) => plan.status === "planned").length}</strong><small>等待拍摄</small></span>
          <span><strong>{plans.filter((plan) => plan.status === "captured").length}</strong><small>完成拍摄</small></span>
        </div>
      </header>

      {sortedPlans.length === 0 ? (
        <section className="plan-empty">
          <span><CalendarDays size={28} /></span>
          <h2>还没有拍摄计划</h2>
          <p>从探索路线中选择一条路线，设定日期和创作目标。</p>
          <button onClick={() => usePlannerStore.getState().setView("explore")}>探索拍摄路线 <ChevronRight size={16} /></button>
        </section>
      ) : (
        <section className="plan-grid">
          {sortedPlans.map((plan) => {
            const item = routeById.get(plan.routeId);
            if (!item) return null;
            const date = new Date(`${plan.scheduledDate}T00:00:00`);
            return (
              <article className="plan-card" key={plan.id}>
                <div className="plan-date"><strong>{String(date.getDate()).padStart(2, "0")}</strong><span>{date.toLocaleDateString("zh-CN", { month: "short" })}</span><small>{date.toLocaleDateString("zh-CN", { weekday: "short" })}</small></div>
                <div className="plan-card-body">
                  <div className="plan-card-top"><span className={`plan-status ${plan.status}`}>{statusLabels[plan.status]}</span><button onClick={() => removePlan(plan.id)} aria-label={`删除${item.route.name}`}><Trash2 size={15} /></button></div>
                  <h2>{item.route.name}</h2>
                  <p>{plan.objective}</p>
                  <div className="plan-meta"><span><Clock3 size={13} /> 行程约 {item.route.estimatedDurationMinutes} 分钟</span><span><MapPin size={13} /> {item.waypoints.length} 个拍摄点</span></div>
                  <div className="plan-kit"><Camera size={14} /> {item.cameraPresets.map((preset) => preset.camera).join(" · ")}</div>
                  <div className="plan-actions">
                    {plan.status === "planned" ? <button onClick={() => updatePlanStatus(plan.id, "captured")}><CheckCircle2 size={15} /> 标记已拍摄</button> : <button onClick={() => updatePlanStatus(plan.id, "planned")}><CalendarDays size={15} /> 恢复为计划</button>}
                    <button onClick={() => selectRoute(item.route.id)}><Navigation size={15} /> 查看路线</button>
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
