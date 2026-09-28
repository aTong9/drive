import { AlertTriangle, LocateFixed, Map as MapIcon, Minus, Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { importGpx, wgs84ToGcj02 } from "../../services/gpxImport.js";
import { usePlannerStore } from "../../app/store.js";
import type { DrivingSummary, Location, ResolvedRoute } from "../../types/domain.js";
import { hasAmapCredentials, loadAmap } from "../../services/amapLoader.js";
import { findAmapLocationPhoto } from "../../services/amapPhotoService.js";

import type { NightDriveMapRoute } from "../../services/nightDriveCoordinates.js";

interface MapCanvasProps {
  selected: ResolvedRoute | undefined;
  atlasRoute?: NightDriveMapRoute;
  nearbyLocations: Location[];
  onDrivingSummary: (summary: DrivingSummary) => void;
}

type MapStatus = "loading" | "ready" | "error" | "missing-key";

function createMarkerContent(index: number, point: Location) {
  const root = document.createElement("div");
  root.className = "amap-route-marker";
  root.setAttribute("aria-label", `${index + 1}. ${point.name}`);

  const pin = document.createElement("span");
  pin.className = "amap-route-pin";
  pin.textContent = String(index + 1);

  const thumbnail = document.createElement("span");
  thumbnail.className = `amap-marker-thumbnail type-${point.type}`;
  thumbnail.setAttribute("aria-hidden", "true");
  void findAmapLocationPhoto(point).then((url) => {
    if (!url) return;
    const image = document.createElement("img");
    image.src = url;
    image.alt = "";
    image.referrerPolicy = "no-referrer";
    image.addEventListener("error", () => image.remove(), { once: true });
    thumbnail.append(image);
  });

  const label = document.createElement("span");
  label.className = "amap-route-label";
  const title = document.createElement("strong");
  title.textContent = point.name;
  const subtitle = document.createElement("small");
  subtitle.textContent = point.access.mode === "drive" ? "驾车可达" : "停车后步行";
  label.append(title, subtitle);
  root.append(pin, thumbnail, label);
  return root;
}

export function MapCanvas({ selected, atlasRoute, nearbyLocations, onDrivingSummary }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<AMap.Map | null>(null);
  const drivingRef = useRef<AMap.Driving | null>(null);
  const markersRef = useRef<AMap.Marker[]>([]);
  const trackRef = useRef<AMap.Polyline | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);
  const [status, setStatus] = useState<MapStatus>(() => hasAmapCredentials() ? "loading" : "missing-key");
  const [normalStyle, setNormalStyle] = useState(false);
  const [trackMessage, setTrackMessage] = useState("");
  const gpxTrack = usePlannerStore((state) => state.gpxTrack);
  const setGpxTrack = usePlannerStore((state) => state.setGpxTrack);

  useEffect(() => {
    let cancelled = false;
    if (!containerRef.current || !hasAmapCredentials()) return;

    setStatus("loading");
    loadAmap()
      .then((AMapApi) => {
        if (cancelled || !containerRef.current) return;
        const map = new AMapApi.Map(containerRef.current, {
          viewMode: "2D",
          zoom: 12,
          showLabel: true
        });
        mapRef.current = map;
        drivingRef.current = new AMapApi.Driving({
          map,
          policy: 0,
          hideMarkers: true,
          showTraffic: true,
          autoFitView: true,
          extensions: "all",
          isOutline: true,
          outlineColor: "#23271f"
        });
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      drivingRef.current?.clear();
      drivingRef.current = null;
      markersRef.current = [];
      trackRef.current = null;
      mapRef.current?.destroy();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (atlasRoute && (status === "error" || status === "missing-key")) {
      onDrivingSummary({ status: "error", routeId: atlasRoute.id, message: "地图暂不可用，请检查地图配置或网络；也可使用下方逐站导航。" });
    }
    if (status !== "ready" || !mapRef.current || !drivingRef.current) return;
    const map = mapRef.current;
    const driving = drivingRef.current;
    const requestId = ++requestIdRef.current;
    driving.clear();
    map.remove(markersRef.current);

    if (atlasRoute) {
      const markers = atlasRoute.points.map((point) => {
        const content = document.createElement("button");
        content.type = "button";
        content.className = "amap-route-marker amap-atlas-marker";
        content.setAttribute("aria-label", `${point.index + 1}. ${point.name} · ${point.mode}`);
        const pin = document.createElement("span"); pin.className = "amap-route-pin"; pin.textContent = String(point.index + 1);
        const label = document.createElement("span"); label.className = "amap-route-label"; label.textContent = `${point.name} · ${point.mode}`;
        content.append(pin, label);
        return new AMap.Marker({ position: [point.coordinate.lng, point.coordinate.lat], content, anchor: "bottom-center" });
      });
      markersRef.current = markers;
      map.add(markers);
      if (markers.length) map.setFitView(markers, false, [60, 60, 60, 60], 15);
      if (atlasRoute.points.length < 2) {
        onDrivingSummary({ status: "error", routeId: atlasRoute.id, message: `以下站点坐标尚未确认，已显示其余站点，暂不连接整条路线：${atlasRoute.missing.join("、")}` });
        return;
      }
      const path = atlasRoute.points.map((point) => [point.coordinate.lng, point.coordinate.lat] as [number, number]);
      onDrivingSummary({ status: "loading", routeId: atlasRoute.id });
      const timer = window.setTimeout(() => {
        if (requestId !== requestIdRef.current) return;
        requestIdRef.current += 1;
        driving.clear();
        onDrivingSummary({ status: "error", routeId: atlasRoute.id, message: "路线规划超时，请重试或使用下方逐站导航。" });
      }, 25000);
      driving.search(path[0]!, path.at(-1)!, { waypoints: path.slice(1, -1) }, (searchStatus, result) => {
        if (requestId !== requestIdRef.current) return;
        window.clearTimeout(timer);
        const route = searchStatus === "complete" && typeof result !== "string" ? result.routes?.[0] : undefined;
        if (route) {
          onDrivingSummary({ status: "ready", routeId: atlasRoute.id, distanceMeters: route.distance, durationSeconds: route.time, tollsYuan: route.tolls ?? 0, hasRestriction: route.restriction === 1 });
        } else {
          driving.clear();
          onDrivingSummary({ status: "error", routeId: atlasRoute.id, message: (typeof result === "string" ? result : result.info) === "INVALID_USER_DOMAIN" ? "当前域名未获高德授权，请通过线上项目地址打开地图。" : "站点坐标已显示，暂未取得驾车道路，请重试或使用逐站导航。" });
        }
      });
      return () => { window.clearTimeout(timer); requestIdRef.current += 1; driving.clear(); };
    }

    if (!selected) {
      const markers = nearbyLocations.map((point) => new AMap.Marker({
        position: [point.coordinate.lng, point.coordinate.lat],
        content: createMarkerContent(0, point),
        anchor: "bottom-center",
        offset: new AMap.Pixel(0, 2),
        zIndex: 50
      }));
      markersRef.current = markers;
      if (markers.length) { map.add(markers); map.setFitView(markers, false, [90, 90, 90, 90], 14); }
      return;
    }

    const path = selected.waypoints.map((point) => [point.coordinate.lng, point.coordinate.lat] as [number, number]);
    const markers = selected.waypoints.map((point, index) => new AMap.Marker({
      position: [point.coordinate.lng, point.coordinate.lat],
      content: createMarkerContent(index, point),
      anchor: "bottom-center",
      offset: new AMap.Pixel(0, 2),
      zIndex: 50 + index
    }));
    markersRef.current = markers;
    map.add(markers);

    const origin = path[0];
    const destination = path.at(-1);
    if (!origin || !destination) return;
    const usesWgs84 = selected.waypoints.some((point) => point.coordinate.crs === "WGS84");
    if (selected.route.captureStyle === "stationary-nature" || usesWgs84) {
      onDrivingSummary({ status: "access-only", routeId: selected.route.id });
      map.setFitView(markers, false, [90, 90, 90, 90], 14);
      return;
    }
    onDrivingSummary({ status: "loading", routeId: selected.route.id });
    driving.search(origin, destination, { waypoints: path.slice(1, -1) }, (searchStatus, result) => {
      if (requestId !== requestIdRef.current) return;
      if (searchStatus === "complete" && typeof result !== "string" && result.routes[0]) {
        const route = result.routes[0];
        onDrivingSummary({
          status: "ready",
          routeId: selected.route.id,
          distanceMeters: route.distance,
          durationSeconds: route.time,
          tollsYuan: route.tolls ?? 0,
          hasRestriction: route.restriction === 1
        });
        return;
      }
      onDrivingSummary({ status: "error", routeId: selected.route.id, message: "暂时无法取得驾车路线" });
      map.setFitView(markers, false, [90, 90, 90, 90], 14);
    });
  }, [atlasRoute, nearbyLocations, onDrivingSummary, selected, status]);

  useEffect(() => {
    const map = mapRef.current;
    if (status !== "ready" || !map) return;
    if (trackRef.current) { map.remove(trackRef.current); trackRef.current = null; }
    if (!gpxTrack) return;
    const polyline = new AMap.Polyline({ path: gpxTrack.points.map((point) => [point.lng, point.lat]), strokeColor: "#58c7b4", strokeWeight: 5, strokeOpacity: .9, lineJoin: "round", lineCap: "round", zIndex: 45 });
    trackRef.current = polyline; map.add(polyline); map.setFitView([polyline], false, [70, 70, 70, 70], 15);
  }, [gpxTrack, status]);

  const changeZoom = (delta: number) => {
    const map = mapRef.current;
    if (map) map.setZoom(map.getZoom() + delta);
  };

  const locateUser = () => {
    if (!navigator.geolocation || !mapRef.current) return;
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const point = wgs84ToGcj02(coords.latitude, coords.longitude);
      mapRef.current?.setZoomAndCenter(15, [point.lng, point.lat]);
    });
  };

  const handleGpx = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
    try { const track = await importGpx(file); setGpxTrack(track); setTrackMessage(`${track.name} · ${track.points.length} 点`); }
    catch (error) { setTrackMessage(error instanceof Error ? error.message : "GPX 导入失败"); }
  };

  const toggleStyle = () => {
    const nextNormal = !normalStyle;
    setNormalStyle(nextNormal);
    mapRef.current?.setMapStyle(nextNormal ? "amap://styles/normal" : "amap://styles/dark");
  };

  return (
    <section className="map-canvas" aria-label={atlasRoute ? `${atlasRoute.name}高德地图` : selected ? `${selected.route.name}高德地图` : "当前城市地点高德地图"}>
      <div ref={containerRef} className="amap-host" />

      {status === "loading" && <div className="map-state" role="status" aria-live="polite"><span className="map-loader" /><strong>正在加载高德地图</strong><small>准备路线和拍摄点…</small></div>}
      {status === "missing-key" && <div className="map-state is-warning" role="status"><AlertTriangle size={22} /><strong>地图凭据未加载</strong><small>请检查本地 .ENV_AMAP 中的 key 与 security</small></div>}
      {status === "error" && <div className="map-state is-warning" role="alert"><AlertTriangle size={22} /><strong>高德地图加载失败</strong><small>请检查 Key 域名白名单和网络连接</small></div>}

      <div className="map-toolbar">
        <button onClick={() => changeZoom(1)} aria-label="放大地图"><Plus size={18} /></button>
        <button onClick={() => changeZoom(-1)} aria-label="缩小地图"><Minus size={18} /></button>
        <button onClick={locateUser} aria-label="定位当前位置"><LocateFixed size={18} /></button>
        <input ref={fileInputRef} hidden type="file" accept=".gpx,application/gpx+xml" aria-label="导入 GPX 轨迹文件" onChange={handleGpx} />
        <button onClick={() => fileInputRef.current?.click()} aria-label="导入 GPX 轨迹"><Upload size={17} /></button>
        {gpxTrack && <button onClick={() => { setGpxTrack(null); setTrackMessage(""); }} aria-label="清除 GPX 轨迹"><Trash2 size={16} /></button>}
      </div>
      <button className="map-style-button" onClick={toggleStyle}><MapIcon size={16} /> {normalStyle ? "深色地图" : "标准地图"}</button>
      <div className="map-legend"><span><i className="legend-route" />推荐路线</span>{selected?.waypoints.some((point) => point.access.mode === "park-and-walk") && <span><i className="legend-walk" />停车后步行</span>}{gpxTrack && <span><i className="legend-gpx" />{trackMessage || gpxTrack.name}</span>}</div>
    </section>
  );
}
