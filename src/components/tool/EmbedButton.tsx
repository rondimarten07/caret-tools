import { useState } from "react";
import { Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { CopyButton } from "./CopyButton";
import { brand } from "@/brand";

type Props = {
  slug: string;
  toolName: string;
};

export function EmbedButton({ slug, toolName }: Props) {
  const [open, setOpen] = useState(false);

  const site = brand.domain.startsWith("http") ? brand.domain : `https://${brand.domain}`;
  const embedUrl = `${site}/tool/${slug}?embed=1`;

  const iframe = `<iframe
  src="${embedUrl}"
  title="${toolName} — Caret"
  width="100%"
  height="640"
  style="border: 1px solid #e4e4e7; border-radius: 12px;"
  loading="lazy"
></iframe>`;

  const markdown = `[Open ${toolName} on Caret](${site}/tool/${slug})`;

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Code2 className="mr-2 h-3.5 w-3.5" />
        Embed
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg p-0">
          <div className="border-b p-4">
            <DialogTitle className="text-base">Embed this tool</DialogTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Drop this snippet into any HTML page or Markdown post.
            </p>
          </div>
          <div className="space-y-4 p-4">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground">iframe</span>
                <CopyButton value={iframe} label="iframe copied" />
              </div>
              <pre className="overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">{iframe}</pre>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Markdown link</span>
                <CopyButton value={markdown} label="Markdown copied" />
              </div>
              <pre className="overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">{markdown}</pre>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Direct URL</span>
                <CopyButton value={`${site}/tool/${slug}`} label="URL copied" />
              </div>
              <pre className="overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">
                {`${site}/tool/${slug}`}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
