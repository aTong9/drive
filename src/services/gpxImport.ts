import type { CoordinateReferenceSystem, LocalGpxTrack } from "../types/domain.js";

const PI = Math.PI;
const A = 6378245;
const EE = 0.006693421622965943;
function outOfChina(lat: number, lng: number) { return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271; }
function transformLat(x: number, y: number) { return -100 + 2*x + 3*y + .2*y*y + .1*x*y + .2*Math.sqrt(Math.abs(x)) + (20*Math.sin(6*x*PI)+20*Math.sin(2*x*PI))*2/3 + (20*Math.sin(y*PI)+40*Math.sin(y/3*PI))*2/3 + (160*Math.sin(y/12*PI)+320*Math.sin(y*PI/30))*2/3; }
function transformLng(x: number, y: number) { return 300 + x + 2*y + .1*x*x + .1*x*y + .1*Math.sqrt(Math.abs(x)) + (20*Math.sin(6*x*PI)+20*Math.sin(2*x*PI))*2/3 + (20*Math.sin(x*PI)+40*Math.sin(x/3*PI))*2/3 + (150*Math.sin(x/12*PI)+300*Math.sin(x/30*PI))*2/3; }

export function wgs84ToGcj02(lat: number, lng: number): { lat: number; lng: number; crs: CoordinateReferenceSystem } {
  if (outOfChina(lat, lng)) return { lat, lng, crs: "GCJ-02" };
  let dLat = transformLat(lng - 105, lat - 35); let dLng = transformLng(lng - 105, lat - 35);
  const radLat = lat / 180 * PI; let magic = Math.sin(radLat); magic = 1 - EE * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = dLat * 180 / ((A * (1 - EE)) / (magic * sqrtMagic) * PI);
  dLng = dLng * 180 / (A / sqrtMagic * Math.cos(radLat) * PI);
  return { lat: lat + dLat, lng: lng + dLng, crs: "GCJ-02" };
}

export async function importGpx(file: File): Promise<LocalGpxTrack> {
  const document = new DOMParser().parseFromString(await file.text(), "application/xml");
  if (document.querySelector("parsererror")) throw new Error("GPX 文件无法解析");
  const nodes = [...document.querySelectorAll("trkpt, rtept")];
  if (nodes.length < 2) throw new Error("GPX 至少需要两个轨迹点");
  if (nodes.length > 10000) throw new Error("GPX 轨迹点超过 10000 个限制");
  const points = nodes.map((node) => {
    const lat = Number(node.getAttribute("lat")); const lng = Number(node.getAttribute("lon"));
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) throw new Error("GPX 含无效坐标");
    return wgs84ToGcj02(lat, lng);
  });
  const name = document.querySelector("trk > name, rte > name")?.textContent?.trim() || file.name.replace(/\.gpx$/i, "");
  return { id: `gpx-${Date.now()}`, name, sourceCrs: "WGS84", points, importedAt: new Date().toISOString() };
}
