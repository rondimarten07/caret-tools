import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function initials(name: string, max: number): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .filter(Boolean)
    .slice(0, max)
    .join("");
}

export default function Initials() {
  const [input, setInput] = useUrlState("text", "Alice Smith\nBob Williams\nDr. Maya Singh");
  const [max, setMax] = useState(2);

  const result = useMemo(() => {
    return input.split(/\r?\n/).filter((l) => l.trim()).map((name) => ({ name, initials: initials(name, max) }));
  }, [input, max]);

  return (
    <ToolShell title="Initials Generator" description="Extract initials from names — useful for avatars or short labels." category={categoryMap.text} shareable>
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-[1fr_180px]">
        <div>
          <Label className="text-xs">Names (one per line)</Label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[180px]" />
        </div>
        <div>
          <Label className="text-xs">Max letters</Label>
          <div className="mt-1 flex gap-1">
            {[1, 2, 3].map((n) => (
              <Button key={n} size="sm" variant={max === n ? "default" : "outline"} onClick={() => setMax(n)}>{n}</Button>
            ))}
          </div>
        </div>
      </Card>
      <Card className="p-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {result.map((r, i) => (
            <Card key={i} className="flex items-center gap-3 p-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-bold">{r.initials || "?"}</div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{r.name}</div>
                <CopyButton value={r.initials} />
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </ToolShell>
  );
}
