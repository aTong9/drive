import {
  CarFront,
  CheckCircle2,
  Clock3,
  Footprints,
  MapPin,
  ShieldCheck,
  Trees,
} from "lucide-react";
import type { LocationSummary, RouteSummary } from "../../services/catalogSummary.js";
import { usePlannerStore } from "../../app/store.js";
import { GeoPhotoThumbnail } from "../common/GeoPhotoThumbnail.js";
import { getRouteEvidence, routeDurationLabel } from "../../services/catalogEvidenceService.js";

interface RouteCardProps {
  route: RouteSummary;
  waypoints: LocationSummary[];
  active: boolean;
  onSelect: () => void;
}

const routeLabels: Record<RouteSummary["type"], string> = {
  coast: "滨海",
  "city-night": "城市夜景",
  mountain: "山路",
  forest: "森林",
  waterfall: "瀑布",
  river: "江河",
  lake: "湖泊",
};

const captureLabels = {
  "scenic-drive": { label: "风景驾车", icon: CarFront },
  "rain-walk": { label: "雨景步行", icon: Footprints },
  "stationary-nature": { label: "林间定点", icon: Trees },
} as const;

export function RouteCard({
  route,
  waypoints,
  active,
  onSelect,
}: RouteCardProps) {
  const CaptureIcon = captureLabels[route.captureStyle].icon;
  const driveOnly = route.executionMode === "drive-only";
  const captured = usePlannerStore((state) =>
    state.plans.some(
      (plan) => plan.routeId === route.id && (plan.status === "captured" || plan.status === "published"),
    ),
  );
  const checks = usePlannerStore((state) => state.fieldChecks);
  const evidence = getRouteEvidence(route, waypoints, checks);
  return (
    <button
      className={`route-card style-${route.captureStyle} ${active ? "is-active" : ""}`}
      onClick={onSelect}
      aria-pressed={active}
    >
      <GeoPhotoThumbnail
        id={route.id}
        label={route.name}
        type={route.type}
        points={waypoints}
        interactive={false}
      />
      <div className="route-card-topline">
        <span className="route-kind">{routeLabels[route.type]}</span>
        <span
          className={`verification ${evidence.isField ? "is-field" : ""}`}
        >
          {evidence.isField ? (
            <CheckCircle2 size={12} />
          ) : (
            <ShieldCheck size={12} />
          )}
          {evidence.label}
        </span>
      </div>
      <span className={`route-capture ${driveOnly ? "is-drive-only" : ""}`}>
        <CaptureIcon size={13} />
        {driveOnly
          ? "纯驾车 · 无需下车"
          : captureLabels[route.captureStyle].label}
      </span>
      <h3>{route.name}</h3>
      <div className="route-meta">
        <span>
          <Clock3 size={14} /> {routeDurationLabel(route, waypoints)}
        </span>
        <span>
          <MapPin size={14} /> {waypoints.length}个
          {driveOnly ? "道路锚点" : "拍摄点"}
        </span>
        {captured && <span><CheckCircle2 size={14} /> 已完成拍摄</span>}
      </div>
      <div className="route-path-preview" aria-label="路线途经点">
        {waypoints.map((waypoint, index) => (
          <span key={waypoint.id}>
            {waypoint.name
              .replace("深圳湾公园", "深圳湾")
              .replace("红树林海滨生态公园", "红树林")}
            {index < waypoints.length - 1 && <i>→</i>}
          </span>
        ))}
      </div>
      <div className="score-row">
        <span>视觉指数</span>
        <div className="score-dots" aria-label={`${route.scores.visual}分`}>
          {[1, 2, 3, 4, 5].map((score) => (
            <i
              key={score}
              className={score <= route.scores.visual ? "filled" : ""}
            />
          ))}
        </div>
      </div>
    </button>
  );
}
