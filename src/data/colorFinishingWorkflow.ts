export const colorFinishingWorkflow = [
  {
    id: "project-management",
    phase: "01",
    name: "项目、监看与色彩管理",
    workspace: "Project Settings · Color Management",
    purpose: "先定义素材如何被解释、在哪个工作空间调色以及最终交付到哪里。",
    settings: [
      { label: "时间线", value: "3840×2160 · 29.97 fps" },
      { label: "色彩科学", value: "DaVinci YRGB Color Managed" },
      {
        label: "MR1 / MR2",
        value: "Timeline + Output：Rec.2100 ST2084 · 1000 nits",
      },
      { label: "MR3", value: "Timeline + Output：Rec.2100 HLG" },
      { label: "数据电平", value: "Auto" },
    ],
    actions: [
      "锁定时间线分辨率和帧率；本工作流通常为 3840×2160 / 29.97p。",
      "选择 DaVinci YRGB Color Managed；S-Log3/PQ 项目按当前 MR 路线设置，MR3 HLG 项目保持 HLG→HLG。",
      "关闭会误导判断的系统动态显示功能，确认监看设备、数据电平和 HDR 能力。",
    ],
    checks: [
      "输入、时间线、输出三者没有混用 S-Log3、HLG、PQ 或 Rec.709",
      "测试图或可信参考片在示波器与监视器上表现一致",
    ],
    caution: "Deliver 页的色彩标签不能替代项目内的像素转换。",
  },
  {
    id: "input-normalize",
    phase: "02",
    name: "逐类素材输入与技术归一化",
    workspace: "Media Pool · Camera RAW · Input Color Space",
    purpose: "让不同相机、Gamma、色域和 RAW 设置进入同一个可比较的工作空间。",
    settings: [
      { label: "MR1 / MR2 输入", value: "Sony S-Gamut3.Cine / S-Log3" },
      { label: "MR3 输入", value: "Rec.2100 HLG / BT.2020" },
      { label: "CST Tone Mapping", value: "DaVinci（仅手动 CST 路线）" },
      { label: "CST Gamut Mapping", value: "Saturation Compression" },
      { label: "RAW Highlight Recovery", value: "支持时开启；逐镜确认" },
    ],
    actions: [
      "按机型和拍摄模式分组；MR1/MR2 标记 Sony S-Gamut3.Cine / S-Log3，MR3 标记 Rec.2100 HLG。",
      "RAW 素材先确认 Decode Using、ISO、色温、Tint、Highlight Recovery，不覆盖原始文件。",
      "建立 Color Chart 或可信中性镜头作为技术参考；混合素材不要靠目测猜输入 Gamma。",
    ],
    checks: [
      "同组素材的中性物、黑白位和饱和度落在相近范围",
      "没有重复 LUT、重复 CST 或双重色彩转换",
    ],
    caution: "输入标记错误会让后续每个数值都失去意义。",
  },
  {
    id: "cleanup",
    phase: "03",
    name: "坏点、闪烁、稳定与降噪",
    workspace: "Color · Motion Effects · Resolve FX",
    purpose: "先处理会污染调色判断的技术问题，再做锐化、纹理与风格。",
    settings: [
      {
        label: "夜景 Temporal NR",
        value: "2 Frames · Better · Small · Luma 5 / Chroma 8",
      },
      {
        label: "白天 Temporal NR",
        value: "2 Frames · Better · Small · Luma 2 / Chroma 3",
      },
      { label: "Spatial NR", value: "Better · Small · Luma 2 / Chroma 4" },
      { label: "Stabilizer", value: "Similarity · Strength 0.25–0.40" },
      { label: "检查倍率", value: "Viewer 100% · 运动回放 1×" },
    ],
    actions: [
      "逐镜检查热像素、传感器灰尘、频闪、压缩块、摩尔纹、滚快门和稳定问题。",
      "需要时先做 Temporal NR，再做少量 Spatial NR；从最低可见效果开始，运动素材检查拖影。",
      "降噪后再考虑 Midtone Detail、Sharpen 或 Texture Pop；已清晰素材不必增加锐化。",
    ],
    checks: [
      "100% 放大回看静止与运动区域，细枝、雨滴、星点和车灯没有被抹除",
      "无降噪抽吸、塑料感、尾灯残影或稳定边缘扭曲",
    ],
    caution:
      "Temporal NR、Magic Mask 和部分修复工具属于 Studio 能力；免费版应标记为可选而非必做。",
  },
  {
    id: "primary-balance",
    phase: "04",
    name: "逐镜曝光与白平衡",
    workspace: "Color · Primaries · HDR Wheels · Scopes",
    purpose: "把每个镜头先校正成可靠的技术基准，而不是直接套场景 Look。",
    settings: [
      {
        label: "初始 Primaries",
        value: "Lift 0.00 · Gamma 0.00 · Gain 1.00 · Offset 0.00",
      },
      { label: "PQ 普通白", value: "80–120 nits" },
      { label: "中灰参考", value: "38–43 IRE（按场景修正）" },
      { label: "PQ 峰值上限", value: "1000 nits" },
      { label: "白平衡容差", value: "相邻镜头约 ±150 K / Tint ±1.0" },
    ],
    actions: [
      "用 Waveform/HDR Waveform 调 Offset 或 Global，建立中灰、普通白与峰值层级。",
      "用 RGB Parade、中性物和现场记忆校正 Temperature/Tint；混合光源保留合理差异。",
      "用 Lift/Gamma/Gain、Log 或 HDR Wheels 分区控制黑位、中间调、漫反射白和镜面高光。",
    ],
    checks: [
      "黑位不漂色且未压死，普通白没有被推成 HDR 峰值",
      "肤色、道路、天空、水面和灯具符合所选场景的波形目标",
    ],
    caution: "不要仅凭一块未经校准的屏幕判断曝光和色偏。",
  },
  {
    id: "shot-match",
    phase: "05",
    name: "镜头匹配与场景分组",
    workspace: "Color · Lightbox · Split Screen · Gallery",
    purpose: "让相邻镜头在曝光、色温、色彩密度和对比方向上连续。",
    settings: [
      { label: "Still Wipe", value: "50%" },
      { label: "剪辑点回看", value: "前后各 3–5 秒" },
      { label: "普通白容差", value: "相邻镜头约 ±10 nits" },
      { label: "中灰容差", value: "约 ±3 IRE" },
      { label: "色温 / Tint 容差", value: "约 ±150 K / ±1.0" },
    ],
    actions: [
      "按地点、方向、天气、时间段和光源类型建立 Group 或 Smart Filter。",
      "用 Gallery Still、Split Screen、Lightbox 和共享节点比较相邻镜头。",
      "先匹配代表镜头，再把技术节点传播到同组，最后逐镜修正差异。",
    ],
    checks: [
      "每个剪辑点前后回看 3–5 秒，没有亮度、色温、天空或道路颜色跳变",
      "同场景远近景密度一致，但保留真实光线变化",
    ],
    caution: "共享节点适合统一技术基础，不适合覆盖每个镜头独有的曝光问题。",
  },
  {
    id: "secondary",
    phase: "06",
    name: "二级调色、窗口与跟踪",
    workspace: "Color · Qualifier · Power Window · Tracker",
    purpose: "只修需要被单独控制的天空、植被、肤色、灯牌、车灯和局部主体。",
    settings: [
      {
        label: "Qualifier Matte",
        value: "Denoise 10 · Clean Black 2 · Clean White 2",
      },
      { label: "Matte Blur Radius", value: "6–8" },
      { label: "Window Feather", value: "0.25–0.40" },
      { label: "Tracker", value: "向前 + 向后各跟踪一次" },
      { label: "局部饱和度", value: "先控制在 ±5～10" },
    ],
    actions: [
      "Qualifier 取样后查看 Matte，使用 Clean Black/White、Denoise、Blur Radius 清理边缘。",
      "Power Window 保持足够 Feather，使用 Tracker 跟随主体；遮挡或跟踪失败处手工关键帧。",
      "用 Hue vs Hue/Sat/Lum、Color Warper 或局部 HDR Wheels 做最小必要调整。",
    ],
    checks: [
      "开启 Highlight/Matte 检查边缘，没有闪烁、漏选、色块或人物轮廓光",
      "局部调整在播放状态下自然，不只在单帧截图中成立",
    ],
    caution: "限定器和窗口越多越需要动态回看；二级调色不能代替错误的全局平衡。",
  },
  {
    id: "creative-look",
    phase: "07",
    name: "应用当前场景 Look",
    workspace: "Color · Timeline/Group Post-Clip · Primaries",
    purpose: "在技术匹配完成后应用当前选中的场景参数，建立全片统一审美。",
    settings: [
      { label: "应用位置", value: "Timeline 或 Group Post-Clip" },
      { label: "试看片段强度", value: "Key Output Gain 0.50" },
      { label: "确认后强度", value: "Key Output Gain 1.00 或按画面回退" },
    ],
    actions: [
      "把当前预设的 Temperature、Tint、Contrast、Pivot、Color Boost、Shadows、Highlights、Saturation 等录入独立 Look 节点。",
      "时间线级参数只负责统一方向；镜头级曝光、白平衡和高光恢复继续留在 Clip 或 Group Pre-Clip。",
      "以 50% 强度比较前后效果；如果风格破坏肤色、天空或灯光层级，降低强度而非继续补节点。",
    ],
    checks: [
      "关闭 Look 节点后技术匹配仍然成立，开启后全片风格统一",
      "场景仍像真实时间、天气和地点，没有被预设改成另一种环境",
    ],
    caution: "预设是起点，不是 PowerGrade 已被实际保存或适用于所有相机的声明。",
  },
  {
    id: "texture-output",
    phase: "08",
    name: "质感、色域压缩与输出修整",
    workspace: "Color · Curves · Gamut Mapping · Output Trim",
    purpose: "控制细节、色彩密度、极端饱和色与高光滚降，让画面经得起最终编码。",
    settings: [
      { label: "Midtone Detail", value: "先读取当前场景预设；常用 -10～+10" },
      { label: "Blur/Sharpen Radius", value: "0.47 起步；100% 检查边缘" },
      { label: "Soft Clip High", value: "0.020–0.035 起步" },
      {
        label: "Film Grain（Studio）",
        value: "35mm 400T · Strength 0.10–0.18",
      },
      { label: "Grain Size / Softness", value: "0.20–0.25 / 0.20" },
    ],
    actions: [
      "按素材决定 Midtone Detail、Sharpen、Glow、Halation 或 Film Grain；长环境视频优先克制。",
      "检查霓虹红蓝、植被绿和日落橙红是否超色域，使用 Hue vs Sat 或 Gamut Compression 温和收回。",
      "用 Soft Clip、HDR Specular/Light 或 Output Trim 控制峰值和高光滚降。",
    ],
    checks: [
      "矢量示波器没有异常贴边，强色区域仍保留内部纹理",
      "4K 100% 回看无过锐边缘、噪声放大、色带或高光断层",
    ],
    caution:
      "Film Grain、Glow 和 Halation 会改变压缩效率，使用后必须重新检查输出码率与暗部。",
  },
  {
    id: "hdr-safety",
    phase: "09",
    name: "HDR/SDR 输出安全与监看",
    workspace: "Color · Scopes · Output Color Space",
    purpose: "确认所见亮度层级和最终交付标准一致，并为不同显示设备保留可读性。",
    settings: [
      { label: "PQ 输出", value: "Rec.2100 ST2084 · BT.2020 · Max 1000 nits" },
      { label: "PQ 漫反射白", value: "80–120 nits" },
      { label: "PQ 重点高光", value: "200–500 nits" },
      { label: "车灯 / 太阳反射峰值", value: "600–800 nits；不超过 1000" },
      { label: "HLG 输出", value: "Rec.2100 HLG · BT.2020" },
      { label: "字幕亮度起点", value: "100–150 nits" },
    ],
    actions: [
      "PQ 母版检查普通白、漫反射高光和峰值层级；HLG 母版按 HLG 输出和监看解释，不套 PQ 数值。",
      "检查 Max Output、色域限制、数据电平和输出 DRT；需要 SDR 时建立真正 Trim Pass。",
      "在 HDR 参考显示、普通电视和手机上检查，不用简单改标签生成 SDR。",
    ],
    checks: [
      "无通道剪切、色域溢出、黑位抬升或字幕过亮",
      "PQ 文件为 ST2084/BT.2020，HLG 文件为 HLG/BT.2020，像素转换与标签一致",
    ],
    caution:
      "没有可信 HDR 监看时只能做受限判断，必须依靠示波器和多设备复核并标记风险。",
  },
  {
    id: "timeline-qc",
    phase: "10",
    name: "全片画面质检",
    workspace: "Edit + Color · Fullscreen Playback",
    purpose: "从单镜头调色切换到完整影片检查，发现闪帧、跳色和长时间观看问题。",
    settings: [
      { label: "完整回放", value: "1× 实时 · 至少 1 遍" },
      { label: "剪辑点检查", value: "前后各 3–5 秒" },
      { label: "像素检查", value: "Viewer 100%" },
      { label: "允许黑帧 / Offline", value: "0 / 0" },
      { label: "允许掉帧", value: "0" },
    ],
    actions: [
      "全片至少实时回看一次，每个剪辑点和源文件边界前后检查 3–5 秒。",
      "检查离线媒体、黑帧、闪帧、重复帧、坏点、稳定跳变、字幕安全区和片尾。",
      "用 Lightbox 或缩略图扫描全片曝光分布，标记异常镜头重新匹配。",
    ],
    checks: [
      "全片无技术错误，长时间观看不因过亮、过饱和、过锐或频繁色温跳变疲劳",
      "Vision 与 Ambience 版本画面长度和剪辑结构一致",
    ],
    caution: "节点全部正常不代表整片正常；必须进行连续播放质检。",
  },
  {
    id: "audio-qc",
    phase: "11",
    name: "Fairlight 声音完成检查",
    workspace: "Fairlight · Mixer · Loudness Meter",
    purpose: "影片可导出还要求声音连续、无失真并符合双频道用途。",
    settings: [
      { label: "A1 起始电平", value: "-6 dB" },
      { label: "High Pass Filter", value: "80 Hz · 12 dB/oct" },
      { label: "Limiter Ceiling", value: "-2 dBTP" },
      { label: "Vision 综合响度", value: "-14～-16 LUFS-I" },
      { label: "True Peak 通过线", value: "≤ -1 dBTP" },
      { label: "输出音频", value: "AAC · 48 kHz · 320 kb/s · Stereo" },
    ],
    actions: [
      "先用 Clip Gain 修复局部峰值，再谨慎使用 HPF、EQ、Dynamics、Limiter 和降噪。",
      "Vision 检查音乐不压道路声；Ambience 确认完全无音乐且自然动态未被破坏。",
      "检查 Loudness、True Peak、声道映射、淡化、点击、突兀静音和隐私讲话。",
    ],
    checks: [
      "耳机、手机和电视三端复核；无削波、抽吸、相位异常或左右声道错误",
      "导出目标为 AAC 48 kHz / 320 kb/s / Stereo 时项目总线与声道一致",
    ],
    caution: "响度数字是参考，环境声真实性与音乐/道路声关系优先。",
  },
  {
    id: "deliver-verify",
    phase: "12",
    name: "导出、文件验证与平台确认",
    workspace: "Deliver · Render Queue · MediaInfo/ffprobe",
    purpose: "把正确的时间线稳定编码成可验证的母版，并确认平台真正识别 HDR。",
    settings: [
      { label: "容器 / 编码", value: "MP4 · H.265/HEVC · Main10" },
      { label: "画面", value: "3840×2160 · 29.97 fps · 80,000 Kb/s" },
      { label: "MR1 / MR2 标签", value: "Rec.2020 · ST2084 / PQ" },
      { label: "MR3 标签", value: "Rec.2020 · HLG" },
      { label: "数据电平", value: "Auto" },
      { label: "音频", value: "AAC · 48 kHz · 320 kb/s · Stereo" },
      { label: "平台通过线", value: "YouTube 显示 2160p HDR" },
    ],
    actions: [
      "选择对应 MR 的 PQ 或 HLG 导出预设，确认范围为 Entire Timeline、正确文件名和输出位置。",
      "渲染后完整回看文件，并用 MediaInfo/ffprobe 核验分辨率、帧率、HEVC Main10、10-bit、色域、Gamma 和音频。",
      "先以 Unlisted 上传 YouTube，等待 2160p HDR；检查公开播放器、描述、章节和双频道对应关系。",
    ],
    checks: [
      "本地成片无黑帧、音画不同步或编码损坏，元数据与项目输出一致",
      "YouTube 明确显示 2160p HDR 后才算 HDR 交付完成",
    ],
    caution:
      "不要因为本地文件名含 HDR 就认定交付成功，也不要在平台仍处理中时反复重传。",
  },
] as const;

