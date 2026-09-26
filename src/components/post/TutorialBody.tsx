import { AlertTriangle, CheckCircle2 } from "lucide-react";

type TutorialBodyContent = {
  scenario: string;
  prerequisite?: string;
  settings: readonly string[];
  steps: readonly string[];
  checks: readonly string[];
  pitfall: string;
};

export function TutorialBody({ tutorial }: { tutorial: TutorialBodyContent }) {
  return (
    <div className="resolve-tutorial-body">
      <p className="resolve-tutorial-scenario">
        <strong>适用场景</strong>{tutorial.scenario}
      </p>
      {tutorial.prerequisite && (
        <p className="resolve-tutorial-prerequisite">
          <strong>开始前</strong>{tutorial.prerequisite}
        </p>
      )}
      <div className="resolve-tutorial-settings">
        {tutorial.settings.map((item) => <span key={item}>{item}</span>)}
      </div>
      <section>
        <strong>跟着做</strong>
        <ol>{tutorial.steps.map((item) => <li key={item}>{item}</li>)}</ol>
      </section>
      <section>
        <strong>通过标准</strong>
        <ul>{tutorial.checks.map((item) => (
          <li key={item}><CheckCircle2 size={12} />{item}</li>
        ))}</ul>
      </section>
      <p className="resolve-tutorial-pitfall">
        <AlertTriangle size={12} />
        <span><strong>常见失败：</strong>{tutorial.pitfall}</span>
      </p>
    </div>
  );
}
