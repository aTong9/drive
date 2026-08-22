import data from "../../data/youtube-creators.json" with { type: "json" };

export type CreatorCategory =
  | "scenic-drive"
  | "rain-walk"
  | "stationary-nature"
  | "urban-walk"
  | "guided-walk"
  | "cinematic-landscape"
  | "nature-ambience"
  | "ambient-cinema"
  | "asmr-nature";

export interface YoutubeCreator {
  id: string;
  name: string;
  region: string;
  category: CreatorCategory;
  channelUrl: string;
  positioning: string;
  representative: { title: string; url: string; observedPerformance: string };
  whyItWorks: string[];
  patterns: string[];
  caution: string;
  evidence: Array<{ title: string; url: string }>;
}

export const youtubeCreatorResearch = data as {
  schemaVersion: "1.1.0";
  methodology: string;
  accessedAt: string;
  creators: YoutubeCreator[];
};

export function socialBladeUrl(channelUrl: string) {
  const handle = youtubeHandle(channelUrl);
  return handle
    ? `https://socialblade.com/youtube/handle/${handle.toLowerCase()}`
    : "https://socialblade.com/youtube/";
}

export function youtubeHandle(channelUrl: string) {
  return /youtube\.com\/@([^/?]+)/i.exec(channelUrl)?.[1];
}

export function viewStatsUrl(channelUrl: string) {
  const handle = youtubeHandle(channelUrl);
  return handle
    ? `https://www.viewstats.com/@${handle.toLowerCase()}/channelytics`
    : "https://www.viewstats.com/";
}

export const creatorAnalyticsTools = {
  hypeAuditor: "https://hypeauditor.com/free-tools/youtube-pricing-calculator/",
  noxInfluencer: "https://www.noxinfluencer.com/youtube/channel-calculator",
} as const;

export function estimateSocialBladeEarnings(monthlyViews: number) {
  const views = Number.isFinite(monthlyViews) ? Math.max(0, monthlyViews) : 0;
  return {
    monthlyLow: (views / 1000) * 0.25,
    monthlyHigh: (views / 1000) * 4,
    yearlyLow: (views / 1000) * 0.25 * 12,
    yearlyHigh: (views / 1000) * 4 * 12,
  };
}
