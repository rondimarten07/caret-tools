import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const HELPERS = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sqrt: Math.sqrt,
  log: Math.log10,
  ln: Math.log,
  exp: Math.exp,
  abs: Math.abs,
  round: Math.round,
  floor: Math.floor,
  ceil: Math.ceil,
  min: Math.min,
  max: Math.max,
  pow: Math.pow,
  pi: Math.PI,
  e: Math.E,
  tau: Math.PI * 2,
} as const;

function safeEval(expr: string): number {
  // Strict whitelist: digits, operators, decimal, parens, comma, whitespace, identifiers (a-z)
  if (!/^[\d+\-*/().,\s\w^%]+$/.test(expr)) throw new Error("Invalid characters in expression");
  const cleaned = expr.replace(/\^/g, "**").replace(/\bmod\b/g, "%");
  const params = Object.keys(HELPERS).join(", ");
  const fnBody = `"use strict"; return (${cleaned});`;
  // eslint-disable-next-line no-new-func
  const fn = new Function(params, fnBody);
  const v = fn(...Object.values(HELPERS));
  if (typeof v !== "number" || !Number.isFinite(v)) throw new Error("Not a finite number");
  return v;
}

const SAMPLES = [
  "(2 + 3) * 4",
  "sqrt(2)^2",
  "sin(pi/6) * 2",
  "log(1000)",
  "pow(2, 10)",
];

export default function MathEval() {
  const [exprs, setExprs] = useUrlState("expr", "(2 + 3) * 4\nsqrt(2)^2\nsin(pi/6) * 2\nlog(1000)\npow(2, 10)");

  const lines = useMemo(() => {
    return exprs.split(/\r?\n/).map((line) => {
      const t = line.trim();
      if (!t || t.startsWith("#")) return { expr: line, result: "", err: false };
      try {
        const v = safeEval(t);
        return { expr: line, result: String(v), err: false };
      } catch (e) {
        return { expr: line, result: (e as Error).message, err: true };
      }
    });
  }, [exprs]);

  const output = lines.map((l) => `${l.expr.padEnd(24)} = ${l.result}`).join("\n");

  return (
    <ToolShell title="Math Expression" description="Evaluate math expressions line by line. Supports sin, cos, sqrt, log, ln, pow, pi, e, tau, mod." category={categoryMap.math}
      shareable>
      <Card className="space-y-2 p-3">
        <Label className="text-xs">Expressions (one per line)</Label>
        <Textarea value={exprs} onChange={(e) => setExprs(e.target.value)} className="min-h-[180px] font-mono text-sm" spellCheck={false} />
        <div className="flex flex-wrap gap-1.5">
          {SAMPLES.map((s) => (
            <button key={s} onClick={() => setExprs((p) => p + "\n" + s)} className="rounded-md border bg-card px-2 py-1 font-mono text-xs hover:border-primary/40">
              {s}
            </button>
          ))}
        </div>
      </Card>
      <Card className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <Label>Results</Label>
          <CopyButton value={output} />
        </div>
        <div className="space-y-1 font-mono text-sm">
          {lines.map((l, i) => (
            <div key={i} className="flex items-center gap-3 rounded-md bg-muted/30 px-3 py-1.5">
              <span className="flex-1 truncate">{l.expr || <span className="text-muted-foreground">(empty)</span>}</span>
              <span className="text-muted-foreground">=</span>
              <span className={l.err ? "text-destructive" : "font-semibold"}>{l.result || "—"}</span>
            </div>
          ))}
        </div>
      </Card>
    </ToolShell>
  );
}
