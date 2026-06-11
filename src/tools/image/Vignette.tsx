import { useEffect, useRef, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function Vignette() {
  const [src, setSrc] = useState<string | null>(null);
  const [strength, setStrength] = useState(0.7);
  const [radius, setRadius] = useState(0.4);
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

  useEffect(() => { render(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [strength, radius]);

  function render() {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const W = img.naturalWidth;
    const H = img.naturalHeight;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const cx = W / 2;
    const cy = H / 2;
    const inner = Math.max(W, H) * radius;
    const outer = Math.max(W, H) * 0.75;
    const g = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, `rgba(0,0,0,${strength})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "vignette.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  return (
    <ToolShell title="Image Vignette" description="Soft dark vignette around any image — adjustable strength and radius." category={categoryMap.image}>
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
          <Card className="space-y-3 p-3">
            <div className="flex items-center gap-3">
              <Label className="w-32 text-sm">Strength: {(strength * 100).toFixed(0)}%</Label>
              <input type="range" min={0} max={1} step={0.05} value={strength} onChange={(e) => setStrength(Number(e.target.value))} className="flex-1" />
            </div>
            <div className="flex items-center gap-3">
              <Label className="w-32 text-sm">Radius: {(radius * 100).toFixed(0)}%</Label>
              <input type="range" min={0.05} max={0.7} step={0.05} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="flex-1" />
            </div>
            <Button size="sm" onClick={download}>Download PNG</Button>
          </Card>
          <Card className="overflow-auto p-3">
            <canvas ref={canvasRef} className="mx-auto max-w-full" />
          </Card>
        </>
      )}
    </ToolShell>
  );
}
