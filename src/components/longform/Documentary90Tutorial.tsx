import { AlertTriangle, Check, ChevronRight, Clock3, Film, Headphones, Mic2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { documentary90Chapters, documentary90Targets, documentaryLessons } from "../../data/documentaryTutorial.js";

interface Documentary90TutorialProps {
  openCameraLibrary: () => void;
  openPostWorkflow: () => void;
}

export function Documentary90Tutorial({ openCameraLibrary, openPostWorkflow }: Documentary90TutorialProps) {
  const [lessonId, setLessonId] = useState(documentaryLessons[0]!.id);
  const lesson = documentaryLessons.find((item) => item.id === lessonId)!;
  const totalMinutes = documentary90Chapters.reduce((total, item) => total + item.minutes, 0);

  return <section className="documentary-tutorial">
    <header>
      <div><p className="eyebrow">90-MINUTE DOCUMENTARY COURSE</p><h2>从一个选题到90分钟纪实纪录片</h2><p>适用于人物、地方、行业和社会观察题材。先按现实事件构建故事，再用采访、证据、观察画面和声音完成整片。</p></div>
      <span><Clock3 size={16} />{totalMinutes}分钟成片结构</span>
    </header>

    <div className="documentary-targets">{documentary90Targets.map(([label,value]) => <dl key={label}><dt>{label}</dt><dd>{value}</dd></dl>)}</div>

    <aside className="documentary-start-rule"><ShieldCheck size={20} /><div><strong>开始拍摄前的判断</strong><p>90分钟不是把短片拉长。只有当现实中存在持续行动、人物关系、阻力、变化和可验证结果时，才适合做成长纪录片；如果只有一次采访和漂亮空镜，应先完成20–30分钟版本。</p></div></aside>

    <section className="documentary-runtime">
      <header><div><small>PART 01</small><h3>90分钟成片逐章结构</h3></div><p>每章都必须完成一个新的叙事任务，时间可以微调，但九章合计必须形成变化。</p></header>
      <div>{documentary90Chapters.map((chapter,index) => <article key={chapter.range}>
        <header><span>{String(index + 1).padStart(2,"0")}</span><div><small>{chapter.range} · {chapter.minutes}分钟</small><h4>{chapter.title}</h4></div></header>
        <p className="chapter-job">{chapter.storyJob}</p>
        <h5>必须拍到</h5>
        <ul>{chapter.requiredScenes.map((scene) => <li key={scene}><Check size={12} />{scene}</li>)}</ul>
        <aside><AlertTriangle size={12} />{chapter.warning}</aside>
      </article>)}</div>
    </section>

    <section className="documentary-course">
      <header><div><small>PART 02</small><h3>从前期到交付的完整教程</h3></div><p>按顺序学习；每一步都包含具体做法、拍摄例子与进入下一步前的检查标准。</p></header>
      <nav>{documentaryLessons.map((item,index) => <button key={item.id} className={item.id === lessonId ? "active" : ""} onClick={() => setLessonId(item.id)}><span>{String(index + 1).padStart(2,"0")}</span><strong>{item.name}</strong><small>{item.english}</small></button>)}</nav>
      <article>
        <header><div><small>{lesson.english}</small><h3>{lesson.name}</h3></div><p>{lesson.goal}</p></header>
        <div>{lesson.steps.map((step,index) => <section key={step.title}>
          <span>{String(index + 1).padStart(2,"0")}</span>
          <div><h4>{step.title}</h4><p>{step.detail}</p><aside><Film size={13} /><div><small>实际例子</small>{step.example}</div></aside><footer><Check size={13} /><div><small>过关标准</small>{step.check}</div></footer></div>
        </section>)}</div>
      </article>
    </section>

    <section className="documentary-field-checklist">
      <article><Mic2 size={20} /><div><strong>采访不是全部</strong><p>每10分钟至少应有一段可以不靠采访独立成立的观察场景。采访负责记忆、观点与反思，行动画面负责证明现实如何发生。</p></div></article>
      <article><Headphones size={20} /><div><strong>声音也是证据</strong><p>保留人物停顿、空间底噪和行动声音。音乐只能组织结构，不能用来制造原现场并不存在的悲伤、危险或胜利。</p></div></article>
    </section>

    <footer><button onClick={openCameraLibrary}>准备相机与录音参数</button><button onClick={openPostWorkflow}>进入达芬奇后期流程<ChevronRight size={14} /></button></footer>
  </section>;
}
