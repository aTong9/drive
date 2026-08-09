import { readFile } from "node:fs/promises";
import Ajv2020 from "ajv/dist/2020.js";

const schema = JSON.parse(await readFile(new URL("../schemas/roadlens-catalog.schema.json", import.meta.url), "utf8"));
const catalog = JSON.parse(await readFile(new URL("../data/catalog.json", import.meta.url), "utf8"));
const davinciSchema = JSON.parse(await readFile(new URL("../schemas/davinci-workflow.schema.json", import.meta.url), "utf8"));
const davinciWorkflow = JSON.parse(await readFile(new URL("../data/davinci-workflow.json", import.meta.url), "utf8"));
const fieldCheckExportSchema = JSON.parse(await readFile(new URL("../schemas/field-check-export.schema.json", import.meta.url), "utf8"));
const regionsSchema = JSON.parse(await readFile(new URL("../schemas/regions.schema.json", import.meta.url), "utf8"));
const regions = JSON.parse(await readFile(new URL("../data/regions.json", import.meta.url), "utf8"));
const youtubeCreatorsSchema = JSON.parse(await readFile(new URL("../schemas/youtube-creators.schema.json", import.meta.url), "utf8"));
const youtubeCreators = JSON.parse(await readFile(new URL("../data/youtube-creators.json", import.meta.url), "utf8"));
const validate = new Ajv2020({ allErrors: true, strict: true }).compile(schema);
const errors = [];
const validateDavinci = new Ajv2020({ allErrors: true, strict: true }).compile(davinciSchema);
const validateRegions = new Ajv2020({ allErrors: true, strict: true, formats: { uri: true, date: true } }).compile(regionsSchema);
const validateYoutubeCreators = new Ajv2020({ allErrors: true, strict: true, formats: { uri: true, date: true } }).compile(youtubeCreatorsSchema);
new Ajv2020({ allErrors: true, strict: true, formats: { "date-time": true } }).compile(fieldCheckExportSchema);

if (!validate(catalog)) {
  errors.push(...(validate.errors ?? []).map((error) => `${error.instancePath || "/"} ${error.message}`));
}
if (!validateDavinci(davinciWorkflow)) {
  errors.push(...(validateDavinci.errors ?? []).map((error) => `davinci${error.instancePath || "/"} ${error.message}`));
}
if (!validateRegions(regions)) {
  errors.push(...(validateRegions.errors ?? []).map((error) => `regions${error.instancePath || "/"} ${error.message}`));
}
if (!validateYoutubeCreators(youtubeCreators)) {
  errors.push(...(validateYoutubeCreators.errors ?? []).map((error) => `youtubeCreators${error.instancePath || "/"} ${error.message}`));
}
if (new Set(davinciWorkflow.stages.map((stage) => stage.id)).size !== davinciWorkflow.stages.length) errors.push("davinci: duplicate stage id");
if (new Set(youtubeCreators.creators.map((creator) => creator.id)).size !== youtubeCreators.creators.length) errors.push("youtubeCreators: duplicate creator id");

