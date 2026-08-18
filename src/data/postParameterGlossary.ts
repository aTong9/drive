export type PostParameterCategory = "primary" | "hdr" | "curves" | "isolation" | "detail" | "audio" | "management" | "delivery";

export interface PostParameterTerm {
  id: string; term: string; full: string; category: PostParameterCategory; page: string;
  purpose: string; increase: string; decrease: string; example: string; why: string; caution: string;
}

const t = (id: string, term: string, full: string, category: PostParameterCategory, page: string, purpose: string, increase: string, decrease: string, example: string, why: string, caution: string): PostParameterTerm => ({ id, term, full, category, page, purpose, increase, decrease, example, why, caution });

export const postParameterTerms: PostParameterTerm[] = [
  t("lift","Lift","暗部色轮 / 黑位","primary","Color · Primaries","主要影响阴影和黑位，同时会牵动邻近中间调。","抬高暗部和黑位；色轮偏色会给阴影染色。","压低黑位、增加深沉感。","夜间道路整体发灰时轻降Y Lift，让无灯路面回到深黑。","恢复夜景层次，让灯光有黑位承托。","压得过低会吞掉轮胎、树影和路面纹理。"),
  t("gamma","Gamma","中间调色轮","primary","Color · Primaries","调整画面中间亮度，对主体和大部分环境影响明显。","提亮道路、建筑和主体。","压暗中间调，画面更沉稳。","夜间道路看不清但车灯未过曝时，先小幅提高Gamma而非整体抬Offset。","只救中间调，尽量保留灯牌高光。","抬太多会让夜景重新发灰并放大噪点。"),
  t("gain","Gain","高光色轮 / 白位","primary","Color · Primaries","主要控制亮部和白点。","提升天空、灯具和白色物体亮度。","压低亮部并回收高光。","白天云层接近剪切时轻降Gain，再用波形确认纹理是否回来。","比压暗整幅画面更有针对性。","已剪切的通道无法凭Gain恢复真实细节。"),
  t("offset","Offset","全局曝光与色偏","primary","Color · Primaries","近似整体移动全画面的亮度或色彩平衡。","整幅画面变亮。","整幅画面变暗。","S-Log3镜头进入DWG后整体偏暗，可先用Offset把中灰放到目标范围。","建立技术曝光起点，再处理局部层次。","不要用Offset修单独的天空或阴影。"),
  t("contrast","Contrast","对比度","primary","Color · Primaries","扩大或压缩亮暗差异。","暗部更暗、亮部更亮。","亮暗更接近，画面更平。","阴天树林缺乏层次时从1.05附近小幅增加。","让树干、叶片和道路分离。","HDR中增加过多会同时压黑位并推高峰值。"),
  t("pivot","Pivot","对比度支点","primary","Color · Primaries","决定Contrast围绕哪个亮度区域展开。","支点上移，更多中低调受对比影响。","支点下移，更多中高调受影响。","增加夜景Contrast后路面过暗，可调整Pivot重新平衡对比重心。","保持对比感但避免牺牲关键道路信息。","Pivot必须和Contrast一起观察，单独解释意义有限。"),
  t("saturation","Saturation","全局饱和度","primary","Color · Primaries","统一改变所有颜色的鲜艳程度。","所有颜色更鲜艳。","颜色更接近灰色。","霓虹红蓝溢出时将全局饱和度从默认值小幅降低。","减少编码后溢色并保持夜景真实。","全局降低会让本来正常的植被和暖灯也变淡。"),
  t("color-boost","Color Boost","低饱和区域色彩增强","primary","Color · Primaries","优先增强原本不鲜艳的颜色，类似更克制的自然饱和度。","灰淡区域获得更多色彩。","颜色趋于克制。","阴天乡村绿色偏灰时加少量Color Boost，而不是猛加Saturation。","增强环境颜色且较少推爆已经鲜艳的路牌。","仍需看矢量示波器，强度过大会显得数码。"),
  t("shadows","Shadows","阴影细节控制","primary","Color · Primaries","调整阴影细节，范围比Lift的黑位处理更柔和。","打开阴影纹理。","压暗阴影、增加深度。","树林树冠下细节过闷时轻抬Shadows。","恢复可见纹理而不必整体提亮。","抬阴影会暴露噪点和压缩块。"),
  t("highlights","Highlights","高光细节控制","primary","Color · Primaries","柔和调整高光区域，常用于回收天空、灯牌和反光。","高光更亮、更突出。","高光被压低，纹理更容易保留。","白天车载画面天空发白时先降低Highlights，再判断是否需要Gain。","有针对性保护天空而不压暗道路。","无法恢复相机已经硬剪切的数据。"),
  t("midtone-detail","Midtone Detail","中间调细节","primary","Color · Primaries","改变高边缘细节区域的局部对比和质感。","纹理更硬、更清晰。","质感更柔和。","4K树林叶片略软时只加少量；夜景高ISO素材则轻减。","日间增强纹理，夜间避免噪点被当作细节强化。","它不是传统锐化，过高会产生脏硬和光晕感。"),
  t("temperature","Temperature","色温","primary","Color · Primaries","沿蓝色到琥珀色方向校正整体白平衡。","画面更暖。","画面更冷。","5600K日间素材偏蓝时小幅加暖，并用中性路面检查。","先恢复现场中性，再决定是否保留风格冷暖。","不要把日落本来应有的暖色完全校成白色。"),
  t("tint","Tint","绿–洋红微调","primary","Color · Primaries","校正灯光或传感器造成的绿/洋红偏色。","通常向洋红方向。","通常向绿色方向。","LED路灯让灰色道路发绿时小幅增加Tint。","修正色温无法解决的第二轴偏色。","看RGB Parade和中性物，不能只凭肤色经验。"),
  t("hue","Hue","全局色相旋转","primary","Color · Primaries","整体旋转所有色相。","所有颜色沿色轮统一旋转。","向相反方向旋转。","通常不用于日常平衡，只在明确的技术偏差或特殊效果中极小调整。","避免逐色修正前漏掉整体色相错误。","极易让天空、植被和路灯同时失真。"),
  t("luma-mix","Luma Mix","亮度混合","primary","Color · Primaries","控制色轮RGB调整对亮度与饱和度关系的影响。","更保留传统亮度响应。","色彩调整与亮度耦合方式改变。","做克制冷暖分离时微调，观察霓虹亮度是否被意外改变。","让色彩造型不破坏原有明暗关系。","属于进阶控制，默认值通常更安全。"),
  t("soft-clip","Soft Clip","柔和剪切","primary","Color · Primaries","让接近黑白端点的信号渐进压缩。","更柔和地压住极端高光或暗部。","更接近原始硬边界。","车灯峰值接近HDR上限时用High Soft Clip做柔和滚降。","比直接砍Gain更自然地保留高光过渡。","过强会让高光灰闷、失去真实亮度。"),
  t("hdr-global","HDR Global","HDR全局轮","hdr","Color · HDR Wheels","在感知均匀的HDR工具中整体调整曝光和颜色。","全局提高HDR曝光。","全局降低HDR曝光。","HLG转PQ后整体亮度不合适，可先用Global做基础匹配。","先统一总体亮度，再处理分区。","仍需正确输入转换，不能代替色彩管理。"),
  t("hdr-dark","HDR Dark","HDR暗部区域","hdr","Color · HDR Wheels","控制深暗部但不等同于传统Lift。","打开深暗细节。","加深暗部。","夜间隧道入口细节消失时轻抬Dark。","只处理深暗区，减少对中间道路的影响。","抬高会迅速暴露S-Log3暗部噪声。"),
  t("hdr-shadow","HDR Shadow","HDR阴影区域","hdr","Color · HDR Wheels","控制暗部到低中间调。","阴影区域更亮。","阴影区域更沉。","林间道路阴影比天空低很多时小幅提升Shadow。","压缩场景动态范围以适应HDR观看。","避免把树林所有阴影拉成同一灰度。"),
  t("hdr-light","HDR Light","HDR亮中间调","hdr","Color · HDR Wheels","控制主体白、路面反光等亮中间调。","亮部主体更突出。","亮部主体更克制。","白天道路偏暗但天空正确时提升Light。","提亮道路而不直接推动最高天空峰值。","区域边界需按素材调整。"),
  t("hdr-highlight","HDR Highlight","HDR高光区域","hdr","Color · HDR Wheels","控制明亮天空、灯牌和反光。","高光更亮。","压低高光。","城市灯牌超过目标亮度时降低Highlight。","控制显著高光并维持夜景层次。","压太低会让灯牌看起来像灰色贴纸。"),
  t("hdr-specular","HDR Specular","HDR镜面峰值","hdr","Color · HDR Wheels","针对最亮的镜面反射、太阳和车灯峰值。","峰值更有冲击力。","峰值更受控。","将车灯峰值限制在你的1000-nit母版范围内。","保留HDR亮点，同时避免输出硬剪切。","峰值目标必须匹配可靠HDR监看与示波器。"),
  t("hdr-zone","HDR Zone Falloff","HDR区域与过渡","hdr","Color · HDR Wheels","定义各HDR轮影响范围和相邻区域过渡。","扩大或柔化该区域影响。","缩窄区域。","Highlight调整误伤普通白时缩窄区域并柔化过渡。","让分区控制落在真实亮度对象上。","过窄会形成亮度断层或闪烁。"),
  t("custom-curve","Custom Curve","自定义曲线","curves","Color · Curves","精确重塑亮度或单独RGB通道。","上拉控制点会提亮对应输入范围。","下拉会压暗对应范围。","日间画面用轻微S曲线增加层次，同时固定黑白端点。","比全局Contrast更精确。","节点过多容易产生不平滑曲线和色阶断裂。"),
  t("hue-vs-hue","Hue vs Hue","色相对色相","curves","Color · Curves","把特定颜色旋转为另一色相。","向一个方向改变选中色相。","向相反方向改变。","植被偏黄时只把黄绿色微调回自然绿。","修正单一颜色而不改变天空和道路。","范围过宽会连带路牌、车灯和肤色。"),
  t("hue-vs-sat","Hue vs Sat","色相对饱和度","curves","Color · Curves","只改变某一色相的饱和度。","选中颜色更鲜艳。","选中颜色更克制。","夜景红色尾灯溢色时降低红色饱和度。","保留其他颜色密度。","选择边缘需平滑，否则移动画面会闪色。"),
  t("hue-vs-lum","Hue vs Lum","色相对亮度","curves","Color · Curves","改变某一颜色的亮度。","选中颜色变亮。","选中颜色变暗。","蓝天太亮但整体曝光正确时轻压蓝色亮度。","针对天空而不压暗道路。","高压缩素材可能出现色带和边缘。"),
  t("lum-vs-sat","Lum vs Sat","亮度对饱和度","curves","Color · Curves","按亮度区域改变饱和度。","对应亮度更鲜艳。","对应亮度去饱和。","压低最暗阴影饱和度，减少夜景暗部彩噪。","清理暗部色噪而不影响霓虹。","过度会让阴影变成不自然的灰。"),
  t("sat-vs-sat","Sat vs Sat","饱和度对饱和度","curves","Color · Curves","按原始饱和程度重新分配颜色密度。","强化某段饱和度。","压缩过饱和区域。","压住已经很艳的灯牌，同时保留灰淡道路色彩。","比全局Saturation更克制。","曲线需平滑避免颜色跳变。"),
  t("qualifier","Qualifier","HSL限定器","isolation","Color · Qualifier","按色相、饱和度和亮度选择画面区域。","扩大选区范围。","缩小选区范围。","选择红色灯牌降低饱和度，并用Highlight检查选区。","只处理问题颜色。","移动镜头必须检查整段选区稳定性。"),
  t("denoise-key","Clean Black / White","限定器净化","isolation","Color · Qualifier","清理限定器遮罩中的噪点和孔洞。","遮罩更干净、更连续。","保留更细小选择。","夜景霓虹限定器边缘跳动时适量增加。","减少二级调色闪烁。","过高会吞掉细线和小灯光。"),
  t("blur-radius","Qualifier Blur Radius","限定器柔化","isolation","Color · Qualifier","柔化选区边缘。","边缘更柔和。","边缘更锐利。","天空限定器边缘出现硬线时增加Blur Radius。","让局部调整自然融合。","过大会污染相邻建筑或道路。"),
  t("power-window","Power Window","形状窗口","isolation","Color · Window","用圆形、渐变或多边形限定空间区域。","扩大窗口影响。","缩小窗口。","用上方渐变窗压暗日落天空。","比按颜色选择更稳定。","车载移动画面通常需要跟踪或关键帧。"),
  t("window-softness","Window Softness","窗口柔边","isolation","Color · Window","控制窗口内外过渡宽度。","过渡更宽、更自然。","边缘更明确。","天空渐变窗增加柔边避免地平线出现暗线。","隐藏局部处理痕迹。","柔边过大可能影响主体。"),
  t("tracker","Tracker","窗口跟踪","isolation","Color · Tracker","让窗口跟随对象或镜头运动。","增加分析范围或跟踪维度。","减少不稳定维度。","对车牌或固定车辆进行窗口跟踪。","让隐私处理和局部调整保持贴合。","跟踪后必须逐帧抽查遮挡和快速运动。"),
  t("temporal-nr","Temporal NR","时域降噪","detail","Color · Motion Effects","比较多个帧分离随机噪声与真实细节。","噪声更少但运动残影风险上升。","保留更多原始颗粒与运动。","A7C II夜景轻噪先试2帧、较低Luma/Chroma。","先于空域降噪通常能更自然地清理随机噪声。","尾灯拖影、树叶糊动或塑料感出现就降低。"),
  t("spatial-nr","Spatial NR","空域降噪","detail","Color · Motion Effects","在单帧内平滑噪声。","画面更干净但更软。","保留纹理也保留噪声。","时域处理后仍有固定彩噪时少量添加。","补充清理残留噪声。","官方建议通常先时域、再逐步加入空域。"),
  t("luma-chroma-nr","Luma / Chroma NR","亮度与色度降噪","detail","Color · Motion Effects","分别控制颗粒型亮度噪声和彩色斑点。","对应噪声减少。","保留对应细节。","夜景暗部彩色斑点明显时Chroma可略高于Luma。","保护路面纹理，同时清理更刺眼的彩噪。","过强Chroma会让小灯光颜色晕开。"),
  t("sharpen","Sharpen / Blur","锐化与模糊","detail","Color · Blur/Sharpen","调整边缘清晰度。","锐化会增强边缘。","模糊会柔化边缘。","4K日间素材只做轻微输出锐化，夜景不靠锐化救失焦。","补偿适度降噪或缩放带来的柔化。","锐化也会增强噪声、压缩边缘和光晕。"),
  t("midtone-detail-2","Texture Strategy","纹理策略","detail","Color · Primaries","结合Midtone Detail、降噪和锐化控制质感。","整体更硬。","整体更柔。","先降噪，再少量恢复中间调细节，而非两个参数同时拉高。","避免参数互相抵消并放大伪影。","每一步都应100%放大检查运动画面。"),
  t("clip-gain","Clip Gain","片段增益","audio","Fairlight · Inspector","在进入轨道处理前调整单个片段电平。","片段整体更响。","片段整体更轻。","单次喇叭峰值前先切片并降低Clip Gain。","比全轨压缩更精准，不破坏整段环境动态。","先处理异常峰值，再设置压缩器。"),
  t("eq","EQ","均衡器","audio","Fairlight · Mixer","按频段增减声音。","提升选中频率。","削减选中频率。","道路低频轰鸣可用温和高通或削减对应低频。","减少持续轰鸣，为自然环境声留空间。","窄带大幅削减容易让声音空洞。"),
  t("compressor","Compressor","压缩器","audio","Fairlight · Dynamics","超过阈值后按比例压低动态。","降低阈值/提高Ratio会压得更多。","保留更大动态。","Vision版音乐峰值偶尔压住道路声时使用轻压缩。","控制峰值同时保持长视频听感稳定。","环境音重压缩会产生抽吸和不真实的背景起伏。"),
  t("limiter","Limiter","限制器","audio","Fairlight · Dynamics","阻止峰值超过设定上限。","更低Ceiling会限制更多。","更高Ceiling保留峰值。","交付前把True Peak控制在约-1 dBTP以下作为起点。","降低编码后削波风险。","限制器不是提升平均响度的唯一工具。"),
  t("expander","Expander / Gate","扩展器与噪声门","audio","Fairlight · Dynamics","压低低于阈值的背景声。","更强会让安静段更静。","保留连续环境底噪。","只对明确问题轨谨慎使用，Ambience主轨通常不用硬门。","避免对白或设备声间隙的明显噪音。","阈值过高会切断溪流、风声和车辆尾音。"),
  t("lufs","LUFS Integrated","综合响度","audio","Fairlight · Loudness","衡量整段节目感知响度。","数值更接近0表示更响。","更负表示更轻。","Vision版可从-14至-16 LUFS附近试起；Ambience保留更自然动态。","让长视频不同章节听感一致。","平台会标准化播放，别为追数字牺牲动态。"),
  t("true-peak","True Peak","真峰值","audio","Fairlight · Loudness","估计采样点之间及编码后的峰值。","更高更接近削波。","留出更多编码余量。","AAC导出前检查不高于约-1 dBTP。","减少上传转码后的爆音。","Sample Peak安全不代表True Peak一定安全。"),
  t("rcm","RCM","Resolve色彩管理","management","Project Settings · Color Management","根据输入、时间线和输出空间执行统一转换。","自动化程度更高。","手动节点责任更多。","混合S-Log3与HLG素材时分别标记输入，统一进入DWG。","避免每个剪辑重复搭技术CST。","输入标签错误会让整个自动链路都错误。"),
  t("input-space","Input Color Space","输入色彩空间","management","Media Pool · Input Color Space","告诉Resolve素材使用的色域和传递函数。","不是强度参数。","不是强度参数。","MR2素材标记Sony S-Gamut3.Cine/S-Log3；MR3标记Rec.2100 HLG。","正确解码素材原始亮度和颜色。","S-Log3、HLG、Rec.709不能靠画面外观猜。"),
  t("dwg","DWG / Intermediate","时间线工作空间","management","Project Settings","为不同相机提供宽色域、高动态范围的统一场景参考空间。","不适用强弱解释。","不适用强弱解释。","所有镜头先进入DWG完成匹配，再分别输出HDR或SDR。","一套母版可派生多种交付。","工作空间不是显示空间，不能未经输出转换直接观看。"),
  t("cst","CST","Color Space Transform","management","Color · Node","节点级输入、输出和色调映射转换。","不是强度参数。","不是强度参数。","非RCM项目中用CST把S-Log3转换到DWG，再在末端转PQ。","明确控制单个节点链路。","RCM已经转换时再套相同CST会重复转换。"),
  t("output-space","Output Color Space","输出色彩空间","management","Project Settings","把时间线映射到显示或交付标准。","不适用强弱解释。","不适用强弱解释。","HDR10选择Rec.2100 ST2084；普通SDR选择Rec.709 Gamma 2.4。","让图像和文件标签匹配目标显示。","仅改标签不会自动完成正确映射。"),
  t("tone-mapping","Tone Mapping","色调映射","management","RCM / CST","将源动态范围映射到目标亮度范围。","更强压缩可保留更多峰值。","更少压缩保留源对比。","HDR母版转SDR时用输出映射保留云层与灯牌层次。","避免高光直接剪切。","过强会让画面灰平或产生亮度反转感。"),
  t("codec","Codec","视频编码","delivery","Deliver","决定压缩效率、画质、解码负担和兼容性。","更高质量设置通常更大。","更强压缩文件更小。","YouTube HDR平台版使用H.265 Main10，保留10-bit与正确标签。","平衡上传体积和平台转码质量。","MP4/MOV只是封装，不等于编码。"),
  t("bitrate","Bitrate","视频码率","delivery","Deliver","单位时间分配的数据量。","通常保留更多复杂细节、文件更大。","文件更小、压缩伪影更多。","90分钟4K HDR从80–120 Mb/s范围测试道路树叶和夜景。","移动细节和噪声对压缩要求高。","码率高不能修复失焦、剪切或8-bit色带。"),
  t("data-levels","Data Levels","视频/全范围电平","delivery","Deliver · Advanced","决定数字码值如何映射黑白范围。","不是亮度强度。","不是亮度强度。","通常保持Auto并用MediaInfo及回放确认，只有明确链路需求才手动。","防止黑位抬升或压死。","错误的Full/Video解释会让整片对比异常。"),
  t("hdr-tags","HDR Tags","HDR色彩标签","delivery","Deliver · Advanced","写入primaries、transfer和matrix等识别信息。","不是效果强度。","不是效果强度。","HDR10核验BT.2020 primaries、ST2084 transfer和BT.2020 matrix。","帮助播放器和YouTube正确识别HDR。","标签正确但像素转换错误仍是假HDR。"),
];

