import { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function genUuid(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [upper, setUpper] = useState(false);
  const [list, setList] = useState<string[]>(() =>
    Array.from({ length: 5 }, genUuid)
  );

  const display = upper ? list.map((u) => u.toUpperCase()) : list;
  const joined = display.join("\n");

  const regenerate = () => {
    const n = Math.max(1, Math.min(1000, count));
    setList(Array.from({ length: n }, genUuid));
  };

  return (
    <ToolShell
      title="UUID Generator"
      description="Generate cryptographically random v4 UUIDs in bulk."
      category={categoryMap.programming}
      actions={
        <>
          <CopyButton value={joined} label="UUIDs copied" />
          <Button size="sm" onClick={regenerate}>
            Regenerate
          </Button>
        </>
      }
    >
      <Card className="flex flex-wrap items-end gap-3 p-3">
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Count</Label>
          <Input
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(e) => setCount(Number(e.target.value) || 1)}
            className="w-24"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Case</Label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={!upper ? "default" : "outline"}
              onClick={() => setUpper(false)}
            >
              lowercase
            </Button>
            <Button
              size="sm"
              variant={upper ? "default" : "outline"}
              onClick={() => setUpper(true)}
            >
              UPPERCASE
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-3">
        <Textarea
          readOnly
          value={joined}
          className="min-h-[320px] bg-muted/30"
          spellCheck={false}
        />
      </Card>
    </ToolShell>
  );
}
