export type CoordinateReferenceSystem = "GCJ-02" | "WGS84";
export type VerificationStatus = "draft" | "source-checked" | "field-checked";
export type WorkflowStatus = "idea" | "planned" | "captured" | "published";
export type RouteMode = "day" | "night" | "sunrise" | "sunset" | "asmr";
export type CaptureStyle = "scenic-drive" | "rain-walk" | "stationary-nature";
export type BestTime = "sunrise" | "morning" | "golden-hour" | "sunset" | "blue-hour" | "night";
export type Weather = "sunny" | "cloudy" | "after-rain" | "fog" | "rain";
export type SoundCharacter = "waves" | "water" | "birds" | "urban" | "traffic" | "mixed";

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
  soundEnvironment: { character: SoundCharacter[]; noiseRisk: "low" | "medium" | "high"; crowdRisk: "low" | "medium" | "high"; weatherSensitivity: string; recordingAdvice: string };
  verification: { status: VerificationStatus; sources: Source[] };
}

export interface CameraPreset {
  id: string;
  camera: string;
  scene: "coast-sunset" | "city-night-driving" | "city-night-tripod" | "forest-stream-static";
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
  captureStyle: CaptureStyle;
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
  schemaVersion: "2.0.0";
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
  | { status: "access-only"; routeId: string }
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

export type DavinciStageId = "media" | "photo" | "cut" | "edit" | "fusion" | "color" | "fairlight" | "deliver";
export interface DavinciStage { id: DavinciStageId; label: string; englishLabel: string; summary: string; output: string; tasks: string[] }
export interface DavinciWorkflow { schemaVersion: "1.0.0"; id: string; name: string; product: string; sourceUrl: string; stages: DavinciStage[] }
export interface LocalPostTask { id: string; workflowId: string; stageId: DavinciStageId; title: string; completed: boolean }
export interface LocalPostProject { workflowId: string; planId?: string; routeId?: string; title: string; createdAt: string }
export interface LocalGpxTrack { id: string; name: string; sourceCrs: "WGS84"; points: Array<{ lat: number; lng: number; crs: CoordinateReferenceSystem }>; importedAt: string }
