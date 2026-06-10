import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

function words(s: string): string[] {
  return s
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-\s]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

const cases: { id: string; label: string; fn: (s: string) => string }[] = [
  { id: "upper", label: "UPPER CASE", fn: (s) => s.toUpperCase() },
  { id: "lower", label: "lower case", fn: (s) => s.toLowerCase() },
  {
    id: "title",
    label: "Title Case",
    fn: (s) => words(s).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" "),
  },
  {
    id: "sentence",
    label: "Sentence case",
    fn: (s) =>
      s
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
  },
  {
    id: "camel",
    label: "camelCase",
    fn: (s) =>
      words(s)
        .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
        .join(""),
  },
  {
    id: "pascal",
    label: "PascalCase",
    fn: (s) => words(s).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(""),
  },
  { id: "snake", label: "snake_case", fn: (s) => words(s).map((w) => w.toLowerCase()).join("_") },
  { id: "kebab", label: "kebab-case", fn: (s) => words(s).map((w) => w.toLowerCase()).join("-") },
  { id: "const", label: "CONSTANT_CASE", fn: (s) => words(s).map((w) => w.toUpperCase()).join("_") },
];

export default function CaseConverter() {
  const [text, setText] = useUrlState("text", "Hello world from Caret");
  const outputs = useMemo(() => cases.map((c) => ({ ...c, value: c.fn(text) })), [text]);

  return (
    <ToolShell
      title="Case Converter"
      description="Convert text between common naming conventions."
      category={categoryMap.text}
      shareable
      actions={<Button variant="ghost" size="sm" onClick={() => setText("")}>Clear</Button>}
    >
      <Card className="p-3">
        <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[120px]" />
      </Card>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {outputs.map((o) => (
          <Card key={o.id} className="flex items-center gap-3 p-3">
            <span className="w-32 shrink-0 text-xs uppercase tracking-wide text-muted-foreground">{o.label}</span>
            <code className="flex-1 truncate font-mono text-sm">{o.value}</code>
            <CopyButton value={o.value} />
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
