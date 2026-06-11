import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function ReadmeTemplate() {
  const [name, setName] = useUrlState("n", "My Project");
  const [tagline, setTagline] = useUrlState("t", "A short, punchy description of what it does.");
  const [install, setInstall] = useUrlState("i", "npm install my-project");
  const [usage, setUsage] = useUrlState("u", `import { thing } from "my-project";\n\nthing();`);
  const [license, setLicense] = useUrlState("l", "MIT");
  const [include, setInclude] = useState({ badges: true, toc: true, features: true, contributing: true, license: true });

  const md = useMemo(() => {
    const lines: string[] = [];
    lines.push(`# ${name}`);
    if (include.badges) lines.push(`\n![License](https://img.shields.io/badge/license-${license}-blue) ![Status](https://img.shields.io/badge/status-active-brightgreen)`);
    lines.push(`\n> ${tagline}`);
    if (include.toc) {
      lines.push(`\n## Table of contents`, ``, `- [Features](#features)`, `- [Install](#install)`, `- [Usage](#usage)`, include.contributing ? `- [Contributing](#contributing)` : "", include.license ? `- [License](#license)` : "");
    }
    if (include.features) lines.push(`\n## Features`, ``, `- ✨ Feature one`, `- ⚡ Feature two`, `- 🔒 Feature three`);
    lines.push(`\n## Install`, ``, "```bash", install, "```");
    lines.push(`\n## Usage`, ``, "```ts", usage, "```");
    if (include.contributing) lines.push(`\n## Contributing`, ``, `Pull requests welcome. For major changes, please open an issue first to discuss.`);
    if (include.license) lines.push(`\n## License`, ``, `[${license}](LICENSE)`);
    return lines.filter((l) => l !== "").join("\n").replace(/\n{3,}/g, "\n\n");
  }, [name, tagline, install, usage, license, include]);

  return (
    <ToolShell title="README Generator" description="Scaffold a polished GitHub README in seconds." category={categoryMap.programming} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div><Label>Project name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div><Label>License</Label><Input value={license} onChange={(e) => setLicense(e.target.value)} /></div>
        <div className="sm:col-span-2"><Label>Tagline</Label><Input value={tagline} onChange={(e) => setTagline(e.target.value)} /></div>
        <div><Label>Install command</Label><Input value={install} onChange={(e) => setInstall(e.target.value)} className="font-mono" /></div>
        <div className="sm:col-span-2"><Label>Usage snippet</Label><Textarea value={usage} onChange={(e) => setUsage(e.target.value)} rows={4} className="font-mono" spellCheck={false} /></div>
        <div className="sm:col-span-2 flex flex-wrap gap-3 text-sm">
          {(["badges", "toc", "features", "contributing", "license"] as const).map((k) => (
            <label key={k} className="flex items-center gap-2">
              <input type="checkbox" checked={include[k]} onChange={(e) => setInclude({ ...include, [k]: e.target.checked })} />
              {k}
            </label>
          ))}
        </div>
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>README.md</Label><CopyButton value={md} /></div>
        <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{md}</pre>
      </Card>
    </ToolShell>
  );
}
