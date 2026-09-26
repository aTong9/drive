import { usePlannerStore } from "./store.js";
import { getRouteSummary } from "../services/browserCatalogService.js";
import { createWorkspaceUrl, readWorkspaceUrl } from "../services/workspaceUrlService.js";

export function connectWorkspaceNavigation() {
  let restoring = false;
  let disposed = false;
  let queued = false;
  let push = false;
  const restore = () => {
    restoring = true;
    const navigation = readWorkspaceUrl(window.location.href);
    const route = navigation.detailOpen ? getRouteSummary(navigation.selectedRouteId) : undefined;
    if (route) navigation.maxDurationMinutes = Math.max(navigation.maxDurationMinutes, route.estimatedDurationMinutes);
    usePlannerStore.setState((state) => ({ ...navigation, currentRegion: null, routeOpenVersion: state.routeOpenVersion + 1 }));
    restoring = false;
  };
  restore();
  const unsubscribe = usePlannerStore.subscribe((state, previous) => {
    if (restoring) return;
    push ||= state.view !== previous.view ||
      (state.view === "explore" && state.detailOpen && (!previous.detailOpen || state.selectedRouteId !== previous.selectedRouteId)) ||
      (state.view === "locations" && state.locationBrowse.detailVisible && (!previous.locationBrowse.detailVisible || state.locationBrowse.selectedId !== previous.locationBrowse.selectedId));
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      if (disposed) return;
      const current = usePlannerStore.getState();
      const navigation = current.currentRegion ? { ...current, destination: { groupId: "all" as const, ...current.currentRegion } } : current;
      const href = createWorkspaceUrl(navigation, window.location.href);
      if (href !== window.location.href) window.history[push ? "pushState" : "replaceState"](null, "", href);
      push = false;
    });
  });
  window.addEventListener("popstate", restore);
  return () => {
    disposed = true;
    unsubscribe();
    window.removeEventListener("popstate", restore);
  };
}
