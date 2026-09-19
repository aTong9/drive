import { useSessionState } from "../common/useSessionState.js";
import { useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import {
  capcutPracticalTutorials,
  capcutProSources,
  capcutProWorkflow,
} from "../../data/capcutProWorkflow.js";
import { matchesTutorialSearch } from "../../services/tutorialSearchService.js";

const topics = [
  "全部",
  ...new Set(capcutPracticalTutorials.map((item) => item.category)),
];

export function CapCutProGuide() {
  const [topic, setTopic] = useSessionState("capcut-topic", "全部");
  const [query, setQuery] = useSessionState("capcut-query", "");
  const [openId, setOpenId] = useSessionState<string>("capcut-openId", capcutPracticalTutorials[0].id);
  const filterTutorials = (selectedTopic: string, searchQuery: string) =>
    capcutPracticalTutorials.filter(
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
    <section className="capcut-pro-guide">
      <header>
        <div>
          <small>Jianying Pro · DESKTOP WORKFLOW</small>
          <h2>剪映专业版完整后期教程</h2>
          <p>
            从项目规格、素材整理和粗剪开始，到字幕、关键帧、调色、声音、多平台重构与导出复核。界面名称会随版本变化，操作前请在当前客户端核对。
          </p>
        </div>
        <Sparkles size={28} />
      </header>
      <div className="capcut-guide-summary">
        <strong>{capcutProWorkflow.length}</strong>
        <span>个完成阶段</span>
        <p>项目 → 素材 → 粗剪 → 字幕 → 动画 → 变速 → 调色 → 声音 → 交付</p>
      </div>
      <ol className="capcut-stage-list">
        {capcutProWorkflow.map((stage) => (
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
              <strong>跟着做</strong>
              <ol>
                {stage.actions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>
            <section>
              <strong>通过标准</strong>
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
        className="resolve-practical-tutorials capcut-practical-tutorials"
        id="capcut-tutorial-center"
      >
        <header>
          <div>
            <small>FOLLOW-ALONG · PRACTICAL LESSONS</small>
            <h3>剪映专业版实操教程</h3>
            <p>每个练习都包含适用场景、参数、步骤、通过标准和常见失败。</p>
          </div>
          <strong>{capcutPracticalTutorials.length} 个教程</strong>
        </header>
        <label className="resolve-tutorial-search">
          <Search size={13} />
          <input
            type="search"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="搜索字幕、关键帧、变速、调色…"
            aria-label="搜索剪映专业版教程"
          />
          {query && (
            <button
              type="button"
              onClick={() => updateQuery("")}
              aria-label="清除剪映教程搜索"
            >
              <X size={12} />
            </button>
          )}
        </label>
        <nav
          className="resolve-tutorial-filters"
          aria-label="剪映专业版教程分类"
        >
          {topics.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={topic === item}
              onClick={() => {
                setTopic(item);
                setOpenId(filterTutorials(item, query)[0]?.id ?? "");
              }}
            >
              {item}
              <span>
                {item === "全部"
                  ? capcutPracticalTutorials.length
                  : capcutPracticalTutorials.filter(
                      (tutorial) => tutorial.category === item,
                    ).length}
              </span>
            </button>
          ))}
        </nav>
        <p className="resolve-tutorial-result" aria-live="polite">
          当前显示 {tutorials.length} 个教程
          {topic === "全部" ? "" : ` · ${topic}`}
        </p>
        <div className="resolve-tutorial-list">
          {tutorials.length === 0 && (
            <p className="resolve-tutorial-empty">
              没有匹配教程，试试“代理”“字幕”“人声分离”或“竖屏”。
            </p>
          )}
          {tutorials.map((tutorial, index) => (
            <details key={tutorial.id} open={openId === tutorial.id}>
              <summary
                onClick={(event) => {
                  event.preventDefault();
                  setOpenId((current) =>
                    current === tutorial.id ? "" : tutorial.id,
                  );
                }}
              >
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
            剪映专业版与 CapCut Desktop
            的功能名称、会员权限、快捷键和导出选项可能因地区、系统和版本不同；教程把具体数值作为起点，不把
            AI 结果当作免检成片。
          </p>
        </div>
        <nav>
          {capcutProSources.map((source) => (
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
