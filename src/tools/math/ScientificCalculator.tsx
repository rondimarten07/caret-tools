import { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const KEYS = [
  ["7", "8", "9", "/", "sin"],
  ["4", "5", "6", "*", "cos"],
  ["1", "2", "3", "-", "tan"],
  ["0", ".", "(", ")", "+"],
  ["pi", "e", "^", "sqrt", "log"],
];

function safeEval(expr: string): string {
  const cleaned = expr
    .replace(/sqrt/g, "Math.sqrt")
    .replace(/sin/g, "Math.sin")
    .replace(/cos/g, "Math.cos")
    .replace(/tan/g, "Math.tan")
    .replace(/log/g, "Math.log10")
    .replace(/ln/g, "Math.log")
    .replace(/pi/g, "Math.PI")
    .replace(/(^|[^a-zA-Z])e(?![a-zA-Z])/g, "$1Math.E")
    .replace(/\^/g, "**");
  if (!/^[\d+\-*/().,\s\w*[\].]+$/.test(cleaned)) throw new Error("Invalid input");
  // eslint-disable-next-line no-new-func
  const v = Function(`"use strict"; return (${cleaned})`)();
  return String(v);
}

export default function ScientificCalculator() {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState("");

  const push = (k: string) => setExpr((e) => e + k);
  const ac = () => { setExpr(""); setResult(""); };
  const back = () => setExpr((e) => e.slice(0, -1));
  const equals = () => {
    try { setResult(safeEval(expr || "0")); } catch (err) { setResult((err as Error).message); }
  };

  return (
    <ToolShell title="Scientific Calculator" description="Basic and scientific math operations." category={categoryMap.math}>
      <Card className="space-y-2 p-4">
        <div className="rounded-md bg-muted/30 p-3 text-right">
          <div className="font-mono text-sm text-muted-foreground">{expr || "0"}</div>
          <div className="font-mono text-3xl">{result || "—"}</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={ac}>AC</Button>
          <Button variant="outline" className="flex-1" onClick={back}>⌫</Button>
          <Button className="flex-1" onClick={equals}>=</Button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {KEYS.flat().map((k) => (
            <Button key={k} variant="secondary" onClick={() => push(k)}>{k}</Button>
          ))}
        </div>
      </Card>
    </ToolShell>
  );
}
