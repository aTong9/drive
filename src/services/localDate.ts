export function localDateInput(date = new Date(), offsetDays = 0): string {
  const local = new Date(date);
  local.setDate(local.getDate() + offsetDays);
  return `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, "0")}-${String(local.getDate()).padStart(2, "0")}`;
}
