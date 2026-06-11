import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function strip(s: string): string {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

export default function DiacriticStrip() {
  const [input, setInput] = useUrlState("text", "Café résumé naïve façade São Paulo Düsseldorf");
  const output = useMemo(() => strip(input), [input]);

  return (
    <ToolShell title="Strip Diacritics" description="Remove accents and diacritics. Useful for ASCII slugs, search keys, sortable names." category={categoryMap.text} shareable>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Input</Label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[260px]" />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>Stripped</Label>
            <CopyButton value={output} />
          </div>
          <Textarea readOnly value={output} className="min-h-[260px] bg-muted/30" />
        </Card>
      </div>
    </ToolShell>
  );
}
