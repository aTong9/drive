import { readFile, writeFile } from "node:fs/promises";

const catalogUrl = new URL("../data/catalog.json", import.meta.url);
const catalog = JSON.parse(await readFile(catalogUrl, "utf8"));
const locationById = new Map(catalog.locations.map((item) => [item.id, item]));
const cityPoint = {
  广州: "gd-gz-haixinsha",
  深圳: "gd-sz-futian-civic-square",
  珠海: "gd-zh-zhuhai-fisher-girl",
  汕头: "gd-st-small-park",
  佛山: "gd-fs-qiandeng-lake",
  韶关: "gd-sg-danxia-mountain",
  河源: "gd-hy-wanlv-lake",
  梅州: "gd-mz-yan-nan-fei",
  惠州: "gd-hz-drive-huizhou-avenue-jiangbei",
  汕尾: "gd-sw-red-bay",
  东莞: "gd-dg-songshan-lake",
  中山: "gd-zs-qijiang-park",
  江门: "gd-jm-guifeng-mountain",
  阳江: "gd-yj-hailing-island",
  湛江: "gd-zj-jinshawan-promenade",
  茂名: "gd-mm-first-beach",
  肇庆: "gd-zq-seven-star-crags",
  清远: "gd-qy-gulong-gorge",
  潮州: "gd-cz-guangji-bridge",
  揭阳: "gd-jy-huangqi-mountain",
  云浮: "gd-yf-panlong-cave",
};

