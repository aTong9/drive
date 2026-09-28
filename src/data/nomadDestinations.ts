export const nomadKeywords = [
  { title: "旅居方式", words: ["全球旅居", "数字游民", "Digital nomad", "慢旅行", "Slow travel", "季节性旅居", "Workation", "异地养老"] },
  { title: "居住与租房", words: ["居住区域", "长租公寓", "月租", "短租", "合租", "Coliving", "租房押金", "水电网费", "步行生活圈"] },
  { title: "成本与预算", words: ["生活成本", "Cost of living", "月度预算", "租金", "餐饮", "交通月票", "汇率", "应急储备"] },
  { title: "远程工作", words: ["远程办公", "Remote work", "自由职业", "独立开发", "联合办公", "Coworking", "网络上传速度", "时区协作", "备用网络"] },
  { title: "签证与身份", words: ["数字游民签证", "Digital nomad visa", "居留许可", "停留期限", "工作许可", "税务居民", "税收协定", "收入证明"] },
  { title: "日常与配套", words: ["医疗保险", "医院", "公共交通", "当地 SIM 卡", "eSIM", "银行开户", "跨境支付", "语言环境", "无障碍设施"] },
  { title: "环境与社区", words: ["气候", "雨季", "空气质量", "社区安全", "噪音", "游民社区", "文化融入", "亲子教育", "宠物友好"] },
];

