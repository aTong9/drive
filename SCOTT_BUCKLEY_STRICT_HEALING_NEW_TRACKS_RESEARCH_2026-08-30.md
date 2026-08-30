# Scott Buckley 严格疗愈新增曲目研究

研究日期：2026-08-30  
范围：只核验 Scott Buckley 官方曲目页、官方 MP3、官方使用说明/FAQ，以及 Creative Commons 官方 CC BY 4.0 条款；不修改应用或 catalog。

## 结论

本轮从现有 `data/music-catalogs/scott-buckley-100.json` 之外保留 **12 首**，不为数量混入明显强鼓、动作、史诗或 EDM 曲目。其中 6 首可进入 S 级试听队列，6 首为 A 级（存在中段发展、动态峰值、声乐或情绪偏冷等风险）。

Scott Buckley 的授权比 StreamBeats 更适合长视频后期：官方明确允许免费商业使用与 `adapt`；CC BY 4.0 明确允许 remix、transform、build upon，因此剪时长、Fade、重复/交叉淡化循环均可做。代价是 **必须署名**，且修改后必须说明改动。

## 授权与真人创作证据

- [Scott Buckley 官方 Using This Music](https://www.scottbuckley.com.au/library/using-this-music/)：官网 MP3 除非另有声明，均按 CC BY 4.0 发布；可免费改编并用于商业项目。YouTube 署名必须放在视频说明栏，否则很可能收到版权声明。
- [Scott Buckley 官方 FAQ](https://www.scottbuckley.com.au/library/faq/)：明确允许在已盈利的 YouTube 频道免费使用，但必须署名；没有署名时可能触发 Smart Content ID claim。
- [Creative Commons 官方 CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)：允许为任何目的（包括商业）分享和改编；必须适当署名、链接许可证并注明是否修改，不得暗示作者背书，也不得施加额外法律或技术限制。
- 官方库将作品署名为 Scott Buckley，并自述为其 cinematic original music；官网还提供其作曲直播入口。所有候选曲目页均是 Scott 官方页面，未发现 AI 生成披露。准确标记应为：**具名真人作者；官方无 AI 生成披露**，不能扩大成逐曲法证意义的“100% 已证明非 AI”。
- 官方限制：不能把音乐独立转卖/重新上传到音乐平台；不能把使用这些曲目的成品提交到 YouTube Content ID 或类似音频指纹系统。

### 推荐署名模板

未修改：

```text
Music: “[Track Title]” by Scott Buckley — released under CC BY 4.0.
https://www.scottbuckley.com.au | https://creativecommons.org/licenses/by/4.0/
```

已剪短、Fade 或 Loop：

```text
Music: “[Track Title]” by Scott Buckley — edited (trim/fade/loop) from the original;
licensed under CC BY 4.0.
https://www.scottbuckley.com.au | https://creativecommons.org/licenses/by/4.0/
```

## 12 首候选

时长来自各官方曲目页链接的原始 MP3，并以 `ffprobe` 读取后四舍五入到秒；不是第三方平台时长。

| 级别 | 曲目 | 精确时长 | 官方曲目页 / MP3 | 官方风格与配器证据 | 推荐场景 / 风险 |
|---|---|---:|---|---|---|
| S | In This Moment | 03:20 | [曲目页](https://www.scottbuckley.com.au/library/in-this-moment/) · [MP3](https://www.scottbuckley.com.au/library/wp-content/uploads/2026/08/InThisMoment.mp3) | 官方：`bittersweet meditation`、`intimate solo piano`；最接近 Slow / Weak / 留白 | 静夜、雨窗、独处、极慢镜头；本批首选 |
| S | Borealis | 06:32 | [曲目页](https://www.scottbuckley.com.au/library/borealis/) · [MP3](https://www.scottbuckley.com.au/library/wp-content/uploads/2019/09/sb_borealis.mp3) | 官方：`contemplative`、`slow-moving ambient`，灵感来自北方森林的安静静止 | 森林、雾、雪夜、湖面、自然空镜 |
| S | Echoes Of Home | 04:52 | [曲目页](https://www.scottbuckley.com.au/library/echoes-of-home/) · [MP3](https://www.scottbuckley.com.au/library/wp-content/uploads/2025/05/EchoesOfHome.mp3) | 官方：`warm`、`nostalgic`、`gentle vibes`；管弦气质接近 Zelda / Ghibli | 归途、乡村、暖阳、家园；与用户 Warm/Gentle 画像高度一致 |
| S | Life in Motion | 06:21 | [曲目页](https://www.scottbuckley.com.au/library/life-in-motion/) · [MP3](https://www.scottbuckley.com.au/library/wp-content/uploads/2024/03/LifeInMotion.mp3) | 官方：`introspective, improvisational neoclassical`；piano、solo clarinet、violin、cello、synth，带 hopeful optimism | 人生记录、温柔叙事、城市慢行；采用前试听旋律密度 |
| S | There Was A Time | 05:14 | [曲目页](https://www.scottbuckley.com.au/library/there-was-a-time/) · [MP3](https://www.scottbuckley.com.au/library/wp-content/uploads/2022/05/sb_therewasatime.mp3) | 官方：`emotional, nostalgic`，string orchestra + synth；slightly uplifting、略带 melancholy | 黄昏、返乡、旧村落、回程 |
| S | Phoenix (2026) | 05:54 | [曲目页](https://www.scottbuckley.com.au/library/phoenix-2026/) · [MP3](https://www.scottbuckley.com.au/library/wp-content/uploads/2026/03/Phoenix2026.mp3) | 官方：纯 chamber strings、`intimate, minimalist rendition`；循环式 canon motifs，未列鼓组 | 清晨、自然极简空镜、时间流逝；有 tension/release，仍需试听峰值 |
| A | I Walk With Ghosts | 08:04 | [曲目页](https://www.scottbuckley.com.au/library/i-walk-with-ghosts/) · [MP3](https://www.scottbuckley.com.au/library/wp-content/uploads/2021/04/sb_iwalkwithghosts.mp3) | 官方：`bittersweet, meditative neoclassical`；atmospheric synth + emotional strings | 深夜公路、雨夜、回忆；4:20 后有结构变化，非全程平坦 |
| A | Golden Hour | 05:24 | [曲目页](https://www.scottbuckley.com.au/library/golden-hour/) · [MP3](https://www.scottbuckley.com.au/library/wp-content/uploads/2023/02/GoldenHour.mp3) | 官方：`warm`、`evoking calmness`；vocals、strings、synth，同时带 uplifting / mystery / exploration | 日落、金色乡野、远行；声乐可能与旁白竞争 |
| A | Celestial | 05:37 | [曲目页](https://www.scottbuckley.com.au/library/celestial/) · [MP3](https://www.scottbuckley.com.au/library/wp-content/uploads/2021/06/sb_celestial.mp3) | 官方：mysterious / emotional，strings + synth；中段 build to a peak，结尾回落为 contemplative | 星空、夜景、辽阔自然；峰值段不符合 Weak，应局部剪用或压动态 |
| A | Last and First Light | 07:49 | [曲目页](https://www.scottbuckley.com.au/library/last-and-first-light/) · [MP3](https://www.scottbuckley.com.au/library/wp-content/uploads/2022/06/LastAndFirstLight.mp3) | 官方：bittersweet / emotional contemporary classical；orchestra + folksy solo violin，nostalgia / longing for home | 黎明、日落、故乡远景；管弦动态可能偏大 |
| A | Passage | 05:28 | [曲目页](https://www.scottbuckley.com.au/library/passage/) · [MP3](https://www.scottbuckley.com.au/wp-content/audio/sb_passage.mp3) | 官方：emotive、weaving / ebbing string orchestra；未列强节奏 | 雾景、山路、沉思；Warm/Healing 程度需试听确认 |
| A | Theory of Machines | 03:21 | [曲目页](https://www.scottbuckley.com.au/library/theory-of-machines/) · [MP3](https://www.scottbuckley.com.au/library/wp-content/uploads/2017/02/sb_theoryofmachines.mp3) | 官方：`bittersweet, emotional string orchestra cue`；未列强鼓 | 旧工业景、城市蓝调、回忆；偏冷感，先试听再采用 |

## 第一试听队列

1. `In This Moment`：唯一明确的 intimate solo piano，最适合大量留白。
2. `Borealis`：明确 slow-moving ambient，时长 6:32，适合森林、雾、雪景长镜头。
3. `Echoes Of Home`：官方描述同时命中 Warm + Nostalgic + Gentle。
4. `There Was A Time`：返乡、回程、黄昏的稳定候选。
5. `Life in Motion`：钢琴、柔和独奏乐器与 synth 的完整配器。
6. `Phoenix (2026)`：极简室内弦乐，可测试时间流逝和自然空镜。

## 去重

- 从 `data/music-catalogs/scott-buckley-100.json` 读取全部 100 个 `[title, official URL]`。
- 对标题做不区分大小写精确比对，并对官方 URL 去尾斜杠后比对。
- 本批 12 首标题命中：**0**；官方曲目页 URL 命中：**0**。
- `In This Moment` 是 2026-08 的新曲；现有 catalog 已含较新的 `Home Was You`，但没有本曲。

## 明确排除

- `Wildflowers`：官方明确写明从柔和开场发展到更 energetic 的结尾。
- `Electric Dreams` / `Twilight Echo`：Synthwave 与更明显节拍，不符合低存在感。
- `A Dragon's Lullaby`：官方为 dark / sombre，不满足 Warm。
- `Never Dying`：官方强调 bittersweet tension，不够 Calm。
- `Life in Silico`：bright / bubbly，存在感偏强。
- `Wanderlust` / `Homeward`：带 percussion，本批严格模式不收。
- `Where Stars Fall`、`White Dawn`、`In Dreams`：bold brass / percussion / grand orchestral，不满足 Weak。
