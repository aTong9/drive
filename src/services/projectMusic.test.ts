import assert from "node:assert/strict";
import test from "node:test";
import { usePlannerStore } from "../app/store.js";
import { buildProjectMusicCandidate, buildVideoProject, normalizeVideoProject } from "./videoProjectService.js";
import { resolvedRoutes } from "./catalogService.js";

test("catalog music retains provenance without granting permission or duplicating tracks", () => {
  const initial = usePlannerStore.getState();
  const route = resolvedRoutes[0]!;
  const project = buildVideoProject({ id: "music-test", routeId: route.route.id, scheduledDate: "2026-09-19", objective: "测试", status: "planned", createdAt: "2026-09-19" }, route);
  const track = buildProjectMusicCandidate({ id: "track", title: "曲名", artist: "作者", listenUrl: "https://example.com/track", credit: "署名文本" }, "平台");
  try {
    usePlannerStore.setState({ videoProjects: [project] });
    initial.addProjectMusic(project.id, track);
    initial.addProjectMusic(project.id, track);
    const saved = usePlannerStore.getState().videoProjects[0]!;
    assert.equal(saved.musicTracks.length, 1);
    assert.equal(saved.musicTracks[0]!.licenseStatus, "candidate");
    assert.equal(saved.musicTracks[0]!.licenseReference, "");
    assert.deepEqual(normalizeVideoProject(JSON.parse(JSON.stringify(saved))).musicTracks, [track]);
    assert.equal(saved.musicTracks[0]!.artist, "作者");
    assert.equal(saved.musicTracks[0]!.platform, "平台");
    assert.equal(saved.musicTracks[0]!.sourceUrl, "https://example.com/track");
  } finally { usePlannerStore.setState(initial, true); }
});
