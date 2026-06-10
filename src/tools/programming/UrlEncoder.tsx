import { useMemo, useState } from "react";
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

type Mode = "encode" | "decode";

export default function UrlEncoder() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useUrlState("text", "");
  const history = useToolHistory("url-encoder", input, setInput);

  const result = useMemo(() => {
    if (!input) return { ok: true as const, output: "" };
    try {
      return {
        ok: true as const,
        output:
          mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input),
      };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [mode, input]);

  return (
    <ToolShell
      title="URL Encoder / Decoder"
      description="Percent-encode or decode URLs and query parameters."
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
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card/40 p-3">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Mode
        </Label>
        <Button
          size="sm"
          variant={mode === "encode" ? "default" : "outline"}
          onClick={() => setMode("encode")}
        >
          Encode
        </Button>
        <Button
          size="sm"
          variant={mode === "decode" ? "default" : "outline"}
          onClick={() => setMode("decode")}
        >
          Decode
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Input</Label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Hello world & friends?"
                : "Hello%20world%20%26%20friends%3F"
            }
            className="min-h-[260px]"
            spellCheck={false}
          />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>{result.ok ? "Result" : "Error"}</Label>
            {result.ok && <CopyButton value={result.output} />}
          </div>
          {result.ok ? (
            <Textarea
              readOnly
              value={result.output}
              className="min-h-[260px] bg-muted/30"
              spellCheck={false}
            />
          ) : (
            <div className="min-h-[260px] rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">
              {result.error}
            </div>
          )}
        </Card>
      </div>
    </ToolShell>
  );
}
