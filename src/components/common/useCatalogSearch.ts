import { useEffect, useState } from "react";
import { loadCatalogSearch } from "../../services/browserCatalogService.js";

export function useCatalogSearch(query: string) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!query.trim() || ready) return;
    let cancelled = false;
    setError("");
    void loadCatalogSearch().then(
      () => { if (!cancelled) setReady(true); },
      () => { if (!cancelled) setError("搜索资料未能加载，请重试。"); },
    );
    return () => { cancelled = true; };
  }, [query, ready, attempt]);
  return { ready: !query.trim() || ready, error, retry: () => setAttempt((value) => value + 1) };
}
