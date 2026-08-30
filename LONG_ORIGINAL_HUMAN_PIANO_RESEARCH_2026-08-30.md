# 10 分钟以上真人原创舒缓音乐候选（2026-08-30）

## 结论

严格核验后得到 **8 首**尚未进入 `data/music-catalogs` 的候选。每首的官方原始单曲本身均不少于 10:00；没有把一小时循环版、歌单、专辑串烧或延长混音当作原始时长。

- 核心匹配：6 首
- 相邻匹配：2 首（`Perspectives` 含轻打击乐；`Wish Background` 为季节性背景曲）
- 具名真人作者：Kevin MacLeod、Alexander Nakarada
- AI 排查：官方作者、曲目页及说明均未标注 AI 生成；这是一项基于官方披露的来源核验，不是对制作流程无法审计部分的绝对证明。
- 去重：以标题 + 作者、ISRC、YouTube video ID 搜索全部 `data/music-catalogs/*.json`，以下 8 首均为 0 命中。

## 共用版权证据

### Kevin MacLeod / Incompetech

- [官方作者与目录结构化声明](https://incompetech.com/agent-section/)把版权持有人及作曲者都列为自然人 Kevin MacLeod，并把目录许可列为 CC BY 4.0。
- [官方 FAQ](https://incompetech.com/music/royalty-free/faq.html)明确允许用于 YouTube 且允许视频盈利；同时明确允许改变音乐，包括剪切、拼接、压缩及延长。因而剪时长、Fade、Loop 属于许可证允许的改编范围。
- 每首均从 [官方目录数据](https://incompetech.com/music/royalty-free/pieces.json)核对原始时长、ISRC、乐器、情绪和说明；曲目页提供官方 MP3 下载。
- 必须署名：

  ```text
  TITLE Kevin MacLeod (incompetech.com)
  Licensed under Creative Commons: By Attribution 4.0
  https://creativecommons.org/licenses/by/4.0/
  Edited for length / fades / loops.
  ```

### Alexander Nakarada

- [作者官方 Bandcamp 钢琴专辑](https://alexandernakarada.bandcamp.com/album/collection-piano)把 `Transcendence` 列为独立曲目并标明 13:42；页面将作者列为 Alexander Nakarada（Norway），并明确为 CC BY 4.0、允许商业使用。
- [官方单曲页](https://alexandernakarada.bandcamp.com/track/transcendence)及[作者官方 YouTube 原曲](https://www.youtube.com/watch?v=zpEGs7Ch7Iw)相互印证；YouTube 说明明确音乐可用于商业或非商业作品，免费使用时必须署名。
- 必须署名：

  ```text
  Transcendence by Alexander Nakarada
  https://alexandernakarada.bandcamp.com/track/transcendence
  Licensed under Creative Commons Attribution 4.0
  https://creativecommons.org/licenses/by/4.0/
  Edited for length / fades / loops.
  ```

## 可采用的 8 首

| # | 曲名 / 作者 | 官方原始时长 | 来源与下载 | 风格核验 | 真人 / 非 AI 证据 | 采用结论 |
|---:|---|---:|---|---|---|---|
| 1 | **That Zen Moment — Kevin MacLeod** | **10:02** | [官方曲目页](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN2400001) · [官方 MP3](https://incompetech.com/music/royalty-free/mp3-royaltyfree/That%20Zen%20Moment.mp3) · ISRC `USUAN2400001` | 官网：Calming / Mystical / Relaxed，0 BPM；弦乐与 bowl drum，说明强调漂亮和弦及 zen。无强鼓、EDM 或高能段落披露。 | 官网结构化声明将作曲者列为自然人 Kevin MacLeod；曲目说明是作者第一人称演奏经历，无 AI 披露。 | **采用 · 核心**。适合日出、山野、慢镜头；虽非纯钢琴，但符合柔和冥想氛围。 |
| 2 | **Concentration — Kevin MacLeod** | **29:53** | [官方曲目页](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1700022) · [官方 MP3](https://incompetech.com/music/royalty-free/mp3-royaltyfree/Concentration.mp3) · [官方视频](https://www.youtube.com/watch?v=7WUI1zQ5O_0) · ISRC `USUAN1700022` | 官网：Calming / Relaxed，0 BPM；Synths + Electric Piano，说明是漂浮天空般的低干扰状态。 | 同上；2017 年官方作品页无 AI 生成披露。 | **采用 · 核心**。长时城市夜景、公路、雨景优先。 |
| 3 | **Perspectives — Kevin MacLeod** | **11:58** | [官方曲目页](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1300027) · [官方 MP3](https://incompetech.com/music/royalty-free/mp3-royaltyfree/Perspectives.mp3) · [官方视频](https://www.youtube.com/watch?v=R23C2yu4e4c) · ISRC `USUAN1300027` | 官网：Calming / Relaxed / Uplifting，59 BPM；有机 Synth、Piano、偶发 Flute，并含 Percussion。 | 同上；2013 年官方作品页无 AI 生成披露。 | **采用 · 相邻**。节拍低，但应在入库试听时确认打击乐不抢画面；更适合公路而非纯静态雨景。 |
| 4 | **Organic Meditations Two — Kevin MacLeod** | **15:55** | [官方曲目页](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100758) · [官方 MP3](https://incompetech.com/music/royalty-free/mp3-royaltyfree/Organic%20Meditations%20Two.mp3) · ISRC `USUAN1100758` | 官网：Calming / Relaxed，0 BPM，并直接描述为 “very long, very calming”；Tuba、French Horns、Marimba。 | 同上；2010 年官方作品页无 AI 生成披露。 | **采用 · 核心**。低速冥想氛围，适合自然、乡村和长镜头；非钢琴核心。 |
| 5 | **Tranquility Base — Kevin MacLeod** | **18:29** | [官方曲目页](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100614) · [官方 MP3](https://incompetech.com/music/royalty-free/mp3-royaltyfree/Tranquility%20Base.mp3) · ISRC `USUAN1100614` | 官网：Mystical / Relaxed，0 BPM；Synth、Bells、Percussion，官方称 “super chill, meditative, and massively long drone”。官网特别说明试听仅 3 分钟，但下载原曲为 18 分钟，故此处采用下载文件的官方原始时长，不把预览当原曲。 | 同上；2009 年官方作品页无 AI 生成披露。 | **采用 · 核心**。适合夜景、雨夜、长时间留白；轻铃音需试听确认与画面兼容。 |
| 6 | **Light Awash — Kevin MacLeod** | **29:20** | [官方曲目页](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100175) · [官方 MP3](https://incompetech.com/music/royalty-free/mp3-royaltyfree/Light%20Awash.mp3) · ISRC `USUAN1100175` | 官网：Bright / Uplifting / Relaxed，0 BPM；明确为整首约 30 分钟、完全由 slow-attack synths 构成的 atmospheric piece。 | 同上；2006 年官方作品页无 AI 生成披露。 | **采用 · 核心**。柔慢 Synth Pad，适合日出、云层和长距离驾驶；不是钢琴曲。 |
| 7 | **Wish Background — Kevin MacLeod** | **19:34** | [官方曲目页](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100391) · [官方 MP3](https://incompetech.com/music/royalty-free/mp3-royaltyfree/Wish%20Background.mp3) · ISRC `USUAN1100391` | 官网：Calming / Relaxed / Uplifting；Piano、Strings、Bells、Celesta、Brass，官方定义为 holiday backdrop，每约 5 分钟转调。 | 同上；2007 年官方作品页无 AI 生成披露。 | **采用 · 相邻/季节性**。可用于冬季、节日街景；不建议作为全年通用疗愈首选。 |
| 8 | **Transcendence — Alexander Nakarada** | **13:42** | [官方单曲页](https://alexandernakarada.bandcamp.com/track/transcendence) · [官方钢琴专辑](https://alexandernakarada.bandcamp.com/album/collection-piano) · [官方 YouTube](https://www.youtube.com/watch?v=zpEGs7Ch7Iw) · video ID `zpEGs7Ch7Iw` | 作者官方标题标为 Lo-fi chill，且收录于官方 Piano collection；柔和、低干扰，符合暖 Lo-Fi / 夜景 / 驾驶方向。采用 Bandcamp 原曲 13:42，不使用 YouTube 容器多出的约 1 秒。 | Bandcamp 将具名自然人 Alexander Nakarada 列为作者；官方频道说明为第一人称创作陈述，无 AI 生成披露。 | **采用 · 核心**。本批最贴近“长单曲 + Piano + 暖 Lo-Fi”。 |

## 明确排除的长视频 / 长曲

- Alexander Nakarada 的 `Fall Asleep`、`Deep Relaxation`：符合时长，但已在当前目录中，按要求排除。
- Purrple Cat 官方频道的 25–43 分钟视频：页面标题对应专辑/曲集，不是单首原始作品，不以视频总长入库。
- Scott Buckley 的 `Library Songs`、完整原声带及动画配乐长视频：合集或完整配乐组，不是单首原始作品；`Decoherence` 虽视频超过 10 分钟，但官方曲目本身不足 10 分钟。
- Savfk `Journey to the Stars`：原视频超过 10 分钟，但官方定义为 sci-fi action epic，偏离 Calm / Gentle 画像。
- Kevin MacLeod `Magic Escape Room`、`Long Note Four`：分别持续增强至疯狂段落、开头明确 intense，违反避开 energetic / intense 的硬条件。
- Kevin MacLeod `Wind of the Rainforest`：官方说明明确写有 computer-generated，按“排除 AI / 自动生成来源”的保守规则剔除。
- 所有“一小时循环”“extended mix”“playlist”“full album”：即使频道和授权合格，也不计作原始长单曲。

## 入库边界

这份文件只是可采用清单，没有改动应用代码或曲库 JSON。实际入库时应逐首保存曲目页、FAQ、许可证页面与下载文件哈希，并在视频说明中使用上面的署名模板；只做剪时长、Fade、Loop，不单独重新发布音源，也不登记 Content ID。
