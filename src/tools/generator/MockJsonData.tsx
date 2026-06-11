import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const NAMES = ["Alex","Min","Sara","Rio","Lin","Diego","Kai","Mei","Sam","Eli","Noah","Yui","Aki","Theo","Maya","Leo","Aria","Ivan","Zoe","Reza"];
const SURN = ["Tan","Park","Suzuki","Lopez","Patel","Brown","Khan","Singh","Lee","Cho","Adi","Putra","Wong","Mehta","Ali","Wright"];
const DOMAINS = ["example.com","acme.test","mail.dev","site.io"];
const CITIES = ["Jakarta","Singapore","Tokyo","Seoul","Bangkok","Manila","Bandung","Mumbai","Sydney","Berlin","Paris","London","NYC","SF","Toronto"];
const ROLES = ["Designer","Engineer","PM","Marketer","Founder","Writer","Researcher","Analyst"];

function pick<T>(a: T[]) { return a[Math.floor(Math.random() * a.length)]; }
function int(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function genValue(spec: string): unknown {
  switch (spec.toLowerCase()) {
    case "id": return crypto.randomUUID();
    case "int": return int(1, 1000);
    case "bool": return Math.random() < 0.5;
    case "name": return `${pick(NAMES)} ${pick(SURN)}`;
    case "first": return pick(NAMES);
    case "last": return pick(SURN);
    case "email": return `${pick(NAMES).toLowerCase()}.${pick(SURN).toLowerCase()}@${pick(DOMAINS)}`;
    case "city": return pick(CITIES);
    case "role": return pick(ROLES);
    case "age": return int(18, 70);
    case "price": return Number((Math.random() * 1000).toFixed(2));
    case "date": {
      const d = new Date(Date.now() - Math.random() * 86400000 * 365);
      return d.toISOString().slice(0, 10);
    }
    case "iso": return new Date(Date.now() - Math.random() * 86400000 * 365).toISOString();
    default: return spec;
  }
}

export default function MockJsonData() {
  const [schema, setSchema] = useUrlState("s", `{\n  "id": "id",\n  "name": "name",\n  "email": "email",\n  "city": "city",\n  "age": "age"\n}`);
  const [count, setCount] = useState(10);

  const out = useMemo(() => {
    try {
      const spec = JSON.parse(schema) as Record<string, string>;
      const rows: unknown[] = [];
      for (let i = 0; i < count; i++) {
        const row: Record<string, unknown> = {};
        for (const [key, type] of Object.entries(spec)) row[key] = genValue(type);
        rows.push(row);
      }
      return JSON.stringify(rows, null, 2);
    } catch (e) {
      return `// ${(e as Error).message}`;
    }
  }, [schema, count]);

  return (
    <ToolShell title="Mock JSON Data" description="Tiny schema → fake JSON rows. Useful for UI fixtures." category={categoryMap.generator} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-[1fr_140px]">
        <div>
          <Label>Schema (key → type)</Label>
          <Textarea value={schema} onChange={(e) => setSchema(e.target.value)} rows={8} className="font-mono" spellCheck={false} />
        </div>
        <div>
          <Label>Count</Label>
          <input type="number" value={count} min={1} max={500} onChange={(e) => setCount(Math.max(1, Math.min(500, Number(e.target.value) || 1)))} className="mt-1 block w-full rounded-md border bg-background px-3 py-1.5 text-sm" />
          <div className="mt-3 text-xs text-muted-foreground">
            Types: id · int · bool · name · first · last · email · city · role · age · price · date · iso
          </div>
        </div>
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>JSON</Label><CopyButton value={out} /></div>
        <pre className="max-h-96 overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{out}</pre>
      </Card>
    </ToolShell>
  );
}
