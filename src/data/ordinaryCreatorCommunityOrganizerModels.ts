import type { OrdinaryCreatorModel } from "./ordinaryCreatorModels.js";

export const ordinaryCreatorCommunityOrganizerModels: OrdinaryCreatorModel[] = [
  {
    id: "neighborhood-book-club-diary",
    title: "社区读书会选择、讨论与成员成长日志",
    mode: "on-camera",
    category: "共同阅读社群",
    promise:
      "记录一群普通人如何共同选书、完成阅读、展开讨论并逐渐形成稳定社群，让不同理解而非单人书评成为主角。",
    beginnerFit:
      "三到五位愿意持续参与的成员、一处安静空间和明确的发言授权就能开始，不需要邀请名人或购买大量新书。",
    minimumKit: ["手机或相机", "全向或双人麦克风", "选书投票表", "成员出镜与引用授权"],
    repeatableFormat: [
      "公布候选书和成员投票结果",
      "记录阅读中的问题与中途反馈",
      "用统一问题主持线下或线上讨论",
      "保留分歧并让成员核对剪辑语境",
      "总结下期选书、参与方式与社群变化",
    ],
    firstTopics: ["第一次由成员匿名投票选书", "一本书三种完全不同的理解", "读不完也能参加的讨论", "六个月后成员阅读习惯变化"],
    incomePaths: ["YouTube 广告", "书店或图书馆合作", "图书联盟链接", "付费线上读书社群"],
    caution:
      "不能公开未授权成员、私人经历或群聊内容；引用仍受版权限制，讨论敏感主题时必须允许成员撤回发言或匿名。",
    references: [
      { name: "BooksandLala", url: "https://www.youtube.com/@BooksandLala" },
      { name: "Jack Edwards", url: "https://www.youtube.com/@jack_edwards" },
      { name: "The Book Leo", url: "https://www.youtube.com/@TheBookLeo" },
      { name: "A Clockwork Reader", url: "https://www.youtube.com/@AClockworkReader" },
    ],
  },
  {
    id: "community-garden-collective-log",
    title: "社区花园轮值、收成与公共空间成长日志",
    mode: "hybrid",
    category: "共同种植空间",
    promise:
      "围绕一块由多人维护的社区花园，记录季节计划、成员轮值、公共决策、失败、收成和空间如何被长期使用。",
    beginnerFit:
      "可以从获准使用的一小块公共种植区或现有社群志愿者开始；持续记录同一块地比展示昂贵庭院更重要。",
    minimumKit: ["手机或相机", "花园管理方拍摄许可", "轮值与种植台账", "基础园艺工具"],
    repeatableFormat: [
      "标注日期、地块和本期共同目标",
      "记录成员轮值与实际完成事项",
      "展示植物、土壤、用水和天气变化",
      "说明分歧、失败和共同决策",
      "更新收成去向、下期任务与年度台账",
    ],
    firstTopics: ["荒地变花园的第一个月", "一次成员种植计划会", "公共水源如何轮值管理", "一季收成最后去了哪里"],
    incomePaths: ["YouTube 广告", "园艺用品联盟链接", "地方机构合作", "社区课程与种植手册"],
    caution:
      "必须取得土地管理方和成员授权，不能占用公共空间或拍摄不愿出镜者；食物安全、农药、堆肥和工具使用应遵守当地规则。",
    references: [
      { name: "GrowVeg", url: "https://www.youtube.com/@GrowVeg" },
      { name: "Huw Richards", url: "https://www.youtube.com/@HuwRichards" },
      { name: "Emma's Allotment Diaries", url: "https://www.youtube.com/@emmasallotmentdiaries" },
      { name: "Self Sufficient Me", url: "https://www.youtube.com/@Selfsufficientme" },
    ],
  },
  {
    id: "tool-library-lending-operations",
    title: "工具图书馆借还、维护与成员项目记录",
    mode: "hybrid",
    category: "共享工具运营",
    promise:
      "把工具入库、检查、借还、维修、培训和成员完成的真实项目做成透明运营栏目，展示共享资源如何减少闲置与重复购买。",
    beginnerFit:
      "可先为现有工具图书馆或小型邻里共享柜做志愿记录；目录准确、状态透明和安全培训比工具数量更重要。",
    minimumKit: ["手机或相机", "组织书面授权", "库存与借还系统", "安全检查清单"],
    repeatableFormat: [
      "展示本期新入库或归还物品",
      "按清单检查状态与缺件",
      "记录维护、报废或暂停借出原因",
      "经同意回访一个成员项目",
      "公开借用次数、等待名单与下一步需求",
    ],
    firstTopics: ["十件最常借出的工具", "一台归还故障工具如何处理", "新成员第一次安全培训", "一个季度共享节省了多少购买"],
    incomePaths: ["YouTube 广告", "工具品牌公益合作", "会员与工作坊收入", "共享空间项目资助"],
    caution:
      "高风险工具必须由组织制定培训、检查和责任规则；不得泄露会员资料，也不能为了拍摄让未授权或未培训人员操作设备。",
    references: [
      { name: "Toronto Tool Library", url: "https://www.youtube.com/user/TorontoToolLibrary" },
      { name: "Library of Things", url: "https://www.youtube.com/@libraryofthings" },
      { name: "Edinburgh Tool Library", url: "https://www.youtube.com/@edinburghtoollibrary" },
      { name: "iFixit", url: "https://www.youtube.com/@iFixitYourself" },
    ],
  },
  {
    id: "amateur-club-season-documentary",
    title: "业余球队与兴趣俱乐部完整赛季纪录",
    mode: "on-camera",
    category: "业余社团赛季",
    promise:
      "跟随一支没有职业光环的球队或竞技社团，记录报名、训练、出勤、比赛、伤病、志愿分工和整个赛季的人际变化。",
    beginnerFit:
      "本地球队、羽毛球社、龙舟队或棋类联赛都能开始；稳定跟拍同一群人，比昂贵转播设备更能建立追更理由。",
    minimumKit: ["手机或相机", "领夹麦与环境收音", "俱乐部及成员授权", "赛程与出勤台账"],
    repeatableFormat: [
      "交代本轮目标、阵容和现实限制",
      "记录训练、准备和志愿者工作",
      "用获准机位呈现比赛关键节点",
      "由成员复盘结果而非制造冲突",
      "更新排名、出勤、伤病和下轮任务",
    ],
    firstTopics: ["赛季前第一次全员训练", "凑不齐阵容的一周", "一场失利后的真实复盘", "普通成员坚持一季发生什么"],
    incomePaths: ["YouTube 广告", "本地赞助", "会员或加长内容", "俱乐部影像服务"],
    caution:
      "未成年人、伤病、队内争执和更衣空间必须单独授权；不得通过剪辑羞辱水平较弱成员，也不能妨碍比赛规则和现场安全。",
    references: [
      { name: "Bunch of Amateurs", url: "https://www.youtube.com/@BunchOfAmateurs" },
      { name: "SE Dons", url: "https://www.youtube.com/@SEDons" },
      { name: "Hashtag United", url: "https://www.youtube.com/@HashtagUnited" },
      { name: "COPA90 Football", url: "https://www.youtube.com/@COPA90" },
    ],
  },
  {
    id: "community-swap-event-ledger",
    title: "社区交换活动筹备、流转与剩余物追踪",
    mode: "hybrid",
    category: "邻里物品交换",
    promise:
      "记录衣物、书籍、种子或生活用品交换活动从规则、招募、分类到剩余物去向的完整过程，让减废成果可核对。",
    beginnerFit:
      "可从十几人的小型交换桌开始；清楚规则、物品卫生、数量台账和剩余物处理方案比大型场地更重要。",
    minimumKit: ["手机或相机", "场地与参与者授权", "物品分类标识", "入场、流转与剩余台账"],
    repeatableFormat: [
      "公开品类、质量和参与规则",
      "记录场地布置与志愿者分工",
      "按类别统计进入和带走数量",
      "经同意记录参与者交换故事",
      "公布剩余物去向、问题和下次改进",
    ],
    firstTopics: ["第一次二十人衣物交换", "社区种子交换如何防混淆", "没人带走的东西去了哪里", "第二次活动如何减少排队"],
    incomePaths: ["YouTube 广告", "地方公益合作", "可持续品牌赞助", "活动组织与模板服务"],
    caution:
      "不得把交换活动变成未经说明的商业倒卖；食品、种子、儿童用品和电器应遵守卫生、检疫与安全规则，剩余物不能直接丢弃或虚报捐赠。",
    references: [
      { name: "New Dream", url: "https://www.youtube.com/@NewDreamOrg" },
      { name: "Shelbizleee", url: "https://www.youtube.com/@Shelbizleee" },
      { name: "My Green Closet", url: "https://www.youtube.com/@MyGreenCloset" },
      { name: "Kristen Leo", url: "https://www.youtube.com/@KristenLeo" },
    ],
  },
];
