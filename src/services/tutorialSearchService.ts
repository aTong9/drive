const normalizeSearchText = (value: string) =>
  value
    .normalize("NFKC")
    .toLocaleLowerCase("zh-CN")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

const collectSearchValues = (value: unknown): string[] => {
  if (typeof value === "string" || typeof value === "number") {
    return [String(value)];
  }
  if (Array.isArray(value)) return value.flatMap(collectSearchValues);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectSearchValues);
  }
  return [];
};

const matchesToken = (searchText: string, token: string) => {
  if (searchText.includes(token)) return true;
  if (!/^[\p{Script=Han}]+$/u.test(token) || [...token].length < 2) {
    return false;
  }
  return [...new Set(token)].every((character) =>
    searchText.includes(character),
  );
};

export const buildTutorialSearchText = (value: unknown) =>
  normalizeSearchText(collectSearchValues(value).join(" "));

export const matchesTutorialSearch = (value: unknown, query: string) => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;
  const searchText = buildTutorialSearchText(value);
  return normalizedQuery
    .split(/\s+/)
    .every((token) => matchesToken(searchText, token));
};
