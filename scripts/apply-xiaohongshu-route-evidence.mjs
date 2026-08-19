import { readFile, writeFile } from "node:fs/promises";

const catalogUrl = new URL("../data/catalog.json", import.meta.url);
const catalog = JSON.parse(await readFile(catalogUrl, "utf8"));
const evidenceByRouteId = new Map([
  [
    "ln-dl-xinghai-bangchuidao-coast",
    {
      source: {
        platform: "xiaohongshu",
        title: "大连沿海公路自驾游",
        author: "歡囍.",
        url: "https://www.xiaohongshu.com/explore/6a0191ae00000000080312fd",
        accessedAt: "2026-08-20",
        evidence: [
          "棒棰岛—滨海东路—老虎滩—燕窝岭—北大桥顺序",
          "滨海西路—银沙滩—傅家庄—星海广场顺序",
          "弯道路段限速与临时停车评论",
        ],
      },
      marker: "小红书实走帖提供了反向连接",
      advice:
        "小红书实走帖提供了反向连接两端锚点的连续道路顺序：棒棰岛—滨海东路—老虎滩—燕窝岭—北大桥—滨海西路—银沙滩—傅家庄—星海广场。帖子所述13时出发、18至19时抵达以及北大桥、燕窝岭、银沙滩临时车位属于个人当次体验，不作为当前通行和停车保证；滨海路弯多且帖子提示限速约40至60公里，必须服从现场限速、禁停、施工和交通管制。",
    },
  ],
  [
    "zj-nb-songlan-shipu-coast",
    {
      source: {
        platform: "xiaohongshu",
        title: "宁波象山3天2晚沿海自驾，人少海蓝",
        author: "出逃计划手册",
        url: "https://www.xiaohongshu.com/explore/69d8543600000000220256cc",
        accessedAt: "2026-08-20",
        evidence: [
          "石浦渔港古城—半边山日落行程",
          "松兰山滨海度假区—沿海公路行程",
          "全程沿海环线、轿车友好与禁止路边停车提示",
        ],
      },
      marker: "小红书象山实走帖把石浦与松兰山",
      advice:
        "小红书象山实走帖把石浦与松兰山安排在同一条三日沿海行程中，并反馈整体轿车友好、山路较少；帖子还明确提醒沿海公路不得为拍照路边停车。帖中的轮渡价格、住宿价格、景区免票时间和季节体验均为个人当次记录，不作为当前承诺；两端之间的真实道路、施工、台风、潮汐、停车和景区车行边界仍由当日导航与现场规则决定。",
    },
  ],
  [
    "gx-bh-silver-guantouling-coast",
    {
      source: {
        platform: "xiaohongshu",
        title: "被自己做的北海环岛自驾攻略满意哭了",
        author: "坨子不咸",
        url: "https://www.xiaohongshu.com/explore/6762402a000000000b014a9c",
        accessedAt: "2026-08-20",
        evidence: [
          "流下村—冠头岭—紫霞湾市内行程",
          "银滩—侨港海滩市内行程",
          "冠头岭、紫霞湾与银滩日落场景线索",
        ],
      },
      marker: "小红书北海环岛帖子把冠头岭与银滩",
      advice:
        "小红书北海环岛帖子把冠头岭与银滩纳入同一套市内分日行程：第一组为流下村—冠头岭—紫霞湾，第二组为金海湾红树林—银滩—侨港。帖子没有证明两端之间的固定道路和实时车程，因此仅作为社区目的地顺序证据；实际连接、停车、景区车行边界、活动管制、潮汐和日落时段必须由当日导航与现场规则确定，涠洲岛船运段不得混入本路线。",
    },
  ],
  [
    "gx-gl-elephant-yulong",
    {
      source: {
        platform: "xiaohongshu",
        title: "桂林阳朔自驾游，三天随心游",
        author: "那角落。",
        url: "https://www.xiaohongshu.com/explore/6a2101b300000000350324f2",
        accessedAt: "2026-08-20",
        evidence: [
          "阳朔遇龙河—月亮山—十里画廊行程",
          "兴坪—桂林市区转场",
          "桂林象鼻山第三日行程及景区交通边界",
        ],
      },
      marker: "小红书桂林阳朔自驾帖以三天顺序连接遇龙河与象鼻山",
      advice:
        "小红书桂林阳朔自驾帖以三天顺序连接遇龙河与象鼻山：阳朔遇龙河—月亮山—十里画廊，次日兴坪后转场桂林，第三日前往象鼻山。帖子明确在遇龙河、十里画廊和象鼻山内部改用竹筏、电动车、步行或景区游览，因此这些内部空间不能作为公共驾车道路；兴坪二十元背景打卡点的弯绕、扬尘和泥泞描述属于个人体验。真实转场、停车、景区入口、竹筏运营、天气和交通管制必须在当天核验。",
    },
  ],
  [
    "yn-lj-old-town-yulong-altitude",
    {
      source: {
        platform: "xiaohongshu",
        title: "Day2 丽江：玉龙雪山一日自驾攻略🚐",
        author: "Ethenmaster.",
        url: "https://www.xiaohongshu.com/explore/6978ed36000000000e03e0e4",
        accessedAt: "2026-08-20",
        evidence: [
          "丽江古城—玉龙雪山南门检票口驾车时间线",
          "玉龙雪山游客中心停车与景区大巴换乘边界",
          "束河古镇返程、停车场充电桩与铺装路况评论",
        ],
      },
      marker: "小红书丽江玉龙雪山实走帖给出了古城至雪山南门",
      advice:
        "小红书丽江玉龙雪山实走帖给出了古城至雪山南门、游客中心停车后换乘景区大巴以及返程束河古镇的时间线，并在评论中补充3号停车场较近、4号停车场有充电桩和进景区后为铺装道路的个人体验。自驾车辆不能直接进入蓝月谷、牦牛坪、云杉坪等内部景点；帖子中的早出发、路边停车、气温和票务说法均不作为当前保证，须服从景区预约、停车、禁停、天气、积雪和高海拔安全规则。",
    },
  ],
]);

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

for (const [routeId, evidence] of evidenceByRouteId) {
  const route = catalog.routes.find((item) => item.id === routeId);
  if (!route) throw new Error(`Missing route ${routeId}`);
  const sources = (route.verification.sources ?? []).filter(
    (source) => source.url !== evidence.source.url,
  );
  route.verification.sources = [...sources, evidence.source];
  if (!route.shootAdvice.includes(evidence.marker)) {
    route.shootAdvice = `${route.shootAdvice}${evidence.advice}`;
  }
  const priorSourceSentence = new RegExp(
    ` 小红书帖子《[^》]+》（${escapeRegExp(evidence.source.url)}）[^。]*。`,
  );
  route.verification.note = route.verification.note.replace(
    priorSourceSentence,
    "",
  );
  route.verification.note = `${route.verification.note} 小红书帖子《${evidence.source.title}》（${evidence.source.url}）提供了上述社区实走线索；个人体验不替代当日导航、官方通行和现场规则核验。`;
}

await writeFile(catalogUrl, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(
  `Applied Xiaohongshu evidence to ${evidenceByRouteId.size} routes.`,
);
