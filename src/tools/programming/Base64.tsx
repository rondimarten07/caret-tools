import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { useToolHistory } from "@/hooks/useToolHistory";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { HistoryPanel } from "@/components/tool/HistoryPanel";
import { SwapPane } from "@/components/tool/SwapPane";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function encode(input: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(input)));
}

function decode(input: string): string {
  const bin = atob(input.replace(/\s+/g, ""));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

type Mode = "encode" | "decode";

export default function Base64() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useUrlState("text", "");
  const history = useToolHistory("base64", input, setInput);

  const result = useMemo(() => {
    if (!input) return { ok: true as const, output: "" };
    try {
      return {
        ok: true as const,
        output: mode === "encode" ? encode(input) : decode(input),
      };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [mode, input]);

  const swap = () => {
    if (result.ok && result.output) {
      setInput(result.output);
    }
    setMode(mode === "encode" ? "decode" : "encode");
  };

  const leftLabel = mode === "encode" ? "Plain text" : "Base64";
  const rightLabel = mode === "encode" ? "Base64" : "Plain text";

  return (
    <ToolShell
      title="Base64 Encoder / Decoder"
      description="Encode text to Base64 or decode Base64 back to text (UTF-8 safe)."
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
      <SwapPane
        onSwap={swap}
        left={
          <Card className="p-3">
            <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
              {leftLabel}
            </Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "encode" ? "Hello world" : "SGVsbG8gd29ybGQ="}
              className="min-h-[300px]"
              spellCheck={false}
            />
          </Card>
        }
        right={
          <Card className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                {rightLabel}
              </Label>
              {result.ok && <CopyButton value={result.output} />}
            </div>
            {result.ok ? (
              <Textarea
                readOnly
                value={result.output}
                className="min-h-[300px] bg-muted/30"
                spellCheck={false}
              />
            ) : (
              <div className="min-h-[300px] rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">
                {result.error}
              </div>
            )}
          </Card>
        }
      />
    </ToolShell>
  );
}
