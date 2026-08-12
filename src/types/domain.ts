export type CoordinateReferenceSystem = "GCJ-02" | "WGS84";
export type VerificationStatus = "draft" | "source-checked" | "field-checked";
export type WorkflowStatus = "idea" | "planned" | "captured" | "published";
export type RouteMode = "day" | "night" | "sunrise" | "sunset" | "asmr";
export type CaptureStyle = "scenic-drive" | "rain-walk" | "stationary-nature";
export type BestTime =
  "sunrise" | "morning" | "golden-hour" | "sunset" | "blue-hour" | "night";
export type Weather = "sunny" | "cloudy" | "after-rain" | "fog" | "rain";
export type SoundCharacter =
  "waves" | "water" | "birds" | "urban" | "traffic" | "mixed";

export interface Source {
  title: string;
  url: string;
  accessedAt: string;
  supports: Array<
    "existence" | "address" | "coordinate" | "access" | "shooting-value"
  >;
}

export interface Location {
  id: string;
  name: string;
  province: string;
  city: string;
  type:
    | "coast"
    | "city-night"
    | "waterfall"
    | "stream"
    | "forest"
    | "mountain"
    | "river"
    | "lake"
    | "landmark";
  coordinate: { lat: number; lng: number; crs: CoordinateReferenceSystem };
  access: { mode: "drive" | "park-and-walk"; note: string };
  shooting: {
    bestTimes: BestTime[];
    bestWeather: Weather[];
    modes: Array<
      "photo" | "driving-video" | "tripod-video" | "timelapse" | "asmr"
    >;
    advice: string;
  };
  soundEnvironment: {
    character: SoundCharacter[];
    noiseRisk: "low" | "medium" | "high";
    crowdRisk: "low" | "medium" | "high";
    weatherSensitivity: string;
    recordingAdvice: string;
  };
  verification: { status: VerificationStatus; sources: Source[] };
}

export interface CameraPreset {
  id: string;
  camera: string;
  scene:
    | "coast-sunset"
    | "city-night-driving"
    | "city-night-tripod"
    | "forest-stream-static"
    | "daylight-walk"
    | "rain-walk"
    | "blue-hour-walk";
  settings: {
    resolution: string;
    fps: number;
    shutter: string;
    iso: { min: number; max: number };
    whiteBalanceKelvin: number;
    aperture?: string;
    profile?: string;
    codec?: string;
    colorDepth?: string;
    exposureCompensation?: string;
    focus?: string;
    stabilization?: string;
    sharpness?: number;
    noiseReduction?: number;
    audio?: string;
    filter?: string;
  };
  notes: string;
  setup?: string[];
  fieldChecks?: string[];
  sourceUrl?: string;
}

