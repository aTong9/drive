import type {
  LocalShootPlan,
  LocalVideoProject,
  ProjectPackItem,
  ProjectShot,
  ResolvedRoute,
  VideoProjectStatus,
} from "../types/domain.js";

const purposeLabels = {
  establishing: "建立镜头",
  movement: "连续运动",
  detail: "环境细节",
  sound: "独立环境声",
  transition: "转场镜头",
  thumbnail: "封面候选",
} as const;

export function buildVideoProject(
  plan: LocalShootPlan,
  route: ResolvedRoute,
): LocalVideoProject {
  const createdAt = new Date().toISOString();
  const shots: ProjectShot[] = route.waypoints.flatMap(
    (location, locationIndex) => {
      const purposes: ProjectShot["purpose"][] =
        route.route.executionMode === "drive-only"
          ? [
              "establishing",
              "movement",
              ...(locationIndex === 0 ? ["sound" as const] : []),
              ...(locationIndex === route.waypoints.length - 1
                ? ["thumbnail" as const]
                : []),
            ]
          : [
              "establishing",
              "detail",
              "sound",
              ...(locationIndex === route.waypoints.length - 1
                ? ["thumbnail" as const]
                : []),
            ];
      return purposes.map((purpose, index) => {
        const presetId =
          route.cameraPresets[index % Math.max(route.cameraPresets.length, 1)]
            ?.id;
        return {
          id: `${plan.id}-${location.id}-${purpose}`,
          locationId: location.id,
          title: `${location.name} · ${purposeLabels[purpose]}`,
          purpose,
          ...(presetId ? { devicePresetId: presetId } : {}),
          targetSeconds:
            purpose === "sound" ? 30 : purpose === "movement" ? 20 : 8,
          completed: false,
          captureStatus: "pending",
          note:
            purpose === "sound"
              ? location.soundEnvironment.recordingAdvice
              : location.shooting.advice,
        };
      });
    },
  );
  const pack = (group: ProjectPackItem["group"], titles: string[]) =>
    titles.map((title, index) => ({
      id: `${plan.id}-${group}-${index + 1}`,
      group,
      title,
      completed: false,
    }));
  const packItems = [
    ...pack("route", [
      "高德路线可正常打开，起终点与途经点无误",
      "下载离线地图并保存停车/步行边界",
      "确认开放、预约、施工和临时交通管制",
    ]),
    ...pack("gear", [
      "相机、支架、镜片和收音设备完成安装测试",
      "电池、持续供电和备用线缆齐全",
      "相机参数、时间和存储卡格式已复核",
    ]),
    ...pack("weather", [
      "天气、日出日落、风力和降雨窗口已复核",
      "准备可执行的坏天气替代方案",
    ]),
    ...pack("safety", [
      "纯驾设备出发前固定且驾驶者无需操作",
      "取消条件、返程时间和紧急联系人已确认",
    ]),
    ...pack("sound", [
      "录制 30 秒环境底噪并监听风噪",
      "关闭设备提示音和不必要的无线通知",
    ]),
    ...pack("storage", [
      "估算码率、拍摄时长和至少 20% 存储余量",
      "建立双份备份和素材命名规则",
    ]),
  ];
  const ingestItems = [
    "建立 VIDEO / AUDIO / MUSIC / STILLS / EXPORTS 文件夹",
    "核对全部素材分辨率、帧率、色彩配置与音频采样率",
    "完成两份独立备份并验证可读取",
    "标记损坏、失焦、抖动、过曝和缺失素材",
    "把路线地点映射到素材时间段",
  ].map((title, index) => ({
    id: `${plan.id}-ingest-${index + 1}`,
    title,
    completed: false,
    note: "",
  }));
  const deliveryItems = [
    "Picture Master 已锁画",
    "aBin Vision 与 Ambience 画面长度一致",
    "Vision 音乐许可和署名已复核",
    "响度、True Peak 与三端试听通过",
    "HEVC Main10 / BT.2020 / PQ 元数据通过",
    "YouTube 已显示 2160p HDR",
  ].map((title, index) => ({
    id: `${plan.id}-delivery-${index + 1}`,
    title,
    completed: false,
    note: "",
  }));
  return {
    id: `project-${plan.id}`,
    planId: plan.id,
    routeId: route.route.id,
    title: route.route.name,
    objective: plan.objective,
    scheduledDate: plan.scheduledDate,
    channelMode: "dual",
    status: "planning",
    shots,
    packItems,
    ingestItems,
    mediaBatches: [],
    musicTracks: [],
    deliveryItems,
    publish: {
      visionTitle: `${route.route.name} | 4K HDR Night Drive`,
      ambienceTitle: `${route.route.name} | Natural Road Sounds 4K HDR`,
      description: plan.objective,
      chapters: route.waypoints
        .map(
          (point, index) => `${index === 0 ? "00:00" : "待填写"} ${point.name}`,
        )
        .join("\n"),
      thumbnailNote: "使用真实视频单帧，仅保留小型 4K HDR 标识",
      hdrVerified: false,
      visionPublished: false,
      ambiencePublished: false,
    },
    retrospective: {
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
    },
    createdAt,
    updatedAt: createdAt,
  };
}

