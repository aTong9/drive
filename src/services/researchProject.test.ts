import test from "node:test";
import assert from "node:assert/strict";
import { buildResearchProject, normalizeVideoProject, validateVideoProject, getNextProjectAction, generateProjectDescription } from "./videoProjectService.js";

test("research creates a portable project without fabricated route, date or publish claims", () => {
  const project = buildResearchProject("首条选题", "案例：https://example.com\n采访记录", ["预约采访", "收集现场声"]);
  assert.equal(project.routeId, "");
  assert.equal(project.scheduledDate, "");
  assert.equal(project.planId, undefined);
  assert.equal(project.publish.hdrVerified, false);
  assert.equal(project.publish.visionPublished, false);
  assert.ok(validateVideoProject(project));
  assert.equal(validateVideoProject({ ...project, origin: undefined }), false);
  assert.deepEqual(normalizeVideoProject(JSON.parse(JSON.stringify(project))), project);
  assert.match(getNextProjectAction(project), /确认拍摄日期/);
  assert.ok(project.packItems.some((item) => item.title === "预约采访"));
});

test("single-channel publishing keeps upload, processing, HDR and publication independent", () => {
  const project = buildResearchProject("选题", "目标", []);
  project.status = "review";
  project.publish.visionUploaded = true;
  const restored = normalizeVideoProject(JSON.parse(JSON.stringify(project)));
  assert.equal(restored.publish.visionUploaded, true);
  assert.equal(restored.publish.visionProcessed, undefined);
  assert.equal(restored.publish.hdrVerified, false);
  assert.equal(restored.publish.visionPublished, false);
  project.publish.visionProcessed = true;
  project.publish.hdrVerified = true;
  project.publish.visionPublished = true;
  assert.equal(getNextProjectAction(project), "记录项目复盘并标记已发布");
});

 test("research publish description excludes internal brief and unrelated road-channel claims", () => {
  const project = buildResearchProject("纪录片", "内部采访排期与预算", []);
  project.publish.chapters = "00:00 开场";
  const description = generateProjectDescription(project);
  assert.match(description, /纪录片/);
  assert.match(description, /00:00 开场/);
  assert.doesNotMatch(description, /内部采访|预算|Ambience|道路环境声/);
  project.status = "editing";
  assert.equal(getNextProjectAction(project), "进入交付质检");
});
