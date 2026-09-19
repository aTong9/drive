import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MusicTrackCard } from "../components/music/MusicTrackCard.js";
import { youtubeMusicLibrary } from "./youtubeMusicService.js";

test("music card keeps attribution, source links and duplicate-add protection", () => {
  const track = youtubeMusicLibrary.tracks[0]!;
  const props = { track, platformName: "来源平台", riskLabel: "需复核", sceneLabels: {}, canAdd: true, added: true, onAdd: () => {} };
  const html = renderToStaticMarkup(createElement(MusicTrackCard, props));
  assert.match(html, /disabled="">已记入项目/);
  assert.match(html, /署名与授权要求 · 需复核/);
  assert.ok(html.includes(track.listenUrl.replaceAll("&", "&amp;")));
  assert.ok(html.includes(track.downloadUrl.replaceAll("&", "&amp;")));
  const withoutProject = renderToStaticMarkup(createElement(MusicTrackCard, { ...props, canAdd: false, added: false }));
  assert.match(withoutProject, /disabled="">记入项目/);
});
