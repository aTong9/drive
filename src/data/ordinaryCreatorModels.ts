import { ordinaryCreatorModelExpansion } from "./ordinaryCreatorModelsExpansion.js";
import { ordinaryCreatorReferenceIndex } from "./ordinaryCreatorReferenceIndex.js";
import { ordinaryCreatorVerticalModels } from "./ordinaryCreatorVerticalModels.js";
import { ordinaryCreatorVerticalModelsMore } from "./ordinaryCreatorVerticalModelsMore.js";
import { ordinaryCreatorVerticalModelsMore2 } from "./ordinaryCreatorVerticalModelsMore2.js";
import { ordinaryCreatorVerticalModelsMore3 } from "./ordinaryCreatorVerticalModelsMore3.js";
import { ordinaryCreatorVerticalModelsMore4 } from "./ordinaryCreatorVerticalModelsMore4.js";
import { ordinaryCreatorVerticalModelsMore5 } from "./ordinaryCreatorVerticalModelsMore5.js";
import { ordinaryCreatorVerticalModelsBatch30 } from "./ordinaryCreatorVerticalModelsBatch30.js";
import { ordinaryCreatorVerticalModelsBatch50 } from "./ordinaryCreatorVerticalModelsBatch50.js";
import { ordinaryCreatorVerticalModelsBatch50B } from "./ordinaryCreatorVerticalModelsBatch50B.js";
import { ordinaryCreatorVerticalModelsBatch90 } from "./ordinaryCreatorVerticalModelsBatch90.js";
import { ordinaryCreatorLifestyleModels } from "./ordinaryCreatorLifestyleModels.js";

export type AppearanceMode = "on-camera" | "faceless" | "hybrid";

export interface OrdinaryCreatorModel {
  id: string;
  title: string;
  mode: AppearanceMode;
  category: string;
  promise: string;
  beginnerFit: string;
  minimumKit: string[];
  repeatableFormat: string[];
  firstTopics: string[];
  incomePaths: string[];
  caution: string;
  references: Array<{ name: string; url: string }>;
}

export const appearanceModeLabels: Record<AppearanceMode, string> = {
  "on-camera": "露脸主导",
  faceless: "完全不露脸",
  hybrid: "可露脸／可不露脸",
};

