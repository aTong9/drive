import type { CameraPreset } from "../types/domain.js";

export type CameraParameterKey =
  | "resolution"
  | "fps"
  | "shutter"
  | "aperture"
  | "iso"
  | "whiteBalance"
  | "profile"
  | "codec"
  | "colorDepth"
  | "focus"
  | "stabilization"
  | "audio";

export const cameraParameterLinks: Record<
  CameraParameterKey,
  { glossaryId: string; label: string; short: string; why: string }
> = {
  resolution: {
    glossaryId: "resolution",
    label: "分辨率",
    short: "每帧像素尺寸，4K不等于HDR。",
    why: "决定细节、裁切空间和处理负担。",
  },
  fps: {
    glossaryId: "frame-rate",
    label: "帧率",
    short: "每秒记录的完整画面数量。",
    why: "决定运动节奏、曝光时间和码率需求。",
  },
  shutter: {
    glossaryId: "shutter",
    label: "快门",
    short: "控制单帧曝光与运动模糊。",
    why: "30p通常从1/60起步，并兼顾频闪。",
  },
  aperture: {
    glossaryId: "shutter",
    label: "光圈",
    short: "控制进光、景深与镜头成像状态。",
    why: "F5.6适合白天风景清晰度，夜间需平衡进光。",
  },
  iso: {
    glossaryId: "log",
    label: "ISO",
    short: "感光增益，不是免费的亮度。",
    why: "过高会放大噪点；Log需尊重基础ISO。",
  },
  whiteBalance: {
    glossaryId: "gamut",
    label: "白平衡",
    short: "定义中性颜色和整体色温基准。",
    why: "固定K值可避免连续镜头自动漂移。",
  },
  profile: {
    glossaryId: "log",
    label: "色彩配置",
    short: "Log/HLG/标准画面属于不同采集曲线。",
    why: "必须匹配后期色彩管理与最终交付。",
  },
  codec: {
    glossaryId: "codec",
    label: "编码",
    short: "决定压缩方式；MP4/MOV只是封装。",
    why: "影响画质、文件大小、剪辑解码与兼容性。",
  },
  colorDepth: {
    glossaryId: "bit-depth",
    label: "色深/采样",
    short: "10-bit与4:2:2分别描述阶调和色度采样。",
    why: "Log调色和HDR至少应保留10-bit链路。",
  },
  focus: {
    glossaryId: "resolution",
    label: "对焦",
    short: "决定清晰主体如何被持续追踪。",
    why: "高分辨率不能挽救失焦，运动场景需先保证可靠。",
  },
  stabilization: {
    glossaryId: "proxy",
    label: "稳定",
    short: "机身、镜头、电子裁切和后期稳定各有代价。",
    why: "走拍与固定机位不能套用同一防抖策略。",
  },
  audio: {
    glossaryId: "channels",
    label: "收音",
    short: "声道、麦克风、增益和防风共同决定结果。",
    why: "环境音真实性比后期强降噪更重要。",
  },
};

