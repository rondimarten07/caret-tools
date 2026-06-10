import { useMemo, useState } from "react";
import yaml from "js-yaml";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Mode = "j2y" | "y2j";

export default function JsonYaml() {
  const [mode, setMode] = useState<Mode>("j2y");
  const [input, setInput] = useUrlState("text", "");

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, output: "" };
    try {
      if (mode === "j2y") {
        return { ok: true as const, output: yaml.dump(JSON.parse(input)) };
      }
      return {
        ok: true as const,
        output: JSON.stringify(yaml.load(input), null, 2),
      };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [mode, input]);

  return (
    <ToolShell
      title="JSON ↔ YAML"
      description="Convert between JSON and YAML in both directions."
      category={categoryMap.programming}
      shareable
      actions={
        <Button variant="ghost" size="sm" onClick={() => setInput("")}>
          Clear
        </Button>
      }
    >
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card/40 p-3">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Direction
        </Label>
        <Button
          size="sm"
          variant={mode === "j2y" ? "default" : "outline"}
          onClick={() => setMode("j2y")}
        >
          JSON → YAML
        </Button>
        <Button
          size="sm"
          variant={mode === "y2j" ? "default" : "outline"}
          onClick={() => setMode("y2j")}
        >
          YAML → JSON
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">{mode === "j2y" ? "JSON" : "YAML"}</Label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[360px]"
            spellCheck={false}
          />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>{result.ok ? (mode === "j2y" ? "YAML" : "JSON") : "Error"}</Label>
            {result.ok && <CopyButton value={result.output} />}
          </div>
          {result.ok ? (
            <Textarea readOnly value={result.output} className="min-h-[360px] bg-muted/30" />
          ) : (
            <div className="min-h-[360px] rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">
              {result.error}
            </div>
          )}
        </Card>
      </div>
    </ToolShell>
  );
}
