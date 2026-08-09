const ROUTE_QUERY_KEY = "route";
const ROUTE_ID_PATTERN = /^[a-z0-9][a-z0-9-]{1,127}$/;

interface AmapRoutePoint {
  name: string;
  coordinate: { lat: number; lng: number; crs: "GCJ-02" | "WGS84" };
}

export function parseSharedRouteId(href: string): string | null {
  const value = new URL(href).searchParams.get(ROUTE_QUERY_KEY)?.trim() ?? "";
  return ROUTE_ID_PATTERN.test(value) ? value : null;
}

export function createRouteShareUrl(routeId: string, href: string): string {
  if (!ROUTE_ID_PATTERN.test(routeId)) throw new Error("Invalid route id");
  const url = new URL(href);
  url.search = "";
  url.hash = "";
  url.searchParams.set(ROUTE_QUERY_KEY, routeId);
  return url.toString();
}

export function createAmapNavigationUrl(points: AmapRoutePoint[], driving = false): string | null {
  if (points.length < 2 || points.some((point) => point.coordinate.crs !== "GCJ-02")) return null;
  const url = new URL("https://uri.amap.com/navigation");
  const formatPoint = (point: AmapRoutePoint) => `${point.coordinate.lng},${point.coordinate.lat},${point.name}`;
  url.searchParams.set("from", formatPoint(points[0]!));
  url.searchParams.set("to", formatPoint(points.at(-1)!));
  if (driving && points.length > 2) {
    const representativeVia = points[Math.floor((points.length - 1) / 2)];
    url.searchParams.set("via", formatPoint(representativeVia!));
  }
  url.searchParams.set("mode", driving ? "car" : "walk");
  url.searchParams.set("policy", driving ? "1" : "0");
  url.searchParams.set("src", "roadlens");
  url.searchParams.set("callnative", "1");
  return url.toString();
}
