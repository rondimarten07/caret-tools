import { useState } from "react";
import { jsPDF } from "jspdf";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Download, X } from "lucide-react";

type Item = { file: File; url: string };

export default function ImageToPdf() {
  const [items, setItems] = useState<Item[]>([]);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [format, setFormat] = useState<"a4" | "letter">("a4");
  const [busy, setBusy] = useState(false);

  const onFiles = (fl: FileList | null) => {
    if (!fl) return;
    const next = Array.from(fl).filter((f) => f.type.startsWith("image/")).map((file) => ({ file, url: URL.createObjectURL(file) }));
    setItems((p) => [...p, ...next]);
  };

  const generate = async () => {
    if (items.length === 0) return;
    setBusy(true);
    try {
      const pdf = new jsPDF({ orientation, format });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < items.length; i++) {
        const img = await loadImage(items[i].url);
        const scale = Math.min(pageW / img.width, pageH / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (pageW - w) / 2;
        const y = (pageH - h) / 2;
        if (i > 0) pdf.addPage();
        const dataUrl = await imgToDataUrl(img);
        const isPng = dataUrl.startsWith("data:image/png");
        pdf.addImage(dataUrl, isPng ? "PNG" : "JPEG", x, y, w, h);
      }
      pdf.save("images.pdf");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell title="Image → PDF" description="Combine one or more images into a single PDF." category={categoryMap.image}>
      <Card className="space-y-3 p-3">
        <Input type="file" accept="image/*" multiple onChange={(e) => onFiles(e.target.files)} />
        <div className="flex flex-wrap items-center gap-2">
          <Label className="text-xs">Format</Label>
          <Button size="sm" variant={format === "a4" ? "default" : "outline"} onClick={() => setFormat("a4")}>A4</Button>
          <Button size="sm" variant={format === "letter" ? "default" : "outline"} onClick={() => setFormat("letter")}>Letter</Button>
          <Label className="text-xs ml-2">Orientation</Label>
          <Button size="sm" variant={orientation === "portrait" ? "default" : "outline"} onClick={() => setOrientation("portrait")}>Portrait</Button>
          <Button size="sm" variant={orientation === "landscape" ? "default" : "outline"} onClick={() => setOrientation("landscape")}>Landscape</Button>
        </div>
        <Button onClick={generate} disabled={items.length === 0 || busy}>
          <Download className="mr-2 h-4 w-4" />
          {busy ? "Generating…" : `Generate PDF (${items.length})`}
        </Button>
      </Card>
      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {items.map((it, i) => (
            <Card key={i} className="relative overflow-hidden p-0">
              <img src={it.url} alt="" className="aspect-square w-full object-cover" />
              <button onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))} className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-white">
                <X className="h-3 w-3" />
              </button>
            </Card>
          ))}
        </div>
      )}
    </ToolShell>
  );
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function imgToDataUrl(img: HTMLImageElement): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext("2d")?.drawImage(img, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.9);
}
