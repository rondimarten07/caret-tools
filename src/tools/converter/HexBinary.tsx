import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function hexToBin(h: string): string {
  const clean = h.replace(/[^0-9a-fA-F]/g, "");
  if (!clean) return "";
  return clean.split("").map((c) => parseInt(c, 16).toString(2).padStart(4, "0")).join(" ");
}

function binToHex(b: string): string {
  const clean = b.replace(/[^01]/g, "");
  if (!clean) return "";
  const padded = clean.padStart(Math.ceil(clean.length / 4) * 4, "0");
  let out = "";
  for (let i = 0; i < padded.length; i += 4) {
    out += parseInt(padded.slice(i, i + 4), 2).toString(16);
  }
  return out.toUpperCase();
}

export default function HexBinary() {
  const [hex, setHex] = useUrlState("h", "DEADBEEF");
  const [bin, setBin] = useUrlState("b", "");

  const binOut = useMemo(() => hexToBin(hex), [hex]);
  const hexOut = useMemo(() => binToHex(bin), [bin]);

  return (
    <ToolShell title="Hex ↔ Binary" description="Convert between hexadecimal and binary strings (4 bits per hex nibble)." category={categoryMap.converter} shareable>
      <Card className="space-y-3 p-4">
        <Label>Hex → Binary</Label>
        <Textarea value={hex} onChange={(e) => setHex(e.target.value)} className="font-mono" rows={2} spellCheck={false} />
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
          <p className="break-all font-mono text-sm">{binOut || <span className="text-muted-foreground">—</span>}</p>
          <CopyButton value={binOut} />
        </div>
      </Card>
      <Card className="space-y-3 p-4">
        <Label>Binary → Hex</Label>
        <Textarea value={bin} onChange={(e) => setBin(e.target.value)} className="font-mono" rows={2} placeholder="01001000 01101001" spellCheck={false} />
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
          <p className="break-all font-mono text-sm">{hexOut || <span className="text-muted-foreground">—</span>}</p>
          <CopyButton value={hexOut} />
        </div>
      </Card>
    </ToolShell>
  );
}
