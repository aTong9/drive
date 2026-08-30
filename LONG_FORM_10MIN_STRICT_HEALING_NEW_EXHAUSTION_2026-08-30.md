# 原始单曲 ≥10 分钟严格 Healing NEW 穷尽研究（2026-08-30）

## 结论：0 首采用

本轮没有找到同时满足以下全部条件的 NEW 单曲，因此 **采用数为 0**，不以播放列表、合集、YouTube 延长版或后期 Loop 凑数：

- 官方原始音频时长 `>=600 秒`；
- 具名真人创作者 / 官方人类创作者档案；
- Healing + Warm + Calm + Gentle；
- 优先 Piano / Ambient / Synth Pad / Soft Guitar；
- 不含 Strong Drums、Funk、EDM、Energetic、Intense、Loud、Passion、Serious、Tension、Dark、Fear、Despair 或 Void；
- 与仓库全部 URL、ID 和标题去重。

## DOVA-SYNDROME 官方结果

使用 DOVA 官方高级搜索的 `3:00+` 时长档与 `温かい + 穏やか + 優しい + Healing` 条件，逐页读取官方搜索结果显示的原始 Track 时长：310 个 3 分钟以上结果中，只有 **1 首达到 10 分钟**。

| 曲目 | 官方原始时长 | 具名作者 | 处理 |
|---|---:|---|---|
| [13253 · Piano Improvisation 2020 Spring No.3](https://dova-s.jp/bgm/detail/13253) | **12:55 / 775 秒** | [brightwaltz](https://dova-s.jp/creator/detail/81) | **排除**。虽为 13 分钟左右的安静即兴 Piano，并具有 Warm、Calm、Gentle、Ambient、Healing，但官方全标签同时含 **Serious、Dark、Despair**，直接触发硬排除。 |

因此 DOVA 没有可采用的 NEW 原始 10 分钟严格曲目。

## Incompetech 官方结构化目录结果

使用 Incompetech 官方 [Agent Section](https://incompetech.com/agent-section/)指向的完整官方 `pieces.json`，以官方 `length` 字段筛 `>=10:00`，再与仓库 `incompetech-calm-100.json`、`incompetech-long-calm-5.json` 和其他目录标题 / ISRC 去重。

仓库已存在的大量合格长曲包括 Deep Relaxation、Wind of the Rainforest、Ebbs and Flows、Almost in F、Concentration、Peace of Mind 等，不能作为 NEW 重复加入。去重后剩余 3 个 Calm / Relaxed 长候选均不满足本轮完整画像：

| NEW 官方候选 | 官方原始时长 | 官方元数据 | 排除原因 |
|---|---:|---|---|
| Perspectives · `USUAN1300027` | **11:58 / 718 秒** | BPM 59；Calming、Relaxed、Uplifting；Percussion、Synths、Piano、Flute | 官方没有 Warm / Gentle / Healing 证据，并含 Percussion；不能仅凭低 BPM 推断完整画像。 |
| Revival · `USUAN1100476` | **17:26 / 1046 秒** | BPM 56；Calming、Mystical、Relaxed、Uplifting；Guitar、Bass、Electric Piano、Kit；说明会多次 build | 缺 Warm / Gentle / Healing；有 Kit 且曲目会 build，不符合低强度严格底乐。 |
| Wish Background · `USUAN1100391` | **19:34 / 1174 秒** | BPM 119；Calming、Relaxed、Uplifting；Piano、Strings、Bells、Celesta、Brass Ensemble；每约 5 分钟转调 | 缺 Warm / Gentle / Healing，BPM 较高、配器和调性变化较多，不适合作为严格低存在感 Healing 项。 |

## Scott Buckley 与 PeriTune

- 当前仓库已有 **100 首 Scott Buckley** 官方曲目与许可信息。本轮核对其官方 Library / Music 索引和现有目录后，没有获得一首可用官方原始音频证明 `>=600 秒`、同时满足完整严格画像且不在库中的候选。搜索结果中的发布日期 / 评论数字不能当作曲目分钟数。
- 当前 PeriTune 主目录已为 **103 条**。官方研究中最长的独立候选 / 特殊试听仍不足 10 分钟；例如 Gentle Theme 三版本 X-Fade 为 6:41，而且只是三个版本串联试听，不能当单一器乐长曲。本轮没有确认到官方原始 MP3 `>=600 秒` 的 NEW 严格候选。

## 为什么不采用视频长时版本

以下都不符合“原始单曲 ≥10 分钟”：

- YouTube 1 小时 / 3 小时重复视频；
- Playlist 总时长；
- 多曲 Album / compilation；
- 作者或用户把 2–5 分钟原曲后期重复形成的 extended version；
- 页面播放控件或视频长度，若无法对应官方可下载原始音频文件；
- 将多个 instrument mix 串联的 X-Fade preview。

## 许可与 Content ID 边界

由于本轮没有采用项，不新增许可 tuple。若未来出现合格曲目，应按平台保存：

- **DOVA**：官方[音源利用许可](https://dova-s.jp/help/articles/license/)允许商业背景使用、YouTube、编辑、Fade 和 Loop；署名非强制。禁止将音源或含其音乐的作品登记到 Content ID / fingerprint；仍需保留曲目页、作者页、下载记录和许可快照以处理误 claim。
- **Incompetech**：官方曲页 CC BY 许可允许商业 / 盈利及改编，必须使用曲页给出的完整署名；保存 ISRC、曲页和官方 MP3。Content ID / claim 风险需按官方 FAQ 与曲页处理。
- **Scott Buckley**：官方曲库通常为 CC BY 4.0，可商业使用和改编，YouTube 说明栏必须署名；未署名可能触发 claim，无署名需求须另购许可。
- **PeriTune**：旧曲 CC BY 4.0 与当前官网规则并存；商业 / YouTube / 编辑 / Fade / Loop 可用，稳妥做法仍是保留 `Music: PeriTune https://peritune.com/`。官方曾公告第三方设置导致的非预期 claim 风险。

## 真人与 AI 边界

- DOVA 排除项作者 brightwaltz 有官方具名作者档案；Incompetech 作者 Kevin MacLeod、Scott Buckley、PeriTune / むつき醒均有官方人类创作者档案。
- 官方页面没有音乐 AI 生成披露时，只能记录 `aiDisclosureStatus: "no_disclosure_found"`，不能写成“已技术验证非 AI”。
- 本轮 0 首采用的原因是严格画像 / 去重 / 原始时长不同时成立，而不是作者身份不足。

