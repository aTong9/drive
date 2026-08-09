const ROUTE_QUERY_KEY = "route";
const ROUTE_ID_PATTERN = /^[a-z0-9][a-z0-9-]{1,127}$/;

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
