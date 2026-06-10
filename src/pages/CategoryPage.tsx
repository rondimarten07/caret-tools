import { useParams, Link } from "react-router-dom";
import { categoryMap, type CategoryId } from "@/data/categories";
import { toolsByCategory } from "@/data/tools";
import { ToolCard } from "@/components/tool/ToolCard";
import { cn } from "@/lib/utils";

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const category = id ? categoryMap[id as CategoryId] : undefined;

  if (!category) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <h1 className="text-2xl font-semibold">Category not found</h1>
        <Link to="/" className="mt-3 inline-block text-sm text-primary underline">
          ← Back home
        </Link>
      </div>
    );
  }

  const list = toolsByCategory(category.id);
  const Icon = category.icon;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-4 md:px-8 md:pb-12 md:pt-8">
      <div className="mb-6 flex items-start gap-4">
        <div
          className={cn(
            "grid h-12 w-12 place-items-center rounded-xl ring-1",
            category.surface
          )}
        >
          <Icon className={cn("h-6 w-6", category.accent)} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {category.name}
          </h1>
          <p className="text-sm text-muted-foreground">{category.description}</p>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No tools in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {list.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      )}
    </div>
  );
}
