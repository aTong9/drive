import assert from "node:assert/strict";
import test from "node:test";
import { socialBladeUrl, youtubeCreatorResearch } from "./youtubeCreatorService.js";

test("includes the three ambience research categories", () => {
  for (const category of ["nature-ambience", "ambient-cinema", "asmr-nature"] as const) {
    assert.ok(youtubeCreatorResearch.creators.filter((creator) => creator.category === category).length >= 7);
  }
});

test("builds a Social Blade handle link from a YouTube channel", () => {
  assert.equal(socialBladeUrl("https://www.youtube.com/@AmbientWorlds"), "https://socialblade.com/youtube/handle/ambientworlds");
});
