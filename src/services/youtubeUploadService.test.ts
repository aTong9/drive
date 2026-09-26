import { resolvedRoutes } from "./catalogService.js";
import { buildVideoProject } from "./videoProjectService.js";
import assert from "node:assert/strict";
import test from "node:test";
import { buildYoutubeUploadGuide, resolveUploadProject } from "./youtubeUploadService.js";
import { estimateSocialBladeEarnings } from "./youtubeCreatorService.js";

test("provides conservative upload defaults without a connected YouTube API", () => {
  const guide = buildYoutubeUploadGuide(undefined, undefined, "ambience");
  assert.equal(guide.visibility, "Private");
  assert.match(guide.title, /Real Road Sounds 4K HDR — No Music, No Talking/);
  assert.match(
    guide.description,
    /No music, no talking, no artificial sound loops/,
  );
  assert.ok(guide.checks.some((item) => item.includes("2160p HDR")));
});

test("keeps the two channel promises distinct", () => {
  const vision = buildYoutubeUploadGuide(undefined, undefined, "vision");
  const ambience = buildYoutubeUploadGuide(undefined, undefined, "ambience");
  assert.match(vision.title, /Cinematic Night Drive/);
  assert.match(vision.description, /Confirm music licensing/i);
  assert.match(ambience.title, /No Music, No Talking/);
  assert.match(ambience.description, /真实道路与自然环境声/);
  assert.notEqual(vision.playlist, ambience.playlist);
});

test("matches Social Blade's public default CPM estimate range", () => {
  assert.deepEqual(estimateSocialBladeEarnings(100_000), {
    monthlyLow: 25,
    monthlyHigh: 400,
    yearlyLow: 300,
    yearlyHigh: 4800,
  });
});

test("provides distinct search, immersive and archive upload templates", () => {
  const search = buildYoutubeUploadGuide(
    undefined,
    undefined,
    "vision",
    "search",
  );
  const immersive = buildYoutubeUploadGuide(
    undefined,
    undefined,
    "vision",
    "immersive",
  );
  const archive = buildYoutubeUploadGuide(
    undefined,
    undefined,
    "vision",
    "archive",
  );
  assert.equal(new Set([search.title, immersive.title, archive.title]).size, 3);
  assert.match(immersive.description, /cinematic night journey/i);
  assert.match(archive.title, /Night Drive Film/);
});

test("provides separate English originals and Chinese localized metadata", () => {
  const guide = buildYoutubeUploadGuide(undefined, undefined, "ambience");
  assert.match(guide.title, /Real Road Sounds/);
  assert.match(guide.titleZh, /真实道路环境声/);
  assert.match(guide.descriptionEn, /CHAPTERS/);
  assert.doesNotMatch(guide.descriptionEn, /中文/);
  assert.match(guide.descriptionZh, /章节/);
  assert.ok(guide.tagsZh.includes("夜间驾驶"));
  assert.equal(guide.checks.length, guide.checksEn.length);
  assert.match(guide.thumbnailEn, /4K HDR/);
});


test("keeps the general upload template separate from saved projects", () => {
  const route = resolvedRoutes[0]!;
  const project = buildVideoProject({ id: "plan", routeId: route.route.id, scheduledDate: "2026-09-19", objective: "测试", status: "planned", createdAt: "2026-09-19" }, route);
  const projects = [{ ...project, id: "first" }, { ...project, id: "second" }];
  assert.equal(resolveUploadProject(projects, ""), undefined);
  assert.equal(resolveUploadProject(projects, "second"), projects[1]);
  assert.equal(resolveUploadProject(projects, "deleted"), projects[0]);
  assert.equal(resolveUploadProject([], "deleted"), undefined);
});

test("publishing text uses saved chapters and only claims confirmed music licenses", () => {
  const route = resolvedRoutes[0]!;
  const project = buildVideoProject({ id: "publish-check", routeId: route.route.id, scheduledDate: "2026-09-26", objective: "测试", status: "planned", createdAt: "2026-09-26" }, route);
  project.publish.chapters = "00:00 Opening\n02:17 Riverside";
  project.musicTracks = [{ id: "music", title: "Track", platform: "Library", channel: "vision", licenseStatus: "candidate", attribution: "Artist", licenseReference: "" }];
  for (const template of ["search", "immersive", "archive"] as const) {
    const guide = buildYoutubeUploadGuide(project, route, "vision", template);
    for (const description of [guide.descriptionEn, guide.descriptionZh]) {
      assert.equal(description.split(project.publish.chapters).length - 1, 1);
      assert.doesNotMatch(description, /00:45|已授权音乐|licensed music/i);
    }
  }
  project.musicTracks[0]!.licenseStatus = "licensed";
  assert.match(buildYoutubeUploadGuide(project, route, "vision").descriptionZh, /已授权音乐/);
  project.musicTracks[0]!.licenseStatus = "clearlisted";
  assert.match(buildYoutubeUploadGuide(project, route, "vision").descriptionZh, /已授权音乐/);
  const ambience = buildYoutubeUploadGuide(project, route, "ambience");
  assert.doesNotMatch(ambience.descriptionZh, /音乐署名|Vision：/);
  project.musicTracks.push({ ...project.musicTracks[0]!, id: "unconfirmed", licenseStatus: "candidate" });
  assert.doesNotMatch(buildYoutubeUploadGuide(project, route, "vision").descriptionZh, /已授权音乐/);
  project.musicTracks = [];
  assert.doesNotMatch(buildYoutubeUploadGuide(project, route, "vision").descriptionZh, /已授权音乐/);
});
