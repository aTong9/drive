# DOVA 柔和原声吉他 × 钢琴 / Synth Pad 核验（2026-08-30）

## 结论与证据边界

本批严格保留 **12 首新曲**：4 首 A 级直接命中“柔和原声吉他 + 钢琴或 Synth Pad”，8 首 B 级为低存在感的柔和原声吉他补充。全部作品由 DOVA 官方曲目页列出具名作曲者，并链接官方作者档案；曲目页与作者档案未见 AI 生成标注。这里的“真人来源”是可核验的作者身份与创作履历，不是对音频制作过程的绝对取证。

已将 12 个 detail ID 与当前 `data/music-catalogs/dova-*.json` 的 **140 个 DOVA ID** 交叉去重，并将“标题 + 作者”与 `data/music-catalogs/*.json` 的现有条目交叉去重；重复数均为 **0**。

采用标准：必须命中 Warm / Calm / Gentle（DOVA 标签「温かい・穏やか・優しい」），并优先 Slow / Weak / Healing / Ambient / Piano / Synth Pad / A.Guitar；不采用含强鼓、Funk、EDM、Energetic、Intense 或 Loud 证据的曲目。

## A 级：柔和原声吉他 + 钢琴 / Synth Pad（4 首）

| 曲目 / 作者 | 原始时长 | 原生 Loop | 官方乐器与风格证据 | 建议画面 | 官方来源 |
|---|---:|:---:|---|---|---|
| **平穏に過ぎて** / lei | 2:57 | 否 | A.Guitar 伴奏 + Piano + Oboe + Synth Pad；Warm、Calm、Gentle、Slow | 乡村道路、河岸、薄暮、安静旅程 | [曲目 11054](https://dova-s.jp/bgm/detail/11054) · [作者 346](https://dova-s.jp/creator/detail/346) |
| **夕暮れ時** / ゆうきわたる | 2:15 | 否 | Piano + A.Guitar + Ocarina；Warm、Calm、Gentle、Slow，官方说明为温柔美丽的黄昏 | 日落、海岸、田野、归途 | [曲目 10566](https://dova-s.jp/bgm/detail/10566) · [作者 239](https://dova-s.jp/creator/detail/239) |
| **At Home, After All** / Keido Honda | 2:13 | 否 | A.Guitar Solo + gentle Synth Pad；BPM 71、Healing、Warm、Calm、Gentle、Slow | 居家暖光、雨天窗边、村落日常 | [曲目 20839](https://dova-s.jp/bgm/detail/20839) · [作者 136](https://dova-s.jp/creator/detail/136) |
| **心にふれる** / ゆうり (Yuli Audio Craft) | 0:54 | 否 | Piano + A.Guitar；BPM 75、Warm、Calm、Gentle、Modest、Slow | 温柔过场、人物回忆、日出前后 | [曲目 7602](https://dova-s.jp/bgm/detail/7602) · [作者 204](https://dova-s.jp/creator/detail/204) |

## B 级：柔和原声吉他补充（8 首）

这些曲目符合 Healing / Warm / Calm / Gentle 的总体画像，但没有同时使用钢琴或 Synth Pad，故不冒充 A 级组合编制。

| 曲目 / 作者 | 原始时长 | 原生 Loop | 官方乐器与风格证据 | 建议画面 | 采用说明 / 官方来源 |
|---|---:|:---:|---|---|---|
| **レトロな置き時計** / MATSU | 3:37 | 否 | Classical A.Guitar；Warm、Calm、Gentle、Modest、Slow、Healing | 老屋、旧街、回忆、暖色黄昏 | B+：留白充足、无鼓标签。[曲目 14579](https://dova-s.jp/bgm/detail/14579) · [作者 84](https://dova-s.jp/creator/detail/84) |
| **ひとりきりの夕べ** / のる | 3:29 | 否 | A.Guitar；Warm、Calm、Gentle、Slow，官方说明“静かで落ち着いた” | 独行夜路、村庄暮色、安静室内 | B+：略带孤独但不激烈。[曲目 17696](https://dova-s.jp/bgm/detail/17696) · [作者 432](https://dova-s.jp/creator/detail/432) |
| **Folklore** / shimtone | 2:15 | **是** | Classical A.Guitar；Warm、Calm、Gentle、Modest、Slow | 旧村、民间故事、森林小径 | B：含 Serious / Fantasy 标签，限叙事性安静画面。[曲目 15738](https://dova-s.jp/bgm/detail/15738) · [作者 290](https://dova-s.jp/creator/detail/290) |
| **ゆるやかな道** / ゆうり (Yuli Audio Craft) | 1:49 | 否 | A.Guitar；BPM 75、Warm、Calm、Gentle、Modest、Slow | 乡间散步、日常公路、午后 | B：曲页列“其他打击乐”，采用前试听确认存在感足够弱。[曲目 7326](https://dova-s.jp/bgm/detail/7326) · [作者 204](https://dova-s.jp/creator/detail/204) |
| **日が暮れる** / ゆうり (Yuli Audio Craft) | 1:22 | 否 | A.Guitar；BPM 100、Warm、Calm、Gentle、Modest、Slow | 日暮、归家、安静街道 | B：无鼓标签，但速度主观感需试听。[曲目 16200](https://dova-s.jp/bgm/detail/16200) · [作者 204](https://dova-s.jp/creator/detail/204) |
| **カフェでギターを** / 田中芳典 | 1:12 | 否 | 真人演奏 A.Guitar Solo；Weak、Warm、Calm、Gentle、Slow、Healing | 朝日、原木咖啡馆、乡村静物 | B+：Track 1 已重复两遍但 DOVA Loop 字段未标，不记作原生 Loop。[曲目 10753](https://dova-s.jp/bgm/detail/10753) · [作者 130](https://dova-s.jp/creator/detail/130) |
| **ちむじゅらさん** / 伊藤ケイスケ | 1:12 | 否 | A.Guitar + Okinawa Sanshin；Weak、Ambient、Healing、Warm、Calm、Gentle、Slow；Track 2 为吉他版 | 海岸、岛屿午后、日落 | B：优先采用 Track 2，民族色彩比主画像更明显。[曲目 14942](https://dova-s.jp/bgm/detail/14942) · [作者 406](https://dova-s.jp/creator/detail/406) |
| **アルペジオ** / こおろぎ | 1:00 | 否 | 简洁 A.Guitar Arpeggio；Warm、Calm、Gentle、Slow、Healing | 雨天、晨雾、短章节过场 | B：作者明确为编程制作的原声吉他质感，不等同 AI 生成。[曲目 739](https://dova-s.jp/bgm/detail/739) · [作者 5](https://dova-s.jp/creator/detail/5) |

## 明确不采用

| 曲目 | ID | 不采用原因 |
|---|---:|---|
| 穏やかな午後 | 15328 | 虽为温柔 A.Guitar，但曲页明确列出 Synth Drum，不进入严格批次。 |
| ゆるやかさんぽ | 18143 | 曲页列出 Synth Drum、A.Bass，并有 Happy / Passion 标签，偏离弱节拍画像。 |
| 自然の中でゆったりと | 14131 | 曲页列出 Drum + Percussion + A.Bass，证据不足以证明节拍足够弱。 |
| おひるね | 8796 | 曲页列出 Percussion 与旋律打击乐，不符合本批低存在感要求。 |
| Orange Citizen | 13765 | 官方标签含 Rock、完整 Drum 与 Band Sound，不符合严格画像。 |

## 授权与长度结论

- 统一依据 DOVA 官方[音源利用许可](https://dova-s.jp/help/articles/license/)及各作者档案的附加条件。许可覆盖商用/非商用制作物中的背景音乐、YouTube 等在线影像内容，并允许编辑、Fade 与截取后 Loop；不得把音源本身作为主要内容重新发布。
- 12 首均应从对应 DOVA 曲目页下载；每次使用前复核当时曲目页、作者条件及许可。DOVA 官方页面在 2026-08-30 提示将于 2026-09-15 更名为 OpenTracks，链接与条款可能后续调整。
- 本批只有 **Folklore** 的 DOVA Loop 字段标为原生 Loop；其他 11 首仅能标为“授权允许后期循环”，不能标为原生无缝 Loop。
- 本批没有原始时长达到 10 分钟的曲目；最长为《レトロな置き時計》3:37。不能把后期重复或 Track 1 内部重复误写为原始长曲。
