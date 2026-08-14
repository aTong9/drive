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
  const projectTitle = project ? (isVision ? project.publish.visionTitle : project.publish.ambienceTitle) : "";
  const titles: Record<YoutubeUploadTemplate, string> = {
    search: projectTitle || `${routeName} | ${isVision ? "4K HDR Scenic Drive" : "Natural Ambience 4K HDR"}`,
    immersive: `${routeName} — ${isVision ? "A Cinematic 4K HDR Journey" : "Real Nature Sounds for Sleep & Focus | 4K"}`,
    archive: `${cities.join(" · ") || routeName} ${isVision ? "Scenic Route Film" : "Ambient Soundscape"} | 4K HDR Archive`,
  };
  const baseDescription = project && route ? generateProjectDescription(project, route) : `${routeName}\n\n${isVision ? "4K HDR 路线影像与授权背景音乐。" : "真实道路与自然环境声，无旁白。"}\n\n拍摄日期、路线和音乐署名请在发布前补齐。`;
  const descriptionLead: Record<YoutubeUploadTemplate, string> = {
    search: `地点：${routeName}\n内容：${isVision ? "4K HDR 风景路线影像" : "真实自然与道路环境声"}`,
    immersive: isVision ? "放慢节奏，跟随这段电影感旅程进入沿途的光线与空间。" : "戴上耳机，进入没有旁白和音乐干扰的真实环境声场。",
    archive: `路线影像档案｜${cities.join(" → ") || routeName}\n建议使用电视或高分辨率显示器观看。`,
  };
  const description = `${descriptionLead[template]}\n\n${baseDescription}`;
  const tags = [...new Set([routeName, ...cities, "4K HDR", isVision ? "scenic drive" : "nature ambience", isVision ? "cinematic travel" : "ASMR nature", "relaxing video"])]
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    title: titles[template],
    description,
    tags,
    playlist: isVision ? "aBin Vision · 4K HDR Journeys" : "aBin Ambience · Natural Road Sounds",
    category: "Travel & Events",
    language: "English",
    visibility: "Private",
    audience: "No, it's not made for kids",
    license: "Standard YouTube License",
    thumbnail: project?.publish.thumbnailNote || "使用真实视频单帧，只保留小型 4K HDR 标识",
    checks: [
      "先以 Private 上传，等待 2160p HDR 与版权检查完成后再公开",
      "确认 BT.2020 / PQ、HEVC Main10 与响度、True Peak 元数据",
      ...(isVision ? ["逐曲确认音乐许可、Content ID 状态和署名文本"] : ["确认无未授权音乐，环境声未被过度降噪或循环伪造"]),
      "补齐拍摄日期、路线章节、封面、播放列表、结束画面和字幕语言",
      "手机、电脑与电视端各试听一次，再设置公开或定时发布",
    ],
  };
}
