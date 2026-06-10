import { useMemo, useState } from "react";
import yaml from "js-yaml";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Plus, X } from "lucide-react";

const SAMPLE = `---
title: My first post
date: 2026-06-10
tags: [intro, writing]
draft: false
---

Content goes here…`;

type Field = { key: string; value: string };

function parseFrontmatter(input: string): { fields: Field[]; body: string } {
  const m = input.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { fields: [], body: input };
  try {
    const obj = (yaml.load(m[1]) ?? {}) as Record<string, unknown>;
    const fields = Object.entries(obj).map(([key, value]) => ({
      key,
      value: typeof value === "string" ? value : JSON.stringify(value),
    }));
    return { fields, body: m[2] };
  } catch {
    return { fields: [], body: input };
  }
}

export default function FrontmatterEditor() {
  const [input, setInput] = useUrlState("text", SAMPLE);
  const [fields, setFields] = useState<Field[]>(() => parseFrontmatter(SAMPLE).fields);
  const [body, setBody] = useState(() => parseFrontmatter(SAMPLE).body);

  const reload = () => {
    const { fields: f, body: b } = parseFrontmatter(input);
    setFields(f);
    setBody(b);
  };

  const output = useMemo(() => {
    const obj: Record<string, unknown> = {};
    for (const f of fields) {
      if (!f.key) continue;
      // Try to parse as YAML for arrays/numbers/booleans
      try { obj[f.key] = yaml.load(f.value); }
      catch { obj[f.key] = f.value; }
    }
    const fm = yaml.dump(obj).trimEnd();
    return `---\n${fm}\n---\n\n${body}`;
  }, [fields, body]);

  const update = (i: number, patch: Partial<Field>) => setFields((arr) => arr.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));

  return (
    <ToolShell title="Frontmatter Editor" description="Visually edit YAML frontmatter for Markdown / Hugo / Astro posts." category={categoryMap.text} shareable
      actions={<Button size="sm" variant="outline" onClick={reload}>Re-parse</Button>}
    >
      <Card className="p-3">
        <Label className="mb-2 block">Paste a full markdown file (with frontmatter)</Label>
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[160px] font-mono text-xs" />
      </Card>
      <Card className="space-y-2 p-3">
        <Label>Fields</Label>
        {fields.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input value={f.key} onChange={(e) => update(i, { key: e.target.value })} placeholder="key" className="w-40 font-mono" />
            <Input value={f.value} onChange={(e) => update(i, { value: e.target.value })} placeholder="value" className="flex-1 font-mono" />
            <Button size="icon" variant="ghost" onClick={() => setFields((arr) => arr.filter((_, idx) => idx !== i))}><X className="h-4 w-4" /></Button>
          </div>
        ))}
        <Button size="sm" variant="outline" onClick={() => setFields((arr) => [...arr, { key: "", value: "" }])}><Plus className="mr-2 h-3 w-3" />Add field</Button>
      </Card>
      <Card className="p-3">
        <Label className="mb-2 block">Body (markdown)</Label>
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} className="min-h-[160px] font-mono text-xs" />
      </Card>
      <Card className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <Label>Output</Label>
          <CopyButton value={output} />
        </div>
        <Textarea readOnly value={output} className="min-h-[240px] bg-muted/30 font-mono text-xs" />
      </Card>
    </ToolShell>
  );
}
