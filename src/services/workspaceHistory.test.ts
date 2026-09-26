import assert from "node:assert/strict";
import test from "node:test";
import { connectWorkspaceNavigation } from "../app/workspaceNavigation.js";
import { usePlannerStore } from "../app/store.js";

test("browser history restores filters and pages and invalidates outstanding location requests", async () => {
  const initial = usePlannerStore.getState();
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const location = { href: "https://example.test/drive/?q=湖&page=2" };
  const history: string[] = [];
  let onPopState: (() => void) | undefined;
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    location,
    history: {
      pushState: (_data: unknown, _title: string, href: string) => { history.push(href); location.href = href; },
      replaceState: (_data: unknown, _title: string, href: string) => { location.href = href; },
    },
    addEventListener: (_name: string, listener: () => void) => { onPopState = listener; },
    removeEventListener: () => { onPopState = undefined; },
  } });
  const disconnect = connectWorkspaceNavigation();
  try {
    assert.equal(usePlannerStore.getState().locationBrowse.locationPage, 2);
    const savedUrl = location.href;
    usePlannerStore.getState().setView("plans");
    await Promise.resolve();
    assert.equal(new URL(location.href).searchParams.get("view"), "plans");
    assert.equal(history.length, 1);
    const requestVersion = usePlannerStore.getState().routeOpenVersion;
    location.href = savedUrl;
    onPopState?.();
    await Promise.resolve();
    assert.equal(usePlannerStore.getState().view, "locations");
    assert.equal(usePlannerStore.getState().locationBrowse.query, "湖");
    assert.equal(usePlannerStore.getState().locationBrowse.locationPage, 2);
    assert.ok(usePlannerStore.getState().routeOpenVersion > requestVersion);
    assert.equal(location.href, savedUrl);
    assert.equal(history.length, 1);
  } finally {
    disconnect();
    usePlannerStore.setState(initial, true);
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
