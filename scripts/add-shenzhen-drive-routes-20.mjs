import { readFile, writeFile } from "node:fs/promises";

const catalogUrl = new URL("../data/catalog.json", import.meta.url);
const catalog = JSON.parse(await readFile(catalogUrl, "utf8"));
const definitions = [
  ["深南大道—宝安大道西行城市轴线", ["gd-sz-drive-shennan-diwang", "gd-sz-drive-shennan-window", "gd-sz-drive-shennan-nantou", "gd-sz-drive-baoan-xixiang"], 150, "city-night"],
  ["宝安中心—前海—月亮湾港城夜驾", ["gd-sz-drive-baoan-center", "gd-sz-drive-baoan-happy-harbor", "gd-sz-drive-baoan-qianhai", "gd-sz-drive-yueliangwan-mawan"], 90, "coast"],
  ["蛇口望海路—深圳湾—后海滨海夜驾", ["gd-sz-drive-wanghai-seaworld", "gd-sz-drive-wanghai-sunrise", "gd-sz-drive-binhai-bay-park", "gd-sz-drive-binhai-sports"], 105, "coast"],
  ["前海—南头—科技园—深圳湾口岸环线", ["gd-sz-drive-yueliangwan-central", "gd-sz-drive-yueliangwan-nantou", "gd-sz-drive-beihuan-keyuan", "gd-sz-drive-shahe-port"], 105, "city-night"],
  ["科技园—北环—香蜜湖—福田中轴横穿", ["gd-sz-drive-beihuan-keyuan", "gd-sz-drive-beihuan-xiangmi", "gd-sz-drive-xiangmi-shennan", "gd-sz-drive-caitian-gangxia"], 105, "city-night"],
  ["福田南北双轴新洲路—北环—彩田路", ["gd-sz-drive-xinzhou-fuqiang", "gd-sz-drive-xinzhou-beihuan", "gd-sz-drive-beihuan-xiangmi", "gd-sz-drive-caitian-cai-mei"], 105, "city-night"],
  ["岗厦—黄木岗—银湖—坂田城市通道", ["gd-sz-drive-caitian-gangxia", "gd-sz-drive-banyin-huangmugang", "gd-sz-drive-beihuan-yinhu", "gd-sz-drive-banyin-yabao"], 90, "city-night"],
  ["地王—黄贝岭—罗沙路东行夜驾", ["gd-sz-drive-shennan-diwang", "gd-sz-drive-yanhe-huangbeiling", "gd-sz-drive-yanhe-luosha"], 75, "city-night"],
  ["梅林关—坂田—五和—龙华夜驾", ["gd-sz-drive-meiguan-meilin", "gd-sz-drive-banyin-yabao", "gd-sz-drive-wuhe-hub", "gd-sz-drive-bulong-longsheng"], 105, "city-night"],
  ["深圳北站—红山—龙胜—大浪城市轴线", ["gd-sz-drive-xinqu-north-station", "gd-sz-drive-xinqu-hongshan", "gd-sz-drive-bulong-longsheng", "gd-sz-drive-fulong-dalang"], 90, "city-night"],
  ["观澜—清湖—和平路—深圳北站南行路线", ["gd-sz-drive-meiguan-guanlan", "gd-sz-drive-meiguan-qinghu", "gd-sz-drive-xinqu-heping", "gd-sz-drive-xinqu-north-station"], 105, "city-night"],
  ["光明科学城—观光路—观澜产业夜驾", ["gd-sz-drive-guangming-science", "gd-sz-drive-guangming-lab", "gd-sz-drive-guanguang-dafu", "gd-sz-drive-guanguang-golf"], 120, "city-night"],
  ["光明城—洲石路—鹤洲机场门户路线", ["gd-sz-drive-guangming-station", "gd-sz-drive-zhoushi-luozu", "gd-sz-drive-zhoushi-liaokeng", "gd-sz-drive-zhoushi-hezhou"], 120, "city-night"],
  ["后瑞—鹤洲—前海西部门户环线", ["gd-sz-drive-baoan-hourui", "gd-sz-drive-zhoushi-hezhou", "gd-sz-drive-s3-qianhai", "gd-sz-drive-baoan-qianhai"], 105, "city-night"],
  ["国展中心—沿江高速—前海湾长线", ["gd-sz-drive-s3-shenzhen-world", "gd-sz-drive-s3-qianhai", "gd-sz-drive-yueliangwan-mawan"], 120, "coast"],
  ["平湖—丹平快速—沙湾—罗湖东部路线", ["gd-sz-drive-danping-pinghu", "gd-sz-drive-danping-huanancheng", "gd-sz-drive-danping-shawan", "gd-sz-drive-yanhe-luosha"], 120, "city-night"],
  ["坂田—南坪快速—坪山站跨区路线", ["gd-sz-drive-wuhe-huawei", "gd-sz-drive-nanping-bantian", "gd-sz-drive-pingshan-station"], 135, "city-night"],
  ["大运—龙城北—坪地—坪山城市长线", ["gd-sz-drive-longxiang-dayun", "gd-sz-drive-yanlong-longcheng-north", "gd-sz-drive-yanlong-pingdi", "gd-sz-drive-pingshan-center"], 135, "city-night"],
  ["横岗—荷坳—大运—龙城广场环线", ["gd-sz-drive-hengping-henggang", "gd-sz-drive-hengping-heao", "gd-sz-drive-longxiang-dayun", "gd-sz-drive-longxiang-longcheng"], 105, "city-night"],
  ["坪山—盐田港—大梅沙山海转场路线", ["gd-sz-drive-pingshan-yanzihu", "gd-sz-drive-yanmei-yantian-road", "gd-sz-drive-yanmei-dameisha", "gd-sz-drive-yanmei-beizaijiao"], 150, "coast"],
];

