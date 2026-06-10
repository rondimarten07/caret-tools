import { Star, Inbox } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecent } from "@/hooks/useRecent";
import { toolsBySlug } from "@/data/tools";
import { ToolCard } from "@/components/tool/ToolCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function FavoritesPage() {
  const { list: favIds } = useFavorites();
  const { list: recentIds, clear } = useRecent();
  const favs = favIds.map((s) => toolsBySlug[s]).filter(Boolean);
  const recent = recentIds.map((s) => toolsBySlug[s]).filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-4 md:px-8 md:pb-12 md:pt-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-100 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:ring-amber-900/60">
          <Star className="h-6 w-6 fill-amber-400 text-amber-500" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Saved</h1>
          <p className="text-sm text-muted-foreground">
            Favorite tools and recently used ones — all kept in your browser.
          </p>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Favorites
        </h2>
        {favs.length === 0 ? (
          <EmptyState
            title="No favorites yet"
            message="Hover any tool card and click the star icon to pin it here."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {favs.map((t) => <ToolCard key={t.slug} tool={t} />)}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Recently used
          </h2>
          {recent.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clear}>Clear</Button>
          )}
        </div>
        {recent.length === 0 ? (
          <EmptyState
            title="No history yet"
            message="Tools you open will show up here for quick access."
          />
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {recent.map((t) => <ToolCard key={t.slug} tool={t} compact />)}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-2xl border border-dashed p-8 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent">
        <Inbox className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="mt-3 font-medium">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      <Button asChild variant="outline" size="sm" className="mt-4">
        <Link to="/">Browse tools</Link>
      </Button>
    </div>
  );
}
