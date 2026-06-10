import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const MIMES: { ext: string; type: string; desc: string }[] = [
  { ext: ".html", type: "text/html", desc: "HTML document" },
  { ext: ".css", type: "text/css", desc: "Cascading Style Sheet" },
  { ext: ".js", type: "text/javascript", desc: "JavaScript" },
  { ext: ".json", type: "application/json", desc: "JSON" },
  { ext: ".xml", type: "application/xml", desc: "XML" },
  { ext: ".png", type: "image/png", desc: "PNG image" },
  { ext: ".jpg", type: "image/jpeg", desc: "JPEG image" },
  { ext: ".webp", type: "image/webp", desc: "WebP image" },
  { ext: ".svg", type: "image/svg+xml", desc: "SVG image" },
  { ext: ".gif", type: "image/gif", desc: "GIF image" },
  { ext: ".pdf", type: "application/pdf", desc: "PDF document" },
  { ext: ".zip", type: "application/zip", desc: "ZIP archive" },
  { ext: ".mp3", type: "audio/mpeg", desc: "MP3 audio" },
  { ext: ".wav", type: "audio/wav", desc: "WAV audio" },
  { ext: ".mp4", type: "video/mp4", desc: "MP4 video" },
  { ext: ".webm", type: "video/webm", desc: "WebM video" },
  { ext: ".txt", type: "text/plain", desc: "Plain text" },
  { ext: ".csv", type: "text/csv", desc: "CSV" },
  { ext: ".woff2", type: "font/woff2", desc: "WOFF2 font" },
  { ext: ".wasm", type: "application/wasm", desc: "WebAssembly" },
];

export default function MimeTypes() {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return MIMES;
    return MIMES.filter((m) =>
      m.ext.includes(s) || m.type.includes(s) || m.desc.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <ToolShell title="MIME Type Lookup" description="Common MIME types by file extension." category={categoryMap.network}>
      <Input placeholder="Search .ext, type or description…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {list.map((m) => (
          <Card key={m.ext} className="flex items-center justify-between gap-3 p-3">
            <div className="min-w-0">
              <div className="font-mono text-sm">{m.ext}</div>
              <div className="text-xs text-muted-foreground">{m.desc}</div>
            </div>
            <code className="truncate font-mono text-xs">{m.type}</code>
            <CopyButton value={m.type} />
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
