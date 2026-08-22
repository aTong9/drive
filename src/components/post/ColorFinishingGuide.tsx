import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Film,
  Search,
  X,
} from "lucide-react";
import type { DavinciGradePreset } from "../../types/domain.js";
import {
  colorFinishingSources,
  colorFinishingWorkflow,
  resolvePracticalTutorials,
} from "../../data/colorFinishingWorkflow.js";

const parameterLabels: Record<
  keyof DavinciGradePreset["timelineParameters"],
  string
> = {
  temperature: "色温",
  tint: "色调",
  contrast: "对比度",
  pivot: "轴心",
  colorBoost: "色彩增强",
  shadows: "阴影",
  highlights: "高光",
  saturation: "饱和度",
  hueMix: "色相混合",
  lumaMix: "亮度混合",
  midtoneDetail: "中间调细节",
};

const tutorialTopics = [
  "全部",
  "剪辑",
  "声音",
  "节奏",
  "转场",
  "变速",
  "质检",
] as const;
type TutorialTopic = (typeof tutorialTopics)[number];

const tutorialEntries = resolvePracticalTutorials.map((tutorial, index) => ({
  tutorial,
  number: index + 1,
  topic: tutorial.category.split(" · ")[0] as Exclude<TutorialTopic, "全部">,
  searchText: [
    tutorial.category,
    tutorial.level,
    `${tutorial.estimatedMinutes} 分钟`,
    tutorial.prerequisite,
    tutorial.title,
    tutorial.goal,
    tutorial.scenario,
    ...tutorial.settings,
    ...tutorial.steps,
    ...tutorial.checks,
    tutorial.pitfall,
  ]
    .join(" ")
    .toLocaleLowerCase("zh-CN"),
}));

