import assert from "node:assert/strict";
import test from "node:test";
import { fileUrlPath } from "./file-url-path.mjs";

test("converts a Windows file URL without duplicating its drive prefix", () => {
  const directory = fileUrlPath(
    new URL("file:///D:/a/drive/drive/dist/assets/"),
    { windows: true },
  );

  assert.equal(directory, "D:\\a\\drive\\drive\\dist\\assets\\");
  assert.equal(directory.includes("D:\\D:"), false);
});
