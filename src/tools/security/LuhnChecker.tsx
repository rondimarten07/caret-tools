import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const ISSUERS: { name: string; pattern: RegExp }[] = [
  { name: "Visa", pattern: /^4\d{12}(\d{3})?$/ },
  { name: "Mastercard", pattern: /^(5[1-5]\d{14}|2(2[2-9]\d{12}|[3-6]\d{13}|7[01]\d{12}|720\d{12}))$/ },
  { name: "American Express", pattern: /^3[47]\d{13}$/ },
  { name: "Discover", pattern: /^6(011|5\d{2}|4[4-9]\d|22[1-9]|2[3-9]\d|[3-9]\d{2})\d{12}$/ },
  { name: "JCB", pattern: /^35(2[89]|[3-8]\d)\d{12}$/ },
];

function luhn(digits: string): boolean {
  if (!/^\d+$/.test(digits)) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export default function LuhnChecker() {
  const [card, setCard] = useUrlState("n", "4111 1111 1111 1111");

  const result = useMemo(() => {
    const digits = card.replace(/\D/g, "");
    if (!digits) return null;
    return {
      digits,
      valid: luhn(digits),
      issuer: ISSUERS.find((i) => i.pattern.test(digits))?.name ?? "Unknown",
    };
  }, [card]);

  return (
    <ToolShell title="Luhn / Credit Card Validator" description="Verify card number with the Luhn checksum + guess issuer." category={categoryMap.security}
      shareable>
      <Card className="p-3">
        <Label className="mb-1 block">Card number</Label>
        <Input value={card} onChange={(e) => setCard(e.target.value)} className="font-mono text-lg" />
      </Card>
      {result && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Card className={`p-6 ${result.valid ? "bg-emerald-500/10" : "bg-rose-500/10"}`}>
            <Label className="text-xs uppercase text-muted-foreground">Status</Label>
            <div className={`mt-1 text-3xl font-semibold ${result.valid ? "text-emerald-600" : "text-rose-600"}`}>
              {result.valid ? "✓ Valid" : "✗ Invalid"}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{result.digits.length} digits</div>
          </Card>
          <Card className="p-6">
            <Label className="text-xs uppercase text-muted-foreground">Issuer</Label>
            <div className="mt-1 text-3xl font-semibold">{result.issuer}</div>
          </Card>
        </div>
      )}
    </ToolShell>
  );
}
