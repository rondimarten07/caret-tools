import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const SAMPLE = `#header .nav li a.active
.btn.primary
a:hover
div p
*`;

type Score = { a: number; b: number; c: number; total: number };

/**
 * MDN-style: (a, b, c) = (ID count, class+attr+pseudo-class count, type+pseudo-element count)
 * Universal/* and combinators don't count.
 */
function specificity(selector: string): Score {
  // Strip strings/comments
  const s = selector.replace(/\/\*[\s\S]*?\*\//g, "").trim();
  let a = 0, b = 0, c = 0;

  // IDs
  a += (s.match(/#[\w-]+/g) ?? []).length;
  // Classes, attribute selectors, pseudo-classes (excluding pseudo-elements)
  b += (s.match(/\.[\w-]+/g) ?? []).length;
  b += (s.match(/\[[^\]]+\]/g) ?? []).length;
  b += (s.match(/:(?!:)(?!not\b)[a-z-]+(?:\([^)]*\))?/g) ?? []).length;
  // Pseudo-elements (::after, ::before)
  c += (s.match(/::[a-z-]+/g) ?? []).length;
  // Type selectors (element names) — anything not preceded by ., #, :, [
  const stripped = s.replace(/\[[^\]]+\]/g, "").replace(/::[a-z-]+/g, "").replace(/:[a-z-]+(?:\([^)]*\))?/g, "").replace(/\.[\w-]+/g, "").replace(/#[\w-]+/g, "");
  const types = stripped.match(/\b[a-zA-Z][a-zA-Z0-9-]*\b/g) ?? [];
  c += types.length;

  return { a, b, c, total: a * 100 + b * 10 + c };
}

export default function CssSpecificity() {
  const [input, setInput] = useUrlState("text", SAMPLE);

  const results = useMemo(() => {
    return input.split(/\r?\n/).filter((l) => l.trim()).map((sel) => ({ sel, score: specificity(sel) }));
  }, [input]);

  return (
    <ToolShell title="CSS Specificity Calculator" description="Compute (a, b, c) specificity for CSS selectors. Higher wins the cascade." category={categoryMap.programming} shareable>
      <Card className="p-3">
        <Label className="mb-2 block">Selectors (one per line)</Label>
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[160px] font-mono text-xs" />
      </Card>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Selector</th>
              <th className="p-3 text-center">a (IDs)</th>
              <th className="p-3 text-center">b (classes/attrs/:pseudo)</th>
              <th className="p-3 text-center">c (types/::pseudo)</th>
              <th className="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {[...results].sort((x, y) => y.score.total - x.score.total).map((r, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="p-3 font-mono text-xs">{r.sel}</td>
                <td className="p-3 text-center font-mono">{r.score.a}</td>
                <td className="p-3 text-center font-mono">{r.score.b}</td>
                <td className="p-3 text-center font-mono">{r.score.c}</td>
                <td className="p-3 text-right font-mono font-semibold">{r.score.a},{r.score.b},{r.score.c} <span className="ml-2 text-muted-foreground">({r.score.total})</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </ToolShell>
  );
}
