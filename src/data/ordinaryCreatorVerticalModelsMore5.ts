import type { OrdinaryCreatorModel } from "./ordinaryCreatorModels.js";

const yt = (handle: string) => `https://www.youtube.com/@${handle}`;
const refs = (items: Array<[string, string]>) =>
  items.map(([name, handle]) => ({ name, url: yt(handle) }));

export const ordinaryCreatorVerticalModelsMore5: OrdinaryCreatorModel[] = [
  {
    id: "bonsai-tree-development",
    title: "盆景造型、养护与多年变化",
    mode: "hybrid",
    category: "盆景细分",
    promise:
      "用季节记录展示选材、修剪、蟠扎、换盆和长期树形发展，而不是只展示完成品。",
    beginnerFit: "可从常见苗木和基础修剪开始，一棵树能自然形成多年的连续内容。",
    minimumKit: ["健康苗木", "基础修剪工具", "养护日志", "固定拍摄位置"],
    repeatableFormat: [
      "树况与季节",
      "本期目标",
      "操作和理由",
      "恢复观察",
      "下阶段计划",
    ],
    firstTopics: [
      "第一棵盆景选材",
      "新手换盆记录",
      "三个月枝条变化",
      "广东夏季遮阴",
    ],
    incomePaths: ["广告", "园艺工具联盟", "苗圃合作", "课程与作品销售"],
    caution:
      "树种、气候和季节差异很大；过度修剪、错误换盆和紧线可能导致植物死亡。",
    references: refs([
      ["Bonsai Mirai", "BonsaiMirai"],
      ["Herons Bonsai", "HeronsBonsaiUK"],
      ["Eisei-en Bonsai", "EiseienBonsai"],
      ["Bonsai Empire", "BonsaiEmpire"],
      ["Greenwood Bonsai Studio", "GreenwoodBonsai"],
      ["The Bonsai Zone", "NigelSaundersTheBonsaiZone"],
      ["Eastern Leaf", "easternleaf"],
      ["Blue Sky Bonsai", "BlueSkyBonsai"],
      ["Growing Bonsai", "GrowingBonsai"],
      ["Appalachia Bonsai", "AppalachiaBonsai"],
    ]),
  },
  {
    id: "cold-process-soap-making",
    title: "手工皂配方、纹理与熟成记录",
    mode: "faceless",
    category: "手作配方",
    promise:
      "公开油脂比例、温度、入模、脱模和熟成过程，用批次记录复盘成品差异。",
    beginnerFit:
      "桌面俯拍即可呈现，但应先系统学习碱液安全，再从可靠基础配方开始。",
    minimumKit: ["专用耐碱容器", "电子秤", "护目手套", "批次标签"],
    repeatableFormat: [
      "配方与安全",
      "温度和混合",
      "纹理与入模",
      "脱模切皂",
      "熟成测试",
    ],
    firstTopics: [
      "第一批无香基础皂",
      "两种油脂比例",
      "温度对纹理影响",
      "六周熟成记录",
    ],
    incomePaths: ["广告", "材料工具联盟", "配方课程", "合规成品销售"],
    caution:
      "氢氧化钠会严重灼伤，必须通风和完整防护；销售前还需满足当地化妆品和标签法规。",
    references: refs([
      ["Royalty Soaps", "RoyaltySoaps"],
      ["Bramble Berry", "BrambleBerry"],
      ["Soap Queen", "SoapQueenTV"],
      ["Tree Marie Soapworks", "TreeMarieSoapworks"],
      ["I Dream In Soap", "IDreamInSoap"],
      ["Ariane Arsenault", "ArianeArsenault"],
      ["Elly's Everyday Soap Making", "EllysEverydaySoapMaking"],
      ["Soap & Clay", "SoapandClay"],
      ["Vibrant Soap", "VibrantSoap"],
      ["Tellervo", "Tellervo"],
    ]),
  },
  {
    id: "home-microscopy-microcosmos",
    title: "家庭显微镜与微观世界观察",
    mode: "faceless",
    category: "显微科学",
    promise:
      "从样本来源、制片、倍率、照明到影像记录，展示日常材料中的微观结构与生命。",
    beginnerFit: "入门显微镜和手机转接即可开始，可从植物、纤维和安全水样观察。",
    minimumKit: ["显微镜", "载玻片与盖玻片", "手机转接", "样本标签"],
    repeatableFormat: [
      "样本问题",
      "取样和制片",
      "倍率与照明",
      "观察记录",
      "识别依据与限制",
    ],
    firstTopics: [
      "洋葱表皮细胞",
      "不同布料纤维",
      "池水微生物观察",
      "明场与暗场比较",
    ],
    incomePaths: ["广告", "显微设备联盟", "科普合作", "课程与影像授权"],
    caution:
      "不培养未知病原体或处理危险体液；物种识别需保留不确定性，样本应安全处置。",
    references: refs([
      ["Journey to the Microcosmos", "journeytomicro"],
      ["Microbehunter Microscopy", "MicrobehunterMicroscopy"],
      ["Microbehunter", "Microbehunter"],
      ["Sci-Inspi", "SciInspi"],
      ["My Microscopic World", "MyMicroscopicWorld"],
      ["The Thought Emporium", "thethoughtemporium"],
      ["iBiology", "iBiology"],
      ["Microscopy Society of America", "MicroscopySociety"],
      ["Nikon Instruments", "NikonInstrumentsInc"],
      ["Olympus Life Science", "OlympusLifeScience"],
    ]),
  },
  {
    id: "electronics-device-repair",
    title: "消费电子诊断与主板维修",
    mode: "faceless",
    category: "维修技术",
    promise:
      "从故障现象、测量、定位、焊接到压力测试，展示基于证据而非猜测的维修过程。",
    beginnerFit:
      "可先从清洁、接口和低压设备开始，逐步学习测量与焊接，不必直接挑战高压电源。",
    minimumKit: ["万用表", "温控烙铁", "显微或放大设备", "护目与排烟"],
    repeatableFormat: [
      "故障和历史",
      "安全检查",
      "测量定位",
      "维修过程",
      "功能与稳定性测试",
    ],
    firstTopics: [
      "USB 接口虚焊",
      "遥控器按键清洁",
      "充电故障测量",
      "维修失败原因复盘",
    ],
    incomePaths: ["广告", "维修工具联盟", "维修服务", "培训内容"],
    caution:
      "市电、高压电容和锂电池可能致命或起火；数据设备维修前必须明确隐私和备份责任。",
    references: refs([
      ["NorthridgeFix", "NorthridgeFix"],
      ["TronicsFix", "TronicsFix"],
      ["Louis Rossmann", "rossmanngroup"],
      ["Learn Electronics Repair", "LearnElectronicsRepair"],
      ["Electronics Repair School", "ElectronicsRepairSchool"],
      ["My Mate VINCE", "MyMateVINCE"],
      ["StezStix Fix", "StezStixFix"],
      ["TheCod3r", "TheCod3r"],
      ["Sorin Electronics", "SorinElectronics"],
      ["Mend It Mark", "MendItMark"],
    ]),
  },
  {
    id: "chess-improvement-analysis",
    title: "国际象棋学习、复盘与成长记录",
    mode: "hybrid",
    category: "棋类学习",
    promise:
      "以真实对局、时间管理和错误分类为核心，记录棋力如何通过训练逐步提升。",
    beginnerFit:
      "录屏和麦克风即可开始，自己的失误与思考过程就是最持续的内容来源。",
    minimumKit: ["棋盘平台或实体棋盘", "屏幕录制", "麦克风", "训练日志"],
    repeatableFormat: [
      "本期训练目标",
      "完整对局",
      "无引擎自评",
      "引擎核对",
      "错误分类和作业",
    ],
    firstTopics: [
      "新手十盘错误统计",
      "一分钟残局练习",
      "时间不足怎么复盘",
      "第一次线下比赛",
    ],
    incomePaths: ["广告", "棋具与平台合作", "课程", "陪练与社群"],
    caution:
      "在线对局必须遵守平台公平竞赛规则；分析时不能实时使用引擎作弊或冒充专业等级。",
    references: refs([
      ["GothamChess", "GothamChess"],
      ["agadmator's Chess Channel", "agadmator"],
      ["Hanging Pawns", "HangingPawns"],
      ["ChessNetwork", "ChessNetwork"],
      ["Saint Louis Chess Club", "STLChessClub"],
      ["Daniel Naroditsky", "DanielNaroditskyGM"],
      ["Chess Vibes", "ChessVibesOfficial"],
      ["chessbrah", "chessbrah"],
      ["Eric Rosen", "eric-rosen"],
      ["ChessDojo", "ChessDojo"],
    ]),
  },
  {
    id: "hardware-synth-electronic-music",
    title: "硬件合成器、采样与电子音乐实验",
    mode: "hybrid",
    category: "电子音乐",
    promise:
      "用信号链、音色设计、节奏搭建和现场演奏，把一段电子音乐从零做到可发布。",
    beginnerFit:
      "可从一款软件合成器或单台设备开始，录屏和俯拍都能形成清晰教程。",
    minimumKit: ["软件或硬件合成器", "音频接口", "耳机", "录音软件"],
    repeatableFormat: [
      "声音目标",
      "信号链",
      "音色与节奏",
      "编排和演奏",
      "混音前后对比",
    ],
    firstTopics: [
      "一个音色做完整曲",
      "环境声做采样",
      "无电脑即兴演奏",
      "合成器低频混音",
    ],
    incomePaths: ["广告", "设备与插件联盟", "采样包销售", "音乐授权与课程"],
    caution:
      "样本、预设和演奏素材必须确认授权；设备评测要披露赠送和赞助关系，并保护听力。",
    references: refs([
      ["Andrew Huang", "andrewhuang"],
      ["Red Means Recording", "RedMeansRecording"],
      ["loopop", "loopop"],
      ["Venus Theory", "VenusTheory"],
      ["Benn Jordan", "BennJordan"],
      ["Ricky Tinez", "RickyTinez"],
      ["BoBeats", "BoBeats"],
      ["HAINBACH", "Hainbach"],
      ["True Cuckoo", "truecuckoo"],
      ["Underdog Electronic Music School", "UnderdogElectronicMusicSchool"],
    ]),
  },
];
