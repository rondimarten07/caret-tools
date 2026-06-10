import { useState } from "react";
import SparkMD5 from "spark-md5";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const ALGOS = ["MD5", "SHA-1", "SHA-256", "SHA-512"] as const;
type Algo = (typeof ALGOS)[number];

async function hashFile(file: File, algo: Algo, onProgress?: (p: number) => void): Promise<string> {
  if (algo === "MD5") {
    // SparkMD5 supports incremental hashing
    return new Promise((resolve, reject) => {
      const chunkSize = 2 * 1024 * 1024;
      const chunks = Math.ceil(file.size / chunkSize);
      const spark = new SparkMD5.ArrayBuffer();
      const reader = new FileReader();
      let i = 0;
      reader.onload = (e) => {
        spark.append(e.target?.result as ArrayBuffer);
        i++;
        onProgress?.((i / chunks) * 100);
        if (i < chunks) loadNext();
        else resolve(spark.end());
      };
      reader.onerror = () => reject(new Error("Failed to read file."));
      const loadNext = () => {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        reader.readAsArrayBuffer(file.slice(start, end));
      };
      loadNext();
    });
  }
  const buf = await file.arrayBuffer();
  onProgress?.(50);
  const digest = await crypto.subtle.digest(algo, buf);
  onProgress?.(100);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function FileHash() {
  const [info, setInfo] = useState<{ name: string; size: number } | null>(null);
  const [hashes, setHashes] = useState<Partial<Record<Algo, string>>>({});
  const [busy, setBusy] = useState<Algo | null>(null);
  const [progress, setProgress] = useState(0);

  const onFile = async (f: File) => {
    setInfo({ name: f.name, size: f.size });
    setHashes({});
    setProgress(0);
    for (const algo of ALGOS) {
      setBusy(algo);
      const h = await hashFile(f, algo, setProgress);
      setHashes((prev) => ({ ...prev, [algo]: h }));
    }
    setBusy(null);
    setProgress(0);
  };

  return (
    <ToolShell title="File Hash" description="Compute MD5 / SHA-1 / SHA-256 / SHA-512 of a file. Useful for verifying downloads." category={categoryMap.security}>
      <Card className="p-3">
        <Label className="mb-1 block">Pick a file</Label>
        <Input type="file" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        {info && (
          <div className="mt-2 text-xs text-muted-foreground">
            <code className="font-mono">{info.name}</code> · {(info.size / 1024).toFixed(1)} KB
          </div>
        )}
        {busy && (
          <div className="mt-2">
            <div className="text-xs text-muted-foreground">Computing {busy}… {Math.round(progress)}%</div>
            <div className="mt-1 h-1 w-full overflow-hidden rounded bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </Card>
      <div className="space-y-3">
        {ALGOS.map((a) => (
          <Card key={a} className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <Label>{a}</Label>
              {hashes[a] && <CopyButton value={hashes[a]!} />}
            </div>
            <code className="block break-all rounded bg-muted/30 p-3 font-mono text-xs">
              {hashes[a] || <span className="text-muted-foreground">—</span>}
            </code>
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
