import type { OrdinaryCreatorModel } from "./ordinaryCreatorModels.js";

export const ordinaryCreatorLivingLanguageModels: OrdinaryCreatorModel[] = [
  {
    id: "family-dialect-oral-history-archive",
    title: "家庭方言、母语表达与长辈口述档案",
    mode: "on-camera",
    category: "家庭语言保存",
    promise:
      "由家人和社区说话者自己讲述日常、童谣、俗语与人生经历，同时保存原声、逐字稿、翻译和表达使用场景。",
    beginnerFit:
      "可以从一位愿意参与的长辈和十个家庭常用词开始；尊重真实说法、保留语境和允许讲述者修改，比追求标准答案更重要。",
    minimumKit: ["手机或相机", "外接麦克风", "讲述者授权表", "原声、逐字稿与翻译对照表"],
    repeatableFormat: [
      "由讲述者确认语言名称和自我身份表述",
      "在真实语境中记录一段口述或对话",
      "保留原声并制作逐字稿与翻译",
      "请讲述者核对发音、含义和公开范围",
      "归档日期、地点范围、版本和使用许可",
    ],
    firstTopics: ["家里十个无法直译的词", "长辈小时候唱的童谣", "同一句话三代人的不同说法", "一道菜在家乡叫什么"],
    incomePaths: ["YouTube 广告", "文化机构合作", "口述史拍摄服务", "双语家庭档案册"],
    caution:
      "语言属于说话者和社区的文化实践，不能擅自宣称代表整个族群；敏感仪式、身份、地点和受限制知识必须服从社区决定并允许撤回。",
    references: [
      { name: "Wikitongues", url: "https://www.youtube.com/@Wikitongues" },
      { name: "Langfocus", url: "https://www.youtube.com/@Langfocus" },
      { name: "RobWords", url: "https://www.youtube.com/@RobWords" },
      { name: "I Love Languages!", url: "https://www.youtube.com/@ILoveLanguages" },
    ],
  },
  {
    id: "multilingual-family-language-diary",
    title: "移民与多语家庭的家庭语言实践日记",
    mode: "on-camera",
    category: "多语家庭生活",
    promise:
      "记录一个家庭如何在社区主流语言、父母语言和祖辈语言之间制定并调整真实可行的日常沟通方式。",
    beginnerFit:
      "不需要把孩子培养成表演型语言天才；诚实记录一周的语言输入、亲子感受和策略变化，就能帮助处境相近的家庭。",
    minimumKit: ["手机或相机", "家庭成员拍摄同意", "每周语言使用简表", "儿童隐私与停拍规则"],
    repeatableFormat: [
      "说明本周家庭语言目标和现实限制",
      "记录不暴露隐私的日常使用片段",
      "由父母复盘有效与无效的做法",
      "区分个人经验与研究或专家建议",
      "更新孩子意愿、家庭关系和下周调整",
    ],
    firstTopics: ["我们家一周实际说了哪些语言", "孩子拒绝说祖辈语言时怎么办", "和祖父母视频通话的真实变化", "家庭语言计划半年复盘"],
    incomePaths: ["YouTube 广告", "亲子资源联盟链接", "多语家庭机构合作", "非诊断性家庭记录模板"],
    caution:
      "儿童不能成为语言实验或流量表演对象，不得羞辱口音、强迫回答或公布学校与生活动线；语言发展疑虑应咨询合格专业人员。",
    references: [
      { name: "Live Your Language", url: "https://www.youtube.com/@LiveYourLanguage" },
      { name: "Multilingual Family Hub", url: "https://www.youtube.com/@MultilingualFamilyHub" },
      { name: "Chalk Academy", url: "https://www.youtube.com/@ChalkAcademy" },
      { name: "Bilingual Family", url: "https://www.youtube.com/@BilingualFamily" },
    ],
  },
  {
    id: "adult-literacy-learning-journey",
    title: "成人识字、阅读与生活技能成长记录",
    mode: "hybrid",
    category: "成人基础学习",
    promise:
      "在正规成人教育项目支持下，由学习者自愿记录阅读、书写、数字工具和生活任务中的真实进步与挫折。",
    beginnerFit:
      "内容不要求公开考试成绩或个人创伤；可以从学习者自己选择的一项生活目标和每月一次的回顾开始。",
    minimumKit: ["手机或相机", "学习者主动授权", "机构或教师合作许可", "个人目标与进度记录"],
    repeatableFormat: [
      "由学习者选择本期目标和公开范围",
      "记录一项真实生活任务的练习过程",
      "由教师区分教学建议与个人经验",
      "让学习者自行评价困难和进步",
      "按月更新目标且允许删除敏感片段",
    ],
    firstTopics: ["第一次独立读懂一封信", "填写表格前后的变化", "用手机地图完成一次路线", "半年后重新读第一篇文章"],
    incomePaths: ["YouTube 广告", "成人教育机构合作", "公益项目资助", "无障碍学习资源制作"],
    caution:
      "低识字能力不是娱乐素材，不能安排羞辱测试、暴露身份或代替学习者讲述；必须采用知情同意，并由正规教育或支持机构把关。",
    references: [
      { name: "ProLiteracy", url: "https://www.youtube.com/@ProLiteracy" },
      { name: "Barbara Bush Foundation", url: "https://www.youtube.com/@BarbaraBushFoundation" },
      { name: "World Literacy Foundation", url: "https://www.youtube.com/@WorldLiteracyFoundation" },
      { name: "Adult Literacy League", url: "https://www.youtube.com/@AdultLiteracyLeague" },
    ],
  },
  {
    id: "language-exchange-partnership-log",
    title: "固定语伴、真实对话与双向学习日志",
    mode: "on-camera",
    category: "语言交换关系",
    promise:
      "跟随两位语言伙伴长期进行对等交换，记录真实对话、误解、纠正方式和双方从初识到能够深入交流的变化。",
    beginnerFit:
      "无需精通目标语言；一位稳定语伴、双方同意的主题和每周固定二十分钟，就能形成可持续系列。",
    minimumKit: ["手机或相机", "双人麦克风或通话录制许可", "双方授权", "双语字幕与纠错记录"],
    repeatableFormat: [
      "双方共同选择话题和本期语言比例",
      "保留真实对话而非预演流利表演",
      "分别标注即时纠正与事后核对",
      "制作双语字幕并由双方校对",
      "复盘沟通感受和下一期具体目标",
    ],
    firstTopics: ["第一次完全不用共同语言", "对方最难理解的生活习惯", "同一个笑话为什么翻不出来", "连续十次对话后的变化"],
    incomePaths: ["YouTube 广告", "语言工具联盟链接", "会员练习材料", "文化交流机构合作"],
    caution:
      "交换必须对等并可随时停拍，不得把口音、错误或文化误解剪成羞辱素材；陌生人见面需遵守场地、身份和人身安全规则。",
    references: [
      { name: "Easy Languages", url: "https://www.youtube.com/@easylanguages" },
      { name: "Easy German", url: "https://www.youtube.com/@EasyGerman" },
      { name: "Lindie Botes", url: "https://www.youtube.com/@LindieBotes" },
      { name: "Steve Kaufmann", url: "https://www.youtube.com/@Thelinguist" },
    ],
  },
  {
    id: "local-place-name-pronunciation-archive",
    title: "地方地名、人名与传统称呼发音档案",
    mode: "hybrid",
    category: "地方发音资料",
    promise:
      "邀请当地说话者解释街道、村落、山川和传统称呼的真实发音、含义与变化，并保留多个并存版本。",
    beginnerFit:
      "从自己生活范围内五个常被念错的地名开始；一张地图、清楚录音和说话者核对就能建立地方价值。",
    minimumKit: ["手机或录音设备", "说话者授权", "官方与地方地图来源", "发音、拼写与语境对照表"],
    repeatableFormat: [
      "说明名称来源、地图位置范围和资料出处",
      "由当地说话者分别录制自然发音",
      "标注拼写、音标或易读辅助方式",
      "解释含义、使用场景和并存版本",
      "由说话者核对并归档音频许可",
    ],
    firstTopics: ["五个游客最常念错的地名", "同一条河有几个名字", "老地图上的村名今天怎么读", "三代人对一个地方的不同称呼"],
    incomePaths: ["YouTube 广告", "地方文化机构合作", "语音地图与导览", "教育与档案项目资助"],
    caution:
      "不能把单个说法宣布为唯一正确版本，也不得擅自公开神圣、敏感或受限制名称；原住民及少数语言名称应由相关社区决定呈现方式。",
    references: [
      { name: "Wikitongues", url: "https://www.youtube.com/@Wikitongues" },
      { name: "Easy Languages", url: "https://www.youtube.com/@easylanguages" },
      { name: "RobWords", url: "https://www.youtube.com/@RobWords" },
      { name: "Gaelic with Jason", url: "https://www.youtube.com/@GaelicwithJason" },
    ],
  },
];
