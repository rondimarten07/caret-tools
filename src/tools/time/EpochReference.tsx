import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const MILESTONES: { ts: number; label: string }[] = [
  { ts: 0, label: "Unix epoch (1970-01-01 UTC)" },
  { ts: 1000000000, label: "1B seconds (2001-09-09)" },
  { ts: 1234567890, label: "Memorable digits (2009-02-13)" },
  { ts: 1500000000, label: "1.5B seconds (2017-07-14)" },
  { ts: 1600000000, label: "1.6B seconds (2020-09-13)" },
  { ts: 1700000000, label: "1.7B seconds (2023-11-14)" },
  { ts: 1800000000, label: "1.8B seconds (2027-01-15)" },
  { ts: 2147483647, label: "Y2038 — int32 overflow" },
  { ts: 4294967295, label: "uint32 overflow" },
];

const FORMATS = [
  { unit: "seconds", divisor: 1, example: "1700000000" },
  { unit: "milliseconds", divisor: 1000, example: "1700000000000" },
  { unit: "microseconds", divisor: 1_000_000, example: "1700000000000000" },
  { unit: "nanoseconds", divisor: 1_000_000_000, example: "1700000000000000000" },
];

export default function EpochReference() {
  const now = Date.now();

  return (
    <ToolShell title="Unix Epoch Reference" description="Milestones, common formats, and pitfalls." category={categoryMap.time}>
      <Card className="p-4">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">Right now</div>
        <div className="mt-2 grid gap-2 text-sm md:grid-cols-2">
          <div className="flex items-center justify-between rounded-md bg-muted/30 p-3 font-mono">
            <span>{Math.floor(now / 1000)} <span className="text-muted-foreground">s</span></span>
            <CopyButton value={String(Math.floor(now / 1000))} />
          </div>
          <div className="flex items-center justify-between rounded-md bg-muted/30 p-3 font-mono">
            <span>{now} <span className="text-muted-foreground">ms</span></span>
            <CopyButton value={String(now)} />
          </div>
        </div>
      </Card>
      <Card className="p-0">
        <div className="border-b p-3 text-xs uppercase text-muted-foreground">Milestones</div>
        <table className="w-full text-sm">
          <tbody>
            {MILESTONES.map((m) => (
              <tr key={m.ts} className="border-b last:border-0">
                <td className="p-3 font-mono">{m.ts}</td>
                <td className="p-3 text-muted-foreground">{m.label}</td>
                <td className="p-3 font-mono text-xs">{new Date(m.ts * 1000).toISOString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="p-0">
        <div className="border-b p-3 text-xs uppercase text-muted-foreground">Units</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="p-3">Unit</th>
              <th className="p-3">Per second</th>
              <th className="p-3">Example</th>
              <th className="p-3">Digits ≈</th>
            </tr>
          </thead>
          <tbody>
            {FORMATS.map((f) => (
              <tr key={f.unit} className="border-b last:border-0">
                <td className="p-3">{f.unit}</td>
                <td className="p-3 font-mono text-muted-foreground">{f.divisor.toLocaleString()}</td>
                <td className="p-3 font-mono text-xs">{f.example}</td>
                <td className="p-3 font-mono text-muted-foreground">{f.example.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="rounded-md bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
        ⚠ Y2038: 32-bit signed second-counters overflow on 2038-01-19 03:14:07 UTC. Always store epoch in 64-bit (or use ISO 8601) for long-lived data.
      </div>
    </ToolShell>
  );
}
