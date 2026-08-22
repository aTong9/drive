import type { OrdinaryCreatorModel } from "./ordinaryCreatorModels.js";

export const ordinaryCreatorEvidenceArchiveModels: OrdinaryCreatorModel[] = [
  {
    id: "backyard-biodiversity-field-log",
    title: "后院与社区生物多样性观察日志",
    mode: "hybrid",
    category: "公民自然观察",
    promise:
      "固定记录同一片小环境里的鸟、昆虫、菌类和植物变化，让普通人的长期观察成为可复查的地方自然档案。",
    beginnerFit:
      "一部手机和一条反复行走的短路线就能开始；稳定的日期、地点范围和识别依据比稀有物种更重要。",
    minimumKit: ["手机或相机", "微距夹镜或望远镜（可选）", "观察记录表", "物种识别工具"],
    repeatableFormat: [
      "展示日期、天气和固定观察范围",
      "记录本次看见或听见的物种",
      "说明识别依据与不确定项",
      "对比上周、上月或去年同期",
      "附原始照片、录音或公民科学记录链接",
    ],
    firstTopics: ["同一棵树的四周访客", "雨后一小时出现什么", "阳台夜间昆虫记录", "社区十种常见鸟叫"],
    incomePaths: ["YouTube 广告", "观察装备联盟链接", "地方自然导览", "照片与观察手册"],
    caution:
      "不公布敏感物种的精确位置，不抓取或干扰野生动物；无法确认的物种要明确标成待核对，不能为了标题伪造发现。",
    references: [
      { name: "Crime Pays But Botany Doesn't", url: "https://www.youtube.com/@CrimePaysButBotanyDoesnt" },
      { name: "Learn Your Land", url: "https://www.youtube.com/@LearnYourLand" },
      { name: "Lesley the Bird Nerd", url: "https://www.youtube.com/@LesleytheBirdNerd" },
      { name: "My Wild Backyard", url: "https://www.youtube.com/@MyWildBackyard" },
    ],
  },
  {
    id: "backyard-night-sky-observation-log",
    title: "家庭夜空观测与拍摄成长日志",
    mode: "hybrid",
    category: "业余天文记录",
    promise:
      "公开天气、光污染、器材、参数和失败过程，记录一个普通人从肉眼与手机逐步看懂并拍到夜空。",
    beginnerFit:
      "可以从月相、星座和手机长曝光开始，不必先购买昂贵望远镜；每次观测条件本身就是内容。",
    minimumKit: ["手机或入门相机", "稳固三脚架", "红光手电", "天气与星图应用"],
    repeatableFormat: [
      "先列目标、日期和观测条件",
      "展示器材与完整拍摄参数",
      "保留对焦、云层和跟踪失败",
      "对比原片与处理结果",
      "更新下一次改进假设",
    ],
    firstTopics: ["一部手机记录完整月相", "城市阳台能看到哪些星", "第一次拍银河失败复盘", "同一目标一年后的进步"],
    incomePaths: ["YouTube 广告", "器材联盟链接", "照片印刷", "入门参数清单"],
    caution:
      "不得把合成、AI 生成或他人素材冒充单次观测结果；夜间外拍要说明交通、天气、用电与独行安全边界。",
    references: [
      { name: "AstroBackyard", url: "https://www.youtube.com/@AstroBackyard" },
      { name: "Nebula Photos", url: "https://www.youtube.com/@NebulaPhotos" },
      { name: "AstroBiscuit", url: "https://www.youtube.com/@AstroBiscuit" },
      { name: "Cuiv, The Lazy Geek", url: "https://www.youtube.com/@CuivTheLazyGeek" },
    ],
  },
  {
    id: "family-recipe-oral-history",
    title: "家族食谱与长辈口述记忆档案",
    mode: "on-camera",
    category: "家庭口述史",
    promise:
      "让长辈一边做熟悉的家常食物一边讲述迁徙、节庆、贫困和家庭记忆，把配方与人生一起保存下来。",
    beginnerFit:
      "不需要专业厨艺；一道反复做过的菜、一位愿意讲述的家人和尊重停拍权的访谈就足够。",
    minimumKit: ["手机", "领夹麦", "桌面支架", "食谱与授权记录表"],
    repeatableFormat: [
      "交代讲述者、年代与菜的来历",
      "边做边记录真实用量和手感",
      "追问与人物相关的具体记忆",
      "核对容易混淆的时间与地名",
      "保存成品、文字食谱和授权范围",
    ],
    firstTopics: ["家里最便宜的一顿饭", "只有节日才做的菜", "从故乡带来的味道", "没有量杯的祖传做法"],
    incomePaths: ["YouTube 广告", "家庭食谱小册", "文化机构合作", "口述史拍摄服务"],
    caution:
      "拍摄前确认长辈是否愿意公开姓名、健康、战争、贫困和家庭冲突等信息；记忆可能有误，不能替当事人润色成虚构传奇。",
    references: [
      { name: "Great Depression Cooking", url: "https://www.youtube.com/user/DepressionCooking" },
      { name: "Pasta Grannies", url: "https://www.youtube.com/@pastagrannies" },
      { name: "Beryl Shereshewsky", url: "https://www.youtube.com/@BerylShereshewsky" },
      { name: "Country Life Vlog", url: "https://www.youtube.com/@country_life_vlog" },
    ],
  },
  {
    id: "fixed-grocery-basket-price-log",
    title: "固定购物篮与家庭物价长期追踪",
    mode: "hybrid",
    category: "家庭物价记录",
    promise:
      "每隔固定周期在同一区域复购同一组基础商品，用小票、规格和替代规则展示普通家庭真正感受到的价格变化。",
    beginnerFit:
      "无需财经背景；只要先公开篮子规则并持续保留小票，就能做出比一次性省钱挑战更有价值的长期栏目。",
    minimumKit: ["手机", "固定商品清单", "小票归档", "简单表格"],
    repeatableFormat: [
      "标注日期、门店和商品规格",
      "按固定规则完成本期购物",
      "展示缺货、促销与替代品",
      "与上期及去年同期逐项对比",
      "公开表格、来源和规则变更",
    ],
    firstTopics: ["十种基础食材月度价格", "同一百元购物篮一年变化", "促销价是否真的便宜", "不同社区同规格商品对比"],
    incomePaths: ["YouTube 广告", "预算表模板", "生活服务品牌合作", "本地媒体数据合作"],
    caution:
      "单个家庭购物篮不等于官方通胀指数；必须保留规格、税费、会员价和替代规则，品牌合作不得影响价格结论。",
    references: [
      { name: "Under the Median", url: "https://www.youtube.com/@UndertheMedian" },
      { name: "Frugal Fit Mom", url: "https://www.youtube.com/@FrugalFitMom" },
      { name: "Atomic Shrimp", url: "https://www.youtube.com/@AtomicShrimp" },
      { name: "The Wolfe Pit", url: "https://www.youtube.com/@TheWolfePit" },
    ],
  },
  {
    id: "heirloom-object-restoration-archive",
    title: "家庭旧物修复与来历追踪档案",
    mode: "hybrid",
    category: "物件来历与修复",
    promise:
      "围绕一件有来历的旧家具、工具、玩具或照片，记录寻证、清洁、修复、保存和回到家庭生活的全过程。",
    beginnerFit:
      "可以先从无高价值风险的小物件和基础清洁开始；真正吸引人的不是翻新爽感，而是物件与人的关系。",
    minimumKit: ["手机或相机", "俯拍支架", "基础清洁工具", "来历与工序记录表"],
    repeatableFormat: [
      "记录修复前状态与已知来历",
      "查找铭牌、照片和家庭证词",
      "先做材质测试与风险判断",
      "完整记录每一步可逆或不可逆处理",
      "展示修复结果、剩余缺陷和保存建议",
    ],
    firstTopics: ["修好祖辈留下的旧钟", "一张老照片背后的地址", "旧工具铭牌查档", "保留磨损还是重新上漆"],
    incomePaths: ["YouTube 广告", "工具联盟链接", "修复委托转介", "家庭物件影像档案服务"],
    caution:
      "文物、高价值艺术品、霉菌、铅漆和电器必须先交由专业人员判断；修复会抹掉历史证据时，应优先稳定保存而非追求焕然一新。",
    references: [
      { name: "Baumgartner Restoration", url: "https://www.youtube.com/@BaumgartnerRestoration" },
      { name: "Thomas Johnson Antique Furniture Restoration", url: "https://www.youtube.com/@johnsonrestoration" },
      { name: "my mechanics", url: "https://www.youtube.com/@mymechanics" },
      { name: "Odd Tinkering", url: "https://www.youtube.com/@OddTinkering" },
    ],
  },
];
