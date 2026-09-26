import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

test("the head restores the saved theme before first paint and tolerates unavailable storage", () => {
  const head = readFileSync(new URL("../index.html", import.meta.url), "utf8").split("</head>")[0];
  const script = head.match(/<script id="theme-init">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, "theme initialization must run in the document head");

  for (const saved of ["dark", "light", null, "invalid", new Error("Storage unavailable")]) {
    const root = { dataset: { theme: "light" } };
    const meta = { content: "#f4f0e5", setAttribute(name, value) { this[name] = value; } };
    runInNewContext(script, {
      document: { documentElement: root, querySelector: () => meta },
      localStorage: { getItem() { if (saved instanceof Error) throw saved; return saved; } },
    });
    assert.equal(root.dataset.theme, saved === "dark" ? "dark" : "light");
    assert.equal(meta.content, saved === "dark" ? "#142421" : "#f4f0e5");
  }
});
