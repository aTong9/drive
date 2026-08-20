import assert from "node:assert/strict";
import test from "node:test";
import { ordinaryCreatorVerticalModelsBatch30 } from "../data/ordinaryCreatorVerticalModelsBatch30.js";
import { ordinaryCreatorVerticalModelsBatch50 } from "../data/ordinaryCreatorVerticalModelsBatch50.js";
import { ordinaryCreatorVerticalModelsBatch50B } from "../data/ordinaryCreatorVerticalModelsBatch50B.js";
import { ordinaryCreatorVerticalModelsBatch90 } from "../data/ordinaryCreatorVerticalModelsBatch90.js";
import {
  ordinaryCreatorModels,
  socialBladeUrl,
  viewStatsUrl,
  youtubeCreatorResearch,
} from "./youtubeCreatorService.js";

test("ordinary-person channel ideas distinguish every appearance mode", () => {
  for (const mode of ["on-camera", "faceless", "hybrid"] as const) {
    assert.ok(
      ordinaryCreatorModels.filter((model) => model.mode === mode).length >= 4,
      `${mode} needs at least four executable models`,
    );
  }
});

test("the latest creator expansion adds exactly thirty directions", () => {
  assert.equal(ordinaryCreatorVerticalModelsBatch30.length, 30);
});

test("the newest creator expansion adds exactly fifty directions", () => {
  assert.equal(ordinaryCreatorVerticalModelsBatch50.length, 50);
});

test("the second fifty-direction expansion is complete", () => {
  assert.equal(ordinaryCreatorVerticalModelsBatch50B.length, 50);
});

test("the ninety-direction expansion is complete", () => {
  assert.equal(ordinaryCreatorVerticalModelsBatch90.length, 90);
});

test("every ordinary-person channel model is actionable", () => {
  assert.ok(ordinaryCreatorModels.length >= 300);
  for (const model of ordinaryCreatorModels) {
    assert.ok(model.minimumKit.length >= 4, `${model.id} needs a minimum kit`);
    assert.ok(
      model.repeatableFormat.length >= 5,
      `${model.id} needs a repeatable episode structure`,
    );
    assert.ok(
      model.firstTopics.length >= 4,
      `${model.id} needs starter topics`,
    );
    assert.ok(model.incomePaths.length >= 4, `${model.id} needs income paths`);
    assert.ok(
      model.references.length >= 3,
      `${model.id} needs at least three creator examples`,
    );
    const referenceUrls = model.references.map((reference) => reference.url);
    assert.equal(
      new Set(referenceUrls).size,
      referenceUrls.length,
      `${model.id} has duplicate creator examples`,
    );
    assert.ok(
      model.references.every((reference) =>
        reference.url.startsWith("https://www.youtube.com/"),
      ),
    );
  }
});

test("includes the three ambience research categories", () => {
  for (const category of [
    "nature-ambience",
    "ambient-cinema",
    "asmr-nature",
  ] as const) {
    assert.ok(
      youtubeCreatorResearch.creators.filter(
        (creator) => creator.category === category,
      ).length >= 7,
    );
  }
});

test("keeps every creator model represented by a useful research set", () => {
  const categories = [
    "scenic-drive",
    "rain-walk",
    "stationary-nature",
    "urban-walk",
    "guided-walk",
    "cinematic-landscape",
    "nature-ambience",
    "ambient-cinema",
    "asmr-nature",
  ] as const;
  for (const category of categories) {
    assert.ok(
      youtubeCreatorResearch.creators.filter(
        (creator) => creator.category === category,
      ).length >= 5,
      `${category} needs at least five creators`,
    );
  }
});

test("builds a Social Blade handle link from a YouTube channel", () => {
  assert.equal(
    socialBladeUrl("https://www.youtube.com/@AmbientWorlds"),
    "https://socialblade.com/youtube/handle/ambientworlds",
  );
});

test("builds a ViewStats channel analytics link from a YouTube handle", () => {
  assert.equal(
    viewStatsUrl("https://www.youtube.com/@AmbientWorlds/videos"),
    "https://www.viewstats.com/@ambientworlds/channelytics",
  );
});

test("falls back to analytics homepages when a channel has no handle", () => {
  assert.equal(
    socialBladeUrl("https://www.youtube.com/channel/example"),
    "https://socialblade.com/youtube/",
  );
  assert.equal(
    viewStatsUrl("https://www.youtube.com/channel/example"),
    "https://www.viewstats.com/",
  );
});
