import { useEffect, useRef, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

type Filter = "none" | "grayscale" | "sepia" | "invert";

export default function ImageGrayscale() {
  const [src, setSrc] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("grayscale");
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

  useEffect(() => { render(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [filter]);

  function render() {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    if (filter === "none") return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const p = data.data;
    for (let i = 0; i < p.length; i += 4) {
      const r = p[i], g = p[i + 1], b = p[i + 2];
      if (filter === "grayscale") {
        const y = 0.299 * r + 0.587 * g + 0.114 * b;
        p[i] = p[i + 1] = p[i + 2] = y;
      } else if (filter === "sepia") {
        p[i] = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b);
        p[i + 1] = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b);
        p[i + 2] = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b);
      } else if (filter === "invert") {
        p[i] = 255 - r; p[i + 1] = 255 - g; p[i + 2] = 255 - b;
      }
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
      a.download = `${filter}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  return (
    <ToolShell title="Image Filters" description="Apply grayscale, sepia or invert filters in-browser." category={categoryMap.image}>
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
          <Card className="flex flex-wrap items-center gap-2 p-3">
            {(["none", "grayscale", "sepia", "invert"] as Filter[]).map((f) => (
              <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>{f}</Button>
            ))}
            <Button size="sm" className="ml-auto" onClick={download}>Download PNG</Button>
          </Card>
          <Card className="overflow-auto p-3">
            <canvas ref={canvasRef} className="mx-auto max-w-full" />
          </Card>
        </>
      )}
    </ToolShell>
  );
}