const ordinaryCreatorModelBase: OrdinaryCreatorModel[] = [
  {
    id: "practical-life-skills",
    title: "生活技能与问题解决",
    mode: "on-camera",
    category: "实用教程",
    promise:
      "用可信的人格和清楚步骤，解决换灯泡、打领带、基础维修、租房维护等具体问题。",
    beginnerFit: "不需要豪华场景；只要你真的会做一件事，并能安全地解释清楚。",
    minimumKit: ["手机或相机", "领夹麦", "三脚架", "一盏柔光灯"],
    repeatableFormat: [
      "问题与完成效果 15 秒",
      "工具清单",
      "分步骤演示",
      "常见错误",
      "结果与安全提醒",
    ],
    firstTopics: [
      "新人租房入住检查",
      "汽车玻璃水与胎压",
      "家用工具入门",
      "衣物基础修补",
    ],
    incomePaths: ["YouTube 广告", "工具联盟链接", "品牌合作", "付费清单"],
    caution:
      "电气、燃气、车辆和结构安全内容必须说明能力边界；不能用演示替代持证专业服务。",
    references: [
      { name: "Dad, how do I?", url: "https://www.youtube.com/@DadhowdoI" },
      { name: "See Jane Drill", url: "https://www.youtube.com/@seejanedrill" },
      {
        name: "Home RenoVision DIY",
        url: "https://www.youtube.com/@HomeRenoVisionDIY",
      },
    ],
  },
  {
    id: "home-cooking-host",
    title: "家常菜与低预算饮食",
    mode: "on-camera",
    category: "美食生活",
    promise: "让观众知道普通厨房里如何用常见食材完成一顿可复制的饭。",
    beginnerFit: "本地食材和真实日常就是差异化，不必从复杂餐厅菜开始。",
    minimumKit: ["手机", "桌面俯拍架", "补光灯", "厨房环境声或领夹麦"],
    repeatableFormat: [
      "成品先展示",
      "成本与份量",
      "备料",
      "关键火候",
      "试吃与保存方法",
    ],
    firstTopics: [
      "20 元两人晚餐",
      "上班族一锅料理",
      "广东时令家常菜",
      "剩菜二次利用",
    ],
    incomePaths: ["广告", "厨具联盟", "食材品牌", "电子食谱"],
    caution: "标注实际份量和成本日期；营养或疾病饮食建议不能冒充医疗建议。",
    references: [
      { name: "Pick Up Limes", url: "https://www.youtube.com/@PickUpLimes" },
      { name: "Pro Home Cooks", url: "https://www.youtube.com/@ProHomeCooks" },
      {
        name: "Chinese Cooking Demystified",
        url: "https://www.youtube.com/@ChineseCookingDemystified",
      },
    ],
  },
  {
    id: "balcony-gardening",
    title: "阳台种植与城市园艺",
    mode: "on-camera",
    category: "家庭兴趣",
    promise: "记录一种植物从播种、失败、修正到收获，让时间本身形成连续追更。",
    beginnerFit: "阳台、窗台和社区小空间都能做，成长过程天然产生系列内容。",
    minimumKit: ["手机", "小三脚架", "微距夹镜可选", "日期记录表"],
    repeatableFormat: [
      "本周状态",
      "一个具体问题",
      "实际操作",
      "七天后结果",
      "下期变量",
    ],
    firstTopics: ["新手香草盆栽", "广东夏季防晒", "小空间堆肥", "常见虫害观察"],
    incomePaths: ["广告", "园艺用品联盟", "苗木品牌", "本地课程"],
    caution:
      "不同气候和季节结果不可照搬；农药、宠物毒性和入侵物种必须核对本地资料。",
    references: [
      { name: "Epic Gardening", url: "https://www.youtube.com/@epicgardening" },
      {
        name: "Self Sufficient Me",
        url: "https://www.youtube.com/@Selfsufficientme",
      },
      { name: "GrowVeg", url: "https://www.youtube.com/@GrowVeg" },
    ],
  },
  {
    id: "beginner-fitness-journey",
    title: "普通人运动与进步记录",
    mode: "on-camera",
    category: "运动成长",
    promise: "以真实起点记录步行、跑步、骑行、拉伸或力量训练的可持续进步。",
    beginnerFit: "观众更需要可跟随的普通人过程，而不只是专业运动员的结果。",
    minimumKit: ["手机", "三脚架", "运动手表可选", "训练日志"],
    repeatableFormat: [
      "本周目标",
      "训练片段",
      "数据变化",
      "困难与调整",
      "下周计划",
    ],
    firstTopics: [
      "零基础连续走路 30 天",
      "第一次 5 公里",
      "久坐人群活动记录",
      "低预算骑行准备",
    ],
    incomePaths: ["广告", "运动装备联盟", "品牌挑战", "训练日志模板"],
    caution:
      "不要承诺减重或治疗效果；疼痛、慢病和高强度训练应建议观众咨询专业人士。",
    references: [
      {
        name: "Yoga With Adriene",
        url: "https://www.youtube.com/@yogawithadriene",
      },
      {
        name: "Hybrid Calisthenics",
        url: "https://www.youtube.com/@HybridCalisthenics",
      },
      {
        name: "The Body Coach TV",
        url: "https://www.youtube.com/@TheBodyCoachTV",
      },
    ],
  },
  {
    id: "local-human-stories",
    title: "本地人物与小店故事",
    mode: "on-camera",
    category: "社区纪实",
    promise: "从一位普通人、一门手艺或一家小店，讲清本地生活如何运转。",
    beginnerFit: "不依赖远途旅行；熟悉的社区和长期关系反而是进入门槛。",
    minimumKit: ["手机或相机", "双人领夹麦", "三脚架", "授权确认"],
    repeatableFormat: [
      "地点建立",
      "人物为什么做",
      "工作过程",
      "困难与变化",
      "一天结束",
    ],
    firstTopics: [
      "清晨菜市场摊主",
      "修鞋店的一天",
      "社区理发师",
      "传统早餐制作",
    ],
    incomePaths: ["广告", "本地品牌赞助", "纪录片委托", "影像服务"],
    caution:
      "拍摄前取得明确同意；弱势人物、未成年人、收入和住址等信息要优先保护。",
    references: [
      {
        name: "Great Big Story",
        url: "https://www.youtube.com/@greatbigstory",
      },
      {
        name: "Kirsten Dirksen",
        url: "https://www.youtube.com/@kirstendirksen",
      },
      { name: "Insider Food", url: "https://www.youtube.com/@InsiderFood" },
    ],
  },
  {
    id: "personal-learning-notes",
    title: "学习方法与技能成长",
    mode: "on-camera",
    category: "知识成长",
    promise: "公开学习一项技能的系统、实验和复盘，让观众一起完成而非只听结论。",
    beginnerFit:
      "不要求先成为专家，但必须诚实区分学习笔记、个人经验和专业结论。",
    minimumKit: ["手机或网络摄像头", "USB 麦克风", "屏幕录制", "笔记工具"],
    repeatableFormat: [
      "问题",
      "采用的方法",
      "一周实验",
      "数据或作品",
      "下一步修正",
    ],
    firstTopics: [
      "30 天学剪辑",
      "建立阅读笔记",
      "普通人英语输入",
      "每周复盘系统",
    ],
    incomePaths: ["广告", "软件联盟", "模板", "课程或社群"],
    caution:
      "不要把刚学到的内容包装成权威；引用研究、书籍和他人框架时必须标来源。",
    references: [
      { name: "Ali Abdaal", url: "https://www.youtube.com/@aliabdaal" },
      { name: "Thomas Frank", url: "https://www.youtube.com/@Thomasfrank" },
      { name: "Matt D'Avella", url: "https://www.youtube.com/@mattdavella" },
    ],
  },
  {
    id: "screen-tutorials",
    title: "软件、手机与数字办事教程",
    mode: "faceless",
    category: "屏幕教程",
    promise: "通过屏幕录制准确解决一个搜索型问题，观众只关心步骤是否有效。",
    beginnerFit: "不需出镜或外出；清晰录音和基于当前版本的真实操作比器材重要。",
    minimumKit: ["电脑或手机", "屏幕录制软件", "USB 麦克风", "隐私遮罩"],
    repeatableFormat: [
      "展示最终结果",
      "版本与前提",
      "逐步操作",
      "错误排查",
      "快速复盘",
    ],
    firstTopics: [
      "达芬奇 HDR 项目设置",
      "手机照片备份",
      "常用表格自动化",
      "GitHub Release 下载",
    ],
    incomePaths: ["广告", "软件联盟", "模板", "远程咨询"],
    caution:
      "软件更新快，标题和画面必须写版本；录屏前隐藏账号、密钥、通知和个人文件。",
    references: [
      {
        name: "Kevin Stratvert",
        url: "https://www.youtube.com/@KevinStratvert",
      },
      { name: "Teacher's Tech", url: "https://www.youtube.com/@TeachersTech" },
      { name: "TechGumbo", url: "https://www.youtube.com/@TechGumbo" },
    ],
  },
  {
    id: "hands-only-repair",
    title: "手部出镜维修、翻新与制作",
    mode: "faceless",
    category: "过程满足",
    promise: "只拍双手、工具和材料，把损坏物品恢复为可用状态，过程就是叙事。",
    beginnerFit: "不需要面对镜头，但需要真实技能、可验证前后对比和稳定近景。",
    minimumKit: ["手机或相机", "俯拍架", "两盏灯", "近场麦克风"],
    repeatableFormat: ["损坏状态", "拆解", "清洁修复", "重新组装", "功能测试"],
    firstTopics: [
      "旧键盘深度清洁",
      "生锈手工具修复",
      "二手家具小修",
      "旧相机外观维护",
    ],
    incomePaths: ["广告", "工具联盟", "修复委托", "成品销售"],
    caution:
      "不能伪造损坏或把危险修复包装成新手项目；粉尘、溶剂、电池和电器要遵守安全规范。",
    references: [
      { name: "Odd Tinkering", url: "https://www.youtube.com/@OddTinkering" },
      { name: "my mechanics", url: "https://www.youtube.com/@mymechanics" },
      {
        name: "Hand Tool Rescue",
        url: "https://www.youtube.com/@HandToolRescue",
      },
    ],
  },
  {
    id: "study-with-me",
    title: "Study With Me／专注陪伴",
    mode: "faceless",
    category: "长时陪伴",
    promise: "以真实学习、工作和计时结构，为观众提供可一起完成任务的安静空间。",
    beginnerFit:
      "桌面即可开始，核心是规律发布、真实时长和稳定声画，而不是展示身份。",
    minimumKit: ["手机", "固定支架", "台灯", "计时器", "环境声"],
    repeatableFormat: [
      "目标与时长",
      "50/10 或 25/5 计时",
      "休息提示",
      "环境声连续",
      "完成记录",
    ],
    firstTopics: [
      "雨夜 2 小时专注",
      "清晨 50/10 番茄钟",
      "无音乐剪辑陪伴",
      "图书馆环境声",
    ],
    incomePaths: ["广告", "文具联盟", "直播会员", "专注模板"],
    caution:
      "不要播放无授权音乐或反复循环少量画面；桌面信息、学校和实时位置需要隐藏。",
    references: [
      { name: "StudyMD", url: "https://www.youtube.com/@StudyMD" },
      { name: "Merve", url: "https://www.youtube.com/@MerveStudyCorner" },
      { name: "Abao in Tokyo", url: "https://www.youtube.com/@AbaoInTokyo" },
    ],
  },
  {
    id: "no-face-cooking",
    title: "无露脸烹饪与烘焙 ASMR",
    mode: "faceless",
    category: "美食过程",
    promise:
      "用手部动作、食材变化和真实声音，把一道食物拍成无需语言也能理解的过程。",
    beginnerFit: "家常配方也能成立；重点是镜头顺序、声音细节和最终质感。",
    minimumKit: ["手机", "俯拍架", "柔光", "近场录音设备"],
    repeatableFormat: [
      "成品钩子",
      "原料字幕",
      "关键动作近景",
      "烹饪声",
      "切开与口感",
    ],
    firstTopics: ["三种早餐", "一锅家常菜", "广式糖水", "无旁白露营料理"],
    incomePaths: ["广告", "厨具联盟", "食谱", "食材合作"],
    caution:
      "不能只追求声音而忽略食品卫生；配方、音乐和他人镜头都存在版权边界。",
    references: [
      { name: "Nino's Home", url: "https://www.youtube.com/@NinosHome" },
      {
        name: "HidaMari Cooking",
        url: "https://www.youtube.com/@HidaMariCooking",
      },
      {
        name: "Peaceful Cuisine",
        url: "https://www.youtube.com/@peacefulcuisine",
      },
    ],
  },
  {
    id: "primitive-build-process",
    title: "户外搭建与传统手作过程",
    mode: "faceless",
    category: "技能过程",
    promise: "让材料、工具、天气与逐步完成承担叙事，不依赖对白和个人形象。",
    beginnerFit: "可从小型木作、绳结、露营整理开始，不应模仿高风险荒野工程。",
    minimumKit: ["固定相机", "备用电池", "防水保护", "环境声录制"],
    repeatableFormat: ["材料来源", "目标", "关键工序", "失败修正", "实用测试"],
    firstTopics: [
      "露营装备收纳架",
      "基础绳结用途",
      "竹木小物",
      "雨天营地排水观察",
    ],
    incomePaths: ["广告", "户外装备联盟", "手作成品", "品牌合作"],
    caution:
      "土地使用、取材、用火、刀具和建筑安全优先；不能破坏环境或伪造所谓原始建造。",
    references: [
      {
        name: "Primitive Technology",
        url: "https://www.youtube.com/@primitivetechnology9550",
      },
      { name: "TA Outdoors", url: "https://www.youtube.com/@TAOutdoors" },
      {
        name: "Bertram - Craft and Wilderness",
        url: "https://www.youtube.com/channel/UCO_augYhnO7tF-d4JbSXFuQ",
      },
    ],
  },
  {
    id: "visual-explainers",
    title: "图表、白板与旁白解释",
    mode: "faceless",
    category: "知识解释",
    promise: "用原创图表、屏幕标注和旁白，把一个复杂概念拆成能看懂的视觉结构。",
    beginnerFit: "不必出镜，但研究、写稿和原创视觉的时间投入高于一般口播。",
    minimumKit: ["电脑", "麦克风", "演示或绘图软件", "引用清单"],
    repeatableFormat: [
      "一个问题",
      "三个关键变量",
      "案例",
      "限制条件",
      "结论与来源",
    ],
    firstTopics: [
      "HDR10 与 HLG 区别",
      "视频码率如何影响体积",
      "YouTube 收益估算误区",
      "相机曝光三角",
    ],
    incomePaths: ["广告", "赞助", "数字产品", "企业内容制作"],
    caution:
      "旁白不能掩盖资料不足；数据、新闻、医学和财务内容要使用可追溯来源并注明时效。",
    references: [
      {
        name: "The Swedish Investor",
        url: "https://www.youtube.com/@TheSwedishInvestor",
      },
      {
        name: "Economics Explained",
        url: "https://www.youtube.com/@EconomicsExplained",
      },
      { name: "PolyMatter", url: "https://www.youtube.com/@PolyMatter" },
    ],
  },
  {
    id: "honest-product-tests",
    title: "普通预算产品实测",
    mode: "hybrid",
    category: "消费决策",
    promise: "用固定测试方法回答产品是否适合某类真实使用者，而不是朗读规格表。",
    beginnerFit: "可只拍手和产品，也可在结论段露脸；从已有物品和同类对比开始。",
    minimumKit: ["手机", "桌面灯", "测量工具", "测试记录表"],
    repeatableFormat: [
      "购买背景",
      "统一测试",
      "真实使用",
      "优缺点",
      "适合与不适合谁",
    ],
    firstTopics: [
      "三种手机支架稳定性",
      "平价领夹麦户外测试",
      "ND 镜偏色比较",
      "移动硬盘剪辑测试",
    ],
    incomePaths: ["广告", "联盟链接", "品牌合作", "采购咨询"],
    caution: "明确自购、借测或赞助；联盟链接不能改变结论，测试条件必须可复现。",
    references: [
      { name: "Project Farm", url: "https://www.youtube.com/@ProjectFarm" },
      { name: "Vacuum Wars", url: "https://www.youtube.com/@VacuumWars" },
      { name: "The Hook Up", url: "https://www.youtube.com/@TheHookUp" },
    ],
  },
  {
    id: "pet-care-process",
    title: "宠物护理与日常过程",
    mode: "hybrid",
    category: "宠物生活",
    promise: "围绕护理、训练、散步和居家环境，提供有完成感的真实过程。",
    beginnerFit:
      "宠物是主体，创作者可以只旁白或偶尔出镜，但必须具备真实照护经验。",
    minimumKit: ["手机", "固定机位", "无线麦可选", "宠物安全用品"],
    repeatableFormat: [
      "宠物状态",
      "护理目标",
      "分步过程",
      "行为观察",
      "完成与注意事项",
    ],
    firstTopics: ["洗护准备", "散步路线安全", "居家丰容", "外出装备整理"],
    incomePaths: ["广告", "宠物用品联盟", "品牌合作", "本地服务"],
    caution:
      "动物压力和安全高于画面；医疗、营养和行为问题应引用兽医或合格专业人士。",
    references: [
      {
        name: "Girl With The Dogs",
        url: "https://www.youtube.com/@GirlWithTheDogs",
      },
      { name: "Zak George", url: "https://www.youtube.com/@zakgeorge" },
      { name: "AnimalWised", url: "https://www.youtube.com/@AnimalWised" },
    ],
  },
  {
    id: "budget-project-diary",
    title: "低预算项目与成本日记",
    mode: "hybrid",
    category: "项目纪录",
    promise: "公开一个真实项目的预算、选择、失误和结果，帮助观众降低试错成本。",
    beginnerFit: "主题可以很小：房间改造、旧电脑升级、一次旅行或第一条纪录片。",
    minimumKit: ["手机", "表格", "收据记录", "屏幕录制"],
    repeatableFormat: [
      "预算与目标",
      "采购选择",
      "执行过程",
      "超支或失败",
      "最终账单与复盘",
    ],
    firstTopics: [
      "500 元拍摄装备升级",
      "第一次车载拍摄成本",
      "旧电脑剪辑优化",
      "一周低预算旅行",
    ],
    incomePaths: ["广告", "联盟链接", "预算模板", "品牌合作"],
    caution:
      "价格必须标地区和日期；不要为了戏剧性隐藏赞助、退货或未计入的成本。",
    references: [
      { name: "DIY Perks", url: "https://www.youtube.com/@DIYPerks" },
      {
        name: "Fix This Build That",
        url: "https://www.youtube.com/@Fixthisbuildthat",
      },
      {
        name: "Living Big In A Tiny House",
        url: "https://www.youtube.com/@livingbig",
      },
    ],
  },
  {
    id: "local-guide-voiceover",
    title: "本地路线与生活信息导览",
    mode: "hybrid",
    category: "本地搜索",
    promise:
      "以实拍路线加旁白或字幕，回答怎么去、花多少钱、什么时间去和容易踩什么坑。",
    beginnerFit:
      "你熟悉的城市就是内容壁垒；可以完全不露脸，也可在开头建立信任。",
    minimumKit: ["手机或相机", "稳定器可选", "录音麦", "地图与费用记录"],
    repeatableFormat: [
      "路线承诺",
      "起点交通",
      "沿途节点",
      "费用时间",
      "适合人群与替代方案",
    ],
    firstTopics: [
      "深圳一日步行路线",
      "雨天可拍地点",
      "免费观景台",
      "自驾停车与机位",
    ],
    incomePaths: ["广告", "本地商家合作", "路线 PDF", "定制向导"],
    caution:
      "营业时间、票价和交通会变化，必须注明拍摄日期；商业合作不能伪装成个人推荐。",
    references: [
      { name: "Prowalk Tours", url: "https://www.youtube.com/@ProWalks" },
      { name: "HONEST GUIDE", url: "https://www.youtube.com/@HONESTGUIDE" },
      { name: "Walk East", url: "https://www.youtube.com/@WalkEast" },
    ],
  },
  ...ordinaryCreatorModelExpansion,
  ...ordinaryCreatorVerticalModels,
  ...ordinaryCreatorVerticalModelsMore,
  ...ordinaryCreatorVerticalModelsMore2,
  ...ordinaryCreatorVerticalModelsMore3,
  ...ordinaryCreatorVerticalModelsMore4,
  ...ordinaryCreatorVerticalModelsMore5,
  ...ordinaryCreatorVerticalModelsBatch30,
  ...ordinaryCreatorVerticalModelsBatch50,
  ...ordinaryCreatorVerticalModelsBatch50B,
  ...ordinaryCreatorVerticalModelsBatch90,
  ...ordinaryCreatorLifestyleModels,
];

export const ordinaryCreatorModels: OrdinaryCreatorModel[] =
  ordinaryCreatorModelBase.map((model) => ({
    ...model,
    references: [
      ...model.references,
      ...(ordinaryCreatorReferenceIndex[model.id] ?? []),
    ],
  }));
