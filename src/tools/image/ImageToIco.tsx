import { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Download } from "lucide-react";

const SIZES = [16, 32, 48, 64];

async function generateIco(img: HTMLImageElement): Promise<Blob> {
  // Each entry is rendered to PNG, packed into ICO container
  const pngs: { size: number; data: Uint8Array }[] = [];
  for (const size of SIZES) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    // Fit within the square, preserving aspect ratio
    const scale = Math.min(size / img.naturalWidth, size / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
    const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), "image/png"));
    const buf = new Uint8Array(await blob.arrayBuffer());
    pngs.push({ size, data: buf });
  }

  // ICONDIR + N ICONDIRENTRY + N PNG payloads
  const headerSize = 6 + pngs.length * 16;
  let totalSize = headerSize;
  for (const p of pngs) totalSize += p.data.byteLength;

  const out = new Uint8Array(totalSize);
  const dv = new DataView(out.buffer);
  // ICONDIR
  dv.setUint16(0, 0, true);            // reserved
  dv.setUint16(2, 1, true);            // type: 1 = ICO
  dv.setUint16(4, pngs.length, true);  // image count

  let offset = headerSize;
  for (let i = 0; i < pngs.length; i++) {
    const e = pngs[i];
    const base = 6 + i * 16;
    dv.setUint8(base, e.size === 256 ? 0 : e.size);     // width
    dv.setUint8(base + 1, e.size === 256 ? 0 : e.size); // height
    dv.setUint8(base + 2, 0);          // color count
    dv.setUint8(base + 3, 0);          // reserved
    dv.setUint16(base + 4, 1, true);   // color planes
    dv.setUint16(base + 6, 32, true);  // bpp
    dv.setUint32(base + 8, e.data.byteLength, true);  // size
    dv.setUint32(base + 12, offset, true);             // offset
    out.set(e.data, offset);
    offset += e.data.byteLength;
  }

  return new Blob([out], { type: "image/x-icon" });
}

export default function ImageToIco() {
  const [src, setSrc] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<string | null>(null);

  const onFile = (f: File) => {
    setSrc(URL.createObjectURL(f));
    setOut(null);
  };

  const generate = async () => {
    if (!src) return;
    setBusy(true);
    const img = new Image();
    img.onload = async () => {
      const blob = await generateIco(img);
      setOut(URL.createObjectURL(blob));
      setBusy(false);
    };
    img.src = src;
  };

  return (
    <ToolShell title="Image → ICO Favicon" description="Generate a multi-size favicon.ico (16/32/48/64) from any image." category={categoryMap.image}>
      <Card className="space-y-3 p-3">
        <Label className="mb-1 block">Source image (PNG/JPG/SVG)</Label>
        <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        <Button onClick={generate} disabled={!src || busy}>{busy ? "Generating…" : "Generate favicon.ico"}</Button>
        {out && (
          <Button asChild variant="outline">
            <a href={out} download="favicon.ico"><Download className="mr-2 h-4 w-4" />Download favicon.ico</a>
          </Button>
        )}
      </Card>
      {src && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
          <Card className="grid place-items-center p-3">
            <img src={src} alt="" className="max-h-72 max-w-full rounded-md border" />
          </Card>
          <Card className="space-y-2 p-3">
            <Label className="text-xs">Sizes included</Label>
            {SIZES.map((s) => (
              <div key={s} className="flex items-center gap-2 text-sm">
                <div className="ring-1 ring-border" style={{ width: s, height: s }}>
                  <img src={src} alt="" className="block h-full w-full object-contain" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">{s}×{s}</span>
              </div>
            ))}
          </Card>
        </div>
      )}
    </ToolShell>
  );
}
