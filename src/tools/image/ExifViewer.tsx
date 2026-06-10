import { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Info = { name: string; type: string; size: number; width: number; height: number; lastModified: string };

export default function ExifViewer() {
  const [info, setInfo] = useState<Info | null>(null);
  const [src, setSrc] = useState<string | null>(null);

  const onFile = (f: File) => {
    const url = URL.createObjectURL(f);
    setSrc(url);
    const img = new Image();
    img.onload = () => setInfo({
      name: f.name,
      type: f.type,
      size: f.size,
      width: img.naturalWidth,
      height: img.naturalHeight,
      lastModified: new Date(f.lastModified).toISOString(),
    });
    img.src = url;
  };

  return (
    <ToolShell title="Image Inspector" description="View basic image dimensions and file info. Files never leave your browser." category={categoryMap.image}>
      <Card className="p-3">
        <Label className="mb-2 block">Pick an image</Label>
        <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      </Card>
      {info && src && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1.4fr]">
          <Card className="grid place-items-center p-3"><img src={src} alt="" className="max-h-72 rounded-md border" /></Card>
          <Card className="p-3">
            <dl className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(info).map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-muted-foreground capitalize">{k}</dt>
                  <dd className="truncate font-mono">{String(v)}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      )}
    </ToolShell>
  );
}
