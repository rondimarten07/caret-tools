import { useState } from "react";
import { ulid } from "ulid";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function UlidGenerator() {
  const [count, setCount] = useState(5);
  const [list, setList] = useState<string[]>(() => Array.from({ length: 5 }, () => ulid()));
  const joined = list.join("\n");

  const regen = () => {
    const n = Math.max(1, Math.min(1000, count));
    setList(Array.from({ length: n }, () => ulid()));
  };

  return (
    <ToolShell
      title="ULID Generator"
      description="Generate sortable, lexicographic ULIDs (Universally Unique Lexicographically Sortable IDs)."
      category={categoryMap.programming}
      actions={
        <>
          <CopyButton value={joined} label="ULIDs copied" />
          <Button size="sm" onClick={regen}>Regenerate</Button>
        </>
      }
    >
      <Card className="flex flex-wrap items-end gap-3 p-3">
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Count</Label>
          <Input type="number" min={1} max={1000} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} className="w-24" />
        </div>
      </Card>
      <Card className="p-3">
        <Textarea readOnly value={joined} className="min-h-[320px] bg-muted/30" />
      </Card>
    </ToolShell>
  );
}