export interface SceneGeneratorInput {
  device: string;
  light: "day" | "night" | "blue-hour";
  movement: "drive" | "walk" | "tripod";
  weather: "clear" | "cloudy" | "rain";
  nd: boolean;
  delivery: "hdr10" | "hlg" | "sdr";
  sound: "ambience" | "music";
  illumination?:
    | "harsh-sun"
    | "open-shade"
    | "overcast"
    | "sunset"
    | "city-night"
    | "dark-scene";
  motion?: "static" | "normal" | "fast";
  depth?: "deep" | "balanced" | "shallow";
  fps?: 24 | 25 | 30 | 50 | 60;
  shutterOverride?:
    | "auto"
    | "1/48"
    | "1/50"
    | "1/60"
    | "1/100"
    | "1/120"
    | "1/125"
    | "1/250"
    | "1/500";
  apertureOverride?:
    "auto" | "F1.4" | "F1.8" | "F2" | "F2.8" | "F4" | "F5.6" | "F8" | "F11";
  whiteBalanceOverride?:
    "auto" | 3200 | 3800 | 4200 | 4500 | 5000 | 5200 | 5600 | 6000 | 6500;
  isoMode?: "auto" | "manual";
  manualIso?: 50 | 100 | 200 | 400 | 800 | 1250 | 1600 | 3200 | 6400 | 12800;
  focusOverride?:
    "auto" | "afc-wide" | "afc-tracking" | "single-lock" | "manual";
  stabilizationOverride?: "auto" | "standard" | "active" | "off";
  zebraOverride?: "95+" | "100+" | "off";
  meteringOverride?: "multi" | "highlight" | "center";
  audioControl?: "auto" | "manual-low" | "manual-medium";
  focalLength?: "auto" | 16 | 20 | 24 | 28 | 35 | 50 | 85;
  resolutionOverride?: "auto" | "4k" | "1080p";
  recordingQuality?: "auto" | "422-10" | "420-10" | "420-8";
  codecOverride?: "auto" | "h265" | "h264" | "prores";
  exposureCompensation?: "auto" | "+0.3" | "0" | "-0.3" | "-0.7";
  cropMode?: "full" | "aps-c";
  proxy?: "off" | "on";
}

type CaptureProfileKind = "log" | "hlg" | "standard";

const deliveryRoutes = {
  hdr10: {
    id: "pq-hdr10",
    label: "HDR10 · PQ / ST2084",
    project: "Resolve 输出 Rec.2100 ST2084；10-bit、Rec.2020 与正确 PQ 元数据",
  },
  hlg: {
    id: "hlg-hdr",
    label: "HLG HDR · Rec.2100 HLG",
    project: "Resolve 保持 Rec.2100 HLG；10-bit、Rec.2020 与正确 HLG 标记",
  },
  sdr: {
    id: "rec709-sdr",
    label: "SDR · Rec.709 Gamma 2.4",
    project: "Resolve 输出 Rec.709 Gamma 2.4；不要只改标签伪装 HDR",
  },
} as const;

function captureProfileKind(profile = ""): CaptureProfileKind {
  if (/hlg/i.test(profile)) return "hlg";
  if (/log/i.test(profile)) return "log";
  return "standard";
}

function isoExposureGuide(preset: CameraPreset, input: SceneGeneratorInput) {
  const { min, max } = preset.settings.iso;
  const profileKind = captureProfileKind(preset.settings.profile);
  const illumination =
    input.illumination ??
    (input.light === "night"
      ? "city-night"
      : input.light === "blue-hour"
        ? "sunset"
        : input.weather === "cloudy"
          ? "overcast"
          : "open-shade");
  const guideByLight: Record<
    NonNullable<SceneGeneratorInput["illumination"]>,
    { multiplier: number; label: string }
  > = {
    "harsh-sun": { multiplier: 1, label: "正午强光" },
    "open-shade": { multiplier: 1, label: "白天开放阴影" },
    overcast: { multiplier: 1.6, label: "阴天" },
    sunset: { multiplier: 2.5, label: "日落/蓝调" },
    "city-night": { multiplier: 4, label: "有照明城市夜景" },
    "dark-scene": { multiplier: 8, label: "暗路/低照自然" },
  };
  const guide = guideByLight[illumination];
  const rawStart = min * guide.multiplier;
  const commonIsos = [
    50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250,
    1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800,
  ];
  const start = commonIsos.reduce(
    (best, value) =>
      Math.abs(value - rawStart) < Math.abs(best - rawStart) ? value : best,
    min,
  );
  const clampedStart = Math.max(min, Math.min(max, start));
  const recommendedMax = Math.max(
    clampedStart,
    Math.min(
      max,
      commonIsos.find(
        (value) =>
          value >= clampedStart * (illumination === "harsh-sun" ? 2 : 2.5),
      ) ?? max,
    ),
  );
  const profileNote =
    profileKind === "log"
      ? `Log 不能随意低于预设最低 ISO ${min}；优先用光圈、ND和灯光控制曝光。`
      : profileKind === "hlg"
        ? `HLG2 可从 ISO ${min} 起步；ISO 只是曝光增益，不会把 HLG 变成 HDR10/PQ。`
        : `优先保持低 ISO；若达到 ${recommendedMax} 仍不足，先评估光圈、快门和补光。`;
  return {
    illuminationLabel: guide.label,
    isoStart: clampedStart,
    isoRange: `${clampedStart}–${recommendedMax}`,
    isoRecommendation: `${guide.label}：ISO ${clampedStart} 起步，Auto 上限先设 ${recommendedMax}；预设允许总范围 ${min}–${max}。`,
    profileNote,
  };
}

