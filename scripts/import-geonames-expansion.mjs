import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const dumpPaths = [];
let provinceFilter;
let target = 20;
let prefix = "exp20-";
for (let index = 0; index < args.length; index += 1) {
  if (args[index] === "--dump") dumpPaths.push(args[++index]);
  else if (args[index] === "--province") provinceFilter = args[++index];
  else if (args[index] === "--target") target = Number(args[++index]);
  else if (args[index] === "--prefix") prefix = args[++index];
}
if (dumpPaths.length === 0) {
  console.error("Usage: node scripts/import-geonames-expansion.mjs --dump /path/CN.txt [--dump /path/TW.txt] [--province 广东]");
  process.exit(2);
}

const catalogPath = new URL("../data/catalog.json", import.meta.url);
const regions = JSON.parse(await readFile(new URL("../data/regions.json", import.meta.url), "utf8"));
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
if (!Number.isInteger(target) || target < 1) throw new Error("--target must be a positive integer");
if (!/^[a-z0-9-]+-$/u.test(prefix)) throw new Error("--prefix must be a lowercase ID prefix ending in '-'");
const records = [];

for (const dumpPath of dumpPaths) {
  const text = await readFile(path.resolve(dumpPath), "utf8");
  for (const line of text.split("\n")) {
    if (!line) continue;
    const fields = line.split("\t");
    if (fields.length < 19) continue;
    records.push({
      id: fields[0],
      name: fields[1],
      asciiName: fields[2],
      alternateNames: fields[3].split(",").filter(Boolean),
      lat: Number(fields[4]),
      lng: Number(fields[5]),
      featureClass: fields[6],
      featureCode: fields[7],
      countryCode: fields[8],
      admin1: fields[10],
      admin2: fields[11],
      population: Number(fields[14]) || 0,
    });
  }
}

const chineseNames = (record) => record.alternateNames.filter((name) => /[\u3400-\u9fff]/u.test(name));
const normalize = (name) =>
  name
    .replaceAll("臺", "台")
    .replaceAll("園", "园")
    .replaceAll("義", "义")
    .replaceAll("雲", "云")
    .replaceAll("東", "东")
    .replaceAll("蘭", "兰")
    .replaceAll("蓮", "莲")
    .replaceAll("門", "门")
    .replaceAll("連", "连")
    .replace(/(特别行政区|壮族自治区|回族自治区|维吾尔自治区|自治区|蒙古族藏族自治州|布依族苗族自治州|苗族侗族自治州|土家族苗族自治州|哈萨克自治州|藏族自治州|傣族景颇族自治州|白族自治州|傣族自治州|彝族自治州|朝鲜族自治州|自治州|省|縣|县|市|地区|盟)$/u, "");
const namesFor = (record) => [record.name, record.asciiName, ...chineseNames(record)];
const matchesName = (record, ...names) => namesFor(record).some((candidate) => names.some((name) => normalize(candidate) === normalize(name)));
const displayName = (record) => {
  const candidates = chineseNames(record)
    .filter((name) => name.length >= 2 && name.length <= 18)
    .sort((left, right) => left.length - right.length || left.localeCompare(right, "zh-CN"));
  return candidates[0] || record.name;
};

const preferredCodes = new Set([
  "PRK", "MT", "PK", "PKS", "LK", "LKS", "RSV", "RSVS", "BAY", "ISL", "ISLS", "FRST", "WTRF", "STM",
  "CSTL", "MUS", "MNMT", "PAL", "TMPL", "CH", "SHRN", "RUIN", "GDN", "ZOO", "STDM", "TOWR", "HSTS", "HST",
]);
const allowedClasses = new Set(["A", "P", "H", "T", "V", "L", "S"]);
const blockedCodes = new Set(["AIRP", "AIRB", "RSTN", "RSTP", "PS", "PSN", "PRN", "FT", "OILF", "MFG", "MN", "MNA", "MNC"]);
const score = (record) => {
  let value = preferredCodes.has(record.featureCode) ? 1000 : 0;
  if (["H", "T", "V", "L"].includes(record.featureClass)) value += 600;
  if (record.featureClass === "S") value += 400;
  if (record.featureClass === "A" && !["ADM1", "ADM2"].includes(record.featureCode)) value += 250;
  if (record.featureClass === "P") value += 200;
  value += Math.min(300, Math.log10(record.population + 1) * 50);
  return value;
};
const isCandidate = (record) =>
  Number.isFinite(record.lat) &&
  Number.isFinite(record.lng) &&
  allowedClasses.has(record.featureClass) &&
  !blockedCodes.has(record.featureCode) &&
  !["ADM1", "ADM2"].includes(record.featureCode) &&
  displayName(record).length >= 2;

