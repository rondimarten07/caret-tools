import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const EMOJI: Record<string, string[]> = {
  smiley: ["😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚","😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🥳","🤩"],
  emotion: ["😢","😭","😤","😠","😡","🤬","🤯","😳","🥵","🥶","😱","😨","😰","😥","😓","🤗","🤔","🤭","🤫","🤥","😶","😐","😑","😬","🙄","😯","😦","😧","😮","😲"],
  animal: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🐤","🦆","🦅","🦉","🐺","🐗","🐴","🦄","🐝","🐛","🦋","🐌"],
  food: ["🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🥑","🍆","🌶","🌽","🥕","🥔","🍠","🥐","🍞","🥖","🥨","🧀","🥚","🍳","🥞"],
  travel: ["🚗","🚕","🚙","🚌","🚎","🏎","🚓","🚑","🚒","🚐","🛻","🚚","🚛","🚜","🛵","🏍","🚲","🛴","🚂","🚆","🚊","✈️","🚀","🛸","🚁","⛵","🚤","🛳","⚓","🚉"],
  object: ["⌚","📱","💻","⌨️","🖥","🖨","🖱","🖲","🕹","🗜","💽","💾","💿","📀","📷","📸","📹","🎥","📽","🎞","📞","☎️","📟","📠","📺","📻","🎙","🎚","🎛","⏱"],
  symbol: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","💝","💟","☮️","✝️","☪️","🕉","☸️","✡️","🔯","🕎","☯️","☦️","🛐"],
};

export default function RandomEmoji() {
  const [count, setCount] = useState(8);
  const [category, setCategory] = useState<string>("all");
  const [seed, setSeed] = useState(0);

  const list = useMemo(() => {
    void seed;
    const pool = category === "all" ? Object.values(EMOJI).flat() : EMOJI[category] || [];
    const out: string[] = [];
    for (let i = 0; i < count; i++) {
      out.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    return out;
  }, [count, category, seed]);

  return (
    <ToolShell title="Random Emoji" description="Pick random emoji — filter by theme." category={categoryMap.generator}>
      <Card className="flex flex-wrap items-end gap-3 p-3">
        <div>
          <Label>Category</Label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block rounded-md border bg-background px-3 py-1.5 text-sm">
            <option value="all">All</option>
            {Object.keys(EMOJI).map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div>
          <Label>Count</Label>
          <input type="number" value={count} min={1} max={100} onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))} className="mt-1 block w-24 rounded-md border bg-background px-3 py-1.5 text-sm" />
        </div>
        <Button onClick={() => setSeed((s) => s + 1)}>Reroll</Button>
        <CopyButton value={list.join(" ")} />
      </Card>
      <Card className="p-6">
        <div className="flex flex-wrap gap-3 text-4xl">
          {list.map((e, i) => <span key={i}>{e}</span>)}
        </div>
      </Card>
    </ToolShell>
  );
}
