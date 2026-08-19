import { readFile, writeFile } from "node:fs/promises";

const catalogUrl = new URL("../data/catalog.json", import.meta.url);
const catalog = JSON.parse(await readFile(catalogUrl, "utf8"));
const prefix = "cn-tier-city-scenic-2026-";

const tiers = {
  first: [["上海", "上海"], ["北京", "北京"], ["广东", "深圳"], ["广东", "广州"]],
  newFirst: [
    ["四川", "成都"], ["浙江", "杭州"], ["重庆", "重庆"], ["湖北", "武汉"], ["江苏", "苏州"],
    ["陕西", "西安"], ["江苏", "南京"], ["湖南", "长沙"], ["河南", "郑州"], ["天津", "天津"],
    ["安徽", "合肥"], ["山东", "青岛"], ["广东", "东莞"], ["浙江", "宁波"], ["广东", "佛山"],
  ],
  second: [
    ["山东", "济南"], ["江苏", "无锡"], ["辽宁", "沈阳"], ["云南", "昆明"], ["福建", "福州"],
    ["福建", "厦门"], ["浙江", "温州"], ["河北", "石家庄"], ["辽宁", "大连"], ["黑龙江", "哈尔滨"],
    ["浙江", "金华"], ["福建", "泉州"], ["广西", "南宁"], ["吉林", "长春"], ["江苏", "常州"],
    ["江西", "南昌"], ["江苏", "南通"], ["贵州", "贵阳"], ["浙江", "嘉兴"], ["江苏", "徐州"],
    ["广东", "惠州"], ["山西", "太原"], ["山东", "烟台"], ["山东", "临沂"], ["河北", "保定"],
    ["浙江", "台州"], ["浙江", "绍兴"], ["广东", "珠海"], ["河南", "洛阳"], ["山东", "潍坊"],
  ],
};
const cities = Object.entries(tiers).flatMap(([tier, entries]) => entries.map(([province, city]) => ({ tier, province, city })));
const scenicWeight = { coast: 90, waterfall: 85, mountain: 80, forest: 75, stream: 70, lake: 65, river: 60, landmark: 30, "city-night": 20 };
const pairs = [[0, 2], [1, 3], [2, 4], [3, 5]];
const locationById = new Map(catalog.locations.map((location) => [location.id, location]));
const existingNationalPairs = new Set(catalog.routes
  .filter((route) => route.id.startsWith("cn-scenic-road-2026-"))
  .map((route) => [...route.waypointLocationIds].sort().join("|")));

catalog.routes = catalog.routes.filter((route) => !route.id.startsWith(prefix));
const routes = [];
for (const [cityIndex, entry] of cities.entries()) {
  const candidates = catalog.locations
    .filter((location) => location.province === entry.province && location.city === entry.city)
    .sort((a, b) => (scenicWeight[b.type] ?? 0) - (scenicWeight[a.type] ?? 0) || a.name.localeCompare(b.name, "zh-CN"));
  if (candidates.length < 6) throw new Error(`${entry.province}/${entry.city} 少于六个景观候选点`);
  for (const [routeIndex, [left, right]] of pairs.entries()) {
    const waypoints = [candidates[left], candidates[right]];
    const pairKey = waypoints.map((location) => location.id).sort().join("|");
    if (existingNationalPairs.has(pairKey)) throw new Error(`${entry.city} 路线与全国保底路线重复`);
    const type = ["landmark", "city-night", "stream"].includes(waypoints[0].type) ? "forest" : waypoints[0].type;
    routes.push({
      id: `${prefix}${String(cityIndex + 1).padStart(2, "0")}-${routeIndex + 1}`,
      name: `${entry.city}${waypoints[0].name.replace(entry.city, "")}—${waypoints[1].name.replace(entry.city, "")}风景驾驶路线`,
      province: entry.province,
      cities: [entry.city],
      type,
      captureStyle: "scenic-drive",
      modes: ["day", "sunset", "asmr"],
      estimatedDurationMinutes: 180,
      waypointLocationIds: waypoints.map((location) => location.id),
      best: { seasons: ["spring", "summer", "autumn", "winter"], times: ["morning", "golden-hour", "sunset"], weather: ["sunny", "cloudy", "after-rain"] },
      cameraPresetIds: ["gopro12-city-night-driving"],
      shootAdvice: `这是面向${entry.city}的重点城市风景驾驶补充路线，以${waypoints[0].name}和${waypoints[1].name}作为景观方向锚点，优先选择沿途自然景观连续的现状国省道、高速公路、环湖路、滨海路或合法县乡道路。锚点不代表必须驶入景区，也不证明两点之间存在同名旅游公路。出发前使用高德或当地可用导航生成实际路线，并核对开放状态、收费、限行、施工、服务区、补能点、天气和保护区边界；规划路、封闭路、景区内部路、林道、牧道及非机动车空间一律不进入。设备出发前固定、供电并自动录制，驾驶者不看屏、不操作、不为取景减速、变道、停车、掉头或折返；强降雨、山洪、滑坡、落石、降雪结冰、强风、沙尘、低能见度、严重拥堵或疲劳时取消。`,
      scores: { visual: 5, road: 4, parking: 2, safety: 3, youtubePotential: 5 },
      status: "idea",
      verification: { status: "draft", note: `城市层级采用第一财经·新一线城市研究所2025年城市商业魅力排行榜；两端地点来自项目现有来源记录，但具体公路走向尚未首次实驾，须在出发当日核验导航、道路开放、管制、天气与现场安全。` },
    });
  }
}

if (new Set(routes.map((route) => route.name)).size !== routes.length) throw new Error("重点城市风景路线名称重复");
catalog.routes.push(...routes);
await writeFile(catalogUrl, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Added ${routes.length} scenic-driving routes across ${cities.length} first-, new-first-, and second-tier cities.`);
