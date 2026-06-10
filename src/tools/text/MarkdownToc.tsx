import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const SAMPLE = `# Introduction

Some content.

## Getting started

Steps to begin.

### Install

Run npm install.

### Configure

Edit your settings.

## API reference

Public methods.

### Methods

Hash, encode, decode.

## License

MIT.`;

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

type Heading = { level: number; text: string; slug: string };

function parseHeadings(md: string): Heading[] {
  const out: Heading[] = [];
  for (const line of md.split(/\r?\n/)) {
    const m = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (m) out.push({ level: m[1].length, text: m[2], slug: slugify(m[2]) });
  }
  return out;
}

export default function MarkdownToc() {
  const [md, setMd] = useUrlState("md", SAMPLE);
  const [linkStyle, setLinkStyle] = useState<"github" | "anchor">("github");
  const [minLevel, setMinLevel] = useState(1);
  const [maxLevel, setMaxLevel] = useState(6);

  const headings = useMemo(() => parseHeadings(md), [md]);

  const toc = useMemo(() => {
    const filtered = headings.filter((h) => h.level >= minLevel && h.level <= maxLevel);
    if (filtered.length === 0) return "";
    const minH = Math.min(...filtered.map((h) => h.level));
    return filtered
      .map((h) => {
        const indent = "  ".repeat(h.level - minH);
        const link = linkStyle === "github" ? `(#${h.slug})` : `(#${h.slug})`;
        return `${indent}- [${h.text}]${link}`;
      })
      .join("\n");
  }, [headings, linkStyle, minLevel, maxLevel]);

  return (
    <ToolShell title="Markdown TOC" description="Generate a table of contents from Markdown headings." category={categoryMap.text}
      shareable>
      <Card className="flex flex-wrap items-center gap-3 p-3">
        <Label className="text-xs">Link style</Label>
        <Button size="sm" variant={linkStyle === "github" ? "default" : "outline"} onClick={() => setLinkStyle("github")}>GitHub</Button>
        <Button size="sm" variant={linkStyle === "anchor" ? "default" : "outline"} onClick={() => setLinkStyle("anchor")}>Anchor</Button>
        <Label className="text-xs ml-2">Levels</Label>
        <input type="number" min={1} max={6} value={minLevel} onChange={(e) => setMinLevel(Math.max(1, Math.min(6, Number(e.target.value) || 1)))} className="h-8 w-16 rounded border bg-background px-2 text-sm" />
        <span>–</span>
        <input type="number" min={1} max={6} value={maxLevel} onChange={(e) => setMaxLevel(Math.max(1, Math.min(6, Number(e.target.value) || 6)))} className="h-8 w-16 rounded border bg-background px-2 text-sm" />
        <span className="ml-auto text-xs text-muted-foreground">{headings.length} heading{headings.length === 1 ? "" : "s"} found</span>
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Markdown</Label>
          <Textarea value={md} onChange={(e) => setMd(e.target.value)} className="min-h-[400px] font-mono text-xs" />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>Table of contents</Label>
            <CopyButton value={toc} />
          </div>
          <Textarea readOnly value={toc} className="min-h-[400px] bg-muted/30 font-mono text-xs" />
        </Card>
      </div>
    </ToolShell>
  );
}
