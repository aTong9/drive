import test from "node:test";
import assert from "node:assert/strict";
import { searchWorkspaceViews, viewPresentation, workspaceGroups } from "../app/viewPresentation.js";

test("workspace navigation covers every page once and searches labels, descriptions and ids", () => {
  const views = workspaceGroups.flatMap((group) => group.views);
  assert.equal(new Set(views).size, views.length);
  assert.deepEqual([...views].sort(), Object.keys(viewPresentation).sort());
  assert.deepEqual(searchWorkspaceViews(" 音乐 ").flatMap((group) => group.views), ["music"]);
  assert.deepEqual(searchWorkspaceViews("DaVinci").flatMap((group) => group.views), ["post"]);
  assert.deepEqual(searchWorkspaceViews("CAMERAS").flatMap((group) => group.views), ["cameras"]);
  assert.deepEqual(searchWorkspaceViews("no-such-workspace"), []);
  assert.equal(searchWorkspaceViews("").flatMap((group) => group.views).length, 11);
});
