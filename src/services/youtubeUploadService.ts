import type { LocalVideoProject, ResolvedRoute } from "../types/domain.js";
import { generateProjectDescription } from "./videoProjectService.js";

export type YoutubeChannelVariant = "vision" | "ambience";
export type YoutubeUploadTemplate = "search" | "immersive" | "archive";

export interface YoutubeUploadGuide {
  title: string;
  description: string;
  tags: string[];
  playlist: string;
  category: "Travel & Events";
  language: "English";
  visibility: "Private";
  audience: "No, it's not made for kids";
  license: "Standard YouTube License";
  thumbnail: string;
  checks: string[];
}

export function buildYoutubeUploadGuide(project: LocalVideoProject | undefined, route: ResolvedRoute | undefined, variant: YoutubeChannelVariant, template: YoutubeUploadTemplate = "search"): YoutubeUploadGuide {
  const isVision = variant === "vision";
  const routeName = route?.route.name ?? project?.title ?? "本次路线";
  const cities = route?.route.cities ?? [];
  const primaryPlace = cities[0] || routeName;
  const projectTitle = project ? (isVision ? project.publish.visionTitle : project.publish.ambienceTitle) : "";
  const titles: Record<YoutubeUploadTemplate, string> = {
    search: projectTitle || `${routeName} | ${isVision ? "Cinematic Night Drive 4K HDR" : "Real Road Sounds 4K HDR — No Music, No Talking"}`,
    immersive: `${primaryPlace} at Night — ${isVision ? "A Cinematic Drive in 4K HDR" : "Immersive Road Ambience for Sleep & Focus | 4K HDR"}`,
    archive: `${cities.join(" → ") || routeName} | ${isVision ? "Night Drive Film" : "Authentic Road Soundscape"} · 4K HDR`,
  };
  const routeLine = cities.length ? cities.join(" → ") : routeName;
  const channelPromise = isVision
    ? "A cinematic night journey with authentic road ambience and carefully licensed music. The road sound remains part of the experience."
    : "An uninterrupted real-time journey with authentic road and environmental sounds. No music, no talking, no artificial sound loops.";
  const chinesePromise = isVision
    ? "电影感夜间路线影像，保留真实道路环境声并搭配已授权音乐。"
    : "真实道路与自然环境声，无音乐、无旁白、不使用伪造循环环境声。";
  const baseDescription = project && route ? generateProjectDescription(project, route) : "拍摄日期、章节、设备和音乐署名请在发布前补齐。";
  const descriptionLead: Record<YoutubeUploadTemplate, string> = {
    search: `${routeName} — filmed as a ${isVision ? "cinematic" : "natural-sound"} 4K HDR journey.`,
    immersive: isVision ? "Slow down and travel through the changing light, streets and atmosphere of this night drive." : "Put on headphones and settle into the unfiltered sound of the road for sleep, focus or quiet background viewing.",
    archive: `Route archive: ${routeLine}. Best viewed on a 4K HDR television or high-resolution display.`,
  };
  const description = `${descriptionLead[template]}\n${channelPromise}\n\nROUTE\n${routeLine}\n\nVIDEO\n4K HDR · ${isVision ? "Cinematic night drive · Licensed music + real road sounds" : "Real-time ambience · No music · No talking"}\n\n中文\n${chinesePromise}\n路线：${routeLine}\n\nCHAPTERS\n00:00 Preview\n00:45 Journey begins\n[发布前替换为真实章节]\n\n${baseDescription}\n\n#4KHDR #NightDrive #${isVision ? "CinematicDrive" : "RoadAmbience"}`;
  const tags = [...new Set([routeName, ...cities, primaryPlace, "4K HDR", "night drive", "scenic drive", isVision ? "cinematic drive" : "road ambience", isVision ? "cinematic travel" : "no music no talking", isVision ? "driving music" : "ASMR driving", "relaxing video"])]
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    title: titles[template],
    description,
    tags,
    playlist: isVision ? "aBin Vision · Cinematic Night Drives 4K HDR" : "aBin Ambience · Real Road Sounds 4K HDR",
    category: "Travel & Events",
    language: "English",
    visibility: "Private",
    audience: "No, it's not made for kids",
    license: "Standard YouTube License",
    thumbnail: project?.publish.thumbnailNote || `使用本期最有辨识度的真实夜景单帧；主体道路或地标位于画面中部，只保留角落小型 4K HDR 标识${isVision ? "，不添加情绪口号" : "，不添加 Sleep / ASMR 大字"}`,
    checks: [
      "先以 Private 上传，等待 2160p HDR 与版权检查完成后再公开",
      "确认 BT.2020 / PQ、HEVC Main10 与响度、True Peak 元数据",
      ...(isVision ? ["逐曲确认音乐许可、Content ID 状态和署名文本"] : ["确认无未授权音乐，环境声未被过度降噪或循环伪造"]),
      "标题前半段必须出现真实地点；不要同时堆叠 Relaxing、Sleep、ASMR、Study 等用途词",
      "将 00:45 和占位章节替换为成片真实时间码，删除所有方括号提示",
      "补齐拍摄日期、路线章节、封面、播放列表、结束画面和字幕语言",
      "手机、电脑与电视端各试听一次，再设置公开或定时发布",
    ],
  };
}
