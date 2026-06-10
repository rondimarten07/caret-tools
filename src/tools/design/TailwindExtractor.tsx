import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const SAMPLE = `<div class="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm">
  <span class="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">A</span>
  <span class="text-sm font-medium">Hello world</span>
</div>`;

/** Bucket Tailwind class by its category for nicer output. */
function bucket(cls: string): string {
  if (/^(p|m)[a-z]?-/.test(cls)) return "1-spacing";
  if (/^(w|h|min-|max-|aspect-)/.test(cls)) return "2-size";
  if (/^(flex|grid|inline|block|hidden|table|contents|items-|justify-|self-|content-|gap-|order-|col-|row-)/.test(cls)) return "3-layout";
  if (/^(text-|font-|leading-|tracking-|truncate|whitespace-|break-)/.test(cls)) return "4-typography";
  if (/^(bg-|from-|via-|to-)/.test(cls)) return "5-background";
  if (/^(border|rounded|ring|divide-|outline)/.test(cls)) return "6-border";
  if (/^(shadow|opacity|filter|backdrop|blur|brightness)/.test(cls)) return "7-effects";
  if (/^(transition|duration|ease|delay|animate)/.test(cls)) return "8-transition";
  if (/^(hover:|focus:|active:|md:|lg:|sm:|xl:|dark:|group-)/.test(cls)) return "9-state";
  return "0-other";
}

export default function TailwindExtractor() {
  const [html, setHtml] = useUrlState("text", SAMPLE);

  const classes = useMemo(() => {
    const matches = Array.from(html.matchAll(/(?:class|className)=["']([^"']+)["']/g));
    const all = matches.flatMap((m) => m[1].split(/\s+/));
    return Array.from(new Set(all)).filter(Boolean).sort((a, b) => {
      const ba = bucket(a);
      const bb = bucket(b);
      return ba.localeCompare(bb) || a.localeCompare(b);
    });
  }, [html]);

  const sorted = classes.join(" ");

  return (
    <ToolShell title="Tailwind Class Extractor" description="Extract a sorted, unique list of Tailwind classes from HTML/JSX." category={categoryMap.design} shareable>
      <Card className="p-3">
        <Label className="mb-2 block">HTML or JSX</Label>
        <Textarea value={html} onChange={(e) => setHtml(e.target.value)} className="min-h-[240px] font-mono text-xs" />
      </Card>
      <Card className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <Label>{classes.length} unique classes</Label>
          <CopyButton value={sorted} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {classes.map((c) => (
            <code key={c} className="rounded-md bg-muted px-2 py-1 font-mono text-[11px]">{c}</code>
          ))}
        </div>
      </Card>
    </ToolShell>
  );
}
