import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function checkIsbn10(s: string): { valid: boolean; computed?: string } {
  if (!/^\d{9}[\dXx]$/.test(s)) return { valid: false };
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += (i + 1) * Number(s[i]);
  const check = sum % 11;
  const expected = check === 10 ? "X" : String(check);
  return { valid: expected === s[9].toUpperCase(), computed: expected };
}

function checkIsbn13(s: string): { valid: boolean; computed?: string } {
  if (!/^\d{13}$/.test(s)) return { valid: false };
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += (i % 2 === 0 ? 1 : 3) * Number(s[i]);
  const expected = String((10 - (sum % 10)) % 10);
  return { valid: expected === s[12], computed: expected };
}

export default function IsbnValidator() {
  const [input, setInput] = useState("978-3-16-148410-0");

  const result = useMemo(() => {
    const cleaned = input.replace(/[\s-]/g, "");
    if (cleaned.length === 10) {
      const r = checkIsbn10(cleaned);
      return { type: "ISBN-10" as const, cleaned, ...r };
    }
    if (cleaned.length === 13) {
      const r = checkIsbn13(cleaned);
      return { type: "ISBN-13" as const, cleaned, ...r };
    }
    return { type: null as null, cleaned, valid: false };
  }, [input]);

  return (
    <ToolShell title="ISBN Validator" description="Validate ISBN-10 and ISBN-13 book numbers using the standard check digit." category={categoryMap.security}>
      <Card className="p-3">
        <Label className="mb-1 block">ISBN (with or without hyphens)</Label>
        <Input value={input} onChange={(e) => setInput(e.target.value)} className="font-mono text-lg" />
        <div className="mt-2 text-xs text-muted-foreground">
          Stripped: <code className="font-mono">{result.cleaned}</code> · length {result.cleaned.length}
        </div>
      </Card>
      <Card className={`p-6 text-center ${result.type ? (result.valid ? "bg-emerald-500/10" : "bg-rose-500/10") : "bg-muted/30"}`}>
        {result.type === null ? (
          <div className="text-muted-foreground">Expected 10 or 13 digits (or X check for ISBN-10).</div>
        ) : (
          <>
            <div className="text-xs uppercase text-muted-foreground">{result.type}</div>
            <div className={`mt-1 text-3xl font-semibold ${result.valid ? "text-emerald-600" : "text-rose-600"}`}>
              {result.valid ? "✓ Valid" : "✗ Invalid"}
            </div>
            {!result.valid && result.computed && (
              <div className="mt-2 text-sm text-muted-foreground">
                Expected check digit: <code className="font-mono">{result.computed}</code>
              </div>
            )}
          </>
        )}
      </Card>
    </ToolShell>
  );
}
