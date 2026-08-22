import type { OrdinaryCreatorModel } from "./ordinaryCreatorModels.js";

export const ordinaryCreatorWorkplaceDiaryModels: OrdinaryCreatorModel[] = [
  {
    id: "truck-driver-route-diary",
    title: "货运司机出车、路线与真实工时日记",
    mode: "hybrid",
    category: "货运职业",
    promise:
      "从出车检查、装卸等待、道路变化到休息与结算，记录一趟货运真正如何完成，而不只展示公路风景。",
    beginnerFit:
      "已有合法从业资质和单位许可的司机，可以从停车后的旁白与固定机位开始；熟悉路线和流程就是内容壁垒。",
    minimumKit: ["合规固定行车相机", "停车后使用的手机", "工时与费用记录", "公司、客户和货物保密清单"],
    repeatableFormat: ["停车状态说明任务与检查", "记录合法固定机位路段", "讲清等待和路线变化", "展示休息与安全决策", "到达后复盘工时和费用"],
    firstTopics: ["一趟短途货运完整时间线", "装卸等待如何改变一天", "恶劣天气下为什么选择停驶", "一周在路时间和实际休息"],
    incomePaths: ["YouTube 广告", "合规车载用品联盟", "职业装备品牌合作", "运输生活写作或影像授权"],
    caution:
      "驾驶中绝不操作设备或表演；遵守工时、停车、公司及客户保密规定，隐藏实时位置、货物、单据和安全系统，不用疲劳驾驶制造剧情。",
    references: [
      { name: "Happiness By The Mile", url: "https://www.youtube.com/channel/UCKoA7-TbTfB6Dpsz70Pbomg" },
      { name: "Trucker Josh VLOGS", url: "https://www.youtube.com/user/TruckerJosh456" },
      { name: "Smart Trucking", url: "https://www.youtube.com/user/SmartTrucking" },
      { name: "Iwona Blecharczyk", url: "https://www.youtube.com/@IwonaBlecharczyk" },
      { name: "Riding with Dave", url: "https://www.youtube.com/@RidingwithDave" },
    ],
  },
  {
    id: "flight-attendant-trip-diary",
    title: "乘务员行程准备、待命与恢复日记",
    mode: "on-camera",
    category: "航空职业",
    promise:
      "围绕一次合法可分享的行程，记录打包、报到前准备、待命变化、过夜生活和身体恢复，而不是拍摄受限的机上工作。",
    beginnerFit:
      "内容可以全部发生在家中、通勤路上和酒店房间；真实作息、物品准备和职业边界已经足够形成系列。",
    minimumKit: ["手机", "房间固定架", "脱敏后的行程时间线", "公司社交媒体政策与乘客隐私清单"],
    repeatableFormat: ["说明脱敏后的行程类型", "展示出发前准备", "记录待命或延误变化", "分享合法范围内的过夜日常", "回家后复盘睡眠与恢复"],
    firstTopics: ["三日行程怎样打包", "待命日实际如何安排", "凌晨报到前的准备流程", "连续飞行后怎样恢复作息"],
    incomePaths: ["YouTube 广告", "旅行用品联盟", "箱包或生活方式品牌合作", "职业经验型数字产品"],
    caution:
      "公司政策和航空安全优先；不拍乘客、证件、舱门操作、安保流程、未公开行程或同事谈话，不把个人经验当作招聘承诺或官方培训。",
    references: [
      { name: "Kat Nesbitt", url: "https://www.youtube.com/@KatNesbitt" },
      { name: "Jetting Julia", url: "https://www.youtube.com/@JettingJulia" },
      { name: "Fly With Stella", url: "https://www.youtube.com/@FlyWithStella" },
    ],
  },
  {
    id: "teacher-prep-reflection-diary",
    title: "教师备课、教室准备与下班后复盘",
    mode: "on-camera",
    category: "教育职业",
    promise:
      "把镜头放在学生到来之前和离开之后，记录备课、材料整理、时间管理与教学反思，同时保护未成年人。",
    beginnerFit:
      "不需要在课堂中拍学生；一张课桌、一份脱敏教案和一次课后反思，就能形成对同行有价值的职业内容。",
    minimumKit: ["手机或相机", "教室固定架", "完全脱敏的示例材料", "学校许可、学生隐私与版权清单"],
    repeatableFormat: ["说明本周教学目标", "准备材料和空间", "课前预判一个难点", "下课后只谈自己的执行", "更新下一次调整和工作量"],
    firstTopics: ["开学前一天怎样准备教室", "一节课的真实备课时间", "周日备课如何避免无限加班", "一次活动没有达到预期后的调整"],
    incomePaths: ["YouTube 广告", "文具或教学工具联盟", "数字教案和模板", "教师生产力品牌合作"],
    caution:
      "未成年人隐私不可交换流量；不出现学生面孔、姓名、声音、作品、成绩、行为事件或可识别教室信息，并遵守学校审批、版权和专业伦理。",
    references: [
      { name: "Pocketful of Primary", url: "https://www.youtube.com/@PocketfulofPrimary" },
      { name: "Maya Lee", url: "https://www.youtube.com/@MayaLee" },
      { name: "Shelley Coates", url: "https://www.youtube.com/@EarlyEDventures" },
    ],
  },
  {
    id: "delivery-rider-shift-economics",
    title: "外卖配送班次、路线选择与净时薪记录",
    mode: "hybrid",
    category: "平台配送",
    promise:
      "完整记录一次配送班次的上线时间、等待、里程、订单、天气、成本和净收入，让平台劳动的现实可以复算。",
    beginnerFit:
      "合法配送者用预先固定的设备即可开始；一段普通晚班中的等待、拒单和成本，比只晒高收入更有长期价值。",
    minimumKit: ["合规固定运动相机", "停车后使用的手机", "里程、工时与成本表", "客户地址和平台资料隐私清单"],
    repeatableFormat: ["公布班次规则与起点", "记录等待和合法路线片段", "脱敏汇总订单", "扣除车辆及平台相关成本", "计算净时薪并复盘安全决策"],
    firstTopics: ["晚高峰三小时真实净收入", "下雨天订单多是否值得", "电池一格电能完成多少单", "把等待时间算进去后的时薪"],
    incomePaths: ["平台配送收入", "YouTube 广告", "骑行与防护装备联盟", "透明的配送工具合作"],
    caution:
      "行驶中绝不操作或看镜头；隐藏客户地址、姓名、订单和门牌，不闯灯、不超速、不与客户制造冲突，并计入保险、税费、折旧和等待时间。",
    references: [
      { name: "London Eats", url: "https://www.youtube.com/@LondonEats" },
      { name: "Wilcer | Crank Hustle", url: "https://www.youtube.com/@Wilcer" },
      { name: "Bentley Koup", url: "https://www.youtube.com/@BentleyKoup" },
    ],
  },
  {
    id: "trade-apprentice-skill-log",
    title: "技工学徒技能清单、现场学习与成长日志",
    mode: "hybrid",
    category: "技能学徒",
    promise:
      "以学徒身份记录工具认识、基础操作、考试准备、错误复盘和技能签核，让观众看到专业能力怎样逐步形成。",
    beginnerFit:
      "不需要冒充师傅；诚实标明自己正在学习，并在获准环境中记录低风险练习，就能形成清楚的成长线。",
    minimumKit: ["手机或相机", "安全固定机位", "技能与学习日志", "雇主、现场、客户和安全许可清单"],
    repeatableFormat: ["说明本周学习目标", "由合格人员确认安全边界", "记录练习或观察过程", "复盘错误和反馈", "更新技能清单与下一步"],
    firstTopics: ["学徒第一周真正学了什么", "第一次正确整理基础工具", "一项技能练习十次的变化", "考试或签核前的复习记录"],
    incomePaths: ["YouTube 广告", "合规工具联盟", "职业教育品牌合作", "学习日志或职业入门内容"],
    caution:
      "学徒内容不能替代持证培训；未经许可不拍工地、客户或图纸，高压电、燃气、高空、机械和结构操作必须由合格人员监督，不能为镜头越权施工。",
    references: [
      { name: "Mad Electrician", url: "https://www.youtube.com/@MadElectrician" },
      { name: "Artisan Electrics", url: "https://www.youtube.com/@ArtisanElectrics" },
      { name: "Electrician U", url: "https://www.youtube.com/@ElectricianU" },
      { name: "Perkins Builder Brothers", url: "https://www.youtube.com/@PerkinsBuilderBrothers" },
      { name: "Scott Brown Carpentry", url: "https://www.youtube.com/@ScottBrownCarpentry" },
    ],
  },
];
