import assert from "node:assert/strict";
import test from "node:test";
import { paginateItems } from "./localPagination.js";

test("limits a large local collection to the requested page size", () => {
  const items = Array.from({ length: 9231 }, (_, index) => index + 1);
  const result = paginateItems(items, 1, 24);

  assert.equal(result.page, 1);
  assert.equal(result.totalPages, 385);
  assert.equal(result.totalItems, 9231);
  assert.deepEqual(result.items, items.slice(0, 24));
});

test("clamps page requests after filters reduce the result set", () => {
  const items = Array.from({ length: 31 }, (_, index) => index + 1);
  const result = paginateItems(items, 99, 24);

  assert.equal(result.page, 2);
  assert.equal(result.totalPages, 2);
  assert.deepEqual(result.items, items.slice(24));
});

test("keeps an empty collection on a stable first page", () => {
  const result = paginateItems([], 7, 24);

  assert.equal(result.page, 1);
  assert.equal(result.totalPages, 1);
  assert.equal(result.totalItems, 0);
  assert.deepEqual(result.items, []);
});
