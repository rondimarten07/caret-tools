import { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function num(s: string) {
  const v = Number(s);
  return Number.isFinite(v) ? v : 0;
}

export default function Percentage() {
  const [pa, setPa] = useState("20");
  const [pb, setPb] = useState("150");
  const [ia, setIa] = useState("30");
  const [ib, setIb] = useState("150");
  const [ca, setCa] = useState("100");
  const [cb, setCb] = useState("125");

  return (
    <ToolShell title="Percentage Calculator" description="Three common percentage operations." category={categoryMap.math}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="space-y-2 p-4">
          <Label className="text-xs uppercase text-muted-foreground">What is X% of Y?</Label>
          <div className="flex items-center gap-2">
            <Input value={pa} onChange={(e) => setPa(e.target.value)} className="w-20" /> %
            <span>of</span>
            <Input value={pb} onChange={(e) => setPb(e.target.value)} className="w-24" />
          </div>
          <div className="text-2xl font-semibold">= {((num(pa) / 100) * num(pb)).toLocaleString("en", { maximumFractionDigits: 4 })}</div>
        </Card>
        <Card className="space-y-2 p-4">
          <Label className="text-xs uppercase text-muted-foreground">X is what % of Y?</Label>
          <div className="flex items-center gap-2">
            <Input value={ia} onChange={(e) => setIa(e.target.value)} className="w-20" />
            <span>is what % of</span>
            <Input value={ib} onChange={(e) => setIb(e.target.value)} className="w-24" />
          </div>
          <div className="text-2xl font-semibold">= {((num(ia) / num(ib)) * 100).toLocaleString("en", { maximumFractionDigits: 4 })} %</div>
        </Card>
        <Card className="space-y-2 p-4">
          <Label className="text-xs uppercase text-muted-foreground">% change from A → B</Label>
          <div className="flex items-center gap-2">
            <Input value={ca} onChange={(e) => setCa(e.target.value)} className="w-24" />
            <span>→</span>
            <Input value={cb} onChange={(e) => setCb(e.target.value)} className="w-24" />
          </div>
          <div className="text-2xl font-semibold">= {(((num(cb) - num(ca)) / num(ca)) * 100).toLocaleString("en", { maximumFractionDigits: 4 })} %</div>
        </Card>
      </div>
    </ToolShell>
  );
}