// City-wide crowdsourced price snapshot, not a furnished short-stay quote.
export const nomadDestinations = [
  { id: "Kuala-Lumpur", city: "吉隆坡", country: "马来西亚", region: "亚洲", currency: "MYR", areas: ["Bangsar", "KLCC", "Mont Kiara"], keywords: ["城市生活", "远程办公", "联合办公"], rent: [1528, 2525], transit: 50, internet: 107, note: "比较住宅到轨道站点的实际步行距离；看房时确认空调电费与网络上传速度。" },
  { id: "Lisbon", city: "里斯本", country: "葡萄牙", region: "欧洲", currency: "EUR", areas: ["Alvalade", "Avenidas Novas", "Campo de Ourique"], keywords: ["慢旅行", "城市生活", "时区协作"], rent: [1067, 1419], transit: 40, internet: 29, note: "实地检查坡道、隔音、采光及租期；跨时区工作提前安排会议窗口。" },
  { id: "Mexico-City", city: "墨西哥城", country: "墨西哥", region: "北美洲", currency: "MXN", areas: ["Roma", "Condesa", "Coyoacán"], keywords: ["城市生活", "慢旅行", "文化融入"], rent: [12198, 19244], transit: 360, internet: 629, note: "按具体街道考察通勤与夜间返程；确认房屋维护、噪音和饮用水安排。" },
  { id: "Medellin", city: "麦德林", country: "哥伦比亚", region: "南美洲", currency: "COP", areas: ["Laureles", "El Poblado", "Envigado（邻近城市）"], keywords: ["远程办公", "时区协作", "语言环境"], rent: [2058515, 3352707], transit: 248000, internet: 90778, note: "热门片区与具体房源差异大；分别核查日夜出行、坡度和门禁，不能以片区名判断安全。" },
  { id: "Cape-Town", city: "开普敦", country: "南非", region: "非洲", currency: "ZAR", areas: ["Sea Point", "Gardens", "Observatory"], keywords: ["季节性旅居", "慢旅行", "备用网络"], rent: [11775, 17000], transit: 1000, internet: 669, note: "看房时确认供电与网络备用方案，并按实际工作时间核查交通和周边环境。" },
  { id: "Melbourne", city: "墨尔本", country: "澳大利亚", region: "大洋洲", currency: "AUD", areas: ["Carlton", "Fitzroy", "Southbank"], keywords: ["城市生活", "文化融入", "公共交通"], rent: [2006, 2435], transit: 199, internet: 81, note: "租房广告可能按周报价；比较时统一周期，并确认采暖、交通和网络是否包含在租金中。" },
  { id: "Chiang-Mai", city: "清迈", country: "泰国", region: "亚洲", currency: "THB", areas: ["Nimman", "Santitham", "Old City（古城）"], keywords: ["远程办公", "慢旅行", "联合办公"], rent: [9627, 15982], transit: 1800, internet: 674, note: "比较古城、宁曼与住宅区的噪音和通勤；签约前核查空调电费、网络与入住月份的空气质量。" },
  { id: "Da-Nang", city: "岘港", country: "越南", region: "亚洲", currency: "VND", areas: ["An Thuong", "My An", "Hai Chau"], keywords: ["慢旅行", "远程办公", "季节性旅居"], rent: [8849013, 13635570], transit: 130000, internet: 211333, note: "海边与市区房源分别比较；确认雨季防潮、施工噪音及长租水电计费方式。" },
  { id: "Bangkok", city: "曼谷", country: "泰国", region: "亚洲", currency: "THB", areas: ["On Nut", "Ari", "Phra Khanong"], keywords: ["城市生活", "远程办公", "公共交通"], rent: [11524, 22561], transit: 1178, internet: 588, note: "先核查住宅到 BTS 或 MRT 的步行路线；交通费用需按线路与出行频率另算，不能假设一张月票覆盖全城。" },
  { id: "Porto", city: "波尔图", country: "葡萄牙", region: "欧洲", currency: "EUR", areas: ["Cedofeita", "Bonfim", "Boavista"], keywords: ["慢旅行", "文化融入", "时区协作"], rent: [852, 1153], transit: 40, internet: 33, note: "看房检查采暖、防潮和坡道；确认短租价格与长期租约报价的差别。" },
  { id: "Valencia", city: "瓦伦西亚", country: "西班牙", region: "欧洲", currency: "EUR", areas: ["Ruzafa", "Benimaclet", "El Cabanyal"], keywords: ["慢旅行", "城市生活", "文化融入"], rent: [926, 1252], transit: 35, internet: 30, note: "比较海边、大学周边和市区的生活半径；入住前检查空调、隔音和租约期限。" },
  { id: "Budapest", city: "布达佩斯", country: "匈牙利", region: "欧洲", currency: "HUF", areas: ["Újlipótváros", "Terézváros", "Újbuda"], keywords: ["城市生活", "远程办公", "公共交通"], rent: [209231, 270500], transit: 9000, internet: 7696, note: "核查冬季采暖、楼宇公共费用及住宅电梯；按具体街道检查夜间噪音。" },
  {"id": "Penang", "city": "槟城", "country": "马来西亚", "region": "亚洲", "currency": "MYR", "areas": ["George Town（乔治市）", "Tanjung Tokong", "Bayan Lepas"], "keywords": ["城市生活", "远程办公", "公共交通"], "rent": [939, 1648], "transit": 50, "internet": 118, "note": "比较乔治市、海滨住宅和机场附近的通勤距离；实地检查采光、潮湿、噪音及网络。"},
  {"id": "Osaka", "city": "大阪", "country": "日本", "region": "亚洲", "currency": "JPY", "areas": ["天王寺 Tennoji", "福岛 Fukushima", "中崎町 Nakazakicho"], "keywords": ["城市生活", "远程办公", "公共交通"], "rent": [80222, 110667], "transit": 5150, "internet": 4840, "note": "确认短期外国住客能否签约、保证人及初期费用；铁路通勤费用按实际线路另算。"},
  {"id": "Taipei", "city": "台北", "country": "中国台湾", "region": "亚洲", "currency": "TWD", "areas": ["大安 Daan", "中山 Zhongshan", "松山 Songshan"], "keywords": ["城市生活", "远程办公", "公共交通"], "rent": [15385, 28211], "transit": 1200, "internet": 873, "note": "看房检查通风、防潮、隔音及电费计价；按实际通勤核查捷运和公交覆盖。"},
  {"id": "Seoul", "city": "首尔", "country": "韩国", "region": "亚洲", "currency": "KRW", "areas": ["延南洞 Yeonnam", "合井 Hapjeong", "圣水 Seongsu"], "keywords": ["城市生活", "远程办公", "公共交通"], "rent": [831000, 1188235], "transit": 62000, "internet": 27892, "note": "租金不含押金，需分别核实月租、押金与管理费；确认短租期限及网络是否包含。"},
  {"id": "Athens", "city": "雅典", "country": "希腊", "region": "欧洲", "currency": "EUR", "areas": ["Koukaki", "Pangrati", "Neos Kosmos"], "keywords": ["城市生活", "远程办公", "公共交通"], "rent": [576, 653], "transit": 27, "internet": 27, "note": "入住前检查夏季空调、遮阳和楼宇电梯；分别核查白天与夜间的步行路线。"},
  {"id": "Istanbul", "city": "伊斯坦布尔", "country": "土耳其", "region": "欧洲", "currency": "TRY", "areas": ["Kadıköy", "Beşiktaş", "Şişli"], "keywords": ["城市生活", "远程办公", "公共交通"], "rent": [31588, 47895], "transit": 3298, "internet": 788, "note": "城市跨欧亚两洲；先确定工作地点所在岸，再比较渡轮、轨道与步行通勤，核查楼宇维护记录。"},
  {"id": "Tallinn", "city": "塔林", "country": "爱沙尼亚", "region": "欧洲", "currency": "EUR", "areas": ["Kalamaja", "Kadriorg", "Kristiine"], "keywords": ["城市生活", "远程办公", "公共交通"], "rent": [513, 725], "transit": 30, "internet": 29, "note": "比较冬季采暖及公寓管理费；交通优惠可能有身份条件，按个人资格核查实际票价。"},
  {"id": "Warsaw", "city": "华沙", "country": "波兰", "region": "欧洲", "currency": "PLN", "areas": ["Mokotów", "Żoliborz", "Wola"], "keywords": ["城市生活", "远程办公", "公共交通"], "rent": [3749, 4684], "transit": 110, "internet": 66, "note": "合同中分清基础租金、物业费和水电暖；冬季预算与地铁、电车通勤一并比较。"},
  {"id": "Montreal", "city": "蒙特利尔", "country": "加拿大", "region": "北美洲", "currency": "CAD", "areas": ["Plateau-Mont-Royal", "Rosemont", "Verdun"], "keywords": ["城市生活", "远程办公", "公共交通"], "rent": [1387, 1741], "transit": 105, "internet": 59, "note": "确认采暖是否包含、冬季步行到地铁的路线及租期；提前核查日常服务语言与工作时差。"},
  {"id": "Santiago", "city": "圣地亚哥", "country": "智利", "region": "南美洲", "currency": "CLP", "areas": ["Providencia", "Ñuñoa", "Las Condes"], "keywords": ["城市生活", "远程办公", "公共交通"], "rent": [368333, 540250], "transit": 40000, "internet": 18635, "note": "比较地铁通勤、楼宇管理费及采暖方式；实地检查周边环境与备用网络。"},
  {"id": "Auckland", "city": "奥克兰", "country": "新西兰", "region": "大洋洲", "currency": "NZD", "areas": ["Mount Eden", "Parnell", "Kingsland"], "keywords": ["城市生活", "远程办公", "公共交通"], "rent": [2134, 2263], "transit": 217, "internet": 89, "note": "房源常按周报价，统一周期后比较；核查保温、防潮、公交频次及宽带开通条件。"},
  {"id": "Marrakech", "city": "马拉喀什", "country": "摩洛哥", "region": "非洲", "currency": "MAD", "areas": ["Guéliz", "Hivernage", "Medina（老城）"], "keywords": ["城市生活", "远程办公", "公共交通"], "rent": [3033, 4676], "transit": 250, "internet": 356, "note": "比较新城公寓与老城庭院的交通、隔音和空调；实测工作时段网络，确认租金是否包含水电。"},
  {"id": "Fukuoka", "city": "福冈", "country": "日本", "region": "亚洲", "currency": "JPY", "areas": ["药院 Yakuin", "大濠 Ohori", "博多 Hakata"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [40595, 74645], "transit": 6500, "internet": 5280, "note": "核查房屋初期费用、保证人条件及网络开通时间；按实际通勤路线比较交通费用。"},
  {"id": "Tokyo", "city": "东京", "country": "日本", "region": "亚洲", "currency": "JPY", "areas": ["高圆寺 Koenji", "中野 Nakano", "清澄白河 Kiyosumi Shirakawa"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [107071, 198132], "transit": 10000, "internet": 4755, "note": "按工作地点选择铁路沿线；签约前分别核查租金、管理费、押金礼金与短租条件。"},
  {"id": "Ho-Chi-Minh-City", "city": "胡志明市", "country": "越南", "region": "亚洲", "currency": "VND", "areas": ["Thao Dien（草田）", "Binh Thanh（平盛）", "District 3（第三郡一带）"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [7853003, 15220860], "transit": 300000, "internet": 262500, "note": "片区名作为找房线索，具体地址以现行登记为准；实测通勤、雨天排水和夜间施工噪音。"},
  {"id": "Prague", "city": "布拉格", "country": "捷克", "region": "欧洲", "currency": "CZK", "areas": ["Vinohrady", "Karlín", "Dejvice"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [21057, 24750], "transit": 536, "internet": 479, "note": "确认暖气、水电及楼宇费用是否另收；检查电梯、隔音和冬季通勤路线。"},
  {"id": "Sofia", "city": "索非亚", "country": "保加利亚", "region": "欧洲", "currency": "EUR", "areas": ["Lozenets", "Oborishte", "Iztok"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [523, 691], "transit": 26, "internet": 13, "note": "确认租约币种与公共费用；看房时核查采暖方式、隔音和地铁步行距离。"},
  {"id": "Bucharest", "city": "布加勒斯特", "country": "罗马尼亚", "region": "欧洲", "currency": "RON", "areas": ["Dorobanți", "Tineretului", "Cotroceni"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [2147, 3224], "transit": 100, "internet": 45, "note": "确认房东报价币种、楼宇维护和采暖费用；按具体地址核查地铁接驳与生活配套。"},
  {"id": "Tbilisi", "city": "第比利斯", "country": "格鲁吉亚", "region": "亚洲", "currency": "GEL", "areas": ["Vake", "Vera", "Saburtalo"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [1168, 1752], "transit": 40, "internet": 51, "note": "租约可能采用不同币种，签约前确认支付口径；检查楼宇电梯、坡道、采暖和网络。"},
  {"id": "Cuenca", "city": "昆卡", "country": "厄瓜多尔", "region": "南美洲", "currency": "USD", "areas": ["El Centro（历史中心）", "El Vergel", "Puertas del Sol"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [383, 500], "transit": 16, "internet": 26, "note": "比较历史中心与住宅区的交通、隔音和步行设施；向房东核实热水、网络及家具清单。"},
  {"id": "Vancouver", "city": "温哥华", "country": "加拿大", "region": "北美洲", "currency": "CAD", "areas": ["Kitsilano", "Mount Pleasant", "West End"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [2156, 2507], "transit": 117, "internet": 72, "note": "确认月租是否包含水电暖、网络与家具；按实际通勤分区核查交通票价。"},
  {"id": "Brisbane", "city": "布里斯班", "country": "澳大利亚", "region": "大洋洲", "currency": "AUD", "areas": ["West End", "New Farm", "Toowong"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [1986, 2815], "transit": 30, "internet": 87, "note": "周租与月租需统一口径；检查房源洪水历史、空调、公共交通及网络开通条件。"},
  {"id": "Wellington", "city": "惠灵顿", "country": "新西兰", "region": "大洋洲", "currency": "NZD", "areas": ["Te Aro", "Newtown", "Mount Victoria"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [2037, 2169], "transit": 181, "internet": 95, "note": "检查房屋保温、防潮和采暖成本；结合坡道与公交频率比较日常通勤。"},
  {"id": "Tunis", "city": "突尼斯市", "country": "突尼斯", "region": "非洲", "currency": "TND", "areas": ["La Marsa", "Lafayette", "Les Berges du Lac"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [732, 1112], "transit": 50, "internet": 62, "note": "沿海片区与中心城区分开比较；确认工作时段网络、空调电费及日常出行安排。"},
  {"id": "Hanoi", "city": "河内", "country": "越南", "region": "亚洲", "currency": "VND", "areas": ["Tay Ho（西湖一带）", "Truc Bach（竹帛）", "Ba Dinh（巴亭一带）"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [7335714, 10513947], "transit": 240000, "internet": 229690, "note": "片区名用于找房，具体地址以现行登记为准；核查湿度、交通噪音、空气质量与工作时段网络。"},
  {"id": "Lima", "city": "利马", "country": "秘鲁", "region": "南美洲", "currency": "PEN", "areas": ["Miraflores", "Barranco", "San Isidro"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [1159, 2588], "transit": 91, "internet": 94, "note": "沿海与内陆片区分别比较；检查潮湿、隔音、饮用水安排及夜间返程路线。"},
  {"id": "Quito", "city": "基多", "country": "厄瓜多尔", "region": "南美洲", "currency": "USD", "areas": ["La Carolina", "La Floresta", "González Suárez"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [313, 483], "transit": 21, "internet": 28, "note": "比较坡道、楼宇出入口与日常通勤；实地核查网络、热水及租金包含项目。"},
  {"id": "Malaga", "city": "马拉加", "country": "西班牙", "region": "欧洲", "currency": "EUR", "areas": ["Teatinos", "Huelin", "El Palo"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [972, 1334], "transit": 24, "internet": 22, "note": "分别询问淡旺季与长租价格；检查空调、隔音和住宅到交通站点的步行路线。"},
  {"id": "Barcelona", "city": "巴塞罗那", "country": "西班牙", "region": "欧洲", "currency": "EUR", "areas": ["Gràcia", "Poblenou", "Sants"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [1143, 1464], "transit": 23, "internet": 32, "note": "核对实际租期、房屋用途与合同条款；查看楼宇电梯、隔音以及日夜街道环境。"},
  {"id": "Vienna", "city": "维也纳", "country": "奥地利", "region": "欧洲", "currency": "EUR", "areas": ["Neubau", "Leopoldstadt", "Alsergrund"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [844, 1168], "transit": 51, "internet": 31, "note": "租金与楼宇运营费分开核对；确认采暖、家具和网络，交通票价按个人资格复核。"},
  {"id": "Ljubljana", "city": "卢布尔雅那", "country": "斯洛文尼亚", "region": "欧洲", "currency": "EUR", "areas": ["Trnovo", "Šiška", "Bežigrad"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [798, 983], "transit": 37, "internet": 37, "note": "核查冬季采暖、物业费用与租期；比较自行车、公交和步行到日常设施的路线。"},
  {"id": "Zagreb", "city": "萨格勒布", "country": "克罗地亚", "region": "欧洲", "currency": "EUR", "areas": ["Trešnjevka", "Maksimir", "Donji Grad"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [592, 775], "transit": 50, "internet": 37, "note": "看房检查楼宇维护、采暖及电梯；按实际地址核查电车通勤和生活配套。"},
  {"id": "Kathmandu", "city": "加德满都", "country": "尼泊尔", "region": "亚洲", "currency": "NPR", "areas": ["Lazimpat", "Boudha", "Baluwatar"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [15633, 33917], "transit": 1500, "internet": 1250, "note": "重点实测远程办公网络与备用供电；确认饮用水、热水、道路噪音和空气质量。"},
  {"id": "Colombo", "city": "科伦坡", "country": "斯里兰卡", "region": "亚洲", "currency": "LKR", "areas": ["Cinnamon Gardens", "Bambalapitiya", "Wellawatte"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [89540, 200607], "transit": 2377, "internet": 6874, "note": "核查空调电费、备用供电和网络上传速度；按实际工作时间比较通勤及噪音。"},
  {"id": "Singapore", "city": "新加坡", "country": "新加坡", "region": "亚洲", "currency": "SGD", "areas": ["Tiong Bahru", "Joo Chiat", "Queenstown"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [2765, 3820], "transit": 128, "internet": 35, "note": "先核查房源类型、合法租期与合同；租金为整套一居室口径，不能当作合租单间价格。"},
  {"id": "Perth", "city": "珀斯", "country": "澳大利亚", "region": "大洋洲", "currency": "AUD", "areas": ["Leederville", "Subiaco", "East Perth"], "keywords": ["城市生活", "远程办公", "慢旅行"], "rent": [2347, 2742], "transit": 140, "internet": 88, "note": "统一周租与月租口径；比较公交接驳、空调、保温与宽带开通条件。"},
] as const;

export function filterNomadDestinations(query: string, region: string) {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return nomadDestinations.filter((place) =>
    (region === "全部" || place.region === region) && terms.every((term) =>
      ["全球旅居 数字游民 Digital nomad", place.id.replaceAll("-", " "), place.city, place.country, place.region, ...place.areas, ...place.keywords, place.note]
        .join(" ").toLocaleLowerCase().includes(term)),
  );
}

// Local currency units per USD; a dated snapshot, never a live transaction quote.
export const nomadExchangeRates = {
  date: "2026-09-28",
  source: "https://open.er-api.com/v6/latest/USD",
  provider: "https://www.exchangerate-api.com",
  localPerUsd: {
    "MYR": 4.074399,
    "EUR": 0.878356,
    "MXN": 17.735545,
    "COP": 3334.28191,
    "ZAR": 16.322134,
    "AUD": 1.425788,
    "THB": 33.416091,
    "VND": 25936.548312,
    "HUF": 320.923923,
    "CLP": 962.264198,
    "CAD": 1.414854,
    "NZD": 1.767657,
    "TRY": 48.948487,
    "JPY": 157.489371,
    "TWD": 31.7654,
    "MAD": 9.59777,
    "PLN": 3.840834,
    "KRW": 1356.044355,
    "CZK": 21.399634,
    "RON": 4.629417,
    "GEL": 2.601676,
    "TND": 2.947661,
    "USD": 1,
    "PEN": 3.392941,
    "NPR": 153.493654,
    "LKR": 330.026559,
    "SGD": 1.278218
  },
} as const;

export function nomadUsdEquivalent(amount: number, currency: keyof typeof nomadExchangeRates.localPerUsd) {
  if (!Number.isFinite(amount) || amount < 0) throw new RangeError("费用须为非负有限数值");
  return amount / nomadExchangeRates.localPerUsd[currency];
}