const toRadians = (degrees) => (degrees * Math.PI) / 180;
const distanceKm = (left, right) => {
  const earthRadiusKm = 6371;
  const dLat = toRadians(right.lat - left.lat);
  const dLng = toRadians(right.lng - left.lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(left.lat)) * Math.cos(toRadians(right.lat)) * Math.sin(dLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const transformLat = (lng, lat) => {
  let result = -100 + 2 * lng + 3 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  result += ((20 * Math.sin(6 * lng * Math.PI) + 20 * Math.sin(2 * lng * Math.PI)) * 2) / 3;
  result += ((20 * Math.sin(lat * Math.PI) + 40 * Math.sin((lat / 3) * Math.PI)) * 2) / 3;
  result += ((160 * Math.sin((lat / 12) * Math.PI) + 320 * Math.sin((lat * Math.PI) / 30)) * 2) / 3;
  return result;
};
const transformLng = (lng, lat) => {
  let result = 300 + lng + 2 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  result += ((20 * Math.sin(6 * lng * Math.PI) + 20 * Math.sin(2 * lng * Math.PI)) * 2) / 3;
  result += ((20 * Math.sin(lng * Math.PI) + 40 * Math.sin((lng / 3) * Math.PI)) * 2) / 3;
  result += ((150 * Math.sin((lng / 12) * Math.PI) + 300 * Math.sin((lng / 30) * Math.PI)) * 2) / 3;
  return result;
};
const wgs84ToGcj02 = (lat, lng) => {
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

const adm1Records = records.filter((record) => record.featureCode === "ADM1");
const adm2Records = records.filter((record) => record.featureCode === "ADM2");
const specialAliases = new Map([["湖北/襄阳", "Xiangfan Shi"]]);
const specialCityCenters = new Map([
  ["新疆/铁门关", { lat: 41.85839, lng: 86.21414, id: "tiemenguan" }],
  ["新疆/双河", { lat: 44.844, lng: 82.355, id: "shuanghe" }],
  ["新疆/可克达拉", { lat: 43.683, lng: 80.635, id: "kokdala" }],
  ["新疆/昆玉", { lat: 37.209, lng: 79.291, id: "kunyu" }],
  ["新疆/新星", { lat: 42.818, lng: 93.515, id: "xinxing" }],
  ["新疆/白杨", { lat: 46.201, lng: 82.981, id: "baiyang" }],
]);
const directMunicipalities = new Set(["北京", "天津", "上海", "重庆"]);
const specialCountryCodes = { 台湾: "TW", 香港: "HK", 澳门: "MO" };
const reports = [];
const skipped = [];
const usedGeonamesIds = new Set(
  catalog.locations
    .map((location) => location.id.match(/-gn-(\d+)$/u)?.[1])
    .filter(Boolean),
);

for (const province of regions.provinces) {
  if (provinceFilter && province.name !== provinceFilter) continue;
  const countryCode = specialCountryCodes[province.name] || "CN";
  const provinceRecord = countryCode === "CN" ? adm1Records.find((record) => matchesName(record, province.name, province.label)) : undefined;
  if (countryCode === "CN" && !provinceRecord) throw new Error(`No GeoNames ADM1 mapping for ${province.name}`);

  divisionLoop: for (const division of province.divisions) {
    const existingLocationCount = catalog.locations.filter(
      (location) => location.id.startsWith(prefix) && location.province === province.name && location.city === division.name,
    ).length;
    const existingRouteCount = catalog.routes.filter(
      (route) => route.id.startsWith(prefix) && route.province === province.name && route.cities.includes(division.name),
    ).length;
    const neededLocations = Math.max(0, target - existingLocationCount);
    const neededRoutes = Math.max(0, target - existingRouteCount);
    if (neededLocations === 0 && neededRoutes === 0) continue;

    let pool;
    let center;
    let divisionKey;
    if (countryCode === "TW") {
      const divisionRecords = adm2Records.filter(
        (record) => record.countryCode === "TW" && matchesName(record, division.name, division.label),
      );
      if (divisionRecords.length === 0) {
        skipped.push({ province: province.name, city: division.name, reason: "no-city-mapping" });
        continue divisionLoop;
      }
      const divisionPairs = new Set(divisionRecords.map((record) => `${record.admin1}/${record.admin2}`));
      pool = records.filter(
        (record) => record.countryCode === "TW" && divisionPairs.has(`${record.admin1}/${record.admin2}`) && isCandidate(record),
      );
      center = divisionRecords[0];
      divisionKey = [...new Set(divisionRecords.map((record) => record.admin2 || record.id))].sort().join("-").toLowerCase();
    } else if (countryCode !== "CN") {
      pool = records.filter((record) => record.countryCode === countryCode && isCandidate(record));
      center = records.find((record) => record.countryCode === countryCode && ["PPLC", "PPLA"].includes(record.featureCode)) || pool[0];
      divisionKey = countryCode.toLowerCase();
    } else if (directMunicipalities.has(province.name)) {
      pool = records.filter((record) => record.countryCode === "CN" && record.admin1 === provinceRecord.admin1 && isCandidate(record));
      center = records.find((record) => record.admin1 === provinceRecord.admin1 && record.featureCode === "PPLA") || provinceRecord;
      divisionKey = center.admin2 || center.id;
    } else {
      const alias = specialAliases.get(`${province.name}/${division.name}`);
      const divisionRecord = adm2Records.find(
        (record) => record.admin1 === provinceRecord.admin1 && (matchesName(record, division.name, division.label) || (alias && record.name === alias)),
      );
      center = divisionRecord;
      if (divisionRecord) {
        divisionKey = divisionRecord.admin2 || divisionRecord.id;
        pool = records.filter(
          (record) => record.countryCode === "CN" && record.admin1 === provinceRecord.admin1 && record.admin2 === divisionRecord.admin2 && isCandidate(record),
        );
      } else {
        const cityCenter = records.find(
          (record) => record.countryCode === "CN" && record.admin1 === provinceRecord.admin1 && record.featureClass === "P" && matchesName(record, division.name, division.label),
        ) || specialCityCenters.get(`${province.name}/${division.name}`);
        if (!cityCenter) {
          skipped.push({ province: province.name, city: division.name, reason: "no-city-mapping" });
          continue divisionLoop;
        }
        center = cityCenter;
        divisionKey = cityCenter.id;
        pool = records.filter(
          (record) => record.countryCode === "CN" && record.admin1 === provinceRecord.admin1 && isCandidate(record) && distanceKm(cityCenter, record) <= (specialCityCenters.has(`${province.name}/${division.name}`) ? 120 : 45),
        );
      }
    }

    const existingNames = new Set(
      catalog.locations.filter((location) => location.province === province.name && location.city === division.name).map((location) => normalize(location.name)),
    );
    if (countryCode === "CN") {
      const nearbyWithoutDivision = records.filter(
        (record) =>
          record.countryCode === "CN" &&
          record.admin1 === provinceRecord.admin1 &&
          !record.admin2 &&
          isCandidate(record) &&
          distanceKm(center, record) <= 80,
      );
      const nearbySameProvince = records.filter(
        (record) =>
          record.countryCode === "CN" &&
          record.admin1 === provinceRecord.admin1 &&
          isCandidate(record) &&
          distanceKm(center, record) <= 45,
      );
      pool = [...pool, ...nearbyWithoutDivision, ...nearbySameProvince];
    }
    const seenNames = new Set();
    const selected = pool
      .filter((record) => {
        const name = normalize(displayName(record));
        if (!name || usedGeonamesIds.has(record.id) || existingNames.has(name) || seenNames.has(name)) return false;
        seenNames.add(name);
        return true;
      })
      .sort((left, right) => score(right) - score(left) || distanceKm(center, left) - distanceKm(center, right))
      .slice(0, neededLocations);
    if (selected.length < neededLocations) {
      skipped.push({
        province: province.name,
        city: division.name,
        reason: "insufficient-candidates",
        available: selected.length,
        needed: neededLocations,
      });
      continue divisionLoop;
    }

    const newLocations = selected.map((record, index) => {
      const mainland = countryCode === "CN";
      const coordinate = mainland ? wgs84ToGcj02(record.lat, record.lng) : { lat: record.lat, lng: record.lng };
      const type = ["MT", "PK", "PKS"].includes(record.featureCode)
        ? "mountain"
        : ["LK", "LKS", "RSV", "RSVS"].includes(record.featureCode)
          ? "lake"
          : ["STM", "WTRF"].includes(record.featureCode)
            ? "river"
            : ["BAY", "ISL", "ISLS"].includes(record.featureCode)
              ? "coast"
              : ["FRST", "PRK", "GDN"].includes(record.featureCode)
                ? "forest"
                : "landmark";
      return {
        id: `${prefix}${provinceRecord?.admin1 || countryCode.toLowerCase()}-${divisionKey}-gn-${record.id}`,
        name: displayName(record),
        province: province.name,
        city: division.name,
        type,
        coordinate: { ...coordinate, crs: mainland ? "GCJ-02" : "WGS84" },
        access: {
          mode: "park-and-walk",
          note: `GeoNames 将此处标注为 ${record.featureCode} 地理实体；先用地图名称与坐标规划至合法公共到达点，停车后按现场道路、开放边界和管理规定步行核验。`,
        },
        shooting: {
          bestTimes: ["morning", "golden-hour", "sunset"],
          bestWeather: ["sunny", "cloudy", "after-rain"],
          modes: ["photo", "tripod-video", "timelapse", "asmr"],
          advice: "该点为真实地名库锚点，首次执行须先核验公共可达性与拍摄价值；只在合法开放空间拍摄，不进入住宅、生产、军事、保护或封闭区域。",
        },
        soundEnvironment: {
          character: type === "lake" || type === "river" || type === "coast" ? ["water", "mixed"] : ["urban", "mixed"],
          noiseRisk: "medium",
          crowdRisk: "medium",
          weatherSensitivity: "降雨、强风、季节、道路状态和现场管理会改变可达性与收音条件",
          recordingAdvice: "首次到场以环境侦察为主，仅在安全公共空间短录；避免清晰私人对话、商业音乐和生态干扰。",
        },
        verification: {
          status: "source-checked",
          sources: [
            {
              title: `${displayName(record)}（GeoNames ${record.featureCode}）`,
              url: `https://www.geonames.org/${record.id}`,
              accessedAt: "2026-08-14",
              supports: ["existence", "coordinate"],
            },
          ],
        },
      };
    });
    catalog.locations.push(...newLocations);
    for (const record of selected) usedGeonamesIds.add(record.id);

    const allExpansionLocations = catalog.locations.filter(
      (location) => location.id.startsWith(prefix) && location.province === province.name && location.city === division.name,
    );
    const newRoutes = [];
    for (let index = 0; index < neededRoutes; index += 1) {
      const sequence = existingRouteCount + index;
      const from = allExpansionLocations[sequence % allExpansionLocations.length];
      const to = allExpansionLocations[(sequence + 1) % allExpansionLocations.length];
      newRoutes.push({
        id: `${prefix}${provinceRecord?.admin1 || countryCode.toLowerCase()}-${divisionKey}-route-${String(sequence + 1).padStart(2, "0")}`,
        name: `${division.name}${from.name}至${to.name}地理探索路线`,
        province: province.name,
        cities: [division.name],
        type: from.type === "coast" || to.type === "coast" ? "coast" : from.type === "mountain" || to.type === "mountain" ? "mountain" : from.type === "lake" || to.type === "lake" ? "lake" : "city-night",
        captureStyle: "scenic-drive",
        modes: ["day", "sunset", "asmr"],
        estimatedDurationMinutes: 360,
        waypointLocationIds: [from.id, to.id],
        best: { seasons: ["spring", "autumn", "winter"], times: ["morning", "golden-hour", "sunset"], weather: ["cloudy", "after-rain"] },
        cameraPresetIds: ["gopro12-city-night-driving", "a7c2-forest-stream-static"],
        shootAdvice: "两个 GeoNames 地点仅作真实地理锚点；必须由高德或当地地图按当天合法道路生成实际连接，并在出发前核验地点性质、公共可达性、停车和开放边界。不得按坐标直线穿越，发现住宅、生产、军事、保护或封闭区域立即放弃。",
        scores: { visual: 3, road: 2, parking: 2, safety: 3, youtubePotential: 3 },
        status: "idea",
        verification: {
          status: "source-checked",
          note: "两端地名和坐标由 GeoNames 支持；路线本身、道路、距离、时间、准入、停车及实际拍摄价值仍须地图规划与实地核验。",
        },
      });
    }
    catalog.routes.push(...newRoutes);
    reports.push({ province: province.name, city: division.name, addedLocations: newLocations.length, addedRoutes: newRoutes.length });
  }
}

await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(JSON.stringify({ updatedDivisions: reports.length, skippedDivisions: skipped.length, reports, skipped }, null, 2));
