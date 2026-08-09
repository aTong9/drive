import { loadAmap } from "./amapLoader.js";
import { resolveAdministrativeRegion } from "./regionService.js";

export interface CurrentRegion {
  province: string;
  city: string;
}

export type LocationDetectionStatus = "idle" | "locating" | "ready" | "denied" | "error";

function getBrowserPosition() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("当前浏览器不支持定位"));
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 });
  });
}

export async function detectCurrentRegion(): Promise<CurrentRegion> {
  const [{ coords }, AMapApi] = await Promise.all([getBrowserPosition(), loadAmap()]);
  const geocoder = new AMapApi.Geocoder({ radius: 1000, extensions: "base" });
  const address = await new Promise<AMap.AddressComponent>((resolve, reject) => {
    geocoder.getAddress([coords.longitude, coords.latitude], (status, result) => {
      if (status === "complete" && typeof result !== "string" && result.regeocode?.addressComponent) resolve(result.regeocode.addressComponent);
      else reject(new Error("暂时无法识别当前城市"));
    });
  });
  const city = Array.isArray(address.city) ? "" : address.city;
  const region = resolveAdministrativeRegion(address.province, city || address.province);
  if (!region) throw new Error("当前位置尚未进入全国行政目录");
  return region;
}
