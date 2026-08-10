import AMapLoader from "@amap/amap-jsapi-loader";

let amapPromise: Promise<typeof AMap> | undefined;

export function hasAmapCredentials(): boolean {
  return Boolean(__AMAP_KEY__ && __AMAP_SECURITY_CODE__);
}

export function loadAmap(): Promise<typeof AMap> {
  if (!hasAmapCredentials()) {
    return Promise.reject(new Error("高德地图凭据未配置"));
  }

  window._AMapSecurityConfig = { securityJsCode: __AMAP_SECURITY_CODE__ };
  amapPromise ??= AMapLoader.load({
    key: __AMAP_KEY__,
    version: "2.0",
    plugins: ["AMap.Driving", "AMap.Geocoder", "AMap.PlaceSearch", "AMap.Weather"]
  });

  return amapPromise;
}
