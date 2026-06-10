import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { tools } from "@/data/tools";
import { categoryMap } from "@/data/categories";

type Props = { open: boolean; onOpenChange: (o: boolean) => void };

export function CommandPalette({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(tools, {
        keys: ["name", "description", "keywords", "category"],
        threshold: 0.35,
      }),
    []
  );

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = query ? fuse.search(query).map((r) => r.item) : tools;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search tools by name, keyword or category…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No tools found.</CommandEmpty>
        <CommandGroup heading={query ? "Results" : "All tools"}>
          {results.slice(0, 20).map((t) => {
            const cat = categoryMap[t.category];
            const Icon = t.icon;
            return (
              <CommandItem
                key={t.slug}
                value={`${t.name} ${t.keywords.join(" ")}`}
                onSelect={() => {
                  navigate(`/tool/${t.slug}`);
                  onOpenChange(false);
                }}
              >
                <Icon className={`h-4 w-4 ${cat.accent}`} />
                <span>{t.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {cat.name}
                </span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
