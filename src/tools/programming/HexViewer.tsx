import { useEffect, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const ROW_BYTES = 16;
const MAX_BYTES = 4096; // 4KB cap for browser performance

function toHex(b: number): string {
  return b.toString(16).padStart(2, "0").toUpperCase();
}

function toAscii(b: number): string {
  return b >= 0x20 && b < 0x7f ? String.fromCharCode(b) : ".";
}

export default function HexViewer() {
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [filename, setFilename] = useState("");
  const [info, setInfo] = useState<{ size: number; type: string } | null>(null);

  useEffect(() => {
    // sample text on mount
    if (!bytes) {
      const enc = new TextEncoder();
      setBytes(enc.encode("Caret. — Precision tools, in your pocket.\n\nDrop a file to inspect its bytes."));
    }
  }, []); // eslint-disable-line

  const onFile = async (f: File) => {
    setFilename(f.name);
    setInfo({ size: f.size, type: f.type || "unknown" });
    const buf = await f.slice(0, MAX_BYTES).arrayBuffer();
    setBytes(new Uint8Array(buf));
  };

  const rows: { offset: string; hex: string; ascii: string }[] = [];
  if (bytes) {
    for (let i = 0; i < bytes.length; i += ROW_BYTES) {
      const slice = bytes.slice(i, i + ROW_BYTES);
      rows.push({
        offset: i.toString(16).padStart(8, "0").toUpperCase(),
        hex: Array.from(slice).map(toHex).join(" "),
        ascii: Array.from(slice).map(toAscii).join(""),
      });
    }
  }

  return (
    <ToolShell title="Hex File Viewer" description={`Inspect any file as a hex + ASCII dump. First ${MAX_BYTES / 1024} KB only.`} category={categoryMap.programming}>
      <Card className="p-3">
        <Label className="mb-1 block">Pick a file</Label>
        <Input type="file" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        {info && (
          <div className="mt-2 text-xs text-muted-foreground">
            <code className="font-mono">{filename}</code> · {info.size.toLocaleString()} bytes · <code>{info.type}</code>
          </div>
        )}
      </Card>
      {bytes && (
        <Card className="overflow-hidden p-0">
          <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 overflow-auto bg-muted/20 p-3 font-mono text-xs leading-relaxed">
            {rows.map((r, i) => (
              <div key={i} className="contents">
                <span className="text-muted-foreground">{r.offset}</span>
                <span className="whitespace-pre">{r.hex.padEnd(ROW_BYTES * 3 - 1, " ")}</span>
                <span className="text-muted-foreground">{r.ascii}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </ToolShell>
  );
}
