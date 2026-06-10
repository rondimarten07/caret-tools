import { useEffect, useRef, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Download } from "lucide-react";

export default function ImageResizer() {
  const [src, setSrc] = useState<string | null>(null);
  const [origDim, setOrigDim] = useState<{ w: number; h: number } | null>(null);
  const [w, setW] = useState(800);
  const [h, setH] = useState(600);
  const [lock, setLock] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onFile = (f: File) => {
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setOrigDim({ w: img.naturalWidth, h: img.naturalHeight });
      setW(img.naturalWidth);
      setH(img.naturalHeight);
      setSrc(url);
    };
    img.src = url;
  };

  useEffect(() => {
    if (!src || !canvasRef.current) return;
    const c = canvasRef.current;
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    const img = new Image();
    img.onload = () => ctx?.drawImage(img, 0, 0, w, h);
    img.src = src;
  }, [src, w, h]);

  const setWidth = (nw: number) => {
    setW(nw);
    if (lock && origDim) setH(Math.round((nw / origDim.w) * origDim.h));
  };
  const setHeight = (nh: number) => {
    setH(nh);
    if (lock && origDim) setW(Math.round((nh / origDim.h) * origDim.w));
  };

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = "resized.png";
    a.click();
  };

  return (
    <ToolShell title="Image Resizer" description="Resize an image client-side and download as PNG." category={categoryMap.image}>
      <Card className="space-y-3 p-3">
        <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        {origDim && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div><Label className="text-xs">Width</Label><Input type="number" value={w} onChange={(e) => setWidth(Number(e.target.value) || 0)} /></div>
            <div><Label className="text-xs">Height</Label><Input type="number" value={h} onChange={(e) => setHeight(Number(e.target.value) || 0)} /></div>
            <Button variant={lock ? "default" : "outline"} onClick={() => setLock((v) => !v)} className="mt-5">{lock ? "🔒 Aspect lock" : "🔓 Free"}</Button>
          </div>
        )}
      </Card>
      {src && (
        <Card className="grid place-items-center bg-muted/20 p-3">
          <canvas ref={canvasRef} className="max-h-[420px] max-w-full rounded-md border bg-white" />
          <Button onClick={download} className="mt-3"><Download className="mr-2 h-4 w-4" />Download PNG</Button>
        </Card>
      )}
    </ToolShell>
  );
}
