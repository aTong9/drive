import { defineConfig, type Plugin } from "vite";
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

function catalogShardPlugin(): Plugin {
  const catalogPath = resolve(process.cwd(), "data/catalog.json");
  const virtualPrefix = "\0catalog-shard:";
  const virtualIds = [
    `${virtualPrefix}main`,
    ...Array.from({ length: 4 }, (_, index) => `${virtualPrefix}locations-${index}`),
    ...Array.from({ length: 2 }, (_, index) => `${virtualPrefix}routes-${index}`)
  ];

  function readCatalogShards() {
    const catalog = JSON.parse(readFileSync(catalogPath, "utf8")) as Record<string, unknown> & {
      locations: unknown[];
      routes: unknown[];
    };
    const locationShardSize = Math.ceil(catalog.locations.length / 4);
    const routeShardSize = Math.ceil(catalog.routes.length / 2);
    const locationShards = Array.from({ length: 4 }, (_, index) =>
      catalog.locations.slice(index * locationShardSize, (index + 1) * locationShardSize)
    );
    const routeShards = Array.from({ length: 2 }, (_, index) =>
      catalog.routes.slice(index * routeShardSize, (index + 1) * routeShardSize)
    );
    const { locations: _locations, routes: _routes, ...catalogCore } = catalog;
    return { catalogCore, locationShards, routeShards };
  }

  let shards = readCatalogShards();

  return {
    name: "catalog-shards",
    enforce: "pre",
    buildStart() {
      this.addWatchFile(catalogPath);
    },
    resolveId(source) {
      if (source.endsWith("data/catalog.json")) return `${virtualPrefix}main`;
      if (source.startsWith(virtualPrefix)) return source;
    },
    load(id) {
      if (!id.startsWith(virtualPrefix)) return;
      const shard = id.slice(virtualPrefix.length);
      if (shard === "main") {
        const locationImports = shards.locationShards.map((_, index) => `import locations${index} from "${virtualPrefix}locations-${index}";`).join("\n");
        const routeImports = shards.routeShards.map((_, index) => `import routes${index} from "${virtualPrefix}routes-${index}";`).join("\n");
        return `${locationImports}\n${routeImports}\nconst catalog = ${JSON.stringify(shards.catalogCore)};\ncatalog.locations = [${shards.locationShards.map((_, index) => `...locations${index}`).join(",")}];\ncatalog.routes = [${shards.routeShards.map((_, index) => `...routes${index}`).join(",")}];\nexport default catalog;`;
      }
      const locationMatch = /^locations-(\d+)$/.exec(shard);
      if (locationMatch) return `export default ${JSON.stringify(shards.locationShards[Number(locationMatch[1])])};`;
      const routeMatch = /^routes-(\d+)$/.exec(shard);
      if (routeMatch) return `export default ${JSON.stringify(shards.routeShards[Number(routeMatch[1])])};`;
    },
    handleHotUpdate({ file, server }) {
      if (file !== catalogPath) return;
      shards = readCatalogShards();
      for (const id of virtualIds) {
        const module = server.moduleGraph.getModuleById(id);
        if (module) server.moduleGraph.invalidateModule(module);
      }
      server.ws.send({ type: "full-reload", path: "*" });
      return [];
    }
  };
}

export default defineConfig(() => {
  const amap = readAmapCredentials();
  return {
    base: process.env.VITE_BASE_PATH || "/",
    plugins: [catalogShardPlugin(), react(), tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(moduleId: string) {
            if (moduleId.startsWith("\0catalog-shard:") && !moduleId.endsWith(":main")) {
              return moduleId.slice("\0catalog-shard:".length);
            }
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
