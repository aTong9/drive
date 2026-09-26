import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TutorialBody } from "../components/post/TutorialBody.js";

test("shared tutorial body preserves instructions and optional prerequisites", () => {
  const tutorial = { scenario: "测试场景", settings: ["参数起点"], steps: ["执行步骤"], checks: ["检查结果"], pitfall: "失败处理" };
  const markup = renderToStaticMarkup(createElement(TutorialBody, { tutorial }));
  for (const text of ["测试场景", "参数起点", "执行步骤", "检查结果", "失败处理"]) assert.ok(markup.includes(text));
  assert.ok(!markup.includes("开始前"));
  const withPrerequisite = renderToStaticMarkup(createElement(TutorialBody, { tutorial: { ...tutorial, prerequisite: "素材准备" } }));
  assert.ok(withPrerequisite.includes("开始前</strong>素材准备"));
});
