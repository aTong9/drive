import {
  Camera,
  Check,
  ChevronRight,
  CircleDot,
  Clapperboard,
  Download,
  Film,
  Headphones,
  HardDrive,
  MapPin,
  Music2,
  PackageCheck,
  Plus,
  Route,
  Send,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { useState } from "react";
import type {
  ProjectPackItem,
  ResolvedRoute,
  VideoProjectStatus,
} from "../../types/domain.js";
import { usePlannerStore } from "../../app/store.js";
import {
  exportVideoProject,
  getNextProjectAction,
  getProjectProgress,
  generateProjectDescription,
  getRetrospectiveInsights,
  getStageGateIssues,
  importVideoProject,
} from "../../services/videoProjectService.js";
import { davinciWorkflow } from "../../services/workflowService.js";

const statusOrder: VideoProjectStatus[] = [
  "planning",
  "ready",
  "shooting",
  "ingest",
  "editing",
  "review",
  "published",
];
const statusLabels: Record<VideoProjectStatus, string> = {
  planning: "策划中",
  ready: "待出发",
  shooting: "拍摄中",
  ingest: "素材接收",
  editing: "后期制作",
  review: "交付质检",
  published: "已发布",
};
const groupLabels: Record<ProjectPackItem["group"], string> = {
  route: "路线与开放",
  gear: "设备与参数",
  weather: "天气预案",
  safety: "安全边界",
  sound: "环境收音",
  storage: "存储与备份",
};
const purposeLabels = {
  establishing: "建立",
  movement: "运动",
  detail: "细节",
  sound: "环境声",
  transition: "转场",
  thumbnail: "封面",
} as const;

export function ProjectWorkspaceView({ routes }: { routes: ResolvedRoute[] }) {
  const projects = usePlannerStore((state) => state.videoProjects);
  const activeId = usePlannerStore((state) => state.activeVideoProjectId);
  const selectProject = usePlannerStore((state) => state.selectVideoProject);
  const toggleShot = usePlannerStore((state) => state.toggleProjectShot);
  const setShotStatus = usePlannerStore((state) => state.setProjectShotStatus);
  const togglePack = usePlannerStore((state) => state.toggleProjectPackItem);
  const updateStatus = usePlannerStore(
    (state) => state.updateVideoProjectStatus,
  );
  const toggleWorkflow = usePlannerStore(
    (state) => state.toggleProjectWorkflowItem,
  );
  const updateProject = usePlannerStore((state) => state.updateVideoProject);
  const [musicTitle, setMusicTitle] = useState("");
  const [musicPlatform, setMusicPlatform] = useState("YouTube 音频库");
  const [batchLabel, setBatchLabel] = useState("");
  const [batchDevice, setBatchDevice] = useState("");
  const [batchCard, setBatchCard] = useState("");
  const [batchFiles, setBatchFiles] = useState(0);
  const [batchGB, setBatchGB] = useState(0);
  const [importStatus, setImportStatus] = useState("");
  const [stageNotice, setStageNotice] = useState<{
    status: VideoProjectStatus;
    issues: string[];
  } | null>(null);
  const importFile = async (file: File) => {
    try {
      const project = await importVideoProject(file);
      usePlannerStore.getState().saveVideoProject(project);
      setImportStatus("项目已通过数据契约校验并导入");
    } catch (error) {
      setImportStatus(error instanceof Error ? error.message : "导入失败");
    }
  };
  const active =
    projects.find((project) => project.id === activeId) ?? projects.at(-1);
  if (!active)
    return (
      <main className="project-page">
        <section className="project-empty">
          <span>
            <Film size={28} />
          </span>
          <h1>还没有视频项目</h1>
          <p>从拍摄计划选择“建立视频项目”，系统会生成镜头清单和出发任务包。</p>
          <div className="project-empty-actions">
            <button onClick={() => usePlannerStore.getState().setView("plans")}>
              打开拍摄计划 <ChevronRight size={15} />
            </button>
            <label>
              <Upload size={14} />
              导入已有项目
              <input
                type="file"
                accept="application/json"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (file) await importFile(file);
                  event.target.value = "";
                }}
              />
            </label>
          </div>
          {importStatus && <small>{importStatus}</small>}
        </section>
      </main>
    );
  const route = routes.find((item) => item.route.id === active.routeId);
  const shotsDone = active.shots.filter(
    (shot) => shot.captureStatus === "captured",
  ).length;
  const shotsResolved = active.shots.filter(
    (shot) =>
      shot.captureStatus === "captured" || shot.captureStatus === "waived",
  ).length;
  const packDone = active.packItems.filter((item) => item.completed).length;
  const ingestItems = active.ingestItems ?? [];
  const mediaBatches = active.mediaBatches ?? [];
  const deliveryItems = active.deliveryItems ?? [];
  const musicTracks = active.musicTracks ?? [];
  const publish = active.publish ?? {
    visionTitle: "",
    ambienceTitle: "",
    description: "",
    chapters: "",
    thumbnailNote: "",
    hdrVerified: false,
    visionPublished: false,
    ambiencePublished: false,
  };
  const retrospective = active.retrospective ?? {
    routeNote: "",
    cameraNote: "",
    editNote: "",
    performanceNote: "",
    nextAction: "",
    metrics: {
      views7d: 0,
      clickThroughRate: 0,
      averageViewMinutes: 0,
      averagePercentageViewed: 0,
      bestMoment: "",
      dropoffMoment: "",
    },
  };
  const retrospectiveInsights = getRetrospectiveInsights(active);
  const progress = getProjectProgress(active);
  const nextAction = getNextProjectAction(active);
  return (
    <main className="project-page">
      <header className="project-head">
        <div>
          <p className="eyebrow">VIDEO PROJECT WORKSPACE</p>
          <h1>视频项目工作台</h1>
          <p>路线、镜头、设备、任务包与后期交付围绕同一个作品推进。</p>
        </div>
        <div className="project-file-actions">
          <label>
            <Upload size={14} />
            导入项目
            <input
              type="file"
              accept="application/json"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                try {
                  await importFile(file);
                } catch {
                  /* importFile 已提供可见错误 */
                }
                event.target.value = "";
              }}
            />
          </label>
          <button onClick={() => exportVideoProject(active)}>
            <Download size={15} /> 导出项目
          </button>
          {importStatus && <small>{importStatus}</small>}
        </div>
      </header>
      <nav className="project-switcher">
        {projects.map((project) => (
          <button
            key={project.id}
            className={project.id === active.id ? "active" : ""}
            onClick={() => selectProject(project.id)}
          >
            <CircleDot size={12} />
            <span>
              <strong>{project.title}</strong>
              <small>
                {project.scheduledDate} · {statusLabels[project.status]}
              </small>
            </span>
          </button>
        ))}
      </nav>
      <section className="project-hero">
        <div>
          <small>
            {active.channelMode === "dual"
              ? "aBin Vision + aBin Ambience"
              : active.channelMode}
          </small>
          <h2>{active.title}</h2>
          <p>{active.objective}</p>
          {route && (
            <div>
              <span>
                <Route size={13} />
                {route.route.estimatedDurationMinutes} 分钟
              </span>
              <span>
                <MapPin size={13} />
                {route.waypoints.length} 个地点
              </span>
              <span>
                <Camera size={13} />
                {[
                  ...new Set(
                    route.cameraPresets.map((preset) => preset.camera),
                  ),
                ].join(" · ")}
              </span>
            </div>
          )}
        </div>
        <aside>
          <strong>{progress.percent}%</strong>
          <span>
            <i>
              <b style={{ width: `${progress.percent}%` }} />
            </i>
            {progress.completed} / {progress.total} 项完成
          </span>
        </aside>
      </section>
      <section className="project-status-flow">
        {statusOrder.map((status, index) => (
          <button
            key={status}
            className={`${active.status === status ? "active" : ""} ${statusOrder.indexOf(active.status) > index ? "done" : ""}`}
            onClick={() => {
              const issues = getStageGateIssues(active, status);
              updateStatus(active.id, status);
              setStageNotice(issues.length ? { status, issues } : null);
            }}
          >
            <span>{index + 1}</span>
            {statusLabels[status]}
          </button>
        ))}
      </section>
      <section className="project-action-center">
        <div>
          <small>NEXT ACTION</small>
          <strong>{nextAction}</strong>
          <p>
            当前阶段 · {statusLabels[active.status]}
            。门禁用于提醒，不会阻止你按现场情况继续推进。
          </p>
        </div>
        <div className="project-progress-sections">
          {progress.sections.map((section) => (
            <span
              key={section.id}
              className={
                section.total > 0 && section.completed === section.total
                  ? "done"
                  : ""
              }
            >
              <i>
                {section.completed}/{section.total}
              </i>
              {section.label}
            </span>
          ))}
        </div>
      </section>
      {stageNotice && (
        <section className="project-gate-warning">
          <ShieldCheck size={18} />
          <div>
            <strong>
              已进入“{statusLabels[stageNotice.status]}”，但仍有{" "}
              {stageNotice.issues.length} 个缺口
            </strong>
            <ul>
              {stageNotice.issues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          </div>
          <button onClick={() => setStageNotice(null)}>知道了</button>
        </section>
      )}
      <div className="project-grid">
        <section className="project-shots">
          <header>
            <div>
              <small>SHOT LIST</small>
              <h2>镜头清单</h2>
            </div>
            <span>
              {shotsResolved}/{active.shots.length} 已处理 · {shotsDone} 已拍
            </span>
          </header>
          {route?.waypoints.map((location) => (
            <article key={location.id}>
              <header>
                <MapPin size={14} />
                <div>
                  <strong>{location.name}</strong>
                  <small>
                    {location.city} ·{" "}
                    {location.access.mode === "drive"
                      ? "车载连续拍摄"
                      : "停车后步行拍摄"}
                  </small>
                </div>
              </header>
              <div>
                {active.shots
                  .filter((shot) => shot.locationId === location.id)
                  .map((shot) => {
                    const preset = route.cameraPresets.find(
                      (item) => item.id === shot.devicePresetId,
                    );
                    return (
                      <section
                        key={shot.id}
                        className={`project-shot-card status-${shot.captureStatus}`}
                      >
                        <button
                          className={
                            shot.captureStatus === "captured" ? "done" : ""
                          }
                          onClick={() => toggleShot(active.id, shot.id)}
                        >
                          <span>
                            {shot.captureStatus === "captured" ? (
                              <Check size={13} />
                            ) : (
                              <Camera size={13} />
                            )}
                          </span>
                          <div>
                            <strong>{shot.title}</strong>
                            <small>
                              {purposeLabels[shot.purpose]} ·{" "}
                              {shot.targetSeconds} 秒
                              {preset ? ` · ${preset.camera}` : ""}
                            </small>
                            <p>{shot.note}</p>
                          </div>
                        </button>
                        <div
                          className="shot-disposition"
                          aria-label={`${shot.title} 拍摄结果`}
                        >
                          {(
                            ["pending", "captured", "missed", "waived"] as const
                          ).map((status) => (
                            <button
                              key={status}
                              className={
                                shot.captureStatus === status ? "active" : ""
                              }
                              onClick={() =>
                                setShotStatus(active.id, shot.id, status)
                              }
                            >
                              {status === "pending"
                                ? "待拍"
                                : status === "captured"
                                  ? "已拍"
                                  : status === "missed"
                                    ? "漏拍"
                                    : "放弃"}
                            </button>
                          ))}
                        </div>
                      </section>
                    );
                  })}
              </div>
            </article>
          ))}
        </section>
        <aside className="project-pack">
          <header>
            <div>
              <small>FIELD PACK</small>
              <h2>出发任务包</h2>
            </div>
            <PackageCheck size={18} />
          </header>
          {Object.entries(groupLabels).map(([group, label]) => {
            const items = active.packItems.filter(
              (item) => item.group === group,
            );
            return (
              <section key={group}>
                <h3>
                  {group === "sound" ? (
                    <Headphones size={13} />
                  ) : group === "safety" ? (
                    <ShieldCheck size={13} />
                  ) : (
                    <PackageCheck size={13} />
                  )}
                  {label}
                </h3>
                {items.map((item) => (
                  <button
                    key={item.id}
                    className={item.completed ? "done" : ""}
                    onClick={() => togglePack(active.id, item.id)}
                  >
                    <span>{item.completed && <Check size={12} />}</span>
                    {item.title}
                  </button>
                ))}
              </section>
            );
          })}
        </aside>
      </div>
      <section className="project-production-grid">
        <article>
          <header>
            <Film size={17} />
            <div>
              <small>MEDIA INGEST</small>
              <h2>素材接收</h2>
            </div>
            <span>
              {ingestItems.filter((item) => item.completed).length}/
              {ingestItems.length}
            </span>
          </header>
          <div className="project-workflow-checks">
            {ingestItems.map((item) => (
              <button
                key={item.id}
                className={item.completed ? "done" : ""}
                onClick={() => toggleWorkflow(active.id, "ingest", item.id)}
              >
                <span>{item.completed && <Check size={12} />}</span>
                {item.title}
              </button>
            ))}
          </div>
          <div className="media-batch-add">
            <input
              value={batchLabel}
              onChange={(event) => setBatchLabel(event.target.value)}
              placeholder="批次名称，例如 CARD-A"
            />
            <input
              value={batchDevice}
              onChange={(event) => setBatchDevice(event.target.value)}
              placeholder="来源设备"
            />
            <input
              value={batchCard}
              onChange={(event) => setBatchCard(event.target.value)}
              placeholder="存储卡编号"
            />
            <input
              type="number"
              min="0"
              value={batchFiles || ""}
              onChange={(event) => setBatchFiles(Number(event.target.value))}
              placeholder="文件数"
            />
            <input
              type="number"
              min="0"
              step="0.1"
              value={batchGB || ""}
              onChange={(event) => setBatchGB(Number(event.target.value))}
              placeholder="容量 GB"
            />
            <button
              disabled={!batchLabel.trim() || !batchDevice.trim()}
              onClick={() => {
                updateProject(active.id, {
                  mediaBatches: [
                    ...mediaBatches,
                    {
                      id: `${active.id}-media-${Date.now()}`,
                      label: batchLabel.trim(),
                      sourceDevice: batchDevice.trim(),
                      storageCard: batchCard.trim(),
                      fileCount: batchFiles,
                      totalGB: batchGB,
                      locationIds:
                        route?.waypoints.map((point) => point.id) ?? [],
                      primaryBackup: false,
                      secondaryBackup: false,
                      verified: false,
                      note: "",
                    },
                  ],
                });
                setBatchLabel("");
                setBatchCard("");
                setBatchFiles(0);
                setBatchGB(0);
              }}
            >
              <Plus size={12} />
              登记批次
            </button>
          </div>
          {mediaBatches.length ? (
            <div className="media-batch-list">
              {mediaBatches.map((batch) => (
                <section key={batch.id}>
                  <header>
                    <HardDrive size={14} />
                    <div>
                      <strong>{batch.label}</strong>
                      <small>
                        {batch.sourceDevice} · {batch.storageCard || "未编号"} ·{" "}
                        {batch.fileCount} 个文件 · {batch.totalGB} GB
                      </small>
                    </div>
                  </header>
                  <div className="media-batch-gates">
                    {(
                      [
                        ["primaryBackup", "主备份"],
                        ["secondaryBackup", "第二备份"],
                        ["verified", "读取验证"],
                      ] as const
                    ).map(([field, label]) => (
                      <button
                        key={field}
                        className={batch[field] ? "done" : ""}
                        onClick={() =>
                          updateProject(active.id, {
                            mediaBatches: mediaBatches.map((item) =>
                              item.id === batch.id
                                ? { ...item, [field]: !item[field] }
                                : item,
                            ),
                          })
                        }
                      >
                        <span>{batch[field] && <Check size={11} />}</span>
                        {label}
                      </button>
                    ))}
                  </div>
                  <label>
                    地点映射
                    <div>
                      {route?.waypoints.map((point) => (
                        <button
                          key={point.id}
                          className={
                            batch.locationIds.includes(point.id) ? "active" : ""
                          }
                          onClick={() =>
                            updateProject(active.id, {
                              mediaBatches: mediaBatches.map((item) =>
                                item.id === batch.id
                                  ? {
                                      ...item,
                                      locationIds: item.locationIds.includes(
                                        point.id,
                                      )
                                        ? item.locationIds.filter(
                                            (id) => id !== point.id,
                                          )
                                        : [...item.locationIds, point.id],
                                    }
                                  : item,
                              ),
                            })
                          }
                        >
                          {point.name}
                        </button>
                      ))}
                    </div>
                  </label>
                  <textarea
                    value={batch.note}
                    placeholder="坏片、缺失、时间码或特殊处理说明"
                    onChange={(event) =>
                      updateProject(active.id, {
                        mediaBatches: mediaBatches.map((item) =>
                          item.id === batch.id
                            ? { ...item, note: event.target.value }
                            : item,
                        ),
                      })
                    }
                  />
                </section>
              ))}
            </div>
          ) : (
            <p className="project-inline-empty">
              尚未登记实际素材批次；进入后期前至少登记一张卡并完成双备份与读取验证。
            </p>
          )}
        </article>
        <article>
          <header>
            <Music2 size={17} />
            <div>
              <small>VISION MUSIC</small>
              <h2>音乐许可台账</h2>
            </div>
            <span>{musicTracks.length} 首</span>
          </header>
          <div className="project-music-add">
            <input
              value={musicTitle}
              onChange={(event) => setMusicTitle(event.target.value)}
              placeholder="候选曲名"
            />
            <select
              value={musicPlatform}
              onChange={(event) => setMusicPlatform(event.target.value)}
            >
              <option>YouTube 音频库</option>
              <option>Epidemic Sound</option>
              <option>Artlist</option>
              <option>Uppbeat</option>
            </select>
            <button
              disabled={!musicTitle.trim()}
              onClick={() => {
                const track = {
                  id: `${active.id}-music-${Date.now()}`,
                  title: musicTitle.trim(),
                  platform: musicPlatform,
                  licenseStatus: "candidate" as const,
                  attribution: "",
                  licenseReference: "",
                  channel: "vision" as const,
                };
                updateProject(active.id, {
                  musicTracks: [...musicTracks, track],
                });
                setMusicTitle("");
              }}
            >
              <Plus size={13} />
              添加
            </button>
          </div>
          {musicTracks.length ? (
            <div className="project-track-list">
              {musicTracks.map((track) => (
                <section key={track.id} className="project-track-card">
                  <button
                    type="button"
                    onClick={() =>
                      updateProject(active.id, {
                        musicTracks: musicTracks.map((item) =>
                          item.id === track.id
                            ? {
                                ...item,
                                licenseStatus:
                                  item.licenseStatus === "candidate"
                                    ? "licensed"
                                    : item.licenseStatus === "licensed"
                                      ? "clearlisted"
                                      : "candidate",
                              }
                            : item,
                        ),
                      })
                    }
                    aria-label={`切换 ${track.title} 许可状态`}
                  >
                    <span className={track.licenseStatus} />
                    <div>
                      <strong>{track.title}</strong>
                      <small>
                        {track.platform} ·{" "}
                        {track.licenseStatus === "candidate"
                          ? "待许可"
                          : track.licenseStatus === "licensed"
                            ? "已取得许可"
                            : "已清除 Content ID"}
                      </small>
                    </div>
                  </button>
                  <label>
                    署名文本
                    <input
                      value={track.attribution}
                      placeholder="艺术家、曲名与许可要求"
                      onChange={(event) =>
                        updateProject(active.id, {
                          musicTracks: musicTracks.map((item) =>
                            item.id === track.id
                              ? { ...item, attribution: event.target.value }
                              : item,
                          ),
                        })
                      }
                    />
                  </label>
                  <label>
                    许可凭证
                    <input
                      value={track.licenseReference}
                      placeholder="订单号、文件名或授权页面"
                      onChange={(event) =>
                        updateProject(active.id, {
                          musicTracks: musicTracks.map((item) =>
                            item.id === track.id
                              ? {
                                  ...item,
                                  licenseReference: event.target.value,
                                }
                              : item,
                          ),
                        })
                      }
                    />
                  </label>
                </section>
              ))}
            </div>
          ) : (
            <p className="project-inline-empty">
              只记录 Vision 音乐；Ambience 始终保持无音乐。
            </p>
          )}
        </article>
        <article>
          <header>
            <Clapperboard size={17} />
            <div>
              <small>DELIVERY GATES</small>
              <h2>后期与交付质检</h2>
            </div>
            <span>
              {deliveryItems.filter((item) => item.completed).length}/
              {deliveryItems.length}
            </span>
          </header>
          <div className="project-workflow-checks">
            {deliveryItems.map((item) => (
              <button
                key={item.id}
                className={item.completed ? "done" : ""}
                onClick={() => toggleWorkflow(active.id, "delivery", item.id)}
              >
                <span>{item.completed && <Check size={12} />}</span>
                {item.title}
              </button>
            ))}
          </div>
          <button
            className="project-open-workbench"
            onClick={() => {
              const state = usePlannerStore.getState();
              if (state.postProject?.videoProjectId !== active.id)
                state.importPostWorkflow(davinciWorkflow, {
                  videoProjectId: active.id,
                  ...(active.planId ? { planId: active.planId } : {}),
                  routeId: active.routeId,
                  title: active.title,
                });
              state.setView("post");
            }}
          >
            打开达芬奇流程 <ChevronRight size={13} />
          </button>
        </article>
        <article>
          <header>
            <Send size={17} />
            <div>
              <small>PUBLISH PACKAGE</small>
              <h2>发布与复盘</h2>
            </div>
            <span>{publish.hdrVerified ? "HDR 已验证" : "待验证"}</span>
          </header>
          <div className="project-publish-fields">
            <label>
              Vision 标题
              <input
                value={publish.visionTitle}
                onChange={(event) =>
                  updateProject(active.id, {
                    publish: { ...publish, visionTitle: event.target.value },
                  })
                }
              />
            </label>
            <label>
              Ambience 标题
              <input
                value={publish.ambienceTitle}
                onChange={(event) =>
                  updateProject(active.id, {
                    publish: { ...publish, ambienceTitle: event.target.value },
                  })
                }
              />
            </label>
            <label>
              发布简介
              <textarea
                value={publish.description}
                onChange={(event) =>
                  updateProject(active.id, {
                    publish: { ...publish, description: event.target.value },
                  })
                }
              />
              <button
                type="button"
                className="publish-generate"
                onClick={() =>
                  updateProject(active.id, {
                    publish: {
                      ...publish,
                      description: generateProjectDescription(active, route),
                    },
                  })
                }
              >
                根据路线、设备、章节与音乐署名重新生成
              </button>
            </label>
            <label>
              章节
              <textarea
                value={publish.chapters}
                onChange={(event) =>
                  updateProject(active.id, {
                    publish: { ...publish, chapters: event.target.value },
                  })
                }
              />
            </label>
            <label>
              缩略图说明
              <textarea
                value={publish.thumbnailNote}
                onChange={(event) =>
                  updateProject(active.id, {
                    publish: { ...publish, thumbnailNote: event.target.value },
                  })
                }
              />
            </label>
            <div>
              <button
                className={publish.hdrVerified ? "done" : ""}
                onClick={() =>
                  updateProject(active.id, {
                    publish: { ...publish, hdrVerified: !publish.hdrVerified },
                  })
                }
              >
                <Check size={12} />
                2160p HDR
              </button>
              <button
                className={publish.visionPublished ? "done" : ""}
                onClick={() =>
                  updateProject(active.id, {
                    publish: {
                      ...publish,
                      visionPublished: !publish.visionPublished,
                    },
                  })
                }
              >
                Vision 已发布
              </button>
              <button
                className={publish.ambiencePublished ? "done" : ""}
                onClick={() =>
                  updateProject(active.id, {
                    publish: {
                      ...publish,
                      ambiencePublished: !publish.ambiencePublished,
                    },
                  })
                }
              >
                Ambience 已发布
              </button>
            </div>
            <section className="retrospective-metrics">
              <header>
                <div>
                  <small>7-DAY PERFORMANCE</small>
                  <strong>发布后表现</strong>
                </div>
                <span>填写 YouTube Studio 发布后 7 日数据</span>
              </header>
              <div>
                {(
                  [
                    ["views7d", "7 日播放", "次"],
                    ["clickThroughRate", "点击率", "%"],
                    ["averageViewMinutes", "平均观看", "分钟"],
                    ["averagePercentageViewed", "平均观看比例", "%"],
                  ] as const
                ).map(([field, label, unit]) => (
                  <label key={field}>
                    {label}
                    <span>
                      <input
                        type="number"
                        min="0"
                        step={field === "views7d" ? 1 : 0.1}
                        value={retrospective.metrics[field] || ""}
                        onChange={(event) =>
                          updateProject(active.id, {
                            retrospective: {
                              ...retrospective,
                              metrics: {
                                ...retrospective.metrics,
                                [field]: Number(event.target.value),
                              },
                            },
                          })
                        }
                      />
                      {unit}
                    </span>
                  </label>
                ))}
              </div>
              <label>
                高表现片段
                <input
                  value={retrospective.metrics.bestMoment}
                  onChange={(event) =>
                    updateProject(active.id, {
                      retrospective: {
                        ...retrospective,
                        metrics: {
                          ...retrospective.metrics,
                          bestMoment: event.target.value,
                        },
                      },
                    })
                  }
                  placeholder="例如 03:20 雨后高架反光"
                />
              </label>
              <label>
                明显流失位置
                <input
                  value={retrospective.metrics.dropoffMoment}
                  onChange={(event) =>
                    updateProject(active.id, {
                      retrospective: {
                        ...retrospective,
                        metrics: {
                          ...retrospective.metrics,
                          dropoffMoment: event.target.value,
                        },
                      },
                    })
                  }
                  placeholder="例如 00:42 重复红绿灯段"
                />
              </label>
            </section>
            <section className="retrospective-insights">
              <small>AUTOMATIC INSIGHTS</small>
              {retrospectiveInsights.map((insight) => (
                <p key={insight}>{insight}</p>
              ))}
            </section>
            <label>
              路线复盘
              <textarea
                value={retrospective.routeNote}
                onChange={(event) =>
                  updateProject(active.id, {
                    retrospective: {
                      ...retrospective,
                      routeNote: event.target.value,
                    },
                  })
                }
                placeholder="交通、机位、光线与未完成镜头"
              />
            </label>
            <label>
              相机参数复盘
              <textarea
                value={retrospective.cameraNote}
                onChange={(event) =>
                  updateProject(active.id, {
                    retrospective: {
                      ...retrospective,
                      cameraNote: event.target.value,
                    },
                  })
                }
                placeholder="曝光、白平衡、稳定、收音与设备问题"
              />
            </label>
            <label>
              剪辑复盘
              <textarea
                value={retrospective.editNote}
                onChange={(event) =>
                  updateProject(active.id, {
                    retrospective: {
                      ...retrospective,
                      editNote: event.target.value,
                    },
                  })
                }
                placeholder="节奏、调色、音乐与双频道差异"
              />
            </label>
            <label>
              发布表现
              <textarea
                value={retrospective.performanceNote}
                onChange={(event) =>
                  updateProject(active.id, {
                    retrospective: {
                      ...retrospective,
                      performanceNote: event.target.value,
                    },
                  })
                }
                placeholder="点击率、留存下降点和观众反馈"
              />
            </label>
            <label>
              下一次改进
              <textarea
                value={retrospective.nextAction}
                onChange={(event) =>
                  updateProject(active.id, {
                    retrospective: {
                      ...retrospective,
                      nextAction: event.target.value,
                    },
                  })
                }
                placeholder="形成一条可执行的下一步"
              />
            </label>
          </div>
        </article>
      </section>
    </main>
  );
}
