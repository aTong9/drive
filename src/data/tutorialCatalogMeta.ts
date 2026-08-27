export const tutorialCatalogMeta = {
  resolve: { label: "DaVinci Resolve", count: 31 },
  capcut: { label: "剪映专业版", count: 27 },
  finalcut: { label: "Final Cut Pro", count: 27 },
} as const;

export const tutorialCatalogTotal = Object.values(tutorialCatalogMeta).reduce(
  (total, software) => total + software.count,
  0,
);
