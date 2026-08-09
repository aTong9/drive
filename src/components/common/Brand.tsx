import { Aperture } from "lucide-react";

export function Brand() {
  return (
    <div className="brand" aria-label="RoadLens Planner">
      <span className="brand-mark"><Aperture size={19} strokeWidth={2.2} /></span>
      <span className="brand-copy">
        <strong>ROADLENS</strong>
        <small>PLANNER</small>
      </span>
    </div>
  );
}
