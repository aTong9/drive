/// <reference types="vite/client" />
/// <reference types="@amap/amap-jsapi-types" />

declare const __AMAP_KEY__: string;
declare const __AMAP_SECURITY_CODE__: string;

interface Window {
  _AMapSecurityConfig?: {
    securityJsCode?: string;
    serviceHost?: string;
  };
}

declare namespace AMap {
  interface DrivingOptions {
    map?: Map;
    policy?: number;
    hideMarkers?: boolean;
    showTraffic?: boolean;
    autoFitView?: boolean;
    extensions?: "base" | "all";
    outlineColor?: string;
    isOutline?: boolean;
  }

  interface DriveRoute {
    distance: number;
    time: number;
    tolls?: number;
    restriction?: number;
  }

  interface DrivingResult {
    routes: DriveRoute[];
    info: string;
  }

  class Driving {
    constructor(options?: DrivingOptions);
    search(
      origin: [number, number],
      destination: [number, number],
      options: { waypoints?: Array<[number, number]> },
      callback: (status: "complete" | "no_data" | "error", result: DrivingResult | string) => void
    ): void;
    clear(): void;
    setPolicy(policy: number): void;
  }
}
