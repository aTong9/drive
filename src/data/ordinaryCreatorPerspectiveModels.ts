import type { OrdinaryCreatorModel } from "./ordinaryCreatorModels.js";

type PerspectiveSeed = Omit<
  OrdinaryCreatorModel,
  "minimumKit" | "repeatableFormat" | "references"
> & {
  references: Array<[name: string, handle: string]>;
};

const seeds: PerspectiveSeed[] = [
  {
    id: "retirement-everyday-journal",
    title: "退休后的普通生活、养老金与新节奏",
    mode: "hybrid",
    category: "退休生活",
    promise:
      "记录退休后怎样重新安排时间、家庭预算、兴趣、社交与独处，让晚年生活由当事人自己讲述。",
    beginnerFit:
      "生活经验、慢节奏和诚实的日常判断就是稀缺视角，不必追赶年轻频道的剪辑速度。",
    firstTopics: ["退休后普通工作日", "养老金月份怎样安排开销", "重新培养一个兴趣", "一个人安全出门的一天"],
    incomePaths: ["YouTube 广告", "适老生活用品联盟", "书籍与兴趣课程合作", "生活记录模板"],
    caution:
      "不要透露养老金账号、住址与固定独居规律；健康和养老政策只能分享个人经历，涉及权益时应链接当地官方资料。",
    references: [
      ["Silver and Solo", "SilverAndSolo"],
      ["Solo Second Act", "SoloSecondAct"],
      ["small retired life", "smallretiredlife"],
      ["Retirement Travelers", "RetirementTravelers"],
      ["Sixty and Me", "sixtyandme"],
    ],
  },
  {
    id: "disabled-first-person-daily-life",
    title: "残障者第一人称日常与无障碍体验",
    mode: "on-camera",
    category: "无障碍生活",
    promise:
      "由残障者本人记录出行、工作、居家、关系和工具使用，呈现障碍如何来自环境而不只是身体。",
    beginnerFit:
      "自身经验就是别人无法代替的视角；可从一条真实路线或一个日常工具开始，而非承担教育所有人的责任。",
    firstTopics: ["轮椅出门的一条真实路线", "一个常被忽略的无障碍细节", "我怎样完成普通家务", "辅助工具一月使用复盘"],
    incomePaths: ["YouTube 广告", "辅助产品透明评测", "无障碍顾问合作", "演讲与创作委托"],
    caution:
      "不把痛苦和身体隐私当流量，也不代表所有同类群体；医疗与康复内容必须标明个人经验边界和利益关系。",
    references: [
      ["Wheelsnoheels", "Wheelsnoheels"],
      ["Molly Burke", "MollyBurkeOfficial"],
      ["Jessica Kellgren-Fozard", "JessicaKellgrenFozard"],
      ["Footless Jo", "FootlessJo"],
      ["Squirmy and Grubs", "SquirmyandGrubs"],
    ],
  },
  {
    id: "student-dorm-shared-life",
    title: "学生宿舍、合租与低预算成长日记",
    mode: "hybrid",
    category: "学生生活",
    promise:
      "在宿舍或合租空间里记录学习、做饭、通勤、人际边界和有限预算下的独立生活。",
    beginnerFit:
      "小空间、旧设备和真实课程压力反而更容易产生共鸣，可以不公开学校和具体住址。",
    firstTopics: ["宿舍里从早到晚的一天", "一周最低成本做饭", "考试周怎样安排睡眠", "与室友共享空间的规则"],
    incomePaths: ["YouTube 广告", "文具与学习工具联盟", "校园品牌合作", "学习和预算模板"],
    caution:
      "未经同意不能拍室友、教师或同学；隐藏学校、门牌和课表规律，赞助内容不能诱导学生债务或学术作弊。",
    references: [
      ["UnJaded Jade", "UnJadedJade"],
      ["Ruby Granger", "RubyGranger8"],
      ["Merve", "MerveStudyCorner"],
      ["studyquill", "studyquill"],
      ["Yoora Jung", "yoorajung"],
    ],
  },
  {
    id: "layoff-rebuild-journal",
    title: "失业、转职与生活重建公开日记",
    mode: "on-camera",
    category: "职业转折",
    promise:
      "诚实记录被裁、离职或转职后的现金流、求职行动、情绪变化和技能重建，而不是只展示成功结果。",
    beginnerFit:
      "处于过程中也能创作；固定周报和可验证行动比假装导师更可信。",
    firstTopics: ["失业后的第一周", "重新计算三个月现金流", "投递二十份简历的结果", "一次面试失败复盘"],
    incomePaths: ["YouTube 广告", "求职工具合作", "复盘与追踪模板", "恢复就业后的经验课程"],
    caution:
      "遮挡前雇主机密、合同和个人证件；不要虚构收入、面试或成功故事，也不能把个人经历当法律和劳动权益建议。",
    references: [
      ["A Life After Layoff", "ALifeAfterLayoff"],
      ["Self Made Millennial", "SelfMadeMillennial"],
      ["Madeline Mann", "MadelineMann"],
      ["Jennifer Brick", "JenniferBrick"],
      ["Andrew LaCivita", "andylacivita"],
    ],
  },
  {
    id: "secondhand-reselling-diary",
    title: "二手淘货、转卖副业与库存账本",
    mode: "hybrid",
    category: "二手副业",
    promise:
      "从淘货判断、清洁拍摄、定价上架到售后，展示二手转卖是否真的值得投入时间和资金。",
    beginnerFit:
      "可以从家中闲置物开始，不需要仓库；每件商品的成本、耗时和最终结果都能形成闭环。",
    firstTopics: ["卖掉家中十件闲置物", "第一次旧货市场淘货", "一个月库存与净利润", "滞销商品如何处理"],
    incomePaths: ["二手销售利润", "YouTube 广告", "打包工具联盟", "库存与利润模板"],
    caution:
      "必须计入平台费、退货、税务、库存和人工时间；核对赃物、假货、隐私数据及当地经营规则，不制造抢货冲突。",
    references: [
      ["Hairy Tornado", "HairyTornado"],
      ["Daily Refinement", "DailyRefinement"],
      ["Ralli Roots", "RalliRoots"],
      ["Froggy Flips", "FroggyFlips"],
      ["The Nurse Flipper", "TheNurseFlipper"],
    ],
  },
  {
    id: "intergenerational-skill-stories",
    title: "代际手艺、家庭记忆与共同制作",
    mode: "hybrid",
    category: "代际记录",
    promise:
      "让长辈与年轻家庭成员共同完成一道菜、一件手工或一次口述，把操作细节和家庭记忆一起保存。",
    beginnerFit:
      "内容来自家庭已有的知识，不需要先成为专家；一项小技能就可以展开人物、时代和地方故事。",
    firstTopics: ["跟长辈学一道家常菜", "一件旧工具的来历", "同一种做法两代人的差异", "把方言步骤整理成字幕"],
    incomePaths: ["YouTube 广告", "家庭食谱或口述史小册", "地方文化合作", "相关工具材料联盟"],
    caution:
      "长辈必须理解公开视频的范围并能随时撤回；不逼迫讲述创伤、财产与家庭矛盾，也不擅自公开独家传统知识。",
    references: [
      ["Made With Lau", "MadeWithLau"],
      ["Pasta Grannies", "PastaGrannies"],
      ["Grandpa Kitchen", "GrandpaKitchen"],
      ["Japanese Grandma Kinoe", "JapaneseGrandmaKinoe"],
      ["Village Cooking Channel", "VillageCookingChannel"],
    ],
  },
];

export const ordinaryCreatorPerspectiveModels: OrdinaryCreatorModel[] =
  seeds.map((seed) => ({
    ...seed,
    minimumKit: ["手机或相机", "稳定支撑", "清晰收音", "同意、隐私和事实核对清单"],
    repeatableFormat: ["本期处境", "具体目标", "真实执行", "遇到的限制", "结果、感受与下一步"],
    references: seed.references.map(([name, handle]) => ({
      name,
      url: `https://www.youtube.com/@${handle}`,
    })),
  }));
