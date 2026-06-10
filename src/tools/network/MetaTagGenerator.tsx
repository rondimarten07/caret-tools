import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function MetaTagGenerator() {
  const [title, setTitle] = useState("Caret — Precision tools, in your pocket.");
  const [description, setDescription] = useState("100+ free in-browser utilities for developers, designers and makers.");
  const [url, setUrl] = useState("https://caret.app");
  const [image, setImage] = useState("https://caret.app/og-image.svg");
  const [author, setAuthor] = useState("");
  const [keywords, setKeywords] = useState("tools, utilities, json, color");

  const html = useMemo(
    () =>
      `<!-- Primary SEO -->
<title>${title}</title>
<meta name="description" content="${description}" />
${keywords ? `<meta name="keywords" content="${keywords}" />\n` : ""}${author ? `<meta name="author" content="${author}" />\n` : ""}<link rel="canonical" href="${url}" />

<!-- Open Graph (Facebook, LinkedIn) -->
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${image}" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${image}" />`,
    [title, description, url, image, author, keywords]
  );

  return (
    <ToolShell title="Meta Tag Generator" description="Generate SEO, Open Graph and Twitter Card meta tags." category={categoryMap.network}
      shareable>
      <Card className="space-y-3 p-3">
        <div>
          <Label className="text-xs">Page title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[64px]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Canonical URL</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Preview image URL</Label>
            <Input value={image} onChange={(e) => setImage(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Author (optional)</Label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Keywords (optional)</Label>
            <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} />
          </div>
        </div>
      </Card>
      <Card className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <Label>Generated HTML</Label>
          <CopyButton value={html} />
        </div>
        <Textarea readOnly value={html} className="min-h-[300px] bg-muted/30 text-xs" />
      </Card>
    </ToolShell>
  );
}
