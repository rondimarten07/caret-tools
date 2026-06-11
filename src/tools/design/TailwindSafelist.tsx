import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const SAMPLE = `bg-red-500
text-blue-600
hover:bg-blue-700
md:grid-cols-3
dark:text-zinc-100`;

export default function TailwindSafelist() {
  const [input, setInput] = useUrlState("text", SAMPLE);

  const config = useMemo(() => {
    const classes = Array.from(new Set(input.split(/[\s\n]+/).filter((c) => c.trim()))).sort();
    return `// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,html}"],
  safelist: [
${classes.map((c) => `    "${c}",`).join("\n")}
  ],
  theme: { extend: {} },
  plugins: [],
};

export default config;`;
  }, [input]);

  return (
    <ToolShell title="Tailwind Safelist" description="Generate a Tailwind config snippet with a safelist of classes that won't be purged." category={categoryMap.design} shareable>
      <Card className="p-3">
        <Label className="mb-2 block">Classes (whitespace-separated or per line)</Label>
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[160px] font-mono text-xs" />
      </Card>
      <Card className="flex items-start gap-2 p-3">
        <pre className="flex-1 overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">{config}</pre>
        <CopyButton value={config} />
      </Card>
    </ToolShell>
  );
}
