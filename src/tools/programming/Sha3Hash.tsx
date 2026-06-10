import { useEffect, useState } from "react";
import { sha3_256, sha3_384, sha3_512, keccak256 } from "js-sha3";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const ALGOS = [
  { id: "sha3-256", name: "SHA3-256", fn: sha3_256 },
  { id: "sha3-384", name: "SHA3-384", fn: sha3_384 },
  { id: "sha3-512", name: "SHA3-512", fn: sha3_512 },
  { id: "keccak-256", name: "Keccak-256 (Ethereum)", fn: keccak256 },
] as const;

export default function Sha3Hash() {
  const [input, setInput] = useUrlState("text", "");
  const [results, setResults] = useState<Record<string, string>>({});

  useEffect(() => {
    const out: Record<string, string> = {};
    for (const a of ALGOS) {
      out[a.id] = input ? a.fn(input) : "";
    }
    setResults(out);
  }, [input]);

  return (
    <ToolShell title="SHA-3 / Keccak Hash" description="Compute SHA3-256/384/512 and Ethereum-style Keccak-256." category={categoryMap.programming}
      shareable
      actions={<Button variant="ghost" size="sm" onClick={() => setInput("")}>Clear</Button>}
    >
      <Card className="p-3">
        <Label className="mb-2 block">Input</Label>
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[140px]" />
      </Card>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {ALGOS.map((a) => (
          <Card key={a.id} className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <Label>{a.name}</Label>
              <CopyButton value={results[a.id]} />
            </div>
            <code className="block break-all rounded-md bg-muted/30 p-3 font-mono text-xs">{results[a.id] || <span className="text-muted-foreground">—</span>}</code>
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
