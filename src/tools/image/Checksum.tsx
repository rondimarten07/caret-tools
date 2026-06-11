import { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

async function digest(file: File, algo: "SHA-1" | "SHA-256" | "SHA-512"): Promise<string> {
  const buf = await file.arrayBuffer();
  const h = await crypto.subtle.digest(algo, buf);
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

type Result = { name: string; size: number; sha1: string; sha256: string; sha512: string };

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export default function Checksum() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File) {
    setError(null);
    setBusy(true);
    try {
      const [sha1, sha256, sha512] = await Promise.all([digest(file, "SHA-1"), digest(file, "SHA-256"), digest(file, "SHA-512")]);
      setResult({ name: file.name, size: file.size, sha1, sha256, sha512 });
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolShell title="Image Checksum" description="Compute SHA-1, SHA-256 and SHA-512 of any file in-browser. Useful for verifying downloads." category={categoryMap.image}>
      <Card
        className="flex min-h-[140px] items-center justify-center border-2 border-dashed p-6 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
      >
        <div>
          <p className="text-sm text-muted-foreground">Drag & drop any file, or</p>
          <label className="mt-2 inline-block cursor-pointer rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">
            Choose file
            <input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
          </label>
        </div>
      </Card>
      {busy && <Card className="p-4 text-center text-sm text-muted-foreground">Hashing…</Card>}
      {error && <Card className="p-4 text-sm text-destructive">{error}</Card>}
      {result && (
        <Card className="space-y-3 p-4">
          <div className="text-xs text-muted-foreground">{result.name} · {fmtBytes(result.size)}</div>
          {(["sha1", "sha256", "sha512"] as const).map((key) => (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase text-muted-foreground">{key}</span>
                <CopyButton value={result[key]} />
              </div>
              <pre className="overflow-auto rounded-md bg-muted/30 p-2 text-xs font-mono">{result[key]}</pre>
            </div>
          ))}
        </Card>
      )}
    </ToolShell>
  );
}
