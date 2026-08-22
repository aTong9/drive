import type { OrdinaryCreatorModel } from "./ordinaryCreatorModels.js";

export const ordinaryCreatorNeighborhoodSupportModels: OrdinaryCreatorModel[] = [
  {
    id: "community-fridge-stewardship-log",
    title: "社区冰箱补给、温度、清洁与轮值运营日志",
    mode: "hybrid",
    category: "社区食品共享",
    promise:
      "跟随正规社区组织记录冰箱的来源登记、温度检查、过敏原标签、清洁轮值、领取变化和食物去向，让长期维护取代一次性捐赠表演。",
    beginnerFit:
      "不应以个人身份私自放置冰箱；可以先加入已获许可的项目做志愿记录，从一次开班、关班和完全脱敏的日报开始。",
    minimumKit: ["手机或相机", "组织与当地监管许可", "温度、来源、日期及清洁台账", "食品安全培训与异常处理清单"],
    repeatableFormat: ["说明日期、班次和适用的当地食品规则", "按清单记录温度、清洁和设备状态", "核对包装、日期、成分与过敏原标签", "汇总不拍摄领取者身份的进出数量", "记录异常处置、轮值交接和下次检查日期"],
    firstTopics: ["一次完整开班检查要做什么", "食物进入冰箱前经过哪些判断", "一周温度和清洁台账复盘", "哪些捐赠必须拒收以及为什么"],
    incomePaths: ["YouTube 广告", "公益组织内容合作", "志愿者培训资源", "脱敏运营模板与项目记录服务"],
    caution:
      "不能以视频建议替代当地食品监管或专业培训，也不得私自设点；严禁摆拍领取者、公开困难身份或分发不合规食品，温控、过敏原、清洁和召回必须服从当地正式流程。",
    references: [
      { name: "Freedge", url: "https://www.youtube.com/@freedge" },
      { name: "Hubbub", url: "https://www.youtube.com/@HubbubUK" },
      { name: "Food Standards Agency", url: "https://www.youtube.com/@foodgov" },
      { name: "FoodCycle", url: "https://www.youtube.com/@FoodCycle" },
    ],
  },
  {
    id: "mutual-aid-supply-response-diary",
    title: "邻里互助需求、物资响应与交接过程记录",
    mode: "faceless",
    category: "互助物资协调",
    promise:
      "由正规互助小组在当事人不被曝光的前提下，记录需求怎样确认、物资怎样匹配、志愿者怎样交接，以及哪些请求转介给专业机构。",
    beginnerFit:
      "先加入已有组织承担一次库存或调度班次，不需要拍受助者；用匿名编号、时间节点和完成状态就能讲清真实流程。",
    minimumKit: ["手机或相机", "组织与参与者授权", "匿名需求、库存与交接台账", "隐私、安全和专业转介规则"],
    repeatableFormat: ["标注日期、服务范围和本期规则版本", "用匿名信息汇总需求与可用资源", "记录采购、分拣或交接的非敏感过程", "说明未完成请求和正规转介去向", "由成员复盘响应时间、缺口和下次值班日期"],
    firstTopics: ["一个需求从登记到完成经过什么", "志愿者交班怎样不丢信息", "哪些请求不能由互助组处理", "一个月库存与响应时间复盘"],
    incomePaths: ["YouTube 广告", "公益项目资助", "志愿者培训内容", "脱敏流程模板与纪录委托"],
    caution:
      "互助不是以贫困、疾病或灾难换取流量；必须最小化收集身份信息，不得公开地址、健康状况和领取记录，也不能冒充医疗、社工、政府或应急服务。",
    references: [
      { name: "Mutual Aid NYC", url: "https://www.youtube.com/@MutualAidNYC" },
      { name: "Mutual Aid Disaster Relief", url: "https://www.youtube.com/@MutualAidDisasterRelief" },
      { name: "Community Solidarity", url: "https://www.youtube.com/@communitysolidarity" },
      { name: "Shareable", url: "https://www.youtube.com/@shareable" },
    ],
  },
  {
    id: "time-bank-skill-exchange-ledger",
    title: "时间银行技能交换、时间信用与成员回访日志",
    mode: "hybrid",
    category: "时间信用互助",
    promise:
      "记录成员如何提出技能、完成匹配、确认交换小时和形成互惠关系，让普通人的时间和知识成为可核对的社区资源。",
    beginnerFit:
      "从已有时间银行的一次获准交换开始；内容只需要展示规则、匿名匹配过程和双方愿意公开的学习结果。",
    minimumKit: ["手机或相机", "组织及双方成员同意", "交换日期、小时与双向确认台账", "成员审核、安全和争议处理规则"],
    repeatableFormat: ["说明规则版本、技能需求和公开范围", "记录匿名匹配与双方确认过程", "只展示同意公开的交换片段", "由双方分别确认小时、结果和反馈", "更新信用台账、争议状态和下一次复查日期"],
    firstTopics: ["第一小时技能交换如何匹配", "不会定价的知识怎样被看见", "一次取消或争议如何处理", "三个月后谁从接受者变成提供者"],
    incomePaths: ["YouTube 广告", "时间银行组织合作", "社区培训与活动记录", "非商业运营模板"],
    caution:
      "时间信用不是货币、雇佣或无资质专业服务；高风险维修、照护、交通、医疗和法律请求必须遵守组织审核与当地规定，成员地址、评价和联系方式不得公开。",
    references: [
      { name: "TimeBanks.Org", url: "https://www.youtube.com/@TimeBanksOrg" },
      { name: "Timebanking UK", url: "https://www.youtube.com/@TimebankingUK" },
      { name: "hOurworld", url: "https://www.youtube.com/@hOurworldTimebank" },
      { name: "Shareable", url: "https://www.youtube.com/@shareable" },
    ],
  },
  {
    id: "shared-book-box-steward-diary",
    title: "街角共享书箱补书、维护与阅读流转日记",
    mode: "faceless",
    category: "共享书箱维护",
    promise:
      "由获准的维护者记录选址、补书、天气维护、书目变化和社区反馈，让一个小书箱如何长期保持整洁、开放和有用可被持续看见。",
    beginnerFit:
      "可先协助已有书箱盘点和清洁，不必立刻新建；一张不记录借阅者身份的书目变化表就能形成每月栏目。",
    minimumKit: ["手机或相机", "场地与维护者许可", "补书、移除、维护和复查日期表", "防水、结构与儿童内容检查清单"],
    repeatableFormat: ["说明书箱身份、场地许可和检查日期", "记录完全不拍读者身份的库存变化", "按规则处理受潮、破损或不适合内容", "完成结构、清洁和防水维护", "汇总社区建议并设置下次补书日期"],
    firstTopics: ["一个月哪些书被带走和补回", "雨季前怎样检查书箱", "受潮旧书应该怎样处理", "一年后社区书目发生了什么"],
    incomePaths: ["YouTube 广告", "阅读公益机构合作", "书店或出版社透明捐赠", "书箱维护与社区活动记录"],
    caution:
      "不能未经许可占用公共或私人土地，也不得拍摄或追踪取书者；官方品牌名称、地图地址、儿童内容、版权复制和结构安全应服从项目方及当地规则。",
    references: [
      { name: "Little Free Library", url: "https://www.youtube.com/@littlefreelibrary" },
      { name: "Book Riot", url: "https://www.youtube.com/@BookRiot" },
      { name: "Reading Is Fundamental", url: "https://www.youtube.com/@RIFWeb" },
      { name: "First Book", url: "https://www.youtube.com/@FirstBook" },
    ],
  },
  {
    id: "new-neighbor-resource-guide-update",
    title: "新邻居生活资源包、实测路线与季度更新",
    mode: "hybrid",
    category: "新居民社区导航",
    promise:
      "与新搬入、移民或难民居民共同整理交通、办事、语言支持、社区空间和求助渠道，并用实测与日期持续淘汰过期资料。",
    beginnerFit:
      "从自己街区五项公开服务开始，邀请愿意参与的新居民核对是否看得懂、找得到和真的能用，不需要追问其迁移经历。",
    minimumKit: ["手机或相机", "参与者主动授权与翻译核对", "官方服务来源、实测日期与版本表", "隐私、转介和失效信息处理清单"],
    repeatableFormat: ["说明服务对象、语言版本和信息截止日期", "连接官方来源并实测一项公开流程", "由自愿参与者评价可理解与可到达性", "区分一般导航和专业法律或福利意见", "按季度复查联系方式、资格和下一次更新日期"],
    firstTopics: ["刚搬来最先需要知道的五个地方", "一张公共交通卡怎样实际办理", "免费语言支持在哪里以及何时开放", "三个月后哪些资源已经失效"],
    incomePaths: ["YouTube 广告", "社区与安置机构合作", "多语资源制作", "地方服务导航与影像委托"],
    caution:
      "不得要求参与者公开移民身份、住址、创伤或福利记录，也不能替代法律、移民、医疗和政府意见；资格与开放时间必须标注来源和复查日期。",
    references: [
      { name: "Welcoming America", url: "https://www.youtube.com/@WelcomingAmerica" },
      { name: "International Rescue Committee", url: "https://www.youtube.com/@theIRC" },
      { name: "Refugee Council", url: "https://www.youtube.com/@RefugeeCouncil" },
      { name: "Strong Towns", url: "https://www.youtube.com/@strongtowns" },
    ],
  },
];
