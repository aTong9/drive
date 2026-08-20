import type { OrdinaryCreatorModel } from "../data/ordinaryCreatorModels.js";

export interface CreatorRevenuePotential {
  score: number;
  tier: "S" | "A" | "B" | "C" | "D" | "E";
  annualMinCny: number;
  annualMaxCny: number;
  advertiserValue: number;
  buyerIntent: number;
  evergreenDemand: number;
  monetizationBreadth: number;
  productionScalability: number;
  costPenalty: number;
  rationale: string[];
}

const includesAny = (text: string, keywords: string[]) =>
  keywords.some((keyword) => text.includes(keyword));

const roundToTenThousand = (value: number) =>
  Math.max(10000, Math.round(value / 10000) * 10000);

export function estimateCreatorRevenuePotential(
  model: OrdinaryCreatorModel,
): CreatorRevenuePotential {
  const text = [
    model.title,
    model.category,
    model.promise,
    ...model.firstTopics,
    ...model.incomePaths,
  ]
    .join(" ")
    .toLowerCase();

  const premiumAdvertiserKeywords = [
    "商业",
    "财务",
    "法律",
    "网络安全",
    "软件",
    "数据",
    "智能家居",
    "能源",
    "汽车",
    "相机",
    "摄影",
    "医疗",
    "健康",
    "维修",
    "工程",
    "business",
    "software",
  ];
  const buyerIntentKeywords = [
    "评测",
    "维修",
    "工具",
    "设备",
    "器材",
    "课程",
    "制作",
    "改造",
    "家居",
    "咖啡",
    "摄影",
    "汽车",
    "服务",
  ];
  const evergreenKeywords = [
    "教程",
    "入门",
    "学习",
    "维修",
    "科普",
    "实验",
    "方法",
    "技能",
    "制作",
    "管理",
    "训练",
  ];
  const expensiveKeywords = [
    "航空",
    "帆船",
    "船艇",
    "滑雪",
    "汽车修复",
    "铸造",
    "焊接",
    "窑炉",
    "无人机",
    "航拍",
    "海上",
    "高压",
  ];

  const advertiserValue = includesAny(text, premiumAdvertiserKeywords)
    ? 4.6
    : includesAny(text, ["技术", "设计", "户外", "食品", "教育"])
      ? 3.8
      : 3.1;
  const buyerIntent = includesAny(text, buyerIntentKeywords) ? 4.6 : 3.2;
  const evergreenDemand = includesAny(text, evergreenKeywords) ? 4.7 : 3.4;
  const monetizationBreadth = Math.min(
    5,
    2.4 +
      model.incomePaths.length * 0.45 +
      (includesAny(text, ["课程", "服务", "销售", "定制", "授权"]) ? 0.7 : 0),
  );
  const productionScalability =
    model.mode === "faceless" ? 4.5 : model.mode === "hybrid" ? 4.1 : 3.6;
  const costPenalty = includesAny(text, expensiveKeywords) ? 1.4 : 0.35;

  const rawScore =
    advertiserValue * 5 +
    buyerIntent * 5 +
    evergreenDemand * 4 +
    monetizationBreadth * 3 +
    productionScalability * 3 -
    costPenalty * 4;
  const score = Math.max(25, Math.min(96, Math.round(rawScore)));

  const tier =
    score >= 86
      ? "S"
      : score >= 78
        ? "A"
        : score >= 70
          ? "B"
          : score >= 62
            ? "C"
            : score >= 54
              ? "D"
              : "E";
  const tierRanges: Record<CreatorRevenuePotential["tier"], [number, number]> =
    {
      S: [300000, 1200000],
      A: [180000, 800000],
      B: [100000, 450000],
      C: [60000, 280000],
      D: [30000, 160000],
      E: [10000, 80000],
    };
  const [baseMin, baseMax] = tierRanges[tier];
  const tierFloor = { S: 86, A: 78, B: 70, C: 62, D: 54, E: 25 }[tier];
  const rangeLift = Math.max(0, score - tierFloor) * 0.025;
  const annualMinCny = roundToTenThousand(baseMin * (1 + rangeLift));
  const annualMaxCny = roundToTenThousand(baseMax * (1 + rangeLift));

  const rationale = [
    advertiserValue >= 4.5 ? "广告主价值较高" : "广告价值中等",
    buyerIntent >= 4.5 ? "工具与购买意图明确" : "购买意图依赖内容设计",
    evergreenDemand >= 4.5 ? "教程与搜索需求较常青" : "更依赖推荐与持续更新",
    productionScalability >= 4.4
      ? "不露脸内容较易批量生产"
      : "制作效率取决于现场与出镜",
    costPenalty >= 1 ? "设备与运营成本较高" : "启动与持续成本相对可控",
  ];

  return {
    score,
    tier,
    annualMinCny,
    annualMaxCny,
    advertiserValue,
    buyerIntent,
    evergreenDemand,
    monetizationBreadth,
    productionScalability,
    costPenalty,
    rationale,
  };
}

export const sortCreatorModelsByRevenuePotential = (
  models: OrdinaryCreatorModel[],
  direction: "desc" | "asc" = "desc",
) =>
  [...models].sort((left, right) => {
    const scoreDifference =
      estimateCreatorRevenuePotential(right).score -
      estimateCreatorRevenuePotential(left).score;
    if (scoreDifference !== 0) {
      return direction === "desc" ? scoreDifference : -scoreDifference;
    }
    return left.title.localeCompare(right.title, "zh-CN");
  });
