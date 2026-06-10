import { useRef, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Download } from "lucide-react";

type Format = "png" | "jpeg" | "webp";

export default function ImageConverter() {
  const [src, setSrc] = useState<string | null>(null);
  const [format, setFormat] = useState<Format>("webp");
  const [quality, setQuality] = useState(0.85);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onFile = (f: File) => {
    const url = URL.createObjectURL(f);
    setSrc(url);
    const img = new Image();
    img.onload = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = img.naturalWidth;
      canvasRef.current.height = img.naturalHeight;
      canvasRef.current.getContext("2d")?.drawImage(img, 0, 0);
    };
    img.src = url;
  };

  const download = () => {
    if (!canvasRef.current) return;
    const mime = `image/${format}`;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL(mime, quality);
    a.download = `image.${format}`;
    a.click();
  };

  return (
    <ToolShell title="Image Format Converter" description="Convert images between PNG, JPG and WebP." category={categoryMap.image}>
      <Card className="space-y-3 p-3">
        <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        <div className="flex flex-wrap gap-2">
          {(["png", "jpeg", "webp"] as Format[]).map((f) => (
            <Button key={f} size="sm" variant={format === f ? "default" : "outline"} onClick={() => setFormat(f)}>{f.toUpperCase()}</Button>
          ))}
          {format !== "png" && (
            <div className="ml-auto flex items-center gap-2">
              <Label className="text-xs">Quality</Label>
              <Input type="number" step={0.05} min={0.1} max={1} value={quality} onChange={(e) => setQuality(Number(e.target.value) || 0.85)} className="w-24" />
            </div>
          )}
        </div>
      </Card>
      {src && (
        <Card className="grid place-items-center p-3">
          <canvas ref={canvasRef} className="max-h-72 max-w-full rounded-md border bg-white" />
          <Button onClick={download} className="mt-3"><Download className="mr-2 h-4 w-4" />Download .{format}</Button>
        </Card>
      )}
    </ToolShell>
  );
}
