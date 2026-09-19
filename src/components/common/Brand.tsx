import { Sprout } from "lucide-react";

export function Brand() {
  return (
    <div className="brand" aria-label="RoadLens Planner">
      <span className="brand-mark"><Sprout size={19} strokeWidth={1.6} /></span>
      <span className="brand-copy">
        <strong>ROADLENS</strong>
        <small>风景与创作手账</small>
      </span>
    </div>
  );
}
