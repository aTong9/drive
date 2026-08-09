export type CoordinateReferenceSystem = "GCJ-02";
export type VerificationStatus = "draft" | "source-checked" | "field-checked";
export type WorkflowStatus = "idea" | "planned" | "captured" | "published";
export type RouteMode = "day" | "night" | "sunrise" | "sunset" | "asmr";
export type BestTime = "sunrise" | "morning" | "golden-hour" | "sunset" | "blue-hour" | "night";
export type Weather = "sunny" | "cloudy" | "after-rain" | "fog" | "rain";

export interface Source {
  title: string;
  url: string;
  accessedAt: string;
  supports: Array<"existence" | "address" | "coordinate" | "access" | "shooting-value">;
}

export interface Location {
  id: string;
  name: string;
  province: string;
  city: string;
  type: "coast" | "city-night" | "waterfall" | "stream" | "forest" | "mountain" | "river" | "lake" | "landmark";
  coordinate: { lat: number; lng: number; crs: CoordinateReferenceSystem };
  access: { mode: "drive" | "park-and-walk"; note: string };
  shooting: {
    bestTimes: BestTime[];
    bestWeather: Weather[];
    modes: Array<"photo" | "driving-video" | "tripod-video" | "timelapse" | "asmr">;
    advice: string;
  };
  verification: { status: VerificationStatus; sources: Source[] };
}

export interface CameraPreset {
  id: string;
  camera: string;
  scene: "coast-sunset" | "city-night-driving" | "city-night-tripod";
  settings: {
    resolution: string;
    fps: number;
    shutter: string;
    iso: { min: number; max: number };
    whiteBalanceKelvin: number;
    aperture?: string;
    profile?: string;
  };
  notes: string;
}

export interface Route {
  id: string;
  name: string;
  province: string;
  cities: string[];
  type: "coast" | "city-night" | "mountain" | "forest" | "waterfall" | "river" | "lake";
  modes: RouteMode[];
  estimatedDurationMinutes: number;
  waypointLocationIds: string[];
  best: { seasons: Array<"spring" | "summer" | "autumn" | "winter">; times: BestTime[]; weather: Weather[] };
  cameraPresetIds: string[];
  shootAdvice: string;
  scores: { visual: number; road: number; parking: number; safety: number; youtubePotential: number };
  status: WorkflowStatus;
  verification: { status: VerificationStatus; note: string };
}

export interface ShootPlan {
  id: string;
  routeId: string;
  scheduledDate: string;
  status: WorkflowStatus;
  equipmentPresetIds: string[];
  objective: string;
}

export interface Catalog {
  schemaVersion: "1.0.0";
  locations: Location[];
  cameraPresets: CameraPreset[];
  routes: Route[];
  shootPlans: ShootPlan[];
}

export interface PlanRequest {
  mode: RouteMode;
  maxDurationMinutes: number;
  city?: string;
}

export interface ResolvedRoute {
  route: Route;
  waypoints: Location[];
  cameraPresets: CameraPreset[];
}

export type DrivingSummary =
  | { status: "loading"; routeId: string }
  | { status: "ready"; routeId: string; distanceMeters: number; durationSeconds: number; tollsYuan: number; hasRestriction: boolean }
  | { status: "error"; routeId: string; message: string };

export interface LocalShootPlan {
  id: string;
  routeId: string;
  scheduledDate: string;
  objective: string;
  status: WorkflowStatus;
  createdAt: string;
}

export interface FieldCheck {
  locationId: string;
  visitedAt: string;
  parkingNote: string;
  lightNote: string;
  soundNote: string;
  overallNote: string;
  updatedAt: string;
}
