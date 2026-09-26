import { useCallback, type SetStateAction } from "react";
import { usePlannerStore } from "../../app/store.js";
import type { LocationBrowseState } from "../../services/workspaceUrlService.js";

export function useLocationBrowse<K extends keyof LocationBrowseState>(key: K) {
  const value = usePlannerStore((state) => state.locationBrowse[key]);
  const setValue = useCallback((next: SetStateAction<LocationBrowseState[K]>) => {
    const store = usePlannerStore.getState();
    store.setLocationBrowse({ [key]: typeof next === "function" ? next(store.locationBrowse[key]) : next });
  }, [key]);
  return [value, setValue] as const;
}
