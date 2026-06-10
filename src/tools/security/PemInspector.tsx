import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const SAMPLE = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAydJ8KcgWlVbu5ZpWxIaG
Xa6lZB0R6Wq6cR/A6ph5y3Pm9zEgKqxv9p4l5xkdYRWoq4fbqWZ8b1WqW/3pjT2J
1MZAfWoLg0lFFFFakeBASE64Encoded2lYy8h1bWnxLwYpKfk
-----END PUBLIC KEY-----`;

type Block = { label: string; base64: string; bytes: number };

function parse(input: string): Block[] {
  const re = /-----BEGIN ([^-]+)-----\s*([A-Za-z0-9+/=\s]+?)\s*-----END \1-----/g;
  const blocks: Block[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    const base64 = m[2].replace(/\s+/g, "");
    let bytes = 0;
    try {
      bytes = atob(base64).length;
    } catch {
      /* ignore */
    }
    blocks.push({ label: m[1].trim(), base64, bytes });
  }
  return blocks;
}

export default function PemInspector() {
  const [input, setInput] = useUrlState("text", SAMPLE);
  const blocks = useMemo(() => parse(input), [input]);

  return (
    <ToolShell title="PEM Inspector" description="Decode PEM blocks (certificates, keys, CSRs) to base64 + size." category={categoryMap.security} shareable>
      <Card className="p-3">
        <Label className="mb-2 block">PEM input</Label>
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[260px] font-mono text-xs" spellCheck={false} />
      </Card>
      {blocks.length === 0 ? (
        <Card className="p-6 text-center text-sm text-muted-foreground">No PEM blocks detected. Expected lines like <code className="rounded bg-muted px-1">-----BEGIN ...-----</code>.</Card>
      ) : (
        <div className="space-y-3">
          {blocks.map((b, i) => (
            <Card key={i} className="p-3">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <Label className="text-base">{b.label}</Label>
                  <div className="text-xs text-muted-foreground">{b.bytes.toLocaleString()} bytes decoded · {b.base64.length} base64 chars</div>
                </div>
                <CopyButton value={b.base64} label={`${b.label} copied`} />
              </div>
              <code className="block max-h-40 overflow-auto break-all rounded-md bg-muted/30 p-3 font-mono text-xs">{b.base64}</code>
            </Card>
          ))}
        </div>
      )}
    </ToolShell>
  );
}