const locationIds = new Set(catalog.locations.map((item) => item.id));
for (const [, waypoints] of definitions) {
  for (const waypoint of waypoints) if (!locationIds.has(waypoint)) throw new Error(`Unknown waypoint: ${waypoint}`);
}

const prefix = "gd-sz-drive-extra20-";
if (catalog.routes.some((item) => item.id.startsWith(prefix))) throw new Error("深圳新增20条纯驾车路线已存在");
catalog.routes.push(...definitions.map(([label, waypointLocationIds, duration, type], index) => ({
  id: `${prefix}${String(index + 1).padStart(2, "0")}`,
  name: `深圳${label}纯驾车路线`, province: "广东", cities: ["深圳"], type,
  captureStyle: "scenic-drive", executionMode: "drive-only", modes: ["day", "sunset", "asmr"], estimatedDurationMinutes: duration,
  waypointLocationIds,
  best: { seasons: ["spring", "autumn", "winter"], times: ["golden-hour", "sunset", "blue-hour", "night"], weather: ["sunny", "cloudy", "after-rain"] },
  cameraPresetIds: ["gopro12-city-night-driving"],
  shootAdvice: "本路线全程仅作合法公共道路上的连续驾车拍摄，不停车、不下车补拍。锚点只用于约束道路走廊，必须由 AMap.Driving 按出发时的主辅路、匝道、限行、收费、施工和交通管制生成实际路线；导航改线时完全服从导航与现场标志。设备须在出发前固定、供电并自动录制，驾驶者全程不看屏、不操作设备、不为画面减速、变道、靠边、掉头或反复绕行。拥堵、疲劳、强降雨、积水、低能见度或道路异常时取消。",
  scores: { visual: type === "coast" ? 5 : 4, road: 4, parking: 1, safety: 4, youtubePotential: 4 }, status: "idea",
  verification: { status: "source-checked", note: "所有端点均为已有来源核验的公共道路驾车锚点；实际连接道路、方向、距离、时长、限行、收费和临时管制须由高德驾车规划及出发当日现场信息确认。" },
})));

await writeFile(catalogUrl, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Added ${definitions.length} Shenzhen drive-only routes.`);
