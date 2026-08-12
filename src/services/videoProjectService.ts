import type { LocalShootPlan, LocalVideoProject, ProjectPackItem, ProjectShot, ResolvedRoute } from "../types/domain.js";

const purposeLabels = { establishing: "建立镜头", movement: "连续运动", detail: "环境细节", sound: "独立环境声", transition: "转场镜头", thumbnail: "封面候选" } as const;

export function buildVideoProject(plan: LocalShootPlan, route: ResolvedRoute): LocalVideoProject {
  const createdAt = new Date().toISOString();
  const shots: ProjectShot[] = route.waypoints.flatMap((location, locationIndex) => {
    const purposes: ProjectShot["purpose"][] = route.route.executionMode === "drive-only"
      ? ["establishing", "movement", ...(locationIndex === 0 ? ["sound" as const] : []), ...(locationIndex === route.waypoints.length - 1 ? ["thumbnail" as const] : [])]
      : ["establishing", "detail", "sound", ...(locationIndex === route.waypoints.length - 1 ? ["thumbnail" as const] : [])];
    return purposes.map((purpose, index) => ({ id: `${plan.id}-${location.id}-${purpose}`, locationId: location.id, title: `${location.name} · ${purposeLabels[purpose]}`, purpose, devicePresetId: route.cameraPresets[index % Math.max(route.cameraPresets.length, 1)]?.id, targetSeconds: purpose === "sound" ? 30 : purpose === "movement" ? 20 : 8, completed: false, note: purpose === "sound" ? location.soundEnvironment.recordingAdvice : location.shooting.advice }));
  });
  const pack = (group: ProjectPackItem["group"], titles: string[]) => titles.map((title, index) => ({ id: `${plan.id}-${group}-${index + 1}`, group, title, completed: false }));
  const packItems = [
    ...pack("route", ["高德路线可正常打开，起终点与途经点无误", "下载离线地图并保存停车/步行边界", "确认开放、预约、施工和临时交通管制"]),
    ...pack("gear", ["相机、支架、镜片和收音设备完成安装测试", "电池、持续供电和备用线缆齐全", "相机参数、时间和存储卡格式已复核"]),
    ...pack("weather", ["天气、日出日落、风力和降雨窗口已复核", "准备可执行的坏天气替代方案"]),
    ...pack("safety", ["纯驾设备出发前固定且驾驶者无需操作", "取消条件、返程时间和紧急联系人已确认"]),
    ...pack("sound", ["录制 30 秒环境底噪并监听风噪", "关闭设备提示音和不必要的无线通知"]),
    ...pack("storage", ["估算码率、拍摄时长和至少 20% 存储余量", "建立双份备份和素材命名规则"])
  ];
  return { id: `project-${plan.id}`, planId: plan.id, routeId: route.route.id, title: route.route.name, objective: plan.objective, scheduledDate: plan.scheduledDate, channelMode: "dual", status: "planning", shots, packItems, createdAt, updatedAt: createdAt };
}

export function exportVideoProject(project: LocalVideoProject) {
  const payload = { exportType: "roadlens-video-project", exportVersion: "1.0.0", exportedAt: new Date().toISOString(), project };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${project.id}-shoot-pack.json`; document.body.append(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url);
}
