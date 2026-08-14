import { readFile, writeFile } from "node:fs/promises";

const catalogUrl = new URL("../data/catalog.json", import.meta.url);
const catalog = JSON.parse(await readFile(catalogUrl, "utf8"));
const locationById = new Map(catalog.locations.map((item) => [item.id, item]));

const cityPools = [
  {
    city: "惠州", code: "hz",
    ids: [
      "gd-hz-drive-huizhou-avenue-jiangbei", "gd-hz-drive-dongjiang-bridge", "gd-hz-drive-huizhou-avenue-shuikou",
      "gd-hz-drive-yanda-henan-bank", "gd-hz-drive-jinshan-avenue", "gd-hz-drive-dayabay-aotou",
      "gd-hz-drive-dayabay-central", "gd-hz-drive-dayabay-xiachong", "gd-hz-west-lake", "gd-hz-honghua-lake",
      "gd-hz-xunliao-bay", "gd-hz-double-moon-resort", "gd-hz-double-moon-viewpoint", "gd-hz-luofu-mountain", "gd-hz-nankun-forest",
    ],
  },
  {
    city: "深圳", code: "sz",
    ids: catalog.locations
      .filter((item) => item.province === "广东" && item.city === "深圳" && /驾车锚点|道路锚点|收费站段/.test(item.name))
      .map((item) => item.id),
  },
  {
    city: "广州", code: "gz",
    ids: [
      "gd-gz-baiyun-mountain", "gd-gz-haixinsha", "gd-gz-haizhu-lake", "gd-gz-ersha-art-park", "gd-gz-yuexiu-park",
      "gd-gz-liuhua-lake-park", "gd-gz-nansha-wetland", "gd-gz-dafushan-forest-park", "gd-gz-liwan-lake", "gd-gz-shamian-island",
      "gd-gz-liuxihe-forest-park", "gd-gz-shimen-forest-park", "gd-gz-canton-tower", "gd-gz-huacheng-square",
      "gd-gz-south-china-botanical-garden", "gd-gz-maofeng-mountain", "gd-gz-baiyun-lake-park", "gd-gz-luhu-park",
      "gd-gz-baomo-garden", "gd-gz-lotus-mountain", "gd-gz-nansha-tin-hau-palace", "gd-gz-huangpu-ancient-port",
      "gd-gz-chen-clan-academy", "gd-gz-yongqingfang", "gd-gz-beijing-road", "gd-gz-baietan-art-center", "gd-gz-seagull-island",
    ],
  },
];

const cleanName = (name) => name
  .replace(/^广州|^惠州|^深圳/u, "")
  .replace(/风景名胜区|国家森林公园|森林公园|湿地公园|旅游区|文化旅游区|亚运公园|艺术公园|公园|景区|度假村|观景台|驾车锚点|道路锚点/u, "")
  .replace(/路段|城市段|中心段/u, "");
const signature = (ids) => ids.join(">");
const existingSignatures = new Set(catalog.routes.map((route) => signature(route.waypointLocationIds)));

for (const { city, code, ids } of cityPools) {
  const prefix = `gd-${code}-drive-extra50-`;
  if (catalog.routes.some((item) => item.id.startsWith(prefix))) throw new Error(`${city}新增50条纯驾车路线已存在`);
  for (const id of ids) {
    const location = locationById.get(id);
    if (!location || location.province !== "广东" || location.city !== city) throw new Error(`${city}无效锚点：${id}`);
  }

  const candidates = [];
  for (let offset = 1; offset < ids.length && candidates.length < 50; offset += 1) {
    for (let start = 0; start < ids.length && candidates.length < 50; start += 1) {
      const waypoints = [ids[start], ids[(start + offset) % ids.length]];
      if (waypoints[0] === waypoints[1] || existingSignatures.has(signature(waypoints))) continue;
      candidates.push(waypoints);
      existingSignatures.add(signature(waypoints));
    }
  }
  if (candidates.length !== 50) throw new Error(`${city}仅生成 ${candidates.length} 条唯一路线`);

  catalog.routes.push(...candidates.map((waypointLocationIds, index) => {
    const from = locationById.get(waypointLocationIds[0]);
    const to = locationById.get(waypointLocationIds[1]);
    const coastal = /湾|海|港|岛|滨/.test(`${from.name}${to.name}`);
    return {
      id: `${prefix}${String(index + 1).padStart(2, "0")}`,
      name: `${city}${cleanName(from.name)}—${cleanName(to.name)}纯驾车路线第${String(index + 1).padStart(2, "0")}线`,
      province: "广东", cities: [city], type: coastal ? "coast" : "city-night", captureStyle: "scenic-drive",
      modes: ["day", "sunset", "asmr"], estimatedDurationMinutes: coastal ? 150 : 120,
      waypointLocationIds,
      best: { seasons: ["spring", "autumn", "winter"], times: ["golden-hour", "sunset", "blue-hour", "night"], weather: ["sunny", "cloudy", "after-rain"] },
      cameraPresetIds: ["gopro12-city-night-driving"],
      shootAdvice: `本路线全程仅作合法公共道路上的连续驾车拍摄，不停车、不下车补拍。两端只作为${city}道路附近的导航锚点，不代表可驶入景区、广场、公园、步道、社区、园区、港区、停车场或内部道路；必须由 AMap.Driving 按出发时的主辅路、匝道、限行、收费、施工和交通管制生成实际连接。设备须在出发前固定、供电并自动录制，驾驶者不看屏、不操作、不为画面减速、变道、靠边、掉头或绕行。拥堵、疲劳、暴雨、积水、低能见度或导航无法生成合法路线时取消。`,
      scores: { visual: coastal ? 5 : 4, road: 3, parking: 1, safety: 4, youtubePotential: 4 }, status: "idea",
      verification: { status: "source-checked", note: "两端锚点已有来源核验；路线道路、方向、距离、时长、限行、收费、开放状态与临时管制仍须由高德驾车规划和出发当日现场信息确认。" },
    };
  }));
}

await writeFile(catalogUrl, `${JSON.stringify(catalog, null, 2)}\n`);
console.log("Added 50 drive-only routes each for Huizhou, Shenzhen and Guangzhou (150 total).");
