import assert from "node:assert/strict";
import test from "node:test";
import { filterMediaParameters, mediaParameterEntries } from "./mediaParameterService.js";

test("media glossary covers core video and audio industry parameter families", () => {
  const videoCategories = new Set(mediaParameterEntries.filter((item) => item.domain === "video").map((item) => item.category));
  const audioCategories = new Set(mediaParameterEntries.filter((item) => item.domain === "audio").map((item) => item.category));
  assert.ok(videoCategories.size >= 5);
  assert.ok(audioCategories.size >= 4);
  assert.ok(mediaParameterEntries.some((item) => item.tags.includes("HDR10")));
  assert.ok(mediaParameterEntries.some((item) => item.tags.includes("48kHz")));
});

test("media glossary search resolves common resolution and audio terms", () => {
  assert.ok(filterMediaParameters("video", "8K").some((item) => item.id === "resolution"));
  assert.ok(filterMediaParameters("audio", "LUFS").some((item) => item.id === "loudness"));
});
