import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Parts = { Y: number; Mo: number; D: number; H: number; M: number; S: number };

function parse(input: string): Parts | null {
  const m = input.trim().toUpperCase().match(/^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/);
  if (!m || (m[1] == null && m[2] == null && m[3] == null && m[4] == null && m[5] == null && m[6] == null)) return null;
  return { Y: +(m[1] ?? 0), Mo: +(m[2] ?? 0), D: +(m[3] ?? 0), H: +(m[4] ?? 0), M: +(m[5] ?? 0), S: +(m[6] ?? 0) };
}

function build(p: Parts): string {
  const date = [p.Y && `${p.Y}Y`, p.Mo && `${p.Mo}M`, p.D && `${p.D}D`].filter(Boolean).join("");
  const time = [p.H && `${p.H}H`, p.M && `${p.M}M`, p.S && `${p.S}S`].filter(Boolean).join("");
  return "P" + date + (time ? "T" + time : "");
}

function toSeconds(p: Parts): number {
  return p.Y * 31_557_600 + p.Mo * 2_629_800 + p.D * 86_400 + p.H * 3_600 + p.M * 60 + p.S;
}

export default function IsoDuration() {
  const [input, setInput] = useState("P2Y1MT3H30M");
  const [parts, setParts] = useState<Parts>({ Y: 0, Mo: 0, D: 0, H: 1, M: 30, S: 0 });

  const parsed = useMemo(() => parse(input), [input]);
  const built = useMemo(() => build(parts), [parts]);

  return (
    <ToolShell title="ISO 8601 Duration" description="Parse or build ISO 8601 durations (P2Y1MT3H30M)." category={categoryMap.time}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="space-y-2 p-3">
          <Label>Parse</Label>
          <Input value={input} onChange={(e) => setInput(e.target.value)} className="font-mono" placeholder="PT1H30M" />
          {parsed ? (
            <>
              <div className="grid grid-cols-6 gap-2 text-center text-xs">
                {(["Y", "Mo", "D", "H", "M", "S"] as (keyof Parts)[]).map((k) => (
                  <div key={k} className="rounded-md bg-muted/30 p-2">
                    <div className="text-muted-foreground">{k}</div>
                    <div className="font-mono text-lg">{parsed[k]}</div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Total: <code className="font-mono">{toSeconds(parsed).toLocaleString()}</code> seconds
              </div>
            </>
          ) : (
            <p className="text-xs text-rose-500">Invalid ISO 8601 duration.</p>
          )}
        </Card>
        <Card className="space-y-2 p-3">
          <Label>Build</Label>
          <div className="grid grid-cols-6 gap-2">
            {(["Y", "Mo", "D", "H", "M", "S"] as (keyof Parts)[]).map((k) => (
              <div key={k}>
                <Label className="text-xs">{k}</Label>
                <Input type="number" value={parts[k]} onChange={(e) => setParts((p) => ({ ...p, [k]: Number(e.target.value) || 0 }))} />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-md bg-muted/30 p-3 font-mono text-sm">{built === "P" ? "PT0S" : built}</code>
            <CopyButton value={built === "P" ? "PT0S" : built} />
          </div>
        </Card>
      </div>
    </ToolShell>
  );
}
