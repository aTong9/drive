import type { CameraPreset } from "../types/domain.js";

export type CameraParameterKey = "resolution" | "fps" | "shutter" | "aperture" | "iso" | "whiteBalance" | "profile" | "codec" | "colorDepth" | "focus" | "stabilization" | "audio";

export const cameraParameterLinks: Record<CameraParameterKey, { glossaryId: string; label: string; short: string; why: string }> = {
  resolution: { glossaryId: "resolution", label: "分辨率", short: "每帧像素尺寸，4K不等于HDR。", why: "决定细节、裁切空间和处理负担。" },
  fps: { glossaryId: "frame-rate", label: "帧率", short: "每秒记录的完整画面数量。", why: "决定运动节奏、曝光时间和码率需求。" },
  shutter: { glossaryId: "shutter", label: "快门", short: "控制单帧曝光与运动模糊。", why: "30p通常从1/60起步，并兼顾频闪。" },
  aperture: { glossaryId: "shutter", label: "光圈", short: "控制进光、景深与镜头成像状态。", why: "F5.6适合白天风景清晰度，夜间需平衡进光。" },
  iso: { glossaryId: "log", label: "ISO", short: "感光增益，不是免费的亮度。", why: "过高会放大噪点；Log需尊重基础ISO。" },
  whiteBalance: { glossaryId: "gamut", label: "白平衡", short: "定义中性颜色和整体色温基准。", why: "固定K值可避免连续镜头自动漂移。" },
  profile: { glossaryId: "log", label: "色彩配置", short: "Log/HLG/标准画面属于不同采集曲线。", why: "必须匹配后期色彩管理与最终交付。" },
  codec: { glossaryId: "codec", label: "编码", short: "决定压缩方式；MP4/MOV只是封装。", why: "影响画质、文件大小、剪辑解码与兼容性。" },
  colorDepth: { glossaryId: "bit-depth", label: "色深/采样", short: "10-bit与4:2:2分别描述阶调和色度采样。", why: "Log调色和HDR至少应保留10-bit链路。" },
  focus: { glossaryId: "resolution", label: "对焦", short: "决定清晰主体如何被持续追踪。", why: "高分辨率不能挽救失焦，运动场景需先保证可靠。" },
  stabilization: { glossaryId: "proxy", label: "稳定", short: "机身、镜头、电子裁切和后期稳定各有代价。", why: "走拍与固定机位不能套用同一防抖策略。" },
  audio: { glossaryId: "channels", label: "收音", short: "声道、麦克风、增益和防风共同决定结果。", why: "环境音真实性比后期强降噪更重要。" },
};

export interface SceneGeneratorInput {
  device: string;
  light: "day" | "night" | "blue-hour";
  movement: "drive" | "walk" | "tripod";
  weather: "clear" | "cloudy" | "rain";
  nd: boolean;
  delivery: "hdr10" | "sdr";
  sound: "ambience" | "music";
}

export function recommendPreset(presets: CameraPreset[], input: SceneGeneratorInput) {
  const candidates = presets.filter((preset) => input.device === "全部设备" || preset.camera === input.device);
  const scored = candidates.map((preset) => {
    let score = 0;
    if (input.light === "day" && ["daylight-general", "daylight-walk", "forest-stream-static", "coast-sunset"].includes(preset.scene)) score += 4;
    if (input.light === "night" && ["city-night-driving", "city-night-tripod"].includes(preset.scene)) score += 4;
    if (input.light === "blue-hour" && ["blue-hour-walk", "coast-sunset"].includes(preset.scene)) score += 4;
    if (input.movement === "drive" && preset.scene === "city-night-driving") score += 3;
    if (input.movement === "walk" && preset.scene.includes("walk")) score += 3;
    if (input.movement === "tripod" && ["city-night-tripod", "forest-stream-static"].includes(preset.scene)) score += 3;
    if (input.weather === "rain" && preset.scene === "rain-walk") score += 5;
    if (input.delivery === "hdr10" && /log|hlg/i.test(preset.settings.profile ?? "")) score += 2;
    return { preset, score };
  }).sort((a, b) => b.score - a.score);
  const match = scored[0]?.preset;
  if (!match) return undefined;
  const adjustments = [
    input.light === "day" && !input.nd ? "无ND：先看95+斑马保护高光，必要时提高快门，不要让天空或白色物体不可恢复地过曝。" : "按预设快门起步，使用波形图和斑马线确认曝光。",
    input.weather === "rain" ? "开启可靠防雨和镜片检查；收音增加防风防水，避免雨滴直接敲击麦克风。" : "录制10秒测试并检查高光、对焦和环境声。",
    input.sound === "ambience" ? "环境音版保持真实立体声，不使用自动增益抽吸或过度降噪。" : "音乐版仍保留独立环境声母轨，后期再决定混合比例。",
    input.delivery === "hdr10" ? "保持10-bit Log/广色域采集，后期进入Rec.2100 PQ/HDR10链路。" : "最终Rec.709 SDR，避免仅修改标签而未进行色彩转换。",
  ];
  return { preset: match, adjustments };
}