export const postParameterCategoryLabels: Record<PostParameterCategory, string> = { primary: "基础曝光与色轮", hdr: "HDR分区", curves: "曲线", isolation: "限定与跟踪", detail: "降噪与细节", audio: "Fairlight音频", management: "色彩管理", delivery: "导出交付" };

export type PostProblemCategory = "exposure" | "color" | "detail" | "audio" | "delivery";
export interface PostProblemRecipe {
  id: string; symptom: string; category: PostProblemCategory; scene: string; diagnosis: string; observe: string[];
  steps: { parameterId: string; action: string; reason: string }[]; stopWhen: string; avoid: string;
}

export const postProblemCategoryLabels: Record<PostProblemCategory, string> = { exposure: "曝光层次", color: "颜色问题", detail: "噪声与细节", audio: "声音问题", delivery: "HDR与交付" };
export const postProblemRecipes: PostProblemRecipe[] = [
  { id: "white-sky", symptom: "白天天空发白、云层没有层次", category: "exposure", scene: "白天驾驶 / 海岸 / 树林", diagnosis: "先确认素材通道是否已经剪切；仍有数据时再做高光压缩。", observe: ["HDR Waveform", "RGB Parade", "天空纹理回放"], steps: [{ parameterId: "highlights", action: "小幅降低Highlights", reason: "先压高光范围，尽量不影响道路中间调。" }, { parameterId: "gain", action: "必要时轻降Gain", reason: "进一步控制白点和亮部，但观察主体是否一起变暗。" }, { parameterId: "soft-clip", action: "用High Soft Clip柔化峰值", reason: "让接近输出上限的高光自然滚降。" }], stopWhen: "云层纹理可见、道路亮度仍自然，波形没有平顶硬截。", avoid: "不要只把Offset整体拉低，也不要期待恢复相机已经剪切的数据。" },
  { id: "blocked-shadows", symptom: "树林或夜景阴影死黑", category: "exposure", scene: "树林溪流 / 夜间道路", diagnosis: "区分真正无信息的黑位和只是过暗的低中间调。", observe: ["Waveform低端", "100%放大噪点", "镜头连接"], steps: [{ parameterId: "shadows", action: "先轻抬Shadows", reason: "打开阴影纹理，较少改变绝对黑位。" }, { parameterId: "gamma", action: "道路仍暗时提高Gamma", reason: "恢复更大面积的中间调可见度。" }, { parameterId: "hdr-dark", action: "HDR项目针对深暗区微调Dark", reason: "减少对天空和灯光的影响。" }], stopWhen: "关键纹理可辨但黑位仍存在，噪点没有成为画面主体。", avoid: "不要把Lift和Offset同时大幅抬高，否则夜景会整体发灰。" },
  { id: "gray-night", symptom: "夜景整体发灰，没有夜晚感觉", category: "exposure", scene: "城市夜间驾驶", diagnosis: "通常是黑位抬高、Gamma过亮或降噪后对比被削弱。", observe: ["HDR Waveform 0–100 nits", "黑场对象", "灯光峰值"], steps: [{ parameterId: "lift", action: "轻降Y Lift", reason: "重新建立真实黑位。" }, { parameterId: "contrast", action: "小幅增加Contrast", reason: "拉开路面和灯光层次。" }, { parameterId: "pivot", action: "用Pivot修正对比重心", reason: "防止道路中间调被压得过暗。" }], stopWhen: "无灯区域保持深暗、道路仍可辨、灯光有黑位承托。", avoid: "不要用高饱和度或蓝色阴影掩盖曝光层次问题。" },
  { id: "neon-clipping", symptom: "霓虹、尾灯和灯牌颜色溢出", category: "color", scene: "城市夜景", diagnosis: "检查是亮度剪切、单通道剪切还是饱和度超出色域。", observe: ["RGB Parade", "Vectorscope", "Gamut警告"], steps: [{ parameterId: "hdr-highlight", action: "先降低Highlight亮度", reason: "控制灯牌所在的高光区。" }, { parameterId: "hue-vs-sat", action: "压低问题红色或蓝色饱和度", reason: "不牺牲其他正常颜色。" }, { parameterId: "sat-vs-sat", action: "压缩最高饱和区域", reason: "保留低饱和道路和建筑颜色。" }], stopWhen: "灯牌字形重新可辨，矢量示波器不过度贴边，颜色仍有亮度感。", avoid: "不要只降低全局Saturation，让整座城市失去颜色。" },
  { id: "mixed-light", symptom: "LED路灯发绿，不同路段色温跳变", category: "color", scene: "城市驾驶 / 蓝调时刻", diagnosis: "先按灯光类型分组，区分色温轴和绿–洋红轴。", observe: ["RGB Parade", "中性道路/白线", "相邻镜头擦拭对比"], steps: [{ parameterId: "temperature", action: "先用Temperature校正冷暖", reason: "建立主要白平衡方向。" }, { parameterId: "tint", action: "再增加Tint抵消绿色偏色", reason: "处理色温无法解决的第二轴偏差。" }, { parameterId: "qualifier", action: "只有局部灯光异常时用Qualifier", reason: "避免全局校正破坏正常暖灯。" }], stopWhen: "道路白线接近中性，相邻路段过渡自然，同时保留现场灯光气氛。", avoid: "不要把所有路灯都校成纯白，也不要一个节点修完整条路线。" },
  { id: "flat-log", symptom: "Log素材转换后仍灰平、颜色很淡", category: "color", scene: "S-Log3白天或夜间", diagnosis: "先确认输入色彩空间是否正确，再判断曝光和造型。", observe: ["Input Color Space", "Waveform", "Vectorscope"], steps: [{ parameterId: "input-space", action: "确认S-Gamut3.Cine / S-Log3输入", reason: "错误输入解释会让所有后续参数失准。" }, { parameterId: "offset", action: "用Offset建立中灰曝光", reason: "先完成技术平衡。" }, { parameterId: "contrast", action: "小幅增加Contrast并配合Pivot", reason: "恢复场景层次。" }, { parameterId: "color-boost", action: "最后少量增加Color Boost", reason: "自然恢复低饱和颜色。" }], stopWhen: "画面对比和色彩自然、肤色或植被不过饱和，输出波形符合目标。", avoid: "不要先猛加Saturation，也不要在RCM转换后重复套技术LUT。" },
  { id: "banding", symptom: "天空渐变出现色带或块状断层", category: "detail", scene: "蓝调天空 / 日落 / 雾景", diagnosis: "检查源素材色深、压缩、缓存和限定器边缘。", observe: ["100%放大", "禁用节点对比", "源文件与导出文件"], steps: [{ parameterId: "blur-radius", action: "柔化天空限定器边缘", reason: "避免二级调整形成硬断层。" }, { parameterId: "hue-vs-sat", action: "降低过强的蓝色调整", reason: "减少有限色阶被拉开的程度。" }, { parameterId: "bitrate", action: "提高测试导出码率", reason: "判断是否主要来自交付压缩。" }], stopWhen: "正常观看距离下渐变连续，导出后没有明显新增色带。", avoid: "8-bit源素材不要使用窄限定器和大幅色相/饱和度调整。" },
  { id: "nr-smear", symptom: "降噪后尾灯拖影、树叶塑料感", category: "detail", scene: "夜间驾驶 / 林间移动", diagnosis: "时域帧数或运动估计过强，空域处理也可能抹掉纹理。", observe: ["100%动态回放", "尾灯边缘", "树叶与路面纹理"], steps: [{ parameterId: "temporal-nr", action: "先降低Temporal NR帧数或强度", reason: "减少跨帧残影。" }, { parameterId: "spatial-nr", action: "再降低Spatial NR", reason: "恢复单帧纹理。" }, { parameterId: "midtone-detail-2", action: "只在降噪稳定后少量恢复质感", reason: "避免把残余噪声重新强化。" }], stopWhen: "运动对象边缘自然、细节不蜡化，剩余噪声在正常观看下不抢眼。", avoid: "不要用锐化掩盖过度降噪，也不要只看暂停帧。" },
  { id: "audio-pumping", symptom: "环境声忽大忽小，出现抽吸感", category: "audio", scene: "溪流、道路声、风声", diagnosis: "通常是压缩器、自动增益、噪声门或重度降噪改变背景底噪。", observe: ["响度历史", "Dynamics增益衰减", "耳机连续回放"], steps: [{ parameterId: "clip-gain", action: "先逐个处理异常峰值", reason: "避免全轨处理为少数峰值付出代价。" }, { parameterId: "compressor", action: "提高阈值或降低Ratio", reason: "减轻持续增益衰减。" }, { parameterId: "expander", action: "关闭或放宽Gate", reason: "保留连续环境底噪和尾音。" }], stopWhen: "环境底噪连续、车辆或水声进出自然，同时没有突兀峰值。", avoid: "不要为了追求完全安静而切断真实环境声。" },
  { id: "wind-rumble", symptom: "风噪和车辆低频轰鸣明显", category: "audio", scene: "海岸步行 / 车内收音", diagnosis: "先区分持续低频、阵风冲击和结构振动。", observe: ["频谱分析", "耳机低频", "原始备份轨"], steps: [{ parameterId: "clip-gain", action: "单独降低最严重阵风片段", reason: "避免处理整条轨道。" }, { parameterId: "eq", action: "温和高通或削减问题低频", reason: "清理不承载场景信息的轰鸣。" }, { parameterId: "compressor", action: "仅在峰值仍突出时轻压缩", reason: "控制剩余动态而不制造抽吸。" }], stopWhen: "轰鸣不再压住环境细节，声音仍保留海风或车辆质感。", avoid: "低切过高会让道路声、海浪和溪流失去重量。" },
  { id: "music-masks-road", symptom: "音乐压住道路声，环境感消失", category: "audio", scene: "aBin Vision音乐版", diagnosis: "先处理音量关系，再考虑EQ和动态侧链。", observe: ["A1/A2电平", "LUFS", "手机与电视试听"], steps: [{ parameterId: "clip-gain", action: "先降低音乐片段增益", reason: "建立道路声为主角的基础平衡。" }, { parameterId: "eq", action: "必要时给音乐让出车辆关键频段", reason: "减少频率遮蔽而非只降总音量。" }, { parameterId: "lufs", action: "最后检查整片综合响度", reason: "确保章节之间听感一致。" }], stopWhen: "音乐提供氛围但道路纹理始终可辨，手机和电视都不过度吵。", avoid: "不要为了达到固定LUFS而把音乐和道路声一起推入重限制。" },
  { id: "youtube-no-hdr", symptom: "上传后YouTube没有显示HDR", category: "delivery", scene: "4K HDR10交付", diagnosis: "分别检查像素转换、10-bit编码、HDR标签和平台处理状态。", observe: ["MediaInfo", "ffprobe", "YouTube 2160p HDR标识"], steps: [{ parameterId: "output-space", action: "确认输出Rec.2100 ST2084", reason: "PQ是你的HDR10交付传递函数。" }, { parameterId: "codec", action: "确认H.265 Main10或可靠10-bit编码", reason: "保留HDR阶调和平台识别所需能力。" }, { parameterId: "hdr-tags", action: "核验BT.2020与ST2084标签", reason: "让播放器和平台正确识别。" }, { parameterId: "data-levels", action: "检查电平解释没有异常", reason: "避免文件回放黑白位错误。" }], stopWhen: "本地元数据正确、完整回看通过，YouTube明确显示2160p HDR。", avoid: "不要仅修改文件标签伪装HDR，也不要在平台仍处理中时反复重传。" },
];
