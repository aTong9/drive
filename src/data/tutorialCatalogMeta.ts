export const tutorialCatalogMeta = {
  resolve: { label: "DaVinci Resolve", count: 92 },
  capcut: { label: "剪映专业版", count: 76 },
  finalcut: { label: "Final Cut Pro", count: 76 },
} as const;

export const tutorialCatalogTotal = Object.values(tutorialCatalogMeta).reduce(
  (total, software) => total + software.count,
  0,
);
