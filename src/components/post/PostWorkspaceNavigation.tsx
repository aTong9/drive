import {
  BookOpen,
  Clapperboard,
  Compass,
  GitCompareArrows,
  Heart,
  ListChecks,
  Scissors,
  SlidersHorizontal,
  Workflow,
} from "lucide-react";

export type PostWorkspaceMode =
  | "overview"
  | "guide"
  | "presets"
  | "compare"
  | "tools"
  | "glossary"
  | "favorites"
  | "pipeline"
  | "tutorial"
  | "capcut"
  | "finalcut";

const tutorialModes = new Set<PostWorkspaceMode>([
  "guide",
  "tutorial",
  "presets",
  "capcut",
  "finalcut",
]);

const toolModes = new Set<PostWorkspaceMode>([
  "tools",
  "glossary",
  "compare",
  "favorites",
]);

type NavigationProps = {
  mode: PostWorkspaceMode;
  favoriteCount: number;
  onModeChange: (mode: PostWorkspaceMode) => void;
};

export function PostWorkspacePrimaryNavigation({
  mode,
  favoriteCount,
  onModeChange,
}: NavigationProps) {
  const tutorialModeActive = tutorialModes.has(mode);
  const toolModeActive = toolModes.has(mode);

  return (
    <nav className="post-mode post-mode-primary" aria-label="后期工作台主导航">
      <button
        className={mode === "overview" ? "active" : ""}
        onClick={() => onModeChange("overview")}
        aria-current={mode === "overview" ? "page" : undefined}
      >
        <Compass size={14} /> 总览
      </button>
      <button
        className={mode === "pipeline" ? "active" : ""}
        onClick={() => onModeChange("pipeline")}
        aria-current={mode === "pipeline" ? "page" : undefined}
      >
        <ListChecks size={14} /> 项目执行
      </button>
      <button
        className={tutorialModeActive ? "active" : ""}
        onClick={() => onModeChange("guide")}
        aria-expanded={tutorialModeActive}
        aria-controls="post-tutorial-navigation"
      >
        <Clapperboard size={14} /> 教程中心
      </button>
      <button
        className={toolModeActive ? "active" : ""}
        onClick={() => onModeChange("tools")}
        aria-expanded={toolModeActive}
        aria-controls="post-tool-navigation"
      >
        <SlidersHorizontal size={14} /> 工具箱
        {favoriteCount > 0 && <span>{favoriteCount}</span>}
      </button>
    </nav>
  );
}

export function PostWorkspaceContextNavigation({
  mode,
  favoriteCount,
  onModeChange,
}: NavigationProps) {
  const tutorialModeActive = tutorialModes.has(mode);
  const toolModeActive = toolModes.has(mode);

  return (
    <>
      {tutorialModeActive && (
        <nav
          className="post-context-nav"
          id="post-tutorial-navigation"
          aria-label="教程中心导航"
        >
          <span>教程中心</span>
          <button
            className={
              mode === "guide" || mode === "tutorial" || mode === "presets"
                ? "active"
                : ""
            }
            onClick={() =>
              onModeChange(
                mode === "tutorial" || mode === "presets" ? mode : "guide",
              )
            }
            aria-current={
              mode === "guide" || mode === "tutorial" || mode === "presets"
                ? "page"
                : undefined
            }
            aria-label="DaVinci Resolve 完整流程与调色教程"
          >
            <Workflow size={13} /> DaVinci Resolve
          </button>
          <button
            className={mode === "capcut" ? "active" : ""}
            onClick={() => onModeChange("capcut")}
            aria-current={mode === "capcut" ? "page" : undefined}
          >
            <Scissors size={13} /> 剪映专业版
          </button>
          <button
            className={mode === "finalcut" ? "active" : ""}
            onClick={() => onModeChange("finalcut")}
            aria-current={mode === "finalcut" ? "page" : undefined}
          >
            <Clapperboard size={13} /> Final Cut Pro
          </button>
        </nav>
      )}

      {toolModeActive && (
        <nav
          className="post-context-nav"
          id="post-tool-navigation"
          aria-label="后期工具箱导航"
        >
          <span>工具箱</span>
          <button
            className={mode === "tools" ? "active" : ""}
            onClick={() => onModeChange("tools")}
            aria-current={mode === "tools" ? "page" : undefined}
          >
            <SlidersHorizontal size={13} /> 问题诊断
          </button>
          <button
            className={mode === "glossary" ? "active" : ""}
            onClick={() => onModeChange("glossary")}
            aria-current={mode === "glossary" ? "page" : undefined}
          >
            <BookOpen size={13} /> 参数词典
          </button>
          <button
            className={mode === "compare" ? "active" : ""}
            onClick={() => onModeChange("compare")}
            aria-current={mode === "compare" ? "page" : undefined}
          >
            <GitCompareArrows size={13} /> 链路对比
          </button>
          <button
            className={mode === "favorites" ? "active" : ""}
            onClick={() => onModeChange("favorites")}
            aria-current={mode === "favorites" ? "page" : undefined}
          >
            <Heart size={13} /> 收藏 {favoriteCount}
          </button>
        </nav>
      )}
    </>
  );
}
