import { useLayoutEffect, useRef } from "react";

const positions = new Map<string, number>();
export function useScrollMemory<T extends HTMLElement>(key: string) {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.scrollTop = positions.get(key) ?? 0;
    return () => { positions.set(key, element.scrollTop); };
  }, [key]);
  return ref;
}
