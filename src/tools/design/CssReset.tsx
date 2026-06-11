import { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const RESETS: Record<string, string> = {
  "Minimal (Andy Bell)": `*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
html, body { height: 100%; }
body { line-height: 1.5; -webkit-font-smoothing: antialiased; }
img, picture, video, canvas, svg { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; }
p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }
#root, #__next { isolation: isolate; }`,
  "Modern (Josh Comeau)": `*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
html, body { height: 100%; }
body { line-height: 1.5; -webkit-font-smoothing: antialiased; }
img, picture, video, canvas, svg { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; }
p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }
#root, #__next { isolation: isolate; }
html { color-scheme: dark light; }`,
  "Eric Meyer (classic)": `html, body, div, span, h1, h2, h3, h4, h5, h6, p, a, img, ul, ol, li,
form, label, table, tr, td, th {
  margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline;
}
body { line-height: 1; }
ol, ul { list-style: none; }`,
  "Tailwind Preflight (excerpt)": `*, ::before, ::after { box-sizing: border-box; border-width: 0; border-style: solid; border-color: currentColor; }
html { line-height: 1.5; -webkit-text-size-adjust: 100%; tab-size: 4; font-family: ui-sans-serif, system-ui, sans-serif; }
body { margin: 0; line-height: inherit; }
hr { height: 0; color: inherit; border-top-width: 1px; }
abbr:where([title]) { text-decoration: underline dotted; }
h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
a { color: inherit; text-decoration: inherit; }
b, strong { font-weight: bolder; }`,
};

export default function CssReset() {
  const [pick, setPick] = useState<keyof typeof RESETS>("Minimal (Andy Bell)");

  return (
    <ToolShell title="CSS Reset" description="Modern, minimal CSS resets — pick & copy." category={categoryMap.design}>
      <Card className="flex flex-wrap gap-2 p-3">
        {Object.keys(RESETS).map((k) => (
          <button key={k} onClick={() => setPick(k)} className={`rounded-md border px-3 py-1.5 text-sm ${pick === k ? "bg-primary text-primary-foreground" : "bg-card"}`}>{k}</button>
        ))}
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex justify-end"><CopyButton value={RESETS[pick]} /></div>
        <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{RESETS[pick]}</pre>
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Modern resets are tiny (≈20 lines) and opinionated. Drop one near the top of your global stylesheet — before your own utilities.
      </div>
    </ToolShell>
  );
}
