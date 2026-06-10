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
import { Plus, X } from "lucide-react";

type Rule = {
  userAgent: string;
  allow: string[];
  disallow: string[];
  crawlDelay?: number;
};

export default function RobotsTxt() {
  const [rules, setRules] = useState<Rule[]>([
    { userAgent: "*", allow: ["/"], disallow: ["/admin"], crawlDelay: undefined },
  ]);
  const [sitemap, setSitemap] = useState("https://example.com/sitemap.xml");

  const output = useMemo(() => {
    const lines: string[] = [];
    for (const r of rules) {
      lines.push(`User-agent: ${r.userAgent || "*"}`);
      for (const a of r.allow) if (a) lines.push(`Allow: ${a}`);
      for (const d of r.disallow) if (d) lines.push(`Disallow: ${d}`);
      if (r.crawlDelay) lines.push(`Crawl-delay: ${r.crawlDelay}`);
      lines.push("");
    }
    if (sitemap) lines.push(`Sitemap: ${sitemap}`);
    return lines.join("\n").trim();
  }, [rules, sitemap]);

  const addRule = () => setRules((r) => [...r, { userAgent: "*", allow: [], disallow: [], crawlDelay: undefined }]);
  const updateRule = (i: number, patch: Partial<Rule>) => setRules((r) => r.map((it, idx) => idx === i ? { ...it, ...patch } : it));
  const removeRule = (i: number) => setRules((r) => r.filter((_, idx) => idx !== i));

  return (
    <ToolShell title="robots.txt Builder" description="Generate a clean robots.txt with allow/disallow rules and a sitemap reference." category={categoryMap.network}
      shareable>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          {rules.map((r, i) => (
            <Card key={i} className="space-y-2 p-3">
              <div className="flex items-center gap-2">
                <Label className="text-xs">User-agent</Label>
                <Input value={r.userAgent} onChange={(e) => updateRule(i, { userAgent: e.target.value })} className="flex-1" placeholder="* or Googlebot" />
                <Button size="icon" variant="ghost" onClick={() => removeRule(i)} disabled={rules.length === 1}><X className="h-4 w-4" /></Button>
              </div>
              <div>
                <Label className="text-xs">Allow paths (one per line)</Label>
                <Textarea value={r.allow.join("\n")} onChange={(e) => updateRule(i, { allow: e.target.value.split(/\n/) })} className="min-h-[60px] text-xs" />
              </div>
              <div>
                <Label className="text-xs">Disallow paths (one per line)</Label>
                <Textarea value={r.disallow.join("\n")} onChange={(e) => updateRule(i, { disallow: e.target.value.split(/\n/) })} className="min-h-[60px] text-xs" />
              </div>
              <div>
                <Label className="text-xs">Crawl-delay (sec, optional)</Label>
                <Input type="number" value={r.crawlDelay ?? ""} onChange={(e) => updateRule(i, { crawlDelay: e.target.value ? Number(e.target.value) : undefined })} className="w-24" />
              </div>
            </Card>
          ))}
          <Button variant="outline" onClick={addRule}><Plus className="mr-2 h-4 w-4" />Add rule block</Button>
          <Card className="p-3">
            <Label className="text-xs">Sitemap URL</Label>
            <Input value={sitemap} onChange={(e) => setSitemap(e.target.value)} />
          </Card>
        </div>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>robots.txt</Label>
            <CopyButton value={output} />
          </div>
          <Textarea readOnly value={output} className="min-h-[420px] bg-muted/30 font-mono text-xs" />
        </Card>
      </div>
    </ToolShell>
  );
}
