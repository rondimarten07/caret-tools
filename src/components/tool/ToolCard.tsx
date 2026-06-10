import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Tool } from "@/data/tools";
import { categoryMap } from "@/data/categories";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";

export function ToolCard({ tool, compact = false }: { tool: Tool; compact?: boolean }) {
  const cat = categoryMap[tool.category];
  const Icon = tool.icon;
  const { has, toggle } = useFavorites();
  const favored = has(tool.slug);

  return (
    <Link
      to={`/tool/${tool.slug}`}
      className={cn(
        "card-hover-ring group relative flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm",
        compact && "p-3"
      )}
    >
      <div
        className={cn(
          "grid shrink-0 place-items-center rounded-lg ring-1",
          compact ? "h-9 w-9" : "h-10 w-10",
          cat.surface
        )}
      >
        <Icon className={cn(compact ? "h-4 w-4" : "h-5 w-5", cat.accent)} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className={cn("truncate font-medium leading-tight", compact && "text-sm")}>
          {tool.name}
        </h3>
        <p
          className={cn(
            "mt-1 line-clamp-2 text-sm text-muted-foreground",
            compact && "text-xs"
          )}
        >
          {tool.description}
        </p>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle(tool.slug);
        }}
        aria-label={favored ? "Remove from favorites" : "Add to favorites"}
        className={cn(
          "absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-md opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100",
          favored && "opacity-100"
        )}
      >
        <Star
          className={cn(
            "h-3.5 w-3.5",
            favored ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
          )}
        />
      </button>
    </Link>
  );
}
