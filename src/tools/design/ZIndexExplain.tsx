import { ToolShell } from "@/components/tool/ToolShell";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const CONTEXTS: { trigger: string; example: string }[] = [
  { trigger: "Root element", example: "html — always a stacking context." },
  { trigger: "position + z-index (≠ auto)", example: "position: relative; z-index: 1;" },
  { trigger: "opacity < 1", example: "opacity: 0.99;" },
  { trigger: "transform (non-none)", example: "transform: translateZ(0);" },
  { trigger: "filter (non-none)", example: "filter: blur(0);" },
  { trigger: "will-change of any transform property", example: "will-change: transform;" },
  { trigger: "isolation: isolate", example: "isolation: isolate; (explicit, no other side effects)" },
  { trigger: "mix-blend-mode (non-normal)", example: "mix-blend-mode: multiply;" },
  { trigger: "position: fixed / sticky", example: "position: fixed;" },
  { trigger: "Flex/grid item with z-index ≠ auto", example: "display: flex; > child { z-index: 1; }" },
];

export default function ZIndexExplain() {
  return (
    <ToolShell title="Z-Index Explainer" description="What actually creates a stacking context — and why your z-index isn't working." category={categoryMap.design}>
      <Card className="p-4">
        <p className="text-sm">
          A <strong>z-index</strong> only competes within its own stacking context. A child with <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">z-index: 9999</code> can <em>still</em> be hidden under a sibling if its parent has a lower z-index — because the parent forms a new stacking context.
        </p>
      </Card>
      <Card className="overflow-hidden p-0">
        <div className="border-b p-3 text-xs uppercase text-muted-foreground">Triggers that create a new stacking context</div>
        <table className="w-full text-sm">
          <tbody>
            {CONTEXTS.map((c) => (
              <tr key={c.trigger} className="border-b last:border-0">
                <td className="p-3 font-medium">{c.trigger}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{c.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="p-4">
        <p className="text-sm font-medium">Visual demo</p>
        <p className="mt-1 text-xs text-muted-foreground">
          The orange box has <code className="rounded bg-muted px-1 font-mono text-xs">z-index: 9999</code> but lives inside a parent with <code className="rounded bg-muted px-1 font-mono text-xs">z-index: 1</code>. The blue box is <code className="rounded bg-muted px-1 font-mono text-xs">z-index: 2</code> at the top level — and wins.
        </p>
        <div className="relative mt-4 h-48">
          <div style={{ position: "absolute", inset: "30px 40px 30px 30px", background: "rgb(34 197 94 / 0.5)", zIndex: 1 }} className="rounded-md p-3 text-xs">
            <div className="text-xs font-medium">Parent (z=1, new context)</div>
            <div style={{ position: "absolute", inset: "40px 20px 20px 20px", background: "rgb(249 115 22)", zIndex: 9999 }} className="rounded-md p-3 text-xs text-white">
              Child z=9999
            </div>
          </div>
          <div style={{ position: "absolute", inset: "60px 80px 10px 60px", background: "rgb(59 130 246)", zIndex: 2 }} className="rounded-md p-3 text-xs text-white">
            Sibling z=2 — appears on top
          </div>
        </div>
      </Card>
    </ToolShell>
  );
}
