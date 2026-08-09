import { readFile } from "node:fs/promises";
import Ajv2020 from "ajv/dist/2020.js";

const schema = JSON.parse(await readFile(new URL("../schemas/roadlens-catalog.schema.json", import.meta.url), "utf8"));
const catalog = JSON.parse(await readFile(new URL("../data/catalog.json", import.meta.url), "utf8"));
const validate = new Ajv2020({ allErrors: true, strict: true }).compile(schema);
const errors = [];

if (!validate(catalog)) {
  errors.push(...(validate.errors ?? []).map((error) => `${error.instancePath || "/"} ${error.message}`));
}

function assertUnique(items, label) {
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item.id)) errors.push(`${label}: duplicate id ${item.id}`);
    seen.add(item.id);
  }
  return seen;
}

const locationIds = assertUnique(catalog.locations, "locations");
const presetIds = assertUnique(catalog.cameraPresets, "cameraPresets");
const routeIds = assertUnique(catalog.routes, "routes");
assertUnique(catalog.shootPlans, "shootPlans");

for (const location of catalog.locations) {
  const coordinateEvidence = location.verification.sources.some((source) => source.supports.includes("coordinate"));
  if (!coordinateEvidence) errors.push(`${location.id}: coordinate has no supporting source`);
}

for (const preset of catalog.cameraPresets) {
  if (preset.settings.iso.min > preset.settings.iso.max) errors.push(`${preset.id}: ISO min exceeds max`);
}

for (const route of catalog.routes) {
  for (const id of route.waypointLocationIds) {
    if (!locationIds.has(id)) errors.push(`${route.id}: unknown waypoint ${id}`);
  }
  for (const id of route.cameraPresetIds) {
    if (!presetIds.has(id)) errors.push(`${route.id}: unknown camera preset ${id}`);
  }
}

for (const plan of catalog.shootPlans) {
  if (!routeIds.has(plan.routeId)) errors.push(`${plan.id}: unknown route ${plan.routeId}`);
  for (const id of plan.equipmentPresetIds) {
    if (!presetIds.has(id)) errors.push(`${plan.id}: unknown equipment preset ${id}`);
  }
}

if (errors.length > 0) {
  console.error(`Data validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Catalog v${catalog.schemaVersion} valid: ${catalog.locations.length} locations, ${catalog.routes.length} routes, ${catalog.cameraPresets.length} presets, ${catalog.shootPlans.length} plan.`);
