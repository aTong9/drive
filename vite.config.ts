import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function readAmapCredentials() {
  const envPath = resolve(process.cwd(), ".ENV_AMAP");
  const values: Record<string, string> = {};
  if (existsSync(envPath)) {
    for (const rawLine of readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const separator = line.indexOf("=");
      if (separator < 1) continue;
      const name = line.slice(0, separator).trim();
      values[name] = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
    }
  }

  return {
    key: process.env.AMAP_KEY ?? values.key ?? "",
    security: process.env.AMAP_SECURITY_CODE ?? values.security ?? ""
  };
}

export default defineConfig(() => {
  const amap = readAmapCredentials();
  return {
    base: process.env.VITE_BASE_PATH || "/",
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(moduleId: string) {
            if (moduleId.endsWith("/data/catalog.json")) return "catalog-data";
            if (moduleId.endsWith("/data/youtube-creators.json")) return "creator-data";
            if (moduleId.includes("node_modules/react") || moduleId.includes("node_modules/zustand")) return "react-runtime";
            if (moduleId.includes("node_modules/ajv")) return "data-validation";
            if (moduleId.includes("node_modules/@amap/amap-jsapi-loader")) return "amap-loader";
          }
        }
      }
    },
    define: {
      __AMAP_KEY__: JSON.stringify(amap.key),
      __AMAP_SECURITY_CODE__: JSON.stringify(amap.security)
    }
  };
});