const definitions = [
  ["G4京港澳高速粤北—湾区纵贯", "G4", ["韶关", "清远", "广州", "东莞", "深圳"]],
  ["G0421许广高速清远—广州", "G0421", ["清远", "广州"]],
  ["G0422武深高速粤北—深圳", "G0422", ["韶关", "河源", "惠州", "深圳"]],
  [
    "G15沈海高速粤东沿海段",
    "G15",
    ["潮州", "汕头", "揭阳", "汕尾", "惠州", "深圳"],
  ],
  [
    "G15沈海高速珠江西岸—粤西段",
    "G15",
    ["广州", "佛山", "江门", "阳江", "茂名", "湛江"],
  ],
  ["G25长深高速梅州—深圳", "G25", ["梅州", "河源", "惠州", "深圳"]],
  ["G35济广高速梅州—广州", "G35", ["梅州", "河源", "惠州", "广州"]],
  ["G45大广高速韶关—广州", "G45", ["韶关", "广州"]],
  ["G55二广高速粤北—广州", "G55", ["清远", "肇庆", "佛山", "广州"]],
  [
    "G65包茂高速茂名山海段",
    "G65",
    ["茂名"],
    ["gd-mm-gaozhou-xianrendong", "gd-mm-first-beach"],
  ],
  ["G78汕昆高速汕潮揭—梅州", "G78", ["汕头", "潮州", "揭阳", "梅州"]],
  ["G80广昆高速广州—云浮", "G80", ["广州", "佛山", "肇庆", "云浮"]],
  ["G94珠三角环线东岸段", "G94", ["深圳", "东莞", "广州"]],
  ["G94珠三角环线西岸段", "G94", ["广州", "佛山", "江门", "中山", "珠海"]],
  ["G2518深岑高速深圳—云浮", "G2518", ["深圳", "中山", "江门", "云浮"]],
  [
    "G1508广州绕城高速环线",
    "G1508",
    ["广州", "佛山", "广州"],
    ["gd-gz-haixinsha", "gd-fs-qiandeng-lake", "gd-gz-baiyun-lake-park"],
  ],
  [
    "S1广连高速广州—连州",
    "S1",
    ["广州", "清远"],
    ["gd-gz-baiyun-mountain", "gd-qy-lianzhou-underground-river"],
  ],
  ["S2广河高速广州—河源", "S2", ["广州", "惠州", "河源"]],
  ["S3广深沿江高速珠江口东岸", "S3", ["广州", "东莞", "深圳"]],
  ["S6广龙高速广州—河源", "S6", ["广州", "东莞", "惠州", "河源"]],
  ["S8广佛肇高速湾区西行", "S8", ["广州", "佛山", "肇庆"]],
  ["S14汕湛高速粤东横贯段", "S14", ["汕头", "揭阳", "梅州", "河源", "惠州"]],
  [
    "S14汕湛高速粤西横贯段",
    "S14",
    ["清远", "肇庆", "云浮", "阳江", "茂名", "湛江"],
  ],
  ["S21广惠高速广州—惠州", "S21", ["广州", "惠州"]],
  ["S29从莞深高速广州—深圳", "S29", ["广州", "东莞", "深圳"]],
  [
    "S30惠深沿海高速大亚湾—深圳",
    "S30",
    ["惠州", "深圳"],
    ["gd-hz-drive-dayabay-aotou", "gd-sz-yantian-dameisha"],
  ],
  ["S32西部沿海高速珠海—阳江", "S32", ["珠海", "江门", "阳江"]],
  ["S51肇阳高速肇庆—阳江", "S51", ["肇庆", "云浮", "阳江"]],
  [
    "G105国道粤北—珠海长线",
    "G105",
    ["韶关", "清远", "广州", "佛山", "中山", "珠海"],
  ],
  ["G106国道韶关—广州山城线", "G106", ["韶关", "清远", "广州"]],
  [
    "G107国道韶关—深圳城市走廊",
    "G107",
    ["韶关", "清远", "广州", "东莞", "深圳"],
  ],
  ["G205国道梅州—深圳客家走廊", "G205", ["梅州", "河源", "惠州", "深圳"]],
  ["G206国道梅州—汕头", "G206", ["梅州", "揭阳", "汕头"]],
  ["G220国道粤北—广佛", "G220", ["韶关", "清远", "广州", "佛山"]],
  ["G228国道粤东滨海段", "G228", ["潮州", "汕头", "揭阳", "汕尾", "惠州"]],
  ["G228国道环珠江口滨海段", "G228", ["深圳", "东莞", "广州", "中山", "珠海"]],
  ["G228国道粤西滨海段", "G228", ["江门", "阳江", "茂名", "湛江"]],
  ["G234国道清远—阳江", "G234", ["清远", "肇庆", "云浮", "阳江"]],
  ["G240国道清远—江门", "G240", ["清远", "广州", "佛山", "江门"]],
  ["G321国道广州—云浮西行", "G321", ["广州", "佛山", "肇庆", "云浮"]],
  [
    "G323国道粤北南岭段",
    "G323",
    ["清远", "韶关"],
    [
      "gd-qy-yingxi-peak-forest",
      "exp20-30-4402-gn-1799741",
      "gd-sg-nanling-forest",
    ],
  ],
  ["G324国道粤东—广州段", "G324", ["汕头", "揭阳", "汕尾", "惠州", "广州"]],
  ["G324国道广佛—云浮段", "G324", ["广州", "佛山", "肇庆", "云浮"]],
  [
    "G325国道广佛—湛江沿海走廊",
    "G325",
    ["广州", "佛山", "江门", "阳江", "茂名", "湛江"],
  ],
  ["G355国道潮州—惠州山水线", "G355", ["潮州", "梅州", "河源", "惠州"]],
  ["G358国道汕尾—深圳", "G358", ["汕尾", "惠州", "东莞", "深圳"]],
  [
    "广东滨海旅游公路汕潮揭—南澳组团",
    "滨海旅游公路",
    ["潮州", "汕头", "揭阳"],
    ["gd-cz-guangji-bridge", "gd-st-nanao-island", "gd-jy-huangqi-mountain"],
  ],
  [
    "广东滨海旅游公路红海湾—碣石湾组团",
    "滨海旅游公路",
    ["揭阳", "汕尾"],
    [
      "gd-jy-huangqi-mountain",
      "gd-sw-red-bay",
      "gd-sw-shigongliao-windmill-island",
    ],
  ],
  [
    "广东滨海旅游公路大亚湾—稔平半岛组团",
    "滨海旅游公路",
    ["惠州", "深圳"],
    ["gd-hz-xunliao-bay", "gd-hz-double-moon-resort", "gd-sz-yantian-dameisha"],
  ],
  [
    "广东滨海旅游公路环珠江口组团",
    "滨海旅游公路",
    ["深圳", "东莞", "广州", "中山", "珠海"],
  ],
  [
    "广东滨海旅游公路川岛—银湖湾组团",
    "滨海旅游公路",
    ["珠海", "江门"],
    [
      "gd-zh-zhuhai-fisher-girl",
      "gd-jm-bird-paradise",
      "gd-jm-chikan-ancient-town",
    ],
  ],
  [
    "广东滨海旅游公路海陵岛—水东湾组团",
    "滨海旅游公路",
    ["阳江", "茂名"],
    [
      "gd-yj-hailing-island",
      "gd-yj-beiluo-bay",
      "gd-mm-romantic-coast",
      "gd-mm-first-beach",
    ],
  ],
  [
    "广东滨海旅游公路环雷州半岛组团",
    "滨海旅游公路",
    ["湛江"],
    ["gd-zj-jinshawan-promenade", "gd-zj-huguangyan", "gd-zj-techeng-island"],
  ],
  [
    "惠州218环南昆山—罗浮山旅游公路",
    "惠州218",
    ["惠州"],
    ["gd-hz-nankun-forest", "gd-hz-luofu-mountain", "gd-hz-honghua-lake"],
  ],
  [
    "环南岭旅游公路韶关—清远森林线",
    "环南岭旅游公路",
    ["韶关", "清远"],
    [
      "gd-sg-nanling-forest",
      "gd-sg-danxia-mountain",
      "gd-qy-yingxi-peak-forest",
      "gd-qy-lianzhou-underground-river",
    ],
  ],
  [
    "南澳岛环岛旅行公路",
    "南澳环岛公路",
    ["汕头"],
    ["gd-st-nanao-island", "gd-st-queshi-scenic"],
  ],
  [
    "开平碉楼—赤坎侨乡旅行公路",
    "开平侨乡公路",
    ["江门"],
    [
      "gd-jm-kaiping-zili-village",
      "gd-jm-chikan-ancient-town",
      "gd-jm-guifeng-mountain",
    ],
  ],
  [
    "万绿湖—苏家围客家山水旅行公路",
    "河源山水公路",
    ["河源"],
    ["gd-hy-wanlv-lake", "gd-hy-sujiawei", "gd-hy-dinosaur-museum"],
  ],
  [
    "丹霞山—南岭粤北森林旅行公路",
    "粤北森林公路",
    ["韶关"],
    ["gd-sg-danxia-mountain", "gd-sg-nanling-forest", "gd-sg-nanhua-temple"],
  ],
];

