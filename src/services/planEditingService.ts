export function validatePlanEdit(scheduledDate: string, objective: string): string | null {
  const date = new Date(`${scheduledDate}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(scheduledDate) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== scheduledDate)
    return "请选择有效的拍摄日期";
  if (!objective.trim()) return "请填写拍摄目标";
  return null;
}
