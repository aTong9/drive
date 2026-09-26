import type { PersistStorage, StorageValue } from "zustand/middleware";
import { deviceStateVersion, deviceStorageKey, emptyDeviceState, normalizeDeviceState, selectDeviceState, type DeviceState } from "./deviceStateService.js";

type BrowserStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export interface DeviceStorageStatus {
  kind: "ready" | "read-error" | "write-error";
  message: string;
  original: string | null;
}

export function createDeviceStorage(getStorage: () => BrowserStorage) {
  let status: DeviceStorageStatus = { kind: "ready", message: "", original: null };
  let lastSaved: DeviceState | null = null;
  const listeners = new Set<() => void>();
  const notify = (next: DeviceStorageStatus) => {
    status = next;
    listeners.forEach((listener) => listener());
  };
  const write = (name: string, value: StorageValue<DeviceState>) => {
    getStorage().setItem(name, JSON.stringify(value));
    lastSaved = value.state;
    if (status.kind !== "ready") notify({ kind: "ready", message: "", original: null });
  };
  const storage: PersistStorage<DeviceState> = {
    getItem(name) {
      let original: string | null = null;
      try {
        original = getStorage().getItem(name);
        let state = emptyDeviceState();
        if (original !== null) {
          const envelope: unknown = JSON.parse(original);
          if (!envelope || typeof envelope !== "object" || Array.isArray(envelope)) throw new Error("资料格式无效");
          const { version, state: persisted } = envelope as { version?: unknown; state?: unknown };
          if (version !== undefined && (typeof version !== "number" || !Number.isInteger(version) || version < 0 || version > deviceStateVersion))
            throw new Error("资料版本不受当前应用支持");
          state = normalizeDeviceState(persisted);
        }
        lastSaved = state;
        if (status.kind !== "ready") notify({ kind: "ready", message: "", original: null });
        return { state, version: deviceStateVersion };
      } catch (error) {
        lastSaved = null;
        notify({ kind: "read-error", original, message: `本地资料未能读取，已停止自动保存以保护原数据。${error instanceof Error ? error.message : "请检查浏览器存储权限"}` });
        return null;
      }
    },
    setItem(name, value) {
      if (status.kind === "read-error") return;
      if (lastSaved && Object.keys(value.state).every((key) => value.state[key as keyof DeviceState] === lastSaved![key as keyof DeviceState])) return;
      try { write(name, value); }
      catch (error) {
        notify({ kind: "write-error", original: null,
          message: error instanceof Error && error.name === "QuotaExceededError"
            ? "本地存储空间不足，最新修改尚未保存。请先导出完整备份，再释放空间并重试。"
            : "最新修改尚未保存，浏览器存储可能不可用。请导出完整备份并重试。" });
      }
    },
    removeItem(name) {
      if (status.kind === "read-error") return;
      getStorage().removeItem(name);
      lastSaved = null;
    },
  };
  return {
    storage,
    getStatus: () => status,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    retry(state: DeviceState) { storage.setItem(deviceStorageKey, { state: selectDeviceState(state), version: deviceStateVersion }); },
    replace(state: DeviceState) {
      const validated = normalizeDeviceState(state, true);
      // Write first: a failed restore must leave the current working state and original storage intact.
      write(deviceStorageKey, { state: validated, version: deviceStateVersion });
      return validated;
    },
  };
}

export const deviceStorage = createDeviceStorage(() => window.localStorage);
