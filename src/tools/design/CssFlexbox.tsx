import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Dir = "row" | "row-reverse" | "column" | "column-reverse";
type Wrap = "nowrap" | "wrap" | "wrap-reverse";
type Justify = "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
type Align = "stretch" | "flex-start" | "flex-end" | "center" | "baseline";

export default function CssFlexbox() {
  const [direction, setDirection] = useState<Dir>("row");
  const [wrap, setWrap] = useState<Wrap>("nowrap");
  const [justifyContent, setJustifyContent] = useState<Justify>("flex-start");
  const [alignItems, setAlignItems] = useState<Align>("stretch");
  const [gap, setGap] = useState(8);

  const css = useMemo(
    () => `display: flex;
flex-direction: ${direction};
flex-wrap: ${wrap};
justify-content: ${justifyContent};
align-items: ${alignItems};
gap: ${gap}px;`,
    [direction, wrap, justifyContent, alignItems, gap]
  );

  return (
    <ToolShell title="CSS Flexbox Playground" description="Tweak direction, wrap, justify and align — copy the CSS." category={categoryMap.design}
      shareable>
      <Card className="space-y-3 p-3">
        {[
          { label: "direction", value: direction, set: setDirection, opts: ["row", "row-reverse", "column", "column-reverse"] as Dir[] },
          { label: "wrap", value: wrap, set: setWrap, opts: ["nowrap", "wrap", "wrap-reverse"] as Wrap[] },
          { label: "justify-content", value: justifyContent, set: setJustifyContent, opts: ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"] as Justify[] },
          { label: "align-items", value: alignItems, set: setAlignItems, opts: ["stretch", "flex-start", "flex-end", "center", "baseline"] as Align[] },
        ].map((row) => (
          <div key={row.label} className="flex flex-wrap items-center gap-2">
            <Label className="w-32 text-xs">{row.label}</Label>
            {row.opts.map((o) => (
              <Button key={o} size="sm" variant={row.value === o ? "default" : "outline"} onClick={() => (row.set as (v: string) => void)(o)}>{o}</Button>
            ))}
          </div>
        ))}
        <div className="flex items-center gap-2">
          <Label className="w-32 text-xs">gap (px)</Label>
          <input type="range" min={0} max={40} value={gap} onChange={(e) => setGap(Number(e.target.value))} className="flex-1 accent-primary" />
          <code className="w-12 text-right font-mono text-sm">{gap}</code>
        </div>
      </Card>
      <Card className="p-3">
        <div className="min-h-[200px] rounded-md bg-muted/20 p-3" style={{ display: "flex", flexDirection: direction, flexWrap: wrap, justifyContent, alignItems, gap: `${gap}px` }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid place-items-center rounded-md bg-primary/15 text-sm font-mono text-primary ring-1 ring-primary/20" style={{ width: 60 + i * 10, height: 60 + (i % 3) * 15 }}>{i + 1}</div>
          ))}
        </div>
      </Card>
      <Card className="flex items-start gap-2 p-3">
        <pre className="flex-1 overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">{css}</pre>
        <CopyButton value={css} />
      </Card>
    </ToolShell>
  );
}