const additionalResolvePracticalTutorials = [
  {
    id: "tracker-callout",
    category: "合成 · 跟踪",
    level: "进阶",
    estimatedMinutes: 16,
    prerequisite: "镜头中有持续可见、对比清楚的路牌、车辆或建筑特征。",
    title: "跟踪路牌或车辆，让文字标注随目标移动",
    goal: "让地点名、箭头或说明稳定跟随目标，不出现滑动和突然跳位。",
    scenario: "路线说明、路牌标注、车辆介绍和地标讲解。",
    settings: [
      "跟踪区域：高对比纹理",
      "分析：前后双向",
      "文字偏移：避开主体",
      "检查：逐帧 + 实时",
    ],
    steps: [
      "在目标最清楚的一帧打标记，进入 Fusion 或使用支持跟踪的标题/效果。",
      "把 Tracker 区域放在稳定高对比特征上，避开反光、遮挡和运动模糊边缘。",
      "从参考帧向前、向后分析，并在丢失位置停止后手工修正关键帧。",
      "把文字或图形连接到跟踪结果，调整偏移、缩放和出现时长后完整播放。",
    ],
    checks: [
      "标注与目标相对位置稳定",
      "遮挡前后不会突然跳位",
      "文字不遮挡道路安全信息和主体",
    ],
    pitfall:
      "把跟踪框放在纯色车身、天空或反光玻璃上容易漂移；自动分析失败时必须更换特征或分段跟踪。",
  },
  {
    id: "adjustment-clip-version",
    category: "调色 · 批量处理",
    level: "进阶",
    estimatedMinutes: 14,
    prerequisite: "基础逐镜校正已完成，相邻镜头曝光和白平衡基本一致。",
    title: "用 Adjustment Clip 统一章节风格而不覆盖逐镜校正",
    goal: "把章节级 Look、暗角或画幅处理集中管理，并能快速比较与回退。",
    scenario: "同一地点的一组镜头需要统一轻量风格或章节效果。",
    settings: [
      "轨道：置于目标镜头上方",
      "范围：只覆盖同场景",
      "强度：从 25%–50% 比较",
      "版本：启用/禁用 A/B",
    ],
    steps: [
      "在章节开始和结束处打标记，先确认底层镜头已完成技术校正。",
      "添加 Adjustment Clip 覆盖该章节，并按标记修剪准确范围。",
      "只添加章节级风格、画幅或轻量效果，不在这里修复单镜头曝光。",
      "开关 Adjustment Clip 比较，并逐镜检查是否有某个镜头被过度处理。",
    ],
    checks: [
      "关闭调整片后逐镜技术平衡仍成立",
      "章节风格统一但不过强",
      "效果边界与章节标记准确对齐",
    ],
    pitfall: "用 Adjustment Clip 代替逐镜校正会把曝光和白平衡错误一起放大。",
  },
  {
    id: "voiceover-record",
    category: "声音 · 录制",
    level: "进阶",
    estimatedMinutes: 18,
    prerequisite: "旁白稿已按画面时长拆段，麦克风和监听设备已连接。",
    title: "在 Fairlight 录制旁白并完成安全补录",
    goal: "直接录制可编辑旁白，同时避免削波、回授和覆盖已有录音。",
    scenario: "路线讲解、章节补充、纪录片旁白和 ADR。",
    settings: [
      "轨道：Mono VO",
      "采样率：48 kHz",
      "录音峰值：约 -12 至 -6 dBFS",
      "预卷：按语气留 2–3 秒",
    ],
    steps: [
      "在旁白进入点打标记并建立独立 Mono 轨道，正确选择输入和输出设备。",
      "武装轨道前戴耳机监听，关闭扬声器回放，先录测试句检查噪声与峰值。",
      "按段录制并保留前后房间底噪，不满意时使用新 Take 或轨道层而非覆盖原文件。",
      "选择最佳录音后修剪呼吸和空白，匹配电平，再进行最低有效降噪和压缩。",
    ],
    checks: [
      "无削波、回授和明显房间反射",
      "旁白节奏与画面标记匹配",
      "原始 Take 仍可恢复",
    ],
    pitfall:
      "未确认输入路由就武装录音可能录到系统声或静音；用扬声器监听容易形成反馈。",
  },
  {
    id: "project-archive-restore",
    category: "质检 · 归档",
    level: "质检",
    estimatedMinutes: 18,
    prerequisite:
      "项目已经交付，原始媒体、代理、缓存和最终文件的位置均已确认。",
    title: "创建 Project Archive 并在新位置恢复验证",
    goal: "得到真正可恢复的项目归档，而不是只保存一个数据库条目。",
    scenario: "项目完结、换电脑、交给他人或释放工作盘空间。",
    settings: [
      "Archive：项目 + 必要媒体",
      "代理/缓存：按长期价值选择",
      "校验：新位置恢复",
      "保留：最终母版 + 字幕 + 授权",
    ],
    steps: [
      "在项目管理器确认项目名称、版本和最终时间线，并给归档节点打完成标记。",
      "创建 Project Archive，明确是否包含源媒体、代理和缓存，选择独立归档盘。",
      "归档完成后暂时断开原媒体路径，在新项目库中执行 Restore Project Archive。",
      "打开时间线并抽查头、中、尾、字幕、字体、插件和声音，再记录校验日期。",
    ],
    checks: [
      "恢复后无 Offline Media",
      "时间线、字体、插件和声音一致",
      "母版、字幕、授权与项目归档可对应",
    ],
    pitfall:
      "只导出 DRP 不会自动携带源媒体；归档完成提示也不等于已经做过异盘恢复测试。",
  },
  {
    id: "transcription-rough-cut",
    category: "剪辑 · 文字稿",
    level: "进阶",
    estimatedMinutes: 18,
    prerequisite:
      "对白音质清楚，语言受当前 Resolve 版本支持，并已备份原始时间线。",
    title: "从文字稿查找句子并建立采访粗剪",
    goal: "用转录快速定位内容，但由画面、语气和上下文决定最终剪辑。",
    scenario: "采访、车内讲解、旁白和长时间口述素材。",
    settings: [
      "转录：按当前版本/Studio 能力",
      "搜索：专有词与主题",
      "时间线：先复制版本",
      "检查：上下文前后各一句",
    ],
    steps: [
      "复制时间线并给文字稿粗剪版本打标记，选择素材执行音频转录。",
      "先校对关键人名、地名和数字，再搜索主题词并标记候选句。",
      "把候选范围插入字符串时间线，删除重复与口头词时保留呼吸、语气和上下文。",
      "回到画面逐剪辑点检查跳切、口型和 B-roll 需求，再完整回听。",
    ],
    checks: [
      "核心观点没有因删词改变含义",
      "每个音频接缝自然",
      "自动文字错误没有进入成片",
    ],
    pitfall:
      "文字稿不是事实核验，也看不到表情和动作；一键删除停顿或口头词容易制造机械语气和跳切。",
  },
  {
    id: "object-removal-clean-plate",
    category: "合成 · 修复",
    level: "谨慎使用",
    estimatedMinutes: 20,
    prerequisite: "机位相对稳定，目标短暂且背景纹理可由邻近帧合理补全。",
    title: "用跟踪遮罩和 Clean Plate 移除短暂干扰物",
    goal: "清除小范围路人或污点，同时避免背景重复、涂抹和边缘闪烁。",
    scenario: "固定镜头中的短暂路人、传感器污点或画面边缘小物体。",
    settings: [
      "范围：只处理必要帧",
      "遮罩羽化：按边缘",
      "跟踪：前后双向",
      "检查：100% 逐帧",
    ],
    steps: [
      "在目标出现和消失位置打标记并复制镜头版本，确认有足够干净背景。",
      "建立紧贴目标的遮罩并跟踪，避免覆盖阴影和大面积运动背景。",
      "使用 Object Removal、Patch Replacer 或 Fusion Clean Plate 生成补画，并限制处理范围。",
      "100% 逐帧检查纹理重复、阴影、反射和遮挡边缘，失败时缩短范围或保留原画面。",
    ],
    checks: [
      "背景纹理连续且不闪烁",
      "阴影和反射关系合理",
      "处理边缘在正常播放与逐帧检查均不可见",
    ],
    pitfall:
      "复杂车流、水面、树叶和大面积遮挡缺少可靠背景信息；生成式补画不能虚构关键事实。",
  },
  {
    id: "gallery-still-shot-match",
    category: "调色 · 匹配",
    level: "进阶",
    estimatedMinutes: 16,
    prerequisite: "已选定同场景参考镜头，输入色彩空间和基础曝光均正确。",
    title: "抓取 Gallery Still 并用分屏完成镜头匹配",
    goal: "以参考画面统一同场景曝光、白平衡和饱和度，而不是盲目复制节点。",
    scenario: "同一路线的顺光、逆光、阴影和不同机位素材。",
    settings: [
      "参考：同场景基准镜头",
      "Split Screen / Wipe",
      "示波器：Waveform + RGB Parade",
      "匹配顺序：曝光 → 白平衡 → 饱和度",
    ],
    steps: [
      "给基准镜头打绿色标记并抓取 Gallery Still，记录选择原因。",
      "切到目标镜头，打开 Wipe 或 Split Screen，同时观察示波器而非只看缩略图。",
      "先匹配黑白位和中间调，再修白平衡与饱和度；只复制适合共享的节点。",
      "在播放状态检查镜头切换，必要时对动态光线使用关键帧或分段校正。",
    ],
    checks: [
      "剪辑点无明显跳亮和跳色",
      "主体与天空仍保留各自纹理",
      "目标镜头没有被强行做成参考镜头的错误曝光",
    ],
    pitfall:
      "Shot Match 自动结果和节点复制都只是起点；不同光向、镜头和曝光不能追求像素完全相同。",
  },
  {
    id: "render-queue-versions",
    category: "质检 · 批量交付",
    level: "质检",
    estimatedMinutes: 16,
    prerequisite: "时间线锁定，母版、平台版、字幕和音频版本的命名规则已确定。",
    title: "用 Render Queue 一次管理母版、平台版和音频版本",
    goal: "批量渲染多个明确命名的交付任务，并逐个验证真实文件。",
    scenario: "4K 母版、YouTube 上传版、Vision/Ambience 双版本和字幕版。",
    settings: [
      "任务名：项目_平台_版本",
      "范围：Entire Timeline / 标记区间",
      "预设：母版与平台版分开",
      "验证：每个文件独立抽查",
    ],
    steps: [
      "给最终时间线打锁定标记，按交付矩阵逐项设置文件名、位置、编码、色彩和音频。",
      "每完成一个配置就 Add to Render Queue，并用任务名写清平台和版本。",
      "渲染前逐项复核范围、字幕、音频轨、色彩标签和覆盖文件风险，再统一开始。",
      "渲染后按任务清单核对文件数量、属性、时长和头中尾播放，不以队列绿色完成代替验收。",
    ],
    checks: [
      "任务数与交付矩阵一致",
      "没有同名覆盖和错误范围",
      "每个文件的画面、音频、字幕及元数据均通过",
    ],
    pitfall:
      "复制 Render Job 后若忘记修改文件名、字幕或音轨，最容易得到参数正确但内容错误的版本。",
  },
  {
    id: "proxy-original-relink",
    category: "性能 · 代理媒体",
    level: "进阶",
    estimatedMinutes: 14,
    prerequisite:
      "4K 或高码率素材已正确导入，并能明确区分相机原片、代理文件和缓存。",
    title: "生成代理媒体，并在交付前切回相机原片",
    goal: "提升长片剪辑流畅度，同时保证最终渲染仍使用正确的高质量源媒体。",
    scenario: "4K 长途驾驶、多机位采访、笔记本剪辑和跨盘协作。",
    settings: [
      "Proxy：ProRes Proxy / DNxHR LB",
      "分辨率：Half 或 Quarter",
      "Playback：Prefer Proxies",
      "交付前：Prefer Camera Originals",
    ],
    steps: [
      "按相机、日期和机位整理素材，确认原片路径稳定后再生成 Proxy Media。",
      "切换到 Prefer Proxies，抽查画面、声音、时间码和变速片段是否保持同步。",
      "移动或交接代理时使用软件内 Relink Proxy Media，不用同名文件猜测替换。",
      "锁画后切回 Prefer Camera Originals，清除误用代理的标记并完成短段测试渲染。",
    ],
    checks: [
      "代理与原片时长、帧率和时间码一致",
      "切换原片后没有 Offline Media",
      "最终测试文件的分辨率和细节来自原片",
    ],
    pitfall:
      "代理是播放替身，不是新的母版；代理与原片帧率、音轨或时间码不同会造成错位和错误重连。",
  },
  {
    id: "vertical-social-version",
    category: "多平台 · 竖屏重构",
    level: "进阶",
    estimatedMinutes: 16,
    prerequisite: "16:9 主时间线已锁画，并已复制出独立的社交平台版本。",
    title: "复制主时间线并重构 9:16 竖屏版本",
    goal: "保留主体、路牌和字幕信息，而不是简单裁掉横版画面的两侧。",
    scenario: "把 YouTube 横版长片改为 Shorts、Reels 或竖屏预告。",
    settings: [
      "时间线：1080×1920",
      "帧率：跟随母版",
      "缩放：先 Fit 再逐镜调整",
      "字幕安全区：距边缘至少 5%",
    ],
    steps: [
      "Duplicate Timeline 并在名称中写明 9x16 与版本号，不直接修改已锁定母版。",
      "把时间线改为 1080×1920，先批量建立基础缩放，再逐镜调整 Position 和 Zoom。",
      "对横向移动主体使用关键帧或 Smart Reframe 起点，并人工修正跟踪丢失位置。",
      "重新排版字幕、标题和画中画，在手机尺寸完整播放后再单独导出。",
    ],
    checks: [
      "主体和关键路牌没有被裁掉",
      "字幕、标题和界面元素均在安全区",
      "竖版节奏独立成立且未改动横版母版",
    ],
    pitfall:
      "自动重构只负责猜测主体；车窗反光、多人、快速转弯和遮挡都需要逐镜人工复核。",
  },
  {
    id: "fairlight-loudness-pass",
    category: "声音 · 响度交付",
    level: "质检",
    estimatedMinutes: 16,
    prerequisite:
      "对白、音乐、环境声和效果已分轨，剪辑点及基础电平已经处理完成。",
    title: "用 Fairlight 响度表完成整片混音验收",
    goal: "控制节目响度和真峰值，同时保留对白、音乐与环境声的动态关系。",
    scenario: "YouTube 长片、旁白路线片、环境声版本和客户交付。",
    settings: [
      "YouTube 起点：约 -14 LUFS-I",
      "True Peak：≤ -1 dBTP",
      "测量：整片从头重置后播放",
      "修正：先轨道关系，后总线限制",
    ],
    steps: [
      "为 Dialogue、Music、Ambience 和 Effects 分配清楚的 Bus 或轨道，并清除旧响度读数。",
      "从头到尾播放测量 Integrated Loudness、Short-Term 和 True Peak，记录问题时间码。",
      "先用片段增益、自动化和音乐闪避修正局部关系，再少量调整总线和 Limiter。",
      "重置响度表重新完整播放，并对导出文件再测一次，确认编码后没有新增峰值。",
    ],
    checks: [
      "目标响度范围内对白和关键环境声仍清楚",
      "真峰值没有超过交付上限",
      "导出文件与时间线的响度关系一致",
    ],
    pitfall:
      "只把总线标准化到一个 LUFS 数字会掩盖局部过响、对白过低和音乐泵动；平台目标应按实际交付要求调整。",
  },
  {
    id: "timeline-version-compare",
    category: "质检 · 版本管理",
    level: "质检",
    estimatedMinutes: 12,
    prerequisite: "当前时间线已达到可回看的阶段，并已确定清楚的项目命名规则。",
    title: "复制时间线版本并完成修改前后对比",
    goal: "让结构、调色和声音修改都可回退，并能明确知道最终交付来自哪个版本。",
    scenario: "客户修改、导演版与平台版、调色方案比较和交付前锁画。",
    settings: [
      "命名：日期_用途_v01",
      "复制：修改前执行",
      "标记：变更点与原因",
      "最终：只保留一个明确锁定版",
    ],
    steps: [
      "在重大修改前 Duplicate Timeline，写明日期、用途和递增版本号。",
      "用标记记录本版改动范围与原因，不用 final、final2、最终版等含糊名称。",
      "把候选版本放入同一 Bin，逐段对比结构、画面和声音，不混合引用错误时间线。",
      "确认交付版本后设为 LOCKED，并让 Render Queue、字幕和音频文件都引用同一版本号。",
    ],
    checks: [
      "任一重大修改均可回退",
      "最终时间线与渲染任务版本一致",
      "旧版本不会被误当作最新交付",
    ],
    pitfall:
      "版本过多但没有命名、说明和锁定状态与没有版本管理相同；复制时间线也不会自动复制外部媒体。",
  },
  {
    id: "temporal-spatial-noise-reduction",
    category: "修复 · 视频降噪",
    level: "进阶",
    estimatedMinutes: 18,
    prerequisite:
      "已完成基础曝光与色彩管理，并准备一段含暗部、细纹理和运动主体的代表镜头；Temporal / Spatial NR 通常需要 DaVinci Resolve Studio。",
    title: "先用 Temporal NR，再用 Spatial NR 处理夜景噪点",
    goal: "优先消除跨帧随机噪点，再克制处理残余细颗粒，同时保护道路纹理、树叶和运动边缘。",
    scenario:
      "高 ISO 夜景、车内暗部、运动相机黄昏素材和被提亮后显露噪点的 Log 镜头。",
    settings: [
      "Viewer：100% 缩放",
      "Temporal NR：Frames 2 · Better · Motion Range Small 起步",
      "Luma / Chroma Threshold：从低值逐步增加",
      "Spatial NR：Small Radius · 只补残余噪点",
    ],
    steps: [
      "在 Color 页建立独立降噪节点并放在创意调色之前；停在同时包含暗部、纹理和运动的代表帧，把 Viewer 设为 100%。",
      "打开 Motion Effects，先启用 Temporal NR：Frames 设 2、Motion Estimation 选 Better、Motion Range 从 Small 起步，再分别缓慢提高 Luma 与 Chroma Threshold。",
      "播放运动最复杂的区段；若车灯、护栏或人物边缘出现拖影，就降低阈值、Frames 或调整 Motion Range，而不是继续加重降噪。",
      "Temporal NR 后仍有固定细颗粒时，再开启 Spatial NR，选 Small Radius 并只加最低有效阈值；最后旁路节点做匹配亮度 A/B。",
      "缓存或渲染 10 秒高噪声测试段，在 100% 画面检查静帧和运动，再决定是否复制参数到同机位镜头。",
    ],
    checks: [
      "暗部彩色噪点减少但细纹理仍可辨认",
      "运动边缘、车灯和树叶没有拖影或蜡化",
      "旁路 A/B 的曝光、黑位和色彩关系基本一致",
    ],
    pitfall:
      "把 Temporal 与 Spatial 阈值同时拉高很容易得到干净但塑料感的画面；不同曝光和运动状态必须逐镜复核，不能整条时间线盲目套用。",
  },
  {
    id: "fairlight-noise-reduction-ab",
    category: "声音 · 降噪诊断",
    level: "进阶",
    estimatedMinutes: 16,
    prerequisite:
      "对白已完成基础剪辑，并保留一段只含稳定底噪的参考；原始音频版本可以随时恢复。",
    title: "先识别噪声类型，再在 Fairlight 做等响度降噪 A/B",
    goal: "针对稳定宽带底噪、低频隆隆声或电源嗡声选择处理，而不是把所有问题交给同一个降噪旋钮。",
    scenario: "车内空调声、室内风扇、道路低频、50/60 Hz 嗡声和轻微持续嘶声。",
    settings: [
      "参考：1–3 秒纯底噪",
      "处理顺序：Clip Gain → EQ / Hum → Noise Reduction",
      "强度：最低有效量",
      "比较：旁路前后等响度",
    ],
    steps: [
      "独听问题片段和纯底噪参考，先判断是稳定宽带噪声、低频隆隆、电源嗡声，还是会随时间变化的风噪；在标记中写明类型。",
      "先用 Clip Gain 匹配对白电平；低频隆隆用克制的高通或 EQ，窄带嗡声优先针对 50/60 Hz 及其谐波，不急着开启宽带降噪。",
      "对稳定底噪添加 Fairlight Noise Reduction 或当前版本可用的对应效果，使用纯底噪学习/自动检测后，从最低有效 Reduction 开始。",
      "匹配处理前后的感知响度并反复旁路，重点听齿音、尾音、呼吸和句间环境；出现水下声、金属声或抽吸就退回强度。",
      "从接缝前后完整回听并导出 10 秒测试文件，用耳机和普通扬声器各听一次，再决定是否应用到同一录音条件的片段。",
    ],
    checks: [
      "对白清晰度提高且齿音、尾音和呼吸完整",
      "句间底噪不会突然开关或产生抽吸",
      "导出文件与时间线监听结果一致",
    ],
    pitfall:
      "风噪、爆音、削波和不断变化的环境声通常不能靠学习一段噪声彻底修复；降噪、Voice Isolation、Gate 和压缩叠加过强会放大伪影。",
  },
  {
    id: "fairlight-de-esser-dialogue",
    category: "声音 · 人声修复",
    level: "进阶",
    estimatedMinutes: 14,
    prerequisite:
      "对白已完成剪辑和基础增益匹配，并能找到包含明显“s、sh、z”齿音但没有削波的代表句子。",
    title: "在 Fairlight 用 De-Esser 动态控制刺耳齿音",
    goal: "只在齿音出现时压低对应高频，避免用固定高频衰减让整段对白持续发暗。",
    scenario: "领夹麦贴近嘴部、车内反射较强、压缩后齿音突出和旁白高频刺耳。",
    settings: [
      "频段：5–10 kHz 内寻找起点",
      "Amount：从低值逐步增加",
      "Reaction：Medium 起步",
      "顺序：降噪 → EQ → De-Esser → Compressor",
    ],
    steps: [
      "循环播放齿音最明显的完整句子，在 Fairlight Effects Library 把 De-Esser 拖到对白片段或对应轨道，不先复制到所有对白。",
      "使用监听或频段扫查定位真正刺耳的区域，通常从 5–10 kHz 范围内寻找；确认听到的是齿音而不是整段人声主体。",
      "从较低 Amount 和 Medium Reaction 起步，让 Reduction 只在“s、sh、z”出现时动作，再匹配旁路前后的听感响度。",
      "关闭与开启效果反复比较完整词句；若“s”变成含糊的“th”、气息消失或声音发暗，就减少 Amount 或缩小处理范围。",
      "跨越不同说话音量和麦克风距离回听，确认后才复制到同一录音条件的片段，并在压缩器后再次复核齿音。",
    ],
    checks: [
      "刺耳齿音降低但语言清晰度仍完整",
      "无齿音处的高频、空气感和音色基本不变",
      "处理在轻声、正常和较响句子中都不会过度动作",
    ],
    pitfall:
      "De-Esser 不是普通降噪器；频率选错或 Amount 过高会造成口齿不清。不同说话人通常需要独立设置。",
  },
  {
    id: "media-metadata-smart-bins",
    category: "媒体 · 元数据整理",
    level: "入门",
    estimatedMinutes: 12,
    prerequisite:
      "素材已复制并完成校验，文件名、相机原片和代理媒体仍能明确区分。",
    title: "用元数据和 Smart Bin 自动整理素材",
    goal: "让新导入素材按机位、日期和内容自动归类，同时保持相机原始文件名不变。",
    scenario: "长途驾驶、多机位采访、跨日期拍摄和需要持续补充素材的项目。",
    settings: [
      "页面：Media",
      "元数据：Camera / Scene / Keywords",
      "Smart Bin：按项目实际字段组合",
      "文件名：不在磁盘上批量改名",
    ],
    steps: [
      "在 Media 页抽查素材的帧率、分辨率、音轨和时间码，先隔离错误格式或离线文件。",
      "在 Metadata Inspector 为代表素材填写 Camera、Scene 和 Keywords，再把同条件素材批量应用相同字段。",
      "建立 Smart Bin，以机位、日期或关键词作为规则，并确认新标记的素材会自动进入。",
      "切换列表和缩略图视图抽查分类结果，用 Clip Name 显示友好名称，但保留磁盘上的相机原始文件名。",
    ],
    checks: [
      "每段素材只按明确元数据进入预期 Smart Bin",
      "新导入并标记的素材能自动归类",
      "原始文件名、路径和代理关联没有被破坏",
    ],
    pitfall:
      "Smart Bin 依赖元数据质量；拼写不一致或把地点、镜头类型混进同一关键词，会得到看似自动但不可维护的分类。",
  },
  {
    id: "photo-rate-sort-album",
    category: "照片 · 评分筛选",
    level: "入门",
    estimatedMinutes: 10,
    prerequisite:
      "项目中已导入一组同主题照片，并保留清晰、重复、失焦和不同构图的候选版本。",
    title: "在 Photo 页评分、筛选并整理照片 Album",
    goal: "用可回退评分替代删除，把封面、章节图和延时摄影候选照片整理成明确集合。",
    scenario: "路线封面、地点章节图、缩略图候选和大量连续拍摄照片的初选。",
    settings: [
      "页面：Photo",
      "评分：1–5 星",
      "入选起点：4 星",
      "检查：缩略图筛选后查看原尺寸",
    ],
    steps: [
      "在 Photo 页按拍摄日期或文件夹打开照片，先用缩略图快速排除明显误拍，但不删除原文件。",
      "给技术合格且构图可用的照片设置 4 星，最强候选设 5 星，重复或待定照片保留较低评分。",
      "按 Rating 排序或筛选，把 4–5 星照片加入对应 Album，并用用途命名 Album。",
      "逐张查看入选照片的原尺寸，检查失焦、运动模糊、噪点和边缘穿帮，再确认最终候选。",
    ],
    checks: [
      "Album 只包含用途明确且完成原尺寸检查的照片",
      "评分可以重新调整，未入选照片仍可恢复",
      "重复构图已收敛为少量可比较候选",
    ],
    pitfall:
      "缩略图看起来清晰不代表原图真正合焦；评分用于筛选，不应替代备份，也不要在初选阶段删除唯一原片。",
  },
  {
    id: "fusion-delta-keyer-clean-plate",
    category: "合成 · 绿幕抠像",
    level: "进阶",
    estimatedMinutes: 18,
    prerequisite:
      "已有曝光稳定的绿幕素材和合法背景，主体边缘、头发与运动模糊均可在原始画面中辨认。",
    title: "用 Delta Keyer 和 Clean Plate 完成绿幕合成",
    goal: "建立干净主体遮罩并处理溢色，让前景、背景和边缘在运动中保持可信。",
    scenario: "路线讲解、地图演示、主持人口播和需要替换背景的固定机位素材。",
    settings: [
      "节点：MediaIn → DeltaKeyer → Merge → MediaOut",
      "背景：连接 Merge Background",
      "Clean Plate：只取绿幕区域",
      "检查：Matte / 最终合成 / 逐帧",
    ],
    steps: [
      "在 Edit 页复制镜头版本后进入 Fusion，把背景接到 Merge 的 Background、绿幕主体接到 Foreground。",
      "在主体链路加入 Delta Keyer，用 Background Color 取样绿幕，再查看 Matte 找出孔洞、噪点和未清除区域。",
      "绿幕亮度不均时建立 Clean Plate，只覆盖真实绿幕区域，并克制调整 Matte Finesse 与 Despill。",
      "回到最终合成匹配前景与背景的亮度、色温和锐度，逐帧检查头发、手指、运动模糊与半透明边缘。",
    ],
    checks: [
      "主体内部遮罩完整且背景区域干净",
      "头发、运动模糊和半透明边缘没有硬边或闪烁",
      "绿色溢色受控，前景亮度和色温与背景关系可信",
    ],
    pitfall:
      "提高阈值把绿幕硬切干净会同时吃掉头发和运动边缘；拍摄时的反光、阴影和严重曝光不均不能靠一个取样点完全修复。",
  },
  {
    id: "media-clone-checksum-backup",
    category: "媒体 · 校验备份",
    level: "质检",
    estimatedMinutes: 12,
    prerequisite:
      "相机卡仍保持只读状态，并已准备两个容量足够、路径明确且彼此独立的目标磁盘。",
    title: "用 Clone Tool 和 XXHash64 完成双份素材备份",
    goal: "在清卡前生成两份经过校验的位级副本，并留下可复核的卡号、路径和校验结果。",
    scenario:
      "外拍收工、长途自驾每日卸卡、多机位拍摄和任何无法补拍的原始素材交接。",
    settings: [
      "页面：Media · Clone Tool",
      "来源：整张相机卡或记录盘",
      "目标：两个独立存储位置",
      "校验：XXHash64",
    ],
    steps: [
      "给相机卡设置只读并在 Media 页打开 Clone Tool，确认来源是整张卡而不是临时挑选的几个视频文件。",
      "添加两个位于独立磁盘的目标目录，用日期、项目和卡号命名，避免覆盖既有卡目录。",
      "选择 XXHash64 校验后开始克隆，等待两个目标都完成，不在复制过程中导入、改名或拔出任何磁盘。",
      "核对 Clone Tool 的完成状态，再从两个目标各随机打开视频、音频和照片，记录来源卡号、目标路径与校验结果。",
      "只有在两份副本均通过校验且其中一份已与工作盘分离后，才把相机卡交回清卡流程。",
    ],
    checks: [
      "两个独立目标均显示复制和校验成功",
      "抽查文件可以正常读取且目录结构与来源一致",
      "卡号、目标路径和校验结果能够对应追溯",
    ],
    pitfall:
      "把同一磁盘上的两个文件夹当成双备份不能防止磁盘故障；拖拽复制完成也不等于校验通过，任何失败都应重做而不是先清卡。",
  },
  {
    id: "photo-keyframe-push-in",
    category: "照片 · 动态构图",
    level: "入门",
    estimatedMinutes: 10,
    prerequisite:
      "照片已在 Photo 页完成评分和原尺寸检查，并已创建与最终交付分辨率一致的时间线。",
    title: "用关键帧给照片制作克制的推近与平移",
    goal: "用一组可控的 Zoom 和 Position 关键帧为静态照片增加运动，同时保留主体构图和清晰度。",
    scenario:
      "地点章节图、路线照片、历史图片、片尾回顾和缺少动态素材的旁白段落。",
    settings: [
      "页面：Photo 选片 → Edit 动画",
      "Inspector：Zoom / Position",
      "关键帧：片头与片尾各一组",
      "缩放建议：终点不超过起点的 1.08 倍",
    ],
    steps: [
      "从 Photo 页的已选 Album 把照片加入时间线，先设定它在旁白中的实际时长并确认项目分辨率。",
      "在片头打开 Inspector，为 Zoom 和 Position 建立起始关键帧，把主体放在安全构图区域。",
      "移到片尾建立结束关键帧，只做约 3%–8% 的推近或单方向平移，避免同时大幅缩放和横移。",
      "完整播放并调整关键帧缓动，让运动在入点和出点自然停靠，不抢旁白和字幕的注意力。",
      "以 100% 查看器缩放检查清晰度、边缘和字幕安全区，再复制属性到同构图照片并逐张微调。",
    ],
    checks: [
      "运动方向明确且开始、结束没有突跳",
      "主体始终处于安全构图区域并未被字幕遮挡",
      "终点画面在交付分辨率下没有明显像素化",
    ],
    pitfall:
      "每张照片都使用相同幅度和方向会显得机械；过度放大会暴露分辨率不足，关键帧时长也必须在修改照片片段长度后重新检查。",
  },
  {
    id: "color-power-window-track",
    category: "调色 · 局部跟踪",
    level: "进阶",
    estimatedMinutes: 14,
    prerequisite:
      "镜头已完成基础曝光和白平衡校正，待处理主体边缘清晰且能在镜头运动中持续辨认。",
    title: "用 Power Window 跟踪移动主体并做局部调色",
    goal: "让克制的局部亮度或色彩修正稳定跟随主体，不影响画面其他区域。",
    scenario:
      "行驶车辆、移动人物面部、局部偏暗主体和需要轻微引导视线的运动镜头。",
    settings: [
      "节点：新增独立 Serial Node",
      "窗口：Circle / Curve + Softness",
      "Tracker：Pan / Tilt 起步",
      "检查：Highlight 遮罩 + 前后向跟踪",
    ],
    steps: [
      "在基础校正之后新增独立 Serial Node，创建覆盖目标的 Power Window，并留出适量边缘柔化。",
      "打开 Tracker，只启用与镜头运动相符的 Pan、Tilt、Zoom、Rotate 或 Perspective 3D 分析项。",
      "从目标最清晰的帧向前和向后跟踪，逐段播放检查窗口是否漂移、缩放错误或被遮挡物带走。",
      "在失败帧停止自动跟踪并手动修正窗口关键帧，必要时缩短处理区间，不让窗口扫过无关区域。",
      "在窗口内做小幅曝光、饱和度或色温调整，关闭 Highlight 后反复旁路节点并检查镜头首尾。",
    ],
    checks: [
      "Power Window 全程贴合目标且没有可见漂移",
      "局部修正边缘柔和，未形成亮圈或色彩断层",
      "旁路节点时变化克制并确实只解决目标问题",
    ],
    pitfall:
      "一次自动跟踪成功不代表全镜头可靠；遮挡、运动模糊和出画会破坏轨迹，过强局部提亮也会让柔化边缘变得可见。",
  },
  {
    id: "photo-nondestructive-crop-ratios",
    category: "照片 · 无损裁切",
    level: "入门",
    estimatedMinutes: 10,
    prerequisite:
      "照片已完成原尺寸清晰度检查，并已明确横版、竖版或方形平台所需的最终宽高比。",
    title: "在 Photo 页为不同平台建立无损裁切版本",
    goal: "从同一原始照片建立可随时重调的横版、竖版和方形构图，不覆盖或重复压缩源文件。",
    scenario:
      "YouTube 封面、小红书竖图、Instagram 方图和同一地点照片的多平台发布。",
    settings: [
      "页面：Photo · Inspector",
      "裁切：Source Cropping",
      "比例：16:9 / 4:5 / 1:1",
      "变换：Zoom / Position / Rotation",
    ],
    steps: [
      "在 Photo 页选择已完成评分的原图，先复制版本或加入按平台命名的 Album，不在磁盘上另存覆盖源文件。",
      "打开 Inspector 的 Source Cropping，选择目标 Ratio 并启用 Lock Aspect Ratio，再用四边裁切控制建立初始画框。",
      "通过 Zoom、Position 和必要的轻微 Rotation 调整主体位置，优先保留视线方向、地平线和文字安全区。",
      "分别为 16:9、4:5 和 1:1 建立独立版本，逐个检查边缘是否切断人物关节、车辆或关键地标。",
      "导出小尺寸测试图并在目标平台预览区域检查，再回到 Photo 页微调；所有调整保持可重置。",
    ],
    checks: [
      "每种比例都保留明确主体和合理视觉重心",
      "裁切与变换可以重置且原始文件未被覆盖",
      "测试导出没有意外拉伸、旋转黑边或关键内容截断",
    ],
    pitfall:
      "解除宽高比锁定后单独缩放 X 或 Y 会拉伸画面；只在缩略图检查也容易遗漏地平线倾斜和边缘截断。",
  },
  {
    id: "fusion-planar-screen-replacement",
    category: "合成 · 平面跟踪",
    level: "进阶",
    estimatedMinutes: 18,
    prerequisite:
      "已有包含清晰手机、招牌或显示屏平面的运动镜头，以及尺寸和授权均合格的替换画面。",
    title: "用 Planar Tracker 和 Corner Pin 替换移动屏幕",
    goal: "让替换内容正确继承原平面的位移、旋转、缩放和透视变化，并保留可信的遮挡与反光。",
    scenario:
      "手机界面替换、车身广告牌、路边招牌、显示器内容和移动镜头中的平面图形。",
    settings: [
      "节点：MediaIn → PlanarTracker",
      "运动类型：Perspective",
      "输出：Corner Pin / Planar Transform",
      "合成：替换内容 → Merge → MediaOut",
    ],
    steps: [
      "在 Fusion 页把原镜头接入 Planar Tracker，在纹理稳定且属于同一平面的区域绘制跟踪形状，避开反光和运动物体。",
      "把 Motion Type 设为 Perspective，从平面最清晰的参考帧向前和向后跟踪，完整播放检查跟踪云是否漂移。",
      "切换到 Corner Pin 或生成 Planar Transform，把替换画面的四角对齐真实屏幕或招牌边界，再通过 Merge 合成。",
      "用遮罩恢复手指、车身结构或前景物体的遮挡关系，并匹配替换画面的亮度、色温、模糊和运动模糊。",
      "逐帧检查入画、出画、快速运动和强反光位置；跟踪失败时缩小跟踪区域或在失败前后分段处理。",
    ],
    checks: [
      "替换画面四角全程贴合原平面且透视变化自然",
      "前景遮挡、反光和运动模糊关系可信",
      "快速运动与镜头首尾没有滑动、跳点或边缘穿帮",
    ],
    pitfall:
      "Planar Tracker 需要可辨认的平面纹理；把反光、高光或跨越不同深度的区域一起跟踪，通常会造成透视漂移。",
  },
  {
    id: "deliver-individual-clips-handles",
    category: "交付 · 回批媒体",
    level: "质检",
    estimatedMinutes: 14,
    prerequisite:
      "时间线已锁画，并已从接收方确认编解码器、源文件名、源分辨率、时间码和 handles 帧数要求。",
    title: "按 Individual Clips 输出带 Handles 的回批媒体",
    goal: "为外部调色、特效或在线合成输出可准确回套的逐镜文件，同时保留源命名、时间码和剪辑余量。",
    scenario:
      "把锁画时间线交给外部调色师、VFX、字幕包装或需要逐镜回批的协作者。",
    settings: [
      "Render：Individual Clips",
      "命名：Use Source Filename",
      "分辨率：Render at Source Resolution",
      "Handles：按接收方约定帧数",
    ],
    steps: [
      "复制锁画时间线并冻结版本号，向接收方确认容器、编解码器、位深、源时间码和 handles 帧数，不直接套用上传预设。",
      "在 Deliver 页选择 Individual Clips，启用 Use Source Filename；混合分辨率项目按要求启用 Render at Source Resolution。",
      "在 Output Options 添加约定的 Frame Handles，保留唯一文件名与源时间码，并确认是否需要禁用调色、缩放或水印。",
      "先渲染三个包含转场、变速和普通硬切的代表镜头，连同参考视频或时间线交换文件交给接收方试套。",
      "试套通过后再渲染全部任务，抽查首尾 handles、文件数量、时间码和命名，并保存本次 Render Job 设置。",
    ],
    checks: [
      "逐镜文件数量、名称和源时间码能够对应锁画时间线",
      "每个非源边界镜头都包含约定长度的 handles",
      "代表镜头试套后剪辑点、变速和画面尺寸没有偏移",
    ],
    pitfall:
      "Individual Clips 不是成片交付；变速、嵌套、Fusion 和转场可能无法靠普通逐镜文件完整重建，必须先做代表镜头回套测试。",
  },
  {
    id: "media-dual-system-audio-sync",
    category: "媒体 · 外录同步",
    level: "入门",
    estimatedMinutes: 12,
    prerequisite:
      "相机视频与外录 WAV 已完成备份并导入同一项目，且至少保留可辨认的拍板、口型或机内参考声。",
    title: "按 Timecode 或 Waveform 同步外录音频",
    goal: "在不生成新媒体的情况下，把外录音频可靠关联到相机素材，并在剪辑前发现错配和漂移。",
    scenario:
      "采访、车内口播、双系统录音、多机位拍摄和相机仅保留参考声的素材整理。",
    settings: [
      "页面：Media",
      "首选：Timecode 同步",
      "备选：Waveform · Automatic / 指定通道",
      "核验：拍板瞬态 + 口型 + 镜头尾部",
    ],
    steps: [
      "把同一拍摄段的视频和外录 WAV 放在同一素材箱，先核对日期、卷号、场次、采样率和时间码连续性。",
      "设备已锁定统一时间码时选择基于 Timecode 的同步；没有可靠时间码时改用 Waveform，并优先选择含清晰参考声的通道。",
      "波形同步失败时在 Automatic、Mix 或指定通道之间切换，避免让风噪、空白声道或音乐回放参与比对。",
      "同步后在 Media 页打开合并结果，检查拍板瞬态和口型，再跳到长镜头尾部确认没有持续漂移。",
      "给已核验素材添加同步状态元数据；错配片段解除关联后用画面与音频播放头手动对齐，不批量带入时间线。",
    ],
    checks: [
      "拍板瞬态、口型和关键动作与外录音一致",
      "长镜头首尾都保持同步且没有逐渐漂移",
      "原相机声与外录声的通道角色清楚并可随时切换",
    ],
    pitfall:
      "波形相似不等于素材属于同一条；同场重复拍板、低电平参考声或不同录音时钟都可能造成错配，必须逐条抽查镜头首尾。",
  },
  {
    id: "color-skin-qualifier-vectorscope",
    category: "调色 · 肤色校正",
    level: "进阶",
    estimatedMinutes: 16,
    prerequisite:
      "镜头已完成输入色彩管理、曝光和白平衡校正，并能在中性监看环境中辨认真实肤色与环境反射。",
    title: "用 Qualifier 和 Vectorscope 克制修正肤色偏移",
    goal: "在保留人物真实肤色差异和环境光关系的前提下，修正明显的绿色、黄色或洋红污染。",
    scenario:
      "车内混合光、树荫绿反射、霓虹环境、人像口播和不同机位之间的肤色不一致。",
    settings: [
      "节点：基础校正后新增 Serial Node",
      "选择：HSL Qualifier + Highlight",
      "示波器：Vectorscope · Skin Tone Indicator",
      "调整：Hue / Sat / Lum 小幅收敛",
    ],
    steps: [
      "先在基础节点校正全画面的曝光与白平衡，再新增独立肤色节点，避免用局部工具掩盖整体色偏。",
      "用 HSL Qualifier 在面部中间调区域取样，开启 Highlight 检查遮罩，并用加减取样与 Clean Black/White 克制净化。",
      "必要时增加柔化的 Power Window 限定人物范围，防止相近颜色的墙面、木材或衣服同时被调整。",
      "打开 Vectorscope 和 Skin Tone Indicator，把它作为偏色方向参考，小幅调整 Hue、Saturation 或色温，不强迫所有肤色落在同一点。",
      "关闭 Highlight 后检查面部、耳朵、手部和镜头运动，旁路节点比较真实感，并与相邻机位做并排复核。",
    ],
    checks: [
      "明显绿、黄或洋红污染降低且人物仍保留真实肤色差异",
      "遮罩边缘、头发和运动帧没有闪烁或色块",
      "相邻镜头肤色连续且环境光色彩关系仍可信",
    ],
    pitfall:
      "肤色指示线只是方向参考，不是统一目标；过窄 Qualifier 会产生斑驳，过宽选择会连同背景一起变色。",
  },
  {
    id: "fairlight-automatic-ducking",
    category: "声音 · 自动闪避",
    level: "进阶",
    estimatedMinutes: 14,
    prerequisite:
      "对白和音乐已分配到独立轨道并完成基础增益匹配，对白剪辑、降噪和主要停顿已经稳定。",
    title: "用 Automatic Ducking 让音乐自动避让对白",
    goal: "对白出现时平滑降低音乐，句间自然恢复，同时避免明显抽吸和每句话都手动画音量关键帧。",
    scenario:
      "路线讲解、纪录片旁白、采访配乐、教程解说和对白段落较多的长视频。",
    settings: [
      "页面：Fairlight · Mixer",
      "目标：Music Track FX · Ducker",
      "来源：一条或多条 Dialogue Track",
      "Duck Level：约 -6 dB 起步",
    ],
    steps: [
      "先关闭自动闪避完整听一段对白与音乐，调整基础轨道增益，让音乐在无对白段落本身已经处于合理响度。",
      "在音乐轨打开 Ducker Track FX，从 Source 下拉菜单选择实际对白轨，不让环境声、效果声或静音轨触发。",
      "从约 -6 dB Duck Level 起步，调整阈值或灵敏度，使正常对白稳定触发，而呼吸、底噪和空白不触发。",
      "调节 Attack、Hold 与 Recovery，让音乐在句首前及时下降、短停顿不反复弹起、句末平滑恢复。",
      "跨越轻声、正常和较响对白完整回听，再旁路比较；只对少数特殊段落补手动关键帧，不叠加第二套全程闪避。",
    ],
    checks: [
      "对白始终清楚且音乐仍保留连续情绪和节奏",
      "短停顿、呼吸和底噪不会造成明显抽吸或频繁起伏",
      "无对白段落恢复到原音乐电平且不过早抢回注意力",
    ],
    pitfall:
      "自动闪避不能替代基础混音；Duck Level 过深或 Recovery 过快会产生广播式抽吸，错误来源轨还会让音乐无故下降。",
  },
  {
    id: "cut-source-tape-assembly",
    category: "剪辑 · 快速组接",
    level: "入门",
    estimatedMinutes: 12,
    prerequisite:
      "素材已在 Media 页完成备份、同步和基础分类，并已建立规格正确的空白或粗剪时间线。",
    title: "用 Source Tape 连续浏览素材并快速组接粗剪",
    goal: "把同一素材箱中的镜头当作一卷连续素材带浏览，减少反复打开单个片段的时间并建立可回看的第一版顺序。",
    scenario: "旅行素材、路线空镜、活动记录和同一天拍摄的大量短片段快速初剪。",
    settings: [
      "页面：Cut",
      "查看：Source Tape",
      "选择：In / Out",
      "编辑：Append 或 Insert",
    ],
    steps: [
      "先在 Media Pool 进入一个主题明确的素材箱并确认排序方式，再切换 Source Tape，让箱内片段在查看器中连续显示。",
      "快速滚动整卷素材带，在真正可用镜头处设置 In/Out；不要把失焦、重复和无信息停顿一起带入时间线。",
      "按叙事顺序使用 Append 建立连续粗剪，需要插入当前播放头位置时再使用 Insert，并在每次编辑后继续浏览 Source Tape。",
      "完成一个段落后切回 Timeline，从头播放检查方向、动作、景别和地点关系，再对明显冗余镜头做修剪或删除。",
      "返回 Source Tape 补足缺失的建立镜头、动作细节和环境声画面，完成后保存独立粗剪版本。",
    ],
    checks: [
      "粗剪顺序不依赖特效也能理解地点和动作关系",
      "时间线没有误选、重复或失焦镜头",
      "Source Tape 的排序范围与当前素材箱一致",
    ],
    pitfall:
      "Source Tape 只是连续浏览方式，不会替你判断叙事；素材箱过大或主题混杂时，应先拆分范围，否则快速追加只会更快地产生杂乱时间线。",
  },
  {
    id: "edit-scene-cut-detection-review",
    category: "剪辑 · 镜头检测",
    level: "进阶",
    estimatedMinutes: 14,
    prerequisite:
      "已把需要返修的单一成片放入规格匹配的时间线，并保留一份未拆分的原始时间线版本。",
    title: "用 Scene Cut Detection 拆分单一成片并人工复核",
    goal: "从没有工程文件的成片中自动找回候选剪辑点，再修正误切和漏切，为逐镜调色或重剪建立可靠片段。",
    scenario:
      "只有一条导出成片，需要重新调色、替换局部镜头、加字幕或制作短版。",
    settings: [
      "页面：Edit",
      "入口：Timeline → Detect Scene Cuts",
      "导航：Up / Down Arrow",
      "补切：Command/Ctrl + \\",
    ],
    steps: [
      "先复制时间线并锁定原始版本，再选中需要分析的成片；只处理局部时先设置 In/Out，避免无关段落也被拆分。",
      "执行 Timeline → Detect Scene Cuts，等待分析完成后从头播放，不把自动产生的每个 through edit 都当成正确结果。",
      "用 Up/Down Arrow 逐个跳转检测点，重点检查闪光、甩镜、快速运动和叠化处；错误切点选中后删除。",
      "发现漏切时停在真实画面切换帧，使用 Timeline → Split Clips 或 Command/Ctrl + \\ 补回剪辑点。",
      "完成后抽查片段头尾、音频连续性和总时长，并另存检测完成版本，再开始逐镜调色或重剪。",
    ],
    checks: [
      "硬切点被拆开且闪光、甩镜和运动峰值没有被误切",
      "原始时长、画面顺序和音频连续性保持不变",
      "保留未拆分版本，可随时对照或恢复",
    ],
    pitfall:
      "Scene Cut Detection 只提供候选结果；叠化、闪光和高速运动最容易误判，直接进入批量调色会把一个镜头拆成多个不一致片段。",
  },
  {
    id: "edit-freeze-frame-hold",
    category: "变速 · 定格",
    level: "入门",
    estimatedMinutes: 10,
    prerequisite:
      "已完成目标片段的基础修剪，并能在 Edit 页逐帧定位清晰且适合承载说明的画面。",
    title: "用 Freeze Frame 与速度点制作可控定格",
    goal: "在关键画面暂停动作并加入说明，同时保持定格前后的节奏、声音和后续同步关系可控。",
    scenario:
      "路线说明、产品细节、教学步骤、人物表情和需要短暂停住观察的动作瞬间。",
    settings: [
      "页面：Edit",
      "入口：Retime Controls → Freeze Frame",
      "速度点：调整定格区间",
      "检查：定格前后各 3–5 秒",
    ],
    steps: [
      "先逐帧找到主体清楚、运动模糊较少的画面并添加标记，再复制时间线，避免直接破坏已锁定节奏。",
      "选中片段打开 Retime Controls，在播放头位置选择 Freeze Frame，让 Resolve 建立定义定格范围的速度点。",
      "拖动第二个速度点调整定格时长，确认定格会怎样影响片段总长度、后续剪辑点和音乐节拍。",
      "需要说明时添加简洁标题或标注，并保留主体视线空间；不要同时叠加无意义缩放、闪烁和复杂转场。",
      "从定格前后各 3–5 秒回放，检查动作恢复、声音桥和字幕同步，再导出短测试段检查清晰度与重复帧感。",
    ],
    checks: [
      "定格帧清晰且文字标注在安全区内可读",
      "进入和退出定格没有跳音、黑帧或意外重复动作",
      "后续剪辑点、字幕和音乐同步关系仍符合预期",
    ],
    pitfall:
      "定格会改变片段在时间线中的持续时间；未先确认 Ripple 与后续同步关系就拉长定格，容易让字幕、音乐点和连接素材整体错位。",
  },
  {
    id: "edit-render-cache-smart-user",
    category: "性能 · 渲染缓存",
    level: "进阶",
    estimatedMinutes: 12,
    prerequisite:
      "时间线已能正常播放原始素材，并已确认卡顿来自降噪、Fusion、调色或复杂效果，而不是离线媒体和磁盘故障。",
    title: "区分 Smart 与 User Render Cache 修复复杂段掉帧",
    goal: "只缓存真正影响实时回放的时间线片段，并通过红蓝状态条确认缓存完成，避免把代理、优化媒体和渲染缓存混为一谈。",
    scenario:
      "Temporal NR、Fusion 合成、复杂 OFX、叠加调色或高码率素材导致局部无法实时播放。",
    settings: [
      "入口：Playback → Render Cache",
      "自动：Smart",
      "手动：User + Render Cache Clip Output",
      "状态：红色待缓存 · 蓝色已缓存",
    ],
    steps: [
      "先关闭缓存回放代表性复杂段，确认卡顿位置与时间线上红色状态区域一致，并检查缓存盘剩余空间。",
      "需要自动处理时选择 Playback → Render Cache → Smart，让 Resolve 识别高负载效果；只想控制少数片段时选择 User。",
      "在 User 模式下右键目标片段启用 Render Cache Clip Output，并等待状态条从红色变为蓝色，不要在后台缓存未完成时判断效果。",
      "缓存完成后以项目帧率回放复杂段，检查画面、声音和调色是否正确；修改节点、效果或片段后等待相关区域重新缓存。",
      "交付前回到完整质量检查缓存格式与源媒体关系；缓存只用于回放性能，不能替代原片、代理策略或最终文件验收。",
    ],
    checks: [
      "目标复杂段状态条变蓝并能按项目帧率稳定回放",
      "只缓存必要范围且缓存盘仍有安全余量",
      "修改效果后对应范围会重新缓存且最终画面一致",
    ],
    pitfall:
      "Render Cache 是可重建的时间线缓存，不是素材备份；HDR 项目使用低位深缓存格式可能损伤高光，缓存盘过慢或已满也不会真正改善播放。",
  },
  {
    id: "fusion-text-plus-lower-third",
    category: "标题 · Lower Third",
    level: "进阶",
    estimatedMinutes: 15,
    prerequisite:
      "主剪辑结构和人物、地点名称已确认，并能在 Edit 与 Fusion 页之间切换和调整 Inspector 参数。",
    title: "用 Text+ 制作克制且可复用的动态人物条",
    goal: "建立手机端可读、位于标题安全区且入场节奏自然的 Lower Third，并保留后续替换姓名和地点的可编辑结构。",
    scenario:
      "人物采访、地点介绍、路线章节、专家身份和需要统一视觉语言的系列视频。",
    settings: [
      "工具：Text+",
      "布局：Layout → Center X / Y",
      "样式：Text / Shading",
      "检查：Title Safe + 手机尺寸",
    ],
    steps: [
      "先确定姓名、身份或地点两级信息，保持文字简短；在 Edit 页把 Text+ 放到目标镜头上方，并设置真正需要的持续时长。",
      "进入 Fusion 或 Inspector，在 Text 页设置字体、字号、字重、行距和左对齐，再在 Layout 页把标题放入下三分之一安全区域。",
      "在 Shading 中建立文字与背景的最小对比，只在复杂画面需要时增加克制底板或阴影，不用高饱和描边掩盖可读性问题。",
      "用少量关键帧制作位置或透明度入场，保持 6–12 帧起步并使用缓动；出场应在镜头切换或人物说话结束前自然完成。",
      "替换不同长度的姓名和地点做压力测试，在 16:9 与 9:16 版本、手机缩放和浅色/深色背景上逐项检查后再复制模板。",
    ],
    checks: [
      "姓名与身份层级清楚且手机尺寸仍可快速读懂",
      "标题始终位于安全区，不遮挡人脸、字幕和关键画面",
      "不同文字长度下底板、对齐和动画不会破裂",
    ],
    pitfall:
      "Fusion 标题可编辑不等于自动响应所有文字长度；固定宽度底板、过小字号和过度动画在更换姓名或改成竖版后最容易失效。",
  },
  {
    id: "edit-compound-clip-decompose",
    category: "整理 · 复合片段",
    level: "进阶",
    estimatedMinutes: 14,
    prerequisite:
      "时间线上已有逻辑完整且音画关系稳定的片头、章节或多层段落，并已保存修改前时间线版本。",
    title: "建立 Compound Clip 并安全 Decompose in Place",
    goal: "把复杂章节封装成易移动的单元，同时保留返回内部编辑和在当前时间线拆回独立素材的清晰路径。",
    scenario:
      "多层片头、地图章节、同步画中画、重复使用的包装和需要整体移动的复杂时间线段落。",
    settings: [
      "建立：New Compound Clip",
      "内部编辑：Open in Timeline",
      "拆回：Clip → Decompose in Place",
      "命名：章节_用途_版本",
    ],
    steps: [
      "先复制时间线并只选择逻辑上属于同一单元的连续视频与音频，确认没有误选跨章节字幕、音乐或连接素材。",
      "创建 New Compound Clip，使用章节、用途和版本命名；在 Media Pool 与时间线确认复合片段图标和持续时长正确。",
      "打开复合片段内部，检查轨道、音频通道、字幕、效果和起点关系，再返回父时间线整体移动或复用该单元。",
      "需要在当前时间线恢复独立编辑时先复制版本，再选择 Clip → Decompose in Place；确认拆回素材与原片段顺序、时长和同步一致。",
      "抽查其他时间线中的同名复合片段，明确本次内部修改是否影响引用；交接前记录哪些段落仍是复合片段、哪些已拆回。",
    ],
    checks: [
      "复合片段内外时长、画面、音频和字幕关系一致",
      "整体移动不会破坏内部同步或误带其他章节素材",
      "Decompose in Place 后素材顺序与同步正确且保留修改前版本",
    ],
    pitfall:
      "Compound Clip 是活动时间线结构，不是独立渲染文件；修改内部可能影响其他引用，而 Decompose in Place 后的素材会成为当前时间线中的独立编辑对象。",
  },
  {
    id: "edit-render-in-place-restore",
    category: "性能 · 中间渲染",
    level: "进阶",
    estimatedMinutes: 14,
    prerequisite:
      "复杂效果段已完成初步确认，缓存仍不足以稳定回放，并已保存修改前时间线版本。",
    title: "用 Render in Place 加速复杂段并恢复原始结构",
    goal: "把高负载片段暂时烘焙为易回放媒体，同时保留返回原始片段和可编辑效果的明确路径。",
    scenario:
      "变速、Fusion 合成、降噪或多层效果已经基本确定，但时间线仍无法按项目帧率稳定播放。",
    settings: [
      "入口：右键片段 → Render in Place",
      "编码：按项目位深与交付质量选择",
      "识别：给已渲染片段统一颜色",
      "恢复：右键 → Decompose to Original",
    ],
    steps: [
      "先复制时间线并回放目标段，确认瓶颈来自片段效果而不是离线媒体、磁盘或项目帧率；只选择真正需要烘焙的连续片段。",
      "右键选择 Render in Place，设置保存位置、文件名和足以保留项目位深与色彩信息的编码，再等待新媒体生成并替换时间线片段。",
      "给生成片段统一颜色或命名，按项目帧率播放前后各 3–5 秒，核对画面、速度、透明度、音频边界和剪辑点没有变化。",
      "需要继续修改效果时，右键生成片段选择 Decompose to Original，确认原始片段及可编辑效果已返回时间线，再完成修改并按需重新渲染。",
      "项目交接前记录生成媒体位置；确认不再需要后再单独清理，因为恢复原始结构不会自动删除硬盘和 Media Pool 中的 Render in Place 文件。",
    ],
    checks: [
      "复杂段可按项目帧率稳定播放且前后剪辑点不变",
      "Decompose to Original 后原始片段与可编辑效果完整恢复",
      "生成媒体位置、命名和清理责任已有记录",
    ],
    pitfall:
      "Render in Place 会把当前效果烘焙进新媒体，但恢复操作不会自动删除该文件；编码位深不足、误清理文件或把它当作原片备份都会留下交付风险。",
  },
  {
    id: "colortrace-revised-timeline",
    category: "调色 · 版本继承",
    level: "进阶",
    estimatedMinutes: 16,
    prerequisite:
      "旧版时间线已完成可靠调色，新版时间线保留原始素材名称或源时间码，并已复制项目或时间线版本。",
    title: "用 ColorTrace 把已确认调色继承到新版时间线",
    goal: "把旧剪辑版本的可靠调色匹配到新版时间线，同时单独处理新增、替换、变速和匹配不确定的镜头。",
    scenario:
      "画面完成初调后收到新版 XML、重新剪辑时间线或长度调整，需要避免从零重复逐镜调色。",
    settings: [
      "入口：活动时间线右键 → ColorTrace",
      "来源：已确认旧版时间线",
      "自动匹配：源时间码 / 片名",
      "异常：Manual 逐镜确认",
    ],
    steps: [
      "先复制新版时间线并确认旧版仍可独立打开；比较两版镜头数量、时长和离线状态，标记新增、替换、变速与嵌套片段。",
      "在 Edit 页打开并激活目标新版时间线，右键选择 ColorTrace，再从项目列表明确选择已确认调色的旧版时间线作为来源。",
      "先查看自动匹配结果，不立即全部接受；按源时间码、片名和缩略图核对一对一匹配，避免同名转码、重复素材或速度变化错配。",
      "对红色、无匹配或一对多项目切到 Manual，逐镜指定正确来源；新增或完全替换镜头保持未调色状态，交给后续单独匹配。",
      "完成复制后在 Color 页按时间线顺序回看，重点比较切点两侧、共享节点、组节点、关键帧和跟踪窗口，并保存新的调色版本。",
    ],
    checks: [
      "旧版对应镜头的调色、节点和必要关键帧已正确继承",
      "新增、替换、变速与不确定匹配镜头均被单独标记复核",
      "新版时间线逐切点回看无跳亮、错色或错误跟踪",
    ],
    pitfall:
      "ColorTrace 的自动匹配不是创意判断；同名素材、重新转码、速度变化和嵌套结构可能把正确调色复制到错误镜头，必须复核匹配关系。",
  },
  {
    id: "edit-optical-flow-speed-warp-qc",
    category: "变速 · 插帧质检",
    level: "进阶",
    estimatedMinutes: 16,
    prerequisite:
      "已确认源素材与时间线帧率，并明确目标慢放比例；优先使用真实高帧率素材，不把插帧当作补拍替代。",
    title: "比较 Frame Blend、Optical Flow 与 Speed Warp 慢动作",
    goal: "用最低复杂度的重定时方式获得可接受慢动作，并通过逐帧检查决定升级、回退或取消插帧。",
    scenario:
      "普通帧率素材需要短暂慢放，或高帧率素材仍需进一步减速，但车辆、人物和复杂背景可能产生插帧伪影。",
    settings: [
      "Inspector：Retime and Scaling",
      "起点：Nearest / Frame Blend",
      "升级：Optical Flow",
      "Studio 可选：Speed Warp",
    ],
    steps: [
      "先计算真实帧率余量，例如 60p 放入 30p 时间线可自然减速到 50%；能用源帧完成时不要启用插帧。",
      "设置目标速度并从 Nearest 或 Frame Blend 回放，记录卡顿与重影位置；只对确实需要改善的短范围继续测试。",
      "在 Retime and Scaling 把 Retime Process 改为 Optical Flow，选择合适 Motion Estimation，等待缓存完成后再判断，不能用未缓存预览下结论。",
      "Studio 用户可复制片段后尝试 Speed Warp，与 Optical Flow 做等速度 A/B；逐帧检查人物手脚、车轮、护栏、树枝、遮挡边缘和交叉运动。",
      "若出现撕裂、融化、重复纹理或错误遮挡，依次降低慢放幅度、改回 Frame Blend/Nearest 或取消慢放，并导出测试段复核最终编码。",
    ],
    checks: [
      "慢动作速度有源帧率依据且缓存后能按项目帧率播放",
      "逐帧检查无明显撕裂、融化、重影和错误遮挡",
      "已保留最低复杂度的可接受方案，并通过导出文件复核",
    ],
    pitfall:
      "Speed Warp 计算更重且需要 Studio，但不保证复杂遮挡、快速摇镜和运动模糊一定正确；最慢的算法不是自动最佳答案。",
  },
  {
    id: "fairlight-dialogue-leveler-ab",
    category: "声音 · 对白电平",
    level: "进阶",
    estimatedMinutes: 15,
    prerequisite:
      "对白已按说话人或录音环境分轨，并先完成明显爆音、错误剪辑点和极端 Clip Gain 差异的人工修正。",
    title: "用 Dialogue Leveler 统一对白并完成旁路 A/B",
    goal: "在保持自然语气和动态的前提下压低过响对白、抬升过轻对白，再用电平表和完整句子回听确认没有抽吸。",
    scenario:
      "同一说话人因转头、距离变化或领夹麦位置不同造成句内、句间电平起伏，但录音仍有可用信噪比。",
    settings: [
      "位置：Fairlight Mixer → Track FX",
      "工具：Dialogue Leveler",
      "顺序：Clip Gain 后、Limiter 前",
      "判断：Meter + Bypass A/B",
    ],
    steps: [
      "先按说话人和环境分轨，用 Clip Gain 修正极端差异并删除不应处理的空白、杂音或串音，避免 Track FX 把噪声当成目标。",
      "在对应 Dialogue 轨的 Mixer 启用 Dialogue Leveler，打开 Controls；从默认或最低有效处理起步，不同时叠加强门限和重压缩。",
      "播放包含轻声、正常和较响句子的代表段，观察电平表并调整减弱大声、抬升小声和背景处理，让变化平滑而不是追求完全等高。",
      "反复切换 Bypass 做等响度 A/B，完整听句首、句尾、停顿和呼吸，确认没有底噪抽吸、尾字被抬高或语气被压平。",
      "再回听整轨并检查与音乐、环境声的关系；最后用总线 Limiter 控制峰值并导出测试段，在耳机和手机扬声器复核。",
    ],
    checks: [
      "同一说话人的轻声与响声更连续但仍保留自然动态",
      "停顿、呼吸和句尾无明显底噪抽吸或电平跳动",
      "旁路 A/B、电平表和导出文件三项检查均通过",
    ],
    pitfall:
      "Dialogue Leveler 不能修复削波、严重混响或极差信噪比；把背景处理和抬升量开得过强会把房间声、衣物摩擦和呼吸一起放大。",
  },
  {
    id: "color-shared-node-linked-fix",
    category: "调色 · 共享节点",
    level: "进阶",
    estimatedMinutes: 15,
    prerequisite:
      "一组镜头确实需要完全相同且会持续联动的技术处理，并已完成每镜头独立曝光、白平衡和匹配。",
    title: "用 Shared Node 联动统一技术修正并安全拆分",
    goal: "让同一相机或同一技术问题的多个镜头共享一个可集中更新的节点，同时避免把逐镜差异和创意调整锁进全局联动。",
    scenario:
      "同一批素材需要统一 CST、固定 LUT、镜头缺陷修正或可复用技术节点，而且后续参数可能整体更新。",
    settings: [
      "建立：右键 Corrector → Save as Shared Node",
      "默认：Shared Node 自动锁定",
      "范围：仅统一技术处理",
      "拆分：Decompose to Corrector Node",
    ],
    steps: [
      "先在代表镜头建立单一技术节点并验证输入色彩空间、LUT 或固定修正正确；逐镜曝光、白平衡和窗口跟踪保留在独立节点。",
      "右键该 Corrector 选择 Save as Shared Node，使用“相机_用途_版本”命名并保持锁定，防止无意修改影响所有引用。",
      "把共享节点复制到同一技术条件的目标镜头，检查节点名称和 Shared 状态；不同相机、光线或输入空间不得只因风格相似而复用。",
      "需要整体更新时先复制时间线或保存 Gallery Still，再解锁一个共享实例做小幅调整，逐镜检查所有引用镜头的波形、肤色与高光。",
      "某个镜头需要独立偏离时，将该实例 Decompose to Corrector Node 后再修改；交接时记录共享节点名称、用途和影响范围。",
    ],
    checks: [
      "修改一个 Shared Node 后所有预期引用同步更新",
      "逐镜校正、窗口与跟踪未被放入共享技术节点",
      "例外镜头已拆成独立 Corrector，影响范围可追溯",
    ],
    pitfall:
      "Shared Node 是实时联动而不是一次性复制；解锁后一次误改会影响全部引用，把逐镜曝光或跟踪放进去尤其危险。",
  },
  {
    id: "edit-dynamic-project-timeline-copy",
    category: "剪辑 · 跨项目复用",
    level: "进阶",
    estimatedMinutes: 14,
    prerequisite:
      "源项目与目标项目已分别备份，且两者使用兼容的帧率、分辨率、色彩管理和媒体路径。",
    title: "用 Dynamic Project Switching 跨项目复制时间线",
    goal: "在不导出中间文件的情况下复用已验证的时间线、片段或节点，并在目标项目中重新核对媒体与项目设置。",
    scenario:
      "片头模板、已确认章节、调色节点或常用结构需要从旧项目迁移到新项目，同时保留继续编辑的能力。",
    settings: [
      "入口：Project Manager → Dynamic Project Switching",
      "状态：源项目与目标项目同时打开",
      "复制：Media Pool 中选择时间线",
      "核对：帧率 / 色彩管理 / 字体 / 插件 / 媒体",
    ],
    steps: [
      "在 Project Manager 的菜单中启用 Dynamic Project Switching，分别打开源项目与目标项目，确认项目名称清楚且均已保存。",
      "先在源项目检查时间线帧率、色彩空间、离线媒体、字体和第三方插件；只选择需要复用的时间线或片段，避免把整个旧项目结构带入。",
      "在 Media Pool 复制目标时间线，使用项目切换菜单进入目标项目并粘贴到明确命名的素材箱；不要在未确认当前项目时继续编辑。",
      "打开复制后的时间线，重新链接必要媒体，并逐项核对项目帧率、输出色彩空间、音频总线、字幕、Fusion 素材和插件状态。",
      "把复制版本改为新名称，播放片头、中段和片尾并导出短测试段；确认独立播放器正常后再把它作为目标项目正式版本。",
    ],
    checks: [
      "复制后的时间线可独立打开且无意外离线媒体",
      "帧率、色彩管理、字体、插件和音频路由已在目标项目复核",
      "源项目保持不变，目标项目测试导出可正常播放",
    ],
    pitfall:
      "Dynamic Project Switching 只让项目同时驻留并支持复制粘贴，不会自动统一项目设置或打包依赖；跨帧率、跨色彩空间和缺失插件仍需人工处理。",
  },
  {
    id: "fairlight-ai-remove-silence-review",
    category: "声音 · 节奏清理",
    level: "谨慎使用",
    estimatedMinutes: 15,
    prerequisite:
      "已复制时间线版本，并确认对白轨没有被音乐、环境声或串音混入；该功能需要支持 AI IntelliCut 的 Studio 版本。",
    title: "用 AI Remove Silence 标出停顿并逐处确认",
    goal: "批量识别无信息长停顿，同时保留呼吸、语气、环境连续性和句首句尾，避免把自然对白切成机械碎片。",
    scenario:
      "课程、采访、旁白或长段讲解含有多处明显等待，但手工逐段寻找耗时且仍需编辑者判断语义。",
    settings: [
      "入口：Fairlight → 右键选区 → Remove Silence",
      "范围：Range Tool 只选对白片段",
      "参数：Threshold / Pre Head / Post Tail",
      "保护：Minimum to Strip + Fade Head and Tail",
    ],
    steps: [
      "复制时间线并独听目标对白轨，先手工标记需要保留的情绪停顿、换气、环境声和句间节奏；音乐或复杂串音不要一起分析。",
      "用 Range Tool 选择一个代表段，右键执行 Remove Silence；观察音频上的红色竖条预览，不要在未检查预览时直接扩大到全片。",
      "从较保守的 Threshold 起步，增加 Minimum to Strip 以只处理长停顿，并用 Pre Head、Post Tail 保留辅音起点、尾字和自然呼吸。",
      "开启 Fade Head and Tail 后逐条播放红色候选区，撤销误判；重点检查轻声、句尾、吞音和底噪变化没有被当成静音删除。",
      "确认代表段后再分段处理整轨，最后旁路对比并播放所有接缝；必要时补环境底声，导出测试段检查节奏和口型同步。",
    ],
    checks: [
      "只移除了无信息长停顿，轻声、换气和完整语义均保留",
      "所有剪辑边界无吞字、点击、突兀底噪或口型跳变",
      "原始版本可恢复，处理后测试导出播放正常",
    ],
    pitfall:
      "Remove Silence 按电平与时长判断，不理解语义；Threshold 过高、Minimum to Strip 过短或 Head/Tail 过小会切掉轻声、辅音和自然节奏。",
  },
  {
    id: "media-intellisearch-context-review",
    category: "媒体 · 智能搜索",
    level: "进阶",
    estimatedMinutes: 15,
    prerequisite:
      "使用支持 IntelliSearch 的 Resolve 21 版本，已从 Extras Download Manager 安装模型并保留可追溯的原始素材箱结构。",
    title: "用 IntelliSearch 找到镜头并回看完整上下文",
    goal: "按画面对象、人物、对白或元数据快速缩小长素材范围，再人工确认动作头尾、连续性和真实内容。",
    scenario:
      "旅行长片、纪录片或多日拍摄中需要寻找特定车辆、路牌、人物、颜色或一句对白，手工浏览全部素材效率过低。",
    settings: [
      "模型：Extras Download Manager → Faster / Better",
      "入口：Media Pool → Search",
      "模式：All / Visual / Transcript / Metadata",
      "范围：All Bins / Selected Bins",
    ],
    steps: [
      "从 Extras Download Manager 安装 Faster 或 Better 模型，在 Media Pool 菜单选择模式并先分析一个代表素材箱；Better 更准确但首次分析更慢。",
      "点击 Media Pool 搜索图标，先限定 Selected Bins，再按任务选择 Visual、Transcript 或 Metadata；不要把模糊问题直接扩大到全项目。",
      "使用具体描述搜索对象、人物、颜色、机位或对白；在 Full Clips 中查看黄色相关范围，或用 Segments 只显示匹配区间。",
      "逐条打开结果并向前后回看，检查动作头尾、焦点、曝光、声音、空间连续性和语义；按 X 采用相关范围前先修正 In/Out。",
      "将确认过的条件保存为 Smart Bin，并补充人工关键词和评分；随机抽查未命中素材，记录模型、语言或画面条件造成的漏检。",
    ],
    checks: [
      "搜索范围、模式和模型选择与当前任务一致",
      "采用的每个结果都回看了完整上下文并重新确认 In/Out",
      "Smart Bin 可复用，且抽查未发现会改变剪辑结论的明显漏检",
    ],
    pitfall:
      "IntelliSearch 是候选检索而不是事实识别；遮挡、夜景、方言、同音词和未分析素材都会造成误检或漏检，不能用“没有结果”证明素材不存在。",
  },
  {
    id: "edit-animated-subtitles-word-highlight",
    category: "字幕 · 动态强调",
    level: "谨慎使用",
    estimatedMinutes: 14,
    prerequisite:
      "已在支持 AI Animated Subtitles 的 Studio 版本中生成并逐句校对字幕，且字幕轨时间、语言和断句已经锁定。",
    title: "给字幕轨添加 Animated 模板并克制高亮关键词",
    goal: "使用逐词动画提高短视频和教程的可读性，同时保留字幕准确性、移动端安全区和整片视觉节奏。",
    scenario:
      "口播、教程或短视频需要让当前词或关键词更易跟读，但不希望每句话都使用高强度弹跳和颜色变化。",
    settings: [
      "入口：Effects Library → Titles → Animated",
      "应用：拖到 Subtitle Track Header",
      "模板：Word Highlight",
      "调整：Inspector",
    ],
    steps: [
      "先完成字幕文字、时间、说话人和断句校对，并复制时间线版本；动态模板不能修复识别错误或错误同步。",
      "在 Titles 的 Animated 区域预览模板，把 Word Highlight 或目标模板拖到字幕轨 Header，而不是逐条复制到每个字幕片段。",
      "在 Inspector 调整字体、字号、位置、基础色和高亮色，从单一强调色与最低有效动画强度开始，保持品牌和画面一致。",
      "逐句播放检查高亮是否跟随真实发音，遇到快速语速、专有名词或错误断词时先修字幕时间与断句，不用动画掩盖问题。",
      "在手机尺寸、复杂背景和不同章节抽查安全区与可读性，再旁路动画比较；导出短测试段确认渲染结果与时间线一致。",
    ],
    checks: [
      "逐词高亮与真实发音同步，文字内容和断句已经人工确认",
      "手机端字幕不遮挡主体且高亮色具有足够对比度",
      "旁路比较后动画确实提升跟读性，测试导出无错位或掉帧",
    ],
    pitfall:
      "Animated 模板依赖转录和字幕时间；过快动画、每词变色或大幅弹跳会增加视觉疲劳，长片与沉浸内容通常只适合局部使用。",
  },
  {
    id: "color-face-plate-mosaic-track",
    category: "修复 · 隐私遮挡",
    level: "进阶",
    estimatedMinutes: 14,
    prerequisite:
      "已识别需要隐藏的人脸、车牌、门牌或屏幕信息，并保留未经处理的可恢复版本。",
    title: "用 Power Window 跟踪并持续遮挡人脸或车牌",
    goal: "让马赛克在目标移动、转身和短暂遮挡时始终覆盖隐私信息，并通过逐帧复核后再交付。",
    scenario:
      "街拍、行车记录、采访或屏幕录制中出现未获授权的人脸、车牌、地址和账号信息。",
    settings: [
      "节点：独立命名 PRIVACY",
      "窗口：Circle / Curve Power Window",
      "效果：Resolve FX Mosaic Blur",
      "分析：Tracker 前后双向",
    ],
    steps: [
      "复制时间线并在需要遮挡的每段素材上建立独立 PRIVACY 节点；把播放头放在目标清晰、尺寸较大且无遮挡的帧。",
      "创建比目标略大的 Power Window，增加少量 Softness，再把 Resolve FX Mosaic Blur 拖到该节点并提高像素块直到内容不可辨认。",
      "打开 Tracker，先向前再向后分析；目标离开画面、被遮挡或跟踪漂移时停止分析，在可靠帧重新定位并用关键帧修正。",
      "按正常速度和逐帧各回放一次，重点检查镜头切点、快速运动、运动模糊、画面边缘及目标重新出现的首帧。",
      "导出短测试段并在独立播放器全屏与逐帧检查；确认所有隐私信息持续不可识别后，才按同样方法处理完整片并保留原始版本。",
    ],
    checks: [
      "窗口从目标出现到消失全程覆盖，没有首尾漏帧或跟踪漂移",
      "马赛克强度足以阻止识别，窗口边缘不过度暴露周围画面",
      "测试导出逐帧通过且原始时间线可恢复",
    ],
    pitfall:
      "自动跟踪不是隐私保证；遮挡、出画、切镜和运动模糊最容易漏帧，必须对最终导出文件逐帧复核关键区间。",
  },
  {
    id: "edit-scroll-credits-readability-qc",
    category: "标题 · 滚动片尾",
    level: "入门",
    estimatedMinutes: 12,
    prerequisite:
      "片尾名单、音乐署名、素材来源和版权文字已经逐项确认，并保留可复制的最终文稿。",
    title: "用 Scroll 制作可读片尾并核对每条署名",
    goal: "建立速度稳定、手机端可读且不遗漏人员、音乐与素材来源的滚动片尾。",
    scenario:
      "旅行纪录片、采访、教程或合作视频需要展示制作名单、音乐授权、鸣谢和来源信息。",
    settings: [
      "入口：Effects Library → Titles → Scroll",
      "背景：纯色或低干扰画面",
      "速度：通过标题片段时长控制",
      "安全区：Viewer → Safe Area",
    ],
    steps: [
      "先在外部文稿中锁定姓名、角色、音乐曲名、作者、许可与来源 URL；按片头、主创、音乐、素材、鸣谢分组并保留原始拼写。",
      "在 Edit 页把 Scroll 标题添加到片尾，输入最终文稿并统一字体、字号、行距、对齐和段间距；不要混用过多字体或动画。",
      "把首行放在画面下方起始、末行完整离开上方结束；拖长标题片段以减慢滚动，按正常速度阅读最密集的一段。",
      "开启 Safe Area，在 16:9 与需要的竖屏版本分别检查左右边界、长英文 URL、双语行和手机端字号；必要时换行或拆成两段片尾。",
      "逐项对照最终文稿，导出片尾测试段并在手机和电脑完整播放；确认没有丢字、跳帧、裁切或过快滚动后再锁定全片。",
    ],
    checks: [
      "姓名、音乐、许可和来源与最终文稿逐项一致",
      "最密集段可在正常速度下读完，所有文字位于安全区",
      "测试导出在手机与电脑均无裁切、丢字或滚动卡顿",
    ],
    pitfall:
      "滚动速度由文字量、字号和片段时长共同决定；只看静止帧无法证明可读，音乐署名或授权信息缺失也不能靠视觉样式补救。",
  },
  {
    id: "media-dual-mono-channel-map-qc",
    category: "声音 · 声道映射",
    level: "进阶",
    estimatedMinutes: 13,
    prerequisite:
      "已确认相机或录音机各 Embedded Channel 的实际内容，并保留原始媒体与未经修改的项目版本。",
    title: "用 Clip Attributes 正确拆分双单声道录音",
    goal: "把分别录在左右声道的领夹、枪麦或环境声映射为独立 Mono 片段，避免单边播放、错轨或误合成立体声。",
    scenario:
      "相机 Channel 1 录领夹、Channel 2 录枪麦，或两支不同麦克风被封装在同一个 Stereo 文件中。",
    settings: [
      "入口：Media Pool → Clip Attributes → Audio",
      "Format：Mono",
      "Source Channel：Embedded Channel 1 / 2",
      "轨道：Fairlight Mono Track",
    ],
    steps: [
      "在 Media 页分别独听左右声道并记录 Embedded Channel 1、2 的真实麦克风、说话人和电平；不要只根据波形大小猜测。",
      "在 Media Pool 选择来源片段，打开 Clip Attributes → Audio，把 Format 从 Stereo 改为 Mono，并为每条 Mono 音频明确映射对应 Embedded Channel。",
      "将修改后的片段加入测试时间线，在 Fairlight 使用 Mono 轨道并保持主对白居中；逐条 Solo 确认没有左右互串、重复叠加或相位抵消。",
      "对已进入时间线的片段检查属性是否同步更新；必要时重新剪入或更换来源，不用 Pan 把错误的 Stereo 映射伪装成 Mono。",
      "用耳机、单只扬声器和立体声总线回听片头、中段与尾段，导出短测试文件并确认左右声道、响度和口型同步。",
    ],
    checks: [
      "每条 Mono 片段只包含指定 Embedded Channel 的真实内容",
      "对白居中且左右输出均可听，无重复、抵消或单边缺失",
      "测试导出声道布局、同步和响度与时间线一致",
    ],
    pitfall:
      "双单声道只是封装在同一文件中的两路独立信号，不是立体声声场；错误映射会丢掉一路、重复一路或让对白只在一侧播放。",
  },
  {
    id: "edit-ripple-roll-slip-slide-qc",
    category: "剪辑 · 精确修剪",
    level: "进阶",
    estimatedMinutes: 16,
    prerequisite:
      "已完成粗剪并保留足够媒体 Handles，关联音频、标题和上层素材的同步关系已经明确。",
    title: "区分 Ripple、Roll、Slip 与 Slide 完成精确修剪",
    goal: "根据是否允许改变总时长、镜头位置和来源范围选择正确修剪方式，并避免破坏音画同步与节拍点。",
    scenario:
      "粗剪完成后需要逐帧修正动作切点、对白停顿、音乐节拍或 B-roll 内容，但不能随意移动其他镜头。",
    settings: [
      "工具：Trim Edit Mode（T）",
      "Ripple：改变总时长",
      "Roll：总时长不变，移动剪辑点",
      "Slip / Slide：片段时长不变",
    ],
    steps: [
      "复制时间线并在目标剪辑点前后标记同步、节拍、字幕和上层连接素材；先写清哪些位置必须固定、总时长能否变化。",
      "需要缩短或延长单侧并让后续时间线跟随时使用 Ripple；操作后检查所有轨道的 Sync Lock、音乐节拍和字幕位置。",
      "需要同时缩短一侧、延长另一侧且保持总时长时使用 Roll；用双画面反馈比较 outgoing 最后一帧与 incoming 第一帧。",
      "保持片段位置和时长、只更换内部来源范围时使用 Slip；保持来源范围和时长、只移动整个片段并补偿两侧时使用 Slide。",
      "用逗号、句号逐帧微调，检查红色边缘是否表示 Handles 用尽；从前一剪辑点播放到后一剪辑点并核对口型、动作、节拍和总时长。",
    ],
    checks: [
      "所选修剪方式与总时长、片段位置和来源范围的预期一致",
      "音画同步、字幕、音乐节拍和连接素材没有被意外移动",
      "所有边界仍有合法媒体内容且连续回放无闪帧或动作跳变",
    ],
    pitfall:
      "Ripple 会改变后续时间位置，Slip/Slide 又依赖两侧 Handles；只看当前剪辑点而不检查关联轨道，最容易造成字幕漂移、音乐错拍或离线空帧。",
  },
  {
    id: "edit-reverse-speed-audio-continuity-qc",
    category: "变速 · 倒放",
    level: "谨慎使用",
    estimatedMinutes: 13,
    prerequisite:
      "已选定动作起止明确的短片段，并确认倒放不会歪曲纪录事实、交通方向或事件因果。",
    title: "用 Reverse Speed 制作可控倒放并重建声音",
    goal: "让短动作反向播放而不破坏节奏、音频和镜头连续性，并明确倒放属于视觉效果而非真实事件顺序。",
    scenario:
      "物体回到原位、短暂回溯、动作循环或章节转场；不适用于需要保持真实时间顺序的纪录画面。",
    settings: [
      "入口：Change Clip Speed → Reverse Speed",
      "局部：Retime Controls → Reverse Segment",
      "速度：先保持 -100%",
      "声音：分离、静音或重新设计",
    ],
    steps: [
      "复制时间线并把目标动作修剪成起止清楚的短片段，保留两侧 Handles；先正放确认动作、机位与真实时间关系。",
      "整段倒放时打开 Change Clip Speed 并启用 Reverse Speed；只倒放一段时在 Retime Controls 添加 Speed Point 后选择 Reverse Segment。",
      "先保持 100% 反向速度，检查倒放首尾是否产生跳帧、方向突变或明显物理违和；需要变速时再调整持续时间和 Retime Curve。",
      "独听原声，倒放对白、音乐和环境声通常应分离或静音，再用正向环境底声、设计音效和短淡化重建听觉连续性。",
      "从前一镜头播放到后一镜头，逐帧检查切点与插帧伪影；导出测试段并确认音画同步、缓存渲染和最终编码结果。",
    ],
    checks: [
      "倒放动作起止清楚且没有意外重复帧、黑帧或方向跳变",
      "原始倒放音频已处理，接缝无突兀噪声或节拍错误",
      "纪录性内容不会让观众误解真实事件顺序，测试导出播放正常",
    ],
    pitfall:
      "倒放会改变因果、文字方向、车辆运动和自然现象；长段或无动机倒放容易显得造作，反向原声也不能直接当作正常环境声交付。",
  },
  {
    id: "edit-flip-horizontal-text-direction-qc",
    category: "修复 · 镜像翻转",
    level: "谨慎使用",
    estimatedMinutes: 10,
    prerequisite:
      "已确认素材确实被前置镜头或采集链路水平镜像，并能辨认画面中的文字、路牌和左右方向。",
    title: "用 Flip Horizontal 修正镜像并复核方向信息",
    goal: "纠正被水平镜像的素材，同时保护文字、道路方向、人物特征和已跟踪效果的真实性。",
    scenario:
      "自拍、网络摄像头或采集卡素材被错误镜像；不用于为了构图好看而改变真实行驶方向。",
    settings: [
      "入口：Edit → Inspector → Transform",
      "操作：Flip Horizontal",
      "对照：源画面 / 修正版",
      "检查：Viewer 100%",
    ],
    steps: [
      "复制时间线，在镜像片段首尾打标记；先找文字、路牌、车牌、服装细节和人物左右特征，确认错误发生在素材而不是 Viewer 显示。",
      "在 Edit 页选中片段，打开 Inspector → Transform，启用 Flip Horizontal；不要用 180° Rotation 代替水平镜像。",
      "重新检查 Position、Zoom、Crop、关键帧、Power Window、跟踪和字幕位置；镜像会改变所有左右关系，已有遮挡与构图可能需要重做。",
      "从前一镜头连续播放到后一镜头，确认视线、动作方向和路线仍符合真实场景；纪录性道路或事件若原本正确，应撤销翻转。",
      "以 Viewer 100% 检查画面边缘并导出短测试段，对照文字可读性、人物特征、方向信息和最终编码结果。",
    ],
    checks: [
      "文字、路牌和车牌方向正确且可读",
      "人物、车辆和道路左右关系与真实场景一致",
      "构图、跟踪、遮挡与测试导出没有因翻转错位",
    ],
    pitfall:
      "水平镜像只改变左右方向，不会倒放时间；为了改善视线或行驶方向而翻转纪实画面，会同时伪造路牌、道路和事件空间关系。",
  },
  {
    id: "edit-paste-attributes-selective-qc",
    category: "整理 · 批量属性",
    level: "进阶",
    estimatedMinutes: 12,
    prerequisite:
      "已有一条调整通过的参考片段，目标片段来自相近机位或确实需要相同效果。",
    title: "用 Paste Attributes 选择性复用调整并逐镜复核",
    goal: "把明确需要的效果或属性批量复制到相似镜头，同时保护目标片段已有的构图、音量和关键帧。",
    scenario:
      "同机位镜头需要相同插件、裁切、音量或基础校正，但每条素材仍有曝光、构图和时长差异。",
    settings: [
      "复制：Command/Ctrl-C",
      "粘贴属性：Option/Alt-V",
      "关键帧：Maintain Timing / Stretch to Fit",
      "范围：先测试 1–3 条片段",
    ],
    steps: [
      "复制时间线并选定已通过检查的参考片段，记录它包含的 Transform、Crop、Color、Plugins、Volume、EQ 和关键帧；明确本次只需要哪几项。",
      "复制参考片段，先选中 1–3 条同类目标片段，执行 Edit → Paste Attributes（macOS Option-V、Windows Alt-V）。",
      "在对话框取消全选，只勾选本次需要的 Video、Audio、Plugins 或 Color 属性；含关键帧时按目标时长选择 Maintain Timing 或 Stretch to Fit。",
      "应用后逐条对比 Inspector、示波器和声音，检查目标片段原有裁切、稳定、音量、跟踪与颜色是否被覆盖；确认无误再扩大选择范围。",
      "从批次前一镜头连续播放到后一镜头，并导出短测试段；对曝光、白平衡、构图或内容不同的镜头做独立微调。",
    ],
    checks: [
      "只复制了明确勾选的属性，目标片段原有必要调整仍保留",
      "关键帧时间策略与目标片段时长一致",
      "逐镜回放、示波器、声音和测试导出均无突变",
    ],
    pitfall:
      "全选粘贴虽然快，却可能覆盖目标片段的裁切、音量、调色、稳定和关键帧；相同机位也不代表每条镜头能共用完全相同数值。",
  },
  {
    id: "color-magic-mask-subject-background-qc",
    category: "合成 · 无绿幕抠像",
    level: "进阶",
    estimatedMinutes: 15,
    prerequisite:
      "使用 DaVinci Resolve Studio，主体与背景有足够差异，且已接受逐帧修边与缓存检查。",
    title: "用 Magic Mask 隔离人物并完成逐帧边缘质检",
    goal: "在没有绿幕的素材中隔离人物或物体，用于局部调色或背景合成，并控制头发、遮挡和运动模糊伪影。",
    scenario:
      "人物从相对复杂背景前经过，需要做主体提亮、背景压暗或有限的背景替换。",
    settings: [
      "版本：DaVinci Resolve Studio",
      "入口：Color → Magic Mask",
      "识别：Person / Object",
      "检查：Highlight + 逐帧播放",
    ],
    steps: [
      "复制时间线，在主体轮廓最清楚且遮挡最少的代表帧建立独立节点；确认输入色彩管理和基础曝光已完成。",
      "打开 Magic Mask，选择 Person 或 Object，在主体内部添加最少必要的正向点击；识别到错误区域时用负向点击排除，不用大量笔画覆盖整帧。",
      "从代表帧分别 Track Forward 与 Track Reverse，查看 Overall Track 是否覆盖完整片段；镜头切换、主体离场或严重遮挡处拆分片段重新分析。",
      "在 Highlight/Matte 视图逐帧检查头发、手指、透明物、运动模糊和交叉遮挡，使用 Matte Finesse 小幅清理边缘并避免过度收缩。",
      "把局部调色或新背景放在正确节点与图层关系中，匹配亮度、色温、锐度和景深；缓存后导出测试段，在 100% 尺寸复核边缘闪烁。",
    ],
    checks: [
      "主体全程被正确隔离且没有明显漏选或背景粘连",
      "头发、手指、运动模糊和遮挡边缘连续自然",
      "缓存回放与测试导出无边缘闪烁、跳变或合成穿帮",
    ],
    pitfall:
      "Magic Mask 是 Studio 功能且不能替代合格拍摄；低对比、快速运动、复杂遮挡和压缩噪声仍可能需要分段、手工修正或改用绿幕。",
  },
  {
    id: "deliver-alpha-prores4444-roundtrip-qc",
    category: "交付 · Alpha 透明通道",
    level: "进阶",
    estimatedMinutes: 13,
    prerequisite:
      "时间线已产生真实透明区域，目标软件支持带 Alpha 的中间编码，并有可用于回读测试的彩色背景。",
    title: "用 ProRes 4444 导出 Alpha 并完成回读验证",
    goal: "把抠像、标题或动态图形交付为可复用透明视频，而不是带黑底的普通成片。",
    scenario:
      "需要把人物抠像、Logo 动画、字幕条或 Fusion 图形交给另一条时间线或其他后期软件继续合成。",
    settings: [
      "模式：Single Clip",
      "容器：QuickTime",
      "编码：ProRes 4444 / 4444 XQ",
      "选项：Export Alpha",
    ],
    steps: [
      "在 Edit/Fusion/Color 中把透明区域叠到亮色、暗色和高饱和测试背景上，先确认 Matte 没有孔洞、黑边、白边或残留背景。",
      "进入 Deliver，选择 Single Clip、QuickTime，并选择支持 Alpha 的 ProRes 4444 或 4444 XQ；Windows/Linux 可按当前编码支持选择 DNxHR 444 等 Alpha 格式。",
      "启用 Export Alpha；若该选项没有出现，说明当前容器或编码不支持 Alpha，返回更换编码，不用普通 H.264/MP4 冒充透明视频。",
      "渲染后把文件重新导入空项目，分别放到黑、白和彩色背景上，在 100% 查看头发、半透明、发光和运动模糊边缘。",
      "用媒体检查工具确认文件包含 Alpha/四通道信息，记录容器、编码、Alpha Mode、分辨率、帧率和软件版本后再交付。",
    ],
    checks: [
      "导出面板明确启用 Export Alpha 且编码支持透明通道",
      "回读后透明区域真实透出三种测试背景，没有黑框或白边",
      "文件元数据、帧率、分辨率和 Alpha Mode 已记录并可复现",
    ],
    pitfall:
      "时间线看见棋盘格不等于文件含 Alpha；H.264/普通 MP4 会把透明区域压平，必须用支持 Alpha 的编码并重新导入验证。",
  },
  {
    id: "deliver-live-save-project-backup-restore-drill",
    category: "交付 · 工程恢复",
    level: "质检",
    estimatedMinutes: 14,
    prerequisite:
      "项目数据库可正常打开，并有与项目数据库不同磁盘上的可写备份位置和足够空间。",
    title: "配置 Live Save 与 Project Backups 并完成恢复演练",
    goal: "同时防止崩溃丢失最新修改和误操作覆盖正确版本，并证明备份项目真的能够打开。",
    scenario:
      "长片、复杂调色或多人协作项目需要从几分钟前、几小时前或几天前的状态恢复。",
    settings: [
      "Preferences → User → Project Save and Load",
      "Live Save：开启",
      "Project Backups：开启",
      "位置：独立磁盘 / 受保护目录",
    ],
    steps: [
      "打开 Preferences → User → Project Save and Load，确认 Live Save 已开启；理解它会持续覆盖当前状态，不能替代历史版本备份。",
      "启用 Project Backups，设置短期、小时和每日保留周期，并把 Project backup location 指向与项目数据库不同的可写磁盘或受保护目录。",
      "等待至少一次备份周期后，在 Project Manager 右键项目并打开 Project Backups，确认列表包含准确时间；重大结构修改前另做 Save As 或导出 DRP。",
      "选择一份备份恢复为独立项目，不覆盖当前工作版本；打开后抽查时间线数量、最近剪辑、节点、字幕、音频和关键设置。",
      "记录恢复时间点、备份路径、Resolve 版本与缺失资产；再确认媒体、Gallery Stills、LUT、插件和外部字体有独立备份或归档。",
    ],
    checks: [
      "Live Save 与 Project Backups 均启用且备份位置可写",
      "备份列表包含预期时间点，并成功恢复为可打开的独立项目",
      "项目数据库之外的媒体、Stills、LUT、插件和字体有单独保护",
    ],
    pitfall:
      "Live Save 只保护最新状态，也会立即保存误删；Project Backups 不是完整媒体归档，没做恢复演练的备份仍不能证明可用。",
  },
  {
    id: "edit-keyboard-preset-conflict-qc",
    category: "剪辑 · 快捷键",
    level: "进阶",
    estimatedMinutes: 12,
    prerequisite: "已有一条可用于测试分割、标记、撤销和波纹删除的练习时间线。",
    title: "复制键盘预设、解决冲突并导出备份",
    goal: "在不破坏默认键位的前提下，为高频剪辑动作建立可迁移、可验证的自定义快捷键。",
    scenario:
      "从其他剪辑软件迁移，或 Split、Ripple、Marker 等高频命令需要更顺手的键位。",
    settings: [
      "入口：DaVinci Resolve → Keyboard Customization",
      "原则：从现有预设另存副本",
      "范围：先改 3–5 个高频命令",
      "备份：Export Preset",
    ],
    steps: [
      "打开 Keyboard Customization，选择最接近习惯的预设并另存为新名称，不直接修改默认预设。",
      "搜索 Split Clip、Add Marker、Ripple Delete 等实际高频命令，逐个按下候选组合并查看当前占用与页面上下文。",
      "遇到冲突时先确认原命令是否仍需要；只替换明确不用的映射，避免同一操作在 Edit、Cut 或 Fairlight 页面失效。",
      "保存后在测试时间线连续完成播放、分割、标记、撤销和波纹删除，再导出键盘预设并记录 Resolve 版本。",
    ],
    checks: [
      "默认预设未被覆盖且自定义预设可切换",
      "每个新键位在目标页面执行正确且无意外冲突",
      "导出的预设可重新导入并恢复相同映射",
    ],
    pitfall:
      "一次照搬整套网络键位会隐藏上下文冲突；先迁移少量高频命令并在真实时间线验证。",
  },
  {
    id: "edit-replace-edit-playhead-sync-qc",
    category: "剪辑 · 镜头替换",
    level: "进阶",
    estimatedMinutes: 12,
    prerequisite:
      "时间线已有待替换整镜，素材箱中有包含相同动作或同步点的候选镜头。",
    title: "用双播放头完成 Replace Edit 并保持时间线长度",
    goal: "按动作同步点替换整条时间线镜头，同时保留目标镜头的时长和后续剪辑结构。",
    scenario:
      "粗剪节奏已锁定，但需要把失焦、重复或构图较弱的镜头替换成同动作的更好版本。",
    settings: [
      "页面：Edit",
      "对齐：Source Viewer 与 Timeline Viewer 播放头",
      "目标：整条时间线片段",
      "音频：替换前确认 Track Destination",
    ],
    steps: [
      "复制时间线并记录替换前总时长；在目标镜头找到动作峰值或同步帧，把时间线播放头停在该帧。",
      "在 Source Viewer 打开候选素材，找到同一动作相位并停住源播放头；Replace Edit 会忽略源 In/Out，必须依靠两个播放头对齐。",
      "确认目标轨道、整条时间线片段和音频 Track Destination，执行 Replace；需要只换画面时先关闭对应音频目标。",
      "比较替换前后片段边界、总时长、动作连续性、连接素材、转场和声音；发现错位立即撤销并重设两个播放头。",
    ],
    checks: [
      "替换后时间线总时长与后续剪辑点保持不变",
      "动作同步点对齐且没有意外替换音频",
      "连接素材、转场、字幕与后续节奏均未错位",
    ],
    pitfall:
      "Replace Edit 不按普通三点剪辑使用源 In/Out；两个播放头或 Track Destination 错误会把正确素材替到错误相位或声道。",
  },
  {
    id: "color-iphone-hdr-managed-sdr-hlg-qc",
    category: "调色 · iPhone HDR",
    level: "进阶",
    estimatedMinutes: 15,
    prerequisite:
      "有一段 iPhone HDR 原片，并能查看文件色彩标签、10-bit 信息与拍摄设置。",
    title: "识别 iPhone HDR 标签并分别验证 SDR 与 HLG 输出",
    goal: "让 iPhone HDR 素材只经过一次正确输入与输出转换，避免发灰、过曝、二次变换或仅改标签。",
    scenario:
      "iPhone Dolby Vision/HDR 与普通 Rec.709 素材混剪，需要交付 YouTube HDR 或兼容性更高的 SDR 版本。",
    settings: [
      "输入：按文件标签与拍摄设置确认，不凭 Viewer 猜测",
      "工作空间：DaVinci Wide Gamut / Intermediate",
      "SDR 输出：Rec.709 Gamma 2.4",
      "HDR 输出：Rec.2020 HLG（仅在真实 HLG 流程中）",
    ],
    steps: [
      "复制项目，用 MediaInfo/ffprobe、Clip Attributes 和拍摄设置核对原片的色域、传递函数、位深与帧率；先排除被社交软件转码的副本。",
      "启用 Resolve Color Management，把 Timeline 设为 DaVinci Wide Gamut / Intermediate；按实际标签设置 Input Color Space，不再叠加重复 CST 或技术 LUT。",
      "复制时间线分别建立 SDR 与 HLG 版本：SDR 使用 Rec.709 Gamma 2.4 输出并检查 Tone Mapping；HLG 仅在 HDR 监看与交付条件成立时使用 Rec.2020 HLG。",
      "在 Waveform/HDR Scopes 检查肤色、普通白、天空和灯光高光；分别导出短测试，用支持对应色彩空间的播放器与文件检查工具验证像素和标签。",
    ],
    checks: [
      "输入解释来自原片标签与拍摄证据，且只发生一次技术转换",
      "SDR 无发灰、过曝或高光硬截，HLG 在 HDR 设备上层级自然",
      "两份导出文件的位深、色域、传递函数与目标交付一致",
    ],
    pitfall:
      "iPhone HDR、Apple Log 和普通 SDR 不是同一种输入；仅靠降低曝光或修改输出标签不能把错误解释的素材变成正确 SDR/HDR。",
  },
  {
    id: "media-vfr-cfr-sync-transcode-qc",
    category: "媒体 · 手机可变帧率",
    level: "进阶",
    estimatedMinutes: 15,
    prerequisite:
      "有一段手机或录屏长素材，以及可对照口型、拍板或波形的同步参考。",
    title: "诊断 VFR 漂移并只转码有问题的素材",
    goal: "区分预览卡顿、外录时钟漂移与可变帧率问题，只在证据成立时生成恒定帧率中间片。",
    scenario:
      "手机、屏幕录制或会议软件素材开头同步，播放数分钟后口型逐渐偏移，或代理与原片剪辑点不一致。",
    settings: [
      "检查：MediaInfo Frame Rate Mode",
      "复核：ffprobe r_frame_rate / avg_frame_rate / duration",
      "目标帧率：按最终时间线选择 25 / 29.97 / 30 / 50 / 59.94 / 60",
      "音频：48 kHz，并保留相机原片",
    ],
    steps: [
      "在导入前用 MediaInfo 查看 Frame Rate Mode，再用 ffprobe 对照 r_frame_rate、avg_frame_rate、time_base 和音视频 duration；单一字段不同不直接判定故障。",
      "把原片放入测试时间线，在开头、中段和结尾检查口型、拍板或波形；关闭代理再复测，区分播放掉帧、设备时钟漂移和真实时间基异常。",
      "原片全程同步时直接保留，不为“可能有 VFR”批量转码；确认漂移或逐帧定位不稳定时，用可靠转码器生成与目标时间线一致的 CFR 中间片、48 kHz 音频。",
      "把 CFR 文件作为独立媒体导入并重新同步，不覆盖原片；对 HDR/10-bit 素材同时核对位深、色域和传递函数，再比较首、中、尾与导出测试段。",
    ],
    checks: [
      "VFR 判断同时有元数据和长片段同步证据",
      "CFR 中间片首、中、尾同步且帧步进稳定",
      "原片保留，HDR/10-bit 与音频采样率没有在转码中意外丢失",
    ],
    pitfall:
      "代理、Render Cache 和 Timeline Frame Rate 不能自动修复源文件时间基；盲目改 Clip Attributes 帧率还会改变播放速度。",
  },
  {
    id: "deliver-render-failure-range-isolation-qc",
    category: "交付 · 渲染故障",
    level: "质检",
    estimatedMinutes: 15,
    prerequisite:
      "渲染队列能复现失败，并保留失败提示、帧号、时间码或进度百分比。",
    title: "用范围二分定位渲染失败的素材或效果",
    goal: "把整片渲染失败缩小到可复现的时间范围，再逐层判断源媒体、Fusion、调色、插件、缓存或写盘问题。",
    scenario:
      "Deliver 渲染固定停在某一帧、某个百分比，或只在完整分辨率与最终编码下失败。",
    settings: [
      "证据：错误文本 + 帧号/时间码 + 进度",
      "范围：失败点前后各 5–10 秒",
      "隔离：Bypass Color and Fusion Effects",
      "目标：本地可写磁盘 + 中间编码测试",
    ],
    steps: [
      "复制时间线，保存失败弹窗、Render Job 日志、帧号或时间码；先检查输出磁盘空间、路径权限、文件名和离线媒体。",
      "在疑似位置前后设置 In/Out，只渲染 5–10 秒；若仍失败，把范围对半缩小，直到定位到单个片段、转场或叠加层。",
      "在该范围依次旁路 Color/Fusion、第三方插件、降噪和速度处理，每次只改变一类；必要时重新导入源文件、删除该范围缓存或 Render in Place。",
      "先用可靠中间编码输出并重新导入验证，再恢复最终编码渲染完整时间线；回读成片并检查失败点前后、音画同步和文件元数据。",
    ],
    checks: [
      "失败能稳定复现在最小范围并对应明确素材或处理层",
      "修复后代表范围与完整时间线均成功渲染",
      "最终文件已重新导入或独立播放，失败点附近无黑帧、冻结或音频缺口",
    ],
    pitfall:
      "一次关闭所有效果或直接降低整片质量只能绕过问题，不能证明根因；删除缓存前也要保留原工程和可复现证据。",
  },
  {
    id: "deliver-review-copy-data-burnin-qc",
    category: "交付 · 审片副本",
    level: "质检",
    estimatedMinutes: 12,
    prerequisite: "画面版本已可供审阅，并已确定版本号、审片人和反馈截止时间。",
    title: "用 Data Burn-In 导出可精确反馈的审片副本",
    goal: "让审片人用画面内时间码、文件名和版本状态准确定位问题，同时防止审片文件被误当最终母版。",
    scenario:
      "把剪辑、调色或字幕版本发给客户与协作者，需要收集逐帧反馈但不交付干净母版。",
    settings: [
      "入口：Workspace → Data Burn-In",
      "显示：Record Timecode + Custom Text",
      "状态：REVIEW / NOT FOR DISTRIBUTION",
      "输出：低码率副本，文件名含日期与版本号",
    ],
    steps: [
      "复制 Deliver Preset，在 Data Burn-In 开启 Record Timecode，并用 Custom Text 写项目名、版本号和 REVIEW / NOT FOR DISTRIBUTION。",
      "把文字放入安全区，使用半透明底与可读字号；抽查浅色、深色、字幕和人脸画面，避免覆盖关键内容。",
      "在 Deliver Advanced Settings 确认 Data burn-in 使用当前项目设置，导出明确命名的低码率 Review Copy，不覆盖无水印母版。",
      "重新导入审片文件，核对首帧时间码、版本文字和总时长；反馈表统一使用画面内 Record Timecode，并保留该副本直到修改闭环。",
    ],
    checks: [
      "每一帧均显示连续可读的 Record Timecode 与明确版本状态",
      "水印不遮挡字幕、人物和关键画面，文件名与画面版本一致",
      "审片副本与干净母版分开保存且不会被误交付",
    ],
    pitfall:
      "Viewer 里看到 Data Burn-In 不代表 Deliver 一定写入；审片副本的低码率、时间码和水印也不能出现在最终母版。",
  },
  {
    id: "edit-review-feedback-marker-status-qc",
    category: "质检 · 审片反馈",
    level: "质检",
    estimatedMinutes: 14,
    prerequisite:
      "已有带版本号和 Record Timecode 的审片副本，以及按时间码整理的反馈清单。",
    title: "把审片反馈转成彩色标记并完成清零复核",
    goal: "让每条外部反馈在时间线上拥有位置、问题、期望与状态，并在交付前证明待办已清零。",
    scenario:
      "客户、导演或协作者返回多条画面、声音、字幕和节奏修改，需要防止漏改、错改版本或口头完成。",
    settings: [
      "黄色：待处理",
      "红色：阻塞 / 需确认",
      "绿色：已修改并复核",
      "名称：编号 + 部门 + 动作；Notes 写原反馈与期望",
    ],
    steps: [
      "复制时间线并核对审片文件版本；按反馈 Record Timecode 跳转，在时间线标尺按 M 建立 Marker，不把标记绑到可能被替换的单个片段。",
      "Marker 名称统一写“编号｜画面/声音/字幕｜动作”，Notes 粘贴原反馈和验收期望；初始用黄色，信息不完整或互相冲突改红。",
      "在 Edit Index → Markers 按颜色和 Notes 过滤，逐条修改；完成后从标记前后各五秒回放，只有通过复核才改绿。",
      "导出新 Review Copy 后按绿色标记重新抽查，并确认黄色、红色均为零；保留旧时间线和原反馈清单，不删除审计轨迹。",
    ],
    checks: [
      "每条反馈均对应正确时间码、明确动作和原始 Notes",
      "绿色只代表修改后已回放复核，黄色与红色在交付前清零",
      "新审片副本、时间线版本与反馈清单可一一对应",
    ],
    pitfall:
      "只把标记改绿、没有回放修改点不算完成；片段 Marker 还可能随剪辑移动，审片反馈默认更适合放在时间线标尺。",
  },
  {
    id: "fairlight-clipped-audio-backup-adr-qc",
    category: "声音 · 削波修复",
    level: "进阶",
    estimatedMinutes: 14,
    prerequisite:
      "已保留相机原声、外录文件或可重录对白，并能在 Fairlight 单独监听问题片段。",
    title: "识别源削波，优先切换备份声道或重录对白",
    goal: "先确认失真是否已写入源文件，再用干净声道、外录或 ADR 替换，避免把降噪误当作 De-clip。",
    scenario: "对白出现爆裂、扁平峰值或持续失真，降低音量后仍然刺耳。",
    settings: [
      "诊断：Solo 问题片段 + Clip Gain 降低 6–12 dB",
      "备份：Clip Attributes → Audio 切换干净声道",
      "替代：外录同步或 Fairlight ADR",
      "验收：等响度 A/B + 独立文件回放",
    ],
    steps: [
      "复制时间线并保留原音轨；在 Fairlight Solo 问题片段，先把 Clip Gain 降低 6–12 dB，再看波形与电平表：若失真仍在或波峰被削平，记录为源文件削波。",
      "打开 Clip Attributes → Audio 检查相机双声道或安全声道，优先启用未削波的组件；有外录文件时按拍板、波形或时间码同步，并逐段核对口型。",
      "只有短促且不影响语义的爆点，才在复制片段上尝试外部修复或用相邻环境声与短交叉淡化遮盖；始终保留静音原片，不覆盖源媒体。",
      "关键对白无法恢复时录制 ADR 或替代旁白，匹配距离、房间声和响度；最后做等响度 A/B，导出问题点前后十秒并在独立播放器复核。",
    ],
    checks: [
      "降低 Clip Gain 后仍存在的源削波已与单纯过响区分",
      "替代声道、外录或 ADR 与口型、环境声和相位连续",
      "原音保留可回退，测试导出无新增爆点且对白可懂",
    ],
    pitfall:
      "Noise Reduction、Dialogue Leveler 或降低推子只能改变噪声与播放电平，不能重建已经被源文件削掉的波形。",
  },
  {
    id: "fairlight-multimic-phase-cancellation-qc",
    category: "声音 · 多麦相位",
    level: "进阶",
    estimatedMinutes: 14,
    prerequisite: "同一对白至少有两支麦克风或相机参考声，并已完成基础同步。",
    title: "用 Solo 与波形对齐排查多麦相位抵消",
    goal: "区分电平问题与多麦时间差造成的空心、低频消失，并决定对齐、择一或分段切换。",
    scenario:
      "领夹麦、机顶麦或外录单独听都正常，同时播放却变薄、发飘或位置不稳定。",
    settings: [
      "诊断：逐轨 Solo → 两轨同时播放",
      "对齐：放大波形并匹配共同瞬态",
      "优先级：主麦为主，备份麦仅补缺口",
      "验收：Mono + 耳机 + 扬声器",
    ],
    steps: [
      "复制时间线，关闭总线处理并逐轨 Solo；记录每支麦克风单独听的音色，再同时播放，确认空心感或低频下降只在叠加时出现。",
      "找到拍手、爆破辅音或其他共同瞬态，水平放大波形；把复制的备份轨上下叠放查看透明波形，水平移动至主要峰值重合后再放回原轨。",
      "从开头、中段和结尾各检查一次；若对齐只在局部成立，说明距离或设备时钟持续变化，不强行全程叠加，改为主麦独用、备份麦只补坏句并加短淡化。",
      "分别用 Stereo 与 Mono 回听，恢复必要的处理后导出代表段；在耳机、手机扬声器和独立播放器确认对白没有突然变薄、漂移或重复回声。",
    ],
    checks: [
      "每支麦单独与叠加状态均已比较，问题不是误判为 EQ 不足",
      "开头、中段和结尾的同步状态已检查，未用单点对齐证明全段可靠",
      "Mono 折叠与导出文件中对白仍居中、结实且无梳状滤波感",
    ],
    pitfall:
      "把两支相距不同的麦克风永久一起推高，或只靠 EQ 补回被抵消的低频，会让相位问题随人物移动不断变化；多数对白应选择一支主麦。",
  },
  {
    id: "color-gradient-banding-source-grade-export-qc",
    category: "调色 · 色带修复",
    level: "进阶",
    estimatedMinutes: 15,
    prerequisite:
      "有包含天空、雾、墙面或暗部渐变的代表镜头，并能导出高质量中间文件。",
    title: "区分源素材、调色与压缩造成的渐变色带",
    goal: "定位色带产生环节，用克制调色和细微纹理掩饰断层，并用高位深母版判断是否仅为上传压缩问题。",
    scenario:
      "平滑天空、雾气或暗部出现一圈圈阶梯，Viewer、母版与上传版本的严重程度不一致。",
    settings: [
      "检查：100% Viewer + Bypass Color Grades",
      "处理：降低过强对比、降噪与饱和度分离",
      "纹理：Film Grain（Studio，可用时少量）",
      "母版：10-bit 或更高质量中间编码",
    ],
    steps: [
      "复制调色版本，在 100% Viewer 检查原片并旁路全部 Color Grades；原片已有阶梯记为采集限制，旁路后消失则逐节点启用，找出制造断层的对比、曲线、饱和度或重度降噪节点。",
      "先减弱问题节点并扩大调整过渡，避免在低位深素材上拉出极陡曲线；检查 Temporal/Spatial NR 是否把自然噪声抹掉后暴露色阶，不用锐化补偿断层。",
      "仍可见但细节已无法恢复时，在单独末端节点少量加入 Film Grain（Studio 可用时），只让静止渐变不再呈现规则环带；逐帧检查天空、肤色和压缩噪声，免费版保持自然源噪声并跳过此步。",
      "导出 10–20 秒高质量 10-bit 或更高位深母版和最终上传编码，重新导入并以同一显示器 100% 对比；只有上传版变差时提高交付码率或保留母版，不反复破坏调色。",
    ],
    checks: [
      "已明确色带来自原片、具体调色节点还是最终压缩",
      "纹理处理没有污染肤色、平面图形或制造跳动噪点",
      "高质量母版与上传编码分别复核，位深和色彩标签符合目标",
    ],
    pitfall:
      "Film Grain 只能打散规则色阶，不能恢复源文件未记录的颜色；重度模糊、降噪或连续转码还会进一步减少渐变层次。",
  },
  {
    id: "color-moire-window-blur-track-qc",
    category: "调色 · 摩尔纹修复",
    level: "进阶",
    estimatedMinutes: 15,
    prerequisite: "有衣物、栅栏、屋顶或屏幕细纹产生彩色波纹的代表镜头。",
    title: "用 Power Window 局部抑制摩尔纹并跟踪复核",
    goal: "确认摩尔纹不是缩放预览假象，只柔化问题纹理而不损伤人脸和整幅画面。",
    scenario: "细密衣物、栅栏或建筑纹理出现移动的彩色波浪、闪烁或锯齿。",
    settings: [
      "诊断：100% Viewer + 高质量短段导出",
      "隔离：Serial Node + Power Window",
      "处理：少量 Blur / 降低局部饱和度",
      "跟踪：Window Tracker + 逐帧抽查",
    ],
    steps: [
      "复制调色版本，在 100% Viewer 查看原片并导出 5–10 秒高质量测试；若只有 Fit 缩放预览出现波纹，先解决监看缩放，不对素材做破坏性修复。",
      "在 Color 页新建 Serial Node，用柔边 Power Window 只包住细纹区域，避开眼睛、嘴唇、头发和需要保留的文字边缘；用 Tracker 跟随人物或物体运动。",
      "在该节点少量增加 Blur Radius，并只在彩色条纹明显时轻降饱和度；反复旁路节点，以“波纹不再抢眼但织物仍有质感”为停止线。",
      "检查镜头开头、中段、结尾和运动最快帧，修正 Window 漂移；缓存后导出目标编码，在 100% 与正常观看尺寸复核闪烁、肤色和压缩锯齿。",
    ],
    checks: [
      "已通过 100% Viewer 与测试导出排除单纯预览缩放假象",
      "Power Window 全程覆盖问题纹理且没有扫过脸部或文字",
      "摩尔纹减弱但主体细节未被大面积涂抹，最终编码无新增闪烁",
    ],
    pitfall:
      "摩尔纹来自采样冲突，后期通常只能减轻；对整幅画面重度模糊、锐化或降噪会牺牲真实细节，并可能让移动条纹更明显。",
  },
  {
    id: "edit-horizon-level-rotate-safe-crop-qc",
    category: "剪辑 · 地平线校正",
    level: "入门",
    estimatedMinutes: 11,
    prerequisite: "镜头有可确认的真实水平或垂直参照，且不是刻意倾斜构图。",
    title: "用 Rotation Angle 拉平地平线并控制补边裁切",
    goal: "校正轻微倾斜镜头，同时避免黑边、过度放大和主体被裁掉。",
    scenario: "风景、道路、建筑或车内镜头因机位偏斜导致地平线或垂直线不正。",
    settings: [
      "入口：Edit → Inspector → Transform",
      "旋转：Rotation Angle 小幅调整",
      "补边：Zoom 只增加到刚好覆盖",
      "验收：横屏、竖屏与安全区分别检查",
    ],
    steps: [
      "复制时间线，在 Viewer 选择可靠参照：远处地平线、静止建筑垂直线或道路消失点；先确认镜头不是道路坡度、广角透视或有意 Dutch Angle。",
      "选中片段，在 Inspector → Transform 小幅调整 Rotation Angle；用 Viewer 网格或安全区辅助，但以真实场景参照为准，不凭画框边缘猜测。",
      "旋转后只增加足够覆盖四角的 Zoom，并用 Position 重新安排主体；检查字幕、人脸、路牌和画面边缘，必要时保留轻微倾斜而不是过度裁切。",
      "播放完整镜头确认水平线没有因相机运动漂移；分别在目标横屏和竖屏时间线查看安全区，导出短段检查四角黑边、清晰度与构图。",
    ],
    checks: [
      "旋转依据真实水平或垂直参照，不是透视或坡度误判",
      "四角无黑边，Zoom 与 Position 没有裁掉关键主体和文字",
      "完整播放与横竖屏导出中构图稳定、清晰度可接受",
    ],
    pitfall:
      "Rotation Angle 只能校正整体倾斜，不能修复广角透视、滚动快门或随时间变化的机位摆动；为拉平而大幅放大会明显损失分辨率。",
  },
  {
    id: "color-chromatic-fringe-qualifier-window-qc",
    category: "调色 · 镜头色差",
    level: "进阶",
    estimatedMinutes: 15,
    prerequisite:
      "高反差边缘存在稳定紫边、绿边或青边，并能在 Viewer 100% 检查原片。",
    title: "用 Qualifier 与 Window 局部减轻镜头紫边",
    goal: "只压低高反差边缘的异常颜色，不误伤霓虹、花草、衣物和正常肤色。",
    scenario:
      "逆光树枝、车身高光、建筑轮廓或镜片边缘出现紫色、绿色或青色细线。",
    settings: [
      "诊断：100% Viewer + 旁路 Sharpen/Midtone Detail",
      "隔离：HSL Qualifier + Power Window",
      "处理：局部 Saturation / Blur 小幅调整",
      "验收：Highlight Matte + 目标编码测试",
    ],
    steps: [
      "复制调色版本，在 Viewer 100% 查看原片并旁路 Sharpen、Midtone Detail、Glow 和高反差节点；若边缘颜色随这些节点消失，先减弱制造光晕的处理，不把它误判为镜头色差。",
      "新建 Serial Node，用 HSL Qualifier 取样紫边或绿边，再用柔边 Power Window 限制到问题轮廓；开启 Highlight 查看 Matte，排除脸、天空、花草和有意彩色物体。",
      "在该节点小幅降低 Saturation，必要时只增加极少 Blur Radius；反复旁路比较，以异常色线不抢眼、真实边缘仍清楚为停止线。",
      "跟踪 Window 并检查镜头开头、中段、结尾和最强反光帧；导出 5–10 秒目标编码，在 100% 和正常观看距离复核边缘、肤色与压缩色块。",
    ],
    checks: [
      "已区分镜头色差与锐化、Glow 或压缩产生的彩色光晕",
      "Qualifier Matte 只覆盖问题边缘，没有误选正常彩色主体",
      "紫边或绿边减弱，真实轮廓、肤色和高光细节仍自然",
    ],
    pitfall:
      "全局降低紫色或绿色饱和度会破坏真实物体；严重轴向色差、失焦或高光剪切无法靠局部降饱和恢复，必要时应换镜头。",
  },
  {
    id: "color-auto-exposure-pump-dynamic-keyframes-qc",
    category: "调色 · 曝光跳变",
    level: "进阶",
    estimatedMinutes: 15,
    prerequisite:
      "镜头存在缓慢整体亮度变化，且能用 Waveform 区分曝光泵动与周期性灯光频闪。",
    title: "用 Dynamic Keyframes 平滑自动曝光泵动",
    goal: "抵消相机自动曝光造成的整体亮度起伏，同时保留真实进入阴影或迎向光源的变化。",
    scenario:
      "行车、走拍或人物经过窗户时，相机自动曝光突然压暗天空或抬亮暗部。",
    settings: [
      "诊断：Waveform + 全画面亮度变化",
      "节点：独立 Serial Node“Exposure Smooth”",
      "动画：Color Page → Keyframes → Dynamic Keyframes",
      "调整：Offset / Global 小幅反向补偿",
    ],
    steps: [
      "复制调色版本，播放镜头并观察 Waveform；整体信号在数帧到数秒内一起上下移动才按自动曝光泵动处理，规则明暗交替、局部灯带或快门条纹应转到去频闪流程。",
      "新建独立 Serial Node 并命名 Exposure Smooth，在 Color 页打开 Keyframes Editor；在亮度变化开始前与稳定后为该 Corrector 建立 Dynamic Keyframes。",
      "移动到最暗或最亮位置，用 Offset 或 Global 小幅反向补偿，让 Waveform 的中间调与参考段连续；增加前后缓冲关键帧，避免把自然进入隧道、树荫或逆光的变化完全抹平。",
      "循环播放并用旁路比较亮度呼吸、肤色和高光；导出代表段，在目标显示器检查是否出现新闪变、黑位漂移、剪切高光或关键帧顿挫。",
    ],
    checks: [
      "已用 Waveform 区分自动曝光泵动、真实光线变化和灯光频闪",
      "Dynamic Keyframes 过渡连续，没有把自然明暗变化拉成固定亮度",
      "导出文件中中间调稳定，高光、黑位和肤色没有新增跳变",
    ],
    pitfall:
      "关键帧只能平滑已记录的曝光变化，不能恢复剪切高光或压死黑位；逐帧补偿会制造新的闪烁，应使用尽量少的控制点。",
  },
  {
    id: "edit-lens-correction-straight-line-qc",
    category: "修复 · 镜头畸变",
    level: "进阶",
    estimatedMinutes: 12,
    prerequisite:
      "广角镜头边缘的建筑线、门框或地平线明显弯曲，并已排除机位倾斜、滚动快门和画面本身的曲线。",
    title: "用 Lens Correction 校正广角弯曲并控制裁切",
    goal: "减轻桶形或枕形畸变，同时避免把人物、车辆和画面边缘拉伸得更不自然。",
    scenario:
      "运动相机、超广角或车内镜头让靠近画面边缘的直线向外鼓起或向内收缩。",
    settings: [
      "诊断：Viewer 网格 + 可靠直线",
      "入口：Edit → Inspector → Lens Correction",
      "调整：Analyze 或 Distortion 小幅修正",
      "验收：100% Viewer + 目标分辨率测试",
    ],
    steps: [
      "复制时间线并在代表帧打开 Viewer 网格，选择门框、建筑边缘或其他本应笔直的参照；若整幅只是在旋转、运动中倾斜或出现果冻，应转到地平线、稳定或滚动快门流程。",
      "选中片段，在 Edit 页 Inspector 展开 Lens Correction；素材元数据可识别时先运行 Analyze，否则从中性值开始小幅调整 Distortion，不凭单个人脸或树木判断。",
      "对比画面中心与四角，逐步降低修正强度，直到主要直线自然且人物、车轮和边缘物体没有异常变宽；仅增加刚好隐藏空白边缘的 Zoom 或 Crop。",
      "播放镜头开头、中段和结尾，并导出 5–10 秒目标分辨率测试；在 100% 和正常观看距离检查直线、四角、清晰度与构图后再应用到同镜头素材。",
    ],
    checks: [
      "已区分镜头畸变、机位倾斜、透视汇聚和滚动快门",
      "主要直线更自然，人物、车辆和边缘物体没有明显拉伸",
      "测试导出无空白边缘，裁切量和清晰度仍可接受",
    ],
    pitfall:
      "Lens Correction 不能恢复超出画面的内容，也不能消除正常透视；畸变很轻时保留原貌通常比过度拉直和放大更自然。",
  },
  {
    id: "edit-rolling-shutter-diagnosis-handoff-qc",
    category: "修复 · 滚动快门",
    level: "谨慎使用",
    estimatedMinutes: 13,
    prerequisite:
      "快速摇移、车辆振动或高速主体让垂直线随时间倾斜、画面像果冻摆动，并已保留未经稳定的原始片段。",
    title: "先区分滚动快门与抖动，再验证工具或转交",
    goal: "避免用 Stabilization 强行修复逐行扫描造成的几何变形，并为可修片段与不可救片段建立停止线。",
    scenario:
      "车载、手持或快速摇摄镜头中，灯杆和建筑线来回倾斜，整幅画面呈现波浪状果冻感。",
    settings: [
      "诊断：逐帧检查直线形状变化",
      "隔离：Blade / Split 只保留问题区间",
      "能力门槛：当前安装中明确标注 Rolling Shutter 的工具",
      "验收：旁路 A/B + 目标编码测试",
    ],
    steps: [
      "复制时间线并关闭 Stabilization、Lens Correction 与速度效果；逐帧观察门框、灯杆和画面四角，只有形状随运动倾斜或波动才按滚动快门处理，单纯位移、旋转和模糊分别属于抖动与运动模糊。",
      "用 Blade 隔离最短问题区间；在当前 Resolve 版本与已安装效果中搜索明确的 Rolling Shutter 修复，只有真实存在且可旁路时才在副本从最低强度测试，不把 Stabilization 或 Camera Shake 当成等价工具。",
      "若没有专用修复，先尝试替换机位、缩短问题镜头或用 B-roll 覆盖；必须保留时导出原片区间与时间码，转交具备滚动快门模型的 VFX 流程，不覆盖相机源文件。",
      "对任何修复完整播放并逐帧抽查，比较直线、人物比例、边缘拉伸和裁切；导出 5–10 秒目标编码，若新增波纹、局部扭曲或画质损失比原问题更明显就撤销。",
    ],
    checks: [
      "已区分滚动快门、普通抖动、运动模糊和镜头畸变",
      "没有把 Stabilization 或模拟 Camera Shake 错当作滚动快门修复",
      "测试导出无新增波纹和拉伸，无法可靠修复的片段已替换或带时间码转交",
    ],
    pitfall:
      "严重逐行形变和局部闪光发生在采集阶段，后期无法重建同一时刻的完整几何；过强稳定往往会叠加新的边缘扭曲。",
  },
  {
    id: "color-mixed-light-power-window-track-qc",
    category: "调色 · 混合光",
    level: "进阶",
    estimatedMinutes: 14,
    prerequisite:
      "镜头已完成输入色彩管理与基础曝光校正，且能确认偏色只来自窗光、顶灯或墙面反射的局部区域。",
    title: "用柔边 Power Window 平衡局部混合光",
    goal: "减轻同一镜头内冷窗光、暖灯和绿色反射造成的局部色温冲突，同时保留现场合理的光源差异。",
    scenario:
      "人物靠近窗户、车内经过树荫或室内同时存在日光与灯光，脸部两侧出现不同色温或 Tint。",
    settings: [
      "基础：先做全局曝光与主白平衡",
      "隔离：独立 Serial Node + Gradient / Curve Window",
      "调整：Temp / Tint / Offset 小幅修正",
      "跟踪：Window Tracker + 逐段复核",
    ],
    steps: [
      "复制调色版本，先在基础节点用 RGB Parade、中性物与现场记忆确定主光源白平衡；不要让局部窗光或彩色墙面左右整幅画面的 Temperature 与 Tint。",
      "新建 Serial Node 并命名 Mixed Light，用 Gradient 或 Curve Power Window 覆盖偏色区域，扩大 Softness 让过渡跨越足够宽的自然光照范围，开启 Highlight 检查边界。",
      "在窗口内小幅调整 Temp、Tint 或 Offset，让肤色和中性物更连续；反复旁路并检查窗口内外，不把冷窗光、暖灯或霓虹的合理氛围全部校成同一种颜色。",
      "用 Window Tracker 跟随相机或人物运动，逐帧检查遮挡和出画位置；导出 5–10 秒测试，在肤色、白墙、阴影与压缩边界上确认没有色块、漂移和明显蒙版接缝。",
    ],
    checks: [
      "全局节点负责主白平衡，局部节点只处理明确的混合光区域",
      "Power Window 边缘足够柔和且跟踪稳定，没有色温接缝",
      "测试导出中肤色和中性物更连续，同时保留可信的现场光源差异",
    ],
    pitfall:
      "混合光不是必须完全消除的错误；窗口过硬、校正过强或强行统一所有光源，会让人物像贴在背景上并制造新的色彩跳变。",
  },
  {
    id: "fairlight-wind-rumble-eq-replace-qc",
    category: "声音 · 风噪修复",
    level: "谨慎使用",
    estimatedMinutes: 15,
    prerequisite:
      "已保留原始录音与可用的相机声、领夹麦或外录备份，并能在耳机中定位风噪最严重的短区间。",
    title: "区分低频风噪与覆盖对白，再决定 EQ、降噪或替换",
    goal: "减轻可控的低频隆隆和间歇风冲击，同时尽早识别已经覆盖对白、无法靠后期恢复的片段。",
    scenario:
      "户外口播、车窗边收音或山顶采访出现低频轰鸣、麦克风振膜拍击和忽强忽弱的风声。",
    settings: [
      "诊断：Spectrogram / EQ Analyzer + 耳机",
      "顺序：Clip Gain → High-Pass / EQ → 最低有效降噪",
      "对比：Noise Only / 旁路等响度 A/B",
      "回退：备份声道 / ADR / 字幕",
    ],
    steps: [
      "复制时间线并独听每个录音来源，标记低频持续隆隆、短促风冲击和完全被覆盖的词句；先切换领夹、枪麦或外录备份，不把所有声道一起送进同一处理链。",
      "在 Fairlight 用 Clip Gain 降低个别风冲击，再在独立 EQ 中从低频端缓慢启用 High-Pass 或低架衰减；循环正常对白，停止在隆隆减轻但声音尚未明显变薄的位置。",
      "只对剩余稳定噪声添加 Noise Reduction，从最低有效量开始并监听 Noise Only；若能清楚听见字词被移除，降低强度或撤销，不再叠加 Gate、Voice Isolation 与重压缩。",
      "被风完全覆盖的关键词改用干净备份、ADR 或补录旁白，并用 Room Tone 和短淡化连接；导出问题点前后 10 秒，在耳机、手机和独立播放器检查清晰度、同步与抽吸。",
    ],
    checks: [
      "已分别标记低频隆隆、风冲击和不可恢复的被覆盖对白",
      "EQ 后对白没有明显变薄，降噪旁路比较没有水下感或抽吸",
      "无法恢复的语义已用备份、补录或字幕解决，测试导出同步自然",
    ],
    pitfall:
      "风噪与人声共享大量频率，High-Pass 和 Noise Reduction 无法重建被振膜拍击覆盖的字词；处理更重不等于信息更多。",
  },
  {
    id: "edit-interview-static-punch-in-jump-cut-qc",
    category: "剪辑 · 采访景别",
    level: "入门",
    estimatedMinutes: 12,
    prerequisite:
      "单机位采访或口播已完成内容剪辑，跳切前后人物姿态接近，且源素材分辨率留有适度重新构图空间。",
    title: "用静态 Punch-in 构造第二景别并隐藏采访跳切",
    goal: "把部分单机位素材重构为可信的紧景别，让必要跳切像主动切换机位而不是画面抽动。",
    scenario:
      "删除口误、停顿或重复句后，人物位置轻微跳变，但没有合适 B-roll 可以覆盖。",
    settings: [
      "宽景：Zoom 1.00",
      "紧景：Zoom 约 1.10–1.25",
      "构图：Position 保持眼线与头顶空间",
      "验收：Viewer 100% + 目标分辨率导出",
    ],
    steps: [
      "在跳切处前后播放并确认语义、口型和姿态连续；动作幅度过大时优先换剪辑点或使用 B-roll，不用放大掩盖明显身体跳变。",
      "保留一侧为原始宽景，选中另一侧片段，在 Edit 页 Inspector 的 Transform 中把 Zoom 静态提高到约 1.10–1.25；不要添加缩放关键帧。",
      "用 Position 重新构图，让双眼高度、视线方向和头顶空间在宽/紧景间有意连续；检查字幕、手势和画面边缘物体没有被意外裁掉。",
      "以 100% Viewer 检查脸部、头发与压缩细节，完整播放多个切点并导出测试；若紧景明显变软、每句话都切景别或节奏机械，就降低 Zoom 或改用其他覆盖方式。",
    ],
    checks: [
      "Punch-in 是静态第二景别，没有缩放动画或切点后的漂移",
      "宽景与紧景的眼线、视线和头顶空间连续，跳切不再抢眼",
      "目标分辨率导出中主体清晰，字幕、手势和构图均未被误裁",
    ],
    pitfall:
      "Punch-in 不能修复大幅姿态变化，也不应在每句之间机械交替；源素材与时间线同分辨率时，过度放大会直接暴露柔化和噪声。",
  },
  {
    id: "fairlight-room-tone-bed-dialogue-edit-qc",
    category: "声音 · 环境底声",
    level: "进阶",
    estimatedMinutes: 14,
    prerequisite:
      "对白剪辑已基本完成，并能从同一地点、同一麦克风和相近录音设置中找到没有说话与明显瞬态的干净环境底声。",
    title: "建立 Room Tone 底声轨并隐藏对白剪辑接缝",
    goal: "用连续、匹配的环境底声填补删词和补录之间的静音洞，让对白剪辑在闭眼回听时保持同一空间。",
    scenario:
      "删除口误、停顿或坏句后，接缝处突然绝对安静、底噪跳变或房间空间消失。",
    settings: [
      "来源：同地点 / 同麦克风 / 同增益",
      "轨道：独立 Mono 或 Stereo Room Tone",
      "接缝：Fade Handles / Crossfade 2–10 帧起步",
      "电平：匹配邻近对白停顿，不追求完全静音",
    ],
    steps: [
      "在 Media Pool 或原始录音中寻找 5–20 秒没有对白、脚步、鸟叫或碰撞的稳定底声，确认声道格式、麦克风位置和录音增益与目标对白一致；复制到独立 Room Tone 轨。",
      "把底声铺过问题剪辑点并延伸到前后正常停顿，先用 Clip Gain 匹配邻近对白中的自然底噪；不要 Normalize 到对白响度，也不要把立体声底声错误折成相位异常的双单声道。",
      "需要延长时从不同安静区间交替拼接，错开明显风声、空调循环和鸟鸣纹理；在每个拼接处使用短 Fade Handles 或 Crossfade，并闭眼循环回听。",
      "分别以 Stereo 与 Mono 回听整段，检查底声是否抽吸、重复、偏向一侧或盖住辅音；导出问题点前后 10 秒，在耳机、手机和独立播放器确认空间连续。",
    ],
    checks: [
      "Room Tone 来源与对白的地点、麦克风、声道格式和增益条件匹配",
      "闭眼无法轻易定位删词与补录接缝，底声没有明显循环纹理",
      "Stereo 与 Mono 测试均无相位变薄、偏声道、抽吸或辅音遮蔽",
    ],
    pitfall:
      "Room Tone 不是任意白噪声；重复极短样本、跨地点复用或把底声推得过响，会比原始静音洞更容易被听见。",
  },
  {
    id: "edit-dynamic-zoom-still-photo-qc",
    category: "动画 · 照片推拉",
    level: "入门",
    estimatedMinutes: 12,
    prerequisite: "已有高于时间线分辨率的照片或构图稳定的静止镜头。",
    title: "用 Dynamic Zoom 为静态照片制作克制推拉",
    goal: "用单一、平滑的构图变化让照片段落保持生命力，同时避免数字推拉抢过内容本身。",
    scenario: "路线地图、旧照片、证据截图或静止风景需要配合旁白持续数秒。",
    settings: [
      "入口：Inspector → Dynamic Zoom",
      "构图：Viewer Dynamic Zoom Controls",
      "运动：Ease In and Out",
      "验收：100% Viewer + 目标分辨率导出",
    ],
    steps: [
      "先按旁白需要设置照片时长，并在 100% Viewer 检查源分辨率、焦点和文字清晰度；源图不足时不靠继续放大掩盖。",
      "在 Inspector 开启 Dynamic Zoom，再从 Viewer 的 Transform Mode 打开绿色起始框与红色结束框；让两个框都保留主体、标题和安全区。",
      "只设计一次明确的推进、拉远或轻微横移，使用 Swap 校正方向并选择 Ease In and Out；避免同一短片段同时大幅缩放和横移。",
      "从前后镜头一起播放，确认运动起止不突兀、旁白重点与落点一致；以目标分辨率导出测试并检查文字、脸部和细线没有软化或抖动。",
    ],
    checks: [
      "起始框与结束框都保留主体、文字和画面安全区",
      "推拉方向、时长与旁白重点一致，起止速度自然",
      "目标分辨率导出清晰，无黑边、抖动和过度数字放大",
    ],
    pitfall:
      "Dynamic Zoom 会把裁切窗口放大到全画面；源照片余量不足、结束框过小或每张图都反向推拉，会迅速暴露柔化并产生模板感。",
  },
  {
    id: "edit-broll-place-on-top-dialogue-lock-qc",
    category: "剪辑 · B-roll 覆盖",
    level: "入门",
    estimatedMinutes: 13,
    prerequisite: "主对白已完成删词与节奏修剪，并有与叙述事实一致的补画素材。",
    title: "用 Place on Top 覆盖对白跳切并锁住主声音",
    goal: "通过三点剪辑把 B-roll 精确铺到上层轨道，不移动已锁定的对白、字幕和后续节奏。",
    scenario:
      "采访或路线说明删掉口误后出现视觉跳切，需要用细节、环境或动作镜头覆盖。",
    settings: [
      "时间线范围：I / O",
      "源范围：Source Viewer I / O",
      "编辑：Place on Top",
      "目标：V2 视频，A1 主对白连续",
    ],
    steps: [
      "复制时间线并完整听跳切前后句子，确认语义、呼吸和环境底声连续；在时间线用 I/O 标出需要覆盖的最短范围，前后多留数帧视觉余量。",
      "在 Source Viewer 选择地点、时间、天气、行驶方向和叙述内容都一致的 B-roll，设置源 In/Out；不使用会制造错误事实的漂亮镜头。",
      "确认视频目标为上层轨道且不带入无关源音频，使用 Place on Top 把素材放到主画面之上；核对时间线总时长、A1 对白、字幕和音乐点没有移动。",
      "逐帧检查覆盖首尾是否露出一帧跳切，再从前一完整句播放到后一完整句；导出问题段，在独立播放器确认方向、时空事实、声音和画面连续。",
    ],
    checks: [
      "B-roll 完整越过视觉跳切且首尾没有一帧露底",
      "A1 主对白、字幕、音乐点和时间线总时长均未改变",
      "补画与叙述的地点、时间、天气、方向和动作事实一致",
    ],
    pitfall:
      "Place on Top 只遮住下层画面，不能修复语义断裂或错误环境声；目标轨、源音频或 In/Out 设置错误还会覆盖不该动的内容。",
  },
  {
    id: "edit-before-after-split-screen-export-qc",
    category: "合成 · 前后对比",
    level: "入门",
    estimatedMinutes: 14,
    prerequisite: "已有时长、帧率和动作完全对齐的处理前与处理后片段。",
    title: "用 Crop 与 Transform 制作可交付前后对比分屏",
    goal: "把同一画面的处理前后版本并排呈现，准确展示稳定、降噪或调色差异，而不是依赖编辑器临时对照视图。",
    scenario: "教程、修复案例或客户审片需要导出 Before / After 左右对比。",
    settings: [
      "结构：Before V1 / After V2",
      "裁切：左右各 50%",
      "定位：Transform X",
      "声音：只保留一套主声音",
    ],
    steps: [
      "复制时间线，把 Before 与 After 片段上下堆叠并按同一动作帧、时间码或波形对齐；在开头、中段和结尾确认没有速度或帧率漂移。",
      "在 Inspector 对两条片段分别使用 Cropping 留出左半与右半，再用 Transform Position 对齐主体；不要非等比拉伸，也不要让中央边界重复或缺失画面。",
      "添加简洁 Before / After 标签并放在标题安全区，必要时加一条细分隔线；关闭其中一条片段的音频，只保留已通过的主混音。",
      "逐帧检查快速运动和中央边界，再以 100% Viewer 与目标编码导出回看；确认标签、同步、清晰度、颜色管理和音频都与单画面版本一致。",
    ],
    checks: [
      "Before 与 After 首、中、尾保持同帧同步且没有速度漂移",
      "左右各占 50%，中央无重叠、空缝、变形或主体错位",
      "导出文件标签可读、只含一套声音且颜色与单画面版本一致",
    ],
    pitfall:
      "Gallery Wipe 与 Color Split Screen 只是监看工具，不会自动写入成片；两条素材未同步、重复播放音频或各自经过不同输出变换都会让对比失真。",
  },
  {
    id: "edit-alpha-logo-corner-brand-master-qc",
    category: "标题 · 品牌角标",
    level: "入门",
    estimatedMinutes: 12,
    prerequisite:
      "已有经过品牌确认、带真实 Alpha 通道的高分辨率 PNG 或图形文件。",
    title: "用 Alpha Logo 制作克制品牌角标并分离母版",
    goal: "把透明品牌标识稳定放在安全区内，并保留无角标母版，避免把审片水印或错误透明边缘永久烧进唯一成片。",
    scenario: "频道长片、系列教程或授权交付需要持续或分段显示品牌 Logo。",
    settings: [
      "素材：PNG / 图形真实 Alpha",
      "结构：最高视频轨 Place on Top",
      "尺寸：短边约 4%–8% 起步",
      "位置：Title Safe 内并避开字幕",
    ],
    steps: [
      "导入 Logo 后先在黑、白和彩色背景上检查透明边缘、半透明阴影和颜色；发现白边、黑边或棋盘格已写入图片时返回源文件修复，不用 Blend Mode 猜测。",
      "把 Logo 用 Place on Top 放到最高图形轨并延长到规定范围，在 Inspector 保持等比缩放，从短边约 4%–8% 起步放入 Title Safe，避开字幕、人脸和平台按钮区。",
      "只在确有品牌规范时调整 Composite Opacity，并用短淡入淡出处理首次出现和结束；不要让角标每个镜头重复动画或随画面运动。",
      "复制交付时间线区分 Clean Master 与 Branded Master，在横屏、竖屏、黑白背景和目标编码导出中检查边缘、可读性、持续时间及是否误带审片水印。",
    ],
    checks: [
      "Logo 在黑白和彩色背景上无白边、黑边、色块或伪透明",
      "尺寸、位置、Opacity 与持续时间符合品牌规则且不遮挡字幕和主体",
      "Clean Master 与 Branded Master 独立命名，最终导出版本正确",
    ],
    pitfall:
      "棋盘格截图不是透明素材，Screen/Multiply 也不能代替正确 Alpha；只保留烧入角标的唯一母版会让后续平台和授权交付失去选择。",
  },
] as const;

