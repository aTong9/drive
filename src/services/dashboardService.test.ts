import assert from "node:assert/strict";
import test from "node:test";
import { buildDashboardMetrics } from "./dashboardService.js";
import type { ResolvedRoute } from "../types/domain.js";

test("dashboard derives published, coverage and post progress", () => {
  const routes = [{ route: { id: "r", name: "Route" }, waypoints: [{ id: "a" }, { id: "b" }], cameraPresets: [] }] as unknown as ResolvedRoute[];
  const metrics = buildDashboardMetrics(routes, [{ id: "p", routeId: "r", scheduledDate: "2026-01-01", objective: "x", status: "published", createdAt: "2026-01-01T00:00:00Z" }], [{ locationId: "a", visitedAt: "2026-01-01", parkingNote: "", lightNote: "", soundNote: "", overallNote: "ok", updatedAt: "2026-01-01T00:00:00Z" }], [{ id: "t", workflowId: "w", stageId: "media", title: "x", completed: true }]);
  assert.equal(metrics.publishedCount, 1); assert.equal(metrics.capturedCount, 1); assert.equal(metrics.checkCoverage, 50); assert.equal(metrics.postProgress, 100);
});
