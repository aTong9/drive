import type { OrdinaryCreatorModel } from "./ordinaryCreatorModels.js";

export const ordinaryCreatorCollaborativeArtsModels: OrdinaryCreatorModel[] = [
  {
    id: "community-theatre-production-diary",
    title: "社区剧团从读本、排练到演出的制作日记",
    mode: "hybrid",
    category: "社区戏剧制作",
    promise:
      "跟随一群业余演员和幕后志愿者完成一部作品，记录选本、排练、服化道、舞台调度和演后复盘，而不只上传最终演出。",
    beginnerFit:
      "可以从一个十分钟短剧或剧本围读开始；一位成员负责记录日期、修改和分工，就能形成完整的连续叙事。",
    minimumKit: ["手机或相机", "剧团与成员拍摄授权", "剧本演出及录制权确认", "排练日期、版本与分工表"],
    repeatableFormat: ["说明本周排练目标和当前剧本版本", "记录成员同意公开的排练片段", "跟随一项表演或幕后问题的修改", "由参与者复盘本次变化", "更新分工、授权范围和下次排练日期"],
    firstTopics: ["第一次围读发现了什么", "一个场景排练四周的变化", "志愿者怎样完成第一件道具", "演出结束后的全员复盘"],
    incomePaths: ["YouTube 广告", "剧团会员与捐助", "本地文化机构合作", "排练记录与幕后内容制作"],
    caution:
      "取得演出许可不等于拥有网络传播权；剧本、音乐、表演和成员肖像必须逐项确认，未成年人、拒绝出镜者以及封闭排练内容不得被动公开。",
    references: [
      { name: "Ashland Community Theater", url: "https://www.youtube.com/@AshlandCommunityTheater" },
      { name: "American Association of Community Theatre", url: "https://www.youtube.com/@AACT" },
      { name: "National Theatre", url: "https://www.youtube.com/@NationalTheatre" },
      { name: "Royal Shakespeare Company", url: "https://www.youtube.com/@royalshakespearecompany" },
    ],
  },
  {
    id: "amateur-choir-rehearsal-journal",
    title: "业余合唱团的声部学习、排练与成员成长日志",
    mode: "on-camera",
    category: "社区合唱排练",
    promise:
      "从普通成员视角记录热身、分声部学习、合排困难和一季成长，让不会读谱的人也看见社区合唱如何真正运作。",
    beginnerFit:
      "不需要组织专业演唱会；先取得全体同意，记录一首已获许可作品的非完整练习片段和成员自己的学习反思即可。",
    minimumKit: ["手机或相机", "指挥与成员拍摄同意", "乐谱、歌词和录音权许可记录", "排练日期与声部进度表"],
    repeatableFormat: ["标注歌曲、版本、许可和本周目标", "记录热身或一个短小练习片段", "分别跟随不同声部解决同一难点", "由自愿成员讲述感受和进步", "更新排练日期、公开范围和下周目标"],
    firstTopics: ["第一次合唱排练会发生什么", "不会读谱怎样跟上声部", "同一小节排练一个月的变化", "演出前最后一次合排复盘"],
    incomePaths: ["YouTube 广告", "合唱团会员与捐助", "音乐教育机构合作", "排练资源与活动记录服务"],
    caution:
      "成员同意、乐谱权、表演权和网络录音传播权必须分别核对；不得偷拍走音或把成员失误剪成羞辱内容，健康效果只能作为个人感受而非医疗承诺。",
    references: [
      { name: "Homechoir", url: "https://www.youtube.com/@homechoir" },
      { name: "Stay At Home Choir", url: "https://www.youtube.com/@StayAtHomeChoir" },
      { name: "Eric Whitacre", url: "https://www.youtube.com/@EricWhitacresVirtualChoir" },
      { name: "The Choir with No Name", url: "https://www.youtube.com/@choirwithnoname" },
    ],
  },
  {
    id: "independent-zine-making-log",
    title: "独立小志从选题、拼版到交换发行的制作日志",
    mode: "faceless",
    category: "独立小志出版",
    promise:
      "用纸张、复印和手工装订记录一本个人或社区小志如何从主题、征稿、编辑、拼版走到交换与读者反馈。",
    beginnerFit:
      "一张纸、一个真实主题和八个页面就能开始；无需出版社，也不必用昂贵印刷设备制造专业杂志外观。",
    minimumKit: ["手机或俯拍设备", "纸张、剪贴与装订工具", "作者、图像与字体许可表", "版本、印量、成本和发行日期台账"],
    repeatableFormat: ["公开本期主题、投稿规则和截止日期", "展示已获许可素材的编辑与拼版", "记录打样问题、修改和单位成本", "完成编号、装订或数字无障碍版本", "按发行日期复盘交换、库存和作者反馈"],
    firstTopics: ["一张纸折成八页小志", "第一次社区征稿如何定规则", "复印十本到底花多少钱", "交换会后哪些页面最有回应"],
    incomePaths: ["YouTube 广告", "小志销售与交换", "图书馆或文化机构工作坊", "排版模板与编辑服务"],
    caution:
      "低门槛出版不等于可以复制他人作品；投稿、照片、字体和档案素材必须保留许可，私人故事要允许作者匿名、修改和在印刷前撤回。",
    references: [
      { name: "Sea Lemon", url: "https://www.youtube.com/@SeaLemonDIY" },
      { name: "The British Library", url: "https://www.youtube.com/@britishlibrary" },
      { name: "Booklyn", url: "https://www.youtube.com/@BooklynArt" },
      { name: "ZINE COOP", url: "https://www.youtube.com/@zinecoop" },
    ],
  },
  {
    id: "open-mic-community-night-diary",
    title: "开放麦、诗歌夜与新手表演者的活动日记",
    mode: "on-camera",
    category: "开放舞台活动",
    promise:
      "记录一场小型开放舞台如何招募、排期、试音、主持和复盘，并让愿意参与的普通表演者讲述第一次上台的过程。",
    beginnerFit:
      "可以从书店、咖啡馆或社区空间的一次五人活动开始；即使不能公开完整作品，也能记录组织流程和自愿采访。",
    minimumKit: ["手机或相机", "场地方与每位表演者授权", "作品、音乐和录制许可清单", "报名顺序、演出日期与停拍规则"],
    repeatableFormat: ["公开本场主题、报名和行为规则", "逐位确认作品与影像公开范围", "记录布置、试音和主持流程", "只发布获准片段与表演者自述", "按活动日期复盘秩序、可访问性和下次改进"],
    firstTopics: ["五个人的第一次社区开放麦", "主持人怎样照顾第一次上台者", "不能发布完整作品时拍什么", "一季活动后表演者去了哪里"],
    incomePaths: ["YouTube 广告", "门票或自愿捐助", "场地与文化机构合作", "活动记录和主持服务"],
    caution:
      "公开演出不代表同意被录像上传；原创文字、翻唱音乐、喜剧素材和观众肖像都需单独许可，不得用紧张、失误或敏感经历制造嘲笑和冲突。",
    references: [
      { name: "Button Poetry", url: "https://www.youtube.com/@ButtonPoetry" },
      { name: "Sofar Sounds", url: "https://www.youtube.com/@sofarsounds" },
      { name: "Poetry Slam Inc", url: "https://www.youtube.com/@PoetrySlamInc" },
      { name: "Busboys and Poets", url: "https://www.youtube.com/@busboysandpoets" },
    ],
  },
  {
    id: "community-public-art-project-log",
    title: "社区壁画与公共艺术的协商、制作和维护记录",
    mode: "hybrid",
    category: "社区公共艺术",
    promise:
      "从居民议题、场地许可和共同设计开始，跟随艺术家、志愿者与使用者完成一件公共作品，并持续记录维护和社区反馈。",
    beginnerFit:
      "不必先画大型墙面；可以从一块获准展示的社区公告板、临时装置或共同绘制的小面板开始，完整记录协商过程。",
    minimumKit: ["手机或相机", "场地、艺术家与参与者授权", "设计版本和材料安全资料", "会议、施工、维护与复查日期表"],
    repeatableFormat: ["说明场地权属、议题来源和参与规则", "记录居民意见与设计版本变化", "按许可和安全计划展示制作过程", "由不同参与者解释自己的贡献", "在复查日期记录维护、争议和后续决定"],
    firstTopics: ["一面墙在动笔前要经过什么", "居民意见怎样改变初稿", "志愿者共同绘制的一天", "半年后作品和周边空间怎样了"],
    incomePaths: ["YouTube 广告", "公共艺术机构合作", "社区项目记录委托", "教育工作坊与影像授权"],
    caution:
      "公共可见不等于可以无许可施工或拍摄；必须核对场地产权、材料安全、文化归属和参与者意愿，不得把社区分歧剪成煽动内容或覆盖原有作品。",
    references: [
      { name: "Mural Arts Philadelphia", url: "https://www.youtube.com/@muralarts" },
      { name: "Artolution", url: "https://www.youtube.com/@Artolution" },
      { name: "Community Murals", url: "https://www.youtube.com/@communitymurals" },
      { name: "Creative Time", url: "https://www.youtube.com/@creativetime" },
    ],
  },
];
