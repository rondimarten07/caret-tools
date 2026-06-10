import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { categoryMap } from "@/data/categories";
import { Download } from "lucide-react";

function extractId(url: string): string | null {
  const trimmed = url.trim();
  // Already an ID (11 chars)
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m) return m[1];
  }
  return null;
}

const QUALITIES = [
  { id: "maxresdefault", label: "Max (1280×720)" },
  { id: "sddefault", label: "Standard (640×480)" },
  { id: "hqdefault", label: "High (480×360)" },
  { id: "mqdefault", label: "Medium (320×180)" },
  { id: "default", label: "Default (120×90)" },
];

export default function YouTubeThumbnail() {
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const id = useMemo(() => extractId(url), [url]);

  return (
    <ToolShell title="YouTube Thumbnail" description="Grab YouTube video thumbnails in every available size." category={categoryMap.image}>
      <Card className="p-3">
        <Label className="mb-1 block">YouTube URL or video ID</Label>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} className="font-mono" />
        {id ? (
          <div className="mt-2 text-xs text-muted-foreground">
            Detected: <code>{id}</code>
          </div>
        ) : (
          <div className="mt-2 text-xs text-rose-600">Could not detect a video ID.</div>
        )}
      </Card>
      {id && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {QUALITIES.map((q) => {
            const thumbUrl = `https://img.youtube.com/vi/${id}/${q.id}.jpg`;
            return (
              <Card key={q.id} className="overflow-hidden p-0">
                <img src={thumbUrl} alt="" className="aspect-video w-full bg-muted object-cover" />
                <div className="flex items-center gap-2 border-t p-2">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{q.label}</div>
                    <code className="truncate font-mono text-[10px] text-muted-foreground">{thumbUrl}</code>
                  </div>
                  <CopyButton value={thumbUrl} />
                  <Button size="sm" variant="outline" asChild>
                    <a href={thumbUrl} download={`${id}-${q.id}.jpg`} target="_blank" rel="noopener noreferrer">
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </ToolShell>
  );
}
