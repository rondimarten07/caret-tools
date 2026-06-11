import { ToolShell } from "@/components/tool/ToolShell";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const PAIRS: { logical: string; physical: string; note: string }[] = [
  { logical: "inline-size", physical: "width", note: "Size along the writing direction." },
  { logical: "block-size", physical: "height", note: "Size across the writing direction." },
  { logical: "margin-inline", physical: "margin-left + margin-right", note: "Start and end of the inline axis." },
  { logical: "margin-inline-start", physical: "margin-left (LTR) / margin-right (RTL)", note: "Where reading begins." },
  { logical: "margin-inline-end", physical: "margin-right (LTR) / margin-left (RTL)", note: "Where reading ends." },
  { logical: "margin-block", physical: "margin-top + margin-bottom", note: "Both ends of the block axis." },
  { logical: "margin-block-start", physical: "margin-top", note: "Top in horizontal writing." },
  { logical: "margin-block-end", physical: "margin-bottom", note: "Bottom in horizontal writing." },
  { logical: "padding-inline", physical: "padding-left + padding-right", note: "Padding along reading direction." },
  { logical: "padding-block", physical: "padding-top + padding-bottom", note: "Padding across reading direction." },
  { logical: "border-inline-start", physical: "border-left (LTR)", note: "Border on the reading-start side." },
  { logical: "border-block-end", physical: "border-bottom", note: "Border below the block." },
  { logical: "inset", physical: "top + right + bottom + left", note: "Shorthand for position offsets." },
  { logical: "inset-inline-start", physical: "left (LTR) / right (RTL)", note: "Position offset at the start." },
  { logical: "inset-block-end", physical: "bottom", note: "Position offset at the block end." },
  { logical: "border-start-start-radius", physical: "border-top-left-radius (LTR)", note: "Logical corner radius — RTL-aware." },
];

export default function LogicalProperties() {
  return (
    <ToolShell title="CSS Logical Properties" description="Write CSS once that flips automatically for RTL languages and vertical writing." category={categoryMap.design}>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Logical</th>
              <th className="p-3">Physical equivalent</th>
              <th className="p-3">Note</th>
            </tr>
          </thead>
          <tbody>
            {PAIRS.map((p) => (
              <tr key={p.logical} className="border-b last:border-0">
                <td className="p-3 font-mono">{p.logical}</td>
                <td className="p-3 font-mono text-muted-foreground">{p.physical}</td>
                <td className="p-3">{p.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        <strong>inline</strong> = direction of reading (horizontal for English, vertical for Japanese). <strong>block</strong> = direction the page flows. Reach for these whenever you'd otherwise need to override margins for RTL.
      </div>
    </ToolShell>
  );
}
