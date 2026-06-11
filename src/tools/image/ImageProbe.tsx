import { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

type Info = { name: string; type: string; size: number; width: number; height: number; url: string };

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export default function ImageProbe() {
  const [info, setInfo] = useState<Info | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Not an image file.");
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setInfo({ name: file.name, type: file.type, size: file.size, width: img.naturalWidth, height: img.naturalHeight, url });
    };
    img.onerror = () => {
      setError("Failed to decode image.");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  return (
    <ToolShell title="Image Probe" description="Drop an image to read its dimensions, MIME type and size — nothing leaves your browser." category={categoryMap.image}>
      <Card
        className="flex min-h-[180px] items-center justify-center border-2 border-dashed p-6 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
      >
        <div>
          <p className="text-sm text-muted-foreground">Drag & drop an image here, or</p>
          <label className="mt-2 inline-block cursor-pointer rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">
            Choose file
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
          </label>
        </div>
      </Card>
      {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      {info && (
        <div className="grid gap-3 md:grid-cols-2">
          <Card className="overflow-hidden p-0">
            <img src={info.url} alt={info.name} className="max-h-72 w-full object-contain bg-muted/30" />
          </Card>
          <Card className="p-4">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Name</dt><dd className="truncate font-mono">{info.name}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-muted-foreground">MIME</dt><dd className="font-mono">{info.type}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Size</dt><dd className="font-mono">{fmtBytes(info.size)}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Width</dt><dd className="font-mono">{info.width}px</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Height</dt><dd className="font-mono">{info.height}px</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Aspect</dt><dd className="font-mono">{(info.width / info.height).toFixed(3)}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Megapixels</dt><dd className="font-mono">{((info.width * info.height) / 1e6).toFixed(2)} MP</dd></div>
            </dl>
          </Card>
        </div>
      )}
    </ToolShell>
  );
}
