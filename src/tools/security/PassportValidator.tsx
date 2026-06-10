import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Country = { code: string; name: string; pattern: RegExp; example: string };

const COUNTRIES: Country[] = [
  { code: "ID", name: "Indonesia", pattern: /^[A-Z]\d{7}$/, example: "A1234567" },
  { code: "US", name: "United States", pattern: /^\d{9}$/, example: "123456789" },
  { code: "GB", name: "United Kingdom", pattern: /^\d{9}$/, example: "123456789" },
  { code: "MY", name: "Malaysia", pattern: /^[AHK]\d{8}$/, example: "A12345678" },
  { code: "SG", name: "Singapore", pattern: /^[EK]\d{7}[A-Z]$/, example: "E1234567A" },
  { code: "AU", name: "Australia", pattern: /^[A-Z]\d{7}$/, example: "N1234567" },
  { code: "DE", name: "Germany", pattern: /^[CFGHJ-NPRTV-Z\d]{9}$/, example: "C01X00T47" },
  { code: "JP", name: "Japan", pattern: /^[A-Z]{2}\d{7}$/, example: "TK1234567" },
  { code: "FR", name: "France", pattern: /^\d{2}[A-Z]{2}\d{5}$/, example: "12AB34567" },
  { code: "CN", name: "China", pattern: /^[EG]\d{8}$/, example: "E12345678" },
];

export default function PassportValidator() {
  const [country, setCountry] = useState("ID");
  const [number, setNumber] = useState("A1234567");

  const result = useMemo(() => {
    const c = COUNTRIES.find((x) => x.code === country);
    if (!c) return null;
    const ok = c.pattern.test(number.trim().toUpperCase());
    return { country: c, ok };
  }, [country, number]);

  return (
    <ToolShell title="Passport Number Format" description="Validate the format of a passport number for common countries." category={categoryMap.security}>
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-[200px_1fr]">
        <div>
          <Label className="text-xs">Country</Label>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="h-9 w-full rounded-md border bg-background px-2 text-sm">
            {COUNTRIES.map((c) => (<option key={c.code} value={c.code}>{c.name}</option>))}
          </select>
        </div>
        <div>
          <Label className="text-xs">Passport number</Label>
          <Input value={number} onChange={(e) => setNumber(e.target.value.toUpperCase())} className="font-mono text-lg" maxLength={20} />
        </div>
      </Card>
      {result && (
        <Card className={`p-6 text-center ${result.ok ? "bg-emerald-500/10" : "bg-rose-500/10"}`}>
          <div className="text-xs uppercase text-muted-foreground">Status</div>
          <div className={`mt-1 text-3xl font-semibold ${result.ok ? "text-emerald-600" : "text-rose-600"}`}>
            {result.ok ? "✓ Valid format" : "✗ Invalid format"}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Expected format for {result.country.name}: <code className="font-mono">{result.country.example}</code>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Note: This only checks the FORMAT. It does NOT verify the passport is real or valid.
          </div>
        </Card>
      )}
    </ToolShell>
  );
}
