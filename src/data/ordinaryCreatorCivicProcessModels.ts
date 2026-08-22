import type { OrdinaryCreatorModel } from "./ordinaryCreatorModels.js";

export const ordinaryCreatorCivicProcessModels: OrdinaryCreatorModel[] = [
  {
    id: "local-public-meeting-agenda-recap",
    title: "本地公共会议议程、决定与后续追踪",
    mode: "hybrid",
    category: "公共会议记录",
    promise:
      "把公开会议的议程、原始文件、实际表决和后续执行整理成普通居民能看懂的连续更新，而不是只截取争议片段。",
    beginnerFit:
      "可以从每月一次的公开会议和三个与生活最相关的议题开始；准确标注议程页码和决定状态比现场评论更重要。",
    minimumKit: ["手机或相机", "官方议程与会议记录", "来源链接表", "日期、决定与后续状态台账"],
    repeatableFormat: [
      "发布前列出会议日期和官方议程",
      "逐项区分提案、讨论、修订与最终决定",
      "引用官方录像时间码和文件页码",
      "说明仍不确定或需向部门核实之处",
      "在下次会议或截止日期后更新结果",
    ],
    firstTopics: ["本月三个与你有关的议题", "提案如何从讨论变成决定", "一次延期事项后来怎样了", "用十分钟读懂会议纪要"],
    incomePaths: ["YouTube 广告", "本地媒体合作", "会员支持", "公共资料整理服务"],
    caution:
      "必须链接完整官方来源并区分事实、引述和个人判断；不得断章取义、煽动骚扰工作人员或公开普通发言者不必要的私人信息。",
    references: [
      { name: "About Here", url: "https://www.youtube.com/@AboutHere" },
      { name: "Strong Towns", url: "https://www.youtube.com/@strongtowns" },
      { name: "City Beautiful", url: "https://www.youtube.com/@CityBeautiful" },
      { name: "CityNerd", url: "https://www.youtube.com/@CityNerd" },
    ],
  },
  {
    id: "planning-notice-application-tracker",
    title: "规划公示、项目申请与现场变化追踪",
    mode: "hybrid",
    category: "规划申请跟踪",
    promise:
      "围绕一项公开规划申请，从场地现状、申请文件、意见期、审议、修改到批准或否决，建立带日期的完整时间线。",
    beginnerFit:
      "不需要假装规划师；只要会找到官方申请页面、按原文解释图纸并反复回到同一现场，就能提供本地价值。",
    minimumKit: ["手机或相机", "官方申请与图纸链接", "现场合法拍摄位置", "里程碑与版本对照表"],
    repeatableFormat: [
      "确认项目编号、地点和申请版本",
      "用现场画面解释公开图纸范围",
      "列明意见期、会议和决定日期",
      "同时呈现申请方说明与官方材料",
      "跟踪修改、施工或长期未启动状态",
    ],
    firstTopics: ["街角空地提交了什么申请", "第一次方案后来改了哪里", "意见期结束后发生什么", "获批一年仍未动工的项目"],
    incomePaths: ["YouTube 广告", "本地媒体合作", "会员支持", "地图与项目资料订阅"],
    caution:
      "不能把申请文件误写成已经批准或即将施工；不得进入私有土地、公开住户资料，也不能用个人立场替代规划、法律或环境专业判断。",
    references: [
      { name: "About Here", url: "https://www.youtube.com/@AboutHere" },
      { name: "CityNerd", url: "https://www.youtube.com/@CityNerd" },
      { name: "Oh The Urbanity!", url: "https://www.youtube.com/@OhTheUrbanity" },
      { name: "Not Just Bikes", url: "https://www.youtube.com/@NotJustBikes" },
    ],
  },
  {
    id: "municipal-service-request-resolution-log",
    title: "市政服务工单从提交到解决的实测日志",
    mode: "hybrid",
    category: "公共服务工单",
    promise:
      "对路灯、坑洞、积水、标线或公共设施故障，用同一套规则记录发现、提交、受理、现场处理和复查结果。",
    beginnerFit:
      "一部手机和官方服务渠道即可开始；不需要制造对立，只需保留时间、工单编号、现场状态和每次回复。",
    minimumKit: ["手机", "官方工单渠道", "日期与状态台账", "隐去个人信息的截图工具"],
    repeatableFormat: [
      "记录问题位置范围、日期和初始状态",
      "通过官方渠道提交并保存编号",
      "按承诺时间检查状态和回复",
      "现场复测是否真正解决",
      "公开耗时、未解决原因和再次提交记录",
    ],
    firstTopics: ["一盏故障路灯多久修好", "积水工单雨后复测", "同类坑洞处理时间对比", "显示已完成但现场没变化怎么办"],
    incomePaths: ["YouTube 广告", "本地媒体数据合作", "会员支持", "非商业社区报告"],
    caution:
      "不得泄露报修人联系方式、精确住宅信息或工作人员身份，也不能阻碍抢修；单个案例不能代表全部服务质量，结论必须保留样本限制。",
    references: [
      { name: "Road Guy Rob", url: "https://www.youtube.com/@RoadGuyRob" },
      { name: "Practical Engineering", url: "https://www.youtube.com/@PracticalEngineeringChannel" },
      { name: "Strong Towns", url: "https://www.youtube.com/@strongtowns" },
      { name: "CityNerd", url: "https://www.youtube.com/@CityNerd" },
    ],
  },
  {
    id: "public-project-budget-contract-tracker",
    title: "公共项目预算、合同与变更公开资料追踪",
    mode: "faceless",
    category: "公共资金资料",
    promise:
      "用官方预算、采购公告、合同和变更文件，追踪一个公共项目的批准金额、承包范围、工期和后续变化。",
    beginnerFit:
      "从一个文件较完整的小项目开始，用屏幕录制和表格即可；重点是逐条引用原始文件，而不是把金额变化自动解释成问题。",
    minimumKit: ["电脑", "屏幕录制", "官方预算与采购链接", "金额、版本和日期对照表"],
    repeatableFormat: [
      "确认项目名称、主管机构与资金阶段",
      "引用批准预算、招标或合同原文",
      "区分估算、授标金额、支付和变更",
      "向官方说明核对缺失或矛盾数据",
      "随新文件更新工期、金额与完成状态",
    ],
    firstTopics: ["预算金额和合同金额为何不同", "一次合同变更逐条看", "延期公告里真正写了什么", "项目完工后的最终公开数字"],
    incomePaths: ["YouTube 广告", "会员支持", "本地媒体合作", "公开数据整理服务"],
    caution:
      "金额变化不等于浪费、舞弊或违法，必须核对口径、税费、范围和时间；没有可靠证据时不得影射个人或企业犯罪，也不提供法律结论。",
    references: [
      { name: "Strong Towns", url: "https://www.youtube.com/@strongtowns" },
      { name: "The B1M", url: "https://www.youtube.com/@TheB1M" },
      { name: "Practical Engineering", url: "https://www.youtube.com/@PracticalEngineeringChannel" },
      { name: "CityNerd", url: "https://www.youtube.com/@CityNerd" },
    ],
  },
  {
    id: "public-consultation-participant-diary",
    title: "公众咨询、意见提交与反馈闭环日记",
    mode: "on-camera",
    category: "公共参与过程",
    promise:
      "从普通参与者视角记录如何读懂咨询材料、参加开放日、提交具体意见，并核对最终报告是否回应了这些问题。",
    beginnerFit:
      "可以只跟踪一个与你日常生活直接相关的项目；公开自己的原始意见和收到的正式回应，就能形成可信的参与记录。",
    minimumKit: ["手机或相机", "官方咨询材料", "个人意见版本记录", "截止日期与回应台账"],
    repeatableFormat: [
      "说明咨询主题、主管方和截止日期",
      "区分官方事实、方案选项和个人立场",
      "记录开放日或公开活动的获准部分",
      "公开实际提交内容和提交凭证",
      "最终报告发布后逐项核对回应与变化",
    ],
    firstTopics: ["第一次提交公共意见全过程", "咨询问卷没有问到的问题", "开放日之后我修改了什么意见", "最终报告是否回应参与者"],
    incomePaths: ["YouTube 广告", "会员支持", "公民教育机构合作", "公共参与工作坊"],
    caution:
      "必须声明个人立场和利益关系，不能冒充所有居民意见；不得偷拍参与者、组织围攻或提交虚假身份，合作资助也必须完整披露。",
    references: [
      { name: "Strong Towns", url: "https://www.youtube.com/@strongtowns" },
      { name: "About Here", url: "https://www.youtube.com/@AboutHere" },
      { name: "City Beautiful", url: "https://www.youtube.com/@CityBeautiful" },
      { name: "Oh The Urbanity!", url: "https://www.youtube.com/@OhTheUrbanity" },
    ],
  },
];
