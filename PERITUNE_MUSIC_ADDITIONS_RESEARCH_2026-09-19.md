# PeriTune 新增曲目核验

核验日期：2026-09-19。新增 2 首；按官方文章 URL 与规范化标题全库去重，未将 Whisper2 / Whisper3 算作同一曲。

| 曲目 | 官方发表日期 | 配器与风格依据 | BPM | 原始时长 | 原生循环文件 |
|---|---|---|---:|---:|---|
| [Whisper](https://peritune.com/blog/2015/11/15/whisper/) | 2015-11-15 | 钢琴、室内乐；Healing、温馨、闲适、温柔；有神秘和感伤色彩，适合夜林和柔和夜景 | 90 | 249 秒 | 官方提供 MP3/OGG/M4A 循环版 ZIP |
| [Sakuya2](https://peritune.com/blog/2016/01/01/sakuya2/) | 2016-01-01 | 琴、长笛、New Age；疗愈、温馨、闲适、温柔、春樱；有感伤色彩且旋律较明显 | 86 | 206 秒 | 官方提供 MP3/OGG/M4A 循环版 ZIP |

Warm/Calm/Gentle 分别依据官方「ほのぼの／まったり／優しい」进行选曲映射，不声称网页使用了这些英文词。没有把两曲描述为无旋律、绝对无打击或已完整试听。

## 创作来源

[作者与使用说明](https://peritune.com/about/)具名 PeriTune / むつき醒（Sei Mutsuki），介绍自 2002 年开始音乐活动、2015 年设立 PeriTune。两首均为官网在 2015/2016 年发表的原创器乐作品，按作者及发表记录收录为 human；这不是音频法证保证，也不以单纯缺少披露作为证明。相关作品推荐区的 AI 图片声明不属于本曲音频，不混作音乐来源。

## 许可

[官方条款](https://peritune.com/about/)允许免费商业视频背景使用及加工，包括循环；可用于有独立影像主体的 YouTube 盈利视频，禁止音乐主体合集、再分发及登记 Content ID。两曲早于 2026 年 3 月，仍可适用 CC BY 4.0；保留作品、作者、官网、许可链接及改动说明最稳妥。免费 MP3/循环 ZIP 与付费 WAV 区分，不承诺零版权误报。

## 验证

2026-09-19 对官方原始 MP3 使用 ffprobe，Whisper 为 249.306168 秒，Sakuya2 为 206.382109 秒，显示值按秒四舍五入；未用循环拼接长度代替原始时长。

- https://peritune.com/music/PerituneMaterial_Whisper.mp3
- https://peritune.com/music/PerituneMaterial_Sakuya2.mp3

Minamo2 的孤寂/庄严色彩及多种打击配器使温暖低存在感证据较弱，本轮不收入。其余已收录版本不重复追加。
