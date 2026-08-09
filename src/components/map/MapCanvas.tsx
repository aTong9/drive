import { AlertTriangle, LocateFixed, Map as MapIcon, Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { DrivingSummary, ResolvedRoute } from "../../types/domain.js";
import { hasAmapCredentials, loadAmap } from "../../services/amapLoader.js";

interface MapCanvasProps {
  selected: ResolvedRoute;
  onDrivingSummary: (summary: DrivingSummary) => void;
}

type MapStatus = "loading" | "ready" | "error" | "missing-key";

function createMarkerContent(index: number, name: string, accessMode: "drive" | "park-and-walk") {
  const root = document.createElement("div");
  root.className = "amap-route-marker";
  root.setAttribute("aria-label", `${index + 1}. ${name}`);

  const pin = document.createElement("span");
  pin.className = "amap-route-pin";
  pin.textContent = String(index + 1);

  const label = document.createElement("span");
  label.className = "amap-route-label";
  const title = document.createElement("strong");
  title.textContent = name;
  const subtitle = document.createElement("small");
  subtitle.textContent = accessMode === "drive" ? "驾车可达" : "停车后步行";
  label.append(title, subtitle);
  root.append(pin, label);
  return root;
}

export function MapCanvas({ selected, onDrivingSummary }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<AMap.Map | null>(null);
  const drivingRef = useRef<AMap.Driving | null>(null);
  const markersRef = useRef<AMap.Marker[]>([]);
  const requestIdRef = useRef(0);
  const [status, setStatus] = useState<MapStatus>(() => hasAmapCredentials() ? "loading" : "missing-key");
  const [normalStyle, setNormalStyle] = useState(false);

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
      mapRef.current?.destroy();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (status !== "ready" || !mapRef.current || !drivingRef.current) return;
    const map = mapRef.current;
    const driving = drivingRef.current;
    const requestId = ++requestIdRef.current;
    driving.clear();
    map.remove(markersRef.current);

    const path = selected.waypoints.map((point) => [point.coordinate.lng, point.coordinate.lat] as [number, number]);
    const markers = selected.waypoints.map((point, index) => new AMap.Marker({
      position: [point.coordinate.lng, point.coordinate.lat],
      content: createMarkerContent(index, point.name, point.access.mode),
      anchor: "bottom-center",
      offset: new AMap.Pixel(0, 2),
      zIndex: 50 + index
    }));
    markersRef.current = markers;
    map.add(markers);

    const origin = path[0];
    const destination = path.at(-1);
    if (!origin || !destination) return;
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
  }, [onDrivingSummary, selected, status]);

  const changeZoom = (delta: number) => {
    const map = mapRef.current;
    if (map) map.setZoom(map.getZoom() + delta);
  };

  const locateUser = () => {
    if (!navigator.geolocation || !mapRef.current) return;
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      mapRef.current?.setZoomAndCenter(15, [coords.longitude, coords.latitude]);
    });
  };

  const toggleStyle = () => {
    const nextNormal = !normalStyle;
    setNormalStyle(nextNormal);
    mapRef.current?.setMapStyle(nextNormal ? "amap://styles/normal" : "amap://styles/dark");
  };

  return (
    <section className="map-canvas" aria-label={`${selected.route.name}高德地图`}>
      <div ref={containerRef} className="amap-host" />

      {status === "loading" && <div className="map-state"><span className="map-loader" /><strong>正在加载高德地图</strong><small>准备路线和拍摄点…</small></div>}
      {status === "missing-key" && <div className="map-state is-warning"><AlertTriangle size={22} /><strong>地图凭据未加载</strong><small>请检查本地 .ENV_AMAP 中的 key 与 security</small></div>}
      {status === "error" && <div className="map-state is-warning"><AlertTriangle size={22} /><strong>高德地图加载失败</strong><small>请检查 Key 域名白名单和网络连接</small></div>}

      <div className="map-toolbar">
        <button onClick={() => changeZoom(1)} aria-label="放大地图"><Plus size={18} /></button>
        <button onClick={() => changeZoom(-1)} aria-label="缩小地图"><Minus size={18} /></button>
        <button onClick={locateUser} aria-label="定位当前位置"><LocateFixed size={18} /></button>
      </div>
      <button className="map-style-button" onClick={toggleStyle}><MapIcon size={16} /> {normalStyle ? "深色地图" : "标准地图"}</button>
      <div className="map-legend"><span><i className="legend-route" />推荐路线</span><span><i className="legend-walk" />停车后步行</span></div>
    </section>
  );
}
