import { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

function extract(img: HTMLImageElement, k = 6): string[] {
  const canvas = document.createElement("canvas");
  const w = (canvas.width = 96);
  const h = (canvas.height = 96);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  const buckets = new Map<string, { r: number; g: number; b: number; n: number }>();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    const r = data[i] & 0xf0;
    const g = data[i + 1] & 0xf0;
    const b = data[i + 2] & 0xf0;
    const key = `${r},${g},${b}`;
    const e = buckets.get(key);
    if (e) {
      e.r += data[i];
      e.g += data[i + 1];
      e.b += data[i + 2];
      e.n++;
    } else {
      buckets.set(key, { r: data[i], g: data[i + 1], b: data[i + 2], n: 1 });
    }
  }
  const sorted = Array.from(buckets.values()).sort((a, b) => b.n - a.n).slice(0, k);
  return sorted.map(
    (e) =>
      "#" +
      [e.r / e.n, e.g / e.n, e.b / e.n]
        .map((c) => Math.round(c).toString(16).padStart(2, "0"))
        .join("")
  );
}

export default function ImagePalette() {
  const [src, setSrc] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);

  const onFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setColors(extract(img));
    img.src = url;
  };

  return (
    <ToolShell title="Image Palette Extractor" description="Drop an image to extract its dominant colors." category={categoryMap.design}>
      <Card className="p-3">
        <label className="grid h-40 cursor-pointer place-items-center rounded-lg border-2 border-dashed text-sm text-muted-foreground">
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          Click or drop an image here
        </label>
      </Card>
      {src && (
        <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-[300px_1fr]">
          <img src={src} alt="" className="h-48 w-full rounded-md object-cover" />
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {colors.map((c) => (
              <div key={c} className="overflow-hidden rounded-md border">
                <div className="h-12" style={{ background: c }} />
                <div className="flex items-center justify-between gap-1 p-1 text-xs">
                  <code className="font-mono">{c.toUpperCase()}</code>
                  <CopyButton value={c} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </ToolShell>
  );
}
