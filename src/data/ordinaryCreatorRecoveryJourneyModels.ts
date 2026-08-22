import type { OrdinaryCreatorModel } from "./ordinaryCreatorModels.js";

export const ordinaryCreatorRecoveryJourneyModels: OrdinaryCreatorModel[] = [
  {
    id: "chronic-illness-energy-diary",
    title: "慢性病日常、能量分配与生活适应记录",
    mode: "hybrid",
    category: "慢性病生活",
    promise:
      "从第一人称记录有限能量如何影响做饭、工作、出门、休息和就医准备，让观众看到疾病之外仍然完整的普通生活。",
    beginnerFit:
      "不需要把最痛苦的时刻全部公开；一周能量日志、一次低能量做饭或一次环境调整，都能形成有边界的内容。",
    minimumKit: ["手机或轻便相机", "坐姿或床边固定架", "可随时停止的拍摄清单", "隐私、症状与医疗资料边界表"],
    repeatableFormat: ["说明当日能量与计划", "记录一项现实任务", "展示中途调整或取消", "区分个人经验与医疗信息", "复盘恢复时间和下次安排"],
    firstTopics: ["低能量日怎样完成一顿饭", "一周活动与恢复时间记录", "把房间改得更省体力", "就医前怎样整理自己的问题"],
    incomePaths: ["YouTube 广告", "明确披露的辅助用品联盟", "无障碍品牌合作", "个人日志或创作模板"],
    caution:
      "只描述个人经历，不诊断观众、不推荐停药或未经验证的疗法；拍摄不能挤占休息和就医，赞助内容尤其要说明证据、适用差异与利益关系。",
    references: [
      { name: "Jessica Kellgren-Fozard", url: "https://www.youtube.com/user/MissJessicaKH" },
      { name: "Izzy Kornblau", url: "https://www.youtube.com/channel/UC0-lNmAdKsYu3EZAwgqg5ow" },
      { name: "The Frey Life", url: "https://www.youtube.com/@TheFreyLife" },
      { name: "Wheelsnoheels", url: "https://www.youtube.com/@Wheelsnoheels" },
    ],
  },
  {
    id: "late-neurodivergent-discovery-diary",
    title: "成年后认识神经多样性与生活调整日记",
    mode: "on-camera",
    category: "神经多样性",
    promise:
      "以当事人视角记录成年后重新理解感官、沟通、工作和精力边界的过程，同时保留不确定性和个体差异。",
    beginnerFit:
      "可以只讨论一个具体处境和一次调整，不必成为科普专家；真实的失败、反思和边界变化就是连续主线。",
    minimumKit: ["手机或网络摄像头", "舒适且低刺激的拍摄空间", "字幕工具", "个人经历与资料来源清单"],
    repeatableFormat: ["提出一个具体生活困扰", "回顾过去怎样理解它", "尝试一项低风险调整", "记录实际帮助和局限", "补充个体差异与专业边界"],
    firstTopics: ["开始识别自己的感官负荷", "一次社交后的恢复记录", "怎样重新设计工作日", "向家人说明需求时学到什么"],
    incomePaths: ["YouTube 广告", "无障碍工具联盟", "图书或文具合作", "个人经验型讲座与创作产品"],
    caution:
      "个人共鸣不能替代正式评估，也不能用短清单替观众下诊断；避免把一种低支持需求经验代表全部群体，并尊重不愿公开诊断或高支持需求者。",
    references: [
      { name: "Yo Samdy Sam", url: "https://www.youtube.com/@YoSamdySam" },
      { name: "Mom on the Spectrum", url: "https://www.youtube.com/@MomontheSpectrum" },
      { name: "Autism From The Inside", url: "https://www.youtube.com/@autismfromtheInside" },
      { name: "Purple Ella", url: "https://www.youtube.com/@PurpleElla" },
      { name: "I'm Autistic, Now What?", url: "https://www.youtube.com/@imautisticnowwhat" },
    ],
  },
  {
    id: "life-after-loss-journal",
    title: "丧亲之后的普通生活、纪念与重建记录",
    mode: "hybrid",
    category: "哀伤生活",
    promise:
      "不把悲伤包装成励志终点，而是记录纪念、办事、节日、关系变化和重新参与日常生活的真实节奏。",
    beginnerFit:
      "不必公开死亡细节；一次纪念物整理、一顿熟悉的饭或一个困难日期，都可以成为尊重自己节奏的单集。",
    minimumKit: ["手机或相机", "可暂停的提纲", "逝者和家属隐私清单", "危机支持与评论区管理方案"],
    repeatableFormat: ["说明本期触发情境", "讲述一段有限记忆", "完成一个现实任务或仪式", "允许矛盾情绪存在", "给出支持资源而非治疗承诺"],
    firstTopics: ["第一次整理纪念物", "重要节日前怎样安排自己", "悲伤中仍要处理的普通办事", "某个熟悉地点的第一次重访"],
    incomePaths: ["YouTube 广告", "图书或纪念用品的谨慎合作", "听众自愿支持", "写作、播客或个人纪念项目"],
    caution:
      "不得泄露逝者隐私、事故材料或其他家属不愿公开的经历；不能承诺治愈或给出危机干预，出现自伤风险时应引导当地紧急和专业支持。",
    references: [
      { name: "Good Mourning Grief Podcast", url: "https://www.youtube.com/@GoodMourningPodcast" },
      { name: "What's Your Grief", url: "https://www.youtube.com/@WhatsYourGrief" },
      { name: "A Room for Grief", url: "https://www.youtube.com/@ARoomForGrief" },
      { name: "The Grief Channel", url: "https://www.youtube.com/@griefchannel" },
      { name: "Megan Devine", url: "https://www.youtube.com/@RefugeInGrief" },
    ],
  },
  {
    id: "alcohol-free-recovery-diary",
    title: "停止饮酒、日常恢复与复发后重新开始",
    mode: "on-camera",
    category: "戒酒恢复",
    promise:
      "用个人时间线记录无酒精生活中的触发情境、支持系统、新习惯、困难日和重新开始，减少羞耻而不扮演治疗者。",
    beginnerFit:
      "可以从稳定后回顾或匿名音频开始，不必直播最危险的阶段；固定周报能自然形成长期陪伴。",
    minimumKit: ["手机或麦克风", "私密稳定的录制环境", "内容触发提示", "当地医疗、互助与紧急资源清单"],
    repeatableFormat: ["说明当前阶段和安全状态", "回顾一个具体触发情境", "记录采用的支持和替代行动", "诚实说明困难或复发", "列出下一步及专业资源"],
    firstTopics: ["第一个无酒精周末怎样度过", "如何重新安排原来的饮酒时间", "一次强烈渴求之后的复盘", "复发后怎样减少羞耻并重新求助"],
    incomePaths: ["YouTube 广告", "无酒精饮品的严格披露合作", "听众自愿支持", "个人写作或社群内容"],
    caution:
      "酒精依赖者突然停酒可能出现危险戒断，必须提示先咨询医疗专业人士；不得承诺治愈、阻止正规治疗、公开他人互助会故事或利用复发制造羞辱。",
    references: [
      { name: "Getting Sober ...Again", url: "https://www.youtube.com/@GettingSoberAgain" },
      { name: "Sober Leon", url: "https://www.youtube.com/@LeonSylvester" },
      { name: "Soberdogs", url: "https://www.youtube.com/@Soberdogs" },
      { name: "This Naked Mind", url: "https://www.youtube.com/@ThisNakedMind" },
    ],
  },
  {
    id: "real-debt-payoff-journal",
    title: "真实还债、月度数字与计划调整日记",
    mode: "hybrid",
    category: "债务重建",
    promise:
      "从自己的债务、收入和基本生活约束出发，按月记录还款、意外支出、计划偏差和剩余进度，而不是只展示成功结局。",
    beginnerFit:
      "可以使用比例和模糊后的数字保护隐私；一张表、一段旁白和每月复盘就能形成稳定连续栏目。",
    minimumKit: ["手机或麦克风", "脱敏后的债务表", "月度预算记录", "隐私、诈骗和财务建议免责声明"],
    repeatableFormat: ["公布本月起点和规则", "记录收入与必要支出变化", "说明实际还款和偏差", "复盘情绪与生活代价", "更新剩余进度和下月计划"],
    firstTopics: ["第一次完整列出债务", "意外支出打乱计划怎么办", "三个月还款进度复盘", "哪些极端省钱方法不值得"],
    incomePaths: ["YouTube 广告", "预算模板", "明确披露的记账工具联盟", "个人经验型课程或社群"],
    caution:
      "个人过程不是财务建议；隐藏账户、地址、雇主和身份信息，不推广高息借贷、赌博或不透明债务服务，也不因进度慢而羞辱自己或观众。",
    references: [
      { name: "Debt Free Millennials", url: "https://www.youtube.com/@DebtFreeMillennials" },
      { name: "The Budget Mom", url: "https://www.youtube.com/@TheBudgetMom" },
      { name: "Pennies Not Perfection", url: "https://www.youtube.com/@PenniesNotPerfection" },
      { name: "Budget Girl", url: "https://www.youtube.com/@BudgetGirl" },
      { name: "Dear Debt", url: "https://www.youtube.com/@DearDebt" },
    ],
  },
];
