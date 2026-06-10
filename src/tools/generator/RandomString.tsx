import { useEffect, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const ALPHABET = {
  alphanumeric: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  hex: "0123456789abcdef",
  digits: "0123456789",
  letters: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
} as const;
type AlphaId = keyof typeof ALPHABET;

function rand(alphabet: string, len: number): string {
  const buf = crypto.getRandomValues(new Uint32Array(len));
  let out = "";
  for (let i = 0; i < len; i++) out += alphabet[buf[i] % alphabet.length];
  return out;
}

export default function RandomString() {
  const [alpha, setAlpha] = useState<AlphaId>("alphanumeric");
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(5);
  const [list, setList] = useState<string[]>([]);

  const regen = () => {
    const a = ALPHABET[alpha];
    setList(Array.from({ length: count }, () => rand(a, length)));
  };

  useEffect(() => {
    regen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alpha, length, count]);

  const joined = list.join("\n");

  return (
    <ToolShell
      title="Random String / Number"
      description="Generate random strings, tokens or numbers in bulk."
      category={categoryMap.generator}
      actions={
        <>
          <CopyButton value={joined} />
          <Button size="sm" onClick={regen}>Regenerate</Button>
        </>
      }
    >
      <Card className="grid grid-cols-2 gap-3 p-3 md:grid-cols-4">
        <div>
          <Label className="text-xs">Alphabet</Label>
          <select value={alpha} onChange={(e) => setAlpha(e.target.value as AlphaId)} className="h-9 w-full rounded-md border bg-background px-2 text-sm">
            <option value="alphanumeric">Alphanumeric</option>
            <option value="hex">Hex</option>
            <option value="digits">Digits</option>
            <option value="letters">Letters</option>
          </select>
        </div>
        <div>
          <Label className="text-xs">Length</Label>
          <Input type="number" min={1} max={256} value={length} onChange={(e) => setLength(Number(e.target.value) || 1)} />
        </div>
        <div>
          <Label className="text-xs">Count</Label>
          <Input type="number" min={1} max={500} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} />
        </div>
      </Card>
      <Card className="p-3">
        <Textarea readOnly value={joined} className="min-h-[300px] bg-muted/30" />
      </Card>
    </ToolShell>
  );
}
