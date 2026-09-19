import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProjectPublishFields } from "../components/project/ProjectPublishFields.js";
import { buildResearchProject } from "./videoProjectService.js";

test("publish fields show only the project's channels and preserve independent milestone values", () => {
  const project = buildResearchProject("样例", "目标", []);
  project.publish.visionUploaded = true;
  for (const channelMode of ["vision", "ambience", "dual"] as const) {
    project.channelMode = channelMode;
    const html = renderToStaticMarkup(createElement(ProjectPublishFields, { project, onChange: () => {} }));
    assert.equal(html.includes("Vision 标题"), channelMode !== "ambience");
    assert.equal(html.includes("Ambience 标题"), channelMode !== "vision");
    assert.equal(html.includes('aria-pressed="true"'), channelMode !== "ambience");
    assert.match(html, /aria-pressed="false"[^>]*>2160p HDR 已核验/);
    assert.match(html, /aria-pressed="false"[^>]*>[^<]*平台处理完成/);
    assert.match(html, /aria-pressed="false"[^>]*>[^<]*已发布/);
  }
});
