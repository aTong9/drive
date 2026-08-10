import type { Location } from "../types/domain.js";
import { hasAmapCredentials, loadAmap } from "./amapLoader.js";

const memoryCache = new Map<string, Promise<string | null>>();
const CACHE_PREFIX = "roadlens-amap-photo:";

interface AmapPhoto { url?: string }
interface AmapPoi {
  name?: string;
  location?: { lng: number; lat: number };
  photos?: AmapPhoto[];
}

function normalizeName(value: string) {
  return value.replace(/驾车锚点|道路锚点|公共道路|城市段|中心段|外围|附近|片区|路段|收费站段|风景名胜区|国家森林公园/g, "").replace(/[\s—·（）()]/g, "").toLowerCase();
}

function nameMatches(expected: string, actual: string) {
  const left = normalizeName(expected);
  const right = normalizeName(actual);
  const probe = left.length > 8 ? left.slice(0, Math.max(4, Math.floor(left.length * .55))) : left;
  return Boolean(probe) && (right.includes(probe) || left.includes(right));
}

function distanceMeters(location: Location, poi: AmapPoi) {
  if (!poi.location) return Number.POSITIVE_INFINITY;
  const latScale = 111_320;
  const lngScale = latScale * Math.cos(location.coordinate.lat * Math.PI / 180);
  return Math.hypot((poi.location.lng - location.coordinate.lng) * lngScale, (poi.location.lat - location.coordinate.lat) * latScale);
}

function readCached(locationId: string) {
  try { return window.sessionStorage.getItem(`${CACHE_PREFIX}${locationId}`); }
  catch { return null; }
}

function writeCached(locationId: string, url: string) {
  try { window.sessionStorage.setItem(`${CACHE_PREFIX}${locationId}`, url); }
  catch { /* Private browsing or quota limits should not block thumbnails. */ }
}

async function findWikimediaPhoto(location: Location): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: location.name,
      gsrlimit: "8",
      prop: "pageimages",
      piprop: "thumbnail",
      pithumbsize: "720",
      format: "json",
      origin: "*"
    });
    const response = await fetch(`https://zh.wikipedia.org/w/api.php?${params}`);
    if (!response.ok) return null;
    const data = await response.json() as { query?: { pages?: Record<string, { title?: string; thumbnail?: { source?: string } }> } };
    const pages = Object.values(data.query?.pages ?? {});
    return pages.find((page) => page.title && page.thumbnail?.source && nameMatches(location.name, page.title))?.thumbnail?.source ?? null;
  } catch { return null; }
}

export function findAmapLocationPhoto(location: Location): Promise<string | null> {
  if (!hasAmapCredentials() || typeof window === "undefined") return Promise.resolve(null);
  const cached = readCached(location.id);
  if (cached) return Promise.resolve(cached);
  const pending = memoryCache.get(location.id);
  if (pending) return pending;

  const request = loadAmap().then((AMapApi) => new Promise<string | null>((resolve) => {
    const PlaceSearch = (AMapApi as unknown as { PlaceSearch?: new (options: Record<string, unknown>) => {
      searchNearBy: (keyword: string, center: [number, number], radius: number, callback: (status: string, result: unknown) => void) => void;
    } }).PlaceSearch;
    if (!PlaceSearch) { resolve(null); return; }
    const search = new PlaceSearch({ pageSize: 8, pageIndex: 1, extensions: "all", city: location.city, citylimit: true });
    search.searchNearBy(location.name, [location.coordinate.lng, location.coordinate.lat], 1500, (status, rawResult) => {
      if (status !== "complete" || typeof rawResult !== "object" || !rawResult) { resolve(null); return; }
      const result = rawResult as { poiList?: { pois?: AmapPoi[] } };
      const candidates = result.poiList?.pois ?? [];
      const match = candidates
        .filter((poi) => poi.name && nameMatches(location.name, poi.name) && distanceMeters(location, poi) <= 1500)
        .sort((a, b) => distanceMeters(location, a) - distanceMeters(location, b))
        .find((poi) => poi.photos?.some((photo) => photo.url));
      const rawUrl = match?.photos?.find((photo) => photo.url)?.url;
      const url = rawUrl ? rawUrl.replace(/^http:/, "https:") : null;
      if (url) writeCached(location.id, url);
      resolve(url);
    });
  })).catch(() => null).then(async (url) => {
    const resolved = url ?? await findWikimediaPhoto(location);
    if (resolved) writeCached(location.id, resolved);
    return resolved;
  });
  memoryCache.set(location.id, request);
  return request;
}
