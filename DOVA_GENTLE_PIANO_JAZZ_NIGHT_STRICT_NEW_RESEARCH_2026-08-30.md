# DOVA 温柔钢琴爵士夜曲严格 NEW 研究（2026-08-30）

## 结论：本轮 0 首新增采用

本轮没有任何 NEW detail ID 能同时通过全部硬标准，**严格采用数为 0**。没有为了达到 5–8 首而放宽到有鼓 Lo-Fi、Serious Jazz Ballad、普通慢钢琴或缺 Weak 的曲目。

DOVA 官方精确交集只有 **5 个 detail ID**：官方标签同时具备 `温かい / 穏やか / 優しい / 弱々しい / 遅い / ﾋｰﾘﾝｸﾞ / ｼﾞｬｽﾞ`，并包含 Piano / Other Keys。其结果为：

- 3 首已存在当前 catalog 或根目录既有研究；
- 1 首 NEW 但含 Percussion；
- 1 首 NEW 但含 Serious，触发情绪硬排除。

因此本文件只记录检索结论与排除证据，不生成虚假的 S/A 采用表。

## NEW detail ID 排除项

| DOVA ID / 曲目 | 具名作者 | 精确时长 | 官方编制 / 标签证据 | Loop 状态 | 排除原因 / 原本适合画面 |
|---|---|---:|---|---|---|
| [6439 · P.U.HOME](https://dova-s.jp/bgm/detail/6439) | [かずち](https://dova-s.jp/creator/detail/50) | 1:16 | Warm、Calm、Gentle、Weak、Slow、Jazz、Healing、Piano、Other Keys、**Percussion**、Synth Lead、Synth Pad | **是**；DOVA Loop 字段为 Yes | **硬排除：Percussion**。若无此边界，本可用于温暖城市夜景或轻松室内，但不能进入当前无鼓严格库。 |
| [14348 · いつか街で偶然出会っても](https://dova-s.jp/bgm/detail/14348) | [ハモおた](https://dova-s.jp/creator/detail/416) | 3:09 | Warm、Calm、Gentle、Weak、Slow、Swing、Jazz、Acoustic、Healing、Piano；官方说明为 Piano Solo 的安静 Jazz Ballad | **非 native Loop**。DOVA Loop 字段为空；作者只说明按循环播放时违和感较低、适合长时间播放 | **硬排除：Serious**。编制非常接近目标，但官方 Serious 标签不能忽略；原本适合雨夜、蓝调时刻和重逢回忆。 |

## 已存在条目，不重复采用

| DOVA ID / 曲目 | 精确时长 | 现有状态与额外边界 |
|---|---:|---|
| [11912 · ローファイ少女は今日も寝不足](https://dova-s.jp/bgm/detail/11912) — [しゃろう](https://dova-s.jp/creator/detail/101) | 2:36 | 已存在；官方含 Synth Drum，且为 Lo-Fi Hip Hop。虽然 Track 2 是官方循环版，也不符合本轮无鼓严格边界。 |
| [14252 · 薔薇一度](https://dova-s.jp/bgm/detail/14252) — [伊藤ケイスケ](https://dova-s.jp/creator/detail/406) | 1:53 | 已存在；曲页明确 Piano + Glockenspiel + Violin，Glockenspiel 是实质旋律打击乐，严格排除。 |
| [22951 · White snow chill days](https://dova-s.jp/bgm/detail/22951) — [蒲鉾さちこ](https://dova-s.jp/creator/detail/418) | 3:40 | 已存在；真人即兴 E.Piano Solo / Ambient，画面适配度很高，但不能作为 NEW 重复收录。 |

## 为什么没有扩展搜索结果

以下常见放宽方式均会破坏用户的长期主筛选标准，因此本轮没有采用：

1. **移除 Weak 或 Slow**：会引入更多正常速度、旋律存在感较强的 Jazz。
2. **允许 Drum / Percussion / Synth Drum**：会把结果快速转为 Lo-Fi Hip Hop 或节拍型 Lounge Jazz。
3. **移除 Healing**：会混入大量普通 Jazz / Swing 配乐，不能证明疗愈用途。
4. **用“曲页听感像温柔”替代 Warm + Calm + Gentle 官方标签**：证据层级会低于当前 catalog 标准。
5. **忽略 Serious / Passion 等辅助标签**：会把叙事性、情绪推进较强的 Jazz Ballad 冒充低存在感背景音乐。

## Loop、版权与 AI 边界

- 《P.U.HOME》虽为官方 Loop=Yes，但 Percussion 硬排除优先于 Loop 优势。
- 《いつか街で偶然出会っても》只是作者说明重复播放违和感较低，DOVA Loop 字段仍为空；不能标记为 native seamless。
- 使用边界统一依据 DOVA 官方[音源利用许可](https://dova-s.jp/help/articles/license/)及作者附加条件。实际发布前保存当日详情页、作者页、下载页与许可页快照。
- 5 首均有具名 DOVA 作者档案，核对页面无 AI 生成披露；这只支持“具名创作者、官方无 AI 披露”的有限结论。

## 去重与核验方法

- 合并 `data/music-catalogs/dova-*.json` 当前 detail IDs 与根目录全部既有 DOVA research Markdown 链接，得到 **348 个已使用 ID**。
- 官方精确交集的 5 个 ID 为 `6439, 11912, 14252, 14348, 22951`；只有 `6439` 与 `14348` 为 NEW，但两者分别触发 Percussion 与 Serious 硬排除。
- 标题、作者、精确时长、标签、乐器说明与 Loop 状态只使用 DOVA 官方详情页；作者身份使用 DOVA 官方 creator 页面。
