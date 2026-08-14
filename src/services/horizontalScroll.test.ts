import assert from "node:assert/strict";
import test from "node:test";
import { horizontalScrollDelta } from "./horizontalScroll.js";

test("uses a desktop mouse wheel to move an overflowing rail horizontally", () => {
  assert.equal(horizontalScrollDelta(0, 120), 120);
  assert.equal(horizontalScrollDelta(-42, 5), -42);
});
