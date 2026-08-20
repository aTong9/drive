import type {
  LongformBlueprint,
  LongformFormatId,
} from "../data/longformProduction.js";

const captureRatios: Record<LongformFormatId, [number, number]> = {
  documentary: [8, 15],
  cinematic: [5, 10],
  observational: [1.3, 2],
  "road-essay": [8, 15],
  portrait: [10, 20],
  investigative: [6, 12],
  nature: [12, 30],
  history: [6, 12],
};

const suggestedShootDays: Record<LongformFormatId, [number, number]> = {
  documentary: [6, 15],
  cinematic: [6, 12],
  observational: [3, 8],
  "road-essay": [8, 15],
  portrait: [12, 25],
  investigative: [10, 30],
  nature: [15, 60],
  history: [6, 14],
};

const chapterWeights: Record<LongformFormatId, number[]> = {
  documentary: [0.08, 0.22, 0.45, 0.25],
  cinematic: [0.08, 0.28, 0.48, 0.16],
  observational: [0.05, 0.45, 0.4, 0.1],
  "road-essay": [0.1, 0.28, 0.42, 0.2],
  portrait: [0.08, 0.27, 0.45, 0.2],
  investigative: [0.08, 0.32, 0.42, 0.18],
  nature: [0.08, 0.32, 0.42, 0.18],
  history: [0.08, 0.3, 0.42, 0.2],
};

export interface LongformScaleInput {
  formatId: LongformFormatId;
  targetMinutes: number;
  shootDays: number;
  bitrateMbps: number;
}

export interface LongformScaleEstimate {
  captureHoursLow: number;
  captureHoursHigh: number;
  storageGbHigh: number;
  twoCopyStorageGb: number;
  captureMinutesPerDayLow: number;
  captureMinutesPerDayHigh: number;
  suggestedDaysLow: number;
  suggestedDaysHigh: number;
  scheduleStatus: "comfortable" | "tight" | "extended";
}

export interface ScaledLongformChapter {
  index: number;
  startMinute: number;
  endMinute: number;
  durationMinutes: number;
  range: string;
  purpose: string;
  material: string;
}

export interface LongformShootBlock {
  range: string;
  name: string;
  goal: string;
  proof: string;
}

export function estimateLongformScale({
  formatId,
  targetMinutes,
  shootDays,
  bitrateMbps,
}: LongformScaleInput): LongformScaleEstimate {
  const minutes = Math.max(1, targetMinutes);
  const days = Math.max(1, shootDays);
  const bitrate = Math.max(1, bitrateMbps);
  const [ratioLow, ratioHigh] = captureRatios[formatId];
  const [suggestedDaysLow, suggestedDaysHigh] = suggestedShootDays[formatId];
  const captureHoursLow = (minutes * ratioLow) / 60;
  const captureHoursHigh = (minutes * ratioHigh) / 60;
  const storageGbHigh = captureHoursHigh * bitrate * 0.45;
  return {
    captureHoursLow,
    captureHoursHigh,
    storageGbHigh,
    twoCopyStorageGb: storageGbHigh * 2,
    captureMinutesPerDayLow: (captureHoursLow * 60) / days,
    captureMinutesPerDayHigh: (captureHoursHigh * 60) / days,
    suggestedDaysLow,
    suggestedDaysHigh,
    scheduleStatus:
      days < suggestedDaysLow
        ? "tight"
        : days > suggestedDaysHigh
          ? "extended"
          : "comfortable",
  };
}

function timecode(totalMinutes: number) {
  const minutes = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return hours
    ? `${hours}:${String(remainder).padStart(2, "0")}:00`
    : `${String(remainder).padStart(2, "0")}:00`;
}

export function buildScaledChapterSchedule(
  formatId: LongformFormatId,
  targetMinutes: number,
  blueprint: LongformBlueprint,
): ScaledLongformChapter[] {
  const total = Math.max(10, Math.round(targetMinutes));
  const weights = chapterWeights[formatId];
  let cursor = 0;
  return blueprint.chapterPlan.map((chapter, index) => {
    const isLast = index === blueprint.chapterPlan.length - 1;
    const endMinute = isLast
      ? total
      : Math.max(
          cursor + 1,
          Math.round(total * (weights[index] ?? 0.25)) + cursor,
        );
    const result = {
      index: index + 1,
      startMinute: cursor,
      endMinute,
      durationMinutes: endMinute - cursor,
      range: `${timecode(cursor)}–${timecode(endMinute)}`,
      purpose: chapter.purpose,
      material: chapter.material,
    };
    cursor = endMinute;
    return result;
  });
}

export function buildLongformShootBlocks(
  shootDays: number,
  blueprint: LongformBlueprint,
): LongformShootBlock[] {
  const days = Math.max(1, Math.round(shootDays));
  if (days === 1) {
    return [
      {
        range: "第 1 天",
        name: "单日最小可行拍摄",
        goal: "先完成不可复制行动、完整声音与最低覆盖，再补建立和细节。",
        proof: blueprint.minimumCoverage,
      },
    ];
  }
  if (days === 2) {
    return [
      {
        range: "第 1 天",
        name: "进入、基线与核心行动",
        goal: "先确认许可、安全、空间方向和声音基线，再完成最不可复制的核心行动。",
        proof: blueprint.shootingDay[0] ?? blueprint.minimumCoverage,
      },
      {
        range: "第 2 天",
        name: "结果、反证与缺口补拍",
        goal: "先回访行动结果，再按缺失镜头表补反应、过渡声音、章节出口和事实证据。",
        proof:
          blueprint.shootingDay.at(-1) ??
          "按缺失镜头表逐项补拍，并完成当天双备份。",
      },
    ];
  }
  const coreEnd = Math.max(2, Math.round(days * 0.65));
  const verifyStart = Math.min(days, coreEnd + 1);
  return [
    {
      range: "第 1 天",
      name: "进入、测试与基线",
      goal: "确认许可、安全、人物关系、空间方向和声音基线。",
      proof: blueprint.shootingDay[0] ?? blueprint.minimumCoverage,
    },
    {
      range: `第 2–${coreEnd} 天`,
      name: "核心行动与章节覆盖",
      goal: "按章节拍完整行动、变化、反应和不同观点，不按漂亮镜头数量推进。",
      proof: blueprint.minimumCoverage,
    },
    {
      range: `第 ${verifyStart}–${days} 天`,
      name: "结果、反证与缺口补拍",
      goal: "回访行动结果，补相反材料、过渡声音、章节出口和事实证据。",
      proof:
        blueprint.shootingDay.at(-1) ??
        "按缺失镜头表逐项补拍，并完成当天双备份。",
    },
  ];
}
