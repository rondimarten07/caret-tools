import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const ROLES: { role: string; category: string; use: string }[] = [
  { role: "banner", category: "landmark", use: "Top-level site header. Use the <header> element when child of <body>." },
  { role: "navigation", category: "landmark", use: "Primary nav. Prefer <nav>; add aria-label if multiple navs exist." },
  { role: "main", category: "landmark", use: "Primary content. Use the <main> element (only one per page)." },
  { role: "complementary", category: "landmark", use: "Side content. Use <aside>." },
  { role: "contentinfo", category: "landmark", use: "Site footer / copyright. Use <footer> when child of <body>." },
  { role: "search", category: "landmark", use: "Search region. <form role=\"search\">." },
  { role: "region", category: "landmark", use: "Generic landmark — must have an accessible name (aria-label / aria-labelledby)." },
  { role: "button", category: "widget", use: "Activatable control. Prefer <button>." },
  { role: "link", category: "widget", use: "Navigates somewhere. Prefer <a href>." },
  { role: "checkbox", category: "widget", use: "Two- or tri-state. Set aria-checked." },
  { role: "radio / radiogroup", category: "widget", use: "Mutually exclusive choice. Wrap radios in a radiogroup." },
  { role: "switch", category: "widget", use: "On/off toggle. Set aria-checked." },
  { role: "tab / tablist / tabpanel", category: "widget", use: "Tabbed interface. Each tab controls a tabpanel via aria-controls." },
  { role: "menu / menuitem", category: "widget", use: "Application-style menu (not site nav). Keyboard-focusable with arrow keys." },
  { role: "dialog", category: "widget", use: "Modal popup. Trap focus; restore focus on close. aria-modal=\"true\"." },
  { role: "alertdialog", category: "widget", use: "Modal that interrupts for an alert. Adds an alert semantic." },
  { role: "alert", category: "live", use: "Important time-sensitive message; assertive announce." },
  { role: "status", category: "live", use: "Polite advisory update — not interrupting." },
  { role: "progressbar", category: "widget", use: "Set aria-valuenow / aria-valuemin / aria-valuemax." },
  { role: "tooltip", category: "widget", use: "Contextual hint. Tied to its target via aria-describedby." },
  { role: "listbox / option", category: "widget", use: "Static select list. Single or multi-select." },
  { role: "combobox", category: "widget", use: "Combined input + listbox. Has aria-expanded, aria-controls." },
  { role: "tree / treeitem", category: "widget", use: "Hierarchical list. Use aria-expanded for branches." },
  { role: "table / row / cell", category: "table", use: "Tabular data. Prefer native <table>." },
  { role: "presentation / none", category: "doc", use: "Strips semantics from the element — for purely decorative wrappers." },
];

export default function AriaRoles() {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return ROLES;
    return ROLES.filter((r) => r.role.toLowerCase().includes(s) || r.use.toLowerCase().includes(s) || r.category.includes(s));
  }, [q]);

  return (
    <ToolShell title="ARIA Roles" description="Common ARIA roles and landmarks — when to use which." category={categoryMap.programming}>
      <Card className="p-3">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by role or description..." />
      </Card>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Role</th>
              <th className="p-3">Category</th>
              <th className="p-3">When to use</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.role} className="border-b last:border-0">
                <td className="p-3 font-mono">{r.role}</td>
                <td className="p-3 text-xs"><span className="rounded-md bg-primary/10 px-2 py-1 text-primary">{r.category}</span></td>
                <td className="p-3 text-muted-foreground">{r.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        First rule of ARIA: don't use ARIA when a native element will do. <code className="font-mono">&lt;button&gt;</code> beats <code className="font-mono">&lt;div role="button"&gt;</code>.
      </div>
    </ToolShell>
  );
}
