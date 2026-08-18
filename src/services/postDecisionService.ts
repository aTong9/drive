import type { DavinciGradePreset } from "../types/domain.js";

export type PostInputProfile = "slog3" | "hlg" | "rec709";
export type PostDelivery = "hdr10" | "hlg" | "sdr";

export interface PostPipelineProfile {
  id: string;
  name: string;
  input: string;
  project: string;
  timeline: string;
  output: string;
  render: string;
  audio: string;
  checks: string[];
  warnings: string[];
}

export const postPipelineProfiles: PostPipelineProfile[] = [
  { id: "slog3-hdr10", name: "S-Log3 → HDR10", input: "Sony S-Gamut3.Cine / S-Log3", project: "DaVinci YRGB Color Managed", timeline: "DaVinci Wide Gamut / Intermediate", output: "Rec.2100 ST2084 · Rec.2020 · 1000 nits", render: "H.265 Main10 · 4K · 80–120 Mb/s", audio: "AAC 48 kHz Stereo · 320 kb/s", checks: ["逐镜确认输入色彩空间", "用HDR波形控制普通白与峰值", "MediaInfo核验10-bit、BT.2020和PQ", "YouTube显示2160p HDR后再公开"], warnings: ["不要把S-Log3直接当Rec.709解释", "HDR标签不能代替正确的色彩转换"] },
  { id: "hlg-hdr10", name: "HLG → HDR10", input: "Rec.2100 HLG / BT.2020", project: "DaVinci YRGB Color Managed", timeline: "DaVinci Wide Gamut / Intermediate", output: "Rec.2100 ST2084 · Rec.2020 · 1000 nits", render: "H.265 Main10 · 4K · 80–120 Mb/s", audio: "AAC 48 kHz Stereo · 320 kb/s", checks: ["将素材明确标记为Rec.2100 HLG", "检查HLG到PQ的亮度映射", "避免重复套用HLG显示LUT", "平台端确认HDR标识"], warnings: ["HLG与PQ是不同传递函数", "不要仅修改输出标签完成转换"] },
  { id: "hlg-hlg", name: "HLG → HLG HDR", input: "Rec.2100 HLG / BT.2020", project: "DaVinci YRGB Color Managed", timeline: "Rec.2100 HLG", output: "Rec.2100 HLG · BT.2020", render: "H.265 Main10 · 4K 29.97p · 10-bit · Rec.2020 / HLG", audio: "AAC 48 kHz Stereo · 320 kb/s", checks: ["将MR3素材明确标记为Rec.2100 HLG", "时间线与输出均保持Rec.2100 HLG", "MediaInfo核验10-bit、BT.2020与HLG标签", "YouTube显示2160p HDR后再公开"], warnings: ["不要套用MR1/MR2的S-Log3输入设置", "除非明确需要PQ母版，否则MR3优先保持HLG到HLG"] },
  { id: "rec709-sdr", name: "Rec.709 → SDR", input: "Rec.709 Gamma 2.4 / Scene", project: "DaVinci YRGB Color Managed", timeline: "DaVinci Wide Gamut / Intermediate", output: "Rec.709 Gamma 2.4", render: "H.265 / H.264 · 4K · 45–80 Mb/s", audio: "AAC 48 kHz Stereo · 320 kb/s", checks: ["确认输入Gamma而非猜测", "波形白位不硬截", "普通SDR显示器全片回看", "导出文件标签保持Rec.709"], warnings: ["SDR项目不要照搬1000 nits目标", "避免把显示LUT烘焙两次"] },
  { id: "log-sdr", name: "Log → Rec.709 SDR", input: "Camera Log / Wide Gamut", project: "DaVinci YRGB Color Managed", timeline: "DaVinci Wide Gamut / Intermediate", output: "Rec.709 Gamma 2.4", render: "H.265 / H.264 · 4K · 45–80 Mb/s", audio: "AAC 48 kHz Stereo · 320 kb/s", checks: ["准确指定相机输入色彩空间", "先技术转换再风格化", "检查高光映射与饱和度压缩", "SDR设备全片回看"], warnings: ["不要直接用LUT替代输入转换", "HDR高光必须映射到SDR范围"] },
];

export function recommendPostPipeline(input: PostInputProfile, delivery: PostDelivery) {
  if (delivery === "hlg") return postPipelineProfiles.find((item) => item.id === "hlg-hlg")!;
  if (delivery === "hdr10") return postPipelineProfiles.find((item) => item.id === (input === "hlg" ? "hlg-hdr10" : "slog3-hdr10"))!;
  return postPipelineProfiles.find((item) => item.id === (input === "rec709" ? "rec709-sdr" : "log-sdr"))!;
}

export function renderStorageGb(bitrateMbps: number, durationMinutes: number) {
  return Math.max(0, bitrateMbps) * Math.max(0, durationMinutes) * 60 / 8 / 1000;
}

export function estimateRenderMinutes(durationMinutes: number, speedRatio: number) {
  if (speedRatio <= 0) return 0;
  return Math.max(0, durationMinutes) / speedRatio;
}

export function auditGradePreset(preset: DavinciGradePreset) {
  const warnings: string[] = [];
  if (!preset.nodeAdjustments.length) warnings.push("缺少可复现的节点顺序。");
  if (!/IRE|nit/i.test(preset.exposure)) warnings.push("曝光目标没有示波器或nits基准。");
  if (!preset.cautions.length) warnings.push("缺少适用边界与风险提醒。");
  return { score: Math.max(0, 100 - warnings.length * 20), warnings };
}
