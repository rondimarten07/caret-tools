import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Bits = { r: boolean; w: boolean; x: boolean };

function emptyBits(): Bits {
  return { r: false, w: false, x: false };
}

function bitsToOctal(b: Bits): number {
  return (b.r ? 4 : 0) + (b.w ? 2 : 0) + (b.x ? 1 : 0);
}

function bitsToRwx(b: Bits): string {
  return `${b.r ? "r" : "-"}${b.w ? "w" : "-"}${b.x ? "x" : "-"}`;
}

export default function ChmodCalculator() {
  const [owner, setOwner] = useState<Bits>({ r: true, w: true, x: false });
  const [group, setGroup] = useState<Bits>({ r: true, w: false, x: false });
  const [other, setOther] = useState<Bits>({ r: true, w: false, x: false });

  const result = useMemo(() => {
    const oc = `${bitsToOctal(owner)}${bitsToOctal(group)}${bitsToOctal(other)}`;
    const rwx = `${bitsToRwx(owner)}${bitsToRwx(group)}${bitsToRwx(other)}`;
    return { oc, rwx };
  }, [owner, group, other]);

  return (
    <ToolShell title="Chmod Calculator" description="Compute Unix file permissions from checkboxes." category={categoryMap.programming}>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Class</th>
              <th className="p-3 text-center">Read (4)</th>
              <th className="p-3 text-center">Write (2)</th>
              <th className="p-3 text-center">Execute (1)</th>
              <th className="p-3 text-right">Octal</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: "owner", label: "Owner", b: owner, s: setOwner },
              { id: "group", label: "Group", b: group, s: setGroup },
              { id: "other", label: "Other", b: other, s: setOther },
            ].map((row) => (
              <tr key={row.id} className="border-b last:border-0">
                <td className="p-3 font-medium">{row.label}</td>
                {(["r", "w", "x"] as const).map((k) => (
                  <td key={k} className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={row.b[k]}
                      onChange={(e) => row.s({ ...row.b, [k]: e.target.checked })}
                      className="h-4 w-4 accent-primary"
                    />
                  </td>
                ))}
                <td className="p-3 text-right font-mono">{bitsToOctal(row.b)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card className="flex items-center justify-between gap-3 p-4">
          <div>
            <Label className="text-xs text-muted-foreground">Octal</Label>
            <div className="font-mono text-3xl">{result.oc}</div>
          </div>
          <CopyButton value={result.oc} />
        </Card>
        <Card className="flex items-center justify-between gap-3 p-4">
          <div>
            <Label className="text-xs text-muted-foreground">Symbolic</Label>
            <div className="font-mono text-3xl">{result.rwx}</div>
          </div>
          <CopyButton value={result.rwx} />
        </Card>
      </div>
      <Card className="p-3">
        <code className="block rounded-md bg-muted/30 p-3 font-mono text-sm">
          chmod {result.oc} ./file
        </code>
      </Card>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {[
          { name: "Read-only file", v: [{ r: true, w: false, x: false }, { r: true, w: false, x: false }, { r: true, w: false, x: false }] },
          { name: "Owner edit", v: [{ r: true, w: true, x: false }, { r: true, w: false, x: false }, { r: true, w: false, x: false }] },
          { name: "Executable", v: [{ r: true, w: true, x: true }, { r: true, w: false, x: true }, { r: true, w: false, x: true }] },
          { name: "Private", v: [{ r: true, w: true, x: false }, { r: false, w: false, x: false }, { r: false, w: false, x: false }] },
        ].map((p) => (
          <button
            key={p.name}
            onClick={() => { setOwner(p.v[0]); setGroup(p.v[1]); setOther(p.v[2]); }}
            className="rounded-md border bg-card px-3 py-2 text-xs hover:border-primary/40"
          >
            {p.name}
          </button>
        ))}
      </div>
    </ToolShell>
  );
}
