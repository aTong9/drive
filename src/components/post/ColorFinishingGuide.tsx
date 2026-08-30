import { AlertTriangle, CheckCircle2, ExternalLink, Film } from "lucide-react";
import type { DavinciGradePreset } from "../../types/domain.js";
import {
  colorFinishingSources,
  colorFinishingWorkflow,
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

const colorWorkflowStages = colorFinishingWorkflow.filter((stage) =>
  stage.workspace.startsWith("Color"),
);

export function ColorFinishingGuide({
  preset,
}: {
  preset: DavinciGradePreset;
}) {
  return (
    <section className="color-finishing-guide">
      <header>
        <div>
          <small>COLOR WORKSPACE · CONTROLLED GRADE</small>
          <h2>从“{preset.name}”到调色母版</h2>
          <p>
            本区只保留 Color 工作区内的技术修复、镜头匹配、场景 Look、HDR
            安全和画面质检；声音与导出已归回各自模块。
          </p>
        </div>
        <Film size={28} />
      </header>
      <div className="color-finishing-summary">
        <strong>{colorWorkflowStages.length}</strong>
        <span>个 Color 阶段</span>
        <p>技术修复 → 曝光白平衡 → 镜头匹配 → 场景 Look → HDR安全 → 画面质检</p>
      </div>
      <ol>
        {colorWorkflowStages.map((stage) => (
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
                起始值用于建立可重复基线；若示波器、肤色或运动边缘检查不通过，应逐镜回退或微调。
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
            技术转换正确、镜头匹配完成、场景 Look 可回退、HDR
            示波器安全，并完成全片画面回看。声音与文件交付在后续工作区继续验收。
          </p>
        </div>
        <nav>
          {colorFinishingSources.map((source) => (
            <a
              key={`${source.url}-${source.label}`}
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
