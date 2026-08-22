import type { OrdinaryCreatorModel } from "./ordinaryCreatorModels.js";

export const ordinaryCreatorServiceWorkModels: OrdinaryCreatorModel[] = [
  {
    id: "mobile-car-detailing-jobs",
    title: "上门汽车美容、工时与交付前后对比",
    mode: "hybrid",
    category: "汽车服务",
    promise:
      "跟随一辆普通车辆从询价、检查、清洁到客户验收，公开材料、工时和判断，而不只展示夸张的前后对比。",
    beginnerFit:
      "可以从自己的车或获准拍摄的熟人车辆开始；稳定流程、材料知识和诚实报价比昂贵工作室更重要。",
    minimumKit: ["手机或运动相机", "安全固定机位", "与材料匹配的防护用品", "车况、工时与授权记录"],
    repeatableFormat: ["记录车况和客户需求", "说明报价与服务边界", "分区完成清洁或修复", "展示难点和耗时", "客户验收与成本复盘"],
    firstTopics: ["第一次完成基础内饰清洁", "同一辆通勤车的季度维护", "预算套餐实际需要多少工时", "一次不能完全去除的污渍复盘"],
    incomePaths: ["汽车美容服务收入", "YouTube 广告", "工具耗材联盟", "汽车护理品牌合作"],
    caution:
      "未经许可不展示车牌、文件和车内私人物品；化学品先做材料测试，不能把漆面修复、霉菌或生物污染处理说成无风险操作。",
    references: [
      { name: "The Detail Geek", url: "https://www.youtube.com/@TheDetailGeek" },
      { name: "WD Detailing", url: "https://www.youtube.com/@WDDetailing" },
      { name: "M.A.D. Detailing", url: "https://www.youtube.com/@MADDETAILING" },
      { name: "Car Cleaning Guru", url: "https://www.youtube.com/@CarCleaningGuru" },
    ],
  },
  {
    id: "pet-grooming-client-diary",
    title: "宠物美容接单、动物状态与安全交付日记",
    mode: "hybrid",
    category: "宠物服务",
    promise:
      "每期围绕一只获准拍摄的宠物，记录毛发状态、护理方案、动物反应、调整过程和主人可执行的后续维护。",
    beginnerFit:
      "在合格训练和真实业务基础上，一次普通洗护也能形成完整故事；重点是读懂动物状态，而不是追求极端改造。",
    minimumKit: ["手机或相机", "防水固定机位", "合规美容和消毒工具", "主人授权与动物健康问询"],
    repeatableFormat: ["介绍宠物状态和禁忌", "确定护理目标", "按动物反应分段操作", "说明停止或调整原因", "交付结果与居家维护"],
    firstTopics: ["第一次洗护的幼犬", "换毛季如何分阶段处理", "害怕吹风时怎样降低刺激", "为什么这次选择停止而不是做完"],
    incomePaths: ["宠物美容服务收入", "YouTube 广告", "合规用品联盟", "宠物护理课程或品牌合作"],
    caution:
      "动物福利高于成片；出现持续恐惧、疼痛、皮肤异常或攻击风险应停止并转介兽医或行为专业人士，不能用强制操作制造戏剧性。",
    references: [
      { name: "Girl With The Dogs", url: "https://www.youtube.com/@GirlWithTheDogs" },
      { name: "Girl With The Dogs 2", url: "https://www.youtube.com/@GirlWithTheDogs2" },
      { name: "Go Groomer", url: "https://www.youtube.com/@GoGroomer" },
      { name: "Rover's Makeover Dog Grooming", url: "https://www.youtube.com/channel/UCjo4bMrOYPqO_asHNwZo6iw" },
    ],
  },
  {
    id: "vending-route-restock-ledger",
    title: "自动售货机补货路线、库存与真实收益账本",
    mode: "hybrid",
    category: "路线经营",
    promise:
      "跟随固定补货路线，记录每台机器的销量、缺货、损耗、故障、场地分成和实际劳动，让经营结果可以复算。",
    beginnerFit:
      "一台合法投放的机器就能开始记录，不必先包装成规模生意；选址失败和滞销库存同样是有价值的连续内容。",
    minimumKit: ["手机或运动相机", "安全车载固定方式", "库存和销售记录", "场地方拍摄许可与隐私清单"],
    repeatableFormat: ["规划本次补货路线", "逐台盘点销量与缺货", "补货、清洁和排障", "记录采购及场地成本", "计算净结果与下次调整"],
    firstTopics: ["第一台机器的完整一个月", "同样商品在两个地点的差异", "一次滞销库存怎样处理", "补货路线究竟需要多少工时"],
    incomePaths: ["售货机经营收入", "YouTube 广告", "支付与库存工具合作", "经营表格或设备联盟"],
    caution:
      "不能把营收冒充利润或被动收入；需计入机器、车辆、损耗、维修、保险、税费、场地分成和劳动时间，并隐藏现金路线及场所安全信息。",
    references: [
      { name: "Jaime Ibanez", url: "https://www.youtube.com/@JaimeIbanezz" },
      { name: "Reyes The Entrepreneur", url: "https://www.youtube.com/@ReyesTheEntrepreneur" },
      { name: "Micah Stanley", url: "https://www.youtube.com/@micah.stanley" },
    ],
  },
  {
    id: "home-bakery-order-week",
    title: "家庭烘焙接单、备料与交付周记",
    mode: "hybrid",
    category: "家庭烘焙经营",
    promise:
      "以一周真实订单为单位，从询价、定金、排产、制作、包装到交付，展示家庭厨房小生意如何运转。",
    beginnerFit:
      "从少量合法订单就能开始；普通厨房、时间冲突和真实返工，比只展示完美成品更能帮助同类创作者。",
    minimumKit: ["手机", "厨房固定架", "订单与过敏原记录", "成本、工时和食品安全清单"],
    repeatableFormat: ["确认订单和交付时间", "核算材料与报价", "批量备料和制作", "处理返工或时间冲突", "包装交付与本周利润复盘"],
    firstTopics: ["第一次同时完成三个订单", "一个生日蛋糕真实成本", "客户临时改需求怎么办", "家庭厨房如何安排一天产能"],
    incomePaths: ["烘焙订单收入", "YouTube 广告", "烘焙工具联盟", "食谱、课程或食品品牌合作"],
    caution:
      "先核对当地家庭食品经营许可、标签、税务和配送规则；过敏原、冷链、保质期、定金和商业合作必须明确，不能为镜头重复浪费食物。",
    references: [
      { name: "Bake My Day Mimo", url: "https://www.youtube.com/@BakeMyDayMimo" },
      { name: "From Scratch Baker", url: "https://www.youtube.com/@FromScratchBakery" },
      { name: "Curious Cat Bakery", url: "https://www.youtube.com/@CuriousCatBakery" },
      { name: "British Girl Bakes", url: "https://www.youtube.com/@BritishGirlBakes" },
    ],
  },
  {
    id: "residential-cleaning-client-route",
    title: "住宅清洁接单、路线排程与服务复盘",
    mode: "hybrid",
    category: "清洁服务",
    promise:
      "记录普通清洁服务从沟通、报价、路线安排到交付检查的全过程，把体力劳动、客户边界和经营系统一起讲清。",
    beginnerFit:
      "无需拍摄极端脏乱现场；一套普通住宅的标准流程、耗时差异和客户沟通就足以形成长期栏目。",
    minimumKit: ["手机或运动相机", "固定机位", "防护与材料安全清单", "客户授权、报价和工时记录"],
    repeatableFormat: ["确认范围和隐私边界", "记录初始状态与报价", "按固定动线完成服务", "处理材料或时间问题", "交付检查和本单复盘"],
    firstTopics: ["第一次独立住宅清洁订单", "怎样估算两室一厅工时", "一天两单如何安排路线", "一次客户投诉带来的流程修改"],
    incomePaths: ["住宅清洁服务收入", "YouTube 广告", "合规工具耗材联盟", "流程模板或行业培训"],
    caution:
      "不得展示住址、钥匙、证件、药品及私人文件；确认保险、化学品相容性和锐器风险，不虚构客户冲突，也不在未经同意的住宅内拍摄。",
    references: [
      { name: "Angela Brown Cleaning", url: "https://www.youtube.com/@AskAngelaBrown" },
      { name: "Clean That Up", url: "https://www.youtube.com/@CleanThatUp" },
      { name: "Clean My Space", url: "https://www.youtube.com/@CleanMySpace" },
      { name: "The Cleaning Business", url: "https://www.youtube.com/@TheCleaningBusiness" },
      { name: "Mike Campion", url: "https://www.youtube.com/@MikeCampion" },
    ],
  },
];
