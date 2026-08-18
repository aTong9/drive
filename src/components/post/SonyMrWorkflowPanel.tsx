import {
  AlertTriangle,
  Camera,
  Check,
  Download,
  Headphones,
} from "lucide-react";
import { useState } from "react";
import {
  sonyMrAudio,
  sonyMrExportPresets,
  sonyMrWorkflows,
} from "../../data/sonyMrWorkflow.js";

export function SonyMrWorkflowPanel() {
  const [id, setId] = useState<(typeof sonyMrWorkflows)[number]["id"]>("MR1");
  const item = sonyMrWorkflows.find((entry) => entry.id === id)!;
  const exportPreset = sonyMrExportPresets.find(
    (entry) => entry.id === item.exportPresetId,
  )!;
  return (
    <section className="sony-mr-post">
      <header>
        <div>
          <small>SONY A7C II · CURRENT MR</small>
          <h2>MR1 / MR2 / MR3 对应后期路线</h2>
          <p>
            三套拍摄模式只需保存两套导出预设：MR1/MR2 共用 PQ，MR3 使用 HLG。
          </p>
        </div>
        <Camera size={24} />
      </header>
      <nav>
        {sonyMrWorkflows.map((entry) => (
          <button
            key={entry.id}
            className={entry.id === id ? "active" : ""}
            onClick={() => setId(entry.id)}
          >
            <strong>{entry.id}</strong>
            <span>
              {entry.name}
              <small>{entry.use}</small>
            </span>
          </button>
        ))}
      </nav>
      <article>
        <header>
          <div>
            <small>{item.capture}</small>
            <h3>{item.route}</h3>
          </div>
          <p>
            <AlertTriangle size={12} />
            {item.warning}
          </p>
        </header>
        <dl>
          <div>
            <dt>Input</dt>
            <dd>{item.input}</dd>
          </div>
          <div>
            <dt>Timeline</dt>
            <dd>{item.timeline}</dd>
          </div>
          <div>
            <dt>Output</dt>
            <dd>{item.output}</dd>
          </div>
          <div>
            <dt>使用导出预设</dt>
            <dd>{exportPreset.name}</dd>
          </div>
        </dl>
        <ol>
          {item.nodes.map((node) => (
            <li key={node}>
              <Check size={12} />
              {node}
            </li>
          ))}
        </ol>
      </article>
      <section className="sony-mr-export">
        <header>
          <Download size={18} />
          <div>
            <small>DELIVER PRESET · {exportPreset.appliesTo}</small>
            <h3>{exportPreset.name}</h3>
            <p>{exportPreset.route}</p>
          </div>
        </header>
        <dl>
          <div>
            <dt>编码</dt>
            <dd>
              {exportPreset.format} · {exportPreset.codec} ·{" "}
              {exportPreset.profile}
            </dd>
          </div>
          <div>
            <dt>画面</dt>
            <dd>
              {exportPreset.resolution} · {exportPreset.frameRate} ·{" "}
              {exportPreset.bitrate}
            </dd>
          </div>
          <div>
            <dt>标签</dt>
            <dd>
              {exportPreset.colorTag} · {exportPreset.gammaTag} · 数据级别{" "}
              {exportPreset.dataLevels}
            </dd>
          </div>
          <div>
            <dt>声音</dt>
            <dd>{exportPreset.audio}</dd>
          </div>
        </dl>
        <p className="sony-mr-export-warning">
          导出预设只负责编码和标签；必须先在项目色彩管理中正确完成{" "}
          {exportPreset.input} → {exportPreset.output}，不能靠 Deliver
          标签改变素材。
        </p>
      </section>
      <aside>
        <Headphones size={18} />
        <div>
          <strong>{sonyMrAudio.track}</strong>
          <p>
            {sonyMrAudio.processing}｜{sonyMrAudio.output}
          </p>
        </div>
      </aside>
    </section>
  );
}