const prefix = "gd-roadnet-2026-";
const excludedForScenicFocus = new Set([
  "G4京港澳高速粤北—湾区纵贯",
  "G94珠三角环线东岸段",
  "G94珠三角环线西岸段",
  "G2518深岑高速深圳—云浮",
  "G1508广州绕城高速环线",
  "S3广深沿江高速珠江口东岸",
  "S6广龙高速广州—河源",
  "S8广佛肇高速湾区西行",
  "S21广惠高速广州—惠州",
  "S29从莞深高速广州—深圳",
  "G105国道粤北—珠海长线",
  "G107国道韶关—深圳城市走廊",
  "G240国道清远—江门",
  "G321国道广州—云浮西行",
]);
const scenicDefinitions = definitions.filter(
  ([name]) => !excludedForScenicFocus.has(name),
);
const communityEvidence = new Map([
  [
    "G323",
    {
      advice:
        "小红书实走帖及评论提供了两组可供导航复核的顺序线索：广州方向可按油岭瑶寨—八界山—G323—乳源南水水库后转 G4 返回；深圳方向可先到阳山，再沿 G323 经油岭瑶寨、天井山方向折返。帖子所述轿车通行、沿线充电和露营条件均为个人体验，不作为当前路况保证；尤其不得把水库边随意小路、村道或露营点直接加入导航。",
      source:
        "小红书帖子《跑多少次都不会腻的广东G323》及其可见评论（https://www.xiaohongshu.com/explore/69bfa3270000000023020134）补充了路线顺序、南水水库景观和补能需求线索；这些内容仅作社区实走证据，仍须以官方道路信息和当日导航复核。",
      sources: [
        {
          platform: "xiaohongshu",
          title: "跑多少次都不会腻的广东G323",
          author: "毛疯子",
          url: "https://www.xiaohongshu.com/explore/69bfa3270000000023020134",
          accessedAt: "2026-08-20",
          evidence: ["路线顺序", "南水水库景观", "沿线补能与轿车通行评论"],
        },
      ],
    },
  ],
  [
    "惠州218",
    {
      advice:
        "小红书实走帖显示整条环线一天难以从容完成，可优先拆分为精华路段；评论给出的起点线索为下浪溪畔驿站。作者工作日行驶约130公里并选择9段，反馈沿线餐饮、咖啡和营业点较少，部分停车点可能收费，因此出发前应单独核验营业、停车、补能和返程时间，暴雨时不因行程已开始而继续跑山。",
      source:
        "小红书帖子《惠州最美218公路》及其可见评论（https://www.xiaohongshu.com/explore/6a4babfa0000000011007997）补充了分段执行、下浪溪畔驿站起点、耗时和沿线服务稀疏等实走线索；弯道与路面评价属于个人体验，不替代当日路况核验。",
      sources: [
        {
          platform: "xiaohongshu",
          title: "惠州最美218公路",
          author: "95后爱旅游寻人间美好",
          url: "https://www.xiaohongshu.com/explore/6a4babfa0000000011007997",
          accessedAt: "2026-08-20",
          evidence: [
            "下浪溪畔驿站起点",
            "约130公里及9段精华",
            "沿线服务与停车评论",
          ],
        },
      ],
    },
  ],
]);
catalog.routes = catalog.routes.filter((route) => !route.id.startsWith(prefix));
const uniqueNames = new Set();
const routes = scenicDefinitions.map(
  ([name, roadCode, cities, explicitPoints], index) => {
    if (uniqueNames.has(name)) throw new Error(`重复路线名称：${name}`);
    uniqueNames.add(name);
    const waypointLocationIds = explicitPoints || [
      ...new Set(cities.map((city) => cityPoint[city])),
    ];
    for (const id of waypointLocationIds)
      if (!locationById.has(id))
        throw new Error(`${name} 引用了未知地点 ${id}`);
    const coast = /沿海|滨海|海湾|海岸|南澳|雷州/.test(name);
    const community = communityEvidence.get(roadCode);
    return {
      id: `${prefix}${String(index + 1).padStart(2, "0")}`,
      name: `${name}广东风景驾驶路线`,
      province: "广东",
      cities: [...new Set(cities)],
      type: coast ? "coast" : "mountain",
      captureStyle: "scenic-drive",
      modes: ["day", "sunset", "asmr"],
      estimatedDurationMinutes: Math.min(
        720,
        Math.max(120, waypointLocationIds.length * 90),
      ),
      waypointLocationIds,
      best: {
        seasons: ["spring", "autumn", "winter"],
        times: ["morning", "golden-hour", "sunset"],
        weather: ["sunny", "cloudy", "after-rain"],
      },
      cameraPresetIds: ["gopro12-city-night-driving"],
      shootAdvice: `这条路线按连续山地、森林、江湖、田园或滨海景观筛选，以${roadCode}及其已通车广东境内段作为风景驾驶走廊。途经地点只用于约束城市顺序和公共到达区域，不代表必须驶入景区或按坐标直线连接。${community ? `${community.advice}` : ""}出发前由 AMap.Driving 按道路编号、实时开放路段、收费、限行、施工、服务区和交通管制生成实际路线；规划段、未通车段、封闭道路及内部道路一律不进入。设备须在出发前固定并自动录制，驾驶者不看屏、不操作、不为取景减速、变道、停车或折返；长线按服务区和疲劳管理拆分执行。`,
      scores: {
        visual: 5,
        road: 4,
        parking: 2,
        safety: 4,
        youtubePotential: 5,
      },
      status: "idea",
      verification: {
        status: "source-checked",
        note: `道路走廊依据广东省交通运输厅《广东省高速公路网规划（2020—2035年）》、广东省政府《广东滨海旅游公路规划》及既有国省道编号资料整理，并按沿途风景连续性二次筛选；${community ? `${community.source}` : ""}${roadCode}的实际线路、已通车边界、收费、限行、施工和临时管制须在出发当日再次核验。`,
        ...(community ? { sources: community.sources } : {}),
      },
    };
  },
);
catalog.routes.push(...routes);
await writeFile(catalogUrl, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(
  `Added ${routes.length} scenic Guangdong travel-road and expressway routes; excluded ${excludedForScenicFocus.size} commuter-oriented corridors.`,
);
