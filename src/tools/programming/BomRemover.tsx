import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const BOM_UTF8 = "﻿";

export default function BomRemover() {
  const [text, setText] = useUrlState("t", "﻿Hello, World");

  const data = useMemo(() => {
    const hasBom = text.startsWith(BOM_UTF8);
    const stripped = text.replace(/^﻿/, "").replace(/﻿/g, "");
    const innerBoms = (text.match(/﻿/g) || []).length - (hasBom ? 1 : 0);
    return { hasBom, innerBoms, stripped };
  }, [text]);

  return (
    <ToolShell title="UTF-8 BOM Remover" description="Detect and strip the UTF-8 byte-order mark (U+FEFF) from text." category={categoryMap.programming} shareable>
      <Card className="space-y-3 p-4">
        <Label>Input</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className="font-mono" spellCheck={false} />
        <div className="flex gap-4 text-xs">
          <span className={data.hasBom ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}>
            Leading BOM: {data.hasBom ? "yes" : "no"}
          </span>
          <span className={data.innerBoms > 0 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}>
            Inner U+FEFF: {data.innerBoms}
          </span>
        </div>
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>Stripped</Label><CopyButton value={data.stripped} /></div>
        <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-sm font-mono">{data.stripped}</pre>
      </Card>
    </ToolShell>
  );
}
