import type { AppView } from "./store.js";

type ViewPresentation = {
  title: string;
  description: string;
};

export const viewPresentation: Record<AppView, ViewPresentation> = {
  dashboard: {
    title: "创作工作台",
    description: "查看自驾视频创作项目、拍摄任务与后期进度。",
  },
  projects: {
    title: "视频项目",
    description: "从选题、拍摄到发布管理完整视频项目。",
  },
  explore: {
    title: "探索路线",
    description: "筛选真实、可执行的自驾摄影路线。",
  },
  plans: {
    title: "拍摄计划",
    description: "安排路线拍摄日程并管理现场任务。",
  },
  locations: {
    title: "地点库",
    description: "按地区浏览适合自驾摄影的地点与路线。",
  },
  cameras: {
    title: "相机参数库",
    description: "按设备和场景选择相机参数、对比方案与现场清单。",
  },
  post: {
    title: "视频后期工作台",
    description:
      "使用 DaVinci Resolve、剪映专业版与 Final Cut Pro 完成视频后期。",
  },
  longform: {
    title: "长片制作指南",
    description: "规划并执行长篇纪实、电影感和观察式视频项目。",
  },
  creators: {
    title: "创作者研究",
    description: "研究可复用的视频创作方向、案例和内容机制。",
  },
  music: {
    title: "音乐素材库",
    description: "筛选来源明确、适合视频发布的音乐素材。",
  },
  upload: {
    title: "YouTube 上传参数",
    description: "生成视频上传参数、双语元数据与发布检查清单。",
  },
};

export const moreWorkspaceViews = new Set<AppView>([
  "dashboard",
  "projects",
  "cameras",
  "longform",
  "creators",
  "music",
]);

export function applyViewMetadata(view: AppView) {
  const presentation = viewPresentation[view];
  document.title = `${presentation.title} · RoadLens Planner`;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", presentation.description);
}
