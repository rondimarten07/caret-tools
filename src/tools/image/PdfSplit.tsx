import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Download } from "lucide-react";

/** Parse "1-3, 5, 7-9" into a list of zero-indexed page numbers. */
function parseRanges(input: string, max: number): number[] {
  const set = new Set<number>();
  for (const chunk of input.split(",")) {
    const t = chunk.trim();
    if (!t) continue;
    const m = t.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      const a = Math.max(1, Number(m[1]));
      const b = Math.min(max, Number(m[2]));
      for (let i = a; i <= b; i++) set.add(i - 1);
    } else {
      const n = Number(t);
      if (n >= 1 && n <= max) set.add(n - 1);
    }
  }
  return Array.from(set).sort((a, b) => a - b);
}

export default function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [ranges, setRanges] = useState("1-1");
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (f: File) => {
    setFile(f);
    setUrl(null);
    const bytes = await f.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    setPageCount(doc.getPageCount());
  };

  const split = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const indices = parseRanges(ranges, src.getPageCount());
      if (indices.length === 0) return;
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, indices);
      pages.forEach((p) => out.addPage(p));
      const data = await out.save();
      setUrl(URL.createObjectURL(new Blob([data as BlobPart], { type: "application/pdf" })));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell title="PDF Split" description="Extract pages from a PDF using range syntax." category={categoryMap.image}>
      <Card className="space-y-3 p-3">
        <Label>PDF file</Label>
        <Input type="file" accept="application/pdf" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        {file && <div className="text-xs text-muted-foreground">{pageCount} pages</div>}
        <div>
          <Label className="text-xs">Pages (e.g. 1-3, 5, 7-9)</Label>
          <Input value={ranges} onChange={(e) => setRanges(e.target.value)} className="font-mono" />
        </div>
        <div className="flex gap-2">
          <Button onClick={split} disabled={!file || busy}>
            {busy ? "Splitting…" : "Extract"}
          </Button>
          {url && (
            <Button asChild variant="outline">
              <a href={url} download="split.pdf"><Download className="mr-2 h-4 w-4" />Download</a>
            </Button>
          )}
        </div>
      </Card>
    </ToolShell>
  );
}
