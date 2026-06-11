import { useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const SIZES = [12, 14, 16, 20, 24, 32, 40, 56];

export default function LetterSpacing() {
  const [text, setText] = useUrlState("t", "Quietly Refined Type");
  const [spacing, setSpacing] = useState(0);

  return (
    <ToolShell title="Letter-Spacing Visualizer" description="Preview letter-spacing values across multiple type sizes." category={categoryMap.design} shareable>
      <Card className="space-y-3 p-4">
        <Label>Text</Label>
        <Input value={text} onChange={(e) => setText(e.target.value)} className="text-lg" />
        <div className="flex items-center gap-3">
          <Label className="w-32 text-sm">Letter-spacing: {spacing >= 0 ? "+" : ""}{spacing}em</Label>
          <input type="range" min={-0.1} max={0.5} step={0.005} value={spacing} onChange={(e) => setSpacing(Number(e.target.value))} className="flex-1" />
          <CopyButton value={`letter-spacing: ${spacing}em;`} />
        </div>
      </Card>
      <Card className="space-y-4 p-6">
        {SIZES.map((s) => (
          <div key={s} style={{ fontSize: s, letterSpacing: `${spacing}em`, lineHeight: 1.2 }}>
            {text}
          </div>
        ))}
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Use slightly negative tracking on large display headlines (−0.01 to −0.03em). Use slightly positive tracking on all-caps labels (+0.05 to +0.1em) for readability.
      </div>
    </ToolShell>
  );
}
