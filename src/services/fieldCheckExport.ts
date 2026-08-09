import type { FieldCheck, Location } from "../types/domain.js";

interface FieldCheckExport {
  exportType: "roadlens-field-checks";
  exportVersion: "1.0.0";
  catalogSchemaVersion: string;
  exportedAt: string;
  records: Array<{
    location: Pick<Location, "id" | "name" | "province" | "city" | "type" | "coordinate" | "access">;
    fieldCheck: FieldCheck;
  }>;
}

export async function importFieldChecks(file: File, catalogSchemaVersion: string, locations: Location[]) {
  const value: unknown = JSON.parse(await file.text());
  if (!value || typeof value !== "object") throw new Error("文件不是有效的核验数据对象");
  const payload = value as Partial<FieldCheckExport>;
  if (payload.exportType !== "roadlens-field-checks" || payload.exportVersion !== "1.0.0") throw new Error("不支持的核验导出格式");
  if (payload.catalogSchemaVersion !== catalogSchemaVersion) throw new Error(`契约版本不匹配：需要 ${catalogSchemaVersion}`);
  if (!Array.isArray(payload.records)) throw new Error("缺少核验记录数组");
  const locationIds = new Set(locations.map((location) => location.id));
  const checks: FieldCheck[] = [];
  for (const record of payload.records) {
    const check = record?.fieldCheck;
    if (!check || !locationIds.has(check.locationId)) throw new Error(`记录引用了未知地点：${check?.locationId ?? "空"}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(check.visitedAt) || !check.updatedAt || typeof check.overallNote !== "string") throw new Error(`地点 ${check.locationId} 的核验字段不完整`);
    checks.push(check);
  }
  return checks;
}

export function downloadFieldChecks(catalogSchemaVersion: string, locations: Location[], checks: FieldCheck[]) {
  const locationsById = new Map(locations.map((location) => [location.id, location]));
  const records: FieldCheckExport["records"] = [];

  for (const fieldCheck of checks) {
    const location = locationsById.get(fieldCheck.locationId);
    if (!location) continue;
    records.push({
      location: {
        id: location.id,
        name: location.name,
        province: location.province,
        city: location.city,
        type: location.type,
        coordinate: location.coordinate,
        access: location.access
      },
      fieldCheck
    });
  }

  const payload: FieldCheckExport = {
    exportType: "roadlens-field-checks",
    exportVersion: "1.0.0",
    catalogSchemaVersion,
    exportedAt: new Date().toISOString(),
    records
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `roadlens-field-checks-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
