import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function WhitespaceCleaner() {
  const [text, setText] = useUrlState("text", "");
  const [trim, setTrim] = useState(true);
  const [collapseSpaces, setCollapseSpaces] = useState(true);
  const [collapseLines, setCollapseLines] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(false);
  const [tabs, setTabs] = useState(false);

  const output = useMemo(() => {
    let s = text;
    if (tabs) s = s.replace(/\t/g, "  ");
    if (collapseSpaces) s = s.replace(/[ \t]+/g, " ");
    if (collapseLines) s = s.replace(/\n{3,}/g, "\n\n");
    if (removeEmpty)
      s = s
        .split("\n")
        .filter((l) => l.trim() !== "")
        .join("\n");
    if (trim) s = s.split("\n").map((l) => l.trim()).join("\n").trim();
    return s;
  }, [text, trim, collapseSpaces, collapseLines, removeEmpty, tabs]);

  return (
    <ToolShell
      title="Whitespace Cleaner"
      description="Trim, collapse and tidy whitespace in any text."
      category={categoryMap.text}
      shareable
      actions={<Button variant="ghost" size="sm" onClick={() => setText("")}>Clear</Button>}
    >
      <Card className="flex flex-wrap items-center gap-2 p-3">
        {[
          { label: "Trim lines", value: trim, set: setTrim },
          { label: "Collapse spaces", value: collapseSpaces, set: setCollapseSpaces },
          { label: "Collapse blank lines", value: collapseLines, set: setCollapseLines },
          { label: "Remove empty lines", value: removeEmpty, set: setRemoveEmpty },
          { label: "Tabs → 2 spaces", value: tabs, set: setTabs },
        ].map((o) => (
          <Button key={o.label} size="sm" variant={o.value ? "default" : "outline"} onClick={() => o.set(!o.value)}>
            {o.label}
          </Button>
        ))}
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Input</Label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[320px]" />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>Cleaned</Label>
            <CopyButton value={output} />
          </div>
          <Textarea readOnly value={output} className="min-h-[320px] bg-muted/30" />
        </Card>
      </div>
    </ToolShell>
  );
}
