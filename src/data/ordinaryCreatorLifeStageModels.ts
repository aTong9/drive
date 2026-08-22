import type { OrdinaryCreatorModel } from "./ordinaryCreatorModels.js";

type Seed = {
  id: string;
  title: string;
  mode: OrdinaryCreatorModel["mode"];
  category: string;
  promise: string;
  beginnerFit: string;
  topics: string[];
  incomePaths: string[];
  caution: string;
  references: Array<[name: string, handle: string]>;
};

const seeds: Seed[] = [
  {
    id: "rural-family-everyday-life",
    title: "乡村家庭、季节劳作与真实日常",
    mode: "hybrid",
    category: "乡村生活",
    promise:
      "跟随一个家庭和一片土地度过四季，把做饭、种植、赶集、维修和邻里往来连成长期生活史。",
    beginnerFit:
      "熟悉本地节气、方言、食物和劳作流程就是优势，不需要把乡村包装成永远宁静的世外桃源。",
    topics: ["春耕前的一周", "雨季怎样安排家务和劳作", "一次乡镇赶集", "家庭菜园从播种到上桌"],
    incomePaths: ["YouTube 广告", "地方农产品合作", "生活工具联盟", "纪实影像委托"],
    caution:
      "不要摆拍危险农活或浪漫化贫困；拍摄家人、邻居、土地边界和未成年人前取得同意，并说明季节与地区差异。",
    references: [
      ["Country Life Vlog", "country_life_vlog"],
      ["Dianxi Xiaoge", "dianxixiaoge"],
      ["Village Life With ShivOm Family", "LivevillagelifewithOmfamily"],
      ["Kominka Solo Life", "KominkaSoloLife"],
      ["Japanese Grandma Kinoe", "JapaneseGrandmaKinoe"],
    ],
  },
  {
    id: "shift-worker-life-diary",
    title: "轮班、夜班与普通职业生活日记",
    mode: "hybrid",
    category: "职业日常",
    promise:
      "记录普通工作者在早班、夜班和通勤之间怎样吃饭、休息、安排家庭与恢复精力。",
    beginnerFit:
      "内容价值来自真实节奏和具体细节，不要求职业光鲜；可只拍工作前后，避开单位内部。",
    topics: ["夜班前后的完整一天", "一周轮班便当", "长通勤怎样恢复", "工资日后的真实预算"],
    incomePaths: ["YouTube 广告", "便当与通勤用品联盟", "排班模板", "合规职业品牌合作"],
    caution:
      "必须遵守雇主保密、患者或客户隐私及场所拍摄规定；不能为了内容影响工作安全，也不能伪造收入或工时冲突。",
    references: [
      ["Miki Rai", "MikiRai"],
      ["Rachel Southard", "RachelSouthard"],
      ["Kharma Medic", "KharmaMedic"],
      ["The Nurse Nook", "TheNurseNook"],
      ["Paolo fromTOKYO", "PaolofromTOKYO"],
    ],
  },
  {
    id: "tiny-business-behind-scenes",
    title: "一个人小生意、接单与打包幕后",
    mode: "hybrid",
    category: "微型创业",
    promise:
      "公开一个人从设计、备货、接单、包装到售后的真实流程，让观众持续看到生意如何慢慢长大。",
    beginnerFit:
      "尚未成功也可以开始；小订单、失误、成本和工作台变化本身就是连续故事。",
    topics: ["第一个订单怎样完成", "一周订单与真实工时", "包装成本重新核算", "一次上新失败复盘"],
    incomePaths: ["商品销售", "YouTube 广告", "工具材料联盟", "模板与创作者课程"],
    caution:
      "遮挡客户姓名、地址和订单信息；明确区分销售额、利润与赞助，不制造虚假稀缺或夸大创业收益。",
    references: [
      ["Katnipp", "Katnipp"],
      ["Minnie Small", "MinnieSmall"],
      ["Fran Meneses", "FranMeneses"],
      ["Baylee Jae", "BayleeJae"],
      ["PearFleur", "PearFleur"],
    ],
  },
  {
    id: "family-caregiving-real-life",
    title: "家庭照护者的生活、协作与喘息记录",
    mode: "on-camera",
    category: "家庭照护",
    promise:
      "从照护者视角分享排班、沟通、环境调整和自我照顾，让承担相似责任的人少一点孤立感。",
    beginnerFit:
      "真实经验和可执行的家庭协作方法有价值，但要始终把被照护者的尊严和选择放在内容之前。",
    topics: ["家庭照护交接清单", "一次不顺利就医后的复盘", "怎样安排照护者喘息时间", "家中动线的小改造"],
    incomePaths: ["YouTube 广告", "无障碍用品联盟", "公益机构合作", "照护记录模板"],
    caution:
      "不得泄露诊断、身体画面或脆弱时刻来换取观看；医疗内容只分享个人经验，治疗与用药必须交给专业人员。",
    references: [
      ["Family Caregiver Alliance", "caregiverorg"],
      ["Dementia Careblazers", "DementiaCareblazers"],
      ["Teepa Snow's Positive Approach to Care", "teepasnow"],
      ["Caregiver Stress", "CaregiverStress"],
      ["National Institute on Aging", "NIHAging"],
    ],
  },
  {
    id: "renter-friendly-home-life",
    title: "租房生活、可逆改造与小空间成长",
    mode: "hybrid",
    category: "租房生活",
    promise:
      "在不能大拆大改的房子里，通过收纳、照明、二手家具和可逆方案逐步改善真实居住体验。",
    beginnerFit:
      "普通户型和明确预算比豪宅更有参考价值，每个角落都能形成改造前后与长期使用复盘。",
    topics: ["不打孔改善出租屋照明", "500 元完成卧室调整", "小厨房住满一年后的收纳", "退租前如何恢复原状"],
    incomePaths: ["YouTube 广告", "家居用品联盟", "租房品牌合作", "空间规划清单"],
    caution:
      "先核对租约、消防、电气和承重边界；必须交代总成本、人工与赞助，不能把不可逆工程称为租房友好。",
    references: [
      ["Alexandra Gater", "AlexandraGater"],
      ["Caroline Winkler", "Caroline_Winkler"],
      ["Actually Alli DIY", "ActuallyAlliDIY"],
      ["The Sorry Girls", "TheSorryGirls"],
      ["Apartment Therapy", "ApartmentTherapy"],
    ],
  },
  {
    id: "starting-over-abroad-diary",
    title: "异乡重新生活、文化适应与办事日记",
    mode: "on-camera",
    category: "异乡生活",
    promise:
      "从落地、租房、买菜、语言障碍和建立社交开始，连续记录一个普通人怎样在陌生地方重新组织生活。",
    beginnerFit:
      "不必把自己包装成旅行专家；新手困惑、文化误解和逐渐熟悉的过程就是主线。",
    topics: ["落地第一个月真实开销", "第一次独自办理本地业务", "语言不够用的一天", "半年后重新看最初的选择"],
    incomePaths: ["YouTube 广告", "语言与通信服务合作", "生活清单", "合规本地品牌合作"],
    caution:
      "签证、税务、保险和法律信息会变化，必须标注时间地点并链接官方来源；不要暴露证件、住址或把个例说成普遍规则。",
    references: [
      ["Life Where I'm From", "LifeWhereImFrom"],
      ["Rachel and Jun", "RachelandJun"],
      ["Our Rich Journey", "OurRichJourney"],
      ["Dogen", "Dogen"],
      ["Tokidoki Traveller", "TokidokiTraveller"],
    ],
  },
  {
    id: "low-buy-consumption-diary",
    title: "低消费、无购买挑战与物品使用日记",
    mode: "on-camera",
    category: "消费实验",
    promise:
      "通过月度规则、购买记录、旧物使用和失败复盘，观察减少消费是否真正改善财务、空间和生活。",
    beginnerFit:
      "从一个品类和一个月开始即可，真实账本与反复动摇比极端口号更有长期价值。",
    topics: ["30 天不买衣服", "一年没用完的物品盘点", "冲动购买触发记录", "低消费月份真实结余"],
    incomePaths: ["YouTube 广告", "预算与盘点模板", "二手平台合作", "价值一致的耐用品联盟"],
    caution:
      "不要用新的大量购物维持低消费内容，也不要羞辱不同收入与家庭责任的人；联盟营销必须与频道承诺一致。",
    references: [
      ["Hannah Louise Poston", "HannahLouisePoston"],
      ["Christina Mychas", "ChristinaMychas"],
      ["Use Less", "UseLess_dk"],
      ["The Financial Diet", "thefinancialdiet"],
      ["Shawna Ripari", "ShawnaRipari"],
    ],
  },
  {
    id: "midlife-solo-reset",
    title: "中年独居、人生转折与重新出发",
    mode: "hybrid",
    category: "人生阶段",
    promise:
      "记录搬家、离职、关系变化、空巢或独居后的普通生活重建，让人生中段也拥有连续而不煽情的叙事。",
    beginnerFit:
      "不需要给出成功学答案；稳定记录吃饭、交友、健康习惯和小目标，便能形成少见但真实的视角。",
    topics: ["重新一个人住的第一个月", "40 岁以后建立周末生活", "关系变化后的物品整理", "一个人过节的真实安排"],
    incomePaths: ["YouTube 广告", "书籍与生活用品联盟", "社群或线下活动", "个人记录模板"],
    caution:
      "避免消费前伴侣、子女或家庭成员的隐私，也不要把孤独、心理状态或人生选择包装成普适诊断与治疗方案。",
    references: [
      ["Single Japanese Gal", "SingleJapaneseGalVlog"],
      ["Nami's life", "naminokurashi"],
      ["The Cottage Fairy", "TheCottageFairy"],
      ["Isabel Paige", "IsabelPaige"],
      ["Simple Happy Zen", "SimpleHappyZen"],
    ],
  },
];

export const ordinaryCreatorLifeStageModels: OrdinaryCreatorModel[] = seeds.map(
  (seed) => ({
    id: seed.id,
    title: seed.title,
    mode: seed.mode,
    category: seed.category,
    promise: seed.promise,
    beginnerFit: seed.beginnerFit,
    minimumKit: ["手机或相机", "稳定支撑", "清晰收音", "隐私、授权与连续记录清单"],
    repeatableFormat: ["本期生活状态", "具体任务或冲突", "真实执行过程", "结果与代价", "个人感受和下一步"],
    firstTopics: seed.topics,
    incomePaths: seed.incomePaths,
    caution: seed.caution,
    references: seed.references.map(([name, handle]) => ({
      name,
      url: `https://www.youtube.com/@${handle}`,
    })),
  }),
);
