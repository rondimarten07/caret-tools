import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const SAMPLE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M5 14L12 7l7 7" stroke="currentColor"/></svg>`;

const TO_CAMEL = [
  "stroke-width", "stroke-linecap", "stroke-linejoin", "stroke-opacity",
  "fill-opacity", "fill-rule", "clip-path", "clip-rule",
  "stop-color", "stop-opacity", "text-anchor", "font-family",
  "font-size", "font-weight", "font-style", "letter-spacing",
];

function kebabToCamel(s: string): string {
  return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function transform(svg: string, name: string): string {
  let out = svg.trim();
  // Replace kebab-case attrs with camelCase
  for (const attr of TO_CAMEL) {
    out = out.replace(new RegExp(`\\b${attr}=`, "g"), `${kebabToCamel(attr)}=`);
  }
  // class → className
  out = out.replace(/\bclass=/g, "className=");
  // Remove xmlns (React doesn't need it on the inner svg)
  // Actually keep it — required for download/serialize.
  // Indent two spaces inside component
  const indented = out.split("\n").map((l) => "  " + l).join("\n");
  return `import * as React from "react";

export function ${name}(props: React.SVGProps<SVGSVGElement>) {
  return (
${indented.replace(/<svg /, '<svg {...props} ')}
  );
}`;
}

export default function SvgToReact() {
  const [svg, setSvg] = useUrlState("svg", SAMPLE);
  const [name, setName] = useState("Icon");
  const code = useMemo(() => transform(svg, name || "Icon"), [svg, name]);

  return (
    <ToolShell title="SVG → React Component" description="Convert an SVG into a typed React component with camelCase props." category={categoryMap.programming} shareable>
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-[1fr_180px]">
        <div>
          <Label className="text-xs">SVG markup</Label>
          <Textarea value={svg} onChange={(e) => setSvg(e.target.value)} className="min-h-[260px] font-mono text-xs" spellCheck={false} />
        </div>
        <div>
          <Label className="text-xs">Component name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9]/g, "") || "Icon")} />
        </div>
      </Card>
      <Card className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <Label>React component</Label>
          <CopyButton value={code} />
        </div>
        <pre className="min-h-[240px] overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">{code}</pre>
      </Card>
    </ToolShell>
  );
}
