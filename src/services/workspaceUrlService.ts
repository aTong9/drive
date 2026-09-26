import type { AppView } from "../app/store.js";
import { viewPresentation } from "../app/viewPresentation.js";
import type { CaptureStyle, Location, RouteMode } from "../types/domain.js";
import { administrativeGroups, findProvince, type AdministrativeGroupId } from "./regionService.js";

export interface LocationBrowseState {
  query: string;
  browseMode: "locations" | "routes";
  type: Location["type"] | "all";
  captureStyle: CaptureStyle | "all";
  driveOnly: boolean;
  region: { province?: string; city?: string };
  regionGroup: AdministrativeGroupId | "all";
  locationPage: number;
  routePage: number;
  selectedId: string;
  detailVisible: boolean;
}

export const defaultLocationBrowse: LocationBrowseState = {
  query: "", browseMode: "locations", type: "all", captureStyle: "all", driveOnly: false,
  region: {}, regionGroup: "all", locationPage: 1, routePage: 1, selectedId: "", detailVisible: false,
};

export interface WorkspaceNavigation {
  view: AppView;
  query: string;
  mode: RouteMode | "all";
  captureStyle: CaptureStyle | "all";
  driveOnly: boolean;
  maxDurationMinutes: number;
  selectedRouteId: string;
  detailOpen: boolean;
  destination: { groupId: AdministrativeGroupId | "all"; province: string; city: string };
  locationBrowse: LocationBrowseState;
}

const modes = ["all", "day", "night", "sunrise", "sunset", "asmr"] as const;
const captureStyles = ["all", "scenic-drive", "rain-walk", "stationary-nature"] as const;
const locationTypes = ["all", "coast", "city-night", "waterfall", "stream", "forest", "mountain", "river", "lake", "landmark"] as const;
const ownParameters = ["view", "q", "province", "city", "group", "mode", "capture", "drive", "minutes", "route", "browse", "type", "page", "routePage", "location"];
const idPattern = /^[a-z0-9][a-z0-9-]{1,127}$/;
const choice = <T extends string>(value: string | null, options: readonly T[], fallback: T): T => options.find((option) => option === value) ?? fallback;
const pageNumber = (value: string | null) => value && /^\d{1,5}$/.test(value) ? Math.max(1, Number(value)) : 1;

export function readWorkspaceUrl(href: string): WorkspaceNavigation {
  const params = new URL(href).searchParams;
  const routeId = params.get("route") ?? "";
  const view = choice(params.get("view"), Object.keys(viewPresentation) as AppView[], params.has("route") ? "explore" : "locations");
  const province = findProvince(params.get("province") ?? "");
  const city = province?.divisions.find((item) => item.name === params.get("city"))?.name ?? "";
  const group = administrativeGroups.find((item) => item.id === params.get("group"));
  const groupId = group && (!province || group.provinces.includes(province.name as never)) ? group.id : "all";
  const query = (params.get("q") ?? "").slice(0, 500);
  const captureStyle = choice(params.get("capture"), captureStyles, "all");
  const selectedId = params.get("location") ?? "";
  const minutes = Number(params.get("minutes"));
  return {
    view,
    query: view === "explore" ? query : "",
    mode: choice(params.get("mode"), modes, "all"),
    captureStyle: view === "explore" ? captureStyle : "all",
    driveOnly: view === "explore" && params.get("drive") === "1",
    maxDurationMinutes: Number.isInteger(minutes) && minutes >= 15 && minutes <= 10080 ? minutes : 240,
    selectedRouteId: idPattern.test(routeId) ? routeId : "gd-sz-bay-night",
    detailOpen: view === "explore" && idPattern.test(routeId),
    destination: { groupId, province: province?.name ?? "", city },
    locationBrowse: {
      ...defaultLocationBrowse,
      query: view === "locations" ? query : "",
      browseMode: choice(params.get("browse"), ["locations", "routes"], "locations"),
      type: choice(params.get("type"), locationTypes, "all"),
      captureStyle: view === "locations" ? captureStyle : "all",
      driveOnly: view === "locations" && params.get("drive") === "1",
      region: province ? { province: province.name, ...(city ? { city } : {}) } : {},
      regionGroup: groupId,
      locationPage: pageNumber(params.get("page")),
      routePage: pageNumber(params.get("routePage")),
      selectedId: idPattern.test(selectedId) ? selectedId : "",
      detailVisible: view === "locations" && idPattern.test(selectedId),
    },
  };
}

export function createWorkspaceUrl(state: WorkspaceNavigation, href: string): string {
  const url = new URL(href);
  for (const key of ownParameters) url.searchParams.delete(key);
  const put = (key: string, value: string | number | undefined, fallback: string | number = "") => {
    if (value !== undefined && value !== "" && value !== fallback) url.searchParams.set(key, String(value));
  };
  put("view", state.view, "locations");
  if (state.view === "locations") {
    const browse = state.locationBrowse;
    put("q", browse.query); put("province", browse.region.province); put("city", browse.region.city);
    put("group", browse.regionGroup, "all"); put("browse", browse.browseMode, "locations");
    put("type", browse.type, "all"); put("capture", browse.captureStyle, "all");
    put("drive", browse.driveOnly ? "1" : "");
    put("page", browse.locationPage, 1); put("routePage", browse.routePage, 1);
    if (browse.detailVisible) put("location", browse.selectedId);
  } else if (state.view === "explore") {
    put("q", state.query); put("province", state.destination.province); put("city", state.destination.city);
    put("group", state.destination.groupId, "all"); put("mode", state.mode, "all");
    put("capture", state.captureStyle, "all"); put("drive", state.driveOnly ? "1" : "");
    put("minutes", state.maxDurationMinutes, 240);
    if (state.detailOpen) put("route", state.selectedRouteId);
  }
  return url.toString();
}
