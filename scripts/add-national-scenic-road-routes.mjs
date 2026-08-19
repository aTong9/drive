import { readFile, writeFile } from "node:fs/promises";

const catalogUrl = new URL("../data/catalog.json", import.meta.url);
const regionsUrl = new URL("../data/regions.json", import.meta.url);
const catalog = JSON.parse(await readFile(catalogUrl, "utf8"));
const regions = JSON.parse(await readFile(regionsUrl, "utf8"));
const prefix = "cn-scenic-road-2026-";

const scenicWeight = {
  coast: 90,
  waterfall: 85,
  mountain: 80,
  forest: 75,
  stream: 70,
  lake: 65,
  river: 60,
  landmark: 30,
  "city-night": 20,
};
const routeType = (type) => type === "landmark" || type === "city-night" || type === "stream" ? "forest" : type;
const specialWaypoints = new Map([
  ["海南/三沙", ["exp20-hi-sansha-islet-01", "exp20-hi-sansha-islet-02"]],
]);
const locationById = new Map(catalog.locations.map((location) => [location.id, location]));

catalog.routes = catalog.routes.filter((route) => !route.id.startsWith(prefix));
const routes = [];
let sequence = 1;

for (const province of regions.provinces) {
  for (const division of province.divisions) {
    const key = `${province.name}/${division.name}`;
    const candidates = catalog.locations
      .filter((location) => location.province === province.name && location.city === division.name)
      .sort((a, b) => (scenicWeight[b.type] ?? 0) - (scenicWeight[a.type] ?? 0) || a.name.localeCompare(b.name, "zh-CN"));
    const waypointLocationIds = specialWaypoints.get(key) ?? candidates.slice(0, 2).map((location) => location.id);
    if (waypointLocationIds.length !== 2 || new Set(waypointLocationIds).size !== 2) throw new Error(`${key} 缺少两个不同的景观锚点`);
    const waypoints = waypointLocationIds.map((id) => locationById.get(id));
    if (waypoints.some((location) => !location)) throw new Error(`${key} 引用了未知地点`);
    const primaryType = routeType(waypoints[0].type);
    const islandWarning = key === "海南/三沙" ? "仅限永兴岛与石岛当日允许通行的岛内公共道路，不把其他岛礁作为驾车途经点；人员与车辆进入资格须另行确认。" : "两个地点是导航与景观方向锚点，不代表两点间存在同名旅游公路，也不要求驶入景区内部。";
    routes.push({
      id: `${prefix}${String(sequence).padStart(3, "0")}`,
      name: `${division.name}${waypoints[0].name.replace(division.name, "")}—${waypoints[1].name.replace(division.name, "")}风景驾驶走廊`,
      province: province.name,
      cities: [division.name],
      type: primaryType,
      captureStyle: "scenic-drive",
      modes: ["day", "sunset", "asmr"],
      estimatedDurationMinutes: 180,
      waypointLocationIds,
      best: {
        seasons: ["spring", "summer", "autumn", "winter"],
        times: ["morning", "golden-hour", "sunset"],
        weather: ["sunny", "cloudy", "after-rain"],
      },
      cameraPresetIds: ["gopro12-city-night-driving"],
      shootAdvice: `以${waypoints[0].name}和${waypoints[1].name}为${division.name}市域风景驾驶的两端锚点，优先选择沿途山地、森林、江湖、田园、海岸或开阔地貌较连续的现状国省道、高速公路及合法县乡道路。${islandWarning}出发前使用高德或当地可用导航按实时路况生成真实路线，核对道路等级、开放状态、收费、限行、施工、边境或保护区规定、补能点和服务区；规划路、封闭路、景区内部路、林道、牧道、机耕道及非机动车空间一律不进入。设备须在出发前固定、供电并自动录制，驾驶者全程不看屏、不操作、不为取景减速、变道、停车、掉头或折返。强降雨、山洪、滑坡、落石、降雪结冰、沙尘、强风、高原反应、低能见度、严重拥堵或疲劳时取消。`,
      scores: { visual: 5, road: 4, parking: 2, safety: 3, youtubePotential: 5 },
      status: "idea",
      verification: {
        status: "draft",
        note: `两端景观锚点来自项目现有来源记录；路线结构遵循国家公路网与交旅融合政策方向，但${division.name}具体选路尚未完成首次实驾，必须在出发当日核验导航结果、道路开放、交通管制、天气和保护区边界。`,
      },
    });
    sequence += 1;
  }
}

catalog.routes.push(...routes);
await writeFile(catalogUrl, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Added ${routes.length} national city scenic-driving corridors across ${regions.provinces.length} province-level divisions.`);
