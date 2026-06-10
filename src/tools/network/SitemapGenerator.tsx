import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const SAMPLE = `https://example.com/
https://example.com/about
https://example.com/contact
https://example.com/blog/first-post`;

export default function SitemapGenerator() {
  const [input, setInput] = useUrlState("text", SAMPLE);

  const xml = useMemo(() => {
    const urls = input.split(/\r?\n/).map((u) => u.trim()).filter(Boolean);
    const today = new Date().toISOString().slice(0, 10);
    const items = urls.map((u) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`).join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
  }, [input]);

  const count = input.split(/\r?\n/).filter((l) => l.trim()).length;

  return (
    <ToolShell title="sitemap.xml Generator" description="Generate a valid sitemap.xml from a list of URLs." category={categoryMap.network} shareable>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">URLs (one per line)</Label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[360px] font-mono text-xs" spellCheck={false} />
          <div className="mt-2 text-xs text-muted-foreground">{count} URLs</div>
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>sitemap.xml</Label>
            <CopyButton value={xml} />
          </div>
          <Textarea readOnly value={xml} className="min-h-[360px] bg-muted/30 font-mono text-xs" />
        </Card>
      </div>
    </ToolShell>
  );
}
