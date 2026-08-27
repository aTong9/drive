import type { DavinciStageId } from "../types/domain.js";
import { resolvePracticalTutorials } from "./colorFinishingWorkflow.js";

export const resolveTutorialWorkspaceLabels: Record<DavinciStageId, string> = {
  media: "Media · 素材与代理",
  photo: "Photo · 图片处理",
  cut: "Cut · 快速剪辑",
  edit: "Edit · 精剪与版本",
  fusion: "Fusion · 合成与跟踪",
  color: "Color · 调色与画面修复",
  fairlight: "Fairlight · 声音修复与混音",
  deliver: "Deliver · 输出与归档",
};

const tutorialWorkspaceById: Record<
  (typeof resolvePracticalTutorials)[number]["id"],
  DavinciStageId
> = {
  "marker-cross-dissolve": "cut",
  "marker-match-cut": "cut",
  "j-l-cut": "edit",
  "broll-cover": "cut",
  "audio-crossfade": "fairlight",
  "beat-marker-edit": "cut",
  "foreground-occlusion-cut": "edit",
  "whip-pan-match": "edit",
  "dip-to-color": "edit",
  "smooth-cut-repair": "edit",
  "speed-ramp-transition": "edit",
  "transition-qc": "edit",
  "multicam-sync-edit": "edit",
  "stabilize-crop-qc": "edit",
  "dialogue-cleanup-fairlight": "fairlight",
  "subtitle-style-export": "deliver",
  "tracker-callout": "fusion",
  "adjustment-clip-version": "color",
  "voiceover-record": "fairlight",
  "project-archive-restore": "deliver",
  "transcription-rough-cut": "cut",
  "object-removal-clean-plate": "fusion",
  "gallery-still-shot-match": "color",
  "render-queue-versions": "deliver",
  "proxy-original-relink": "media",
  "vertical-social-version": "deliver",
  "fairlight-loudness-pass": "fairlight",
  "timeline-version-compare": "edit",
  "temporal-spatial-noise-reduction": "color",
  "fairlight-noise-reduction-ab": "fairlight",
  "fairlight-de-esser-dialogue": "fairlight",
};

export const resolveTutorialCatalog = resolvePracticalTutorials.map(
  (tutorial, index) => ({
    ...tutorial,
    number: index + 1,
    workspace: tutorialWorkspaceById[tutorial.id],
  }),
);

export function getResolveTutorialsForWorkspace(workspace: DavinciStageId) {
  return resolveTutorialCatalog.filter(
    (tutorial) => tutorial.workspace === workspace,
  );
}
