import type { DavinciStageId, VideoChannelMode } from "../../types/domain.js";

export function PostMasterStatus({ channelMode, research, stageIsDone }: {
  channelMode: VideoChannelMode; research: boolean; stageIsDone: (stage: DavinciStageId) => boolean;
}) {
  return <section className="post-master-status">
    <article className={stageIsDone("edit") ? "done" : ""}>
      <small>PICTURE MASTER</small><strong>画面母版</strong>
      <span>{stageIsDone("edit") ? "剪辑清单完成，请确认锁画" : "等待 Edit 工作区锁画"}</span>
    </article>
    {channelMode !== "ambience" && <article className={stageIsDone("fairlight") ? "done" : ""}>
      <small>VISION</small><strong>{research ? "选题声音设计" : "道路声 + 授权音乐"}</strong>
      <span>{stageIsDone("fairlight") ? "声音清单完成，交付前试听" : "按项目确认声音与音乐许可"}</span>
    </article>}
    {channelMode !== "vision" && <article className={stageIsDone("fairlight") ? "done" : ""}>
      <small>AMBIENCE</small><strong>真实环境声</strong>
      <span>{stageIsDone("fairlight") ? "声音清单完成，确认无音乐版本" : "保持相同画面结构"}</span>
    </article>}
    <article className={stageIsDone("deliver") ? "done" : ""}>
      <small>{research ? "DELIVERY REVIEW" : "4K HDR DELIVERY"}</small>
      <strong>{channelMode === "dual" ? "双频道交付" : "单频道交付"}</strong>
      <span>{stageIsDone("deliver") ? "等待上传复核" : research ? "按实际成片核对分辨率、色彩与声音" : "HEVC Main10 · PQ"}</span>
    </article>
  </section>;
}
