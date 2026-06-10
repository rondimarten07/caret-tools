import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function DiscountCalculator() {
  const [price, setPrice] = useState("100");
  const [discount, setDiscount] = useState("25");

  const r = useMemo(() => {
    const p = Number(price);
    const d = Number(discount);
    const saved = (p * d) / 100;
    return { saved, final: p - saved };
  }, [price, discount]);

  return (
    <ToolShell title="Discount Calculator" description="Sale price and how much you save." category={categoryMap.math}>
      <Card className="grid grid-cols-2 gap-3 p-3">
        <div><Label className="text-xs">Original price</Label><Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
        <div><Label className="text-xs">Discount (%)</Label><Input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} /></div>
      </Card>
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">You save</div><div className="mt-1 text-3xl font-semibold">{r.saved.toLocaleString("en", { maximumFractionDigits: 2 })}</div></Card>
        <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Final price</div><div className="mt-1 text-3xl font-semibold">{r.final.toLocaleString("en", { maximumFractionDigits: 2 })}</div></Card>
      </div>
    </ToolShell>
  );
}
