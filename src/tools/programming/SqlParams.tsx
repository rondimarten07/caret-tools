import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Style = "qmark" | "dollar" | "colon" | "at";

function detect(sql: string): Style | "mixed" | "none" {
  const hits: Style[] = [];
  if (/\?/.test(sql)) hits.push("qmark");
  if (/\$\d+/.test(sql)) hits.push("dollar");
  if (/:[a-zA-Z_]\w*/.test(sql)) hits.push("colon");
  if (/@[a-zA-Z_]\w*/.test(sql)) hits.push("at");
  if (hits.length === 0) return "none";
  if (hits.length > 1) return "mixed";
  return hits[0];
}

function convert(sql: string, from: Style, to: Style, names: string[]): string {
  const tokens = collect(sql, from);
  return rewrite(sql, from, to, tokens, names);
}

function collect(sql: string, style: Style): string[] {
  const result: string[] = [];
  if (style === "qmark") {
    const m = sql.match(/\?/g) || [];
    m.forEach((_v, i) => result.push(`p${i + 1}`));
  } else if (style === "dollar") {
    const m = sql.match(/\$(\d+)/g) || [];
    m.forEach((s) => result.push(`p${s.slice(1)}`));
  } else if (style === "colon") {
    const m = sql.match(/:([a-zA-Z_]\w*)/g) || [];
    m.forEach((s) => result.push(s.slice(1)));
  } else {
    const m = sql.match(/@([a-zA-Z_]\w*)/g) || [];
    m.forEach((s) => result.push(s.slice(1)));
  }
  return result;
}

function rewrite(sql: string, from: Style, to: Style, names: string[], userNames: string[]): string {
  let i = 0;
  const naming = (idx: number) => userNames[idx] || names[idx] || `p${idx + 1}`;
  if (from === "qmark") {
    return sql.replace(/\?/g, () => {
      const name = naming(i++);
      return to === "qmark" ? "?" : to === "dollar" ? `$${i}` : to === "colon" ? `:${name}` : `@${name}`;
    });
  }
  if (from === "dollar") {
    return sql.replace(/\$(\d+)/g, (_s, n) => {
      const idx = Number(n) - 1;
      const name = naming(idx);
      return to === "qmark" ? "?" : to === "dollar" ? `$${idx + 1}` : to === "colon" ? `:${name}` : `@${name}`;
    });
  }
  if (from === "colon") {
    return sql.replace(/:([a-zA-Z_]\w*)/g, (_s, n) => {
      i++;
      return to === "qmark" ? "?" : to === "dollar" ? `$${i}` : to === "colon" ? `:${n}` : `@${n}`;
    });
  }
  return sql.replace(/@([a-zA-Z_]\w*)/g, (_s, n) => {
    i++;
    return to === "qmark" ? "?" : to === "dollar" ? `$${i}` : to === "colon" ? `:${n}` : `@${n}`;
  });
}

export default function SqlParams() {
  const [sql, setSql] = useUrlState("s", `SELECT * FROM users WHERE id = $1 AND status = $2;`);
  const [to, setTo] = useState<Style>("colon");

  const detected = useMemo(() => detect(sql), [sql]);
  const result = useMemo(() => {
    if (detected === "none" || detected === "mixed") return null;
    return convert(sql, detected, to, []);
  }, [sql, to, detected]);

  return (
    <ToolShell title="SQL Param Style" description="Swap between ?, $1, :name and @name placeholders." category={categoryMap.programming} shareable>
      <Card className="space-y-3 p-4">
        <Label>SQL</Label>
        <Textarea value={sql} onChange={(e) => setSql(e.target.value)} rows={6} className="font-mono" spellCheck={false} />
        <div className="text-xs text-muted-foreground">Detected style: <span className="font-mono">{detected}</span></div>
      </Card>
      <Card className="flex flex-wrap gap-2 p-3">
        {(["qmark", "dollar", "colon", "at"] as Style[]).map((s) => (
          <button key={s} onClick={() => setTo(s)} className={`rounded-md border px-3 py-1.5 text-sm ${to === s ? "bg-primary text-primary-foreground" : "bg-card"}`}>
            {s === "qmark" ? "? (MySQL, JDBC)" : s === "dollar" ? "$1 (Postgres)" : s === "colon" ? ":name (Oracle, named)" : "@name (SQL Server)"}
          </button>
        ))}
      </Card>
      <Card className="space-y-3 p-4">
        {result ? (
          <>
            <div className="flex items-center justify-between"><Label>Output</Label><CopyButton value={result} /></div>
            <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{result}</pre>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{detected === "mixed" ? "Mixed styles detected — pick one." : "No parameters detected."}</p>
        )}
      </Card>
    </ToolShell>
  );
}
