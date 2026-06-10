import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const CARRIERS: { prefixes: string[]; name: string }[] = [
  { name: "Telkomsel", prefixes: ["811", "812", "813", "821", "822", "823", "851", "852", "853"] },
  { name: "Indosat Ooredoo", prefixes: ["814", "815", "816", "855", "856", "857", "858"] },
  { name: "XL Axiata", prefixes: ["817", "818", "819", "859", "877", "878"] },
  { name: "Tri (3)", prefixes: ["895", "896", "897", "898", "899"] },
  { name: "Smartfren", prefixes: ["881", "882", "883", "884", "885", "886", "887", "888", "889"] },
  { name: "AXIS", prefixes: ["831", "832", "833", "838"] },
  { name: "By.U (Telkomsel)", prefixes: ["851"] },
];

function normalize(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (!digits) return null;
  // Convert leading 0 or +62 to standardized 62 form
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  return null;
}

export default function IdPhoneValidator() {
  const [input, setInput] = useState("0812-3456-7890");

  const result = useMemo(() => {
    const norm = normalize(input);
    if (!norm) return { ok: false as const, error: "Number must start with 0 or +62 (Indonesia)." };
    // Expected total: 62 + (2-3 digit prefix) + 6-9 digit subscriber → 10-13 digits after country code total
    if (norm.length < 11 || norm.length > 14) return { ok: false as const, error: `Length looks off: ${norm.length - 2} digits after country code (typical 8-12).` };

    const local = norm.slice(2); // strip 62
    const prefix3 = local.slice(0, 3);
    const prefix2 = local.slice(0, 2);

    const isMobile = local.startsWith("8");
    let carrier = "Unknown";
    if (isMobile) {
      const found = CARRIERS.find((c) => c.prefixes.includes(prefix3));
      if (found) carrier = found.name;
    } else if (prefix2 === "21") carrier = "Landline · Jakarta";
    else if (prefix2 === "22") carrier = "Landline · Bandung";
    else if (prefix2 === "24") carrier = "Landline · Semarang";
    else if (prefix2 === "31") carrier = "Landline · Surabaya";
    else if (prefix2 === "61") carrier = "Landline · Medan";
    else if (prefix2 === "11" || prefix2 == "12") carrier = "Special / Premium";

    return {
      ok: true as const,
      isMobile,
      carrier,
      e164: "+" + norm,
      local: "0" + local,
      international: "0062" + local,
    };
  }, [input]);

  return (
    <ToolShell title="ID Phone Validator" description="Validate Indonesian phone numbers and identify the carrier." category={categoryMap.security}>
      <Card className="p-3">
        <Label className="mb-1 block">Phone number</Label>
        <Input value={input} onChange={(e) => setInput(e.target.value)} className="font-mono text-lg" />
      </Card>
      {result.ok ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Card className="p-4 bg-emerald-500/10"><div className="text-xs uppercase text-muted-foreground">Status</div><div className="mt-1 text-2xl font-semibold text-emerald-600">✓ Valid format</div></Card>
          <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Type</div><div className="mt-1 text-lg font-semibold">{result.isMobile ? "Mobile" : "Landline / Other"}</div></Card>
          <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Carrier</div><div className="mt-1 text-lg font-semibold">{result.carrier}</div></Card>
          <Card className="p-4 space-y-1"><div className="text-xs uppercase text-muted-foreground">Formats</div>
            <code className="block font-mono text-xs">E.164: {result.e164}</code>
            <code className="block font-mono text-xs">Local: {result.local}</code>
            <code className="block font-mono text-xs">Intl 00: {result.international}</code>
          </Card>
        </div>
      ) : (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{result.error}</div>
      )}
    </ToolShell>
  );
}
