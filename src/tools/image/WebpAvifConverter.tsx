import { useRef, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Download } from "lucide-react";

type Format = "webp" | "avif" | "png" | "jpeg";

const AVIF_SUPPORTED = (() => {
  try {
    const c = document.createElement("canvas");
    return c.toDataURL("image/avif").startsWith("data:image/avif");
  } catch {
    return false;
  }
})();

export default function WebpAvifConverter() {
  const [src, setSrc] = useState<string | null>(null);
  const [format, setFormat] = useState<Format>("webp");
  const [quality, setQuality] = useState(0.85);
  const [origInfo, setOrigInfo] = useState<{ size: number; type: string } | null>(null);
  const [outInfo, setOutInfo] = useState<{ size: number; url: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onFile = (f: File) => {
    setOrigInfo({ size: f.size, type: f.type });
    setOutInfo(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSrc(dataUrl);
      const img = new Image();
      img.onload = () => {
        if (!canvasRef.current) return;
        canvasRef.current.width = img.naturalWidth;
        canvasRef.current.height = img.naturalHeight;
        canvasRef.current.getContext("2d")?.drawImage(img, 0, 0);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(f);
  };

  const convert = async () => {
    if (!canvasRef.current) return;
    const mime = `image/${format}`;
    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        setOutInfo({ size: blob.size, url });
      },
      mime,
      format === "png" ? undefined : quality
    );
  };

  return (
    <ToolShell title="WebP / AVIF Converter" description="Convert images to modern formats (WebP, AVIF) — entirely client-side." category={categoryMap.image}>
      <Card className="space-y-3 p-3">
        <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        <div className="flex flex-wrap items-center gap-2">
          {(["webp", "avif", "png", "jpeg"] as Format[]).map((f) => (
            <Button key={f} size="sm" variant={format === f ? "default" : "outline"} onClick={() => setFormat(f)} disabled={f === "avif" && !AVIF_SUPPORTED}>
              {f.toUpperCase()}{f === "avif" && !AVIF_SUPPORTED ? " (not supported)" : ""}
            </Button>
          ))}
          {format !== "png" && (
            <div className="ml-auto flex items-center gap-2">
              <Label className="text-xs">Quality</Label>
              <Input type="number" step={0.05} min={0.1} max={1} value={quality} onChange={(e) => setQuality(Number(e.target.value) || 0.85)} className="w-24" />
            </div>
          )}
        </div>
        <Button onClick={convert} disabled={!src}>Convert</Button>
      </Card>

      {src && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Card className="p-3">
            <Label className="mb-2 block text-xs">Original {origInfo && `· ${(origInfo.size / 1024).toFixed(1)} KB · ${origInfo.type}`}</Label>
            <canvas ref={canvasRef} className="hidden" />
            <img src={src} alt="" className="max-h-72 w-full rounded-md border object-contain bg-muted" />
          </Card>
          {outInfo && (
            <Card className="p-3">
              <Label className="mb-2 block text-xs">
                Converted · {(outInfo.size / 1024).toFixed(1)} KB · {((1 - outInfo.size / (origInfo?.size ?? 1)) * 100).toFixed(0)}% smaller
              </Label>
              <img src={outInfo.url} alt="" className="max-h-72 w-full rounded-md border object-contain bg-muted" />
              <Button asChild className="mt-3"><a href={outInfo.url} download={`converted.${format}`}><Download className="mr-2 h-4 w-4" />Download</a></Button>
            </Card>
          )}
        </div>
      )}
    </ToolShell>
  );
}