export function shutterForFps(fps: number) {
  const denominator = Math.max(1, Math.round(fps * 2));
  return `1/${denominator}`;
}

export function estimateNdStops(evDifference: number) {
  return Math.max(0, Math.round(evDifference));
}

export function recordingStorageGb(bitrateMbps: number, durationMinutes: number) {
  if (!Number.isFinite(bitrateMbps) || !Number.isFinite(durationMinutes)) return 0;
  return Math.max(0, bitrateMbps) * Math.max(0, durationMinutes) * 60 / 8 / 1000;
}

export function recordingMinutesForStorage(storageGb: number, bitrateMbps: number) {
  if (!Number.isFinite(storageGb) || !Number.isFinite(bitrateMbps) || bitrateMbps <= 0) return 0;
  return Math.max(0, storageGb) * 8 * 1000 / bitrateMbps / 60;
}

export function flickerSafeShutters(fps: number, mainsHz: 50 | 60) {
  const target = Math.max(1, fps * 2);
  const candidates = Array.from({ length: 8 }, (_, index) => mainsHz * (index + 1))
    .filter((denominator) => denominator >= fps)
    .sort((a, b) => Math.abs(a - target) - Math.abs(b - target))
    .slice(0, 3);
  return candidates.map((denominator) => `1/${denominator}`);
}

export function auditCameraPreset(preset: CameraPreset) {
  const warnings: string[] = [];
  const strengths: string[] = [];
  const profile = preset.settings.profile ?? "";
  const colorDepth = preset.settings.colorDepth ?? "";
  if (/log|hlg/i.test(profile) && !/10.?bit/i.test(colorDepth)) warnings.push("Log/HLG方案未明确10-bit色深，调色和HDR链路存在断层风险。");
  else if (/10.?bit/i.test(colorDepth)) strengths.push("已明确10-bit采集，适合Log调色与HDR交付。");
  if (!preset.settings.codec) warnings.push("未记录编码格式，无法准确估算容量和剪辑负载。");
  if (!preset.settings.audio) warnings.push("未记录收音方式，环境音视频容易在现场遗漏监听与防风。");
  if (!preset.settings.zebra && /log|hlg/i.test(profile)) warnings.push("高动态范围方案未记录斑马线基准，现场高光保护依赖人工补充。");
  if (preset.settings.whiteBalanceKelvin > 0) strengths.push("白平衡使用固定K值，可减少连续镜头色温漂移。");
  if (preset.fieldChecks?.length) strengths.push(`包含${preset.fieldChecks.length}项现场核验。`);
  const score = Math.max(0, Math.min(100, 100 - warnings.length * 14));
  return { score, warnings, strengths };
}

export function clonePresetAsCustom(preset: CameraPreset, name: string): CameraPreset {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-").replace(/^-|-$/g, "");
  return { ...preset, id: `custom-${slug || "preset"}-${Date.now()}`, notes: `${name.trim() || "个人预设"}｜基于 ${preset.camera} ${preset.scene} 复制，可继续作为个人现场起点。` };
}
