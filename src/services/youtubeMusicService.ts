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
  kind: "youtube-native" | "subscription" | "freemium" | "per-track";
  importMode: "download-import" | "platform-only";
  url: string;
  catalogFit: string;
  supportedCategoryIds: string[];
  license: {
    youtubeUse: "allowed-with-track-terms" | "allowed-with-active-license" | "allowed-with-license";
    cost: "free" | "free-or-paid" | "subscription" | "per-track-or-subscription";
    attribution: "track-dependent" | "not-generally-required" | "credit-or-safelist";
    contentId: "low" | "clearlist-required" | "code-or-clearlist" | "track-dependent";
    risk: MusicRisk;
    notes: string;
  };
  workflow: string[];
  evidence: Array<{ title: string; url: string; supports: Array<"youtube-use" | "attribution" | "content-id" | "pricing" | "territory"> }>;
}

export interface YoutubeMusicLibrary {
  schemaVersion: "1.0.0";
  accessedAt: string;
  methodology: string;
  categories: MusicCategory[];
  platforms: MusicPlatform[];
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
