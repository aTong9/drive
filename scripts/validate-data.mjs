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
const youtubeMusicSchema = JSON.parse(await readFile(new URL("../schemas/youtube-music-library.schema.json", import.meta.url), "utf8"));
const youtubeMusic = JSON.parse(await readFile(new URL("../data/youtube-music-library.json", import.meta.url), "utf8"));
const validate = new Ajv2020({ allErrors: true, strict: true }).compile(schema);
const errors = [];
const validateDavinci = new Ajv2020({ allErrors: true, strict: true }).compile(davinciSchema);
const validateRegions = new Ajv2020({ allErrors: true, strict: true, formats: { uri: true, date: true } }).compile(regionsSchema);
const validateYoutubeCreators = new Ajv2020({ allErrors: true, strict: true, formats: { uri: true, date: true } }).compile(youtubeCreatorsSchema);
const validateYoutubeMusic = new Ajv2020({ allErrors: true, strict: true, formats: { uri: true, date: true } }).compile(youtubeMusicSchema);
new Ajv2020({ allErrors: true, strict: true, formats: { "date-time": true } }).compile(fieldCheckExportSchema);

if (!validate(catalog)) {
  errors.push(...(validate.errors ?? []).map((error) => `${error.instancePath || "/"} ${error.message}`));
}
if (!validateDavinci(davinciWorkflow)) {
  errors.push(...(validateDavinci.errors ?? []).map((error) => `davinci${error.instancePath || "/"} ${error.message}`));
}
if (new Set(davinciWorkflow.gradePresets.map((preset) => preset.id)).size !== davinciWorkflow.gradePresets.length) errors.push("davinci: duplicate grade preset id");
if (new Set(davinciWorkflow.beginnerTutorial.map((tutorial) => tutorial.id)).size !== davinciWorkflow.beginnerTutorial.length) errors.push("davinci: duplicate tutorial id");
for (const presetId of ["daylight-natural", "sunset-warm", "night-hdr-base", "blue-hour-clean", "cinematic-road"]) {
  if (!davinciWorkflow.gradePresets.some((preset) => preset.id === presetId)) errors.push(`davinci: missing default grade preset ${presetId}`);
}
if (!validateRegions(regions)) {
  errors.push(...(validateRegions.errors ?? []).map((error) => `regions${error.instancePath || "/"} ${error.message}`));
}
if (!validateYoutubeCreators(youtubeCreators)) {
  errors.push(...(validateYoutubeCreators.errors ?? []).map((error) => `youtubeCreators${error.instancePath || "/"} ${error.message}`));
}
if (!validateYoutubeMusic(youtubeMusic)) {
  errors.push(...(validateYoutubeMusic.errors ?? []).map((error) => `youtubeMusic${error.instancePath || "/"} ${error.message}`));
}
if (new Set(davinciWorkflow.stages.map((stage) => stage.id)).size !== davinciWorkflow.stages.length) errors.push("davinci: duplicate stage id");
if (new Set(youtubeCreators.creators.map((creator) => creator.id)).size !== youtubeCreators.creators.length) errors.push("youtubeCreators: duplicate creator id");
const musicCategoryIds = new Set(youtubeMusic.categories.map((category) => category.id));
if (musicCategoryIds.size !== youtubeMusic.categories.length) errors.push("youtubeMusic: duplicate category id");
if (new Set(youtubeMusic.platforms.map((platform) => platform.id)).size !== youtubeMusic.platforms.length) errors.push("youtubeMusic: duplicate platform id");
for (const platform of youtubeMusic.platforms) {
  for (const id of platform.supportedCategoryIds) if (!musicCategoryIds.has(id)) errors.push(`youtubeMusic: ${platform.id} references unknown category ${id}`);
  const supportsYoutube = platform.evidence.some((source) => source.supports.includes("youtube-use"));
  const supportsContentId = platform.evidence.some((source) => source.supports.includes("content-id"));
  if (!supportsYoutube) errors.push(`youtubeMusic: ${platform.id} has no official YouTube-use evidence`);
  if (platform.license.contentId !== "track-dependent" && !supportsContentId) errors.push(`youtubeMusic: ${platform.id} has no Content ID evidence`);
}
const musicPlatformIds = new Set(youtubeMusic.platforms.map((platform) => platform.id));
if (new Set(youtubeMusic.albums.map((album) => album.id)).size !== youtubeMusic.albums.length) errors.push("youtubeMusic: duplicate album id");
for (const album of youtubeMusic.albums) {
  if (!musicPlatformIds.has(album.platformId)) errors.push(`youtubeMusic: ${album.id} references unknown platform ${album.platformId}`);
  for (const id of album.categoryIds) if (!musicCategoryIds.has(id)) errors.push(`youtubeMusic: ${album.id} references unknown category ${id}`);
}
for (const family of ["piano", "lofi", "jazz"]) if (!youtubeMusic.categories.some((category) => category.family === family)) errors.push(`youtubeMusic: missing ${family} category`);
for (const scene of ["countryside", "rain", "sunrise", "city-night", "road-driving", "blue-hour", "urban"]) if (!youtubeMusic.categories.some((category) => category.scenes.includes(scene))) errors.push(`youtubeMusic: missing scene ${scene}`);

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