export const colorFinishingSources = [
  {
    label: "Blackmagic Color 页 Power Window 与跟踪",
    url: "https://www.blackmagicdesign.com/products/davinciresolve/color",
  },
  {
    label: "Blackmagic Editors Guide 20 稳定功能边界",
    url: "https://documents.blackmagicdesign.com/UserManuals/DaVinci-Resolve-20-Editors-Guide.pdf",
  },
  {
    label: "Blackmagic Edit 页镜头校正与稳定",
    url: "https://www.blackmagicdesign.com/products/davinciresolve/edit",
  },
  {
    label: "Blackmagic Resolve 官方培训",
    url: "https://www.blackmagicdesign.com/products/davinciresolve/training",
  },
  {
    label: "官方 Colorist Guide 20",
    url: "https://documents.blackmagicdesign.com/UserManuals/DaVinci-Resolve-20-Colorist-Guide.pdf",
  },
  {
    label: "Blackmagic Fairlight 声音修复工具",
    url: "https://www.blackmagicdesign.com/products/davinciresolve/fairlight",
  },
  {
    label: "Blackmagic Scene Cut Detection 操作说明",
    url: "https://documents.blackmagicdesign.com/SupportNotes/DaVinci_Resolve_17_New_Features_Guide.pdf",
  },
  {
    label: "Blackmagic Editor's Guide 变速与定格",
    url: "https://documents.blackmagicdesign.com/UserManuals/DaVinci-Resolve-18-Editors-Guide.pdf",
  },
  {
    label: "Blackmagic Render Cache 操作指南",
    url: "https://documents.blackmagicdesign.com/UserManuals/DaVinci-Resolve-17-Beginners-Guide.pdf",
  },
  {
    label: "Blackmagic Power Window 跟踪与 Mosaic Blur 教程",
    url: "https://documents.blackmagicdesign.com/UserManuals/DaVinci-Resolve-16-Beginners-Guide.pdf",
  },
  {
    label: "Blackmagic Fusion Text+ 标题模板",
    url: "https://documents.blackmagicdesign.com/UserManuals/DaVinci-Resolve-17-Fusion-Visual-Effects.pdf",
  },
  {
    label: "Blackmagic Fairlight Dialogue Leveler",
    url: "https://documents.blackmagicdesign.com/UserManuals/DaVinci-Resolve-18-Fairlight-Audio-Post.pdf",
  },
  {
    label: "Blackmagic Shared Nodes 功能说明",
    url: "https://documents.blackmagicdesign.com/SupportNotes/DaVinci_Resolve_21_New_Features_Guide.pdf",
  },
  {
    label: "Blackmagic Dynamic Project Switching 操作说明",
    url: "https://documents.blackmagicdesign.com/SupportNotes/DaVinci_Resolve_21_New_Features_Guide.pdf",
  },
  {
    label: "Blackmagic AI IntelliCut Remove Silence",
    url: "https://documents.blackmagicdesign.com/SupportNotes/DaVinci_Resolve_20_New_Features_Guide.pdf",
  },
  {
    label: "Blackmagic Resolve 21 IntelliSearch",
    url: "https://documents.blackmagicdesign.com/SupportNotes/DaVinci_Resolve_21_New_Features_Guide.pdf",
  },
  {
    label: "Blackmagic Keyboard Customization 与预设导出",
    url: "https://www.blackmagicdesign.com/products/davinciresolve/edit",
  },
  {
    label: "Blackmagic Editor's Guide 20 Replace Edit",
    url: "https://documents.blackmagicdesign.com/UserManuals/DaVinci-Resolve-20-Editors-Guide.pdf",
  },
  {
    label: "Blackmagic 混合帧率与 Conform 设置说明",
    url: "https://documents.blackmagicdesign.com/UserManuals/DaVinci_Resolve_10_Reference_Manual.pdf",
  },
  {
    label: "Blackmagic Data Burn-In 与审片水印",
    url: "https://documents.blackmagicdesign.com/UserManuals/DaVinci-Resolve-15-Definitive-Guide.pdf",
  },
] as const;

