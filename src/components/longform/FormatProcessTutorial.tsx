import { AlertTriangle, Check, Clapperboard, Clock3, Film, Headphones, Mic2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { longformQualityGates, type LongformBlueprint, type LongformFormat, type LongformFormatId } from "../../data/longformProduction.js";

interface TutorialNote { scale: string; principle: string; fieldExample: string; editExample: string; pass: string }
interface CourseStep { title: string; detail: string; example: string; check: string }
interface CourseLesson { id: string; name: string; english: string; goal: string; steps: CourseStep[] }
const tutorialNotes: Record<Exclude<LongformFormatId,"documentary">,TutorialNote> = {
  cinematic: { scale: "建议6–12个拍摄日 · 25–80小时素材", principle: "空间、方向、时间和声音先成立，电影化才成立。", fieldExample: "拍一段山路旅程时，先获得驶入、道路关系、车内行动、抵达和环境变化，再补晨雾、车灯与纹理；不要只有无人机大景。", editExample: "先做无音乐路线粗剪，确认观众知道从哪里到哪里；再用环境声连接章节，最后才决定哪些段落需要音乐。", pass: "关闭音乐仍能理解路线与章节变化；所有漂亮镜头都有明确叙事位置。" },
  observational: { scale: "建议3–8次完整技术测试 · 1.3–2倍素材比", principle: "连续体验来自可靠记录和克制剪辑，而不是绝对不剪。", fieldExample: "90分钟夜驾要先测试供电、过热、文件分段、雨滴、频闪和双声道；驾驶中不触碰设备，故障由乘员或停车后记录。", editExample: "先删除隐私、损坏和危险片段，再按真实路线连接；用同地点Room Tone修复剪点，不用音乐遮住道路声断裂。", pass: "完整观看无方向跳跃、声底抽吸、自动曝光漂移或驾驶安全问题。" },
  "road-essay": { scale: "建议8–15个地点 · 40–100小时现场与资料", principle: "每一个观点都要有现场观察、来源或明确的个人立场。", fieldExample: "讨论老城区消失时，要拍现实街道、具体建筑、居民行动和可核查资料，而不是只用车窗蒙太奇配感伤旁白。", editExample: "建立‘主张—证据—反例’表，再写旁白；删掉画面已经说明的句子，给每章保留无旁白观察段。", pass: "观众能分清事实、引用、观察和个人推测，每章都带来新地点与新认识。" },
  portrait: { scale: "建议12–25个跟拍日 · 80–150小时素材与档案", principle: "人物不是履历，而是在选择、关系和代价中被看见。", fieldExample: "拍一位传统手艺人时，完整跟拍他工作、返工、与家人讨论接班和面对客户，而不是只拍获奖证书和赞美采访。", editExample: "先建人生时间线，再选择3–5次关键决定作为章节；本人、家属、同行和现实行为互相印证。", pass: "影片同时呈现能力、矛盾、关系和代价，没有把人物拍成宣传对象。" },
  investigative: { scale: "建议8–20周调查 · 每项主张至少两类独立证据", principle: "戏剧性不能高于证据强度、来源安全和回应权。", fieldExample: "调查污染问题时，把检测报告、现场排放、居民影响、专家解释和企业回应分别留档，不能只靠一位匿名受访者。", editExample: "每段时间线标记‘已证实、当事人指控、合理推断、无法核实’，并把被质疑方的完整回应放在相关主张附近。", pass: "任何核心结论都能回到原始材料复核，匿名来源无法从声画和元数据被反向识别。" },
  nature: { scale: "建议1个完整季节窗口 · 数周至数月观察", principle: "动物福利和行为真实性高于稀有镜头。", fieldExample: "拍鸟类育雏时用长焦和固定隐藏机位，记录安全距离、天气和行为；出现警戒、弃巢倾向立即撤离。", editExample: "不同日期、地点和个体不可剪成一次连续行为；旁白把已知研究、现场观察和推测明确分开。", pass: "没有诱饵、追逐、虚假行为连续或敏感坐标泄露，科学顾问完成行为复核。" },
  history: { scale: "建议6–12个现场 · 20–50项核心档案来源", principle: "历史叙述必须让当代现场、档案与解释边界同时可见。", fieldExample: "讲古村迁徙时，拍当代空间、族谱原件、地图方位、居民使用遗址的行动和研究者分歧，而不是旁白配网络旧照。", editExample: "时间线上的每个事实连接来源页码；传说、口述记忆、研究结论和导演推测使用不同措辞与画面标注。", pass: "所有档案可追溯，重演和生成画面明确标注，观众知道哪些历史问题仍无法确定。" },
};
function four(items: string[]) { return [0,1,2,3].map((index) => items[index % items.length]!); }
function buildLessons(format: LongformFormat, blueprint: LongformBlueprint, note: TutorialNote): CourseLesson[] {
  const make = (id: string,name: string,english: string,goal: string,items: string[],example: string,checkPrefix: string): CourseLesson => ({ id,name,english,goal,steps: four(items).map((item,index) => ({ title:item,detail:`${item}。把它写入${name}记录，并对应到具体人物、地点、日期、镜头或来源，不能只停留在口头计划。`,example:index === 0 ? example : `以“${blueprint.chapterPlan[index % blueprint.chapterPlan.length]!.purpose}”这一章为例：先完成“${item}”，再决定是否进入下一项制作。`,check:`${checkPrefix}：能够拿出可查看的记录或素材，证明已经完成“${item}”。` })) });
  return [
    make("premise","选题与章节设计","STORY DESIGN",`把${format.name}的观众承诺变成可拍摄、可完成的章节。`,[format.promise,...format.structure],note.fieldExample,"结构过关"),
    make("research","调研、许可与制片","RESEARCH",`在开机前解决事实、权限、时间、预算和替代方案。`,blueprint.preparation,note.fieldExample,"前期过关"),
    make("interview","采访或研究问题","INTERVIEW & RESEARCH",`获得具体、开放、可核对且符合该类型伦理边界的信息。`,blueprint.interviewQuestions,note.fieldExample,"信息过关"),
    make("field","现场拍摄教程","FIELD PRODUCTION",`按照真实事件的顺序获得完整动作、空间关系、细节和结果。`,[...blueprint.shootingDay,...format.shooting],note.fieldExample,"现场过关"),
    make("sound","声音设计与记录","SOUND",`让主声、环境声、过渡声和音乐各自承担清晰功能。`,blueprint.soundPlan,`声音执行示例：${blueprint.soundPlan[0]}；随后用耳机完整回听，而不是只观察电平表。`,"声音过关"),
    make("editing","剪辑、事实与版本迭代","EDITING",`从可理解的结构开始，再处理节奏、风格、声音和色彩。`,blueprint.editPasses.map((item) => `${item.name}：${item.goal}`),note.editExample,"剪辑过关"),
    make("delivery","完成、质检与交付","FINISHING",`分别验证事实伦理、声画技术、字幕、平台文件和可恢复归档。`,[...longformQualityGates.map((gate) => `${gate.category}：${gate.items[0]}`),...format.risks],note.pass,"交付过关"),
  ];
}
export function FormatProcessTutorial({ format,blueprint }: { format: LongformFormat; blueprint: LongformBlueprint }) {
  const note = tutorialNotes[format.id as Exclude<LongformFormatId,"documentary">];
  const lessons = buildLessons(format,blueprint,note);
  const [lessonId,setLessonId] = useState(lessons[0]!.id);
  useEffect(() => setLessonId("premise"),[format.id]);
  const lesson = lessons.find((item) => item.id === lessonId) ?? lessons[0]!;
  return <section className="format-process-tutorial">
    <header><div><p className="eyebrow">COMPLETE PRODUCTION COURSE</p><h2>{format.name}完整制作教程</h2><p>{note.principle}</p></div><span><Clock3 size={15} />{note.scale}</span></header>
    <aside className="format-course-example"><ShieldCheck size={18} /><div><small>开始前先理解这种类型如何成立</small><p>{note.fieldExample}</p></div></aside>
    <section className="format-runtime"><header><div><small>PART 01</small><h3>{format.name}成片逐章结构</h3></div><p>{blueprint.target}｜{blueprint.shootingRatio}</p></header><div>{blueprint.chapterPlan.map((chapter,index) => <article key={chapter.range}><header><span>{String(index + 1).padStart(2,"0")}</span><div><small>{chapter.range}</small><h4>{chapter.purpose}</h4></div></header><p className="chapter-job">本章任务：{chapter.material}</p><h5>必须拍到</h5><ul>{four([format.shooting[index % format.shooting.length]!,blueprint.preparation[index % blueprint.preparation.length]!,blueprint.soundPlan[index % blueprint.soundPlan.length]!,blueprint.shootingDay[index % blueprint.shootingDay.length]!]).map((item) => <li key={item}><Check size={12} />{item}</li>)}</ul><aside><AlertTriangle size={12} />禁止：{format.risks[index % format.risks.length]}</aside></article>)}</div></section>
    <section className="format-full-course"><header><div><small>PART 02</small><h3>从前期到交付的完整教程</h3></div><p>每门课程都有具体做法、对应类型的实际例子，以及进入下一阶段前的过关标准。</p></header><nav>{lessons.map((item,index) => <button key={item.id} className={item.id === lesson.id ? "active" : ""} onClick={() => setLessonId(item.id)}><span>{String(index + 1).padStart(2,"0")}</span><strong>{item.name}</strong><small>{item.english}</small></button>)}</nav><article><header><div><small>{lesson.english}</small><h3>{lesson.name}</h3></div><p>{lesson.goal}</p></header><div>{lesson.steps.map((step,index) => <section key={`${lesson.id}-${index}`}><span>{String(index + 1).padStart(2,"0")}</span><div><h4>{step.title}</h4><p>{step.detail}</p><aside><Film size={13} /><div><small>该类型实际例子</small>{step.example}</div></aside><footer><Check size={13} /><div><small>过关标准</small>{step.check}</div></footer></div></section>)}</div></article></section>
    <section className="format-course-notes"><article><Mic2 size={19} /><div><strong>内容不能只靠解释</strong><p>每章至少有一段能够独立成立的现场、行动或证据画面，让观众看到事情如何发生。</p></div></article><article><Headphones size={19} /><div><strong>声音必须从现场开始</strong><p>先保证主声和环境空间可靠，再考虑音乐；音乐不能替代证据，也不能制造原现场不存在的情绪结论。</p></div></article></section>
    <footer><Clapperboard size={16} /><div><small>最终完成标准</small><strong>{note.pass}</strong></div></footer>
  </section>;
}
