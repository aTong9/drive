import { CheckCircle2, Clock3, MapPin, ShieldCheck } from "lucide-react";
import type { Location, Route } from "../../types/domain.js";

interface RouteCardProps {
  route: Route;
  waypoints: Location[];
  active: boolean;
  onSelect: () => void;
}

const routeLabels: Record<Route["type"], string> = {
  coast: "滨海",
  "city-night": "城市夜景",
  mountain: "山路",
  forest: "森林",
  waterfall: "瀑布",
  river: "江河",
  lake: "湖泊"
};

export function RouteCard({ route, waypoints, active, onSelect }: RouteCardProps) {
  return (
    <button className={`route-card ${active ? "is-active" : ""}`} onClick={onSelect} aria-pressed={active}>
      <div className="route-card-topline">
        <span className="route-kind">{routeLabels[route.type]}</span>
        <span className={`verification ${route.verification.status === "field-checked" ? "is-field" : ""}`}>
          {route.verification.status === "field-checked" ? <CheckCircle2 size={12} /> : <ShieldCheck size={12} />}
          {route.verification.status === "field-checked" ? "实地核验" : "来源核验"}
        </span>
      </div>
      <h3>{route.name}</h3>
      <div className="route-meta">
        <span><Clock3 size={14} /> {Math.floor(route.estimatedDurationMinutes / 60)}小时{route.estimatedDurationMinutes % 60 || ""}</span>
        <span><MapPin size={14} /> {waypoints.length}个拍摄点</span>
      </div>
      <div className="route-path-preview" aria-label="路线途经点">
        {waypoints.map((waypoint, index) => (
          <span key={waypoint.id}>
            {waypoint.name.replace("深圳湾公园", "深圳湾").replace("红树林海滨生态公园", "红树林")}
            {index < waypoints.length - 1 && <i>→</i>}
          </span>
        ))}
      </div>
      <div className="score-row">
        <span>视觉指数</span>
        <div className="score-dots" aria-label={`${route.scores.visual}分`}>
          {[1, 2, 3, 4, 5].map((score) => <i key={score} className={score <= route.scores.visual ? "filled" : ""} />)}
        </div>
      </div>
    </button>
  );
}