export const resolvePracticalTutorials = [
  {
    id: "marker-cross-dissolve",
    category: "剪辑 · 入门必做",
    level: "入门",
    estimatedMinutes: 8,
    prerequisite:
      "会在 Edit 页移动播放头，并准备两个构图接近且各有余量的镜头。",
    title: "先打标记，再建立剪辑点并添加交叉叠化",
    goal: "在想要过渡的位置留下判断依据，并把标记变成真正可承载转场的剪辑点。",
    scenario: "同一路段由白天进入傍晚，或两个构图接近的稳定镜头需要柔和衔接。",
    settings: [
      "标记：M",
      "切开：Command/Ctrl + B",
      "交叉叠化：6–12 帧起步",
      "回看：剪辑点前后各 3–5 秒",
    ],
    steps: [
      "在 Edit 页播放时间线；看到适合过渡的构图、动作或光线变化时按 M，在标记名称中写明目的，例如“同构图转傍晚”。",
      "把播放头吸附到标记。若标记位于一条长素材内部，先用 Blade Edit Mode 或 Command/Ctrl + B 切开；标记本身不是剪辑点。",
      "确认切口两侧都有可用余量（handles）。打开 Effects Library → Video Transitions，把 Cross Dissolve 拖到剪辑点中央。",
      "先设 6–12 帧并播放；根据运动速度微调持续时间和对齐方式，不要用长叠化掩盖构图或曝光不匹配。",
      "完成后给标记改名或改色为“已处理”，再检查叠化期间是否出现停帧、重影、亮度下陷或穿帮。",
    ],
    checks: [
      "转场横跨真实剪辑点，而不是只停在标记上",
      "两侧均有余量，转场中没有重复帧或静帧",
      "叠化服务于时间、地点或情绪变化，画面主体没有明显双影",
    ],
    pitfall:
      "若 Resolve 只把转场放在片段开头/结尾，或提示素材不足，先修剪两侧各留出数帧余量；不要强行拉长。",
  },
  {
    id: "marker-match-cut",
    category: "剪辑 · 动作连续",
    level: "入门",
    estimatedMinutes: 8,
    prerequisite: "已完成基础粗剪，并找到两个包含同一动作不同景别的镜头。",
    title: "用双标记完成动作匹配硬切",
    goal: "让前后两个镜头在同一动作相位切换，避免为了“顺滑”滥用叠化。",
    scenario: "方向盘转动、车辆掠过路牌、人物开门等动作从广景切到近景。",
    settings: [
      "源镜头标记：M",
      "时间线标记：M",
      "修剪：T / Trim Edit Mode",
      "回看速度：1×",
    ],
    steps: [
      "分别在两个镜头的同一动作峰值打标记并写清动作相位。",
      "把第二镜头标记对齐时间线切点，先做硬切。",
      "用滚动修剪前后移动 1–3 帧，直到速度和方向连续。",
      "关闭声音听画面节奏，再开启声音确认没有声响跳点。",
    ],
    checks: [
      "动作方向、速度和主体位置连续",
      "硬切不被观众主动察觉",
      "没有重复动作或动作缺口",
    ],
    pitfall: "动作不匹配时优先重选切点；交叉叠化通常会制造双影，使问题更明显。",
  },
  {
    id: "j-l-cut",
    category: "声音 · 叙事衔接",
    level: "入门",
    estimatedMinutes: 10,
    prerequisite: "音画已同步，且能区分必须同步的动作声与可延续的环境声。",
    title: "用标记制作 J-Cut / L-Cut",
    goal: "让下一个场景的声音提前进入，或让上一个场景的声音延续，使场景转换更自然。",
    scenario: "道路环境声先于新地点画面出现，或采访声音跨到 B-roll。",
    settings: [
      "链接选择：Command/Ctrl + Shift + L",
      "声音错位：12–48 帧起步",
      "音频淡化：2–8 帧",
      "总线峰值：≤ -1 dBTP",
    ],
    steps: [
      "在听到关键词、环境声变化或呼吸停顿处打标记。",
      "临时关闭 Linked Selection，单独修剪音频入点或出点。",
      "让新场景声音提前 12–48 帧形成 J-Cut，或让旧声音延续形成 L-Cut。",
      "给音频边缘加短淡化并恢复链接选择，实时听完整句和环境声，确认 J-Cut / L-Cut 形成的声音桥自然。",
    ],
    checks: [
      "听觉先行或延续有明确叙事作用",
      "无爆音、断字、双重底噪或相位突变",
      "重新开启链接后音画同步关系仍符合意图",
    ],
    pitfall:
      "不要移动需要严格同步的口型、车门撞击或轮胎压缝声；这些位置应保持同步或另铺环境声。",
  },
  {
    id: "broll-cover",
    category: "剪辑 · 跳切修复",
    level: "入门",
    estimatedMinutes: 10,
    prerequisite: "主声音已锁定，并准备与叙述时空事实一致的 B-roll。",
    title: "标记问题区间并用 B-roll 覆盖跳切",
    goal: "保留主声音连续性，同时用相关细节镜头遮盖必要删减。",
    scenario: "删除停顿、口误或重复路线说明后，主画面出现明显跳切。",
    settings: [
      "区间标记：I / O",
      "目标轨：V2",
      "B-roll 前后余量：各 8–12 帧",
      "环境声延续：至少 1 秒",
    ],
    steps: [
      "在跳切前后打标记并写明缺失内容或需要的补画面。",
      "从素材池挑选方向、时间和叙事相关的 B-roll，设置 In/Out。",
      "把 B-roll 覆盖到 V2，前后越过跳切各 8–12 帧；A1 主声音保持连续。",
      "检查覆盖镜头是否引入错误地点、时间、天气或行驶方向。",
    ],
    checks: [
      "看不到主画面跳切且声音语义连续",
      "B-roll 与叙述内容和时空事实一致",
      "覆盖开始、结束没有闪帧或一帧露底",
    ],
    pitfall:
      "B-roll 只能遮盖视觉跳点，不能掩盖语义断裂、错误事实或明显不连续的环境声。",
  },
  {
    id: "audio-crossfade",
    category: "声音 · 接缝修复",
    level: "入门",
    estimatedMinutes: 6,
    prerequisite: "已建立音频切点，并能用耳机识别底噪、相位和响度变化。",
    title: "在环境声剪辑点添加音频交叉淡化",
    goal: "消除底噪、风声或道路声在剪辑点的突然变化。",
    scenario: "两段同地点环境声拼接，画面硬切自然但耳朵能听见接缝。",
    settings: [
      "Audio Cross Fade：0 dB",
      "时长：2–10 帧起步",
      "监听：耳机 + 扬声器",
      "增益差：先控制在 3 dB 内",
    ],
    steps: [
      "闭眼播放剪辑点，在听见底噪变化处按 M 打标记，并写明“底噪接缝”。",
      "把音频切点移动到较稳定的声纹或短暂掩蔽声附近。",
      "从 Audio Transitions 添加 Cross Fade 0 dB，先设 2–10 帧。",
      "用 Clip Gain 匹配两侧响度，再检查是否出现相位空洞或声音抽吸。",
    ],
    checks: [
      "闭眼无法轻易定位接缝",
      "对白、发动机和方向性声音没有重影",
      "波形不过载，整体响度没有因叠加突然抬升",
    ],
    pitfall:
      "不同声源、不同相位或强瞬态不适合长交叉淡化；必要时铺独立声音桥（Room Tone / 环境声）。",
  },
  {
    id: "beat-marker-edit",
    category: "节奏 · 音乐标记",
    level: "进阶",
    estimatedMinutes: 12,
    prerequisite: "已确认音乐授权、段落结构，以及道路声和音乐的主次关系。",
    title: "先标音乐节拍，再决定画面切点",
    goal: "用节拍标记建立可见节奏，但让镜头内容和动作完整性决定是否真的切换。",
    scenario: "驾驶集锦、片头蒙太奇或音乐进入后的连续风景镜头。",
    settings: [
      "实时打标记：M",
      "节奏基线：每 2 / 4 / 8 拍",
      "切点微调：±1–3 帧",
      "音乐电平：不盖过关键道路声",
    ],
    steps: [
      "只播放音乐轨，在明显重拍、段落起点和乐器变化处按 M；标记名称写“重拍”“段落”或“停顿”，不要无差别标满每一拍。",
      "把候选镜头按叙事顺序放到时间线，先保留动作头尾和必要观看时间，再选择最接近的节拍标记作为切点。",
      "使用滚动修剪把剪辑点前后移动 1–3 帧，比较“严格踩拍”和“动作先完成”两版；优先保留更自然的一版。",
      "暂时静音音乐检查画面逻辑，再恢复道路声和音乐，确认节拍剪辑没有破坏空间连续性或声音真实性。",
    ],
    checks: [
      "节奏有段落变化，而不是从头到尾机械地每拍一切",
      "关键动作、路牌和方向信息获得足够可读时间",
      "静音音乐后画面顺序仍然成立",
    ],
    pitfall:
      "节拍标记只是候选点；为踩拍截断动作、频繁切换或让音乐压过道路声，都会削弱驾驶影片的沉浸感。",
  },
  {
    id: "foreground-occlusion-cut",
    category: "剪辑 · 遮挡转场",
    level: "进阶",
    estimatedMinutes: 8,
    prerequisite: "前后镜头都包含真实前景遮挡，且主体运动方向基本一致。",
    title: "用前景遮挡标记完成隐藏硬切",
    goal: "在画面被柱子、车辆或墙面短暂遮满时切换镜头，让切点被真实运动遮蔽。",
    scenario:
      "车辆经过桥柱、路牌、隧道墙或近距离前景，下一镜头保持相近运动方向。",
    settings: [
      "遮挡峰值标记：M",
      "切点范围：最满遮挡前后 ±2 帧",
      "默认转场：无 / 硬切",
      "回放：1× + 逐帧",
    ],
    steps: [
      "在前后两个镜头中找到前景占据画面最多的一帧，各按 M 并写明运动方向，例如“右→左遮挡峰值”。",
      "把两个标记对齐到同一剪辑点，先使用硬切，不添加交叉叠化。",
      "逐帧移动切点，使切换发生在纹理最少、遮挡最完整的位置；随后用 1× 回放确认速度连续。",
      "检查切点两侧的主体位置、镜头运动、曝光和环境声；必要时先匹配颜色或铺声音桥，而不是增加视觉特效。",
    ],
    checks: [
      "正常速度下切点被遮挡自然隐藏",
      "前后运动方向和速度没有突然反转",
      "没有一帧亮边、空隙或错误场景露出",
    ],
    pitfall:
      "遮挡面积不足或运动方向相反时，硬切会明显跳动；不要用长叠化制造半透明柱子或车辆双影。",
  },
  {
    id: "whip-pan-match",
    category: "剪辑 · 运动匹配",
    level: "进阶",
    estimatedMinutes: 10,
    prerequisite: "前后镜头都拍到了同方向甩镜和足够的真实运动模糊。",
    title: "用甩镜模糊峰值匹配两个场景",
    goal: "在快速横摇的运动模糊中完成地点切换，同时保持方向和速度连续。",
    scenario: "从城市道路甩向海岸、公路或另一时间段的同方向运动镜头。",
    settings: [
      "模糊峰值标记：M",
      "方向：左→右或右→左保持一致",
      "切点微调：±1–2 帧",
      "可选叠化：最多 2–4 帧",
    ],
    steps: [
      "分别找到两个镜头横向模糊最强且方向一致的位置，打标记并在名称中记录方向。",
      "将两个标记对齐后先做硬切，逐帧确认切点两侧都处于真实运动模糊，不出现清晰画面闪现。",
      "若硬切仍有亮度跳变，先做曝光和白平衡匹配；只有纹理断裂轻微可见时才试 2–4 帧短叠化。",
      "以 1× 和 0.5× 各回看一次，同时听环境声是否需要 J-Cut、L-Cut 或短声音桥。",
    ],
    checks: [
      "运动方向、速度和模糊量连续",
      "转场前后没有清晰帧闪跳或明显双影",
      "地点变化可理解，不因速度效果造成方向混乱",
    ],
    pitfall:
      "软件 Motion Blur 不能修复拍摄时缺少的甩镜素材；方向相反时应换镜头，不要靠翻转画面伪造道路事实。",
  },
  {
    id: "dip-to-color",
    category: "转场 · 时间章节",
    level: "进阶",
    estimatedMinutes: 8,
    prerequisite: "已确定章节或时间边界，并能说明为什么需要观众感知停顿。",
    title: "用 Dip to Color 表达章节或时间跨越",
    goal: "用短暂进入黑色或指定颜色建立明确停顿，区分章节、日期或较大的时空变化。",
    scenario: "白天进入夜晚、章节结束、跨日出发或片头进入正片。",
    settings: [
      "Dip to Color：8–16 帧起步",
      "中心颜色：Black 默认",
      "停留：通常 0 帧",
      "声音桥：提前或延续 12–48 帧",
    ],
    steps: [
      "在章节结束和下一章节第一个有效画面处打标记，名称写明时间或叙事变化。",
      "确认两个镜头之间确实需要观众感知停顿，再把 Dip to Color 放到剪辑点中央，先设 8–16 帧。",
      "默认使用黑色；只有品牌或叙事有明确理由时才更换颜色，并检查 HDR 中该颜色和字幕亮度。",
      "用下一场景环境声提前进入或让上一场景尾音延续，避免画面和声音同时硬性归零。",
    ],
    checks: [
      "观众能理解这是章节、日期或时间变化",
      "黑场没有意外停留、闪白或 HDR 抬黑",
      "声音桥让停顿自然且没有爆音",
    ],
    pitfall:
      "普通相邻镜头不应频繁使用 Dip to Color；它会把轻微切换夸大成章节结束。",
  },
  {
    id: "smooth-cut-repair",
    category: "转场 · 对白修复",
    level: "谨慎使用",
    estimatedMinutes: 10,
    prerequisite: "仅限固定机位、稳定背景且人物姿态变化较小的对白跳切。",
    title: "谨慎使用 Smooth Cut 修复小幅跳切",
    goal: "在机位固定、背景稳定的短对白删减中，用极短形变过渡减轻头部位置跳变。",
    scenario: "采访或固定机位讲解删除少量停顿后，人物姿态只发生轻微变化。",
    settings: [
      "Smooth Cut：2–6 帧起步",
      "机位：固定",
      "背景：低运动",
      "检查倍率：Viewer 100%",
    ],
    steps: [
      "在必须删除的口误或停顿两端打标记，先完成普通硬切并判断是否真的需要修复。",
      "确认两侧脸部大小、角度和背景接近后，添加 Smooth Cut，先设 2–6 帧。",
      "在 Viewer 100% 逐帧检查眼睛、嘴、眼镜、头发和背景直线是否发生融化、拉伸或复制。",
      "若形变可见，缩短或删除 Smooth Cut，改用 B-roll 覆盖、换机位镜头或保留自然停顿。",
    ],
    checks: [
      "正常播放和逐帧检查均无面部或背景形变",
      "对白语义、口型和呼吸仍然自然",
      "效果关闭后可明确说明它解决了什么问题",
    ],
    pitfall:
      "Smooth Cut 不是通用转场；人物大幅移动、手部遮脸、车流背景或道路运动画面容易产生明显 AI 式扭曲。",
  },
  {
    id: "speed-ramp-transition",
    category: "变速 · 运动衔接",
    level: "谨慎使用",
    estimatedMinutes: 15,
    prerequisite:
      "已确认素材帧率、时间线帧率和真实运动区间，并接受逐帧伪影检查。",
    title: "先标动作区间，再制作克制的变速转场",
    goal: "在真实运动加速段内建立速度变化，并在运动峰值切换镜头，而不是任意拉快整段素材。",
    scenario: "车辆驶出、转弯、掠过前景或无人机推进等具有明确加速动作的镜头。",
    settings: [
      "Retime Controls：Command/Ctrl + R",
      "常速：100%",
      "加速起点：200%–400%",
      "Speed Point 缓动：Retime Curve",
    ],
    steps: [
      "在动作开始、速度峰值和动作结束各打一个标记，确认素材帧率与时间线帧率，避免先制造意外变速。",
      "开启 Retime Controls，在标记处添加 Speed Point；保留动作前后 100%，只把中间真实运动段提高到 200%–400% 起步。",
      "打开 Retime Curve，调整速度曲线手柄形成缓入缓出；不要让速度在单帧内突然跳变。",
      "把镜头切换放在运动峰值附近，并回听原声；需要时降低原声、铺环境声桥，而不是保留变调后的发动机声。",
    ],
    checks: [
      "速度变化有动作依据且缓入缓出自然",
      "无重复帧、光流扭曲、抖动放大或突兀音高变化",
      "变速结束后仍能辨认地点、方向和关键动作",
    ],
    pitfall:
      "低帧率素材慢放或 Optical Flow 生成复杂车辆、树枝和护栏时容易扭曲；发现伪影应改用 Frame Blend、Nearest 或取消慢放。",
  },
  {
    id: "transition-qc",
    category: "质检 · 批量复核",
    level: "质检",
    estimatedMinutes: 12,
    prerequisite: "全片剪辑结构已锁定，所有待判断转场均已建立或标记。",
    title: "用彩色标记完成转场质检闭环",
    goal: "把待处理、已处理和需返工的转场变成可扫描的时间线清单。",
    scenario: "长片中有大量剪辑点，容易漏检一帧黑场、重影或声音点击。",
    settings: [
      "黄色：待处理",
      "绿色：已通过",
      "红色：需返工",
      "检查范围：前后各 3–5 秒",
    ],
    steps: [
      "给所有需要判断的剪辑点加黄色标记，名称写“位置 + 问题 + 预期”。",
      "逐个从标记前 3–5 秒播放到后 3–5 秒，同时看画面、波形和声音。",
      "通过后改绿；发现黑帧、重复帧、重影、跳色或点击则改红并写原因。",
      "导出前按标记颜色过滤，确保黄色和红色均清零，再做一次全片 1× 实时回放。",
    ],
    checks: [
      "所有转场均有明确状态",
      "0 黑帧、0 Offline、0 一帧露底",
      "完整回放与导出文件复核都已通过",
    ],
    pitfall: "标记变绿只代表该次检查通过，不替代最终编码文件和平台播放验证。",
  },
  {
    id: "multicam-sync-edit",
    category: "剪辑 · 多机位",
    level: "进阶",
    estimatedMinutes: 18,
    prerequisite: "至少两段拍摄同一事件的素材，最好有共同参考声音或同步点。",
    title: "用波形或标记同步多机位，再实时切换角度",
    goal: "把主机位、车内机位和手机素材同步为一个可回退修改的多机位片段。",
    scenario: "车内讲解、采访、演出或同一段路线的多个同步机位。",
    settings: [
      "同步依据：Sound 或 Timecode",
      "无共同声音：同帧标记",
      "音频：固定使用主录音",
      "切换后：逐点修剪",
    ],
    steps: [
      "先给各机位设置清楚的 Camera Number 或 Angle，并核对采样率和帧率。",
      "有共同声音时创建 Multicam Clip 并按 Sound 同步；无共同声音时在同一动作帧打标记后按标记同步。",
      "打开 Multicam Viewer，先锁定要持续使用的主音频，再播放时间线实时切换画面角度。",
      "停止后逐个检查角度切换点，用滚动或波纹修剪避开眨眼、抖动和动作中断。",
    ],
    checks: [
      "口型、动作或闪光同步误差不超过可感知的一帧",
      "切换画面不会意外切换主音频",
      "所有角度均可回到源片调整",
    ],
    pitfall:
      "直接把多条素材堆在轨道上手工对齐会增加漂移和版本维护成本；长录音还要检查设备时钟漂移。",
  },
  {
    id: "stabilize-crop-qc",
    category: "修复 · 稳定",
    level: "进阶",
    estimatedMinutes: 14,
    prerequisite: "镜头已完成基础修剪，且明确哪些抖动属于有意运动。",
    title: "逐镜稳定并控制自动裁切与果冻伪影",
    goal: "降低微抖而不把正常转弯、摇镜或车辆振动处理成漂浮画面。",
    scenario: "手持步行、车内吸盘、长焦风景和轻微风振镜头。",
    settings: [
      "Inspector：Stabilization",
      "模式：Perspective / Similarity / Translation",
      "Strength：从低值起步",
      "检查：100% 缩放",
    ],
    steps: [
      "选中单个镜头开启 Stabilization，等待分析完成后先看默认结果。",
      "出现边缘拉伸时从 Perspective 改试 Similarity 或 Translation，并降低 Strength。",
      "同时观察 Cropping Ratio 和 Smooth，确保稳定收益值得画面裁切。",
      "以 100% 画面从头到尾播放，重点检查路灯、护栏、车窗边缘和快速转弯。",
    ],
    checks: [
      "微抖减少但真实运动仍存在",
      "无果冻、边缘拉伸和突然缩放",
      "裁切没有破坏道路与主体构图",
    ],
    pitfall:
      "稳定无法修复运动模糊、失焦和滚动快门本身；参数过强只会放大裁切与果冻感。",
  },
  {
    id: "dialogue-cleanup-fairlight",
    category: "声音 · 修复",
    level: "进阶",
    estimatedMinutes: 16,
    prerequisite: "对白和环境声已分轨，且保留一段只含底噪的参考区域。",
    title: "在 Fairlight 先修电平，再克制降噪和压缩",
    goal: "提高对白清晰度，同时保留自然环境和说话人的真实质感。",
    scenario: "车内讲解、街头采访、空调底噪和轻微风噪。",
    settings: [
      "Clip Gain：先匹配",
      "High-pass：按人声逐步试听",
      "降噪：最低有效量",
      "Limiter：峰值 ≤ -1 dBTP",
    ],
    steps: [
      "先用 Clip Gain 让各段对白进入相近工作电平，不急于上压缩器。",
      "用 EQ 轻切不需要的低频隆隆声，再 A/B 检查声音是否变薄。",
      "只对稳定底噪使用 Voice Isolation 或 Noise Reduction，从最低有效强度增加。",
      "最后小幅压缩控制动态并用 Limiter 防止峰值越界，闭眼回听完整句子和接缝。",
    ],
    checks: [
      "对白清楚但没有金属声和水下声",
      "句首句尾与停顿不出现噪声门抽吸",
      "关键环境声仍然自然",
    ],
    pitfall:
      "把降噪、语音隔离、门限和压缩全部拉高会制造比原始底噪更明显的伪影。",
  },
  {
    id: "subtitle-style-export",
    category: "字幕 · 交付",
    level: "入门",
    estimatedMinutes: 14,
    prerequisite: "已有最终对白或旁白，画面结构基本锁定。",
    title: "生成字幕、逐句校对并验证独立字幕文件",
    goal: "得到同步、可读、能随平台要求独立交付的字幕。",
    scenario: "YouTube 长片、采访、教程以及需要中英文版本的项目。",
    settings: [
      "每屏：通常不超过 2 行",
      "安全区：手机端检查",
      "专有名词：人工词表",
      "导出：SRT / VTT 按平台",
    ],
    steps: [
      "按当前版本能力从音频转录字幕，或导入已有 SRT，并确认语言和时间码。",
      "逐句核对地名、人名、数字、同音词、断句和说话人，不直接接受自动结果。",
      "统一字幕轨样式和位置，在复杂背景及手机尺寸下检查可读性。",
      "单独导出字幕文件后重新导入空时间线或播放器抽查，确认编码、时序和内容一致。",
    ],
    checks: [
      "无错字、重叠、超出画面和明显漂移",
      "静音观看能理解核心信息",
      "独立字幕文件可被平台或播放器正确识别",
    ],
    pitfall:
      "时间线里显示正常不代表导出的字幕编码和帧率一定正确；交付文件必须独立验证。",
  },
  ...additionalResolvePracticalTutorials,
] as const;