export function ColorFinishingGuide({
  preset,
}: {
  preset: DavinciGradePreset;
}) {
  const [tutorialTopic, setTutorialTopic] = useState<TutorialTopic>("全部");
  const [tutorialQuery, setTutorialQuery] = useState("");
  const [openTutorialId, setOpenTutorialId] = useState<string>(
    resolvePracticalTutorials[0].id,
  );
  const normalizedTutorialQuery = tutorialQuery
    .trim()
    .toLocaleLowerCase("zh-CN");
  const visibleTutorials = tutorialEntries.filter(
    (entry) =>
      (tutorialTopic === "全部" || entry.topic === tutorialTopic) &&
      (!normalizedTutorialQuery ||
        entry.searchText.includes(normalizedTutorialQuery)),
  );

  const findFirstTutorial = (topic: TutorialTopic, query: string) => {
    const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");
    return tutorialEntries.find(
      (entry) =>
        (topic === "全部" || entry.topic === topic) &&
        (!normalizedQuery || entry.searchText.includes(normalizedQuery)),
    );
  };

  const selectTutorialTopic = (topic: TutorialTopic) => {
    setTutorialTopic(topic);
    const firstMatch = findFirstTutorial(topic, tutorialQuery);
    setOpenTutorialId(firstMatch?.tutorial.id ?? "");
  };

  const searchTutorials = (query: string) => {
    setTutorialQuery(query);
    const firstMatch = findFirstTutorial(tutorialTopic, query);
    setOpenTutorialId(firstMatch?.tutorial.id ?? "");
  };

  const resetTutorialFilters = () => {
    setTutorialTopic("全部");
    setTutorialQuery("");
    setOpenTutorialId(resolvePracticalTutorials[0].id);
  };

  return (
    <section className="color-finishing-guide">
      <header>
        <div>
          <small>COLOR TO DELIVERY · COMPLETE CHAIN</small>
          <h2>从“{preset.name}”到可导出影片</h2>
          <p>
            场景参数只在第 07
            步应用。其余步骤负责把素材变成技术正确、镜头连续、声音完整且可验证的交付母版。
          </p>
        </div>
        <Film size={28} />
      </header>
      <div className="color-finishing-summary">
        <strong>12</strong>
        <span>个完成阶段</span>
        <p>
          输入解释 → 技术修复 → 镜头匹配 → 场景 Look → HDR安全 → 声音 → 导出验证
        </p>
      </div>
      <section className="resolve-practical-tutorials">
        <header>
          <div>
            <small>EDIT PAGE · FOLLOW-ALONG TUTORIALS</small>
            <h3>标记 → 剪辑点 → 转场：Resolve 实操教程</h3>
            <p>
              先用标记记录判断，再完成真实剪辑操作。首个教程解决交叉叠化，后续教程沿用同一套“场景、数值、步骤、验收、避坑”结构。
            </p>
          </div>
          <strong>{resolvePracticalTutorials.length} 个教程</strong>
        </header>
        <label className="resolve-tutorial-search">
          <Search size={13} />
          <input
            type="search"
            value={tutorialQuery}
            onChange={(event) => searchTutorials(event.target.value)}
            placeholder="搜索交叉叠化、声音桥、Optical Flow…"
            aria-label="搜索 Resolve 实操教程"
          />
          {tutorialQuery && (
            <button
              type="button"
              onClick={() => searchTutorials("")}
              aria-label="清除教程搜索"
            >
              <X size={12} />
            </button>
          )}
        </label>
        <nav className="resolve-tutorial-filters" aria-label="Resolve 教程分类">
          {tutorialTopics.map((topic) => {
            const count =
              topic === "全部"
                ? tutorialEntries.length
                : tutorialEntries.filter((entry) => entry.topic === topic)
                    .length;
            return (
              <button
                key={topic}
                type="button"
                aria-pressed={tutorialTopic === topic}
                onClick={() => selectTutorialTopic(topic)}
              >
                {topic}
                <span>{count}</span>
              </button>
            );
          })}
        </nav>
        <p className="resolve-tutorial-result" aria-live="polite">
          当前显示 {visibleTutorials.length} 个教程
          {tutorialTopic === "全部" ? "" : ` · ${tutorialTopic}`}
          {normalizedTutorialQuery ? ` · “${tutorialQuery.trim()}”` : ""}
        </p>
        {visibleTutorials.length ? (
          <div className="resolve-tutorial-list">
            {visibleTutorials.map(({ tutorial, number }) => (
              <details key={tutorial.id} open={openTutorialId === tutorial.id}>
                <summary
                  onClick={(event) => {
                    event.preventDefault();
                    setOpenTutorialId((current) =>
                      current === tutorial.id ? "" : tutorial.id,
                    );
                  }}
                >
                  <span>{String(number).padStart(2, "0")}</span>
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
        ) : (
          <div className="resolve-tutorial-empty">
            <strong>没有匹配的教程</strong>
            <p>尝试更短的关键词，或恢复全部分类。</p>
            <button type="button" onClick={resetTutorialFilters}>
              清除筛选
            </button>
          </div>
        )}
      </section>
      <ol>
        {colorFinishingWorkflow.map((stage) => (
          <li
            key={stage.id}
            className={stage.id === "creative-look" ? "active-look" : ""}
          >
            <header>
              <span>{stage.phase}</span>
              <div>
                <small>{stage.workspace}</small>
                <h3>{stage.name}</h3>
                <p>{stage.purpose}</p>
              </div>
            </header>
            <section className="color-finishing-settings">
              <strong>具体数值 · 可直接录入的起点</strong>
              <div>
                {stage.settings.map((setting) => (
                  <dl key={`${stage.id}-${setting.label}`}>
                    <dt>{setting.label}</dt>
                    <dd>{setting.value}</dd>
                  </dl>
                ))}
                {stage.id === "primary-balance" && (
                  <>
                    <dl>
                      <dt>当前场景曝光目标</dt>
                      <dd>{preset.exposure}</dd>
                    </dl>
                    <dl>
                      <dt>当前场景白平衡</dt>
                      <dd>{preset.whiteBalance}</dd>
                    </dl>
                  </>
                )}
                {stage.id === "creative-look" &&
                  Object.entries(preset.timelineParameters).map(
                    ([key, value]) => (
                      <dl key={`look-${key}`}>
                        <dt>
                          {
                            parameterLabels[
                              key as keyof DavinciGradePreset["timelineParameters"]
                            ]
                          }
                        </dt>
                        <dd>{value}</dd>
                      </dl>
                    ),
                  )}
              </div>
              <p>
                起始值用于建立可重复基线；若示波器、肤色、运动边缘或实际听感不通过，应逐镜回退或微调。
              </p>
            </section>
            <div className="color-finishing-columns">
              <section>
                <strong>操作</strong>
                <ol>
                  {stage.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ol>
              </section>
              <section>
                <strong>通过标准</strong>
                <ul>
                  {stage.checks.map((check) => (
                    <li key={check}>
                      <CheckCircle2 size={12} />
                      {check}
                    </li>
                  ))}
                </ul>
                <p>
                  <AlertTriangle size={12} />
                  {stage.caution}
                </p>
              </section>
            </div>
          </li>
        ))}
      </ol>
      <footer>
        <div>
          <strong>最终完成条件</strong>
          <p>
            技术转换正确、镜头匹配完成、全片画面与声音回看通过、文件元数据正确、YouTube
            显示 2160p HDR。
          </p>
        </div>
        <nav>
          {colorFinishingSources.map((source) => (
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
