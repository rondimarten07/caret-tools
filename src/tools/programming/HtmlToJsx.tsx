import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const RENAME: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  readonly: "readOnly",
  maxlength: "maxLength",
  minlength: "minLength",
  autocomplete: "autoComplete",
  autofocus: "autoFocus",
  spellcheck: "spellCheck",
  contenteditable: "contentEditable",
  enctype: "encType",
  crossorigin: "crossOrigin",
  srcset: "srcSet",
  srclang: "srcLang",
  longdesc: "longDesc",
  usemap: "useMap",
  novalidate: "noValidate",
  formaction: "formAction",
  formenctype: "formEncType",
  formmethod: "formMethod",
  formnovalidate: "formNoValidate",
  formtarget: "formTarget",
  accesskey: "accessKey",
  allowfullscreen: "allowFullScreen",
};

function kebabToCamel(prop: string): string {
  return prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function styleToObject(style: string): string {
  const decls = style.split(";").map((s) => s.trim()).filter(Boolean);
  const entries = decls.map((d) => {
    const idx = d.indexOf(":");
    if (idx < 0) return null;
    const key = d.slice(0, idx).trim();
    const val = d.slice(idx + 1).trim();
    const cssVar = key.startsWith("--");
    const k = cssVar ? `"${key}"` : kebabToCamel(key);
    return `${k}: ${/^[\d.-]+$/.test(val) ? val : `"${val.replace(/"/g, '\\"')}"`}`;
  }).filter(Boolean);
  return `{{ ${entries.join(", ")} }}`;
}

function convert(html: string): string {
  let out = html;
  // Replace attributes (case-insensitive) using regex on attribute boundary.
  out = out.replace(/\s([a-zA-Z-]+)=("([^"]*)"|'([^']*)')/g, (_m, name, _full, dq, sq) => {
    const v = dq !== undefined ? dq : sq;
    const lower = name.toLowerCase();
    if (lower === "style") return ` style=${styleToObject(v)}`;
    const renamed = RENAME[lower] || (lower.startsWith("data-") || lower.startsWith("aria-") ? lower : kebabToCamel(lower));
    return ` ${renamed}="${v}"`;
  });
  // HTML comments → JSX comments
  out = out.replace(/<!--([\s\S]*?)-->/g, "{/*$1*/}");
  // Self-close void elements
  out = out.replace(/<(br|hr|img|input|meta|link|source|area|base|col|embed|param|track|wbr)([^>]*?)>/gi, "<$1$2 />");
  return out;
}

export default function HtmlToJsx() {
  const [html, setHtml] = useUrlState("h", `<div class="card" style="padding: 16px; color: rebeccapurple;">\n  <label for="email">Email</label>\n  <input type="email" autocomplete="email" maxlength="100" />\n  <!-- a comment -->\n  <br>\n</div>`);

  const jsx = useMemo(() => convert(html), [html]);

  return (
    <ToolShell title="HTML → JSX" description="Renames attributes, parses inline style to object, self-closes void tags." category={categoryMap.programming} shareable>
      <Card className="space-y-3 p-4">
        <Label>HTML</Label>
        <Textarea value={html} onChange={(e) => setHtml(e.target.value)} rows={10} className="font-mono" spellCheck={false} />
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>JSX</Label><CopyButton value={jsx} /></div>
        <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{jsx}</pre>
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Doesn't try to parse full HTML — handles the common renames (class→className, for→htmlFor, kebab→camelCase), self-closing void tags, comments and inline style to object. Review the output for edge cases.
      </div>
    </ToolShell>
  );
}
