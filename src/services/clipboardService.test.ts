import assert from "node:assert/strict";
import test from "node:test";
import { copyToClipboard } from "./clipboardService.js";

test("clipboard feedback waits for the write and handles denied or missing clipboard access", async () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  try {
    let finish: () => void = () => {};
    let written = "";
    Object.defineProperty(globalThis, "navigator", { configurable: true, value: {
      clipboard: { writeText: (text: string) => new Promise<void>((resolve) => { written = text; finish = resolve; }) },
    } });
    let settled = false;
    const pending = copyToClipboard("标题\n署名").then((result) => { settled = true; return result; });
    await Promise.resolve();
    assert.equal(settled, false);
    finish();
    assert.equal(await pending, true);
    assert.equal(written, "标题\n署名");
    Object.defineProperty(globalThis, "navigator", { configurable: true, value: {
      clipboard: { writeText: async () => { throw new Error("Permission denied"); } },
    } });
    assert.equal(await copyToClipboard("private"), false);
    Object.defineProperty(globalThis, "navigator", { configurable: true, value: {} });
    assert.equal(await copyToClipboard("unavailable"), false);
  } finally {
    if (original) Object.defineProperty(globalThis, "navigator", original);
    else Reflect.deleteProperty(globalThis, "navigator");
  }
});
