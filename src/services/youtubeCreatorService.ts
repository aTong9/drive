import data from "../../data/youtube-creators.json" with { type: "json" };

export type CreatorCategory = "scenic-drive" | "rain-walk" | "stationary-nature" | "urban-walk" | "guided-walk" | "cinematic-landscape";

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

export const youtubeCreatorResearch = data as { schemaVersion: "1.0.0"; methodology: string; accessedAt: string; creators: YoutubeCreator[] };
