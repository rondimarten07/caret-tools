import { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

/**
 * RFC 9562 UUIDv7 — 48-bit Unix ms timestamp || version 7 || 74 random bits
 * Sortable by creation time.
 */
function uuidv7(): string {
  const now = BigInt(Date.now());
  const rand = crypto.getRandomValues(new Uint8Array(10));
  const bytes = new Uint8Array(16);
  // 48-bit timestamp (big-endian)
  bytes[0] = Number((now >> 40n) & 0xffn);
  bytes[1] = Number((now >> 32n) & 0xffn);
  bytes[2] = Number((now >> 24n) & 0xffn);
  bytes[3] = Number((now >> 16n) & 0xffn);
  bytes[4] = Number((now >> 8n) & 0xffn);
  bytes[5] = Number(now & 0xffn);
  // bytes 6-15: random
  bytes.set(rand, 6);
  // Version 7: top 4 bits of byte 6 = 0111
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  // Variant: top 2 bits of byte 8 = 10
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export default function UuidV7Generator() {
  const [count, setCount] = useState(5);
  const [list, setList] = useState<string[]>(() => Array.from({ length: 5 }, uuidv7));

  const regen = () => setList(Array.from({ length: Math.max(1, Math.min(1000, count)) }, uuidv7));
  const joined = list.join("\n");

  return (
    <ToolShell title="UUID v7 Generator" description="Generate UUID v7 — timestamp-prefixed, lexicographically sortable, unique." category={categoryMap.programming}
      actions={
        <>
          <CopyButton value={joined} label="UUIDs copied" />
          <Button size="sm" onClick={regen}>Regenerate</Button>
        </>
      }
    >
      <Card className="flex flex-wrap items-end gap-3 p-3">
        <div>
          <Label className="text-xs">Count</Label>
          <Input type="number" min={1} max={1000} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} className="w-24" />
        </div>
        <p className="ml-auto max-w-md text-xs text-muted-foreground">
          UUID v7 starts with a Unix-ms timestamp, so sorting these strings = sorting by creation time. Great as a primary key.
        </p>
      </Card>
      <Card className="p-3">
        <Textarea readOnly value={joined} className="min-h-[320px] bg-muted/30 font-mono text-sm" />
      </Card>
    </ToolShell>
  );
}
