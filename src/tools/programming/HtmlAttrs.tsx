import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const ATTRS: { attr: string; on: string; what: string }[] = [
  { attr: "id", on: "global", what: "Unique element identifier — must be unique in the document." },
  { attr: "class", on: "global", what: "Space-separated CSS class names." },
  { attr: "style", on: "global", what: "Inline CSS. Prefer external/component CSS." },
  { attr: "title", on: "global", what: "Browser tooltip on hover. Not accessible — pair with aria-* for screen readers." },
  { attr: "lang", on: "global", what: "Language of the element's content (BCP 47, e.g. en, id)." },
  { attr: "dir", on: "global", what: "Text direction: ltr / rtl / auto." },
  { attr: "tabindex", on: "global", what: "0 = focusable, -1 = focusable via JS, positive = explicit order (avoid)." },
  { attr: "hidden", on: "global", what: "Removes the element from the page (semantically and visually)." },
  { attr: "contenteditable", on: "global", what: "Makes a region editable. Pair with aria-multiline for textareas." },
  { attr: "draggable", on: "global", what: "true / false — enables HTML5 drag-and-drop." },
  { attr: "data-*", on: "global", what: "Custom data attributes — read in JS via element.dataset." },
  { attr: "href", on: "<a>, <link>", what: "URL. Use rel=noopener with target=_blank for security." },
  { attr: "target", on: "<a>, <form>", what: "Where to open the link: _self (default), _blank, _parent, _top." },
  { attr: "rel", on: "<a>, <link>", what: "Link relationship: noopener, noreferrer, nofollow, stylesheet, preload, ..." },
  { attr: "src / alt", on: "<img>, <video>, ...", what: "Source URL and alt text. alt=\"\" for decorative; descriptive text otherwise." },
  { attr: "loading", on: "<img>, <iframe>", what: "lazy / eager — defer offscreen resources." },
  { attr: "type", on: "<input>", what: "Controls UI: text, email, number, date, file, checkbox, ... — pick the most specific." },
  { attr: "required / disabled / readonly", on: "<input>, <select>, <textarea>", what: "Form field state." },
  { attr: "autocomplete", on: "<input>", what: "Hints the browser/password manager: email, current-password, new-password, off, ..." },
  { attr: "inputmode", on: "<input>", what: "Mobile keyboard hint: numeric, decimal, tel, email, url, search." },
  { attr: "pattern", on: "<input>", what: "Regex validation — pair with title for the error message." },
  { attr: "form / formaction / formmethod", on: "<input type=submit>", what: "Override the parent <form>'s action/method per button." },
  { attr: "name", on: "form fields", what: "Submitted as the URL parameter or form-data key." },
  { attr: "value", on: "form fields", what: "Current/initial value of the field." },
  { attr: "placeholder", on: "<input>, <textarea>", what: "Faded hint text — never use it as a label." },
];

export default function HtmlAttrs() {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return ATTRS;
    return ATTRS.filter((a) => a.attr.toLowerCase().includes(s) || a.what.toLowerCase().includes(s));
  }, [q]);

  return (
    <ToolShell title="HTML Attributes Reference" description="Global & form attributes — what each one does." category={categoryMap.programming}>
      <Card className="p-3">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search attribute or description..." />
      </Card>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Attribute</th>
              <th className="p-3">Applies to</th>
              <th className="p-3">What it does</th>
            </tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.attr} className="border-b last:border-0">
                <td className="p-3 font-mono">{a.attr}</td>
                <td className="p-3 text-xs text-muted-foreground">{a.on}</td>
                <td className="p-3">{a.what}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </ToolShell>
  );
}
