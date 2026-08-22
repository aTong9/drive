import type { AppearanceMode } from "./ordinaryCreatorModels.js";

export const ordinaryCreatorCatalogMeta = {
  modelCount: 591,
  discoveryCount: 291,
  collectionCount: 62,
} as const;

export const appearanceModeLabels: Record<AppearanceMode, string> = {
  "on-camera": "露脸主导",
  faceless: "完全不露脸",
  hybrid: "可露脸／可不露脸",
};
