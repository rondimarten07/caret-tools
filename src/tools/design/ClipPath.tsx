import { useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const SHAPES = [
  { name: "Triangle", value: "polygon(50% 0%, 0% 100%, 100% 100%)" },
  { name: "Trapezoid", value: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)" },
  { name: "Parallelogram", value: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)" },
  { name: "Rhombus", value: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" },
  { name: "Pentagon", value: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" },
  { name: "Hexagon", value: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" },
  { name: "Heptagon", value: "polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)" },
  { name: "Octagon", value: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" },
  { name: "Star", value: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" },
  { name: "Chevron", value: "polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)" },
  { name: "Message", value: "polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)" },
  { name: "Cross", value: "polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)" },
];

export default function ClipPath() {
  const [active, setActive] = useState(SHAPES[0]);
  const css = `clip-path: ${active.value};`;

  return (
    <ToolShell title="CSS Clip-Path" description="Preset CSS clip-path polygons with live preview." category={categoryMap.design}
      shareable>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {SHAPES.map((s) => (
          <Card
            key={s.name}
            onClick={() => setActive(s)}
            className={`cursor-pointer p-3 transition-all hover:-translate-y-0.5 ${active.name === s.name ? "ring-2 ring-primary" : ""}`}
          >
            <div className="grid h-28 place-items-center bg-muted/30">
              <div className="h-20 w-20 bg-primary" style={{ clipPath: s.value }} />
            </div>
            <div className="mt-2 text-center text-sm font-medium">{s.name}</div>
          </Card>
        ))}
      </div>
      <Card className="flex items-center gap-2 p-3">
        <code className="flex-1 break-all rounded-md bg-muted/30 p-3 font-mono text-xs">{css}</code>
        <CopyButton value={css} />
      </Card>
    </ToolShell>
  );
}
