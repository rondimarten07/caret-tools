import { useMemo, useState } from "react";
import { UAParser } from "ua-parser-js";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function UaParser() {
  const [ua, setUa] = useUrlState("ua", 
    typeof navigator !== "undefined" ? navigator.userAgent : ""
  );

  const parsed = useMemo(() => new UAParser(ua).getResult(), [ua]);

  const sections: { label: string; data: Record<string, string | undefined> }[] = [
    { label: "Browser", data: parsed.browser as unknown as Record<string, string | undefined> },
    { label: "Engine", data: parsed.engine as unknown as Record<string, string | undefined> },
    { label: "OS", data: parsed.os as unknown as Record<string, string | undefined> },
    { label: "Device", data: parsed.device as unknown as Record<string, string | undefined> },
    { label: "CPU", data: parsed.cpu as unknown as Record<string, string | undefined> },
  ];

  return (
    <ToolShell
      title="User-Agent Parser"
      description="Decode a browser User-Agent string into structured fields."
      category={categoryMap.network}
      shareable
      actions={
        <Button variant="outline" size="sm" onClick={() => setUa(navigator.userAgent)}>
          Use mine
        </Button>
      }
    >
      <Card className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <Label>User-Agent</Label>
          <CopyButton value={ua} />
        </div>
        <Textarea value={ua} onChange={(e) => setUa(e.target.value)} className="min-h-[100px]" spellCheck={false} />
      </Card>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Card key={s.label} className="p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
            <dl className="mt-2 space-y-1 text-sm">
              {Object.entries(s.data).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="truncate font-mono">{v || "—"}</dd>
                </div>
              ))}
            </dl>
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
