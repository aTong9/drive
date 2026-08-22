import type { OrdinaryCreatorModel } from "./ordinaryCreatorModels.js";

export const ordinaryCreatorLocalUtilityModels: OrdinaryCreatorModel[] = [
  {
    id: "local-construction-progress-tracker",
    title: "本地工程进度、道路变化与节点回访",
    mode: "faceless",
    category: "工程观察",
    promise:
      "长期从合法公共位置记录一项道路、车站、桥梁或社区工程，用同机位对比、官方节点和现场变化回答居民最关心的问题。",
    beginnerFit:
      "一部手机和固定回访点就能开始；不需要成为工程师，但必须把现场观察、官方信息和个人推测分开。",
    minimumKit: ["手机或相机", "合法公共拍摄点", "日期与同机位记录", "官方公告和来源清单"],
    repeatableFormat: ["回顾上次状态和官方计划", "用固定路线记录本期变化", "标注已完成与未确认部分", "核对封路或开放信息", "给出下次回访节点"],
    firstTopics: ["家附近道路改造每月回访", "新车站出入口进度", "同一个施工路口的半年变化", "延期公告与现场实际状态对照"],
    incomePaths: ["YouTube 广告", "本地媒体影像授权", "地图或记录模板", "透明标注的城市服务合作"],
    caution:
      "只在允许停留的公共位置拍摄，不进入工地、不飞越禁飞区、不干扰作业；官方事实、现场观察与推断必须分别标注，避免泄露安保细节。",
    references: [
      { name: "Urban Connector", url: "https://www.youtube.com/@Urban_Connector" },
      { name: "Practical Engineering", url: "https://www.youtube.com/@PracticalEngineeringChannel" },
      { name: "The B1M", url: "https://www.youtube.com/@TheB1M" },
      { name: "Construction Updates", url: "https://www.youtube.com/@ConstructionUpdates" },
    ],
  },
  {
    id: "transit-change-rider-update",
    title: "公共交通调整、开通与乘客实测更新",
    mode: "hybrid",
    category: "交通更新",
    promise:
      "围绕一条线路或一个换乘点，核对官方调整并亲自实测时间、指引、拥挤和换乘体验，为本地乘客提供日期明确的更新。",
    beginnerFit:
      "从自己常坐的一条公交或地铁线开始即可；清晰记录日期、班次和个人实测条件，比覆盖整座城市更重要。",
    minimumKit: ["手机或运动相机", "交通卡和合法车票", "官方公告截图记录", "乘客隐私与站内拍摄规则清单"],
    repeatableFormat: ["说明生效日期和官方变化", "按新方案完整实乘", "记录换乘和时间数据", "指出无障碍及指引问题", "总结适用人群与复核日期"],
    firstTopics: ["新开线路第一周实乘", "常用公交改线后多花多久", "一个换乘站改造前后", "末班车调整对通勤的影响"],
    incomePaths: ["YouTube 广告", "本地交通媒体合作", "通勤用品联盟", "地图、数据或影像授权"],
    caution:
      "票价、时刻和政策会变化，必须标注实测日期并链接官方来源；不妨碍乘客、不拍清人脸，不冒充运营方，也不为镜头冲门或违反站内规则。",
    references: [
      { name: "RMTransit", url: "https://www.youtube.com/@RMTransit" },
      { name: "Geoff Marshall", url: "https://www.youtube.com/@GeoffMarshall" },
      { name: "Miles in Transit", url: "https://www.youtube.com/@MilesinTransit" },
      { name: "nandert", url: "https://www.youtube.com/@nandert" },
    ],
  },
  {
    id: "wheelchair-route-access-audit",
    title: "轮椅路线、场所入口与无障碍实测",
    mode: "hybrid",
    category: "无障碍实测",
    promise:
      "由轮椅使用者或与当事人共同完成一条真实路线，逐点记录坡度、门槛、电梯、卫生间、交通衔接和求助成本。",
    beginnerFit:
      "从日常要去的医院、商场或公园开始；一次路线的准确细节，往往比笼统说“无障碍”更能帮助同城观众。",
    minimumKit: ["手机或运动相机", "路线和备用方案", "尺寸、时间与故障记录", "场所许可和当事人授权"],
    repeatableFormat: ["说明使用者和设备条件", "从交通起点完整出发", "逐点测试真实障碍", "记录求助及备用路线", "总结适用范围和复测日期"],
    firstTopics: ["从地铁到医院的完整轮椅路线", "商场所谓无障碍入口在哪里", "一个公园的坡道和卫生间实测", "电梯停运时是否有可行替代"],
    incomePaths: ["YouTube 广告", "无障碍机构合作", "辅助用品的透明联盟", "路线数据与影像授权"],
    caution:
      "不能由健全人短暂坐轮椅代替当事人经验；说明轮椅尺寸、体力和陪同差异，不擅自保证可达性，发现问题应提供建设性反馈而非骚扰工作人员。",
    references: [
      { name: "Wheelsnoheels", url: "https://www.youtube.com/@Wheelsnoheels" },
      { name: "Wheels2Walking", url: "https://www.youtube.com/@Wheels2Walking" },
      { name: "Wheelchair Travel", url: "https://www.youtube.com/@WheelchairTravel" },
    ],
  },
  {
    id: "neighborhood-rent-cost-tracker",
    title: "同一片区租金、户型与生活成本长期追踪",
    mode: "on-camera",
    category: "租房信息",
    promise:
      "固定追踪一个片区的公开房源、典型户型、通勤和日常价格，让观众理解真实居住成本怎样随时间变化。",
    beginnerFit:
      "无需成为房产中介；可以只使用获准参观的房源和公开数据，持续记录同类户型比一次豪宅参观更有用。",
    minimumKit: ["手机或相机", "获准拍摄的看房安排", "房源与生活成本表", "地址、住户和商业关系披露清单"],
    repeatableFormat: ["说明片区和数据日期", "展示获准拍摄的代表户型", "核算租金外的真实费用", "实测通勤与生活设施", "和过去月份或相邻片区对比"],
    firstTopics: ["同一预算在三个街区能租什么", "一套房除租金外还要多少钱", "同类一居室连续半年报价", "便宜十分钟通勤是否值得"],
    incomePaths: ["YouTube 广告", "地图或搬家用品联盟", "透明披露的房产平台合作", "本地生活数据产品"],
    caution:
      "未经许可不进入或拍摄住宅，隐藏精确门牌、住户和门禁信息；标明报价日期、押金、管理费和合作关系，不制造抢房焦虑或把挂牌价当成交价。",
    references: [
      { name: "Cash Jordan", url: "https://www.youtube.com/@CashJordan" },
      { name: "Here Be Barr", url: "https://www.youtube.com/@HereBeBarr" },
      { name: "LivingBobby", url: "https://www.youtube.com/@LivingBobby" },
      { name: "Apartment Therapy", url: "https://www.youtube.com/@ApartmentTherapy" },
      { name: "JavierNYC", url: "https://www.youtube.com/@JavierNYC" },
    ],
  },
  {
    id: "local-shop-change-archive",
    title: "本地商铺开关店、街区商业与记忆档案",
    mode: "faceless",
    category: "商业街观察",
    promise:
      "长期回访一条商业街或商场，记录店铺开业、迁址、停业和空间再利用，把公开事实、现场状态和居民记忆保存下来。",
    beginnerFit:
      "从一条熟悉街道和公开营业信息开始；旧照片、招牌变化和合法外观镜头就能形成有时间深度的栏目。",
    minimumKit: ["手机或相机", "公共位置固定路线", "店铺状态与来源表", "采访授权和事实核对清单"],
    repeatableFormat: ["回顾上次商铺地图", "记录本期公开变化", "核对公告和经营方说法", "加入获准使用的历史资料", "更新状态并安排下次回访"],
    firstTopics: ["一条街一年里换了哪些店", "老商场关闭前的合法记录", "一家小店搬迁后的新位置", "空置铺面后来变成了什么"],
    incomePaths: ["YouTube 广告", "地方媒体影像授权", "街区地图或刊物", "透明披露的本地机构合作"],
    caution:
      "不擅闯关闭或废弃物业，不把传言写成倒闭原因；小店经营困难、员工和顾客隐私需谨慎，商业合作不能影响事实标注和负面信息核验。",
    references: [
      { name: "Retail Archaeology", url: "https://www.youtube.com/@RetailArchaeology" },
      { name: "This is Dan Bell", url: "https://www.youtube.com/@ThisisDanBell" },
      { name: "Aces Adventures", url: "https://www.youtube.com/@AcesAdventures" },
      { name: "Bright Sun Films", url: "https://www.youtube.com/@BrightSunFilms" },
      { name: "Lost Departments", url: "https://www.youtube.com/@LostDepartments" },
    ],
  },
];
