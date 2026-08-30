# PeriTune 官方 NEW 独立版本研究（2026-08-30）

## 结论

复核已有 12 个候选后，当前 `data/music-catalogs/peritune-healing-100.json` 已有 **102 条**，其中 9 个候选或其相同音频版本已经存在。严格按 `曲目版本 + 官方曲目页 + 官方音频 URL` 去重后，只剩 **3 首 NEW 独立版本**：`Shizima2`、`Minamo2`、`Snowy_Village2`。

没有把以下项目重复加入：Gentle Theme2 三种器乐版本、Guitar Gentle、Music-box Gentle2、Powder Snow、Snowy Day2、Snowy Day4；Gentle Theme X-Fade 只是已入库三种版本的串联试听，也不作为新单曲加入。

## NEW 候选与 compact tuples

compact tuple 顺序沿用当前目录：

`[title, officialTrackUrl, bpm, kind, nativeLoop, searchableTags, durationSeconds]`

```json
[
  ["Shizima2", "https://peritune.com/blog/2017/09/08/shizima2/", 85, "ambient", true, "healing, warm, calm, gentle, quiet, relax, Japanese ambient, natural, piano, koto, strings", 98.96],
  ["Minamo2", "https://peritune.com/blog/2016/11/03/minamo2/", 92, "ambient", true, "healing, warm, calm, gentle, quiet, relax, Japanese ambient, natural, piano, acoustic guitar, koto, flute, strings", 239.343719],
  ["Snowy Village2", "https://peritune.com/blog/2021/01/08/snowy_village2/", 88, "acoustic", true, "healing, warm, calm, gentle, quiet, pastoral, winter, snowy village, medieval, Celtic, recorder, lute, harp, strings", 207.606333]
]
```

## 逐首官方证据

| 候选 | 官方音频与精确时长 | 风格 / 情绪 / 配器 | Loop | 采用建议 |
|---|---|---|---|---|
| [Shizima2](https://peritune.com/blog/2017/09/08/shizima2/) | [官方 MP3](https://peritune.com/music/PerituneMaterial_Shizima2.mp3)；本地读取官方文件容器时长 **98.960000 秒（1:38.960）** | 官方页：Japanese Ambient、Natural、Healing；優しい、穏やか、静か、Relax、きれい；Koto、Piano、Strings；BPM 85 | **Yes**；官方页提供 Loop 版本 | S：晨雾、湖面、溪流、日式乡村、安静自然空镜。编制轻，但仍应试听 Koto 主旋律存在感 |
| [Minamo2](https://peritune.com/blog/2016/11/03/minamo2/) | [官方 MP3](https://peritune.com/music/PerituneMaterial_Minamo2.mp3)；**239.343719 秒（3:59.344）** | 官方页：Japanese Ambient / Natural / Healing；優しい、穏やか、静か、Relax；Koto、Piano、Acoustic Guitar、Flute、Strings、Fretless Bass、Angklung、Sleigh Bell、Udu；BPM 92 | **Yes**；官方页提供 Loop 版本 | A：水面、湖泊、森林、自然长镜头。虽然整体 Healing / quiet，但含 Udu、Bell、Angklung，入库前必须试听确认打击感足够弱 |
| [Snowy Village2](https://peritune.com/blog/2021/01/08/snowy_village2/) | [官方 MP3](https://peritune.com/music/PerituneMaterial_Snowy_Village2.mp3)；**207.606333 秒（3:27.606）** | 官方页：gentle Medieval / Celtic winter folk；癒し、穏やか、優しい、長閑；Recorder、Viola da Gamba、Strings、Lute、Harp、Harpsichord、Crotales、Sleigh Bell、Tubular Bell；BPM 88 | **Yes**；官方页提供 Loop 版本 | A：雪村、冬季乡间、节日灯光。民族 / 中世纪色彩和铃声较明显，不作为通用低存在感 Piano 首选 |

## 许可与 YouTube 使用边界

统一官方证据：PeriTune [About / 利用规约](https://peritune.com/about/)与[2026 年规则迁移说明](https://peritune.com/blog/2026/03/01/terms-update/)。三首均早于 2026-02：

- 曲目页原始标示为 **CC BY 4.0**；允许商业使用、改编和再利用，原 CC BY 路径要求适当署名。
- 官网当前规则明确个人 / 商业项目均可免费使用，可作为影片、YouTube、广告、直播等作品的背景音乐；因此 **YouTube 盈利可用**。
- 官网明确允许加工与改编，包括 tempo、effect 和 loop；因此 trim、剪时长、Fade、Loop 均可在背景音乐作品中进行。
- 2026 迁移说明允许旧曲优先采用官网较宽松的当前规则，当前规则把署名设为任意。为减少争议，仍建议保留：`Music: PeriTune https://peritune.com/`，并附具体曲名 / 曲目页。
- 禁止把音乐本身作为主体完整转载、制作纯音乐合集、冒充作者、二次销售或散发音源，以及把素材登记到 Content ID。

## Content ID 风险

PeriTune 官方 2026-08-24 [Content ID 申诉公告](https://peritune.com/blog/2026/08/24/youtube-content-id%E3%81%AE%E8%91%97%E4%BD%9C%E6%A8%A9%E7%94%B3%E3%81%97%E7%AB%8B%E3%81%A6%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/)说明：TuneCore 设置错误曾导致部分曲目出现非预期 claim；合规使用者并未违反规则，可依据官方说明提出异议。

因此目录中应保存：

- `contentIdRisk: "possible-erroneous-claim"`
- 曲目页、音频 URL、下载日期与当日规则页面快照
- 建议署名文本，以便申诉时提供清楚的来源链

## 真人作者与 AI 边界

PeriTune 官方 About Profile 将创作者明确记为 **PeriTune / むつき醒（Sei Mutsuki）**，并记载其从 2002 年开始音乐活动、2015 年创办 PeriTune，属于具名真人创作者证据。

三首曲目页没有“音乐由 AI 生成”的披露，目录只能记录：

- `creationOrigin: "human-creator-profile"`
- `aiDisclosureStatus: "no_disclosure_found"`

这不是音频取证或作者未使用任何 AI 工具的绝对保证；网页图片是否使用 AI 与音乐生成来源不是同一问题。

## 去重结果

- 当前 PeriTune 主目录：**102 条**。
- `Shizima`、`Minamo`、`Snowy Village` 的基础版本已经存在，但 `Shizima2`、`Minamo2`、`Snowy Village2` 是不同官方曲目页、不同官方音频文件和不同版本，因此仍属 NEW。
- 已跨 `data/music-catalogs/*.json` 搜索标题、官方曲目 URL 与音频文件名；未发现这 3 个版本。

