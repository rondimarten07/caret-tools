import { useEffect, useRef, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Download } from "lucide-react";

export default function ImageCropper() {
  const [src, setSrc] = useState<string | null>(null);
  const [dim, setDim] = useState<{ w: number; h: number } | null>(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [w, setW] = useState(300);
  const [h, setH] = useState(300);
  const previewRef = useRef<HTMLCanvasElement>(null);

  const onFile = (f: File) => {
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setDim({ w: img.naturalWidth, h: img.naturalHeight });
      setX(0); setY(0);
      setW(Math.min(300, img.naturalWidth));
      setH(Math.min(300, img.naturalHeight));
      setSrc(url);
    };
    img.src = url;
  };

  useEffect(() => {
    if (!src || !previewRef.current) return;
    const c = previewRef.current;
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    const img = new Image();
    img.onload = () => ctx?.drawImage(img, x, y, w, h, 0, 0, w, h);
    img.src = src;
  }, [src, x, y, w, h]);

  const download = () => {
    if (!previewRef.current) return;
    const a = document.createElement("a");
    a.href = previewRef.current.toDataURL("image/png");
    a.download = "cropped.png";
    a.click();
  };

  return (
    <ToolShell title="Image Cropper" description="Crop an image to a custom rectangle." category={categoryMap.image}>
      <Card className="space-y-3 p-3">
        <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        {dim && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div><Label className="text-xs">X</Label><Input type="number" min={0} max={dim.w} value={x} onChange={(e) => setX(Number(e.target.value) || 0)} /></div>
            <div><Label className="text-xs">Y</Label><Input type="number" min={0} max={dim.h} value={y} onChange={(e) => setY(Number(e.target.value) || 0)} /></div>
            <div><Label className="text-xs">Width</Label><Input type="number" min={1} max={dim.w} value={w} onChange={(e) => setW(Number(e.target.value) || 1)} /></div>
            <div><Label className="text-xs">Height</Label><Input type="number" min={1} max={dim.h} value={h} onChange={(e) => setH(Number(e.target.value) || 1)} /></div>
          </div>
        )}
      </Card>
      {src && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Card className="p-3">
            <Label className="mb-2 block text-xs">Source ({dim?.w}×{dim?.h})</Label>
            <img src={src} alt="" className="max-h-72 w-full rounded-md border object-contain" />
          </Card>
          <Card className="p-3">
            <Label className="mb-2 block text-xs">Cropped ({w}×{h})</Label>
            <canvas ref={previewRef} className="max-h-72 max-w-full rounded-md border bg-white" />
            <Button onClick={download} className="mt-3"><Download className="mr-2 h-4 w-4" />Download</Button>
          </Card>
        </div>
      )}
    </ToolShell>
  );
}
