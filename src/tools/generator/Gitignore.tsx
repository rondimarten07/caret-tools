import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const TEMPLATES: Record<string, string> = {
  Node: `# Node\nnode_modules/\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\npnpm-debug.log*\n.npm\n.yarn-integrity\n.pnp\n.pnp.js\n`,
  Python: `# Python\n__pycache__/\n*.py[cod]\n*$py.class\n*.so\n.Python\nbuild/\ndevelop-eggs/\ndist/\ndownloads/\neggs/\n.eggs/\nlib/\nlib64/\nparts/\nsdist/\nvar/\nwheels/\n*.egg-info/\n.installed.cfg\n*.egg\n.venv\nvenv/\nENV/\n`,
  Go: `# Go\n*.exe\n*.exe~\n*.dll\n*.so\n*.dylib\n*.test\n*.out\nvendor/\ngo.work\n`,
  Rust: `# Rust\ntarget/\nCargo.lock\n**/*.rs.bk\n*.pdb\n`,
  Java: `# Java\n*.class\n*.log\n*.ctxt\n.mtj.tmp/\n*.jar\n*.war\n*.nar\n*.ear\n*.zip\n*.tar.gz\n*.rar\nhs_err_pid*\n.gradle/\nbuild/\ntarget/\n`,
  React: `# React / Vite\nnode_modules/\ndist/\nbuild/\n.vite/\n*.local\n.env.local\n.env.development.local\n.env.production.local\n`,
  Next: `# Next.js\n.next/\nout/\nbuild/\nnext-env.d.ts\n*.tsbuildinfo\n.vercel\n`,
  macOS: `# macOS\n.DS_Store\n.AppleDouble\n.LSOverride\nIcon\r\n._*\n.Spotlight-V100\n.Trashes\n`,
  Windows: `# Windows\nThumbs.db\nehthumbs.db\nDesktop.ini\n$RECYCLE.BIN/\n*.lnk\n`,
  Linux: `# Linux\n*~\n.fuse_hidden*\n.directory\n.Trash-*\n`,
  VSCode: `# VS Code\n.vscode/*\n!.vscode/settings.json\n!.vscode/extensions.json\n!.vscode/launch.json\n`,
  JetBrains: `# JetBrains\n.idea/\n*.iml\n*.iws\n*.ipr\nout/\n`,
  Env: `# Env / secrets\n.env\n.env.local\n.env.*.local\n*.pem\n*.key\n`,
};

export default function Gitignore() {
  const [picked, setPicked] = useState<string[]>(["Node", "React", "macOS", "VSCode", "Env"]);

  const out = useMemo(() => picked.map((k) => TEMPLATES[k]).join("\n"), [picked]);

  function toggle(k: string) {
    setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));
  }

  return (
    <ToolShell title=".gitignore Builder" description="Stitch together gitignore templates by stack and OS." category={categoryMap.generator}>
      <Card className="p-3">
        <div className="flex flex-wrap gap-2">
          {Object.keys(TEMPLATES).map((k) => (
            <button key={k} onClick={() => toggle(k)} className={`rounded-md border px-3 py-1.5 text-sm ${picked.includes(k) ? "bg-primary text-primary-foreground" : "bg-card"}`}>{k}</button>
          ))}
        </div>
      </Card>
      <Card className="p-4">
        <div className="mb-2 flex justify-end"><CopyButton value={out} /></div>
        <pre className="overflow-auto whitespace-pre-wrap text-sm font-mono">{out || "Select one or more templates above."}</pre>
      </Card>
    </ToolShell>
  );
}
