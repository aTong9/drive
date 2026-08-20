import {
  Calculator,
  Camera,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  CloudRain,
  Copy,
  Gauge,
  HardDrive,
  Lightbulb,
  Save,
  SlidersHorizontal,
  Sparkles,
  SunMedium,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  buildIsoScenarioExamples,
  estimateNdStops,
  flickerSafeShutters,
  recordingMinutesForStorage,
  recordingStorageGb,
  recommendPreset,
  shutterForFps,
  type SceneGeneratorInput,
} from "../../services/cameraDecisionService.js";
import type { CameraPreset } from "../../types/domain.js";

const lightOptions = [
  ["harsh-sun", "正午强光"],
  ["open-shade", "白天开放阴影"],
  ["overcast", "阴天"],
  ["sunset", "日落 / 蓝调"],
  ["city-night", "城市夜景"],
  ["dark-scene", "暗路 / 低照自然"],
] as const;

const sceneTemplates: Array<{
  id: string;
  name: string;
  detail: string;
  input: Partial<SceneGeneratorInput>;
}> = [
  {
    id: "day-slog",
    name: "白天驾驶 PQ",
    detail: "MR2 · 24mm · ND",
    input: {
      device: "Sony A7C II",
      light: "day",
      illumination: "harsh-sun",
      movement: "drive",
      motion: "normal",
      depth: "deep",
      fps: 30,
      nd: true,
      delivery: "hdr10",
      focalLength: 24,
      shutterOverride: "1/60",
      apertureOverride: "F5.6",
      whiteBalanceOverride: 5600,
      isoMode: "auto",
      cropMode: "full",
      zebraOverride: "95+",
    },
  },
  {
    id: "day-hlg",
    name: "白天快速 HLG",
    detail: "MR3 · ISO 100起",
    input: {
      device: "Sony A7C II",
      light: "day",
      illumination: "open-shade",
      movement: "walk",
      motion: "normal",
      depth: "deep",
      fps: 30,
      nd: true,
      delivery: "hlg",
      focalLength: 24,
      shutterOverride: "1/60",
      apertureOverride: "F5.6",
      whiteBalanceOverride: 5600,
      isoMode: "auto",
      cropMode: "full",
      zebraOverride: "95+",
    },
  },
  {
    id: "night-drive",
    name: "夜景驾驶",
    detail: "MR1 · 灯牌优先",
    input: {
      device: "Sony A7C II",
      light: "night",
      illumination: "city-night",
      movement: "drive",
      motion: "normal",
      depth: "deep",
      fps: 30,
      nd: false,
      delivery: "hdr10",
      focalLength: 24,
      shutterOverride: "1/60",
      apertureOverride: "F4",
      whiteBalanceOverride: 4200,
      isoMode: "auto",
      cropMode: "full",
      meteringOverride: "highlight",
    },
  },
  {
    id: "forest",
    name: "森林溪流固定",
    detail: "35mm · 独立环境声",
    input: {
      light: "day",
      illumination: "open-shade",
      movement: "tripod",
      motion: "static",
      depth: "deep",
      fps: 30,
      nd: false,
      focalLength: 35,
      shutterOverride: "1/60",
      apertureOverride: "F5.6",
      whiteBalanceOverride: 5200,
      focusOverride: "single-lock",
      stabilizationOverride: "off",
      audioControl: "manual-low",
    },
  },
  {
    id: "rain",
    name: "雨景步行",
    detail: "24mm · 高光与防水",
    input: {
      light: "day",
      illumination: "overcast",
      movement: "walk",
      motion: "normal",
      weather: "rain",
      nd: false,
      focalLength: 24,
      exposureCompensation: "-0.3",
      focusOverride: "afc-wide",
      stabilizationOverride: "active",
      audioControl: "manual-low",
    },
  },
  {
    id: "portrait",
    name: "人物浅景深",
    detail: "50mm · AF跟踪",
    input: {
      movement: "tripod",
      motion: "normal",
      depth: "shallow",
      focalLength: 50,
      apertureOverride: "F2.8",
      focusOverride: "afc-tracking",
      stabilizationOverride: "standard",
      meteringOverride: "multi",
    },
  },
];

