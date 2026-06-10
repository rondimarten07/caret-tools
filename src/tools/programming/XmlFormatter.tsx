import { useMemo } from "react";
import { XMLBuilder, XMLParser, XMLValidator } from "fast-xml-parser";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function XmlFormatter() {
  const [input, setInput] = useUrlState("text", "");

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, output: "" };
    const validation = XMLValidator.validate(input);
    if (validation !== true) {
      return { ok: false as const, error: validation.err.msg };
    }
    try {
      const parser = new XMLParser({ ignoreAttributes: false, preserveOrder: true });
      const builder = new XMLBuilder({
        format: true,
        indentBy: "  ",
        ignoreAttributes: false,
        preserveOrder: true,
      });
      return { ok: true as const, output: builder.build(parser.parse(input)) };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [input]);

  return (
    <ToolShell
      title="XML Formatter"
      description="Indent, validate and tidy XML."
      category={categoryMap.programming}
      shareable
      actions={<Button variant="ghost" size="sm" onClick={() => setInput("")}>Clear</Button>}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Input XML</Label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[360px]" spellCheck={false} />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>{result.ok ? "Formatted" : "Error"}</Label>
            {result.ok && <CopyButton value={result.output} />}
          </div>
          {result.ok ? (
            <Textarea readOnly value={result.output} className="min-h-[360px] bg-muted/30" />
          ) : (
            <div className="min-h-[360px] rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{result.error}</div>
          )}
        </Card>
      </div>
    </ToolShell>
  );
}
