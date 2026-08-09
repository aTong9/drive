import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function readAmapCredentials() {
  const envPath = resolve(process.cwd(), ".ENV_AMAP");
  if (!existsSync(envPath)) return { key: "", security: "" };

  const values: Record<string, string> = {};
  for (const rawLine of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const name = line.slice(0, separator).trim();
    values[name] = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
  }

  return { key: values.key ?? "", security: values.security ?? "" };
}

export default defineConfig(() => {
  const amap = readAmapCredentials();
  return {
    plugins: [react(), tailwindcss()],
    define: {
      __AMAP_KEY__: JSON.stringify(amap.key),
      __AMAP_SECURITY_CODE__: JSON.stringify(amap.security)
    }
  };
});
