import { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function rand(min: number, max: number) {
  return min + (crypto.getRandomValues(new Uint32Array(1))[0] % (max - min + 1));
}

type Mode = "dice" | "coin" | "picker";

export default function DiceCoin() {
  const [mode, setMode] = useState<Mode>("dice");

  // Dice
  const [sides, setSides] = useState(6);
  const [count, setCount] = useState(2);
  const [rolls, setRolls] = useState<number[]>([]);
  const rollDice = () => setRolls(Array.from({ length: count }, () => rand(1, sides)));

  // Coin
  const [coins, setCoins] = useState<("H" | "T")[]>([]);
  const flip = (n: number) => setCoins(Array.from({ length: n }, () => (rand(0, 1) === 0 ? "H" : "T")));

  // Picker
  const [items, setItems] = useState("apple\nbanana\ncherry\ndate\nelderberry");
  const [picked, setPicked] = useState<string | null>(null);
  const pickOne = () => {
    const list = items.split(/\r?\n/).filter((l) => l.trim());
    if (list.length === 0) return;
    setPicked(list[rand(0, list.length - 1)]);
  };

  return (
    <ToolShell title="Dice / Coin / Picker" description="Three random tools in one — dice rolls, coin flips, list picker." category={categoryMap.generator}>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        {(["dice", "coin", "picker"] as Mode[]).map((m) => (
          <Button key={m} size="sm" variant={mode === m ? "default" : "outline"} onClick={() => setMode(m)}>{m}</Button>
        ))}
      </Card>

      {mode === "dice" && (
        <Card className="space-y-4 p-6 text-center">
          <div className="flex justify-center gap-3">
            <div><Label className="text-xs">Sides</Label><Input type="number" min={2} value={sides} onChange={(e) => setSides(Math.max(2, Number(e.target.value) || 6))} className="w-24" /></div>
            <div><Label className="text-xs">Count</Label><Input type="number" min={1} max={50} value={count} onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value) || 2)))} className="w-24" /></div>
          </div>
          <Button onClick={rollDice} className="min-w-32">Roll</Button>
          {rolls.length > 0 && (
            <>
              <div className="flex flex-wrap justify-center gap-2">
                {rolls.map((r, i) => (
                  <div key={i} className="grid h-16 w-16 place-items-center rounded-xl border bg-card font-mono text-2xl font-bold">{r}</div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Sum: <b className="font-mono text-foreground">{rolls.reduce((a, b) => a + b, 0)}</b>
              </div>
            </>
          )}
        </Card>
      )}

      {mode === "coin" && (
        <Card className="space-y-4 p-6 text-center">
          <div className="flex justify-center gap-2">
            <Button onClick={() => flip(1)}>Flip 1</Button>
            <Button onClick={() => flip(5)} variant="outline">Flip 5</Button>
            <Button onClick={() => flip(20)} variant="outline">Flip 20</Button>
          </div>
          {coins.length > 0 && (
            <>
              <div className="flex flex-wrap justify-center gap-2">
                {coins.map((c, i) => (
                  <div key={i} className={`grid h-14 w-14 place-items-center rounded-full border font-bold ${c === "H" ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"}`}>{c}</div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Heads: <b className="font-mono text-foreground">{coins.filter((c) => c === "H").length}</b> · Tails: <b className="font-mono text-foreground">{coins.filter((c) => c === "T").length}</b>
              </div>
            </>
          )}
        </Card>
      )}

      {mode === "picker" && (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Card className="p-3">
            <Label className="mb-2 block">Items (one per line)</Label>
            <Textarea value={items} onChange={(e) => setItems(e.target.value)} className="min-h-[240px]" />
          </Card>
          <Card className="grid place-items-center space-y-4 p-6">
            <Button onClick={pickOne}>Pick one</Button>
            {picked && (
              <>
                <div className="text-center text-3xl font-semibold">{picked}</div>
                <CopyButton value={picked} />
              </>
            )}
          </Card>
        </div>
      )}
    </ToolShell>
  );
}
