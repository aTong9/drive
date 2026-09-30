import assert from "node:assert/strict";
import test from "node:test";
import { downloadBlob } from "./downloadService.js";

test("download preserves bytes and filename, then releases its URL", async () => {
  const create = URL.createObjectURL;
  const revoke = URL.revokeObjectURL;
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  let saved: Blob | undefined;
  let released = "";
  let scheduled: (() => void) | undefined;
  let clicked = false;
  let removed = false;
  const anchor = { href: "", download: "", click: () => { clicked = true; }, remove: () => { removed = true; } };
  try {
    URL.createObjectURL = (blob) => { saved = blob as Blob; return "blob:test"; };
    URL.revokeObjectURL = (url) => { released = url; };
    Object.defineProperty(globalThis, "document", { configurable: true, value: {
      createElement: () => anchor, body: { append: () => {} },
    } });
    Object.defineProperty(globalThis, "window", { configurable: true, value: {
      setTimeout: (callback: () => void) => { scheduled = callback; },
    } });
    const source = "{broken\n原文";
    downloadBlob(new Blob([source], { type: "application/json;charset=utf-8" }), "original.json");
    assert.equal(await saved?.text(), source);
    assert.equal(saved?.type, "application/json;charset=utf-8");
    assert.equal(anchor.download, "original.json");
    assert.equal(anchor.href, "blob:test");
    assert.equal(clicked, true);
    assert.equal(removed, true);
    assert.equal(released, "");
    scheduled?.();
    assert.equal(released, "blob:test");
  } finally {
    URL.createObjectURL = create;
    URL.revokeObjectURL = revoke;
    if (originalDocument) Object.defineProperty(globalThis, "document", originalDocument);
    else Reflect.deleteProperty(globalThis, "document");
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