const provinceNames = new Set(regions.provinces.map((province) => province.name));
if (provinceNames.size !== regions.provinces.length) errors.push("regions: duplicate province name");
const expectedProvinceNames = ["北京", "天津", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江", "上海", "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南", "广东", "广西", "海南", "重庆", "四川", "贵州", "云南", "西藏", "陕西", "甘肃", "青海", "宁夏", "新疆", "台湾", "香港", "澳门"];
const missingProvinces = expectedProvinceNames.filter((name) => !provinceNames.has(name));
const unexpectedProvinces = [...provinceNames].filter((name) => !expectedProvinceNames.includes(name));
if (missingProvinces.length) errors.push(`regions: missing province-level units ${missingProvinces.join(", ")}`);
if (unexpectedProvinces.length) errors.push(`regions: unexpected province-level units ${unexpectedProvinces.join(", ")}`);
for (const province of regions.provinces) {
  const divisionNames = new Set(province.divisions.map((division) => division.name));
  if (divisionNames.size !== province.divisions.length) errors.push(`regions: ${province.name} has duplicate division name`);
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
  const province = regions.provinces.find((item) => item.name === location.province);
  if (!province) errors.push(`${location.id}: unknown province ${location.province}`);
  else if (!province.divisions.some((division) => division.name === location.city)) errors.push(`${location.id}: unknown division ${location.province}/${location.city}`);
  const expectedCrs = ["台湾", "香港", "澳门"].includes(location.province) ? "WGS84" : "GCJ-02";
  if (location.coordinate.crs !== expectedCrs) errors.push(`${location.id}: ${location.province} coordinate must use ${expectedCrs}`);
  const coordinateEvidence = location.verification.sources.some((source) => source.supports.includes("coordinate"));
  if (!coordinateEvidence) errors.push(`${location.id}: coordinate has no supporting source`);
}

const coveredProvinceNames = new Set(catalog.locations.map((location) => location.province));
const provincesWithoutLocations = expectedProvinceNames.filter((name) => !coveredProvinceNames.has(name));
if (provincesWithoutLocations.length) errors.push(`locations: province-level units without a source-checked location: ${provincesWithoutLocations.join(", ")}`);

for (const preset of catalog.cameraPresets) {
  if (preset.settings.iso.min > preset.settings.iso.max) errors.push(`${preset.id}: ISO min exceeds max`);
}

for (const route of catalog.routes) {
  const province = regions.provinces.find((item) => item.name === route.province);
  if (!province) errors.push(`${route.id}: unknown province ${route.province}`);
  else for (const city of route.cities) {
    if (!province.divisions.some((division) => division.name === city)) errors.push(`${route.id}: unknown division ${route.province}/${city}`);
  }
  for (const id of route.waypointLocationIds) {
    if (!locationIds.has(id)) errors.push(`${route.id}: unknown waypoint ${id}`);
    const waypoint = catalog.locations.find((location) => location.id === id);
    if (waypoint && waypoint.province !== route.province) errors.push(`${route.id}: waypoint ${id} belongs to ${waypoint.province}, not ${route.province}`);
    if (waypoint && !route.cities.includes(waypoint.city)) errors.push(`${route.id}: waypoint ${id} city ${waypoint.city} missing from route cities`);
  }
  for (const id of route.cameraPresetIds) {
    if (!presetIds.has(id)) errors.push(`${route.id}: unknown camera preset ${id}`);
  }
}

const routeCoveredProvinceNames = new Set(catalog.routes.map((route) => route.province));
const provincesWithoutRoutes = expectedProvinceNames.filter((name) => !routeCoveredProvinceNames.has(name));
if (provincesWithoutRoutes.length) errors.push(`routes: province-level units without an explorable route: ${provincesWithoutRoutes.join(", ")}`);

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

const divisionCount = regions.provinces.reduce((total, province) => total + province.divisions.length, 0);
const routeProvinceCount = new Set(catalog.routes.map((route) => route.province)).size;
const routeCityCount = new Set(catalog.routes.flatMap((route) => route.cities.map((city) => `${route.province}/${city}`))).size;
const locationCityCount = new Set(catalog.locations.map((location) => `${location.province}/${location.city}`)).size;
console.log(`Catalog v${catalog.schemaVersion} valid: ${catalog.locations.length} locations across ${locationCityCount} divisions, ${catalog.routes.length} routes across ${routeProvinceCount} provinces and ${routeCityCount} divisions, ${catalog.cameraPresets.length} presets, ${catalog.shootPlans.length} plan; administrative directory ${regions.provinces.length} provinces and ${divisionCount} divisions; DaVinci workflow ${davinciWorkflow.stages.length} stages; YouTube research ${youtubeCreators.creators.length} creators.`);
