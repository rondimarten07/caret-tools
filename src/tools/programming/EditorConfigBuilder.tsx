import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function EditorConfigBuilder() {
  const [indentStyle, setIndentStyle] = useState<"space" | "tab">("space");
  const [indentSize, setIndentSize] = useState(2);
  const [endOfLine, setEndOfLine] = useState<"lf" | "crlf" | "cr">("lf");
  const [charset, setCharset] = useState("utf-8");
  const [trimWhitespace, setTrim] = useState(true);
  const [finalNewline, setFinalNewline] = useState(true);
  const [maxLine, setMaxLine] = useState(100);

  const config = useMemo(() => {
    return `# https://editorconfig.org

root = true

[*]
indent_style = ${indentStyle}
indent_size = ${indentSize}
end_of_line = ${endOfLine}
charset = ${charset}
trim_trailing_whitespace = ${trimWhitespace}
insert_final_newline = ${finalNewline}
${maxLine ? `max_line_length = ${maxLine}\n` : ""}
[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab`;
  }, [indentStyle, indentSize, endOfLine, charset, trimWhitespace, finalNewline, maxLine]);

  return (
    <ToolShell title="EditorConfig Builder" description="Generate a .editorconfig file with sensible defaults." category={categoryMap.programming}>
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
        <div>
          <Label className="text-xs">Indent style</Label>
          <div className="mt-1 flex gap-2">
            <Button size="sm" variant={indentStyle === "space" ? "default" : "outline"} onClick={() => setIndentStyle("space")}>spaces</Button>
            <Button size="sm" variant={indentStyle === "tab" ? "default" : "outline"} onClick={() => setIndentStyle("tab")}>tabs</Button>
          </div>
        </div>
        <div>
          <Label className="text-xs">Indent size</Label>
          <Input type="number" min={1} max={8} value={indentSize} onChange={(e) => setIndentSize(Number(e.target.value) || 2)} />
        </div>
        <div>
          <Label className="text-xs">Line ending</Label>
          <div className="mt-1 flex gap-2">
            {(["lf", "crlf", "cr"] as const).map((e) => (
              <Button key={e} size="sm" variant={endOfLine === e ? "default" : "outline"} onClick={() => setEndOfLine(e)}>{e}</Button>
            ))}
          </div>
        </div>
        <div>
          <Label className="text-xs">Charset</Label>
          <Input value={charset} onChange={(e) => setCharset(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">Max line length</Label>
          <Input type="number" min={0} value={maxLine} onChange={(e) => setMaxLine(Number(e.target.value) || 0)} />
        </div>
        <div className="flex flex-col gap-2">
          <Button size="sm" variant={trimWhitespace ? "default" : "outline"} onClick={() => setTrim((v) => !v)}>Trim trailing whitespace</Button>
          <Button size="sm" variant={finalNewline ? "default" : "outline"} onClick={() => setFinalNewline((v) => !v)}>Insert final newline</Button>
        </div>
      </Card>
      <Card className="flex items-start gap-2 p-3">
        <pre className="flex-1 overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">{config}</pre>
        <CopyButton value={config} />
      </Card>
    </ToolShell>
  );
}
