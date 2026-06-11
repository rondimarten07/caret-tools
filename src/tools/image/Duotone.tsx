import { useEffect, useRef, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "").match(/.{1,2}/g);
  if (!m || m.length !== 3) return [0, 0, 0];
  return [parseInt(m[0], 16), parseInt(m[1], 16), parseInt(m[2], 16)];
}

export default function Duotone() {
  const [src, setSrc] = useState<string | null>(null);
  const [dark, setDark] = useState("#1e3a8a");
  const [light, setLight] = useState("#fde047");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function onFile(file: File) {
    setSrc(URL.createObjectURL(file));
  }

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => { imgRef.current = img; render(); };
    img.src = src;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => { render(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [dark, light]);

  function render() {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const [dr, dg, db] = hexToRgb(dark);
    const [lr, lg, lb] = hexToRgb(light);
    const p = data.data;
    for (let i = 0; i < p.length; i += 4) {
      const lum = (0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2]) / 255;
      p[i] = dr + (lr - dr) * lum;
      p[i + 1] = dg + (lg - dg) * lum;
      p[i + 2] = db + (lb - db) * lum;
    }
    ctx.putImageData(data, 0, 0);
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "duotone.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  return (
    <ToolShell title="Image Duotone" description="Map an image's luminance onto a gradient between two colors — Spotify-style duotone." category={categoryMap.image}>
      <Card className="flex min-h-[140px] items-center justify-center border-2 border-dashed p-6 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
      >
        <div>
          <p className="text-sm text-muted-foreground">Drag & drop an image, or</p>
          <label className="mt-2 inline-block cursor-pointer rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">
            Choose file
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
          </label>
        </div>
      </Card>
      {src && (
        <>
          <Card className="grid gap-3 p-3 sm:grid-cols-3">
            <div>
              <Label>Shadows</Label>
              <Input type="color" value={dark} onChange={(e) => setDark(e.target.value)} className="h-10" />
            </div>
            <div>
              <Label>Highlights</Label>
              <Input type="color" value={light} onChange={(e) => setLight(e.target.value)} className="h-10" />
            </div>
            <div className="flex items-end">
              <Button size="sm" className="w-full" onClick={download}>Download PNG</Button>
            </div>
          </Card>
          <Card className="overflow-auto p-3">
            <canvas ref={canvasRef} className="mx-auto max-w-full" />
          </Card>
        </>
      )}
    </ToolShell>
  );
}
