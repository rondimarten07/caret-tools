import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Type = "Article" | "Product" | "Person" | "Organization" | "Event" | "Recipe";

export default function SchemaOrg() {
  const [type, setType] = useState<Type>("Article");
  const [fields, setFields] = useState<Record<string, string>>({
    "@type": "Article",
    headline: "Caret: 178 free in-browser utilities",
    author: "Tools Team",
    datePublished: new Date().toISOString().slice(0, 10),
    image: "https://example.com/image.jpg",
    publisher: "Caret",
  });

  const TEMPLATES: Record<Type, Record<string, string>> = {
    Article: { "@type": "Article", headline: "", author: "", datePublished: "", image: "", publisher: "" },
    Product: { "@type": "Product", name: "", description: "", image: "", brand: "", price: "", priceCurrency: "USD" },
    Person: { "@type": "Person", name: "", jobTitle: "", url: "", email: "", telephone: "" },
    Organization: { "@type": "Organization", name: "", url: "", logo: "", description: "" },
    Event: { "@type": "Event", name: "", startDate: "", endDate: "", location: "", url: "" },
    Recipe: { "@type": "Recipe", name: "", recipeIngredient: "", recipeInstructions: "", prepTime: "PT30M", cookTime: "PT1H" },
  };

  const pickType = (t: Type) => {
    setType(t);
    setFields(TEMPLATES[t]);
  };

  const json = useMemo(() => {
    const obj: Record<string, unknown> = { "@context": "https://schema.org" };
    for (const [k, v] of Object.entries(fields)) {
      if (k === "@type") obj["@type"] = v;
      else if (v) obj[k] = v;
    }
    return JSON.stringify(obj, null, 2);
  }, [fields]);

  const script = `<script type="application/ld+json">\n${json}\n</script>`;

  return (
    <ToolShell title="Schema.org Generator" description="Generate JSON-LD structured data for common Schema.org types." category={categoryMap.network}>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Type</Label>
        {(Object.keys(TEMPLATES) as Type[]).map((t) => (
          <Button key={t} size="sm" variant={type === t ? "default" : "outline"} onClick={() => pickType(t)}>{t}</Button>
        ))}
      </Card>
      <Card className="space-y-2 p-3">
        {Object.entries(fields).filter(([k]) => k !== "@type").map(([k, v]) => (
          <div key={k} className="flex items-center gap-2">
            <Label className="w-32 shrink-0 text-xs font-mono">{k}</Label>
            <Input value={v} onChange={(e) => setFields((f) => ({ ...f, [k]: e.target.value }))} className="flex-1" />
          </div>
        ))}
      </Card>
      <Card className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <Label>JSON-LD</Label>
          <CopyButton value={script} label="With script tag" />
        </div>
        <Textarea readOnly value={script} className="min-h-[260px] bg-muted/30 font-mono text-xs" />
      </Card>
    </ToolShell>
  );
}
