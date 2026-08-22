import type { OrdinaryCreatorModel } from "./ordinaryCreatorModels.js";

export const ordinaryCreatorRuleDrivenModels: OrdinaryCreatorModel[] = [
  {
    id: "community-help-transformation",
    title: "为邻居免费清理、庭院维护与社区改造",
    mode: "hybrid",
    category: "社区互助",
    promise:
      "每期帮助一户确有需要的人完成清洁、除草或安全改善，用真实劳动、前后变化和当事人边界构成故事。",
    beginnerFit:
      "可以先从熟人、社区公共角落或合法志愿项目开始；愿意稳定劳动和尊重受助者，比豪华设备更重要。",
    minimumKit: ["手机或运动相机", "固定机位", "与任务匹配的防护和工具", "书面同意与隐私清单"],
    repeatableFormat: ["说明任务来源与许可", "记录改造前状态", "分阶段完成劳动", "处理意外和安全问题", "展示结果与后续维护"],
    firstTopics: ["帮行动不便的邻居整理小院", "清理一处获准维护的社区角落", "为熟人完成一次深度清洁", "一个月做四次小型志愿改造"],
    incomePaths: ["YouTube 广告", "清洁或园艺工具联盟", "透明品牌赞助", "观众自愿支持后续公益项目"],
    caution:
      "帮助不能以羞辱、曝光疾病或拍清面孔为交换；先确认产权、废物处置、保险和危险材料边界，捐款及赞助去向必须公开。",
    references: [
      { name: "Midwest Magic Cleaning", url: "https://www.youtube.com/@MidwestMagicCleaning" },
      { name: "SB Mowing", url: "https://www.youtube.com/@SBMowing" },
      { name: "Aurikatariina", url: "https://www.youtube.com/@Aurikatariina" },
      { name: "Fill's Lawn Care", url: "https://www.youtube.com/@FillsLawnCare" },
      { name: "SB Power Washing", url: "https://www.youtube.com/@SBPowerWashing" },
    ],
  },
  {
    id: "fixed-budget-pantry-challenge",
    title: "固定预算买菜、清空库存与一周餐食挑战",
    mode: "hybrid",
    category: "家庭实验",
    promise:
      "每期设定人数、预算和现有库存，完整记录采购、做饭、剩余食材与真实花费，让观众看到一套可复算的生活实验。",
    beginnerFit:
      "普通家庭的价格、冰箱和失败最有参考价值；不需要专业厨房，只要保留小票并讲清地区、日期和份量。",
    minimumKit: ["手机", "厨房固定架", "购物小票", "库存与每餐成本表"],
    repeatableFormat: ["公布预算和现有库存", "采购选择与价格", "按日记录实际餐食", "处理剩余和临时变化", "总花费、浪费与下轮调整"],
    firstTopics: ["100 元完成两人五天晚餐", "只用冰箱库存生活三天", "同一购物篮连续记录三个月", "物价上涨后重新设计家庭菜单"],
    incomePaths: ["YouTube 广告", "厨具与储存用品联盟", "菜单或预算模板", "标注明确的食品品牌合作"],
    caution:
      "不能把极低预算包装成人人适用的营养方案；注明地区和拍摄日期，不浪费食物，也不隐瞒赞助、优惠券和家中原有库存。",
    references: [
      { name: "Frugal Fit Mom", url: "https://www.youtube.com/@FrugalFitMom" },
      { name: "See Mindy Mom", url: "https://www.youtube.com/@SeeMindyMom" },
      { name: "Julia Pacheco", url: "https://www.youtube.com/@JuliaPacheco" },
      { name: "Under the Median", url: "https://www.youtube.com/@UnderTheMedian" },
      { name: "Atomic Shrimp", url: "https://www.youtube.com/@AtomicShrimp" },
    ],
  },
  {
    id: "home-energy-bill-retrofit-diary",
    title: "家庭电费、能耗测量与逐步节能改造日记",
    mode: "hybrid",
    category: "家庭能耗",
    promise:
      "从真实账单和基线测量出发，一次只改变一个设备或习惯，持续比较成本、舒适度和回收周期。",
    beginnerFit:
      "租房者也能从插座功率计、空调设定和遮阳实验开始；诚实数据比一次性昂贵装修更适合普通人。",
    minimumKit: ["手机", "电费与气费账单", "合规功率计或温湿度计", "改造成本和读数表"],
    repeatableFormat: ["建立账单与环境基线", "提出一个低风险变量", "记录购买和安装成本", "持续测量实际变化", "计算回收期并说明舒适度"],
    firstTopics: ["空调温度改变一度省多少电", "窗帘和遮阳的七天对比", "找出家里最耗电的待机设备", "一次小改造能否降低月度账单"],
    incomePaths: ["YouTube 广告", "测量与节能设备联盟", "家居能源品牌合作", "数据记录模板"],
    caution:
      "电箱、燃气、制冷剂和固定线路交给持证人员；不能用单月账单直接归因，需说明天气、费率、居住人数和补贴差异。",
    references: [
      { name: "Undecided with Matt Ferrell", url: "https://www.youtube.com/c/UndecidedMF" },
      { name: "Everything Electric", url: "https://www.youtube.com/@FullyChargedShow" },
      { name: "Skill Builder", url: "https://www.youtube.com/@SkillBuilder" },
      { name: "Heat Geek", url: "https://www.youtube.com/@HeatGeek" },
      { name: "Charlie DIYte", url: "https://www.youtube.com/@CharlieDIYte" },
    ],
  },
  {
    id: "map-completion-local-challenge",
    title: "走完地图、坐完线路与本地清单式探索",
    mode: "hybrid",
    category: "清单探索",
    promise:
      "先公开一张有限地图或合法清单，再逐段完成每条街、每个车站或每个社区，让进度和边界天然产生下一集。",
    beginnerFit:
      "不需要远途旅行；一个区、一个交通网络或步行可达范围就能开始，观众能清楚看到已完成和未完成部分。",
    minimumKit: ["手机或运动相机", "离线地图", "安全路线与补给", "进度表和隐私检查"],
    repeatableFormat: ["展示总清单和本期区段", "说明路线规则", "记录途中观察与偏差", "更新完成进度", "预告下一段和现实障碍"],
    firstTopics: ["走完家附近二十条街", "体验城市每一条地铁线", "逐个记录社区公园", "用一年完成本区所有公共步道"],
    incomePaths: ["YouTube 广告", "步行和通勤装备联盟", "本地机构合作", "地图、照片和城市影像授权"],
    caution:
      "不进入禁区、铁路线路或私人土地，不为完成清单忽视天气和体能；模糊住址及固定生活轨迹，并说明交通票价和拍摄许可。",
    references: [
      { name: "GeoWizard", url: "https://www.youtube.com/@GeoWizard" },
      { name: "Beau Miles", url: "https://www.youtube.com/@BeauMiles" },
      { name: "All The Stations", url: "https://www.youtube.com/@AllTheStations" },
      { name: "Geoff Marshall", url: "https://www.youtube.com/@GeoffMarshall" },
      { name: "The Tim Traveller", url: "https://www.youtube.com/@TheTimTraveller" },
    ],
  },
  {
    id: "community-repair-event-diary",
    title: "社区维修活动、物品诊断与修复结果档案",
    mode: "hybrid",
    category: "共同维修",
    promise:
      "记录一次 Repair Café 式活动里物品为何损坏、怎样共同诊断、是否修好，以及避免了多少浪费。",
    beginnerFit:
      "不必假装万能维修师；可以从活动组织、物主故事和修复数据入手，让有经验的志愿者负责高风险操作。",
    minimumKit: ["手机或相机", "双人收音", "物主和志愿者授权", "故障、零件与修复结果表"],
    repeatableFormat: ["介绍本次活动和物品", "由物主说明故障", "志愿者安全诊断", "记录修复或未修复原因", "汇总物品、成本和减废结果"],
    firstTopics: ["第一次组织社区维修日", "五件小家电最后修好几件", "不会维修的人怎样成为活动记录者", "一个月后回访修好的旧物"],
    incomePaths: ["YouTube 广告", "维修工具联盟", "社区机构或公益项目合作", "活动手册与公开数据支持"],
    caution:
      "带电、高压、电池、燃气和承重物品必须由合格人员处理并做安全复检；不能保证修复成功，物主资料、品牌赞助和零件费用要透明。",
    references: [
      { name: "Repair Café International", url: "https://www.youtube.com/repaircafenederland" },
      { name: "The Restart Project", url: "https://www.youtube.com/@RestartProject" },
      { name: "iFixit", url: "https://www.youtube.com/@iFixit" },
      { name: "Hugh Jeffreys", url: "https://www.youtube.com/@HughJeffreys" },
      { name: "Louis Rossmann", url: "https://www.youtube.com/@rossmanngroup" },
    ],
  },
];
