import { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ListRandomizer() {
  const [text, setText] = useState("apple\nbanana\ncherry\ndate\nelderberry");
  const [out, setOut] = useState("");

  const run = () => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    setOut(shuffle(lines).join("\n"));
  };

  return (
    <ToolShell
      title="List Randomizer"
      description="Shuffle the order of lines."
      category={categoryMap.generator}
      actions={<Button size="sm" onClick={run}>Shuffle</Button>}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Input list</Label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[300px]" />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>Shuffled</Label>
            <CopyButton value={out} />
          </div>
          <Textarea readOnly value={out} className="min-h-[300px] bg-muted/30" />
        </Card>
      </div>
    </ToolShell>
  );
}
