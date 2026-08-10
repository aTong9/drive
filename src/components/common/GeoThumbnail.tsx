import type { Location, Route } from "../../types/domain.js";

type SceneType = Location["type"] | Route["type"];

interface GeoThumbnailProps {
  id: string;
  label: string;
  type: SceneType;
  points: Array<{ coordinate: { lat: number; lng: number } }>;
  variant?: "card" | "location" | "hero";
}

function normalizedPath(points: GeoThumbnailProps["points"]) {
  if (!points.length) return "";
  const lngs = points.map((point) => point.coordinate.lng);
  const lats = points.map((point) => point.coordinate.lat);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const lngSpan = Math.max(maxLng - minLng, 0.015);
  const latSpan = Math.max(maxLat - minLat, 0.015);
  return points.map((point, index) => {
    const x = 13 + ((point.coordinate.lng - minLng) / lngSpan) * 74;
    const y = 74 - ((point.coordinate.lat - minLat) / latSpan) * 48;
    return `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

export function GeoThumbnail({ id, label, type, points, variant = "card" }: GeoThumbnailProps) {
  const path = normalizedPath(points);
  const seed = [...id].reduce((total, character) => total + character.charCodeAt(0), 0);
  const horizon = 45 + seed % 17;
  return (
    <div className={`geo-thumbnail type-${type} variant-${variant}`} role="img" aria-label={`${label}缩略图`}>
      <span className="geo-sun" style={{ left: `${18 + seed % 58}%`, top: `${13 + seed % 18}%` }} />
      <svg viewBox="0 0 100 86" preserveAspectRatio="none" aria-hidden="true">
        <path className="geo-horizon-back" d={`M0 ${horizon} L18 ${horizon - 13} L33 ${horizon - 5} L49 ${horizon - 20} L67 ${horizon - 8} L82 ${horizon - 17} L100 ${horizon - 2} V86 H0 Z`} />
        <path className="geo-horizon-front" d={`M0 ${horizon + 15} L22 ${horizon + 4} L42 ${horizon + 12} L64 ${horizon - 1} L83 ${horizon + 9} L100 ${horizon + 2} V86 H0 Z`} />
        {path && <><path className="geo-route-shadow" d={path} /><path className="geo-route-line" d={path} />{points.map((point, index) => {
          const routeParts = path.split(/[ML]/).filter(Boolean);
          const [x, y] = routeParts[index]?.split(",").map(Number) ?? [50, 50];
          return <circle className="geo-route-point" cx={x} cy={y} r={index === 0 || index === points.length - 1 ? 2.8 : 2} key={`${point.coordinate.lng}-${point.coordinate.lat}`} />;
        })}</>}
      </svg>
      <span className="geo-grid" />
      <small>{points.length > 1 ? `${points.length} POINT ROUTE` : "LOCATION"}</small>
    </div>
  );
}
