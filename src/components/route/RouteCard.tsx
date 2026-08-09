import { CarFront, CheckCircle2, Clock3, Footprints, MapPin, ShieldCheck, Trees } from "lucide-react";
import type { Location, Route } from "../../types/domain.js";
import { usePlannerStore } from "../../app/store.js";

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

const captureLabels = {
  "scenic-drive": { label: "风景驾车", icon: CarFront },
  "rain-walk": { label: "雨景步行", icon: Footprints },
  "stationary-nature": { label: "林间定点", icon: Trees }
} as const;

export function RouteCard({ route, waypoints, active, onSelect }: RouteCardProps) {
  const CaptureIcon = captureLabels[route.captureStyle].icon;
  const driveOnly = route.executionMode === "drive-only";
  const captured = usePlannerStore((state) => state.plans.some((plan) => plan.routeId === route.id && plan.status === "captured"));
  const fieldChecked = usePlannerStore((state) => waypoints.every((waypoint) => state.fieldChecks.some((check) => check.locationId === waypoint.id)));
  const verificationLabel = fieldChecked ? "全程实地核验" : captured ? "已完成拍摄" : route.verification.status === "field-checked" ? "实地核验" : "来源核验";
  return (
    <button className={`route-card style-${route.captureStyle} ${active ? "is-active" : ""}`} onClick={onSelect} aria-pressed={active}>
      <div className="route-card-topline">
        <span className="route-kind">{routeLabels[route.type]}</span>
        <span className={`verification ${fieldChecked || captured || route.verification.status === "field-checked" ? "is-field" : ""}`}>
          {fieldChecked || captured || route.verification.status === "field-checked" ? <CheckCircle2 size={12} /> : <ShieldCheck size={12} />}
          {verificationLabel}
        </span>
      </div>
      <span className={`route-capture ${driveOnly ? "is-drive-only" : ""}`}><CaptureIcon size={13} />{driveOnly ? "纯驾车 · 无需下车" : captureLabels[route.captureStyle].label}</span>
      <h3>{route.name}</h3>
      <div className="route-meta">
        <span><Clock3 size={14} /> {Math.floor(route.estimatedDurationMinutes / 60)}小时{route.estimatedDurationMinutes % 60 || ""}</span>
        <span><MapPin size={14} /> {waypoints.length}个{driveOnly ? "道路锚点" : "拍摄点"}</span>
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
