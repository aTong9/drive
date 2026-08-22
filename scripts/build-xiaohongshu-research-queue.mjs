import { readFile, writeFile } from "node:fs/promises";

const regions = JSON.parse(
  await readFile(new URL("../data/regions.json", import.meta.url), "utf8"),
);
const outputUrl = new URL(
  "../data/xiaohongshu-route-research.json",
  import.meta.url,
);
let existing = { entries: [] };
try {
  existing = JSON.parse(await readFile(outputUrl, "utf8"));
} catch {}
const existingByKey = new Map(
  existing.entries.map((entry) => [`${entry.province}/${entry.city}`, entry]),
);
const reviewedSeedEntries = [
  [
    "浙江/杭州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "杭州不止有西湖，10条zui美自驾游路线",
          author: "金弹子游记",
          url: "https://www.xiaohongshu.com/explore/68de53ec0000000004010331",
          accessedAt: "2026-08-20",
          decision: "needs-waypoint-mapping",
          evidence: [
            "千岛湖淳杨线与淳开线",
            "S219分水江环线",
            "浙西天路与皖浙天路可组合二日游",
            "S218苕溪避暑线",
            "西湖环湖道路顺序",
          ],
        },
      ],
    },
  ],
  [
    "山东/青岛",
    {
      status: "reviewed",
      candidates: [
        {
          title: "崂山环海路四种进入方式保姆级攻略",
          author: "刘小羊的小生活",
          url: "https://www.xiaohongshu.com/explore/6a450e6a000000001700bea0",
          accessedAt: "2026-08-20",
          decision: "needs-access-verification",
          evidence: [
            "崂山环海路进入方式",
            "评论集中询问预约报备",
            "仰口方向进入与垭口折返问题待官方核验",
          ],
        },
        {
          title: "青岛崂山环海自驾｜不走回头路路线",
          author: "小红书作者（页面未显示）",
          url: "https://www.xiaohongshu.com/explore/69ad4243000000000e00f963",
          accessedAt: "2026-08-20",
          decision: "hold-until-official-access-verification",
          evidence: [
            "仰口检查站—泉心河沙滩—青山渔村—垭口—流清河—沙子口",
            "全程约30公里、社区建议慢游2至3小时",
            "垭口至流清河段明确禁停",
            "帖子关于7时前免报备和商家代报备的说法必须由官方渠道核实",
            "评论出现路边停车建议，不纳入平台安全路线",
          ],
        },
      ],
    },
  ],
  [
    "四川/甘孜",
    {
      status: "reviewed",
      candidates: [
        {
          title: "去康定，一定要自驾S434，人间值得的绝美路线",
          author: "爱吃麻爱加辣",
          url: "https://www.xiaohongshu.com/explore/68f4c76b0000000003018eb9",
          accessedAt: "2026-08-20",
          decision: "needs-official-road-and-altitude-verification",
          evidence: [
            "成都经高速到康定后转S434",
            "康定机场—折多山观景台—塔公镇顺序",
            "作者按两日拆分并回康定住宿",
            "评论补充成都至康定约3.5小时、康定至塔公约2小时",
            "最高海拔约3800米及同行人员高反经历",
          ],
        },
      ],
    },
  ],
  [
    "新疆/伊犁",
    {
      status: "reviewed",
      candidates: [
        {
          title: "亲测分享！伊犁逆时针环线7天自驾全记录",
          author: "闪闪的兔兔",
          url: "https://www.xiaohongshu.com/explore/6a739c06000000000f039c00",
          accessedAt: "2026-08-20",
          decision: "needs-seasonal-closure-verification",
          evidence: [
            "乌鲁木齐—S101—奎屯",
            "独库公路北段—乔尔玛—唐布拉百里画廊",
            "喀拉峻—昭苏—夏塔—伊昭公路—伊宁",
            "赛里木湖东门—果子沟大桥—伊宁",
            "帖子明确提示下载离线地图并在出发前和当天查询封路",
          ],
        },
        {
          title: "顺时针自驾伊犁小环线已实践",
          author: "许多钱",
          url: "https://www.xiaohongshu.com/explore/6a4e7365000000002101584f",
          accessedAt: "2026-08-20",
          decision: "supporting-comments-only",
          evidence: [
            "评论建议精简为赛里木湖、唐布拉、独库北段、那拉提、夏塔和伊昭公路",
            "作者提示独库与伊昭均为盘山路，新手不建议单独执行",
            "路线依赖季节开放与驾驶员轮换",
          ],
        },
      ],
    },
  ],
  [
    "云南/大理",
    {
      status: "reviewed",
      candidates: [
        {
          title: "大理开车环洱海tips",
          author: "春花在大理",
          url: "https://www.xiaohongshu.com/explore/6a4630be0000000011015392",
          accessedAt: "2026-08-20",
          decision: "needs-driving-walking-split",
          evidence: [
            "海西生态廊道约40公里禁止汽车进入",
            "海西驾车应停富美邑、S湾或廊桥对应村庄后步行进入",
            "海东可经喜洲—双廊—文笔村形成驾车段",
            "评论提示村内停车可能收费且旺季拥堵",
            "建议将海西步行骑行与海东驾车拆成两日",
          ],
        },
      ],
    },
  ],
  [
    "海南/海口",
    {
      status: "reviewed",
      candidates: [
        {
          title: "海南全岛自驾行程（东线）",
          author: "洒脱的小乔爱旅行",
          url: "https://www.xiaohongshu.com/explore/6991bdb1000000001a032bf3",
          accessedAt: "2026-08-20",
          decision: "overview-only-needs-road-segment-mapping",
          evidence: [
            "东线按文昌—琼海博鳌—万宁日月湾—陵水分界洲岛—三亚组织",
            "建议七天六晚分段执行",
            "搜索结果未提供足够的具体道路编号与逐段导航锚点",
          ],
        },
        {
          title: "高德地图一次性导航海南环岛旅游公路全",
          author: "美天瞰",
          url: "https://www.xiaohongshu.com/explore/67ef3050000000001c01c959",
          accessedAt: "2026-08-20",
          decision: "insufficient-visible-route-detail",
          evidence: [
            "帖子主题确认环岛旅游公路可作为连续导航目标",
            "可见正文与评论没有足够途经点，暂不写入正式路线",
          ],
        },
      ],
    },
  ],
  [
    "北京/北京",
    {
      status: "reviewed",
      candidates: [
        {
          title: "北京周边8条封神山路｜自驾跑山党必冲",
          author: "细鱼尾纹",
          url: "https://www.xiaohongshu.com/explore/69edf091000000002003b1ed",
          accessedAt: "2026-08-20",
          decision: "needs-segment-and-safety-verification",
          evidence: [
            "新手组：范崎路、百里山水画廊环线、G109京西段",
            "进阶组：红井路、玻璃台九曲十八弯、昌赤路、六石路、古龙路",
            "帖子提示坡陡路窄、连续急弯、悬崖和拥堵差异",
            "建议早出发且不占道超车",
          ],
        },
      ],
    },
  ],
  [
    "陕西/西安",
    {
      status: "reviewed",
      candidates: [
        {
          title: "秦岭自驾天花板！西安出发1h直达的秘境环线",
          author: "江江的旅行日记",
          url: "https://www.xiaohongshu.com/explore/69db07d00000000023016103",
          accessedAt: "2026-08-20",
          decision: "hold-current-landslide-and-roadworks-risk",
          evidence: [
            "西安—大敷峪—金堆镇—任家滩村—张坪水库—灞源镇—蓝田九间房—西安",
            "正文称全程约160公里且不走回头路",
            "作者实走从11时出发至20时返回且未走高速",
            "评论报告村路仅容单车、沿线塌方和施工绕行",
            "弯道、大货车、弱信号与落石风险突出",
          ],
        },
        {
          title: "秦岭自驾封神线！太洋公路完整环线攻略",
          author: "中国自驾游",
          url: "https://www.xiaohongshu.com/explore/6a5e44040000000010025d11",
          accessedAt: "2026-08-20",
          decision: "video-detail-insufficient",
          evidence: [
            "评论称主要道路为标准铺装公路",
            "可见正文未给出足够逐段锚点，不能直接生成正式路线",
          ],
        },
      ],
    },
  ],
  [
    "湖北/宜昌",
    {
      status: "reviewed",
      candidates: [
        {
          title: "三峡G348自驾一定要按这个路线",
          author: "azjlcx",
          url: "https://www.xiaohongshu.com/explore/68b42f25000000001d020408",
          accessedAt: "2026-08-20",
          decision: "needs-official-access-and-waypoint-mapping",
          evidence: [
            "宜昌市区先到最远鹰嘴岩再沿G348返回市区以错峰",
            "鹰嘴岩—牛肝马肺峡谷与小狗山—三峡移民博物馆—莲沱畔江湾服务区",
            "西陵峡地质公园—干沟子大桥—明月台—听风谷观景台",
            "过西陵长江大桥可能需携身份证和行驶证办理通行",
            "评论警示不要误入三峡专用公路，鹰嘴岩村路陡且弯急",
          ],
        },
      ],
    },
  ],
  [
    "辽宁/大连",
    {
      status: "published",
      candidates: [
        {
          title: "大连沿海公路自驾游",
          author: "歡囍.",
          url: "https://www.xiaohongshu.com/explore/6a0191ae00000000080312fd",
          accessedAt: "2026-08-20",
          decision: "published-to-ln-dl-xinghai-bangchuidao-coast",
          evidence: [
            "棒棰岛—滨海东路—老虎滩—燕窝岭—北大桥",
            "滨海西路—银沙滩—傅家庄—星海广场",
            "建议13时左右出发并在星海广场看日落",
            "滨海路弯多且帖子提示限速约40至60公里",
            "北大桥、燕窝岭和银沙滩临时车位须当日核验",
          ],
        },
      ],
    },
  ],
  [
    "福建/厦门",
    {
      status: "reviewed",
      candidates: [
        {
          title: "厦门环岛自驾游路线",
          author: "Remix",
          url: "https://www.xiaohongshu.com/explore/696b5f41000000000903afa8",
          accessedAt: "2026-08-20",
          decision: "needs-waypoint-and-driving-boundary-mapping",
          evidence: [
            "厦门大桥—海堤公园—健康步道—海湾公园—海滨公园",
            "演武大桥—白城沙滩—白石炮台—黄厝沙滩—会展中心",
            "五缘大桥—集美大桥闭合环线",
            "评论仅支持黄厝辅路当次停车体验，不能作为长期停车保证",
          ],
        },
      ],
    },
  ],
  [
    "广东/珠海",
    {
      status: "reviewed",
      candidates: [
        {
          title: "珠海自驾一日游，免停车费的路线被我挖到啦",
          author: "Hmily",
          url: "https://www.xiaohongshu.com/explore/69966653000000000b010c6b",
          accessedAt: "2026-08-20",
          decision: "parking-then-cycling-not-drive-route",
          evidence: [
            "玖洲道停车后步行至圆明新园",
            "交通银行附近停车后改用共享单车进入情侣路",
            "评论显示免费停车状态可能变化，必须当日核验",
            "该帖不能用于证明情侣路全程纯驾车",
          ],
        },
        {
          title: "来珠海的话，你有必要开车跑一次情侣路全程",
          author: "小红书作者（页面未显示）",
          url: "https://www.xiaohongshu.com/explore/69b02d930000000016009b81",
          accessedAt: "2026-08-20",
          decision: "insufficient-visible-waypoints",
          evidence: [
            "正文确认情侣路全程驾车主题",
            "可见内容未提供连续途经点，暂不升级正式路线",
          ],
        },
      ],
    },
  ],
  [
    "浙江/宁波",
    {
      status: "published",
      candidates: [
        {
          title: "宁波象山3天2晚沿海自驾，人少海蓝",
          author: "出逃计划手册",
          url: "https://www.xiaohongshu.com/explore/69d8543600000000220256cc",
          accessedAt: "2026-08-20",
          decision: "published-to-zj-nb-songlan-shipu-coast",
          evidence: [
            "石浦渔港古城与半边山日落",
            "松兰山滨海度假区与沿海公路",
            "全程沿海环线、轿车友好且山路少",
            "沿海公路禁止为拍照路边停车",
            "台风、潮汐、轮渡和景区车行边界须当日核验",
          ],
        },
      ],
    },
  ],
  [
    "广西/北海",
    {
      status: "published",
      candidates: [
        {
          title: "被自己做的北海环岛自驾攻略满意哭了",
          author: "坨子不咸",
          url: "https://www.xiaohongshu.com/explore/6762402a000000000b014a9c",
          accessedAt: "2026-08-20",
          decision: "published-to-gx-bh-silver-guantouling-coast",
          evidence: [
            "流下村—冠头岭—紫霞湾",
            "金海湾红树林—银滩—侨港海滩",
            "冠头岭、紫霞湾和银滩日落线索",
            "涠洲岛必须乘船，不能混入市内驾车路线",
            "两端实际连接与停车仍须当天导航核验",
          ],
        },
      ],
    },
  ],
  [
    "广东/茂名",
    {
      status: "reviewed",
      candidates: [
        {
          title: "广东全境自驾行程（粤西海岸风光线）",
          author: "洒脱的小乔爱旅行",
          url: "https://www.xiaohongshu.com/explore/69968189000000000e00d675",
          accessedAt: "2026-08-20",
          decision: "rejected-distance-and-duration-conflict",
          evidence: [
            "帖子提出江门—阳江—茂名—湛江约1100公里长线",
            "正文包含浪漫海岸但未形成第一滩—浪漫海岸连续顺序",
            "评论明确指出茂名到南极村车程和距离错误",
            "不得将帖内16小时总耗时写入正式路线",
          ],
        },
        {
          title: "茂名看海就导航到这几个地方，别问我为什么",
          author: "冰美式请无限续杯",
          url: "https://www.xiaohongshu.com/explore/699a59b6000000002801e806",
          accessedAt: "2026-08-20",
          decision: "wild-beach-access-needs-verification",
          evidence: [
            "评论列出巴布几内湾、北山海、下村海、前岚海和山兜海",
            "评论称撩扶海可能封闭",
            "野海滩、村道和可停车说法不能直接转换为平台驾车路线",
          ],
        },
      ],
    },
  ],
  [
    "黑龙江/大庆",
    {
      status: "reviewed",
      candidates: [
        {
          title: "哈尔滨到大庆S214环湖环草原路线",
          author: "李嘿嘿",
          url: "https://www.xiaohongshu.com/explore/6a48efab0000000007013308",
          accessedAt: "2026-08-20",
          decision: "needs-waypoint-mapping-and-current-road-check",
          evidence: [
            "哈尔滨经国道约4小时到连环湖的个人体验",
            "连环湖—固山贝子草原约16分钟的个人体验",
            "导航胡吉后沿S214至胡吉吐莫镇",
            "沿线测速限速及胡吉吐莫镇充电站线索",
            "车程、充电速度与开放状态须当日复核",
          ],
        },
      ],
    },
  ],
  [
    "广西/桂林",
    {
      status: "published",
      candidates: [
        {
          title: "桂林阳朔自驾游，三天随心游",
          author: "那角落。",
          url: "https://www.xiaohongshu.com/explore/6a2101b300000000350324f2",
          accessedAt: "2026-08-20",
          decision: "published-to-gx-gl-elephant-yulong",
          evidence: [
            "阳朔遇龙河—月亮山—十里画廊",
            "兴坪后转场桂林市区",
            "第三日前往象鼻山",
            "遇龙河和十里画廊内部改用竹筏、电动车或步行",
            "景区内部不得作为公共驾车道路",
          ],
        },
      ],
    },
  ],
  [
    "湖南/张家界",
    {
      status: "reviewed",
      candidates: [
        {
          title: "张家界市区到武陵源，这条公路美到窒息",
          author: "小皇子在张家界",
          url: "https://www.xiaohongshu.com/explore/69f22b1a000000002301dee4",
          accessedAt: "2026-08-20",
          decision: "needs-city-endpoint-and-road-access-verification",
          evidence: [
            "帖子指向张家界市区至武陵源的百丈峡公路",
            "描述奇峰峡谷和云雾景观",
            "可见正文未提供完整途经点、道路编号和停车边界",
            "不得把景区内部道路或天门山盘山路混入公共自驾路线",
          ],
        },
      ],
    },
  ],
  [
    "贵州/贵阳",
    {
      status: "reviewed",
      candidates: [
        {
          title: "贵州8条最美绝美公路",
          author: "洒脱的小乔爱旅行",
          url: "https://www.xiaohongshu.com/explore/6a20be45000000002103c57a",
          accessedAt: "2026-08-20",
          decision: "province-road-list-needs-segment-mapping",
          evidence: [
            "晴隆二十四道拐与麻江三十六道拐",
            "贵黔高速、沪昆高速贵阳至安顺段和镇胜高速",
            "汕昆高速马岭河大桥",
            "赤水河谷旅游公路与桐梓七十二道拐",
            "帖子为省级道路清单，尚不能证明单条连续路线",
          ],
        },
      ],
    },
  ],
  [
    "云南/昆明",
    {
      status: "reviewed",
      candidates: [
        {
          title: "周末自驾环滇池一圈路线",
          author: "啊迪",
          url: "https://www.xiaohongshu.com/explore/690f65e10000000007017a66",
          accessedAt: "2026-08-20",
          decision: "needs-ring-route-waypoint-mapping",
          evidence: [
            "西二环出发并返回、全程将近140公里",
            "走走停停约5小时，海口特大桥为重点风景段",
            "海洪、捞鱼河、海晏村、南滇池湿地公园、海口川字闸和观音山线索",
            "湿地公园需停车后步行到湖边，不得把园内空间标成驾车道路",
            "评论明确提示不要路边停车，停车费和时长均为个人当次体验",
          ],
        },
        {
          title: "一条自驾玩西山不多花一分钱的不回头路线",
          author: "捱夏",
          url: "https://www.xiaohongshu.com/explore/6997da700000000016008db4",
          accessedAt: "2026-08-20",
          decision: "mixed-mode-not-pure-drive-route",
          evidence: [
            "停车后以滇池索道进入西山景区",
            "下山后改乘景区大巴、公交接驳并骑共享单车返回停车场",
            "帖子不能证明海埂至西山为连续纯驾车路线",
          ],
        },
      ],
    },
  ],
  [
    "云南/丽江",
    {
      status: "published",
      candidates: [
        {
          title: "Day2 丽江：玉龙雪山一日自驾攻略🚐",
          author: "Ethenmaster.",
          url: "https://www.xiaohongshu.com/explore/6978ed36000000000e03e0e4",
          accessedAt: "2026-08-20",
          decision: "published-to-yn-lj-old-town-yulong-altitude",
          evidence: [
            "6时30分由丽江古城驾车至玉龙雪山南门检票口",
            "自驾车辆只能停游客中心，内部景点统一换乘景区大巴",
            "返程由雪川游客港转场束河古镇，作者称道路开阔且风景佳",
            "3号停车场较近、4号停车场有充电桩，但早到和车位说法须当日核验",
            "评论称景区入口道路为铺装路，积雪、天气和管制仍须官方核验",
          ],
        },
      ],
    },
  ],
  [
    "西藏/林芝",
    {
      status: "reviewed",
      candidates: [
        {
          title: "318精华段｜林芝→波密自驾攻略✨",
          author: "城市水色1111",
          url: "https://www.xiaohongshu.com/explore/6a71e2f6000000002701f0c4",
          accessedAt: "2026-08-20",
          decision: "needs-bomi-endpoint-and-current-road-verification",
          evidence: [
            "林芝—色季拉山口—鲁朗小镇—鲁朗林海—通麦—帕隆藏布江—波密顺序",
            "正文称全程200多公里并以G318为连续驾车主线",
            "雪山、林海、峡谷和沿江景观构成道路本身的拍摄价值",
            "轿车通行和新手友好属于作者当次体验，不作为当前路况保证",
            "高海拔、落石、雨雪、施工、交通管制和安全停车点须逐日核验",
          ],
        },
      ],
    },
  ],
  [
    "甘肃/酒泉",
    {
      status: "reviewed",
      candidates: [
        {
          title: "相比于嘉峪关，还是s215上的风景更吸引我",
          author: "Hunk",
          url: "https://www.xiaohongshu.com/explore/6a295517000000001603f9d4",
          accessedAt: "2026-08-20",
          decision: "partial-out-and-back-needs-road-surface-verification",
          evidence: [
            "玉门东镇进入S215后沿祁连山方向行驶",
            "作者实走约一小时至吊达坂沟后原路折返",
            "沿线自然保护区、雪山与荒野景观线索",
            "评论明确该路不能作为张掖至瓜州的顺路通道",
            "评论出现非铺装小路与相对好走的大路分歧，必须锁定正确道路并核验路面",
          ],
        },
      ],
    },
  ],
  [
    "福建/宁德",
    {
      status: "reviewed",
      candidates: [
        {
          title: "霞浦必自驾｜东海1号最美沿海公路✨",
          author: "猫猫杂货铺~L",
          url: "https://www.xiaohongshu.com/explore/6a704f3f0000000028007d35",
          accessedAt: "2026-08-20",
          decision: "needs-catalog-endpoints-and-tide-safety-mapping",
          evidence: [
            "海尾角—丹湾观景台—大京沙滩—下尾岛—闾峡灯塔连续点位",
            "正文明确以东海1号滨海观光道为驾车主线",
            "海湾、悬崖、沙滩、海蚀地貌和灯塔日落构成沿路景观",
            "下尾岛海蚀洞仅退潮可进入，不能作为车辆通行点",
            "台风、潮汐、停车、临崖路段和景点开放须当天核验",
          ],
        },
        {
          title: "霞浦东海一号公路自驾七站深度攻略全指南版",
          author: "羊空间民宿（霞浦三沙东壁小皓沙滩）",
          url: "https://www.xiaohongshu.com/explore/69319c1b000000000d03e834",
          accessedAt: "2026-08-20",
          decision:
            "needs-return-direction-tide-parking-and-vehicle-class-verification",
          evidence: [
            "正文给出霞浦县城—高罗沙滩—积石沙滩—海尾角—大京沙滩—丹湾观景台—下尾岛—闾峡灯塔的连续七站顺序",
            "作者在评论中建议抵达闾峡灯塔后原路返回，因此正文所谓环海公路不能直接理解为已验证的闭合环线",
            "下尾岛海蚀洞仅退潮时可进入，属于下车步行且有潮汐风险的内容，不计入纯驾车路段",
            "评论中的大几十公里、一天或三天两晚等表述不一致，不能作为精确里程和用时数据",
            "作者声称重卡房车可通行及沿线有房车基地，但未给出限高、限宽或基地位置，须独立核验；停车点也未明确",
          ],
        },
      ],
    },
  ],
  [
    "青海/海南州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "反向旅游，3天过4季🌊青海新环线保姆级攻略",
          author: "柳和风",
          url: "https://www.xiaohongshu.com/explore/6a6f761e000000002800a56f",
          accessedAt: "2026-08-20",
          decision: "needs-multi-division-segment-and-road-mapping",
          evidence: [
            "西宁—青海湖断崖—东格尔观景台—黑马河—茶卡盐湖连续顺序",
            "茶卡—橡皮山—恰江公路—龙羊峡—千姿湖—贵德丹霞—坎布拉—西宁闭合环线",
            "作者按三日执行并称每日驾车约2至3小时，该时长仅作个人体验线索",
            "路线跨海南州、海西、黄南和西宁，正式发布前必须拆段映射道路与行政区",
          ],
        },
        {
          title: "青海湖环湖问题大赏",
          author: "毛三教掌教大人",
          url: "https://www.xiaohongshu.com/explore/6a782a03000000000502b99e",
          accessedAt: "2026-08-20",
          decision: "supporting-parking-safety-comments-only",
          evidence: [
            "评论推荐同宝山、黑马河、青海湖断崖和东格尔观景台等观景线索",
            "评论提醒南岸二郎剑至黑马河部分路段不可随意停车",
            "应只使用港湾式停车带或现场允许的合法停车区，不采纳随便停车建议",
            "该帖正文为求助而非实走路书，只能作为停车与风险补充证据",
          ],
        },
      ],
    },
  ],
  [
    "内蒙古/赤峰",
    {
      status: "reviewed",
      candidates: [
        {
          title: "沈阳打工人｜周末电车勇闯热阿线达达线✨",
          author: "荔枝甜甜饼",
          url: "https://www.xiaohongshu.com/explore/6a734b410000000022015cdc",
          accessedAt: "2026-08-20",
          decision: "needs-seasonal-access-and-parking-verification",
          evidence: [
            "赤峰—热水塘镇—很黑村—黄岗梁观景台—阿斯哈图石林西门",
            "由热阿线接音乐公路和达达线后前往克什克腾旗",
            "帖子记录热水塘、阿斯哈图西门和克什克腾旗的电车补能线索",
            "草原部分区域信号弱，作者建议下载离线地图并准备现金",
            "路况良好、免费驻车、充电价格和路边停车均属个人当次体验，须当天核验",
          ],
        },
      ],
    },
  ],
  [
    "吉林/延边",
    {
      status: "reviewed",
      candidates: [
        {
          title: "第二篇｜吉线G331自驾🚗难忘的旅程",
          author: "herr s",
          url: "https://www.xiaohongshu.com/explore/6a4da3fe000000002003b267",
          accessedAt: "2026-08-20",
          decision: "needs-mainline-and-mountain-spur-split",
          evidence: [
            "延吉—图们—三合镇—望江阁—南坪镇—崇善军舰山—二道白河顺序",
            "正文记录约420公里、9至10小时的当次实走体验",
            "图们江沿线与长白山林区形成连续G331风景段",
            "评论确认可反向执行并有沿线服务区，但山区信号可能中断",
            "军舰山支线路陡，驾驶经验不足者可跳过；沿线有野生动物横穿风险",
          ],
        },
        {
          title: "长白山+吉林331自驾路线看这一篇就够了",
          author: "新新拾光记",
          url: "https://www.xiaohongshu.com/explore/68d9224a000000000e024540",
          accessedAt: "2026-08-20",
          decision: "supporting-season-and-night-driving-comments-only",
          evidence: [
            "视频正文未显示完整连续途经点，不单独用于生成正式路线",
            "作者在评论中建议G331尽量避免夜间驾驶",
            "评论确认东光村至三合镇并非全程属于G331，应避免错误道路归属",
            "秋色时段和人流描述均为个人当次体验",
          ],
        },
      ],
    },
  ],
  [
    "黑龙江/伊春",
    {
      status: "reviewed",
      candidates: [
        {
          title: "夏季小兴安岭7天自驾全攻略｜解答出行误区",
          author: "向阳的小竹",
          url: "https://www.xiaohongshu.com/explore/6a5cd012000000001d00cd7e",
          accessedAt: "2026-08-20",
          decision: "needs-paved-mainline-and-dirt-section-split",
          evidence: [
            "哈尔滨—伊春—汤旺河—嘉荫—茅兰沟—伊春—鹤岗—佳木斯顺序",
            "汤旺河—嘉荫串联松江源湿地、223界碑与黑龙江江岸",
            "嘉荫—茅兰沟以G331沿江景观和原始森林为核心风景段",
            "评论确认嘉荫至茅兰沟存在颠簸、扬尘且影响视线的纯土路段",
            "哈尔滨至伊春作者实际选择鹤哈高速，乌带公路或桃南公路不能由该帖直接证明",
          ],
        },
      ],
    },
  ],
  [
    "安徽/宣城",
    {
      status: "reviewed",
      candidates: [
        {
          title: "皖南川藏线直观攻略，去皖南看这一篇就够了",
          author: "一颗菜菜籽",
          url: "https://www.xiaohongshu.com/explore/6a7043910000000025007ab8",
          accessedAt: "2026-08-20",
          decision: "needs-image-waypoints-and-narrow-road-verification",
          evidence: [
            "作者实走两天一晚东进西出并在板桥村住宿",
            "建议逐个景点分段导航，避免连续导航错过入口",
            "正文串联红杉林、板桥村、六道湾与月亮湾等核心节点",
            "评论确认六道湾道路较窄、会车困难，假期停车和拥堵问题明显",
            "评论质疑月亮湾经宋村至水墨汀溪的窄路，不应在未核验前作为默认连接",
          ],
        },
      ],
    },
  ],
  [
    "江西/九江",
    {
      status: "reviewed",
      candidates: [
        {
          title: "这是鄱阳湖永吴水上公路每日实时贴",
          author: "juices",
          url: "https://www.xiaohongshu.com/explore/6a47daef000000000f0166b3",
          accessedAt: "2026-08-20",
          decision: "safety-source-do-not-recommend-flooded-driving",
          evidence: [
            "帖子持续记录永吴公路水位变化，证明景观高度依赖汛期和实时水位",
            "作者明确提醒水漫路面属于洪水场景而非稳定的娱乐驾驶条件",
            "车辆可能进水抛锚，急流还会带来蛇虫、垃圾及血吸虫暴露风险",
            "评论显示水位可在数日内由未漫路变化至与路面齐平，历史实况不能代替当天管制",
            "平台只能推荐未封闭、未积水且官方允许通行的正常路面；不得引导压水或涉水驾驶",
          ],
        },
        {
          title: "庐山西海自驾游（不上岛版）",
          author: "金陵阔少奔奔",
          url: "https://www.xiaohongshu.com/explore/6a2819af0000000036002310",
          accessedAt: "2026-08-20",
          decision:
            "needs-segment-mapping-access-parking-and-highway-viewpoint-verification",
          evidence: [
            "去程为九江—福银高速—永武高速—焦武线—S305—永宁，串联将军峡吴王谷、司马码头和武宁县城",
            "回程为武宁—永武高速—沃森House—只此青绿观景台—西海服务区—九江，形成不上岛的两日候选线",
            "思无邪所在区域当时不允许非住客车辆驶入，作者改停村民家；这不是稳定或官方停车方案，正式路线应排除或使用明确公共停车场",
            "只此青绿观景台位于高速沿线，必须核对其是否属于可合法驶入的服务区或停车设施，严禁把高速路肩描述为观景停车点",
            "吴王谷、沃森营地的收费与宠物政策均为个人体验，且徒步溯溪不计入纯驾车路段；帖子未提供总里程和各段路况",
          ],
        },
      ],
    },
  ],
  [
    "山东/威海",
    {
      status: "reviewed",
      candidates: [
        {
          title: "威海自驾｜山海自驾公路干货",
          author: "瓜子不甜",
          url: "https://www.xiaohongshu.com/explore/6a6cdecc0000000025005ac4",
          accessedAt: "2026-08-20",
          decision: "needs-road-boundary-and-parking-verification",
          evidence: [
            "作者给出北向南的环海顺序：半月湾—环海路—猫头山第三观景台—恐龙湾—那香海，并建议折返小石岛看日落",
            "正文称当次体验为全程柏油路，猫头山一带存在临海窄路和连续弯道",
            "部分观景点停车位有限，只能使用专用停车区，禁止在弯道或窄路随意停车拍照",
            "进入环海段前应补充燃油和物资；沿途商业设施较少",
            "约60公里及手机信号稳定均为作者个人当次体验，需用当前道路和导航数据复核",
          ],
        },
      ],
    },
  ],
  [
    "河北/秦皇岛",
    {
      status: "reviewed",
      candidates: [
        {
          title: "北戴河｜最美环海公路",
          author: "Amy视觉",
          url: "https://www.xiaohongshu.com/explore/6a64c7e5000000001303cd3b",
          accessedAt: "2026-08-20",
          decision:
            "needs-motor-vehicle-access-and-route-boundary-verification",
          evidence: [
            "正文导航点为老虎石海上公园中海滩，并描述从老虎石公园出口右转约200米后沿海岸线前行",
            "帖子语境主要是步行、骑行和拍照，不能据此直接生成纯驾车路线",
            "评论集中询问骑行导航和电动车租赁，作者确认自己租用电动车",
            "评论对暑期车辆数量和通行情况提出疑问，作者仅表示预计人多，未给出可靠机动车通行结论",
            "必须另行核验机动车允许路段、单行方向、停车区和旺季临时管制后才能关联正式路线",
          ],
        },
      ],
    },
  ],
  [
    "山东/烟台",
    {
      status: "reviewed",
      candidates: [
        {
          title: "烟台滨海路真的，开车是享受",
          author: "葡萄老爹",
          url: "https://www.xiaohongshu.com/explore/6a473569000000000702e6f3",
          accessedAt: "2026-08-20",
          decision: "needs-east-west-segment-waypoint-mapping",
          evidence: [
            "作者明确为自驾实走，并将烟台滨海路拆分为东段和西段",
            "东段紧贴核心城区和海岸，正文提及渔人码头、烟台山及多个海水浴场",
            "西段以约十公里沙滩和开阔海景为主要景观，视频为作者驾车拍摄",
            "两段合计约40公里是作者估算，不能作为平台精确里程",
            "帖子没有给出东西段衔接点和完整连续导航顺序，需补充道路节点后才能关联现有蓬莱—养马岛长途路线",
          ],
        },
      ],
    },
  ],
  [
    "辽宁/丹东",
    {
      status: "reviewed",
      candidates: [
        {
          title: "G331丹东→集安自驾｜醉美山河，景色如画",
          author: "甜蜜糖",
          url: "https://www.xiaohongshu.com/explore/6a3e2ea4000000001102db32",
          accessedAt: "2026-08-20",
          decision:
            "needs-cross-province-segment-and-current-road-verification",
          evidence: [
            "作者给出鸭绿江断桥—虎山长城—音乐公路—上河口国门—绿江村小天池—浑江口观景台—浑江大转弯—集安的连续顺序",
            "丹东至集安方向大部分靠鸭绿江，反向车道更多贴山；反向观景应停靠正规观景台",
            "前往绿江村和浑江口需走泡浑线X615，九曲盘山且弯多，新手应改走较平稳的省道线或放弃支线",
            "作者带老人儿童边走边玩用时近10小时，不能把导航纯驾驶时长当作完整游览时长",
            "浑江大转弯至高速入口一段作者认为路况较差且景观有限；帖子未证明当前施工、边检和季节性通行状态",
          ],
        },
      ],
    },
  ],
  [
    "山东/日照",
    {
      status: "reviewed",
      candidates: [
        {
          title: "答应我！来日照一定要走这条海边公路 yyds",
          author: "四季旅行",
          url: "https://www.xiaohongshu.com/explore/69bf9019000000001a022794",
          accessedAt: "2026-08-20",
          decision: "parking-anchored-mixed-mode-needs-driving-segment-mapping",
          evidence: [
            "正文给出阳光海岸6号停车场和大泉沟渔港停车场两个驾车锚点，并指向碧海路沿海公路",
            "作者在评论中建议住森林公园附近时由北向南沿海行驶，但未给出可复现的完整机动车途经点",
            "万平口1号门至森林公园约20公里的描述针对骑行，不能作为纯驾车路线里程",
            "阳光海岸6号停车场容量较小，停满后应改用北侧大泉沟渔港停车场，不得沿路违停",
            "日出时间和天气为动态条件，平台只能保留观景建议，不能承诺一定看到日出",
          ],
        },
      ],
    },
  ],
  [
    "山东/东营",
    {
      status: "reviewed",
      candidates: [
        {
          title: "你有坝上草原，我有坝上公路！",
          author: "东营文旅",
          url: "https://www.xiaohongshu.com/explore/6a7d7406000000002402d9a1",
          accessedAt: "2026-08-20",
          decision: "needs-exact-road-numbers-and-legal-stopping-points",
          evidence: [
            "东营文旅明确推荐从龙居自驾，经黄河口镇前往黄河入海口",
            "沿线主要景观为黄河河风、湿地和坝上公路，属于以道路景观为核心的驾驶候选",
            "评论有近期实走反馈，确认道路景观良好但不能随意停车",
            "正文没有道路编号、关键转向点和合法停车观景点，不能仅凭起终点发布正式路线",
            "进入黄河口生态区域前仍需核验预约、景区车辆通行和季节性保护管制",
          ],
        },
      ],
    },
  ],
  [
    "江苏/连云港",
    {
      status: "reviewed",
      candidates: [
        {
          title: "连云港🌊最难戒断的连岛自驾2小时",
          author: "团子",
          url: "https://www.xiaohongshu.com/explore/69fbbcc40000000035021149",
          accessedAt: "2026-08-20",
          decision:
            "needs-current-one-way-control-and-legal-parking-verification",
          evidence: [
            "帖子明确为西连岛纯驾车路线，并按庙后湾路1号—连岛来信或听风海集—老障头—堤头灯塔给出顺序",
            "节假日西连岛可能实行逆时针单向交通组织，发布前必须核验当天管制方向",
            "老障头和堤头灯塔有停车场；作者所称路边随停不能作为平台停车指引",
            "评论确认道路本身较窄，节假日车辆路边停放会造成拥堵，应优先使用明确停车区",
            "东连岛收费景区与西连岛免费自驾段必须分开，黑狗洞等礁石点还受潮汐和防滑安全限制",
          ],
        },
      ],
    },
  ],
  [
    "江苏/盐城",
    {
      status: "reviewed",
      candidates: [
        {
          title: "三天两晚～盐城黄海一号公路自驾超全攻略",
          author: "水韵江苏",
          url: "https://www.xiaohongshu.com/explore/68eddbdb000000000300e06e",
          accessedAt: "2026-08-20",
          decision: "needs-road-map-and-protected-area-access-verification",
          evidence: [
            "帖子以黄海1号公路为主线，给出泊心黄沙港—丹顶鹤湿地生态旅游区的第一日分段",
            "第二日串联日出海湾—中华麋鹿园—野鹿荡，第三日串联黄海森林公园—条子泥—巴斗渔乡",
            "湿地、水杉和滩涂颜色具有明确季节窗口，宣传图片不能作为全年实景承诺",
            "评论多次询问具体道路和自驾地图，正文没有足够道路编号与转向点，不能据此直接发布连续导航线",
            "丹顶鹤、麋鹿及条子泥属于生态敏感区域，需核验预约、开放时间、车辆边界和临时保护管制",
          ],
        },
      ],
    },
  ],
  [
    "浙江/台州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "台州一号公路玉环段最详攻略",
          author: "D a",
          url: "https://www.xiaohongshu.com/explore/6a5b30a7000000000903590f",
          accessedAt: "2026-08-20",
          decision: "needs-current-one-way-and-parking-verification",
          evidence: [
            "正文给出环海村—柒墨咖啡馆—龙湾灯塔（大岩头）—鲜迭沙滩—鲜岭村—牛头颈的连续顺序",
            "龙脊线精华段为鲜岭村至牛头颈单行线，不能反向规划",
            "评论确认抵达牛头颈后继续向前即可沿环线返回，不需要逆行折返",
            "作者当次实走称环海村至牛头颈纯驾驶约30分钟，但游览、徒步和停车时间应另计",
            "龙湾村党群服务中心停车场等停车信息需核验当前开放规则，周末不拥堵的个人体验不能推广到所有暑期日期",
          ],
        },
      ],
    },
  ],
  [
    "浙江/温州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "温州苍南168自驾路线攻略",
          author: "我见青山",
          url: "https://www.xiaohongshu.com/explore/6a633920000000001c0127d2",
          accessedAt: "2026-08-20",
          decision:
            "needs-visible-map-waypoints-and-current-closure-verification",
          evidence: [
            "评论将月亮湾沙滩或霞关至168环海驿站识别为主要海岸精华段",
            "评论补充罗家山村可作为无尽蓝附近的候选途经点，但正文可访问文本未显示完整路线图节点",
            "正反方向均有人实走，反向时副驾一侧更接近海岸，但不能仅凭评论确定默认方向",
            "近期评论报告两处道路被临时封堵并需要折返绕行，发布前必须检查当天通行状态",
            "百余公里和充电桩信息均缺乏可核验的精确位置，不应写成保证性里程或补能承诺",
          ],
        },
      ],
    },
  ],
  [
    "福建/福州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "亲测自驾平潭岛，保姆级攻略来啦",
          author: "做自己的太阳",
          url: "https://www.xiaohongshu.com/explore/6a4b83970000000022014f1a",
          accessedAt: "2026-08-20",
          decision:
            "needs-current-closure-direction-and-legal-parking-verification",
          evidence: [
            "北线不应直接导航F2观景台，作者称上山入口已封，改以北部湾生态廊道F1停车场为入口",
            "北线继续串联长江澳风车田沙滩停车场和镜沙，南线串联红岩海滨山庄—68海里机位—70海里火车海岸公园—犯船礁",
            "评论称暑期车辆极多，并有北部生态廊道误入狭窄上山路、会车困难的反馈",
            "停车收费、免费停车及过夜驻车均为作者当次体验，不能作为当前官方许可或价格保证",
            "作者明确提醒单独女性不宜车内过夜；平台不得把两岸法治文化园写成安全露营地",
          ],
        },
      ],
    },
  ],
  [
    "福建/泉州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "🚗泉州自驾｜祥芝湾×小威海，一天玩转“双海景",
          author: "闽南自驾小明",
          url: "https://www.xiaohongshu.com/explore/69d79111000000002301d071",
          accessedAt: "2026-08-20",
          decision: "needs-legal-parking-and-waypoint-road-verification",
          evidence: [
            "路线为泉州市区—沿海大通道—小威海（东大垵）—G228北行—祥芝湾—海边灯塔—返程",
            "正文补充祥芝渔港、小威海斜坡、东大垵海岸线等观景节点，两个主要区域均在祥芝镇",
            "作者称路况适合新手属于主观体验，需核对当前道路等级、限速和施工",
            "作者所称路边免费停车、看到风景随时靠边停不能作为合法停车指引，应只推荐明确停车区",
            "帖子评论区缺少有效路况或停车复核，不能据此直接发布正式路线",
          ],
        },
      ],
    },
  ],
  [
    "福建/漳州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "东山岛很美，坑很大",
          author: "潮汕叮咚鸡",
          url: "https://www.xiaohongshu.com/explore/6a4e1130000000001c025a2b",
          accessedAt: "2026-08-20",
          decision: "needs-current-one-way-signage-and-navigation-verification",
          evidence: [
            "作者从南门湾景区停车场驶出后在路口左转，进入已由双向改为单向的道路并被记录",
            "多名评论者报告在同一路段误入单行道，其中有人称即使跟随导航仍被处罚",
            "评论补充该路段改为单行已久，平台不得沿用旧的双向通行经验",
            "夜间禁行标志可见性及摊位灯光遮挡属于用户现场描述，仍需以当前标志、标线和交管公告为准",
            "南门湾评论同时反映车多人多；发布东山岛驾车线前须明确停车场出口后的合法行驶方向，不能只给景点顺序",
          ],
        },
      ],
    },
  ],
  [
    "广东/揭阳",
    {
      status: "reviewed",
      candidates: [
        {
          title: "广东野沙滩最多的海岸线（完整攻略）",
          author: "周华旅行",
          url: "https://www.xiaohongshu.com/explore/6a3931e20000000022015521",
          accessedAt: "2026-08-20",
          decision:
            "needs-exact-waypoints-road-surface-and-legal-use-verification",
          evidence: [
            "正文实际定位为揭阳惠来白点埔，而非搜索语境中的潮州饶平，应按真实行政区归入揭阳",
            "候选道路为贴近海岸和风电设施的硬化路，作者称普通轿车可达，但同时提示部分临崖路段狭窄、雨天湿滑",
            "正文只给出白点埔单点导航，缺少连续道路名称和出入口；评论已有找不到路、质疑是否水泥路及轮胎风险的反馈",
            "作者所称随时靠边停车不能作为合法停车指引，正式路线只能使用明确停车区或允许停车的位置",
            "野滩无人管理不等于获准露营、烧烤或过夜，且现场无安保、水电和卫生间，平台不得把这些活动写成许可承诺",
          ],
        },
      ],
    },
  ],
  [
    "福建/龙岩",
    {
      status: "reviewed",
      candidates: [
        {
          title: "纯个人向福建土楼自驾攻略",
          author: "蓝色的小红",
          url: "https://www.xiaohongshu.com/explore/6a53c58a000000001101ed33",
          accessedAt: "2026-08-20",
          decision:
            "needs-map-waypoints-jurisdiction-and-legal-parking-verification",
          evidence: [
            "作者按图示顺序从云水谣附近出发，经梅林古镇、顺裕楼、土楼王景区、衍香楼至田螺坑，形成跨南靖与永定片区的候选串联线",
            "正文提及顺裕楼至河坑土楼的延伸以及土楼王至衍香楼沿途多个土楼，但可访问文本没有道路编号和图中坐标",
            "作者评价山路稍绕但景区附近道路整修过、个人体验为较好驾驶；这不能替代当前施工、限行和车型条件核验",
            "评论明确称多个村庄没有停车场且不太好停车，正式路线不得默认车辆可驶入村内或沿路停放",
            "门票、开放区域和免费观景点属于当次体验且可能变化；驾车线需将龙岩与漳州管辖段分别校验后再发布",
          ],
        },
      ],
    },
  ],
  [
    "广东/潮州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "跟着GPT玩潮州：闯入凤凰镇云端茶山🍵",
          author: "西提Xiti",
          url: "https://www.xiaohongshu.com/explore/6a83e1c000000000330358fa",
          accessedAt: "2026-08-20",
          decision:
            "insufficient-independent-route-and-road-condition-evidence",
          evidence: [
            "正文给出潮州市区至凤凰镇、乌岽村茶山的候选方向，并称包车约1.5小时抵达，但没有连续导航点或道路编号",
            "作者未前往山顶天池，平台不能据此把凤凰天池并入同一条已实走驾车路线",
            "正文提醒山路弯道多、大雾天气慎上山，且建议由有山路经验的驾驶者驾驶",
            "茶园木栈道、古茶树和观景台属于下车步行内容，不应计入纯驾车路段",
            "帖子路线源于作者向GPT提问后的包车体验，评论区没有有效路况复核，必须通过独立来源核对道路、停车和通行规则后才能发布",
          ],
        },
      ],
    },
  ],
  [
    "福建/三明",
    {
      status: "reviewed",
      candidates: [
        {
          title: "自驾三明市泰宁县注意事项",
          author: "油条的旅行计划",
          url: "https://www.xiaohongshu.com/explore/68b89b3a000000001d039c9f",
          accessedAt: "2026-08-20",
          decision:
            "conflicting-road-and-parking-claims-require-independent-verification",
          evidence: [
            "正文提供泰宁古城至大金湖、寨下大峡谷的候选自驾方向，并提醒山区信号弱、雨天谨慎驾驶",
            "正文称前往大金湖与寨下大峡谷部分路段弯急，但当地评论明确反驳大金湖段为平坦宽路且没有急弯，不能合并成统一路况结论",
            "正文与评论对大金湖停车日费分别给出15元和10元，价格冲突且会变化，平台不得发布保证性收费信息",
            "建议停周边小巷不等于合法停车指引，正式路线只能推荐明确停车场或允许停车的位置",
            "大金湖游船、峡谷徒步与漂流属于景区体验，不是纯驾车路线；帖子也未提供道路编号和连续公路节点",
          ],
        },
      ],
    },
  ],
  [
    "福建/莆田",
    {
      status: "reviewed",
      candidates: [
        {
          title: "湄洲岛｜租电动车(剁椒鱼头)环岛自驾路线",
          author: "遍地锦的鹭像厅",
          url: "https://www.xiaohongshu.com/explore/6a660788000000000100cd12",
          accessedAt: "2026-08-20",
          decision:
            "island-rental-ev-route-not-private-car-needs-current-access-and-parking-verification",
          evidence: [
            "环岛顺序为码头—湄屿潮音—彩虹路—天后宫—莲池澳沙滩—鹅尾沙滩—黄金沙滩—码头",
            "作者驾驶的是岛内租用的五菱EV微型电动车，评论明确游客自带汽车不能进岛，因此不能归类为普通私家车可执行路线",
            "正文称除彩虹路外各站有停车场，但彩虹路仅描述路边停车，正式路线不能据此推荐临停",
            "作者及评论对环岛里程分别表述为三四十公里和四五十公里，需用实际道路数据确定里程",
            "黄金沙滩当时处于关闭装修状态，作者所称仍可进入不能作为当前开放许可；车辆租价、船票和停车费也会变化",
          ],
        },
      ],
    },
  ],
  [
    "福建/南平",
    {
      status: "reviewed",
      candidates: [
        {
          title: "武夷山一号风景道小环线自驾体验",
          author: "夏天要喝冰可乐",
          url: "https://www.xiaohongshu.com/explore/6a5e1514000000001302e65d",
          accessedAt: "2026-08-20",
          decision:
            "strong-pure-drive-candidate-needs-road-mapping-enforcement-and-fuel-verification",
          evidence: [
            "路线以武夷山国家公园南入口外为起终点，依次经过三才峰观景台、月亮湾、青龙大瀑布、桐木关、坳头村和黄坑蛇园",
            "作者给出约180公里并明确自己未进入景区、仅驾车看景，符合纯驾车候选特征",
            "路面整体评价较好但弯道多、部分路段较窄，沿线无加油站且充电桩少，须核验补能节点和当前施工管制",
            "作者更新称车辆越过道路中间三条线会被拍摄，评论也有人报告被拍，路线提示必须强调严格按标线行驶",
            "作者仅到桐木关后下行，未核实黄岗山通行；其短暂停靠经历也不能作为合法路边停车依据",
          ],
        },
      ],
    },
  ],
  [
    "江西/上饶",
    {
      status: "reviewed",
      candidates: [
        {
          title: "婺源免费古村一日路线自驾全攻略",
          author: "拉面",
          url: "https://www.xiaohongshu.com/explore/6969e4e8000000002200920a",
          accessedAt: "2026-08-20",
          decision:
            "strong-multi-village-candidate-needs-road-mapping-and-legal-parking-verification",
          evidence: [
            "连续顺序为月亮湾—上坦村—龙尾村—庆源古村—三眼桥—察关村—虹关村—凤山村—漳村，途中经过五龙湖、婺源一号公路和浙源驿站",
            "作者从早7点行驶至下午5点并认为一日九站过于紧张；评论有用户报告按该顺序复走全程，可作为可执行性的交叉线索",
            "庆源古村最后约三公里为狭窄单车道山路，评论再次确认该段很窄，须核验会车点、车型和天气条件",
            "月亮湾、龙尾村和漳村有明确停车场线索，但上坦、庆源、三眼桥、察关、虹关及凤山多为国道或村内路边停车描述，不能直接作为合法停车指引",
            "古村免费、停车免费及驿站补能均为当次体验，正式发布前需核对当前收费、开放和充电设施状态",
          ],
        },
      ],
    },
  ],
  [
    "江西/赣州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "冷门的赣南小城——龙南，人少景美",
          author: "陈桂林",
          url: "https://www.xiaohongshu.com/explore/6a78893d0000000027023a80",
          accessedAt: "2026-08-20",
          decision:
            "needs-continuous-road-mapping-mountain-section-and-parking-verification",
          evidence: [
            "两日候选顺序为深圳—杨村燕翼围—乌石围—龙南市区—阳明心谷—关西围—南武当山游客中心—返程",
            "燕翼围至乌石围仅数公里，但乌石围返回市区沿途山路多且较窄，帖子未给出道路编号和会车条件",
            "南武当山只可将游客中心作为驾车终点，之后的云梯、栈道和飞拉达均为景区内部体验，不计入纯驾车段",
            "正文给出燕翼围附近两个充电点及南武当游客中心停车场线索；评论所称周末停车无压力和新能源路边车位优惠仍需当前官方复核",
            "评论认为当地公共交通有限、自驾或租车更方便，但帖子缺少各景点停车场名称和连续导航道路，暂不能发布为正式公路线",
          ],
        },
      ],
    },
  ],
  [
    "江西/吉安",
    {
      status: "reviewed",
      candidates: [
        {
          title: "吉安武功山-开车第一视角纯享",
          author: "Sagittarius",
          url: "https://www.xiaohongshu.com/explore/68a6828f000000001b03266e",
          accessedAt: "2026-08-20",
          decision:
            "insufficient-exact-state-road-endpoints-and-safety-evidence",
          evidence: [
            "作者说明拍摄路段为走省道前往安福武功山方向、未走高速，符合纯驾车山景候选方向",
            "正文称山路多且路面不平整，作者主观认为不难开，但没有起终点、道路编号、里程、停车或补能信息",
            "评论只确认这是去往安福武功山方向的省道，尚不足以定位具体可复现的连续路段",
            "武功山跨吉安安福与萍乡芦溪周边，必须先区分行政区和进山方向，不能把不同入口的道路风险混为一条路线",
            "邻近萍乡方向帖子与评论报告S225测速、弯道压线抓拍和导航限速提示分歧；无论采用哪条线路都应以现场标志标线为准",
          ],
        },
      ],
    },
  ],
  [
    "江西/萍乡",
    {
      status: "reviewed",
      candidates: [
        {
          title: "2026年自驾武功山，导航好样的",
          author: "了不起的盖浇饭",
          url: "https://www.xiaohongshu.com/explore/6a0284240000000036031c6c",
          accessedAt: "2026-08-20",
          decision:
            "safety-source-needs-current-speed-limit-signage-and-route-verification",
          evidence: [
            "作者报告前往武功山途中在安源区中环中路上高塘段和芦溪县S225省道4公里200米处发生超速记录",
            "评论有其他驾驶者报告同一S225点位记录，也有人称按导航通行未违章，说明导航提示与现场认知存在分歧",
            "评论另提示沿线存在测速摄像头和弯道压线抓拍，平台必须要求驾驶者以现场标志、标线和限速牌为准，不能承诺导航提醒完整",
            "帖子只提供执法点位而未给出完整起终点和景观节点，因此可作为萍乡侧安全证据，不能单独生成正式风景路线",
            "安福、芦溪及不同武功山入口属于不同线路，应与吉安侧省道候选分开建模和核验",
          ],
        },
      ],
    },
  ],
  [
    "江西/宜春",
    {
      status: "reviewed",
      candidates: [
        {
          title: "长沙自驾✨宜春2天1夜｜明月山+羊狮慕",
          author: "『长安』执笔流年",
          url: "https://www.xiaohongshu.com/explore/6a71730e000000003501795f",
          accessedAt: "2026-08-20",
          decision:
            "access-boundary-source-not-a-pure-drive-mountain-connection",
          evidence: [
            "公路可用部分仅能确认长沙—宜春市区—温汤镇—明月山景区停车场，正文没有提供沿途道路编号或山景公路线",
            "车辆停在明月山景区停车场后，明月山与羊狮慕通过索道、高山小火车、观光车和步行栈道连接，不存在帖子所证实的两山纯驾车段",
            "羊狮慕凌云栈道、明月山青云栈道和星月洞均为步行内容，不能纳入纯驾车路线时长或里程",
            "作者经历台风闭园后延期，说明景区交通和开放高度依赖天气，须查询当天公告",
            "停车费、联票、索道和观光车价格均为当次体验且会变化；评论区没有补充公路路况或停车规则",
          ],
        },
      ],
    },
  ],
  [
    "江西/景德镇",
    {
      status: "reviewed",
      candidates: [
        {
          title: "自驾党狂喜！景德镇→婺源边宝藏路线🚘",
          author: "lookmliy",
          url: "https://www.xiaohongshu.com/explore/69d5df98000000001a022b09",
          accessedAt: "2026-08-20",
          decision:
            "strong-cross-division-candidate-needs-road-number-parking-and-season-verification",
          evidence: [
            "连续顺序为景德镇—瑶里古镇—瑶里至菊径盘山段—菊径村—车田村—清华镇—婺源收费站，作者给出约80公里",
            "瑶里至菊径约15公里被描述为S弯、小发卡与茶田景观段，但帖子未提供明确道路编号",
            "路线从景德镇跨入上饶婺源，正式发布时须按行政区拆段或明确跨城属性",
            "作者所称路好车少、50至70公里时速及充电桩均为个人体验，需核验当前限速、施工和补能状态",
            "作者多次建议宽路肩或路边停拍，不能作为合法停车指引；菊径、车田及清华镇需落实明确停车点",
            "油菜花和茶田景观具有季节性，且评论区没有有效交叉复核",
          ],
        },
      ],
    },
  ],
  [
    "江西/鹰潭",
    {
      status: "reviewed",
      candidates: [
        {
          title: "3小时速穿江西道教仙山——龙虎山",
          author: "今天的小吴同学",
          url: "https://www.xiaohongshu.com/explore/6a6f590c0000000028005e8a",
          accessedAt: "2026-08-20",
          decision: "access-boundary-source-not-a-pure-drive-route",
          evidence: [
            "正文的半日顺序为景区观光车到浴仙池—步行高空栈道—象鼻山东门—观光车到象鼻山南门—步行看悬棺表演及登观景台—观光车返回游客中心",
            "帖子明确推荐购买门票加观光车套票，景区内部移动依赖观光车而非游客自驾",
            "高空栈道约3公里、象鼻山和观景台均为步行内容，不能计入纯驾车路线的里程或时长",
            "评论中作者补充完整游玩还可能包含竹筏和古镇，进一步确认该内容属于景区游览组合而非连续风景公路",
            "帖子没有提供游客中心进场道路、停车场、道路编号或沿途景观公路证据，因此只作为龙虎山纯驾筛选的排除边界",
            "票价、观光车及表演时刻均可能调整，不能从本帖推导当前运营信息",
          ],
        },
      ],
    },
  ],
  [
    "江西/南昌",
    {
      status: "reviewed",
      candidates: [
        {
          title: "南昌梅岭龙泉寺小环线get✅",
          author: "芷伊",
          url: "https://www.xiaohongshu.com/explore/6a6ad5b2000000000a03b9b9",
          accessedAt: "2026-08-20",
          decision:
            "trail-access-boundary-needs-legal-parking-and-road-approach-verification",
          evidence: [
            "帖子所称龙泉寺小环线全程约6公里、耗时2.5至3小时并明确属于竹海森林徒步路线，不是车辆可连续通行的环线",
            "自驾信息只能确认导航至龙泉寺正门，帖子未提供进山道路编号、起点、里程、会车条件或连续山景公路节点",
            "作者最初称门口可停车，但在评论中说明只是靠路边停车且没有固定车位，不能作为合法停车推荐",
            "评论还确认线路没有卫生间，且作者称沿途垃圾较多，可作为入口配套不足的提示",
            "正式路线若采用梅岭方向，只能把龙泉寺作为待核验的驾车终点；6公里步道必须从纯驾时长和里程中剔除",
          ],
        },
      ],
    },
  ],
  [
    "江西/抚州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "江西抚州大觉山｜进山玩水，凉爽一夏🍃",
          author: "叽氧蒋",
          url: "https://www.xiaohongshu.com/explore/6a421b3b000000001101d168",
          accessedAt: "2026-08-20",
          decision: "access-boundary-source-not-a-pure-drive-mountain-route",
          evidence: [
            "正文明确将大觉山内部体验概括为索道、观光车、飞车和漂流，不能据此生成游客自驾的山内公路",
            "评论说明古镇处有观光车前往漂流点，上下山也依赖观光车，景区交通与普通车辆自驾边界清楚",
            "下索道后可乘飞车或景区动车；这些项目均不是用户车辆驾驶，不能计入纯驾路线里程或时长",
            "帖子没有提供抚州市区至资溪大觉山的道路编号、沿途景观节点、停车场名称或当前路况，最多只能确认景区入口为潜在驾车终点",
            "漂流年龄、开放时间、套票和项目安排均为当次体验且可能变化，正式发布前须查当天景区公告",
          ],
        },
      ],
    },
  ],
  [
    "江西/新余",
    {
      status: "reviewed",
      candidates: [
        {
          title: "新余仙女湖",
          author: "鸿雁高飞",
          url: "https://www.xiaohongshu.com/explore/6a51e205000000001702d066",
          accessedAt: "2026-08-20",
          decision: "insufficient-ring-road-evidence-scenic-area-access-only",
          evidence: [
            "帖子只能确认作者驾车到达仙女湖景区，游览内容为乘船、看猴子、秋千和旋转木马，未提供环湖驾车线路",
            "正文没有道路编号、连续起终点、里程、沿湖观景段、停车场名称或当前路况，不能据此生成仙女湖环湖纯驾路线",
            "景区岛屿与船上内容必须从纯驾路线时长和里程中排除，最多只能将景区入口作为待核验的驾车终点",
            "评论区为空，没有停车、道路通行或环湖路线的交叉证据",
            "后续须另查仙女湖大道及湖区周边可供社会车辆连续通行的道路，并核验是否真正临湖、是否存在封控与合法停车点",
          ],
        },
      ],
    },
  ],
  [
    "湖南/长沙",
    {
      status: "reviewed",
      candidates: [
        {
          title: "大围山自驾上山路况一镜到底",
          author: "唐影漫游记",
          url: "https://www.xiaohongshu.com/explore/69e9fd46000000001f030c03",
          accessedAt: "2026-08-20",
          decision:
            "strong-mountain-drive-candidate-needs-gate-road-number-and-current-access-verification",
          evidence: [
            "帖子视频以自驾上山路况为主题，评论明确社会车辆可经西门或南门上山，两线在转盘汇合后共用最后一段",
            "作者称南门道路较宽、树少且视野开阔，西门道路较小且弯道较多，可作为两种上山驾驶体验的候选差异",
            "评论确认车辆可一直开到山顶平台，之后前往七星岭最高峰约40分钟为徒步，徒步部分不能计入纯驾里程",
            "评论报告往年五一严重拥堵，杜鹃花季和节假日须核验预约、限流、临时交通组织及停车容量",
            "正文与评论没有给出西门、南门的道路编号、精确起点、里程和平台停车场名称，正式发布前仍需补齐地图级证据",
            "门票与免票说法属于用户当时经验，不能视为当前政策；平台应引导查询景区当天公告",
          ],
        },
      ],
    },
  ],
  [
    "湖南/株洲",
    {
      status: "reviewed",
      candidates: [
        {
          title: "湖南株洲炎陵神农谷自驾入园需要通行证",
          author: "阿薇旅行记录",
          url: "https://www.xiaohongshu.com/explore/6a8069a8000000002402e471",
          accessedAt: "2026-08-20",
          decision:
            "controlled-access-drive-candidate-needs-current-permit-route-and-closure-verification",
          evidence: [
            "作者报告周末自驾进入炎陵神农谷，说明特定条件下社会车辆可进入景区道路",
            "帖子明确自驾入园需要通行证，并称凭门票和身份证在售票口旁柜台办理，通行许可属于路线成立的关键条件",
            "正文没有提供通行证适用时段、车辆限额、景区内允许行驶的终点、道路编号、里程或停车点，不能据此承诺所有日期均可自驾",
            "页面搜索提示包含景区封闭信息需求，山区通行可能受天气、施工和临时管制影响，出发前必须查询景区当天公告",
            "住宿、门票价格和广东优惠截止日期均为当次用户信息且变化快，不纳入稳定路线属性",
            "评论没有补充道路宽度、会车、补能或落石风险，正式发布前仍需补齐连续路线及安全证据",
          ],
        },
      ],
    },
  ],
  [
    "湖南/岳阳",
    {
      status: "reviewed",
      candidates: [
        {
          title: "幕阜山环线拿下！你们还是嘴太严了",
          author: "栩沫",
          url: "https://www.xiaohongshu.com/explore/6a81c5ff00000000330114dc",
          accessedAt: "2026-08-20",
          decision:
            "trail-access-boundary-not-a-seventeen-kilometer-drive-loop",
          evidence: [
            "作者给出的到达方式为从长沙导航上邓家，抵达岳阳平江南江镇幕阜山，只能作为景区入口方向线索",
            "所谓17公里多环线明确包含1100多米爬升、6至7小时完成时间以及陡峭野路，属于徒步而非驾车环线",
            "正文要求携带雨衣、护膝、登山杖、防滑鞋并描述大量楼梯和瀑布，进一步确认山内路线不供车辆连续通行",
            "帖子没有提供长沙至上邓家的道路编号、里程、道路宽度、停车场或补能信息，不能生成幕阜山纯驾路线",
            "正式候选若采用该方向，只能把合法停车入口作为驾车终点，并将17公里徒步全部从纯驾里程和时长剔除",
            "作者强调出发前看天气；山区入口道路仍需核验降雨、落石和临时封控公告",
          ],
        },
      ],
    },
  ],
  [
    "湖南/湘潭",
    {
      status: "reviewed",
      candidates: [
        {
          title: "韶山自驾避坑丨自驾预约系统把我坑惨了",
          author: "画灰会诲花",
          url: "https://www.xiaohongshu.com/explore/6a78715a000000003301b390",
          accessedAt: "2026-08-20",
          decision:
            "controlled-access-and-parking-source-needs-official-current-process-verification",
          evidence: [
            "作者报告私家车进入韶山景区需要在预约系统选择自驾并办理通行证，说明景区内部并非无条件公共道路通行",
            "帖子同时提醒纪念馆和故居另需预约，景点预约与车辆通行预约不能混为一项",
            "作者声称自驾预约与指定消费绑定，但评论对此存在明显分歧：有人称网上通行证入口属于商家自营，也有人称可不在指定地点消费",
            "由于评论互相矛盾，平台不能复述强制消费为确定规则，必须改为提示只通过可验证的官方渠道查询当前通行证流程",
            "评论提供停在景区外的替代方案和一次20元停车经历，但停车位置、价格与接驳方式均未被可靠确认",
            "该帖没有提供可连续复现的风景公路起终点、道路编号和里程，只作为韶山受控通行与停车风险证据，不生成纯驾路线",
          ],
        },
      ],
    },
  ],
  [
    "湖南/衡阳",
    {
      status: "reviewed",
      candidates: [
        {
          title: "来衡山一定要自驾这条山路！太治愈了",
          author: "李小生",
          url: "https://www.xiaohongshu.com/explore/69e0710d000000002003bf83",
          accessedAt: "2026-08-20",
          decision:
            "strong-public-mountain-road-candidate-needs-endpoints-parking-and-weather-verification",
          evidence: [
            "正文明确区分南岳衡山景区内私家车不能上山，并推荐从景区旁S333省道转Y050乡道的公共山路替代线",
            "作者将拍摄位置指向Y050并在评论中补充为往西岭方向转050乡道，为连续道路定位提供了可复现线索",
            "有经常通行者补充S333南岳至西岭段为两车道、路宽且路面较好，但存在突然出现的回头弯和较高制动负荷",
            "同一评论称Y050西岭至方广寺段乡道较窄，白天夜间都不宜快行，并报告见过车辆驶入沟内，平台必须突出降速、会车和刹车安全",
            "节假日S333人车较多；正文中的花景和雨后雾景均有季节与天气依赖，不能承诺全年同样景观或能见度",
            "帖子没有给出完整起终点、总里程、合法停车观景点和返程方案，正式发布前需补齐地图级线路并排除路边停车拍摄",
          ],
        },
      ],
    },
  ],
  [
    "湖南/邵阳",
    {
      status: "reviewed",
      candidates: [
        {
          title: "新宁别只冲崀山了！开车直达也能看最美日落",
          author: "是骏不是俊",
          url: "https://www.xiaohongshu.com/explore/6a6abc56000000000100f7dd",
          accessedAt: "2026-08-20",
          decision:
            "promising-sunset-drive-candidate-needs-road-identity-legal-parking-and-descent-verification",
          evidence: [
            "帖子给出导航目标新宁县金紫岭，并描述从山脚驾车约15分钟到第一处观景点、继续约30分钟到山顶民宿，形成两段可驾驶候选",
            "第一观景点以大石碑为识别物，可俯瞰新宁县城并观赏日落，但帖子没有停车场名称，仅称看到石碑即可停，不能视为合法停车指引",
            "作者提示山路弯道多、新手慢行并尽量白天下山，说明日落后返程的黑暗、弯道和能见度风险需要单独提示",
            "山顶民宿之后约40分钟到寺庙、再10分钟到顶峰均为徒步，必须从纯驾里程和时长中排除",
            "山上无补给，且帖子未提供道路编号、路宽、会车点、护栏、补能或雨雾状况，正式发布前须现场或地图级复核",
            "评论只补充步行方向靠红丝带辨认，不能作为车辆导航或道路安全证据",
          ],
        },
      ],
    },
  ],
  [
    "湖南/郴州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "都说仰天湖好看，也没人说路这么难开啊",
          author: "早起好累",
          url: "https://www.xiaohongshu.com/explore/6a7df15a000000002500e947",
          accessedAt: "2026-08-20",
          decision:
            "route-ambiguity-and-safety-source-separate-s212-from-x062-approach",
          evidence: [
            "作者报告导航带入连续约一小时的弯绕山路，并称存在烂路和极限弯，乘员出现严重晕车反应",
            "多名评论者补充急转弯、陡坡、大雾、夜间驾驶和山体贴近道路等风险，但这些均为个人体验，不能替代当前道路公告",
            "评论出现关键分歧：较好走的新线被指为S212省道郴仰大道彩虹路，而作者所走路线又被判断为经鲁塘镇接X062县道",
            "S212和X062不能作为同一路线混写；平台应要求按道路编号选择并分别核验起终点、里程、坡度、路宽和施工状态",
            "评论称S212从部分高速出口出发可能绕行较远，路线规划不能只按最短时间自动选线，更不能默认导航推荐即为安全线",
            "帖子没有可靠停车点或补能信息；雾天、夜间及载有易晕车乘员时应明确降级或避开高风险旧线",
          ],
        },
      ],
    },
  ],
  [
    "湖南/益阳",
    {
      status: "reviewed",
      candidates: [
        {
          title: "安化茶马古道周末亲子自驾游",
          author: "胡渲婕",
          url: "https://www.xiaohongshu.com/explore/6a6de3ad000000003400f099",
          accessedAt: "2026-08-20",
          decision:
            "mountain-access-and-congestion-source-needs-road-number-passing-and-legal-parking-verification",
          evidence: [
            "作者给出常德—安化—芒果山乡客栈—思悠谷—茶马古道主景区的两日自驾顺序，但没有道路编号和连续里程",
            "周末二刷思悠谷时遇到严重堵车，盘山公路弯道狭窄，一辆车会车受阻即导致整段瘫痪，说明道路通行容量和会车风险突出",
            "作者最终背装备徒步进入溪谷并步行较长山路返回停车处，停车位置与是否合法未说明，不能转成停车推荐",
            "茶马古道景区内部两条路线均为步道，探险线狭窄陡峭，网红桥等游玩内容不能计入纯驾路线",
            "评论称周六下午至周日上午人多，仅为个人体验；须核验节假日交通组织、错峰和临时封控",
            "正式发布前需确认通往思悠谷及景区入口的道路编号、双向会车点、合法停车场及雨后落石风险",
          ],
        },
      ],
    },
  ],
  [
    "湖南/常德",
    {
      status: "reviewed",
      candidates: [
        {
          title: "惊魂一小时！电车硬闯深山碎石路",
          author: "摇扇公主",
          url: "https://www.xiaohongshu.com/explore/69f9f3cb0000000035032d68",
          accessedAt: "2026-08-20",
          decision:
            "critical-navigation-risk-source-avoid-yunlu-village-unpaved-shortcut-needs-official-route-verification",
          evidence: [
            "作者从石门县壶瓶山镇出发，原计划接G241后前往渔洋关收费站进入呼北高速，却被导航在云麓村附近导入翻越九姊妹尖、悬坛垭至湖北五峰月山村的无名捷径",
            "转入约200米后即变为非铺装碎石机耕路，沿途仅单车宽、连续发卡弯并临崖，不能作为普通旅行公路推荐",
            "作者报告山区无手机信号且长距离没有安全掉头位置，误入后持续约一小时，电车用户还面临无法通信和补能救援的叠加风险",
            "帖子称从五峰一侧接近时道路已硬化为水泥路，说明两侧路况不一致，不能依据单侧铺装状况推断全线可通行",
            "评论补充导航算法可能临时改线，并有人报告周边其他道路塌方落石；后者地点未与该捷径完全对应，不能泛化为本线路实时路况",
            "平台应把云麓村无名非铺装捷径标为避让警示；正式路线只采用经核验的G241及高速连接线，并在出发前复核官方封控、塌方和施工信息",
          ],
        },
      ],
    },
  ],
  [
    "湖南/永州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "永州｜蓝山县→新田县『二广高速+S345省道』🚗",
          author: "甜宝爸爸Melon",
          url: "https://www.xiaohongshu.com/explore/6969a640000000000a02aa46",
          accessedAt: "2026-08-20",
          decision:
            "strong-s345-scenic-drive-candidate-needs-exact-junction-distance-and-roadside-stop-verification",
          evidence: [
            "正文给出蓝山县至新田县经二广高速转S345省道的连续自驾框架，并明确后半段为S345，路线身份较清晰",
            "作者称全程车流较少，S345部分路面接近高速标准；评论也形容道路宽、直、整洁平整，但均为个人当日体验",
            "靠近新田县甄子岭隧道的山体被列为沿途景观，作者另在评论中提到此行主要为继续走塔山方向道路，但未给完整终点",
            "新田城区餐馆路边有停车位，斜对面文体中心可停车并有充电站；这些只证明城区补给，不能外推为S345沿途补能",
            "帖子未给二广高速下口、转入S345的具体交叉口、全程里程和合法观景停车点，正式发布前需补齐地图级节点",
            "所谓车少和路况良好具有时效性，雨雾、施工及节假日状态仍需用当前道路信息复核",
          ],
        },
      ],
    },
  ],
  [
    "湖南/怀化",
    {
      status: "reviewed",
      candidates: [
        {
          title: "从绥宁出来到洪江走 085 县道",
          author: "炎佰",
          url: "https://www.xiaohongshu.com/explore/6a3d4ed3000000001102e9a2",
          accessedAt: "2026-08-20",
          decision:
            "promising-x085-s222-cultural-scenic-drive-needs-junction-width-parking-and-hazard-verification",
          evidence: [
            "正文明确给出从绥宁方向经X085县道转S222省道前往洪江的道路组合，可作为跨市进入怀化的连续线路骨架",
            "作者称道路依山而建，沿途可见苗侗寨吊脚楼，并将深渡苗族乡及洪江方向作为沿线人文景观",
            "帖子强调适合自驾和慢旅行，但没有提供全程里程、具体转向交叉口、道路宽度、铺装及会车条件",
            "评论仅由作者再次确认这是去洪江的县道，没有形成对当下路况和通行安全的独立佐证",
            "依山道路需补查雨后落石、临崖护栏、村镇行人及牲畜风险，不得因景观描述直接视为低难度路线",
            "正式发布前还需确认沿线合法停车观景点、加油或充电位置，以及X085和S222当前道路编号是否发生调整",
          ],
        },
      ],
    },
  ],
  [
    "湖南/娄底",
    {
      status: "reviewed",
      candidates: [
        {
          title: "国家地理取景地｜紫鹊界千年梯田自驾攻略",
          author: "Ingrid＿H🔅pe",
          url: "https://www.xiaohongshu.com/explore/6a799a95000000002402ca3d",
          accessedAt: "2026-08-20",
          decision:
            "strong-controlled-scenic-drive-candidate-needs-official-access-hours-road-loop-and-seasonal-traffic-verification",
          evidence: [
            "正文称紫鹊界景区允许私家车驶入核心区，八卦冲、月牙山、瑶人冲或丫髻寨、九龙坡等观景点均可驾车到附近",
            "作者称各观景台配有免费停车位，停车后步行数分钟到机位；仍需由景区官方核验停车容量、开放时段和车型限制",
            "上山盘山路弯多坡陡，新手会车困难，金秋和国庆旺季各点容易拥堵，不能标成轻松无压力的纯驾路线",
            "正文特别警告不得把车停在盘山公路路面拍照，旺季违停会造成严重拥堵，平台只能展示正规停车点",
            "梯田黄金观赏期被描述为9月底至10月中旬，10月下旬通常已大面积收割，景观推荐必须带季节条件",
            "帖子未给景区内部单向或双向组织、完整驾车顺序、总里程及充电信息，正式发布前需补齐官方导览和交通组织",
          ],
        },
      ],
    },
  ],
  [
    "湖南/湘西",
    {
      status: "reviewed",
      candidates: [
        {
          title: "湘西，一条新通车不久的国道",
          author: "道是明月渡清风",
          url: "https://www.xiaohongshu.com/explore/6a3a9e0a00000000110193b1",
          accessedAt: "2026-08-20",
          decision:
            "high-scenic-value-but-high-wet-cliff-risk-needs-road-number-endpoints-and-current-safety-verification",
          evidence: [
            "作者称新通车不久的国道连续几十公里景观较好，雨后沿线出现多处瀑布，可作为湘西山水公路线索",
            "评论中作者只把位置补充为黄金大桥方向，没有给国道编号、起终点或可复现导航节点，暂不能转成正式路线",
            "作者报告雨后路滑，并沿途看到多起摩托车及汽车滑倒或事故，说明湿滑条件下风险显著",
            "道路一侧为高悬崖，必须核验护栏、弯道、坡度、落石和排水，不能以新通车推断道路始终安全",
            "雨后瀑布和云雾属于天气相关景观，同时也增加湿滑、低能见度及地质灾害风险，平台需联动天气降级提示",
            "正式发布前必须确认道路编号、黄金大桥两端节点、连续里程、合法停车点及当前官方交通公告",
          ],
        },
      ],
    },
  ],
  [
    "天津/天津",
    {
      status: "reviewed",
      candidates: [
        {
          title: "滨海10km沿海公路🌊别错过这4️⃣小众观景地",
          author: "杨小兔儿",
          url: "https://www.xiaohongshu.com/explore/6965946c000000001a0202c3",
          accessedAt: "2026-08-22",
          decision:
            "strong-binhai-drive-sequence-needs-exact-road-chain-current-parking-and-coastal-access-verification",
          evidence: [
            "正文给出约10公里滨海自驾顺序：新港九号路—东疆亲海公园—海贝公园—东疆建设开发纪念园，建议下午由北向南并在日落前抵达末站",
            "新港九号路以风车和海岸线为主要道路景观，其余三站更偏停车后游览，不能把全部游玩时间计作纯驾时长",
            "作者称各景点可直接导航且停车场充足，但未给停车场名称、容量与节假日状态，需要逐站核验",
            "海贝公园开放时间、票价和潮汐体验具有时效性；赶海活动必须与车辆路线分离，并复核海岸开放及安全规则",
            "海边风大且冬季体感低，平台需附天气、潮汐和大风提示；公路限速标志只能作定位线索，禁止路边停车拍摄",
            "正式发布前需补齐四站之间具体道路、连续里程、合法停车入口及夜间照明状况",
          ],
        },
      ],
    },
  ],
  [
    "上海/上海",
    {
      status: "reviewed",
      candidates: [
        {
          title: "上海临港最美自驾公路，网上全是海风芦苇照",
          author: "屿川在临港",
          url: "https://www.xiaohongshu.com/explore/6a2a091d0000000035029620",
          accessedAt: "2026-08-22",
          decision:
            "myth-correction-source-use-lianggang-haigang-nanhui-route-not-fake-donghai-avenue",
          evidence: [
            "作者实地核对后指出网传东海大道并非完整滨海公路，规划道路已改名杉青路且仅约两公里，不能沿用自媒体名称生成路线",
            "可核验的看海方向是滴水湖向南，经两港大道、海港大道辅路等道路前往南汇嘴观海公园，仍需地图级确认连续节点",
            "所谓滨海观景路实为两港大道东段、江山路部分路段及公园步道的组合，步道不得计入纯驾线路",
            "南汇嘴停车位周末上午即可能接近满位，评论还称车辆目前不能驶入海堤，必须以现行交通组织为准",
            "夜间部分路段照明不足，路边停车拍照可能被处罚；平台只能推荐正式停车场，不得推荐海堤或路肩机位",
            "正式发布前需核验杉青路最新名称、海堤车辆限制、停车容量及两港大道至公园的合法通行链路",
          ],
        },
      ],
    },
  ],
  [
    "重庆/重庆",
    {
      status: "reviewed",
      candidates: [
        {
          title: "渝东北自驾封神｜城巫路一日横跨草原峡谷",
          author: "一颗橙子🍊",
          url: "https://www.xiaohongshu.com/explore/6a43d8ff000000001603e3dd",
          accessedAt: "2026-08-22",
          decision:
            "strong-chengwu-road-candidate-needs-official-road-id-weather-geology-and-viewpoint-parking-verification",
          evidence: [
            "正文给出红池坝—城巫路—亢谷亢家寨约75公里路线，纯驾驶约2.5小时、边走边拍建议预留4小时",
            "作者称全程为铺装盘山公路但急弯很多，会车需减速；沿途部分路段无信号，应提前下载离线地图",
            "山路沿途没有加油站，出发前需满油或满电，且不能把景区入口补给外推为全线补给能力",
            "夏季多雨并有山体落石风险，暴雨应暂停出行；1800米以上路段还存在温差、云雾与能见度问题",
            "沿途临时观景台及浅滩停车合法性未被证明，正文也明确不能在弯道随意停车",
            "正式发布前需核验城巫路当前道路编号、红池坝自驾入园规则、亢谷端点、官方封控及地质灾害公告",
          ],
        },
      ],
    },
  ],
  [
    "香港/香港",
    {
      status: "reviewed",
      candidates: [
        {
          title: "香港跑山 |大帽山鹿颈飞鹅山赤柱石澳太平山",
          author: "easonrider",
          url: "https://www.xiaohongshu.com/explore/69c814d3000000001a025368",
          accessedAt: "2026-08-22",
          decision:
            "high-value-long-loop-source-motorcycle-oriented-needs-car-legality-one-way-parking-and-cross-border-eligibility-verification",
          evidence: [
            "正文给出约170至180公里、6至7小时节点链：大帽山观景台—鹿颈—涌背营地—飞鹅山—坚尼地城—舂坎角炮台—石澳海滩—加白道",
            "原帖以摩托车跑山为主，不能直接等同汽车纯驾路线；高速、隧道收费、车型与跨境车辆资格均需另行核验",
            "荃锦公路通往大帽山观景台的小路徒步者较多；鹿颈有高速弯和改装车辆，平台不得使用鼓励竞速的描述",
            "飞鹅山道路狭窄、可能单向，阴天山雾能见度极低且路面湿滑，是全线最高风险段，应考虑拆分或排除",
            "浅水湾至赤柱车流较多且山路缺少超车点；石澳段相对车少仅为作者体验，不能保证实时状态",
            "正式发布前需逐段核验汽车通行、单行方向、收费、合法停车、恶劣天气封闭及内地车辆入港条件",
          ],
        },
      ],
    },
  ],
  [
    "澳门/澳门",
    {
      status: "reviewed",
      candidates: [
        {
          title: "澳门氹仔环岛跑步路线(含总督大桥）",
          author: "卢律师在上海",
          url: "https://www.xiaohongshu.com/explore/694f510a000000001e0220bc",
          accessedAt: "2026-08-22",
          decision:
            "road-sequence-only-running-source-do-not-convert-to-drive-until-vehicle-legality-and-parking-verified",
          evidence: [
            "帖子提供澳门半岛—嘉乐庇总督大桥—海洋花园大马路—东亚运大马路—莲花海滨大马路—路环—黑沙—九澳—机场的完整环线道路序列",
            "该路线明确为长距离跑步体验而非自驾攻略，只能用于发现候选道路节点，不能直接发布为纯驾路线",
            "嘉乐庇总督大桥包含狭窄步道且侧风大；车辆车道、上下桥匝道和停车条件必须按驾车规则另行核验",
            "九澳隧道禁止行人而作者改走九澳高顶马路，说明步行合法性与车辆合法性正好不同，绝不能混用结论",
            "路环与九澳部分路段有坡度、村道和补给稀少问题，评论称靠近机场才较易补给，但没有任何车辆停车证据",
            "正式发布前需确认澳门驾照或跨境车辆资格、靠左行驶、桥梁及隧道通行、收费、正规停车场和连续驾车导航节点",
          ],
        },
      ],
    },
  ],
  [
    "宁夏/银川",
    {
      status: "reviewed",
      candidates: [
        {
          title: "贺兰山真的太适合自驾了，附免费自驾攻略",
          author: "Allen想要环游世界",
          url: "https://www.xiaohongshu.com/explore/6a5ef22c000000001102e68e",
          accessedAt: "2026-08-22",
          decision:
            "promising-helanshan-foothill-drive-needs-exact-road-identity-route-branch-parking-and-weather-verification",
          evidence: [
            "正文给出银川市区直达拜寺口双塔作为入口，评论确认沿途经过滚钟口，形成银川西侧贺兰山沿山公路线索",
            "作者称道路好开，另有近期评论称车少景美，但均为个人体验，不能替代当前交通公告",
            "导航存在滚钟口路与苏峪口路两条分支，评论未回答应该选哪条，正式路线必须明确道路编号、进入口与回程",
            "拜寺口双塔景区免费与停车场15分钟内免费是帖子当时信息，不等同全程免费停车",
            "普通铺装道路不需四驱的评论只适用于不进入沙漠越野；任何非铺装穿越必须排除",
            "正式发布前需补齐总里程、连续节点、合法停车点、贺兰山封控、冬季冰雪及雨后落石风险",
          ],
        },
      ],
    },
  ],
  [
    "宁夏/石嘴山",
    {
      status: "reviewed",
      candidates: [
        {
          title: "G307🛣️是城市给不了的丰盈与自由",
          author: "被童话囚禁的灰姑娘",
          url: "https://www.xiaohongshu.com/explore/6a26b38d000000001702d735",
          accessedAt: "2026-08-22",
          decision:
            "insufficient-city-specific-evidence-do-not-publish-until-shizuishan-segment-and-endpoints-are-confirmed",
          evidence: [
            "专项检索出现G307风景公路候选，但搜索结果没有证明帖子路段位于石嘴山市域，不能仅凭国道编号归属城市",
            "同批结果大量混入银川—中卫、阿拉善穿沙及外省路线，说明关键词召回噪声较高，不能自动生成正式路线",
            "没有获得石嘴山境内起终点、连续道路节点、里程、路况、观景台或停车信息",
            "沙湖、北武当与贺兰山沿山公路的景点关联不等同道路连续性，必须通过地图和交通公告二次核验",
            "任何腾格里或贺兰山非铺装穿越均不属于普通纯驾路线，不得由轿车路线继承",
            "正式发布前需补充石嘴山境内可复现的道路编号、两端导航点、合法停车点及季节性封控证据",
          ],
        },
      ],
    },
  ],
  [
    "宁夏/吴忠",
    {
      status: "reviewed",
      candidates: [
        {
          title: "自驾宁夏第二站——吴忠",
          author: "王很邢",
          url: "https://www.xiaohongshu.com/explore/6a7eef1d000000002c002f26",
          accessedAt: "2026-08-22",
          decision:
            "city-day-trip-source-needs-video-node-transcription-road-chain-parking-and-drink-driving-boundary",
          evidence: [
            "帖子明确记录吴忠一日自驾，并涉及吴忠早茶与黄河灌溉历史，可作为城市自驾候选来源",
            "可读正文未提供完整道路节点、道路编号、里程和停车场，视频画面中的行程不能在未转录核验前推断",
            "评论中作者称一天可以完成，但这只是行程节奏经验，不证明各段实时开放或停车可用",
            "评论有人询问品酒后如何驾车返回且未获可靠回答；平台必须明确饮酒后不得驾驶，并排除酒后驾车安排",
            "青铜峡黄河大峡谷等相关搜索结果偏景区游览，不能直接拼接成连续纯驾风景公路",
            "正式发布前需补齐吴忠市区—青铜峡等连续节点、道路编号、合法停车、当前开放与代驾边界",
          ],
        },
      ],
    },
  ],
  [
    "宁夏/固原",
    {
      status: "reviewed",
      candidates: [
        {
          title: "被严重低估的夏日避暑天堂！宁夏最美28公里",
          author: "智傲生活记录",
          url: "https://www.xiaohongshu.com/explore/6a7ee508000000002500201a",
          accessedAt: "2026-08-22",
          decision:
            "strong-jinglong-road-candidate-needs-current-closure-endpoint-viewpoint-and-weather-verification",
          evidence: [
            "正文明确道路为固原泾隆公路，全长约28公里，串联泾源与隆德，可形成可复现的六盘山纯驾候选",
            "作者称沿线设观景台，评论补充道路为柏油路且车流较少，但这些属于个人当次体验",
            "正文明确山路险陡、弯多路急，驾驶需降速；不能用景色好或车少弱化急弯与会车风险",
            "帖子称每年10月至次年3月底因冰雪封路，该周期信息必须以当年官方公告复核，不能固化为永久规则",
            "作者在评论中只私发导航信息，公开内容没有精确两端入口和观景台名称，停车只能限于核验后的正规观景台",
            "正式发布前需核验泾隆公路当前通行、泾源与隆德端点、落石雾雪风险、观景台停车及返程方案",
          ],
        },
      ],
    },
  ],
  [
    "宁夏/中卫",
    {
      status: "reviewed",
      candidates: [
        {
          title: "银川→中卫66号公路 国道自驾攻略",
          author: "倦倦",
          url: "https://www.xiaohongshu.com/explore/6958747c0000000021032701",
          accessedAt: "2026-08-22",
          decision:
            "high-value-g307-g218-g751-to-route-66-candidate-needs-map-road-number-winter-and-parking-verification",
          evidence: [
            "正文给出银川市区—G307—G218—G751—中卫66号公路约260公里、4至5小时的非高速路线，并要求添加蚂蚁森林174号林途经点",
            "帖子将戈壁、梭梭林、沙漠边缘、黄河与红土丘作为连续道路景观，且称核心路段为铺装路面、普通轿车可通行",
            "正文要求只在观景台或安全停车区停靠、不得占用主干道，也不得驶入公路两侧流沙区，符合纯驾路线边界",
            "作者提醒部分国道路段较窄并需谨慎会车；评论还报告降雪时几乎无法到达，冬季必须查询天气、积雪和封控",
            "帖子建议四驱并携带脱困工具，但同时称普通轿车可走铺装段，平台不得把四驱能力外推为允许进入沙地",
            "正式发布前需用地图核对G751等道路编号与连续性，并补齐加油充电、合法停车、66号公路开放及北长滩延伸段状态",
          ],
        },
      ],
    },
  ],
  [
    "西藏/拉萨",
    {
      status: "reviewed",
      candidates: [
        {
          title: "拉萨网红S弯｜完整打卡攻略",
          author: "YANG-阳Sir",
          url: "https://www.xiaohongshu.com/explore/6a66acb3000000000402be66",
          accessedAt: "2026-08-22",
          decision:
            "short-urban-scenic-drive-only-needs-current-road-parking-and-no-roadway-photo-enforcement-verification",
          evidence: [
            "正文给出拉萨市区—慈觉林文创园方向—宝瓶路—藏地建筑博览园路标左转—拉萨山庄S弯的可复现驾车节点",
            "作者称弯道前方数百米有露天停车场，并明确弯道双向通车、不得长时间占道，停车免费状态仍需实时核验",
            "帖子以车辆拍摄为主要玩法，但站在道路中间、天窗探身或为拍摄反复慢行均有交通风险，平台不得鼓励",
            "下午游客及车辆容易聚集，夜间拍摄还涉及低能见度与三脚架占位，纯驾路线应避开高峰并只用正规停车点",
            "机位海拔约3700米且山顶风大，雨季云雾可能遮挡视线；高反与天气风险不能简化成普通城市观景路",
            "正式发布前需核验宝瓶路交通组织、停车场入口与开放、禁停执法及恶劣天气通行状态",
          ],
        },
      ],
    },
  ],
  [
    "西藏/日喀则",
    {
      status: "reviewed",
      candidates: [
        {
          title: "西藏日喀则市三大雪山公路机位，附攻略",
          author: "小虎队长",
          url: "https://www.xiaohongshu.com/explore/6992fb72000000000b0118bc",
          accessedAt: "2026-08-22",
          decision:
            "valuable-three-corridor-source-must-split-routes-and-verify-construction-permits-parking-and-border-rules",
          evidence: [
            "正文给出三组道路线索：定结—郭加乡—曲当乡—曲具拉山口、日喀则—G562约572公里处、G318岗嘎镇—岗绒公路—普士拉山口方向",
            "三组机位相距较远，不能拼成一条日喀则市区短环线，应分别计算里程、住宿、补给与高海拔驾驶时长",
            "评论称道路为铺装路，但曲具拉段有人询问施工，作者仅以非官方消息回答，当前通行必须查交通公告",
            "所谓公里桩与村庄附近机位不等于合法停车点，平台不得引导在国道、乡道或山口车道内停车拍摄",
            "部分路线接近边境及高海拔山区，证件、边境管理、通信、天气和救援条件需要逐段核验",
            "正式发布前需拆分为独立路线并确认道路编号、两端节点、施工封控、正规停车及返程时间",
          ],
        },
      ],
    },
  ],
  [
    "西藏/昌都",
    {
      status: "reviewed",
      candidates: [
        {
          title: "到底是谁说317路好走…",
          author: "忍冬",
          url: "https://www.xiaohongshu.com/explore/6a563d450000000015026de3",
          accessedAt: "2026-08-22",
          decision:
            "safety-warning-source-not-a-publishable-changdu-route-needs-exact-segment-and-current-official-road-status",
          evidence: [
            "正文记录G317雨后出现路面塌陷、临时碎石便道、炮弹坑、泥石流冲刷和路中落石，明确建议避开夜间并降低车速",
            "正文主要描述那曲至索县，评论才提到昌都至川藏界可能更难走，因此不能把整篇直接当作昌都市域路线",
            "不同评论对同一路线是否好走结论相反，作者解释为月份和泥石流影响，证明路况高度时变",
            "有轿车托底反馈，也有人称大部分铺装段可走；车型结论不能脱离具体日期、区间与施工状态",
            "评论提出绕白雄乡但没有完整道路编号与官方通行证明，平台不得把网友绕行建议直接作为导航路线",
            "正式发布前需取得昌都境内精确区段、当日交通公告、施工与地灾信息、补给救援点及车型限制",
          ],
        },
      ],
    },
  ],
  [
    "西藏/山南",
    {
      status: "reviewed",
      candidates: [
        {
          title: "西藏自驾3️⃣ 山南-日喀则",
          author: "啡寻寻啡",
          url: "https://www.xiaohongshu.com/explore/6a82a1b70000000008013c21",
          accessedAt: "2026-08-22",
          decision:
            "strong-shannan-g349-corridor-needs-exact-highway-exit-fees-weather-parking-and-current-access-verification",
          evidence: [
            "正文给出山南市区—一段高速—G349盘山公路—羊卓雍错—卡若拉冰川—满拉水库—日喀则的连续节点链",
            "作者称G349弯道连续并不断抬升海拔，阴冷厚云条件下很考验驾驶技术，不能按普通湖区观光路描述",
            "羊湖1号和2号观景台可停车停留，门票通用为作者当次体验；收费、入口和停车规则必须实时核验",
            "卡若拉冰川段遭遇大雨，说明高原天气变化会同时影响景观、能见度、落石与道路安全",
            "帖子没有给高速出口、总里程、行驶时长、补给和充电信息，不能仅凭景点顺序直接发布",
            "正式发布前需确认高速与G349衔接点、沿湖道路、当前票务停车、天气封控及高海拔应急方案",
          ],
        },
      ],
    },
  ],
  [
    "西藏/那曲",
    {
      status: "reviewed",
      candidates: [
        {
          title: "G109拉萨到那曲未必比新疆差",
          author: "反方向的松（亡命天涯版）",
          url: "https://www.xiaohongshu.com/explore/6a4639220000000008026a75",
          accessedAt: "2026-08-22",
          decision:
            "strong-g109-grassland-candidate-needs-current-roadworks-truck-flow-wildlife-stops-and-altitude-verification",
          evidence: [
            "正文记录拉萨至那曲G109近400公里草原公路景观，并称沿线草原、牛羊和野生动物连续可见",
            "作者在评论中给出导航到那曲并避开高速的复现方法，称当时为全铺装道路，但这只是当次路况",
            "作者称往那曲方向大车较少、反方向较多，方向性车流差异不能当作长期交通规律",
            "沿线海拔约4500米，直接从低海拔抵达那曲存在明显高反风险；评论中的个人适应建议不能替代医疗判断",
            "野生动物与牲畜增加突发横穿风险，平台只能推荐核验后的停车区，禁止路肩停车追拍",
            "正式发布前需核验G109施工与拥堵、限速区间、补给停车、通信、天气及高海拔应急条件",
          ],
        },
      ],
    },
  ],
  [
    "西藏/阿里",
    {
      status: "reviewed",
      candidates: [
        {
          title: "自驾阿里南南线：公珠措➠玛旁雍错G695实测路",
          author: "牛逼轰轰小咪咪",
          url: "https://www.xiaohongshu.com/explore/6a77922d0000000005030432",
          accessedAt: "2026-08-22",
          decision:
            "reject-until-authorized-access-is-proven-entry-signed-visitors-stop-despite-new-pavement",
          evidence: [
            "正文称G219临近公珠措约10公里处左转进入G695可前往玛旁雍错，并报告路面为新铺装柏油路",
            "同一入口明确写有“游客止步”，这是当前最重要的限制证据；在官方证明允许社会车辆前绝不能生成推荐路线",
            "地图无法识别该路段且缺少公开导航节点，进一步说明它不适合作为普通游客的可复现纯驾路线",
            "全程海拔5000米以上，长时间高海拔驾驶涉及高反、疲劳、车辆动力与救援可达性风险",
            "评论中作者称自己不需吸氧只是个人情况，不能据此外推其他驾驶者的安全性",
            "只有在主管部门确认开放后，才能继续核验道路编号、许可边界、通信补给、天气、停车与返程；此前保持拒绝状态",
          ],
        },
      ],
    },
  ],
  [
    "青海/西宁",
    {
      status: "reviewed",
      candidates: [
        {
          title: "青甘大环线避雷G227，最美公路它现在不配",
          author: "张大吉",
          url: "https://www.xiaohongshu.com/explore/6a75ab45000000003400c439",
          accessedAt: "2026-08-22",
          decision:
            "current-congestion-and-closure-warning-not-a-stable-scenic-route-until-g227-access-is-officially-reverified",
          evidence: [
            "正文记录张掖至西宁方向G227在扁都口后多次拥堵，并称祁连山大草原附近出现封路、后段改走高速",
            "评论同时出现顺利通过和多段堵车两类当日体验，说明拥堵、施工与放行具有强时效性，不能固化结论",
            "堵车时有车辆逆行和插队，山路双车道条件下风险明显；平台不得把赶景点或绕排队写成路线技巧",
            "作者建议改走九号公路只属于个人替代方案，没有给完整节点、道路编号与最新开放证明",
            "西宁端实际衔接、张汶高速入口汇流和岗什卡访问状态均未核验，不能直接生成西宁出发正式路线",
            "正式发布前需查询G227官方交通公告、分时放行、施工区、替代道路、停车与预计驾驶时长",
          ],
        },
      ],
    },
  ],
  [
    "青海/海东",
    {
      status: "reviewed",
      candidates: [
        {
          title: "天气好的话推荐扎碾公路",
          author: "嵐",
          url: "https://www.xiaohongshu.com/explore/6a519d3f000000001700987e",
          accessedAt: "2026-08-22",
          decision:
            "promising-zhanian-road-source-needs-haidong-segment-road-id-endpoints-surface-and-legal-rest-stop-verification",
          evidence: [
            "正文推荐兰州至天祝途中经过扎碾公路，评论补充导航设置扎碾公路与天祝小三峡，全程约5至6小时",
            "作者称前段景色一般、后段渐佳，沿途有人在凉亭和溪水边野餐露营，可作为道路景观与停靠线索",
            "帖子没有证明扎碾公路在海东市域内的精确区段，也没有给道路编号、入口和出口，不能直接归属正式海东路线",
            "评论者认为绕行较多，说明这不是普通最短路径；总里程、耗时增量和返程安排必须明确",
            "凉亭或溪边有人停留不等于车辆可合法停车、露营或进入河道，平台只能采用核验后的正规停靠点",
            "正式发布前需确认海东市域边界、道路编号、两端导航点、路面、汛期地灾、停车和补给条件",
          ],
        },
      ],
    },
  ],
  [
    "青海/海北",
    {
      status: "reviewed",
      candidates: [
        {
          title: "海北祁连山9号公路｜雪山草原油菜花海大杂烩",
          author: "红头岳犬",
          url: "https://www.xiaohongshu.com/explore/6a64ee580000000022018f5a",
          accessedAt: "2026-08-22",
          decision:
            "strong-haibei-scenic-loop-sequence-needs-road-9-identity-distance-seasonal-closure-parking-and-return-verification",
          evidence: [
            "正文给出西宁—门源花海—岗什卡雪峰景区—祁连山大草原—阿柔大寺—卓尔山—西宁的环线节点",
            "雪山、草原和油菜花均具有强季节性，作者的7月景观状态不能外推到全年",
            "标题称九号公路，但正文未说明哪些节点之间属于九号公路，也未给道路编号、总里程和驾驶时长",
            "门源、岗什卡、阿柔大寺及卓尔山包含停车后游览，不能把整条行程全部计为纯驾景观时长",
            "帖子没有路况、停车容量、加油充电和雨雪封控信息，祁连山区天气变化需单独设风险门槛",
            "正式发布前需核验九号公路官方名称与区段、连续导航、季节开放、正规停车及西宁返程方案",
          ],
        },
      ],
    },
  ],
  [
    "青海/黄南",
    {
      status: "reviewed",
      candidates: [
        {
          title: "青甘环线-甘南黄南顺路打卡全攻略",
          author: "不务正业建筑师老苏",
          url: "https://www.xiaohongshu.com/explore/6a645e64000000000401cd58",
          accessedAt: "2026-08-22",
          decision:
            "useful-huangnan-corridor-sequence-needs-road-numbers-distance-surface-high-altitude-and-viewpoint-parking-verification",
          evidence: [
            "正文给出黄南相关去程松潘—若尔盖—碌曲—夏河—尖扎—西宁，以及返程西宁—尖扎—同仁—河南县—玛曲的节点链",
            "作者将返程蓝线描述为适合慢游黄南的线路，并指出河南县至玛曲方向沿黄河景观较好",
            "评论补充双鱼湖位于河南至玛曲之间、可搜索双鱼湖加油站并使用附近观景台，但道路编号仍缺失",
            "整条路线跨青海、甘肃和四川多个行政区，正式路线必须拆出黄南市域区段，不能以大环线替代本地边界",
            "所谓免费景点、加油站和观景台均为帖子当时信息，需要核验开放、停车、燃油和卫生设施",
            "正式发布前需确认尖扎—同仁—河南县连续道路、里程、路面、高海拔天气、正规停车与跨省返程",
          ],
        },
      ],
    },
  ],
  [
    "青海/果洛",
    {
      status: "reviewed",
      candidates: [
        {
          title: "🚘自驾路书｜青海果洛·阿尼玛卿环山攻略",
          author: "Yawen的旅行日记",
          url: "https://www.xiaohongshu.com/explore/6a51c44f000000002103f0de",
          accessedAt: "2026-08-22",
          decision:
            "high-scenic-value-but-rough-surface-route-needs-4x4-tire-weather-permit-rescue-and-glacier-access-verification",
          evidence: [
            "正文给出阿尼玛卿顺时针环山约134公里、建议两天的路线框架，并称全程以砂石土路为主",
            "作者称轿车可跑全程，但评论有人当日因路烂和赶时间爆胎，两者冲突时必须按更保守车型与轮胎要求处理",
            "雪山乡被描述为主要设施点且沿途有茶水补给，但油料、充电、通信、住宿和救援能力没有被证明",
            "当雄冰川和哈龙冰川属于停车后徒步内容，接近冰川存在落冰、冰裂隙、高反和保护区管理风险，不计入纯驾路线",
            "一天完成只是不深度停留的个人回答，砂石路、高海拔与天气变化下不得以赶路为目标",
            "正式发布前需核验环山入口出口、道路权限、四驱与备胎要求、天气封控、通信救援及冰川访问规定",
          ],
        },
      ],
    },
  ],
  [
    "青海/玉树",
    {
      status: "reviewed",
      candidates: [
        {
          title: "S224 ｜ 迄今为止 我心目中最美的景观道路",
          author: "拾贰",
          url: "https://www.xiaohongshu.com/explore/6a85d1530000000010028ba7",
          accessedAt: "2026-08-22",
          decision:
            "strong-s224-zaduo-zhiduo-candidate-needs-distance-surface-weather-parking-fuel-and-wildlife-verification",
          evidence: [
            "正文明确路线为玉树S224，从杂多出发经扎青乡到治多，形成可复现的省道节点链",
            "作者记录山体、彩虹、云雾和傍晚光影，说明景观受天气和时段影响，同时也意味着能见度快速变化",
            "正文没有给里程、时长、路面、限速、加油充电和通信信息，不能仅凭景色转成正式路线",
            "评论仍有人询问具体位置和地图难搜，说明S224节点表达还需要地图级核对",
            "三江源区域需关注野生动物、生态保护和禁入边界，禁止离开道路追拍或在非正规位置停车",
            "正式发布前需核验杂多—扎青乡—治多全段通行、季节封控、合法停车、补给、救援及保护区规则",
          ],
        },
      ],
    },
  ],
  [
    "青海/海西",
    {
      status: "reviewed",
      candidates: [
        {
          title: "8/14走G315，U型公路彻底没了",
          author: "Aileen艾琳",
          url: "https://www.xiaohongshu.com/explore/6a7f267d0000000008010c77",
          accessedAt: "2026-08-22",
          decision:
            "retire-old-u-road-attraction-use-new-g315-through-route-only-after-current-construction-and-access-verification",
          evidence: [
            "作者实走新G315后称旧网红U型公路形态已明显变化，从新路上难以辨认，旧机位不应继续作为正式目的地",
            "正文给出水上雅丹—新G315—小柴旦湖—德令哈的连续通行线索，并称导航所示西莎线封闭绕行与当日实况不符",
            "评论对是否仍有入口、大小U是否存在和能否步行前往意见不一致，禁止依据非官方岔口引导车辆驶离新路",
            "作者及评论称沿线仍在施工，任何旧攻略的里程、停车和拍摄点都可能失效",
            "G315为长距离干线公路，平台必须明确禁止在车道内停车、站路中央拍照或掉头寻找机位",
            "正式发布只能保留水上雅丹至德令哈的通过型风景路线，并核验施工、封闭、服务区、油电补给和正规停车区",
          ],
        },
      ],
    },
  ],
  [
    "吉林/长春",
    {
      status: "reviewed",
      candidates: [
        {
          title: "净月潭 16km➕自驾观光车体验",
          author: "阳光下的微笑",
          url: "https://www.xiaohongshu.com/explore/6a5f24f00000000001003bd7",
          accessedAt: "2026-08-22",
          decision:
            "scenic-area-rental-vehicle-only-not-a-private-car-pure-drive-needs-current-operator-rules-and-access-verification",
          evidence: [
            "正文记录从净月潭北门进入后租用景区自驾观光车，标题称环线约16公里，一圈约一小时多",
            "车辆属于景区受控租赁设施，并非游客自有车辆可自由驶入的公共风景公路，不能计为普通纯驾路线",
            "帖子称租车需两年以上驾龄和电子驾驶证，并涉及押金、按小时收费，均为易变化的运营信息",
            "沿线停车需使用景区指定电动观光车停靠区域，不能把任意景观点描述成可停车路肩",
            "正式采用前需向运营方核验车型、驾龄、费用、雨雪停运、儿童乘坐和最新开放规则",
          ],
        },
      ],
    },
  ],
  [
    "吉林/吉林",
    {
      status: "reviewed",
      candidates: [
        {
          title: "松花湖·卧龙潭｜刚返程✨走心真实分享",
          author: "Summerie",
          url: "https://www.xiaohongshu.com/explore/6a7af4e90000000025007280",
          accessedAt: "2026-08-22",
          decision:
            "destination-access-only-not-a-scenic-drive-needs-jilin-city-road-chain-parking-and-lakeside-driving-evidence",
          evidence: [
            "正文仅说明从哈尔滨驾车到吉林市住宿、次日驾车到松花湖，没有给出可复现的沿湖公路节点",
            "主要体验是乘船往返卧龙潭，作者提示单程约40至50分钟、往返约1.5至2小时及晕船风险",
            "帖子未提供道路编号、里程、连续路况、观景停车点和返程驾驶安排，不能作为纯驾路线",
            "末班船、风浪和码头停车均具时效性，需要景区或航运方核验后才能作为到达提示",
            "正式发布前需另找吉林市区至松花湖的道路链、合法停车及真正沿湖驾驶证据",
          ],
        },
      ],
    },
  ],
  [
    "吉林/四平",
    {
      status: "reviewed",
      candidates: [
        {
          title: "自驾游",
          author: "momo",
          url: "https://www.xiaohongshu.com/explore/6a5cd05b000000000f02bcca",
          accessedAt: "2026-08-22",
          decision:
            "reject-generic-self-drive-discussion-no-siping-location-or-route-evidence",
          evidence: [
            "帖子只是讨论独自或结伴自驾以及一天最多驾驶多少公里，没有任何四平地点或路线",
            "正文和评论均无叶赫、二龙湖、道路编号、节点、路况或停车信息，属于搜索误召回",
            "评论出现长距离连续驾驶的个人经历，不应转化为平台建议或安全依据",
            "该候选明确拒绝发布，四平仍需补充真实道路实走证据",
            "后续应重点核验叶赫—二龙湖等走廊的道路编号、里程、路面、正规停车和季节风险",
          ],
        },
      ],
    },
  ],
  [
    "吉林/辽源",
    {
      status: "reviewed",
      candidates: [
        {
          title: "长春到辽源 仿佛拍到了整个夏天",
          author: "卢pp",
          url: "https://www.xiaohongshu.com/explore/6a5a042d000000000f016f51",
          accessedAt: "2026-08-22",
          decision:
            "destination-cluster-with-fengming-lake-approach-clue-needs-road-chain-distance-surface-and-parking-verification",
          evidence: [
            "正文给出四合院早市、鹿苑、辽源阿勒泰和东山公园等目的地，并称早市配有免费停车场",
            "作者置顶评论说明封面林荫路位于前往凤鸣湖、快到目的地的位置，可作为道路景观线索",
            "帖子没有说明长春至辽源所走高速或国省道，也没有凤鸣湖林荫路的入口、出口、长度和路况",
            "多个内容属于停车后游览的小景点，不能把整趟城市旅行计为连续纯驾风景路线",
            "正式发布前需核验凤鸣湖接近道路、连续导航点、合法停车、季节景观及往返里程",
          ],
        },
      ],
    },
  ],
  [
    "吉林/通化",
    {
      status: "reviewed",
      candidates: [
        {
          title: "通化出发🌲｜三天两夜自驾G331吉林段",
          author: "认真是我们参与世界的方式",
          url: "https://www.xiaohongshu.com/explore/689e86f3000000001c00e1d5",
          accessedAt: "2026-08-22",
          decision:
            "strong-tonghua-g331-loop-needs-current-construction-single-lane-weather-parking-and-offline-navigation-verification",
          evidence: [
            "正文给出通化—集安—三道沟—临江—溪谷—四海龙湾—靖宇—吊水壶瀑布—大龙湾—通化的三天环线",
            "路线涉及G331、驼靖线和集锡线，评论确认集安至临江沿线有多处观景台，走高速则看不到",
            "作者记录溪谷少量炮弹坑、轿车需慢行；老秃顶子路况更差且雨后建议SUV",
            "帖子发布时三道沟至临江施工，曾建议经S207和G222绕行；该信息已过时，绝不能直接沿用",
            "龙湾群和临江溪谷一带手机信号弱，需离线地图；评论还提示部分道路为单排车道、节假日易堵",
            "正式发布前需实时核验施工与绕行、单车道路段、天气、正规观景停车、油电补给和通信救援",
          ],
        },
      ],
    },
  ],
  [
    "吉林/白山",
    {
      status: "reviewed",
      candidates: [
        {
          title: "G331国道自驾攻略（临江段）最美秋景",
          author: "香菜牛肉恰巴塔",
          url: "https://www.xiaohongshu.com/explore/68fe175f0000000004011a60",
          accessedAt: "2026-08-22",
          decision:
            "strong-g331-changbaishan-linjiang-scenic-corridor-needs-exact-endpoints-road-condition-curves-parking-and-season-verification",
          evidence: [
            "正文明确推荐长白山至临江的G331区段，并描述沿鸭绿江连续秋景，具备清晰道路和两端城市线索",
            "作者称画面摄于10月13日并建议国庆后错峰，说明红叶窗口短且不能外推到全年",
            "帖子没有里程、驾驶时长、路面和合法停车点，评论中关于弯道与驾驶难度的问题也未获回答",
            "评论提示该区域无人机禁飞，平台不得把航拍内容转写为可操作拍摄建议",
            "正式发布前需核验长白山具体起点、临江终点、当前路况、弯道坡度、施工封控、正规观景停车和冬季风险",
          ],
        },
      ],
    },
  ],
  [
    "吉林/松原",
    {
      status: "reviewed",
      candidates: [
        {
          title: "乾安泥林，独特的风景独特的路线",
          author: "小澈儿",
          url: "https://www.xiaohongshu.com/explore/6a7747e20000000022033fa5",
          accessedAt: "2026-08-22",
          decision:
            "reject-uncertain-or-closed-access-and-bypass-advice-needs-official-opening-and-legal-access-route",
          evidence: [
            "正文仅称从松原驾车约1.5小时到乾安泥林，没有道路编号、完整导航节点或路况",
            "作者到达前已看到可能不对外开放的信息，并称原入口被封后继续寻找另一处洞口",
            "评论出现从桥边跳入和想办法进去的做法，属于疑似绕过封闭设施，平台不得采用或鼓励",
            "该帖可证明目的地热度但不能证明合法车辆通道，也不是连续纯驾风景公路",
            "正式考虑前必须由景区或属地管理方确认开放状态、合法入口、停车、地质安全及保护规则",
          ],
        },
      ],
    },
  ],
  [
    "吉林/白城",
    {
      status: "reviewed",
      candidates: [
        {
          title: "避雷202省道这一段，不然会变得不幸",
          author: "迷凯辣",
          url: "https://www.xiaohongshu.com/explore/6a7830c2000000002403e6ef",
          accessedAt: "2026-08-22",
          decision:
            "reject-search-mismatch-route-is-heilongjiang-mishan-boli-not-baicheng",
          evidence: [
            "正文明确路线为黑龙江密山往返勃利县的S202，并非吉林白城、向海或莫莫格",
            "帖子虽记录约五六十公里搓板路、坑洞、铁路道口及收费，但这些信息不得错误归入白城",
            "该结果属于搜索关键词误召回，候选明确拒绝发布，也不能用作白城路况依据",
            "白城仍需寻找向海—莫莫格等真实市域路线的道路编号、节点和合法停车证据",
            "正式发布前还需核验保护区开放季节、鸟类繁殖期管理、路面、补给和禁止驶入区域",
          ],
        },
      ],
    },
  ],
  [
    "山西/太原",
    {
      status: "reviewed",
      candidates: [
        {
          title: "🚗太原｜自驾龙天山网红公路游玩攻略",
          author: "胖虎逛吃🐯",
          url: "https://www.xiaohongshu.com/explore/6a7dcb490000000024025a68",
          accessedAt: "2026-08-22",
          decision:
            "promising-tianlongshan-scenic-road-needs-correct-name-private-car-access-direction-distance-parking-and-weather-verification",
          evidence: [
            "正文建议导航天龙山网红桥，描述西山半山腰三层回旋高架和盘山景观，可形成明确道路地标",
            "帖子同时重点介绍晋祠新镇至龙门约20多公里的观光公交，未证明自有车辆当前可全段通行",
            "标题把天龙山写成龙天山，正式数据必须纠正名称并核对地图实体",
            "上午与傍晚光线、山顶低温等信息具季节性，不能作为全年固定条件",
            "正式发布前需核验车辆准入、单向组织、起终点、里程、停车、弯坡和雨雪封控",
          ],
        },
      ],
    },
  ],
  [
    "山西/大同",
    {
      status: "reviewed",
      candidates: [
        {
          title: "大同旅游最惊艳满意的一段自驾包车amazing",
          author: "哼，是可莉",
          url: "https://www.xiaohongshu.com/explore/6a65a73f0000000013027785",
          accessedAt: "2026-08-22",
          decision:
            "strong-datong-zuoyun-great-wall-road-candidate-needs-distance-road-id-legal-stops-heritage-access-and-return-verification",
          evidence: [
            "正文给出大同—得胜堡—助马堡—月华池—摩天岭的顺序，并要求去程走长城一号旅游公路、回程走近路",
            "作者记录约14时出发、19时从摩天岭返程、20时回大同，形成约半日驾驶框架",
            "帖子称路面良好、车流少、沿线有厕所，但没有总里程、道路编号和每处停车位置",
            "所谓让司机随处停车及开放式长城遗址不能视为合法停车或可自由进入文保区域的证明",
            "正式发布前需核验左云段连续道路、正规停车区、文保边界、厕所开放、风雪和夜间返程",
          ],
        },
      ],
    },
  ],
  [
    "山西/阳泉",
    {
      status: "reviewed",
      candidates: [
        {
          title: "太原出发太行一号公路阳泉盂县段自驾游最详",
          author: "图乐山西晋豹玩车",
          url: "https://www.xiaohongshu.com/explore/6865d6e60000000022032f7a",
          accessedAt: "2026-08-22",
          decision:
            "promising-212km-yuxian-segment-needs-track-endpoints-surface-sedan-suitability-services-and-current-closures-verification",
          evidence: [
            "正文声称盂县段约212公里，并列出牛道岭、骆驼道、雁子崖、悬云寨和峪原等沿途节点",
            "作者特别提示导航可能走错且存在关键岔口，但公开正文没有给可复现途经点或轨迹",
            "评论多人索要轨迹，轿车是否好走也未得到可靠回答，因此不能直接生成导航路线",
            "免费与景点状态属于帖子当时描述，不能替代道路开放和设施核验",
            "正式发布前需补齐起终点、途经点、路面、车型、油电补给、停车、通信和封路信息",
          ],
        },
      ],
    },
  ],
  [
    "山西/长治",
    {
      status: "reviewed",
      candidates: [
        {
          title: "济南自驾长治——太行一号旅游公路",
          author: "大脸猫",
          url: "https://www.xiaohongshu.com/explore/6a60daa70000000010024ca8",
          accessedAt: "2026-08-22",
          decision:
            "useful-pingshun-route-with-serious-single-lane-tunnel-risk-needs-segment-splitting-traffic-control-parking-and-daylight-verification",
          evidence: [
            "正文计划神龙湾挂壁公路观景台—太行天路起点—岳家寨—黄崖洞，并穿插原起寺、大云院等节点",
            "作者在岳家寨前遇到仅容一车的岩壁洞口，双向车辆坡道堵死，错车间距极小，属于明确高风险点",
            "作者因长时间驾驶和担忧天黑山路而放弃部分景点，证明原计划不适合压缩为普通一日轻松路线",
            "沿途曾出现缺少饮水和餐饮补给的情况，不能假设景点附近均有服务",
            "正式发布前需拆分路段并核验洞口交通组织、车型宽高、会车点、停车、补给和全程白天完成条件",
          ],
        },
      ],
    },
  ],
  [
    "山西/晋城",
    {
      status: "reviewed",
      candidates: [
        {
          title: "晋城太行一号公路｜保姆级攻略✨自驾+",
          author: "逛逛晋城｜吃喝玩乐团",
          url: "https://www.xiaohongshu.com/explore/6a3df377000000001702f162",
          accessedAt: "2026-08-22",
          decision:
            "strong-jincheng-scenic-corridor-list-needs-one-coherent-route-access-rules-distance-parking-and-fuel-verification",
          evidence: [
            "正文给出晋城市区至珏山驿站，并列太行一号0公里驿站、王莽岭、浙水、黑毛沟、武家湾和棋子山等节点",
            "帖子称主线路面平整但弯道多、山区加油站少，建议在陵川或林州提前加油",
            "昆山和锡崖沟挂壁公路涉及不同通行方式，其中锡崖沟建议乘景区公路车，不能统称自驾可进入",
            "多个景点并非同一条连续顺路线，作者也没有回答全程驾驶用时，需避免拼成虚假的一日路线",
            "正式发布前需确定单一走向、里程、景区车辆准入、正规停车、燃油和冬季封控",
          ],
        },
      ],
    },
  ],
  [
    "山西/朔州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "8日自驾晋北长城一号公路 D5.D6长城古堡行",
          author: "不虚此行的月饼",
          url: "https://www.xiaohongshu.com/explore/6a798dc2000000003300a021",
          accessedAt: "2026-08-22",
          decision:
            "promising-youyu-shuozhou-great-wall-corridor-needs-paved-road-parking-heritage-boundary-distance-and-season-verification",
          evidence: [
            "正文给出右玉—杀虎口—三十二村长城—十三边长城—云石堡—朔州，纯路程约3小时",
            "前一日大同得胜堡至右玉的节点也完整，可与朔州段形成跨市长城一号连续线索",
            "作者尚不确定杀虎口公路边小停车场是否启用，也没有实证三十二村等支路是否铺装",
            "评论继续追问普通SUV能否通行，说明车型与路面信息尚未闭环",
            "正式发布前需核验连续道路、铺装情况、停车、古长城保护边界、徒步入口和风雪季通行",
          ],
        },
      ],
    },
  ],
  [
    "山西/晋中",
    {
      status: "reviewed",
      candidates: [
        {
          title: "山西太行一号旅游公路，原创超详细攻略！！！",
          author: "梦迪的旅行日记",
          url: "https://www.xiaohongshu.com/explore/68f7a0ce0000000004011cde",
          accessedAt: "2026-08-22",
          decision:
            "strong-jinzhong-node-chain-from-cycling-source-needs-driving-conversion-road-identity-surface-services-and-truck-traffic-verification",
          evidence: [
            "正文明确晋中段经过昔阳、和顺、左权和榆社，并给出昔阳—左权79.4公里、左权—榆社67.4公里等日程",
            "作者指出左权石阳线约20公里属于太行一号且途经石匣水库，榆社至武乡约65公里可经过云竹湖",
            "资料来自自行车骑行，骑行分日里程不能直接替代汽车驾驶时长、停车或车型适应性",
            "评论提示部分线路补给困难并询问半挂车辆情况，重车流量和服务点尚未证实",
            "正式发布前需核对G207与石阳线等道路身份、路面、汽车通行、停车、补给和云竹湖环湖规则",
          ],
        },
      ],
    },
  ],
  [
    "山西/运城",
    {
      status: "reviewed",
      candidates: [
        {
          title: "运城绝美自驾‼️中条山三条神仙支线全攻略",
          author: "Assistants",
          url: "https://www.xiaohongshu.com/explore/6a299f87000000000803f8f1",
          accessedAt: "2026-08-22",
          decision:
            "strong-three-zhongtiaoshan-branches-needs-official-road-names-map-matching-weather-parking-camping-and-fire-control-verification",
          evidence: [
            "正文给出平陆山脊支线二十里岭—风口村约40公里，以及夏县瑶台山—祁家河约67.2公里",
            "永济沿山支线又分雪花山—王官谷和五老峰东支线—神潭大峡谷，三类路线需分别建档",
            "平陆段路面平整但弯道多、雨天易起雾；深山信号弱，作者建议离线地图",
            "评论反映部分地图搜不到线路，作者提供的多个途经点仍需官方地图和实地核对",
            "风口草原露营、航拍及所谓免费状态不能直接采用，森林防火期严禁野外明火",
            "正式发布前需核验官方路名、逐段导航、停车露营边界、雾风风险、通信和防火管制",
          ],
        },
      ],
    },
  ],
  [
    "山西/忻州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "避雷黄河一号旅游公路河曲偏关段",
          author: "One棵葱",
          url: "https://www.xiaohongshu.com/explore/686d3b99000000000b02dd13",
          accessedAt: "2026-08-22",
          decision:
            "retain-as-negative-safety-evidence-not-a-recommended-route-needs-truck-flow-alternative-road-and-live-traffic-verification",
          evidence: [
            "正文明确河曲—偏关段重型货车多，跟车可能长时间拥堵，超越又会增加风险",
            "评论有近期驾驶者称因大车堵路超过一小时，表明问题可能持续但仍需实时交通数据确认",
            "评论称该段属于国道，黄河一号旅游公路的具体重合区间和道路编号尚未明确",
            "平台不得把穿行重卡夹缝或以堵车训练车技作为建议，应优先提供替代道路或避开时段",
            "正式采用前需核验道路编号、货运时段、施工、实时拥堵、替代路线和安全停车点",
          ],
        },
      ],
    },
  ],
  [
    "山西/临汾",
    {
      status: "reviewed",
      candidates: [
        {
          title: "去壶口瀑布自驾黄河1号旅游公路 真的太美了",
          author: "叽里咕噜张",
          url: "https://www.xiaohongshu.com/explore/695a4de4000000001f006b52",
          accessedAt: "2026-08-22",
          decision:
            "promising-shanxi-side-hukou-approach-needs-exact-start-end-distance-winter-maintenance-height-limit-and-parking-verification",
          evidence: [
            "正文确认前往山西壶口瀑布时走山西侧黄河一号旅游公路，雪后群山景观突出",
            "作者当日观察路面基本无积雪、车少且总体好开，但明确弯道较多",
            "帖子没有回答从哪里开到哪里，无法仅凭山西侧描述生成可复现导航",
            "房车限高、防滑链和后续降雪均未得到可靠确认，元旦单日路况不能外推整个冬季",
            "正式发布前需核验精确起终点、里程、冬季养护、弯坡、限高、景区停车及实时天气封控",
          ],
        },
      ],
    },
  ],
  [
    "山西/吕梁",
    {
      status: "reviewed",
      candidates: [
        {
          title: "黄河一号旅游公路+碛口古镇+李家山村",
          author: "yuxuan & Julie",
          url: "https://www.xiaohongshu.com/explore/6a60a7b2000000000f005020",
          accessedAt: "2026-08-22",
          decision:
            "strong-xingxian-linxian-corridor-observation-needs-endpoints-distance-legal-viewpoint-stops-service-status-and-heat-verification",
          evidence: [
            "作者实走兴县和临县黄河一号旅游公路，并确认代表性标志位于两县交界附近",
            "正文称路面平整、没有大车且车流少，但沿线观景亭经常没有配套停车区",
            "兴县段驿站被描述为基本荒废且无厕所，临县段标识更清楚、驿站当时在运行",
            "碛口古镇和李家山村属于停车后游览内容，不能并入纯驾驶时长；高温体感也需提示",
            "正式发布前需补齐两端导航、里程、合法停车区、驿站厕所开放、补给和夏季高温风险",
          ],
        },
      ],
    },
  ],
  [
    "贵州/遵义",
    {
      status: "reviewed",
      candidates: [
        {
          title: "遵义5天4晚自驾路线｜赤水河谷，串起了这些",
          author: "轨道与旷野",
          url: "https://www.xiaohongshu.com/explore/6a85a40200000000220151a4",
          accessedAt: "2026-08-22",
          officialSources: [
            "https://jt.guizhou.gov.cn/xwzx1/jtyw1/201607/t20160718_82504193.html",
          ],
          decision:
            "strong-zunyi-renhuai-chishui-loop-sequence-needs-road-numbers-distance-river-road-surface-parking-and-seasonal-hazard-verification",
          evidence: [
            "正文给出遵义—仁怀—茅台镇—土城—赤水丹霞—丙安—赤水河谷公路—娄山关—遵义的五日不回头路线",
            "作者明确称赤水河谷公路风景优于高速，可作为遵义市域旅行公路的主要线索",
            "贵州省交通运输厅资料确认机动车主线起于仁怀茅台镇、经习水土城、止于赤水市区，全长153.6公里，由G212、S303和G546组成",
            "帖子没有道路编号、逐日里程、连续驾驶时长、沿途停车点和路面信息",
            "丹霞、古镇和娄山关属于停车后游览内容，不能全部计作纯驾驶观景时间",
            "正式发布前需核验赤水河谷公路精确区段、汛期落石塌方、停车、油电补给和返程道路",
          ],
        },
      ],
    },
  ],
  [
    "贵州/六盘水",
    {
      status: "reviewed",
      candidates: [
        {
          title: "乌蒙大草原紧急劝退",
          author: "榕树下的古灵精",
          url: "https://www.xiaohongshu.com/explore/6a6b2bd20000000025008fc5",
          accessedAt: "2026-08-22",
          officialSources: [
            "https://www.gzlps.gov.cn/ywdt/jrld/202508/t20250812_88446077.html",
            "https://fgw.guizhou.gov.cn/zwgk/zdlyxx/jffw/jyfwxsfml/202302/P020260205668316803405.pdf",
          ],
          decision:
            "retain-as-severe-peak-congestion-and-steep-grade-evidence-not-a-default-pure-drive-needs-capacity-reservation-shuttle-road-grade-and-vehicle-verification",
          evidence: [
            "作者记录乌蒙大草原天池附近斜坡严重拥堵，车辆反复半坡起步并出现变速箱过热、熄火和开盖散热",
            "评论补充该路为铺装路，但存在大斜坡、发夹弯和频繁坡起，多名驾驶者报告车辆过热、没油或爆胎",
            "六盘水市政府曾披露暑期景区日均接待游客超过2万人次，与帖子反映的峰值拥堵方向一致，但不能外推到每日",
            "贵州省政府定价清单列有乌蒙大草原景区内交通服务，说明景交车可作为替代，但当前班次、范围和价格仍需景区确认",
            "不同变速箱或电动车是否更适合只是评论经验，平台不得据此保证任何车型能安全通过拥堵陡坡",
            "正式发布前需核验预约与容量限制、私家车准入、坡度弯道、停车换乘、天气、补能和实时拥堵；高峰期不作为默认纯驾路线",
          ],
        },
      ],
    },
  ],
  [
    "贵州/安顺",
    {
      status: "reviewed",
      candidates: [
        {
          title: "关兴公路（安顺到兴义）自驾攻略",
          author: "阿柚",
          url: "https://www.xiaohongshu.com/explore/6a8304620000000033018d33",
          accessedAt: "2026-08-22",
          officialSources: [
            "https://jt.guizhou.gov.cn/ztzl/rdzt_5948610/xczx/mtbd/202511/t20251107_88924454.html",
          ],
          decision:
            "strong-guanxing-road-candidate-needs-exact-waypoints-no-roadside-stopping-bridge-access-weather-and-route-order-verification",
          evidence: [
            "正文从黄果树附近出发，依次记录坝陵河大桥、科力寨、花江峡谷观景区、旧花江大桥和北盘江大桥",
            "作者称关兴公路路宽、总体好开且约三小时驾驶，但评论承认部分节点存在回头路和路线理解偏差",
            "贵州省交通运输厅资料确认关兴公路北盘江大桥位于花江峡谷三江口，但这不能替代旧桥、观景区和停车点的逐点核验",
            "正文多次描述路边空位停车或步行回桥上，不能作为合法停车与行人上桥许可的证明",
            "关兴公路跨安顺和黔西南，正式线路必须拆清行政边界及新旧桥的具体道路",
            "正式发布前需核验途经点顺序、正规停车场、桥梁行人规则、雨雾落石、限速和实时封控",
          ],
        },
      ],
    },
  ],
  [
    "贵州/毕节",
    {
      status: "reviewed",
      candidates: [
        {
          title: "乌江源化屋村很美，但是新手司机就不要来了",
          author: "祾子aLing",
          url: "https://www.xiaohongshu.com/explore/6a609d010000000014005c67",
          accessedAt: "2026-08-22",
          officialSources: [
            "https://jt.guizhou.gov.cn/zwgk/zdlyxxgk_5948535/zjgl/zjxx/202405/P020240603382865062417.pdf",
          ],
          decision:
            "retain-as-high-difficulty-huawu-access-evidence-needs-road-id-grade-width-guardrail-weather-parking-and-alternative-verification",
          evidence: [
            "正文记录前往乌江源化屋村约4公里山路包含28个急转弯并伴随陡坡，是明确驾驶难度证据",
            "作者直接不建议新手驾驶，平台不得以景色好为由弱化弯坡风险",
            "帖子没有道路编号、路宽、坡度、护栏、会车点、车型和雨雾路况信息",
            "贵州省交通运输厅资料确认存在黔西新仁至化屋旅游公路，但帖子所述28个急弯是否属于该项目仍需地图和现场核对",
            "个人认为可由此挑战川藏线属于不可靠类比，不能转化为能力判断或路线推荐",
            "正式发布前需核验道路等级、会车与停车、天气地灾、景区接驳及低难度替代到达方式",
          ],
        },
      ],
    },
  ],
  [
    "贵州/铜仁",
    {
      status: "reviewed",
      candidates: [
        {
          title: "2026.8.4，梵净山环山旅游公路",
          author: "momo",
          url: "https://www.xiaohongshu.com/explore/6a71c163000000003301bd64",
          accessedAt: "2026-08-22",
          officialSources: [
            "https://jt.guizhou.gov.cn/zwgk/zdlyxxgk_5948535/zjgl/zjxx/202405/P020240603382865062417.pdf",
          ],
          decision:
            "reject-until-landslide-cleared-retain-as-current-hazard-evidence-needs-official-closure-weather-road-number-and-safe-alternative",
          evidence: [
            "作者从云舍村往印江方向沿梵净山环山公路行驶六十多公里，接近山顶时遇山体滑坡并原路返回",
            "评论有人因同期强降雨取消行程，也有人长期认为该路危险而宁可绕高速，风险证据相互印证",
            "搜索提示可能涉及X508，但正文未明确道路编号、滑坡位置或清障状态",
            "贵州省交通运输厅资料确认梵净山旅游公路体系存在，但未证明作者当天遇阻路段已经恢复通行",
            "七座车曾通过的单条评论不能证明当前安全通行，平台不得在清障确认前推荐",
            "正式发布前需查属地封路通告、降雨地灾预警、精确受阻点、道路编号及高速替代方案",
          ],
        },
      ],
    },
  ],
  [
    "贵州/黔西南",
    {
      status: "reviewed",
      candidates: [
        {
          title: "万峰林自驾｜下午出发+反向环线，亲测避开人",
          author: "大小眼不能飞",
          url: "https://www.xiaohongshu.com/explore/6a7bdcd40000000022012324",
          accessedAt: "2026-08-22",
          officialSources: [
            "https://jt.guizhou.gov.cn/xwzx1/tzgg_5948486/201808/W020180802453058569999.pdf",
          ],
          decision:
            "village-access-loop-not-ideal-pure-drive-needs-current-traffic-direction-private-car-policy-parking-and-season-verification",
          evidence: [
            "正文给出万佛寺—下纳灰—中纳灰—上纳灰的反向环线思路，并称下午出发可避开部分高峰",
            "作者实测村内仍会拥堵，村道窄且两侧停放电动车，会车对驾驶技术有要求",
            "作者明确认为万峰林不太适合开车深度游，因为停车不便，很多地点只能驶过",
            "贵州省交通运输厅批复显示兴义环城高速另设万峰林停车区，证明外围高速停车设施与村寨内部自驾环线应分开表达",
            "反向行驶是否符合当前单行组织和旺季管制未被证明，不能直接作为长期避堵规则",
            "正式发布前需核验私家车准入、行驶方向、停车场、拥堵时段、村民通行和观光车替代方案",
          ],
        },
      ],
    },
  ],
  [
    "贵州/黔东南",
    {
      status: "reviewed",
      candidates: [
        {
          title: "在加榜梯田被狠狠治愈，盘山路1小时可达",
          author: "夫仔妈妈遛自己",
          url: "https://www.xiaohongshu.com/explore/6a800cc700000000330349ef",
          accessedAt: "2026-08-22",
          officialSources: [
            "https://jt.guizhou.gov.cn/xwzx1/hydt/201908/t20190812_82483943.html",
          ],
          decision:
            "destination-access-road-plus-shuttle-not-an-internal-private-car-route-needs-start-point-road-condition-vehicle-size-weather-and-season-verification",
          evidence: [
            "正文称到达加榜梯田需约1小时盘山路，可作为景区外部接近道路的驾驶线索",
            "旺季私家车需停游客中心并换乘约15分钟一班的观光车，景区内部不能作为纯驾路线",
            "评论确认中巴也需走盘山路到游客中心，但未说明道路宽度、会车点、坡度和车辆限制",
            "贵州省交通运输厅资料曾记录肇兴侗寨—从江高铁站—加榜梯田景区直通车，可作为不自行驾驶盘山路的替代线索，但班次现状需重查",
            "梯田水稻、云海和日落均有明显季节与天气窗口，不能描述为全年稳定景观",
            "正式发布前需核验盘山路起点、里程、路况、车型、游客中心停车、旺季接驳和雨雾地灾风险",
          ],
        },
      ],
    },
  ],
  [
    "贵州/黔南",
    {
      status: "reviewed",
      candidates: [
        {
          title: "在“中国天眼”没信号的5公里，我差点迷路",
          author: "好佑健康驿站",
          url: "https://www.xiaohongshu.com/explore/69f94ac0000000003700d850",
          accessedAt: "2026-08-22",
          officialSources: [
            "https://jt.guizhou.gov.cn/wqfj/wxzp/202311/t20231121_83106533.html",
          ],
          decision:
            "destination-access-and-radio-silence-warning-not-a-scenic-drive-needs-current-service-center-navigation-device-rules-and-parking-verification",
          evidence: [
            "正文提醒私家车不能直接开到中国天眼，应导航平塘天文小镇服务区停车并换乘观光车",
            "作者误导航进入核心方向后在约5公里电磁静默区失去手机信号，说明必须提前固定正确终点",
            "手机、相机、无人机和智能设备寄存规则来自作者2022年经历，当前要求必须由景区重新确认",
            "该帖子主要证明到达和管制风险，不是连续风景公路，不能提升为纯驾路线",
            "贵州省交通运输厅资料确认平塘天文小镇、中国天眼科普基地和天空之桥服务区属于当地公路旅游网络，适合作为外围到达节点而非核心区私家车通行证明",
            "正式采用前需核验服务区名称与坐标、停车、接驳、设备限制、离线导航和应急通信规则",
          ],
        },
      ],
    },
  ],
  [
    "广西/南宁",
    {
      status: "reviewed",
      candidates: [
        {
          title: "大明山牵牛岗·盘山公路",
          author: "早日退休的Y",
          url: "https://www.xiaohongshu.com/explore/6a686aff000000001101b03d",
          accessedAt: "2026-08-22",
          decision:
            "scenic-clue-only-needs-private-car-access-road-length-grade-width-hours-parking-weather-and-night-driving-verification",
          evidence: [
            "正文确认作者曾自驾大明山牵牛岗盘山公路并认为沿途景观较好，可作为道路存在与景观线索",
            "帖子没有起终点、道路编号、里程、路宽、坡度、会车点和停车信息，无法直接形成导航路线",
            "评论提到雨后可能出现云海且山顶半夜寒冷，说明天气与昼夜温差显著",
            "作者没有说明景区私家车准入、预约或单向交通规则，不能假定可随时自驾上山",
            "正式发布前需核验车辆政策、开放时段、连续导航、雨雾落石、停车和禁止夜间冒险驾驶要求",
          ],
        },
      ],
    },
  ],
  [
    "广西/柳州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "别挤千户苗寨❗这条自驾路线人少好拍📸",
          author: "Yuna's 生活碎片",
          url: "https://www.xiaohongshu.com/explore/6a7f44510000000033031032",
          accessedAt: "2026-08-22",
          decision:
            "reject-search-mismatch-route-is-kaili-guizhou-not-liuzhou-guangxi",
          evidence: [
            "正文路线为凯里市区—白岩村—乌东苗寨—白岩村对岸观景台—凯里，属于贵州黔东南而非广西柳州",
            "帖子虽提到盘山弯道多、应避免夜路和村道停车会堵，但这些信息不得错误归入柳州",
            "作者建议在路边较宽处停车，不等于存在合法停车位，平台也不得采用此类模糊停车指引",
            "该候选明确作为搜索误匹配拒绝发布，柳州仍需补充融水或三江真实道路证据",
            "后续应核验柳州市域道路编号、两端节点、路况、村寨停车和山区天气",
          ],
        },
      ],
    },
  ],
  [
    "广西/梧州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "天龙顶真实体验分享（自驾游）",
          author: "取什么名能发财",
          url: "https://www.xiaohongshu.com/explore/6a683fb10000000011006dd1",
          accessedAt: "2026-08-22",
          decision:
            "controlled-scenic-area-night-access-not-default-pure-drive-needs-current-private-car-window-width-traffic-control-fees-weather-and-rescue-verification",
          evidence: [
            "作者从岑溪导航天龙顶游客中心，再按当时规则于傍晚后自驾约10分钟到山顶",
            "上山道路弯多、狭窄且夜间人车稀少，评论中作者明确不太建议新手驾驶",
            "白天有景区大巴上山，作者为避免会车选择早上9点前下山，说明私家车时段可能受交通组织限制",
            "山顶夜间无工作人员、曾有浓雾和大风，露营过夜不应仅凭个人经历推广",
            "门票、车辆费和晚间自驾窗口均为易变信息，正式发布前需向景区核验并优先推荐接驳车",
          ],
        },
      ],
    },
  ],
  [
    "广西/防城港",
    {
      status: "reviewed",
      candidates: [
        {
          title: "骑行广西沿边公路，打卡马鞍坳、219国道地标",
          author: "迪迪喂",
          url: "https://www.xiaohongshu.com/explore/6a1d82950000000007028a6d",
          accessedAt: "2026-08-22",
          decision:
            "route-identity-conflict-and-cycling-source-needs-g219-s325-segment-boundary-access-road-surface-border-rules-and-driving-verification",
          evidence: [
            "正文记录东兴方向沿边公路、马鞍坳及G219里程地标，但资料来自骑行而非汽车实驾",
            "评论对该段究竟是旧G219还是S325存在直接冲突，正式路线必须以最新官方道路编号为准",
            "评论提到通往山顶的小路常起雾，不能把非干线支路或边境小路纳入普通驾车路线",
            "帖子没有汽车路况、里程、补给、停车、边境检查或禁入区域信息",
            "正式发布前需核验东兴—马鞍坳具体区段、道路身份、边境规定、雾天封控、停车和汽车通行条件",
          ],
        },
      ],
    },
  ],
  [
    "广西/钦州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "钦州的宝藏自驾露营地最美海上公路",
          author: "陈旭带你飞",
          url: "https://www.xiaohongshu.com/explore/6a7c28db000000002c0016ef",
          accessedAt: "2026-08-22",
          decision:
            "confirmed-13km-sandun-access-road-but-ground-level-scenic-value-and-camping-legality-need-verification",
          evidence: [
            "正文将三墩码头方向描述为约13公里海上公路，可形成明确目的地和距离线索",
            "多条评论称车内视角主要被树木遮挡，所谓海上效果更多来自无人机视角，实际纯驾观景价值存在明显争议",
            "作者声称免费露营、无需停车费，但没有管理方依据、停车区域、潮汐和卫生条件",
            "钓鱼、徒步和露营能否进行不能依据评论回答，需要核验港区、海堤和防潮防风管理规则",
            "正式发布前需确认道路正式名称、起终点、合法停车露营、台风潮汐、港区车辆限制和返程时间",
          ],
        },
      ],
    },
  ],
  [
    "广西/贵港",
    {
      status: "reviewed",
      candidates: [
        {
          title: "自驾贵港平天山",
          author: "穿豹纹的悟空",
          url: "https://www.xiaohongshu.com/explore/68691f860000000024008eed",
          accessedAt: "2026-08-22",
          decision:
            "reject-unverified-farm-track-and-freeform-off-road-access-not-suitable-for-public-pure-drive-catalog",
          evidence: [
            "作者引导导航上龙楼新村后沿唯一机耕路到上龙楼，再任意选择路线开上山，明显不属于标准公共旅游公路",
            "评论中作者确认普通轿车无法通过，城市SUV是否可行也没有得到答复",
            "任意选路上山可能涉及林地、草地、村民生产道路和保护区权限，平台不得复制此类越野指引",
            "帖子没有道路权属、坡度、救援、天气、封路、停车和生态保护信息",
            "该候选明确拒绝发布；如需平天山路线，只能采用管理方确认的公共进山道路与正规停车点",
          ],
        },
      ],
    },
  ],
  [
    "广西/玉林",
    {
      status: "reviewed",
      candidates: [
        {
          title: "广西玉林大容山森林公园游玩详细攻略",
          author: "积极的废人",
          url: "https://www.xiaohongshu.com/explore/6a777b6800000000210218be",
          accessedAt: "2026-08-22",
          decision:
            "promising-controlled-park-drive-needs-current-ticket-private-car-access-road-grade-traffic-control-parking-and-weather-verification",
          evidence: [
            "正文建议导航六二丫停车场或检票口，并给出六二丫—天湖山庄—汇流站—桂东南第一峰—小莲池—大连池的景区节点",
            "作者称整体可驾车游览，但评论承认山路有难度；大连池至莲花瀑布只能步行且坡陡",
            "检票口验票、车辆通行与收费属于景区受控交通，不应描述为普通公共免费公路",
            "沿途餐饮少，需自带补给；阴雨、冬季戏雪和风车区域的路况及开放性均会变化",
            "正式发布前需核验私家车准入、票价、单向与会车规则、停车、雨雾结冰和步行区边界",
          ],
        },
      ],
    },
  ],
  [
    "广西/百色",
    {
      status: "reviewed",
      candidates: [
        {
          title: "自驾219 广西段喀斯特秘境与最新路况实测",
          author: "美晴子",
          url: "https://www.xiaohongshu.com/explore/6a71c0020000000028032c86",
          accessedAt: "2026-08-22",
          decision:
            "strong-g219-border-corridor-safety-source-needs-baise-segment-endpoints-current-landslide-detours-checkpoints-services-and-weather-verification",
          evidence: [
            "正文确认G219广西段具有连续喀斯特道路景观，并提示雨季存在烂路、滑坡塌方和临时绕行",
            "作者称沿边检查点较多，需要随身准备身份证件并配合身份核验",
            "评论补充东兴至凭祥仍较难走、后续存在石块烂路，且作者当时遇到一处塌方绕行",
            "帖子未拆出百色靖西—那坡的精确里程、受损点、加油补给和合法停车点，不能整段照搬",
            "正式发布前需核验百色市域G219起终点、最新地灾与施工、边境检查、通信、补给和替代路线",
          ],
        },
      ],
    },
  ],
  [
    "广西/贺州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "贺州姑婆山顶|全程道路实况",
          author: "SCANAIDS📷",
          url: "https://www.xiaohongshu.com/explore/69f9dae10000000036000a17",
          accessedAt: "2026-08-22",
          decision:
            "reject-unverified-yějiaoao-off-road-access-needs-land-rights-road-class-vehicle-permission-rescue-and-ecology-verification",
          evidence: [
            "正文只给出导航野鸡凹至电站、再寻找上山入口的线索，并以越野车和露营为标签",
            "评论称摩托车更易通过，不能据此推定普通汽车或公共车辆可合法安全上山",
            "帖子没有道路权属、铺装、坡度、宽度、护栏、救援、停车或景区许可信息",
            "野鸡凹山顶路线可能属于林区、生产道路或非开放越野路线，平台不得发布模糊入口导航",
            "该候选拒绝作为普通纯驾路线；只有管理方确认公共通行与生态边界后才能重新评估",
          ],
        },
      ],
    },
  ],
  [
    "广西/河池",
    {
      status: "reviewed",
      candidates: [
        {
          title: "河池天峨县火了，为什么高速这么贵",
          author: "土豆炖马铃薯",
          url: "https://www.xiaohongshu.com/explore/6a2c4b26000000001702b54b",
          accessedAt: "2026-08-22",
          decision:
            "useful-guibei-expressway-travel-clue-needs-official-route-name-tolls-tunnel-speed-services-and-alt-route-verification",
          evidence: [
            "正文和评论集中讨论南宁至天峨的高速路线，评论称过金城江后车流较少、隧道密集且沿线景观较好",
            "有人给出约330公里和较高通行费的个人记录，也有人建议兰海高速—都安北—一级路—金城江的省费走法",
            "不同导航显示、收费金额和路线组合意见冲突，不能采用评论数字作为当前官方收费标准",
            "国道替代线被描述为弯多、坡陡、临崖；评论中超速经验属于危险违法内容，必须明确排除",
            "正式发布前需核验贵北高速正式路段、收费、隧道限速、服务区、油电补给和安全替代路线",
          ],
        },
      ],
    },
  ],
  [
    "广西/来宾",
    {
      status: "reviewed",
      candidates: [
        {
          title: "广州自驾｜广西金秀5天4晚小众亲子避暑⛰️",
          author: "暖暖的美妈",
          url: "https://www.xiaohongshu.com/explore/6a86deed0000000027030cc1",
          accessedAt: "2026-08-22",
          decision:
            "destination-only-post-needs-full-text-route-nodes-road-numbers-distance-mountain-road-condition-parking-and-family-safety-verification",
          evidence: [
            "帖子标题确认从广州自驾至广西金秀并进行五天四晚亲子行程，可作为来宾金秀目的地需求线索",
            "当前可读正文没有展开逐日路线、道路编号、盘山路况、里程、停车和补给信息",
            "评论主要讨论酒店与盘王谷住宿，不能证明盘王谷或其他景点之间存在适合纯驾的连续风景公路",
            "亲子适配只是作者总体感受，不能替代儿童乘车时长、晕车、山区医疗和夜间驾驶评估",
            "正式发布前需另找金秀市域实走路线，核验大瑶山道路、弯坡、落石、停车、补给和返回节点",
          ],
        },
      ],
    },
  ],
  [
    "广西/崇左",
    {
      status: "reviewed",
      candidates: [
        {
          title: "被吹爆的中国仙境高速｜合那高速自驾全攻略",
          author: "中国出行图鉴",
          url: "https://www.xiaohongshu.com/explore/6a45343e0000000008001dae",
          accessedAt: "2026-08-22",
          decision:
            "promising-he'na-expressway-corridor-needs-official-route-length-parking-area-names-toll-speed-weather-and-service-verification",
          evidence: [
            "正文将合那高速标为S60，并推荐崇左—大新—靖西约100公里喀斯特景观区段",
            "作者列出渠旧停车区、大新服务区等合法停靠思路，并明确禁止在应急车道停车拍照",
            "文中称合浦至那坡516公里、服务区可步行到瀑布等信息均需官方道路和运营方核验",
            "评论对景观价值分歧明显，还有人无法在导航中找到渠旧停车区，说明点位名称和体验不能照搬",
            "正式发布前需核验合那高速正式起终点与编号、崇左市域里程、收费、限速、服务区、雨雾和施工状态",
          ],
        },
      ],
    },
  ],
  [
    "陕西/铜川",
    {
      status: "reviewed",
      candidates: [
        {
          title: "西安周末自驾去城堡，一日攻略",
          author: "怎么过三月",
          url: "https://www.xiaohongshu.com/explore/6a817f060000000005030e46",
          accessedAt: "2026-08-22",
          decision:
            "destination-loop-not-yet-a-scenic-road-needs-road-numbers-distance-mountain-access-parking-and-current-venue-rules-verification",
          evidence: [
            "正文给出棉花库—耀州窑博物馆—黄堡镇五星村—陈炉古镇的不回头一日路线",
            "作者称西安至铜川约1.5小时、总体路况平稳，并给出各站停车或游览时间线索",
            "主要内容属于停车后参观，未说明各段道路编号、里程或连续道路景观，不能直接计为纯驾路线",
            "评论称车辆可开到陈炉古镇山上，但没有说明停车、限行、路宽和节假日交通组织",
            "正式发布前需核验连续导航、陈炉进山道路、合法停车、场馆开放、费用和雨雪路况",
          ],
        },
      ],
    },
  ],
  [
    "陕西/宝鸡",
    {
      status: "reviewed",
      candidates: [
        {
          title: "从宝鸡回重庆，走一段最美乡村路",
          author: "停停又走走的慢生活",
          url: "https://www.xiaohongshu.com/explore/68da55ec0000000012033842",
          accessedAt: "2026-08-22",
          decision:
            "strong-baoji-g244-to-gaojiang-road-sequence-needs-city-boundary-distance-surface-weather-parking-and-autumn-traffic-verification",
          evidence: [
            "正文给出宝鸡—太白县—江西营村，可选高速或G244，并明确弯道和大车较多、不建议新手",
            "作者将江西营村千年银杏树至高桥铺称为高江路精华段，认为弯道相对不多且秋季景观最佳",
            "路线随后进入留坝和汉中，正式数据必须拆分宝鸡市域与跨市区段，不能全部归入宝鸡",
            "评论中作者不建议大雨通行，且路线被认为绕行明显，需说明时间增量与天气门槛",
            "正式发布前需核验G244和高江路起终点、里程、路面、落石、停车、银杏季拥堵和返程方案",
          ],
        },
      ],
    },
  ],
  [
    "陕西/咸阳",
    {
      status: "reviewed",
      candidates: [
        {
          title: "去法门寺别走高速！陕西这条线美成云南",
          author: "北国的孩子",
          url: "https://www.xiaohongshu.com/explore/6a5e1e5f000000000f03f50b",
          accessedAt: "2026-08-22",
          decision:
            "promising-weihe-riverbank-corridor-needs-official-road-name-city-boundary-continuity-flood-control-parking-and-night-verification",
          evidence: [
            "正文给出宝鸡—扶风法门寺—咸阳杨陵观澜台—西安的省道河堤路走向，并称不走高速可经过田园和渭河湿地",
            "评论补充扶风县渭河大桥与河堤北路交汇点、绛帐镇附近以及渭河百里风景廊道等定位线索",
            "路线跨宝鸡、咸阳和西安，必须拆分咸阳市域杨陵段，且不能把路边摊与凉亭视为停车区",
            "河堤路涉及汛期水位、防洪封控、夜间照明和湿地保护，作者称夜间可看银河不构成夜驾建议",
            "正式发布前需核验官方路名、咸阳段起终点、连续通行、防洪管制、正规停车及湿地边界",
          ],
        },
      ],
    },
  ],
  [
    "陕西/渭南",
    {
      status: "reviewed",
      candidates: [
        {
          title: "📍沿黄公路自驾|起点华山，终点壶口",
          author: "是佳呀",
          url: "https://www.xiaohongshu.com/explore/6a7998b00000000005022c01",
          accessedAt: "2026-08-22",
          decision:
            "strong-weinan-to-hancheng-cultural-corridor-needs-exact-road-chain-landslide-status-distance-services-and-legal-heritage-access-verification",
          evidence: [
            "正文给出华山—魏长城遗址—丰图义仓—司马迁祠—韩城古城—壶口的两日沿黄公路线",
            "作者称整体路况良好但沿途补给少，并提示大部分道路远离黄河主河道、临河视野有限",
            "评论询问塌方时作者无法确认近期通行，说明施工与地灾状态必须实时核验",
            "魏长城等未商业化遗址不等于车辆可随意靠近或进入，文保边界和正规停车需单独确认",
            "正式发布前需拆出渭南市域段、核验道路编号、里程、塌方绕行、补给、停车和韩城衔接",
          ],
        },
      ],
    },
  ],
  [
    "陕西/延安",
    {
      status: "reviewed",
      candidates: [
        {
          title: "黄河乾坤湾免费观景台",
          author: "玉米爸爸",
          url: "https://www.xiaohongshu.com/explore/6a7bada9000000000502a2e1",
          accessedAt: "2026-08-22",
          decision:
            "reject-search-mismatch-route-is-pianguan-shanxi-not-yanchuan-shaanxi-and-includes-unsafe-roadside-stop",
          evidence: [
            "正文明确导航山西偏关县观音庙附近，河对岸为内蒙古，并非陕西延川乾坤湾",
            "帖子建议到路边后靠边停车再走小路，页面自身也标注含危险行为，平台不得采用",
            "评论称当地为铺装山路且弯多，但这些路况不能错误归入延安市域",
            "该候选明确作为搜索误匹配拒绝发布，也不提供所谓免费绕开景区入口的方法",
            "延安仍需补充延川沿黄观光路的真实道路编号、停车、景区边界和黄土高原地灾证据",
          ],
        },
      ],
    },
  ],
  [
    "陕西/汉中",
    {
      status: "reviewed",
      candidates: [
        {
          title: "太洋公路，景美路烂，谨慎选择",
          author: "阿蓝德龙",
          url: "https://www.xiaohongshu.com/explore/691aff6d000000000700b2e3",
          accessedAt: "2026-08-22",
          decision:
            "strong-taiyang-road-risk-source-needs-current-width-traffic-control-vehicle-size-weather-autumn-capacity-and-rescue-verification",
          evidence: [
            "正文明确太洋公路连接宝鸡太白县与汉中洋县，全程约150公里，并记录太白—黄柏塬—湑水河峡谷—华阳古镇方向",
            "作者称全程虽为铺装路，但黄柏塬之后部分路段仅容单车通行、会车困难",
            "彩林季车辆集中，房车和中巴进入会进一步加剧堵塞；作者因此临时在华阳古镇过夜",
            "大岭海拔约2400米，云雾、秋季低温与秦岭山区落石封控均需纳入取消条件",
            "正式发布前需核验当前路面、最窄点、车型限制、会车管制、补给通信、救援和旺季容量",
          ],
        },
      ],
    },
  ],
  [
    "陕西/榆林",
    {
      status: "reviewed",
      candidates: [
        {
          title: "沿黄自驾，竟然有这么美的黄河",
          author: "小枞树",
          url: "https://www.xiaohongshu.com/explore/69f31617000000003501c9af",
          accessedAt: "2026-08-22",
          decision:
            "scenic-demand-only-needs-yulin-specific-start-end-road-number-distance-toll-surface-services-and-charging-verification",
          evidence: [
            "作者称用两天完成沿黄河自驾并记录黄河景观，可证明沿黄路线的旅行需求",
            "正文没有给府谷、佳县或榆林市域内任何具体节点、道路编号、里程和路况",
            "评论仍在询问是否走高速、是否收费和有无充电站，关键执行信息全部缺失",
            "帖子无法证明画面属于陕西榆林段，也不能仅凭标题生成沿黄纯驾路线",
            "正式发布前需另找府谷—佳县实走证据，核验道路、黄河观景停车、补给、充电和黄土边坡风险",
          ],
        },
      ],
    },
  ],
  [
    "陕西/安康",
    {
      status: "reviewed",
      candidates: [
        {
          title: "西安自驾安康岚皋两日游攻略🚗",
          author: "小王来喽",
          url: "https://www.xiaohongshu.com/explore/6a818af300000000220102b9",
          accessedAt: "2026-08-22",
          decision:
            "promising-langao-qianchenghe-bashan-route-needs-road-number-distance-grade-weather-private-car-access-camping-and-night-return-verification",
          evidence: [
            "正文给出西安经高速至岚皋约3.5小时，再由县城驾车约1.5小时前往千层河、约20分钟到巴山大草原",
            "岚皋至千层河被描述为全程盘山公路且沿途山野景观较好，可形成安康市域路线线索",
            "作者称车辆当时可进入巴山大草原核心区，但这是景区管理信息，需重新核验车型、票务和开放时段",
            "夜间看星空后再走山路的建议风险较高，平台应要求在白天完成盘山驾驶并预留住宿",
            "正式发布前需核验道路编号、弯坡落石、私家车准入、停车露营、补给、通信和雨季地灾",
          ],
        },
      ],
    },
  ],
  [
    "陕西/商洛",
    {
      status: "reviewed",
      candidates: [
        {
          title: "包茂柞水你真的 太堵了!",
          author: "岁岁年年",
          url: "https://www.xiaohongshu.com/explore/6a74959d0000000028008f3a",
          accessedAt: "2026-08-22",
          decision:
            "retain-as-extreme-rain-closure-and-landslide-evidence-not-a-scenic-route-needs-official-live-closure-and-safe-shelter-plan",
          evidence: [
            "作者在暴雨中遇到镇安段包茂高速封闭，被迫下高速后发现国道同样中断，再返回等待高速恢复",
            "行程因高速、国道和终南山拥堵延长约6.5小时，重庆至西安最终耗时约16小时",
            "正文及评论记录山体滑坡、洪水和道路损坏风险，说明暴雨时不应尝试以国道绕行山区封路",
            "帖子属于突发灾害负面证据，不是风景路线；其当晚恢复情况不能代表当前通行",
            "平台应要求查官方路况和预警，遇封闭在镇安或安全城镇住宿，禁止进入河沟、滑坡区或自行探路",
          ],
        },
      ],
    },
  ],
  [
    "浙江/嘉兴",
    {
      status: "reviewed",
      candidates: [
        {
          title: "南北湖自驾的打开方式",
          author: "神奇猫",
          url: "https://www.xiaohongshu.com/explore/6a70c391000000002402e692",
          accessedAt: "2026-08-22",
          decision:
            "controlled-scenic-area-drive-needs-current-entry-hours-fee-private-car-access-loop-direction-parking-and-holiday-control-verification",
          evidence: [
            "正文仅明确南北湖景区存在上山、环湖自驾需求，没有给出可复现的起终点、道路编号、里程和行驶方向",
            "作者在评论中回复的‘9小时20块’含义不够清晰，可能涉及停车或准入收费，属于易变信息",
            "评论对节假日车辆能否进入的提问没有获得可靠答复，不能据此承诺私家车通行",
            "正式发布前需核验入口开放时间、收费、单向或环线组织、停车容量、节假日管制和恶劣天气限制",
          ],
        },
      ],
    },
  ],
  [
    "浙江/湖州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "天荒坪莫干山跑山路线分享（一看就会版）",
          author: "摇摇",
          url: "https://www.xiaohongshu.com/explore/6a6b11200000000025003418",
          accessedAt: "2026-08-22",
          decision:
            "promising-two-corridor-source-needs-separate-routes-exact-waypoints-road-access-traffic-control-parking-weather-and-no-offroad-verification",
          evidence: [
            "正文实际包含两条路线：天荒坪镇至江南天池的上下山公路，以及以莫干山庾村为起终点的盘山环线，正式数据应拆分",
            "天荒坪段描述了两处隧道、山顶附近停车线索；天池票价属于易变信息，不能直接沿用",
            "莫干山段弯道密集，作者建议早八点前避开车流，并明确提醒不得超速或越过中心线",
            "评论出现十八弯越野和大禹路线建议，但路权、路面与车辆适用性未证实，不纳入普通纯驾路线",
            "发布前需补齐精确途经点、当前交通管制、合法停车、天气取消条件和两条路线各自里程",
          ],
        },
      ],
    },
  ],
  [
    "浙江/绍兴",
    {
      status: "reviewed",
      candidates: [
        {
          title: "绍兴平王线，值得自驾一试！",
          author: "小西日记",
          url: "https://www.xiaohongshu.com/explore/68df3f2d000000000301dc2f",
          accessedAt: "2026-08-22",
          decision:
            "strong-pingwang-line-candidate-needs-official-road-id-legal-parking-holiday-capacity-village-road-access-and-water-safety-verification",
          evidence: [
            "正文明确平王线位于平水镇至王坛镇之间、约25公里，沿途为山林、稻田、溪流、水库和村落景观",
            "可复现节点包括锁泗桥、宋家店村和舜王庙，并提到西上人家、日铸山庄、王化古村等可选停靠点",
            "宋家店附近存在收费停车线索；正文所说其他位置自行选择不能替代合法停车核验",
            "节假日客流较大，评论提出经007乡道绕行月联、新联及驾车上桃岩岭，但均未验证道路准入和安全性",
            "发布前需核对正式道路编号、合法观景停车、假日容量、村道宽度与临水路段安全",
          ],
        },
      ],
    },
  ],
  [
    "浙江/金华",
    {
      status: "reviewed",
      candidates: [
        {
          title: "金华磐安悬崖挂壁自驾路线",
          author: "野人阿超",
          url: "https://www.xiaohongshu.com/explore/698b321e000000000b010306",
          accessedAt: "2026-08-22",
          decision:
            "high-risk-cross-city-cliff-road-source-needs-road-class-width-tunnel-clearance-vehicle-permission-meeting-points-rescue-and-land-rights-verification",
          evidence: [
            "正文给出磐安王堂坑村与台州天台雷远村两个端点，并称可从任一方向进入，路线跨金华与台州市界",
            "帖子同时标注越野与露营，但没有提供道路等级、里程、铺装状况、路权和安全设施",
            "评论集中追问会车、城市SUV适用性和约2米车辆能否通过隧洞，均未获得足够可靠的回答",
            "狭窄挂壁路一旦对向来车可能难以避让，现阶段标为高风险研究线索，不发布为普通纯驾路线",
            "采用前必须核验最窄宽度、净空、车型准入、会车点、通信救援、地灾和土地管理边界",
          ],
        },
      ],
    },
  ],
  [
    "浙江/衢州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "神秘关口岙，海拔918米，自驾摩旅爽歪歪",
          author: "游浙里",
          url: "https://www.xiaohongshu.com/explore/6a87085b000000002402f5af",
          accessedAt: "2026-08-22",
          decision:
            "strong-cross-city-niupiling-zhangzhe-line-candidate-needs-width-barrier-official-purpose-vehicle-limit-weather-services-and-boundary-splitting-verification",
          evidence: [
            "正文将牛皮岭山路、张柘线定位为江山张村乡至遂昌柘岱口乡之间的跨市道路，全程约28公里、约50分钟",
            "作者描述为双向铺装路，并给出江山东积村、关口岙、北洋村以及柘岱口村、双溪口村等复现节点",
            "关口岙存在混凝土限宽设施，作者以特定车型仅余少量间隙作参照，不能替代官方宽度和车型限制",
            "沿途几乎没有服务设施，补给住宿主要依赖两端；高海拔段还需核验雾、冰冻和边坡风险",
            "发布前需确认限宽设施用途、道路权属、车辆限制、救援通信，并按衢州与丽水边界正确拆分归属",
          ],
        },
      ],
    },
  ],
  [
    "浙江/舟山",
    {
      status: "reviewed",
      candidates: [
        {
          title: "🌊嵊泗左岸公路｜一半青山一半大海的浪漫",
          author: "云间有回音",
          url: "https://www.xiaohongshu.com/explore/6a637c570000000005039687",
          accessedAt: "2026-08-22",
          decision:
            "scenic-visual-clue-only-needs-car-ferry-booking-island-access-endpoints-distance-parking-weather-and-unfiltered-ground-view-verification",
          evidence: [
            "正文只能证明嵊泗左岸公路具有青山与海岸景观，没有给出起终点、里程、道路状况和停车信息",
            "评论询问汽车能否直接到达但没有可靠答复，另有租电动车建议，说明私家车及轮渡准入仍不明确",
            "多条评论质疑滤镜和画面与现场观感差异，因此不能仅凭视觉内容承诺景观效果",
            "该帖当前仅作为视觉线索，不生成纯驾路线；需补充车辆轮渡预约、岛内准入、端点、停车和大风停航条件",
          ],
        },
      ],
    },
  ],
  [
    "浙江/丽水",
    {
      status: "reviewed",
      candidates: [
        {
          title: "浙江最浪漫自驾 | 丽水山路520公路💗",
          author: "栗子梨liz",
          url: "https://www.xiaohongshu.com/explore/6a66b900000000001002b5f7",
          accessedAt: "2026-08-22",
          decision:
            "strong-lishui-520-loop-road-chain-needs-official-route-validation-total-time-surface-weather-services-parking-and-multi-day-planning-verification",
          evidence: [
            "正文称520公里心形环线从莲都出发，串联遂昌、松阳、龙泉、庆元、景宁、云和后回到莲都",
            "评论给出可复核道路链：古堰画乡—S210—X034—S324—松阳—遂昌—G528—龙泉—庆元—S326—荷地镇—X410—S325—S210—云和梯田—G322—G235—S210—大港头镇",
            "作者提到沿线主题驿站和服务设施，但没有说明总天数、分日节点、施工路况与山地风险",
            "评论对建议行驶天数的提问没有答案，520公里山路不能被包装为无需规划的一日普通自驾",
            "发布前需逐段核验道路链、实际里程与用时、铺装、天气地灾、补给停车，并形成多日拆分方案",
          ],
        },
      ],
    },
  ],
  [
    "河北/石家庄",
    {
      status: "reviewed",
      candidates: [
        {
          title: "石家庄平山最美乡村公路｜唐六线",
          author: "红炉绿酒",
          url: "https://www.xiaohongshu.com/explore/69e587c4000000002103b23f",
          accessedAt: "2026-08-22",
          decision:
            "strong-tangliu-rural-road-candidate-needs-official-road-id-full-route-surface-legal-parking-flood-season-and-riverside-access-verification",
          evidence: [
            "正文明确唐六线位于平山县，唐家沟村至六亩元村约40公里，沿文都河串联西柏坡与北部山区",
            "作者实际只走了南文都村附近的一小段，不能以局部体验证明全线当前路况",
            "评论补充孟家庄至苍蝇寨等支路景观，但水量、农肥气味与河道环境具有明显季节变化",
            "发布前需核验正式道路编号、全线铺装与宽度、合法停车、汛期封控、临水安全和露营管理规定",
          ],
        },
      ],
    },
  ],
  [
    "河北/唐山",
    {
      status: "reviewed",
      candidates: [
        {
          title: "蓟县233自驾公路｜完整攻略",
          author: "逛吃逛喝王小苒",
          url: "https://www.xiaohongshu.com/explore/6a78379c00000000220120a3",
          accessedAt: "2026-08-22",
          decision:
            "reject-search-mismatch-route-is-tianjin-jizhou-not-tangshan-needs-tangshan-local-233-or-qianxi-corridor-evidence",
          evidence: [
            "正文明确路线南起喜邦公路、北至津冀交界，并反复标注天津蓟县和于桥水库，不属于唐山市域",
            "31公里、233咖啡和九重弯等信息只能归入天津蓟州，不能因搜索词含唐山而错误写入唐山路线",
            "帖子还提醒不要只搜233国道以免进入施工段，说明同名道路检索本身存在误导风险",
            "该候选作为搜索误匹配拒绝发布，唐山仍需补充迁西、迁安或本地滨海公路的实走证据",
          ],
        },
      ],
    },
  ],
  [
    "河北/邯郸",
    {
      status: "reviewed",
      candidates: [
        {
          title: "自驾来啦～邯郸跑山路线！圣福天路&韩王九寨",
          author: "小馋丫头",
          url: "https://www.xiaohongshu.com/explore/68b6e0f1000000001c010029",
          accessedAt: "2026-08-22",
          decision:
            "promising-shengfu-sky-road-hanwang-jiuzhai-corridor-needs-exact-road-chain-grade-private-car-access-daylight-plan-and-mining-traffic-verification",
          evidence: [
            "正文给出顿井收费站—旅游大道—日月峰—圣福天路—韩王九寨的连续驾车线索，包含柏油盘山路、国道和县道",
            "日月峰前坡度较陡，韩王九寨内部山路弯急且可驾车至揽胜阁附近停车场，但景区准入需重新核验",
            "作者由韩王九寨前往峰峰矿区约60公里却用时约1.5小时，经过狭窄村道和矿区交通",
            "作者明确庆幸没有摸黑走该段，平台应要求白天完成并核验道路链、坡度、矿运车辆、停车和雨雾风险",
          ],
        },
      ],
    },
  ],
  [
    "河北/邢台",
    {
      status: "reviewed",
      candidates: [
        {
          title: "邢台游记之抗大路",
          author: "圣徒的几日游",
          url: "https://www.xiaohongshu.com/explore/6a01e01a0000000038037a3a",
          accessedAt: "2026-08-22",
          decision:
            "promising-kangda-road-candidate-needs-exact-start-road-id-distance-current-surface-legal-stops-water-activities-and-traffic-enforcement-verification",
          evidence: [
            "正文称抗大路至浆水镇二十多公里，沿途串联天梯山、东川口水库、连心渠和抗大纪念馆",
            "东川口水库路边亭子存在停车线索，但作者没有提供起点名称、道路编号和完整导航节点",
            "水量、漂流、坐船与野炊均属季节或经营信息，不能由一次枯水期行程推断全年可用",
            "作者因压实线收到处罚，路线提示必须强化车道线遵守，并核验合法停车、亲水安全与周末容量",
          ],
        },
      ],
    },
  ],
  [
    "河北/保定",
    {
      status: "reviewed",
      candidates: [
        {
          title: "冒大雨来的阜平72拐｜果然没让我失望",
          author: "荒野骑士",
          url: "https://www.xiaohongshu.com/explore/685cee4900000000170371c3",
          accessedAt: "2026-08-22",
          decision:
            "strong-fuping-72-bends-cross-province-candidate-needs-road-id-width-current-surface-rain-landslide-vehicle-suitability-and-two-day-splitting-verification",
          evidence: [
            "正文称阜平72拐约13公里、海拔约500至1000多米，急弯陡坡并连接河北阜平与山西灵丘方向",
            "可复现线索包括105乡道、灵丘上寨镇铜碌崖村，并建议经涞源形成跨省回程",
            "作者在大雨中行驶且以低车流评价路线，不能据此弱化雨季落石、滑坡、积水与救援风险",
            "北京往返约660公里不宜包装成轻松一日游，发布前需核验道路宽度、路面、车型适用性并优先拆为两日",
          ],
        },
      ],
    },
  ],
  [
    "河北/张家口",
    {
      status: "reviewed",
      candidates: [
        {
          title: "草原天路全程导航图",
          author: "金金",
          url: "https://www.xiaohongshu.com/explore/6a45bb170000000021016a4b",
          accessedAt: "2026-08-22",
          decision:
            "strong-three-section-grassland-sky-road-source-needs-section-endpoints-road-closures-weather-fuel-restrooms-fatigue-and-holiday-capacity-verification",
          evidence: [
            "作者端午实走草原天路三段并建议每段预留半天，评论称沽源至野狐岭方向山路约二百多公里",
            "补给节点包括沽源县城、桦皮岭附近、张北县城和尚义县城，并提醒提前加油、驿站休息及沽源段厕所较少",
            "中段两端高速较便利，可作为时间不足时的独立路线；中西段同日驾驶会产生明显疲劳",
            "发布前需从图片补齐三段精确端点，并核验季节开放、天气、施工封控、油站厕所、节假日拥堵和驾驶时长",
          ],
        },
      ],
    },
  ],
  [
    "河北/承德",
    {
      status: "reviewed",
      candidates: [
        {
          title: "🚙 去坝上，一定要走一次国家一号风景大道",
          author: "行行摄摄的老锺",
          url: "https://www.xiaohongshu.com/explore/6a2af701000000001c025647",
          accessedAt: "2026-08-22",
          decision:
            "strong-national-no1-scenic-avenue-source-needs-segmenting-heavy-truck-construction-road-number-fee-weather-and-holiday-traffic-verification",
          evidence: [
            "正文给出丰宁大滩起始点至御道口起始点的导航方法，并延伸至塞罕坝方向，作者补充全线约180公里",
            "作者承认景观并非全程连续，较强景观集中在御道口至塞罕坝附近大几十公里，适合按区段发布",
            "多条评论指出大滩段大货车较多且存在施工，路线体验和安全性与宣传标题存在落差",
            "发布前需核验道路编号、施工、大车交通、分段里程、停车、费用、风雨低温和节假日拥堵，避免夸大为全程景观路",
          ],
        },
      ],
    },
  ],
  [
    "河北/沧州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "🌊被低估的海边秘境！",
          author: "牛肉面不加面",
          url: "https://www.xiaohongshu.com/explore/69f4a326000000001b022e89",
          accessedAt: "2026-08-22",
          decision:
            "reject-search-mismatch-location-is-not-cangzhou-and-route-hides-place-name-needs-huanghua-local-coastal-road-evidence",
          evidence: [
            "正文故意以‘XX风车岛’隐藏地点，只描述爱心石滩、风车群和礁石，无法建立沧州市域路线",
            "猜你想搜指向江门风车岛，评论又称平潭等外省地点，证据彼此冲突且均非河北沧州",
            "帖子没有公路起终点、道路编号、里程和汽车合法抵达方式，不能因搜索结果出现而生成沧州沿海路线",
            "该候选作为误匹配拒绝，沧州仍需补充黄骅港、南大港或本地G228段的实走及官方路权证据",
          ],
        },
      ],
    },
  ],
  [
    "河北/廊坊",
    {
      status: "reviewed",
      candidates: [
        {
          title: "门头沟永定河自驾露营，今天刚踩点，情况有变",
          author: "大奔奔奔奔奔",
          url: "https://www.xiaohongshu.com/explore/6a47c512000000001702b5e0",
          accessedAt: "2026-08-22",
          decision:
            "reject-search-mismatch-location-is-beijing-mentougou-and-discourages-moving-barriers-offroad-riverbank-entry-or-closed-site-access",
          evidence: [
            "正文明确地点在北京门头沟下安路、下苇甸村附近，不属于河北廊坊",
            "原下道口已有锥桶且评论称入口曾封闭，平台不得采用人工挪开障碍进入河滩的做法",
            "帖子还涉及水库放水、湍急河流、铁路桥下道和封闭矿区，均不适合作为普通纯驾路线",
            "该候选作为误匹配和风险反例拒绝，廊坊需另找香河大运河、潮白河或本地合法公路证据",
          ],
        },
      ],
    },
  ],
  [
    "河北/衡水",
    {
      status: "reviewed",
      candidates: [
        {
          title: "本地人私藏！衡水湖傍晚环湖也太舒服了",
          author: "山经",
          url: "https://www.xiaohongshu.com/explore/6a1814d4000000000702a7c2",
          accessedAt: "2026-08-22",
          decision:
            "local-scenic-demand-clue-needs-road-name-full-loop-distance-car-access-parking-speed-control-wetland-protection-and-night-driving-verification",
          evidence: [
            "正文给出九州广场西侧至博览馆东侧、沿集美方向环行的本地傍晚兜风线索",
            "帖子没有证明这是完整环湖汽车路线，也没有提供道路名称、里程、停车和机动车准入信息",
            "评论只补充冀州一侧观景较好，不能替代衡水湖湿地保护区边界与当前交通规则核验",
            "发布前需确认合法汽车路线、限速、停车、夜间照明、鸟类保护季管制，并避免把散步骑行段误作驾车段",
          ],
        },
      ],
    },
  ],
  [
    "内蒙古/呼和浩特",
    {
      status: "reviewed",
      candidates: [
        {
          title: "呼市近郊环线自驾游记 牛马本就属于草原",
          author: "Woody光年",
          url: "https://www.xiaohongshu.com/explore/6a36ba3c000000001503f652",
          accessedAt: "2026-08-22",
          decision:
            "strong-red-cliff-highland-grassland-loop-needs-exact-road-chain-entry-rules-surface-vehicle-suitability-signal-services-and-holiday-traffic-verification",
          evidence: [
            "正文给出呼和浩特东站—红召九龙湾—红石崖—天赐草原—黄花窝铺—敕勒川草原的一日环线",
            "评论实走者提示高山牧场岔路、部分路段无信号且有较深坑洞，作者也无法确认轿车适用性",
            "九龙湾所谓不下车可免票属于景区动态准入信息，不得作为绕票方法发布",
            "正式发布前需核验完整道路链、景区穿行规则、路面与车型、厕所补给、通信及假日拥堵",
          ],
        },
      ],
    },
  ],
  [
    "内蒙古/包头",
    {
      status: "reviewed",
      candidates: [
        {
          title: "沿着黄河“几”字弯的自驾路线",
          author: "Lulu安",
          url: "https://www.xiaohongshu.com/explore/6a55ee900000000020039a39",
          accessedAt: "2026-08-22",
          decision:
            "multi-province-itinerary-needs-city-segment-extraction-road-numbers-charging-night-driving-and-separation-from-professional-desert-crossing",
          evidence: [
            "七日路线串联银川、榆林、鄂尔多斯、包头、巴彦淖尔、乌海和阿拉善，包头段明确为鄂尔多斯至包头约145公里并住宿春坤山",
            "包头至巴彦淖尔约220公里，沿阴山向西并经乌梁素海，可提取为铺装跨市走廊候选",
            "城市间以高速为主，帖子未给包头境内道路编号、沿途停车与夜间抵达春坤山的安全信息",
            "腾格里五湖部分必须专业四驱团队且普通改装车也可能陷车，必须与普通纯驾路线严格分离",
          ],
        },
      ],
    },
  ],
  [
    "内蒙古/乌海",
    {
      status: "reviewed",
      candidates: [
        {
          title: "从乌海到巴彦淖尔，绝美省道",
          author: "momo",
          url: "https://www.xiaohongshu.com/explore/6a76d54400000000080128fc",
          accessedAt: "2026-08-22",
          decision:
            "strong-cross-city-s315-corridor-needs-exact-road-chain-distance-current-potholes-heavy-trucks-flood-closures-and-attraction-access-verification",
          evidence: [
            "正文以乌海为起点，经穿越之门、S315、奈伦湖、西部梦幻峡谷、阿贵庙、鸡鹿塞、高阙塞至巴彦淖尔",
            "全线走玩约十小时，铺装路为主但有坑洞及柏油水泥接缝隆起，反向行驶大车更多",
            "鸡鹿塞普通SUV不能直接进入且暴雨时会封控，易发洪水，不能把景点支路纳入普通车辆主线",
            "发布前需核验道路链、里程、坑损、大车交通、汛期封闭、厕所补给及各景点合法停车",
          ],
        },
      ],
    },
  ],
  [
    "内蒙古/通辽",
    {
      status: "reviewed",
      candidates: [
        {
          title: "通辽→乌拉盖小众自驾完整游记（实测版）",
          author: "刘小花",
          url: "https://www.xiaohongshu.com/explore/6a5b5e1d000000000301da0f",
          accessedAt: "2026-08-22",
          decision:
            "strong-g304-ulagai-corridor-needs-current-construction-detour-surface-vehicle-grade-private-attraction-fees-services-and-daylight-return-verification",
          evidence: [
            "路线为通辽—鲁北镇—扎鲁特旗G304—霍林郭勒—可汗山—乌拉盖湖—银河马场—成功牧场",
            "可汗山至乌拉盖新路当时未开放，车辆必须走颠簸石子土路，轿车虽有通行案例但不代表适宜",
            "乌拉盖湖至银河马场环湖段是主要景观线，鲁北镇可补给，成功牧场收费与驾车上山规则易变",
            "平台需核验施工开放、道路等级、景区费用、服务通信，并要求避免夜间返回颠簸路段",
          ],
        },
      ],
    },
  ],
  [
    "内蒙古/鄂尔多斯",
    {
      status: "reviewed",
      candidates: [
        {
          title: "别再去响沙湾了！库布其07沙漠公路免费直达",
          author: "维克托",
          url: "https://www.xiaohongshu.com/explore/69c3fbe800000000230104b2",
          accessedAt: "2026-08-22",
          decision:
            "access-disputed-desert-road-needs-official-public-road-status-gate-permission-water-crossing-sand-drift-and-no-barrier-bypass-verification",
          evidence: [
            "正文称由南侧经解柴线进入07沙漠公路，并明确金漠酒店入口有门禁且只能出不能进",
            "评论同时存在园区不让进入、道闸不开和近期可通行等冲突信息，说明准入高度不稳定",
            "入口还涉及小门与短涉水段，平台不得指导绕门禁、走侧门或在未知路权下进入",
            "发布前必须由官方确认公共道路属性、入口许可、积水与流沙风险、车型限制和应急救援",
          ],
        },
      ],
    },
  ],
  [
    "内蒙古/呼伦贝尔",
    {
      status: "reviewed",
      candidates: [
        {
          title: "卡线封路，从七卡到五卡最新路段实况",
          author: "momo",
          url: "https://www.xiaohongshu.com/explore/6a797b8c00000000050339f0",
          accessedAt: "2026-08-22",
          decision:
            "retain-as-flood-closure-negative-evidence-not-normal-route-needs-official-live-status-and-paved-bypass-plan",
          evidence: [
            "作者因九卡封路改走室韦—恩和—七卡—乌兰山—五卡—黑山头，五卡出现积水、排队和车辆抛锚",
            "评论称水位约到膝盖、轿车被劝返或无法通过，作者以高底盘房车通过不能证明普通车辆安全",
            "卡线封闭和水位随降雨快速变化，阴雨天气应直接取消而非现场试水或跟车冒险",
            "该帖仅作为汛期负面证据，正式路线需接入官方实时封控并提供全铺装绕行方案",
          ],
        },
      ],
    },
  ],
  [
    "内蒙古/巴彦淖尔",
    {
      status: "reviewed",
      candidates: [
        {
          title: "巴彦淖尔阴山景观大道（上篇）",
          author: "陈大掰",
          url: "https://www.xiaohongshu.com/explore/68d9403d00000000130168d7",
          accessedAt: "2026-08-22",
          decision:
            "strong-yinshan-s311-x717-s508-candidate-needs-total-distance-surface-vehicle-access-wetland-heritage-protection-services-and-two-day-plan-verification",
          evidence: [
            "作者从呼和温都尔镇向西，以S311、X717、S508串联阴山岩画、高阙塞、知青湖、屠申泽湿地、沙海湖、鸡鹿塞和阿贵庙",
            "建议两日并在敖伦布拉格镇住宿，景点间车程多在半小时内，但总里程没有实测统计",
            "评论对轿车适用性仍有疑问，部分石刻或山内支路可能需要越野车，不能混入主线",
            "发布前需核验道路铺装、车型、湿地与文保边界、通信厕所、停车和两日分段里程",
          ],
        },
      ],
    },
  ],
  [
    "内蒙古/乌兰察布",
    {
      status: "reviewed",
      candidates: [
        {
          title: "乌兰察布自驾去黄花沟建议走这条路！！超美",
          author: "一一daily",
          url: "https://www.xiaohongshu.com/explore/6a36c876000000000f031370",
          accessedAt: "2026-08-22",
          decision:
            "promising-keliang-line-yellow-flower-valley-route-needs-full-road-chain-legal-stops-construction-night-lighting-wind-and-holiday-congestion-verification",
          evidence: [
            "正文称乌兰察布城区至黄花沟约1.5小时，核心为科凉线，双向道路总体好走且草原湖泊景观明显",
            "评论补充335和四胜路不能随意停车，集那线较窄且曾修桥，不能沿用正文靠边即停的说法",
            "沿线夜间缺少照明、风大，京新高速节假日卡口可能严重拥堵，应在天黑前返回",
            "发布前需从导航图补齐道路链，并核验施工、合法停车、景区停车、天气和假日交通",
          ],
        },
      ],
    },
  ],
  [
    "内蒙古/兴安",
    {
      status: "reviewed",
      candidates: [
        {
          title: "从乌兰浩特到阿尔山的绝美路线",
          author: "行走的王老师",
          url: "https://www.xiaohongshu.com/explore/6a68d5db000000001002564b",
          accessedAt: "2026-08-22",
          decision:
            "strong-ulan-hot-203-haosengou-aershan-route-needs-forest-park-through-access-ticket-hours-road-id-wildlife-weather-and-daylight-verification",
          evidence: [
            "道路链为乌兰浩特—G203黑羊山—不在马厩—明水河镇—好森沟—阿尔山国家森林公园西门",
            "作者实走约六至七小时，称好森沟至森林公园西门段路况和景观较好，G203主线可通行",
            "所谓从景区大门直穿至西门涉及森林公园票务、开放时段和车辆准入，不能只凭帖子确认",
            "发布前需核验景区穿行规则、道路编号、野生动物、低温雨雪、补给通信并保证白天完成",
          ],
        },
      ],
    },
  ],
  [
    "内蒙古/锡林郭勒",
    {
      status: "reviewed",
      candidates: [
        {
          title: "锡林郭勒99号公路自驾Tips",
          author: "能能💪",
          url: "https://www.xiaohongshu.com/explore/6a7742ad0000000025010528",
          accessedAt: "2026-08-22",
          decision:
            "promising-99-road-banlashan-baiyinhua-segment-needs-official-endpoints-distance-surface-signal-services-holiday-capacity-and-grassland-boundary-verification",
          evidence: [
            "作者认为半拉山向东至白音华方向是99号公路主要景观段，可由巴彦花镇方向进入",
            "起点旺季可能堵车一小时以上，绕半拉山切入只能在合法公共道路上规划，不能进入草场",
            "大片区域无手机信号，住宿距最近镇约一小时且旺季紧张，需提前下载离线地图和预订",
            "发布前需核验正式端点、里程、会车与路面、补给救援、假日容量，并严格禁止碾压私人草场",
          ],
        },
      ],
    },
  ],
  [
    "内蒙古/阿拉善",
    {
      status: "reviewed",
      candidates: [
        {
          title: "苍天般的阿拉善藏着一条绝美的梦想沙漠公路",
          author: "月月去旅行",
          url: "https://www.xiaohongshu.com/explore/6a3d4fb1000000001003cd50",
          accessedAt: "2026-08-22",
          decision:
            "strong-dream-desert-road-loop-needs-road-number-sand-drift-current-closure-range-charging-services-and-strict-no-off-pavement-rule",
          evidence: [
            "评论给出银川—月亮湖—梦想沙漠公路牌坊—定远营的约230公里环线，并建议在阿拉善住宿一晚",
            "正文明确提前下载离线地图、携带饮水并不得偏离主路，进入沙漠湖泊须换乘专业越野车辆",
            "风沙可能覆盖路面，作者提醒弯道不要让四轮离开铺装路，普通车辆存在漂移和陷车风险",
            "发布前需核验道路编号、流沙与封路、续航补给、通信救援，并把越野五湖穿越完全排除在纯驾路线外",
          ],
        },
      ],
    },
  ],
  [
    "黑龙江/哈尔滨",
    {
      status: "reviewed",
      candidates: [
        {
          title: "哈尔滨50km滨水大道东｜小众公路自驾2️⃣",
          author: "紫色花集",
          url: "https://www.xiaohongshu.com/explore/6a4258be000000000f015945",
          accessedAt: "2026-08-22",
          decision:
            "strong-hulan-riverside-avenue-candidate-needs-road-id-full-endpoint-current-construction-legal-stops-flood-season-and-livestock-crossing-verification",
          evidence: [
            "正文明确呼口大桥至滨水大道东端约50公里，终点可导航大顶子山温泉度假村，沿松花江湿地和田野行驶",
            "北环松花江特大桥当时仍在施工，预计通车时间属于易变信息，需核验当前交通组织",
            "沿途牛马可能横穿道路，江滩又受汛期水位影响，必须降低车速并设置季节取消条件",
            "发布前需确认道路编号、完整端点、施工状态、合法停车、临水安全和牲畜通行风险",
          ],
        },
      ],
    },
  ],
  [
    "黑龙江/齐齐哈尔",
    {
      status: "reviewed",
      candidates: [
        {
          title: "绝美自驾G111齐齐哈尔-加格达奇",
          author: "安可的笔记本",
          url: "https://www.xiaohongshu.com/explore/6a68d44c000000000401e549",
          accessedAt: "2026-08-22",
          decision:
            "strong-g111-qiqihar-jagdaqi-candidate-needs-toll-segments-speed-legal-stops-charging-services-wildlife-and-seasonal-weather-verification",
          evidence: [
            "作者由齐齐哈尔走双嫩高速，在拉哈或讷河转G111至加格达奇，全程约400多公里",
            "该段车速较高、部分国道路段收费，沿途有信号、服务区和充电站，但进入大兴安岭后服务显著减少",
            "作者所说宽敞处靠边停车不能替代合法停车核验，国道高速车流下临停风险较高",
            "发布前需核验收费、限速、停车、充电补给、野生动物、雾雪和跨区域分段归属",
          ],
        },
      ],
    },
  ],
  [
    "黑龙江/鸡西",
    {
      status: "reviewed",
      candidates: [
        {
          title: "绥芬河出发331国道鸡西矿山路段，美翻了",
          author: "七彩琉璃SZ",
          url: "https://www.xiaohongshu.com/explore/6a65bc9c000000000f0122c6",
          accessedAt: "2026-08-22",
          decision:
            "scenic-clue-only-needs-jixi-specific-start-end-distance-surface-mining-truck-traffic-parking-and-g331-construction-verification",
          evidence: [
            "正文仅确认由绥芬河方向沿G331经过鸡西煤矿与矿山公园路段，具有山野和矿山景观线索",
            "帖子未给鸡西市域起终点、里程、道路施工、停车和补给信息，无法形成可复现路线",
            "矿区道路可能存在货运车辆、扬尘和生产区域边界，不能仅凭风景标题判断适合普通旅行驾驶",
            "发布前需补充鸡西段精确节点、路况、大车交通、合法观景停车和G331当前施工证据",
          ],
        },
      ],
    },
  ],
  [
    "黑龙江/鹤岗",
    {
      status: "reviewed",
      candidates: [
        {
          title: "鹤岗→嘉荫G331醉美龙江边防路路况简析",
          author: "新桥的毛",
          url: "https://www.xiaohongshu.com/explore/6a7082dd0000000033010f71",
          accessedAt: "2026-08-22",
          decision:
            "strong-hegang-jiayin-g332-g331-candidate-needs-current-construction-fuel-services-wildlife-border-rules-weather-and-safe-stop-verification",
          evidence: [
            "路线由鹤岗经北疆收费站、G332汇入G331至嘉荫，接近300公里，作者边走边玩约6.5小时",
            "全程铺装为主但嘉荫附近有施工，沿途几乎无加油站和餐饮，必须提前加满油并备食物",
            "林区弯多且作者目击车辆冲沟，存在虎熊等野生动物风险，边境地区无人机受限",
            "发布前需核验施工封闭、收费、燃油补给、野生动物、雨雪雾、边境规定和合法停车点",
          ],
        },
      ],
    },
  ],
  [
    "黑龙江/双鸭山",
    {
      status: "reviewed",
      candidates: [
        {
          title: "八月G331边境行，饶河段江水漫堤",
          author: "徐州非周末户外:自然",
          url: "https://www.xiaohongshu.com/explore/6a83fc960000000033009394",
          accessedAt: "2026-08-22",
          decision:
            "retain-as-flood-warning-evidence-not-normal-scenic-route-needs-official-water-level-closure-and-inland-bypass",
          evidence: [
            "作者在8月18日沿G331抵达饶河，记录乌苏里江汛期水位上涨并已漫至沿江公路边",
            "帖子只证明双鸭山饶河段存在严重临江洪水风险，没有完整起终点、绕行和道路通行信息",
            "江水漫堤时不得以观景为由继续贴水行驶或停车，应服从封控并远离堤岸",
            "该帖仅作为汛期负面证据，正式路线需接入官方水位和封路信息并提供内陆铺装绕行方案",
          ],
        },
      ],
    },
  ],
  [
    "黑龙江/佳木斯",
    {
      status: "reviewed",
      candidates: [
        {
          title: "天津到抚远东极 G331电车自驾 第十天",
          author: "汤师爷",
          url: "https://www.xiaohongshu.com/explore/6a81bcdf0000000006004efa",
          accessedAt: "2026-08-22",
          decision:
            "strong-fuyuan-tongjiang-jiamusi-candidate-needs-g331-g102-road-chain-construction-charging-heavy-trucks-wetland-and-border-stop-verification",
          evidence: [
            "路线为抚远沿G331至同江三江口，再经哈同高速至佳木斯，全程约426公里、约6.5小时",
            "抚远至同江路况平坦开阔并有三江平原湿地景观，作者另建议以G102避开部分高速施工，但大车更多",
            "同江三江口附近充电慢且可能另收停车费，主要补电点在佳木斯，电车需留足续航冗余",
            "发布前需核验道路链、施工、充电、货车交通、湿地保护、边境停车和临江警戒线",
          ],
        },
      ],
    },
  ],
  [
    "黑龙江/七台河",
    {
      status: "reviewed",
      candidates: [
        {
          title: "一条很深的老山路",
          author: "Will",
          url: "https://www.xiaohongshu.com/explore/694ab90b000000001e0359b7",
          accessedAt: "2026-08-22",
          decision:
            "reject-search-mismatch-route-is-yiwu-zhejiang-not-qitaihe-and-lacks-public-road-location-evidence",
          evidence: [
            "正文只描述半小时水泥老山路且没有地点、道路编号和端点，无法证明与七台河有关",
            "评论明确询问‘义乌呀’，作者回复确认，实际地点在浙江义乌而非黑龙江七台河",
            "作者还将未铺柏油的未知山路想象为跑山路线，不能据此判断公共路权与普通车辆适用性",
            "该候选作为搜索误匹配拒绝，七台河仍需补充本地合法铺装风景公路的实走证据",
          ],
        },
      ],
    },
  ],
  [
    "黑龙江/牡丹江",
    {
      status: "reviewed",
      candidates: [
        {
          title: "G333好像被低估了",
          author: "我骑一只猴🐵",
          url: "https://www.xiaohongshu.com/explore/6a5454e10000000008003bbc",
          accessedAt: "2026-08-22",
          decision:
            "promising-yabuli-mudanjiang-g333-yaxue-road-needs-exact-segment-distance-weather-ice-forest-wildlife-services-and-motorcycle-bias-verification",
          evidence: [
            "正文明确推荐亚布力至牡丹江段G333，又称亚雪公路，称铺装路况良好、车流较少且弯道景观突出",
            "帖子以摩托跑山体验为主，没有里程、服务点、汽车停车和实际驾驶时长",
            "林区弯道、雨雾、冬季冰雪和野生动物风险均未覆盖，不能仅凭低车流鼓励追求驾驶速度",
            "发布前需核验精确端点、里程、季节路况、除雪封闭、补给救援和合法观景停车",
          ],
        },
      ],
    },
  ],
  [
    "黑龙江/黑河",
    {
      status: "reviewed",
      candidates: [
        {
          title: "⚠️黑河→呼玛 G331自驾提醒！",
          author: "志远天下行",
          url: "https://www.xiaohongshu.com/explore/6a8447180000000028004885",
          accessedAt: "2026-08-22",
          decision:
            "retain-as-construction-closure-and-official-detour-evidence-needs-live-status-fuel-services-tire-risk-and-daylight-plan",
          evidence: [
            "黑河至三卡约100公里当时可走，三卡至老道店约60公里施工颠簸，老道店前方被劝导封闭",
            "作者按引导绕北疆乡至呼玛，多走约120公里，全程七至八小时，评论称强行前进易托底扎胎",
            "北疆乡绕行虽铺装较好且风景较好，也不能脱离官方现场引导自行选择未知支路",
            "该帖作为施工封闭证据，发布前必须核验实时路况、官方绕行、燃油补给、轮胎救援并要求白天完成",
          ],
        },
      ],
    },
  ],
  [
    "黑龙江/绥化",
    {
      status: "reviewed",
      candidates: [
        {
          title: "国庆自驾小兴安岭环线【行程篇】（附攻略）",
          author: "躲猫猫🐈",
          url: "https://www.xiaohongshu.com/explore/6a7da8b5000000003400f974",
          accessedAt: "2026-08-22",
          decision:
            "reject-city-mismatch-itinerary-does-not-enter-suihua-needs-local-wetland-farmland-or-suihua-yichun-corridor-evidence",
          evidence: [
            "正文路线为哈尔滨—鹤岗—伊春—汤旺—嘉荫—鹤岗—哈尔滨，没有任何绥化市域节点",
            "涉及G222、乌带公路、G331、依兰旅游公路、朗依公路和桃南公路，均不能因搜索结果而归入绥化",
            "作者还提醒单人驾驶会疲劳、国庆部分景区拥堵，这些只能作为小兴安岭行程证据",
            "该候选作为城市误匹配拒绝，绥化需另找本地湿地、农田或绥化—伊春走廊的实走证据",
          ],
        },
      ],
    },
  ],
  [
    "黑龙江/大兴安岭",
    {
      status: "reviewed",
      candidates: [
        {
          title: "大兴安岭环线全女自驾攻略🚗路线篇",
          author: "全蛋小猪",
          url: "https://www.xiaohongshu.com/explore/6a698f3f000000000f005971",
          accessedAt: "2026-08-22",
          decision:
            "reject-administrative-mismatch-route-is-mainly-hulunbuir-inner-mongolia-needs-heilongjiang-daxinganling-local-evidence",
          evidence: [
            "六日路线从海拉尔出发，经额尔古纳、根河、莫尔道嘎、室韦、卡线和黑山头后回海拉尔，主要位于内蒙古呼伦贝尔",
            "路线虽使用大兴安岭地理概念，但没有进入黑龙江大兴安岭地区的加格达奇、塔河、呼玛或漠河",
            "帖子还记录根白线冻土沉降、无信号、充电稀少及可能需要防火与边防手续，只适用于其实际区域",
            "该候选作为行政区误匹配拒绝，需另找黑龙江大兴安岭本地G111、G331或加漠公路证据",
          ],
        },
      ],
    },
  ],
  [
    "江苏/南京",
    {
      status: "reviewed",
      candidates: [
        {
          title: "南京自驾路线--石臼湖➕固城湖",
          author: "什莫嘛",
          url: "https://www.xiaohongshu.com/explore/69c925c7000000002200d6dc",
          accessedAt: "2026-08-22",
          decision:
            "strong-shijiu-gucheng-lake-loop-needs-road-chain-current-access-legal-parking-flood-season-wetland-protection-and-night-return-verification",
          evidence: [
            "正文给出龙眠大道经S246、X303、S243、G235、宁高公路、石臼湖大桥至固城湖及Y117的完整道路链",
            "可由樟树脚新村沿Y117至湖边，并可经环湖线和S269返程，具有较强可复现性",
            "正文所谓路边随意停车不可采用，湖区道路、桥梁和湿地边界必须核验合法停车点",
            "发布前需确认道路准入、停车、丰水期水位、候鸟保护、夜间照明和返程时间",
          ],
        },
      ],
    },
  ],
  [
    "江苏/无锡",
    {
      status: "reviewed",
      candidates: [
        {
          title: "无锡自驾封神｜太湖七里风光堤 枕着湖浪过",
          author: "彬彬粑粑的旅行日记",
          url: "https://www.xiaohongshu.com/explore/6a5064f000000000110074d5",
          accessedAt: "2026-08-22",
          decision:
            "promising-mashan-qili-scenic-causeway-needs-exact-endpoints-overnight-parking-camping-rules-storm-waves-toilets-and-lakeside-safety-verification",
          evidence: [
            "正文定位无锡马山七里风光堤，沿环湖公路至太湖马山景观石，称铺装路况良好且限速慢行",
            "沿路有停车区域但没有公共厕所，作者所说车内过夜和草坪露营均需重新核验管理规定",
            "帖子记录台风外围仍有较大湖浪，评论也因台风取消行程，强风暴雨时应关闭路线推荐",
            "发布前需补齐端点、停车与过夜规则、厕所、风浪预警、临水护栏和节假日容量",
          ],
        },
      ],
    },
  ],
  [
    "江苏/徐州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "徐州小众山野｜雨天自驾治愈满分",
          author: "风停在此处",
          url: "https://www.xiaohongshu.com/explore/6a350b17000000001603f3bb",
          accessedAt: "2026-08-22",
          decision:
            "visual-clue-only-hidden-location-needs-public-road-identity-endpoints-surface-parking-wind-turbine-land-rights-and-rain-safety-verification",
          evidence: [
            "正文描述湖畔公路、风车山顶和停车体验，并由作者确认地点在徐州，但不公开具体位置或导航",
            "大量评论只能通过私信索取地址，无法从公开正文验证道路端点、路权、里程和合法停车",
            "雨天进入风电或山顶区域可能涉及湿滑、雷电、生产道路和土地管理边界",
            "该帖仅作为视觉线索，发布前需另找公开道路证据并核验停车、风场准入和恶劣天气限制",
          ],
        },
      ],
    },
  ],
  [
    "江苏/常州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "强推溧阳一号公路自驾路线",
          author: "超级赛亚小能人",
          url: "https://www.xiaohongshu.com/explore/6a6749ad000000001101c669",
          accessedAt: "2026-08-22",
          decision:
            "scenic-demand-clue-needs-lake-no1-road-section-endpoints-distance-legal-stops-holiday-capacity-and-attraction-access-verification",
          evidence: [
            "正文确认溧阳一号公路和天目湖周边为平坦柏油路，工作日车流与景点客流较少",
            "帖子没有给出南线、北线或具体起终点、里程和可复现导航节点",
            "工作日低客流不能推断周末和节假日容量，拍照也不得占用车道或临时停车",
            "发布前需补齐具体区段、道路编号、停车、景区车辆准入、假日交通和骑行混行风险",
          ],
        },
      ],
    },
  ],
  [
    "江苏/苏州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "苏州环西山岛自驾｜沿太湖一路奔赴湖山浪漫",
          author: "三皮游记📸",
          url: "https://www.xiaohongshu.com/explore/6a6489c7000000001302c82b",
          accessedAt: "2026-08-22",
          decision:
            "strong-xishan-counterclockwise-loop-needs-road-names-distance-island-access-legal-parking-holiday-orchard-traffic-and-lakeside-weather-verification",
          evidence: [
            "作者补充逆时针路线为太湖大桥—东村古村—横山岛—包山禅寺—大如意圣境—明月湾古村，并可选石公山、林屋洞",
            "环岛铺装路况较好且有临时停车位线索，但横山岛、阴山岛道路较窄，会车需慢行",
            "枇杷、杨梅等旺季可能带来果园与旅游交通，非旺季体验不能代表高峰容量",
            "发布前需核验道路名称、里程、合法停车、小岛汽车准入、湖区天气和旺季拥堵",
          ],
        },
      ],
    },
  ],
  [
    "江苏/南通",
    {
      status: "reviewed",
      candidates: [
        {
          title: "一站式打卡！南通烟雨海岸自驾完整路线",
          author: "再靠近一些~",
          url: "https://www.xiaohongshu.com/explore/6a3aa7a80000000015027262",
          accessedAt: "2026-08-22",
          decision:
            "promising-nantong-coastal-chain-needs-road-numbers-distance-tidal-weather-port-truck-traffic-attraction-hours-and-legal-stops-verification",
          evidence: [
            "正文串联启东圆陀角、吕四渔港、通州湾灯塔和海印寺，形成南通黄海岸线自驾节点链",
            "帖子没有道路编号、分段里程、驾驶时长和停车信息，所谓完整路线仍不足以直接导航",
            "渔港和通州湾可能有港区货车、潮汐、强风和生产管制，雨天也会降低能见度",
            "发布前需核验道路链、港区准入、货运交通、潮汐大风、景点开放和合法停车点",
          ],
        },
      ],
    },
  ],
  [
    "江苏/淮安",
    {
      status: "reviewed",
      candidates: [
        {
          title: "盱眙百里画廊（洪泽湖旅游公路盱眙段）",
          author: "找一颗成熟葡萄",
          url: "https://www.xiaohongshu.com/explore/6a87b6b60000000033026bd1",
          accessedAt: "2026-08-22",
          decision:
            "strong-hongze-lake-xuyi-gallery-candidate-needs-road-id-total-distance-flood-control-wetland-protection-legal-stops-water-safety-and-current-access-verification",
          evidence: [
            "路线明确为三河闸南首—堆头—沙溪—白鹭洲—马浪岗—十里营，沿洪泽湖旅游公路盱眙段向西",
            "正文区分桥上禁停和桥边辅道观景台，并给出马浪岗简易停车区等停靠线索",
            "三河闸、湿地、浅滩和湖堤受水位、防洪调度及候鸟保护影响，亲水活动需额外安全核验",
            "发布前需确认道路编号、总里程、闸区通行、合法停车、汛期封控、湿地保护和水深风险",
          ],
        },
      ],
    },
  ],
  [
    "江苏/扬州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "扬州邵伯湖，是藏在身边的小惊喜",
          author: "浅夏诗韵",
          url: "https://www.xiaohongshu.com/explore/69540c08000000002200936e",
          accessedAt: "2026-08-22",
          decision:
            "visual-location-clue-only-needs-public-car-route-road-id-distance-dike-access-parking-bird-protection-and-flood-season-verification",
          evidence: [
            "正文仅给出邵伯湖沿湖村湖堤，作者在评论建议导航沿湖村，可证明湖景目的地需求",
            "帖子以航拍和候鸟画面为主，没有确认湖堤是否允许社会车辆连续通行或形成环线",
            "候鸟迁徙期、湖堤防洪管理和航拍规定均需核验，不能以视觉画面替代道路证据",
            "发布前需补充公共汽车路线、端点、里程、停车、堤坝准入、汛期和鸟类保护限制",
          ],
        },
      ],
    },
  ],
  [
    "江苏/镇江",
    {
      status: "reviewed",
      candidates: [
        {
          title: "钻进镇江深山里，整条公路被密林包裹",
          author: "快门侠",
          url: "https://www.xiaohongshu.com/explore/6a41201c000000000603058e",
          accessedAt: "2026-08-22",
          decision:
            "reject-as-private-car-route-private-cars-cannot-enter-shili-changshan-needs-public-road-alternative",
          evidence: [
            "正文明确地点为镇江十里长山林间公路，同时明确私家车无法上山",
            "游客需在飞行基地联系工作人员乘坐万福宫咖啡店专线接驳车，属于受控交通而非纯驾路线",
            "因此不得把接驳车拍摄画面包装为用户可自行驾驶进入的森林公路",
            "该候选拒绝发布为纯驾路线，镇江需另找茅山或本地允许社会车辆通行的公共公路证据",
          ],
        },
      ],
    },
  ],
  [
    "江苏/泰州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "真的是江苏‼️发朋友圈都以为我又去了阿勒泰",
          author: "春情阿茶",
          url: "https://www.xiaohongshu.com/explore/69fb18970000000037035ba6",
          accessedAt: "2026-08-22",
          decision:
            "reject-as-pure-drive-source-it-is-a-ticketed-wetland-and-city-attraction-itinerary-needs-public-scenic-road-evidence",
          evidence: [
            "正文为早茶—溱湖湿地公园—溱潼古镇—鹊仙岛—泰州老街的一日景区游览，不是旅行公路路线",
            "溱湖湿地公园需检票乘船进入，核心景点依靠景区电瓶车或步行，不能由私家车连续穿行",
            "帖子对门票预约和演出等信息具有时效性，也没有任何公共道路端点、里程和路况",
            "该候选拒绝作为纯驾路线，泰州需另找允许汽车通行的溱湖外围或江堤公共公路证据",
          ],
        },
      ],
    },
  ],
  [
    "江苏/宿迁",
    {
      status: "reviewed",
      candidates: [
        {
          title: "江苏骆马湖环湖线",
          author: "为万世开太平",
          url: "https://www.xiaohongshu.com/explore/69a052b4000000001a02b358",
          accessedAt: "2026-08-22",
          decision:
            "route-map-clue-only-needs-extractable-waypoints-car-ferry-status-road-id-distance-parking-flood-control-and-cross-city-boundary-verification",
          evidence: [
            "帖子确认存在骆马湖环湖轨迹，作者称路线由轨迹软件转制且目前不收费",
            "正文没有可读取的途经点、道路编号、总里程和分段路况，评论还追问是否需要轮渡但未获回答",
            "骆马湖跨宿迁与徐州区域，湖堤通行、轮渡和防洪管理可能随季节变化",
            "发布前需从原图提取节点并核验汽车轮渡、道路归属、停车、汛期封控和跨市拆分",
          ],
        },
      ],
    },
  ],
  [
    "山东/济南",
    {
      status: "reviewed",
      candidates: [
        {
          title: "济南出发80km，这条自驾线藏了瀑布、红山路和",
          author: "把快乐吹膨胀",
          url: "https://www.xiaohongshu.com/explore/6a5b8540000000000301d44a",
          accessedAt: "2026-08-22",
          decision:
            "strong-jinan-tai-shan-foothill-loop-needs-road-chain-correction-width-parking-fire-registration-water-safety-and-cross-city-splitting-verification",
          evidence: [
            "路线为卧虎山水库—西沟村—并药路—锦云川水库—药乡森林公园—开明路—天烛胜境—天平湖公园",
            "全程铺装且药乡段爬升约800米，但评论指出并药路狭窄并有乱停车问题",
            "部分林区要求防火登记并携带身份证，水边游泳建议不得采用，需核验合法亲水区域",
            "发布前需纠正导航节点、核验路宽停车、防火准入、汛期水域安全并按济南泰安边界拆分",
          ],
        },
      ],
    },
  ],
  [
    "山东/淄博",
    {
      status: "reviewed",
      candidates: [
        {
          title: "淄博必驾055线路",
          author: "以理服任先生",
          url: "https://www.xiaohongshu.com/explore/6a22ba92000000002101a723",
          accessedAt: "2026-08-22",
          decision:
            "scenic-clue-only-needs-official-road-id-endpoints-distance-surface-legal-parking-water-access-camping-and-fire-safety-verification",
          evidence: [
            "正文提到王村方向、055线路、小黄山豆腐店及山顶咖啡，可作为博山山区路线线索",
            "帖子没有公开起终点、里程、道路等级和路况，无法生成可复现纯驾路线",
            "所谓下水边烧烤露营涉及水域、消防和土地管理，不能作为默认可用信息",
            "发布前需核验055正式道路身份、端点、铺装、停车、露营与森林防火规定",
          ],
        },
      ],
    },
  ],
  [
    "山东/枣庄",
    {
      status: "reviewed",
      candidates: [
        {
          title: "山东自驾天花板！枣庄318保姆级路线直接抄",
          author: "再靠近一些~",
          url: "https://www.xiaohongshu.com/explore/69f376e80000000036033ae5",
          accessedAt: "2026-08-22",
          decision:
            "promising-shanting-318-candidate-needs-official-road-chain-distance-surface-cliff-parking-seasonal-waterfall-and-attraction-access-verification",
          evidence: [
            "路线串联翼云阁、翼云湖、曹山顶悬崖观景台、十道峪瀑布、庄里水库，另有实走评论确认节点基本一致",
            "帖子未给道路编号、总里程、用时、停车和悬崖路段防护信息",
            "瀑布受季节水量影响，不能承诺全年景观；悬崖观景台和水库准入也需核验",
            "发布前需补齐道路链、铺装宽度、停车、季节水量、临崖安全和景点车辆准入",
          ],
        },
      ],
    },
  ],
  [
    "山东/潍坊",
    {
      status: "reviewed",
      candidates: [
        {
          title: "齐鲁天路临朐青州段攻略",
          author: "Z_",
          url: "https://www.xiaohongshu.com/explore/6a20e60c0000000006035635",
          accessedAt: "2026-08-22",
          decision:
            "strong-qilu-sky-road-two-segment-source-needs-road-rights-gates-width-legal-stops-weather-services-and-separate-route-publication",
          evidence: [
            "临朐青州段为淹子岭村—老婆顶—隐士村—八岐山—轿顶山—黑虎山水库，约90公里、约3.5小时",
            "安丘段另为齐鲁天路入口—法兴寺—风车观景台—梯田—五龙山，约45公里，应拆成独立路线",
            "道路多为无中心线水泥路且不是单行，需慢速会车；沿途缺少公厕，部分景区和露营地收费",
            "发布前需核验道路权属、门禁、宽度、停车、天气地灾、补给并避免把景区绕票写法纳入",
          ],
        },
      ],
    },
  ],
  [
    "山东/济宁",
    {
      status: "reviewed",
      candidates: [
        {
          title: "蓝天下白云下I行驶济宁崇德大道",
          author: "生命信仰",
          url: "https://www.xiaohongshu.com/explore/6a76688e0000000028030dd9",
          accessedAt: "2026-08-22",
          decision:
            "urban-expressway-scenic-clue-needs-exact-entry-exit-distance-speed-camera-stopping-prohibition-weather-and-current-traffic-verification",
          evidence: [
            "正文确认崇德大道连接曲阜东站与济宁主城区，主路双向六车道、全封闭且无信号灯，约半小时",
            "沿途可见泗河大桥、平原农田和村落，但属于快速道路而非可随停观景公路",
            "帖子没有精确入口出口、里程和限速信息，任何拍摄都必须在车内安全完成且禁止停车",
            "发布前需核验当前交通、限速抓拍、匝道节点、恶劣天气和全线禁停规则",
          ],
        },
      ],
    },
  ],
  [
    "山东/泰安",
    {
      status: "reviewed",
      candidates: [
        {
          title: "泰安周末好去处14✨东岳胜境公路",
          author: "泰安人在泰安",
          url: "https://www.xiaohongshu.com/explore/6a12e390000000000702e579",
          accessedAt: "2026-08-22",
          decision:
            "strong-s103-dongyue-scenic-road-candidate-needs-official-segment-width-two-way-traffic-legal-stops-rain-fog-fire-and-attraction-access-verification",
          evidence: [
            "S103东岳胜境公路由济南界至徂徕山约57.4公里，精华盘山段约19公里，可从东御道、黄山头村或小津口驿站进入",
            "沿途串联小津口观景台、天烛胜境、天龙水库、玉泉寺和药乡森林公园",
            "道路为双向且窄弯多，没有独立步道，需低速会车并只在正式观景台停车",
            "发布前需核验道路区段、停车、雨雾湿滑、森林防火、景点准入和节假日容量",
          ],
        },
      ],
    },
  ],
  [
    "山东/临沂",
    {
      status: "reviewed",
      candidates: [
        {
          title: "鲁南地区最近爆火的一条自驾路线-马田公路",
          author: "游子",
          url: "https://www.xiaohongshu.com/explore/6a404b9900000000070252f5",
          accessedAt: "2026-08-22",
          decision:
            "visual-clue-only-needs-feixian-matian-road-endpoints-distance-surface-river-access-parking-and-unfiltered-ground-view-verification",
          evidence: [
            "搜索与评论将路线定位在费县大青山附近马田公路，但正文没有任何可读取的道路节点和路况",
            "当地评论质疑滤镜和所谓阿勒泰景观，称实地可能只是杂草河滩，视觉宣传需谨慎",
            "导航甚至可能指向河道，不能依据短视频画面引导车辆进入未知临水支路",
            "发布前需补充公共道路端点、里程、铺装、停车、河道准入和未滤镜实地证据",
          ],
        },
      ],
    },
  ],
  [
    "山东/德州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "码住！🇺🇸德州的德国小镇Fredericksburg",
          author: "Melissa的彩色生活",
          url: "https://www.xiaohongshu.com/explore/6a794e6000000000220172d0",
          accessedAt: "2026-08-22",
          decision:
            "reject-search-mismatch-texas-usa-not-dezhou-shandong-needs-local-yellow-river-or-canal-road-evidence",
          evidence: [
            "正文明确地点为美国Texas中部Fredericksburg，并标注美国生活和美国旅行",
            "内容为酒店、商业街和餐厅游记，不涉及山东德州市域或任何本地旅行公路",
            "该候选因中英文同名搜索误匹配，必须拒绝归入山东德州",
            "德州仍需补充本地黄河故道、运河或允许社会车辆通行的风景公路证据",
          ],
        },
      ],
    },
  ],
  [
    "山东/聊城",
    {
      status: "reviewed",
      candidates: [
        {
          title: "探寻豫鲁21：自驾的福音，黄河大堤公路",
          author: "老幽",
          url: "https://www.xiaohongshu.com/explore/69d5f3a6000000001a026476",
          accessedAt: "2026-08-22",
          decision:
            "reject-city-mismatch-route-is-lankao-dongming-heze-not-liaocheng-needs-liaocheng-local-yellow-river-segment-evidence",
          evidence: [
            "正文路线由河南兰考至范县并跨黄河浮桥，评论导航建议为兰考县至东明县不走高速",
            "帖子标签和搜索提示指向菏泽、郓城等地，没有证据证明路线进入聊城市域",
            "浮桥通行和防洪管理也属于动态信息，不能仅凭跨省大堤体验生成聊城路线",
            "该候选作为城市误匹配拒绝，聊城需另找本地黄河段或东昌湖周边公共公路证据",
          ],
        },
      ],
    },
  ],
  [
    "山东/滨州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "滨州黄河大堤自驾｜赴一场母亲河的浩荡之约",
          author: "波比Q",
          url: "https://www.xiaohongshu.com/explore/6a2e8e470000000035029787",
          accessedAt: "2026-08-22",
          decision:
            "local-scenic-demand-clue-needs-exact-dike-section-road-id-distance-flood-control-gates-floating-bridge-parking-and-current-access-verification",
          evidence: [
            "正文确认可在滨州沿黄河大堤向东行驶，沿途为黄河、村庄和绿野景观",
            "帖子没有起终点、道路编号、里程、浮桥或停车信息，无法直接形成可复现路线",
            "黄河大堤首先承担防洪功能，汛期、施工和管理闸门可能限制社会车辆通行",
            "发布前需核验具体堤段、路权、浮桥、停车、汛期封控和临河安全",
          ],
        },
      ],
    },
  ],
  [
    "山东/菏泽",
    {
      status: "reviewed",
      candidates: [
        {
          title: "终于有人讲菏泽-滨州-东营大堤路线了",
          author: "Li~茉~莉~",
          url: "https://www.xiaohongshu.com/explore/6a013eae00000000080017a8",
          accessedAt: "2026-08-22",
          decision:
            "aspirational-route-map-clue-only-needs-actual-drive-evidence-road-chain-distance-dike-access-ferries-services-and-city-segment-splitting",
          evidence: [
            "标题提出菏泽—滨州—东营黄河大堤长线，但正文只说改天走一遍，作者并未实际驾驶验证",
            "帖子没有任何道路节点、里程、路况、浮桥、补给或防洪封控信息",
            "跨三市大堤不能作为一条已验证路线发布，必须按行政区和实际可通行堤段拆分",
            "采用前需取得实走证据并核验道路链、堤坝准入、轮渡浮桥、停车、汛期和服务设施",
          ],
        },
      ],
    },
  ],
  [
    "辽宁/沈阳",
    {
      status: "reviewed",
      candidates: [
        {
          title: "不用远行！沈阳藏着一条绝美的风车盘山路！",
          author: "去做风吧",
          url: "https://www.xiaohongshu.com/explore/6a86b0da000000002702aa4d",
          accessedAt: "2026-08-22",
          decision:
            "visual-clue-only-needs-exact-fengche-road-location-public-road-endpoints-distance-surface-access-and-legal-stops-verification",
          evidence: [
            "标题、辽宁属地和话题确认这是沈阳周边风车盘山路的自驾视觉线索",
            "可读取详情未给出道路名称、导航点、起终点、里程或铺装状况，无法形成可复现纯驾车路线",
            "帖子同时含骑行、徒步和山顶话题，不能推定全部画面均来自允许社会车辆通行的公共道路",
            "发布前需核验具体位置、道路权属、出入口、会车宽度、风机作业区准入和合法停车点",
          ],
        },
      ],
    },
  ],
  [
    "辽宁/鞍山",
    {
      status: "reviewed",
      candidates: [
        {
          title: "不用去新疆！辽宁藏着一条封神盘山独库公路",
          author: "去做风吧",
          url: "https://www.xiaohongshu.com/explore/6a4e1ec100000000170099d4",
          accessedAt: "2026-08-22",
          decision:
            "reject-city-mismatch-tags-point-to-fushun-benxi-not-anshan-needs-qianshan-or-xiuyan-public-scenic-road-evidence",
          evidence: [
            "详情话题明确指向抚顺、本溪及沈阳周边，没有鞍山、千山或岫岩定位证据",
            "搜索因辽宁盘山公路泛词将其混入鞍山结果，不能据此建立鞍山市路线",
            "正文未提供道路名、起终点或导航节点，也无法把画面安全映射到公共道路",
            "该候选按城市错配拒绝，鞍山仍需补充千山或岫岩范围内可供社会车辆通行的风景公路证据",
          ],
        },
      ],
    },
  ],
  [
    "辽宁/抚顺",
    {
      status: "reviewed",
      candidates: [
        {
          title: "抚顺最美乡村路，抚金线公路",
          author: "抚顺小鹏",
          url: "https://www.xiaohongshu.com/explore/681a01640000000021007d5b",
          accessedAt: "2026-08-22",
          decision:
            "local-fujin-road-visual-clue-needs-official-road-id-endpoints-distance-surface-village-traffic-season-and-stops-verification",
          evidence: [
            "标题和抚顺属地话题明确给出抚金线乡村公路，可作为本地风景公路线索",
            "内容以航拍视频展示道路和乡村景观，但没有可读取的起终点、里程或沿途节点",
            "乡村公路可能混行村民、农机和慢行交通，不能因画面开阔而默认适合高速通过或随停拍摄",
            "发布前需核验官方道路编号、两端导航点、铺装、会车、季节景观和合法停车位置",
          ],
        },
      ],
    },
  ],
  [
    "辽宁/本溪",
    {
      status: "reviewed",
      candidates: [
        {
          title: "本溪去大冰沟小桥线真的不能走大家听劝",
          author: "hakuna",
          url: "https://www.xiaohongshu.com/explore/6a644372000000001b01eb59",
          accessedAt: "2026-08-22",
          decision:
            "retain-negative-road-condition-evidence-do-not-recommend-xiaoqiao-line-until-current-official-and-ground-verification",
          evidence: [
            "作者从铁刹山前往大冰沟时误入小桥线，明确提醒该线不宜通行",
            "实走反馈包括大车较多、碎石坑、水坑和泥坑，并目击车辆陷车",
            "这类动态路况不能反向包装成越野风景路线，也不能仅凭普通轿车个别通过记录推荐",
            "在取得近期官方通告、天气、施工及连续实地路况前，应对小桥线保持不推荐并提供替代主路",
          ],
        },
      ],
    },
  ],
  [
    "辽宁/锦州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "G228上的盘锦红海滩与锦州笔架山",
          author: "Viviane",
          url: "https://www.xiaohongshu.com/explore/6a0d59c7000000003502455a",
          accessedAt: "2026-08-22",
          decision:
            "cross-city-g228-coastal-corridor-clue-needs-jinzhou-segment-endpoints-distance-current-alignment-tide-crosswind-and-legal-stops-verification",
          evidence: [
            "标题明确将G228沿海走廊中的盘锦红海滩与锦州笔架山串联，具备跨市滨海路线价值",
            "候选未给出锦州市域内具体起终点、里程和道路节点，不能直接生成逐向导航路线",
            "笔架山体验受潮汐影响，沿海公路还需考虑横风、景区车流和禁止临停路段",
            "发布前需按最新G228线位拆出锦州段，并核验潮汐、施工、停车和景区开放信息",
          ],
        },
      ],
    },
  ],
  [
    "辽宁/营口",
    {
      status: "reviewed",
      candidates: [
        {
          title: "📍在营口，走山访海（附详细路线）",
          author: "营口旅游小地主",
          url: "https://www.xiaohongshu.com/explore/6999863b000000000a031e4c",
          accessedAt: "2026-08-22",
          decision:
            "local-mountain-to-sea-itinerary-clue-needs-exact-road-chain-driving-only-split-distance-surface-tide-parking-and-current-access-verification",
          evidence: [
            "标题明确为营口本地走山访海的详细路线，适合作为山海组合需求线索",
            "当前可读取详情未稳定呈现完整节点链，无法确认哪些段落属于纯驾车、步行或景区内部交通",
            "滨海段可能受潮汐、横风和旺季车流影响，山路段则需核验坡度、弯道和铺装",
            "采用前需恢复完整正文并拆出公共道路链，补充里程、停车、潮汐和当前准入信息",
          ],
        },
      ],
    },
  ],
  [
    "辽宁/阜新",
    {
      status: "reviewed",
      candidates: [
        {
          title: "沈阳自驾阜新彰武一日游路线➕吃啥…",
          author: "彤行木子咩",
          url: "https://www.xiaohongshu.com/explore/6a8275a6000000003400fba8",
          accessedAt: "2026-08-22",
          decision:
            "promising-zhangwu-day-drive-clue-needs-road-names-distances-surface-grassland-access-hours-fees-and-return-route-verification",
          evidence: [
            "正文给出沈阳—靖王府—味里香—德力格尔草原—沈阳的顺序，并记录往返油费和过路费",
            "作者称前往德力格尔草原有一段公共交通难叫车，因此更适合自驾",
            "路线仍缺具体道路编号、分段里程、草原末端路况以及景区准入和停车说明",
            "发布前需核验实际道路链、铺装、开放时间、收费、草原防火和返程疲劳风险",
          ],
        },
      ],
    },
  ],
  [
    "辽宁/辽阳",
    {
      status: "reviewed",
      candidates: [
        {
          title: "📍辽阳最美公路",
          author: "沈阳溜达玩（攻略版）",
          url: "https://www.xiaohongshu.com/explore/69fdec6d000000003501fd07",
          accessedAt: "2026-08-22",
          decision:
            "visual-clue-only-needs-road-name-endpoints-distance-surface-nine-hairpins-public-access-and-legal-stops-verification",
          evidence: [
            "标题和搜索定位确认辽阳存在最美公路视觉需求，相关结果同时提到辽宁小川藏线和连续发卡弯",
            "可读取详情未给出道路名称、导航点、里程或完整正文，无法确认是否就是同一条公路",
            "盘山发卡弯路线必须核验公共通行权、会车宽度、护栏和雨雾湿滑风险",
            "发布前需取得明确端点和道路编号，并核验铺装、交通管制、停车和近期实走证据",
          ],
        },
      ],
    },
  ],
  [
    "辽宁/盘锦",
    {
      status: "reviewed",
      candidates: [
        {
          title: "G228辽宁段！沿海自驾太治愈",
          author: "辽宁文旅",
          url: "https://www.xiaohongshu.com/explore/69f31e96000000003700d7e5",
          accessedAt: "2026-08-22",
          decision:
            "strong-cross-city-g228-itinerary-clue-needs-current-alignment-city-segment-splitting-distance-crosswind-tide-wetland-season-and-stops-verification",
          evidence: [
            "正文给出大连金石滩与滨海路、营口鲅鱼圈与辽河老街、盘锦红海滩风景廊道的三日顺序",
            "帖子称G228整体路况好，同时特别提醒部分近海路段存在横风",
            "盘锦段体验强烈依赖碱蓬草季相和候鸟迁徙，不能用五一嫩绿色素材代表秋季红海滩",
            "发布前需按当前G228线位拆分盘锦段，核验里程、潮汐横风、湿地保护、景区停车和合法观景点",
          ],
        },
      ],
    },
  ],
  [
    "辽宁/铁岭",
    {
      status: "reviewed",
      candidates: [
        {
          title: "沈阳1h｜铁岭·免费360°观景台🏞️ 美哭了～",
          author: "小野记 🍊",
          url: "https://www.xiaohongshu.com/explore/6a0fe41c0000000037036b72",
          accessedAt: "2026-08-22",
          decision:
            "destination-clue-not-yet-driving-route-needs-qingyunsi-longwangding-road-endpoints-surface-gradient-parking-opening-and-last-mile-verification",
          evidence: [
            "标签将目的地定位为铁岭青云寺、龙王顶玉皇阁及360度观景台，距沈阳约一小时是作者口径",
            "详情主要证明观景目的地热度，没有给出可复现的公路起终点、道路名或分段里程",
            "免费观景台不等于全程可驾车直达，末段可能包含步行、陡坡或景区管理道路",
            "生成纯驾车路线前需核验公共道路端点、坡度铺装、停车场、开放时间和末段步行距离",
          ],
        },
      ],
    },
  ],
  [
    "辽宁/朝阳",
    {
      status: "reviewed",
      candidates: [
        {
          title: "📍2026.8.14 l北票大黑山徙步20公里",
          author: "天天向上",
          url: "https://www.xiaohongshu.com/explore/6a7ee3ea0000000029031bff",
          accessedAt: "2026-08-22",
          decision:
            "reject-as-pure-driving-route-hiking-evidence-only-needs-separate-public-tourist-road-candidate-for-chaoyang",
          evidence: [
            "正文明确为北票大黑山20公里徒步，完整游览约26公里，并非纯驾车路线",
            "可确认景区有大型停车场和柏油路，但主体路线包含台阶、栈道、土路、陡坡及辅助绳",
            "五月冰景区当时仍在建设且部分路线需原路折返，不能把景区内部步道包装成旅游公路",
            "该候选仅保留目的地和停车证据；朝阳仍需另找允许社会车辆连续通行的大黑山旅游公路或凌源盘山公路",
          ],
        },
      ],
    },
  ],
  [
    "辽宁/葫芦岛",
    {
      status: "reviewed",
      candidates: [
        {
          title: "D12 葫芦岛｜辽西走廊·东北海岸",
          author: "挡风玻璃外的世界",
          url: "https://www.xiaohongshu.com/explore/6a852cbc0000000006005e6f",
          accessedAt: "2026-08-22",
          decision:
            "travel-log-visual-clue-needs-g228-or-coastal-road-chain-endpoints-distance-surface-tide-crosswind-parking-and-current-access-verification",
          evidence: [
            "标题将葫芦岛定位为自驾行程第12日的辽西走廊和东北海岸，具备滨海长线视觉线索",
            "可读取详情未给出具体公路、兴城或绥中节点、里程及路况，无法直接生成导航路线",
            "搜索结果同时出现北戴河至沈阳公路记录和东戴河路线，说明跨城内容容易被误归入葫芦岛",
            "发布前需锁定G228或滨海公路实际道路链，并核验潮汐、横风、停车、旺季拥堵和当前通行状态",
          ],
        },
      ],
    },
  ],
  [
    "安徽/合肥",
    {
      status: "reviewed",
      candidates: [
        {
          title: "合肥秋名山：庐南川藏线-六道弯跑山攻略",
          author: "FayBIU",
          url: "https://www.xiaohongshu.com/explore/6a71c18d000000003301e8eb",
          accessedAt: "2026-08-22",
          decision:
            "strong-lunan-scenic-road-clue-needs-official-endpoints-distance-gradient-traffic-weather-and-legal-stops-verification",
          evidence: [
            "正文将路线定位在庐江县庐南川藏线双顶山段，导航点为双顶山六道弯观景台",
            "作者实走反馈为连续发卡弯和大陡坡，主要使用一二挡，并称道路已修好、入口有指示牌",
            "停车拍摄应限于明确停车位和观景台，不能在发卡弯或坡道临停",
            "发布前需核验官方道路端点、里程、坡度、会车宽度、天气及当前交通管理",
          ],
        },
      ],
    },
  ],
  [
    "安徽/芜湖",
    {
      status: "reviewed",
      candidates: [
        {
          title: "芜湖·西形古道➕响水涧油菜花 不堵车攻略",
          author: "立野🍸野！",
          url: "https://www.xiaohongshu.com/explore/69b80e83000000001a02723d",
          accessedAt: "2026-08-22",
          decision:
            "mixed-hike-and-seasonal-drive-clue-needs-driving-only-split-one-way-control-season-parking-and-road-chain-verification",
          evidence: [
            "正文给出峨桥镇、东形公交站停车场、西形古道和响水涧的组合行程",
            "主体西形古道为约六小时徒步，纯驾车部分仅是返程穿过响水涧油菜花田",
            "作者遇到响水涧单向交通管制和花期停车拥堵，说明通行方向与季节高度动态",
            "采用前须拆出公共驾车道路链并核验花期管制、停车、拥堵和油菜花季相",
          ],
        },
      ],
    },
  ],
  [
    "安徽/蚌埠",
    {
      status: "reviewed",
      candidates: [
        {
          title: "漫步行驶珠城畅游淮河堤顶风景道(加长版)",
          author: "途锐光赫",
          url: "https://www.xiaohongshu.com/explore/6a8020c00000000022033bd8",
          accessedAt: "2026-08-22",
          decision:
            "local-huaihe-dike-visual-clue-needs-exact-endpoints-distance-flood-control-access-surface-and-stops-verification",
          evidence: [
            "标题明确为蚌埠珠城淮河堤顶风景道的车辆行驶记录",
            "正文只有城市漫步和行驶记录标签，没有起终点、里程或路况说明",
            "堤顶道路首先承担防洪功能，汛期、施工和闸口可能限制社会车辆",
            "发布前需核验具体堤段、路权、铺装、防汛封控和合法停车位置",
          ],
        },
      ],
    },
  ],
  [
    "安徽/淮南",
    {
      status: "reviewed",
      candidates: [
        {
          title: "舜耕山环山公路",
          author: "小众男神经",
          url: "https://www.xiaohongshu.com/explore/693807b7000000000d00f1c4",
          accessedAt: "2026-08-22",
          decision:
            "cycling-evidence-only-needs-motor-vehicle-access-endpoints-distance-hours-and-mixed-traffic-verification",
          evidence: [
            "正文确认淮南舜耕山环山公路，并建议清晨5:30至7:30避开人流和观薄雾",
            "证据来自晨骑而非汽车实走，不能据此推定机动车全线可通行",
            "清晨薄雾会降低能见度，环山路还可能混行骑行者和行人",
            "生成纯驾车路线前需核验机动车准入、端点、里程、开放时段和停车点",
          ],
        },
      ],
    },
  ],
  [
    "安徽/马鞍山",
    {
      status: "reviewed",
      candidates: [
        {
          title: "南京周末瞎溜达（7）｜博望横山",
          author: "小熊软糖（打工版）",
          url: "https://www.xiaohongshu.com/explore/6a81d98c0000000032023ac9",
          accessedAt: "2026-08-22",
          decision:
            "destination-road-clue-not-scenic-drive-needs-motor-access-endpoint-parking-gradient-and-viewpoint-verification",
          evidence: [
            "正文定位马鞍山博望横山，并明确台阶或公路均可上山",
            "作者认为沿途视野大多被草木遮挡，公路本身并非高质量连续观景路线",
            "山顶太阳宫观景台仅有向东视野，且帖子未说明车辆能否直达",
            "采用前需核验机动车准入、道路终点、坡度铺装、停车及末段步行距离",
          ],
        },
      ],
    },
  ],
  [
    "安徽/淮北",
    {
      status: "reviewed",
      candidates: [
        {
          title: "皖北川藏线｜自驾龙脊天路",
          author: "Simon",
          url: "https://www.xiaohongshu.com/explore/6a8047440000000021023cef",
          accessedAt: "2026-08-22",
          decision:
            "local-route-demand-clue-needs-city-boundary-endpoints-distance-surface-gradient-and-current-opening-verification",
          evidence: [
            "标题明确把龙脊天路称为皖北川藏线并标注自驾，搜索定位在淮北范围",
            "可读取详情没有正文、节点、里程或路况，证据强度不足以直接发布",
            "同名龙脊天路也出现在宿州搜索结果中，必须核验行政边界和实际道路归属",
            "发布前需取得端点、道路编号、铺装坡度、开放状态和近期实走记录",
          ],
        },
      ],
    },
  ],
  [
    "安徽/铜陵",
    {
      status: "reviewed",
      candidates: [
        {
          title: "最美乡村公路,行在乡村,游在路上",
          author: "小洋子",
          url: "https://www.xiaohongshu.com/explore/68e6156d000000000301f21a",
          accessedAt: "2026-08-22",
          decision:
            "reject-province-mismatch-route-is-shaanxi-liuba-not-tongling-anhui-needs-local-wanjiang-road-evidence",
          evidence: [
            "正文导航为银昆高速江西营出口，并串联江西营村、高桥铺、柴关岭、情人谷和留坝互通",
            "这些节点属于陕西留坝方向，不是安徽铜陵皖江风景道",
            "该结果由泛化的乡村公路搜索误召回，不能归入铜陵路线库",
            "铜陵仍需补充本地江堤、浮山或允许社会车辆通行的乡村风景公路证据",
          ],
        },
      ],
    },
  ],
  [
    "安徽/安庆",
    {
      status: "reviewed",
      candidates: [
        {
          title: "来安庆千万不要晚上走同马大堤",
          author: "米粥不加糖",
          url: "https://www.xiaohongshu.com/explore/6a26e59d000000003502dc58",
          accessedAt: "2026-08-22",
          decision:
            "retain-negative-night-driving-evidence-avoid-after-dark-needs-daytime-access-flood-control-and-road-condition-verification",
          evidence: [
            "作者实走安庆同马大堤24公里，明确提醒不要夜间行驶",
            "全段无路灯、来车稀少，车灯范围外完全黑暗，主观驾驶压力很高",
            "堤顶道路还可能受汛期、防洪管理和临水风险影响，不能包装为夜景路线",
            "仅在核验白天准入、路况、防汛封控和救援条件后考虑日间候选",
          ],
        },
      ],
    },
  ],
  [
    "安徽/黄山",
    {
      status: "reviewed",
      candidates: [
        {
          title: "自驾218国道黄山段，美到心醉",
          author: "欣菲Lee",
          url: "https://www.xiaohongshu.com/explore/6a86e6340000000017002f60",
          accessedAt: "2026-08-22",
          decision:
            "promising-g218-huangshan-scenic-corridor-needs-exact-segment-distance-current-alignment-village-traffic-and-legal-stops-verification",
          evidence: [
            "正文确认按导航驾驶G218黄山段，沿途可见皖南古村、青瓦白墙和山地绿景",
            "帖子没有给出具体起终点、里程和经过村名，尚不足以生成可复现路线",
            "作者提到停车记录沿途景观，但国道和村道不能默认可随意临停",
            "发布前需核验G218当前线位、具体区段、村镇混行、施工和合法停车点",
          ],
        },
      ],
    },
  ],
  [
    "安徽/滁州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "南京出发｜电车自驾每周玩一地儿-滁州风景道",
          author: "Anita",
          url: "https://www.xiaohongshu.com/explore/685e26540000000012022e8a",
          accessedAt: "2026-08-22",
          decision:
            "strong-chuhe-scenic-road-clue-needs-exact-segment-distance-surface-curve-safety-charging-and-current-access-verification",
          evidence: [
            "正文给出花山至施集、李集至皇甫山景区两段滁河风景道，并串联井楠村",
            "入口提示为滁梁路与G328交界的花山乡路口，沿井楠茗宿路牌进入",
            "沿线包含茶园、村庄和多弯山路，井楠村与民宿有充电桩，但需防范村镇混行",
            "发布前需核验两段连接方式、里程、铺装、弯道限速、充电可用性和景区开放",
          ],
        },
      ],
    },
  ],
  [
    "安徽/阜阳",
    {
      status: "reviewed",
      candidates: [
        {
          title: "阜阳宝藏路线‖阜阳-五里湖-临淮岗-城西湖",
          author: "苇名城的小铁匠",
          url: "https://www.xiaohongshu.com/explore/6a03f290000000003601d39e",
          accessedAt: "2026-08-22",
          decision:
            "cycling-route-clue-needs-driving-only-road-chain-dike-access-distance-vehicle-legality-and-flood-control-verification",
          evidence: [
            "正文给出阜阳—颍上五里湖—临淮岗—霍邱城西湖约200公里往返节点链",
            "作者称沿途多为柏油路，经过公园、坝埂、环湖绿道及省国道，补给较便利",
            "该路线为骑行规划，环湖绿道和部分坝埂未必允许机动车进入",
            "转成纯驾车路线前需逐段核验车辆准入、防汛封控、道路编号、里程和停车",
          ],
        },
      ],
    },
  ],
  [
    "安徽/宿州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "龙脊天路（皖北川藏线）通车了",
          author: "爱上小爱的su7",
          url: "https://www.xiaohongshu.com/explore/679906eb000000002901d70d",
          accessedAt: "2026-08-22",
          decision:
            "opening-clue-only-needs-exact-jurisdiction-endpoints-official-opening-surface-distance-and-traffic-verification",
          evidence: [
            "标题宣称龙脊天路即皖北川藏线已经通车，搜索将其定位到宿州周边",
            "详情没有可读取正文、端点、道路编号或官方通车依据",
            "同一路名也被淮北内容使用，行政归属与跨市范围不能靠搜索结果判断",
            "发布前需用官方资料和近期实走核验辖区、端点、里程、铺装及当前通行状态",
          ],
        },
      ],
    },
  ],
  [
    "安徽/六安",
    {
      status: "reviewed",
      candidates: [
        {
          title: "安徽六安马丁公路超级版自驾路线",
          author: "毛头苏",
          url: "https://www.xiaohongshu.com/explore/69201718000000000d03c58c",
          accessedAt: "2026-08-22",
          decision:
            "high-demand-martin-road-clue-needs-exact-super-loop-nodes-distance-surface-season-weather-services-and-current-closure-verification",
          evidence: [
            "标题明确定位安徽六安马丁公路超级版自驾路线，互动量显示路线需求较高",
            "可读取详情未提供正文和节点，不能仅凭标题生成所谓超级版环线",
            "搜索结果同时出现深山碎石路惊险反馈，说明不同支线和导航误入风险必须区分",
            "发布前需取得完整节点链并核验铺装、季节天气、封路、补给和车型适配",
          ],
        },
      ],
    },
  ],
  [
    "安徽/亳州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "驶入曹操故里亳州，正式踏进安徽皖北。",
          author: "琢玉",
          url: "https://www.xiaohongshu.com/explore/6a630bd5000000000f005250",
          accessedAt: "2026-08-22",
          decision:
            "city-arrival-travel-log-not-scenic-road-needs-local-guohe-or-rural-public-road-evidence",
          evidence: [
            "标题和详情只能确认作者驾车抵达曹操故里亳州并进入皖北",
            "帖子没有路线正文、道路名称、起终点、里程或沿途风景节点",
            "到达城市的旅行记录不能等同于亳州本地风景公路",
            "该候选仅保留需求线索，仍需补充涡河沿线或乡村公共道路的可复现证据",
          ],
        },
      ],
    },
  ],
  [
    "安徽/池州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "池州318/237国道还是挺美的",
          author: "池州好风光",
          url: "https://www.xiaohongshu.com/explore/6a5c0cb6000000000401c4d8",
          accessedAt: "2026-08-22",
          decision:
            "visual-clue-only-needs-separate-g318-g237-segments-endpoints-distance-surface-season-and-legal-stops-verification",
          evidence: [
            "标题和正文确认池州G318与G237国道具有车窗风景，但没有区分两条道路的具体区段",
            "评论补充G237春季有大片油菜花，属于季节性个人观察而非全年稳定景观",
            "帖子没有端点、里程、路况或停车信息，不能合并为一条导航路线",
            "发布前需分别核验G318和G237池州段线位、铺装、施工、花期和合法停车点",
          ],
        },
      ],
    },
  ],
  [
    "河南/郑州",
    {
      status: "reviewed",
      candidates: [
        {
          title: "郑州必驾公路｜藏在黄河边的电影感🌿超治愈",
          author: "nonozuo",
          url: "https://www.xiaohongshu.com/explore/6a338e0b000000000702929f",
          accessedAt: "2026-08-22",
          decision:
            "yellow-river-road-visual-clue-needs-exact-endpoints-distance-flood-control-access-and-legal-stops-verification",
          evidence: [
            "标题和话题确认郑州黄河边自驾公路需求",
            "可读取详情没有道路名、端点或里程，无法复现",
            "沿黄道路可能受防汛和生态管理限制",
            "发布前需核验具体堤段、路权、停车及汛期状态",
          ],
        },
      ],
    },
  ],
  [
    "河南/开封",
    {
      status: "reviewed",
      candidates: [
        {
          title: "避雷：不要自驾电车去开封市",
          author: "我真的痛恨上班",
          url: "https://www.xiaohongshu.com/explore/69da5c160000000023010515",
          accessedAt: "2026-08-22",
          decision:
            "retain-urban-ev-and-congestion-risk-evidence-not-a-scenic-road-route",
          evidence: [
            "作者反馈汉兴路附近充电位常被燃油车或乱停车辆占用",
            "景区周边道路存在机动车、三轮车、电动车与行人混行",
            "该内容是城市自驾风险而非风景公路",
            "路线发布应补充已核验充电点、停车和错峰建议",
          ],
        },
      ],
    },
  ],
  [
    "河南/洛阳",
    {
      status: "reviewed",
      candidates: [
        {
          title: "洛阳最美旅游公路，此生必驾石张线。",
          author: "表哥的旅行笔记",
          url: "https://www.xiaohongshu.com/explore/6a057e60000000003700c098",
          accessedAt: "2026-08-22",
          decision:
            "local-shizhang-road-visual-clue-needs-endpoints-distance-road-id-surface-weather-and-stops-verification",
          evidence: [
            "标题明确定位洛阳石张线旅游公路",
            "详情以图片为主，缺少端点、里程和路况正文",
            "山地旅游公路需核验弯坡、落石和雨雪风险",
            "发布前需取得道路编号、导航节点和近期实走证据",
          ],
        },
      ],
    },
  ],
  [
    "河南/平顶山",
    {
      status: "reviewed",
      candidates: [
        {
          title: "平顶山自驾｜杜鹃岭+文殊寺 一日赏花攻略",
          author: "灵月户外记录",
          url: "https://www.xiaohongshu.com/explore/69f83045000000003502d63c",
          accessedAt: "2026-08-22",
          decision:
            "destination-itinerary-clue-needs-driving-only-road-chain-flower-season-parking-and-access-verification",
          evidence: [
            "标题确认杜鹃岭与文殊寺可组成平顶山一日自驾候选",
            "可读取详情未呈现完整道路链与里程",
            "赏花景观受花期影响且景点内部可能需要步行",
            "采用前需拆出公共驾车段并核验停车、准入和季相",
          ],
        },
      ],
    },
  ],
  [
    "河南/安阳",
    {
      status: "reviewed",
      candidates: [
        {
          title: "郑州自驾2h | 河南滑县，中国小麦第一县",
          author: "阿吉在路上",
          url: "https://www.xiaohongshu.com/explore/6a70aa0d0000000032021856",
          accessedAt: "2026-08-22",
          decision:
            "promising-rural-arrival-route-needs-exact-national-road-segment-distance-season-and-safe-stops-verification",
          evidence: [
            "正文给出连霍高速、京武高速、荷宝高速牛屯站再转国道至滑县",
            "牛屯后沿途为玉米地与平原云景，并串联道口、瓦岗寨和千翠湖",
            "帖子未给出国道编号和分段里程",
            "发布前需核验线位、农忙混行、季节景观和合法停车点",
          ],
        },
      ],
    },
  ],
  [
    "河南/鹤壁",
    {
      status: "reviewed",
      candidates: [
        {
          title: "2026年8月8日从红豆峡到林州市走花壶线",
          author: "似水流年",
          url: "https://www.xiaohongshu.com/explore/6a8855ed000000003300babd",
          accessedAt: "2026-08-22",
          decision:
            "cross-city-huahuxian-current-drive-clue-needs-hebi-jurisdiction-endpoints-surface-closure-and-weather-verification",
          evidence: [
            "标题记录红豆峡至林州花壶线的近期实走",
            "路线跨太行山区且可能跨市，未证明鹤壁市域具体区段",
            "详情缺少文字路况、端点和通行限制",
            "采用前需核验辖区、铺装、落石、临时封控与天气",
          ],
        },
      ],
    },
  ],
  [
    "河南/新乡",
    {
      status: "reviewed",
      candidates: [
        {
          title: "南太行最新封闭路段提醒别再按旧攻略跑空！",
          author: "星空自驾-小熊",
          url: "https://www.xiaohongshu.com/explore/6a87effe0000000014029cc0",
          accessedAt: "2026-08-22",
          decision:
            "retain-dynamic-closure-warning-do-not-publish-static-south-taihang-route-without-official-current-check",
          evidence: [
            "标题明确提醒南太行存在最新封闭路段，旧攻略可能失效",
            "详情未稳定呈现具体封闭节点，不能猜测绕行",
            "山区封控可能随施工、降雨和地灾变化",
            "所有新乡南太行路线发布前必须查官方通告并提供替代主路",
          ],
        },
      ],
    },
  ],
  [
    "河南/焦作",
    {
      status: "reviewed",
      candidates: [
        {
          title: "穿越南太行｜国道207（乌海线）穿越记录",
          author: "爱游逛啊！",
          url: "https://www.xiaohongshu.com/explore/6a1283e60000000007013070",
          accessedAt: "2026-08-22",
          decision:
            "strong-g207-cross-mountain-clue-needs-current-official-opening-tunnel-safety-distance-and-no-stopping-rule-verification",
          evidence: [
            "正文给出焦作修武云台山镇至山西陵川的G207区段",
            "海拔约由100米升至近1200米，包含19个隧道及8个连续U形隧道",
            "作者称道路狭窄且很难找到合法临停点，曾于2025至2026年整修",
            "发布前需核验当前开放、隧道照明、限速、落石和全线禁停规则",
          ],
        },
      ],
    },
  ],
  [
    "河南/濮阳",
    {
      status: "reviewed",
      candidates: [
        {
          title: "濮阳周边遛娃｜车程1个小时的出逃山野",
          author: "认小真",
          url: "https://www.xiaohongshu.com/explore/6a818a0b000000002701d0dd",
          accessedAt: "2026-08-22",
          decision:
            "reject-as-puyang-local-route-destination-is-taihang-baozhuang-wind-road-needs-actual-jurisdiction-verification",
          evidence: [
            "正文目的地为太行山鲍庄古村和鲍庄风车天路",
            "濮阳仅是出发地话题，候选未证明路线位于濮阳市域",
            "作者还提示山路多弯且道路偶有临时管控",
            "该内容不归入濮阳本地路线，需另找沿黄或平原风景道证据",
          ],
        },
      ],
    },
  ],
];
const reviewedSeedKeys = reviewedSeedEntries.map(([key]) => key);
const duplicateReviewedSeedKeys = reviewedSeedKeys.filter(
  (key, index) => reviewedSeedKeys.indexOf(key) !== index,
);
if (duplicateReviewedSeedKeys.length > 0) {
  throw new Error(
    `Duplicate reviewed city seeds: ${[...new Set(duplicateReviewedSeedKeys)].join(", ")}`,
  );
}
const reviewedSeeds = new Map(reviewedSeedEntries);
const entries = regions.provinces.flatMap((province) =>
  province.divisions.map((division) => {
    const key = `${province.name}/${division.name}`;
    const saved = existingByKey.get(key);
    const reviewed = reviewedSeeds.get(key);
    return {
      province: province.name,
      city: division.name,
      queries: saved?.queries ?? [
        `${division.name} 风景公路 自驾路线`,
        `${division.name} 最美公路 跑山`,
        `${division.name} 环线 沿途风景`,
      ],
      status: reviewed?.status ?? saved?.status ?? "queued",
      candidates: reviewed?.candidates ?? saved?.candidates ?? [],
    };
  }),
);
await writeFile(
  outputUrl,
  `${JSON.stringify({ schemaVersion: "1.0.0", platform: "xiaohongshu", updatedAt: "2026-08-20", entries }, null, 2)}\n`,
);
console.log(
  `Built Xiaohongshu research queue for ${entries.length} administrative divisions.`,
);
