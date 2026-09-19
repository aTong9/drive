import { useEffect, useState, type SetStateAction } from "react";

// Navigation memory only: drafts and production records belong in the persisted store.
const values = new Map<string, unknown>();
export function useSessionState<T>(key: string, initial: T | (() => T)) {
  const [value, setValue] = useState<T>(() => values.has(key) ? values.get(key) as T : typeof initial === "function" ? (initial as () => T)() : initial);
  useEffect(() => { values.set(key, value); }, [key, value]);
  return [value, setValue] as [T, (value: SetStateAction<T>) => void];
}
