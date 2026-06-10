import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const SAMPLE = `primary: #4f46e5
secondary: #f43f5e
muted: #f4f4f5
foreground: #09090b
background: #ffffff`;

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function CssVariables() {
  const [input, setInput] = useUrlState("text", SAMPLE);
  const [prefix, setPrefix] = useState("color");

  const css = useMemo(() => {
    const lines = input
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [name, ...rest] = l.split(/[:=]/);
        const value = rest.join(":").trim();
        if (!name || !value) return null;
        return `  --${prefix ? `${slug(prefix)}-` : ""}${slug(name)}: ${value};`;
      })
      .filter(Boolean) as string[];
    return `:root {\n${lines.join("\n")}\n}`;
  }, [input, prefix]);

  return (
    <ToolShell title="CSS Variables Generator" description="Generate CSS custom-properties from a list of name: value pairs." category={categoryMap.design} shareable>
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-[1fr_200px]">
        <div>
          <Label className="text-xs">Pairs (one per line, name: value)</Label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[240px] font-mono text-xs" />
        </div>
        <div>
          <Label className="text-xs">Prefix</Label>
          <Input value={prefix} onChange={(e) => setPrefix(e.target.value)} className="font-mono" />
        </div>
      </Card>
      <Card className="flex items-start gap-2 p-3">
        <pre className="flex-1 overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">{css}</pre>
        <CopyButton value={css} />
      </Card>
    </ToolShell>
  );
}
