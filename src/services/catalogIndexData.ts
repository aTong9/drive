// Vite replaces this Node-compatible module with the summary index and dynamic detail imports.
// CLI and service tests keep using the real catalog through this same boundary.
import catalogJson from "../../data/catalog.json" with { type: "json" };
import type { Catalog } from "../types/domain.js";
import { buildCatalogIndex, buildCatalogSearchIndex, splitCatalogByProvince } from "./catalogSummary.js";

const catalog = catalogJson as Catalog;
const locationParts = splitCatalogByProvince(catalog.locations);
const routeParts = splitCatalogByProvince(catalog.routes);
export const catalogIndex = buildCatalogIndex(catalog);
export const locationShardById = locationParts.shardById;
export const routeShardById = routeParts.shardById;
export async function loadLocationShard(index: number) { return locationParts.shards[index] ?? []; }
export async function loadRouteShard(index: number) { return routeParts.shards[index] ?? []; }
export async function loadSearchIndex() { return buildCatalogSearchIndex(catalog); }
