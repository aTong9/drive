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

export function ColorFinishingGuide({
  preset,
}: {
  preset: DavinciGradePreset;
}) {
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
