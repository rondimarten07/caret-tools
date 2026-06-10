import { useRef, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const PALETTE = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#a855f7", "#ef4444", "#84cc16"];

export default function DecisionMaker() {
  const [items, setItems] = useState("Yes\nNo\nMaybe\nAsk again later");
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const list = items.split(/\r?\n/).filter((l) => l.trim());

  const spin = () => {
    if (list.length === 0) return;
    setSpinning(true);
    setWinner(null);
    const pickIdx = crypto.getRandomValues(new Uint32Array(1))[0] % list.length;
    const sliceDeg = 360 / list.length;
    // Pointer at top (0deg). Wheel rotates CW.
    // Target so that the winning slice center sits at the pointer.
    const target = 360 * 6 + (360 - (pickIdx * sliceDeg + sliceDeg / 2));
    setRotation(target);
    setTimeout(() => {
      setSpinning(false);
      setWinner(list[pickIdx]);
    }, 3000);
  };

  return (
    <ToolShell title="Decision Maker" description="Spin a wheel to pick from a list. Great for 'Yes/No' or lunch decisions." category={categoryMap.generator}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
        <Card className="p-3">
          <Label className="mb-2 block">Choices (one per line)</Label>
          <Textarea value={items} onChange={(e) => setItems(e.target.value)} className="min-h-[300px]" />
        </Card>
        <Card className="flex flex-col items-center gap-4 p-6">
          {list.length > 0 ? (
            <>
              <div className="relative h-72 w-72">
                <div
                  ref={ref}
                  className="absolute inset-0 rounded-full ring-4 ring-foreground/10 transition-transform duration-[3000ms] ease-out"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    background: `conic-gradient(${list
                      .map((_, i) => {
                        const start = (i / list.length) * 360;
                        const end = ((i + 1) / list.length) * 360;
                        return `${PALETTE[i % PALETTE.length]} ${start}deg ${end}deg`;
                      })
                      .join(", ")})`,
                  }}
                >
                  {list.map((item, i) => {
                    const angle = (i / list.length) * 360 + 360 / list.length / 2;
                    return (
                      <div
                        key={i}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 origin-bottom text-xs font-semibold text-white text-center select-none"
                        style={{
                          transform: `rotate(${angle}deg) translateY(-90px) rotate(${-angle}deg)`,
                          width: "60px",
                        }}
                      >
                        {item.length > 12 ? item.slice(0, 11) + "…" : item}
                      </div>
                    );
                  })}
                </div>
                {/* Pointer */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-2 text-2xl">▼</div>
              </div>
              <Button onClick={spin} disabled={spinning} className="min-w-32">
                {spinning ? "Spinning…" : "Spin"}
              </Button>
              {winner && (
                <div className="text-center">
                  <div className="text-xs uppercase text-muted-foreground">Result</div>
                  <div className="mt-1 text-3xl font-semibold">{winner}</div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Enter at least one choice.</p>
          )}
        </Card>
      </div>
    </ToolShell>
  );
}
