import { useState } from "react";
import { BookOpen, Check, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type Example = {
  label: string;
  description?: string;
  value: string;
};

type Props = {
  examples: Example[];
  onSelect: (value: string) => void;
  triggerLabel?: string;
};

/**
 * Dropdown of curated sample inputs for a tool. Click → loads into the
 * tool's primary input. Pattern copied from it-tools / codebeautify.
 */
export function ToolExamples({ examples, onSelect, triggerLabel = "Examples" }: Props) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <BookOpen className="mr-2 h-3.5 w-3.5" />
        {triggerLabel}
        <ChevronDown className="ml-1 h-3 w-3 opacity-60" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl p-0">
          <div className="border-b p-4">
            <DialogTitle className="text-base">Load an example</DialogTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Pick a sample input to try this tool quickly.
            </p>
          </div>
          <ul className="max-h-96 overflow-y-auto p-2">
            {examples.map((ex) => (
              <li key={ex.label}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(ex.value);
                    setPicked(ex.label);
                    setTimeout(() => setOpen(false), 200);
                  }}
                  className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-accent"
                >
                  <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                    {picked === ex.label ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <BookOpen className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{ex.label}</div>
                    {ex.description && (
                      <div className="text-xs text-muted-foreground">
                        {ex.description}
                      </div>
                    )}
                    <code className="mt-1 block truncate font-mono text-[11px] text-muted-foreground">
                      {ex.value.slice(0, 80)}
                      {ex.value.length > 80 ? "…" : ""}
                    </code>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
}
