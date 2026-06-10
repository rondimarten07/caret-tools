import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function poolSize(pw: string) {
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/\d/.test(pw)) pool += 10;
  if (/[^A-Za-z0-9]/.test(pw)) pool += 32;
  return pool || 1;
}

function entropy(pw: string) {
  return pw.length * Math.log2(poolSize(pw));
}

function crackTime(entropyBits: number) {
  // Assume 10B guesses/sec offline attack
  const seconds = Math.pow(2, entropyBits) / 1e10;
  const units = [
    { n: 60, l: "second" },
    { n: 60, l: "minute" },
    { n: 24, l: "hour" },
    { n: 365, l: "day" },
    { n: 1000, l: "year" },
  ];
  let v = seconds;
  let label = "second";
  for (const u of units) {
    if (v < u.n) { label = u.l; break; }
    v /= u.n;
    label = u.l;
  }
  if (v > 1e9) return "> 1 billion years";
  return `${v.toFixed(1)} ${label}${v >= 2 ? "s" : ""}`;
}

export default function PasswordStrength() {
  const [pw, setPw] = useState("");
  const data = useMemo(() => {
    if (!pw) return null;
    const ent = entropy(pw);
    let label = "Very weak", color = "bg-rose-500";
    if (ent > 100) { label = "Excellent"; color = "bg-emerald-500"; }
    else if (ent > 80) { label = "Very strong"; color = "bg-emerald-500"; }
    else if (ent > 60) { label = "Strong"; color = "bg-lime-500"; }
    else if (ent > 40) { label = "Fair"; color = "bg-amber-500"; }
    else if (ent > 25) { label = "Weak"; color = "bg-orange-500"; }
    return { ent, label, color, time: crackTime(ent) };
  }, [pw]);

  return (
    <ToolShell title="Password Strength" description="Estimate password entropy and crack time (offline 10B/s)." category={categoryMap.security}>
      <Card className="space-y-3 p-4">
        <Label>Password</Label>
        <Input value={pw} onChange={(e) => setPw(e.target.value)} className="font-mono" autoFocus />
        {data && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Strength</span>
              <span className="font-medium">{data.label}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className={`h-full ${data.color}`} style={{ width: `${Math.min(100, (data.ent / 120) * 100)}%` }} />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div><div className="text-xs text-muted-foreground">Length</div><div className="text-2xl font-semibold">{pw.length}</div></div>
              <div><div className="text-xs text-muted-foreground">Entropy</div><div className="text-2xl font-semibold">{data.ent.toFixed(1)}b</div></div>
              <div><div className="text-xs text-muted-foreground">Crack time</div><div className="text-sm font-semibold">{data.time}</div></div>
            </div>
          </>
        )}
      </Card>
    </ToolShell>
  );
}
