import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Download, X, GripVertical } from "lucide-react";

export default function PdfMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  const addFiles = (fl: FileList | null) => {
    if (!fl) return;
    setFiles((prev) => [...prev, ...Array.from(fl).filter((f) => f.type === "application/pdf")]);
    setUrl(null);
  };

  const remove = (i: number) => {
    setFiles((p) => p.filter((_, idx) => idx !== i));
    setUrl(null);
  };

  const move = (i: number, dir: -1 | 1) => {
    setFiles((p) => {
      const next = [...p];
      const j = i + dir;
      if (j < 0 || j >= next.length) return p;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setUrl(null);
  };

  const merge = async () => {
    if (files.length < 2) return;
    setBusy(true);
    try {
      const out = await PDFDocument.create();
      for (const f of files) {
        const bytes = await f.arrayBuffer();
        const src = await PDFDocument.load(bytes);
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      const merged = await out.save();
      setUrl(URL.createObjectURL(new Blob([merged as BlobPart], { type: "application/pdf" })));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell title="PDF Merge" description="Combine multiple PDFs into one — entirely in your browser." category={categoryMap.image}>
      <Card className="space-y-3 p-3">
        <Label>Add PDF files</Label>
        <Input type="file" accept="application/pdf" multiple onChange={(e) => addFiles(e.target.files)} />
        {files.length > 0 && (
          <ul className="space-y-1">
            {files.map((f, i) => (
              <li key={i} className="flex items-center gap-2 rounded-md border bg-card p-2 text-sm">
                <button onClick={() => move(i, -1)} className="text-muted-foreground hover:text-foreground" disabled={i === 0} aria-label="Move up">
                  <GripVertical className="h-3.5 w-3.5" />
                </button>
                <span className="flex-1 truncate">{f.name}</span>
                <span className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(0)} KB</span>
                <button onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <Button onClick={merge} disabled={files.length < 2 || busy}>
            {busy ? "Merging…" : `Merge ${files.length} PDF${files.length === 1 ? "" : "s"}`}
          </Button>
          {url && (
            <Button asChild variant="outline">
              <a href={url} download="merged.pdf"><Download className="mr-2 h-4 w-4" />Download</a>
            </Button>
          )}
        </div>
      </Card>
    </ToolShell>
  );
}
