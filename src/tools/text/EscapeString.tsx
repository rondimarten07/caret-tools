import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Mode = "escape" | "unescape";
type Lang = "js" | "json" | "html";

const SAMPLE = `Hello "world",
new line here.\tTabbed too.`;

function escapeJs(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

function unescapeJs(s: string): string {
  try {
    return JSON.parse(`"${s.replace(/"/g, '\\"').replace(/\n/g, "")}"`);
  } catch {
    return s;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function unescapeHtml(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

export default function EscapeString() {
  const [mode, setMode] = useState<Mode>("escape");
  const [lang, setLang] = useState<Lang>("js");
  const [input, setInput] = useUrlState("text", SAMPLE);

  const output = useMemo(() => {
    if (mode === "escape") {
      if (lang === "json") return JSON.stringify(input).slice(1, -1);
      if (lang === "html") return escapeHtml(input);
      return escapeJs(input);
    }
    if (lang === "html") return unescapeHtml(input);
    return unescapeJs(input);
  }, [mode, lang, input]);

  return (
    <ToolShell title="Escape / Unescape" description="Add or remove escapes for string literals." category={categoryMap.text}
      shareable>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        <Label className="text-xs">Mode</Label>
        <Button size="sm" variant={mode === "escape" ? "default" : "outline"} onClick={() => setMode("escape")}>Escape</Button>
        <Button size="sm" variant={mode === "unescape" ? "default" : "outline"} onClick={() => setMode("unescape")}>Unescape</Button>
        <Label className="text-xs ml-3">Format</Label>
        {(["js", "json", "html"] as Lang[]).map((l) => (
          <Button key={l} size="sm" variant={lang === l ? "default" : "outline"} onClick={() => setLang(l)}>{l.toUpperCase()}</Button>
        ))}
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Input</Label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[260px] font-mono text-sm" />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>Output</Label>
            <CopyButton value={output} />
          </div>
          <Textarea readOnly value={output} className="min-h-[260px] bg-muted/30 font-mono text-sm" />
        </Card>
      </div>
    </ToolShell>
  );
}