export function buildIsoScenarioExamples(preset: CameraPreset) {
  const examples: Array<{
    illumination: NonNullable<SceneGeneratorInput["illumination"]>;
    note: string;
  }> = [
    {
      illumination: "harsh-sun",
      note: "先把 ISO 放在最低可用值，靠 ND 和光圈保护高光。",
    },
    {
      illumination: "open-shade",
      note: "主体与背景亮度差较小，最低 ISO 通常仍是首选。",
    },
    {
      illumination: "overcast",
      note: "云层变化会推动 Auto ISO，限制上限避免镜头间噪声突变。",
    },
    {
      illumination: "sunset",
      note: "亮度持续下降；先取下 ND，再逐步提高 ISO。",
    },
    {
      illumination: "city-night",
      note: "先保护灯牌和车灯，暗部不必全部抬亮。",
    },
    {
      illumination: "dark-scene",
      note: "达到建议上限后优先补光、开光圈或接受暗部，而非无限抬 ISO。",
    },
  ];
  return examples.map((item) => {
    const result = isoExposureGuide(preset, {
      device: preset.camera,
      light: ["city-night", "dark-scene"].includes(item.illumination)
        ? "night"
        : item.illumination === "sunset"
          ? "blue-hour"
          : "day",
      movement: "tripod",
      weather: item.illumination === "overcast" ? "cloudy" : "clear",
      nd: ["harsh-sun", "open-shade"].includes(item.illumination),
      delivery:
        captureProfileKind(preset.settings.profile) === "hlg" ? "hlg" : "hdr10",
      sound: "ambience",
      illumination: item.illumination,
    });
    return {
      ...item,
      label: result.illuminationLabel,
      start: result.isoStart,
      range: result.isoRange,
    };
  });
}

