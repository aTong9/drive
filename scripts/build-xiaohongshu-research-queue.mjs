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
