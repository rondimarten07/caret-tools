import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function OpenGraph() {
  const [title, setTitle] = useState("Tools Hub – 90+ free utilities");
  const [desc, setDesc] = useState("JSON, Base64, color, QR, password and many more — all in the browser.");
  const [url, setUrl] = useState("https://tools.example.com");
  const [image, setImage] = useState("https://tools.example.com/og.png");
  const [siteName, setSiteName] = useState("Tools Hub");

  const html = useMemo(
    () =>
      `<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${image}" />
<meta property="og:site_name" content="${siteName}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${desc}" />
<meta name="twitter:image" content="${image}" />`,
    [title, desc, url, image, siteName]
  );

  return (
    <ToolShell title="Open Graph Preview" description="Compose Open Graph & Twitter Card tags with live preview." category={categoryMap.network}
      shareable>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="space-y-3 p-3">
          <div><Label className="text-xs">Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div><Label className="text-xs">Description</Label><Textarea value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
          <div><Label className="text-xs">URL</Label><Input value={url} onChange={(e) => setUrl(e.target.value)} /></div>
          <div><Label className="text-xs">Image URL</Label><Input value={image} onChange={(e) => setImage(e.target.value)} /></div>
          <div><Label className="text-xs">Site name</Label><Input value={siteName} onChange={(e) => setSiteName(e.target.value)} /></div>
        </Card>
        <Card className="overflow-hidden p-0">
          <Label className="block px-3 pt-3 text-xs">Preview</Label>
          <div className="p-3">
            <div className="overflow-hidden rounded-lg border">
              {image && <img src={image} alt="" className="h-40 w-full object-cover" />}
              <div className="space-y-1 p-3">
                <div className="truncate text-xs uppercase text-muted-foreground">{new URL(url, "https://x.test").hostname}</div>
                <div className="line-clamp-1 font-semibold">{title}</div>
                <div className="line-clamp-2 text-sm text-muted-foreground">{desc}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <Card className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <Label>Meta tags</Label>
          <CopyButton value={html} />
        </div>
        <Textarea readOnly value={html} className="min-h-[220px] bg-muted/30 text-xs" />
      </Card>
    </ToolShell>
  );
}
