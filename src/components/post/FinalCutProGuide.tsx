import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import {
  finalCutPracticalTutorials,
  finalCutProSources,
  finalCutProWorkflow,
} from "../../data/finalCutProWorkflow.js";
import { matchesTutorialSearch } from "../../services/tutorialSearchService.js";

const topics = [
  "全部",
  ...new Set(finalCutPracticalTutorials.map((item) => item.category)),
];

export function FinalCutProGuide() {
  const [topic, setTopic] = useState("全部");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string>(
    finalCutPracticalTutorials[0].id,
  );
  const filterTutorials = (selectedTopic: string, searchQuery: string) =>
    finalCutPracticalTutorials.filter(
      (item) =>
        (selectedTopic === "全部" || item.category === selectedTopic) &&
        matchesTutorialSearch(item, searchQuery),
    );
  const tutorials = useMemo(
    () => filterTutorials(topic, query),
    [query, topic],
  );

  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    setOpenId(filterTutorials(topic, nextQuery)[0]?.id ?? "");
  };

  return (
    <section className="capcut-pro-guide final-cut-pro-guide">
      <header>
        <Sparkles size={18} />
        <div>
          <small>FINAL CUT PRO · MAC WORKFLOW</small>
          <h2>Final Cut Pro 完整后期教程</h2>
          <p>
            从资源库和代理媒体开始，掌握磁性时间线、角色、字幕、色彩管理、共享与可恢复归档。
          </p>
        </div>
      </header>
      <div className="capcut-guide-summary">
        <span>
          <strong>{finalCutProWorkflow.length}</strong> 个阶段
        </span>
        <span>
          <strong>{finalCutPracticalTutorials.length}</strong> 个实操
        </span>
        <span>
          <strong>Mac</strong> 桌面流程
        </span>
      </div>
      <ol className="capcut-stage-list">
        {finalCutProWorkflow.map((stage) => (
          <li key={stage.id}>
            <header>
              <span>{stage.phase}</span>
              <div>
                <small>{stage.workspace}</small>
                <h3>{stage.name}</h3>
                <p>{stage.purpose}</p>
              </div>
            </header>
            <div className="capcut-stage-settings">
              {stage.settings.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <section>
              <strong>操作步骤</strong>
              <ol>
                {stage.actions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>
            <section>
              <strong>完成标准</strong>
              <ul>
                {stage.checks.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={12} />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <p className="capcut-caution">
              <AlertTriangle size={12} />
              {stage.caution}
            </p>
          </li>
        ))}
      </ol>
      <section
        className="resolve-practical-tutorials"
        id="finalcut-tutorial-center"
      >
        <header>
          <div>
            <small>FOLLOW-ALONG LESSONS</small>
            <h3>Final Cut Pro 实操教程</h3>
            <p>每个教程都有场景、快捷键、步骤、通过标准与失败处理。</p>
          </div>
          <span>
            {tutorials.length} / {finalCutPracticalTutorials.length}
          </span>
        </header>
        <div className="resolve-tutorial-toolbar">
          <label className="resolve-tutorial-search">
            <Search size={14} />
            <input
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder="搜索标记、磁性时间线、Roles、代理、调色…"
            />
            {query && (
              <button onClick={() => updateQuery("")} aria-label="清空搜索">
                <X size={12} />
              </button>
            )}
          </label>
          <nav
            className="resolve-tutorial-filters"
            aria-label="Final Cut Pro 教程分类"
          >
            {topics.map((item) => (
              <button
                key={item}
                className={topic === item ? "active" : ""}
                onClick={() => {
                  setTopic(item);
                  setOpenId(filterTutorials(item, query)[0]?.id ?? "");
                }}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
        <div className="resolve-tutorial-list">
          {tutorials.length === 0 && (
            <p className="resolve-tutorial-empty">
              没有匹配教程，试试“标记”“代理”或“调色”。
            </p>
          )}
          {tutorials.map((tutorial, index) => (
            <details
              key={tutorial.id}
              open={openId === tutorial.id}
              onToggle={(event) => {
                if (event.currentTarget.open) setOpenId(tutorial.id);
                else if (openId === tutorial.id) setOpenId("");
              }}
            >
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
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
                <div className="resolve-tutorial-settings">
                  {tutorial.settings.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <section>
                  <strong>跟着做</strong>
                  <ol>
                    {tutorial.steps.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </section>
                <section>
                  <strong>通过标准</strong>
                  <ul>
                    {tutorial.checks.map((item) => (
                      <li key={item}>
                        <CheckCircle2 size={12} />
                        {item}
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
      </section>
      <footer>
        <div>
          <strong>版本边界</strong>
          <p>
            教程面向 Final Cut Pro for Mac。AI 搜索、自动字幕、Magnetic
            Mask、部分编码和字幕能力会因 Final Cut
            Pro、macOS、语言与芯片版本不同；所有自动结果都要人工复核。
          </p>
        </div>
        <nav>
          {finalCutProSources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
            >
              {source.label}
              <ExternalLink size={11} />
            </a>
          ))}
        </nav>
      </footer>
    </section>
  );
}
