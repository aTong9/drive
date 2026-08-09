import directory from "../../data/regions.json" with { type: "json" };

export interface AdministrativeDivision {
  name: string;
  label: string;
}

export interface AdministrativeProvince extends AdministrativeDivision {
  divisions: AdministrativeDivision[];
}

export const administrativeProvinces = directory.provinces as AdministrativeProvince[];

export const administrativeGroups = [
  { id: "north", label: "华北", provinces: ["北京", "天津", "河北", "山西", "内蒙古"] },
  { id: "northeast", label: "东北", provinces: ["辽宁", "吉林", "黑龙江"] },
  { id: "east", label: "华东", provinces: ["上海", "江苏", "浙江", "安徽", "福建", "江西", "山东", "台湾"] },
  { id: "central-south", label: "中南", provinces: ["河南", "湖北", "湖南", "广东", "广西", "海南", "香港", "澳门"] },
  { id: "southwest", label: "西南", provinces: ["重庆", "四川", "贵州", "云南", "西藏"] },
  { id: "northwest", label: "西北", provinces: ["陕西", "甘肃", "青海", "宁夏", "新疆"] }
] as const;

export type AdministrativeGroupId = typeof administrativeGroups[number]["id"];

export const administrativeDivisionCount = administrativeProvinces.reduce((total, province) => total + province.divisions.length, 0);

export function provincesForGroup(groupId: AdministrativeGroupId | "all") {
  if (groupId === "all") return administrativeProvinces;
  const group = administrativeGroups.find((item) => item.id === groupId);
  return administrativeProvinces.filter((province) => group?.provinces.includes(province.name as never));
}

export function findProvince(name: string | undefined) {
  return administrativeProvinces.find((province) => province.name === name);
}

export function provinceLabel(name: string | undefined) {
  return findProvince(name)?.label ?? name ?? "";
}

export function divisionLabel(provinceName: string | undefined, divisionName: string | undefined) {
  return findProvince(provinceName)?.divisions.find((division) => division.name === divisionName)?.label ?? divisionName ?? "";
}

function matchesAdministrativeName(value: string, name: string, label: string) {
  return value === name || value === label || value.includes(label) || label.includes(value);
}

export function resolveAdministrativeRegion(provinceValue: string, cityValue: string) {
  const province = administrativeProvinces.find((item) => matchesAdministrativeName(provinceValue, item.name, item.label));
  if (!province) return null;
  const municipalityCity = ["北京", "天津", "上海", "重庆", "香港", "澳门"].includes(province.name) ? province.name : cityValue;
  const division = province.divisions.find((item) => matchesAdministrativeName(municipalityCity, item.name, item.label));
  return division ? { province: province.name, city: division.name } : null;
}
