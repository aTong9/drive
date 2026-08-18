import {
  Calculator,
  CheckCircle2,
  HardDrive,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";
import {
  estimateRenderMinutes,
  recommendPostPipeline,
  renderStorageGb,
  type PostDelivery,
  type PostInputProfile,
} from "../../services/postDecisionService.js";

export function PostDecisionTools() {
  const [input, setInput] = useState<PostInputProfile>("slog3");
  const [delivery, setDelivery] = useState<PostDelivery>("hdr10");
  const [duration, setDuration] = useState(90);
  const [bitrate, setBitrate] = useState(80);
  const [speed, setSpeed] = useState(0.5);
  const pipeline = recommendPostPipeline(input, delivery);
  const changeInput = (nextInput: PostInputProfile) => {
    setInput(nextInput);
    if (nextInput !== "hlg" && delivery === "hlg") setDelivery("hdr10");
  };
  return (
    <section className="post-workspace post-tools">
      <header>
        <div>
          <p className="eyebrow">POST DECISION ASSISTANT</p>
          <h2>后期项目生成器</h2>
          <p>
            根据素材曲线和交付目标生成完整色彩链路，再按实际监看条件与示波器修正。
          </p>
        </div>
        <SlidersHorizontal size={28} />
      </header>
      <div className="post-generator">
        <form>
          <label>
            输入素材
            <select
              value={input}
                onChange={(e) => changeInput(e.target.value as PostInputProfile)}
            >
              <option value="slog3">S-Log3 / S-Gamut3.Cine</option>
              <option value="hlg">Rec.2100 HLG</option>
              <option value="rec709">Rec.709 SDR</option>
            </select>
          </label>
          <label>
            最终交付
            <select
              value={delivery}
              onChange={(e) => setDelivery(e.target.value as PostDelivery)}
            >
              <option value="hdr10">4K HDR10 / PQ</option>
              {input === "hlg" && (
                <option value="hlg">4K HLG HDR（MR3首选）</option>
              )}
              <option value="sdr">4K Rec.709 SDR</option>
            </select>
          </label>
        </form>
        <article>
          <header>
            <small>推荐链路</small>
            <h3>{pipeline.name}</h3>
          </header>
          <dl>
            <div>
              <dt>输入</dt>
              <dd>{pipeline.input}</dd>
            </div>
            <div>
              <dt>时间线</dt>
              <dd>{pipeline.timeline}</dd>
            </div>
            <div>
              <dt>输出</dt>
              <dd>{pipeline.output}</dd>
            </div>
            <div>
              <dt>导出</dt>
              <dd>{pipeline.render}</dd>
            </div>
          </dl>
          <ul>
            {pipeline.checks.map((item) => (
              <li key={item}>
                <CheckCircle2 size={13} />
                {item}
              </li>
            ))}
          </ul>
          {pipeline.warnings.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </article>
      </div>
      <div className="post-calculators">
        <article>
          <HardDrive size={20} />
          <div>
            <h3>成片容量估算</h3>
            <p>不包含缓存、代理、母版中间编码和版本备份。</p>
          </div>
          <label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value) || 1)}
            />
            分钟
          </label>
          <label>
            <input
              type="number"
              min="1"
              value={bitrate}
              onChange={(e) => setBitrate(Number(e.target.value) || 1)}
            />
            Mb/s
          </label>
          <output>{renderStorageGb(bitrate, duration).toFixed(1)} GB</output>
        </article>
        <article>
          <Calculator size={20} />
          <div>
            <h3>渲染时间估算</h3>
            <p>速度0.5×表示渲染一小时素材约需两小时。</p>
          </div>
          <label>
            <input
              type="number"
              min="0.1"
              max="5"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value) || 0.1)}
            />
            倍速
          </label>
          <output>
            约 {Math.ceil(estimateRenderMinutes(duration, speed))} 分钟
          </output>
        </article>
      </div>
    </section>
  );
}
