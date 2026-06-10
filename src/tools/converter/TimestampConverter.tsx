import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function TimestampConverter() {
  const [ts, setTs] = useState(() => Math.floor(Date.now() / 1000).toString());
  const [iso, setIso] = useState(() => new Date().toISOString());

  const fromTs = useMemo(() => {
    const n = Number(ts);
    if (!Number.isFinite(n)) return null;
    const ms = n > 1e12 ? n : n * 1000;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }, [ts]);

  const fromIso = useMemo(() => {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  }, [iso]);

  return (
    <ToolShell
      title="Timestamp Converter"
      description="Convert between UNIX timestamps and human-readable dates."
      category={categoryMap.converter}
      actions={
        <Button size="sm" variant="outline" onClick={() => { setTs(Math.floor(Date.now() / 1000).toString()); setIso(new Date().toISOString()); }}>
          Now
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="space-y-2 p-3">
          <Label>UNIX timestamp</Label>
          <Input value={ts} onChange={(e) => setTs(e.target.value)} className="font-mono" />
          <div className="text-sm">
            <div className="text-xs text-muted-foreground">ISO</div>
            <div className="flex items-center justify-between gap-2">
              <code className="font-mono">{fromTs?.toISOString() ?? "—"}</code>
              {fromTs && <CopyButton value={fromTs.toISOString()} />}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Local</div>
            <code className="font-mono">{fromTs?.toString() ?? "—"}</code>
          </div>
        </Card>
        <Card className="space-y-2 p-3">
          <Label>ISO / date string</Label>
          <Input value={iso} onChange={(e) => setIso(e.target.value)} className="font-mono" />
          <div className="text-sm">
            <div className="text-xs text-muted-foreground">UNIX (s)</div>
            <div className="flex items-center justify-between gap-2">
              <code className="font-mono">{fromIso ? Math.floor(fromIso.getTime() / 1000) : "—"}</code>
              {fromIso && <CopyButton value={Math.floor(fromIso.getTime() / 1000).toString()} />}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">UNIX (ms)</div>
            <code className="font-mono">{fromIso ? fromIso.getTime() : "—"}</code>
          </div>
        </Card>
      </div>
    </ToolShell>
  );
}
