import assert from "node:assert/strict";
import test from "node:test";
import { capcutPracticalTutorials } from "../data/capcutProWorkflow.js";
import { resolvePracticalTutorials } from "../data/colorFinishingWorkflow.js";
import { finalCutPracticalTutorials } from "../data/finalCutProWorkflow.js";
import {
  tutorialCatalogMeta,
  tutorialCatalogTotal,
} from "../data/tutorialCatalogMeta.js";
import {
  buildTutorialSearchText,
  matchesTutorialSearch,
} from "./tutorialSearchService.js";

test("tutorial catalog summary stays aligned with lazy-loaded lesson data", () => {
  assert.equal(
    tutorialCatalogMeta.resolve.count,
    resolvePracticalTutorials.length,
  );
  assert.equal(
    tutorialCatalogMeta.capcut.count,
    capcutPracticalTutorials.length,
  );
  assert.equal(
    tutorialCatalogMeta.finalcut.count,
    finalCutPracticalTutorials.length,
  );
  assert.equal(
    tutorialCatalogTotal,
    resolvePracticalTutorials.length +
      capcutPracticalTutorials.length +
      finalCutPracticalTutorials.length,
  );
});

test("tutorial search normalizes nested content, punctuation, and case", () => {
  const tutorial = {
    title: "用 Vocal Isolation 分离人声",
    settings: ["Audio → Basic", "Keep / Remove vocals"],
  };

  assert.match(buildTutorialSearchText(tutorial), /vocal isolation/);
  assert.equal(matchesTutorialSearch(tutorial, "VOCAL isolation"), true);
  assert.equal(matchesTutorialSearch(tutorial, "audio basic"), true);
  assert.equal(matchesTutorialSearch(tutorial, "代理媒体"), false);
});

test("tutorial search tolerates reordered Chinese characters", () => {
  assert.equal(
    matchesTutorialSearch("分离人声并重建音乐关系", "人声分离"),
    true,
  );
  assert.equal(matchesTutorialSearch("代理与低分辨率预览", "代理 预览"), true);
  assert.equal(matchesTutorialSearch("章节标记导出", "字幕导出"), false);
});
