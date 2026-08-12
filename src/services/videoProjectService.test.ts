import assert from "node:assert/strict";
import test from "node:test";
import type { LocalShootPlan, ResolvedRoute } from "../types/domain.js";
import {
  buildVideoProject,
  generateProjectDescription,
  getNextProjectAction,
  getProjectProgress,
  getRetrospectiveInsights,
  hasRetrospectiveData,
  getStageGateIssues,
  normalizeVideoProject,
  validateVideoProject,
} from "./videoProjectService.js";

const plan: LocalShootPlan = {
  id: "plan-a",
  routeId: "route-a",
  scheduledDate: "2026-08-20",
  objective: "完成夜驾双频道素材",
  status: "planned",
  createdAt: "2026-08-12T00:00:00.000Z",
};
const route = {
  route: {
    id: "route-a",
    name: "夜驾测试路线",
    executionMode: "drive-only",
    estimatedDurationMinutes: 90,
  },
  waypoints: [
    {
      id: "point-a",
      name: "起点",
      city: "惠州",
      shooting: { advice: "固定设备" },
      soundEnvironment: { recordingAdvice: "监听道路声" },
    },
    {
      id: "point-b",
      name: "终点",
      city: "惠州",
      shooting: { advice: "保持连续" },
      soundEnvironment: { recordingAdvice: "录环境声" },
    },
  ],
  cameraPresets: [{ id: "camera-a" }],
} as unknown as ResolvedRoute;

test("video project derives a dual-channel shot list and field pack", () => {
  const project = buildVideoProject(plan, route);
  assert.equal(project.channelMode, "dual");
  assert.equal(project.routeId, route.route.id);
  assert.ok(project.shots.some((shot) => shot.purpose === "movement"));
  assert.ok(project.shots.some((shot) => shot.purpose === "sound"));
  assert.ok(project.shots.some((shot) => shot.purpose === "thumbnail"));
  assert.deepEqual(
    new Set(project.packItems.map((item) => item.group)),
    new Set(["route", "gear", "weather", "safety", "sound", "storage"]),
  );
  assert.ok(project.packItems.every((item) => !item.completed));
});

test("next project action follows lifecycle instead of always returning field pack", () => {
  const project = buildVideoProject(plan, route);
  project.status = "ingest";
  assert.equal(getNextProjectAction(project), project.ingestItems[0]?.title);
  project.ingestItems.forEach((item) => {
    item.completed = true;
  });
  assert.equal(
    getNextProjectAction(project),
    "素材接收完成，建立 Picture Master",
  );
  project.status = "review";
  assert.equal(getNextProjectAction(project), "等待 YouTube 显示 2160p HDR");
});

test("normalizes projects saved before production workflow fields existed", () => {
  const legacy = buildVideoProject(plan, route);
  delete (legacy.shots[0] as Partial<(typeof legacy.shots)[number]>)
    .captureStatus;
  legacy.shots[0]!.completed = true;
  delete (legacy as Partial<typeof legacy>).publish;
  delete (legacy as Partial<typeof legacy>).retrospective;
  delete (legacy as Partial<typeof legacy>).mediaBatches;
  const normalized = normalizeVideoProject(legacy);
  assert.equal(normalized.publish.hdrVerified, false);
  assert.equal(normalized.retrospective.nextAction, "");
  assert.equal(normalized.retrospective.metrics.views7d, 0);
  assert.equal(normalized.shots[0]?.captureStatus, "captured");
  assert.deepEqual(normalized.mediaBatches, []);
});

test("video project contract accepts a generated project and rejects malformed imports", () => {
  const project = buildVideoProject(plan, route);
  assert.equal(validateVideoProject(project), true);
  assert.equal(validateVideoProject({ ...project, status: "unknown" }), false);
  assert.equal(
    validateVideoProject({ ...project, shots: [{ id: "broken" }] }),
    false,
  );
  assert.equal(validateVideoProject({ ...project, routeId: "" }), false);
});

test("full project progress includes publishing and retrospective work", () => {
  const project = buildVideoProject(plan, route);
  const initial = getProjectProgress(project);
  assert.ok(
    initial.percent > 0,
    "generated publishing copy contributes initial progress",
  );
  assert.ok(initial.percent < 100);
  assert.ok(
    initial.sections.some(
      (section) => section.id === "publish" && section.total === 8,
    ),
  );
  project.shots.forEach((item) => {
    item.completed = true;
  });
  project.packItems.forEach((item) => {
    item.completed = true;
  });
  assert.ok(getProjectProgress(project).percent > initial.percent);
});

