import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function slugify(input: string, separator: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, separator)
    .replace(new RegExp(`^${separator}|${separator}$`, "g"), "");
}

export default function SlugGenerator() {
  const [text, setText] = useUrlState("text", "Hello World — Cara Membuat Slug Yang Bagus!");
  const [sep, setSep] = useState("-");

  const slug = useMemo(() => slugify(text, sep), [text, sep]);

  return (
    <ToolShell
      title="Slug Generator"
      description="Convert any text into a URL-friendly slug."
      category={categoryMap.text}
      shareable
      actions={<Button variant="ghost" size="sm" onClick={() => setText("")}>Clear</Button>}
    >
      <Card className="space-y-3 p-3">
        <Label>Input</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[120px]" />
        <div className="flex items-center gap-2">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Separator</Label>
          <Input value={sep} onChange={(e) => setSep(e.target.value || "-")} className="w-20 font-mono" maxLength={2} />
        </div>
      </Card>
      <Card className="flex items-center gap-3 p-3">
        <code className="flex-1 break-all font-mono text-sm">{slug || <span className="text-muted-foreground">—</span>}</code>
        <CopyButton value={slug} />
      </Card>
    </ToolShell>
  );
}
