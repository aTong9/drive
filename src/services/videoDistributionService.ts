export type DistributionPriority = "核心" | "同步测试" | "低成本测试" | "作品集";

export interface VideoDistributionPlatform {
  id: "youtube" | "dailymotion" | "rumble" | "vimeo";
  name: string;
  priority: DistributionPriority;
  effort: string;
  role: string;
  fit: string;
  videoSupport: string;
  monetization: string;
  payout: string;
  action: string;
  caution: string;
  url: string;
  sources: Array<{ label: string; url: string }>;
}

export const videoDistributionPlatforms: VideoDistributionPlatform[] = [
  {
    id: "youtube",
    name: "YouTube",
    priority: "核心",
    effort: "80% 运营精力",
    role: "主平台 · 搜索、推荐、播放列表与长期广告资产",
    fit: "最适合 60–120 分钟自驾、城市夜景、4K HDR 和无旁白环境音内容。",
    videoSupport: "4K HDR 工作流成熟；先私密上传并等待 2160p HDR。",
    monetization: "完整广告分成路径：1,000 订阅 + 最近 12 个月 4,000 小时有效公开长视频观看时长，或 Shorts 路径；达到门槛仍需审核。",
    payout: "需位于 YPP 可用地区并关联有效 AdSense for YouTube；当前官方地区名单未列中国大陆。",
    action: "每期优先完成标题、封面、章节、HDR 检查、播放列表和发布后 7 日复盘。",
    caution: "身份、居住地区、AdSense 地址、税务与收款信息必须真实且一致，不把其他地区资料当作绕过方案。",
    url: "https://www.youtube.com/",
    sources: [
      { label: "YPP 门槛", url: "https://support.google.com/youtube/answer/72851?hl=zh-Hans" },
      { label: "YPP 可用地区", url: "https://support.google.com/youtube/answer/7101720?hl=zh-Hans" },
    ],
  },
  {
    id: "dailymotion",
    name: "Dailymotion",
    priority: "同步测试",
    effort: "10–15% 运营精力",
    role: "同一成片的第二分发入口",
    fit: "内容形态匹配，且不需要重新拍摄；适合验证是否存在额外自然流量。",
    videoSupport: "官方列出最高 3840×2160、H.265 和 4K 约 20 Mb/s；未明确承诺 HDR 呈现，需先发短样片实测。",
    monetization: "Creator 累计 1,000 次 profile views 后解锁视频广告收益。",
    payout: "余额超过 100 美元后按月转入付款服务；Payoneer 银行国家需与 profile country 匹配，PayPal 需完成验证。",
    action: "先上传 3–5 条短样片检查画质与 HDR，再同步 10–20 条合规成片并记录播放、收益和处理时间。",
    caution: "Standard Creator 单文件最多 4 GB、2 小时。按官方 4K 20 Mb/s，仅视频流约 26 分钟就接近 4 GB，常规 60–90 分钟母版通常无法直接同步。",
    url: "https://www.dailymotion.com/",
    sources: [
      { label: "收益规则", url: "https://faq.dailymotion.com/hc/en-us/articles/207338747-Earn-revenue-from-video-monetization" },
      { label: "上传限制", url: "https://faq.dailymotion.com/hc/en-us/articles/115009030568-Upload-policies-technical-specifications" },
      { label: "付款匹配", url: "https://faq.dailymotion.com/hc/en-us/articles/360013323260-Connect-manage-your-payment-service" },
    ],
  },
  {
    id: "rumble",
    name: "Rumble",
    priority: "低成本测试",
    effort: "有余力再同步",
    role: "补充广告分发实验",
    fit: "可以承载长视频，但你的无旁白 HDR 自驾并非其已验证的主力类型。",
    videoSupport: "先用实际账号和样片确认长片、4K/HDR 转码结果，不为它单独改变主母版。",
    monetization: "存在广告收益体系；是否产生收益取决于许可选择、广告填充和实际观看。",
    payout: "Publisher 账户 settled earnings 达 50 美元后自动付款；Creator 手动提现同样至少 50 美元。",
    action: "同步 10–20 条，单独记录 30 日播放和 settled earnings；没有自然流量就暂停。",
    caution: "上传时先看清视频许可选项和分发权范围，避免为了测试平台授出不符合预期的独家或额外权利。",
    url: "https://rumble.com/",
    sources: [{ label: "50 美元付款规则", url: "https://rumble.support/help/why-don-t-i-see-a-cashout-button-in-my-account" }],
  },
  {
    id: "vimeo",
    name: "Vimeo",
    priority: "作品集",
    effort: "只选代表作",
    role: "高画质摄影作品展示与客户链接",
    fit: "适合深圳、香港、海岸、草原、雪景等少量代表作，不适合当主要推荐流量来源。",
    videoSupport: "官方支持 HDR、HDR10+、Dolby Vision；HDR 文件需至少 10-bit 并带正确 PQ 或 HLG 元数据。",
    monetization: "不是类似 YouTube 的开放广告分成主平台；售卖内容主要属于 Vimeo OTT / 点播产品路径。",
    payout: "是否收费、存储和销售能力取决于所选方案；使用前核对当期套餐。",
    action: "只上传最强的 5–10 条作品，建立按地区和场景组织的 4K HDR 摄影作品集。",
    caution: "不要投入日常标题测试与高频运营时间；重点是画质、简介、联系入口和作品选择。",
    url: "https://vimeo.com/",
    sources: [
      { label: "HDR 上传规范", url: "https://help.vimeo.com/hc/en-us/articles/12426058389649-Upload-HDR-HDR10-and-Dolby-Vision-videos" },
      { label: "套餐能力", url: "https://help.vimeo.com/hc/en-us/articles/12425432033937-About-Vimeo-plans" },
    ],
  },
];

export function estimateFileSizeGb(durationMinutes: number, videoMbps: number, audioKbps = 320): number {
  return ((videoMbps + audioKbps / 1000) * durationMinutes * 60) / 8 / 1000;
}

export function dailymotionStandardFit(durationMinutes: number, videoMbps = 20) {
  const estimatedGb = estimateFileSizeGb(durationMinutes, videoMbps);
  return { estimatedGb, fits: durationMinutes <= 120 && estimatedGb <= 4 };
}