function buildExposureDecision(
  preset: CameraPreset,
  input: SceneGeneratorInput,
) {
  const fps = input.fps ?? preset.settings.fps;
  const motion = input.motion ?? "normal";
  const suggestedShutter =
    motion === "fast" ? `1/${Math.round(fps * 4)}` : shutterForFps(fps);
  const shutter =
    input.shutterOverride && input.shutterOverride !== "auto"
      ? input.shutterOverride
      : suggestedShutter;
  const fixedAperture =
    preset.settings.aperture &&
    /F1\.[0-9]|F2\.0/.test(preset.settings.aperture);
  const suggestedAperture = fixedAperture
    ? `${preset.settings.aperture}（设备固定光圈）`
    : input.depth === "shallow"
      ? "F2–F2.8（浅景深；重新确认对焦）"
      : input.depth === "deep"
        ? "F5.6–F8（风景层次；避免过度缩光圈）"
        : (preset.settings.aperture ?? "F4–F5.6");
  const aperture =
    input.apertureOverride &&
    input.apertureOverride !== "auto" &&
    !fixedAperture
      ? input.apertureOverride
      : suggestedAperture;
  const iso = isoExposureGuide(preset, input);
  const manualIso = input.isoMode === "manual" ? input.manualIso : undefined;
  const isoStart = manualIso ?? iso.isoStart;
  const isoRange = manualIso ? `${manualIso}（手动锁定）` : iso.isoRange;
  const whiteBalance =
    input.whiteBalanceOverride === "auto"
      ? "AWB 自动（连续长镜头不建议；容易产生色温漂移）"
      : typeof input.whiteBalanceOverride === "number"
        ? `${input.whiteBalanceOverride}K（手动锁定）`
        : preset.settings.whiteBalanceKelvin > 0
          ? `${preset.settings.whiteBalanceKelvin}K 起步并固定；跨光源重新白卡核验`
          : "手动白平衡并锁定";
  const compatibilityWarnings: string[] = [];
  if (
    manualIso &&
    (manualIso < preset.settings.iso.min || manualIso > preset.settings.iso.max)
  )
    compatibilityWarnings.push(
      `手动 ISO ${manualIso} 超出当前预设 ${preset.settings.iso.min}–${preset.settings.iso.max}；请改回可用范围或更换采集曲线。`,
    );
  if (
    fixedAperture &&
    input.apertureOverride &&
    input.apertureOverride !== "auto"
  )
    compatibilityWarnings.push(
      `${preset.camera} 当前预设使用固定光圈 ${preset.settings.aperture}，不能应用所选 ${input.apertureOverride}。`,
    );
  if (input.whiteBalanceOverride === "auto")
    compatibilityWarnings.push(
      "自动白平衡可能在连续镜头中漂移；环境视频和后期镜头匹配通常更适合固定 K 值。",
    );
  if (
    input.shutterOverride &&
    input.shutterOverride !== "auto" &&
    input.shutterOverride !== suggestedShutter
  )
    compatibilityWarnings.push(
      `已锁定 ${input.shutterOverride}，系统按 ${fps}p 与当前运动建议 ${suggestedShutter}；请试录检查运动模糊和频闪。`,
    );
  const focus =
    input.focusOverride && input.focusOverride !== "auto"
      ? (
          {
            "afc-wide": "AF-C 广域",
            "afc-tracking": "AF-C 跟踪主体",
            "single-lock": "单次对焦后锁定",
            manual: "手动对焦 + 放大确认",
          } as const
        )[input.focusOverride]
      : input.movement === "tripod"
        ? "单次对焦后锁定"
        : input.motion === "fast"
          ? "AF-C 跟踪主体"
          : "AF-C 广域";
  const stabilization =
    input.stabilizationOverride && input.stabilizationOverride !== "auto"
      ? (
          {
            standard: "Standard 标准防抖",
            active: "动态增强 / Active",
            off: "关闭（稳固三脚架）",
          } as const
        )[input.stabilizationOverride]
      : input.movement === "walk"
        ? "动态增强 / Active"
        : input.movement === "tripod"
          ? "关闭（稳固三脚架）"
          : "Standard 标准防抖";
  const zebra = input.zebraOverride ?? "95+";
  const metering = (
    {
      multi: "多重测光",
      highlight: "高光重点测光",
      center: "中央重点测光",
    } as const
  )[
    input.meteringOverride ?? (input.delivery === "sdr" ? "multi" : "highlight")
  ];
  const audio = (
    {
      auto: "自动增益（仅快速记录）",
      "manual-low": "手动低增益 · 预留突发声余量",
      "manual-medium": "手动中等增益 · 监听峰值",
    } as const
  )[
    input.audioControl ??
      (input.sound === "ambience" ? "manual-low" : "manual-medium")
  ];
  if (input.movement === "tripod" && stabilization.includes("动态增强"))
    compatibilityWarnings.push(
      "固定三脚架不建议使用动态增强防抖，可能造成构图漂移或画面呼吸。",
    );
  if (
    input.motion === "fast" &&
    ["单次对焦后锁定", "手动对焦 + 放大确认"].includes(focus)
  )
    compatibilityWarnings.push(
      "快速运动主体使用锁定或手动对焦容易脱焦；除非主体距离固定，否则优先 AF-C 跟踪。",
    );
  if (zebra === "off" && input.delivery !== "sdr")
    compatibilityWarnings.push(
      "HDR/Log/HLG 拍摄关闭斑马线会削弱高光保护；建议至少启用 95+ 并结合波形判断。",
    );
  if (input.audioControl === "auto" && input.sound === "ambience")
    compatibilityWarnings.push(
      "环境音长镜头使用自动增益可能出现底噪抽吸；建议监听后使用手动低增益。",
    );
  const suggestedFocal =
    input.movement === "drive"
      ? 24
      : input.movement === "walk"
        ? 24
        : input.depth === "shallow"
          ? 50
          : 35;
  const focal =
    input.focalLength && input.focalLength !== "auto"
      ? input.focalLength
      : suggestedFocal;
  const cropFactor = input.cropMode === "aps-c" ? 1.5 : 1;
  const equivalentFocal = Math.round(focal * cropFactor);
  const resolution =
    input.resolutionOverride === "4k"
      ? "3840×2160 / 4K"
      : input.resolutionOverride === "1080p"
        ? "1920×1080 / Full HD"
        : preset.settings.resolution;
  const quality =
    input.recordingQuality === "422-10"
      ? "4:2:2 10-bit"
      : input.recordingQuality === "420-10"
        ? "4:2:0 10-bit"
        : input.recordingQuality === "420-8"
          ? "4:2:0 8-bit"
          : (preset.settings.colorDepth ?? "按相机预设");
  const codec =
    input.codecOverride === "h265"
      ? "H.265 / HEVC"
      : input.codecOverride === "h264"
        ? "H.264 / AVC"
        : input.codecOverride === "prores"
          ? "Apple ProRes"
          : (preset.settings.codec ?? "按相机预设");
  const exposureCompensation =
    input.exposureCompensation === "auto" || !input.exposureCompensation
      ? (preset.settings.exposureCompensation ??
        (input.delivery === "sdr" ? "0 EV" : "-0.3 EV 起步"))
      : `${input.exposureCompensation} EV（手动锁定）`;
  if (input.delivery !== "sdr" && quality.includes("8-bit"))
    compatibilityWarnings.push(
      "HDR、Log或HLG工作流不应选择8-bit记录；请改为至少10-bit，避免色带并保留正确HDR链路。",
    );
  if (input.codecOverride === "prores" && !/iPhone/i.test(preset.camera))
    compatibilityWarnings.push(
      `${preset.camera} 当前库中没有可验证的机内 ProRes 记录方案；请选择相机支持的 XAVC/H.264/H.265 或外录设备。`,
    );
  if (input.cropMode === "aps-c")
    compatibilityWarnings.push(
      `APS-C/S35裁切会把 ${focal}mm 视角变为约 ${equivalentFocal}mm 等效；请重新检查构图、分辨率和高帧率限制。`,
    );
  if (input.resolutionOverride === "1080p" && input.delivery !== "sdr")
    compatibilityWarnings.push(
      "1080p可以交付HDR，但平台画质与转码优先级通常低于4K；长片主版本建议保留4K母版。",
    );
  const nd =
    input.light === "day"
      ? input.nd
        ? input.illumination === "harsh-sun"
          ? "ND16–ND64 起步，以95+斑马和波形调整"
          : "ND8–ND32 起步，保留目标快门和光圈"
        : "无 ND：ISO 已到底仍过曝时，先收光圈，再提高快门；保护高光优先于180°快门"
      : "夜间通常移除 ND；车窗反光需要另行测试 CPL，不能以损失进光为代价盲用";
  return {
    ...iso,
    isoStart,
    isoRange,
    isoRecommendation: manualIso
      ? `${iso.illuminationLabel}：已手动锁定 ISO ${manualIso}；当前预设允许范围 ${preset.settings.iso.min}–${preset.settings.iso.max}。`
      : iso.isoRecommendation,
    fps,
    shutter,
    aperture,
    whiteBalance,
    nd,
    controlMode: {
      shutter:
        input.shutterOverride && input.shutterOverride !== "auto"
          ? "手动锁定"
          : "智能建议",
      aperture:
        input.apertureOverride && input.apertureOverride !== "auto"
          ? fixedAperture
            ? "设备固定"
            : "手动锁定"
          : "智能建议",
      iso: manualIso ? "手动锁定" : "Auto ISO 建议",
      whiteBalance:
        input.whiteBalanceOverride !== undefined
          ? input.whiteBalanceOverride === "auto"
            ? "自动"
            : "手动锁定"
          : "智能建议",
    },
    compatibilityWarnings,
    fieldControls: {
      focus,
      stabilization,
      zebra: zebra === "off" ? "关闭" : zebra,
      metering,
      audio,
    },
    recordingControls: {
      focal: `${focal}mm${cropFactor > 1 ? `（约 ${equivalentFocal}mm 等效）` : "（全画幅视角）"}`,
      resolution,
      quality,
      codec,
      exposureCompensation,
      crop:
        input.cropMode === "aps-c" ? "APS-C / S35 开启" : "全画幅 / APS-C关闭",
      proxy: input.proxy === "on" ? "开启（便于剪辑，不替代原始素材）" : "关闭",
    },
    adjustmentOrder: [
      "先定帧率与运动表现，再定快门；不要先用 ISO 修正所有问题。",
      "按景深选择光圈；白天用 ND 保住快门，夜间优先移除 ND。",
      "从建议 ISO 起点试录，查看斑马、波形、噪声和肤色后再提高上限。",
      "最后锁定白平衡、对焦和收音，录10秒并回放放大检查。",
    ],
  };
}

