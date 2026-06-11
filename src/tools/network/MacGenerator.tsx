import { useEffect, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { RefreshCw } from "lucide-react";

const SEPS = ["colon", "dash", "dot", "none"] as const;
type Sep = (typeof SEPS)[number];

function randByte(): string {
  return crypto.getRandomValues(new Uint8Array(1))[0].toString(16).padStart(2, "0");
}

function genMac(prefix: string, sep: Sep): string {
  const clean = prefix.replace(/[^0-9a-fA-F]/g, "").toLowerCase().slice(0, 6);
  const head = clean.padEnd(6, "0");
  const remaining = 12 - head.length;
  const tail = Array.from({ length: Math.ceil(remaining / 2) }, randByte).join("").slice(0, remaining);
  const full = (head + tail).toUpperCase();
  // Make locally administered + unicast (set bit 1 of first byte to 1, bit 0 to 0)
  // But only if no prefix specified
  let withFlag = full;
  if (!prefix.trim()) {
    const firstByte = (parseInt(full.slice(0, 2), 16) & 0xfc) | 0x02;
    withFlag = firstByte.toString(16).padStart(2, "0").toUpperCase() + full.slice(2);
  }
  const pairs: string[] = [];
  for (let i = 0; i < 12; i += 2) pairs.push(withFlag.slice(i, i + 2));
  if (sep === "colon") return pairs.join(":");
  if (sep === "dash") return pairs.join("-");
  if (sep === "dot") {
    const quads: string[] = [];
    for (let i = 0; i < 12; i += 4) quads.push(withFlag.slice(i, i + 4));
    return quads.join(".");
  }
  return withFlag;
}

export default function MacGenerator() {
  const [count, setCount] = useState(5);
  const [prefix, setPrefix] = useState("");
  const [sep, setSep] = useState<Sep>("colon");
  const [list, setList] = useState<string[]>([]);

  const regen = () => setList(Array.from({ length: Math.max(1, Math.min(200, count)) }, () => genMac(prefix, sep)));

  useEffect(() => {
    regen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, prefix, sep]);

  const joined = list.join("\n");

  return (
    <ToolShell title="MAC Address Generator" description="Generate random MAC addresses. Locally administered + unicast bits set when no prefix is given." category={categoryMap.network}
      actions={<><CopyButton value={joined} /><Button size="sm" onClick={regen}><RefreshCw className="mr-2 h-3.5 w-3.5" />Regenerate</Button></>}
    >
      <Card className="grid grid-cols-2 gap-3 p-3 md:grid-cols-4">
        <div><Label className="text-xs">Count</Label><Input type="number" min={1} max={200} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} /></div>
        <div><Label className="text-xs">OUI prefix (optional)</Label><Input value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="00:1a:2b" className="font-mono" /></div>
        <div className="md:col-span-2">
          <Label className="text-xs">Separator</Label>
          <div className="mt-1 flex flex-wrap gap-1">
            {SEPS.map((s) => (
              <Button key={s} size="sm" variant={sep === s ? "default" : "outline"} onClick={() => setSep(s)}>{s}</Button>
            ))}
          </div>
        </div>
      </Card>
      <Card className="p-3">
        <Textarea readOnly value={joined} className="min-h-[260px] bg-muted/30 font-mono" />
      </Card>
    </ToolShell>
  );
}
