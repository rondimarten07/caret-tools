import { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const PAIRINGS: { heading: string; body: string; mood: string }[] = [
  { heading: "Playfair Display", body: "Source Sans 3", mood: "Editorial / magazine" },
  { heading: "Fraunces", body: "Inter", mood: "Modern serif + neutral sans" },
  { heading: "Space Grotesk", body: "Inter", mood: "Tech / startup" },
  { heading: "DM Serif Display", body: "DM Sans", mood: "Refined contemporary" },
  { heading: "Bricolage Grotesque", body: "Inter", mood: "Editorial + clean" },
  { heading: "Manrope", body: "Manrope", mood: "Single-family minimalism" },
  { heading: "Geist", body: "Geist Mono", mood: "Developer-tooling SaaS" },
  { heading: "Instrument Serif", body: "Instrument Sans", mood: "Elegant matched family" },
  { heading: "Recoleta", body: "Inter", mood: "Warm sales / product page" },
  { heading: "Archivo", body: "Inter", mood: "Punchy startup, lots of weights" },
  { heading: "Lora", body: "Open Sans", mood: "Long-form reading" },
  { heading: "EB Garamond", body: "Lato", mood: "Classical book-style" },
];

function fontLink(name: string): string {
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name).replace(/%20/g, "+")}:wght@400;600;700&display=swap`;
}

export default function TypographyPairing() {
  const [pick, setPick] = useState(PAIRINGS[0]);

  const css = `@import url('${fontLink(pick.heading)}');
@import url('${fontLink(pick.body)}');

h1, h2, h3 { font-family: "${pick.heading}", serif; }
body       { font-family: "${pick.body}", system-ui, sans-serif; }`;

  return (
    <ToolShell title="Typography Pairings" description="Curated Google Fonts pairings for headings + body." category={categoryMap.design}>
      <link rel="stylesheet" href={fontLink(pick.heading)} />
      <link rel="stylesheet" href={fontLink(pick.body)} />
      <Card className="flex flex-wrap gap-2 p-3">
        {PAIRINGS.map((p, i) => (
          <button key={i} onClick={() => setPick(p)} className={`rounded-md border px-3 py-1.5 text-xs ${pick === p ? "bg-primary text-primary-foreground" : "bg-card"}`}>{p.heading} + {p.body}</button>
        ))}
      </Card>
      <Card className="space-y-4 p-6">
        <h1 style={{ fontFamily: `"${pick.heading}", serif`, fontSize: "2.5rem", lineHeight: 1.1, fontWeight: 700 }}>
          The quick brown fox jumps over the lazy dog.
        </h1>
        <h2 style={{ fontFamily: `"${pick.heading}", serif`, fontSize: "1.5rem", lineHeight: 1.2, fontWeight: 600 }}>
          {pick.mood}
        </h2>
        <p style={{ fontFamily: `"${pick.body}", sans-serif`, fontSize: "1rem", lineHeight: 1.6, color: "var(--tw-prose-body, currentColor)" }}>
          This is body copy in {pick.body}. It should read comfortably at typical paragraph sizes — neither too cramped nor too airy. Compare hierarchy between heading and body: contrast in weight, x-height and feel.
        </p>
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex justify-end"><CopyButton value={css} /></div>
        <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{css}</pre>
      </Card>
    </ToolShell>
  );
}
