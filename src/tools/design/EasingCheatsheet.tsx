import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const EASINGS: { name: string; value: string; tailwind?: string; note: string }[] = [
  { name: "linear", value: "linear", tailwind: "ease-linear", note: "Constant velocity — uniform motion (rare in UI)." },
  { name: "ease", value: "ease", note: "CSS default. Slow-start, fast-middle, slow-end." },
  { name: "ease-in", value: "cubic-bezier(0.4, 0, 1, 1)", tailwind: "ease-in", note: "Accelerates — for things leaving the screen." },
  { name: "ease-out", value: "cubic-bezier(0, 0, 0.2, 1)", tailwind: "ease-out", note: "Decelerates — for things entering. Most natural for UI reveal." },
  { name: "ease-in-out", value: "cubic-bezier(0.4, 0, 0.2, 1)", tailwind: "ease-in-out", note: "Tailwind default. Smooth both ends." },
  { name: "ease-out-quad", value: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", note: "Soft deceleration. Good for tooltips, popovers." },
  { name: "ease-out-cubic", value: "cubic-bezier(0.215, 0.61, 0.355, 1)", note: "Sharper deceleration. Modal/dialog entry." },
  { name: "ease-out-quart", value: "cubic-bezier(0.165, 0.84, 0.44, 1)", note: "Snappy stop. Fast UI feedback." },
  { name: "ease-out-expo", value: "cubic-bezier(0.19, 1, 0.22, 1)", note: "Almost instant deceleration. Punchy." },
  { name: "ease-out-back", value: "cubic-bezier(0.175, 0.885, 0.32, 1.275)", note: "Slight overshoot — \"pop\" feel." },
  { name: "ease-in-out-back", value: "cubic-bezier(0.68, -0.55, 0.265, 1.55)", note: "Overshoot both ends. Bouncy modal." },
  { name: "Material standard", value: "cubic-bezier(0.4, 0, 0.2, 1)", note: "Google Material — same as ease-in-out used by Tailwind." },
  { name: "iOS spring (approx)", value: "cubic-bezier(0.5, 1.5, 0.5, 0.9)", note: "Subtle spring without real physics." },
];

export default function EasingCheatsheet() {
  return (
    <ToolShell title="CSS Easing Cheatsheet" description="Common animation curves — copy a value, see the feel." category={categoryMap.design}>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Name</th>
              <th className="p-3">cubic-bezier</th>
              <th className="p-3">Tailwind</th>
              <th className="p-3">Notes</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {EASINGS.map((e) => (
              <tr key={e.name} className="border-b last:border-0">
                <td className="p-3 font-medium">{e.name}</td>
                <td className="p-3 font-mono text-xs">{e.value}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{e.tailwind || "—"}</td>
                <td className="p-3 text-muted-foreground">{e.note}</td>
                <td className="p-3"><CopyButton value={e.value} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="space-y-4 p-4">
        <div className="text-xs uppercase text-muted-foreground">Live preview</div>
        <div className="space-y-3">
          {EASINGS.slice(0, 6).map((e) => (
            <div key={e.name} className="text-xs">
              <div className="mb-1 font-mono text-muted-foreground">{e.name}</div>
              <div className="relative h-3 overflow-hidden rounded-full bg-muted">
                <div className="ease-demo h-full w-1/4 rounded-full bg-primary" style={{ animation: `easeDemoAnim 2s ${e.value} infinite alternate` }} />
              </div>
            </div>
          ))}
        </div>
        <style>{`@keyframes easeDemoAnim { from { transform: translateX(0); } to { transform: translateX(300%); } }`}</style>
      </Card>
    </ToolShell>
  );
}
