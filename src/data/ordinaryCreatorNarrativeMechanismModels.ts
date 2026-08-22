import type { OrdinaryCreatorModel } from "./ordinaryCreatorModels.js";

type MechanismSeed = {
  id: string;
  title: string;
  mode: OrdinaryCreatorModel["mode"];
  category: string;
  promise: string;
  beginnerFit: string;
  format: string[];
  topics: string[];
  income: string[];
  caution: string;
  references: Array<[name: string, handle: string]>;
};

const seeds: MechanismSeed[] = [
  {
    id: "same-route-commute-diary",
    title: "同一路线通勤、天气与城市变化日记",
    mode: "faceless",
    category: "重复路线",
    promise:
      "固定记录同一段步行、骑行、公交或驾车通勤，让季节、天气、施工和城市生活自己产生变化。",
    beginnerFit:
      "无需不断寻找新地点；最熟悉的一条合法路线就是栏目，稳定机位和日期信息比复杂讲解更重要。",
    format: ["日期天气与起点", "同一视角出发", "沿途变化节点", "当日异常或声音", "到达时间与简短对比"],
    topics: ["同一路线连续七天", "雨天与晴天通勤对比", "一年四季的同一个路口", "施工前后的路线变化"],
    income: ["YouTube 广告", "通勤装备联盟", "本地交通合作", "城市影像授权"],
    caution:
      "隐藏住址、单位和固定精确时刻；驾驶时设备必须预先固定且不可操作，公共交通内注意乘客隐私和运营方规则。",
    references: [
      ["Rambalac", "Rambalac"],
      ["Walk East", "WalkEast"],
      ["ActionKid", "ActionKid"],
      ["London Eats", "LondonEats"],
      ["Ride Along Gang", "RideAlongGang"],
    ],
  },
  {
    id: "market-stall-business-diary",
    title: "摆摊、早市与流动小生意经营日记",
    mode: "hybrid",
    category: "摊位经营",
    promise:
      "从备货、出摊、客流、天气、损耗到收摊结算，连续呈现小生意每天如何真实运转。",
    beginnerFit:
      "一个小摊和一部手机就能形成完整故事，日常营收差异、选品和熟客关系天然适合追更。",
    format: ["今日成本与备货", "搭建摊位", "客流和现场问题", "收摊盘点", "营收、损耗与下次调整"],
    topics: ["第一次周末市集", "下雨天还要不要出摊", "最好卖与最滞销的商品", "一个月真实摊位账本"],
    income: ["摊位经营收入", "YouTube 广告", "工具设备联盟", "本地市集和品牌合作"],
    caution:
      "核对摆摊许可、食品安全和税务规则；未经同意不拍清晰顾客面孔，也不能用摆拍冲突或虚假营收吸引观看。",
    references: [
      ["DancingBacons", "DancingBacons"],
      ["Travel Thirsty", "TravelThirstyBlog"],
      ["FoodieBoy", "FoodieBoy"],
      ["Best Ever Food Review Show", "BestEverFoodReviewShow"],
      ["The Food Ranger", "thefoodranger"],
    ],
  },
  {
    id: "single-object-lifecycle",
    title: "一件物品从获得、使用到修复的完整生命线",
    mode: "faceless",
    category: "物品故事",
    promise:
      "围绕一件旧物、工具或日用品，记录来源、状态、长期使用、故障、维修和最终去向。",
    beginnerFit:
      "不需要大量收藏；一件真实使用的物品就能同时承载过程满足、消费判断和个人记忆。",
    format: ["物品来历与现状", "拆解或初次测试", "一段时间真实使用", "故障、磨损与修复", "总成本和最终去向"],
    topics: ["二手相机用满一年", "修好家里最旧的工具", "一双鞋穿到报废", "买错的物品怎样处理"],
    income: ["YouTube 广告", "工具材料联盟", "维修或评测合作", "影像与故事授权"],
    caution:
      "说明赠品、赞助和实际使用周期；涉及电池、电气、燃气、承重及收藏价值时必须采用相应安全和鉴定边界。",
    references: [
      ["my mechanics", "mymechanics"],
      ["Odd Tinkering", "OddTinkering"],
      ["Baumgartner Restoration", "BaumgartnerRestoration"],
      ["Hand Tool Rescue", "HandToolRescue"],
      ["Project Farm", "ProjectFarm"],
    ],
  },
  {
    id: "seasonal-work-calendar",
    title: "季节性工作、忙闲周期与一年生产日历",
    mode: "hybrid",
    category: "季节工作",
    promise:
      "按照一年真实生产节奏记录播种、旺季、采收、维护和淡季准备，让时间成为频道结构。",
    beginnerFit:
      "农场、果园、花店、旅游服务或节庆生意都可采用，不必每周制造一个全新项目。",
    format: ["本周季节节点", "需要完成的工作", "天气和资源条件", "执行与突发变化", "产量、成本和下个节点"],
    topics: ["旺季前的准备清单", "一次天气变化造成的影响", "最忙的一周", "淡季究竟在做什么"],
    income: ["主营业务收入", "YouTube 广告", "生产工具联盟", "农产品或季节品牌合作"],
    caution:
      "不为拍摄冒险操作机械或隐瞒雇员劳动；说明地区、年份和气候差异，涉及食品、动物与农药时遵守专业规范。",
    references: [
      ["Gold Shaw Farm", "GoldShawFarm"],
      ["Just a Few Acres Farm", "JustaFewAcresFarm"],
      ["Millennial Farmer", "MillennialFarmer"],
      ["Sandi Brock", "SandiBrock"],
      ["The Seasonal Homestead", "TheSeasonalHomestead"],
    ],
  },
  {
    id: "public-thirty-day-experiment",
    title: "30 天公开实验、每日证据与最终复盘",
    mode: "on-camera",
    category: "公开实验",
    promise:
      "选择一个可测量、低风险的生活改变，持续记录基线、每日执行、失败、数据和最终是否值得坚持。",
    beginnerFit:
      "普通目标比极限挑战更容易复现；手机、简单日志和诚实更新即可形成明确追更理由。",
    format: ["挑战规则与基线", "阶段记录", "第一次失败", "中途调整", "30 天结果与是否继续"],
    topics: ["连续早睡 30 天", "每天整理一个抽屉", "30 天只做家常饭", "每天练习十分钟拍摄"],
    income: ["YouTube 广告", "日志模板", "与目标一致的工具联盟", "透明品牌挑战合作"],
    caution:
      "不能用危险节食、过度训练、停药或财务赌博制造结果；预先写清失败标准，不删掉不理想的数据和中途偏差。",
    references: [
      ["Matt D'Avella", "mattdavella"],
      ["Mike Shake", "MikeShake"],
      ["Goal Guys", "GoalGuys"],
      ["Michelle Khare", "MichelleKhare"],
      ["Nathaniel Drew", "nathanieldrewofficial"],
    ],
  },
  {
    id: "one-neighborhood-micro-stories",
    title: "一个街区的微观察、人物与长期变化",
    mode: "hybrid",
    category: "街区观察",
    promise:
      "长期只关注一个步行可达街区，通过小店、公共空间、声音、人物和改造建立地方档案。",
    beginnerFit:
      "不需要旅行预算；对一个地方反复回访、认识人和核对变化，比一次性打卡更有壁垒。",
    format: ["本期街区问题", "地点和历史背景", "现场观察", "当事人声音或物件细节", "变化记录与下次回访"],
    topics: ["清晨五点的街区", "一家小店的一年", "同一个广场的四季", "一条路为什么慢慢改变"],
    income: ["YouTube 广告", "地方机构合作", "社区影像委托", "地图、刊物或影像授权"],
    caution:
      "采访和室内拍摄先获得许可，不把弱势居民当景观；商业合作、利益关系、历史争议与资料不确定性必须公开。",
    references: [
      ["Peter Santenello", "PeterSantenello"],
      ["Beau Miles", "BeauMiles"],
      ["Kirsten Dirksen", "kirstendirksen"],
      ["Not Just Bikes", "NotJustBikes"],
      ["Life Where I'm From", "LifeWhereImFrom"],
    ],
  },
];

export const ordinaryCreatorNarrativeMechanismModels: OrdinaryCreatorModel[] =
  seeds.map((seed) => ({
    id: seed.id,
    title: seed.title,
    mode: seed.mode,
    category: seed.category,
    promise: seed.promise,
    beginnerFit: seed.beginnerFit,
    minimumKit: ["手机或相机", "固定支撑或安全机位", "日期与数据记录", "隐私、许可和风险清单"],
    repeatableFormat: seed.format,
    firstTopics: seed.topics,
    incomePaths: seed.income,
    caution: seed.caution,
    references: seed.references.map(([name, handle]) => ({
      name,
      url: `https://www.youtube.com/@${handle}`,
    })),
  }));
