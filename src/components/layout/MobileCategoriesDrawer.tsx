import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { categories } from "@/data/categories";
import { toolsByCategory } from "@/data/tools";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileCategoriesDrawer({ open, onOpenChange }: Props) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bottom-0 left-0 top-auto h-[70vh] max-w-full translate-x-0 translate-y-0 rounded-b-none rounded-t-2xl border-b-0 p-0 data-[state=open]:slide-in-from-bottom sm:max-w-full">
        <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-muted" />
        <DialogTitle className="px-5 pt-2 text-base">Browse categories</DialogTitle>
        <div className="grid grid-cols-2 gap-2 overflow-y-auto p-4">
          {categories.map((c) => {
            const Icon = c.icon;
            const count = toolsByCategory(c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => {
                  navigate(`/category/${c.id}`);
                  onOpenChange(false);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-left ring-1 transition-transform active:scale-95",
                  c.surface
                )}
              >
                <div className={cn("grid h-10 w-10 place-items-center rounded-lg bg-background/60")}>
                  <Icon className={cn("h-5 w-5", c.accent)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{count} tools</div>
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
