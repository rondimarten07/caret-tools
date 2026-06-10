import { useEffect, useRef, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Download, RotateCcw, RotateCw, FlipHorizontal, FlipVertical } from "lucide-react";

export default function ImageRotator() {
  const [src, setSrc] = useState<string | null>(null);
  const [angle, setAngle] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const draw = () => {
    if (!imgRef.current || !canvasRef.current) return;
    const img = imgRef.current;
    const c = canvasRef.current;
    const rad = (angle * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    c.width = w * cos + h * sin;
    c.height = w * sin + h * cos;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.translate(c.width / 2, c.height / 2);
    ctx.rotate(rad);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    ctx.drawImage(img, -w / 2, -h / 2);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  useEffect(draw, [angle, flipX, flipY, src]);

  const onFile = (f: File) => {
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setSrc(url);
      setAngle(0);
      setFlipX(false);
      setFlipY(false);
    };
    img.src = url;
  };

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = "rotated.png";
    a.click();
  };

  return (
    <ToolShell title="Image Rotator" description="Rotate by any angle and flip horizontally / vertically." category={categoryMap.image}>
      <Card className="space-y-3 p-3">
        <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        {src && (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setAngle((a) => (a - 90 + 360) % 360)}><RotateCcw className="mr-1 h-3.5 w-3.5" />-90°</Button>
              <Button size="sm" variant="outline" onClick={() => setAngle((a) => (a + 90) % 360)}><RotateCw className="mr-1 h-3.5 w-3.5" />+90°</Button>
              <Button size="sm" variant={flipX ? "default" : "outline"} onClick={() => setFlipX((v) => !v)}><FlipHorizontal className="mr-1 h-3.5 w-3.5" />Flip X</Button>
              <Button size="sm" variant={flipY ? "default" : "outline"} onClick={() => setFlipY((v) => !v)}><FlipVertical className="mr-1 h-3.5 w-3.5" />Flip Y</Button>
              <div className="ml-auto flex items-center gap-2">
                <Label className="text-xs">Angle</Label>
                <Input type="number" value={angle} onChange={(e) => setAngle(Number(e.target.value) || 0)} className="w-24" />
                <span className="text-xs text-muted-foreground">°</span>
              </div>
            </div>
            <input
              type="range"
              min={-180}
              max={180}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </>
        )}
      </Card>
      {src && (
        <Card className="grid place-items-center bg-muted/20 p-3">
          <canvas ref={canvasRef} className="max-h-[500px] max-w-full rounded-md border bg-white" />
          <Button onClick={download} className="mt-3"><Download className="mr-2 h-4 w-4" />Download PNG</Button>
        </Card>
      )}
    </ToolShell>
  );
}
