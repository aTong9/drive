import { fileURLToPath } from "node:url";

export function fileUrlPath(url, options) {
  return fileURLToPath(url, options);
}
