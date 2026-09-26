import { useState, useSyncExternalStore } from "react";
import { usePlannerStore } from "../../app/store.js";
import { deviceStorage } from "../../services/deviceStorage.js";
import { parseDeviceBackup, selectDeviceState, serializeDeviceBackup, type DeviceState } from "../../services/deviceStateService.js";
import { localDateInput } from "../../services/localDate.js";

function download(source: string, name: string) {
  const url = URL.createObjectURL(new Blob([source], { type: "application/json;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function LocalDataTools() {
  const status = useSyncExternalStore(deviceStorage.subscribe, deviceStorage.getStatus, deviceStorage.getStatus);
  const [pending, setPending] = useState<DeviceState | null>(null);
  const [message, setMessage] = useState("");
  const exportBackup = () => {
    try {
      download(serializeDeviceBackup(usePlannerStore.getState()), `roadlens-backup-${localDateInput()}.json`);
      setMessage("已生成完整备份，请确认下载文件已保存。");
    } catch (error) { setMessage(error instanceof Error ? error.message : "备份生成失败"); }
  };
  const importBackup = async (file: File) => {
    setPending(null);
    setMessage("");
    try { setPending(parseDeviceBackup(await file.text())); }
    catch (error) { setMessage(error instanceof Error ? error.message : "备份读取失败，现有资料未变更"); }
  };
  const restore = () => {
    if (!pending) return;
    try {
      const restored = deviceStorage.replace(pending);
      usePlannerStore.setState(restored);
      setPending(null);
      setMessage("完整备份已恢复并保存到当前设备。");
    } catch (error) { setMessage(`恢复未完成，现有资料未变更。${error instanceof Error ? error.message : "请检查存储空间与权限"}`); }
  };
  return <aside className="local-data-tools" aria-label="本地资料与备份">
    {status.kind !== "ready" && <div className="local-data-warning" role="alert">
      <strong>{status.kind === "read-error" ? "原资料需要恢复" : "最新修改尚未保存"}</strong>
      <p>{status.message}</p>
      <p>当前工作内容仍可操作；刷新或关闭前，请先导出完整备份。</p>
      <div className="local-data-actions">
        <button type="button" onClick={exportBackup}>导出当前工作备份</button>
        {status.original !== null && <button type="button" onClick={() => download(status.original!, `roadlens-original-${localDateInput()}.json`)}>下载原始恢复资料</button>}
        <button type="button" onClick={() => status.kind === "read-error"
          ? void usePlannerStore.persist.rehydrate()
          : deviceStorage.retry(selectDeviceState(usePlannerStore.getState()))}>
          {status.kind === "read-error" ? "重新读取原资料" : "重试保存"}
        </button>
      </div>
    </div>}
    <details>
      <summary>本地资料与完整备份</summary>
      <p>备份包含拍摄计划、视频项目、实地核验、后期进度、GPX、长片草稿、收藏和个人相机设置。</p>
      <div className="local-data-actions">
        <button type="button" onClick={exportBackup}>导出完整备份</button>
        <label>选择完整备份<input type="file" accept="application/json,.json" onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void importBackup(file);
        }} /></label>
      </div>
      {pending && <div className="local-data-restore">
        <p>已校验：{pending.plans.length} 条计划、{pending.videoProjects.length} 个项目、{pending.fieldChecks.length} 条核验、{Object.keys(pending.postArchives).length} 份后期存档。</p>
        <p>恢复会替换当前全部本地资料。建议先导出当前备份。</p>
        <button type="button" onClick={restore}>用此备份恢复全部资料</button>
        <button type="button" onClick={() => setPending(null)}>取消恢复</button>
      </div>}
      <p role="status">{message}</p>
    </details>
  </aside>;
}
