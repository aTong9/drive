import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildCatalogIndex, buildCatalogSearchIndex, splitCatalogByProvince } from "./src/services/catalogSummary.js";
import type { Catalog } from "./src/types/domain.js";

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

function catalogShardPlugin(): Plugin {
  const catalogPath = resolve(process.cwd(), "data/catalog.json");
  const indexModule = resolve(process.cwd(), "src/services/catalogIndexData.ts");
  const prefix = "\0catalog-detail:";
  const readCatalog = () => JSON.parse(readFileSync(catalogPath, "utf8")) as Catalog;
  let catalog = readCatalog();
  let locations = splitCatalogByProvince(catalog.locations);
  let routes = splitCatalogByProvince(catalog.routes);

  // Column dictionaries retain exact field values without repeating keys and shared metadata.
  function indexSource() {
    const index = buildCatalogIndex(catalog);
    const values: string[] = [];
    const references = new Map<string, number>();
    const reference = (value: unknown) => {
      if (value === undefined) return null;
      const serialized = JSON.stringify(value);
      let ref = references.get(serialized);
      if (ref === undefined) { ref = values.length; references.set(serialized, ref); values.push(serialized); }
      return ref;
    };
    const pack = (items: object[]) => {
      const keys = [...new Set(items.flatMap((item) => Object.keys(item)))];
      const rows = items.map((item) => keys.map((key) => reference((item as Record<string, unknown>)[key])));
      return { keys, rows };
    };
    const packedLocations = pack(index.locations);
    const packedRoutes = pack(index.routes);
    const { locations: _locations, routes: _routes, ...core } = index;
    return `const values = [${values.join(",")}];
const unpack = ({ keys, rows }) => rows.map(row => Object.fromEntries(keys.flatMap((key, i) => row[i] === null ? [] : [[key, values[row[i]]]])));
export const catalogIndex = { ...${JSON.stringify(core)}, locations: unpack(${JSON.stringify(packedLocations)}), routes: unpack(${JSON.stringify(packedRoutes)}) };
const locationShardRefs = ${JSON.stringify(index.locations.map((item) => locations.shardById[item.id]))};
const routeShardRefs = ${JSON.stringify(index.routes.map((item) => routes.shardById[item.id]))};
export const locationShardById = Object.fromEntries(catalogIndex.locations.map((item, i) => [item.id, locationShardRefs[i]]));
export const routeShardById = Object.fromEntries(catalogIndex.routes.map((item, i) => [item.id, routeShardRefs[i]]));
const locationLoaders = [${locations.shards.map((_, i) => `() => import("${prefix}locations-${i}").then(m => m.default)`).join(",")}];
const routeLoaders = [${routes.shards.map((_, i) => `() => import("${prefix}routes-${i}").then(m => m.default)`).join(",")}];
export const loadLocationShard = index => locationLoaders[index]();
export const loadRouteShard = index => routeLoaders[index]();
export const loadSearchIndex = () => import("${prefix}search").then(m => m.default);`;
  }
  return {
    name: "catalog-on-demand",
    enforce: "pre",
    buildStart() { this.addWatchFile(catalogPath); },
    resolveId(source) { if (source.startsWith(prefix)) return source; },
    transform(_code, id) { if (id === indexModule) return { code: indexSource(), map: null }; },
    load(id) {
      if (!id.startsWith(prefix)) return;
      const shard = id.slice(prefix.length);
      if (shard === "search") return `export default ${JSON.stringify(buildCatalogSearchIndex(catalog))};`;
      const match = /^(locations|routes)-(\d+)$/.exec(shard);
      if (match) return `export default ${JSON.stringify((match[1] === "locations" ? locations : routes).shards[Number(match[2])])};`;
    },
    handleHotUpdate({ file, server }) {
      if (file !== catalogPath) return;
      catalog = readCatalog();
      locations = splitCatalogByProvince(catalog.locations);
      routes = splitCatalogByProvince(catalog.routes);
      for (const module of server.moduleGraph.idToModuleMap.values()) {
        if (module.id === indexModule || module.id?.startsWith(prefix)) server.moduleGraph.invalidateModule(module);
      }
      server.ws.send({ type: "full-reload", path: "*" });
      return [];
    },
  };
}

function initialPrecache<T extends { url: string }>(entries: T[]) {
  const manifest = JSON.parse(readFileSync(resolve(process.cwd(), "dist/.vite/manifest.json"), "utf8")) as Record<string, { file: string; isEntry?: boolean; imports?: string[]; css?: string[] }>;
  const allowed = new Set(["index.html", "icons/roadlens.svg", "icons/roadlens-maskable.svg", "art/roadlens-countryside.jpg"]);
  const visited = new Set<string>();
  function visit(key: string) {
    if (visited.has(key)) return;
    visited.add(key);
    const chunk = manifest[key];
    if (!chunk) throw new Error(`Unknown build manifest entry: ${key}`);
    allowed.add(chunk.file);
    for (const css of chunk.css ?? []) allowed.add(css);
    for (const dependency of chunk.imports ?? []) visit(dependency);
  }
  for (const [key, chunk] of Object.entries(manifest)) if (chunk.isEntry) visit(key);
  visit("src/components/location/LocationView.tsx");
  return { manifest: entries.filter((entry) => allowed.has(entry.url)), warnings: [] };
}

export default defineConfig(() => {
  const amap = readAmapCredentials();
  return {
    base: process.env.VITE_BASE_PATH || "/",
    plugins: [
      catalogShardPlugin(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["icons/roadlens.svg"],
        manifest: {
          name: "RoadLens Planner",
          short_name: "RoadLens",
          description: "为自驾摄影创作者规划真实、可执行的拍摄路线。",
          theme_color: "#f6f3e9",
          background_color: "#f6f3e9",
          display: "standalone",
          orientation: "any",
          start_url: ".",
          scope: ".",
          lang: "zh-CN",
          icons: [
            { src: "icons/roadlens.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
            { src: "icons/roadlens-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" }
          ]
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,jpg}"],
          cleanupOutdatedCaches: true,
          navigateFallback: "index.html",
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          manifestTransforms: [async (entries) => initialPrecache(entries)],
          runtimeCaching: [{
            urlPattern: /\/assets\/.*\.(?:js|css)$/,
            handler: "CacheFirst",
            options: { cacheName: "roadlens-demand-assets", expiration: { maxEntries: 500, maxAgeSeconds: 30 * 86400 }, cacheableResponse: { statuses: [200] } },
          }]
        }
      })
    ],
    build: {
      manifest: true,
      rollupOptions: {
        output: {
          manualChunks(moduleId: string) {
            if (moduleId.startsWith("\0catalog-detail:")) return `catalog-${moduleId.slice("\0catalog-detail:".length)}`;
            if (moduleId.endsWith("/src/services/catalogIndexData.ts")) return "catalog-index";
            if (moduleId.endsWith("/data/youtube-creators.json")) return "creator-data";
            if (moduleId.endsWith("/data/youtube-music-library.json")) return "music-library-core";
            const musicCatalogMatch = /\/data\/music-catalogs\/([^/]+)\.json$/.exec(moduleId);
            if (musicCatalogMatch) return `music-catalog-${musicCatalogMatch[1]}`;
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
