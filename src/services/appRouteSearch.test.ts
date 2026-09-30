import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

test("opening plans with a saved route query does not read an unloaded search index", async () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  try {
    Object.defineProperty(globalThis, "window", { configurable: true, value: {
      localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    } });
    Object.defineProperty(globalThis, "document", { configurable: true, value: {
      documentElement: { dataset: { theme: "light" } },
    } });
    const { usePlannerStore } = await import("../app/store.js");
    const { App } = await import("../App.js");
    const { resolvedRouteSummaries, routeSummaryMatchesQuery } = await import("./browserCatalogService.js");
    assert.throws(() => routeSummaryMatchesQuery(resolvedRouteSummaries[0]!, "深圳"), /全文检索索引尚未加载/);
    const initial = usePlannerStore.getInitialState();
    const original = { view: initial.view, query: initial.query };
    initial.view = "plans";
    initial.query = "深圳";
    try {
      assert.doesNotThrow(() => renderToString(createElement(App)));
    } finally {
      Object.assign(initial, original);
    }
  } finally {
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
    if (originalDocument) Object.defineProperty(globalThis, "document", originalDocument);
    else Reflect.deleteProperty(globalThis, "document");
  }
});
