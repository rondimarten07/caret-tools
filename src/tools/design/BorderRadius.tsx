import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { categoryMap } from "@/data/categories";

export default function BorderRadius() {
  const [tl, setTl] = useState(16);
  const [tr, setTr] = useState(16);
  const [br, setBr] = useState(16);
  const [bl, setBl] = useState(16);
  const [linked, setLinked] = useState(true);

  const setAll = (n: number) => {
    setTl(n);
    setTr(n);
    setBr(n);
    setBl(n);
  };

  const radius = useMemo(
    () => `${tl}px ${tr}px ${br}px ${bl}px`,
    [tl, tr, br, bl]
  );

  const css = `border-radius: ${radius};`;

  return (
    <ToolShell title="CSS Border-Radius" description="Visualize and copy border-radius shorthand." category={categoryMap.design}
      shareable>
      <Card className="grid min-h-[260px] place-items-center bg-muted/30 p-12">
        <div className="h-44 w-44 bg-primary" style={{ borderRadius: radius }} />
      </Card>
      <Card className="space-y-3 p-3">
        <Button size="sm" variant={linked ? "default" : "outline"} onClick={() => setLinked((v) => !v)}>
          {linked ? "Linked: all corners" : "Free: per corner"}
        </Button>
        {linked ? (
          <div>
            <Label className="text-xs">Radius (px)</Label>
            <Input type="number" min={0} value={tl} onChange={(e) => setAll(Number(e.target.value) || 0)} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "TL", v: tl, s: setTl },
              { label: "TR", v: tr, s: setTr },
              { label: "BR", v: br, s: setBr },
              { label: "BL", v: bl, s: setBl },
            ].map((c) => (
              <div key={c.label}>
                <Label className="text-xs">{c.label}</Label>
                <Input type="number" min={0} value={c.v} onChange={(e) => c.s(Number(e.target.value) || 0)} />
              </div>
            ))}
          </div>
        )}
      </Card>
      <Card className="flex items-center gap-2 p-3">
        <code className="flex-1 break-all rounded-md bg-muted/30 p-3 font-mono text-xs">{css}</code>
        <CopyButton value={css} />
      </Card>
    </ToolShell>
  );
}