export function recommendPreset(
  presets: CameraPreset[],
  input: SceneGeneratorInput,
) {
  const candidates = presets.filter(
    (preset) => input.device === "全部设备" || preset.camera === input.device,
  );
  const scored = candidates
    .map((preset) => {
      let score = 0;
      if (
        input.light === "day" &&
        [
          "daylight-general",
          "daylight-walk",
          "forest-stream-static",
          "coast-sunset",
        ].includes(preset.scene)
      )
        score += 8;
      if (
        input.light === "night" &&
        ["city-night-driving", "city-night-tripod"].includes(preset.scene)
      )
        score += 8;
      if (
        input.light === "blue-hour" &&
        ["blue-hour-walk", "coast-sunset"].includes(preset.scene)
      )
        score += 8;
      if (input.movement === "drive" && preset.scene === "city-night-driving")
        score += 3;
      if (input.movement === "walk" && preset.scene.includes("walk"))
        score += 3;
      if (
        input.movement === "tripod" &&
        ["city-night-tripod", "forest-stream-static"].includes(preset.scene)
      )
        score += 3;
      if (input.weather === "rain" && preset.scene === "rain-walk") score += 5;
      const kind = captureProfileKind(preset.settings.profile);
      if (input.delivery === "hdr10")
        score += kind === "log" ? 6 : kind === "hlg" ? 1 : -2;
      if (input.delivery === "hlg")
        score += kind === "hlg" ? 6 : kind === "log" ? 1 : -2;
      if (input.delivery === "sdr") score += kind === "standard" ? 5 : 0;
      if (input.fps && preset.settings.fps === input.fps) score += 1;
      return { preset, score };
    })
    .sort((a, b) => b.score - a.score);
  const match = scored[0]?.preset;
  if (!match) return undefined;
  const adjustments = [
    input.light === "day" && !input.nd
      ? "无ND：先看95+斑马保护高光，必要时提高快门，不要让天空或白色物体不可恢复地过曝。"
      : "按预设快门起步，使用波形图和斑马线确认曝光。",
    input.weather === "rain"
      ? "开启可靠防雨和镜片检查；收音增加防风防水，避免雨滴直接敲击麦克风。"
      : "录制10秒测试并检查高光、对焦和环境声。",
    input.sound === "ambience"
      ? "环境音版保持真实立体声，不使用自动增益抽吸或过度降噪。"
      : "音乐版仍保留独立环境声母轨，后期再决定混合比例。",
    input.delivery === "hdr10"
      ? captureProfileKind(match.settings.profile) === "hlg"
        ? "当前是 HLG 采集：若最终要 HDR10，必须在 Resolve 正确完成 HLG→PQ/ST2084 变换，不能只改导出标签。"
        : "保持10-bit Log/广色域采集，后期正确变换到 Rec.2100 PQ/ST2084，再编码为 HDR10。"
      : input.delivery === "hlg"
        ? captureProfileKind(match.settings.profile) === "hlg"
          ? "保持 Rec.2100 HLG 全链路；这是有效的 YouTube HDR，但不是 PQ/HDR10。"
          : "当前是 Log 采集：在 Resolve 中正确转换到 Rec.2100 HLG 后再导出；不能只写 HLG 标签。"
        : "最终Rec.709 SDR，避免仅修改标签而未进行色彩转换。",
  ];
  return {
    preset: match,
    adjustments,
    captureKind: captureProfileKind(match.settings.profile),
    deliveryRoute: deliveryRoutes[input.delivery],
    exposure: buildExposureDecision(match, input),
  };
}

