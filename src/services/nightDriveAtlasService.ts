import data from "../../data/night-drive-atlas.json" with { type: "json" };
import { provincesForGroup, type AdministrativeGroupId } from "./regionService.js";

export interface NightDriveStop {
  id: string;
  name: string;
  mode: string;
  note: string;
  navigationName: string;
  searchName: string;
}
export interface NightDriveCity {
  id: string;
  name: string;
  province: string;
  advice: string;
  routes: Array<{ id: string; name: string; direction: string; note: string; stops: NightDriveStop[] }>;
  extras: NightDriveStop[];
  sourceNote: string;
  sources: Array<{ label: string; url: string }>;
}

export const nightDriveAtlas: { schemaVersion: string; source: typeof data.source; cities: NightDriveCity[] } = data;
export const nightDriveTotals = {
  cities: data.cities.length,
  routes: data.cities.reduce((n, city) => n + city.routes.length, 0),
  stops: data.cities.reduce((n, city) => n + city.routes.reduce((m, route) => m + route.stops.length, 0), 0),
  extras: data.cities.reduce((n, city) => n + city.extras.length, 0),
};

export function nightDriveLinks(city: string, stop: NightDriveStop, previous?: NightDriveStop, extra = false) {
  const navigation = new URLSearchParams({ sourceApplication: "NightDriveAtlas", dname: stop.navigationName, t: "0", m: "0", dev: "0" });
  const current = `iosamap://path?${navigation.toString().replaceAll("+", "%20")}`;
  if (previous) navigation.set("sname", previous.navigationName);
  const search = (keyword: string) => `https://uri.amap.com/search?${new URLSearchParams({ keyword, city, view: "map", src: "NightDriveAtlas", callnative: "0" })}`;
  return [
    { label: previous ? `从${previous.name}去此站` : "从当前位置去", url: `iosamap://path?${navigation.toString().replaceAll("+", "%20")}` },
    ...(previous ? [{ label: "从当前位置去", url: current }] : []),
    { label: "地图备用", url: search(stop.searchName) },
    ...(extra ? [] : [{ label: "查停车场", url: search(`${stop.searchName} 停车场`) }]),
  ];
}

export function filterNightDriveCities(query: string, region: { province?: string; city?: string }, group: AdministrativeGroupId | "all") {
  const needle = query.trim().toLocaleLowerCase();
  const provinces = new Set(provincesForGroup(group).map((province) => province.name));
  return nightDriveAtlas.cities.filter((city) =>
    (!region.province || city.province === region.province) && (!region.city || city.name === region.city) &&
    (group === "all" || provinces.has(city.province)) &&
    (!needle || [city.name, city.province, city.advice, ...city.routes.flatMap((route) => [route.name, route.direction, route.note, ...route.stops.map((stop) => `${stop.name} ${stop.note}`)]), ...city.extras.map((stop) => stop.name)].join(" ").toLocaleLowerCase().includes(needle)),
  );
}

export function nightDriveMapRoute(city: NightDriveCity, route: NightDriveCity["routes"][number]) {
  return { id: route.id, name: `${city.name} · ${route.name}`, points: route.stops.map((stop) => ({ keyword: stop.navigationName, city: city.name })) };
}
