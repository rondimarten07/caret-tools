import { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const TEMPLATES: Record<string, string> = {
  "Node (test + build)": `name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test --if-present
      - run: npm run build --if-present
`,
  "Python (pytest)": `name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.11", "3.12"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: \${{ matrix.python-version }}
          cache: pip
      - run: pip install -r requirements.txt
      - run: pytest
`,
  "Go (test)": `name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: stable
      - run: go test ./...
      - run: go vet ./...
`,
  "Vercel deploy (Vite)": `name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
`,
  "Release on tag": `name: Release

on:
  push:
    tags: ["v*.*.*"]

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: softprops/action-gh-release@v2
        with:
          generate_release_notes: true
`,
};

export default function GithubAction() {
  const [pick, setPick] = useState<keyof typeof TEMPLATES>("Node (test + build)");

  return (
    <ToolShell title="GitHub Action Workflow" description="Common CI workflows — pick a template, drop into `.github/workflows/`." category={categoryMap.generator}>
      <Card className="flex flex-wrap gap-2 p-3">
        {Object.keys(TEMPLATES).map((k) => (
          <button key={k} onClick={() => setPick(k)} className={`rounded-md border px-3 py-1.5 text-sm ${pick === k ? "bg-primary text-primary-foreground" : "bg-card"}`}>{k}</button>
        ))}
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex justify-end"><CopyButton value={TEMPLATES[pick]} /></div>
        <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{TEMPLATES[pick]}</pre>
      </Card>
    </ToolShell>
  );
}
