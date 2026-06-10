import { useState } from "react";
import imageCompression from "browser-image-compression";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Download } from "lucide-react";

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [compressed, setCompressed] = useState<{ url: string; size: number; name: string } | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [maxKB, setMaxKB] = useState(500);
  const [busy, setBusy] = useState(false);

  const run = async (f: File) => {
    setBusy(true);
    try {
      const out = await imageCompression(f, {
        maxSizeMB: maxKB / 1024,
        initialQuality: quality,
        useWebWorker: true,
      });
      setCompressed({
        url: URL.createObjectURL(out),
        size: out.size,
        name: `compressed-${f.name}`,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell title="Image Compressor" description="Compress images in the browser — nothing is uploaded." category={categoryMap.image}>
      <Card className="space-y-3 p-3">
        <Input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setCompressed(null); } }} />
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs">Quality (0–1)</Label><Input type="number" step={0.05} min={0.1} max={1} value={quality} onChange={(e) => setQuality(Number(e.target.value) || 0.7)} /></div>
          <div><Label className="text-xs">Max size (KB)</Label><Input type="number" min={10} value={maxKB} onChange={(e) => setMaxKB(Number(e.target.value) || 500)} /></div>
        </div>
        <Button onClick={() => file && run(file)} disabled={!file || busy}>{busy ? "Compressing…" : "Compress"}</Button>
      </Card>
      {file && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Card className="p-3">
            <div className="text-xs text-muted-foreground">Original · {(file.size / 1024).toFixed(1)} KB</div>
            <img src={URL.createObjectURL(file)} alt="" className="mt-2 max-h-72 w-full rounded-md object-contain" />
          </Card>
          {compressed && (
            <Card className="p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Compressed · {(compressed.size / 1024).toFixed(1)} KB</span>
                <Button size="sm" variant="outline" asChild>
                  <a href={compressed.url} download={compressed.name}><Download className="mr-1 h-3 w-3" />Download</a>
                </Button>
              </div>
              <img src={compressed.url} alt="" className="mt-2 max-h-72 w-full rounded-md object-contain" />
            </Card>
          )}
        </div>
      )}
    </ToolShell>
  );
}
