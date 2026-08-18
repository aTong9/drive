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

export const colorFinishingSources = [
  {
    label: "Blackmagic Resolve 官方培训",
    url: "https://www.blackmagicdesign.com/products/davinciresolve/training",
  },
  {
    label: "官方 Colorist Guide 20",
    url: "https://documents.blackmagicdesign.com/UserManuals/DaVinci-Resolve-20-Colorist-Guide.pdf",
  },
] as const;