export function exportVideoProject(project: LocalVideoProject) {
  const payload = {
    exportType: "roadlens-video-project",
    exportVersion: "1.0.0",
    exportedAt: new Date().toISOString(),
    project,
  };
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${project.id}-shoot-pack.json`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function getNextProjectAction(project: LocalVideoProject) {
  if (project.status === "planning" || project.status === "ready")
    return (
      project.packItems.find((item) => !item.completed)?.title ??
      "确认出发并开始拍摄"
    );
  if (project.status === "shooting")
    return (
      project.shots.find(
        (shot) => !shot.captureStatus || shot.captureStatus === "pending",
      )?.title ??
      (project.shots.find((shot) => shot.captureStatus === "missed")
        ? `处理漏拍 · ${project.shots.find((shot) => shot.captureStatus === "missed")?.title}`
        : undefined) ??
      "拍摄完成，进入素材接收"
    );
  if (project.status === "ingest")
    return (
      project.ingestItems.find((item) => !item.completed)?.title ??
      "素材接收完成，建立 Picture Master"
    );
  if (project.status === "editing")
    return (
      project.deliveryItems.find((item) => !item.completed)?.title ??
      "进入双频道交付质检"
    );
  if (project.status === "review") {
    if (!project.publish.hdrVerified) return "等待 YouTube 显示 2160p HDR";
    if (!project.publish.visionPublished) return "发布 aBin Vision";
    if (!project.publish.ambiencePublished) return "错峰发布 aBin Ambience";
    return "记录项目复盘并标记已发布";
  }
  return project.retrospective.nextAction || "根据复盘建立下一条视频项目";
}

export interface ProjectProgressSummary {
  completed: number;
  total: number;
  percent: number;
  sections: Array<{
    id: "field" | "ingest" | "music" | "delivery" | "publish" | "retrospective";
    label: string;
    completed: number;
    total: number;
  }>;
}

export function getProjectProgress(
  project: LocalVideoProject,
): ProjectProgressSummary {
  const musicCompleted = project.musicTracks.filter(
    (track) =>
      track.licenseStatus !== "candidate" &&
      Boolean(track.licenseReference.trim()),
  ).length;
  const publishChecks = [
    project.publish.visionTitle,
    project.publish.ambienceTitle,
    project.publish.description,
    project.publish.chapters,
    project.publish.thumbnailNote,
    project.publish.hdrVerified,
    project.publish.visionPublished,
    project.publish.ambiencePublished,
  ];
  const retrospectiveChecks = [
    project.retrospective.routeNote,
    project.retrospective.cameraNote,
    project.retrospective.editNote,
    project.retrospective.performanceNote,
    project.retrospective.nextAction,
    project.retrospective.metrics.bestMoment,
    project.retrospective.metrics.dropoffMoment,
    project.retrospective.metrics.views7d > 0,
    project.retrospective.metrics.clickThroughRate > 0,
    project.retrospective.metrics.averageViewMinutes > 0,
    project.retrospective.metrics.averagePercentageViewed > 0,
  ];
  const batchChecks = project.mediaBatches.flatMap((batch) => [
    batch.primaryBackup,
    batch.secondaryBackup,
    batch.verified,
  ]);
  const sections: ProjectProgressSummary["sections"] = [
    {
      id: "field",
      label: "拍摄执行",
      completed:
        project.shots.filter(
          (item) =>
            item.captureStatus === "captured" ||
            item.captureStatus === "waived",
        ).length + project.packItems.filter((item) => item.completed).length,
      total: project.shots.length + project.packItems.length,
    },
    {
      id: "ingest",
      label: "素材接收",
      completed:
        project.ingestItems.filter((item) => item.completed).length +
        batchChecks.filter(Boolean).length,
      total:
        project.ingestItems.length +
        batchChecks.length +
        (project.mediaBatches.length ? 0 : 1),
    },
    {
      id: "music",
      label: "音乐许可",
      completed: musicCompleted,
      total: project.musicTracks.length,
    },
    {
      id: "delivery",
      label: "后期质检",
      completed: project.deliveryItems.filter((item) => item.completed).length,
      total: project.deliveryItems.length,
    },
    {
      id: "publish",
      label: "发布资料",
      completed: publishChecks.filter(Boolean).length,
      total: publishChecks.length,
    },
    {
      id: "retrospective",
      label: "项目复盘",
      completed: retrospectiveChecks.filter((value) =>
        typeof value === "boolean" ? value : value.trim(),
      ).length,
      total: retrospectiveChecks.length,
    },
  ];
  const completed = sections.reduce(
    (sum, section) => sum + section.completed,
    0,
  );
  const total = sections.reduce((sum, section) => sum + section.total, 0);
  return {
    completed,
    total,
    percent: Math.round((completed / Math.max(total, 1)) * 100),
    sections,
  };
}

export function getStageGateIssues(
  project: LocalVideoProject,
  target: VideoProjectStatus,
): string[] {
  const targetIndex = [
    "planning",
    "ready",
    "shooting",
    "ingest",
    "editing",
    "review",
    "published",
  ].indexOf(target);
  const issues: string[] = [];
  if (targetIndex >= 1 && project.packItems.some((item) => !item.completed))
    issues.push(
      `出发任务包还有 ${project.packItems.filter((item) => !item.completed).length} 项未完成`,
    );
  if (
    targetIndex >= 3 &&
    project.shots.some(
      (item) =>
        !item.captureStatus ||
        item.captureStatus === "pending" ||
        item.captureStatus === "missed",
    )
  )
    issues.push(
      `镜头清单还有 ${project.shots.filter((item) => !item.captureStatus || item.captureStatus === "pending").length} 项待拍、${project.shots.filter((item) => item.captureStatus === "missed").length} 项漏拍待处理`,
    );
  if (targetIndex >= 4 && project.ingestItems.some((item) => !item.completed))
    issues.push(
      `素材接收还有 ${project.ingestItems.filter((item) => !item.completed).length} 项未完成`,
    );
  if (targetIndex >= 4 && project.mediaBatches.length === 0)
    issues.push("尚未登记任何素材批次");
  if (
    targetIndex >= 4 &&
    project.mediaBatches.some(
      (batch) =>
        !batch.primaryBackup || !batch.secondaryBackup || !batch.verified,
    )
  )
    issues.push(
      `还有 ${project.mediaBatches.filter((batch) => !batch.primaryBackup || !batch.secondaryBackup || !batch.verified).length} 个素材批次未完成双备份与读取验证`,
    );
  if (targetIndex >= 5 && project.deliveryItems.some((item) => !item.completed))
    issues.push(
      `交付质检还有 ${project.deliveryItems.filter((item) => !item.completed).length} 项未完成`,
    );
  if (
    targetIndex >= 5 &&
    project.musicTracks.some(
      (track) =>
        track.licenseStatus === "candidate" || !track.licenseReference.trim(),
    )
  )
    issues.push("Vision 音乐仍有许可状态或凭证缺口");
  if (targetIndex >= 6 && !project.publish.hdrVerified)
    issues.push("YouTube 2160p HDR 尚未验证");
  if (
    targetIndex >= 6 &&
    (!project.publish.visionPublished || !project.publish.ambiencePublished)
  )
    issues.push("Vision 与 Ambience 尚未全部发布");
  if (targetIndex >= 6 && !project.retrospective.nextAction.trim())
    issues.push("尚未形成下一次可执行改进");
  return issues;
}

export function normalizeVideoProject(
  value: LocalVideoProject,
): LocalVideoProject {
  return {
    ...value,
    shots: (value.shots ?? []).map((shot) => ({
      ...shot,
      captureStatus:
        shot.captureStatus ?? (shot.completed ? "captured" : "pending"),
      completed: shot.captureStatus
        ? shot.captureStatus === "captured"
        : shot.completed,
    })),
    ingestItems: value.ingestItems ?? [],
    mediaBatches: (value.mediaBatches ?? []).map((batch) => ({
      ...batch,
      storageCard: batch.storageCard ?? "",
      fileCount: Number(batch.fileCount) || 0,
      totalGB: Number(batch.totalGB) || 0,
      locationIds: batch.locationIds ?? [],
      primaryBackup: Boolean(batch.primaryBackup),
      secondaryBackup: Boolean(batch.secondaryBackup),
      verified: Boolean(batch.verified),
      note: batch.note ?? "",
    })),
    musicTracks: (value.musicTracks ?? []).map((track) => ({
      ...track,
      attribution: track.attribution ?? "",
      licenseReference: track.licenseReference ?? "",
    })),
    deliveryItems: value.deliveryItems ?? [],
    publish: value.publish ?? {
      visionTitle: "",
      ambienceTitle: "",
      description: value.objective,
      chapters: "",
      thumbnailNote: "使用真实视频单帧",
      hdrVerified: false,
      visionPublished: false,
      ambiencePublished: false,
    },
    retrospective: {
      routeNote: value.retrospective?.routeNote ?? "",
      cameraNote: value.retrospective?.cameraNote ?? "",
      editNote: value.retrospective?.editNote ?? "",
      performanceNote: value.retrospective?.performanceNote ?? "",
      nextAction: value.retrospective?.nextAction ?? "",
      metrics: {
        views7d: Number(value.retrospective?.metrics?.views7d) || 0,
        clickThroughRate:
          Number(value.retrospective?.metrics?.clickThroughRate) || 0,
        averageViewMinutes:
          Number(value.retrospective?.metrics?.averageViewMinutes) || 0,
        averagePercentageViewed:
          Number(value.retrospective?.metrics?.averagePercentageViewed) || 0,
        bestMoment: value.retrospective?.metrics?.bestMoment ?? "",
        dropoffMoment: value.retrospective?.metrics?.dropoffMoment ?? "",
      },
    },
  };
}

export function getRetrospectiveInsights(project: LocalVideoProject): string[] {
  const { metrics } = project.retrospective;
  const insights: string[] = [];
  if (metrics.clickThroughRate > 0 && metrics.clickThroughRate < 4)
    insights.push("点击率偏低：下次优先重做缩略图主体与标题承诺");
  if (metrics.clickThroughRate >= 6)
    insights.push("标题与缩略图表现良好：保留当前视觉包装结构");
  if (
    metrics.averagePercentageViewed > 0 &&
    metrics.averagePercentageViewed < 30
  )
    insights.push("平均观看比例偏低：压缩开场并提前进入核心路段");
  if (metrics.averagePercentageViewed >= 45)
    insights.push("观看留存健康：可复用当前路线节奏与段落长度");
  if (metrics.bestMoment.trim())
    insights.push(`高表现片段：${metrics.bestMoment.trim()}，下次增加同类镜头`);
  if (metrics.dropoffMoment.trim())
    insights.push(
      `流失位置：${metrics.dropoffMoment.trim()}，复核转场、音乐或画面重复`,
    );
  if (project.retrospective.nextAction.trim())
    insights.push(`已确认行动：${project.retrospective.nextAction.trim()}`);
  return insights.length
    ? insights
    : ["发布后填写 7 日表现数据，系统将生成下一次改进建议"];
}

export function hasRetrospectiveData(project: LocalVideoProject): boolean {
  const metrics = project.retrospective.metrics;
  return Boolean(
    project.retrospective.nextAction.trim() ||
    metrics.bestMoment.trim() ||
    metrics.dropoffMoment.trim() ||
    metrics.views7d > 0 ||
    metrics.clickThroughRate > 0 ||
    metrics.averageViewMinutes > 0 ||
    metrics.averagePercentageViewed > 0,
  );
}

export function generateProjectDescription(
  project: LocalVideoProject,
  route?: ResolvedRoute,
): string {
  const locationLine = route?.waypoints.length
    ? `路线地点：${route.waypoints.map((point) => point.name).join(" → ")}`
    : "";
  const cameraLine = route?.cameraPresets.length
    ? `拍摄设备：${[...new Set(route.cameraPresets.map((preset) => preset.camera))].join("、")}`
    : "";
  const attribution = project.musicTracks
    .filter((track) => track.attribution.trim())
    .map((track) => `${track.title} — ${track.attribution.trim()}`)
    .join("\n");
  return [
    project.objective,
    locationLine,
    cameraLine,
    project.publish.chapters ? `章节：\n${project.publish.chapters}` : "",
    attribution ? `音乐署名：\n${attribution}` : "",
    "aBin Vision：道路环境声与授权音乐\naBin Ambience：真实道路环境声，无音乐",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function validateVideoProject(
  value: unknown,
): value is LocalVideoProject {
  if (!value || typeof value !== "object") return false;
  const project = value as Partial<LocalVideoProject>;
  const strings = [
    project.id,
    project.routeId,
    project.title,
    project.objective,
    project.scheduledDate,
    project.createdAt,
    project.updatedAt,
  ];
  const validStatus = [
    "planning",
    "ready",
    "shooting",
    "ingest",
    "editing",
    "review",
    "published",
  ].includes(project.status ?? "");
  const validMode = ["vision", "ambience", "dual"].includes(
    project.channelMode ?? "",
  );
  return (
    strings.every((item) => typeof item === "string" && item.length > 0) &&
    validStatus &&
    validMode &&
    Array.isArray(project.shots) &&
    project.shots.every(
      (shot) =>
        typeof shot?.id === "string" &&
        typeof shot?.locationId === "string" &&
        typeof shot?.completed === "boolean",
    ) &&
    Array.isArray(project.packItems) &&
    project.packItems.every(
      (item) =>
        typeof item?.id === "string" &&
        typeof item?.title === "string" &&
        typeof item?.completed === "boolean",
    ) &&
    (!project.ingestItems || Array.isArray(project.ingestItems)) &&
    (!project.mediaBatches || Array.isArray(project.mediaBatches)) &&
    (!project.mediaBatches ||
      project.mediaBatches.every(
        (batch) =>
          typeof batch?.id === "string" &&
          typeof batch?.label === "string" &&
          typeof batch?.sourceDevice === "string" &&
          Array.isArray(batch?.locationIds),
      )) &&
    (!project.musicTracks || Array.isArray(project.musicTracks)) &&
    (!project.deliveryItems || Array.isArray(project.deliveryItems))
  );
}

export async function importVideoProject(file: File) {
  const payload = JSON.parse(await file.text()) as {
    exportType?: string;
    exportVersion?: string;
    project?: LocalVideoProject;
  };
  if (
    payload.exportType !== "roadlens-video-project" ||
    payload.exportVersion !== "1.0.0" ||
    !payload.project
  )
    throw new Error("不是受支持的 RoadLens 视频项目文件");
  if (!validateVideoProject(payload.project))
    throw new Error("视频项目数据契约校验失败，请检查核心字段、状态与清单结构");
  return normalizeVideoProject(payload.project);
}
