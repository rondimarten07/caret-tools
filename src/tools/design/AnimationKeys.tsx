import { ToolShell } from "@/components/tool/ToolShell";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const PROPS: { name: string; values: string; what: string }[] = [
  { name: "animation-name", values: "<keyframes-name>", what: "Which @keyframes block to play." },
  { name: "animation-duration", values: "<time>", what: "How long one cycle takes." },
  { name: "animation-timing-function", values: "linear, ease, cubic-bezier(), steps()", what: "Speed curve." },
  { name: "animation-delay", values: "<time>", what: "Wait before starting." },
  { name: "animation-iteration-count", values: "1 | infinite | <number>", what: "How many times to repeat." },
  { name: "animation-direction", values: "normal | reverse | alternate | alternate-reverse", what: "Forward, reverse, or ping-pong between." },
  { name: "animation-fill-mode", values: "none | forwards | backwards | both", what: "What styles apply before/after the animation runs." },
  { name: "animation-play-state", values: "running | paused", what: "Toggleable via JS — useful for hover/focus pause." },
];

const EXAMPLE = `@keyframes slide-in {
  from { transform: translateX(-100%); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}

.toast {
  animation: slide-in 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}`;

export default function AnimationKeys() {
  return (
    <ToolShell title="Animation Properties" description="The eight CSS animation properties and what each controls." category={categoryMap.design}>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Property</th>
              <th className="p-3">Values</th>
              <th className="p-3">What it does</th>
            </tr>
          </thead>
          <tbody>
            {PROPS.map((p) => (
              <tr key={p.name} className="border-b last:border-0">
                <td className="p-3 font-mono">{p.name}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{p.values}</td>
                <td className="p-3 text-muted-foreground">{p.what}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="p-4">
        <div className="mb-2 text-xs uppercase text-muted-foreground">Example</div>
        <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{EXAMPLE}</pre>
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        For multi-property animation: <code className="font-mono">animation: name duration timing delay iteration-count direction fill-mode play-state;</code>
      </div>
    </ToolShell>
  );
}