test("stage gates report cumulative gaps without blocking lifecycle changes", () => {
  const project = buildVideoProject(plan, route);
  const editingIssues = getStageGateIssues(project, "editing");
  assert.ok(editingIssues.some((issue) => issue.includes("出发任务包")));
  assert.ok(editingIssues.some((issue) => issue.includes("镜头清单")));
  assert.ok(editingIssues.some((issue) => issue.includes("素材接收")));
  const publishedIssues = getStageGateIssues(project, "published");
  assert.ok(publishedIssues.some((issue) => issue.includes("2160p HDR")));
  assert.ok(
    publishedIssues.some((issue) => issue.includes("下一次可执行改进")),
  );
});

test("waived shots resolve the field gate while missed shots stay actionable", () => {
  const project = buildVideoProject(plan, route);
  project.packItems.forEach((item) => {
    item.completed = true;
  });
  project.shots.forEach((shot) => {
    shot.captureStatus = "waived";
    shot.completed = false;
  });
  assert.ok(
    !getStageGateIssues(project, "ingest").some((issue) =>
      issue.includes("镜头清单"),
    ),
  );
  project.shots[0]!.captureStatus = "missed";
  project.status = "shooting";
  assert.match(getNextProjectAction(project), /处理漏拍/);
  assert.ok(
    getStageGateIssues(project, "ingest").some((issue) =>
      issue.includes("1 项漏拍"),
    ),
  );
});

test("unmigrated shot status fails safe as pending", () => {
  const project = buildVideoProject(plan, route);
  project.packItems.forEach((item) => {
    item.completed = true;
  });
  delete (project.shots[0] as Partial<(typeof project.shots)[number]>)
    .captureStatus;
  assert.ok(
    getStageGateIssues(project, "ingest").some((issue) =>
      issue.includes("待拍"),
    ),
  );
  project.status = "shooting";
  assert.equal(getNextProjectAction(project), project.shots[0]?.title);
});

test("media ingest gate requires a registered, verified double-backed-up batch", () => {
  const project = buildVideoProject(plan, route);
  project.packItems.forEach((item) => {
    item.completed = true;
  });
  project.shots.forEach((shot) => {
    shot.captureStatus = "captured";
    shot.completed = true;
  });
  project.ingestItems.forEach((item) => {
    item.completed = true;
  });
  assert.ok(
    getStageGateIssues(project, "editing").some((issue) =>
      issue.includes("素材批次"),
    ),
  );
  project.mediaBatches.push({
    id: "batch-a",
    label: "CARD-A",
    sourceDevice: "Pocket 3",
    storageCard: "SD-A",
    fileCount: 42,
    totalGB: 18.5,
    locationIds: ["point-a"],
    primaryBackup: true,
    secondaryBackup: false,
    verified: false,
    note: "",
  });
  assert.ok(
    getStageGateIssues(project, "editing").some((issue) =>
      issue.includes("双备份"),
    ),
  );
  project.mediaBatches[0]!.secondaryBackup = true;
  project.mediaBatches[0]!.verified = true;
  assert.ok(
    !getStageGateIssues(project, "editing").some(
      (issue) => issue.includes("素材批次") || issue.includes("双备份"),
    ),
  );
});

test("publishing description includes route, chapters and music attribution", () => {
  const project = buildVideoProject(plan, route);
  project.musicTracks.push({
    id: "music-a",
    title: "Night Road",
    platform: "Artlist",
    licenseStatus: "licensed",
    attribution: "Artist A · License 123",
    licenseReference: "123",
    channel: "vision",
  });
  const description = generateProjectDescription(project, route);
  assert.match(description, /起点 → 终点/);
  assert.match(description, /Night Road — Artist A/);
  assert.match(description, /aBin Ambience/);
});

test("retrospective metrics generate actionable next-project insights", () => {
  const project = buildVideoProject(plan, route);
  project.retrospective.metrics.clickThroughRate = 3.2;
  project.retrospective.metrics.averagePercentageViewed = 24;
  project.retrospective.metrics.bestMoment = "03:20 雨后高架反光";
  const insights = getRetrospectiveInsights(project);
  assert.ok(insights.some((item) => item.includes("缩略图")));
  assert.ok(insights.some((item) => item.includes("压缩开场")));
  assert.ok(insights.some((item) => item.includes("高表现片段")));
  assert.equal(hasRetrospectiveData(project), true);
});