export function CameraDecisionTools({
  presets,
  onSelectPreset,
}: {
  presets: CameraPreset[];
  onSelectPreset: (id: string) => void;
}) {
  const devices = ["全部设备", ...new Set(presets.map((item) => item.camera))];
  const [input, setInput] = useState<SceneGeneratorInput>({
    device: "Sony A7C II",
    light: "day",
    illumination: "harsh-sun",
    movement: "drive",
    motion: "normal",
    depth: "deep",
    fps: 30,
    shutterOverride: "auto",
    apertureOverride: "auto",
    whiteBalanceOverride: 5600,
    isoMode: "auto",
    manualIso: 800,
    focusOverride: "auto",
    stabilizationOverride: "auto",
    zebraOverride: "95+",
    meteringOverride: "highlight",
    audioControl: "manual-low",
    focalLength: 24,
    resolutionOverride: "auto",
    recordingQuality: "auto",
    codecOverride: "auto",
    exposureCompensation: "auto",
    cropMode: "full",
    proxy: "off",
    weather: "clear",
    nd: true,
    delivery: "hdr10",
    sound: "ambience",
  });
  const [fps, setFps] = useState(30);
  const [ev, setEv] = useState(4);
  const [bitrate, setBitrate] = useState(100);
  const [duration, setDuration] = useState(90);
  const [storage, setStorage] = useState(128);
  const [mainsHz, setMainsHz] = useState<50 | 60>(50);
  const [fieldSheetCopied, setFieldSheetCopied] = useState(false);
  const result = useMemo(
    () => recommendPreset(presets, input),
    [input, presets],
  );
  const isoExamples = useMemo(
    () => (result ? buildIsoScenarioExamples(result.preset) : []),
    [result],
  );
  const deviceCapabilities = useMemo(
    () =>
      devices.slice(1).map((device) => {
        const own = presets.filter((item) => item.camera === device);
        return {
          device,
          maxFps: Math.max(...own.map((item) => item.settings.fps)),
          resolutions: [
            ...new Set(own.map((item) => item.settings.resolution)),
          ],
          profiles: [
            ...new Set(
              own.map((item) => item.settings.profile).filter(Boolean),
            ),
          ],
          color: [
            ...new Set(
              own.map((item) => item.settings.colorDepth).filter(Boolean),
            ),
          ],
          scenes: new Set(own.map((item) => item.scene)).size,
        };
      }),
    [devices, presets],
  );
  const update = <K extends keyof SceneGeneratorInput>(
    key: K,
    value: SceneGeneratorInput[K],
  ) => setInput((current) => ({ ...current, [key]: value }));
  const updateIllumination = (
    value: NonNullable<SceneGeneratorInput["illumination"]>,
  ) => {
    const light = ["city-night", "dark-scene"].includes(value)
      ? "night"
      : value === "sunset"
        ? "blue-hour"
        : "day";
    setInput((current) => ({
      ...current,
      illumination: value,
      light,
      weather: value === "overcast" ? "cloudy" : current.weather,
      nd: ["harsh-sun", "open-shade"].includes(value) ? current.nd : false,
    }));
  };
  const fieldSheet = result
    ? [
        `# ${result.preset.camera} 现场参数单`,
        `场景：${result.exposure.illuminationLabel} / ${input.movement} / ${input.weather}`,
        `采集：${result.preset.settings.profile} / ${result.preset.settings.resolution} / ${result.exposure.fps} FPS`,
        `交付：${result.deliveryRoute.label}`,
        "",
        `快门：${result.exposure.shutter}（${result.exposure.controlMode.shutter}）`,
        `光圈：${result.exposure.aperture}（${result.exposure.controlMode.aperture}）`,
        `ISO：${result.exposure.isoRange}（${result.exposure.controlMode.iso}）`,
        `白平衡：${result.exposure.whiteBalance}`,
        `ND：${result.exposure.nd}`,
        `对焦：${result.exposure.fieldControls.focus}`,
        `防抖：${result.exposure.fieldControls.stabilization}`,
        `斑马线：${result.exposure.fieldControls.zebra}`,
        `测光：${result.exposure.fieldControls.metering}`,
        `收音：${result.exposure.fieldControls.audio}`,
        `焦段：${result.exposure.recordingControls.focal}`,
        `分辨率：${result.exposure.recordingControls.resolution}`,
        `色深/采样：${result.exposure.recordingControls.quality}`,
        `编码：${result.exposure.recordingControls.codec}`,
        `曝光补偿：${result.exposure.recordingControls.exposureCompensation}`,
        `画幅：${result.exposure.recordingControls.crop}`,
        `Proxy：${result.exposure.recordingControls.proxy}`,
        "",
        "现场核验：斑马与波形 / 放大对焦 / 监听峰值 / 10秒试录回放 / 电池与双份存储",
        ...result.exposure.compatibilityWarnings.map(
          (warning) => `警告：${warning}`,
        ),
      ].join("\n")
    : "";
  const copyFieldSheet = async () => {
    await navigator.clipboard.writeText(fieldSheet);
    setFieldSheetCopied(true);
    window.setTimeout(() => setFieldSheetCopied(false), 1600);
  };
  const applySceneTemplate = (template: (typeof sceneTemplates)[number]) =>
    setInput((current) => ({
      ...current,
      weather: "clear",
      sound: "ambience",
      shutterOverride: "auto",
      apertureOverride: "auto",
      whiteBalanceOverride: 5600,
      isoMode: "auto",
      focusOverride: "auto",
      stabilizationOverride: "auto",
      zebraOverride: "95+",
      meteringOverride: "highlight",
      audioControl: "manual-low",
      resolutionOverride: "auto",
      recordingQuality: "auto",
      codecOverride: "auto",
      exposureCompensation: "auto",
      cropMode: "full",
      proxy: "off",
      ...template.input,
    }));

  return (
    <section className="camera-tools-workspace">
      <header className="camera-tools-head">
        <div>
          <p className="eyebrow">DECISION ASSISTANT · V2</p>
          <h2>从场景判断到可执行参数</h2>
          <p>
            先选择实际光线和交付标准，再生成
            ISO、快门、光圈、ND、白平衡与后期路线。每个数值都是试录起点，不是固定答案。
          </p>
        </div>
        <SlidersHorizontal size={29} />
      </header>

      <div className="camera-decision-flow" aria-label="参数生成流程">
        {[
          ["01", "识别场景", "光线与运动"],
          ["02", "确定采集", "曲线与曝光"],
          ["03", "匹配交付", "PQ / HLG / SDR"],
          ["04", "现场核验", "斑马、波形、回放"],
        ].map(([number, title, detail], index) => (
          <div key={number}>
            <span>{number}</span>
            <p>
              <strong>{title}</strong>
              <small>{detail}</small>
            </p>
            {index < 3 && <ChevronRight size={14} />}
          </div>
        ))}
      </div>
      <section className="camera-scene-templates">
        <header>
          <div>
            <Sparkles size={16} />
            <span>
              <strong>一键场景模板</strong>
              <small>载入后仍可逐项修改</small>
            </span>
          </div>
          <p>先用最接近的模板建立完整起点，再根据现场监看调整。</p>
        </header>
        <div>
          {sceneTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => applySceneTemplate(template)}
            >
              <strong>{template.name}</strong>
              <small>{template.detail}</small>
            </button>
          ))}
        </div>
      </section>

      <div className="camera-generator-layout camera-generator-v2">
        <form>
          <fieldset>
            <legend>拍摄条件</legend>
            <label>
              设备
              <select
                value={input.device}
                onChange={(event) => update("device", event.target.value)}
              >
                {devices.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              实际光线
              <select
                value={input.illumination}
                onChange={(event) =>
                  updateIllumination(
                    event.target.value as NonNullable<
                      SceneGeneratorInput["illumination"]
                    >,
                  )
                }
              >
                {lightOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              机位
              <select
                value={input.movement}
                onChange={(event) =>
                  update(
                    "movement",
                    event.target.value as SceneGeneratorInput["movement"],
                  )
                }
              >
                <option value="drive">车载移动</option>
                <option value="walk">步行移动</option>
                <option value="tripod">固定机位</option>
              </select>
            </label>
            <label>
              主体运动
              <select
                value={input.motion}
                onChange={(event) =>
                  update(
                    "motion",
                    event.target.value as SceneGeneratorInput["motion"],
                  )
                }
              >
                <option value="static">静态 / 缓慢</option>
                <option value="normal">一般运动</option>
                <option value="fast">车辆 / 动物快速运动</option>
              </select>
            </label>
            <label>
              天气
              <select
                value={input.weather}
                onChange={(event) =>
                  update(
                    "weather",
                    event.target.value as SceneGeneratorInput["weather"],
                  )
                }
              >
                <option value="clear">晴朗</option>
                <option value="cloudy">阴天</option>
                <option value="rain">雨天</option>
              </select>
            </label>
            <label>
              景深目标
              <select
                value={input.depth}
                onChange={(event) =>
                  update(
                    "depth",
                    event.target.value as SceneGeneratorInput["depth"],
                  )
                }
              >
                <option value="deep">风景清晰 / 深景深</option>
                <option value="balanced">通用平衡</option>
                <option value="shallow">人物突出 / 浅景深</option>
              </select>
            </label>
          </fieldset>
          <fieldset>
            <legend>记录与交付</legend>
            <label>
              帧率
              <select
                value={input.fps}
                onChange={(event) =>
                  update(
                    "fps",
                    Number(event.target.value) as SceneGeneratorInput["fps"],
                  )
                }
              >
                {[24, 25, 30, 50, 60].map((item) => (
                  <option key={item} value={item}>
                    {item}p
                  </option>
                ))}
              </select>
            </label>
            <label>
              最终交付
              <select
                value={input.delivery}
                onChange={(event) =>
                  update(
                    "delivery",
                    event.target.value as SceneGeneratorInput["delivery"],
                  )
                }
              >
                <option value="hdr10">HDR10 · PQ/ST2084</option>
                <option value="hlg">HLG HDR · Rec.2100 HLG</option>
                <option value="sdr">Rec.709 SDR</option>
              </select>
            </label>
            <label>
              声音
              <select
                value={input.sound}
                onChange={(event) =>
                  update(
                    "sound",
                    event.target.value as SceneGeneratorInput["sound"],
                  )
                }
              >
                <option value="ambience">真实环境音</option>
                <option value="music">音乐 + 环境声</option>
              </select>
            </label>
            <button
              type="button"
              className={input.nd ? "active" : ""}
              onClick={() => update("nd", !input.nd)}
            >
              <SunMedium size={15} />
              ND 滤镜：{input.nd ? "有" : "无"}
            </button>
          </fieldset>
          <fieldset className="camera-manual-controls">
            <legend>曝光与色彩控制</legend>
            <label>
              快门速度
              <select
                value={input.shutterOverride}
                onChange={(event) =>
                  update(
                    "shutterOverride",
                    event.target
                      .value as SceneGeneratorInput["shutterOverride"],
                  )
                }
              >
                <option value="auto">智能建议（约180°）</option>
                <option value="1/48">1/48</option>
                <option value="1/50">1/50</option>
                <option value="1/60">1/60</option>
                <option value="1/100">1/100</option>
                <option value="1/120">1/120</option>
                <option value="1/125">1/125</option>
                <option value="1/250">1/250</option>
                <option value="1/500">1/500</option>
              </select>
            </label>
            <label>
              光圈
              <select
                value={input.apertureOverride}
                onChange={(event) =>
                  update(
                    "apertureOverride",
                    event.target
                      .value as SceneGeneratorInput["apertureOverride"],
                  )
                }
              >
                <option value="auto">按景深智能建议</option>
                <option value="F1.4">F1.4</option>
                <option value="F1.8">F1.8</option>
                <option value="F2">F2</option>
                <option value="F2.8">F2.8</option>
                <option value="F4">F4</option>
                <option value="F5.6">F5.6</option>
                <option value="F8">F8</option>
                <option value="F11">F11</option>
              </select>
            </label>
            <label>
              白平衡
              <select
                value={input.whiteBalanceOverride}
                onChange={(event) =>
                  update(
                    "whiteBalanceOverride",
                    event.target.value === "auto"
                      ? "auto"
                      : (Number(event.target.value) as Exclude<
                          SceneGeneratorInput["whiteBalanceOverride"],
                          "auto" | undefined
                        >),
                  )
                }
              >
                <option value="auto">AWB 自动</option>
                <option value="3200">3200K 室内钨丝灯</option>
                <option value="3800">3800K 暖色街灯</option>
                <option value="4200">4200K 城市夜景</option>
                <option value="4500">4500K 混合灯光</option>
                <option value="5000">5000K 中性日光</option>
                <option value="5200">5200K 森林/阴影</option>
                <option value="5600">5600K 晴天日光</option>
                <option value="6000">6000K 日落暖色</option>
                <option value="6500">6500K 阴天冷光</option>
              </select>
            </label>
            <label>
              ISO 模式
              <select
                value={input.isoMode}
                onChange={(event) =>
                  update(
                    "isoMode",
                    event.target.value as SceneGeneratorInput["isoMode"],
                  )
                }
              >
                <option value="auto">Auto ISO + 建议上限</option>
                <option value="manual">手动锁定 ISO</option>
              </select>
            </label>
            {input.isoMode === "manual" && (
              <label className="camera-manual-iso">
                手动 ISO
                <select
                  value={input.manualIso}
                  onChange={(event) =>
                    update(
                      "manualIso",
                      Number(
                        event.target.value,
                      ) as SceneGeneratorInput["manualIso"],
                    )
                  }
                >
                  {[50, 100, 200, 400, 800, 1250, 1600, 3200, 6400, 12800].map(
                    (value) => (
                      <option key={value} value={value}>
                        ISO {value}
                      </option>
                    ),
                  )}
                </select>
              </label>
            )}
          </fieldset>
          <fieldset className="camera-assist-controls">
            <legend>对焦、稳定与监看</legend>
            <label>
              对焦方式
              <select
                value={input.focusOverride}
                onChange={(event) =>
                  update(
                    "focusOverride",
                    event.target.value as SceneGeneratorInput["focusOverride"],
                  )
                }
              >
                <option value="auto">按场景智能建议</option>
                <option value="afc-wide">AF-C 广域</option>
                <option value="afc-tracking">AF-C 跟踪主体</option>
                <option value="single-lock">单次对焦后锁定</option>
                <option value="manual">手动对焦</option>
              </select>
            </label>
            <label>
              防抖
              <select
                value={input.stabilizationOverride}
                onChange={(event) =>
                  update(
                    "stabilizationOverride",
                    event.target
                      .value as SceneGeneratorInput["stabilizationOverride"],
                  )
                }
              >
                <option value="auto">按机位智能建议</option>
                <option value="standard">Standard 标准</option>
                <option value="active">动态增强 / Active</option>
                <option value="off">关闭</option>
              </select>
            </label>
            <label>
              斑马线
              <select
                value={input.zebraOverride}
                onChange={(event) =>
                  update(
                    "zebraOverride",
                    event.target.value as SceneGeneratorInput["zebraOverride"],
                  )
                }
              >
                <option value="95+">95+ 高光预警</option>
                <option value="100+">100+ 极限预警</option>
                <option value="off">关闭</option>
              </select>
            </label>
            <label>
              测光方式
              <select
                value={input.meteringOverride}
                onChange={(event) =>
                  update(
                    "meteringOverride",
                    event.target
                      .value as SceneGeneratorInput["meteringOverride"],
                  )
                }
              >
                <option value="highlight">高光重点</option>
                <option value="multi">多重测光</option>
                <option value="center">中央重点</option>
              </select>
            </label>
            <label className="camera-audio-control">
              收音增益
              <select
                value={input.audioControl}
                onChange={(event) =>
                  update(
                    "audioControl",
                    event.target.value as SceneGeneratorInput["audioControl"],
                  )
                }
              >
                <option value="manual-low">手动低增益 · 环境音</option>
                <option value="manual-medium">手动中等增益</option>
                <option value="auto">自动增益 · 快速记录</option>
              </select>
            </label>
          </fieldset>
          <fieldset className="camera-record-controls">
            <legend>构图与记录质量</legend>
            <label>
              焦段
              <select
                value={input.focalLength}
                onChange={(event) =>
                  update(
                    "focalLength",
                    event.target.value === "auto"
                      ? "auto"
                      : (Number(
                          event.target.value,
                        ) as SceneGeneratorInput["focalLength"]),
                  )
                }
              >
                <option value="auto">按机位智能建议</option>
                {[16, 20, 24, 28, 35, 50, 85].map((value) => (
                  <option key={value} value={value}>
                    {value}mm
                  </option>
                ))}
              </select>
            </label>
            <label>
              分辨率
              <select
                value={input.resolutionOverride}
                onChange={(event) =>
                  update(
                    "resolutionOverride",
                    event.target
                      .value as SceneGeneratorInput["resolutionOverride"],
                  )
                }
              >
                <option value="auto">按预设</option>
                <option value="4k">4K UHD</option>
                <option value="1080p">1080p Full HD</option>
              </select>
            </label>
            <label>
              色深 / 采样
              <select
                value={input.recordingQuality}
                onChange={(event) =>
                  update(
                    "recordingQuality",
                    event.target
                      .value as SceneGeneratorInput["recordingQuality"],
                  )
                }
              >
                <option value="auto">按预设</option>
                <option value="422-10">4:2:2 10-bit</option>
                <option value="420-10">4:2:0 10-bit</option>
                <option value="420-8">4:2:0 8-bit</option>
              </select>
            </label>
            <label>
              编码
              <select
                value={input.codecOverride}
                onChange={(event) =>
                  update(
                    "codecOverride",
                    event.target.value as SceneGeneratorInput["codecOverride"],
                  )
                }
              >
                <option value="auto">按预设</option>
                <option value="h265">H.265 / HEVC</option>
                <option value="h264">H.264 / AVC</option>
                <option value="prores">Apple ProRes</option>
              </select>
            </label>
            <label>
              曝光补偿
              <select
                value={input.exposureCompensation}
                onChange={(event) =>
                  update(
                    "exposureCompensation",
                    event.target
                      .value as SceneGeneratorInput["exposureCompensation"],
                  )
                }
              >
                <option value="auto">按场景建议</option>
                <option value="+0.3">+0.3 EV</option>
                <option value="0">0 EV</option>
                <option value="-0.3">-0.3 EV</option>
                <option value="-0.7">-0.7 EV</option>
              </select>
            </label>
            <label>
              画幅裁切
              <select
                value={input.cropMode}
                onChange={(event) =>
                  update(
                    "cropMode",
                    event.target.value as SceneGeneratorInput["cropMode"],
                  )
                }
              >
                <option value="full">全画幅</option>
                <option value="aps-c">APS-C / S35</option>
              </select>
            </label>
            <label className="camera-proxy-control">
              Proxy
              <select
                value={input.proxy}
                onChange={(event) =>
                  update(
                    "proxy",
                    event.target.value as SceneGeneratorInput["proxy"],
                  )
                }
              >
                <option value="off">关闭</option>
                <option value="on">开启</option>
              </select>
            </label>
          </fieldset>
        </form>

        <article className="camera-generator-result camera-generator-result-v2">
          {result ? (
            <>
              <header>
                <Camera size={22} />
                <div>
                  <small>推荐采集起点</small>
                  <h3>{result.preset.camera}</h3>
                  <p>
                    {result.preset.settings.profile} · {result.preset.scene}
                  </p>
                </div>
                <button onClick={() => onSelectPreset(result.preset.id)}>
                  打开完整预设
                </button>
              </header>
              <div
                className={`camera-delivery-route ${result.deliveryRoute.id}`}
              >
                {result.captureKind === "hlg" && input.delivery === "hdr10" ? (
                  <TriangleAlert size={18} />
                ) : (
                  <Gauge size={18} />
                )}
                <div>
                  <small>最终路线</small>
                  <strong>{result.deliveryRoute.label}</strong>
                  <p>
                    {result.captureKind === "hlg" && input.delivery === "hdr10"
                      ? "Resolve 必须完成 HLG→PQ/ST2084 变换，再以 10-bit、Rec.2020 和 PQ 元数据导出"
                      : result.captureKind === "log" && input.delivery === "hlg"
                        ? "Resolve 必须完成 Log→Rec.2100 HLG 变换，再以 10-bit、Rec.2020 和 HLG 标记导出"
                        : result.deliveryRoute.project}
                  </p>
                </div>
              </div>
              <div className="camera-result-values camera-result-values-rich">
                <span>
                  <small>画幅 / 帧率</small>
                  {result.preset.settings.resolution}
                  <b>{result.exposure.fps} FPS</b>
                </span>
                <span>
                  <small>快门起点</small>
                  {result.exposure.shutter}
                  <em>{result.exposure.controlMode.shutter}</em>
                  <b>
                    {input.shutterOverride && input.shutterOverride !== "auto"
                      ? "以试录检查运动模糊与频闪"
                      : input.motion === "fast"
                        ? "减少快速运动拖影"
                        : "约180°运动模糊"}
                  </b>
                </span>
                <span className="accent">
                  <small>ISO 建议</small>
                  {result.exposure.isoRange}
                  <em>{result.exposure.controlMode.iso}</em>
                  <b>从 ISO {result.exposure.isoStart} 起步</b>
                </span>
                <span>
                  <small>光圈目标</small>
                  {result.exposure.aperture}
                  <em>{result.exposure.controlMode.aperture}</em>
                  <b>
                    {input.depth === "deep" ? "优先空间层次" : "重新确认焦点"}
                  </b>
                </span>
                <span>
                  <small>白平衡</small>
                  {result.exposure.whiteBalance}
                  <em>{result.exposure.controlMode.whiteBalance}</em>
                </span>
                <span>
                  <small>ND 策略</small>
                  {result.exposure.nd}
                </span>
              </div>
              <aside className="camera-iso-callout">
                <strong>{result.exposure.isoRecommendation}</strong>
                <p>{result.exposure.profileNote}</p>
              </aside>
              <section className="camera-adjustment-order">
                <h4>现场调整顺序</h4>
                <ol>
                  {result.exposure.adjustmentOrder.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={14} />
                      {item}
                    </li>
                  ))}
                </ol>
              </section>
              <section className="camera-field-controls-result">
                <header>
                  <div>
                    <small>FIELD CONTROLS</small>
                    <h4>对焦、稳定、监看与收音</h4>
                  </div>
                  <button onClick={copyFieldSheet}>
                    {fieldSheetCopied ? (
                      <ClipboardCheck size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                    {fieldSheetCopied ? "参数单已复制" : "复制现场参数单"}
                  </button>
                </header>
                <div>
                  {Object.entries(result.exposure.fieldControls).map(
                    ([key, value]) => (
                      <span key={key}>
                        <small>
                          {
                            (
                              {
                                focus: "对焦",
                                stabilization: "防抖",
                                zebra: "斑马线",
                                metering: "测光",
                                audio: "收音",
                              } as Record<string, string>
                            )[key]
                          }
                        </small>
                        {value}
                      </span>
                    ),
                  )}
                </div>
                <div className="camera-recording-result">
                  {Object.entries(result.exposure.recordingControls).map(
                    ([key, value]) => (
                      <span key={key}>
                        <small>
                          {
                            (
                              {
                                focal: "焦段",
                                resolution: "分辨率",
                                quality: "色深/采样",
                                codec: "编码",
                                exposureCompensation: "曝光补偿",
                                crop: "画幅",
                                proxy: "Proxy",
                              } as Record<string, string>
                            )[key]
                          }
                        </small>
                        {value}
                      </span>
                    ),
                  )}
                </div>
              </section>
              <details>
                <summary>展开风险与补充建议</summary>
                <ol>
                  {result.adjustments.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={14} />
                      {item}
                    </li>
                  ))}
                </ol>
              </details>
            </>
          ) : (
            <p>当前条件没有可用预设。</p>
          )}
        </article>
      </div>

      {result && (
        <section className="camera-iso-scenarios">
          <header>
            <div>
              <small>ISO FIELD EXAMPLES</small>
              <h3>同一配置在不同光线下怎么起步</h3>
            </div>
            {result.exposure.compatibilityWarnings.length > 0 && (
              <aside className="camera-control-warnings">
                <TriangleAlert size={16} />
                <div>
                  {result.exposure.compatibilityWarnings.map((warning) => (
                    <p key={warning}>{warning}</p>
                  ))}
                </div>
              </aside>
            )}
            <p>
              以当前推荐预设的可用 ISO
              范围计算；现场仍以高光、噪声、运动和监看为准。
            </p>
          </header>
          <div>
            {isoExamples.map((item) => (
              <article key={item.illumination}>
                <small>{item.label}</small>
                <strong>ISO {item.start}</strong>
                <span>建议 Auto {item.range}</span>
                <p>{item.note}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="camera-calculators">
        <article>
          <Calculator size={20} />
          <div>
            <h3>180°快门换算</h3>
            <p>输入拍摄帧率，得到自然运动模糊的起始快门。</p>
          </div>
          <label>
            <input
              type="number"
              min="1"
              max="240"
              value={fps}
              onChange={(event) => setFps(Number(event.target.value) || 1)}
            />
            FPS
          </label>
          <output>{shutterForFps(fps)}</output>
        </article>
        <article>
          <CloudRain size={20} />
          <div>
            <h3>ND档位辅助</h3>
            <p>测光比目标亮多少EV，就从相近档位开始。</p>
          </div>
          <label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.3"
              value={ev}
              onChange={(event) => setEv(Number(event.target.value) || 0)}
            />
            EV
          </label>
          <output>ND {estimateNdStops(ev)}档</output>
        </article>
        <article>
          <HardDrive size={20} />
          <div>
            <h3>容量与录制时长</h3>
            <p>按视频码率估算，不包含格式化损耗及额外音轨。</p>
          </div>
          <div className="camera-calc-fields">
            <label>
              <input
                type="number"
                min="1"
                value={bitrate}
                onChange={(event) =>
                  setBitrate(Number(event.target.value) || 1)
                }
              />
              Mbps
            </label>
            <label>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(event) =>
                  setDuration(Number(event.target.value) || 1)
                }
              />
              分钟
            </label>
            <label>
              <input
                type="number"
                min="1"
                value={storage}
                onChange={(event) =>
                  setStorage(Number(event.target.value) || 1)
                }
              />
              GB
            </label>
          </div>
          <output>
            {recordingStorageGb(bitrate, duration).toFixed(1)}GB
            <br />
            <small>
              {storage}GB约录
              {Math.floor(recordingMinutesForStorage(storage, bitrate))}分钟
            </small>
          </output>
        </article>
        <article>
          <Lightbulb size={20} />
          <div>
            <h3>防频闪快门</h3>
            <p>市电灯光下优先测试这些快门，最终以试录回放为准。</p>
          </div>
          <div className="camera-frequency-switch">
            <button
              className={mainsHz === 50 ? "active" : ""}
              onClick={() => setMainsHz(50)}
            >
              50Hz
            </button>
            <button
              className={mainsHz === 60 ? "active" : ""}
              onClick={() => setMainsHz(60)}
            >
              60Hz
            </button>
          </div>
          <output>{flickerSafeShutters(fps, mainsHz).join(" · ")}</output>
        </article>
      </div>

      <aside className="camera-pipeline-guide">
        <Save size={18} />
        <div>
          <strong>PP10 / HLG2 是 HLG HDR 采集，不等于 HDR10 / PQ</strong>
          <p>
            相机 PP10 HLG2 / BT.2020 → Resolve Rec.2100 HLG → HLG
            HDR；如果最终选择 HDR10，则必须在色彩管理中正确转换为 Rec.2100
            ST2084/PQ。两条路线都可被 YouTube 识别为 HDR，但不能混用标签。
          </p>
        </div>
      </aside>

      <section className="camera-device-capabilities">
        <header>
          <div>
            <small>MY DEVICES</small>
            <h3>设备能力摘要</h3>
          </div>
          <p>
            根据当前参数库中已经验证和使用的组合汇总，不代表厂商规格表中的全部极限模式。
          </p>
        </header>
        <div>
          {deviceCapabilities.map((item) => (
            <article key={item.device}>
              <Camera size={18} />
              <div>
                <h4>{item.device}</h4>
                <p>
                  {item.resolutions.join(" · ")} · 最高已用 {item.maxFps} FPS
                </p>
                <span>
                  {item.profiles.length
                    ? item.profiles.join(" · ")
                    : "标准色彩"}
                </span>
                <span>
                  {item.color.length ? item.color.join(" · ") : "色深待补充"}
                </span>
                <small>{item.scenes}种场景方案</small>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
