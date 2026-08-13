import { readFile, writeFile } from "node:fs/promises";

const catalogUrl = new URL("../data/catalog.json", import.meta.url);
const catalog = JSON.parse(await readFile(catalogUrl, "utf8"));
const places = [
  ["永兴岛", 16.83417, 112.3375], ["石岛", 16.85, 112.35], ["西沙洲", 16.97694, 112.21194],
  ["赵述岛", 16.967, 112.267], ["北岛", 16.97333, 112.305], ["中岛", 16.96, 112.32667],
  ["南岛", 16.94833, 112.34167], ["北沙洲", 16.93833, 112.34278], ["中沙洲", 16.93361, 112.34444],
  ["南沙洲", 16.93, 112.34611], ["三峙仔", 16.95, 112.33], ["银砾滩", 16.77667, 112.23056],
  ["东岛", 16.667, 112.733], ["高尖石", 16.576806, 112.642361], ["甘泉岛", 16.50778, 111.58611],
  ["珊瑚岛", 16.53722, 111.60694], ["金银岛", 16.44639, 111.50694], ["琛航岛", 16.45306, 111.71139],
  ["广金岛", 16.4525, 111.70111], ["晋卿岛", 16.46417, 111.7425],
];

const toRadians = (degrees) => (degrees * Math.PI) / 180;
const transformLat = (lng, lat) => {
  let value = -100 + 2 * lng + 3 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  value += ((20 * Math.sin(6 * lng * Math.PI) + 20 * Math.sin(2 * lng * Math.PI)) * 2) / 3;
  value += ((20 * Math.sin(lat * Math.PI) + 40 * Math.sin((lat / 3) * Math.PI)) * 2) / 3;
  value += ((160 * Math.sin((lat / 12) * Math.PI) + 320 * Math.sin((lat * Math.PI) / 30)) * 2) / 3;
  return value;
};
const transformLng = (lng, lat) => {
  let value = 300 + lng + 2 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  value += ((20 * Math.sin(6 * lng * Math.PI) + 20 * Math.sin(2 * lng * Math.PI)) * 2) / 3;
  value += ((20 * Math.sin(lng * Math.PI) + 40 * Math.sin((lng / 3) * Math.PI)) * 2) / 3;
  value += ((150 * Math.sin((lng / 12) * Math.PI) + 300 * Math.sin((lng / 30) * Math.PI)) * 2) / 3;
  return value;
};
const toGcj02 = (lat, lng) => {
  const a = 6378245;
  const ee = 0.006693421622965943;
  let dLat = transformLat(lng - 105, lat - 35);
  let dLng = transformLng(lng - 105, lat - 35);
  const radLat = toRadians(lat);
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180) / (((a * (1 - ee)) / (magic * sqrtMagic)) * Math.PI);
  dLng = (dLng * 180) / ((a / sqrtMagic) * Math.cos(radLat) * Math.PI);
  return { lat: Number((lat + dLat).toFixed(6)), lng: Number((lng + dLng).toFixed(6)) };
};

const sourceUrl = "https://zh.wikipedia.org/wiki/西沙群岛岛礁列表";
const locationIds = places.map((_, index) => `exp20-hi-sansha-islet-${String(index + 1).padStart(2, "0")}`);
if (catalog.locations.some((item) => locationIds.includes(item.id))) throw new Error("三沙扩展地点已存在");

catalog.locations.push(...places.map(([name, lat, lng], index) => ({
  id: locationIds[index], name, province: "海南", city: "三沙", type: "coast",
  coordinate: { ...toGcj02(lat, lng), crs: "GCJ-02" },
  access: {
    mode: "park-and-walk",
    note: "此坐标只用于地理识别，不构成自由行、私船靠泊或登岛指引。仅在合法运营方当期获批航次明确包含该点、完成实名审查且工作人员确认开放边界时活动；未获明确批准即取消。",
  },
  shooting: {
    bestTimes: ["morning", "golden-hour", "sunset"], bestWeather: ["sunny", "cloudy"],
    modes: ["photo", "tripod-video", "timelapse", "asmr"],
    advice: "仅从获批公共活动区域记录自然海景；不得拍摄军事、机场、通信、导航、政府驻地等敏感设施，不进入保护或封闭区域，不擅自航拍、下水、踩踏珊瑚或采集自然物。",
  },
  soundEnvironment: {
    character: ["waves", "birds", "mixed"], noiseRisk: "medium", crowdRisk: "medium",
    weatherSensitivity: "台风、季风、浪高、海流、能见度、生态保护和临时海域管理均可能取消航次或登陆",
    recordingAdvice: "仅在工作人员允许的停留点短时收音，做好防风、防盐雾措施，不记录可识别私人对话或工作通信。",
  },
  verification: { status: "source-checked", sources: [
    { title: `${name}（西沙群岛岛礁列表）`, url: sourceUrl, accessedAt: "2026-08-14", supports: ["existence", "coordinate"] },
    { title: "中国科学院西沙海洋观测研究站：西沙地理概况", url: "https://scsio.cas.cn/xisha/zyts/zrdl/202503/t20250324_7563593.html", accessedAt: "2026-08-14", supports: ["existence"] },
  ] },
})));

catalog.routes.push(...places.map(([name], index) => {
  const next = (index + 1) % places.length;
  return {
    id: `exp20-hi-sansha-route-${String(index + 1).padStart(2, "0")}`,
    name: `三沙${name}—${places[next][0]}获批航次核验路线`, province: "海南", cities: ["三沙"], type: "coast",
    captureStyle: "scenic-drive", modes: ["day", "sunset", "asmr"], estimatedDurationMinutes: 720,
    waypointLocationIds: [locationIds[index], locationIds[next]],
    best: { seasons: ["spring", "autumn", "winter"], times: ["morning", "golden-hour", "sunset"], weather: ["sunny", "cloudy"] },
    cameraPresetIds: ["gopro12-city-night-driving", "a7c2-forest-stream-static"],
    shootAdvice: "这只是两个真实地理锚点的候选组合，不是可自行驾驶或航行的线路。仅当持证运营方的当期获批航次明确覆盖相关点位并完成全部实名、安全和拍摄审查时执行；不得私船靠泊、擅自登岛或按坐标直航。",
    scores: { visual: 5, road: 1, parking: 1, safety: 2, youtubePotential: 4 }, status: "idea",
    verification: { status: "source-checked", note: "地点存在与坐标已有来源；航次、准入、靠泊、停留范围、拍摄许可、时长及天气条件均须由合法运营方和主管部门当期确认。" },
  };
}));

await writeFile(catalogUrl, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Added ${places.length} Sansha locations and ${places.length} constrained route ideas.`);