const coveredProvinceNames = new Set(catalog.locations.filter((location) => location.verification.status !== "draft").map((location) => location.province));
const provincesWithoutLocations = expectedProvinceNames.filter((name) => !coveredProvinceNames.has(name));
if (provincesWithoutLocations.length) errors.push(`locations: province-level units without a source-checked location: ${provincesWithoutLocations.join(", ")}`);

for (const preset of catalog.cameraPresets) {
  const cameraScenes = new Set(["coast-sunset", "city-night-driving", "city-night-tripod", "forest-stream-static", "daylight-walk", "rain-walk", "blue-hour-walk"]);
  if (!cameraScenes.has(preset.scene)) errors.push(`${preset.id}: unknown camera scene ${preset.scene}`);
  if (!preset.settings) continue;
  if (preset.settings.iso && preset.settings.iso.min > preset.settings.iso.max) errors.push(`${preset.id}: ISO min exceeds max`);
  if (!preset.settings.resolution || !Number.isFinite(preset.settings.fps) || preset.settings.fps <= 0) errors.push(`${preset.id}: invalid resolution or fps`);
  if (!preset.settings.shutter || !Number.isFinite(preset.settings.whiteBalanceKelvin)) errors.push(`${preset.id}: missing shutter or white balance`);
  for (const control of ["sharpness", "noiseReduction"]) {
    if (preset.settings[control] !== undefined && (!Number.isInteger(preset.settings[control]) || preset.settings[control] < -2 || preset.settings[control] > 2)) errors.push(`${preset.id}: ${control} must be an integer from -2 to 2`);
  }
  if (preset.setup && preset.setup.length < 3) errors.push(`${preset.id}: setup must contain at least 3 steps`);
  if (preset.fieldChecks && preset.fieldChecks.length < 3) errors.push(`${preset.id}: fieldChecks must contain at least 3 checks`);
  if (preset.sourceUrl && !preset.sourceUrl.startsWith("https://")) errors.push(`${preset.id}: sourceUrl must use HTTPS`);
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
  if (route.executionMode === "drive-only") {
    if (route.captureStyle !== "scenic-drive") errors.push(`${route.id}: drive-only route must use scenic-drive capture style`);
    const waypoints = route.waypointLocationIds.map((id) => catalog.locations.find((location) => location.id === id)).filter(Boolean);
    if (waypoints.some((waypoint) => waypoint.access.mode !== "drive")) errors.push(`${route.id}: drive-only route contains a non-driving waypoint`);
    if (waypoints.some((waypoint) => waypoint.shooting.modes.length !== 1 || waypoint.shooting.modes[0] !== "driving-video")) errors.push(`${route.id}: drive-only waypoint must allow driving-video only`);
    if (!route.shootAdvice.includes("不停车") || !route.shootAdvice.includes("不下车")) errors.push(`${route.id}: drive-only advice must explicitly prohibit parking and leaving the vehicle`);
  }
}

const routeCoveredProvinceNames = new Set(catalog.routes.filter((route) => route.verification.status !== "draft").map((route) => route.province));
const provincesWithoutRoutes = expectedProvinceNames.filter((name) => !routeCoveredProvinceNames.has(name));
if (provincesWithoutRoutes.length) errors.push(`routes: province-level units without an explorable route: ${provincesWithoutRoutes.join(", ")}`);

for (const plan of catalog.shootPlans) {
  if (!routeIds.has(plan.routeId)) errors.push(`${plan.id}: unknown route ${plan.routeId}`);
  for (const id of plan.equipmentPresetIds) {
    if (!presetIds.has(id)) errors.push(`${plan.id}: unknown equipment preset ${id}`);
  }
}

const divisionCount = regions.provinces.reduce((total, province) => total + province.divisions.length, 0);
const routeProvinceCount = new Set(catalog.routes.map((route) => route.province)).size;
const routeCityKeys = new Set(catalog.routes.flatMap((route) => route.cities.map((city) => `${route.province}/${city}`)));
const locationCityKeys = new Set(catalog.locations.map((location) => `${location.province}/${location.city}`));
const routeCityCount = routeCityKeys.size;
const locationCityCount = locationCityKeys.size;
const minimumCoveredDivisionCount = 391;
if (locationCityCount < minimumCoveredDivisionCount) errors.push(`locations: division coverage regressed below ${minimumCoveredDivisionCount}`);
if (routeCityCount < minimumCoveredDivisionCount) errors.push(`routes: division coverage regressed below ${minimumCoveredDivisionCount}`);
for (const key of locationCityKeys) if (!routeCityKeys.has(key)) errors.push(`coverage: ${key} has locations but no route`);
for (const key of routeCityKeys) if (!locationCityKeys.has(key)) errors.push(`coverage: ${key} has routes but no location`);

if (errors.length > 0) {
  console.error(`Data validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Catalog v${catalog.schemaVersion} valid: ${catalog.locations.length} locations across ${locationCityCount} divisions, ${catalog.routes.length} routes across ${routeProvinceCount} provinces and ${routeCityCount} divisions, ${catalog.cameraPresets.length} presets, ${catalog.shootPlans.length} plan; administrative directory ${regions.provinces.length} provinces and ${divisionCount} divisions; DaVinci workflow ${davinciWorkflow.stages.length} stages; YouTube research ${youtubeCreators.creators.length} creators; music library ${youtubeMusic.platforms.length} platforms and ${youtubeMusic.categories.length} directions.`);