export interface Route {
  id: string;
  name: string;
  province: string;
  cities: string[];
  type:
    | "coast"
    | "city-night"
    | "mountain"
    | "forest"
    | "waterfall"
    | "river"
    | "lake";
  captureStyle: CaptureStyle;
  executionMode?: "drive-only";
  modes: RouteMode[];
  estimatedDurationMinutes: number;
  waypointLocationIds: string[];
  best: {
    seasons: Array<"spring" | "summer" | "autumn" | "winter">;
    times: BestTime[];
    weather: Weather[];
  };
  cameraPresetIds: string[];
  shootAdvice: string;
  scores: {
    visual: number;
    road: number;
    parking: number;
    safety: number;
    youtubePotential: number;
  };
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
  | {
      status: "ready";
      routeId: string;
      distanceMeters: number;
      durationSeconds: number;
      tollsYuan: number;
      hasRestriction: boolean;
    }
  | { status: "error"; routeId: string; message: string };

export interface LocalShootPlan {
  id: string;
  routeId: string;
  scheduledDate: string;
  objective: string;
  status: WorkflowStatus;
  createdAt: string;
}

export type VideoProjectStatus =
  | "planning"
  | "ready"
  | "shooting"
  | "ingest"
  | "editing"
  | "review"
  | "published";
export type VideoChannelMode = "vision" | "ambience" | "dual";
export interface ProjectShot {
  id: string;
  locationId: string;
  title: string;
  purpose:
    | "establishing"
    | "movement"
    | "detail"
    | "sound"
    | "transition"
    | "thumbnail";
  devicePresetId?: string;
  targetSeconds: number;
  completed: boolean;
  captureStatus: "pending" | "captured" | "missed" | "waived";
  note: string;
}
export interface ProjectPackItem {
  id: string;
  group: "route" | "gear" | "weather" | "safety" | "sound" | "storage";
  title: string;
  completed: boolean;
}
export interface ProjectWorkflowItem {
  id: string;
  title: string;
  completed: boolean;
  note: string;
}
export interface ProjectMediaBatch {
  id: string;
  label: string;
  sourceDevice: string;
  storageCard: string;
  fileCount: number;
  totalGB: number;
  locationIds: string[];
  primaryBackup: boolean;
  secondaryBackup: boolean;
  verified: boolean;
  note: string;
}
export interface ProjectMusicTrack {
  id: string;
  title: string;
  platform: string;
  licenseStatus: "candidate" | "licensed" | "clearlisted";
  attribution: string;
  licenseReference: string;
  channel: "vision";
}
export interface ProjectPublishPackage {
  visionTitle: string;
  ambienceTitle: string;
  description: string;
  chapters: string;
  thumbnailNote: string;
  hdrVerified: boolean;
  visionPublished: boolean;
  ambiencePublished: boolean;
}
export interface ProjectRetrospective {
  routeNote: string;
  cameraNote: string;
  editNote: string;
  performanceNote: string;
  nextAction: string;
  metrics: {
    views7d: number;
    clickThroughRate: number;
    averageViewMinutes: number;
    averagePercentageViewed: number;
    bestMoment: string;
    dropoffMoment: string;
  };
}
export interface LocalVideoProject {
  id: string;
  planId?: string;
  routeId: string;
  title: string;
  objective: string;
  scheduledDate: string;
  channelMode: VideoChannelMode;
  status: VideoProjectStatus;
  shots: ProjectShot[];
  packItems: ProjectPackItem[];
  ingestItems: ProjectWorkflowItem[];
  mediaBatches: ProjectMediaBatch[];
  musicTracks: ProjectMusicTrack[];
  deliveryItems: ProjectWorkflowItem[];
  publish: ProjectPublishPackage;
  retrospective: ProjectRetrospective;
  createdAt: string;
  updatedAt: string;
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

export type DavinciStageId =
  | "media"
  | "photo"
  | "cut"
  | "edit"
  | "fusion"
  | "color"
  | "fairlight"
  | "deliver";
export interface DavinciStage {
  id: DavinciStageId;
  label: string;
  englishLabel: string;
  summary: string;
  output: string;
  tasks: string[];
}
export interface DavinciGradePreset {
  id: string;
  name: string;
  scene: string;
  accent: string;
  intent: string;
  exposure: string;
  whiteBalance: string;
  contrast: string;
  saturation: string;
  nodeAdjustments: string[];
  cautions: string[];
}
export interface DavinciTutorialStep {
  id: string;
  title: string;
  workspace: DavinciStageId;
  purpose: string;
  actions: string[];
  visual: "project" | "media" | "timeline" | "color" | "audio" | "deliver";
  checkpoint: string;
}
export interface DavinciWorkflow {
  schemaVersion: "1.1.0";
  id: string;
  name: string;
  product: string;
  sourceUrl: string;
  stages: DavinciStage[];
  gradePresets: DavinciGradePreset[];
  beginnerTutorial: DavinciTutorialStep[];
}
export interface LocalPostTask {
  id: string;
  workflowId: string;
  stageId: DavinciStageId;
  title: string;
  completed: boolean;
}
export interface LocalPostProject {
  workflowId: string;
  videoProjectId?: string;
  planId?: string;
  routeId?: string;
  title: string;
  createdAt: string;
}
export interface LocalGpxTrack {
  id: string;
  name: string;
  sourceCrs: "WGS84";
  points: Array<{ lat: number; lng: number; crs: CoordinateReferenceSystem }>;
  importedAt: string;
}
