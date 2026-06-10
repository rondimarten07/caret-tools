import { useEffect, useState } from "react";
import SparkMD5 from "spark-md5";
import { useUrlState } from "@/hooks/useUrlState";
import { useToolHistory } from "@/hooks/useToolHistory";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { HistoryPanel } from "@/components/tool/HistoryPanel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

async function subtle(algo: string, input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest(algo, buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const ALGOS = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
type Algo = (typeof ALGOS)[number];

async function compute(algo: Algo, text: string) {
  if (!text) return "";
  if (algo === "MD5") return SparkMD5.hash(text);
  return subtle(algo, text);
}

export default function HashGenerator() {
  const [input, setInput] = useUrlState("text", "");
  const history = useToolHistory("hash-generator", input, setInput);
  const [results, setResults] = useState<Record<Algo, string>>({
    MD5: "",
    "SHA-1": "",
    "SHA-256": "",
    "SHA-384": "",
    "SHA-512": "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        ALGOS.map(async (a) => [a, await compute(a, input)] as const)
      );
      if (!cancelled)
        setResults(Object.fromEntries(entries) as Record<Algo, string>);
    })();
    return () => {
      cancelled = true;
    };
  }, [input]);

  return (
    <ToolShell
      title="Hash Generator"
      description="Compute MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hashes from any text."
      category={categoryMap.programming}
      shareable
      actions={
        <>
          <HistoryPanel entries={history.entries} onRestore={history.restore} onClear={history.clear} />
          <Button variant="ghost" size="sm" onClick={() => setInput("")}>
            Clear
          </Button>
        </>
      }
    >
      <Card className="p-3">
        <Label className="mb-2 block">Input</Label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste any text…"
          className="min-h-[140px]"
          spellCheck={false}
        />
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {ALGOS.map((a) => (
          <Card key={a} className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <Label>{a}</Label>
              <CopyButton value={results[a]} label={`${a} copied`} />
            </div>
            <code className="block break-all rounded-md bg-muted/30 p-3 font-mono text-xs">
              {results[a] || <span className="text-muted-foreground">—</span>}
            </code>
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
