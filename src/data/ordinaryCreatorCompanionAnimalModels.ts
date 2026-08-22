import type { OrdinaryCreatorModel } from "./ordinaryCreatorModels.js";

export const ordinaryCreatorCompanionAnimalModels: OrdinaryCreatorModel[] = [
  {
    id: "neonatal-kitten-foster-log",
    title: "奶猫寄养、增重与离乳成长日志",
    mode: "hybrid",
    category: "幼龄动物寄养",
    promise:
      "在正规救助组织和兽医支持下，记录一窝幼猫从接收、保温、喂养、称重到社会化与送养的完整寄养过程。",
    beginnerFit:
      "先完成当地机构培训并从适合自己经验的个案开始；固定称重、喂养和交接记录本身就能形成连续栏目。",
    minimumKit: ["手机或相机", "电子秤", "机构认可的寄养用品", "喂养与健康记录表"],
    repeatableFormat: [
      "说明机构来源、年龄估计与隐私范围",
      "记录当日体重、进食和活动",
      "展示环境维护与社会化练习",
      "由兽医或机构解释异常处理",
      "更新离乳、绝育、疫苗与送养节点",
    ],
    firstTopics: ["寄养前必须学会什么", "一周体重曲线怎么读", "从奶瓶到自主进食", "第一次送养后的交接复盘"],
    incomePaths: ["YouTube 广告", "合规寄养用品联盟链接", "动物福利机构合作", "寄养记录模板"],
    caution:
      "新生动物可能迅速恶化，视频不能替代兽医和救助机构指导；禁止为了戏剧效果延误就医、重复摆拍危险状态或隐瞒死亡结局。",
    references: [
      { name: "Kitten Lady", url: "https://www.youtube.com/@KittenLady" },
      { name: "TinyKittens HQ", url: "https://www.youtube.com/@TinyKittens" },
      { name: "Flatbush Cats", url: "https://www.youtube.com/@FlatbushCats" },
      { name: "The Orphan Pet", url: "https://www.youtube.com/@TheOrphanPet" },
    ],
  },
  {
    id: "community-cat-tnr-colony-log",
    title: "社区猫 TNR 与群体照护长期记录",
    mode: "hybrid",
    category: "社区动物管理",
    promise:
      "与当地组织、兽医和居民协作，用个体台账和群体变化记录捕捉、绝育、疫苗、原地放归及持续照护。",
    beginnerFit:
      "普通人可以先参加培训、协助台账和固定喂养点维护，不必把自己包装成能够独立处理所有动物问题的救援者。",
    minimumKit: ["手机或相机", "个体识别与日期台账", "合作机构联系方式", "经培训使用的安全设备"],
    repeatableFormat: [
      "交代区域范围、合作方与本期目标",
      "用照片特征更新个体台账",
      "记录捕捉、诊疗与放归节点",
      "追踪新增、失踪和健康异常",
      "按月公开数量、绝育率和待办事项",
    ],
    firstTopics: ["如何读懂耳标与个体特征", "一个月群体数量变化", "冬季喂养点怎么维护", "一次 TNR 行动的完整台账"],
    incomePaths: ["YouTube 广告", "动物福利机构合作", "合规用品联盟链接", "公益培训与活动支持"],
    caution:
      "TNR 的法规、生态争议与执行条件因地区而异，必须遵从当地主管部门、兽医和专业组织；不公开精确点位，也不擅自投药、转移或放归。",
    references: [
      { name: "Flatbush Cats", url: "https://www.youtube.com/@FlatbushCats" },
      { name: "TinyKittens HQ", url: "https://www.youtube.com/@TinyKittens" },
      { name: "Community Cats Podcast", url: "https://www.youtube.com/@communitycatspodcast" },
      { name: "Kitten Lady", url: "https://www.youtube.com/@KittenLady" },
    ],
  },
  {
    id: "shelter-dog-decompression-foster-log",
    title: "收容犬减压、寄养与信任建立日志",
    mode: "on-camera",
    category: "犬只寄养适应",
    promise:
      "在收容机构和合格训练人员支持下，记录犬只离开高压环境后的休息、日常观察、信任建立和家庭适应过程。",
    beginnerFit:
      "寄养者不必表演快速改造；愿意遵守机构计划、稳定记录小变化并接受失败或转介，就是可靠内容。",
    minimumKit: ["手机或相机", "安全隔离空间", "机构提供的牵引与识别装备", "行为与触发因素日志"],
    repeatableFormat: [
      "说明机构评估与不可公开信息",
      "记录最初环境和减压规则",
      "观察进食、睡眠、互动与触发因素",
      "由合格人员调整训练或管理计划",
      "更新寄养、转介或领养结果",
    ],
    firstTopics: ["到家前七十二小时不做什么", "一周睡眠与进食变化", "第一次主动靠近", "领养家庭交接清单"],
    incomePaths: ["YouTube 广告", "收容机构内容合作", "合规宠物用品联盟链接", "寄养教育活动"],
    caution:
      "不能用强迫接触、惊吓测试或未经资质的训练制造转变；咬伤风险、儿童接触、资源守护和医疗问题必须由机构及专业人员处理。",
    references: [
      { name: "Rocky Kanaka", url: "https://www.youtube.com/@rockykanaka" },
      { name: "The Asher House", url: "https://www.youtube.com/@TheAsherHouse" },
      { name: "Hope For Paws", url: "https://www.youtube.com/user/eldad75" },
      { name: "Takis Shelter", url: "https://www.youtube.com/@TakisShelter" },
    ],
  },
  {
    id: "senior-special-needs-pet-care-diary",
    title: "高龄与特殊需求宠物生活质量日记",
    mode: "hybrid",
    category: "特殊需求宠物照护",
    promise:
      "以尊重而非卖惨的方式，记录高龄、残障或慢性病宠物的环境适配、生活质量观察和与兽医共同做出的照护决定。",
    beginnerFit:
      "真实照护者可以从日常动线、进食、睡眠和辅助设备开始，重点是长期一致的观察，而不是给出医疗建议。",
    minimumKit: ["手机或相机", "兽医认可的照护用品", "生活质量观察表", "用药与复诊记录"],
    repeatableFormat: [
      "说明诊断由谁作出及可公开范围",
      "记录当天活动、食欲和舒适度",
      "展示一种环境适配或辅助工具",
      "区分照护者观察与兽医结论",
      "更新复诊、计划变化与生活质量判断",
    ],
    firstTopics: ["家中防滑动线改造", "高龄宠物一周舒适度记录", "轮椅适配前后观察", "怎样准备一次有效复诊"],
    incomePaths: ["YouTube 广告", "适配用品联盟链接", "动物福利机构合作", "非医疗照护记录模板"],
    caution:
      "不得把痛苦和危急状态当流量素材，也不得替观众诊断或推荐剂量；安宁照护与终末决定必须与执业兽医讨论，并允许宠物停止拍摄。",
    references: [
      { name: "The Asher House", url: "https://www.youtube.com/@TheAsherHouse" },
      { name: "TinyKittens HQ", url: "https://www.youtube.com/@TinyKittens" },
      { name: "GeoBeats Animals", url: "https://www.youtube.com/@geobeatsanimals" },
      { name: "Rocky Kanaka", url: "https://www.youtube.com/@rockykanaka" },
    ],
  },
  {
    id: "adoptable-pet-profile-followup",
    title: "待领养动物真实档案与回访系列",
    mode: "on-camera",
    category: "动物领养叙事",
    promise:
      "为待领养动物建立诚实、可更新的个体档案，既展示可爱瞬间，也说明真实需求、适配家庭和领养后的长期变化。",
    beginnerFit:
      "可从为本地正规机构志愿拍摄一只动物开始；稳定的资料核对、更新和回访，比煽情救援标题更有用。",
    minimumKit: ["手机或相机", "领夹麦", "机构授权与资料表", "领养状态和回访台账"],
    repeatableFormat: [
      "由机构确认年龄、健康和领养状态",
      "在低压力环境记录真实性格",
      "说明适合与不适合的家庭条件",
      "公布正规申请路径而非私人收款",
      "领养后按约定时间回访并更新状态",
    ],
    firstTopics: ["一只被忽略的高龄犬", "猫咪适合怎样的家庭", "领养前必须知道的真实需求", "三十天与半年后的家庭回访"],
    incomePaths: ["YouTube 广告", "收容机构内容服务", "合规品牌合作", "公益影像项目资助"],
    caution:
      "不得隐瞒攻击、疾病或照护成本，也不能用私人转账代替正规领养审核；领养家庭、住址和联系方式必须经书面同意后才可公开。",
    references: [
      { name: "Rocky Kanaka", url: "https://www.youtube.com/@rockykanaka" },
      { name: "The Asher House", url: "https://www.youtube.com/@TheAsherHouse" },
      { name: "Flatbush Cats", url: "https://www.youtube.com/@FlatbushCats" },
      { name: "Hope For Paws", url: "https://www.youtube.com/user/eldad75" },
    ],
  },
];
