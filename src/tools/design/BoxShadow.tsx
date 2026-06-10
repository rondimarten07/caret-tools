import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { categoryMap } from "@/data/categories";

export default function BoxShadow() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(10);
  const [blur, setBlur] = useState(30);
  const [spread, setSpread] = useState(-5);
  const [color, setColor] = useState("#0000004d");
  const [inset, setInset] = useState(false);

  const shadow = useMemo(
    () => `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${color}`,
    [x, y, blur, spread, color, inset]
  );
  const css = `box-shadow: ${shadow};`;

  return (
    <ToolShell title="CSS Box-Shadow" description="Design and copy CSS box-shadow values." category={categoryMap.design}
      shareable>
      <Card className="grid min-h-[280px] place-items-center bg-muted/30 p-12">
        <div className="h-40 w-40 rounded-2xl bg-card" style={{ boxShadow: shadow }} />
      </Card>
      <Card className="grid grid-cols-2 gap-3 p-3 md:grid-cols-3">
        {[
          { label: "x", v: x, s: setX },
          { label: "y", v: y, s: setY },
          { label: "blur", v: blur, s: setBlur },
          { label: "spread", v: spread, s: setSpread },
        ].map((c) => (
          <div key={c.label}>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</Label>
            <Input type="number" value={c.v} onChange={(e) => c.s(Number(e.target.value) || 0)} />
          </div>
        ))}
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">color</Label>
          <Input value={color} onChange={(e) => setColor(e.target.value)} className="font-mono" />
        </div>
        <div className="flex items-end">
          <Button size="sm" variant={inset ? "default" : "outline"} onClick={() => setInset((v) => !v)} className="w-full">
            inset
          </Button>
        </div>
      </Card>
      <Card className="flex items-center gap-2 p-3">
        <code className="flex-1 break-all rounded-md bg-muted/30 p-3 font-mono text-xs">{css}</code>
        <CopyButton value={css} />
      </Card>
    </ToolShell>
  );
}
