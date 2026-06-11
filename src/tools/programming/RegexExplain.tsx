import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Token = { text: string; kind: string; desc: string };

function tokenize(re: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < re.length) {
    const ch = re[i];
    if (ch === "\\") {
      const esc = re[i + 1] || "";
      const map: Record<string, string> = {
        d: "Digit [0-9]", D: "Non-digit", w: "Word char [A-Za-z0-9_]", W: "Non-word",
        s: "Whitespace", S: "Non-whitespace", b: "Word boundary", B: "Non-word boundary",
        n: "Newline (LF)", t: "Tab", r: "Carriage return", "0": "Null character",
        ".": "Literal .", "/": "Literal /", "\\": "Literal backslash",
      };
      tokens.push({ text: "\\" + esc, kind: "escape", desc: map[esc] || `Literal "${esc}"` });
      i += 2;
      continue;
    }
    if (ch === "[") {
      const end = re.indexOf("]", i + 1);
      const span = re.slice(i, end + 1);
      tokens.push({ text: span, kind: "class", desc: span.startsWith("[^") ? "Negated character class" : "Character class" });
      i = end + 1; continue;
    }
    if (ch === "(") {
      const peek = re.slice(i, i + 3);
      if (peek === "(?:") { tokens.push({ text: "(?:", kind: "group", desc: "Non-capturing group" }); i += 3; }
      else if (peek === "(?=") { tokens.push({ text: "(?=", kind: "group", desc: "Positive lookahead" }); i += 3; }
      else if (peek === "(?!") { tokens.push({ text: "(?!", kind: "group", desc: "Negative lookahead" }); i += 3; }
      else if (re.slice(i, i + 4) === "(?<=") { tokens.push({ text: "(?<=", kind: "group", desc: "Positive lookbehind" }); i += 4; }
      else if (re.slice(i, i + 4) === "(?<!") { tokens.push({ text: "(?<!", kind: "group", desc: "Negative lookbehind" }); i += 4; }
      else { tokens.push({ text: "(", kind: "group", desc: "Capturing group" }); i++; }
      continue;
    }
    if ("*+?".includes(ch)) {
      const lazy = re[i + 1] === "?";
      tokens.push({ text: ch + (lazy ? "?" : ""), kind: "quant", desc: ch === "*" ? "Zero or more" : ch === "+" ? "One or more" : "Optional (0 or 1)" + (lazy ? ", lazy" : "") });
      i += lazy ? 2 : 1; continue;
    }
    if (ch === "{") {
      const end = re.indexOf("}", i);
      tokens.push({ text: re.slice(i, end + 1), kind: "quant", desc: "Specific quantifier" });
      i = end + 1; continue;
    }
    if (ch === "|") { tokens.push({ text: "|", kind: "alt", desc: "Alternation (OR)" }); i++; continue; }
    if (ch === ".") { tokens.push({ text: ".", kind: "any", desc: "Any character (except newline)" }); i++; continue; }
    if (ch === "^") { tokens.push({ text: "^", kind: "anchor", desc: "Start of line/string" }); i++; continue; }
    if (ch === "$") { tokens.push({ text: "$", kind: "anchor", desc: "End of line/string" }); i++; continue; }
    if (ch === ")") { tokens.push({ text: ")", kind: "group", desc: "Close group" }); i++; continue; }
    tokens.push({ text: ch, kind: "literal", desc: `Literal "${ch}"` });
    i++;
  }
  return tokens;
}

const COLORS: Record<string, string> = {
  escape: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  class: "bg-purple-500/15 text-purple-700 dark:text-purple-300",
  group: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  quant: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  alt: "bg-pink-500/15 text-pink-700 dark:text-pink-300",
  any: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
  anchor: "bg-red-500/15 text-red-700 dark:text-red-300",
  literal: "bg-muted text-foreground",
};

export default function RegexExplain() {
  const [re, setRe] = useUrlState("r", "^[A-Z][a-z]+\\d{2,4}$");
  const tokens = useMemo(() => tokenize(re), [re]);

  return (
    <ToolShell title="Regex Explainer" description="Break a regex into labeled tokens — anchors, classes, quantifiers." category={categoryMap.programming} shareable>
      <Card className="space-y-3 p-4">
        <Label>Regex</Label>
        <Input value={re} onChange={(e) => setRe(e.target.value)} className="font-mono" />
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex flex-wrap gap-1 rounded-md bg-muted/30 p-3 font-mono text-lg">
          {tokens.map((t, i) => (
            <span key={i} className={`rounded px-1 ${COLORS[t.kind] || "bg-muted"}`} title={t.desc}>{t.text}</span>
          ))}
        </div>
        <ul className="space-y-1 text-sm">
          {tokens.map((t, i) => (
            <li key={i} className="flex items-baseline gap-3">
              <code className={`rounded px-1.5 py-0.5 font-mono text-xs ${COLORS[t.kind] || ""}`}>{t.text}</code>
              <span className="text-muted-foreground">{t.desc}</span>
            </li>
          ))}
        </ul>
      </Card>
    </ToolShell>
  );
}
