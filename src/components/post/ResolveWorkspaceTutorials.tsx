import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Search, X } from "lucide-react";
import type { DavinciStageId } from "../../types/domain.js";
import {
  getResolveTutorialsForWorkspace,
  resolveTutorialWorkspaceLabels,
} from "../../data/resolveTutorialCatalog.js";
import { matchesTutorialSearch } from "../../services/tutorialSearchService.js";

export function ResolveWorkspaceTutorials({
  workspace,
}: {
  workspace: DavinciStageId;
}) {
  const tutorials = useMemo(
    () => getResolveTutorialsForWorkspace(workspace),
    [workspace],
  );
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState("");
  const visibleTutorials = tutorials.filter((tutorial) =>
    matchesTutorialSearch(
      [
        tutorial.category,
        tutorial.title,
        tutorial.goal,
        tutorial.scenario,
        ...tutorial.settings,
        ...tutorial.steps,
      ]
        .join(" ")
        .toLocaleLowerCase("zh-CN"),
      query.trim(),
    ),
  );

  return (
    <section
      className="resolve-practical-tutorials resolve-workspace-tutorials"
      id={workspace === "color" ? "resolve-tutorial-center" : undefined}
    >
      <header>
        <div>
          <small>{resolveTutorialWorkspaceLabels[workspace]}</small>
          <h3>{resolveTutorialWorkspaceLabels[workspace]}实操教程</h3>
          <p>
            教程只出现在实际操作所属的工作区，包含场景、步骤、参数起点、通过标准和失败处理。
          </p>
        </div>
        <strong>{tutorials.length} 个教程</strong>
      </header>

      {tutorials.length > 0 ? (
        <>
          <label className="resolve-tutorial-search">
            <Search size={13} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`搜索${resolveTutorialWorkspaceLabels[workspace]}教程…`}
              aria-label={`搜索${resolveTutorialWorkspaceLabels[workspace]}教程`}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="清除教程搜索"
              >
                <X size={12} />
              </button>
            )}
          </label>
          <p className="resolve-tutorial-result" aria-live="polite">
            当前显示 {visibleTutorials.length} 个教程
            {query.trim() ? ` · “${query.trim()}”` : ""}
          </p>
          <div className="resolve-tutorial-list">
            {visibleTutorials.map((tutorial) => (
              <details key={tutorial.id} open={openId === tutorial.id}>
                <summary
                  onClick={(event) => {
                    event.preventDefault();
                    setOpenId((current) =>
                      current === tutorial.id ? "" : tutorial.id,
                    );
                  }}
                >
                  <span>{String(tutorial.number).padStart(2, "0")}</span>
                  <div>
                    <small>{tutorial.category}</small>
                    <h4>{tutorial.title}</h4>
                    <p>{tutorial.goal}</p>
                    <div className="resolve-tutorial-meta">
                      <span>{tutorial.level}</span>
                      <span>练习约 {tutorial.estimatedMinutes} 分钟</span>
                    </div>
                  </div>
                </summary>
                <div className="resolve-tutorial-body">
                  <p className="resolve-tutorial-scenario">
                    <strong>适用场景</strong>
                    {tutorial.scenario}
                  </p>
                  <p className="resolve-tutorial-prerequisite">
                    <strong>开始前</strong>
                    {tutorial.prerequisite}
                  </p>
                  <div className="resolve-tutorial-settings">
                    {tutorial.settings.map((setting) => (
                      <span key={setting}>{setting}</span>
                    ))}
                  </div>
                  <section>
                    <strong>跟着做</strong>
                    <ol>
                      {tutorial.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </section>
                  <section>
                    <strong>通过标准</strong>
                    <ul>
                      {tutorial.checks.map((check) => (
                        <li key={check}>
                          <CheckCircle2 size={12} />
                          {check}
                        </li>
                      ))}
                    </ul>
                  </section>
                  <p className="resolve-tutorial-pitfall">
                    <AlertTriangle size={12} />
                    <span>
                      <strong>常见失败：</strong>
                      {tutorial.pitfall}
                    </span>
                  </p>
                </div>
              </details>
            ))}
          </div>
          {!visibleTutorials.length && (
            <div className="resolve-tutorial-empty">
              <strong>没有匹配的教程</strong>
              <p>尝试更短的关键词。</p>
              <button type="button" onClick={() => setQuery("")}>
                清除搜索
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="post-empty">
          当前工作区暂时没有独立实操教程；基础操作仍可按上方关键动作执行。
        </p>
      )}
    </section>
  );
}
