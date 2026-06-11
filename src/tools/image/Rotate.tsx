import { useEffect, useRef, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

export default function ImageRotate() {
  const [src, setSrc] = useState<string | null>(null);
  const [angle, setAngle] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function onFile(file: File) {
    const url = URL.createObjectURL(file);
    setSrc(url);
  }

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      render();
    };
    img.src = src;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => { render(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [angle, flipH, flipV]);

  function render() {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const swap = angle % 180 !== 0;
    canvas.width = swap ? img.naturalHeight : img.naturalWidth;
    canvas.height = swap ? img.naturalWidth : img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    ctx.restore();
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "rotated.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  return (
    <ToolShell title="Image Rotate / Flip" description="Rotate 90°/180°/270° and flip horizontally or vertically — all in-browser." category={categoryMap.image}>
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
            <Button variant="outline" size="sm" onClick={() => setAngle((a) => (a + 90) % 360)}>↻ 90°</Button>
            <Button variant="outline" size="sm" onClick={() => setAngle((a) => (a + 270) % 360)}>↺ 90°</Button>
            <Button variant="outline" size="sm" onClick={() => setAngle((a) => (a + 180) % 360)}>180°</Button>
            <Button variant={flipH ? "default" : "outline"} size="sm" onClick={() => setFlipH(!flipH)}>Flip H</Button>
            <Button variant={flipV ? "default" : "outline"} size="sm" onClick={() => setFlipV(!flipV)}>Flip V</Button>
            <span className="ml-auto text-xs text-muted-foreground">{angle}°</span>
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