export function shutterForFps(fps: number) {
  const denominator = Math.max(1, Math.round(fps * 2));
  return `1/${denominator}`;
}

export function estimateNdStops(evDifference: number) {
  return Math.max(0, Math.round(evDifference));
}

export function recordingStorageGb(
  bitrateMbps: number,
  durationMinutes: number,
) {
  if (!Number.isFinite(bitrateMbps) || !Number.isFinite(durationMinutes))
    return 0;
  return (
    (Math.max(0, bitrateMbps) * Math.max(0, durationMinutes) * 60) / 8 / 1000
  );
}

export function recordingMinutesForStorage(
  storageGb: number,
  bitrateMbps: number,
) {
  if (
    !Number.isFinite(storageGb) ||
    !Number.isFinite(bitrateMbps) ||
    bitrateMbps <= 0
  )
    return 0;
  return (Math.max(0, storageGb) * 8 * 1000) / bitrateMbps / 60;
}

export function flickerSafeShutters(fps: number, mainsHz: 50 | 60) {
  const target = Math.max(1, fps * 2);
  const candidates = Array.from(
    { length: 8 },
    (_, index) => mainsHz * (index + 1),
  )
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
  if (/log|hlg/i.test(profile) && !/10.?bit/i.test(colorDepth))
    warnings.push("Log/HLG方案未明确10-bit色深，调色和HDR链路存在断层风险。");
  else if (/10.?bit/i.test(colorDepth))
    strengths.push("已明确10-bit采集，适合Log调色与HDR交付。");
  if (!preset.settings.codec)
    warnings.push("未记录编码格式，无法准确估算容量和剪辑负载。");
  if (!preset.settings.audio)
    warnings.push("未记录收音方式，环境音视频容易在现场遗漏监听与防风。");
  if (!preset.settings.zebra && /log|hlg/i.test(profile))
    warnings.push("高动态范围方案未记录斑马线基准，现场高光保护依赖人工补充。");
  if (preset.settings.whiteBalanceKelvin > 0)
    strengths.push("白平衡使用固定K值，可减少连续镜头色温漂移。");
  if (preset.fieldChecks?.length)
    strengths.push(`包含${preset.fieldChecks.length}项现场核验。`);
  const score = Math.max(0, Math.min(100, 100 - warnings.length * 14));
  return { score, warnings, strengths };
}

export function clonePresetAsCustom(
  preset: CameraPreset,
  name: string,
): CameraPreset {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-|-$/g, "");
  return {
    ...preset,
    id: `custom-${slug || "preset"}-${Date.now()}`,
    notes: `${name.trim() || "个人预设"}｜基于 ${preset.camera} ${preset.scene} 复制，可继续作为个人现场起点。`,
  };
}
