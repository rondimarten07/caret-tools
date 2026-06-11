import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const TAILWIND_DEFAULTS = [
  { name: "xs", px: 12, lh: 16 },
  { name: "sm", px: 14, lh: 20 },
  { name: "base", px: 16, lh: 24 },
  { name: "lg", px: 18, lh: 28 },
  { name: "xl", px: 20, lh: 28 },
  { name: "2xl", px: 24, lh: 32 },
  { name: "3xl", px: 30, lh: 36 },
  { name: "4xl", px: 36, lh: 40 },
  { name: "5xl", px: 48, lh: 1 },
  { name: "6xl", px: 60, lh: 1 },
];

export default function TypeScale() {
  const [sample, setSample] = useState("The quick brown fox jumps over the lazy dog");
  const tailwindCss = useMemo(() => {
    return TAILWIND_DEFAULTS.map((s) => `  ${s.name}: [${s.px}px, ${s.lh}px]`).join(",\n");
  }, []);

  return (
    <ToolShell title="Type Scale Visualizer" description="Preview the default Tailwind type scale at a glance." category={categoryMap.design}>
      <Card className="p-3">
        <Label className="mb-1 block">Sample text</Label>
        <Input value={sample} onChange={(e) => setSample(e.target.value)} />
      </Card>
      <Card className="p-3">
        {TAILWIND_DEFAULTS.map((s) => (
          <div key={s.name} className="flex items-baseline gap-3 border-b py-2 last:border-0">
            <code className="w-12 font-mono text-xs text-muted-foreground">{s.name}</code>
            <code className="w-20 font-mono text-xs text-muted-foreground">{s.px}px</code>
            <span className="flex-1 truncate" style={{ fontSize: `${s.px}px`, lineHeight: typeof s.lh === "number" && s.lh > 5 ? `${s.lh}px` : s.lh }}>
              {sample}
            </span>
          </div>
        ))}
      </Card>
      <Card className="flex items-start gap-2 p-3">
        <pre className="flex-1 overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">{`fontSize: {\n${tailwindCss}\n}`}</pre>
        <CopyButton value={`fontSize: {\n${tailwindCss}\n}`} />
      </Card>
    </ToolShell>
  );
}
