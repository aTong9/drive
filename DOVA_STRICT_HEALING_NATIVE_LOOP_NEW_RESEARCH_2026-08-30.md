# DOVA 严格 Healing / 原生 Loop NEW 研究（2026-08-30）

## 结论

本轮保留 **8 首此前未入库的严格候选**。全部 DOVA 官方详情页同时具有 `温かい / 穏やか / 優しい / ﾋｰﾘﾝｸﾞ`，并具有 `遅い`；未出现 Drum、Percussion、Melodic Percussion、Other Percussion、Synth Drum、Grand、Forceful、Funk、EDM、Energetic、Intense、Loud、Passion、Serious、Tension、Dark、Fear、Despair 或 Void 对应官方标签。

- **6 首 DOVA 原生 Loop = Yes**，适合长视频连续铺底；
- **2 首 3 分钟以上**，但官方 Loop = No，只能在后期做剪辑、Fade 或人工重复，不能标为原生无缝循环；
- 全部具有 DOVA 具名作者档案，详情页与作者页未发现 AI 生成披露。该结论只能记录为 `no_disclosure_found`，不能升级为“确定未使用 AI”。

## 严格采用项

| 级别 | DOVA ID / 曲目 | 具名作者 | 精确时长 | 官方标签与编制证据 | Native Loop | 推荐画面 |
|---|---|---|---:|---|---|---|
| S | [2025 · peace of mind](https://dova-s.jp/bgm/detail/2025) | [MATSU](https://dova-s.jp/creator/detail/84) | **2:36** | Warm、Calm、Gentle、Slow、Healing、A.Guitar；官方说明为“Acoustic Guitar 的平静乐曲” | **Yes** | 乡村道路、海岸日落、木屋清晨、田野长镜头 |
| S | [8983 · 安らぎと微睡み](https://dova-s.jp/bgm/detail/8983) | [ゆーぎり](https://dova-s.jp/creator/detail/231) | **2:07** | Warm、Calm、Gentle、Slow、Healing、Piano；官方明确为 **Piano only**、圆润无棱角的平静 BGM | **Yes** | 雨窗、午睡、晨雾、静室、低存在感长镜头 |
| S | [12001 · ささやかな幸せ](https://dova-s.jp/bgm/detail/12001) | [shimtone](https://dova-s.jp/creator/detail/290) | **1:49** | Warm、Calm、Gentle、Slow、Healing、Piano + high Strings；官方说明为 Piano 与 Violin 的平静温柔曲 | **Yes** | 家庭日常、乡村清晨、柔光、花草空镜 |
| S | [12298 · Dreamland](https://dova-s.jp/bgm/detail/12298) | [shimtone](https://dova-s.jp/creator/detail/290) | **2:13** | Warm、Calm、Gentle、Slow、Ambient、Healing、Piano + Synth Pad + light high Woodwind / Chorus；官方说明为平静温暖的 healing 曲 | **Yes** | 云雾、梦境、湖面、日出、柔焦自然镜头；需试听人声质感是否抢画面 |
| S | [14505 · 変わりゆく街](https://dova-s.jp/bgm/detail/14505) | [shimtone](https://dova-s.jp/creator/detail/290) | **2:05** | Warm、Calm、Gentle、Slow、Ambient、Healing、Piano + high Strings；官方明确只有 Piano 与 Strings | **Yes** | 城市变迁、蓝调时刻、安静街道、返程、旧村落 |
| S | [14006 · 蒼の風景画](https://dova-s.jp/bgm/detail/14006) | [shimtone](https://dova-s.jp/creator/detail/290) | **2:00** | Warm、Calm、Gentle、Slow、Healing、Piano；官方说明为 Piano 演奏的平静温暖乐曲 | **Yes** | 蓝色时刻、海岸、雨后天空、乡村远景、日出前 |
| A | [21062 · 君と眺める星の夜は](https://dova-s.jp/bgm/detail/21062) | [えだまめ88](https://dova-s.jp/creator/detail/351) | **3:05** | Warm、Calm、Gentle、Slow、Healing、Synth Pad + low Strings / Bass；官方说明以宇宙、短暂感为主题的 healing BGM | **No** | 星空、雪夜、露营、城市夜景、慢速夜间公路 |
| A | [20081 · Aurora](https://dova-s.jp/bgm/detail/20081) | [MFP【Marron Fields Production】](https://dova-s.jp/creator/detail/188) | **3:04** | Warm、Calm、Gentle、Slow、Healing、Other Synth；官方说明为 Synthesizer healing 曲，BPM 100 | **No** | 极光、晨雾、云海、雪原、抽象自然空镜；采用前试听节拍体感 |

## 可落库 tuples

```json
[
  ["peace of mind", 2025, "MATSU", "soft-guitar", ["温かい", "穏やか", "優しい", "遅い", "ﾋｰﾘﾝｸﾞ", "A.ｷﾞﾀｰ"], "アコースティックギターの穏やかな曲です。", 156, true],
  ["安らぎと微睡み", 8983, "ゆーぎり", "piano", ["温かい", "穏やか", "優しい", "遅い", "ﾋｰﾘﾝｸﾞ", "ﾋﾟｱﾉ"], "ピアノオンリーの角のない穏やかなBGMです。", 127, true],
  ["ささやかな幸せ", 12001, "shimtone", "piano-strings", ["温かい", "穏やか", "優しい", "遅い", "ﾋｰﾘﾝｸﾞ", "ﾋﾟｱﾉ", "弦楽器-高"], "ピアノとバイオリンによる穏やかで優しい楽曲です。", 109, true],
  ["Dreamland", 12298, "shimtone", "piano-pad-ambient", ["温かい", "穏やか", "優しい", "遅い", "ｱﾝﾋﾞｴﾝﾄ", "ﾋｰﾘﾝｸﾞ", "ﾋﾟｱﾉ", "ｼﾝｾﾊﾟｯﾄﾞ"], "穏やかで暖かなヒーリング的な楽曲です。", 133, true],
  ["変わりゆく街", 14505, "shimtone", "piano-strings-ambient", ["温かい", "穏やか", "優しい", "遅い", "ｱﾝﾋﾞｴﾝﾄ", "ﾋｰﾘﾝｸﾞ", "ﾋﾟｱﾉ", "弦楽器-高"], "ピアノとストリングスのみの穏やかで温かみのあるヒーリング、アンビエント系の楽曲です。", 125, true],
  ["蒼の風景画", 14006, "shimtone", "piano", ["温かい", "穏やか", "優しい", "遅い", "ﾋｰﾘﾝｸﾞ", "ﾋﾟｱﾉ"], "ピアノによる穏やかで温かな楽曲です。", 120, true],
  ["君と眺める星の夜は", 21062, "えだまめ88", "synth-pad-ambient", ["温かい", "穏やか", "優しい", "遅い", "ﾋｰﾘﾝｸﾞ", "ｼﾝｾﾊﾟｯﾄﾞ"], "宇宙や儚さをテーマにした癒し系BGMです！", 185, false],
  ["Aurora", 20081, "MFP【Marron Fields Production】", "synth-healing", ["温かい", "穏やか", "優しい", "遅い", "ﾋｰﾘﾝｸﾞ", "その他ｼﾝｾ"], "シンセサイザーを使ったヒーリング曲です。BPM 100。", 184, false]
]
```

tuple 顺序为：`title, detailId, artist, kind, tags, description, durationSeconds, nativeLoop`。

## 排除与复用审计

- 先合并 `data/music-catalogs/*dova*.json` 中数组第二位的 detail ID、对象式 `detailId / dovaId`、详情 URL，以及根目录全部既有 DOVA 研究链接，共得到 **400 个已使用 ID**；本轮 8 个 ID 均未命中。
- 既有 soft-keys 子研究返回的 8 首中，`22683 / 14723 / 23612` 明确含 `旋律打楽器`，触发当前硬排除；`15973 / 16090 / 1317 / 7967 / 19554` 已存在于当前 catalog / 既有研究集合，因此未重复采用。
- 另核对并排除：`23442 Dark blue night` 含 Synth Drum；`22310 雨の花` 含 Passion + Void；`22587 Electric Forest` 含 Melodic Percussion + Synth Drum；多首 shimtone 候选含 Passion 或 Synth Drum，不因其标题/说明温柔而放宽。

## 授权、Loop 与 AI 边界

- 使用边界统一依据 DOVA 官方[音源利用许可](https://dova-s.jp/help/articles/license/)及各作者附加条件。DOVA 许可允许在 YouTube 视听作品中使用及按规则进行必要编辑，但仍应在发布前保存详情页、作者页、下载页和当日许可页。
- `Native Loop = Yes` 只依据详情页 `Loop` 字段；未把“许可允许后期重复”冒充原始文件无缝循环。
- 作者均为 DOVA 官方资料中的具名创作者；官方页面未发现 AI 生成披露，只能标为 `no_disclosure_found`。若项目要求法律意义上的“保证非 AI”，仍需取得作者书面声明。

