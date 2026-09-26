import assert from "node:assert/strict";
import test from "node:test";
import catalogJson from "../../data/catalog.json" with { type: "json" };
import type { Catalog, FieldCheck, Location, Source } from "../types/domain.js";
import { compareLocationEvidence, compareRouteEvidence, formatSourceEvidence, getLocationEvidence, getRouteEvidence, routeDurationLabel } from "./catalogEvidenceService.js";

const catalog = catalogJson as Catalog;
const route = catalog.routes[0]!;
function location(supports: Source["supports"]): Location {
  const base = catalog.locations[0]!;
  return { ...base, verification: { status: "source-checked", sources: [{ ...base.verification.sources[0]!, supports }] } };
}

test("evidence labels distinguish coordinate-only, access and field records without changing source data", () => {
  const anchor = location(["existence", "coordinate"]);
  const access = location(["existence", "coordinate", "access"]);
  assert.equal(getLocationEvidence(anchor).label, "地名坐标来源");
  assert.equal(getLocationEvidence(access).label, "含通行来源");
  assert.equal(getLocationEvidence(anchor, true).label, "实地记录");
  assert.equal(anchor.verification.status, "source-checked");
  assert.deepEqual([anchor, access].sort(compareLocationEvidence), [access, anchor]);
  assert.equal(getRouteEvidence(route, []).isField, false);
  assert.match(routeDurationLabel(route, [anchor]), /^研究估算/);
  assert.match(routeDurationLabel(route, [access]), /^拍摄估算/);
});

test("draft remains pending even when all its points have local records and an attributed platform", () => {
  const point = location(["existence", "coordinate", "access"]);
  const draft = { ...route, verification: { ...route.verification, status: "draft" as const, sources: [{ platform: "xiaohongshu" as const, title: "研究线索", url: "https://example.com", accessedAt: "2026-09-26", evidence: ["地点线索"] }] } };
  const checks: FieldCheck[] = [{ locationId: point.id, visitedAt: "2026-09-26", updatedAt: "2026-09-26T00:00:00Z", parkingNote: "", lightNote: "", soundNote: "", overallNote: "" }];
  assert.equal(getRouteEvidence(draft, [point], checks).label, "待核验");
  assert.equal(getRouteEvidence(draft, [point], checks).isField, false);
});

test("evidence priority keeps every route and prefers supported access over coordinate-only anchors", () => {
  const anchor = { route, waypoints: [location(["existence", "coordinate"])] };
  const access = { route: { ...route, id: "access" }, waypoints: [location(["coordinate", "access"])] };
  const draft = { route: { ...route, id: "draft", verification: { ...route.verification, status: "draft" as const } }, waypoints: access.waypoints };
  const sorted = [anchor, draft, access].sort(compareRouteEvidence);
  assert.deepEqual(sorted.map((item) => item.route.id), ["access", route.id, "draft"]);
  assert.equal(sorted.length, 3);
  assert.equal(getRouteEvidence(route, [access.waypoints[0]!, anchor.waypoints[0]!]).label, "来源核验");
});

test("source facts render in Chinese alongside the recorded lookup date", () => {
  const source = location(["existence", "address", "coordinate", "access", "shooting-value"]).verification.sources[0]!;
  assert.equal(formatSourceEvidence(source), `地点存在 · 地址 · 坐标 · 通行 · 拍摄价值 · 查阅于 ${source.accessedAt}`);
});
