import { useState } from "react";
import { History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type Props<T> = {
  entries: T[];
  onRestore: (entry: T) => void;
  onClear: () => void;
  /** Render each entry as a short preview line */
  preview?: (entry: T) => string;
};

/**
 * "History" button — opens a dialog showing recent inputs.
 * Click an entry to restore it into the tool.
 * Used alongside `useToolHistory()`.
 */
export function HistoryPanel<T>({ entries, onRestore, onClear, preview }: Props<T>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        disabled={entries.length === 0}
      >
        <History className="mr-2 h-3.5 w-3.5" />
        History
        {entries.length > 0 && (
          <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 font-mono text-[10px]">
            {entries.length}
          </span>
        )}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl p-0">
          <div className="flex items-center justify-between border-b p-4">
            <DialogTitle className="text-base">Recent inputs</DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => { onClear(); setOpen(false); }}>
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
          <ul className="max-h-96 overflow-y-auto p-2">
            {entries.map((entry, i) => {
              const text =
                preview ? preview(entry) :
                typeof entry === "string" ? entry :
                JSON.stringify(entry);
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => {
                      onRestore(entry);
                      setOpen(false);
                    }}
                    className="block w-full rounded-lg p-3 text-left hover:bg-accent"
                  >
                    <code className="line-clamp-3 font-mono text-xs text-muted-foreground">
                      {text || "(empty)"}
                    </code>
                  </button>
                </li>
              );
            })}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
}
