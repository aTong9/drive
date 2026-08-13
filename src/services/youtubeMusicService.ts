import data from "../../data/youtube-music-library.json" with { type: "json" };

export type MusicFamily = "piano" | "lofi" | "chillhop" | "jazz";
export type MusicScene = "countryside" | "rain" | "sunrise" | "city-night" | "road-driving" | "blue-hour" | "urban";
export type MusicRisk = "low" | "medium" | "high";

export interface MusicCategory {
  id: string;
  family: MusicFamily;
  name: string;
  description: string;
  scenes: MusicScene[];
  searchTerms: string[];
  mixingNotes: string;
}

export interface MusicPlatform {
  id: string;
  name: string;
  kind: "youtube-native" | "subscription" | "freemium" | "per-track" | "creator-library";
  importMode: "download-import" | "platform-only";
  url: string;
  catalogFit: string;
  supportedCategoryIds: string[];
  license: {
    youtubeUse: "allowed-with-track-terms" | "allowed-with-active-license" | "allowed-with-license";
    cost: "free" | "free-or-paid" | "subscription" | "per-track-or-subscription";
    attribution: "track-dependent" | "not-generally-required" | "credit-or-safelist";
    contentId: "low" | "clearlist-required" | "code-or-clearlist" | "track-dependent";
    monetization: "allowed" | "allowed-with-track-terms" | "not-covered";
    audioEditing: "basic-edits" | "derivatives-allowed" | "sync-only" | "track-dependent";
    risk: MusicRisk;
    notes: string;
  };
  workflow: string[];
  evidence: Array<{ title: string; url: string; supports: Array<"youtube-use" | "attribution" | "content-id" | "pricing" | "territory"> }>;
}

export interface YoutubeMusicLibrary {
  schemaVersion: "1.3.0";
  accessedAt: string;
  methodology: string;
  categories: MusicCategory[];
  platforms: MusicPlatform[];
  albums: MusicAlbum[];
  tracks: MusicTrack[];
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  platformId: string;
  categoryIds: string[];
  scenes: MusicScene[];
  durationSeconds: number;
  description: string;
  listenUrl: string;
  downloadUrl: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
}

export interface MusicAlbum {
  id: string;
  title: string;
  artist: string;
  platformId: string;
  kind: "official-album" | "curated-collection";
  categoryIds: string[];
  scenes: MusicScene[];
  description: string;
  trackHighlights: string[];
  listenUrl: string;
  downloadUrl: string;
  downloadLabel: string;
  credit: string;
  licenseNote: string;
}

export const youtubeMusicLibrary = data as YoutubeMusicLibrary;

export function filterMusicPlatforms(input: { categoryId?: string; scene?: MusicScene; risk?: MusicRisk; query?: string }) {
  const categoryIdsForScene = input.scene
    ? new Set(youtubeMusicLibrary.categories.filter((category) => category.scenes.includes(input.scene!)).map((category) => category.id))
    : null;
  const needle = input.query?.trim().toLowerCase() ?? "";
  return youtubeMusicLibrary.platforms.filter((platform) => {
    const categoryMatch = !input.categoryId || platform.supportedCategoryIds.includes(input.categoryId);
    const sceneMatch = !categoryIdsForScene || platform.supportedCategoryIds.some((id) => categoryIdsForScene.has(id));
    const riskMatch = !input.risk || platform.license.risk === input.risk;
    const searchable = [platform.name, platform.catalogFit, platform.license.notes, ...platform.supportedCategoryIds].join(" ").toLowerCase();
    return categoryMatch && sceneMatch && riskMatch && (!needle || searchable.includes(needle));
  });
}

export function filterMusicAlbums(input: { platformId?: string; family?: MusicFamily; categoryId?: string; scene?: MusicScene; query?: string }) {
  const categoryIds = input.family
    ? new Set(youtubeMusicLibrary.categories.filter((category) => input.family === "lofi" ? category.family === "lofi" || category.family === "chillhop" : category.family === input.family).map((category) => category.id))
    : null;
  const needle = input.query?.trim().toLowerCase() ?? "";
  return youtubeMusicLibrary.albums.filter((album) => {
    const platformMatch = !input.platformId || album.platformId === input.platformId;
    const familyMatch = !categoryIds || album.categoryIds.some((id) => categoryIds.has(id));
    const categoryMatch = !input.categoryId || album.categoryIds.includes(input.categoryId);
    const sceneMatch = !input.scene || album.scenes.includes(input.scene);
    const searchable = [album.title, album.artist, album.description, ...album.trackHighlights].join(" ").toLowerCase();
    return platformMatch && familyMatch && categoryMatch && sceneMatch && (!needle || searchable.includes(needle));
  });
}

export function filterMusicTracks(input: { platformId?: string; family?: MusicFamily; categoryId?: string; scene?: MusicScene; query?: string }) {
  const categoryIds = input.family
    ? new Set(youtubeMusicLibrary.categories.filter((category) => input.family === "lofi" ? category.family === "lofi" || category.family === "chillhop" : category.family === input.family).map((category) => category.id))
    : null;
  const needle = input.query?.trim().toLowerCase() ?? "";
  return youtubeMusicLibrary.tracks.filter((track) => {
    const platformMatch = !input.platformId || track.platformId === input.platformId;
    const familyMatch = !categoryIds || track.categoryIds.some((id) => categoryIds.has(id));
    const categoryMatch = !input.categoryId || track.categoryIds.includes(input.categoryId);
    const sceneMatch = !input.scene || track.scenes.includes(input.scene);
    const searchable = [track.title, track.artist, track.description].join(" ").toLowerCase();
    return platformMatch && familyMatch && categoryMatch && sceneMatch && (!needle || searchable.includes(needle));
  });
}
