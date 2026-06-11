import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const COLORS = ["brightgreen", "green", "yellowgreen", "yellow", "orange", "red", "lightgrey", "blue", "informational", "important", "critical", "success"];

const STYLES = ["flat", "flat-square", "plastic", "for-the-badge", "social"];

export default function BadgeBuilder() {
  const [label, setLabel] = useUrlState("l", "build");
  const [message, setMessage] = useUrlState("m", "passing");
  const [color, setColor] = useUrlState("c", "brightgreen");
  const [style, setStyle] = useUrlState("s", "flat");
  const [logo, setLogo] = useUrlState("g", "");

  const url = useMemo(() => {
    const enc = (s: string) => encodeURIComponent(s.replace(/-/g, "--").replace(/_/g, "__"));
    const base = `https://img.shields.io/badge/${enc(label)}-${enc(message)}-${color}`;
    const params: string[] = [];
    if (style !== "flat") params.push(`style=${style}`);
    if (logo.trim()) params.push(`logo=${encodeURIComponent(logo)}`);
    return params.length ? `${base}?${params.join("&")}` : base;
  }, [label, message, color, style, logo]);

  const md = `![${label}](${url})`;
  const html = `<img src="${url}" alt="${label}" />`;

  return (
    <ToolShell title="Shields.io Badge Builder" description="Build static shields.io badge URLs for your README." category={categoryMap.design} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div><Label>Label</Label><Input value={label} onChange={(e) => setLabel(e.target.value)} /></div>
        <div><Label>Message</Label><Input value={message} onChange={(e) => setMessage(e.target.value)} /></div>
        <div>
          <Label>Color</Label>
          <select value={color} onChange={(e) => setColor(e.target.value)} className="mt-1 block w-full rounded-md border bg-background px-3 py-1.5 text-sm">
            {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <Label>Style</Label>
          <select value={style} onChange={(e) => setStyle(e.target.value)} className="mt-1 block w-full rounded-md border bg-background px-3 py-1.5 text-sm">
            {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <Label>Logo (Simple Icons slug — optional)</Label>
          <Input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="github, npm, vercel..." />
        </div>
      </Card>
      <Card className="space-y-3 p-4">
        <div className="text-xs uppercase text-muted-foreground">Preview</div>
        <img src={url} alt={label} />
      </Card>
      <Card className="space-y-3 p-4">
        {[
          { label: "URL", value: url },
          { label: "Markdown", value: md },
          { label: "HTML", value: html },
        ].map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex items-center justify-between">
              <Label>{row.label}</Label>
              <CopyButton value={row.value} />
            </div>
            <pre className="overflow-auto rounded-md bg-muted/30 p-2 text-xs">{row.value}</pre>
          </div>
        ))}
      </Card>
    </ToolShell>
  );
}
